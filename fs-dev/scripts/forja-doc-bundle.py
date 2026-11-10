#!/usr/bin/env python3
"""Empaqueta y desempaqueta la documentación de un plugin o del core para la forja de facturascripts.com.

La API de autor de la forja intercambia la documentación como un zip con la misma estructura que la carpeta
``Doc/`` de un plugin, ya con las imágenes incluidas y los enlaces relativos resueltos. El mismo formato sirve
para bajar y para subir:

- ``User/*.md`` y ``Dev/*.md``: las páginas de uso y de programación.
- ``Assets/**``: las imágenes y archivos que enlazan las páginas.
- ``forja.json``: los datos de cada página (título, padre, orden, icono...), con el mismo formato que
  ``Doc/forja.json`` y que valida ``create-doc-structure.py``.

Comandos:

``unpack <bundle.zip> <plugin_dir> [--type user|dev|all] [--dry-run]``
    Coloca el contenido del zip en ``<plugin_dir>/Doc``. Acepta también el prefijo ``Doc/`` en las rutas del zip.
    Las páginas del zip reemplazan su entrada de ``Doc/forja.json`` y las locales que no vienen se conservan.
    Quita los ``.gitkeep`` de las carpetas que quedan con contenido, valida el resultado e imprime un resumen.
    Rechaza el zip entero, sin escribir nada, si alguna ruta es absoluta, sale de la carpeta con ``..`` o es un
    enlace simbólico. ``--dry-run`` aplica los cambios sobre una copia temporal y solo informa.

``pack <plugin_dir> <out.zip> [--pages User/a.md ...] [--type user|dev|all]``
    Crea el zip con las páginas elegidas (o todas las del tipo indicado), sus entradas de ``forja.json`` y las
    imágenes de ``Doc/Assets`` que enlazan (``../Assets/...`` en el cuerpo e ``imageurl`` ``Doc/Assets/...``).
    Avisa de imágenes o enlaces ``.md`` que no existen y de títulos repetidos. Los cuerpos de menos de 300
    caracteres (el servidor los rechaza) y los problemas de ``forja.json`` son errores bloqueantes: en ese caso
    no escribe el zip.

Código de salida: 0 si todo va bien (aunque haya avisos), 1 si hay errores bloqueantes y 2 si la ruta del
plugin, del core o del zip no es válida.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import posixpath
import re
import shutil
import stat
import sys
import tempfile
import zipfile
from dataclasses import dataclass, field
from pathlib import Path
from types import ModuleType
from urllib.parse import unquote


def load_doc_structure() -> ModuleType:
    """Importa ``create-doc-structure.py``, que tiene guion en el nombre, para reutilizar su validación."""
    name = 'create_doc_structure'
    if name in sys.modules:
        return sys.modules[name]
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name('create-doc-structure.py'))
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    # las dataclasses del módulo necesitan encontrarlo en sys.modules mientras se ejecuta
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


DOCS = load_doc_structure()

# Secciones de forja.json que incluye cada valor de --type.
TYPE_SECTIONS = {
    'user': ('User',),
    'dev': ('Dev',),
    'all': tuple(DOCS.FORJA_SECTIONS),
}

# Longitud mínima del cuerpo de una página, en caracteres; el servidor rechaza las más cortas.
MIN_BODY_LENGTH = 300

# Límites del zip descomprimido, para no llenar el disco con un archivo malicioso.
MAX_ENTRIES = 5000
MAX_UNCOMPRESSED = 200 * 1024 * 1024

# Archivos del sistema operativo o de git que se ignoran sin avisar.
IGNORED_NAMES = {'.DS_Store', 'Thumbs.db', '.gitkeep'}

# Fecha fija de las entradas del zip, para que el mismo contenido genere el mismo archivo.
ZIP_DATE = (1980, 1, 1, 0, 0, 0)

# Destinos de un enlace en Markdown: [texto](destino "título"), ![alt](<destino con espacios>)...
LINK_PATTERN = re.compile(r'!?\[[^\]]*\]\(\s*(<[^>]*>|[^)\s]+)(?:\s+(?:"[^"]*"|\'[^\']*\'))?\s*\)')
# Definiciones de enlaces por referencia: [id]: destino
REFERENCE_PATTERN = re.compile(r'^\s{0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)', re.MULTILINE)
# Imágenes en HTML: <img src="destino">
IMG_PATTERN = re.compile(r'<img\b[^>]*?\bsrc\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)
# Bloques de código, que no se revisan: ```...``` o ~~~...~~~
FENCE_PATTERN = re.compile(r'^\s*(`{3,}|~{3,}).*?^\s*\1[`~]*\s*$', re.MULTILINE | re.DOTALL)
# Código en línea: `...`
INLINE_CODE_PATTERN = re.compile(r'`[^`\n]*`')
# Esquema de una URL (https:, mailto:...), que no apunta a un archivo de Doc/.
SCHEME_PATTERN = re.compile(r'^[A-Za-z][A-Za-z0-9+.-]*:')


class UnsafePathError(ValueError):
    """Ruta del zip o de una página que es absoluta o que sale de su carpeta."""


@dataclass
class Bundle:
    """Contenido leído de un zip de documentación.

    Attributes:
        pages: páginas por su ruta (``User/a.md``) con su contenido.
        assets: archivos de ``Assets`` por su ruta (``Assets/a/01.png``) con su contenido.
        forja: contenido de ``forja.json``, o ``None`` si el zip no lo trae.
    """

    pages: dict[str, bytes] = field(default_factory=dict)
    assets: dict[str, bytes] = field(default_factory=dict)
    forja: dict | None = None


@dataclass
class Result:
    """Resultado de ``unpack`` o de ``pack``.

    Attributes:
        created: archivos creados (rutas relativas a la raíz del plugin).
        updated: archivos que existían y cambian.
        unchanged: archivos que ya tenían el mismo contenido.
        removed: ``.gitkeep`` quitados de carpetas con contenido.
        packed: archivos incluidos en el zip (rutas dentro del zip).
        notes: información para el resumen que no es un problema (entradas de forja.json, páginas omitidas...).
        warnings: problemas que no impiden terminar.
        errors: problemas bloqueantes; con alguno, no se escribe nada.
    """

    created: list[str] = field(default_factory=list)
    updated: list[str] = field(default_factory=list)
    unchanged: list[str] = field(default_factory=list)
    removed: list[str] = field(default_factory=list)
    packed: list[str] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


def safe_relative(name: str) -> str:
    """Normaliza una ruta con ``/`` y la devuelve sin partes vacías ni ``.``.

    Lanza ``UnsafePathError`` si la ruta es absoluta (``/x``, ``C:x``) o tiene alguna parte ``..``.
    """
    clean = name.replace('\\', '/')
    if clean.startswith('/') or re.match(r'^[A-Za-z]:', clean):
        raise UnsafePathError(f'la ruta «{name}» es absoluta')
    parts = [part for part in clean.split('/') if part not in ('', '.')]
    if '..' in parts:
        raise UnsafePathError(f'la ruta «{name}» sale de su carpeta con «..»')
    return '/'.join(parts)


def strip_doc_prefix(relative: str) -> str:
    """Quita el prefijo ``Doc/`` de una ruta del zip o de una página."""
    return relative[4:] if relative.startswith('Doc/') else relative


def is_page_path(relative: str, sections: tuple[str, ...] = tuple(DOCS.FORJA_SECTIONS)) -> bool:
    """Indica si la ruta es una página ``<Sección>/<archivo>.md`` de una de las secciones."""
    parts = relative.split('/')
    return len(parts) == 2 and parts[0] in sections and parts[1].endswith('.md') and len(parts[1]) > 3


def is_inside(path: Path, root: Path) -> bool:
    """Indica si la ruta, resolviendo los enlaces simbólicos, queda dentro de la carpeta."""
    try:
        path.resolve().relative_to(root.resolve())
    except ValueError:
        return False
    return True


def page_title(page: str, fields: object) -> str:
    """Devuelve el título con el que se publica la página: ``title`` o el nombre del archivo formateado."""
    if isinstance(fields, dict) and isinstance(fields.get('title'), str) and fields['title'].strip():
        return fields['title'].strip()
    name = page[:-3] if page.endswith('.md') else page
    name = re.sub(r'[-_]+', ' ', name).strip()
    return name[:1].upper() + name[1:]


def link_targets(text: str) -> list[str]:
    """Devuelve los destinos de los enlaces e imágenes del Markdown, sin mirar dentro del código."""
    text = FENCE_PATTERN.sub('', text)
    text = INLINE_CODE_PATTERN.sub('', text)
    targets = []
    for pattern in (LINK_PATTERN, REFERENCE_PATTERN, IMG_PATTERN):
        for match in pattern.finditer(text):
            target = match.group(1).strip()
            if target.startswith('<') and target.endswith('>'):
                target = target[1:-1].strip()
            targets.append(target)
    return targets


def resolve_link(section: str, target: str) -> str | None:
    """Resuelve el destino de un enlace de una página de ``Doc/<section>`` a una ruta relativa a ``Doc``.

    Devuelve ``None`` si no apunta a un archivo de la documentación (URL, ancla o ruta absoluta de la web). La
    ruta devuelta empieza por ``../`` si sale de ``Doc``.
    """
    if not target or target.startswith(('#', '/')) or SCHEME_PATTERN.match(target):
        return None
    target = unquote(target.split('#', 1)[0].split('?', 1)[0]).replace('\\', '/')
    if not target:
        return None
    return posixpath.normpath(posixpath.join(section, target))


def resolve_imageurl(value: str) -> str | None:
    """Resuelve el ``imageurl`` de ``forja.json`` a una ruta relativa a ``Doc``; ``None`` si es una URL."""
    value = value.strip()
    if not value or SCHEME_PATTERN.match(value) or value.startswith('//'):
        return None
    path = posixpath.normpath(value.replace('\\', '/'))
    if path.startswith('Doc/'):
        return path[4:]
    if path.startswith('../'):
        return posixpath.normpath(posixpath.join(DOCS.FORJA_SECTIONS[0], path))
    return path


def page_assets(section: str, text: str, fields: object) -> set[str]:
    """Devuelve las rutas de ``Assets`` (relativas a ``Doc``) que usa una página en su cuerpo o en ``imageurl``."""
    assets = set()
    for target in link_targets(text):
        resolved = resolve_link(section, target)
        if resolved and resolved.startswith('Assets/'):
            assets.add(resolved)
    if isinstance(fields, dict) and isinstance(fields.get('imageurl'), str):
        resolved = resolve_imageurl(fields['imageurl'])
        if resolved and resolved.startswith('Assets/'):
            assets.add(resolved)
    return assets


def check_page_links(page: str, text: str, fields: object, doc: Path) -> list[str]:
    """Devuelve los avisos de los enlaces e imágenes de una página: archivos que no existen o fuera de lugar."""
    section = page.split('/')[0]
    warnings = []
    for target in dict.fromkeys(link_targets(text)):
        resolved = resolve_link(section, target)
        if resolved is None:
            continue
        if resolved == '..' or resolved.startswith('../'):
            warnings.append(f'{page}: el enlace «{target}» sale de Doc/')
        elif not (doc / resolved).is_file():
            kind = 'la imagen' if resolved.startswith('Assets/') else 'el enlace'
            warnings.append(f'{page}: {kind} «{target}» no existe (Doc/{resolved})')
        elif resolved.endswith('.md') and resolved.split('/')[0] not in DOCS.FORJA_SECTIONS:
            warnings.append(f'{page}: el enlace «{target}» apunta a Doc/{resolved}, que no se publica')

    if isinstance(fields, dict) and isinstance(fields.get('imageurl'), str):
        value = fields['imageurl']
        resolved = resolve_imageurl(value)
        if resolved is not None and not resolved.startswith('Assets/'):
            warnings.append(f'{page}: el imageurl «{value}» no está en Doc/Assets/')
        elif resolved is not None and not (doc / resolved).is_file():
            warnings.append(f'{page}: el imageurl «{value}» no existe (Doc/{resolved})')
    return warnings


def load_forja(path: Path, result: Result) -> dict | None:
    """Lee ``Doc/forja.json``; si no existe, devuelve las secciones vacías y, si no es válido, anota el error."""
    if not path.is_file():
        return {section: {} for section in DOCS.FORJA_SECTIONS}
    try:
        data = json.loads(path.read_text(encoding='utf-8-sig'))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        result.errors.append(f'Doc/forja.json no es un JSON válido: {error}')
        return None
    if not isinstance(data, dict):
        result.errors.append('Doc/forja.json debe ser un objeto con las secciones User y Dev')
        return None
    for section in DOCS.FORJA_SECTIONS:
        data.setdefault(section, {})
        if not isinstance(data[section], dict):
            result.errors.append(f'Doc/forja.json: la sección «{section}» debe ser un objeto con sus páginas')
            return None
    return data


def read_bundle(zip_path: Path, result: Result) -> Bundle | None:
    """Lee el zip de documentación y clasifica su contenido; devuelve ``None`` si hay errores bloqueantes."""
    bundle = Bundle()
    try:
        archive = zipfile.ZipFile(zip_path)
    except (OSError, zipfile.BadZipFile) as error:
        result.errors.append(f'{zip_path} no es un zip válido: {error}')
        return None

    with archive:
        infos = archive.infolist()
        if len(infos) > MAX_ENTRIES:
            result.errors.append(f'el zip tiene {len(infos)} entradas y el máximo es {MAX_ENTRIES}')
        if sum(info.file_size for info in infos) > MAX_UNCOMPRESSED:
            result.errors.append(f'el zip descomprimido ocupa más de {MAX_UNCOMPRESSED // (1024 * 1024)} MB')

        entries: list[tuple[str, zipfile.ZipInfo]] = []
        for info in infos:
            try:
                relative = strip_doc_prefix(safe_relative(info.filename))
            except UnsafePathError as error:
                result.errors.append(f'ruta peligrosa en el zip: {error}')
                continue
            if stat.S_ISLNK(info.external_attr >> 16):
                result.errors.append(f'ruta peligrosa en el zip: «{info.filename}» es un enlace simbólico')
                continue
            if info.is_dir() or not relative:
                continue
            if relative.startswith('__MACOSX/') or relative.split('/')[-1] in IGNORED_NAMES:
                continue
            entries.append((relative, info))
        if result.errors:
            return None

        for relative, info in entries:
            if relative in bundle.pages or relative in bundle.assets or (
                    relative == 'forja.json' and bundle.forja is not None):
                result.warnings.append(f'el zip trae «{relative}» repetido (con y sin Doc/): se usa el primero')
                continue
            if relative == 'forja.json':
                try:
                    forja = json.loads(archive.read(info).decode('utf-8-sig'))
                except (UnicodeDecodeError, json.JSONDecodeError) as error:
                    result.errors.append(f'el forja.json del zip no es un JSON válido: {error}')
                    return None
                if not isinstance(forja, dict):
                    result.errors.append('el forja.json del zip debe ser un objeto con las secciones User y Dev')
                    return None
                bundle.forja = forja
            elif is_page_path(relative):
                bundle.pages[relative] = archive.read(info)
            elif relative.startswith('Assets/'):
                bundle.assets[relative] = archive.read(info)
            else:
                result.warnings.append(f'el zip trae «{relative}», que no es una página de User/ o Dev/, un '
                                       'archivo de Assets/ ni forja.json: se omite')
    return bundle


def write_bytes(path: Path, data: bytes, label: str, result: Result) -> None:
    """Escribe el archivo si no existe o ha cambiado y lo anota como creado, actualizado o sin cambios."""
    if path.is_file():
        if path.read_bytes() == data:
            result.unchanged.append(label)
            return
        result.updated.append(label)
    else:
        result.created.append(label)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def merge_forja(local: dict, incoming: dict | None, sections: tuple[str, ...], result: Result) -> dict:
    """Combina el ``forja.json`` del zip con el local.

    Las páginas del zip reemplazan su entrada en las secciones elegidas; las locales que no vienen se conservan
    y las nuevas se añaden al final de su sección.
    """
    merged = json.loads(json.dumps(local))
    if incoming is None:
        result.warnings.append('el zip no trae forja.json: se conservan las entradas locales')
        return merged

    replaced = added = same = 0
    for section, pages in incoming.items():
        if section not in DOCS.FORJA_SECTIONS:
            result.warnings.append(f'el forja.json del zip tiene la sección desconocida «{section}»: se omite')
            continue
        if section not in sections:
            continue
        if not isinstance(pages, dict):
            result.warnings.append(f'el forja.json del zip: la sección «{section}» no es un objeto: se omite')
            continue
        for page, fields in pages.items():
            if not is_page_path(f'{section}/{page}'):
                result.warnings.append(f'el forja.json del zip: «{section} › {page}» no es un archivo .md de '
                                       f'Doc/{section}/: se omite')
                continue
            if page not in merged[section]:
                added += 1
            elif merged[section][page] == fields:
                same += 1
            else:
                replaced += 1
            merged[section][page] = fields

    kept = sum(len(merged[section]) for section in DOCS.FORJA_SECTIONS) - replaced - added - same
    result.notes.append(f'forja.json: {replaced} entradas reemplazadas, {added} añadidas, {same} iguales y '
                        f'{kept} locales conservadas')
    return merged


def remove_gitkeeps(doc: Path, result: Result) -> None:
    """Quita el ``.gitkeep`` de ``Doc/User``, ``Doc/Dev`` y ``Doc/Assets`` cuando tienen otro contenido."""
    for folder in DOCS.EMPTY_FOLDERS:
        path = doc.parent / folder
        gitkeep = path / '.gitkeep'
        if gitkeep.is_file() and any(child.name not in IGNORED_NAMES for child in path.iterdir()):
            gitkeep.unlink()
            result.removed.append(f'{folder}/.gitkeep')


def apply_bundle(doc: Path, bundle: Bundle, sections: tuple[str, ...], result: Result) -> None:
    """Escribe en ``doc`` las páginas, los archivos de ``Assets`` y el ``forja.json`` combinado, y lo valida."""
    local = load_forja(doc / 'forja.json', result)
    if local is None:
        return

    pages = {path: data for path, data in bundle.pages.items() if path.split('/')[0] in sections}
    omitted = len(bundle.pages) - len(pages)
    if omitted:
        result.notes.append(f'{omitted} páginas omitidas por --type')
    merged = merge_forja(local, bundle.forja, sections, result)

    texts = {path: data.decode('utf-8', errors='replace') for path, data in pages.items()}
    if sections == TYPE_SECTIONS['all']:
        assets = dict(bundle.assets)
    else:
        # con un solo tipo, solo los archivos de Assets que usan sus páginas
        used = set()
        for path, text in texts.items():
            section, page = path.split('/')
            used |= page_assets(section, text, merged[section].get(page))
        assets = {path: data for path, data in bundle.assets.items() if path in used}
        if len(assets) < len(bundle.assets):
            result.notes.append(f'{len(bundle.assets) - len(assets)} archivos de Assets omitidos por --type')

    for path, data in sorted({**pages, **assets}.items()):
        target = doc / path
        if not is_inside(target, doc):
            result.errors.append(f'Doc/{path} apunta fuera de Doc/ (enlace simbólico): no se escribe')
            continue
        write_bytes(target, data, f'Doc/{path}', result)

    forja_path = doc / 'forja.json'
    if forja_path.is_file() and merged == local:
        result.unchanged.append('Doc/forja.json')
    else:
        content = json.dumps(merged, indent=4, ensure_ascii=False) + '\n'
        write_bytes(forja_path, content.encode('utf-8'), 'Doc/forja.json', result)

    remove_gitkeeps(doc, result)

    for section in DOCS.FORJA_SECTIONS:
        for page, fields in merged[section].items():
            result.warnings.extend(DOCS.check_forja_page(section, page, fields, merged[section], doc / section))
    for path, text in sorted(texts.items()):
        section, page = path.split('/')
        result.warnings.extend(check_page_links(path, text, merged[section].get(page), doc))


def unpack(bundle_path: Path, root: Path, doc_type: str = 'all', dry_run: bool = False) -> Result:
    """Coloca la documentación del zip en ``<root>/Doc``; con ``dry_run`` trabaja sobre una copia temporal."""
    result = Result()
    bundle = read_bundle(bundle_path, result)
    if bundle is None:
        return result

    sections = TYPE_SECTIONS[doc_type]
    doc = root / 'Doc'
    if not dry_run:
        doc.mkdir(parents=True, exist_ok=True)
        apply_bundle(doc, bundle, sections, result)
        return result

    with tempfile.TemporaryDirectory() as tmp:
        copy = Path(tmp) / 'Doc'
        if doc.is_dir():
            # Context no se toca y puede ser grande: no hace falta copiarlo
            shutil.copytree(doc, copy, symlinks=True,
                            ignore=lambda folder, names: ['Context'] if Path(folder) == doc else [])
        else:
            copy.mkdir()
        apply_bundle(copy, bundle, sections, result)
    return result


def select_pages(doc: Path, pages: list[str] | None, sections: tuple[str, ...], result: Result) -> list[str]:
    """Devuelve las páginas que se empaquetan (``User/a.md``): las indicadas o todas las de las secciones."""
    if not pages:
        selected = []
        for section in sections:
            for path in sorted((doc / section).glob('*.md')):
                # un enlace simbólico a un archivo de fuera de Doc/ lo publicaría en la web
                if path.is_file() and not is_inside(path, doc):
                    result.errors.append(f'Doc/{section}/{path.name} enlaza a un archivo fuera de Doc/')
                elif path.is_file():
                    selected.append(f'{section}/{path.name}')
        return selected

    selected = []
    for page in pages:
        try:
            relative = strip_doc_prefix(safe_relative(page))
        except UnsafePathError as error:
            result.errors.append(f'--pages: {error}')
            continue
        if not is_page_path(relative):
            result.errors.append(f'--pages: «{page}» no es una página User/<archivo>.md ni Dev/<archivo>.md')
        elif relative.split('/')[0] not in sections:
            result.errors.append(f'--pages: «{page}» no es del tipo elegido con --type')
        elif not (doc / relative).is_file() or not is_inside(doc / relative, doc):
            result.errors.append(f'--pages: Doc/{relative} no existe')
        elif relative not in selected:
            selected.append(relative)
    return selected


def check_titles(packed: list[str], forja: dict, doc: Path, result: Result) -> None:
    """Avisa de los títulos repetidos entre las páginas del paquete y el resto de páginas locales."""
    owners: dict[str, list[tuple[str, str]]] = {}
    for section in DOCS.FORJA_SECTIONS:
        names = {path.name for path in (doc / section).glob('*.md') if path.is_file()} | set(forja[section])
        for name in sorted(names):
            title = page_title(name, forja[section].get(name))
            owners.setdefault(title.casefold(), []).append((title, f'{section}/{name}'))
    for pages in owners.values():
        paths = [path for _, path in pages]
        if len(paths) > 1 and any(path in packed for path in paths):
            result.warnings.append(f'título «{pages[0][0]}» repetido en {", ".join(paths)}')


def pack(root: Path, out: Path, pages: list[str] | None = None, doc_type: str = 'all') -> Result:
    """Crea el zip con las páginas elegidas, sus entradas de ``forja.json`` y los archivos de ``Assets`` que usan."""
    result = Result()
    doc = root / 'Doc'
    if not doc.is_dir():
        result.errors.append(f'{root} no tiene carpeta Doc/')
        return result
    forja = load_forja(doc / 'forja.json', result)
    if forja is None:
        return result
    if not (doc / 'forja.json').is_file():
        result.warnings.append('no existe Doc/forja.json: las páginas se publicarán con el nombre del archivo')

    sections = TYPE_SECTIONS[doc_type]
    selected = select_pages(doc, pages, sections, result)
    if not selected and not result.errors:
        result.errors.append('no hay páginas que empaquetar')
    if result.errors:
        return result

    entries: dict[str, dict] = {section: {} for section in DOCS.FORJA_SECTIONS}
    assets: set[str] = set()
    for path in selected:
        section, page = path.split('/')
        try:
            text = (doc / path).read_text(encoding='utf-8')
        except UnicodeDecodeError:
            result.errors.append(f'{path} no es UTF-8 válido')
            continue
        length = len(text.strip())
        if length < MIN_BODY_LENGTH:
            result.errors.append(f'{path} tiene {length} caracteres y el servidor rechaza los cuerpos de menos '
                                 f'de {MIN_BODY_LENGTH}')

        fields = forja[section].get(page)
        if fields is None:
            result.warnings.append(f'{path} no tiene entrada en Doc/forja.json: se publicará con el título '
                                   f'«{page_title(page, None)}»')
        else:
            result.errors.extend(DOCS.check_forja_page(section, page, fields, forja[section], doc / section))
            entries[section][page] = fields

        result.warnings.extend(check_page_links(path, text, fields, doc))
        assets |= {asset for asset in page_assets(section, text, fields) if (doc / asset).is_file()}

    check_titles(selected, forja, doc, result)
    if result.errors:
        return result

    files: list[tuple[str, bytes]] = [('forja.json', (json.dumps(entries, indent=4, ensure_ascii=False) + '\n')
                                       .encode('utf-8'))]
    files += [(path, (doc / path).read_bytes()) for path in selected if is_inside(doc / path, doc)]
    files += [(path, (doc / path).read_bytes()) for path in sorted(assets) if is_inside(doc / path, doc)]

    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as archive:
        for name, data in files:
            info = zipfile.ZipInfo(name, ZIP_DATE)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            archive.writestr(info, data)
            result.packed.append(name)
    return result


def print_result(title: str, result: Result, packing: bool) -> None:
    """Muestra el resultado en texto legible; ``packing`` indica si es el de ``pack``."""
    print(title)
    for label, paths in (('+ Creado', result.created), ('~ Actualizado', result.updated),
                         ('= Sin cambios', result.unchanged), ('- Quitado', result.removed),
                         ('+ Incluido', result.packed)):
        for path in paths:
            print(f'  {label}: {path}')
    for note in result.notes:
        print(f'  · {note}')
    for warning in result.warnings:
        print(f'  ! Aviso: {warning}')
    for error in result.errors:
        print(f'  ✗ Error: {error}')

    if packing:
        pages = sum(1 for path in result.packed if is_page_path(path))
        assets = sum(1 for path in result.packed if path.startswith('Assets/'))
        print(f'Resumen: {pages} páginas, {assets} archivos de Assets, {len(result.warnings)} avisos y '
              f'{len(result.errors)} errores')
    else:
        print(f'Resumen: {len(result.created)} creados, {len(result.updated)} actualizados, '
              f'{len(result.unchanged)} sin cambios, {len(result.warnings)} avisos y {len(result.errors)} errores')


def main(argv: list[str] | None = None) -> int:
    """Punto de entrada: ejecuta ``unpack`` o ``pack`` y devuelve el código de salida."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    commands = parser.add_subparsers(dest='command', required=True)

    unpack_parser = commands.add_parser('unpack', help='coloca el zip de documentación en Doc/ del plugin')
    unpack_parser.add_argument('bundle', help='zip descargado de la forja')
    unpack_parser.add_argument('plugin_dir', help='carpeta del plugin o del core')
    unpack_parser.add_argument('--type', choices=tuple(TYPE_SECTIONS), default='all', dest='doc_type',
                               help='secciones que se importan (por defecto, todas)')
    unpack_parser.add_argument('--dry-run', action='store_true', help='solo informa, sin escribir nada')

    pack_parser = commands.add_parser('pack', help='crea el zip de documentación para subirlo a la forja')
    pack_parser.add_argument('plugin_dir', help='carpeta del plugin o del core')
    pack_parser.add_argument('out', help='ruta del zip que se crea')
    pack_parser.add_argument('--pages', nargs='+', metavar='PÁGINA',
                             help='páginas que se empaquetan, como User/a.md (por defecto, todas)')
    pack_parser.add_argument('--type', choices=tuple(TYPE_SECTIONS), default='all', dest='doc_type',
                             help='secciones que se empaquetan (por defecto, todas)')
    args = parser.parse_args(argv)

    root = Path(args.plugin_dir).resolve()
    project = DOCS.detect_project(root)
    if project is None:
        print(f'Error: {args.plugin_dir} no es un plugin (facturascripts.ini) ni el core (Core/Kernel.php).',
              file=sys.stderr)
        return 2

    if args.command == 'unpack':
        bundle = Path(args.bundle)
        if not bundle.is_file():
            print(f'Error: no existe el zip {args.bundle}.', file=sys.stderr)
            return 2
        result = unpack(bundle, root, args.doc_type, args.dry_run)
        mode = ' (simulación: no se ha escrito nada)' if args.dry_run else ''
        print_result(f'Documentación de {bundle.name} en {root / "Doc"}{mode}', result, False)
    else:
        out = Path(args.out).resolve()
        result = pack(root, out, args.pages, args.doc_type)
        state = 'creado' if result.packed else 'no creado'
        print_result(f'Paquete de documentación de {project.name}: {out} ({state})', result, True)

    return 1 if result.errors else 0


if __name__ == '__main__':
    sys.exit(main())
