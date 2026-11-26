#!/usr/bin/env python3
"""Detecta si la sesión trabaja dentro de una instalación de FacturaScripts e inyecta contexto.

Hook ``SessionStart`` de fs-user, compartido por Claude Code y Codex en Linux,
macOS y Windows. Busca desde el directorio de trabajo hacia arriba la raíz de
una instalación de FacturaScripts ERP (por ejemplo, la raíz del core o uno de
sus plugins bajo ``Plugins/``). Un repositorio de plugin situado fuera de una
instalación no se detecta.

Si la detecta, imprime en stdout el contexto que el host añade a la sesión
para que use automáticamente las skills del plugin fs-user.

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
from typing import Optional

# Nombre del proyecto en el composer.json del core, tal y como lo buscaba el script de bash.
COMPOSER_NAME = re.compile(r'"name":.*"facturascripts/facturascripts"')

# Directorios característicos de la raíz de una instalación.
ROOT_DIRS = ('Core', 'Plugins', 'Dinamic')

# Contexto que se añade a la sesión cuando se detecta la instalación.
CONTEXT = """=== CONTEXTO: Proyecto FacturaScripts detectado ===
Estás trabajando en FacturaScripts ERP o uno de sus plugins.
- Para dudas sobre el uso del ERP (operaciones, menús, configuración del programa, instalación o errores frecuentes), usa las skills del plugin fs-user.
- Para consultar datos de una instancia de FacturaScripts, usa el plugin fs-mcp.
- Las tareas de programación corresponden al plugin fs-dev, si está instalado.
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
        if find_root(Path.cwd()) is not None:
            sys.stdout.write(CONTEXT)
    except Exception as error:  # noqa: BLE001 - el hook nunca debe interrumpir al host.
        print(f'fs-user: error inesperado al detectar FacturaScripts: {error!r}', file=sys.stderr)
    return 0


if __name__ == '__main__':
    sys.exit(main())
