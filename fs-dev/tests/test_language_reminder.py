"""Pruebas del recordatorio de idioma compatible con Claude Code y Codex."""

from __future__ import annotations

import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


PLUGIN_ROOT = Path(__file__).parents[1]
SCRIPT_PATH = PLUGIN_ROOT / 'scripts' / 'language-reminder.py'
SPEC = importlib.util.spec_from_file_location('language_reminder', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
REMINDER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = REMINDER
SPEC.loader.exec_module(REMINDER)


def run_hook(home: Path, payload: object = None) -> subprocess.CompletedProcess:
    """Ejecuta el hook como lo haría el host, con un HOME aislado.

    Args:
        home: Directorio que hace de HOME del proceso.
        payload: Objeto que se envía por stdin como JSON; ``None`` envía la entrada de un mensaje.

    Returns:
        Resultado del proceso con stdout y stderr como texto.
    """
    data = payload if payload is not None else {
        'hook_event_name': 'UserPromptSubmit', 'prompt': 'hola', 'cwd': str(home),
    }
    env = {**os.environ, 'HOME': str(home), 'USERPROFILE': str(home)}
    return subprocess.run(
        [sys.executable, str(SCRIPT_PATH)], input=json.dumps(data), capture_output=True, text=True,
        check=False, env=env,
    )


def write_config(home: Path, content: object) -> None:
    """Escribe ``~/.fs-claude.json`` dentro del HOME aislado.

    Args:
        home: HOME aislado.
        content: Objeto que se serializa a JSON, o texto que se escribe tal cual.
    """
    text = content if isinstance(content, str) else json.dumps(content)
    (home / '.fs-claude.json').write_text(text, encoding='utf-8')


class ResolveLanguageTest(unittest.TestCase):
    """Normalización de ``settings.language``."""

    def test_default_is_spanish(self) -> None:
        """Sin valor, con ``null`` o con ``true`` se usa el español."""
        for value in (None, True):
            with self.subTest(value=value):
                self.assertEqual(REMINDER.resolve_language(value), 'es')

    def test_disabled_values(self) -> None:
        """``false`` y las cadenas de desactivación apagan el recordatorio."""
        for value in (False, '', 'off', 'OFF', ' none ', 'false', 'disabled'):
            with self.subTest(value=value):
                self.assertIsNone(REMINDER.resolve_language(value))

    def test_codes_and_regional_variants(self) -> None:
        """Los códigos regionales se reducen al idioma principal."""
        cases = {'en': 'en', 'EN': 'en', 'pt-BR': 'pt', 'es_ES': 'es', 'ca': 'ca', 'eu': 'eu'}
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(REMINDER.resolve_language(value), expected)

    def test_aliases(self) -> None:
        """Se aceptan nombres de idioma en español, en inglés y en el propio idioma."""
        cases = {'Inglés': 'en', 'English': 'en', 'castellano': 'es', 'Català': 'ca', 'Deutsch': 'de'}
        for value, expected in cases.items():
            with self.subTest(value=value):
                self.assertEqual(REMINDER.resolve_language(value), expected)

    def test_unknown_name_is_kept(self) -> None:
        """Un idioma sin plantilla se conserva tal cual para el aviso genérico."""
        self.assertEqual(REMINDER.resolve_language('Nederlands'), 'Nederlands')

    def test_invalid_type_falls_back_to_spanish(self) -> None:
        """Un tipo inesperado no rompe el hook y se usa el valor por defecto."""
        self.assertEqual(REMINDER.resolve_language(42), 'es')


class BuildMessageTest(unittest.TestCase):
    """Texto del aviso según el idioma."""

    def test_every_template_mentions_fs_dev(self) -> None:
        """Todas las plantillas identifican el origen del aviso."""
        for code, text in REMINDER.TEMPLATES.items():
            with self.subTest(code=code):
                self.assertIn('(fs-dev)', text)

    def test_spanish_template(self) -> None:
        """El aviso por defecto está en español."""
        self.assertIn('responde SIEMPRE en español', REMINDER.build_message('es'))

    def test_generic_template_uses_english_name(self) -> None:
        """Un idioma reconocido sin plantilla usa su nombre en inglés."""
        self.assertIn('ALWAYS respond in Basque (euskara)', REMINDER.build_message('eu'))

    def test_generic_template_uses_free_name(self) -> None:
        """Un idioma desconocido se cita tal como se configuró."""
        self.assertIn('ALWAYS respond in Nederlands', REMINDER.build_message('Nederlands'))


class HookProcessTest(unittest.TestCase):
    """Ejecución del hook como proceso, igual que en los hosts."""

    def setUp(self) -> None:
        """Crea un HOME aislado para cada prueba."""
        self._tmp = tempfile.TemporaryDirectory()
        self.home = Path(self._tmp.name)

    def tearDown(self) -> None:
        """Elimina el HOME aislado."""
        self._tmp.cleanup()

    def assert_context(self, result: subprocess.CompletedProcess, expected: str) -> None:
        """Comprueba que la salida es el JSON de ``UserPromptSubmit`` con el texto esperado.

        Args:
            result: Resultado del proceso.
            expected: Fragmento que debe contener ``additionalContext``.
        """
        self.assertEqual(result.returncode, 0, result.stderr)
        output = json.loads(result.stdout)
        specific = output['hookSpecificOutput']
        self.assertEqual(specific['hookEventName'], 'UserPromptSubmit')
        self.assertIn(expected, specific['additionalContext'])

    def test_without_config_file(self) -> None:
        """Sin ``~/.fs-claude.json`` el aviso es en español."""
        self.assert_context(run_hook(self.home), 'en español')

    def test_without_language_key(self) -> None:
        """Con otras opciones pero sin ``language`` el aviso es en español."""
        write_config(self.home, {'settings': {'updateCopyright': False}, 'connections': {}})
        self.assert_context(run_hook(self.home), 'en español')

    def test_configured_language(self) -> None:
        """El idioma configurado cambia el aviso."""
        write_config(self.home, {'settings': {'language': 'en'}})
        self.assert_context(run_hook(self.home), 'ALWAYS respond in English')

    def test_disabled(self) -> None:
        """Con el recordatorio desactivado no se escribe nada."""
        for value in (False, 'off'):
            with self.subTest(value=value):
                write_config(self.home, {'settings': {'language': value}})
                result = run_hook(self.home)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(result.stdout, '')

    def test_invalid_json_falls_back_to_spanish(self) -> None:
        """Un archivo de configuración corrupto no bloquea y se usa el español."""
        write_config(self.home, '{no es json')
        self.assert_context(run_hook(self.home), 'en español')

    def test_settings_not_object(self) -> None:
        """Un ``settings`` que no es un objeto no rompe el hook."""
        write_config(self.home, {'settings': ['language']})
        self.assert_context(run_hook(self.home), 'en español')

    def test_accepts_codex_payload(self) -> None:
        """La entrada de Codex, con ``turn_id``, se acepta igual que la de Claude Code."""
        payload = {'hook_event_name': 'UserPromptSubmit', 'turn_id': 't1', 'prompt': 'hi', 'model': 'x'}
        self.assert_context(run_hook(self.home, payload), 'en español')


class HooksManifestTest(unittest.TestCase):
    """Registro del hook en ``hooks/hooks.json``."""

    def test_user_prompt_submit_registered(self) -> None:
        """El manifiesto ejecuta el script con la ruta portable y entre comillas."""
        manifest = json.loads((PLUGIN_ROOT / 'hooks' / 'hooks.json').read_text(encoding='utf-8'))
        commands = [
            hook['command']
            for group in manifest['hooks'].get('UserPromptSubmit', [])
            for hook in group['hooks']
        ]
        self.assertIn('python3 "${CLAUDE_PLUGIN_ROOT}/scripts/language-reminder.py"', commands)


if __name__ == '__main__':
    unittest.main()
