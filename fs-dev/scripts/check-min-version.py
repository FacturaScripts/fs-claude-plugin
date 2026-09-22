#!/usr/bin/env python3
"""Audita si un plugin de FacturaScripts cumple el ``min_version`` que declara.

El script extrae del código del plugin los símbolos que pertenecen al core
(clases, métodos, llamadas estáticas, propiedades y puntos de extensión
``pipe``) y comprueba, contra el repositorio git del core, en qué release
apareció cada uno. Con esa información calcula el ``min_version`` real del
plugin y lo compara con el declarado en ``facturascripts.ini``.

La comprobación no usa el historial de commits sino la presencia del símbolo en
cada etiqueta de versión (``git grep <patrón> <tag>``), de modo que los
renombrados de archivos o los cambios de firma no falsean el resultado. Las
versiones se comparan como decimales, igual que hace ``Kernel::version()``:
2025.11 es anterior a 2025.2.

Uso:
    check-min-version.py <ruta_plugin> [--core <ruta_core>] [--json]
                         [--include-tests] [--min-confidence alta|media|baja]

El script solo informa: nunca modifica el ``facturascripts.ini`` del plugin.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import threading
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from pathlib import Path

# Métodos y propiedades que nunca deben tratarse como símbolos del core.
IGNORED_MEMBERS = frozenset({
    '__construct', '__destruct', '__get', '__set', '__isset', '__unset',
    '__call', '__callStatic', '__toString', '__invoke', '__clone',
    'class', 'this', 'self', 'parent', 'static',
    # Métodos de clases nativas de PHP que aparecen en cualquier plugin.
    'getMessage', 'getCode', 'getLine', 'getFile', 'getTrace', 'getTraceAsString', 'getPrevious',
    'modify', 'format', 'diff', 'setDate', 'setTime', 'getTimestamp',
    'xpath', 'children', 'attributes', 'asXML', 'addChild', 'addAttribute',
    'prepare', 'execute', 'fetch', 'fetchAll', 'bindValue',
})

# Clases que no pertenecen al core de FacturaScripts.
IGNORED_CLASSES = frozenset({
    'Closure', 'Exception', 'Throwable', 'Error', 'ArrayAccess', 'Countable',
    'DateTime', 'DateTimeImmutable', 'DateInterval', 'Generator', 'Iterator',
    'IteratorAggregate', 'JsonSerializable', 'Traversable', 'stdClass',
    'PDO', 'PDOException', 'SplFileInfo', 'ZipArchive',
})

# Directorios que nunca contienen código de producción del plugin.
EXCLUDED_DIRS = frozenset({'vendor', 'node_modules', '.git'})
TEST_DIRS = frozenset({'Test', 'Tests', 'test', 'tests'})

# Subdirectorios de ``Extension/`` que reflejan la estructura de ``Core/``.
EXTENSION_NAMESPACES = ('Controller', 'Model', 'Lib', 'Table', 'Template', 'View', 'XMLView')

CONFIDENCE_ORDER = {'alta': 3, 'media': 2, 'baja': 1}

TAG_PATTERN = re.compile(r'^v?(\d{4}(?:\.\d+)?)$')
USE_PATTERN = re.compile(r'^\s*use\s+(FacturaScripts\\[\w\\]+)(?:\s+as\s+(\w+))?\s*;', re.MULTILINE)
EXTENDS_PATTERN = re.compile(r'\b(?:extends|implements)\s+([\w\\, ]+?)\s*[{\n]')
STATIC_CALL_PATTERN = re.compile(r'(?<![\w$>])([A-Z]\w*)::\s*(\w+)\s*\(')
METHOD_CALL_PATTERN = re.compile(r'->\s*(\w+)\s*\(')
# En Twig los métodos se invocan con punto: fsc.contact.getTwoFactorQR().
TWIG_CALL_PATTERN = re.compile(r'\.\s*(\w+)\s*\(')
PROPERTY_PATTERN = re.compile(r'->\s*(\w+)\b(?!\s*\()')
FUNCTION_DEF_PATTERN = re.compile(r'\bfunction\s+(\w+)\s*\(')
PROPERTY_DEF_PATTERN = re.compile(r'\b(?:public|protected|private)\s+(?:static\s+)?(?:\??[\w\\|]+\s+)?\$(\w+)')
# Un punto de extensión se declara como un método que devuelve un Closure.
PIPE_DEF_PATTERN = re.compile(
    r'\bfunction\s+(\w+)\s*\([^)]*\)\s*:\s*\\?Closure\b'
    r'|\bfunction\s+(\w+)\s*\([^)]*\)\s*\{\s*return\s+function\b',
)


class AuditError(RuntimeError):
    """Error de configuración que impide completar la auditoría."""


@dataclass(frozen=True)
class Symbol:
    """Símbolo del core usado por el plugin y cómo localizarlo en el código."""

    kind: str
    label: str
    patterns: tuple[str, ...]
    pathspecs: tuple[str, ...]
    origin: str
    confidence: str = 'alta'
    self_called: bool = False

    @property
    def key(self) -> tuple:
        """Identificador único para no auditar dos veces el mismo símbolo."""
        return self.kind, self.label, self.patterns, self.pathspecs

    def widened(self) -> 'Symbol':
        """Devuelve el mismo símbolo buscado en todo ``Core/``.

        Sirve para métodos y propiedades heredados de una clase padre, que no
        están en el archivo de la clase concreta que usa el plugin.
        """
        return Symbol(
            kind=self.kind,
            label=self.label,
            patterns=self.patterns,
            pathspecs=('Core/',),
            origin=self.origin,
            confidence='media' if self.confidence == 'alta' else self.confidence,
            self_called=self.self_called,
        )


@dataclass
class SymbolResult:
    """Resultado de auditar un símbolo contra las etiquetas del core."""

    symbol: Symbol
    status: str
    since: str | None = None
    since_version: float | None = None
    removed_after: str | None = None
    provider: str | None = None


@dataclass
class PluginInfo:
    """Datos relevantes del ``facturascripts.ini`` del plugin."""

    name: str
    version: str
    min_version: float
    path: Path
    min_php: float = 0.0
    require: tuple[str, ...] = ()
    declares_min_version: bool = True


@dataclass
class CoreRepo:
    """Repositorio git del core y catálogo de versiones publicadas."""

    path: Path
    tags: list[tuple[float, str]] = field(default_factory=list)
    _cache: dict[tuple, bool] = field(default_factory=dict, repr=False)
    _lock: threading.Lock = field(default_factory=threading.Lock, repr=False)

    def git(self, *args: str) -> subprocess.CompletedProcess:
        """Ejecuta un comando git dentro del repositorio del core."""
        return subprocess.run(
            ('git', '-C', str(self.path), *args),
            capture_output=True, text=True, check=False,
        )

    def load_tags(self) -> None:
        """Carga las etiquetas de versión ordenadas numéricamente."""
        result = self.git('tag')
        if result.returncode != 0:
            raise AuditError(f'No se pueden leer las etiquetas de {self.path}: {result.stderr.strip()}')

        tags: list[tuple[float, str]] = []
        for line in result.stdout.splitlines():
            match = TAG_PATTERN.match(line.strip())
            if match:
                tags.append((float(match.group(1)), line.strip()))

        if not tags:
            raise AuditError(f'El repositorio {self.path} no tiene etiquetas de versión de FacturaScripts.')

        # Las versiones de FacturaScripts son decimales: 2025.11 es anterior a 2025.2.
        self.tags = sorted(tags, key=lambda item: item[0])

    def exists_in(self, tag: str, symbol: Symbol) -> bool:
        """Indica si alguno de los patrones del símbolo aparece en la etiqueta."""
        cache_key = (tag, symbol.patterns, symbol.pathspecs)
        with self._lock:
            if cache_key in self._cache:
                return self._cache[cache_key]

        args = ['grep', '-q', '-F']
        for pattern in symbol.patterns:
            args += ['-e', pattern]
        args += [tag, '--', *symbol.pathspecs]
        found = self.git(*args).returncode == 0

        with self._lock:
            self._cache[cache_key] = found
        return found

    def first_tag_with(self, symbol: Symbol) -> str | None:
        """Busca por bisección la primera etiqueta que contiene el símbolo."""
        low, high = 0, len(self.tags) - 1
        result: str | None = None
        while low <= high:
            middle = (low + high) // 2
            if self.exists_in(self.tags[middle][1], symbol):
                result = self.tags[middle][1]
                high = middle - 1
            else:
                low = middle + 1
        return result

    def last_tag_with(self, symbol: Symbol) -> str | None:
        """Busca por bisección la última etiqueta que contiene el símbolo."""
        low, high = 0, len(self.tags) - 1
        result: str | None = None
        while low <= high:
            middle = (low + high) // 2
            if self.exists_in(self.tags[middle][1], symbol):
                result = self.tags[middle][1]
                low = middle + 1
            else:
                high = middle - 1
        return result

    def target_tag(self, min_version: float) -> tuple[float, str]:
        """Devuelve la etiqueta más baja que satisface el ``min_version`` dado."""
        for version, tag in self.tags:
            if version >= min_version:
                return version, tag
        return self.tags[-1]


def config_core_path() -> Path | None:
    """Lee la ruta del core declarada en ``~/.fs-claude.json``, si la hay."""
    config_file = Path.home() / '.fs-claude.json'
    if not config_file.is_file():
        return None

    try:
        data = json.loads(config_file.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return None

    settings = data.get('settings', {}) if isinstance(data, dict) else {}
    raw = settings.get('corePath') or settings.get('coreRepoPath')
    return Path(raw).expanduser() if isinstance(raw, str) and raw else None


def find_core(explicit: str | None, plugin_dir: Path) -> Path:
    """Localiza el repositorio git del core a partir de las rutas habituales."""
    candidates: list[Path] = []
    if explicit:
        candidates.append(Path(explicit).expanduser())
    if os.environ.get('FS_CORE_PATH'):
        candidates.append(Path(os.environ['FS_CORE_PATH']).expanduser())

    from_config = config_core_path()
    if from_config:
        candidates.append(from_config)

    # Un plugin instalado vive en <core>/Plugins/<nombre>.
    for parent in plugin_dir.resolve().parents:
        if parent.name == 'Plugins':
            candidates.append(parent.parent)
            break

    candidates.append(Path.cwd())

    for candidate in candidates:
        if (candidate / 'Core').is_dir() and (candidate / '.git').exists():
            return candidate

    raise AuditError(
        'No se encuentra un clon git del core de FacturaScripts. '
        'Indícalo con --core o con la variable FS_CORE_PATH. '
        'Si no lo tienes: git clone https://github.com/NeoRazorX/facturascripts.git'
    )


def find_plugins_dir(explicit: str | None, plugin_dir: Path) -> Path | None:
    """Localiza el directorio ``Plugins/`` que contiene al plugin auditado."""
    if explicit:
        candidate = Path(explicit).expanduser()
        return candidate if candidate.is_dir() else None
    parent = plugin_dir.resolve().parent
    return parent if parent.name == 'Plugins' else None


def sibling_provider(symbol: Symbol, plugins_dir: Path, own_name: str,
                     preferred: tuple[str, ...] = ()) -> str | None:
    """Devuelve el plugin hermano que declara el símbolo, si alguno lo hace.

    Muchos símbolos que el core no tiene los aporta otro plugin instalado: es el
    caso de los modelos que salieron del core a un plugin, o de las clases de un
    plugin declarado en ``require``.
    """
    args = ['grep', '-rl', '--include=*.php', '--exclude-dir=vendor', '--exclude-dir=node_modules', '-F']
    for pattern in symbol.patterns:
        args += ['-e', pattern]
    args.append(str(plugins_dir))

    result = subprocess.run(args, capture_output=True, text=True, check=False)
    found: list[str] = []
    for line in result.stdout.splitlines():
        try:
            name = Path(line).resolve().relative_to(plugins_dir.resolve()).parts[0]
        except (ValueError, IndexError):
            continue
        if name != own_name and name not in found:
            found.append(name)

    # Un plugin declarado en require es la procedencia más probable.
    for name in preferred:
        if name in found:
            return name
    return found[0] if found else None


def vendor_provider(symbol: Symbol, vendor_dirs: list[Path]) -> str | None:
    """Devuelve el paquete de ``vendor/`` que declara el símbolo, si alguno lo hace."""
    for vendor in vendor_dirs:
        args = ['grep', '-rl', '--include=*.php', '-F']
        for pattern in symbol.patterns:
            args += ['-e', pattern]
        args.append(str(vendor))

        result = subprocess.run(args, capture_output=True, text=True, check=False)
        for line in result.stdout.splitlines():
            try:
                parts = Path(line).resolve().relative_to(vendor.resolve()).parts
            except ValueError:
                continue
            if parts:
                return '/'.join(parts[:2])
    return None


def resolve_providers(results: list[SymbolResult], plugins_dir: Path | None, own_name: str,
                      vendor_dirs: list[Path] | None = None,
                      preferred: tuple[str, ...] = (), workers: int = 8) -> None:
    """Atribuye los símbolos ausentes del core a otro plugin o a una librería."""
    vendor_dirs = [path for path in (vendor_dirs or []) if path.is_dir()]
    if plugins_dir is None and not vendor_dirs:
        return

    pending = [item for item in results if item.status in ('no encontrado', 'eliminado')]
    if not pending:
        return

    def resolve(item: SymbolResult) -> tuple[str, str] | None:
        """Busca el símbolo primero en los plugins hermanos y después en vendor."""
        if plugins_dir is not None:
            provider = sibling_provider(item.symbol, plugins_dir, own_name, preferred)
            if provider:
                return 'aportado por plugin', provider
        provider = vendor_provider(item.symbol, vendor_dirs)
        return ('aportado por vendor', provider) if provider else None

    with ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
        resolved = pool.map(resolve, pending)

    for item, outcome in zip(pending, resolved):
        if outcome:
            item.status, item.provider = outcome


def read_plugin_ini(plugin_dir: Path) -> PluginInfo:
    """Lee el ``facturascripts.ini`` del plugin y devuelve sus datos."""
    ini_path = plugin_dir / 'facturascripts.ini'
    if not ini_path.is_file():
        raise AuditError(f'No existe {ini_path}: la ruta indicada no es un plugin de FacturaScripts.')

    values: dict[str, str] = {}
    for line in ini_path.read_text(encoding='utf-8', errors='replace').splitlines():
        if '=' not in line or line.strip().startswith((';', '#')):
            continue
        key, raw_value = line.split('=', 1)
        values[key.strip()] = raw_value.strip().strip('"\'')

    def as_float(key: str) -> float:
        """Convierte a decimal un valor del ini, con 0 como valor por defecto."""
        try:
            return float(values.get(key, 0))
        except ValueError:
            return 0.0

    return PluginInfo(
        name=values.get('name', plugin_dir.name),
        version=values.get('version', '?'),
        min_version=as_float('min_version'),
        path=plugin_dir,
        min_php=as_float('min_php'),
        require=tuple(item.strip() for item in values.get('require', '').split(',') if item.strip()),
        declares_min_version='min_version' in values,
    )


def php_files(plugin_dir: Path, include_tests: bool) -> list[Path]:
    """Devuelve los archivos PHP propios del plugin."""
    files: list[Path] = []
    for path in sorted(plugin_dir.rglob('*.php')):
        parts = path.relative_to(plugin_dir).parts
        if any(part in EXCLUDED_DIRS for part in parts):
            continue
        if not include_tests and any(part in TEST_DIRS for part in parts):
            continue
        files.append(path)
    return files


def plugin_members(files: list[Path]) -> tuple[set[str], set[str]]:
    """Recopila los métodos y propiedades que el propio plugin define."""
    methods: set[str] = set()
    properties: set[str] = set()
    for path in files:
        content = path.read_text(encoding='utf-8', errors='replace')
        methods.update(FUNCTION_DEF_PATTERN.findall(content))
        properties.update(PROPERTY_DEF_PATTERN.findall(content))
    return methods, properties


def plugin_table_columns(plugin_dir: Path) -> set[str]:
    """Recopila las columnas que el plugin declara en sus XML de tabla.

    Un plugin añade campos a las tablas del core mediante ``Extension/Table``, y
    esos campos se leen luego como propiedades dinámicas del modelo. No son
    símbolos del core, así que no deben auditarse.
    """
    columns: set[str] = set()
    for path in plugin_dir.rglob('*.xml'):
        if any(part in EXCLUDED_DIRS for part in path.relative_to(plugin_dir).parts):
            continue
        content = path.read_text(encoding='utf-8', errors='replace')
        columns.update(re.findall(r'<name>\s*([\w]+)\s*</name>', content))
    return columns


def plugin_calls(plugin_dir: Path) -> set[str]:
    """Recopila los métodos que el plugin invoca, en PHP y en sus plantillas.

    Recorre también los tests y las plantillas Twig, aunque no se auditen: un
    método que una extensión añade a un modelo del core a menudo solo se invoca
    desde ahí, y ese uso basta para saber que no es un punto de extensión.
    """
    calls: set[str] = set()
    for path in php_files(plugin_dir, include_tests=True):
        content = path.read_text(encoding='utf-8', errors='replace')
        calls.update(METHOD_CALL_PATTERN.findall(content))

    for path in plugin_dir.rglob('*.twig'):
        if any(part in EXCLUDED_DIRS for part in path.relative_to(plugin_dir).parts):
            continue
        content = path.read_text(encoding='utf-8', errors='replace')
        calls.update(TWIG_CALL_PATTERN.findall(content))

    return calls


def class_path(fqcn: str) -> str | None:
    """Traduce un nombre de clase de FacturaScripts a su ruta dentro de ``Core/``."""
    parts = fqcn.split('\\')
    if len(parts) < 3 or parts[0] != 'FacturaScripts':
        return None
    if parts[1] in {'Core', 'Dinamic'}:
        # Dinamic replica la estructura de Core con las extensiones aplicadas.
        return 'Core/' + '/'.join(parts[2:]) + '.php'
    return None


def is_own_class(fqcn: str, plugin_dir: Path) -> bool:
    """Indica si una clase referida vía ``Dinamic`` la aporta el propio plugin.

    Los plugins registran sus modelos y librerías en ``Dinamic``, así que una
    referencia a ``Dinamic\\Model\\X`` puede resolverse contra el archivo
    ``Model/X.php`` del plugin y no contra el core.
    """
    parts = fqcn.split('\\')
    if len(parts) < 3 or parts[1] != 'Dinamic':
        return False
    return (plugin_dir / Path(*parts[2:]).with_suffix('.php')).is_file()


def collect_symbols(plugin_dir: Path, include_tests: bool) -> tuple[list[Symbol], list[str]]:
    """Extrae del plugin los símbolos del core y las dependencias externas."""
    files = php_files(plugin_dir, include_tests)
    own_methods, own_properties = plugin_members(files)
    called_methods = plugin_calls(plugin_dir)
    own_columns = plugin_table_columns(plugin_dir)
    symbols: dict[tuple, Symbol] = {}
    external: set[str] = set()

    def add(symbol: Symbol) -> None:
        """Registra el símbolo si no se había detectado antes."""
        symbols.setdefault(symbol.key, symbol)

    for path in files:
        relative = path.relative_to(plugin_dir).as_posix()
        relative_parts = path.relative_to(plugin_dir).parts
        content = path.read_text(encoding='utf-8', errors='replace')
        aliases: dict[str, str] = {}

        # 1. Clases importadas con use.
        for fqcn, alias in USE_PATTERN.findall(content):
            short = alias or fqcn.split('\\')[-1]
            if fqcn.split('\\')[1] == 'Plugins':
                external.add(fqcn)
                continue
            if is_own_class(fqcn, plugin_dir):
                continue
            aliases[short] = fqcn
            target = class_path(fqcn)
            if target is None:
                continue
            short_name = fqcn.split('\\')[-1]
            add(Symbol(
                kind='clase',
                label=fqcn,
                patterns=(f'class {short_name}', f'interface {short_name}', f'trait {short_name}'),
                pathspecs=(target,),
                origin=relative,
            ))

        # 2. Clases extendidas o implementadas con el nombre completo.
        for raw in EXTENDS_PATTERN.findall(content):
            for name in (item.strip() for item in raw.split(',')):
                short = name.split('\\')[-1]
                if not short or short in IGNORED_CLASSES or short in aliases:
                    continue
                if not name.startswith('FacturaScripts\\') or is_own_class(name, plugin_dir):
                    continue
                target = class_path(name)
                if target:
                    add(Symbol(
                        kind='clase',
                        label=name,
                        patterns=(f'class {short}', f'interface {short}', f'trait {short}'),
                        pathspecs=(target,),
                        origin=relative,
                    ))

        # 3. Llamadas estáticas a clases del core.
        for class_name, method in STATIC_CALL_PATTERN.findall(content):
            if class_name in IGNORED_CLASSES or method in IGNORED_MEMBERS:
                continue
            fqcn = aliases.get(class_name)
            if fqcn is None:
                continue
            target = class_path(fqcn)
            add(Symbol(
                kind='método estático',
                label=f'{class_name}::{method}()',
                patterns=(f'function {method}(',),
                pathspecs=(target,) if target else ('Core/',),
                origin=relative,
                confidence='alta' if target else 'media',
            ))

        # 4. Puntos de extensión usados por las clases de Extension/.
        if 'Extension' in relative_parts:
            for first, second in PIPE_DEF_PATTERN.findall(content):
                method = first or second
                if not method or method in IGNORED_MEMBERS:
                    continue
                add(Symbol(
                    kind='pipe',
                    label=f"pipe('{method}')",
                    patterns=(f"pipe('{method}'", f'pipe("{method}"',
                              f"pipeFalse('{method}'", f'pipeFalse("{method}"'),
                    pathspecs=('Core/',),
                    origin=relative,
                    # Una extensión también puede añadir métodos nuevos a la clase
                    # extendida: si el propio plugin los invoca y el core no declara
                    # el pipe, no es un punto de extensión que falte.
                    self_called=method in called_methods,
                ))

            # La clase extendida debe existir en el core con esa misma ruta.
            index = relative_parts.index('Extension')
            tail = relative_parts[index + 1:]
            declares_trait = re.search(rf'\btrait\s+{re.escape(Path(tail[-1]).stem)}\b', content) is not None
            if (len(tail) >= 2 and tail[0] in EXTENSION_NAMESPACES and not declares_trait
                    and not (plugin_dir / Path(*tail)).is_file()):
                add(Symbol(
                    kind='clase extendida',
                    label='FacturaScripts\\Core\\' + '\\'.join(tail).removesuffix('.php'),
                    patterns=(f'class {Path(tail[-1]).stem}',),
                    pathspecs=('Core/' + '/'.join(tail),),
                    origin=relative,
                ))

        # 5. Métodos de instancia que no define el plugin.
        for method in METHOD_CALL_PATTERN.findall(content):
            if method in IGNORED_MEMBERS or method in own_methods:
                continue
            add(Symbol(
                kind='método',
                label=f'->{method}()',
                patterns=(f'function {method}(',),
                pathspecs=('Core/',),
                origin=relative,
                confidence='media',
            ))

        # 6. Propiedades públicas o protegidas que no define el plugin.
        for prop in PROPERTY_PATTERN.findall(content):
            if (prop in IGNORED_MEMBERS or prop in own_properties or prop in own_methods
                    or prop in own_columns):
                continue
            add(Symbol(
                kind='propiedad',
                label=f'->{prop}',
                patterns=tuple(
                    f'{visibility} {declaration}${prop}'
                    for visibility in ('public', 'protected')
                    for declaration in ('', 'array ', 'string ', 'int ', 'float ', 'bool ',
                                        'static ', '?array ', '?string ')
                ),
                pathspecs=('Core/',),
                origin=relative,
                confidence='baja',
            ))

    return list(symbols.values()), sorted(external)


def audit_symbol(symbol: Symbol, core: CoreRepo, target: tuple[float, str],
                 versions: dict[str, float]) -> SymbolResult:
    """Determina en qué versión del core aparece o desaparece un símbolo."""
    target_version, target_tag = target

    if core.exists_in(target_tag, symbol):
        since = core.first_tag_with(symbol)
        # Existe en la versión declarada, pero puede haberse eliminado después.
        if not core.exists_in(core.tags[-1][1], symbol):
            return SymbolResult(symbol=symbol, status='eliminado', since=since,
                                since_version=versions.get(since or ''),
                                removed_after=core.last_tag_with(symbol))
        return SymbolResult(symbol=symbol, status='ok', since=since,
                            since_version=versions.get(since or ''))

    # Puede estar declarado en una clase padre: repite la búsqueda en todo Core/.
    if symbol.pathspecs != ('Core/',):
        wider = symbol.widened()
        if core.exists_in(target_tag, wider):
            since = core.first_tag_with(wider)
            if not core.exists_in(core.tags[-1][1], wider):
                return SymbolResult(symbol=wider, status='eliminado', since=since,
                                    since_version=versions.get(since or ''),
                                    removed_after=core.last_tag_with(wider))
            return SymbolResult(symbol=wider, status='ok', since=since,
                                since_version=versions.get(since or ''))
        symbol = wider

    if core.exists_in(core.tags[-1][1], symbol):
        since = core.first_tag_with(symbol)
        if since is not None and versions.get(since, 0) > target_version:
            return SymbolResult(symbol=symbol, status='posterior', since=since,
                                since_version=versions[since])
        return SymbolResult(symbol=symbol, status='ok', since=since,
                            since_version=versions.get(since or ''))

    last = core.last_tag_with(symbol)
    if last is not None:
        return SymbolResult(symbol=symbol, status='eliminado', removed_after=last)

    if symbol.kind == 'pipe' and symbol.self_called:
        return SymbolResult(symbol=symbol, status='método añadido')

    return SymbolResult(symbol=symbol, status='no encontrado')


def audit(symbols: list[Symbol], core: CoreRepo, target: tuple[float, str],
          workers: int = 8) -> list[SymbolResult]:
    """Audita todos los símbolos repartiendo las consultas a git entre hilos."""
    versions = {tag: version for version, tag in core.tags}
    with ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
        return list(pool.map(lambda symbol: audit_symbol(symbol, core, target, versions), symbols))


def build_warnings(plugin: PluginInfo, core: CoreRepo, results: list[SymbolResult]) -> list[str]:
    """Detecta problemas del ini y limitaciones del análisis."""
    warnings: list[str] = []
    latest_version, latest_tag = core.tags[-1]

    if not plugin.declares_min_version:
        warnings.append(
            'El ini no declara min_version: el core lo interpreta como 0 y marca el plugin como incompatible.'
        )
    elif plugin.min_version < 2025:
        warnings.append(
            f'min_version = {plugin.min_version:g} es menor que 2025: Core/Internal/Plugin.php marca '
            'incompatible cualquier plugin con min_version inferior a 2025.'
        )

    if plugin.min_version > latest_version:
        warnings.append(
            f'min_version = {plugin.min_version:g} supera la última versión conocida del core ({latest_tag}). '
            'Actualiza el clon con git fetch --tags si esa versión ya existe.'
        )

    missing_pipes = sorted({
        item.symbol.label for item in results
        if item.status == 'no encontrado' and item.symbol.kind == 'pipe'
    })
    if missing_pipes:
        warnings.append(
            'Hay extensiones que apuntan a métodos sin pipe() en el core: ' + ', '.join(missing_pipes) +
            '. Comprueba si el punto de extensión existe o si el método es auxiliar de la propia extensión.'
        )

    if any(item.status == 'no encontrado' and item.symbol.kind != 'pipe' for item in results):
        warnings.append(
            'Hay símbolos que no aparecen en ninguna versión etiquetada. Pueden venir de otro plugin, '
            'de código propio no detectado o de un clon del core desactualizado (git fetch --tags).'
        )

    if plugin.require:
        warnings.append(
            'El plugin depende de otros plugins (require = ' + ', '.join(plugin.require) +
            '): sus requisitos de versión no se auditan aquí.'
        )

    return warnings


def build_report(plugin: PluginInfo, core: CoreRepo, target: tuple[float, str],
                 results: list[SymbolResult], external: list[str]) -> dict:
    """Construye la estructura de datos del informe final."""
    later = [item for item in results if item.status == 'posterior']
    required = max([item.since_version or 0 for item in later] + [plugin.min_version, 2025.0])

    return {
        'plugin': {
            'name': plugin.name,
            'version': plugin.version,
            'min_version_declarado': plugin.min_version,
            'min_version_calculado': required,
            'min_php': plugin.min_php,
            'require': list(plugin.require),
            'cumple': not later and plugin.min_version >= 2025,
            'path': str(plugin.path),
        },
        'core': {
            'path': str(core.path),
            'version_objetivo': target[1],
            'ultima_version': core.tags[-1][1],
            'total_versiones': len(core.tags),
        },
        'symbols': [
            {
                'tipo': item.symbol.kind,
                'simbolo': item.symbol.label,
                'origen': item.symbol.origin,
                'confianza': item.symbol.confidence,
                'estado': item.status,
                'desde': item.since,
                'eliminado_tras': item.removed_after,
                'aportado_por': item.provider,
            }
            for item in results
        ],
        'plugins_externos': external,
        'avisos': build_warnings(plugin, core, results),
    }


def print_report(report: dict, results: list[SymbolResult]) -> None:
    """Muestra el informe en texto legible por una persona."""
    plugin = report['plugin']
    core = report['core']

    print(f"Plugin: {plugin['name']} {plugin['version']}")
    print(f"min_version declarado: {plugin['min_version_declarado']:g}")
    print(f"Core: {core['path']} ({core['total_versiones']} versiones, última {core['ultima_version']})")
    print(f"Versión comprobada: {core['version_objetivo']}")
    print()

    later = [item for item in results if item.status == 'posterior']
    if plugin['cumple']:
        print(f"RESULTADO: CUMPLE. Todos los símbolos localizados existen en {core['version_objetivo']}.")
    else:
        print(f"RESULTADO: INCUMPLE. min_version debería ser {plugin['min_version_calculado']:g}")
        if later:
            print()
            print('Símbolos que no existen en la versión declarada:')
            for item in sorted(later, key=lambda entry: -(entry.since_version or 0)):
                print(f"  - {item.symbol.label} ({item.symbol.kind}) añadido en {item.since}"
                      f"  [{item.symbol.origin}, confianza {item.symbol.confidence}]")
    print()

    removed = [item for item in results if item.status == 'eliminado']
    if removed:
        print('Símbolos que ya no existen en la última versión del core:')
        for item in removed:
            print(f"  - {item.symbol.label} ({item.symbol.kind}) presente hasta {item.removed_after}"
                  f"  [{item.symbol.origin}, confianza {item.symbol.confidence}]")
        print()

    missing = [item for item in results if item.status == 'no encontrado']
    if missing:
        print('Símbolos no localizados en el core (revísalos a mano):')
        for item in missing:
            print(f"  - {item.symbol.label} ({item.symbol.kind})"
                  f"  [{item.symbol.origin}, confianza {item.symbol.confidence}]")
        print()

    provided = [item for item in results
                if item.status in ('aportado por plugin', 'aportado por vendor')]
    if provided:
        print('Símbolos que no aporta el core:')
        for item in provided:
            origen = 'el plugin' if item.status == 'aportado por plugin' else 'la librería'
            print(f"  - {item.symbol.label} ({item.symbol.kind}) lo declara {origen} {item.provider}"
                  f"  [{item.symbol.origin}]")
        print()

    if report['plugins_externos']:
        print('Dependencias de otros plugins (no auditables con este script):')
        for name in report['plugins_externos']:
            print(f'  - {name}')
        print()

    if report['avisos']:
        print('Avisos:')
        for warning in report['avisos']:
            print(f'  - {warning}')
        print()

    ok = len([item for item in results if item.status == 'ok'])
    print(f"Símbolos analizados: {len(results)} (compatibles {ok}, posteriores {len(later)}, "
          f"eliminados {len(removed)}, ajenos al core {len(provided)}, no encontrados {len(missing)})")


def main(argv: list[str] | None = None) -> int:
    """Punto de entrada del script."""
    parser = argparse.ArgumentParser(
        description='Audita el min_version declarado por un plugin de FacturaScripts.')
    parser.add_argument('plugin', help='Ruta del plugin a auditar')
    parser.add_argument('--core', help='Ruta del clon git del core de FacturaScripts')
    parser.add_argument('--json', action='store_true', help='Muestra el informe en formato JSON')
    parser.add_argument('--include-tests', action='store_true',
                        help='Incluye el directorio Test/ del plugin en el análisis')
    parser.add_argument('--min-confidence', choices=('alta', 'media', 'baja'), default='baja',
                        help='Descarta los símbolos con confianza inferior a la indicada')
    parser.add_argument('--plugins-dir',
                        help='Directorio Plugins/ donde buscar los símbolos que aporten otros plugins')
    parser.add_argument('--workers', type=int, default=8,
                        help='Número de consultas simultáneas a git')
    args = parser.parse_args(argv)

    plugin_dir = Path(args.plugin).expanduser().resolve()

    try:
        plugin = read_plugin_ini(plugin_dir)
        core = CoreRepo(path=find_core(args.core, plugin_dir))
        core.load_tags()
    except AuditError as error:
        print(f'Error: {error}', file=sys.stderr)
        return 2

    symbols, external = collect_symbols(plugin_dir, args.include_tests)
    threshold = CONFIDENCE_ORDER[args.min_confidence]
    symbols = [symbol for symbol in symbols if CONFIDENCE_ORDER[symbol.confidence] >= threshold]

    target = core.target_tag(plugin.min_version)
    results = audit(symbols, core, target, args.workers)
    resolve_providers(results, find_plugins_dir(args.plugins_dir, plugin_dir), plugin_dir.name,
                      [core.path / 'vendor', plugin_dir / 'vendor'], plugin.require, args.workers)
    report = build_report(plugin, core, target, results, external)

    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print_report(report, results)

    return 0 if report['plugin']['cumple'] else 1


if __name__ == '__main__':
    sys.exit(main())
