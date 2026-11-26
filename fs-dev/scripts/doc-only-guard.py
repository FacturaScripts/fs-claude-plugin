#!/usr/bin/env python3
"""Garantiza que un trabajo de documentación solo cambia documentación y comentarios.

Lo usa la skill ``fs-dev:context-writer`` cuando rellena ``Doc/Context/`` y añade
docblocks al código de un plugin o del core de FacturaScripts. El código no puede
cambiar en ningún concepto: en los archivos PHP solo pueden cambiar comentarios
y espacios, y fuera de ellos solo la documentación (``Doc/``, ``AGENTS.md``,
``CLAUDE.md`` y ``.gitignore``).

Subcomandos:

- ``start <ruta>``: activa el modo «solo documentación». Guarda en la carpeta de
  git del repositorio (``git rev-parse --git-path``, nunca en el árbol de trabajo)
  un marcador con el commit actual y la huella de los archivos que ya tenían
  cambios sin confirmar. Mientras el marcador existe, el hook ``post-edit.py`` no
  actualiza el copyright ni ordena las clases de ese proyecto. Si ya estaba
  activo, conserva el marcador original.
- ``check <ruta>``: compara el árbol de trabajo con el punto de partida y lista
  las infracciones: un PHP cuyo código (sin comentarios ni espacios) ha cambiado,
  un archivo que ya tenía cambios y se ha vuelto a tocar, o cualquier otro archivo
  creado, borrado o modificado fuera de la documentación. Sin ``start`` previo
  compara con ``HEAD``.
- ``stop <ruta>``: borra el marcador y devuelve el hook a su comportamiento normal.
- ``status <ruta>``: indica si el modo está activo.

El código de los PHP se compara con el tokenizador de PHP (``php`` en el PATH),
descartando comentarios y espacios. Si no hay PHP, usa un tokenizador propio que
quita comentarios respetando cadenas, y lo indica en el informe.

Uso:
    doc-only-guard.py {start,check,stop,status} [<ruta>] [--json]

Código de salida: 0 si todo está bien, 1 si ``check`` encuentra infracciones y 2
si la ruta no es un plugin ni el core o no está en un repositorio git.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# Nombre del marcador dentro de la carpeta de git del repositorio.
MARKER_NAME = 'fs-ai-doc-only.json'

# Horas tras las que un marcador olvidado deja de tener efecto en el hook.
MARKER_MAX_AGE = 12 * 3600

# Rutas de documentación, relativas a la raíz del proyecto, que se pueden cambiar libremente.
DOC_FILES = ('AGENTS.md', 'CLAUDE.md', '.gitignore')
DOC_FOLDERS = ('Doc/',)

# Programa PHP que imprime en JSON los tokens del archivo indicado, sin comentarios ni espacios.
PHP_TOKENS = r'''
$skip = [T_COMMENT, T_DOC_COMMENT, T_WHITESPACE];
$out = [];
foreach (token_get_all(file_get_contents($argv[1])) as $token) {
    if (is_array($token)) {
        if (in_array($token[0], $skip, true)) {
            continue;
        }
        $text = trim($token[1]);
        if ($text !== '') {
            $out[] = token_name($token[0]) . ' ' . $text;
        }
        continue;
    }
    $out[] = $token;
}
echo json_encode($out);
'''


@dataclass
class Project:
    """Plugin o core sobre el que se trabaja y su repositorio git.

    Attributes:
        root: carpeta raíz del plugin o del core.
        top: raíz del repositorio git que lo contiene.
        prefix: ruta de ``root`` relativa a ``top`` con ``/`` final, o vacía si coinciden.
        marker: ruta absoluta del marcador del modo «solo documentación».
    """

    root: Path
    top: Path
    prefix: str
    marker: Path

    def relative(self, repo_path: str) -> Optional[str]:
        """Convierte una ruta relativa al repositorio en relativa al proyecto, o ``None`` si queda fuera."""
        if not repo_path.startswith(self.prefix):
            return None
        return repo_path[len(self.prefix):]


@dataclass
class Result:
    """Resultado de la comprobación.

    Attributes:
        method: tokenizador usado para comparar el PHP (``php`` o ``python``).
        documented: archivos PHP con cambios solo en comentarios.
        docs: archivos de documentación cambiados.
        violations: infracciones encontradas, con la ruta y el motivo.
    """

    method: str
    documented: list[str] = field(default_factory=list)
    docs: list[str] = field(default_factory=list)
    violations: list[dict] = field(default_factory=list)


def git(cwd: Path, *args: str, binary: bool = False) -> Optional[bytes | str]:
    """Ejecuta git en la carpeta indicada y devuelve su salida, o ``None`` si falla."""
    try:
        result = subprocess.run(['git', '-C', str(cwd), *args], capture_output=True, check=False, timeout=60)
    except (OSError, subprocess.SubprocessError):
        return None
    if result.returncode != 0:
        return None
    return result.stdout if binary else result.stdout.decode('utf-8', errors='replace')


def is_project_root(root: Path) -> bool:
    """Indica si la carpeta es un plugin (``facturascripts.ini``) o el core (``Core/Kernel.php``)."""
    return (root / 'facturascripts.ini').is_file() or (root / 'Core' / 'Kernel.php').is_file()


def marker_path(folder: Path) -> Optional[Path]:
    """Devuelve la ruta absoluta del marcador en el repositorio de la carpeta, o ``None`` si no es git."""
    output = git(folder, 'rev-parse', '--git-path', MARKER_NAME)
    if not output:
        return None
    path = Path(output.strip())
    return path if path.is_absolute() else (folder / path).resolve()


def load_project(root: Path) -> Optional[Project]:
    """Localiza el repositorio git del proyecto; devuelve ``None`` si no es un plugin o el core con git."""
    if not is_project_root(root):
        return None
    top = git(root, 'rev-parse', '--show-toplevel')
    marker = marker_path(root)
    if not top or marker is None:
        return None
    top_path = Path(top.strip()).resolve()
    prefix = root.resolve().relative_to(top_path).as_posix()
    return Project(root.resolve(), top_path, '' if prefix == '.' else prefix + '/', marker)


def digest(path: Path) -> Optional[str]:
    """Devuelve el SHA-256 del archivo, o ``None`` si no existe."""
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError:
        return None


def changed_paths(project: Project) -> dict[str, str]:
    """Devuelve los archivos del proyecto con cambios respecto a ``HEAD`` y su estado de ``git status``."""
    output = git(project.top, 'status', '--porcelain=v1', '-z', '--untracked-files=all', '--', str(project.root),
                 binary=True)
    if output is None:
        return {}
    entries = output.decode('utf-8', errors='replace').split('\0')
    changes: dict[str, str] = {}
    index = 0
    while index < len(entries):
        entry = entries[index]
        index += 1
        if len(entry) < 4:
            continue
        status, path = entry[:2], entry[3:]
        if 'R' in status or 'C' in status:
            # El origen del renombrado va en la entrada siguiente: también cuenta como cambiado.
            if index < len(entries) and entries[index]:
                changes[entries[index]] = 'D'
            index += 1
        changes[path] = status
    return changes


def head_commit(project: Project) -> Optional[str]:
    """Devuelve el commit actual del repositorio, o ``None`` si todavía no tiene commits."""
    output = git(project.top, 'rev-parse', '--verify', '-q', 'HEAD')
    return output.strip() if output else None


def read_marker(path: Path) -> Optional[dict]:
    """Lee el marcador; devuelve ``None`` si no existe o no es válido."""
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return None
    return data if isinstance(data, dict) else None


def marker_is_active(data: Optional[dict], now: Optional[float] = None) -> bool:
    """Indica si el marcador existe y no ha caducado."""
    if not data:
        return False
    started = data.get('started')
    if not isinstance(started, (int, float)):
        return False
    return ((now if now is not None else time.time()) - started) <= MARKER_MAX_AGE


def start(project: Project) -> dict:
    """Activa el modo «solo documentación» y devuelve el marcador."""
    current = read_marker(project.marker)
    if marker_is_active(current) and current.get('root') == str(project.root):
        return current
    data = {
        'root': str(project.root),
        'started': time.time(),
        'head': head_commit(project),
        'dirty': {path: digest(project.top / path) for path in changed_paths(project)},
    }
    project.marker.parent.mkdir(parents=True, exist_ok=True)
    project.marker.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    return data


def stop(project: Project) -> bool:
    """Desactiva el modo «solo documentación»; devuelve ``True`` si estaba activo."""
    try:
        project.marker.unlink()
    except FileNotFoundError:
        return False
    return True


def is_doc_path(relative: str) -> bool:
    """Indica si la ruta, relativa al proyecto, es documentación que se puede cambiar libremente."""
    return relative in DOC_FILES or relative.startswith(DOC_FOLDERS)


def strip_php_comments(source: str) -> str:
    """Quita los comentarios del PHP respetando las cadenas y devuelve el código sin espacios.

    Es la alternativa al tokenizador de PHP cuando no hay ``php`` en el PATH: trata
    ``//``, ``#`` (salvo ``#[`` de los atributos) y ``/* */`` como comentarios fuera
    de las cadenas con comillas simples, dobles o invertidas.
    """
    out: list[str] = []
    index, length = 0, len(source)
    while index < length:
        char = source[index]
        pair = source[index:index + 2]
        if char in '\'"`':
            end = index + 1
            while end < length and source[end] != char:
                end += 2 if source[end] == '\\' else 1
            out.append(source[index:end + 1])
            index = end + 1
        elif pair == '/*':
            end = source.find('*/', index + 2)
            index = length if end < 0 else end + 2
        elif pair == '//' or (char == '#' and pair != '#['):
            end = index
            while end < length and source[end] != '\n' and source[end:end + 2] != '?>':
                end += 1
            index = end
        else:
            out.append(char)
            index += 1
    return ''.join(''.join(out).split())


def php_signature(content: bytes, php: Optional[str]) -> Optional[str]:
    """Devuelve la firma del código PHP sin comentarios ni espacios, o ``None`` si no se puede calcular.

    El tokenizador y el código van en dos archivos de una carpeta temporal, y a PHP solo se
    le pasan sus rutas. Así funciona también en Windows, donde ``php`` suele ser un lanzador
    ``.cmd`` o ``.bat`` que estropea un argumento ``-r`` con saltos de línea y comillas, y
    donde otro proceso no puede abrir un temporal que siga abierto.
    """
    if php:
        with tempfile.TemporaryDirectory(prefix='fs-doc-guard-') as folder:
            tokenizer = Path(folder) / 'tokens.php'
            source = Path(folder) / 'source.php'
            tokenizer.write_text('<?php\n' + PHP_TOKENS, encoding='utf-8')
            source.write_bytes(content)
            try:
                result = subprocess.run([php, '-d', 'error_reporting=0', str(tokenizer), str(source)],
                                        capture_output=True, check=False, timeout=60)
            except (OSError, subprocess.SubprocessError):
                return None
        return result.stdout.decode('utf-8', errors='replace') if result.returncode == 0 else None
    return strip_php_comments(content.decode('utf-8', errors='replace'))


def check(project: Project, php: Optional[str] = None) -> Result:
    """Compara el árbol de trabajo con el punto de partida y devuelve las infracciones."""
    marker = read_marker(project.marker)
    active = marker_is_active(marker) and marker.get('root') == str(project.root)
    head = (marker.get('head') if active else None) or head_commit(project)
    dirty: dict = marker.get('dirty', {}) if active else {}
    result = Result('php' if php else 'python')

    for repo_path, status in sorted(changed_paths(project).items()):
        relative = project.relative(repo_path)
        if relative is None:
            continue
        current = project.top / repo_path
        if is_doc_path(relative):
            result.docs.append(relative)
            continue
        if repo_path in dirty:
            if digest(current) != dirty[repo_path]:
                result.violations.append({'path': relative, 'reason': 'ya tenía cambios sin confirmar y se ha '
                                                                     'vuelto a modificar'})
            continue
        if not relative.endswith('.php'):
            result.violations.append({'path': relative, 'reason': f'cambio fuera de la documentación ({status.strip()})'})
            continue
        if 'D' in status or not current.is_file():
            result.violations.append({'path': relative, 'reason': 'archivo PHP borrado o movido'})
            continue
        original = git(project.top, 'show', f'{head}:{repo_path}', binary=True) if head else None
        if original is None:
            result.violations.append({'path': relative, 'reason': 'archivo PHP nuevo: solo se puede documentar el '
                                                                 'código que ya existe'})
            continue
        before = php_signature(original, php)
        after = php_signature(current.read_bytes(), php)
        if before is None or after is None:
            result.violations.append({'path': relative, 'reason': 'no se ha podido analizar el código'})
        elif before != after:
            result.violations.append({'path': relative, 'reason': 'ha cambiado el código, no solo los comentarios'})
        else:
            result.documented.append(relative)
    return result


def use_utf8_stdio() -> None:
    """Usa UTF-8 en la entrada y las salidas estándar, también en Windows.

    En Windows, Python usa la página de códigos local (cp1252) cuando la entrada o la salida
    es una tubería, como al ejecutarse desde un hook o desde la herramienta Bash del modelo:
    los acentos del JSON y de los mensajes llegarían corruptos. Un flujo sin ``reconfigure``
    (por ejemplo, ``io.StringIO`` en las pruebas) se deja como está.
    """
    for stream in (sys.stdin, sys.stdout, sys.stderr):
        reconfigure = getattr(stream, 'reconfigure', None)
        if reconfigure is not None:
            try:
                reconfigure(encoding='utf-8')
            except (OSError, ValueError):
                pass


def main(argv: Optional[list[str]] = None) -> int:
    """Punto de entrada: ejecuta el subcomando y devuelve el código de salida."""
    use_utf8_stdio()
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('command', choices=('start', 'check', 'stop', 'status'))
    parser.add_argument('path', nargs='?', default='.', help='carpeta del plugin o del core')
    parser.add_argument('--json', action='store_true', help='muestra el resultado en JSON')
    args = parser.parse_args(argv)

    project = load_project(Path(args.path).expanduser().resolve())
    if project is None:
        print(f'Error: {args.path} no es un plugin ni el core dentro de un repositorio git.', file=sys.stderr)
        return 2

    if args.command == 'start':
        data = start(project)
        payload = {'active': True, 'head': data.get('head'), 'dirty': sorted(data.get('dirty', {}))}
        text = ['Modo «solo documentación» activo: el hook de edición no tocará el copyright ni el orden de las '
                'clases.']
        if payload['dirty']:
            text.append('Archivos que ya tenían cambios y no se deben tocar:')
            text.extend(f'  - {path}' for path in payload['dirty'])
    elif args.command == 'stop':
        payload = {'active': False, 'was_active': stop(project)}
        text = ['Modo «solo documentación» desactivado.' if payload['was_active']
                else 'El modo «solo documentación» no estaba activo.']
    elif args.command == 'status':
        active = marker_is_active(read_marker(project.marker))
        payload = {'active': active}
        text = ['Modo «solo documentación» activo.' if active else 'Modo «solo documentación» inactivo.']
    else:
        result = check(project, shutil.which('php'))
        payload = {'method': result.method, 'documented': result.documented, 'docs': result.docs,
                   'violations': result.violations}
        text = [f'Comprobación del código con el tokenizador de {result.method}.']
        text.append(f'  Documentación cambiada: {len(result.docs)} archivos.')
        text.append(f'  PHP con cambios solo en comentarios: {len(result.documented)} archivos.')
        if result.method == 'python':
            text.append('  Aviso: no hay php en el PATH; la comparación es aproximada.')
        for item in result.violations:
            text.append(f'  ! {item["path"]}: {item["reason"]}')
        if not result.violations:
            text.append('  Sin cambios en el código.')

    if args.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        print('\n'.join(text))
    return 1 if args.command == 'check' and payload['violations'] else 0


if __name__ == '__main__':
    sys.exit(main())
