#!/usr/bin/env python3
"""Ordena los miembros de una clase PHP según las convenciones de FacturaScripts.

Orden dentro de la clase:

1. ``use`` de traits, incluidos los que llevan bloque de resolución ``{ ... }`` - A-Z
2. Constantes, con o sin ``final``, visibilidad o tipo - A-Z
3. Propiedades públicas (incluidas las declaradas con ``var``) - A-Z
4. Propiedades protegidas y privadas, agrupadas - A-Z
5. Métodos abstractos, de cualquier visibilidad - A-Z
6. Métodos públicos - A-Z
7. Métodos protegidos y privados, agrupados - A-Z

Cada miembro se mueve con sus docblocks, comentarios y atributos ``#[...]``
previos, y con el comentario que tenga al final de su misma línea. Los
comentarios que quedan tras el último miembro se conservan al final de la clase.

Medidas de seguridad, para no corromper nunca el código:

- Solo actúa sobre archivos con ``namespace FacturaScripts\\``.
- Solo ordena la primera clase, interfaz o trait con nombre. Las clases
  anónimas y los ``enum`` no se tocan.
- La clase se localiza sobre una versión del archivo en la que comentarios,
  cadenas, heredocs y HTML fuera de ``<?php`` están enmascarados.
- Si algún miembro no se reconoce, la clase se deja como está.
- Antes de escribir se comprueba que el resultado contiene exactamente los
  mismos caracteres que no son espacio que el original; si no, no se escribe.
- El archivo se lee y se escribe como bytes UTF-8 conservando sus finales de
  línea. Si no es UTF-8 válido no se toca.

Uso: sort-class-members.py <file_path>

Código de salida: 0 si termina (con o sin cambios, o si se aborta por
seguridad) y 1 si los argumentos no son válidos o el archivo no se puede leer o
escribir. Los avisos se escriben en stderr.
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Grupos de ordenación en el orden final deseado. ``unknown`` impide reordenar.
GROUPS = [
    'trait',
    'const',
    'public_prop',
    'prot_priv_prop',
    'abstract_method',
    'public_method',
    'prot_priv_method',
    'unknown',
]

# Modificadores que pueden preceder a una propiedad o a un método.
_MODIFIERS = r'(?:public|protected|private|abstract|static|final|readonly|var)'

# Declaración con nombre de clase, interfaz o trait sobre el código enmascarado.
CLASS_PATTERN = re.compile(r'(?<![\w$\\])(?<!::)(?<!->)\b(class|interface|trait)\s+([A-Za-z_]\w*)')
TRAIT_PATTERN = re.compile(r'^use\s+([\w\\]+(?:\s*,\s*[\w\\]+)*)\s*(?:;|\{)', re.DOTALL)
CONST_PATTERN = re.compile(r'^(?:(?:final|public|protected|private)\s+)*const\b([^=;]*)=', re.DOTALL)
METHOD_PATTERN = re.compile(r'^((?:' + _MODIFIERS + r'\s+)*)function\s+&?\s*(\w+)\s*\(')
PROPERTY_PATTERN = re.compile(r'^((?:' + _MODIFIERS + r'\s+)+)(?:[\w\\|&?()]+\s+)?&?\$(\w+)')
HEREDOC_PATTERN = re.compile(r'<<<[ \t]*(["\']?)([A-Za-z_]\w*)\1\r?\n')


def _is_sort_enabled() -> bool:
    """Comprueba si sortClassMembers está activado en ~/.fs-claude.json.

    Returns:
        ``True`` si la opción está activada o no se puede leer (valor por defecto).
    """
    fs_claude = Path.home() / '.fs-claude.json'
    if not fs_claude.exists():
        return True
    try:
        config = json.loads(fs_claude.read_text(encoding='utf-8'))
        return bool(config.get('settings', {}).get('sortClassMembers', True))
    except Exception:
        return True


# ── Enmascarado del código ────────────────────────────────────────────────────

def _blank(segment: str) -> str:
    """Sustituye un fragmento por espacios conservando sus saltos de línea.

    Args:
        segment: Texto que se enmascara.

    Returns:
        Texto de la misma longitud con solo espacios, ``\\n`` y ``\\r``.
    """
    return ''.join(char if char in '\r\n' else ' ' for char in segment)


def mask_php(content: str) -> str:
    """Devuelve el PHP con comentarios, cadenas, heredocs y HTML sustituidos por espacios.

    La versión enmascarada tiene la misma longitud y los mismos saltos de línea
    que el original, así que sus posiciones son válidas en ambos textos. Los
    atributos ``#[...]`` se conservan porque son código.

    Args:
        content: Contenido completo del archivo PHP.

    Returns:
        El contenido enmascarado.
    """
    out: List[str] = []
    length = len(content)
    index = 0
    in_php = False

    while index < length:
        if not in_php:
            # Fuera de <?php ... ?> todo es HTML: se enmascara hasta la siguiente etiqueta.
            found = re.compile(r'<\?(?:php\b|=)?').search(content, index)
            end = length if found is None else found.end()
            out.append(_blank(content[index:found.start()] if found else content[index:]))
            if found:
                out.append(content[found.start():end])
            index = end
            in_php = True
            continue

        char = content[index]
        pair = content[index:index + 2]

        if pair == '?>':
            out.append(pair)
            index += 2
            in_php = False
            continue

        if pair == '/*':
            end = content.find('*/', index + 2)
            end = length if end == -1 else end + 2
            out.append(_blank(content[index:end]))
            index = end
            continue

        if pair == '//' or (char == '#' and content[index + 1:index + 2] != '['):
            end = index
            while end < length and content[end] not in '\r\n':
                end += 1
            out.append(_blank(content[index:end]))
            index = end
            continue

        if char in ('"', "'", '`'):
            end = index + 1
            while end < length and content[end] != char:
                end += 2 if content[end] == '\\' else 1
            end = min(end + 1, length)
            out.append(_blank(content[index:end]))
            index = end
            continue

        heredoc = HEREDOC_PATTERN.match(content, index) if pair == '<<' else None
        if heredoc:
            # Cierre flexible (PHP 7.3+): la etiqueta puede ir sangrada y seguida de , ) o ;.
            closing = re.compile(r'^[ \t]*' + re.escape(heredoc.group(2)) + r'(?!\w)', re.MULTILINE)
            found = closing.search(content, heredoc.end())
            end = length if found is None else found.end()
            out.append(_blank(content[index:end]))
            index = end
            continue

        out.append(char)
        index += 1

    return ''.join(out)


def _matching_brace(masked: str, open_pos: int) -> Optional[int]:
    """Devuelve la posición de la llave que cierra la abierta en ``open_pos``.

    Args:
        masked: Código enmascarado.
        open_pos: Posición de la llave de apertura.

    Returns:
        Posición de la llave de cierre, o ``None`` si no está equilibrada.
    """
    depth = 0
    for pos in range(open_pos, len(masked)):
        if masked[pos] == '{':
            depth += 1
        elif masked[pos] == '}':
            depth -= 1
            if depth == 0:
                return pos
    return None


# ── Localizar el cuerpo de la clase en el archivo ─────────────────────────────

def find_class_body(content: str, masked: Optional[str] = None) -> Optional[Tuple[int, int]]:
    """Busca la primera clase, interfaz o trait con nombre del archivo.

    Ignora las coincidencias en comentarios y cadenas, ``Foo::class``,
    ``$class`` y las clases anónimas (``new class``), cuyo nombre aparente sería
    ``extends`` o ``implements``.

    Args:
        content: Contenido completo del archivo.
        masked: Versión enmascarada del contenido; se calcula si no se indica.

    Returns:
        Posiciones de la llave de apertura y de cierre, o ``None`` si no hay clase.
    """
    masked = mask_php(content) if masked is None else masked
    for match in CLASS_PATTERN.finditer(masked):
        if match.group(2).lower() in ('extends', 'implements'):
            continue
        if re.search(r'\bnew\s*$', masked[max(0, match.start() - 20):match.start()]):
            continue
        brace = re.compile(r'[{;]').search(masked, match.end())
        if brace is None or brace.group(0) != '{':
            continue
        close = _matching_brace(masked, brace.start())
        if close is None:
            return None
        return brace.start(), close
    return None


# ── Buscar el final de un miembro ─────────────────────────────────────────────

def find_member_end(masked: str, start: int) -> int:
    """Avanza desde ``start`` hasta el final del miembro sobre el código enmascarado.

    El miembro termina en un ``;`` de profundidad 0 (propiedad, constante,
    método abstracto o ``use``) o en la ``}`` que devuelve la profundidad a 0
    (cuerpo de un método o bloque de un ``use`` de traits).

    Args:
        masked: Cuerpo de la clase enmascarado.
        start: Posición donde empieza la declaración.

    Returns:
        Posición siguiente al final del miembro.
    """
    depth = 0
    for pos in range(start, len(masked)):
        char = masked[pos]
        if char == '{':
            depth += 1
        elif char == '}':
            depth -= 1
            if depth < 0:
                return pos
            if depth == 0:
                return pos + 1
        elif char == ';' and depth == 0:
            return pos + 1
    return len(masked)


def _skip_attributes(masked: str, pos: int) -> int:
    """Salta los espacios y los atributos ``#[...]`` que preceden a una declaración.

    Args:
        masked: Cuerpo de la clase enmascarado.
        pos: Posición inicial.

    Returns:
        Posición del primer carácter de la declaración.
    """
    length = len(masked)
    while True:
        while pos < length and masked[pos].isspace():
            pos += 1
        if masked[pos:pos + 2] != '#[':
            return pos
        depth = 0
        while pos < length:
            if masked[pos] == '[':
                depth += 1
            elif masked[pos] == ']':
                depth -= 1
                if depth == 0:
                    pos += 1
                    break
            pos += 1


def _trailing_comment_end(body: str, pos: int) -> int:
    """Incluye en el miembro el comentario que empieza en su misma línea.

    Args:
        body: Cuerpo original de la clase.
        pos: Posición siguiente al final del miembro.

    Returns:
        Posición final del comentario, o ``pos`` si no hay comentario en la línea.
    """
    probe = pos
    while probe < len(body) and body[probe] in ' \t':
        probe += 1
    if body.startswith('//', probe) or (body.startswith('#', probe) and not body.startswith('#[', probe)):
        while probe < len(body) and body[probe] not in '\r\n':
            probe += 1
        return probe
    if body.startswith('/*', probe):
        end = body.find('*/', probe + 2)
        return len(body) if end == -1 else end + 2
    return pos


# ── Clasificación del miembro ─────────────────────────────────────────────────

def classify_member(code: str) -> Tuple[str, str]:
    """Clasifica un fragmento de código PHP como miembro de clase.

    Args:
        code: Declaración del miembro sin docblocks ni atributos previos.

    Returns:
        Tupla ``(kind, nombre)`` donde ``kind`` es uno de ``GROUPS`` y el nombre
        está en minúsculas para ordenar.
    """
    text = code.strip()

    match = TRAIT_PATTERN.match(text)
    if match:
        first = match.group(1).split(',')[0].strip()
        return 'trait', first.split('\\')[-1].lower()

    match = CONST_PATTERN.match(text)
    if match:
        # Con constantes tipadas (const string X = ...) el nombre es el último identificador.
        names = re.findall(r'\w+', match.group(1))
        if names:
            return 'const', names[-1].lower()

    match = METHOD_PATTERN.match(text)
    if match:
        modifiers = match.group(1).lower()
        name = match.group(2).lower()
        if 'abstract' in modifiers:
            return 'abstract_method', name
        if 'protected' in modifiers or 'private' in modifiers:
            return 'prot_priv_method', name
        return 'public_method', name

    match = PROPERTY_PATTERN.match(text)
    if match:
        modifiers = match.group(1).lower()
        name = match.group(2).lower()
        if 'protected' in modifiers or 'private' in modifiers:
            return 'prot_priv_prop', name
        return 'public_prop', name

    return 'unknown', text[:50].lower()


# ── Extracción de miembros del cuerpo de la clase ────────────────────────────

def skip_blank_lines(content: str, pos: int) -> int:
    """Avanza sobre las líneas que solo contienen espacios o tabulaciones.

    Args:
        content: Texto que se recorre.
        pos: Posición inicial, al comienzo de una línea.

    Returns:
        Posición del comienzo de la primera línea con contenido.
    """
    length = len(content)
    while pos < length:
        line_start = pos
        while pos < length and content[pos] in ' \t':
            pos += 1
        if pos < length and content[pos] == '\n':
            pos += 1
        elif pos < length and content[pos] == '\r':
            pos += 1
            if pos < length and content[pos] == '\n':
                pos += 1
        else:
            return line_start
    return pos


def extract_members(class_body: str, masked_body: Optional[str] = None) -> Tuple[List[Dict], str]:
    """Separa el cuerpo de una clase en miembros y comentarios finales.

    Args:
        class_body: Texto interior de la clase, sin las llaves externas.
        masked_body: Versión enmascarada del cuerpo; se calcula si no se indica.

    Returns:
        Lista de miembros y la cola de comentarios tras el último miembro. Cada
        miembro es un dict con ``text`` (docblock, atributos, código y
        comentario de línea, con su sangría), ``kind`` y ``name``.
    """
    if masked_body is None:
        masked_body = mask_php('<?php ' + class_body)[6:]

    members: List[Dict] = []
    pos = 0
    length = len(class_body)

    while pos < length:
        pos = skip_blank_lines(class_body, pos)
        if pos >= length:
            break

        # Solo quedan comentarios: se conservan como cola de la clase.
        if not masked_body[pos:].strip():
            return members, class_body[pos:].rstrip()

        member_start = pos
        declaration = _skip_attributes(masked_body, pos)
        member_end = find_member_end(masked_body, declaration)
        if member_end <= declaration:
            # Llave de cierre suelta: no es un miembro reconocible y no se reordena.
            members.append({'text': class_body[member_start:].rstrip(), 'kind': 'unknown', 'name': ''})
            break
        member_end = _trailing_comment_end(class_body, member_end)

        code = masked_body[declaration:member_end]
        kind, name = classify_member(class_body[declaration:declaration + len(code.rstrip())])
        members.append({
            'text': class_body[member_start:member_end].rstrip(),
            'kind': kind,
            'name': name,
        })
        pos = member_end

    return members, ''


# ── Reconstrucción del cuerpo ordenado ───────────────────────────────────────

def reconstruct_body(members: List[Dict], tail: str = '', newline: str = '\n',
                     head: str = '', closing_indent: str = '') -> str:
    """Agrupa los miembros por tipo, ordena cada grupo A-Z y reconstruye el cuerpo.

    Reglas de formato:

    - Los ``use`` de traits van juntos sin línea en blanco entre ellos.
    - El resto de miembros se separan con una línea en blanco.
    - La cola de comentarios va al final, tras una línea en blanco.

    Args:
        members: Miembros extraídos por ``extract_members``.
        tail: Comentarios que había tras el último miembro.
        newline: Final de línea del archivo (``\\n`` o ``\\r\\n``).
        head: Comentario que había en la misma línea que la llave de apertura.
        closing_indent: Sangría de la línea de la llave de cierre.

    Returns:
        El nuevo cuerpo de la clase, sin las llaves externas.
    """
    groups: Dict[str, List[Dict]] = {kind: [] for kind in GROUPS}
    for member in members:
        groups.setdefault(member['kind'], groups['unknown']).append(member)

    for kind in GROUPS:
        groups[kind].sort(key=lambda member: member['name'])

    blocks: List[str] = []
    for kind in GROUPS:
        if not groups[kind]:
            continue
        if kind == 'trait':
            blocks.append(newline.join(member['text'] for member in groups[kind]))
        else:
            blocks.extend(member['text'] for member in groups[kind])
    if tail:
        blocks.append(tail)

    if not blocks:
        return head + newline + closing_indent

    return head + newline + (newline * 2).join(blocks) + newline + closing_indent


def same_code(original: str, updated: str) -> bool:
    """Comprueba que dos textos tienen exactamente los mismos caracteres que no son espacio.

    Args:
        original: Texto original.
        updated: Texto reordenado.

    Returns:
        ``True`` si el multiconjunto de caracteres visibles coincide.
    """
    def visible(text: str) -> Counter:
        return Counter(char for char in text if not char.isspace())

    return visible(original) == visible(updated)


def sort_content(content: str) -> Optional[str]:
    """Ordena la primera clase del contenido indicado.

    Args:
        content: Contenido completo del archivo PHP.

    Returns:
        El contenido ordenado, o ``None`` si no hay que cambiar nada o no es
        seguro hacerlo.
    """
    if 'namespace FacturaScripts\\' not in content:
        return None

    masked = mask_php(content)
    found = find_class_body(content, masked)
    if found is None:
        return None
    open_pos, close_pos = found

    body = content[open_pos + 1:close_pos]
    masked_body = masked[open_pos + 1:close_pos]
    newline = '\r\n' if '\r\n' in content else '\n'

    # Comentario en la misma línea que la llave de apertura: se queda ahí.
    first_break = body.find('\n')
    head = ''
    offset = 0
    if first_break != -1 and body[:first_break].strip():
        if masked_body[:first_break].strip():
            return None
        head = body[:first_break].rstrip()
        offset = first_break + 1

    last_break = body.rfind('\n')
    closing_indent = body[last_break + 1:] if last_break != -1 and not body[last_break + 1:].strip() else ''

    members, tail = extract_members(body[offset:], masked_body[offset:])
    if not members or any(member['kind'] == 'unknown' for member in members):
        return None

    new_body = reconstruct_body(members, tail, newline, head, closing_indent)
    updated = content[:open_pos + 1] + new_body + content[close_pos:]
    if updated == content:
        return None
    if not same_code(content, updated):
        raise ValueError('el resultado no conserva todos los caracteres del original')
    return updated


# ── Punto de entrada ──────────────────────────────────────────────────────────

def process_file(file_path: str) -> None:
    """Ordena la clase del archivo indicado si es seguro hacerlo.

    Args:
        file_path: Ruta del archivo PHP.
    """
    path = Path(file_path)
    try:
        raw = path.read_bytes()
    except OSError as error:
        print(f"Error leyendo {file_path}: {error}", file=sys.stderr)
        sys.exit(1)

    try:
        content = raw.decode('utf-8')
    except UnicodeDecodeError:
        print(f"Aviso: {file_path} no es UTF-8 válido; no se ordena la clase.", file=sys.stderr)
        return

    try:
        updated = sort_content(content)
    except ValueError as error:
        print(f"Aviso: no se ordena {file_path}: {error}.", file=sys.stderr)
        return

    if updated is None:
        return

    try:
        path.write_bytes(updated.encode('utf-8'))
    except OSError as error:
        print(f"Error escribiendo {file_path}: {error}", file=sys.stderr)
        sys.exit(1)


def main() -> None:
    """Lee los argumentos y ordena la clase del archivo si la opción está activada."""
    if not _is_sort_enabled():
        sys.exit(0)
    if len(sys.argv) != 2:
        print(f"Uso: {sys.argv[0]} <file_path>", file=sys.stderr)
        sys.exit(1)
    process_file(sys.argv[1])


if __name__ == '__main__':
    main()
