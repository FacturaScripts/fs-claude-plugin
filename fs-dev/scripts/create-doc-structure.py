#!/usr/bin/env python3
"""Crea o completa la estructura de documentación de un plugin o del core de FacturaScripts.

La estructura es la de los plugins fiscales (FiscalES, Facturae, InformeSII,
Ticketbai y Verifactu):

- ``Doc/User/``: páginas ``.md`` de uso para usuarios.
- ``Doc/Dev/``: páginas ``.md`` para programadores que personalizan el plugin
  desde otro plugin.
- ``Doc/Context/``: el porqué de las decisiones del código, con su índice en
  ``README.md``.
- ``Doc/Assets/``: imágenes, vídeos y otros archivos enlazados desde la
  documentación.
- ``Doc/forja.json``: datos de cada página de ``User`` y ``Dev`` (título, página
  padre, orden, icono, controladores donde se muestra, visibilidad...) para
  publicarlas en la forja de facturascripts.com.
- ``AGENTS.md``: descripción breve y enlace a ``Doc/``; ``CLAUDE.md`` solo lo
  importa con ``@AGENTS.md``.
- ``.gitignore``: lo que ignoran los plugins fiscales, incluidos lo local de
  ``.claude/`` y ``.agents/`` (salvo sus skills), ``CLAUDE.local.md`` y
  ``AGENTS.override.md``.

Las carpetas vacías reciben un ``.gitkeep`` para que git las suba.

El script es idempotente: nunca sobrescribe un archivo que ya existe. Del
``.gitignore`` solo quita las reglas que impedirían versionar la estructura
(``CLAUDE.md``, ``AGENTS.md``, ``/.claude`` entero o ``.agents``) y añade las
que falten. Lo que no puede resolver solo (un ``CLAUDE.md`` con instrucciones
propias, un ``AGENTS.md`` sin enlace a ``Doc/`` o una regla del ``.gitignore``
que ignora la documentación) lo devuelve como pendiente.

Uso:
    create-doc-structure.py [<ruta>] [--check] [--json]

``<ruta>`` es la carpeta del plugin (con ``facturascripts.ini``) o del core (con
``Core/Kernel.php``); por defecto, el directorio actual. ``--check`` solo
informa de lo que falta, sin escribir nada.

Código de salida: 0 si la estructura queda completa, 1 si quedan pendientes (o,
con ``--check``, si falta algo) y 2 si la ruta no es un plugin ni el core.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path


# Carpetas que pueden quedarse vacías y necesitan .gitkeep para que git las suba.
EMPTY_FOLDERS = ('Doc/User', 'Doc/Dev', 'Doc/Assets')

# Archivos que se ignoran al decidir si una carpeta está vacía.
IGNORED_FILES = {'.DS_Store', 'Thumbs.db'}

GITIGNORE_TEMPLATE = """/node_modules/
/vendor/
.DS_Store
.htaccess
package-lock.json
*.cache
*.lock

# eclipse
.buildpath
.project
.settings

# netbeans
/nbproject/

# phpstorm
/.idea/

# sscode
.vscode
*.code-workspace

# IA: lo local de Claude Code y de Codex no se versiona; sí sus skills (.agents/skills, con enlace desde .claude/skills)
/.claude/*
!/.claude/skills
/.agents/*
!/.agents/skills
/CLAUDE.local.md
/AGENTS.override.md
__pycache__/
"""

# Reglas que impedirían versionar AGENTS.md, CLAUDE.md, .agents o .claude/skills.
GITIGNORE_CONFLICTS = {
    'CLAUDE.md', '/CLAUDE.md', 'AGENTS.md', '/AGENTS.md',
    '.claude', '.claude/', '/.claude', '/.claude/',
    '.agents', '.agents/', '/.agents', '/.agents/',
}

# Secciones de Doc/forja.json: cada una agrupa las páginas de su carpeta Doc/<sección>/.
FORJA_SECTIONS = ('User', 'Dev')

# Campos admitidos para cada página de Doc/forja.json y su tipo; todos son opcionales.
FORJA_FIELDS: dict[str, type] = {
    'title': str,
    'title_short': str,
    'permalink': str,
    'parent': str,
    'ordernum': int,
    'youtubeid': str,
    'imageurl': str,
    'icon': str,
    'color': str,
    'keywords': str,
    'controllers': str,
    'visibility': bool,
}

# Longitud máxima, en caracteres, de los campos de texto que la forja limita.
FORJA_MAX_LENGTH = {
    'permalink': 200,
    'keywords': 300,
    'controllers': 300,
}

# Colores de Bootstrap admitidos en el campo color.
FORJA_COLORS = ('primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark')

FORJA_TEMPLATE = json.dumps({section: {} for section in FORJA_SECTIONS}, indent=4) + '\n'

# Rutas que deben poder versionarse; se comprueban con git check-ignore.
VERSIONED_PATHS = (
    'AGENTS.md', 'CLAUDE.md', 'Doc/forja.json', 'Doc/Context/README.md',
    'Doc/User/.gitkeep', 'Doc/Dev/.gitkeep', 'Doc/Assets/.gitkeep', '.claude/skills',
)

CONTEXT_README_TEMPLATE = """# {name}: contexto del equipo

Esta carpeta guarda **por qué el código es como es**: las decisiones que no se ven leyendo una sola clase, para que
todo el equipo y los agentes trabajen con el mismo contexto. Lee este índice y abre solo el tema o la decisión que
necesites.

Se puede dividir en tantos archivos y subcarpetas como haga falta; este índice dice qué hay en cada uno y se actualiza
en el mismo trabajo que cambia el código.

## Temas

Todavía no hay temas. Añade cada uno como `NN-tema.md` (cómo es hoy esa parte y por qué) y enlázalo aquí.

## Decisiones

Todavía no hay decisiones. Añade cada una como `Decisiones/NNNN-titulo.md` (contexto, alternativas, decisión, fecha y
quién la aprobó) y enlázala aquí.
"""

AGENTS_TEMPLATE = """{intro}

Antes de tocar nada lee [`Doc/Context/README.md`](Doc/Context/README.md): es el índice del contexto (temas y
decisiones) y dice qué archivo abrir para cada tema; no hace falta leerlo todo.

## Documentación

| Ruta | Para quién | Qué guarda |
|---|---|---|
| [`Doc/User/`](Doc/User/) | Quien usa el programa | Páginas `.md` que explican cómo se usa |
| [`Doc/Dev/`](Doc/Dev/) | Quien programa | Páginas `.md` que explican cómo personalizarlo desde otro plugin |
| [`Doc/Context/`](Doc/Context/) | El equipo y los agentes | Por qué el código es como es: las decisiones tomadas, con su índice en `README.md` |
| [`Doc/Assets/`](Doc/Assets/) | Toda la documentación | Imágenes, vídeos y otros archivos enlazados desde las páginas |
| [`Doc/forja.json`](Doc/forja.json) | La forja de facturascripts.com | Datos de cada página de `User` y `Dev` para publicarlas |

- La documentación se actualiza en el mismo trabajo que cambia el código; una decisión nueva se anota en
  `Doc/Context/` y en su índice.
- `Doc/forja.json` agrupa en `User` y `Dev` las páginas de esas carpetas por su nombre de archivo, con campos
  opcionales: `title`, `title_short`, `permalink` (enlace en la web, máx. 200 caracteres; no se puede cambiar una vez
  publicada la página), `parent`, `ordernum`, `youtubeid`, `imageurl`, `icon`, `color`, `keywords` y `controllers`
  (máx. 300 caracteres cada uno) y `visibility`.
- `CLAUDE.md` solo importa este archivo (`@AGENTS.md`). Las instrucciones locales que no se versionan van en
  `CLAUDE.local.md` (Claude Code) o `AGENTS.override.md` (Codex).
"""


@dataclass
class Project:
    """Plugin o core cuya documentación se prepara.

    Attributes:
        root: carpeta raíz del plugin o del core.
        kind: ``plugin`` o ``core``.
        name: nombre del plugin o ``FacturaScripts`` para el core.
        description: descripción del ``facturascripts.ini`` (vacía en el core).
    """

    root: Path
    kind: str
    name: str
    description: str = ''

    def intro(self) -> str:
        """Devuelve la primera frase de AGENTS.md: qué es el plugin o el core."""
        if self.kind == 'core':
            return ('Core de **FacturaScripts**: ERP y programa de facturación de código abierto, ampliable '
                    'mediante plugins.')
        description = self.description.strip().rstrip('.')
        if not description or description == self.name:
            return f'Plugin **{self.name}** para FacturaScripts.'
        return f'Plugin **{self.name}** para FacturaScripts: {description}.'


@dataclass
class Report:
    """Resultado de la creación o comprobación de la estructura.

    Attributes:
        created: rutas creadas (o que se crearían con ``--check``).
        existing: rutas que ya existían y no se tocan.
        gitignore_added: reglas añadidas al ``.gitignore``.
        gitignore_removed: reglas quitadas del ``.gitignore`` por impedir versionar la estructura.
        pending: tareas que el script no resuelve solo y debe revisar una persona o el agente.
    """

    created: list[str] = field(default_factory=list)
    existing: list[str] = field(default_factory=list)
    gitignore_added: list[str] = field(default_factory=list)
    gitignore_removed: list[str] = field(default_factory=list)
    pending: list[str] = field(default_factory=list)

    def changes(self) -> bool:
        """Indica si hay algo creado o modificado (o por crear o modificar con ``--check``)."""
        return bool(self.created or self.gitignore_added or self.gitignore_removed)


def read_ini_value(content: str, key: str) -> str:
    """Devuelve el valor de una clave de facturascripts.ini sin comillas, o una cadena vacía."""
    match = re.search(rf'^\s*{key}\s*=\s*(.*?)\s*$', content, re.MULTILINE)
    if not match:
        return ''
    value = match.group(1)
    if len(value) >= 2 and value[0] == value[-1] and value[0] in '\'"':
        value = value[1:-1]
    return value.strip()


def detect_project(root: Path) -> Project | None:
    """Detecta si la carpeta es un plugin o el core; devuelve ``None`` si no es ninguno."""
    ini = root / 'facturascripts.ini'
    if ini.is_file():
        content = ini.read_text(encoding='utf-8', errors='replace')
        name = read_ini_value(content, 'name') or root.name
        return Project(root, 'plugin', name, read_ini_value(content, 'description'))
    if (root / 'Core' / 'Kernel.php').is_file():
        return Project(root, 'core', 'FacturaScripts')
    return None


def is_empty_folder(path: Path) -> bool:
    """Indica si la carpeta no tiene archivos, sin contar los del sistema operativo."""
    return not any(child.name not in IGNORED_FILES for child in path.iterdir())


def write_file(project: Project, relative: str, content: str, report: Report, check: bool) -> None:
    """Crea el archivo si no existe y lo anota en el informe; nunca lo sobrescribe."""
    path = project.root / relative
    if path.exists():
        report.existing.append(relative)
        return
    report.created.append(relative)
    if not check:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding='utf-8')


def ensure_folders(project: Project, report: Report, check: bool) -> None:
    """Crea las carpetas de Doc y añade .gitkeep a las que estén vacías."""
    for folder in EMPTY_FOLDERS:
        path = project.root / folder
        if not path.is_dir():
            report.created.append(f'{folder}/')
            report.created.append(f'{folder}/.gitkeep')
            if not check:
                path.mkdir(parents=True, exist_ok=True)
                (path / '.gitkeep').touch()
        elif is_empty_folder(path):
            report.created.append(f'{folder}/.gitkeep')
            if not check:
                (path / '.gitkeep').touch()
        else:
            report.existing.append(f'{folder}/')


def merge_gitignore(content: str) -> tuple[str, list[str], list[str]]:
    """Quita las reglas que impiden versionar la estructura y añade las que faltan de la plantilla.

    Las reglas que faltan de una sección de la plantilla se insertan tras la última regla de esa sección que ya
    exista; si no hay ninguna, la sección se añade al final con su comentario. Devuelve el contenido nuevo, las
    reglas añadidas y las quitadas.
    """
    def same(line: str) -> str:
        # «/CLAUDE.local.md» y «CLAUDE.local.md» cubren el mismo archivo de la raíz
        return line.strip().lstrip('/')

    lines = content.splitlines()
    removed = [line.strip() for line in lines if line.strip() in GITIGNORE_CONFLICTS]
    kept = [line for line in lines if line.strip() not in GITIGNORE_CONFLICTS]

    added: list[str] = []
    blocks: list[list[str]] = []
    for section in GITIGNORE_TEMPLATE.strip().split('\n\n'):
        section_lines = section.splitlines()
        comment = section_lines[0] if section_lines[0].startswith('#') else ''
        rules = [line for line in section_lines if not line.startswith('#')]
        stripped = [same(line) for line in kept]
        missing = [rule for rule in rules if same(rule) not in stripped]
        if not missing:
            continue
        added.extend(missing)

        # tras la última regla de la sección que ya existe, para no repetir su comentario
        positions = [index for index, line in enumerate(stripped) if line in {same(rule) for rule in rules}]
        if positions:
            kept[max(positions) + 1:max(positions) + 1] = missing
        else:
            blocks.append(([comment] if comment and comment.strip() not in stripped else []) + missing)

    if not added and not removed:
        return content, added, removed

    while kept and not kept[-1].strip():
        kept.pop()
    result = '\n'.join(kept)
    for block in blocks:
        result += ('\n\n' if result else '') + '\n'.join(block)
    return result + '\n', added, removed


def ensure_gitignore(project: Project, report: Report, check: bool) -> None:
    """Crea el .gitignore o lo completa con las reglas de la plantilla."""
    path = project.root / '.gitignore'
    if not path.exists():
        write_file(project, '.gitignore', GITIGNORE_TEMPLATE, report, check)
        return

    content = path.read_text(encoding='utf-8', errors='replace')
    merged, added, removed = merge_gitignore(content)
    report.gitignore_added.extend(added)
    report.gitignore_removed.extend(removed)
    if not added and not removed:
        report.existing.append('.gitignore')
    elif not check:
        path.write_text(merged, encoding='utf-8')


def check_forja_page(section: str, page: str, fields: object, pages: dict, folder: Path) -> list[str]:
    """Devuelve los problemas de una página de Doc/forja.json: archivo, campos, tipos y valores."""
    where = f'Doc/forja.json: {section} › {page}'
    problems = []
    if not (folder / page).is_file():
        problems.append(f'{where} no existe en Doc/{section}/')
    if not isinstance(fields, dict):
        return problems + [f'{where} debe ser un objeto con sus campos']

    for name, value in fields.items():
        expected = FORJA_FIELDS.get(name)
        if expected is None:
            problems.append(f'{where}: campo desconocido «{name}» (admitidos: {", ".join(FORJA_FIELDS)})')
        elif not isinstance(value, expected) or (expected is int and isinstance(value, bool)):
            tipo = {str: 'texto', int: 'número entero', bool: 'true o false'}[expected]
            problems.append(f'{where}: «{name}» debe ser {tipo}')
        elif name in FORJA_MAX_LENGTH and len(value) > FORJA_MAX_LENGTH[name]:
            problems.append(f'{where}: «{name}» tiene {len(value)} caracteres y el máximo es '
                            f'{FORJA_MAX_LENGTH[name]}')
        elif name == 'color' and value not in FORJA_COLORS:
            problems.append(f'{where}: color «{value}» no admitido ({", ".join(FORJA_COLORS)})')
        elif name == 'parent' and value not in pages and not (folder / value).is_file():
            problems.append(f'{where}: la página padre «{value}» no existe en Doc/{section}/')
    return problems


def ensure_forja(project: Project, report: Report, check: bool) -> None:
    """Crea Doc/forja.json, añade las secciones que falten y valida sus páginas.

    Solo reescribe el archivo para añadir una sección que falta; los problemas de las páginas (archivos que no
    existen, campos desconocidos o valores no admitidos) quedan como pendientes.
    """
    path = project.root / 'Doc/forja.json'
    if not path.exists():
        write_file(project, 'Doc/forja.json', FORJA_TEMPLATE, report, check)
        return

    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        report.pending.append(f'Doc/forja.json no es un JSON válido: {error}')
        return
    if not isinstance(data, dict):
        report.pending.append('Doc/forja.json debe ser un objeto con las secciones User y Dev')
        return

    missing = [section for section in FORJA_SECTIONS if section not in data]
    for section in missing:
        data[section] = {}
        report.created.append(f'Doc/forja.json: sección «{section}»')
    if missing and not check:
        path.write_text(json.dumps(data, indent=4, ensure_ascii=False) + '\n', encoding='utf-8')
    elif not missing:
        report.existing.append('Doc/forja.json')

    for section, pages in data.items():
        if section not in FORJA_SECTIONS:
            report.pending.append(f'Doc/forja.json: sección desconocida «{section}» (admitidas: User y Dev)')
        elif not isinstance(pages, dict):
            report.pending.append(f'Doc/forja.json: la sección «{section}» debe ser un objeto con sus páginas')
        else:
            folder = project.root / 'Doc' / section
            for page, fields in pages.items():
                report.pending.extend(check_forja_page(section, page, fields, pages, folder))


def check_agent_files(project: Project, report: Report) -> None:
    """Añade como pendiente un CLAUDE.md con instrucciones propias o un AGENTS.md sin enlace a Doc/."""
    claude = project.root / 'CLAUDE.md'
    if claude.is_file():
        lines = [line.strip() for line in claude.read_text(encoding='utf-8', errors='replace').splitlines()]
        own = [line for line in lines if line and line != '@AGENTS.md']
        if '@AGENTS.md' not in lines:
            report.pending.append('CLAUDE.md no importa AGENTS.md: mueve sus instrucciones a AGENTS.md y deja '
                                  'solo la línea @AGENTS.md')
        elif own:
            report.pending.append('CLAUDE.md tiene instrucciones además de @AGENTS.md: muévelas a AGENTS.md')

    agents = project.root / 'AGENTS.md'
    if agents.is_file() and 'Doc/' not in agents.read_text(encoding='utf-8', errors='replace'):
        report.pending.append('AGENTS.md no enlaza la documentación: añade el enlace a Doc/Context/README.md y '
                              'la tabla de Doc/')


def check_ignored_paths(project: Project, report: Report) -> None:
    """Avisa de las rutas de la estructura que el .gitignore sigue ignorando.

    Solo se comprueba cuando la carpeta es la raíz de su repositorio git: un plugin sin repositorio propio dentro
    del core heredaría las reglas del core (``/Plugins/``) y daría falsos avisos.
    """
    try:
        toplevel = subprocess.run(
            ['git', '-C', str(project.root), 'rev-parse', '--show-toplevel'],
            capture_output=True, text=True, check=False,
        )
    except OSError:
        return
    if toplevel.returncode != 0 or Path(toplevel.stdout.strip()).resolve() != project.root.resolve():
        return

    result = subprocess.run(
        ['git', '-C', str(project.root), 'check-ignore', '--no-index', '-v', *VERSIONED_PATHS],
        capture_output=True, text=True, check=False,
    )
    ignored: dict[tuple[str, str], list[str]] = {}
    for line in result.stdout.splitlines():
        rule, _, path = line.partition('\t')
        source, _, pattern = rule.rpartition(':')
        if pattern.startswith('!') or pattern.strip() in GITIGNORE_CONFLICTS:
            # una excepción no ignora nada, y las reglas en conflicto ya las quita (o quitaría) el script
            continue
        ignored.setdefault((pattern, source), []).append(path)

    for (pattern, source), paths in ignored.items():
        note = ''
        if pattern.strip('/') == 'doc':
            note = ' (con core.ignoreCase, que es lo habitual en macOS y Windows, «doc» también ignora «Doc»)'
        report.pending.append(f'la regla «{pattern}» ({source}) ignora {", ".join(paths)}{note}: quítala o '
                              'añade una excepción')


def build_structure(project: Project, check: bool = False) -> Report:
    """Crea o comprueba la estructura completa de documentación del proyecto."""
    report = Report()
    ensure_folders(project, report, check)
    write_file(project, 'Doc/Context/README.md', CONTEXT_README_TEMPLATE.format(name=project.name), report, check)
    ensure_forja(project, report, check)
    write_file(project, 'AGENTS.md', AGENTS_TEMPLATE.format(intro=project.intro()), report, check)
    write_file(project, 'CLAUDE.md', '@AGENTS.md\n', report, check)
    ensure_gitignore(project, report, check)
    check_agent_files(project, report)
    check_ignored_paths(project, report)
    return report


def print_report(project: Project, report: Report, check: bool) -> None:
    """Muestra el informe en texto legible."""
    tipo = 'core' if project.kind == 'core' else 'plugin'
    print(f'Estructura de documentación del {tipo} {project.name} ({project.root})')
    verb = 'Falta' if check else 'Creado'
    for path in report.created:
        print(f'  + {verb}: {path}')
    for rule in report.gitignore_removed:
        print(f'  - .gitignore: {"se quitaría" if check else "quitada"} la regla «{rule}»')
    for rule in report.gitignore_added:
        print(f'  + .gitignore: {"falta" if check else "añadida"} la regla «{rule}»')
    if not report.changes():
        print('  La estructura ya estaba completa.')
    for item in report.pending:
        print(f'  ! Pendiente: {item}')


def main(argv: list[str] | None = None) -> int:
    """Punto de entrada: crea o comprueba la estructura y devuelve el código de salida."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('path', nargs='?', default='.', help='carpeta del plugin o del core')
    parser.add_argument('--check', action='store_true', help='solo informa de lo que falta, sin escribir')
    parser.add_argument('--json', action='store_true', help='muestra el informe en JSON')
    args = parser.parse_args(argv)

    project = detect_project(Path(args.path).resolve())
    if project is None:
        print(f'Error: {args.path} no es un plugin (facturascripts.ini) ni el core (Core/Kernel.php).',
              file=sys.stderr)
        return 2

    report = build_structure(project, args.check)
    if args.json:
        print(json.dumps({
            'root': str(project.root), 'kind': project.kind, 'name': project.name, 'check': args.check,
            'created': report.created, 'existing': report.existing,
            'gitignore_added': report.gitignore_added, 'gitignore_removed': report.gitignore_removed,
            'pending': report.pending,
        }, ensure_ascii=False, indent=2))
    else:
        print_report(project, report, args.check)

    if report.pending or (args.check and report.changes()):
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
