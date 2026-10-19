"""Pruebas de la actualización del año de copyright."""

from __future__ import annotations

import importlib.util
import os
import subprocess
import sys
import tempfile
import unittest
import unittest.mock
from pathlib import Path


SCRIPT_PATH = Path(__file__).parents[1] / 'scripts' / 'update-copyright.py'
SPEC = importlib.util.spec_from_file_location('update_copyright', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
COPYRIGHT = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = COPYRIGHT
SPEC.loader.exec_module(COPYRIGHT)

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


def header(line: str) -> str:
    """Construye una cabecera PHP de FacturaScripts con la línea de copyright indicada.

    Args:
        line: Texto que sigue a «Copyright (C)».

    Returns:
        Contenido PHP con la cabecera, una segunda línea de copyright y una cadena.
    """
    return (f'<?php\n/**\n * This file is part of FacturaScripts\n * Copyright (C){line}\n'
            ' * Copyright (C) 2015 Otro Autor\n */\n'
            "namespace FacturaScripts\\Plugins\\Demo;\n$texto = 'Copyright (C) 2020 Foo';\n")


def first_line(content: str) -> str:
    """Devuelve la primera línea de copyright de un contenido.

    Args:
        content: Texto en el que se busca.

    Returns:
        La línea completa, sin espacios iniciales.
    """
    return next(line for line in content.splitlines() if 'Copyright' in line).strip()


class UpdateYearTest(unittest.TestCase):
    """Comprueba las reglas de actualización de años."""

    CASES = [
        (' 2017-2025 Carlos', '* Copyright (C) 2017-2026 Carlos'),
        (' 2023-2024, Carlos', '* Copyright (C) 2023-2026, Carlos'),
        (' 2023, Carlos', '* Copyright (C) 2023-2026, Carlos'),
        (' 2023 - 2024 Carlos', '* Copyright (C) 2023-2026 Carlos'),
        (' 2023-2024', '* Copyright (C) 2023-2026'),
        (' 2023', '* Copyright (C) 2023-2026'),
        (' 2019, 2021 Carlos', '* Copyright (C) 2019, 2021-2026 Carlos'),
        (' Carlos', '* Copyright (C) 2026 Carlos'),
        ('', '* Copyright (C) 2026'),
        (' 2026 Carlos', '* Copyright (C) 2026 Carlos'),
        (' 2020-2026 Carlos', '* Copyright (C) 2020-2026 Carlos'),
        (' 2027 Carlos', '* Copyright (C) 2027 Carlos'),
        (' 2020-2027 Carlos', '* Copyright (C) 2020-2027 Carlos'),
    ]

    def test_cases_and_idempotence(self) -> None:
        """Cada formato produce el resultado esperado y una segunda pasada no cambia nada."""
        for line, expected in self.CASES:
            with self.subTest(line=line):
                once = COPYRIGHT.update_copyright_year(header(line), 2026)
                self.assertEqual(expected, first_line(once))
                self.assertEqual(once, COPYRIGHT.update_copyright_year(once, 2026))

    def test_only_first_header_line_changes(self) -> None:
        """Otros autores y las cadenas del código se conservan intactos."""
        updated = COPYRIGHT.update_copyright_year(header(' 2020 Carlos'), 2026)

        self.assertIn(' * Copyright (C) 2015 Otro Autor\n', updated)
        self.assertIn("'Copyright (C) 2020 Foo'", updated)

    def test_copyright_outside_first_comment_is_ignored(self) -> None:
        """Una mención fuera del primer bloque de comentario no es la cabecera."""
        content = "<?php\n/** Clase de ejemplo */\n$x = 'Copyright (C) 2020 Foo';\n"
        self.assertEqual(content, COPYRIGHT.update_copyright_year(content, 2026))

    def test_new_file_uses_only_current_year(self) -> None:
        """En modo archivo nuevo los años se sustituyen por el actual."""
        for line in (' 2013-2025 Carlos', ' 2019, 2021 Carlos', ' Carlos'):
            with self.subTest(line=line):
                updated = COPYRIGHT.update_copyright_year(header(line), 2026, is_new_file=True)
                self.assertEqual('* Copyright (C) 2026 Carlos', first_line(updated))

    def test_xml_and_twig_headers(self) -> None:
        """Las cabeceras XML y Twig también se reconocen."""
        xml = '<?xml version="1.0"?>\n<!--\n * Copyright (C) 2020 X\n-->\n<view/>\n'
        twig = '{#\n * Copyright (C) 2020 X\n #}\n{{ algo }}\n'
        self.assertIn('2020-2026 X', COPYRIGHT.update_copyright_year(xml, 2026))
        self.assertIn('2020-2026 X', COPYRIGHT.update_copyright_year(twig, 2026))


class CliTest(unittest.TestCase):
    """Comprueba la ejecución del script sobre archivos reales."""

    def run_script(self, path: Path, *extra: str) -> subprocess.CompletedProcess:
        """Ejecuta el script sobre un archivo con el año 2026.

        Args:
            path: Archivo que se procesa.
            *extra: Argumentos adicionales, como ``--new``.

        Returns:
            Resultado del proceso.
        """
        return subprocess.run(
            [sys.executable, str(SCRIPT_PATH), str(path), '2026', *extra],
            capture_output=True, text=True, check=False,
        )

    def test_preserves_crlf_line_endings(self) -> None:
        """Los finales de línea CRLF se conservan byte a byte."""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'A.php'
            original = header(' 2020 Carlos').replace('\n', '\r\n').encode('utf-8')
            path.write_bytes(original)

            result = self.run_script(path)

            self.assertEqual(0, result.returncode)
            self.assertEqual(original.replace(b'2020 Carlos', b'2020-2026 Carlos'), path.read_bytes())

    def test_non_utf8_file_is_not_touched(self) -> None:
        """Un archivo Latin-1 no se modifica y se avisa por stderr."""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'A.php'
            original = header(' 2020 Niño').encode('latin-1')
            path.write_bytes(original)

            result = self.run_script(path)

            self.assertEqual(0, result.returncode)
            self.assertEqual(original, path.read_bytes())
            self.assertIn('UTF-8', result.stderr)

    def test_file_outside_facturascripts_is_ignored(self) -> None:
        """Un archivo sin namespace FacturaScripts fuera de un plugin no se toca."""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'A.php'
            original = header(' 2020 Carlos').replace('FacturaScripts\\Plugins\\Demo', 'App')
            path.write_text(original, encoding='utf-8')

            self.run_script(path)

            self.assertEqual(original, path.read_text(encoding='utf-8'))

    def test_invalid_arguments(self) -> None:
        """Un año no numérico o un archivo inexistente devuelven 1."""
        with tempfile.TemporaryDirectory() as directory:
            missing = subprocess.run([sys.executable, str(SCRIPT_PATH), str(Path(directory) / 'x.php'), '2026'],
                                     capture_output=True, text=True, check=False)
            bad_year = subprocess.run([sys.executable, str(SCRIPT_PATH), 'x.php', 'año'],
                                      capture_output=True, text=True, check=False)

        self.assertEqual(1, missing.returncode)
        self.assertEqual(1, bad_year.returncode)


if __name__ == '__main__':
    unittest.main()
