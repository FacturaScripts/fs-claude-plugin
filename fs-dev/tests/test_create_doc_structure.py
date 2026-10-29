"""Pruebas del script que crea o completa la estructura de documentación de FacturaScripts."""

from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).parents[1] / 'scripts' / 'create-doc-structure.py'
SPEC = importlib.util.spec_from_file_location('create_doc_structure', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
DOCS = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = DOCS
SPEC.loader.exec_module(DOCS)

# .gitignore que generaba fsmaker antes de la estructura de documentación.
OLD_FSMAKER_GITIGNORE = """/node_modules/
/vendor/
.DS_Store

# IA
CLAUDE.md
/.claude
/.codex
"""


def run_main(*args: str) -> tuple[int, str]:
    """Ejecuta el script en el mismo proceso y devuelve el código de salida y la salida estándar."""
    output = io.StringIO()
    with contextlib.redirect_stdout(output), contextlib.redirect_stderr(io.StringIO()):
        code = DOCS.main(list(args))
    return code, output.getvalue()


class CreateDocStructureTest(unittest.TestCase):
    """Comprueba la creación, la idempotencia y la fusión del .gitignore."""

    def setUp(self) -> None:
        """Crea un plugin vacío en un directorio temporal."""
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name) / 'MiPlugin'
        self.root.mkdir()
        (self.root / 'facturascripts.ini').write_text(
            "name = 'MiPlugin'\ndescription = 'Gestiona las pruebas.'\nversion = 1\n", encoding='utf-8')

    def tearDown(self) -> None:
        """Borra el directorio temporal."""
        self.tmp.cleanup()

    def test_crea_la_estructura_completa(self) -> None:
        code, _ = run_main(str(self.root))

        self.assertEqual(code, 0)
        for folder in ('Doc/User', 'Doc/Dev', 'Doc/Assets'):
            self.assertTrue((self.root / folder / '.gitkeep').is_file(), folder)
        self.assertEqual(json.loads((self.root / 'Doc/forja.json').read_text(encoding='utf-8')),
                         {'User': {}, 'Dev': {}})
        self.assertEqual((self.root / 'CLAUDE.md').read_text(encoding='utf-8'), '@AGENTS.md\n')
        self.assertIn('# MiPlugin: contexto del equipo',
                      (self.root / 'Doc/Context/README.md').read_text(encoding='utf-8'))
        agents = (self.root / 'AGENTS.md').read_text(encoding='utf-8')
        self.assertTrue(agents.startswith('Plugin **MiPlugin** para FacturaScripts: Gestiona las pruebas.\n'))
        self.assertIn('(Doc/Context/README.md)', agents)
        gitignore = (self.root / '.gitignore').read_text(encoding='utf-8')
        self.assertEqual(gitignore, DOCS.GITIGNORE_TEMPLATE)

    def test_es_idempotente(self) -> None:
        run_main(str(self.root))
        code, output = run_main(str(self.root))

        self.assertEqual(code, 0)
        self.assertIn('ya estaba completa', output)
        self.assertEqual((self.root / '.gitignore').read_text(encoding='utf-8'), DOCS.GITIGNORE_TEMPLATE)

    def test_check_no_escribe_y_devuelve_1(self) -> None:
        code, output = run_main(str(self.root), '--check')

        self.assertEqual(code, 1)
        self.assertIn('Falta: Doc/User/.gitkeep', output)
        self.assertFalse((self.root / 'Doc').exists())
        self.assertFalse((self.root / '.gitignore').exists())

    def test_no_toca_lo_existente_ni_pone_gitkeep_en_carpetas_con_archivos(self) -> None:
        (self.root / 'Doc/User').mkdir(parents=True)
        (self.root / 'Doc/User/inicio.md').write_text('# Inicio\n', encoding='utf-8')
        (self.root / 'Doc/Dev').mkdir(parents=True)
        (self.root / 'Doc/Dev/.DS_Store').write_bytes(b'')
        forja = '{"User": {"inicio.md": {"ordernum": 1}}, "Dev": {}}\n'
        (self.root / 'Doc/forja.json').write_text(forja, encoding='utf-8')

        code, _ = run_main(str(self.root))

        self.assertEqual(code, 0)
        self.assertFalse((self.root / 'Doc/User/.gitkeep').exists())
        self.assertTrue((self.root / 'Doc/Dev/.gitkeep').exists())
        self.assertEqual((self.root / 'Doc/forja.json').read_text(encoding='utf-8'), forja)

    def test_anade_a_forja_las_secciones_que_faltan(self) -> None:
        (self.root / 'Doc').mkdir()
        (self.root / 'Doc/forja.json').write_text('{}\n', encoding='utf-8')

        code, output = run_main(str(self.root))

        self.assertEqual(code, 0)
        self.assertIn('sección «User»', output)
        self.assertEqual((self.root / 'Doc/forja.json').read_text(encoding='utf-8'), DOCS.FORJA_TEMPLATE)

    def test_valida_las_paginas_de_forja(self) -> None:
        (self.root / 'Doc/User').mkdir(parents=True)
        (self.root / 'Doc/User/inicio.md').write_text('# Inicio\n', encoding='utf-8')
        (self.root / 'Doc/User/ventas.md').write_text('# Ventas\n', encoding='utf-8')
        forja = {
            'User': {
                'inicio.md': {
                    'title': 'Inicio', 'title_short': 'Inicio', 'permalink': 'inicio', 'ordernum': 100,
                    'youtubeid': 'abc',
                    'imageurl': 'Doc/Assets/inicio.png', 'icon': 'fa-solid fa-book', 'color': 'info',
                    'keywords': 'inicio,ventas', 'controllers': 'ListFacturaCliente', 'visibility': True,
                },
                'ventas.md': {'parent': 'inicio.md'},
            },
            'Dev': {},
        }
        (self.root / 'Doc/forja.json').write_text(json.dumps(forja), encoding='utf-8')

        code, output = run_main(str(self.root))

        self.assertEqual(code, 0, output)

        forja['User']['ventas.md'] = {'parent': 'nada.md', 'ordernum': '1', 'visibility': 'si', 'color': 'light',
                                      'autor': 'yo', 'permalink': 'p' * 201, 'keywords': 'k' * 301}
        forja['User']['inicio.md']['controllers'] = 'c' * 300
        forja['User']['falta.md'] = {}
        forja['Otra'] = {}
        (self.root / 'Doc/forja.json').write_text(json.dumps(forja), encoding='utf-8')

        code, output = run_main(str(self.root))

        self.assertEqual(code, 1)
        for text in ('la página padre «nada.md» no existe', '«ordernum» debe ser número entero',
                     '«visibility» debe ser true o false', 'color «light» no admitido', 'campo desconocido «autor»',
                     'User › falta.md no existe', 'sección desconocida «Otra»',
                     '«permalink» tiene 201 caracteres y el máximo es 200',
                     '«keywords» tiene 301 caracteres y el máximo es 300'):
            self.assertIn(text, output)
        self.assertNotIn('«controllers» tiene', output)

    def test_forja_no_valido_queda_pendiente(self) -> None:
        (self.root / 'Doc').mkdir()
        (self.root / 'Doc/forja.json').write_text('{User: []}', encoding='utf-8')

        code, output = run_main(str(self.root))

        self.assertEqual(code, 1)
        self.assertIn('no es un JSON válido', output)
        self.assertEqual((self.root / 'Doc/forja.json').read_text(encoding='utf-8'), '{User: []}')

    def test_fusiona_el_gitignore_antiguo_de_fsmaker(self) -> None:
        (self.root / '.gitignore').write_text(OLD_FSMAKER_GITIGNORE, encoding='utf-8')

        code, _ = run_main(str(self.root))

        self.assertEqual(code, 0)
        lines = (self.root / '.gitignore').read_text(encoding='utf-8').splitlines()
        self.assertNotIn('CLAUDE.md', lines)
        self.assertNotIn('/.claude', lines)
        self.assertIn('/.codex', lines)
        for rule in ('/.claude/*', '!/.claude/skills', '/.agents/*', '!/.agents/skills', '/CLAUDE.local.md',
                     '/AGENTS.override.md', '/.idea/'):
            self.assertIn(rule, lines)
        self.assertLess(lines.index('/.claude/*'), lines.index('!/.claude/skills'))
        self.assertEqual(lines.count('/vendor/'), 1)

    def test_inserta_las_reglas_en_su_seccion(self) -> None:
        # .gitignore de los plugins fiscales: la sección IA existe, con otra sección propia detrás
        fiscal = DOCS.GITIGNORE_TEMPLATE.replace('/.agents/*\n', '').replace('!/.agents/skills\n', '')
        (self.root / '.gitignore').write_text(fiscal + '\n# pruebas\n/Test/local/\n', encoding='utf-8')

        run_main(str(self.root))

        content = (self.root / '.gitignore').read_text(encoding='utf-8')
        self.assertEqual(content.count('# IA'), 1)
        self.assertIn('__pycache__/\n/.agents/*\n!/.agents/skills\n\n# pruebas\n/Test/local/\n', content)

    def test_una_regla_con_o_sin_barra_inicial_es_la_misma(self) -> None:
        anchored = DOCS.GITIGNORE_TEMPLATE.replace('/CLAUDE.local.md', 'CLAUDE.local.md')
        (self.root / '.gitignore').write_text(anchored, encoding='utf-8')

        run_main(str(self.root))

        self.assertEqual((self.root / '.gitignore').read_text(encoding='utf-8'), anchored)

    def test_claude_md_con_instrucciones_propias_queda_pendiente(self) -> None:
        (self.root / 'CLAUDE.md').write_text('Instrucciones del plugin\n', encoding='utf-8')
        (self.root / 'AGENTS.md').write_text('Sin enlaces\n', encoding='utf-8')

        code, output = run_main(str(self.root))

        self.assertEqual(code, 1)
        self.assertIn('CLAUDE.md no importa AGENTS.md', output)
        self.assertIn('AGENTS.md no enlaza la documentación', output)
        self.assertEqual((self.root / 'CLAUDE.md').read_text(encoding='utf-8'), 'Instrucciones del plugin\n')

    def test_detecta_el_core(self) -> None:
        core = Path(self.tmp.name) / 'facturascripts'
        (core / 'Core').mkdir(parents=True)
        (core / 'Core/Kernel.php').write_text('<?php\n', encoding='utf-8')

        code, output = run_main(str(core), '--json')

        self.assertEqual(code, 0)
        data = json.loads(output)
        self.assertEqual((data['kind'], data['name']), ('core', 'FacturaScripts'))
        self.assertTrue((core / 'AGENTS.md').read_text(encoding='utf-8').startswith('Core de **FacturaScripts**'))

    def test_falla_si_no_es_plugin_ni_core(self) -> None:
        code, _ = run_main(self.tmp.name)

        self.assertEqual(code, 2)

    @unittest.skipIf(shutil.which('git') is None, 'git no está disponible')
    def test_avisa_de_reglas_que_ignoran_la_documentacion(self) -> None:
        subprocess.run(['git', 'init', '-q', str(self.root)], check=True)
        subprocess.run(['git', '-C', str(self.root), 'config', 'core.ignoreCase', 'true'], check=True)
        (self.root / '.gitignore').write_text('/doc/\nCLAUDE.md\n', encoding='utf-8')

        code, output = run_main(str(self.root))

        self.assertEqual(code, 1)
        self.assertIn('Pendiente: la regla «/doc/»', output)
        self.assertNotIn('Pendiente: la regla «CLAUDE.md»', output)
        self.assertNotIn('Pendiente: la regla «!/.claude/skills»', output)


if __name__ == '__main__':
    unittest.main()
