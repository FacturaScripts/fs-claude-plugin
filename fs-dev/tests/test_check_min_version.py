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


def build_kernel_core(root: Path, releases: list[tuple[str, str, str]]) -> Path:
    """Crea un core cuyas etiquetas declaran su versión en ``Kernel::version()``.

    Cada entrada es ``(etiqueta, versión del Kernel, métodos de Tools)``.
    """
    core = root / 'core'
    (core / 'Core').mkdir(parents=True)
    subprocess.run(('git', 'init', '-q', str(core)), check=True, capture_output=True)
    for tag, version, methods in releases:
        (core / 'Core' / 'Kernel.php').write_text(
            '<?php\nfinal class Kernel\n{\n    public static function version(): float\n'
            f'    {{\n        return {version};\n    }}\n}}\n')
        (core / 'Core' / 'Tools.php').write_text(
            '<?php\nclass Tools\n{\n' + ''.join(
                f'    public static function {name}() {{}}\n' for name in methods.split()) + '}\n')
        for args in (('add', '-A'),
                     ('-c', 'user.email=test@test', '-c', 'user.name=test', 'commit', '-m', tag),
                     ('tag', tag)):
            subprocess.run(('git', '-C', str(core), *args), check=True, capture_output=True)
    return core


class KernelVersionTest(unittest.TestCase):
    """Cada etiqueta vale lo que devuelve su Kernel::version(), no su nombre."""

    def audit_plugin(self, tmp: str, core: Path, min_version: str, body: str) -> dict:
        """Ejecuta la auditoría completa y devuelve el informe."""
        core_repo = CHECKER.CoreRepo(path=core)
        core_repo.load_tags()
        plugin = build_plugin(Path(tmp), min_version, body)
        info = CHECKER.read_plugin_ini(plugin)
        symbols, external = CHECKER.collect_symbols(plugin, include_tests=False)
        target = core_repo.target_tag(info.min_version)
        results = CHECKER.audit(symbols, core_repo, target, workers=2)
        return CHECKER.build_report(info, core_repo, target, results, external)

    def test_target_tag_uses_kernel_version(self) -> None:
        """v2025.7 devuelve 2025.63: un plugin con min_version 2025.7 no instala en ella."""
        with tempfile.TemporaryDirectory() as tmp:
            repo = CHECKER.CoreRepo(path=build_kernel_core(Path(tmp), [
                ('v2025.7', '2025.63', 'trans'),
                ('v2025.71', '2025.71', 'trans'),
            ]))
            repo.load_tags()

            self.assertIn((2025.63, 'v2025.7'), repo.tags)
            self.assertEqual('v2025.71', repo.target_tag(2025.7)[1])
            self.assertEqual('v2025.7', repo.target_tag(2025.63)[1])

    def test_tag_named_below_its_kernel_version_is_audited(self) -> None:
        """v2025.2 devuelve 2025.21: un plugin con min_version 2025.21 instala en ella."""
        with tempfile.TemporaryDirectory() as tmp:
            core = build_kernel_core(Path(tmp), [
                ('v2025.2', '2025.21', 'trans'),
                ('v2025.3', '2025.3', 'trans decimals'),
            ])
            report = self.audit_plugin(tmp, core, '2025.21', (
                '<?php\n'
                'use FacturaScripts\\Core\\Tools;\n'
                'class Init { public function init(): void { Tools::decimals(); } }\n'
            ))

            self.assertEqual('v2025.2', report['core']['version_objetivo'])
            self.assertFalse(report['plugin']['cumple'])
            self.assertEqual(2025.3, report['plugin']['min_version_calculado'])

    def test_required_min_version_is_the_kernel_version(self) -> None:
        """Un método añadido en v2025.7 exige 2025.63, no 2025.7."""
        with tempfile.TemporaryDirectory() as tmp:
            core = build_kernel_core(Path(tmp), [
                ('v2025.4', '2025.4', 'trans'),
                ('v2025.7', '2025.63', 'trans decimals'),
            ])
            report = self.audit_plugin(tmp, core, '2025.4', (
                '<?php\n'
                'use FacturaScripts\\Core\\Tools;\n'
                'class Init { public function init(): void { Tools::decimals(); } }\n'
            ))

            self.assertFalse(report['plugin']['cumple'])
            self.assertEqual(2025.63, report['plugin']['min_version_calculado'])


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


def build_request_core(root: Path) -> Path:
    """Crea un core en el que dos clases declaran un método con el mismo nombre.

    v2025: Response tiene json(); Request no.
    v2026: Request gana json().
    """
    core = root / 'core'
    (core / 'Core' / 'Model').mkdir(parents=True)
    subprocess.run(('git', 'init', '-q', str(core)), check=True, capture_output=True)
    (core / 'Core' / 'Response.php').write_text(
        '<?php\nclass Response\n{\n    public function json(array $data): void {}\n}\n')
    (core / 'Core' / 'Model' / 'ModelClass.php').write_text(
        '<?php\nabstract class ModelClass\n{\n    public function save(): bool {}\n}\n')
    (core / 'Core' / 'Model' / 'Cliente.php').write_text(
        '<?php\nclass Cliente extends ModelClass\n{\n}\n')
    request = core / 'Core' / 'Request.php'
    for tag, body in (('v2025', ''), ('v2026', '    public function json() {}\n')):
        request.write_text('<?php\nclass Request\n{\n    public function host() {}\n' + body + '}\n')
        for args in (('add', '-A'),
                     ('-c', 'user.email=test@test', '-c', 'user.name=test', 'commit', '-m', tag),
                     ('tag', tag)):
            subprocess.run(('git', '-C', str(core), *args), check=True, capture_output=True)
    return core


class TypedMethodCallTest(unittest.TestCase):
    """Un ->metodo() se busca en la clase del receptor cuando se conoce."""

    def audit_plugin(self, tmp: str, body: str) -> dict[str, dict]:
        """Audita el plugin y devuelve los símbolos indexados por su etiqueta."""
        core_repo = CHECKER.CoreRepo(path=build_request_core(Path(tmp)))
        core_repo.load_tags()
        plugin = build_plugin(Path(tmp), '2025', body)
        info = CHECKER.read_plugin_ini(plugin)
        symbols, external = CHECKER.collect_symbols(plugin, include_tests=False)
        target = core_repo.target_tag(info.min_version)
        results = CHECKER.audit(symbols, core_repo, target, workers=2)
        report = CHECKER.build_report(info, core_repo, target, results, external)
        return {item['simbolo']: item for item in report['symbols']}

    def test_typed_parameter_is_resolved_against_its_class(self) -> None:
        """Request::json() es de v2026 aunque Response::json() exista desde v2025."""
        with tempfile.TemporaryDirectory() as tmp:
            symbols = self.audit_plugin(tmp, (
                '<?php\n'
                'use FacturaScripts\\Core\\Request;\n'
                'class Init { public function leer(Request $request) { return $request->json(); } }\n'
            ))

            self.assertNotIn('->json()', symbols)
            self.assertEqual('posterior', symbols['Request->json()']['estado'])
            self.assertEqual('v2026', symbols['Request->json()']['desde'])
            self.assertEqual('alta', symbols['Request->json()']['confianza'])

    def test_new_and_typed_property_are_resolved(self) -> None:
        """$x = new Clase() y una propiedad tipada también fijan la clase."""
        with tempfile.TemporaryDirectory() as tmp:
            symbols = self.audit_plugin(tmp, (
                '<?php\n'
                'use FacturaScripts\\Core\\Request;\n'
                'class Init {\n'
                '    private Request $peticion;\n'
                '    public function a() { $r = new Request(); return $r->host(); }\n'
                '    public function b() { return $this->peticion->json(); }\n'
                '}\n'
            ))

            self.assertEqual('ok', symbols['Request->host()']['estado'])
            self.assertEqual('posterior', symbols['Request->json()']['estado'])

    def test_inherited_method_still_widens_to_core(self) -> None:
        """Si la clase no declara el método, se busca en sus padres por todo Core/."""
        with tempfile.TemporaryDirectory() as tmp:
            symbols = self.audit_plugin(tmp, (
                '<?php\n'
                'use FacturaScripts\\Dinamic\\Model\\Cliente;\n'
                'class Init { public function a(Cliente $cliente) { return $cliente->save(); } }\n'
            ))

            self.assertEqual('ok', symbols['Cliente->save()']['estado'])
            self.assertEqual('media', symbols['Cliente->save()']['confianza'])

    def test_unknown_receiver_keeps_the_generic_search(self) -> None:
        """Sin tipo conocido se mantiene la búsqueda por nombre en todo Core/."""
        with tempfile.TemporaryDirectory() as tmp:
            symbols = self.audit_plugin(tmp, (
                '<?php\n'
                'class Init { public function a($algo) { return $algo->json(); } }\n'
            ))

            self.assertEqual('ok', symbols['->json()']['estado'])
            self.assertEqual('media', symbols['->json()']['confianza'])


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


    def test_directories_starting_with_a_dash_are_not_grep_options(self) -> None:
        """Un directorio relativo que empieza por guion se busca, no se toma por opción de grep."""
        import os

        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / '-Plugins' / 'Comisiones').mkdir(parents=True)
            (Path(tmp) / '-Plugins' / 'Comisiones' / 'Comision.php').write_text('<?php\nclass Comision {}\n')
            (Path(tmp) / '--version' / 'rospdf' / 'pdf-php').mkdir(parents=True)
            (Path(tmp) / '--version' / 'rospdf' / 'pdf-php' / 'Cezpdf.php').write_text(
                '<?php\nclass Cezpdf {}\n')
            from_plugin = CHECKER.Symbol(kind='clase', label='Comision', patterns=('class Comision',),
                                         pathspecs=('Core/',), origin='Init.php')
            from_vendor = CHECKER.Symbol(kind='clase', label='Cezpdf', patterns=('class Cezpdf',),
                                         pathspecs=('Core/',), origin='Init.php')

            cwd = os.getcwd()
            os.chdir(tmp)
            try:
                plugin = CHECKER.sibling_provider(from_plugin, Path('-Plugins'), 'MiPlugin')
                vendor = CHECKER.vendor_provider(from_vendor, [Path('--version')])
            finally:
                os.chdir(cwd)

            self.assertEqual('Comisiones', plugin)
            self.assertEqual('rospdf/pdf-php', vendor)


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


class CaseSensitivityTest(unittest.TestCase):
    """PHP no distingue mayúsculas en métodos ni clases, pero sí en propiedades y pipes."""

    def audit_plugin(self, tmp: str, body: str, extension: str | None = None) -> dict[str, str]:
        """Audita el plugin y devuelve el estado de cada símbolo."""
        core_repo = CHECKER.CoreRepo(path=build_core(Path(tmp)))
        core_repo.load_tags()
        plugin = build_plugin(Path(tmp), '2025', body)
        if extension:
            (plugin / 'Extension' / 'Controller').mkdir(parents=True)
            (plugin / 'Extension' / 'Controller' / 'ListCliente.php').write_text(extension)
        info = CHECKER.read_plugin_ini(plugin)
        symbols, external = CHECKER.collect_symbols(plugin, include_tests=False)
        target = core_repo.target_tag(info.min_version)
        results = CHECKER.audit(symbols, core_repo, target, workers=2)
        report = CHECKER.build_report(info, core_repo, target, results, external)
        return {item['simbolo']: item['estado'] for item in report['symbols']}

    def test_methods_ignore_case(self) -> None:
        """->Run() se resuelve contra function run( y Tools::Env() contra function env(."""
        with tempfile.TemporaryDirectory() as tmp:
            estados = self.audit_plugin(tmp, (
                '<?php\n'
                'use FacturaScripts\\Core\\Tools;\n'
                'class Init { public function init($c): void { $c->Run(); Tools::Env(); } }\n'
            ))

            self.assertEqual('ok', estados['->Run()'])
            self.assertEqual('posterior', estados['Tools::Env()'])

    def test_own_method_called_with_other_case_is_not_audited(self) -> None:
        """Un método propio invocado con otras mayúsculas sigue siendo del plugin."""
        with tempfile.TemporaryDirectory() as tmp:
            estados = self.audit_plugin(tmp, (
                '<?php\n'
                'class Init { public function miMetodo() {} '
                'public function init(): void { $this->MIMETODO(); } }\n'
            ))

            self.assertNotIn('->MIMETODO()', estados)

    def test_properties_keep_case(self) -> None:
        """->OrderOptions no es la propiedad $orderOptions del core."""
        with tempfile.TemporaryDirectory() as tmp:
            estados = self.audit_plugin(tmp, (
                '<?php\n'
                'class Init { public function init($c): void { $a = $c->orderOptions; $b = $c->OrderOptions; } }\n'
            ))

            self.assertEqual('ok', estados['->orderOptions'])
            self.assertEqual('no encontrado', estados['->OrderOptions'])

    def test_pipes_keep_case(self) -> None:
        """pipe('createViews') no casa con un Closure llamado createviews."""
        with tempfile.TemporaryDirectory() as tmp:
            estados = self.audit_plugin(tmp, '<?php\nclass Init {}\n', (
                '<?php\nclass ListCliente {\n'
                '    public function createviews(): Closure { return function () {}; }\n'
                '}\n'
            ))

            self.assertEqual('no encontrado', estados["pipe('createviews')"])


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


class RemovedApiTest(unittest.TestCase):
    """Hasta qué versión funciona el plugin, y la versión máxima opcional."""

    USES_ANTIGUO = (
        '<?php\n'
        'use FacturaScripts\\Core\\Lib\\Antiguo;\n'
        'class Init { public function init(): void { $a = new Antiguo(); } }\n'
    )

    def audit_plugin(self, tmp: str, body: str, max_version: float | None = None) -> dict:
        """Ejecuta la auditoría completa, con versión máxima si se indica."""
        core_repo = CHECKER.CoreRepo(path=build_core(Path(tmp)))
        core_repo.load_tags()
        plugin = build_plugin(Path(tmp), '2025', body)
        info = CHECKER.read_plugin_ini(plugin)
        symbols, external = CHECKER.collect_symbols(plugin, include_tests=False)
        target = core_repo.target_tag(info.min_version)
        results = CHECKER.audit(symbols, core_repo, target, workers=2)
        max_target = core_repo.target_tag(max_version) if max_version else None
        return CHECKER.build_report(info, core_repo, target, results, external, max_target)

    def test_works_until_the_last_release_with_every_symbol(self) -> None:
        """Antiguo desaparece en v2026: el plugin funciona hasta v2025."""
        with tempfile.TemporaryDirectory() as tmp:
            report = self.audit_plugin(tmp, self.USES_ANTIGUO)

            self.assertEqual('v2025', report['plugin']['funciona_hasta'])
            self.assertTrue(report['plugin']['cumple'])
            self.assertEqual([], report['plugin']['retirados'])
            self.assertIsNone(report['core']['version_maxima'])

    def test_works_until_latest_without_removed_symbols(self) -> None:
        """Sin símbolos eliminados, funciona hasta la última versión conocida."""
        with tempfile.TemporaryDirectory() as tmp:
            report = self.audit_plugin(tmp, '<?php\nclass Init {}\n')

            self.assertEqual('v2026', report['plugin']['funciona_hasta'])

    def test_symbol_removed_by_max_version_fails(self) -> None:
        """Con versión máxima v2026, usar Antiguo hace incumplir."""
        with tempfile.TemporaryDirectory() as tmp:
            report = self.audit_plugin(tmp, self.USES_ANTIGUO, max_version=2026)

            self.assertFalse(report['plugin']['cumple'])
            self.assertEqual(['FacturaScripts\\Core\\Lib\\Antiguo'], report['plugin']['retirados'])
            self.assertEqual('v2026', report['core']['version_maxima'])
            self.assertEqual(2025, report['plugin']['min_version_calculado'])

    def test_symbol_still_present_at_max_version_passes(self) -> None:
        """Con versión máxima v2025, Antiguo todavía existe y el plugin cumple."""
        with tempfile.TemporaryDirectory() as tmp:
            report = self.audit_plugin(tmp, self.USES_ANTIGUO, max_version=2025)

            self.assertTrue(report['plugin']['cumple'])
            self.assertEqual([], report['plugin']['retirados'])

    def test_cli_exit_code_with_max_version(self) -> None:
        """--max-version hace que el script devuelva 1; sin él, 0."""
        with tempfile.TemporaryDirectory() as tmp:
            core = build_core(Path(tmp))
            plugin = build_plugin(Path(tmp), '2025', self.USES_ANTIGUO)
            command = (sys.executable, str(SCRIPT_PATH), str(plugin), '--core', str(core))

            without = subprocess.run(command, capture_output=True, text=True, check=False)
            self.assertEqual(0, without.returncode)
            self.assertIn('Funciona hasta: v2025', without.stdout)

            failing = subprocess.run((*command, '--max-version', '2026'),
                                     capture_output=True, text=True, check=False)
            self.assertEqual(1, failing.returncode)
            self.assertIn('INCUMPLE. Usa símbolos que ya no existen en v2026', failing.stdout)


def build_installed_plugin(plugins_dir: Path, name: str, min_version: str, body: str,
                           require: str = '') -> Path:
    """Crea un plugin de prueba dentro de un directorio Plugins/, con su require."""
    plugin = plugins_dir / name
    plugin.mkdir(parents=True, exist_ok=True)
    (plugin / 'facturascripts.ini').write_text(
        f"name = '{name}'\ndescription = 'prueba'\nversion = 1.0\nmin_version = {min_version}\n"
        f"require = '{require}'\n"
    )
    (plugin / 'Init.php').write_text(body)
    return plugin


class RequireTest(unittest.TestCase):
    """Los plugins declarados en require se auditan y fijan el rango efectivo."""

    CLEAN = '<?php\nclass Init {}\n'
    USES_ENV = (
        '<?php\n'
        'use FacturaScripts\\Core\\Tools;\n'
        'class Init { public function init(): void { Tools::env(); } }\n'
    )
    USES_ANTIGUO = RemovedApiTest.USES_ANTIGUO

    def run_checker(self, tmp: str, *extra: str) -> tuple[int, dict]:
        """Audita el plugin Raiz con la salida JSON y devuelve el código y el informe."""
        import contextlib
        import io
        import json

        core = build_core(Path(tmp))
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            code = CHECKER.main([str(Path(tmp) / 'Plugins' / 'Raiz'), '--core', str(core),
                                 '--json', '--workers', '2', *extra])
        return code, json.loads(output.getvalue())

    def test_required_plugin_raises_the_effective_min_version(self) -> None:
        """Un requerido que necesita v2026 sube el mínimo efectivo, no el calculado."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require='Base')
            build_installed_plugin(plugins, 'Base', '2025', self.USES_ENV)

            code, report = self.run_checker(tmp)

            self.assertEqual(0, code)
            self.assertTrue(report['plugin']['cumple'])
            self.assertEqual(2025, report['plugin']['min_version_calculado'])
            self.assertEqual(2026, report['plugin']['min_version_efectivo'])
            self.assertEqual('Base', report['plugin']['min_version_fijado_por'])
            self.assertTrue(any('lo fija Base' in warning for warning in report['avisos']))

    def test_required_plugin_lowers_the_effective_ceiling(self) -> None:
        """Un requerido que usa algo retirado en v2026 baja el techo efectivo."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require='Base')
            build_installed_plugin(plugins, 'Base', '2025', self.USES_ANTIGUO)

            _, report = self.run_checker(tmp)

            self.assertEqual('v2026', report['plugin']['funciona_hasta'])
            self.assertEqual('v2025', report['plugin']['funciona_hasta_efectivo'])
            self.assertEqual('Base', report['plugin']['funciona_hasta_fijado_por'])

    def test_requirements_are_followed_recursively(self) -> None:
        """Raiz requiere Medio, que requiere Base: el mínimo lo fija Base."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require='Medio')
            build_installed_plugin(plugins, 'Medio', '2025', self.CLEAN, require='Base')
            build_installed_plugin(plugins, 'Base', '2025', self.USES_ENV)

            _, report = self.run_checker(tmp)

            self.assertEqual(2026, report['plugin']['min_version_efectivo'])
            self.assertEqual('Base', report['plugin']['min_version_fijado_por'])
            base = [entry for entry in report['requeridos'] if entry['name'] == 'Base']
            self.assertEqual('Medio', base[0]['requerido_por'])

    def test_own_plugin_wins_a_tie(self) -> None:
        """Si el plugin y su requerido necesitan la misma versión, la fija el propio plugin."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(plugins, 'Raiz', '2026', self.USES_ENV, require='Base')
            build_installed_plugin(plugins, 'Base', '2025', self.USES_ENV)

            _, report = self.run_checker(tmp)

            self.assertEqual(2026, report['plugin']['min_version_efectivo'])
            self.assertEqual('Raiz', report['plugin']['min_version_fijado_por'])

    def test_shared_requirement_is_audited_once(self) -> None:
        """Un plugin que requieren dos ramas de la cadena aparece una sola vez."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require='Uno,Dos')
            build_installed_plugin(plugins, 'Uno', '2025', self.CLEAN, require='Base')
            build_installed_plugin(plugins, 'Dos', '2025', self.CLEAN, require='Base')
            build_installed_plugin(plugins, 'Base', '2025', self.CLEAN)

            _, report = self.run_checker(tmp)

            names = [entry['name'] for entry in report['requeridos']]
            self.assertEqual(['Uno', 'Base', 'Dos'], names)

    def test_missing_required_plugin_is_reported(self) -> None:
        """Un requerido que no está en Plugins/ se informa y no cambia el resultado."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require='Falta')

            code, report = self.run_checker(tmp)

            self.assertEqual(0, code)
            self.assertEqual('no encontrado', report['requeridos'][0]['estado'])
            self.assertTrue(any('Falta' in warning and 'no se han auditado' in warning
                                for warning in report['avisos']))

    def test_circular_requirement_is_reported(self) -> None:
        """Raiz requiere Base y Base requiere Raiz: termina e informa del ciclo."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require='Base')
            build_installed_plugin(plugins, 'Base', '2025', self.CLEAN, require='Raiz')

            _, report = self.run_checker(tmp)

            cycles = [entry for entry in report['requeridos'] if entry['estado'] == 'ciclo']
            self.assertEqual([['Raiz', 'Base', 'Raiz']], [entry['ciclo'] for entry in cycles])
            self.assertTrue(any('Raiz → Base → Raiz' in warning for warning in report['avisos']))

    def test_require_with_a_path_is_not_followed(self) -> None:
        """Una ruta relativa o absoluta en require no se audita: el core compara por nombre."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(Path(tmp), 'Fuera', '2025', self.USES_ENV)
            outside = str(Path(tmp) / 'Fuera')
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require=f'../Fuera,{outside}')

            _, report = self.run_checker(tmp)

            self.assertEqual(['nombre inválido', 'nombre inválido'],
                             [entry['estado'] for entry in report['requeridos']])
            self.assertEqual(2025, report['plugin']['min_version_efectivo'])
            self.assertEqual(2, len([warning for warning in report['avisos'] if 'no es un nombre' in warning]))

    def test_other_spellings_of_a_name_are_not_audited_again(self) -> None:
        """./Base o Base// no son nombres de plugin: Base se audita una sola vez."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require='Base,./Base,Base//')
            build_installed_plugin(plugins, 'Base', '2025', self.CLEAN)

            _, report = self.run_checker(tmp)

            self.assertEqual([('Base', 'auditado'), ('./Base', 'nombre inválido'), ('Base//', 'nombre inválido')],
                             [(entry['name'], entry['estado']) for entry in report['requeridos']])

    def test_symlinked_plugin_folder_is_audited(self) -> None:
        """El core carga una carpeta de Plugins/ que sea un enlace, así que se audita."""
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(Path(tmp) / 'repos', 'Base', '2025', self.USES_ENV)
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require='Base')
            (plugins / 'Base').symlink_to(Path(tmp) / 'repos' / 'Base', target_is_directory=True)

            _, report = self.run_checker(tmp)

            self.assertEqual('auditado', report['requeridos'][0]['estado'])
            self.assertEqual('Base', report['plugin']['min_version_fijado_por'])

    def test_deep_chain_does_not_hit_the_recursion_limit(self) -> None:
        """Una cadena más larga que el límite de recursión de Python se recorre entera."""
        depth = sys.getrecursionlimit() + 50
        with tempfile.TemporaryDirectory() as tmp:
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require='P0')
            for index in range(depth):
                last = index == depth - 1
                build_installed_plugin(plugins, f'P{index}', '2025', self.USES_ENV if last else self.CLEAN,
                                       require='' if last else f'P{index + 1}')

            code, report = self.run_checker(tmp)

            self.assertEqual(0, code)
            self.assertEqual(depth, len(report['requeridos']))
            self.assertEqual(f'P{depth - 1}', report['plugin']['min_version_fijado_por'])

    def test_text_output_names_who_fixes_each_bound(self) -> None:
        """La salida de texto dice el rango efectivo y quién lo fija."""
        with tempfile.TemporaryDirectory() as tmp:
            core = build_core(Path(tmp))
            plugins = Path(tmp) / 'Plugins'
            build_installed_plugin(plugins, 'Raiz', '2025', self.CLEAN, require='Base,Falta')
            build_installed_plugin(plugins, 'Base', '2025', self.USES_ENV)

            result = subprocess.run(
                (sys.executable, str(SCRIPT_PATH), str(plugins / 'Raiz'), '--core', str(core)),
                capture_output=True, text=True, check=False,
            )

            self.assertEqual(0, result.returncode)
            self.assertIn('min_version efectivo con los requeridos: 2026 (lo fija Base)', result.stdout)
            self.assertIn('(sin auditar: Falta)', result.stdout)
            self.assertIn('Funciona hasta con los requeridos: v2026 (lo fija Raiz)', result.stdout)
            self.assertIn('Plugins requeridos:', result.stdout)


if __name__ == '__main__':
    unittest.main()
