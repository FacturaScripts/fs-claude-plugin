"""Pruebas de la ruta del archivo de configuración compartido (``~/.fs-ai.json``).

Todos los scripts que leen la configuración deben usar ``~/.fs-ai.json`` y, si
no existe pero sí el antiguo ``~/.fs-claude.json``, seguir usando el antiguo.
"""

from __future__ import annotations

import importlib.util
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


SCRIPTS_DIR = Path(__file__).parents[1] / 'scripts'
SCRIPTS = ('check-min-version', 'language-reminder', 'sort-class-members', 'update-copyright')


def load_script(name: str):
    """Carga un script de ``fs-dev/scripts`` como módulo.

    Args:
        name: Nombre del script sin la extensión ``.py``.

    Returns:
        El módulo cargado.
    """
    module_name = 'config_path_' + name.replace('-', '_')
    spec = importlib.util.spec_from_file_location(module_name, SCRIPTS_DIR / f'{name}.py')
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    return module


class ConfigPathTest(unittest.TestCase):
    """Resolución de ``config_path()`` en cada script."""

    def setUp(self) -> None:
        """Crea un HOME temporal y lo activa para ``Path.home()``."""
        self._tmp = tempfile.TemporaryDirectory()
        self.home = Path(self._tmp.name)
        patcher = mock.patch.dict(os.environ, {'HOME': str(self.home), 'USERPROFILE': str(self.home)})
        patcher.start()
        self.addCleanup(patcher.stop)
        self.addCleanup(self._tmp.cleanup)

    def test_without_files_uses_new_name(self) -> None:
        """Sin ningún archivo se usa ``~/.fs-ai.json``."""
        for name in SCRIPTS:
            with self.subTest(script=name):
                self.assertEqual(load_script(name).config_path(), self.home / '.fs-ai.json')

    def test_only_legacy_file_is_used(self) -> None:
        """Si solo existe ``~/.fs-claude.json`` se sigue usando ese."""
        (self.home / '.fs-claude.json').write_text('{}', encoding='utf-8')
        for name in SCRIPTS:
            with self.subTest(script=name):
                self.assertEqual(load_script(name).config_path(), self.home / '.fs-claude.json')

    def test_new_file_wins_over_legacy(self) -> None:
        """Si existen los dos, manda ``~/.fs-ai.json``."""
        (self.home / '.fs-claude.json').write_text('{}', encoding='utf-8')
        (self.home / '.fs-ai.json').write_text('{}', encoding='utf-8')
        for name in SCRIPTS:
            with self.subTest(script=name):
                self.assertEqual(load_script(name).config_path(), self.home / '.fs-ai.json')

    def test_legacy_settings_are_applied(self) -> None:
        """Los ajustes del archivo antiguo se siguen respetando."""
        (self.home / '.fs-claude.json').write_text(
            json.dumps({'settings': {'sortClassMembers': False, 'updateCopyright': False, 'language': 'en'}}),
            encoding='utf-8',
        )
        self.assertFalse(load_script('sort-class-members')._is_sort_enabled())
        self.assertFalse(load_script('update-copyright')._is_copyright_update_enabled())
        reminder = load_script('language-reminder')
        self.assertEqual(reminder.read_language_setting(reminder.config_path()), 'en')

    def test_without_home_there_is_no_config(self) -> None:
        """Sin directorio personal (en Windows, sin USERPROFILE) no falla: no hay configuración."""
        for name in SCRIPTS:
            with self.subTest(script=name):
                module = load_script(name)
                with mock.patch.object(module.Path, 'home', side_effect=RuntimeError('sin home')):
                    path = module.config_path()
                self.assertFalse(path.exists())
                self.assertEqual('.fs-ai.json', path.name)


if __name__ == '__main__':
    unittest.main()
