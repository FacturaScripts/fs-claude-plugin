#!/usr/bin/env python3
"""Audita la seguridad de un plugin de FacturaScripts antes de instalarlo.

El script busca en el código del plugin los comportamientos que conviene
conocer antes de confiar en él: ejecución de comandos del sistema, código
dinámico u ofuscado, conexiones de red salientes, lectura de credenciales o
datos de la instalación, escritura de código, accesos sin autenticación y
recursos cargados desde terceros. También cruza esos hallazgos para señalar los
archivos que leen datos sensibles y los envían por red.

Ninguno de estos comportamientos está prohibido: muchos plugins legítimos
firman con ``openssl`` o llaman a una API externa. El informe no decide si el
plugin es malicioso, sino que enumera, con archivo, línea y contexto de
ejecución, todo lo que una persona debe revisar para decidirlo.

El análisis es estático: elimina comentarios y cadenas antes de buscar llamadas,
de modo que un ``exec`` dentro de un comentario o de un texto no cuenta, pero no
resuelve tipos ni sigue el flujo de datos.

Uso:
    check-security.py <ruta_plugin> [--json] [--min-severity alta|media|baja|info]
                      [--include-tests] [--include-vendor]

Código de salida: 0 sin hallazgos de severidad media o alta, 1 con hallazgos que
revisar y 2 si la ruta no es válida. El script solo informa: nunca modifica el
plugin.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections.abc import Callable
from dataclasses import dataclass, field
from pathlib import Path

SEVERITY_ORDER = {'alta': 3, 'media': 2, 'baja': 1, 'info': 0}
SEVERITY_LABELS = {'alta': 'ALTA', 'media': 'MEDIA', 'baja': 'BAJA', 'info': 'INFO'}

# Directorios que no forman parte del código propio del plugin.
EXCLUDED_DIRS = frozenset({'.git', 'node_modules'})
VENDOR_DIR = 'vendor'
TEST_DIRS = frozenset({'Test', 'Tests', 'test', 'tests'})

# Extensiones de texto que se analizan y lenguaje con el que se interpretan.
LANGUAGES = {'.php': 'php', '.js': 'js', '.mjs': 'js', '.twig': 'twig', '.html': 'twig', '.xml': 'xml'}

# Archivos que un plugin no necesita y que el servidor podría ejecutar.
EXECUTABLE_EXTENSIONS = frozenset({
    '.sh', '.bash', '.zsh', '.exe', '.bat', '.cmd', '.ps1', '.phar', '.so', '.dll',
    '.dylib', '.bin', '.py', '.pl', '.rb', '.jar', '.com', '.msi', '.vbs',
})
SERVER_CONFIG_FILES = frozenset({'.htaccess', '.user.ini', 'php.ini', 'web.config', '.env'})
ALLOWED_HIDDEN = frozenset({
    '.gitignore', '.gitattributes', '.editorconfig', '.DS_Store', '.github', '.gitkeep',
    '.php-cs-fixer.php', '.php-cs-fixer.dist.php', '.phpcs.xml', '.idea', '.vscode',
})

# Dominios que aparecen en código legítimo sin implicar conexión alguna.
IGNORED_HOSTS = frozenset({
    'localhost', '127.0.0.1', '0.0.0.0', 'www.w3.org', 'w3.org', 'schemas.xmlsoap.org',
    'schemas.microsoft.com', 'www.gnu.org', 'gnu.org', 'xmlns.com', 'purl.org', 'ns.adobe.com',
    'example.com', 'www.example.com', 'example.org', 'example.net', 'php.net', 'www.php.net',
})

CATEGORY_TITLES = {
    'ejecucion-comandos': 'Ejecución de comandos del sistema',
    'codigo-dinamico': 'Ejecución de código dinámico',
    'ofuscacion': 'Código ofuscado o codificado',
    'posible-exfiltracion': 'Posible envío de datos de la instalación a terceros',
    'red-saliente': 'Conexiones de red salientes',
    'recurso-externo': 'Recursos cargados desde terceros',
    'datos-sensibles': 'Lectura de credenciales o datos de la instalación',
    'modificacion-instalacion': 'Escritura de código o de la configuración del servidor',
    'sistema-archivos': 'Permisos y borrado de archivos',
    'acceso-publico': 'Puntos de entrada sin autenticación',
    'privilegios': 'Gestión de usuarios y privilegios',
    'credenciales-embebidas': 'Credenciales escritas en el código',
    'deserializacion': 'Deserialización de datos',
    'sql-destructivo': 'Sentencias SQL destructivas o de administración',
    'entorno-php': 'Cambios en la configuración de PHP',
    'estructura': 'Archivos y estructura del plugin',
}

URL_PATTERN = re.compile(r'''(?:https?:)?//([a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)+)(?::\d+)?''', re.I)
SCHEME_URL_PATTERN = re.compile(r'''https?://([a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)+)''', re.I)
FUNCTION_PATTERN = re.compile(r'\bfunction\s+(\w+)\s*\(')
PHP_CLASS_PATTERN = re.compile(r'^\s*(?:(?:abstract|final|readonly)\s+)*(?:class|trait|interface|enum)\s+\w+', re.M)
LONG_ENCODED_PATTERN = re.compile(r'[A-Za-z0-9+/]{300,}={0,2}')
HEX_ESCAPES_PATTERN = re.compile(r'(?:\\x[0-9a-fA-F]{2}){20,}')
# Guarda que impide ejecutar un script salvo desde la línea de comandos.
CLI_GUARD_PATTERN = re.compile(
    r'(?:php_sapi_name\s*\(\s*\)|PHP_SAPI)\s*!==?\s*[\'"]cli[\'"]\s*\)\s*\{?\s*(?:die|exit)\b', re.I)


@dataclass
class Source:
    """Archivo analizado en sus tres formas: original, sin comentarios y solo código.

    Las tres versiones tienen exactamente la misma longitud y los mismos saltos
    de línea, así que una posición encontrada en una sirve para las demás.
    """

    path: Path
    relative: str
    language: str
    raw: str
    text: str
    code: str
    minified: bool = False
    line_starts: list[int] = field(default_factory=list)

    def line_of(self, offset: int) -> int:
        """Devuelve el número de línea (desde 1) de una posición del archivo."""
        low, high = 0, len(self.line_starts) - 1
        while low < high:
            middle = (low + high + 1) // 2
            if self.line_starts[middle] <= offset:
                low = middle
            else:
                high = middle - 1
        return low + 1

    def snippet(self, offset: int, limit: int = 160) -> str:
        """Devuelve la línea original que contiene la posición, recortada."""
        line = self.line_of(offset)
        start = self.line_starts[line - 1]
        end = self.raw.find('\n', start)
        content = self.raw[start:end if end != -1 else len(self.raw)].strip()
        return content if len(content) <= limit else content[:limit - 1] + '…'

    def statement(self, offset: int, limit: int = 400) -> str:
        """Devuelve el texto sin comentarios desde la posición hasta el fin de la sentencia."""
        end = self.text.find(';', offset)
        end = len(self.text) if end == -1 else end
        return self.text[offset:min(end, offset + limit)]

    def first_argument(self, offset: int, limit: int = 600) -> str:
        """Devuelve el primer argumento de la llamada cuyo paréntesis abre en ``offset``.

        Recorre la versión sin cadenas para que las comas y los paréntesis de un
        literal no corten el argumento, y devuelve el texto con sus cadenas.
        """
        start = self.code.find('(', offset)
        if start == -1:
            return ''
        depth = 0
        for index in range(start + 1, min(len(self.code), start + limit)):
            char = self.code[index]
            if char in '([{':
                depth += 1
            elif char in ')]}':
                if depth == 0:
                    return self.text[start + 1:index]
                depth -= 1
            elif char == ',' and depth == 0:
                return self.text[start + 1:index]
        return self.text[start + 1:start + limit]


@dataclass
class Finding:
    """Comportamiento que merece revisión, con su ubicación y su contexto."""

    category: str
    severity: str
    title: str
    file: str
    line: int
    snippet: str
    context: str
    notes: list[str] = field(default_factory=list)


@dataclass
class Rule:
    """Regla de detección aplicada al código de un lenguaje concreto.

    ``target`` indica sobre qué versión del archivo se busca: ``code`` (sin
    comentarios ni cadenas, para llamadas) o ``text`` (sin comentarios pero con
    cadenas, para literales como URLs o nombres de archivo). ``check`` permite
    descartar una coincidencia o añadirle notas y cambiar su severidad.
    """

    category: str
    severity: str
    title: str
    pattern: re.Pattern
    languages: frozenset[str]
    target: str = 'code'
    check: Callable[['Source', re.Match], tuple[bool, list[str], str | None]] | None = None


def blank(segment: str) -> str:
    """Sustituye un fragmento por espacios conservando sus saltos de línea."""
    return ''.join('\n' if char == '\n' else ' ' for char in segment)


def strip_php(content: str) -> tuple[str, str]:
    """Devuelve el PHP sin comentarios y el PHP sin comentarios ni cadenas.

    Conserva los delimitadores de las cadenas para que ``'...'`` siga
    reconociéndose como un literal, y trata los atributos ``#[...]`` como código.
    Las comillas invertidas se conservan porque en PHP ejecutan un comando.
    """
    text: list[str] = []
    code: list[str] = []
    length = len(content)
    index = 0
    heredoc = re.compile(r'<<<[ \t]*(["\']?)([A-Za-z_]\w*)\1\r?\n')

    while index < length:
        char = content[index]
        pair = content[index:index + 2]

        if pair == '/*':
            end = content.find('*/', index + 2)
            end = length if end == -1 else end + 2
            chunk = blank(content[index:end])
            text.append(chunk)
            code.append(chunk)
            index = end
            continue

        if pair == '//' or (char == '#' and content[index + 1:index + 2] != '['):
            end = content.find('\n', index)
            end = length if end == -1 else end
            chunk = blank(content[index:end])
            text.append(chunk)
            code.append(chunk)
            index = end
            continue

        if char in ('"', "'", '`'):
            end = index + 1
            while end < length and content[end] != char:
                end += 2 if content[end] == '\\' else 1
            end = min(end + 1, length)
            literal = content[index:end]
            text.append(literal)
            code.append(char + blank(literal[1:-1]) + char if len(literal) >= 2 else literal)
            index = end
            continue

        match = heredoc.match(content, index) if pair == '<<' else None
        if match:
            closing = re.compile(r'^[ \t]*' + re.escape(match.group(2)) + r'\b', re.M)
            found = closing.search(content, match.end())
            end = length if found is None else found.end()
            literal = content[index:end]
            text.append(literal)
            code.append("'" + blank(literal[1:-1]) + "'" if len(literal) >= 2 else literal)
            index = end
            continue

        text.append(char)
        code.append(char)
        index += 1

    return ''.join(text), ''.join(code)


def strip_js(content: str) -> tuple[str, str]:
    """Devuelve el JavaScript sin comentarios y sin comentarios ni cadenas.

    Reconoce las expresiones regulares literales por el carácter que las
    precede, para no confundir una comilla dentro de ``/'/`` con una cadena.
    """
    text: list[str] = []
    code: list[str] = []
    length = len(content)
    index = 0
    last_significant = ''

    while index < length:
        char = content[index]
        pair = content[index:index + 2]

        if pair == '/*':
            end = content.find('*/', index + 2)
            end = length if end == -1 else end + 2
            chunk = blank(content[index:end])
            text.append(chunk)
            code.append(chunk)
            index = end
            continue

        if pair == '//':
            end = content.find('\n', index)
            end = length if end == -1 else end
            chunk = blank(content[index:end])
            text.append(chunk)
            code.append(chunk)
            index = end
            continue

        if char in ('"', "'", '`'):
            end = index + 1
            while end < length and content[end] != char and (char == '`' or content[end] != '\n'):
                end += 2 if content[end] == '\\' else 1
            end = min(end + 1, length)
            literal = content[index:end]
            text.append(literal)
            code.append(char + blank(literal[1:-1]) + char if len(literal) >= 2 else literal)
            last_significant = char
            index = end
            continue

        if char == '/' and (last_significant == '' or last_significant in '(,=:[!&|?{};+-*%<>~^'):
            end = index + 1
            in_class = False
            while end < length and content[end] != '\n':
                current = content[end]
                if current == '\\':
                    end += 2
                    continue
                if current == '[':
                    in_class = True
                elif current == ']':
                    in_class = False
                elif current == '/' and not in_class:
                    break
                end += 1
            if end < length and content[end] == '/':
                literal = content[index:end + 1]
                text.append(literal)
                code.append('/' + blank(literal[1:-1]) + '/')
                last_significant = '/'
                index = end + 1
                continue

        text.append(char)
        code.append(char)
        if not char.isspace():
            last_significant = char
        index += 1

    return ''.join(text), ''.join(code)


def strip_markup(content: str) -> tuple[str, str]:
    """Quita los comentarios Twig y HTML y analiza como JavaScript los bloques ``<script>``.

    Fuera de ``<script>`` el marcado se conserva igual en ambas versiones: sus
    comillas pertenecen a atributos y textos, no a cadenas de código.
    """
    cleaned = re.sub(r'\{#.*?#\}|<!--.*?-->', lambda match: blank(match.group(0)), content, flags=re.S)
    text = list(cleaned)
    code = list(cleaned)
    for match in re.finditer(r'(<script\b[^>]*>)(.*?)(</script\s*>)', cleaned, flags=re.S | re.I):
        start = match.start(2)
        script_text, script_code = strip_js(match.group(2))
        text[start:match.end(2)] = script_text
        code[start:match.end(2)] = script_code
    return ''.join(text), ''.join(code)


def strip_xml(content: str) -> tuple[str, str]:
    """Quita los comentarios de un XML; no contiene código que ejecutar."""
    cleaned = re.sub(r'<!--.*?-->', lambda match: blank(match.group(0)), content, flags=re.S)
    return cleaned, cleaned


def load_source(path: Path, plugin_dir: Path) -> Source | None:
    """Lee un archivo y prepara sus versiones sin comentarios y sin cadenas."""
    language = LANGUAGES.get(path.suffix.lower())
    if language is None:
        return None
    try:
        raw = path.read_text(encoding='utf-8', errors='replace')
    except OSError:
        return None

    strippers = {'php': strip_php, 'js': strip_js, 'twig': strip_markup, 'xml': strip_xml}
    text, code = strippers[language](raw)
    lines = raw.split('\n')
    minified = language == 'js' and (
        path.name.endswith('.min.js') or (len(raw) > 2000 and len(raw) / max(len(lines), 1) > 300)
    )

    starts = [0]
    for position, char in enumerate(raw):
        if char == '\n':
            starts.append(position + 1)

    return Source(
        path=path, relative=path.relative_to(plugin_dir).as_posix(), language=language,
        raw=raw, text=text, code=code, minified=minified, line_starts=starts,
    )


def php_call(*names: str) -> re.Pattern:
    """Construye el patrón de una llamada a función nativa de PHP.

    Descarta las definiciones (``function exec(``), los métodos (``->exec(``,
    ``::exec(``) y las variables (``$exec(``), que no son la función nativa.
    """
    return re.compile(
        r'(?<![\w$>:])(?<!function )(?<!new )(?:' + '|'.join(names) + r')\s*\(',
        re.I,
    )


def execution_context(source: Source, offset: int, public_file: bool) -> str:
    """Describe cuándo se ejecuta el código de una posición del plugin."""
    parts = source.relative.split('/')
    head = parts[0]

    if any(part in TEST_DIRS for part in parts):
        return 'tests (no se ejecuta en producción)'
    if source.language == 'js' or (head == 'Assets' and source.language != 'php'):
        return 'navegador del usuario'
    if source.language == 'twig':
        return 'plantilla renderizada en el navegador del usuario'

    functions = FUNCTION_PATTERN.findall(source.code[:offset])
    current = functions[-1] if functions else ''

    if source.relative == 'Init.php':
        return {
            'update': 'Init::update(), al instalar o actualizar el plugin',
            'init': 'Init::init(), en cada petición a FacturaScripts',
            'uninstall': 'Init::uninstall(), al desinstalar el plugin',
        }.get(current, 'Init.php')
    if source.relative == 'Cron.php' or head == 'CronJob':
        return 'tarea programada (cron)'
    if head == 'Worker':
        return 'worker en segundo plano'
    if head in ('Migration', 'Migrations'):
        return 'migración, al actualizar el plugin'
    if is_standalone_script(source):
        if is_cli_only(source):
            return 'script de línea de comandos, rechaza ejecutarse por web'
        return 'script suelto, se ejecuta si se invoca directamente'
    if head == 'Controller':
        return 'controlador accesible sin autenticación' if public_file else 'controlador, por acción del usuario'
    if head == 'Extension':
        return 'extensión, dentro del flujo del core'
    if head == 'Model':
        return 'modelo, al leer o guardar sus datos'
    if head == 'Lib':
        return 'librería, cuando otro código del plugin la invoca'
    return f'{head}/' if len(parts) > 1 else source.relative


def call_argument(source: Source, match: re.Match) -> str:
    """Devuelve el primer argumento de la llamada que termina la coincidencia."""
    return source.first_argument(match.end() - 1) if match.group(0).endswith('(') else ''


def variable_value(source: Source, variable: str, before: int) -> str:
    """Devuelve la expresión asignada por última vez a una variable antes de la posición."""
    pattern = re.compile(re.escape(variable) + r'\s*\.?=(?!=)\s*([^;]{1,400});')
    values = [found.group(1) for found in pattern.finditer(source.text, 0, before)]
    return ' '.join(values[-3:])


def is_standalone_script(source: Source) -> bool:
    """Indica si un PHP ejecuta código propio fuera de cualquier clase."""
    return (source.language == 'php' and source.relative != 'Init.php'
            and not PHP_CLASS_PATTERN.search(source.code)
            and re.search(r'\S', re.sub(r'<\?php|\?>', '', source.code)) is not None)


def is_cli_only(source: Source) -> bool:
    """Indica si el script aborta cuando no se ejecuta desde la línea de comandos."""
    return CLI_GUARD_PATTERN.search(source.text[:2000]) is not None


def resolve_constant(source: Source, expression: str) -> str:
    """Sustituye una constante o propiedad estática inicial por su valor literal, si lo tiene."""
    member = re.match(r'\s*(?:self|static|[A-Z]\w*)::\$?(\w+)', expression)
    if member is None:
        return expression
    name = re.escape(member.group(1))
    declared = re.search(r'(?:const\s+|\$)' + name + r'\s*=\s*([\'"][^\'"]*[\'"])', source.text)
    return declared.group(1) + expression[member.end():] if declared else expression


def dynamic_command(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Anota si el comando es fijo, si se construye con variables y si se escapa."""
    argument = call_argument(source, match).strip()
    expression = argument
    notes: list[str] = []

    variable = re.fullmatch(r'\$\w+', argument)
    if variable:
        expression = variable_value(source, argument, match.start()) or argument
        notes.append(f'el comando está en la variable {argument}')

    if re.fullmatch(r"""\s*(['"])[^'"$]*\1\s*""", expression):
        notes.append('comando fijo: ' + expression.strip())
    elif '$' in expression:
        notes.append('el comando se construye con variables')
        if 'escapeshellarg' in expression or 'escapeshellcmd' in expression:
            notes.append('escapa los argumentos con escapeshellarg/escapeshellcmd')
        elif 'escapeshellarg' in source.code or 'escapeshellcmd' in source.code:
            notes.append('el archivo usa escapeshellarg: comprueba que se aplica a este comando')
        else:
            notes.append('no escapa los argumentos: si alguno procede del usuario permite inyectar comandos')
    return True, notes, None


def destination_check(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Anota el destino de una petición cuando es un literal o una variable con URL fija."""
    argument = call_argument(source, match).strip()
    host = SCHEME_URL_PATTERN.search(resolve_constant(source, argument))
    if host is None:
        variable = re.match(r'\$\w+', argument)
        value = variable_value(source, variable.group(0), match.start()) if variable else ''
        host = SCHEME_URL_PATTERN.search(value)
    if host and host.group(1).lower() not in IGNORED_HOSTS:
        return True, [f'destino: {host.group(1).lower()}'], None
    if argument:
        return True, ['destino: ' + re.sub(r'\s+', ' ', argument)[:120]], None
    return True, [], None


def backtick_check(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Acepta el operador de comillas invertidas de PHP, que ejecuta un comando."""
    return True, ['el operador `...` de PHP ejecuta su contenido en la shell'], None


def eval_check(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Distingue un eval que decodifica contenido oculto de uno ordinario."""
    statement = source.statement(match.start())
    if re.search(r'base64_decode|gzinflate|gzuncompress|gzdecode|str_rot13|hex2bin|atob', statement, re.I):
        return True, ['ejecuta contenido decodificado: patrón típico de código malicioso'], None
    return True, [], None


def decode_check(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Eleva la severidad cuando lo decodificado se ejecuta en la misma sentencia."""
    line = source.line_of(match.start())
    start = source.line_starts[line - 1]
    end = source.code.find('\n', start)
    code_line = source.code[start:end if end != -1 else len(source.code)]
    if re.search(r'(?<![\w$>:])(eval|exec|system|shell_exec|passthru|assert|create_function|include|require)\b',
                 code_line, re.I):
        return True, ['el resultado decodificado se ejecuta en la misma línea'], 'alta'
    if re.search(r'(base64_decode|gzinflate|gzuncompress|str_rot13)\s*\(\s*(base64_decode|gzinflate|gzuncompress|str_rot13)',
                 code_line, re.I):
        return True, ['encadena varias decodificaciones, un recurso habitual para ocultar código'], 'media'
    return True, [], None


def dynamic_include(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Descarta los ``include`` de rutas fijas, como el autoload del propio plugin."""
    rest = source.code[match.end():match.end() + 200].lstrip(' (\t')
    if re.match(r"(__DIR__|dirname\s*\(|FS_FOLDER|['\"])", rest):
        return False, [], None
    return True, ['la ruta del archivo incluido se calcula en tiempo de ejecución'], None


def external_url_call(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Acepta una petición del navegador solo si su destino es un dominio absoluto."""
    window = source.text[match.end():match.end() + 200]
    url = re.match(r'''\s*[`'"]((?:https?:)?//[^`'"\s]+)''', window)
    if url is None:
        return False, [], None
    host = URL_PATTERN.match(url.group(1))
    if host is None or host.group(1).lower() in IGNORED_HOSTS:
        return False, [], None
    return True, [f'destino: {host.group(1).lower()}'], None


def url_argument(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Acepta lecturas de archivo cuyo argumento es una URL o una variable con nombre de URL."""
    window = call_argument(source, match)
    literal = re.match(r'''\s*['"](https?://[^'"\s]+)''', window)
    if literal:
        host = SCHEME_URL_PATTERN.match(literal.group(1))
        if host and host.group(1).lower() not in IGNORED_HOSTS:
            return True, [f'destino: {host.group(1).lower()}'], None
        return False, [], None
    variable = re.match(r'\s*(\$\w+)', window)
    if variable is None:
        return False, [], None
    host = assigned_host(source, variable.group(1), match.start())
    if host:
        return True, [f'destino: {host} (asignado a {variable.group(1)})'], None
    if re.search(r'url|uri|endpoint|api|host|server|remote', variable.group(1), re.I):
        return True, ['el destino es una variable: comprueba si es una URL remota'], 'baja'
    return False, [], None


def assigned_host(source: Source, variable: str, before: int) -> str | None:
    """Busca la última asignación de la variable a una URL literal antes de la posición."""
    pattern = re.compile(re.escape(variable) + r'''\s*=\s*['"](https?://[^'"\s]+)''')
    hosts = [SCHEME_URL_PATTERN.match(found.group(1)) for found in pattern.finditer(source.text, 0, before)]
    hosts = [host.group(1).lower() for host in hosts if host and host.group(1).lower() not in IGNORED_HOSTS]
    return hosts[-1] if hosts else None


def script_src(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Acepta un ``<script src>`` externo e indica si protege su integridad."""
    tag = match.group(0)
    host = URL_PATTERN.search(tag)
    if host is None or host.group(1).lower() in IGNORED_HOSTS:
        return False, [], None
    notes = [f'origen: {host.group(1).lower()}']
    notes.append('declara integrity (SRI)' if 'integrity' in tag.lower() else
                 'sin integrity (SRI): si el tercero cambia el archivo, cambia el código ejecutado')
    return True, notes, None


def writes_code(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Acepta una escritura solo si su destino es código o configuración del servidor."""
    statement = source.statement(match.start())
    target = re.search(r"\.php\b|\.phtml\b|\.phar\b|\.htaccess|\.user\.ini|php\.ini|config\.php"
                       r"|['\"/]Core/|['\"/]Dinamic/|Plugins/|\.env\b", statement, re.I)
    if target is None:
        return False, [], None
    return True, [f'destino: {target.group(0).strip(chr(39) + chr(34) + "/")}'], None


def delete_check(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Eleva el borrado de archivos cuando apunta fuera de los datos del plugin."""
    statement = source.statement(match.start())
    if re.search(r"FS_FOLDER|\.\./|['\"/]Core\b|['\"/]Plugins\b|['\"/]vendor\b|config\.php", statement):
        return True, ['el destino puede estar fuera de MyFiles o del propio plugin'], 'media'
    return True, [], None


def encoded_check(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Descarta imágenes, audio y fuentes incrustados como ``data:`` URI."""
    before = source.text[max(0, match.start() - 60):match.start()]
    if re.search(r'data:(?:image|audio|video|font|application/(?:font|x-font|pdf))[\w/+.-]*;base64,$', before, re.I):
        return False, [], None
    return True, [], None


def curlopt_check(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Anota el destino de ``CURLOPT_URL`` cuando se puede resolver."""
    value = source.statement(match.end(), 300)
    host = SCHEME_URL_PATTERN.search(resolve_constant(source, value.lstrip(' ,')))
    if host is None:
        variable = re.match(r'\s*(\$\w+)', value)
        host = SCHEME_URL_PATTERN.search(variable_value(source, variable.group(1), match.start())) if variable else None
    if host and host.group(1).lower() not in IGNORED_HOSTS:
        return True, [f'destino: {host.group(1).lower()}'], None
    return True, ['destino: ' + re.sub(r'\s+', ' ', value.strip().rstrip(')'))[:120]], None


def sql_check(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Descarta las menciones que son claves de un array, no sentencias ejecutadas."""
    after = source.text[match.end():match.end() + 12]
    if re.match(r"""\w*['"]\s*=>""", after):
        return False, [], None
    return True, [], None


def unserialize_check(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Rebaja la deserialización que restringe las clases permitidas."""
    if 'allowed_classes' in source.statement(match.start()):
        return True, ['restringe allowed_classes'], 'baja'
    return True, ['sin allowed_classes: con datos externos permite inyectar objetos'], None


def credential_check(source: Source, match: re.Match) -> tuple[bool, list[str], str | None]:
    """Descarta los valores que son claves de traducción o marcadores evidentes."""
    value = match.group('value')
    if re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)+', value) or re.fullmatch(r'[*x.•]+', value, re.I):
        return False, [], None
    if value.lower() in {'password', 'changeme', 'secret', 'token', 'api_key', 'apikey'}:
        return False, [], None
    if '/' in value or '\\' in value or value.startswith(('http', '{{', '%')):
        return False, [], None
    return True, [], None


PHP = frozenset({'php'})
JS = frozenset({'js', 'twig'})
MARKUP = frozenset({'twig'})
CODE = frozenset({'php', 'js', 'twig'})

RULES: list[Rule] = [
    # Ejecución de comandos del sistema.
    Rule('ejecucion-comandos', 'alta', 'Ejecuta un comando del sistema',
         php_call('exec', 'shell_exec', 'system', 'passthru', 'proc_open', 'popen', 'pcntl_exec', 'expect_popen'),
         PHP, check=dynamic_command),
    Rule('ejecucion-comandos', 'alta', 'Ejecuta un comando con comillas invertidas',
         re.compile(r'`'), PHP, check=backtick_check),
    Rule('ejecucion-comandos', 'alta', 'Usa Symfony Process para lanzar procesos',
         re.compile(r'Symfony\\Component\\Process|\bProcess::fromShellCommandline\b'), PHP, target='text'),

    # Código dinámico.
    Rule('codigo-dinamico', 'alta', 'Evalúa código PHP en tiempo de ejecución',
         php_call('eval', 'create_function'), PHP, check=eval_check),
    Rule('codigo-dinamico', 'media', 'Incluye un archivo PHP calculado en tiempo de ejecución',
         re.compile(r'(?<![\w$>:])(?:include|require)(?:_once)?\b', re.I), PHP, check=dynamic_include),
    Rule('codigo-dinamico', 'baja', 'Invoca una función cuyo nombre es una variable',
         php_call('call_user_func', 'call_user_func_array', 'forward_static_call'), PHP),
    Rule('codigo-dinamico', 'alta', 'Evalúa código JavaScript en tiempo de ejecución',
         re.compile(r'(?<![\w$.])eval\s*\(|\bnew\s+Function\s*\('), JS),
    Rule('codigo-dinamico', 'baja', 'Programa un temporizador con código en una cadena',
         re.compile(r'\bset(?:Timeout|Interval)\s*\(\s*[\'"]'), JS),

    # Ofuscación.
    Rule('ofuscacion', 'baja', 'Decodifica contenido codificado',
         php_call('base64_decode', 'gzuncompress', 'gzdecode', 'hex2bin'), PHP, check=decode_check),
    Rule('ofuscacion', 'media', 'Usa funciones de decodificación típicas del código ofuscado',
         php_call('gzinflate', 'str_rot13', 'convert_uudecode'), PHP, check=decode_check),
    Rule('ofuscacion', 'media', 'Contiene una cadena codificada muy larga',
         LONG_ENCODED_PATTERN, CODE, target='text', check=encoded_check),
    Rule('ofuscacion', 'media', 'Contiene una secuencia larga de escapes hexadecimales',
         HEX_ESCAPES_PATTERN, CODE, target='text'),
    Rule('ofuscacion', 'baja', 'Construye texto a partir de códigos de carácter',
         re.compile(r'String\.fromCharCode\s*\((?:\s*\d+\s*,){10,}'), JS),

    # Red saliente desde el servidor.
    Rule('red-saliente', 'media', 'Abre una conexión de red desde el servidor',
         php_call('curl_init', 'fsockopen', 'pfsockopen', 'stream_socket_client', 'socket_connect',
                  'ftp_connect', 'ftp_ssl_connect', 'ssh2_connect', 'ldap_connect'),
         PHP, check=destination_check),
    Rule('red-saliente', 'media', 'Fija la URL de una petición cURL',
         re.compile(r'\bCURLOPT_URL\s*,'), PHP, check=curlopt_check),
    Rule('red-saliente', 'media', 'Hace una petición HTTP con la clase Http del core',
         re.compile(r'\bHttp::(?:get|post|postJson|put|patch|delete)\s*\('), PHP, check=destination_check),
    Rule('red-saliente', 'media', 'Usa un cliente HTTP o SOAP de terceros',
         re.compile(r'\bnew\s+\\?SoapClient\b|GuzzleHttp\\|Symfony\\Component\\HttpClient|\bnew\s+\\?Client\s*\(\s*\[\s*[\'"]base_uri'),
         PHP, target='text'),
    Rule('red-saliente', 'media', 'Lee o copia un recurso remoto',
         php_call('file_get_contents', 'fopen', 'file', 'copy', 'readfile', 'get_headers', 'simplexml_load_file',
                  'getimagesize', 'stream_get_contents'),
         PHP, check=url_argument),
    Rule('red-saliente', 'baja', 'Envía correo con la función mail() de PHP',
         php_call('mail'), PHP),
    Rule('red-saliente', 'media', 'Hace una petición desde el navegador a un dominio externo',
         re.compile(r'\bfetch\s*\(|\.open\s*\(\s*[\'"](?:GET|POST|PUT|DELETE|PATCH)[\'"]\s*,|'
                    r'\$\.(?:ajax|get|post|getJSON)\s*\(\s*(?:\{\s*url\s*:)?', re.I),
         JS, check=external_url_call),
    Rule('red-saliente', 'media', 'Envía datos desde el navegador en segundo plano',
         re.compile(r'navigator\.sendBeacon\s*\(|\bnew\s+(?:WebSocket|EventSource)\s*\('), JS),

    # Recursos externos cargados en el navegador.
    Rule('recurso-externo', 'media', 'Carga JavaScript de un tercero en el navegador',
         re.compile(r'<script\b[^>]*\bsrc\s*=\s*["\'](?:https?:)?//[^"\']+["\'][^>]*>', re.I),
         MARKUP, target='text', check=script_src),
    Rule('recurso-externo', 'media', 'Registra JavaScript remoto en AssetManager',
         re.compile(r'AssetManager::add\w*\s*\(\s*[\'"]js[\'"]\s*,\s*[\'"](?:https?:)?//', re.I), PHP, target='text'),
    Rule('recurso-externo', 'baja', 'Carga una hoja de estilos o un iframe de un tercero',
         re.compile(r'<(?:link|iframe)\b[^>]*\b(?:href|src)\s*=\s*["\'](?:https?:)?//[^"\']+', re.I),
         MARKUP, target='text'),

    # Datos sensibles de la instalación.
    Rule('datos-sensibles', 'media', 'Lee las credenciales de la base de datos',
         re.compile(r'\bFS_DB_(?:PASS|USER|HOST)\b|Tools::config\s*\(\s*[\'"]db_(?:pass|user|host)[\'"]', re.I),
         PHP, target='text'),
    Rule('datos-sensibles', 'media', 'Accede al archivo config.php de la instalación',
         re.compile(r'[\'"/]config\.php[\'"]'), PHP, target='text'),
    Rule('datos-sensibles', 'media', 'Lee claves de sesión, contraseñas o claves de la API del core',
         re.compile(r'\$\w*user\w*\s*->\s*password\b(?!\s*\()|user\(\)\s*->\s*password\b|'
                    r'->\s*(?:logkey|two_factor_secret_key)\b(?!\s*\()|\bnew\s+ApiKey\s*\(|\bApiKey::', re.I),
         PHP),
    Rule('datos-sensibles', 'baja', 'Obtiene información del servidor o del entorno',
         php_call('phpinfo', 'php_uname', 'gethostname', 'getenv', 'get_current_user', 'getmyuid', 'posix_getpwuid',
                  'disk_free_space', 'sys_getloadavg'),
         PHP),
    Rule('datos-sensibles', 'baja', 'Lee variables de entorno o del servidor',
         re.compile(r'\$_ENV\b|\$_SERVER\s*\[\s*[\'"](?:SERVER_ADDR|DOCUMENT_ROOT|SERVER_NAME|HTTP_HOST)[\'"]'),
         PHP, target='text'),
    Rule('datos-sensibles', 'baja', 'Lee cookies o almacenamiento del navegador',
         re.compile(r'document\.cookie\b|\blocalStorage\.getItem\b|\bsessionStorage\.getItem\b'), JS),

    # Escritura de código o configuración.
    Rule('modificacion-instalacion', 'alta', 'Escribe código PHP o configuración del servidor',
         php_call('file_put_contents', 'fwrite', 'fputs', 'copy', 'rename', 'move_uploaded_file', 'symlink', 'link'),
         PHP, check=writes_code),
    Rule('modificacion-instalacion', 'alta', 'Modifica la configuración de seguridad de PHP',
         re.compile(r'ini_set\s*\(\s*[\'"](?:disable_functions|open_basedir|allow_url_include|allow_url_fopen|'
                    r'auto_prepend_file|auto_append_file)[\'"]', re.I),
         PHP, target='text'),

    # Sistema de archivos.
    Rule('sistema-archivos', 'media', 'Cambia permisos o propietario de archivos',
         php_call('chmod', 'chown', 'chgrp', 'lchown', 'umask'), PHP),
    Rule('sistema-archivos', 'baja', 'Borra archivos o directorios',
         re.compile(r'(?<![\w$>:])(?<!function )(?:unlink|rmdir)\s*\(|\bTools::folderDelete\s*\(', re.I),
         PHP, check=delete_check),

    # Accesos y privilegios.
    Rule('acceso-publico', 'media', 'Controlador que no exige iniciar sesión',
         re.compile(r'\$requiresAuth\s*=\s*false\b|\bfunction\s+publicCore\s*\('), PHP),
    Rule('acceso-publico', 'baja', 'Registra rutas web personalizadas',
         re.compile(r'\bKernel::addRoutes?\s*\('), PHP),
    Rule('privilegios', 'media', 'Concede privilegios de administrador',
         re.compile(r'->\s*admin\s*=\s*(?:true|1)\b', re.I), PHP),
    Rule('privilegios', 'media', 'Cambia la contraseña de un usuario',
         re.compile(r'\$\w*user\w*\s*->\s*(?:setPassword\s*\(|password\s*=(?!=))', re.I), PHP),
    Rule('credenciales-embebidas', 'media', 'Contiene una contraseña, token o clave escrita en el código',
         re.compile(r'''['"]?\b\w*(?:password|passwd|secret|token|api_?key|apikey)\w*['"]?\s*(?:=>|=|:)\s*'''
                    r'''['"](?P<value>[^'"\s$]{8,})['"]''', re.I),
         CODE, target='text', check=credential_check),

    # Otros comportamientos arriesgados.
    Rule('deserializacion', 'media', 'Deserializa datos con unserialize()',
         php_call('unserialize'), PHP, check=unserialize_check),
    Rule('sql-destructivo', 'alta', 'Ejecuta SQL de administración del servidor de base de datos',
         re.compile(r'(?<![\w-])(?:DROP\s+DATABASE|CREATE\s+USER|GRANT\s+ALL|ALTER\s+USER|SET\s+PASSWORD|'
                    r'INTO\s+OUTFILE|LOAD_FILE\s*\()', re.I),
         PHP, target='text', check=sql_check),
    Rule('sql-destructivo', 'baja', 'Borra o vacía tablas con SQL directo',
         re.compile(r'(?<![\w-])(?:DROP|TRUNCATE)\s+TABLE\b', re.I), PHP, target='text', check=sql_check),
    Rule('entorno-php', 'baja', 'Oculta errores o prolonga la ejecución de PHP',
         re.compile(r'error_reporting\s*\(\s*0\s*\)|ignore_user_abort\s*\(\s*(?:true|1)|set_time_limit\s*\(\s*0\s*\)',
                    re.I),
         PHP),
]


def iter_files(plugin_dir: Path, include_vendor: bool,
               include_tests: bool = False) -> tuple[list[Path], list[Path]]:
    """Devuelve los archivos del plugin y, aparte, los de ``vendor/`` que no se analizan.

    Los directorios de tests se omiten salvo que se pidan: FacturaScripts no los
    carga y sus datos de prueba (claves, contraseñas) solo generan ruido.
    """
    files: list[Path] = []
    vendor: list[Path] = []
    for root, dirs, names in os.walk(plugin_dir):
        relative_parts = Path(root).relative_to(plugin_dir).parts
        dirs[:] = sorted(
            name for name in dirs
            if name not in EXCLUDED_DIRS and (include_tests or relative_parts or name not in TEST_DIRS)
        )
        in_vendor = VENDOR_DIR in relative_parts
        for name in sorted(names):
            path = Path(root) / name
            if in_vendor and not include_vendor:
                vendor.append(path)
            else:
                files.append(path)
    return files, vendor


def is_public_controller(source: Source) -> bool:
    """Indica si un controlador puede ejecutarse sin que el usuario inicie sesión."""
    return bool(re.search(r'\$requiresAuth\s*=\s*false\b|\bfunction\s+publicCore\s*\(', source.code))


def lower_severity(severity: str) -> str:
    """Rebaja un nivel la severidad, sin bajar de ``info``."""
    order = ['info', 'baja', 'media', 'alta']
    return order[max(0, order.index(severity) - 1)]


def scan_source(source: Source) -> list[Finding]:
    """Aplica todas las reglas a un archivo y devuelve sus hallazgos."""
    findings: list[Finding] = []
    public = source.language == 'php' and is_public_controller(source)
    seen: set[tuple[str, int]] = set()

    for rule in RULES:
        if source.language not in rule.languages:
            continue
        haystack = source.code if rule.target == 'code' else source.text
        for match in rule.pattern.finditer(haystack):
            keep, notes, severity = True, [], None
            if rule.check is not None:
                keep, notes, severity = rule.check(source, match)
            if not keep:
                continue

            line = source.line_of(match.start())
            if (rule.title, line) in seen:
                continue
            seen.add((rule.title, line))

            context = execution_context(source, match.start(), public)
            severity = severity or rule.severity
            if context.startswith('tests'):
                severity = lower_severity(severity)
            if source.minified:
                severity = lower_severity(severity)
                notes = notes + ['archivo minificado, probablemente una librería de terceros']
            if context.startswith('script de línea de comandos'):
                severity = lower_severity(severity)

            findings.append(Finding(
                category=rule.category, severity=severity, title=rule.title,
                file=source.relative, line=line, snippet=source.snippet(match.start()),
                context=context, notes=notes,
            ))

    return findings


def correlate(findings: list[Finding]) -> list[Finding]:
    """Señala los archivos que leen datos sensibles y abren conexiones de red.

    Que ambas cosas ocurran en el mismo archivo no prueba un envío, pero es el
    patrón que hay que descartar primero al revisar un plugin desconocido.
    """
    by_file: dict[str, list[Finding]] = {}
    for finding in findings:
        by_file.setdefault(finding.file, []).append(finding)

    extra: list[Finding] = []
    for file, items in by_file.items():
        network = [item for item in items if item.category == 'red-saliente' and item.severity != 'info']
        sensitive = [item for item in items if item.category == 'datos-sensibles']
        if not network or not sensitive:
            continue
        lines = ', '.join(str(item.line) for item in sensitive)
        for item in network:
            extra.append(Finding(
                category='posible-exfiltracion', severity='alta',
                title='Lee datos sensibles y abre una conexión de red en el mismo archivo',
                file=file, line=item.line, snippet=item.snippet, context=item.context,
                notes=[f'datos sensibles leídos en las líneas {lines}',
                       'revisa qué datos incluye la petición y a qué destino van'],
            ))
    return extra


def collect_domains(sources: list[Source]) -> list[dict]:
    """Inventaría los dominios externos que el plugin menciona en su código.

    Cada aparición se clasifica como ``llamada`` si la línea hace una petición,
    ``script`` si carga código en el navegador o ``referencia`` en otro caso
    (enlaces, textos de ayuda, identificadores).
    """
    call_hint = re.compile(r'curl_|Http::|file_get_contents|fopen|fsockopen|fetch\s*\(|\$\.(?:ajax|get|post)|'
                           r'XMLHttpRequest|SoapClient|base_uri|sendBeacon|WebSocket|->(?:get|post|request)\s*\(',
                           re.I)
    domains: dict[str, dict] = {}
    for source in sources:
        for match in URL_PATTERN.finditer(source.text):
            # Evita confundir un comentario JS residual o una división con una URL.
            prefix = source.text[max(0, match.start() - 6):match.start()]
            if not match.group(0).lower().startswith('http') and not re.search(r'''(src|href)\s*=\s*['"]$''', prefix, re.I):
                continue
            host = match.group(1).lower().rstrip('.')
            if host in IGNORED_HOSTS or re.fullmatch(r'[\d.]+', host) and host.startswith('127.'):
                continue
            line = source.line_of(match.start())
            line_text = source.text[source.line_starts[line - 1]:source.text.find('\n', match.start())]
            if re.search(r'<script\b', line_text, re.I) or 'AssetManager' in line_text:
                usage = 'script'
            elif call_hint.search(line_text):
                usage = 'llamada'
            else:
                usage = 'referencia'
            entry = domains.setdefault(host, {'dominio': host, 'usos': set(), 'apariciones': []})
            entry['usos'].add(usage)
            location = f'{source.relative}:{line}'
            if location not in entry['apariciones']:
                entry['apariciones'].append(location)

    priority = {'llamada': 0, 'script': 1, 'referencia': 2}
    result = []
    for entry in domains.values():
        usos = sorted(entry['usos'], key=priority.get)
        result.append({'dominio': entry['dominio'], 'usos': usos, 'apariciones': entry['apariciones']})
    return sorted(result, key=lambda item: (priority[item['usos'][0]], item['dominio']))


def mark_called_domains(domains: list[dict], findings: list[Finding]) -> list[dict]:
    """Marca como ``llamada`` los dominios que un hallazgo de red identifica como destino.

    La URL suele asignarse a una variable en una línea y usarse en otra, así que
    la clasificación por línea de ``collect_domains`` no basta.
    """
    targets = {
        note.split(': ', 1)[1].split(' ')[0]
        for item in findings if item.category in ('red-saliente', 'posible-exfiltracion')
        for note in item.notes if note.startswith('destino: ')
    }
    for entry in domains:
        if entry['dominio'] in targets and 'llamada' not in entry['usos']:
            entry['usos'].insert(0, 'llamada')
    priority = {'llamada': 0, 'script': 1, 'referencia': 2}
    return sorted(domains, key=lambda item: (priority[item['usos'][0]], item['dominio']))


def structure_findings(plugin_dir: Path, files: list[Path], sources: list[Source]) -> list[Finding]:
    """Revisa los archivos del plugin que no son código analizable."""
    findings: list[Finding] = []

    def add(severity: str, title: str, relative: str, notes: list[str] | None = None) -> None:
        """Registra un hallazgo de estructura asociado a un archivo."""
        findings.append(Finding(category='estructura', severity=severity, title=title, file=relative,
                                line=0, snippet='', context='archivo del plugin', notes=notes or []))

    for path in files:
        relative = path.relative_to(plugin_dir).as_posix()
        parts = relative.split('/')
        name = path.name
        suffix = path.suffix.lower()

        if suffix == '.php' and parts[0] == 'Assets':
            add('alta', 'Archivo PHP dentro de Assets/', relative,
                ['Assets/ se publica en Dinamic/Assets/, que el .htaccess sirve sin pasar por index.php: '
                 'el servidor podría ejecutarlo directamente'])
        elif name in SERVER_CONFIG_FILES:
            add('media', 'Incluye configuración del servidor web o de PHP', relative)
        elif suffix in EXECUTABLE_EXTENSIONS:
            add('media', 'Incluye un ejecutable o un script ajeno a PHP', relative)
        elif os.access(path, os.X_OK) and has_shebang(path):
            add('media', 'Incluye un script ejecutable con shebang', relative)

        if any(part.startswith('.') and part not in ALLOWED_HIDDEN for part in parts) and name not in SERVER_CONFIG_FILES:
            add('baja', 'Archivo o directorio oculto', relative)

        if name in ('composer.json', 'package.json'):
            try:
                data = json.loads(path.read_text(encoding='utf-8', errors='replace'))
            except ValueError:
                continue
            scripts = data.get('scripts') if isinstance(data, dict) else None
            if isinstance(scripts, dict) and scripts:
                hooks = sorted(key for key in scripts if re.match(r'(pre|post)[-_]?(install|update|autoload)', key)
                               or key in ('install', 'prepare', 'preinstall', 'postinstall'))
                severity = 'media' if hooks else 'baja'
                notes = [f'scripts: {", ".join(sorted(scripts))}']
                if hooks:
                    notes.append('se ejecutan automáticamente al instalar las dependencias: ' + ', '.join(hooks))
                add(severity, f'{name} declara scripts', relative, notes)

    for source in sources:
        if is_standalone_script(source) and is_cli_only(source):
            add('info', 'Script PHP de línea de comandos', source.relative,
                ['aborta si no se ejecuta con php-cli, así que no puede lanzarse desde el navegador'])
        elif is_standalone_script(source):
            add('baja', 'Script PHP suelto, fuera de una clase', source.relative,
                ['FacturaScripts no lo carga, pero se ejecuta si el servidor permite abrirlo directamente '
                 '(el .htaccess de ejemplo lo impide; revisa nginx u otras configuraciones)'])
        if source.minified:
            add('info', 'JavaScript minificado: no es revisable a mano', source.relative)

    return findings


def has_shebang(path: Path) -> bool:
    """Indica si el archivo empieza por ``#!``, es decir, si es un script ejecutable."""
    try:
        with path.open('rb') as handle:
            return handle.read(2) == b'#!'
    except OSError:
        return False


def read_plugin_meta(plugin_dir: Path) -> dict:
    """Lee el nombre y la versión del ``facturascripts.ini``, si existe."""
    meta = {'name': plugin_dir.name, 'version': '?', 'ini': False}
    ini_path = plugin_dir / 'facturascripts.ini'
    if not ini_path.is_file():
        return meta
    meta['ini'] = True
    for line in ini_path.read_text(encoding='utf-8', errors='replace').splitlines():
        if '=' in line and not line.strip().startswith((';', '#')):
            key, value = line.split('=', 1)
            if key.strip() in ('name', 'version'):
                meta[key.strip()] = value.strip().strip('"\'')
    return meta


def audit(plugin_dir: Path, include_vendor: bool = False, include_tests: bool = False) -> dict:
    """Analiza el plugin y construye el informe completo."""
    files, vendor = iter_files(plugin_dir, include_vendor, include_tests)
    sources = [source for source in (load_source(path, plugin_dir) for path in files) if source is not None]

    findings: list[Finding] = []
    for source in sources:
        findings.extend(scan_source(source))
    findings.extend(correlate(findings))
    findings.extend(structure_findings(plugin_dir, files, sources))
    findings.sort(key=lambda item: (-SEVERITY_ORDER[item.severity], item.category, item.file, item.line))

    meta = read_plugin_meta(plugin_dir)
    counts = {level: sum(1 for item in findings if item.severity == level) for level in SEVERITY_ORDER}
    languages: dict[str, int] = {}
    for source in sources:
        languages[source.language] = languages.get(source.language, 0) + 1

    limitations = [
        'Análisis estático por patrones: no sigue el flujo de datos ni resuelve variables, así que '
        'confirma a mano qué datos se envían y a qué destino.',
        'Una URL construida por partes o descargada en tiempo de ejecución no aparece en el inventario de dominios.',
        'Las dependencias de require en facturascripts.ini no se analizan.',
    ]
    vendor_php = [path for path in vendor if path.suffix == '.php']
    if vendor:
        limitations.append(
            f'vendor/ incluye {len(vendor)} archivos ({len(vendor_php)} PHP) de terceros que no se han analizado; '
            'usa --include-vendor para revisarlos.'
        )
    if not meta['ini']:
        limitations.append('No hay facturascripts.ini: la ruta puede no ser un plugin de FacturaScripts.')

    return {
        'plugin': {'name': meta['name'], 'version': meta['version'], 'path': str(plugin_dir)},
        'analizados': {'archivos': len(files), 'por_lenguaje': languages, 'vendor_sin_analizar': len(vendor)},
        'resumen': counts,
        'requiere_revision': counts['alta'] + counts['media'] > 0,
        'hallazgos': [
            {
                'categoria': item.category, 'severidad': item.severity, 'titulo': item.title,
                'archivo': item.file, 'linea': item.line, 'codigo': item.snippet,
                'contexto': item.context, 'notas': item.notes,
            }
            for item in findings
        ],
        'dominios': mark_called_domains(collect_domains(sources), findings),
        'limitaciones': limitations,
    }


def filter_report(report: dict, min_severity: str) -> dict:
    """Descarta del informe los hallazgos por debajo de la severidad indicada."""
    threshold = SEVERITY_ORDER[min_severity]
    report['hallazgos'] = [item for item in report['hallazgos'] if SEVERITY_ORDER[item['severidad']] >= threshold]
    return report


def group_findings(findings: list[dict]) -> list[list[dict]]:
    """Agrupa los hallazgos con la misma regla en el mismo archivo, conservando el orden."""
    groups: dict[tuple, list[dict]] = {}
    for item in findings:
        key = (item['severidad'], item['categoria'], item['titulo'], item['archivo'])
        groups.setdefault(key, []).append(item)
    return list(groups.values())


def print_report(report: dict) -> None:
    """Muestra el informe en texto legible por una persona."""
    plugin = report['plugin']
    counts = report['resumen']
    languages = ', '.join(f'{name} {total}' for name, total in sorted(report['analizados']['por_lenguaje'].items()))

    print(f"Plugin: {plugin['name']} {plugin['version']}")
    print(f"Ruta: {plugin['path']}")
    print(f"Archivos: {report['analizados']['archivos']} ({languages or 'ninguno analizable'})")
    print(f"Hallazgos: alta {counts['alta']}, media {counts['media']}, baja {counts['baja']}, info {counts['info']}")
    print()
    if report['requiere_revision']:
        print('RESULTADO: REVISAR. El plugin tiene comportamientos que conviene comprobar antes de instalarlo.')
    else:
        print('RESULTADO: SIN HALLAZGOS RELEVANTES. No se han detectado comportamientos de severidad media o alta.')
    print()

    current = None
    for group in group_findings(report['hallazgos']):
        first = group[0]
        header = (first['severidad'], first['categoria'])
        if header != current:
            current = header
            print(f"[{SEVERITY_LABELS[first['severidad']]}] {CATEGORY_TITLES.get(first['categoria'], first['categoria'])}")
        lines = [str(item['linea']) for item in group if item['linea']]
        location = first['archivo'] + (':' + lines[0] if len(lines) == 1 else '')
        print(f"  - {location} — {first['titulo']}")
        if len(lines) > 1:
            print(f"      líneas: {', '.join(lines)}")
        contexts = list(dict.fromkeys(item['contexto'] for item in group))
        print(f"      contexto: {'; '.join(contexts)}")
        if first['codigo']:
            print(f"      código: {first['codigo']}")
        if len(group) > 1:
            # Con varias líneas, cada nota indica a cuál se refiere.
            notes = list(dict.fromkeys(f"línea {item['linea']}: {note}" if item['linea'] else note
                                       for item in group for note in item['notas']))
        else:
            notes = first['notas']
        for note in notes[:10]:
            print(f'      nota: {note}')
        if len(notes) > 10:
            print(f'      nota: y {len(notes) - 10} notas más en el informe --json')
    if report['hallazgos']:
        print()

    if report['dominios']:
        print('Dominios externos mencionados en el código:')
        for entry in report['dominios']:
            places = entry['apariciones']
            shown = ', '.join(places[:3]) + (f' y {len(places) - 3} más' if len(places) > 3 else '')
            print(f"  - {entry['dominio']} ({', '.join(entry['usos'])}): {shown}")
        print()

    print('Limitaciones:')
    for limitation in report['limitaciones']:
        print(f'  - {limitation}')


def main(argv: list[str] | None = None) -> int:
    """Punto de entrada del script."""
    parser = argparse.ArgumentParser(
        description='Audita los comportamientos sensibles para la seguridad de un plugin de FacturaScripts.')
    parser.add_argument('plugin', help='Ruta del plugin a auditar')
    parser.add_argument('--json', action='store_true', help='Muestra el informe en formato JSON')
    parser.add_argument('--min-severity', choices=tuple(SEVERITY_ORDER), default='info',
                        help='Oculta los hallazgos con severidad inferior a la indicada')
    parser.add_argument('--include-vendor', action='store_true',
                        help='Analiza también las librerías de vendor/ incluidas en el plugin')
    parser.add_argument('--include-tests', action='store_true',
                        help='Analiza también el directorio Test/ del plugin')
    args = parser.parse_args(argv)

    plugin_dir = Path(args.plugin).expanduser().resolve()
    if not plugin_dir.is_dir():
        print(f'Error: {plugin_dir} no es un directorio.', file=sys.stderr)
        return 2

    report = filter_report(audit(plugin_dir, args.include_vendor, args.include_tests), args.min_severity)

    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print_report(report)

    return 1 if report['requiere_revision'] else 0


if __name__ == '__main__':
    sys.exit(main())
