"""Pruebas del script que hace las capturas anotadas y anonimizadas de la documentación."""

from __future__ import annotations

import argparse
import contextlib
import importlib.util
import io
import json
import re
import shutil
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).parents[1] / 'scripts' / 'doc-screenshots.py'
SPEC = importlib.util.spec_from_file_location('doc_screenshots', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
SHOTS = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = SHOTS
SPEC.loader.exec_module(SHOTS)

# Página de prueba con datos personales en un formulario, en un listado y en el texto.
TEST_PAGE = """<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Ficha de Juana Pérez Gómez</title>
<style>body { font-family: sans-serif; margin: 20px; } td, th { padding: 4px 8px; }</style></head>
<body>
<nav class="navbar"><img alt="FacturaScripts" style="width:30px;height:30px;background:#00f"> <span class="empresa">FS</span>
    <a href="#">Ventas</a></nav>
<form method="post" action="#">
    <label>Nombre <input name="nombre" value="Juana Pérez Gómez"></label>
    <label>NIF <input name="cifnif" value="12345678Z"></label>
    <label>Email <input name="email" value="juana@correo.es"></label>
    <button type="submit">Guardar</button>
</form>
<p class="aviso">Llama al 612 345 678 o escribe a contacto@empresa-real.es. IBAN ES91 2100 0418 4502 0005 1332.</p>
<table id="listado">
    <thead><tr><th>Código</th><th>Cliente</th><th>CIF/NIF</th><th>Total</th></tr></thead>
    <tbody>
        <tr><td>FAC2026A1</td><td>Construcciones Reales SL</td><td>B12345674</td><td>121,00 €</td></tr>
        <tr><td>FAC2026A2</td><td>Contado</td><td></td><td>60,50 €</td></tr>
    </tbody>
</table>
<div class="pie">Factura de Construcciones Reales SL</div>
<button type="button" id="abrir" onclick="document.getElementById('panel').hidden = false">Abrir panel</button>
<div id="panel" hidden><span class="dentro">Panel abierto</span></div>
<div class="debugbar">Barra de depuración</div>
<footer>Hecho con FacturaScripts · factura.city</footer>
</body></html>
"""


def run_main(*args: str) -> tuple[int, dict]:
    """Ejecuta el script en el mismo proceso y devuelve el código de salida y el JSON que imprime."""
    output = io.StringIO()
    with contextlib.redirect_stdout(output), contextlib.redirect_stderr(io.StringIO()):
        code = SHOTS.main(list(args))
    return code, json.loads(output.getvalue())


def chrome_available() -> bool:
    """Indica si hay un Chrome o Chromium para las pruebas de integración."""
    try:
        SHOTS.find_chrome(None, {})
        return True
    except SHOTS.ScreenshotError:
        return False


class ValidateScenarioTest(unittest.TestCase):
    """Validación del escenario JSON."""

    def scenario(self, **capture) -> dict:
        base = {'name': 'uno', 'url': 'ListFacturaCliente'}
        base.update(capture)
        return {'base_url': 'https://fs.localhost/', 'captures': [base]}

    def test_valid_scenario(self):
        data = self.scenario(
            steps=[{'click': 'text=Ventas'}, {'fill': 'input[name="query"]', 'value': 'FAC'}, {'wait': 300},
                   {'select': 'select[name="codserie"]', 'value': 'A'}, {'wait_for': '.modal.show', 'timeout': 5},
                   {'click': 'text=Guardar', 'allow_change': True}],
            highlight=[{'target': '.dropdown-menu.show >> text=Facturas', 'label': 1, 'arrow': 'right', 'note': 'Aquí'}],
            clip=['nav.navbar', '.dropdown-menu.show'], margin=20)
        data['redact'] = {'keep': ['Contado'], 'replace': {'ACME SL': 'Empresa Ejemplo'}, 'blur': ['.firma']}
        self.assertEqual([], SHOTS.validate_scenario(data))

    def test_requires_captures(self):
        self.assertIn('«captures» debe ser una lista con al menos una captura.',
                      SHOTS.validate_scenario({'base_url': 'https://fs.localhost/'}))

    def test_rejects_unknown_keys_and_steps(self):
        errors = SHOTS.validate_scenario(self.scenario(steps=[{'clik': 'text=Ventas'}], colour='red'))
        self.assertTrue(any('clave desconocida «colour»' in e for e in errors))
        self.assertTrue(any('clave desconocida «clik»' in e for e in errors))
        self.assertTrue(any('una sola acción' in e for e in errors))

    def test_rejects_two_actions_in_one_step(self):
        errors = SHOTS.validate_scenario(self.scenario(steps=[{'click': 'a', 'wait': 100}]))
        self.assertTrue(any('una sola acción' in e for e in errors))

    def test_fill_requires_value(self):
        errors = SHOTS.validate_scenario(self.scenario(steps=[{'fill': 'input[name="query"]'}]))
        self.assertTrue(any('necesita «value»' in e for e in errors))

    def test_rejects_bad_arrow_file_and_duplicates(self):
        data = self.scenario(highlight=[{'target': 'a', 'arrow': 'diagonal'}], file='carpeta/uno.jpg')
        data['captures'].append({'name': 'uno', 'url': 'otra'})
        errors = SHOTS.validate_scenario(data)
        self.assertTrue(any('«arrow»' in e for e in errors))
        self.assertTrue(any('«file»' in e for e in errors))
        self.assertTrue(any('nombre está repetido' in e for e in errors))

    def test_first_capture_needs_url_or_steps(self):
        errors = SHOTS.validate_scenario({'captures': [{'name': 'uno'}]})
        self.assertTrue(any('necesita «url»' in e for e in errors))

    def test_rejects_bad_redact(self):
        errors = SHOTS.validate_scenario({'redact': {'replace': ['x'], 'auto': 'si'}, 'captures': [{'name': 'a', 'url': 'x'}]})
        self.assertTrue(any('redact.replace' in e for e in errors))
        self.assertTrue(any('redact.auto' in e for e in errors))

    def test_check_option_reports_errors(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'escenario.json'
            path.write_text(json.dumps({'captures': []}), encoding='utf-8')
            code, report = run_main(str(path), '--check')
            self.assertEqual(2, code)
            self.assertFalse(report['valid'])
            path.write_text(json.dumps(self.scenario()), encoding='utf-8')
            code, report = run_main(str(path), '--check')
            self.assertEqual(0, code)
            self.assertTrue(report['valid'])


class PatternsTest(unittest.TestCase):
    """Patrones de datos personales y de acciones que cambian datos."""

    def matches(self, category: str, text: str) -> list[str]:
        return re.findall(SHOTS.SENSITIVE_PATTERNS[category], text)

    def test_detects_personal_data(self):
        self.assertEqual(['ana.gil@correo.es'], self.matches('email', 'Escribe a ana.gil@correo.es hoy'))
        self.assertEqual(['12345678Z', 'X1234567L', 'B12345674', 'ESB12345674'],
                         self.matches('nif', 'NIF 12345678Z, NIE X1234567L, CIF B12345674 y VAT ESB12345674'))
        self.assertEqual(['612 345 678', '+34 912345678'], self.matches('phone', 'Tel. 612 345 678 o +34 912345678'))
        self.assertEqual(['ES91 2100 0418 4502 0005 1332'], self.matches('iban', 'IBAN ES91 2100 0418 4502 0005 1332.'))

    def test_ignores_document_data(self):
        text = 'Factura FAC2026A83 del 23/10/2026 por 1.776,92 € con 288 líneas y el código 2026-10-23'
        for category in SHOTS.SENSITIVE_PATTERNS:
            self.assertEqual([], self.matches(category, text), category)

    def test_brand(self):
        brand = re.compile(SHOTS.BRAND_PATTERN)
        for text in ('Hecho con FacturaScripts', 'facturascripts.com', 'Entra en factura.city', 'Tablero de FS'):
            self.assertTrue(brand.search(text), text)
        for text in ('Facturas', 'FSE', 'Factura de cliente', 'IFS'):
            self.assertFalse(brand.search(text), text)

    def test_risky_actions(self):
        risky = re.compile(SHOTS.RISKY_ACTION_PATTERN, re.IGNORECASE)
        for text in ('Guardar', 'Dar de alta', 'Enviar a Verifactu', 'Eliminar', 'Anular', 'Generar asientos'):
            self.assertTrue(risky.search(text), text)
        for text in ('Verifactu', 'Imprimir', 'Opciones', 'Acciones', 'Ventas', 'Filtros'):
            self.assertFalse(risky.search(text), text)

    def test_field_and_header_rules(self):
        fields = [(re.compile(rule, re.IGNORECASE), category) for rule, category in SHOTS.FIELD_RULES]
        headers = [(re.compile(rule, re.IGNORECASE), category) for rule, category in SHOTS.HEADER_RULES]
        self.assertEqual('nif', next(c for r, c in fields if r.search('cifnif')))
        self.assertEqual('name', next(c for r, c in fields if r.search('nombrecliente')))
        self.assertFalse(any(r.search('codigo') for r, _ in fields))
        self.assertEqual('name', next(c for r, c in headers if r.search('Cliente')))
        self.assertEqual('nif', next(c for r, c in headers if r.search('CIF/NIF')))
        self.assertFalse(any(r.search('Total') for r, _ in headers))


class HelpersTest(unittest.TestCase):
    """Funciones auxiliares sin navegador."""

    def test_credentials_from_environment(self):
        self.assertIsNone(SHOTS.resolve_credentials(None, {}))
        self.assertEqual(('demo', 'clave'), SHOTS.resolve_credentials(True, {'FS_DOC_USER': 'demo', 'FS_DOC_PASSWORD': 'clave'}))
        login = {'user_env': 'MI_USUARIO', 'password_env': 'MI_CLAVE'}
        self.assertEqual(('a', 'b'), SHOTS.resolve_credentials(login, {'MI_USUARIO': 'a', 'MI_CLAVE': 'b'}))
        with self.assertRaises(SHOTS.ScreenshotError):
            SHOTS.resolve_credentials(True, {'FS_DOC_USER': 'demo'})

    def test_local_urls(self):
        for url in ('https://fs.localhost/', 'http://127.0.0.1:8000', 'https://demo.test', 'file:///tmp/a.html'):
            self.assertTrue(SHOTS.is_local_url(url), url)
        for url in ('https://facturascripts.com', 'https://localhost.example.com'):
            self.assertFalse(SHOTS.is_local_url(url), url)

    def test_absolute_url(self):
        self.assertEqual('https://fs.localhost/ListFacturaCliente', SHOTS.absolute_url('https://fs.localhost', 'ListFacturaCliente'))
        self.assertEqual('https://fs.localhost/sub/Edit?code=1', SHOTS.absolute_url('https://fs.localhost/sub/', '/Edit?code=1'))
        self.assertEqual('https://otra.test/x', SHOTS.absolute_url('https://fs.localhost/', 'https://otra.test/x'))

    def test_merge_redact(self):
        merged = SHOTS.merge_redact({'keep': ['Contado'], 'replace': {'A': 'B'}}, {'blur': ['.firma'], 'replace': {'C': 'D'}})
        self.assertTrue(merged['auto'])
        self.assertEqual(['Contado'], merged['keep'])
        self.assertEqual({'A': 'B', 'C': 'D'}, merged['replace'])
        self.assertEqual(SHOTS.AUTO_BLUR + ['.firma'], merged['blur'])
        self.assertEqual([], SHOTS.merge_redact({'auto': False}, None)['blur'])

    def test_png_size(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'a.png'
            path.write_bytes(b'\x89PNG\r\n\x1a\n' + b'\x00\x00\x00\x0dIHDR' + (640).to_bytes(4, 'big') + (480).to_bytes(4, 'big'))
            self.assertEqual((640, 480), SHOTS.png_size(path))
            path.write_bytes(b'no es un png')
            with self.assertRaises(SHOTS.ScreenshotError):
                SHOTS.png_size(path)


@unittest.skipUnless(chrome_available(), 'No hay Chrome ni Chromium instalado.')
class BrowserTest(unittest.TestCase):
    """Capturas reales con Chrome sin interfaz sobre una página local."""

    @classmethod
    def setUpClass(cls):
        cls.folder = Path(tempfile.mkdtemp(prefix='fs-doc-test-'))
        (cls.folder / 'pagina.html').write_text(TEST_PAGE, encoding='utf-8')
        cls.base_url = (cls.folder / 'pagina.html').as_uri()

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.folder, ignore_errors=True)

    def run_scenario(self, scenario: dict, *args: str) -> tuple[int, dict]:
        path = self.folder / 'escenario.json'
        path.write_text(json.dumps(scenario), encoding='utf-8')
        return run_main(str(path), *args)

    def test_capture_with_marks_and_anonymization(self):
        scenario = {
            'base_url': self.base_url,
            'output_dir': str(self.folder / 'capturas'),
            'viewport': {'width': 900, 'height': 600},
            'redact': {'keep': ['Contado'], 'replace': {'FS': 'Mi Empresa'}},
            'hide': ['footer'],
            'captures': [
                {'name': '01-ficha', 'url': self.base_url,
                 'highlight': [{'target': 'text=Guardar', 'label': 1, 'arrow': 'right', 'note': 'Pulsa aquí'}]},
                {'name': '02-panel', 'steps': [{'click': '#abrir'}],
                 'highlight': [{'target': '#panel >> text=Panel abierto', 'label': 2}], 'clip': '#panel', 'margin': 10},
            ],
        }
        code, report = self.run_scenario(scenario)
        self.assertEqual(0, code, report)
        first, second = report['captures']
        self.assertEqual((900, 600), (first['width'], first['height']))
        self.assertTrue(Path(first['file']).is_file())
        self.assertLess(second['height'], 200)
        fakes = {item['fake'] for item in first['anonymized']}
        self.assertIn('Cliente Ejemplo 1', fakes)
        self.assertIn('usuario1@ejemplo.com', fakes)
        self.assertIn('600 000 001', fakes)
        self.assertNotIn('Contado', json.dumps(report))
        self.assertNotIn('Juana', json.dumps(report))
        self.assertIn('Mi Empresa', fakes)

    def test_scan_lists_controls_and_blocks_risky_click(self):
        scenario = {'base_url': self.base_url, 'redact': {'replace': {'FS': 'Mi Empresa'}}, 'hide': ['footer'],
                    'captures': [{'name': 'ficha', 'url': self.base_url}]}
        code, report = self.run_scenario(scenario, '--scan')
        self.assertEqual(0, code, report)
        controls = {c['target']: c for c in report['captures'][0]['controls']}
        self.assertTrue(controls['text=Guardar']['changes_data'])
        self.assertFalse(controls['#abrir']['changes_data'])
        self.assertEqual([], report['captures'][0]['sensitive'])

        scenario['output_dir'] = str(self.folder / 'bloqueado')
        scenario['captures'][0]['steps'] = [{'click': 'text=Guardar'}]
        code, report = self.run_scenario(scenario)
        self.assertEqual(1, code)
        self.assertIn('Clic bloqueado', report['captures'][0]['error'])

    def test_leaks_stop_the_capture(self):
        scenario = {
            'base_url': self.base_url,
            'output_dir': str(self.folder / 'fugas'),
            'redact': {'auto': False},
            'captures': [{'name': 'sin-anonimizar', 'url': self.base_url}],
        }
        code, report = self.run_scenario(scenario)
        self.assertEqual(1, code)
        capture = report['captures'][0]
        self.assertIn('datos personales', capture['error'])
        self.assertTrue({'email', 'nif', 'phone', 'iban'} <= {leak['category'] for leak in capture['leaks']})
        self.assertFalse((self.folder / 'fugas' / 'sin-anonimizar.png').exists())

    def test_brand_stops_the_capture(self):
        scenario = {
            'base_url': self.base_url,
            'output_dir': str(self.folder / 'marca'),
            'captures': [{'name': 'con-marca', 'url': self.base_url}],
        }
        code, report = self.run_scenario(scenario)
        self.assertEqual(1, code)
        brand = sorted(leak['value'] for leak in report['captures'][0]['leaks'] if leak['category'] == 'marca')
        self.assertEqual(['FS', 'FacturaScripts', 'factura.city'], brand)
        self.assertFalse((self.folder / 'marca' / 'con-marca.png').exists())

    def test_only_checks_what_enters_the_image(self):
        scenario = {
            'base_url': self.base_url,
            'output_dir': str(self.folder / 'recorte'),
            'captures': [{'name': 'tabla', 'url': self.base_url, 'clip': '#listado', 'margin': 0}],
        }
        code, report = self.run_scenario(scenario)
        self.assertEqual(0, code, report)
        self.assertTrue((self.folder / 'recorte' / 'tabla.png').is_file())


if __name__ == '__main__':
    unittest.main()
