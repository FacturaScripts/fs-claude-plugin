"""Pruebas de los hooks de fs-dev y fs-user en Linux, macOS y Windows.

Comprueban que cada hook de ``hooks.json`` arranca Python sin depender del
sistema operativo y ejecutan los comandos tal y como lo hacen los hosts:

- ``command``: Claude Code (con ``sh -c`` en Linux y macOS y Git Bash en
  Windows) y Codex en Linux y macOS. ``${CLAUDE_PLUGIN_ROOT}`` llega con
  barras ``/``.
- ``commandWindows``: Codex en Windows, con ``cmd.exe /C`` y la ruta del plugin
  con barras invertidas.

@author Esteban Sánchez Martínez <esteban@factura.city>
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

from plataforma import entorno_con_home


REPO_ROOT = Path(__file__).parents[2]
PLUGINS = ('fs-dev', 'fs-user')
PLACEHOLDER = '${CLAUDE_PLUGIN_ROOT}'


def load_hooks(plugin: str) -> list[tuple[str, dict]]:
    """Devuelve los hooks de un plugin con el evento al que pertenecen.

    Args:
        plugin: Nombre del plugin (``fs-dev`` o ``fs-user``).

    Returns:
        Lista de pares ``(evento, hook)``.
    """
    data = json.loads((REPO_ROOT / plugin / 'hooks' / 'hooks.json').read_text(encoding='utf-8'))
    return [(event, hook) for event, groups in data['hooks'].items() for group in groups for hook in group['hooks']]


def find_hook(plugin: str, script: str) -> dict:
    """Busca el hook de un plugin que ejecuta el script indicado.

    Args:
        plugin: Nombre del plugin.
        script: Nombre del script de Python.

    Returns:
        La definición del hook.
    """
    for _event, hook in load_hooks(plugin):
        if script in hook['command']:
            return hook
    raise AssertionError(f'{plugin} no tiene un hook para {script}')


def run_shell(command: str, cwd: Path, home: Path, stdin: str) -> subprocess.CompletedProcess[str]:
    """Ejecuta un comando de hook con ``sh -c``, como Claude Code y Codex fuera de Windows.

    Args:
        command: Comando con ``${CLAUDE_PLUGIN_ROOT}`` ya sustituido.
        cwd: Directorio de trabajo de la sesión.
        home: Directorio personal aislado.
        stdin: JSON que el host escribe en la entrada estándar.

    Returns:
        El resultado del proceso.
    """
    return subprocess.run(['sh', '-c', command], cwd=cwd, env=entorno_con_home(home), input=stdin,
                          capture_output=True, text=True, encoding='utf-8', timeout=60, check=False)


def run_cmd(command: str, cwd: Path, home: Path, stdin: str) -> subprocess.CompletedProcess[str]:
    """Ejecuta un comando de hook con ``cmd.exe /C "<comando>"``, como Codex en Windows.

    Args:
        command: Comando con ``${CLAUDE_PLUGIN_ROOT}`` ya sustituido.
        cwd: Directorio de trabajo de la sesión.
        home: Directorio personal aislado.
        stdin: JSON que el host escribe en la entrada estándar.

    Returns:
        El resultado del proceso.
    """
    comspec = os.environ.get('COMSPEC', 'cmd.exe')
    return subprocess.run(f'"{comspec}" /d /c "{command}"', cwd=cwd, env=entorno_con_home(home), input=stdin,
                          capture_output=True, text=True, encoding='utf-8', timeout=60, check=False)


class HooksDefinitionTest(unittest.TestCase):
    """Forma de los hooks en ``hooks.json``."""

    def test_todos_los_hooks_usan_el_lanzador_portable(self) -> None:
        """Ningún hook llama directamente a python3 o bash, que en Windows pueden no existir o ser otros."""
        for plugin in PLUGINS:
            for event, hook in load_hooks(plugin):
                with self.subTest(plugin=plugin, event=event):
                    command, windows = hook['command'], hook['commandWindows']
                    self.assertTrue(command.startswith(f'sh "{PLACEHOLDER}/scripts/run-python.sh" '))
                    self.assertTrue(windows.startswith('py -3 "'))
                    self.assertIn(' || python "', windows)
                    self.assertNotIn('python3', command + windows)
                    self.assertNotIn('bash', command + windows)

    def test_los_scripts_de_los_hooks_existen(self) -> None:
        """Cada hook apunta a un script de Python del propio plugin, el mismo en los dos comandos."""
        for plugin in PLUGINS:
            for event, hook in load_hooks(plugin):
                with self.subTest(plugin=plugin, event=event):
                    script = hook['command'].rsplit('/scripts/', 1)[1].rstrip('"')
                    self.assertTrue(script.endswith('.py'))
                    self.assertTrue((REPO_ROOT / plugin / 'scripts' / script).is_file())
                    self.assertEqual(2, hook['commandWindows'].count(f'\\scripts\\{script}"'))

    def test_el_lanzador_es_el_mismo_en_los_dos_plugins(self) -> None:
        """fs-dev y fs-user se instalan por separado: cada uno lleva su copia del lanzador."""
        self.assertEqual(
            (REPO_ROOT / 'fs-dev' / 'scripts' / 'run-python.sh').read_bytes(),
            (REPO_ROOT / 'fs-user' / 'scripts' / 'run-python.sh').read_bytes(),
        )


class HooksExecutionTest(unittest.TestCase):
    """Ejecución real de los comandos de los hooks."""

    def setUp(self) -> None:
        """Crea un directorio personal aislado y una raíz de FacturaScripts de prueba."""
        self.tmp = tempfile.TemporaryDirectory()
        self.home = Path(self.tmp.name) / 'home'
        self.home.mkdir()
        self.core = Path(self.tmp.name) / 'facturascripts'
        for name in ('Core', 'Plugins', 'Dinamic'):
            (self.core / name).mkdir(parents=True)

    def tearDown(self) -> None:
        """Elimina los directorios temporales."""
        self.tmp.cleanup()

    def check_outputs(self, run, root_of) -> None:
        """Ejecuta los hooks de fs-dev y fs-user con un ejecutor y comprueba su salida.

        Args:
            run: Función que ejecuta un comando (``run_shell`` o ``run_cmd``).
            root_of: Función que devuelve la ruta del plugin tal y como la sustituye el host.
        """
        prompt = json.dumps({'hook_event_name': 'UserPromptSubmit', 'prompt': 'Hola, ¿qué tal?'})
        reminder = find_hook('fs-dev', 'language-reminder.py')
        result = run(self.command_of(reminder).replace(PLACEHOLDER, root_of('fs-dev')), self.core, self.home, prompt)
        self.assertEqual(0, result.returncode, result.stderr)
        context = json.loads(result.stdout)['hookSpecificOutput']['additionalContext']
        self.assertIn('español', context)

        start = json.dumps({'hook_event_name': 'SessionStart', 'cwd': str(self.core)})
        for plugin in PLUGINS:
            with self.subTest(plugin=plugin):
                hook = find_hook(plugin, 'detect-facturascripts.py')
                result = run(self.command_of(hook).replace(PLACEHOLDER, root_of(plugin)), self.core, self.home, start)
                self.assertEqual(0, result.returncode, result.stderr)
                self.assertIn('=== CONTEXTO: Proyecto FacturaScripts detectado ===', result.stdout)
                self.assertIn('Estás trabajando', result.stdout)

    def command_of(self, hook: dict) -> str:
        """Devuelve el comando del hook que corresponde al ejecutor de la prueba en curso."""
        return hook['commandWindows'] if self._testMethodName.endswith('_cmd') else hook['command']

    @unittest.skipIf(shutil.which('sh') is None, 'no hay sh en el PATH')
    def test_command_con_sh(self) -> None:
        """``command`` funciona con sh, con la ruta del plugin con barras ``/``."""
        self.check_outputs(run_shell, lambda plugin: (REPO_ROOT / plugin).as_posix())

    @unittest.skipUnless(os.name == 'nt', 'commandWindows solo se usa en Windows')
    def test_command_windows_con_cmd(self) -> None:
        """``commandWindows`` funciona con cmd.exe, con la ruta del plugin con barras invertidas."""
        self.check_outputs(run_cmd, lambda plugin: str(REPO_ROOT / plugin))


if __name__ == '__main__':
    unittest.main()
