"""Pruebas del hook de edición compatible con Claude Code y Codex."""

from __future__ import annotations

import importlib.util
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
import unittest.mock
from pathlib import Path


SCRIPT_PATH = Path(__file__).parents[1] / 'scripts' / 'post-edit.py'
SPEC = importlib.util.spec_from_file_location('post_edit', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
POST_EDIT = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = POST_EDIT
SPEC.loader.exec_module(POST_EDIT)

YEAR = POST_EDIT.datetime.now().year

# HOME aislado para que ~/.fs-claude.json del usuario no altere las pruebas.
_HOME = tempfile.TemporaryDirectory()
_HOME_PATCH = unittest.mock.patch.dict(os.environ, {'HOME': _HOME.name})


def setUpModule() -> None:
    """Aísla HOME durante todo el módulo; los subprocesos heredan el entorno."""
    _HOME_PATCH.start()


def tearDownModule() -> None:
    """Restaura HOME y elimina el directorio temporal."""
    _HOME_PATCH.stop()
    _HOME.cleanup()


PLUGIN_CLASS = """<?php
/**
 * Copyright (C) 2017-2020 Carlos Garcia Gomez <carlos@facturascripts.com>
 */
namespace FacturaScripts\\Plugins\\Demo\\Model;

class Example
{
    public function zebra(): void
    {
    }

    public function alpha(): void
    {
    }
}
"""


def run_hook(payload: object, cwd: Path | None = None) -> subprocess.CompletedProcess:
    """Ejecuta el hook como lo haría el host, pasando el payload por stdin.

    Args:
        payload: Objeto que se serializa a JSON, o texto que se envía tal cual.
        cwd: Directorio de trabajo del proceso.

    Returns:
        Resultado del proceso con stdout y stderr como texto.
    """
    data = payload if isinstance(payload, str) else json.dumps(payload)
    return subprocess.run(
        [sys.executable, str(SCRIPT_PATH)], input=data, capture_output=True, text=True,
        check=False, cwd=str(cwd) if cwd else None,
    )


def make_plugin(root: Path, name: str = 'Mi Plugin') -> Path:
    """Crea un plugin mínimo con su facturascripts.ini.

    Args:
        root: Directorio donde se crea.
        name: Nombre de la carpeta del plugin, que puede contener espacios.

    Returns:
        Ruta del plugin.
    """
    plugin = root / name
    (plugin / 'Model').mkdir(parents=True)
    (plugin / 'facturascripts.ini').write_text("name = 'Demo'\n", encoding='utf-8')
    return plugin


class ModifiedFilesTest(unittest.TestCase):
    """Comprueba la normalización de las entradas de ambos hosts."""

    def test_claude_write_without_response_is_not_new(self) -> None:
        """Un Write sin tool_response.type no debe tratarse como archivo nuevo."""
        files = POST_EDIT.modified_files({
            'cwd': '/tmp/project', 'tool_name': 'Write', 'tool_input': {'file_path': 'Model/Test.php'},
        })

        self.assertEqual(Path('/tmp/project/Model/Test.php').resolve(), files[0].path)
        self.assertFalse(files[0].is_new)

    def test_claude_write_create_marks_new_file(self) -> None:
        """Solo tool_response.type == 'create' marca el archivo como nuevo."""
        base = {'cwd': '/tmp/project', 'tool_name': 'Write', 'tool_input': {'file_path': 'A.php'}}

        created = POST_EDIT.modified_files({**base, 'tool_response': {'type': 'create'}})
        updated = POST_EDIT.modified_files({**base, 'tool_response': {'type': 'update'}})
        edited = POST_EDIT.modified_files({**base, 'tool_name': 'Edit', 'tool_response': {'type': 'create'}})

        self.assertTrue(created[0].is_new)
        self.assertFalse(updated[0].is_new)
        self.assertFalse(edited[0].is_new)

    def test_codex_patch_extracts_and_deduplicates_files(self) -> None:
        """apply_patch debe aceptar altas, cambios y movimientos sin duplicados."""
        payload = {
            'cwd': '/tmp/project',
            'tool_name': 'apply_patch',
            'tool_input': {
                'command': '\n'.join([
                    '*** Begin Patch',
                    '*** Add File: Model/New.php',
                    '*** Update File: Model/Test.php',
                    '*** Update File: Model/Test.php',
                    '*** Move to: Model/Renamed.php',
                    '*** Delete File: Model/Old.php',
                    '*** End Patch',
                ]),
            },
        }

        files = POST_EDIT.modified_files(payload)

        self.assertEqual(3, len(files))
        self.assertEqual(Path('/tmp/project/Model/New.php').resolve(), files[0].path)
        self.assertTrue(files[0].is_new)
        self.assertEqual(Path('/tmp/project/Model/Test.php').resolve(), files[1].path)
        self.assertEqual(Path('/tmp/project/Model/Renamed.php').resolve(), files[2].path)
        self.assertNotIn(Path('/tmp/project/Model/Old.php').resolve(), [item.path for item in files])

    def test_codex_patch_as_list_spaces_and_absolute_paths(self) -> None:
        """El parche puede llegar como lista y con rutas absolutas o con espacios."""
        patch = ['*** Begin Patch', '*** Update File: Mi Plugin/Model/A.php',
                 '*** Add File: /opt/otro/B.php', '*** End Patch']

        files = POST_EDIT.modified_files({
            'cwd': '/tmp/project', 'tool_name': 'apply_patch', 'tool_input': {'command': patch},
        })

        self.assertEqual(
            [Path('/tmp/project/Mi Plugin/Model/A.php').resolve(), Path('/opt/otro/B.php').resolve()],
            [item.path for item in files],
        )

    def test_ignores_unknown_tools_and_invalid_input(self) -> None:
        """Otras herramientas o un tool_input que no es objeto no producen archivos."""
        self.assertEqual([], POST_EDIT.modified_files({'tool_name': 'Bash', 'tool_input': {'command': 'ls'}}))
        self.assertEqual([], POST_EDIT.modified_files({'tool_name': 'Edit', 'tool_input': 'A.php'}))
        self.assertEqual([], POST_EDIT.modified_files({'tool_name': 'Edit', 'tool_input': {}}))


class ProcessFileTest(unittest.TestCase):
    """Comprueba la ejecución real y secuencial de los transformadores."""

    def test_updates_copyright_and_sorts_php(self) -> None:
        """Un PHP de FacturaScripts debe recibir ambas transformaciones."""
        with tempfile.TemporaryDirectory() as directory:
            file_path = Path(directory) / 'Example.php'
            file_path.write_text(PLUGIN_CLASS, encoding='utf-8')

            result = POST_EDIT.process_file(POST_EDIT.ModifiedFile(file_path), SCRIPT_PATH.parent)
            content = file_path.read_text(encoding='utf-8')

        self.assertEqual(0, result)
        self.assertIn(f'Copyright (C) 2017-{YEAR}', content)
        self.assertLess(content.index('function alpha'), content.index('function zebra'))

    def test_new_file_keeps_only_current_year(self) -> None:
        """Un archivo recién creado lleva solo el año actual."""
        with tempfile.TemporaryDirectory() as directory:
            file_path = Path(directory) / 'Example.php'
            file_path.write_text(PLUGIN_CLASS, encoding='utf-8')

            POST_EDIT.process_file(POST_EDIT.ModifiedFile(file_path, True), SCRIPT_PATH.parent)
            content = file_path.read_text(encoding='utf-8')

        self.assertIn(f'Copyright (C) {YEAR} Carlos', content)

    def test_updates_copyright_in_plugin_file_without_namespace(self) -> None:
        """Un XML dentro de un plugin (con facturascripts.ini) debe actualizar su copyright."""
        with tempfile.TemporaryDirectory() as directory:
            plugin_dir = Path(directory) / 'Demo'
            (plugin_dir / 'XMLView').mkdir(parents=True)
            (plugin_dir / 'facturascripts.ini').write_text("name = 'Demo'\n", encoding='utf-8')
            file_path = plugin_dir / 'XMLView' / 'EditDemo.xml'
            file_path.write_text('<!-- Copyright (C) 2020 Example -->\n<view/>\n', encoding='utf-8')

            result = POST_EDIT.process_file(POST_EDIT.ModifiedFile(file_path), SCRIPT_PATH.parent)
            content = file_path.read_text(encoding='utf-8')

        self.assertEqual(0, result)
        self.assertIn(f'Copyright (C) 2020-{YEAR}', content)

    def test_updates_copyright_in_core_installation_file(self) -> None:
        """Una plantilla Twig dentro de una instalación del core debe actualizar su copyright."""
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for name in ('Core', 'Plugins', 'Dinamic'):
                (root / name).mkdir()
            (root / 'Core' / 'View').mkdir()
            file_path = root / 'Core' / 'View' / 'Demo.html.twig'
            file_path.write_text('{# Copyright (C) 2020 Example #}\n', encoding='utf-8')

            result = POST_EDIT.process_file(POST_EDIT.ModifiedFile(file_path), SCRIPT_PATH.parent)
            content = file_path.read_text(encoding='utf-8')

        self.assertEqual(0, result)
        self.assertIn(f'Copyright (C) 2020-{YEAR}', content)

    def test_plain_twig_and_unsupported_files(self) -> None:
        """Un .twig sin .html se procesa; un .js o un archivo inexistente no."""
        with tempfile.TemporaryDirectory() as directory:
            plugin = make_plugin(Path(directory))
            twig = plugin / 'Macro.twig'
            script = plugin / 'app.js'
            twig.write_text('{# Copyright (C) 2020 Example #}\n', encoding='utf-8')
            script.write_text('/* Copyright (C) 2020 Example */\n', encoding='utf-8')

            for path in (twig, script, plugin / 'NoExiste.php'):
                self.assertEqual(0, POST_EDIT.process_file(POST_EDIT.ModifiedFile(path), SCRIPT_PATH.parent))

            self.assertIn(f'2020-{YEAR}', twig.read_text(encoding='utf-8'))
            self.assertIn('(C) 2020 Example', script.read_text(encoding='utf-8'))

    def test_ignores_files_outside_facturascripts(self) -> None:
        """Un PHP de otro proyecto (por ejemplo Laravel) no debe modificarse."""
        original = PLUGIN_CLASS.replace('FacturaScripts\\Plugins\\Demo\\Model', 'App\\Models')
        with tempfile.TemporaryDirectory() as directory:
            file_path = Path(directory) / 'app' / 'Models' / 'Example.php'
            file_path.parent.mkdir(parents=True)
            file_path.write_text(original, encoding='utf-8')

            result = POST_EDIT.process_file(POST_EDIT.ModifiedFile(file_path), SCRIPT_PATH.parent)
            content = file_path.read_text(encoding='utf-8')

        self.assertEqual(0, result)
        self.assertEqual(original, content)

    def test_settings_can_disable_both_transformations(self) -> None:
        """Con ambas opciones desactivadas en ~/.fs-claude.json el archivo no cambia."""
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory) / 'home'
            home.mkdir()
            (home / '.fs-claude.json').write_text(
                json.dumps({'settings': {'updateCopyright': False, 'sortClassMembers': False}}), encoding='utf-8')
            file_path = Path(directory) / 'Example.php'
            file_path.write_text(PLUGIN_CLASS, encoding='utf-8')

            with unittest.mock.patch.dict(os.environ, {'HOME': str(home)}):
                POST_EDIT.process_file(POST_EDIT.ModifiedFile(file_path), SCRIPT_PATH.parent)

            self.assertEqual(PLUGIN_CLASS, file_path.read_text(encoding='utf-8'))


class MainTest(unittest.TestCase):
    """Comprueba el hook completo leyendo el payload por stdin."""

    def test_claude_write_update_keeps_range_and_reports_change(self) -> None:
        """Un Write sobre un archivo existente conserva el rango y avisa al modelo por stdout."""
        with tempfile.TemporaryDirectory() as directory:
            plugin = make_plugin(Path(directory))
            file_path = plugin / 'Model' / 'Example.php'
            file_path.write_text(PLUGIN_CLASS, encoding='utf-8')

            result = run_hook({
                'cwd': directory, 'tool_name': 'Write',
                'tool_input': {'file_path': 'Mi Plugin/Model/Example.php'},
                'tool_response': {'type': 'update', 'filePath': str(file_path)},
            })
            content = file_path.read_text(encoding='utf-8')

        self.assertEqual(0, result.returncode)
        self.assertIn(f'Copyright (C) 2017-{YEAR} Carlos', content)
        output = json.loads(result.stdout)
        self.assertEqual('PostToolUse', output['hookSpecificOutput']['hookEventName'])
        context = output['hookSpecificOutput']['additionalContext']
        self.assertIn('Mi Plugin/Model/Example.php', context)
        self.assertIn('Relee el archivo', context)

    def test_codex_patch_with_spaces_processes_every_file(self) -> None:
        """Un apply_patch con varias rutas relativas con espacios procesa todos los archivos."""
        with tempfile.TemporaryDirectory() as directory:
            plugin = make_plugin(Path(directory))
            first = plugin / 'Model' / 'Uno.php'
            second = plugin / 'Model' / 'Dos.php'
            first.write_text(PLUGIN_CLASS, encoding='utf-8')
            second.write_text(PLUGIN_CLASS, encoding='utf-8')
            patch = ('*** Begin Patch\n*** Update File: Mi Plugin/Model/Uno.php\n@@\n-a\n+b\n'
                     '*** Update File: Mi Plugin/Model/Dos.php\n@@\n-a\n+b\n*** End Patch\n')

            result = run_hook({'cwd': directory, 'tool_name': 'apply_patch', 'tool_input': {'command': patch}})

            for path in (first, second):
                self.assertIn(f'2017-{YEAR}', path.read_text(encoding='utf-8'))
        context = json.loads(result.stdout)['hookSpecificOutput']['additionalContext']
        self.assertIn('Uno.php', context)
        self.assertIn('Dos.php', context)

    def test_no_output_when_nothing_changes(self) -> None:
        """Si el hook no modifica nada, stdout queda vacío."""
        with tempfile.TemporaryDirectory() as directory:
            plugin = make_plugin(Path(directory))
            file_path = plugin / 'Model' / 'Example.php'
            file_path.write_text(PLUGIN_CLASS, encoding='utf-8')
            run_hook({'cwd': directory, 'tool_name': 'Edit', 'tool_input': {'file_path': str(file_path)}})

            second = run_hook({'cwd': directory, 'tool_name': 'Edit', 'tool_input': {'file_path': str(file_path)}})

        self.assertEqual(0, second.returncode)
        self.assertEqual('', second.stdout)

    def test_invalid_input_never_blocks(self) -> None:
        """JSON inválido, no objeto o vacío terminan con 0 y sin salida."""
        for payload in ('no es json', '[]', '', '{"tool_name": "Edit", "tool_input": null}'):
            result = run_hook(payload)
            self.assertEqual(0, result.returncode, payload)
            self.assertEqual('', result.stdout, payload)

    def test_unexpected_error_is_reported_on_stderr_with_exit_zero(self) -> None:
        """Una excepción inesperada se notifica por stderr y no bloquea al host."""
        stdin = io.StringIO(json.dumps({'tool_name': 'Edit', 'tool_input': {'file_path': 'A.php'}}))
        stdout, stderr = io.StringIO(), io.StringIO()
        with unittest.mock.patch.object(POST_EDIT, 'modified_files', side_effect=RuntimeError('fallo')), \
                unittest.mock.patch('sys.stdin', stdin), unittest.mock.patch('sys.stdout', stdout), \
                unittest.mock.patch('sys.stderr', stderr):
            code = POST_EDIT.main()

        self.assertEqual(0, code)
        self.assertEqual('', stdout.getvalue())
        self.assertIn('fallo', stderr.getvalue())

    def test_transformer_errors_go_to_stderr(self) -> None:
        """Un transformador que falla no escribe en stdout ni cambia el código de salida."""
        with tempfile.TemporaryDirectory() as directory:
            plugin = make_plugin(Path(directory))
            file_path = plugin / 'Model' / 'Example.php'
            file_path.write_text(PLUGIN_CLASS, encoding='utf-8')
            scripts = Path(directory) / 'scripts'
            scripts.mkdir()
            (scripts / 'update-copyright.py').write_text(
                'import sys\nprint("ruido en stdout")\nsys.exit(1)\n', encoding='utf-8')

            stdout, stderr = io.StringIO(), io.StringIO()
            payload = {'cwd': directory, 'tool_name': 'Edit', 'tool_input': {'file_path': str(file_path)}}
            with unittest.mock.patch('sys.stdout', stdout), unittest.mock.patch('sys.stderr', stderr):
                output = POST_EDIT.run(payload, scripts)

        self.assertIsNone(output)
        self.assertEqual('', stdout.getvalue())
        self.assertIn('ruido en stdout', stderr.getvalue())
        self.assertIn('código 1', stderr.getvalue())


if __name__ == '__main__':
    unittest.main()
