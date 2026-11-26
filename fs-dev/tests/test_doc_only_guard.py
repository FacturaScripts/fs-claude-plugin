"""Pruebas de la protección «solo documentación» de fs-dev:context-writer."""

from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import shutil
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).parents[1] / 'scripts' / 'doc-only-guard.py'
SPEC = importlib.util.spec_from_file_location('doc_only_guard', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
GUARD = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = GUARD
SPEC.loader.exec_module(GUARD)

PHP = shutil.which('php')

# Clase de partida, sin documentar.
ORIGINAL = """<?php
/**
 * Copyright (C) 2024 Autor
 */
namespace FacturaScripts\\Plugins\\Demo\\Model;

class Envio
{
    public $estado;

    public function enviar(int $intentos): bool
    {
        $url = 'https://example.com/#ancla'; // la cadena lleva una almohadilla
        return $intentos > 0;
    }
}
"""

# La misma clase con docblocks y comentarios añadidos: el código no cambia.
DOCUMENTED = """<?php
/**
 * Copyright (C) 2024 Autor
 */
namespace FacturaScripts\\Plugins\\Demo\\Model;

/**
 * Envío de una factura al organismo.
 */
class Envio
{
    /**
     * Estado del envío.
     *
     * @var string
     */
    public $estado;

    /**
     * Envía la factura.
     *
     * @param int $intentos Número de intentos que quedan.
     *
     * @return bool
     */
    public function enviar(int $intentos): bool
    {
        $url = 'https://example.com/#ancla'; // la cadena lleva una almohadilla
        # comentario de estilo shell
        return $intentos > 0;
    }
}
"""


def git(cwd: Path, *args: str) -> None:
    """Ejecuta git en la carpeta indicada y falla si git devuelve error."""
    subprocess.run(['git', '-C', str(cwd), *args], check=True, capture_output=True)


def make_repo(root: Path) -> Path:
    """Crea un plugin con un commit inicial y devuelve su carpeta."""
    plugin = root / 'Demo'
    (plugin / 'Model').mkdir(parents=True)
    (plugin / 'facturascripts.ini').write_text("name = 'Demo'\n", encoding='utf-8')
    (plugin / 'Model' / 'Envio.php').write_text(ORIGINAL, encoding='utf-8')
    (plugin / 'Init.php').write_text('<?php\n', encoding='utf-8')
    git(plugin, 'init', '-q')
    git(plugin, 'add', '.')
    git(plugin, '-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-q', '-m', 'inicio')
    return plugin


def run_main(*args: str) -> tuple[int, str]:
    """Ejecuta el script en el mismo proceso y devuelve el código de salida y la salida estándar."""
    output = io.StringIO()
    with contextlib.redirect_stdout(output), contextlib.redirect_stderr(io.StringIO()):
        code = GUARD.main(list(args))
    return code, output.getvalue()


class StripCommentsTest(unittest.TestCase):
    """Tokenizador propio, usado cuando no hay PHP."""

    def test_quita_comentarios_y_respeta_cadenas_y_atributos(self) -> None:
        """Las almohadillas y barras dentro de cadenas y los atributos se conservan."""
        source = "<?php\n#[Attr]\n$a = '#no' . \"//no\"; // si\n/* si */ # si\n$b = 1;"
        self.assertEqual("<?php#[Attr]$a='#no'.\"//no\";$b=1;", GUARD.strip_php_comments(source))

    def test_documentar_no_cambia_la_firma(self) -> None:
        """Añadir docblocks y comentarios deja la misma firma de código."""
        self.assertEqual(GUARD.strip_php_comments(ORIGINAL), GUARD.strip_php_comments(DOCUMENTED))


class GuardTest(unittest.TestCase):
    """Subcomandos start, check, stop y status sobre un repositorio real."""

    def setUp(self) -> None:
        """Crea un plugin con git en una carpeta temporal."""
        self.directory = tempfile.TemporaryDirectory()
        self.plugin = make_repo(Path(self.directory.name))
        self.envio = self.plugin / 'Model' / 'Envio.php'

    def tearDown(self) -> None:
        """Borra la carpeta temporal."""
        self.directory.cleanup()

    def check(self, php: str | None = None) -> 'GUARD.Result':
        """Comprueba el plugin con el tokenizador indicado."""
        project = GUARD.load_project(self.plugin)
        assert project is not None
        return GUARD.check(project, php)

    def test_start_guarda_el_marcador_fuera_del_arbol(self) -> None:
        """El marcador va en .git y status lo detecta; stop lo borra."""
        code, _ = run_main('start', str(self.plugin))
        self.assertEqual(0, code)
        marker = self.plugin / '.git' / GUARD.MARKER_NAME
        self.assertTrue(marker.is_file())
        self.assertEqual(str(self.plugin.resolve()), json.loads(marker.read_text(encoding='utf-8'))['root'])
        self.assertIn('activo', run_main('status', str(self.plugin))[1])
        run_main('stop', str(self.plugin))
        self.assertFalse(marker.exists())

    def test_solo_docblocks_y_documentacion_pasa(self) -> None:
        """Docblocks en un PHP y archivos de Doc/ no son infracciones."""
        run_main('start', str(self.plugin))
        self.envio.write_text(DOCUMENTED, encoding='utf-8')
        (self.plugin / 'Doc' / 'Context').mkdir(parents=True)
        (self.plugin / 'Doc' / 'Context' / '01-arquitectura.md').write_text('# Arquitectura\n', encoding='utf-8')
        (self.plugin / 'AGENTS.md').write_text('Plugin Demo.\n', encoding='utf-8')
        result = self.check()
        self.assertEqual([], result.violations)
        self.assertEqual(['Model/Envio.php'], result.documented)
        self.assertIn('Doc/Context/01-arquitectura.md', result.docs)
        self.assertEqual(0, run_main('check', str(self.plugin))[0])

    def test_cambiar_codigo_es_infraccion(self) -> None:
        """Cambiar una instrucción o reordenar métodos se detecta."""
        run_main('start', str(self.plugin))
        self.envio.write_text(DOCUMENTED.replace('$intentos > 0', '$intentos >= 0'), encoding='utf-8')
        result = self.check()
        self.assertEqual(['Model/Envio.php'], [item['path'] for item in result.violations])
        code, output = run_main('check', str(self.plugin))
        self.assertEqual(1, code)
        self.assertIn('ha cambiado el código', output)

    def test_archivos_nuevos_borrados_y_otros_tipos_son_infraccion(self) -> None:
        """Crear un PHP, borrar otro o tocar un archivo que no es documentación se detecta."""
        run_main('start', str(self.plugin))
        (self.plugin / 'Model' / 'Nuevo.php').write_text('<?php\n', encoding='utf-8')
        (self.plugin / 'Init.php').unlink()
        (self.plugin / 'facturascripts.ini').write_text("name = 'Otro'\n", encoding='utf-8')
        paths = sorted(item['path'] for item in self.check().violations)
        self.assertEqual(['Init.php', 'Model/Nuevo.php', 'facturascripts.ini'], paths)

    def test_archivos_con_cambios_previos_no_se_tocan(self) -> None:
        """Un archivo que ya tenía cambios al empezar solo es infracción si se vuelve a modificar."""
        (self.plugin / 'Init.php').write_text('<?php\n// cambio de otra persona\n', encoding='utf-8')
        code, output = run_main('start', str(self.plugin))
        self.assertIn('Init.php', output)
        self.assertEqual([], self.check().violations)
        (self.plugin / 'Init.php').write_text('<?php\n// cambio de otra persona\n/** doc */\n', encoding='utf-8')
        self.assertEqual(['Init.php'], [item['path'] for item in self.check().violations])

    def test_start_conserva_el_punto_de_partida(self) -> None:
        """Un segundo start no sustituye el marcador vigente."""
        run_main('start', str(self.plugin))
        marker = self.plugin / '.git' / GUARD.MARKER_NAME
        first = marker.read_text(encoding='utf-8')
        self.envio.write_text(DOCUMENTED, encoding='utf-8')
        run_main('start', str(self.plugin))
        self.assertEqual(first, marker.read_text(encoding='utf-8'))
        self.assertEqual([], self.check().violations)

    def test_marcador_caducado_no_esta_activo(self) -> None:
        """Un marcador de hace más de 12 horas no cuenta."""
        old = {'root': str(self.plugin), 'started': time.time() - GUARD.MARKER_MAX_AGE - 1}
        self.assertFalse(GUARD.marker_is_active(old))
        self.assertTrue(GUARD.marker_is_active({'root': str(self.plugin), 'started': time.time()}))
        self.assertFalse(GUARD.marker_is_active(None))

    @unittest.skipIf(PHP is None, 'no hay php en el PATH')
    def test_tokenizador_de_php(self) -> None:
        """Con PHP, los docblocks pasan y un cambio de código se detecta."""
        self.envio.write_text(DOCUMENTED, encoding='utf-8')
        self.assertEqual([], self.check(PHP).violations)
        self.envio.write_text(DOCUMENTED.replace('return', 'return !'), encoding='utf-8')
        self.assertEqual(1, len(self.check(PHP).violations))

    def test_falla_fuera_de_un_repositorio(self) -> None:
        """Sin git o fuera de un plugin devuelve 2."""
        with tempfile.TemporaryDirectory() as directory:
            plugin = Path(directory) / 'SinGit'
            plugin.mkdir()
            (plugin / 'facturascripts.ini').write_text("name = 'SinGit'\n", encoding='utf-8')
            self.assertEqual(2, run_main('check', str(plugin))[0])
            self.assertEqual(2, run_main('check', directory)[0])


if __name__ == '__main__':
    unittest.main()
