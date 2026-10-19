"""Pruebas de la ordenación de miembros de clases PHP de FacturaScripts."""

from __future__ import annotations

import importlib.util
import os
import subprocess
import sys
import tempfile
import unittest
import unittest.mock
from pathlib import Path


SCRIPT_PATH = Path(__file__).parents[1] / 'scripts' / 'sort-class-members.py'
SPEC = importlib.util.spec_from_file_location('sort_class_members', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
SORTER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = SORTER
SPEC.loader.exec_module(SORTER)

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


def php(body: str, declaration: str = 'class Demo') -> str:
    """Envuelve un cuerpo de clase en un archivo PHP de FacturaScripts.

    Args:
        body: Contenido entre las llaves de la clase, sin la última línea en blanco.
        declaration: Declaración de la clase.

    Returns:
        El archivo PHP completo.
    """
    return f'<?php\nnamespace FacturaScripts\\Plugins\\Demo;\n\n{declaration}\n{{\n{body}\n}}\n'


def sort(content: str) -> str:
    """Ordena el contenido y comprueba que una segunda pasada no cambia nada.

    Args:
        content: Archivo PHP.

    Returns:
        El contenido ordenado, o el original si no había nada que cambiar.
    """
    result = SORTER.sort_content(content)
    sorted_content = content if result is None else result
    assert SORTER.sort_content(sorted_content) is None, 'la ordenación no es idempotente'
    return sorted_content


class OrderTest(unittest.TestCase):
    """Comprueba el orden de los grupos y de los miembros de cada grupo."""

    def test_full_group_order(self) -> None:
        """Traits, constantes, propiedades y métodos quedan en el orden de FacturaScripts."""
        body = '\n\n'.join([
            '    private function privado() {}',
            '    public function zeta() {}',
            '    abstract protected function abstracto(): void;',
            '    public static function crear(): static { return new static(); }',
            '    protected $protegida;',
            '    public $publica;',
            '    var $antigua;',
            '    final public const ZETA = 1;',
            "    const string BETA = 'b';",
            '    use TraitB, TraitA {\n        TraitA::hola insteadof TraitB;\n    }',
            '    use TraitC;',
        ])
        result = sort(php(body, 'abstract class Demo'))

        order = ['use TraitB', 'use TraitC', 'const string BETA', 'final public const ZETA', 'var $antigua',
                 'public $publica', 'protected $protegida', 'abstract protected function abstracto',
                 'public static function crear', 'public function zeta', 'private function privado']
        positions = [result.index(item) for item in order]
        self.assertEqual(sorted(positions), positions)
        self.assertIn('    use TraitB, TraitA {\n        TraitA::hola insteadof TraitB;\n    }\n    use TraitC;',
                      result)

    def test_docblocks_attributes_and_closures_move_with_their_member(self) -> None:
        """Docblocks, atributos y closures de Extension viajan con su método."""
        body = (
            '    #[\\Override]\n'
            '    public function save(): Closure\n    {\n        return function () {\n'
            '            $texto = "llave } en cadena";\n            return true;\n        };\n    }\n\n'
            '    /**\n     * Limpia el modelo.\n     */\n'
            '    public function clear(): Closure\n    {\n        return function (string $a = \'}\') {\n'
            '            // comentario con { llave\n        };\n    }'
        )
        result = sort(php(body))

        self.assertLess(result.index('Limpia el modelo'), result.index('function clear'))
        self.assertLess(result.index('function clear'), result.index('#[\\Override]'))
        self.assertLess(result.index('#[\\Override]'), result.index('function save'))


class CommentTest(unittest.TestCase):
    """Comprueba que los comentarios no se pierden ni rompen el análisis."""

    def test_trailing_comments_are_kept_at_the_end(self) -> None:
        """Los comentarios tras el último miembro siguen al final de la clase."""
        body = '    public function b() {}\n\n    public function a() {}\n\n    // public function antigua() {}'
        result = sort(php(body))

        self.assertIn('// public function antigua() {}\n}', result)
        self.assertLess(result.index('function a'), result.index('function b'))

    def test_inline_comment_stays_with_its_member(self) -> None:
        """El comentario al final de una línea se mueve con el miembro de esa línea."""
        result = sort(php('    public $z; // comentario de z\n    public $a;'))

        self.assertIn('    public $z; // comentario de z\n', result)
        self.assertLess(result.index('public $a'), result.index('public $z'))

    def test_hash_comments_with_quotes(self) -> None:
        """Un comentario # con apóstrofos no se interpreta como cadena."""
        body = ("    public function zeta()\n    {\n        # it's\n        return 1;\n    }\n\n"
                "    public function beta()\n    {\n        # don't\n        return 2;\n    }\n\n"
                "    public function alfa()\n    {\n        return 3;\n    }")
        result = sort(php(body))

        self.assertLess(result.index('function alfa'), result.index('function beta'))
        self.assertLess(result.index('function beta'), result.index('function zeta'))

    def test_class_keyword_inside_docblock_is_ignored(self) -> None:
        """Un docblock que menciona «class Foo {» no se confunde con la declaración."""
        content = ('<?php\nnamespace FacturaScripts\\Plugins\\Demo;\n\n'
                   '/**\n * Ejemplo: usa la class Foo como {@see Bar}\n */\n'
                   'class Demo\n{\n    public function z() {}\n\n    public function a() {}\n}\n')
        result = sort(content)

        self.assertIn(' * Ejemplo: usa la class Foo como {@see Bar}\n', result)
        self.assertLess(result.index('function a'), result.index('function z'))


class SafetyTest(unittest.TestCase):
    """Comprueba los casos en los que no se debe reordenar."""

    def test_unknown_member_prevents_sorting(self) -> None:
        """Si hay un miembro no reconocido la clase se deja como está."""
        content = php('    public function z() {}\n\n    public private(set) string $x;\n\n    public function a() {}')
        self.assertIsNone(SORTER.sort_content(content))

    def test_anonymous_class_and_enum_are_not_sorted(self) -> None:
        """Las clases anónimas de nivel superior y los enum no se tocan."""
        anonymous = ('<?php\nnamespace FacturaScripts\\Test\\Plugins;\n\n'
                     'return new class extends Base {\n    public function zeta() {}\n'
                     '    public function alfa() {}\n};\n')
        enum = ('<?php\nnamespace FacturaScripts\\Plugins\\Demo;\n\nenum Estado: string\n{\n'
                "    case Z = 'z';\n    case A = 'a';\n}\n")
        self.assertIsNone(SORTER.sort_content(anonymous))
        self.assertIsNone(SORTER.sort_content(enum))

    def test_heredoc_with_quoted_label_and_flexible_closing(self) -> None:
        """Un heredoc <<<"SQL" con cierre sangrado y seguido de argumentos no rompe el análisis."""
        body = ('    public function zeta()\n    {\n        return sprintf(<<<"SQL"\n'
                '            SELECT \'{\' FROM t WHERE a = "b"\n            SQL, 1);\n    }\n\n'
                '    public function alfa()\n    {\n        return 2;\n    }')
        result = sort(php(body))

        self.assertLess(result.index('function alfa'), result.index('function zeta'))
        self.assertIn('            SQL, 1);', result)

    def test_not_facturascripts_namespace(self) -> None:
        """Sin namespace FacturaScripts no se ordena nada."""
        content = php('    public function z() {}\n\n    public function a() {}').replace(
            'FacturaScripts\\Plugins\\Demo', 'App\\Models')
        self.assertIsNone(SORTER.sort_content(content))

    def test_lost_characters_abort_the_write(self) -> None:
        """Si la reconstrucción perdiera caracteres se aborta sin devolver contenido."""
        content = php('    public function z() {}\n\n    public function a() {}')
        with unittest.mock.patch.object(SORTER, 'reconstruct_body', return_value='\n'):
            with self.assertRaises(ValueError):
                SORTER.sort_content(content)


class FileTest(unittest.TestCase):
    """Comprueba la lectura y escritura del archivo real."""

    def run_script(self, path: Path) -> subprocess.CompletedProcess:
        """Ejecuta el script sobre un archivo.

        Args:
            path: Archivo PHP.

        Returns:
            Resultado del proceso.
        """
        return subprocess.run([sys.executable, str(SCRIPT_PATH), str(path)],
                              capture_output=True, text=True, check=False)

    def test_preserves_crlf_line_endings(self) -> None:
        """Un archivo CRLF se ordena sin convertir ninguna línea a LF."""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'Demo.php'
            path.write_bytes(php('    public $b;\n    public $a;').replace('\n', '\r\n').encode('utf-8'))

            result = self.run_script(path)
            data = path.read_bytes()

        self.assertEqual(0, result.returncode)
        self.assertNotIn(b'\n', data.replace(b'\r\n', b''))
        self.assertLess(data.index(b'public $a'), data.index(b'public $b'))

    def test_non_utf8_file_is_not_touched(self) -> None:
        """Un archivo Latin-1 no se modifica y se avisa por stderr."""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'Demo.php'
            original = php("    public $b = 'niño';\n    public $a;").encode('latin-1')
            path.write_bytes(original)

            result = self.run_script(path)

            self.assertEqual(0, result.returncode)
            self.assertEqual(original, path.read_bytes())
            self.assertIn('UTF-8', result.stderr)

    def test_disabled_in_settings(self) -> None:
        """Con sortClassMembers desactivado el archivo no cambia."""
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory) / 'home'
            home.mkdir()
            (home / '.fs-claude.json').write_text('{"settings": {"sortClassMembers": false}}', encoding='utf-8')
            path = Path(directory) / 'Demo.php'
            original = php('    public $b;\n    public $a;')
            path.write_text(original, encoding='utf-8')

            with unittest.mock.patch.dict(os.environ, {'HOME': str(home)}):
                self.run_script(path)

            self.assertEqual(original, path.read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
