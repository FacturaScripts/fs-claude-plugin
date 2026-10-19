#!/usr/bin/env python3
"""Actualiza el año de copyright en la cabecera de archivos de FacturaScripts.

Solo modifica la primera línea ``Copyright (C)`` que aparezca dentro del primer
bloque de comentario del archivo (``/* ... */``, ``<!-- ... -->`` o
``{# ... #}``), que es donde FacturaScripts coloca su cabecera de licencia. Las
menciones posteriores, como las de otros autores o las que aparecen dentro de
cadenas del código, se conservan intactas.

Casos que gestiona (en modo normal), tomando siempre el último año o rango de
la lista de años:

1. Sin año → añade el año actual.
   ``Copyright (C) Carlos`` → ``Copyright (C) 2026 Carlos``
2. Año igual al actual, o posterior → sin cambios.
   ``Copyright (C) 2026 Carlos`` → sin cambios
3. Año anterior al actual → lo convierte en rango.
   ``Copyright (C) 2023, Carlos`` → ``Copyright (C) 2023-2026, Carlos``
4. Rango cuyo año final es el actual, o posterior → sin cambios.
5. Rango cuyo año final es anterior → actualiza el año final y normaliza los
   espacios del guion.
   ``Copyright (C) 2023 - 2024 Carlos`` → ``Copyright (C) 2023-2026 Carlos``
6. Lista de años → actualiza solo el último elemento.
   ``Copyright (C) 2019, 2021 Carlos`` → ``Copyright (C) 2019, 2021-2026 Carlos``

En modo archivo nuevo (``--new``) sustituye los años de la cabecera por el año
actual: ``Copyright (C) 2013-2025 Carlos`` → ``Copyright (C) 2026 Carlos``.

Solo actúa sobre archivos que pertenecen al core o a un plugin de FacturaScripts:

- Archivos con ``namespace FacturaScripts\\``.
- Archivos situados dentro de un plugin (carpeta con ``facturascripts.ini``) o
  de una instalación del core (``composer.json`` de
  ``facturascripts/facturascripts`` o carpetas ``Core``, ``Plugins`` y ``Dinamic``).

El archivo se lee y se escribe como bytes UTF-8, de modo que conserva los
finales de línea (LF o CRLF) y la marca BOM. Si no es UTF-8 válido no se toca.

Uso: update-copyright.py <file_path> <current_year> [--new]

Código de salida: 0 si termina (con o sin cambios) y 1 si los argumentos no son
válidos o no se puede leer o escribir el archivo.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Optional, Tuple

# Delimitadores de los comentarios que pueden contener la cabecera de licencia.
COMMENT_DELIMITERS: Tuple[Tuple[str, str], ...] = (('/*', '*/'), ('<!--', '-->'), ('{#', '#}'))

# Un elemento de la lista de años: un año o un rango, con espacios opcionales en el guion.
_YEAR_ITEM = r'\d{4}(?:[ \t]*-[ \t]*\d{4})?'

# Línea de copyright: prefijo, lista opcional de años y lo que siga, que nunca se modifica.
COPYRIGHT_PATTERN = re.compile(
    r'(?P<prefix>Copyright \(C\)[ \t]*)'
    r'(?P<years>' + _YEAR_ITEM + r'(?:[ \t]*,[ \t]*' + _YEAR_ITEM + r')*)?'
    r'(?![\d])'
)


def _is_copyright_update_enabled() -> bool:
    """Comprueba si updateCopyright está activado en ~/.fs-claude.json.

    Returns:
        ``True`` si la opción está activada o no se puede leer (valor por defecto).
    """
    fs_claude = Path.home() / '.fs-claude.json'
    if not fs_claude.exists():
        return True
    try:
        config = json.loads(fs_claude.read_text(encoding='utf-8'))
        return bool(config.get('settings', {}).get('updateCopyright', True))
    except Exception:
        return True


def _is_facturascripts_root(directory: Path) -> bool:
    """Indica si el directorio es la raíz de una instalación del core de FacturaScripts.

    Args:
        directory: Directorio que se comprueba.

    Returns:
        ``True`` si su ``composer.json`` es el del core o contiene Core, Plugins y Dinamic.
    """
    composer = directory / 'composer.json'
    if composer.is_file():
        try:
            data = json.loads(composer.read_text(encoding='utf-8'))
            if data.get('name') == 'facturascripts/facturascripts':
                return True
        except Exception:
            pass

    return all((directory / name).is_dir() for name in ('Core', 'Plugins', 'Dinamic'))


def is_facturascripts_file(file_path: Path, content: str) -> bool:
    """Indica si el archivo pertenece al core o a un plugin de FacturaScripts.

    Se considera de FacturaScripts si declara un namespace ``FacturaScripts\\`` o si
    algún directorio ascendente es la raíz de un plugin (contiene ``facturascripts.ini``)
    o de una instalación del core.

    Args:
        file_path: Ruta del archivo.
        content: Contenido del archivo.

    Returns:
        ``True`` si el archivo es de FacturaScripts.
    """
    if 'namespace FacturaScripts\\' in content:
        return True

    for directory in file_path.resolve().parents:
        if (directory / 'facturascripts.ini').is_file() or _is_facturascripts_root(directory):
            return True
    return False


def header_span(content: str) -> Optional[Tuple[int, int]]:
    """Localiza el primer bloque de comentario del archivo, que contiene la cabecera.

    Args:
        content: Contenido completo del archivo.

    Returns:
        Posiciones de inicio y fin del bloque, o ``None`` si no hay ninguno. Un
        comentario sin cerrar se extiende hasta el final del archivo.
    """
    best: Optional[Tuple[int, int]] = None
    for opener, closer in COMMENT_DELIMITERS:
        start = content.find(opener)
        if start == -1 or (best is not None and start >= best[0]):
            continue
        end = content.find(closer, start + len(opener))
        best = (start, len(content) if end == -1 else end + len(closer))
    return best


def _updated_years(years: Optional[str], current_year: int, is_new_file: bool) -> Optional[str]:
    """Calcula la nueva lista de años de una línea de copyright.

    Args:
        years: Texto de los años tal como aparece en el archivo, o ``None`` si no hay.
        current_year: Año actual.
        is_new_file: Si es ``True`` la lista se sustituye por el año actual.

    Returns:
        El nuevo texto de los años, o ``None`` si no hay que cambiar nada.
    """
    if is_new_file or years is None:
        return None if years == str(current_year) else str(current_year)

    # Solo se actualiza el último elemento de la lista; el resto se conserva tal cual.
    head, separator, last = years.rpartition(',')
    numbers = [int(value) for value in re.findall(r'\d{4}', last)]
    start, end = numbers[0], numbers[-1]

    # El año final ya es el actual o es posterior (por ejemplo, una fecha futura): no se toca.
    if end >= current_year:
        return None

    spacing = last[:len(last) - len(last.lstrip())]
    return f'{head}{separator}{spacing}{start}-{current_year}'


def update_copyright_year(content: str, current_year: int, is_new_file: bool = False) -> str:
    """Actualiza la primera línea de copyright de la cabecera del archivo.

    Args:
        content: Contenido completo del archivo.
        current_year: Año actual.
        is_new_file: ``True`` si el archivo se acaba de crear y debe llevar solo el año actual.

    Returns:
        El contenido con la cabecera actualizada, o el original si no hay cambios.
    """
    span = header_span(content)
    if span is None:
        return content

    match = COPYRIGHT_PATTERN.search(content, span[0], span[1])
    if match is None:
        return content

    years = match.group('years')
    new_years = _updated_years(years, current_year, is_new_file)
    if new_years is None:
        return content

    if years is not None:
        return content[:match.start('years')] + new_years + content[match.end('years'):]

    # Sin años: se insertan tras «Copyright (C)» y, si sigue un autor, separados por un espacio.
    following = content[match.end():match.end() + 1]
    replacement = match.group('prefix').rstrip(' \t') + ' ' + new_years
    if following not in ('', '\n', '\r'):
        replacement += ' '
    return content[:match.start()] + replacement + content[match.end():]


def main() -> None:
    """Lee los argumentos, comprueba que el archivo es de FacturaScripts y actualiza su copyright."""
    if not _is_copyright_update_enabled():
        sys.exit(0)
    if len(sys.argv) < 3 or len(sys.argv) > 4:
        print(f"Uso: {sys.argv[0]} <file_path> <current_year> [--new]", file=sys.stderr)
        sys.exit(1)

    file_path = Path(sys.argv[1])
    is_new_file = '--new' in sys.argv

    try:
        current_year = int(sys.argv[2])
    except ValueError:
        print(f"Error: el año debe ser un número entero, recibido: {sys.argv[2]}", file=sys.stderr)
        sys.exit(1)

    try:
        raw = file_path.read_bytes()
    except OSError as error:
        print(f"Error leyendo {file_path}: {error}", file=sys.stderr)
        sys.exit(1)

    try:
        original = raw.decode('utf-8')
    except UnicodeDecodeError:
        print(f"Aviso: {file_path} no es UTF-8 válido; no se actualiza el copyright.", file=sys.stderr)
        sys.exit(0)

    if not is_facturascripts_file(file_path, original):
        sys.exit(0)

    updated = update_copyright_year(original, current_year, is_new_file)
    if updated == original:
        return

    try:
        file_path.write_bytes(updated.encode('utf-8'))
    except OSError as error:
        print(f"Error escribiendo {file_path}: {error}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
