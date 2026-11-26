"""Ayudas para que las pruebas de fs-dev se ejecuten igual en Linux, macOS y Windows.

- Directorio personal: ``Path.home()`` lee ``HOME`` en Linux y macOS, pero ``USERPROFILE``
  en Windows. Una prueba que solo cambie ``HOME`` leería allí el ``~/.fs-ai.json`` real
  del usuario, así que se fijan las dos variables.
- Enlaces simbólicos: en Windows crearlos exige el modo de desarrollador o permisos de
  administrador; las pruebas que los necesitan se omiten si no se pueden crear.

@author Esteban Sánchez Martínez <esteban@factura.city>
"""

from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path


def _enlaces_permitidos() -> bool:
    """Indica si el usuario actual puede crear enlaces simbólicos.

    Returns:
        True si se puede crear un enlace en la carpeta temporal.
    """
    with tempfile.TemporaryDirectory() as carpeta:
        destino = Path(carpeta) / 'destino'
        destino.write_text('', encoding='utf-8')
        try:
            (Path(carpeta) / 'enlace').symlink_to(destino)
        except (OSError, NotImplementedError):
            return False
    return True


# Indica si el sistema permite crear enlaces simbólicos a este usuario.
ENLACES = _enlaces_permitidos()

# Decorador para las pruebas que crean enlaces simbólicos.
requiere_enlaces = unittest.skipUnless(
    ENLACES, 'el sistema no permite crear enlaces simbólicos a este usuario (en Windows, activa el modo de desarrollador)'
)

# Indica si el sistema aplica los permisos POSIX de archivos (no en Windows).
PERMISOS_POSIX = os.name != 'nt'


def entorno_con_home(home: Path | str, base: dict[str, str] | None = None) -> dict[str, str]:
    """Devuelve un entorno con el directorio personal en ``home`` en cualquier sistema.

    Args:
        home: Carpeta que hace de directorio personal.
        base: Entorno de partida; por defecto, el del proceso actual.

    Returns:
        Copia del entorno con ``HOME`` y ``USERPROFILE`` apuntando a ``home``.
    """
    entorno = dict(os.environ if base is None else base)
    entorno['HOME'] = str(home)
    entorno['USERPROFILE'] = str(home)
    return entorno
