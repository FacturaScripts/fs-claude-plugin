#!/usr/bin/env python3
"""
Ordena los miembros de una clase PHP según las convenciones de FacturaScripts.

Orden dentro de la clase:
  1. use (traits)            - A-Z
  2. const                   - A-Z
  3. variables public        - A-Z
  4. variables protected/private (agrupadas) - A-Z
  5. métodos public          - A-Z
  6. métodos protected/private (agrupados)   - A-Z

Solo actúa sobre archivos con 'namespace FacturaScripts\\' para garantizar
que el archivo pertenece al core o a un plugin del ERP.

Uso: sort-class-members.py <file_path>
"""
import re
import sys
from typing import Dict, List, Optional, Tuple

# Grupos de ordenación en el orden final deseado
GROUPS = [
    'trait',
    'const',
    'public_prop',
    'prot_priv_prop',
    'public_method',
    'prot_priv_method',
    'unknown',
]


# ── Escáneres de bajo nivel ───────────────────────────────────────────────────

def scan_string(content: str, pos: int, quote: str) -> int:
    """Avanza hasta el final de un string entre comillas simples o dobles."""
    pos += 1  # saltar la comilla de apertura
    n = len(content)
    while pos < n:
        c = content[pos]
        if c == '\\':
            pos += 2
            continue
        if c == quote:
            return pos + 1
        pos += 1
    return pos


def scan_block_comment(content: str, pos: int) -> int:
    """Avanza hasta el final de un comentario de bloque /* ... */."""
    end = content.find('*/', pos + 2)
    return (end + 2) if end != -1 else len(content)


def scan_heredoc(content: str, pos: int) -> int:
    """Avanza hasta el final de un heredoc/nowdoc."""
    pos += 3  # saltar <<<
    n = len(content)
    nowdoc = pos < n and content[pos] == "'"
    if nowdoc:
        pos += 1
    m = re.match(r'(\w+)', content[pos:])
    if not m:
        return pos
    label = m.group(1)
    pos += len(label)
    if nowdoc and pos < n and content[pos] == "'":
        pos += 1
    # Buscar la etiqueta de cierre en su propia línea
    pattern = re.compile(r'^\s*' + re.escape(label) + r'\s*;?\s*$', re.MULTILINE)
    closing = pattern.search(content, pos)
    return closing.end() if closing else n


# ── Buscar el final de un miembro ─────────────────────────────────────────────

def find_member_end(content: str, start: int) -> int:
    """
    Desde 'start', avanza hasta el final del miembro:
    - ';'  al nivel de profundidad 0  (propiedad, constante, use de trait)
    - '}'  que lleva la profundidad a 0 (cuerpo de método)

    Maneja correctamente strings, comentarios y anidamiento de llaves.
    """
    pos = start
    depth = 0
    n = len(content)

    while pos < n:
        c = content[pos]

        # Comentario de línea
        if content[pos:pos + 2] == '//':
            end = content.find('\n', pos)
            pos = (end + 1) if end != -1 else n
            continue

        # Comentario de bloque
        if content[pos:pos + 2] == '/*':
            pos = scan_block_comment(content, pos)
            continue

        # String comilla simple o doble
        if c in ("'", '"'):
            pos = scan_string(content, pos, c)
            continue

        # Heredoc / Nowdoc
        if content[pos:pos + 3] == '<<<':
            pos = scan_heredoc(content, pos)
            continue

        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth < 0:
                # Llegamos al cierre de la clase (no debería ocurrir con body correcto)
                return pos
            if depth == 0:
                return pos + 1  # fin del cuerpo del método
        elif c == ';' and depth == 0:
            return pos + 1  # fin de sentencia simple

        pos += 1

    return pos


# ── Saltar líneas en blanco ────────────────────────────────────────────────────

def skip_blank_lines(content: str, pos: int) -> int:
    """Avanza sobre líneas que contienen únicamente espacios/tabulaciones."""
    n = len(content)
    while pos < n:
        line_start = pos
        while pos < n and content[pos] in ' \t':
            pos += 1
        if pos < n and content[pos] == '\n':
            pos += 1  # línea en blanco → continuar
        elif pos < n and content[pos] == '\r':
            pos += 1
            if pos < n and content[pos] == '\n':
                pos += 1
        else:
            return line_start  # línea con contenido → volver al inicio de la línea
    return pos


# ── Saltar docblock / atributos que preceden al miembro ───────────────────────

def skip_pre_member(content: str, pos: int) -> int:
    """
    Avanza sobre docblocks (/** */), comentarios de bloque (/* */),
    comentarios de línea (//) y atributos PHP 8 (#[...]) que preceden
    a la declaración real del miembro.

    Devuelve la posición donde empieza la declaración.
    """
    n = len(content)
    while pos < n:
        # Saltar espacios/tabs de la línea actual
        while pos < n and content[pos] in ' \t':
            pos += 1

        if pos >= n:
            break

        # Comentario de bloque / docblock
        if content[pos:pos + 2] == '/*':
            pos = scan_block_comment(content, pos)
            while pos < n and content[pos] in ' \t':
                pos += 1
            if pos < n and content[pos] in '\n\r':
                pos += 1
                if content[pos - 1] == '\r' and pos < n and content[pos] == '\n':
                    pos += 1
            continue

        # Comentario de línea
        if content[pos:pos + 2] == '//':
            end = content.find('\n', pos)
            pos = (end + 1) if end != -1 else n
            continue

        # Atributo PHP 8 (#[...])
        if content[pos:pos + 2] == '#[':
            depth = 0
            pos += 1
            while pos < n:
                if content[pos] == '[':
                    depth += 1
                elif content[pos] == ']':
                    depth -= 1
                    if depth == 0:
                        pos += 1
                        break
                pos += 1
            while pos < n and content[pos] in ' \t':
                pos += 1
            if pos < n and content[pos] in '\n\r':
                pos += 1
                if content[pos - 1] == '\r' and pos < n and content[pos] == '\n':
                    pos += 1
            continue

        # Inicio de la declaración real
        break

    return pos


# ── Clasificación del miembro ─────────────────────────────────────────────────

def classify_member(code: str) -> Tuple[str, str]:
    """
    Clasifica un fragmento de código PHP como miembro de clase y devuelve
    (kind, nombre_para_ordenar).

    Kinds devueltos: trait | const | public_prop | prot_priv_prop |
                     public_method | prot_priv_method | unknown
    """
    s = code.strip()

    # Trait use: use TraitA; | use TraitA, TraitB; | use TraitA { ... };
    m = re.match(r'^use\s+([\w\\,\s]+?)(?:\s*\{[^}]*\})?\s*;', s, re.DOTALL)
    if m:
        # Nombre del primer trait (último segmento del namespace)
        first = re.findall(r'[\w\\]+', m.group(1))
        name = (first[0].split('\\')[-1]) if first else s[:30]
        return 'trait', name.lower()

    # Constante: (public)? const NOMBRE
    m = re.match(r'^(?:public\s+)?const\s+(\w+)', s)
    if m:
        return 'const', m.group(1).lower()

    # Método: visibilidades* function nombre(
    m = re.match(
        r'^((?:(?:public|protected|private|abstract|static|final|readonly)\s+)+)'
        r'function\s+(\w+)\s*\(',
        s
    )
    if m:
        name = m.group(2)
        vis = m.group(1).lower()
        if 'protected' in vis or 'private' in vis:
            return 'prot_priv_method', name.lower()
        return 'public_method', name.lower()

    # Método sin visibilidad explícita (interfaces/traits)
    m = re.match(r'^function\s+(\w+)\s*\(', s)
    if m:
        return 'public_method', m.group(1).lower()

    # Propiedad: visibilidades* (tipo)? $nombre
    m = re.match(
        r'^((?:(?:public|protected|private|abstract|static|final|readonly)\s+)+)'
        r'(?:[\w\\|&?]+\s+)?\$(\w+)',
        s
    )
    if m:
        name = m.group(2)
        vis = m.group(1).lower()
        if 'protected' in vis or 'private' in vis:
            return 'prot_priv_prop', name.lower()
        return 'public_prop', name.lower()

    return 'unknown', s[:50].lower()


# ── Extracción de miembros del cuerpo de la clase ────────────────────────────

def extract_members(class_body: str) -> List[Dict]:
    """
    Parsea el texto interior de la clase (sin las llaves externas) y devuelve
    una lista de dicts con:
        text  - texto completo del miembro (docblock + código, con indentación)
        kind  - grupo al que pertenece
        name  - nombre en minúsculas para ordenar
    """
    members = []
    pos = 0
    n = len(class_body)

    while pos < n:
        # Saltar líneas en blanco entre miembros
        pos = skip_blank_lines(class_body, pos)

        if pos >= n:
            break

        # Seguridad: si encontramos un '}' suelto (cierre de clase), parar
        probe = class_body[pos:].lstrip()
        if not probe or probe[0] == '}':
            break

        # El miembro comienza aquí (incluyendo su indentación y docblock)
        member_start = pos

        # Avanzar sobre docblock/atributos para encontrar la declaración real
        classify_pos = skip_pre_member(class_body, pos)

        if classify_pos >= n:
            break

        # Encontrar el final del miembro desde su declaración
        member_end = find_member_end(class_body, classify_pos)

        # Texto completo (docblock + código)
        full_text = class_body[member_start:member_end].rstrip()

        # Código sin decoradores para clasificar
        code_raw = class_body[classify_pos:member_end].strip()

        kind, name = classify_member(code_raw)

        members.append({
            'text': full_text,
            'kind': kind,
            'name': name,
        })

        pos = member_end

    return members


# ── Localizar el cuerpo de la clase en el archivo ─────────────────────────────

def find_class_body(content: str) -> Optional[Tuple[int, int]]:
    """
    Busca la primera declaración de clase/interface/trait en el archivo y
    devuelve (posición_del_{, posición_del_}).
    Devuelve None si no se encuentra ninguna clase.
    """
    pattern = re.compile(
        r'\b(?:abstract\s+|final\s+|readonly\s+)?'
        r'(?:class|interface|trait)\s+\w+\b[^{;]*\{',
        re.DOTALL
    )
    match = pattern.search(content)
    if not match:
        return None

    open_brace = match.end() - 1  # posición del '{'

    pos = match.end()
    depth = 1
    n = len(content)

    while pos < n and depth > 0:
        c = content[pos]

        if content[pos:pos + 2] == '//':
            end = content.find('\n', pos)
            pos = (end + 1) if end != -1 else n
            continue

        if content[pos:pos + 2] == '/*':
            pos = scan_block_comment(content, pos)
            continue

        if c in ("'", '"'):
            pos = scan_string(content, pos, c)
            continue

        if content[pos:pos + 3] == '<<<':
            pos = scan_heredoc(content, pos)
            continue

        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return open_brace, pos

        pos += 1

    return None


# ── Reconstrucción del cuerpo ordenado ───────────────────────────────────────

def reconstruct_body(members: List[Dict]) -> str:
    """
    Agrupa los miembros por tipo, ordena cada grupo A-Z y reconstruye el cuerpo.

    Reglas de formato:
    - Los use de traits van juntos sin línea en blanco entre ellos.
    - El resto de miembros se separan con una línea en blanco entre cada uno.
    - Siempre hay una línea en blanco entre grupos distintos.
    """
    groups: Dict[str, List[Dict]] = {k: [] for k in GROUPS}
    for m in members:
        groups.setdefault(m['kind'], groups['unknown']).append(m)

    # Ordenar cada grupo A-Z
    for kind in GROUPS:
        groups[kind].sort(key=lambda m: m['name'])

    # Construir "bloques": los traits forman un único bloque pegado,
    # cada otro miembro es su propio bloque. Los bloques se separan con \n\n.
    blocks: List[str] = []
    for kind in GROUPS:
        if not groups[kind]:
            continue
        if kind == 'trait':
            # Todos los traits juntos, separados solo por \n (sin línea en blanco)
            blocks.append('\n'.join(m['text'] for m in groups[kind]))
        else:
            for m in groups[kind]:
                blocks.append(m['text'])

    if not blocks:
        return '\n'

    return '\n' + '\n\n'.join(blocks) + '\n'


# ── Punto de entrada ──────────────────────────────────────────────────────────

def process_file(file_path: str) -> None:
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
    except (OSError, IOError) as e:
        print(f"Error leyendo {file_path}: {e}", file=sys.stderr)
        sys.exit(1)

    # Solo actuar sobre archivos de FacturaScripts
    if 'namespace FacturaScripts\\' not in content:
        return

    result = find_class_body(content)
    if result is None:
        return

    open_pos, close_pos = result

    before = content[:open_pos + 1]        # todo hasta el '{' inclusive
    class_body = content[open_pos + 1:close_pos]
    after = content[close_pos:]            # desde el '}' inclusive

    members = extract_members(class_body)
    if not members:
        return

    new_body = reconstruct_body(members)
    new_content = before + new_body + after

    if new_content == content:
        return  # Ya estaba ordenado, sin cambios

    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    except (OSError, IOError) as e:
        print(f"Error escribiendo {file_path}: {e}", file=sys.stderr)
        sys.exit(1)


def main() -> None:
    if len(sys.argv) != 2:
        print(f"Uso: {sys.argv[0]} <file_path>", file=sys.stderr)
        sys.exit(1)
    process_file(sys.argv[1])


if __name__ == '__main__':
    main()
