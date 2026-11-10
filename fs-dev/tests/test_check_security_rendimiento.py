"""Pruebas de tiempo y de saltos de línea del auditor de seguridad de plugins."""

from __future__ import annotations

import importlib.util
import sys
import tempfile
import time
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).parents[1] / 'scripts' / 'check-security.py'
SPEC = importlib.util.spec_from_file_location('check_security', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
CHECKER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = CHECKER
SPEC.loader.exec_module(CHECKER)

# Una plantilla con mucho HTML: fuera de <?php ?> todo queda en blanco en la
# versión de solo código, y es ahí donde la búsqueda de una clase se volvía cuadrática.
HTML_BLOCK = '<div class="fila">\n    <p>texto</p>\n</div>\n'


class AuditTestCase(unittest.TestCase):
    """Base con un plugin de prueba en un directorio temporal."""

    def setUp(self) -> None:
        """Prepara un directorio temporal para cada prueba."""
        self.tmp = tempfile.TemporaryDirectory()
        self.plugin = Path(self.tmp.name) / 'MiPlugin'
        self.plugin.mkdir()
        (self.plugin / 'facturascripts.ini').write_text("name = 'MiPlugin'\nversion = 1.0\nmin_version = 2025\n")

    def tearDown(self) -> None:
        """Elimina el directorio temporal."""
        self.tmp.cleanup()

    def audit(self, files: dict[str, bytes]) -> dict:
        """Audita el plugin con los archivos indicados, escritos tal cual."""
        for relative, content in files.items():
            path = self.plugin / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
        return CHECKER.audit(self.plugin)

    @staticmethod
    def titles(report: dict) -> list[str]:
        """Devuelve los títulos de los hallazgos."""
        return [item['titulo'] for item in report['hallazgos']]

    def timed_audit(self, files: dict[str, bytes]) -> tuple[dict, float]:
        """Audita el plugin y devuelve el informe y los segundos que ha tardado."""
        start = time.perf_counter()
        report = self.audit(files)
        return report, time.perf_counter() - start


class PlantillaGrandeTest(AuditTestCase):
    """Una plantilla PHP con mucho HTML no bloquea el análisis."""

    def test_plantilla_de_280_kb_tarda_menos_de_10_segundos(self) -> None:
        """La búsqueda de una clase crecía con el cuadrado del tamaño: más de un minuto."""
        html = HTML_BLOCK * 7000
        content = f'<?php $titulo = "x"; ?>\n{html}<?php exec($orden); ?>\n'.encode()
        report, seconds = self.timed_audit({'View/Plantilla.php': content})
        self.assertLess(seconds, 10, f'tardó {seconds:.1f} s')
        self.assertIn('Ejecuta un comando del sistema', self.titles(report))

    def test_modificadores_en_muchas_lineas_tardan_menos_de_10_segundos(self) -> None:
        """«final readonly» en miles de líneas: el «\\s+» de cada modificador cruzaba los saltos."""
        content = ('<?php\n' + 'final readonly\n' * 20000 + 'exec($o);\n').encode()
        report, seconds = self.timed_audit({'Lib/Modificadores.php': content})
        self.assertLess(seconds, 10, f'tardó {seconds:.1f} s')
        self.assertIn('Ejecuta un comando del sistema', self.titles(report))

    def test_detecta_la_clase_igual_que_antes(self) -> None:
        """Una clase en cualquiera de estas formas no es un script suelto."""
        cases = {
            'tras una línea en blanco': '<?php\n\nclass A\n{\n}\n',
            'con tabuladores': '<?php\n\t\tclass A\n{\n}\n',
            'con espacios y tabuladores': '<?php\n \t final class A {}\n',
            'abstracta': '<?php\nabstract class A {}\n',
            'final readonly': '<?php\nfinal readonly class A {}\n',
            'trait': '<?php\ntrait A {}\n',
            'interfaz': '<?php\ninterface A {}\n',
            'enum': '<?php\nenum A {}\n',
            'tras un atributo': '<?php\n#[Attribute]\nclass A {}\n',
            'tras un comentario': '<?php\n/* x */ class A {}\n',
            'tras HTML': '<div>\n</div>\n<?php\nclass A {}\n',
            'modificador en otra línea': '<?php\nfinal\nreadonly\nclass A {}\n',
            'modificador y línea en blanco': '<?php\nabstract\n\nclass A {}\n',
            'readonly final': '<?php\nreadonly final class A {}\n',
            'tres modificadores': '<?php\nfinal readonly abstract class A {}\n',
        }
        for name, content in cases.items():
            with self.subTest(name):
                source = CHECKER.Source(path=Path('Lib/A.php'), relative='Lib/A.php', language='php',
                                        raw=content, text=content, code=CHECKER.strip_php(content)[1])
                self.assertFalse(CHECKER.is_standalone_script(source))

    def test_un_script_sin_clase_sigue_siendo_suelto(self) -> None:
        """Control: sin clase, o con «class» fuera de principio de línea, es un script suelto."""
        for content in ('<?php\necho 1;\n', '<?php\n$a = new class {};\n', '<?php\n$x = "class A";\n'):
            with self.subTest(content):
                source = CHECKER.Source(path=Path('x.php'), relative='x.php', language='php',
                                        raw=content, text=content, code=CHECKER.strip_php(content)[1])
                self.assertTrue(CHECKER.is_standalone_script(source))


class VariablesTest(AuditTestCase):
    """Un archivo con miles de usos de variables no busca sus asignaciones desde el principio cada vez."""

    CASES = {
        'comando en variable': '$c = "ls"; exec($c);\n',
        'url en variable': '$u = "https://ejemplo.test/x"; file_get_contents($u);\n',
        'función en variable': '$f = "strlen"; $f($x);\n',
        'curlopt_url': '$u = "https://ejemplo.test/x"; curl_setopt($h, CURLOPT_URL, $u);\n',
    }

    def test_10000_usos_tardan_menos_de_10_segundos(self) -> None:
        """Recorrer el archivo desde el principio por cada uso crecía con el cuadrado: decenas de segundos."""
        for name, line in self.CASES.items():
            with self.subTest(name):
                # Un plugin por caso, para que cada uno mida sólo su archivo
                self.tmp.cleanup()
                self.setUp()
                body = line * 10000
                report, seconds = self.timed_audit({f'Lib/{name.replace(" ", "_")}.php': f'<?php\nclass A\n{{\nfunction f() {{\n{body}}}\n}}\n'.encode()})
                self.assertLess(seconds, 10, f'tardó {seconds:.1f} s')
                self.assertTrue(report['hallazgos'])

    def notes(self, content: str, title: str) -> list[list[str]]:
        """Devuelve las notas de los hallazgos con ese título."""
        return [item['notas'] for item in self.audit({'Lib/A.php': content.encode()})['hallazgos']
                if item['titulo'] == title]

    def test_usa_las_tres_ultimas_asignaciones_anteriores(self) -> None:
        """El valor de la variable son sus tres últimas asignaciones antes del uso, no las de después."""
        content = ('<?php\nclass A\n{\nfunction f() {\n$f = "a"; $f = "b"; $f = "c";\n'
                   '$f = "d"; $f($x);\n$f = "system"; $f($y);\n$f = "exec";\n}\n}\n')
        self.assertEqual(self.notes(content, 'Llama a una función cuyo nombre está en una variable'),
                         [['$f = "b" "c" "d"'], ['$f = "c" "d" "system"']])

    def test_destino_de_la_ultima_url_anterior(self) -> None:
        """El destino es la última URL asignada antes de la llamada, saltando las ignoradas."""
        content = ('<?php\nclass A\n{\nfunction f() {\n'
                   '$u = "https://uno.test/x";\n$u = "http://localhost/x";\nfile_get_contents($u);\n'
                   '$u = "https://dos.test/x";\nfile_get_contents($u);\n}\n}\n')
        notes = [note for found in self.audit({'Lib/A.php': content.encode()})['hallazgos']
                 for note in found['notas'] if note.startswith('destino:')]
        self.assertEqual(notes, ['destino: uno.test (asignado a $u)', 'destino: dos.test (asignado a $u)'])


class RetornoDeCarroTest(AuditTestCase):
    """Un archivo de extensión desconocida con PHP trata «\\r» como salto, igual que PHP."""

    HEREDOC = b'<?php\n$v = <<<A\r" \nA;\ninclude $y;\nsystem($z);\n$w = "x";\n'

    def test_heredoc_cerrado_tras_retorno_de_carro(self) -> None:
        """Con «\\r» tras la etiqueta del heredoc, lo que sigue al cierre se analiza."""
        titles = self.titles(self.audit({'X.txt2': self.HEREDOC}))
        self.assertIn('Ejecuta un comando del sistema', titles)

    def test_igual_que_con_extension_php(self) -> None:
        """Control: el mismo contenido en un .php ya daba esos hallazgos."""
        txt = self.audit({'X.txt2': self.HEREDOC})['hallazgos']
        self.tmp.cleanup()
        self.setUp()
        php = self.audit({'X.php': self.HEREDOC})['hallazgos']
        self.assertEqual([(item['titulo'], item['linea']) for item in txt],
                         [(item['titulo'], item['linea']) for item in php])

    def test_lineas_con_retorno_de_carro(self) -> None:
        """Las líneas se cuentan como en un .php, con «\\r\\n» o con «\\r» solo."""
        for newline in (b'\r\n', b'\r'):
            with self.subTest(newline):
                content = newline.join([b'<?php', b'$a = 1;', b'system($z);', b''])
                lines = [item['linea'] for item in self.audit({'X.txt2': content})['hallazgos']
                         if item['titulo'] == 'Ejecuta un comando del sistema']
                self.assertEqual(lines, [3])


class MuchosHallazgosTest(AuditTestCase):
    """Un archivo con miles de hallazgos no tarda en describir su contexto."""

    def test_20000_hallazgos_tardan_menos_de_10_segundos(self) -> None:
        """Buscar las funciones anteriores en cada hallazgo crecía con el cuadrado: más de un minuto."""
        body = ''.join(f'    public function f{n}() {{ exec("ls"); }}\n' for n in range(20000))
        content = f'<?php\nclass Init\n{{\n{body}}}\n'.encode()
        report, seconds = self.timed_audit({'Lib/Muchos.php': content})
        self.assertLess(seconds, 10, f'tardó {seconds:.1f} s')
        self.assertEqual(self.titles(report).count('Ejecuta un comando del sistema'), 20000)

    def test_el_contexto_usa_la_funcion_que_contiene_el_hallazgo(self) -> None:
        """Init::update y Init::init se distinguen aunque haya muchas funciones antes."""
        body = ''.join(f'    public function f{n}() {{}}\n' for n in range(50))
        content = (f'<?php\nclass Init\n{{\n{body}'
                   '    public function update() { exec($a); }\n'
                   '    public function init() { exec($b); }\n}\n').encode()
        contexts = [item['contexto'] for item in self.audit({'Init.php': content})['hallazgos']
                    if item['titulo'] == 'Ejecuta un comando del sistema']
        self.assertEqual(contexts, ['Init::update(), al instalar o actualizar el plugin',
                                    'Init::init(), en cada petición a FacturaScripts'])


if __name__ == '__main__':
    unittest.main()
