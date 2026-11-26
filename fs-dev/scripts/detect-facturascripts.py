#!/usr/bin/env python3
"""Detecta si la sesión trabaja dentro de una instalación de FacturaScripts e inyecta contexto.

Hook ``SessionStart`` de fs-dev, compartido por Claude Code y Codex en Linux,
macOS y Windows. Busca desde el directorio de trabajo hacia arriba la raíz de
una instalación de FacturaScripts ERP (por ejemplo, la raíz del core o uno de
sus plugins bajo ``Plugins/``). Un repositorio de plugin situado fuera de una
instalación no se detecta.

Si la detecta, imprime en stdout el contexto que el host añade a la sesión
para que use automáticamente las skills del plugin fs-dev, junto con la regla
del árbol de documentación (``AGENTS.md`` y ``Doc/``) que pueden tener el core
y cada plugin y las rutas de la que existe en el plugin actual y en el core.

Sustituye al antiguo ``detect-facturascripts.sh``, que necesitaba bash: en
Windows, Codex ejecuta los hooks con ``cmd.exe``, y ``bash`` puede no existir o
ser el de WSL.

Código de salida: siempre 0. Un error nunca bloquea el inicio de la sesión.

@author Esteban Sánchez Martínez <esteban@factura.city>
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import List, Optional

# Nombre del proyecto en el composer.json del core, tal y como lo buscaba el script de bash.
COMPOSER_NAME = re.compile(r'"name":.*"facturascripts/facturascripts"')

# Directorios característicos de la raíz de una instalación.
ROOT_DIRS = ('Core', 'Plugins', 'Dinamic')

# Documentación de cada carpeta que el modelo debe consultar si existe.
DOC_FILES = ('AGENTS.md', 'Doc/Context/README.md')

# Contexto que se añade a la sesión cuando se detecta la instalación.
CONTEXT = """=== CONTEXTO: Proyecto FacturaScripts detectado ===
Estás trabajando en FacturaScripts ERP o uno de sus plugins.
- Usa SIEMPRE las skills del plugin fs-dev para tareas de programación y, cuando estén disponibles, sus agentes o perfiles especializados.
- Usa SIEMPRE el plugin fs-mcp para obtener datos de una instancia de FacturaScripts.
- Usa el plugin fs-forja (herramientas `forja_*`) para gestionar en la forja de facturascripts.com los plugins publicados: versiones, documentación, traducciones, noticias, errores e issues. fs-mcp no trabaja con la forja.
- TRADUCCIONES: añade claves de traducción ÚNICAMENTE al archivo `Translation/es_ES.json`. Nunca modifiques otros archivos de idioma (en_EN.json, ca_ES.json, de_DE.json, etc.).
- DOCUMENTACIÓN: el core y cada plugin de `Plugins/<Plugin>/` pueden tener su propio árbol de documentación: `AGENTS.md` (qué es y sus reglas) y `Doc/` (`User`, `Dev`, `Context` con su índice `README.md`, `Assets` y `forja.json`). Antes de cambiar el core o un plugin, lee su `AGENTS.md` y el índice `Doc/Context/README.md` si existen, y abre solo lo que necesites; si un cambio del core afecta a un plugin, mira también la documentación de ese plugin. Actualiza esa documentación en el mismo trabajo que cambia el código; para crear o completar la estructura usa la skill `fs-dev:crear-documentacion` (si `Doc/Context` queda vacío, lo rellena con `fs-dev:context-writer` a partir del historial git y del código) y, para escribir una página de `Doc/User` o `Doc/Dev`, `fs-dev:docs-writer`.
"""


def is_facturascripts_root(folder: Path) -> bool:
    """Indica si una carpeta es la raíz de una instalación de FacturaScripts.

    Args:
        folder: Carpeta que se comprueba.

    Returns:
        ``True`` si su ``composer.json`` es el del core o si tiene ``Core``, ``Plugins`` y ``Dinamic``.
    """
    composer = folder / 'composer.json'
    if composer.is_file():
        try:
            text = composer.read_text(encoding='utf-8', errors='replace')
        except OSError:
            text = ''
        if any(COMPOSER_NAME.search(line) for line in text.splitlines()):
            return True
    return all((folder / name).is_dir() for name in ROOT_DIRS)


def find_root(start: Path) -> Optional[Path]:
    """Busca la raíz de la instalación desde una carpeta hacia arriba.

    Args:
        start: Directorio de trabajo de la sesión.

    Returns:
        La raíz encontrada o ``None`` si ninguna carpeta lo es.
    """
    for folder in (start, *start.parents):
        if is_facturascripts_root(folder):
            return folder
    return None


def find_plugin(start: Path, root: Path) -> Optional[Path]:
    """Busca el plugin actual: la primera carpeta con ``facturascripts.ini`` por debajo de la raíz.

    Args:
        start: Directorio de trabajo de la sesión.
        root: Raíz de la instalación.

    Returns:
        La carpeta del plugin o ``None`` si el directorio de trabajo no está en uno.
    """
    for folder in (start, *start.parents):
        if folder == root:
            return None
        if (folder / 'facturascripts.ini').is_file():
            return folder
    return None


def existing_docs(base: Path, label: str) -> List[str]:
    """Devuelve las líneas de la documentación que existe en una carpeta.

    Args:
        base: Carpeta del plugin o del core.
        label: Etiqueta que precede a cada ruta (``Plugin <nombre>`` o ``Core``).

    Returns:
        Una línea por cada archivo de ``DOC_FILES`` que existe, con su ruta nativa.
    """
    return [f'  - {label}: {base.joinpath(*name.split("/"))}' for name in DOC_FILES
            if base.joinpath(*name.split('/')).is_file()]


def build_context(start: Path) -> str:
    """Construye el contexto de la sesión para un directorio de trabajo.

    Args:
        start: Directorio de trabajo de la sesión.

    Returns:
        El texto que se añade a la sesión, o una cadena vacía si no es FacturaScripts.
    """
    root = find_root(start)
    if root is None:
        return ''

    docs: List[str] = []
    plugin = find_plugin(start, root)
    if plugin is not None:
        docs.extend(existing_docs(plugin, f'Plugin {plugin.name}'))
    docs.extend(existing_docs(root, 'Core'))

    if not docs:
        return CONTEXT
    return CONTEXT + 'Documentación existente que debes consultar:\n' + '\n'.join(docs) + '\n'


def use_utf8_stdout() -> None:
    """Escribe en UTF-8 también en Windows, donde una tubería usaría la página de códigos local."""
    reconfigure = getattr(sys.stdout, 'reconfigure', None)
    if reconfigure is not None:
        try:
            reconfigure(encoding='utf-8')
        except (OSError, ValueError):
            pass


def main() -> int:
    """Imprime el contexto si el directorio de trabajo está en una instalación de FacturaScripts.

    Returns:
        Siempre 0: los errores se notifican por stderr sin bloquear al host.
    """
    use_utf8_stdout()
    try:
        sys.stdout.write(build_context(Path.cwd()))
    except Exception as error:  # noqa: BLE001 - el hook nunca debe interrumpir al host.
        print(f'fs-dev: error inesperado al detectar FacturaScripts: {error!r}', file=sys.stderr)
    return 0


if __name__ == '__main__':
    sys.exit(main())
