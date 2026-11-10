"""Pruebas de los scripts de detección de FacturaScripts usados en SessionStart."""

from __future__ import annotations

import json
import subprocess
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).parents[2]
SCRIPTS = {
    'fs-dev': REPO_ROOT / 'fs-dev' / 'scripts' / 'detect-facturascripts.sh',
    'fs-user': REPO_ROOT / 'fs-user' / 'scripts' / 'detect-facturascripts.sh',
}
CABECERA = '=== CONTEXTO: Proyecto FacturaScripts detectado ==='


def ejecutar(script: Path, cwd: Path) -> subprocess.CompletedProcess[str]:
    """Ejecuta un script de detección en el directorio indicado, como lo haría el hook.

    Args:
        script: Ruta del script de detección.
        cwd: Directorio de trabajo simulado de la sesión.

    Returns:
        Resultado del proceso con stdout y stderr como texto.
    """
    entrada = json.dumps({'hook_event_name': 'SessionStart', 'cwd': str(cwd)})
    return subprocess.run(
        ['bash', str(script)],
        cwd=cwd,
        input=entrada,
        capture_output=True,
        text=True,
        timeout=10,
        check=False,
    )


class DetectFacturaScriptsTest(unittest.TestCase):
    """Comprueba la detección en ambos plugins y el contexto que inyectan."""

    def setUp(self) -> None:
        """Crea un directorio temporal aislado para cada prueba."""
        self.tmp = tempfile.TemporaryDirectory()
        self.base = Path(self.tmp.name).resolve()

    def tearDown(self) -> None:
        """Elimina el directorio temporal."""
        self.tmp.cleanup()

    def crear_por_composer(self) -> Path:
        """Crea una raíz reconocible por el nombre de su composer.json.

        Returns:
            Ruta de la raíz simulada.
        """
        raiz = self.base / 'fs-composer'
        raiz.mkdir()
        (raiz / 'composer.json').write_text(
            '{\n    "name": "facturascripts/facturascripts",\n    "type": "project"\n}\n',
            encoding='utf-8',
        )
        return raiz

    def crear_por_estructura(self) -> Path:
        """Crea una raíz reconocible por sus directorios Core, Plugins y Dinamic.

        Returns:
            Ruta de la raíz simulada.
        """
        raiz = self.base / 'fs-estructura'
        for nombre in ('Core', 'Plugins', 'Dinamic'):
            (raiz / nombre).mkdir(parents=True)
        return raiz

    def test_detecta_raiz_por_composer(self) -> None:
        """La raíz con composer.json del core debe detectarse en ambos plugins."""
        raiz = self.crear_por_composer()
        for plugin, script in SCRIPTS.items():
            with self.subTest(plugin=plugin):
                resultado = ejecutar(script, raiz)
                self.assertEqual(0, resultado.returncode)
                self.assertIn(CABECERA, resultado.stdout)

    def test_detecta_desde_plugin_dentro_de_instalacion(self) -> None:
        """Un plugin bajo Plugins/ debe detectarse subiendo por el árbol."""
        raiz = self.crear_por_estructura()
        plugin_dir = raiz / 'Plugins' / 'MiPlugin' / 'Model'
        plugin_dir.mkdir(parents=True)
        for plugin, script in SCRIPTS.items():
            with self.subTest(plugin=plugin):
                resultado = ejecutar(script, plugin_dir)
                self.assertEqual(0, resultado.returncode)
                self.assertIn(CABECERA, resultado.stdout)

    def test_estructura_incompleta_no_se_detecta(self) -> None:
        """Sin Dinamic ni composer.json del core no debe detectarse la instalación."""
        raiz = self.base / 'incompleta'
        (raiz / 'Core').mkdir(parents=True)
        (raiz / 'Plugins').mkdir()
        for plugin, script in SCRIPTS.items():
            with self.subTest(plugin=plugin):
                resultado = ejecutar(script, raiz)
                self.assertEqual(0, resultado.returncode)
                self.assertEqual('', resultado.stdout)

    def test_composer_de_otro_proyecto_no_se_detecta(self) -> None:
        """Un composer.json con otro nombre no debe confundirse con el core."""
        raiz = self.base / 'otro'
        raiz.mkdir()
        (raiz / 'composer.json').write_text('{"name": "acme/facturas"}\n', encoding='utf-8')
        for plugin, script in SCRIPTS.items():
            with self.subTest(plugin=plugin):
                resultado = ejecutar(script, raiz)
                self.assertEqual(0, resultado.returncode)
                self.assertEqual('', resultado.stdout)

    def test_mensajes_no_compiten_entre_plugins(self) -> None:
        """Cada plugin debe reservar su ámbito y fs-user no debe imponer reglas absolutas."""
        raiz = self.crear_por_composer()
        salida_user = ejecutar(SCRIPTS['fs-user'], raiz).stdout
        salida_dev = ejecutar(SCRIPTS['fs-dev'], raiz).stdout

        self.assertIn('uso del ERP', salida_user)
        self.assertIn('fs-dev', salida_user)
        self.assertNotIn('SIEMPRE', salida_user)
        self.assertIn('programación', salida_dev)
        self.assertIn('Translation/es_ES.json', salida_dev)

    def test_fs_dev_explica_el_arbol_de_documentacion(self) -> None:
        """fs-dev debe recordar que el core y cada plugin pueden tener AGENTS.md y Doc/."""
        raiz = self.crear_por_composer()
        salida = ejecutar(SCRIPTS['fs-dev'], raiz).stdout

        self.assertIn('DOCUMENTACIÓN', salida)
        self.assertIn('Doc/Context/README.md', salida)
        self.assertIn('fs-dev:crear-documentacion', salida)
        self.assertNotIn('Documentación existente', salida)

    def test_fs_dev_lista_la_documentacion_del_plugin_y_del_core(self) -> None:
        """Desde un plugin, fs-dev debe dar las rutas de su documentación y de la del core."""
        raiz = self.crear_por_estructura()
        (raiz / 'AGENTS.md').write_text('Core\n', encoding='utf-8')
        plugin = raiz / 'Plugins' / 'MiPlugin'
        (plugin / 'Doc' / 'Context').mkdir(parents=True)
        (plugin / 'Model').mkdir()
        (plugin / 'facturascripts.ini').write_text("name = 'MiPlugin'\n", encoding='utf-8')
        (plugin / 'AGENTS.md').write_text('Plugin\n', encoding='utf-8')
        (plugin / 'Doc' / 'Context' / 'README.md').write_text('# Índice\n', encoding='utf-8')
        otro = raiz / 'Plugins' / 'OtroPlugin'
        otro.mkdir()
        (otro / 'AGENTS.md').write_text('Otro\n', encoding='utf-8')

        salida = ejecutar(SCRIPTS['fs-dev'], plugin / 'Model').stdout

        self.assertIn(f'Plugin MiPlugin: {plugin}/AGENTS.md', salida)
        self.assertIn(f'Plugin MiPlugin: {plugin}/Doc/Context/README.md', salida)
        self.assertIn(f'Core: {raiz}/AGENTS.md', salida)
        self.assertNotIn('OtroPlugin', salida)


if __name__ == '__main__':
    unittest.main()
