"""Pruebas del auditor de min_version de plugins de FacturaScripts."""

from __future__ import annotations

import importlib.util
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).parents[1] / 'scripts' / 'check-min-version.py'
SPEC = importlib.util.spec_from_file_location('check_min_version', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
CHECKER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = CHECKER
SPEC.loader.exec_module(CHECKER)


def build_core(root: Path) -> Path:
    """Crea un repositorio git mínimo que imita el core y sus versiones.

    v2024: Tools sin decimals(), BaseController con pipe('createViews').
    v2025: Tools gana decimals(), aparece ListCliente.
    v2026: Tools gana env(), desaparece Antiguo.

    Cliente hereda save() de ModelClass, que vive en otro archivo.
    """
    core = root / 'core'
    (core / 'Core' / 'Lib').mkdir(parents=True)
    (core / 'Core' / 'Controller').mkdir(parents=True)
    (core / 'Core' / 'Model').mkdir(parents=True)
    (core / 'Core' / 'Template').mkdir(parents=True)

    def git(*args: str) -> None:
        subprocess.run(('git', '-C', str(core), *args), check=True, capture_output=True)

    def commit(tag: str) -> None:
        git('add', '-A')
        git('-c', 'user.email=test@test', '-c', 'user.name=test', 'commit', '-m', tag)
        git('tag', tag)

    git_init = subprocess.run(('git', 'init', '-q', str(core)), check=True, capture_output=True)
    assert git_init.returncode == 0

    tools = core / 'Core' / 'Tools.php'
    controller = core / 'Core' / 'Lib' / 'BaseController.php'
    init_class = core / 'Core' / 'Template' / 'InitClass.php'
    antiguo = core / 'Core' / 'Lib' / 'Antiguo.php'

    tools.write_text('<?php\nclass Tools\n{\n    public static function trans() {}\n}\n')
    controller.write_text("<?php\nclass BaseController\n{\n    public $orderOptions = [];\n"
                          "    public function run() { $this->pipe('createViews'); }\n}\n")
    init_class.write_text('<?php\nclass InitClass\n{\n    protected function loadExtension() {}\n}\n')
    antiguo.write_text('<?php\nclass Antiguo\n{\n}\n')
    (core / 'Core' / 'Model' / 'ModelClass.php').write_text(
        '<?php\nabstract class ModelClass\n{\n    public static function table() {}\n}\n')
    (core / 'Core' / 'Model' / 'Cliente.php').write_text(
        '<?php\nclass Cliente extends ModelClass\n{\n}\n')
    commit('v2024')

    tools.write_text('<?php\nclass Tools\n{\n    public static function trans() {}\n'
                     '    public static function decimals() {}\n}\n')
    (core / 'Core' / 'Controller' / 'ListCliente.php').write_text('<?php\nclass ListCliente\n{\n}\n')
    commit('v2025')

    tools.write_text('<?php\nclass Tools\n{\n    public static function trans() {}\n'
                     '    public static function decimals() {}\n    public static function env() {}\n}\n')
    antiguo.unlink()
    commit('v2026')

    return core


def build_plugin(root: Path, min_version: str, body: str) -> Path:
    """Crea un plugin de prueba con el ini y el código PHP indicados."""
    plugin = root / 'MiPlugin'
    plugin.mkdir(parents=True, exist_ok=True)
    (plugin / 'facturascripts.ini').write_text(
        f"name = 'MiPlugin'\ndescription = 'prueba'\nversion = 1.0\nmin_version = {min_version}\n"
    )
    (plugin / 'Init.php').write_text(body)
    return plugin


class VersionOrderTest(unittest.TestCase):
    """Comprueba que las versiones se ordenan como decimales y no como semver."""

    def test_tags_are_sorted_as_floats(self) -> None:
        """2025.11 debe quedar antes que 2025.2, igual que hace Kernel::version()."""
        with tempfile.TemporaryDirectory() as tmp:
            core = build_core(Path(tmp))
            subprocess.run(('git', '-C', str(core), 'tag', 'v2025.11', 'v2025'),
                           check=True, capture_output=True)
            subprocess.run(('git', '-C', str(core), 'tag', 'v2025.2', 'v2026'),
                           check=True, capture_output=True)

            repo = CHECKER.CoreRepo(path=core)
            repo.load_tags()

            names = [tag for _, tag in repo.tags]
            self.assertLess(names.index('v2025.11'), names.index('v2025.2'))

    def test_target_tag_picks_lowest_matching_release(self) -> None:
        """La versión comprobada es la más baja que satisface el min_version."""
        with tempfile.TemporaryDirectory() as tmp:
            repo = CHECKER.CoreRepo(path=build_core(Path(tmp)))
            repo.load_tags()

            self.assertEqual('v2025', repo.target_tag(2025)[1])
            self.assertEqual('v2026', repo.target_tag(2025.5)[1])


class IniTest(unittest.TestCase):
    """Comprueba la lectura del facturascripts.ini."""

    def test_reads_min_version_and_require(self) -> None:
        """El ini debe aportar min_version, min_php y la lista de require."""
        with tempfile.TemporaryDirectory() as tmp:
            plugin = Path(tmp) / 'MiPlugin'
            plugin.mkdir()
            (plugin / 'facturascripts.ini').write_text(
                "name = 'MiPlugin'\nversion = 2.1\nmin_version = 2026.4\n"
                "min_php = 8.1\nrequire = StockAvanzado, Comisiones\n"
            )

            info = CHECKER.read_plugin_ini(plugin)

            self.assertEqual(2026.4, info.min_version)
            self.assertEqual(8.1, info.min_php)
            self.assertEqual(('StockAvanzado', 'Comisiones'), info.require)
            self.assertTrue(info.declares_min_version)

    def test_missing_min_version_is_reported(self) -> None:
        """Un ini sin min_version debe quedar marcado como no declarado."""
        with tempfile.TemporaryDirectory() as tmp:
            plugin = Path(tmp) / 'MiPlugin'
            plugin.mkdir()
            (plugin / 'facturascripts.ini').write_text("name = 'MiPlugin'\nversion = 1.0\n")

            info = CHECKER.read_plugin_ini(plugin)

            self.assertFalse(info.declares_min_version)
            self.assertEqual(0.0, info.min_version)


class SymbolCollectionTest(unittest.TestCase):
    """Comprueba la extracción de símbolos del código del plugin."""

    def test_detects_classes_static_calls_and_pipes(self) -> None:
        """Deben detectarse clases importadas, llamadas estáticas y pipes."""
        with tempfile.TemporaryDirectory() as tmp:
            plugin = build_plugin(Path(tmp), '2025', (
                '<?php\n'
                'use FacturaScripts\\Core\\Tools;\n'
                'class Init { public function init(): void { Tools::decimals(); } }\n'
            ))
            (plugin / 'Extension' / 'Controller').mkdir(parents=True)
            (plugin / 'Extension' / 'Controller' / 'ListCliente.php').write_text(
                '<?php\nclass ListCliente { public function createViews(): Closure '
                '{ return function () {}; } }\n'
            )

            symbols, external = CHECKER.collect_symbols(plugin, include_tests=False)
            labels = {symbol.label for symbol in symbols}

            self.assertIn('FacturaScripts\\Core\\Tools', labels)
            self.assertIn('Tools::decimals()', labels)
            self.assertIn("pipe('createViews')", labels)
            self.assertIn('FacturaScripts\\Core\\Controller\\ListCliente', labels)
            self.assertEqual([], external)

    def test_ignores_own_dinamic_classes_and_tests(self) -> None:
        """Los modelos propios vía Dinamic y el directorio Test/ quedan fuera."""
        with tempfile.TemporaryDirectory() as tmp:
            plugin = build_plugin(Path(tmp), '2025', (
                '<?php\n'
                'use FacturaScripts\\Dinamic\\Model\\MiModelo;\n'
                'class Init { public function init(): void { $m = new MiModelo(); } }\n'
            ))
            (plugin / 'Model').mkdir()
            (plugin / 'Model' / 'MiModelo.php').write_text('<?php\nclass MiModelo {}\n')
            (plugin / 'Test').mkdir()
            (plugin / 'Test' / 'MiTest.php').write_text(
                '<?php\nuse FacturaScripts\\Core\\Tools;\nclass MiTest { function t() { Tools::env(); } }\n'
            )

            symbols, _ = CHECKER.collect_symbols(plugin, include_tests=False)
            labels = {symbol.label for symbol in symbols}

            self.assertNotIn('FacturaScripts\\Dinamic\\Model\\MiModelo', labels)
            self.assertNotIn('Tools::env()', labels)

    def test_self_called_closures_are_marked(self) -> None:
        """Un Closure que el propio plugin invoca queda marcado como self_called."""
        with tempfile.TemporaryDirectory() as tmp:
            plugin = build_plugin(Path(tmp), '2025', '<?php\nclass Init {}\n')
            (plugin / 'Extension' / 'Controller').mkdir(parents=True)
            (plugin / 'Extension' / 'Controller' / 'EditAgente.php').write_text(
                '<?php\nclass EditAgente {\n'
                '    public function createViews(): Closure { return function () { $this->miVista(); }; }\n'
                '    public function miVista(): Closure { return function () {}; }\n'
                '}\n'
            )

            symbols, _ = CHECKER.collect_symbols(plugin, include_tests=False)
            pipes = {symbol.label: symbol.self_called for symbol in symbols if symbol.kind == 'pipe'}

            self.assertFalse(pipes["pipe('createViews')"])
            self.assertTrue(pipes["pipe('miVista')"])

    def test_external_plugin_dependencies_are_listed_apart(self) -> None:
        """Las clases de otros plugins se listan como dependencias externas."""
        with tempfile.TemporaryDirectory() as tmp:
            plugin = build_plugin(Path(tmp), '2025', (
                '<?php\n'
                'use FacturaScripts\\Plugins\\StockAvanzado\\Model\\ConteoStock;\n'
                'class Init {}\n'
            ))

            symbols, external = CHECKER.collect_symbols(plugin, include_tests=False)

            self.assertEqual(['FacturaScripts\\Plugins\\StockAvanzado\\Model\\ConteoStock'], external)
            self.assertNotIn('ConteoStock', {symbol.label for symbol in symbols})


class NoiseFilterTest(unittest.TestCase):
    """Comprueba los filtros que evitan auditar símbolos ajenos al core."""

    def test_table_columns_are_not_core_properties(self) -> None:
        """Un campo que el plugin añade por XML no es una propiedad del core."""
        with tempfile.TemporaryDirectory() as tmp:
            plugin = build_plugin(Path(tmp), '2025', (
                '<?php\nclass Init { public function init(): void '
                '{ $empresa->mi_campo = 1; $empresa->otra_cosa = 2; } }\n'
            ))
            (plugin / 'Extension' / 'Table').mkdir(parents=True)
            (plugin / 'Extension' / 'Table' / 'empresas.xml').write_text(
                '<?xml version="1.0"?>\n<table><column><name>mi_campo</name></column></table>\n'
            )

            symbols, _ = CHECKER.collect_symbols(plugin, include_tests=False)
            labels = {symbol.label for symbol in symbols}

            self.assertNotIn('->mi_campo', labels)
            self.assertIn('->otra_cosa', labels)

    def test_native_php_methods_are_ignored(self) -> None:
        """Los métodos de clases nativas de PHP no se auditan contra el core."""
        with tempfile.TemporaryDirectory() as tmp:
            plugin = build_plugin(Path(tmp), '2025', (
                '<?php\nclass Init { public function init(): void '
                '{ $e->getMessage(); $xml->xpath("//a"); $date->modify("+1 day"); } }\n'
            ))

            symbols, _ = CHECKER.collect_symbols(plugin, include_tests=False)
            labels = {symbol.label for symbol in symbols}

            self.assertNotIn('->getMessage()', labels)
            self.assertNotIn('->xpath()', labels)
            self.assertNotIn('->modify()', labels)

    def test_extension_traits_are_not_core_classes(self) -> None:
        """Un trait auxiliar dentro de Extension/ no extiende una clase del core."""
        with tempfile.TemporaryDirectory() as tmp:
            plugin = build_plugin(Path(tmp), '2025', '<?php\nclass Init {}\n')
            (plugin / 'Extension' / 'Controller').mkdir(parents=True)
            (plugin / 'Extension' / 'Controller' / 'CommonFileTrait.php').write_text(
                '<?php\ntrait CommonFileTrait { public function addFileAction(): Closure '
                '{ return function () {}; } }\n'
            )
            (plugin / 'Extension' / 'Controller' / 'ListCliente.php').write_text(
                '<?php\nclass ListCliente { public function createViews(): Closure '
                '{ return function () {}; } }\n'
            )

            symbols, _ = CHECKER.collect_symbols(plugin, include_tests=False)
            extendidas = {symbol.label for symbol in symbols if symbol.kind == 'clase extendida'}

            self.assertNotIn('FacturaScripts\\Core\\Controller\\CommonFileTrait', extendidas)
            self.assertIn('FacturaScripts\\Core\\Controller\\ListCliente', extendidas)

    def test_methods_called_from_twig_count_as_used(self) -> None:
        """Un método añadido que solo se invoca desde Twig queda marcado igual."""
        with tempfile.TemporaryDirectory() as tmp:
            plugin = build_plugin(Path(tmp), '2025', '<?php\nclass Init {}\n')
            (plugin / 'Extension' / 'Model').mkdir(parents=True)
            (plugin / 'Extension' / 'Model' / 'Contacto.php').write_text(
                '<?php\nclass Contacto { public function getTwoFactorQR(): Closure '
                '{ return function () {}; } }\n'
            )
            (plugin / 'View').mkdir()
            (plugin / 'View' / 'Edit.html.twig').write_text(
                '{% set qr = fsc.contact.getTwoFactorQR() %}\n'
            )

            symbols, _ = CHECKER.collect_symbols(plugin, include_tests=False)
            pipes = {symbol.label: symbol.self_called for symbol in symbols if symbol.kind == 'pipe'}

            self.assertTrue(pipes["pipe('getTwoFactorQR')"])


class ProviderTest(unittest.TestCase):
    """Comprueba la atribución de símbolos a otros plugins o a vendor."""

    def test_symbol_from_sibling_plugin_is_attributed(self) -> None:
        """Una clase que aporta otro plugin instalado se atribuye a ese plugin."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins_dir = Path(tmp) / 'Plugins'
            (plugins_dir / 'Comisiones' / 'Model').mkdir(parents=True)
            (plugins_dir / 'Comisiones' / 'Model' / 'Comision.php').write_text(
                '<?php\nclass Comision {}\n'
            )
            symbol = CHECKER.Symbol(
                kind='clase', label='Comision', patterns=('class Comision',),
                pathspecs=('Core/',), origin='Mod/CalculatorMod.php',
            )
            results = [CHECKER.SymbolResult(symbol=symbol, status='no encontrado')]

            CHECKER.resolve_providers(results, plugins_dir, 'DobleAgente', [], ('Comisiones',), workers=2)

            self.assertEqual('aportado por plugin', results[0].status)
            self.assertEqual('Comisiones', results[0].provider)

    def test_required_plugin_wins_when_several_match(self) -> None:
        """Entre varios candidatos se prefiere el plugin declarado en require."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins_dir = Path(tmp) / 'Plugins'
            for name in ('Otro', 'Comisiones'):
                (plugins_dir / name / 'Model').mkdir(parents=True)
                (plugins_dir / name / 'Model' / 'Comision.php').write_text('<?php\nclass Comision {}\n')
            symbol = CHECKER.Symbol(
                kind='clase', label='Comision', patterns=('class Comision',),
                pathspecs=('Core/',), origin='Mod/CalculatorMod.php',
            )
            results = [CHECKER.SymbolResult(symbol=symbol, status='no encontrado')]

            CHECKER.resolve_providers(results, plugins_dir, 'DobleAgente', [], ('Comisiones',), workers=2)

            self.assertEqual('Comisiones', results[0].provider)

    def test_symbol_from_vendor_is_attributed(self) -> None:
        """Un método de una librería de vendor se atribuye al paquete."""
        with tempfile.TemporaryDirectory() as tmp:
            vendor = Path(tmp) / 'vendor'
            (vendor / 'rospdf' / 'pdf-php').mkdir(parents=True)
            (vendor / 'rospdf' / 'pdf-php' / 'Cezpdf.php').write_text(
                '<?php\nclass Cezpdf { public function ezOutput() {} }\n'
            )
            symbol = CHECKER.Symbol(
                kind='método', label='->ezOutput()', patterns=('function ezOutput(',),
                pathspecs=('Core/',), origin='Lib/CartaPortePdf.php', confidence='media',
            )
            results = [CHECKER.SymbolResult(symbol=symbol, status='no encontrado')]

            CHECKER.resolve_providers(results, None, 'CMR', [vendor], (), workers=2)

            self.assertEqual('aportado por vendor', results[0].status)
            self.assertEqual('rospdf/pdf-php', results[0].provider)


class PipeAuditTest(unittest.TestCase):
    """Comprueba cómo se resuelven los Closures de las extensiones."""

    def test_existing_pipe_is_valid_even_if_the_plugin_calls_it(self) -> None:
        """Un pipe declarado en el core es válido aunque el plugin lo invoque."""
        with tempfile.TemporaryDirectory() as tmp:
            core_repo = CHECKER.CoreRepo(path=build_core(Path(tmp)))
            core_repo.load_tags()
            plugin = build_plugin(Path(tmp), '2025', '<?php\nclass Init {}\n')
            (plugin / 'Extension' / 'Controller').mkdir(parents=True)
            (plugin / 'Extension' / 'Controller' / 'ListCliente.php').write_text(
                '<?php\nclass ListCliente {\n'
                '    public function createViews(): Closure '
                '{ return function () { $this->createViews(); $this->miVista(); }; }\n'
                '    public function miVista(): Closure { return function () {}; }\n'
                '}\n'
            )

            info = CHECKER.read_plugin_ini(plugin)
            symbols, external = CHECKER.collect_symbols(plugin, include_tests=False)
            target = core_repo.target_tag(info.min_version)
            results = CHECKER.audit(symbols, core_repo, target, workers=2)
            report = CHECKER.build_report(info, core_repo, target, results, external)
            estados = {item['simbolo']: item['estado'] for item in report['symbols']}

            self.assertEqual('ok', estados["pipe('createViews')"])
            self.assertEqual('método añadido', estados["pipe('miVista')"])
            self.assertFalse(any('sin pipe()' in aviso for aviso in report['avisos']))


class AuditTest(unittest.TestCase):
    """Comprueba el resultado de auditar un plugin contra el core simulado."""

    def audit_plugin(self, tmp: str, min_version: str, body: str) -> dict:
        """Ejecuta la auditoría completa y devuelve el informe."""
        core_repo = CHECKER.CoreRepo(path=build_core(Path(tmp)))
        core_repo.load_tags()
        plugin = build_plugin(Path(tmp), min_version, body)
        info = CHECKER.read_plugin_ini(plugin)
        symbols, external = CHECKER.collect_symbols(plugin, include_tests=False)
        target = core_repo.target_tag(info.min_version)
        results = CHECKER.audit(symbols, core_repo, target, workers=2)
        return CHECKER.build_report(info, core_repo, target, results, external)

    def test_compliant_plugin(self) -> None:
        """Un plugin que solo usa símbolos antiguos cumple su min_version."""
        with tempfile.TemporaryDirectory() as tmp:
            report = self.audit_plugin(tmp, '2025', (
                '<?php\n'
                'use FacturaScripts\\Core\\Tools;\n'
                'class Init { public function init(): void { Tools::decimals(); } }\n'
            ))

            self.assertTrue(report['plugin']['cumple'])
            self.assertEqual(2025, report['plugin']['min_version_calculado'])

    def test_plugin_using_newer_method(self) -> None:
        """Un método añadido en v2026 obliga a subir el min_version a 2026."""
        with tempfile.TemporaryDirectory() as tmp:
            report = self.audit_plugin(tmp, '2025', (
                '<?php\n'
                'use FacturaScripts\\Core\\Tools;\n'
                'class Init { public function init(): void { Tools::env(); } }\n'
            ))

            self.assertFalse(report['plugin']['cumple'])
            self.assertEqual(2026, report['plugin']['min_version_calculado'])
            posteriores = [item for item in report['symbols'] if item['estado'] == 'posterior']
            self.assertEqual(['Tools::env()'], [item['simbolo'] for item in posteriores])
            self.assertEqual('v2026', posteriores[0]['desde'])

    def test_removed_class_is_reported(self) -> None:
        """Una clase eliminada del core se informa aunque el min_version cuadre."""
        with tempfile.TemporaryDirectory() as tmp:
            report = self.audit_plugin(tmp, '2025', (
                '<?php\n'
                'use FacturaScripts\\Core\\Lib\\Antiguo;\n'
                'class Init { public function init(): void { $a = new Antiguo(); } }\n'
            ))

            eliminados = [item for item in report['symbols'] if item['estado'] == 'eliminado']
            self.assertEqual(['FacturaScripts\\Core\\Lib\\Antiguo'],
                             [item['simbolo'] for item in eliminados])
            self.assertEqual('v2025', eliminados[0]['eliminado_tras'])

    def test_min_version_below_2025_is_rejected(self) -> None:
        """El core rechaza min_version inferior a 2025, aunque el código encaje."""
        with tempfile.TemporaryDirectory() as tmp:
            report = self.audit_plugin(tmp, '2024', '<?php\nclass Init {}\n')

            self.assertFalse(report['plugin']['cumple'])
            self.assertEqual(2025, report['plugin']['min_version_calculado'])
            self.assertTrue(any('2025' in aviso for aviso in report['avisos']))

    def test_inherited_method_is_found_outside_its_class_file(self) -> None:
        """Un método heredado se localiza ensanchando la búsqueda a todo Core/."""
        with tempfile.TemporaryDirectory() as tmp:
            report = self.audit_plugin(tmp, '2025', (
                '<?php\n'
                'use FacturaScripts\\Core\\Model\\Cliente;\n'
                'class Init { public function init(): void { Cliente::table(); } }\n'
            ))

            inherited = [item for item in report['symbols'] if item['simbolo'] == 'Cliente::table()']
            self.assertEqual(['ok'], [item['estado'] for item in inherited])
            self.assertEqual(['media'], [item['confianza'] for item in inherited])


class CliTest(unittest.TestCase):
    """Comprueba la interfaz de línea de comandos."""

    def test_exit_codes(self) -> None:
        """El script devuelve 1 al incumplir y 2 sin clon del core."""
        with tempfile.TemporaryDirectory() as tmp:
            core = build_core(Path(tmp))
            plugin = build_plugin(Path(tmp), '2025', (
                '<?php\n'
                'use FacturaScripts\\Core\\Tools;\n'
                'class Init { public function init(): void { Tools::env(); } }\n'
            ))

            failing = subprocess.run(
                (sys.executable, str(SCRIPT_PATH), str(plugin), '--core', str(core)),
                capture_output=True, text=True, check=False,
            )
            self.assertEqual(1, failing.returncode)
            self.assertIn('INCUMPLE', failing.stdout)

            missing_core = subprocess.run(
                (sys.executable, str(SCRIPT_PATH), str(plugin), '--core', str(Path(tmp) / 'no-existe')),
                capture_output=True, text=True, check=False,
                cwd=tmp, env={'PATH': '/usr/bin:/bin', 'HOME': tmp},
            )
            self.assertEqual(2, missing_core.returncode)
            self.assertIn('git clone', missing_core.stderr)

    def test_json_output(self) -> None:
        """La salida JSON incluye el informe completo."""
        import json

        with tempfile.TemporaryDirectory() as tmp:
            core = build_core(Path(tmp))
            plugin = build_plugin(Path(tmp), '2025', '<?php\nclass Init {}\n')

            result = subprocess.run(
                (sys.executable, str(SCRIPT_PATH), str(plugin), '--core', str(core), '--json'),
                capture_output=True, text=True, check=False,
            )
            report = json.loads(result.stdout)

            self.assertEqual('MiPlugin', report['plugin']['name'])
            self.assertEqual('v2025', report['core']['version_objetivo'])


if __name__ == '__main__':
    unittest.main()
