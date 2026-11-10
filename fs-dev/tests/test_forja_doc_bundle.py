"""Pruebas del script que empaqueta y desempaqueta la documentación para la forja de facturascripts.com."""

from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import stat
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path


SCRIPT_PATH = Path(__file__).parents[1] / 'scripts' / 'forja-doc-bundle.py'
SPEC = importlib.util.spec_from_file_location('forja_doc_bundle', SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
BUNDLE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = BUNDLE
SPEC.loader.exec_module(BUNDLE)

# Texto de relleno para que los cuerpos superen el mínimo de 300 caracteres que exige el servidor.
FILLER = 'Este párrafo explica con calma cómo se usa la opción paso a paso para que la página sea útil. ' * 4


def page(*lines: str) -> str:
    """Devuelve el cuerpo de una página con las líneas indicadas y relleno suficiente."""
    return '\n\n'.join((FILLER, *lines)) + '\n'


def run_main(*args: str) -> tuple[int, str]:
    """Ejecuta el script en el mismo proceso y devuelve el código de salida y la salida estándar."""
    output = io.StringIO()
    with contextlib.redirect_stdout(output), contextlib.redirect_stderr(io.StringIO()):
        code = BUNDLE.main(list(args))
    return code, output.getvalue()


def make_zip(path: Path, files: dict[str, bytes | str], symlinks: tuple[str, ...] = ()) -> Path:
    """Crea un zip con los archivos indicados; los de ``symlinks`` se marcan como enlaces simbólicos."""
    with zipfile.ZipFile(path, 'w') as archive:
        for name, data in files.items():
            info = zipfile.ZipInfo(name)
            if name in symlinks:
                info.external_attr = (stat.S_IFLNK | 0o777) << 16
            archive.writestr(info, data.encode('utf-8') if isinstance(data, str) else data)
    return path


class ForjaDocBundleTestCase(unittest.TestCase):
    """Base de las pruebas: un plugin con su carpeta Doc en un directorio temporal."""

    def setUp(self) -> None:
        """Crea el plugin MiPlugin con Doc/User, Doc/Dev, Doc/Assets y un forja.json vacío."""
        self.tmp = tempfile.TemporaryDirectory()
        self.base = Path(self.tmp.name)
        self.root = self.make_plugin('MiPlugin')
        self.doc = self.root / 'Doc'

    def tearDown(self) -> None:
        """Borra el directorio temporal."""
        self.tmp.cleanup()

    def make_plugin(self, name: str) -> Path:
        """Crea un plugin con la estructura vacía de Doc y devuelve su carpeta."""
        root = self.base / name
        for folder in ('User', 'Dev', 'Assets'):
            (root / 'Doc' / folder).mkdir(parents=True)
            (root / 'Doc' / folder / '.gitkeep').touch()
        (root / 'facturascripts.ini').write_text(f"name = '{name}'\nversion = 1\n", encoding='utf-8')
        self.write_forja(root, {'User': {}, 'Dev': {}})
        return root

    @staticmethod
    def write_forja(root: Path, data: dict) -> None:
        """Escribe el Doc/forja.json del plugin."""
        (root / 'Doc' / 'forja.json').write_text(json.dumps(data, indent=4, ensure_ascii=False) + '\n',
                                                 encoding='utf-8')

    @staticmethod
    def read_forja(root: Path) -> dict:
        """Lee el Doc/forja.json del plugin."""
        return json.loads((root / 'Doc' / 'forja.json').read_text(encoding='utf-8'))

    def write(self, relative: str, content: str | bytes, root: Path | None = None) -> Path:
        """Escribe un archivo dentro de Doc/ del plugin y devuelve su ruta."""
        path = (root or self.root) / 'Doc' / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(content, bytes):
            path.write_bytes(content)
        else:
            path.write_text(content, encoding='utf-8')
        return path


class PackTest(ForjaDocBundleTestCase):
    """Comprueba la creación del zip y sus avisos."""

    def test_empaqueta_paginas_entradas_e_imagenes_enlazadas(self) -> None:
        self.write('User/activar.md', page('![Menú](../Assets/activar/01-menu.png)', '[Usar](usar.md)'))
        self.write('User/usar.md', page('Sin imágenes.'))
        self.write('Dev/ampliar.md', page('```php\n$x = $a[\'b\'](1);\n```'))
        self.write('Assets/activar/01-menu.png', b'png-menu')
        self.write('Assets/portada.png', b'png-portada')
        self.write('Assets/sin-usar.png', b'png-sin-usar')
        self.write_forja(self.root, {
            'User': {
                'activar.md': {'title': 'Activar', 'imageurl': 'Doc/Assets/portada.png'},
                'usar.md': {'title': 'Usar', 'parent': 'activar.md'},
            },
            'Dev': {'ampliar.md': {'title': 'Ampliar'}},
        })

        out = self.base / 'salida' / 'docs.zip'
        code, output = run_main('pack', str(self.root), str(out))

        self.assertEqual(code, 0, output)
        with zipfile.ZipFile(out) as archive:
            names = sorted(archive.namelist())
            forja = json.loads(archive.read('forja.json'))
        self.assertEqual(names, ['Assets/activar/01-menu.png', 'Assets/portada.png', 'Dev/ampliar.md',
                                 'User/activar.md', 'User/usar.md', 'forja.json'])
        self.assertEqual(forja['User']['usar.md'], {'title': 'Usar', 'parent': 'activar.md'})
        self.assertEqual(forja['Dev'], {'ampliar.md': {'title': 'Ampliar'}})
        self.assertNotIn('Aviso', output)

    def test_empaqueta_solo_las_paginas_indicadas(self) -> None:
        self.write('User/activar.md', page('![Menú](../Assets/activar/01-menu.png)'))
        self.write('User/usar.md', page('![Otra](../Assets/usar/01.png)'))
        self.write('Assets/activar/01-menu.png', b'png')
        self.write('Assets/usar/01.png', b'png')
        self.write_forja(self.root, {'User': {'activar.md': {'title': 'Activar'}, 'usar.md': {}}, 'Dev': {}})

        out = self.base / 'docs.zip'
        code, output = run_main('pack', str(self.root), str(out), '--pages', 'Doc/User/activar.md')

        self.assertEqual(code, 0, output)
        with zipfile.ZipFile(out) as archive:
            self.assertEqual(sorted(archive.namelist()),
                             ['Assets/activar/01-menu.png', 'User/activar.md', 'forja.json'])
            self.assertEqual(json.loads(archive.read('forja.json')),
                             {'User': {'activar.md': {'title': 'Activar'}}, 'Dev': {}})

    def test_type_limita_las_secciones(self) -> None:
        self.write('User/activar.md', page())
        self.write('Dev/ampliar.md', page())

        out = self.base / 'docs.zip'
        code, output = run_main('pack', str(self.root), str(out), '--type', 'dev')

        self.assertEqual(code, 0, output)
        with zipfile.ZipFile(out) as archive:
            self.assertEqual(sorted(archive.namelist()), ['Dev/ampliar.md', 'forja.json'])

        code, output = run_main('pack', str(self.root), str(out), '--type', 'dev', '--pages', 'User/activar.md')
        self.assertEqual(code, 1)
        self.assertIn('no es del tipo elegido', output)

    def test_avisa_de_imagenes_enlaces_y_titulos(self) -> None:
        self.write('User/activar.md', page('![Falta](../Assets/no-existe.png)', '[Falta](otra.md)',
                                           '[Contexto](../Context/README.md)', '[Fuera](../../README.md)'))
        self.write('User/repetida.md', page())
        self.write('Context/README.md', 'Índice')
        self.write_forja(self.root, {
            'User': {
                'activar.md': {'title': 'Activar', 'imageurl': 'Doc/Assets/portada.png'},
                'repetida.md': {'title': 'activar'},
            },
            'Dev': {},
        })

        out = self.base / 'docs.zip'
        code, output = run_main('pack', str(self.root), str(out), '--pages', 'User/activar.md')

        self.assertEqual(code, 0, output)
        self.assertIn('la imagen «../Assets/no-existe.png» no existe', output)
        self.assertIn('el enlace «otra.md» no existe', output)
        self.assertIn('Doc/Context/README.md, que no se publica', output)
        self.assertIn('el enlace «../../README.md» sale de Doc/', output)
        self.assertIn('el imageurl «Doc/Assets/portada.png» no existe', output)
        self.assertIn('título «Activar» repetido en User/activar.md, User/repetida.md', output)
        with zipfile.ZipFile(out) as archive:
            self.assertEqual(sorted(archive.namelist()), ['User/activar.md', 'forja.json'])

    def test_avisa_de_la_pagina_sin_entrada_en_forja(self) -> None:
        self.write('User/mi-pagina_nueva.md', page())

        code, output = run_main('pack', str(self.root), str(self.base / 'docs.zip'))

        self.assertEqual(code, 0, output)
        self.assertIn('se publicará con el título «Mi pagina nueva»', output)

    def test_cuerpo_corto_es_bloqueante_y_no_crea_el_zip(self) -> None:
        self.write('User/corta.md', 'Demasiado corta.\n')

        out = self.base / 'docs.zip'
        code, output = run_main('pack', str(self.root), str(out))

        self.assertEqual(code, 1)
        self.assertIn('User/corta.md tiene 16 caracteres', output)
        self.assertFalse(out.exists())

    def test_problema_de_forja_es_bloqueante(self) -> None:
        self.write('User/activar.md', page())
        self.write_forja(self.root, {'User': {'activar.md': {'color': 'rosa', 'ordenn': 1}}, 'Dev': {}})

        out = self.base / 'docs.zip'
        code, output = run_main('pack', str(self.root), str(out))

        self.assertEqual(code, 1)
        self.assertIn('color «rosa» no admitido', output)
        self.assertIn('campo desconocido «ordenn»', output)
        self.assertFalse(out.exists())

    def test_rechaza_paginas_con_rutas_peligrosas_o_inexistentes(self) -> None:
        out = self.base / 'docs.zip'
        for value, message in (('../User/x.md', 'sale de su carpeta'), ('/etc/passwd', 'es absoluta'),
                               ('User/no-existe.md', 'no existe'), ('Context/README.md', 'no es una página')):
            with self.subTest(value=value):
                code, output = run_main('pack', str(self.root), str(out), '--pages', value)
                self.assertEqual(code, 1)
                self.assertIn(message, output)
        self.assertFalse(out.exists())

    def test_rechaza_paginas_que_enlazan_fuera_de_doc(self) -> None:
        secret = self.base / 'secreto.md'
        secret.write_text(page('Datos privados que no deben publicarse.'), encoding='utf-8')
        (self.doc / 'User').mkdir(parents=True, exist_ok=True)
        (self.doc / 'User/enlace.md').symlink_to(secret)
        self.write('User/buena.md', page('Contenido normal.'))
        out = self.base / 'docs.zip'

        for args in ((), ('--pages', 'User/enlace.md')):
            with self.subTest(args=args):
                code, output = run_main('pack', str(self.root), str(out), *args)
                self.assertEqual(code, 1)
                self.assertIn('User/enlace.md', output)
                self.assertFalse(out.exists())

    def test_sin_paginas_es_un_error(self) -> None:
        code, output = run_main('pack', str(self.root), str(self.base / 'docs.zip'))

        self.assertEqual(code, 1)
        self.assertIn('no hay páginas que empaquetar', output)

    def test_ruta_que_no_es_un_plugin(self) -> None:
        code, _ = run_main('pack', str(self.base), str(self.base / 'docs.zip'))

        self.assertEqual(code, 2)

    def test_ignora_enlaces_en_codigo_y_urls(self) -> None:
        self.write('Dev/ampliar.md', page('`[x](no-existe.md)`', '```md\n![a](../Assets/no.png)\n```',
                                          '[Web](https://example.com/a.md)', '[Ancla](#seccion)'))

        code, output = run_main('pack', str(self.root), str(self.base / 'docs.zip'))

        self.assertEqual(code, 0, output)
        self.assertNotIn('no existe', output)


class UnpackTest(ForjaDocBundleTestCase):
    """Comprueba la colocación del zip en Doc/ y la combinación de forja.json."""

    def test_ida_y_vuelta_entre_dos_plugins(self) -> None:
        self.write('User/activar.md', page('![Menú](../Assets/activar/01%20menu.png)'))
        self.write('Dev/ampliar.md', page('[Activar](../User/activar.md)'))
        self.write('Assets/activar/01 menu.png', b'\x89PNG binario')
        self.write_forja(self.root, {
            'User': {'activar.md': {'title': 'Activar', 'ordernum': 10}},
            'Dev': {'ampliar.md': {'title': 'Ampliar', 'visibility': False}},
        })
        out = self.base / 'docs.zip'
        self.assertEqual(run_main('pack', str(self.root), str(out))[0], 0)

        other = self.make_plugin('OtroPlugin')
        code, output = run_main('unpack', str(out), str(other))

        self.assertEqual(code, 0, output)
        for relative in ('User/activar.md', 'Dev/ampliar.md', 'Assets/activar/01 menu.png'):
            self.assertEqual((other / 'Doc' / relative).read_bytes(), (self.doc / relative).read_bytes())
        self.assertEqual(self.read_forja(other), self.read_forja(self.root))
        for folder in ('User', 'Dev', 'Assets'):
            self.assertFalse((other / 'Doc' / folder / '.gitkeep').exists())
        self.assertIn('+ Creado: Doc/User/activar.md', output)
        self.assertIn('- Quitado: Doc/User/.gitkeep', output)
        self.assertNotIn('Aviso', output)

        code, output = run_main('unpack', str(out), str(other))
        self.assertEqual(code, 0, output)
        self.assertIn('= Sin cambios: Doc/User/activar.md', output)
        self.assertIn('= Sin cambios: Doc/forja.json', output)
        self.assertIn('0 creados, 0 actualizados, 4 sin cambios', output)

    def test_combina_forja_json(self) -> None:
        self.write('User/local.md', page())
        self.write('User/activar.md', page('Versión local.'))
        self.write_forja(self.root, {
            'User': {
                'local.md': {'title': 'Local', 'ordernum': 1},
                'activar.md': {'title': 'Activar viejo', 'icon': 'fa-solid fa-book'},
            },
            'Dev': {},
        })
        bundle = make_zip(self.base / 'docs.zip', {
            'User/activar.md': page('Versión de la web.'),
            'User/nueva.md': page(),
            'forja.json': json.dumps({
                'User': {'activar.md': {'title': 'Activar'}, 'nueva.md': {'title': 'Nueva'}},
                'Dev': {},
            }),
        })

        code, output = run_main('unpack', str(bundle), str(self.root))

        self.assertEqual(code, 0, output)
        forja = self.read_forja(self.root)
        self.assertEqual(list(forja['User']), ['local.md', 'activar.md', 'nueva.md'])
        self.assertEqual(forja['User']['local.md'], {'title': 'Local', 'ordernum': 1})
        self.assertEqual(forja['User']['activar.md'], {'title': 'Activar'})
        self.assertIn('Versión de la web.', (self.doc / 'User/activar.md').read_text(encoding='utf-8'))
        self.assertIn('~ Actualizado: Doc/User/activar.md', output)
        self.assertIn('+ Creado: Doc/User/nueva.md', output)
        self.assertIn('1 entradas reemplazadas, 1 añadidas, 0 iguales y 1 locales conservadas', output)
        self.assertTrue((self.doc / 'User/local.md').is_file())

    def test_acepta_el_prefijo_doc(self) -> None:
        bundle = make_zip(self.base / 'docs.zip', {
            'Doc/User/activar.md': page('![Menú](../Assets/01.png)'),
            'Doc/Assets/01.png': b'png',
            'Doc/forja.json': json.dumps({'User': {'activar.md': {'title': 'Activar'}}, 'Dev': {}}),
            'Doc/User/.gitkeep': '',
            '__MACOSX/Doc/User/._activar.md': 'basura',
        })

        code, output = run_main('unpack', str(bundle), str(self.root))

        self.assertEqual(code, 0, output)
        self.assertEqual((self.doc / 'Assets/01.png').read_bytes(), b'png')
        self.assertEqual(self.read_forja(self.root)['User'], {'activar.md': {'title': 'Activar'}})
        self.assertFalse((self.doc / 'User/.gitkeep').exists())
        self.assertTrue((self.doc / 'Dev/.gitkeep').exists())
        self.assertFalse((self.doc / '__MACOSX').exists())

    def test_rechaza_rutas_peligrosas_sin_escribir_nada(self) -> None:
        cases = {
            'con ..': {'User/../../fuera.md': 'x'},
            'absoluta': {'/tmp/fuera.md': 'x'},
            'de Windows': {'C:\\fuera.md': 'x'},
            'con barras invertidas': {'Assets\\..\\..\\fuera.png': 'x'},
        }
        for name, files in cases.items():
            with self.subTest(name):
                bundle = make_zip(self.base / 'peligroso.zip', {'User/buena.md': page(), **files})
                code, output = run_main('unpack', str(bundle), str(self.root))
                self.assertEqual(code, 1)
                self.assertIn('ruta peligrosa en el zip', output)
                self.assertFalse((self.doc / 'User/buena.md').exists())
        self.assertFalse((self.base / 'fuera.md').exists())

    def test_rechaza_enlaces_simbolicos(self) -> None:
        bundle = make_zip(self.base / 'enlace.zip', {'Assets/enlace.png': '/etc/passwd'},
                          symlinks=('Assets/enlace.png',))

        code, output = run_main('unpack', str(bundle), str(self.root))

        self.assertEqual(code, 1)
        self.assertIn('es un enlace simbólico', output)
        self.assertFalse((self.doc / 'Assets/enlace.png').exists())

    def test_no_escribe_a_traves_de_un_enlace_simbolico_local(self) -> None:
        outside = self.base / 'fuera'
        outside.mkdir()
        (self.doc / 'Assets/externo').symlink_to(outside, target_is_directory=True)
        bundle = make_zip(self.base / 'docs.zip', {'Assets/externo/a.png': b'png'})

        code, output = run_main('unpack', str(bundle), str(self.root))

        self.assertEqual(code, 1)
        self.assertIn('apunta fuera de Doc/', output)
        self.assertFalse((outside / 'a.png').exists())

    def test_dry_run_no_escribe_nada(self) -> None:
        bundle = make_zip(self.base / 'docs.zip', {
            'User/activar.md': page(),
            'forja.json': json.dumps({'User': {'activar.md': {'title': 'Activar'}}, 'Dev': {}}),
        })
        before = (self.doc / 'forja.json').read_text(encoding='utf-8')

        code, output = run_main('unpack', str(bundle), str(self.root), '--dry-run')

        self.assertEqual(code, 0, output)
        self.assertIn('simulación', output)
        self.assertIn('+ Creado: Doc/User/activar.md', output)
        self.assertIn('- Quitado: Doc/User/.gitkeep', output)
        self.assertFalse((self.doc / 'User/activar.md').exists())
        self.assertTrue((self.doc / 'User/.gitkeep').exists())
        self.assertEqual((self.doc / 'forja.json').read_text(encoding='utf-8'), before)

    def test_type_importa_solo_su_seccion_y_sus_imagenes(self) -> None:
        bundle = make_zip(self.base / 'docs.zip', {
            'User/activar.md': page('![Menú](../Assets/user.png)'),
            'Dev/ampliar.md': page('![Código](../Assets/dev.png)'),
            'Assets/user.png': b'u',
            'Assets/dev.png': b'd',
            'forja.json': json.dumps({'User': {'activar.md': {}}, 'Dev': {'ampliar.md': {'title': 'Ampliar'}}}),
        })

        code, output = run_main('unpack', str(bundle), str(self.root), '--type', 'dev')

        self.assertEqual(code, 0, output)
        self.assertTrue((self.doc / 'Dev/ampliar.md').is_file())
        self.assertTrue((self.doc / 'Assets/dev.png').is_file())
        self.assertFalse((self.doc / 'User/activar.md').exists())
        self.assertFalse((self.doc / 'Assets/user.png').exists())
        self.assertEqual(self.read_forja(self.root), {'User': {}, 'Dev': {'ampliar.md': {'title': 'Ampliar'}}})
        self.assertIn('1 páginas omitidas por --type', output)

    def test_avisa_de_problemas_sin_bloquear(self) -> None:
        bundle = make_zip(self.base / 'docs.zip', {
            'User/activar.md': page('![Falta](../Assets/falta.png)'),
            'User/sub/anidada.md': page(),
            'README.txt': 'x',
            'forja.json': json.dumps({'User': {'activar.md': {'colour': 'info'}, '../x.md': {}}, 'Otra': {}}),
        })

        code, output = run_main('unpack', str(bundle), str(self.root))

        self.assertEqual(code, 0, output)
        self.assertIn('la imagen «../Assets/falta.png» no existe', output)
        self.assertIn('campo desconocido «colour»', output)
        self.assertIn('«User/sub/anidada.md», que no es una página', output)
        self.assertIn('«README.txt», que no es una página', output)
        self.assertIn('sección desconocida «Otra»', output)
        self.assertIn('«User › ../x.md» no es un archivo .md', output)
        self.assertNotIn('../x.md', json.dumps(self.read_forja(self.root)))

    def test_sin_forja_json_conserva_el_local(self) -> None:
        self.write_forja(self.root, {'User': {'local.md': {'title': 'Local'}}, 'Dev': {}})
        self.write('User/local.md', page())
        bundle = make_zip(self.base / 'docs.zip', {'User/activar.md': page()})

        code, output = run_main('unpack', str(bundle), str(self.root))

        self.assertEqual(code, 0, output)
        self.assertIn('el zip no trae forja.json', output)
        self.assertEqual(self.read_forja(self.root)['User'], {'local.md': {'title': 'Local'}})

    def test_crea_doc_si_no_existe(self) -> None:
        root = self.base / 'SinDoc'
        root.mkdir()
        (root / 'facturascripts.ini').write_text("name = 'SinDoc'\n", encoding='utf-8')
        bundle = make_zip(self.base / 'docs.zip', {
            'User/activar.md': page(),
            'forja.json': json.dumps({'User': {'activar.md': {'title': 'Activar'}}}),
        })

        code, output = run_main('unpack', str(bundle), str(root))

        self.assertEqual(code, 0, output)
        self.assertEqual(self.read_forja(root), {'User': {'activar.md': {'title': 'Activar'}}, 'Dev': {}})

    def test_forja_local_invalido_es_bloqueante(self) -> None:
        (self.doc / 'forja.json').write_text('{roto', encoding='utf-8')
        bundle = make_zip(self.base / 'docs.zip', {'User/activar.md': page()})

        code, output = run_main('unpack', str(bundle), str(self.root))

        self.assertEqual(code, 1)
        self.assertIn('Doc/forja.json no es un JSON válido', output)
        self.assertFalse((self.doc / 'User/activar.md').exists())

    def test_zip_no_valido_o_inexistente(self) -> None:
        broken = self.base / 'roto.zip'
        broken.write_text('no es un zip', encoding='utf-8')

        code, output = run_main('unpack', str(broken), str(self.root))
        self.assertEqual(code, 1)
        self.assertIn('no es un zip válido', output)

        code, _ = run_main('unpack', str(self.base / 'no-existe.zip'), str(self.root))
        self.assertEqual(code, 2)


class HelpersTest(unittest.TestCase):
    """Comprueba la resolución de rutas y enlaces."""

    def test_safe_relative(self) -> None:
        self.assertEqual(BUNDLE.safe_relative('Doc//User/./a.md'), 'Doc/User/a.md')
        self.assertEqual(BUNDLE.safe_relative('Assets\\a\\b.png'), 'Assets/a/b.png')
        for value in ('../a.md', 'User/../../a.md', '/a.md', 'C:/a.md', 'c:a.md'):
            with self.subTest(value=value), self.assertRaises(BUNDLE.UnsafePathError):
                BUNDLE.safe_relative(value)

    def test_resolve_link_y_imageurl(self) -> None:
        self.assertEqual(BUNDLE.resolve_link('User', '../Assets/a%20b.png#x'), 'Assets/a b.png')
        self.assertEqual(BUNDLE.resolve_link('Dev', 'otra.md?v=1'), 'Dev/otra.md')
        self.assertIsNone(BUNDLE.resolve_link('User', 'https://example.com/a.png'))
        self.assertIsNone(BUNDLE.resolve_link('User', 'mailto:a@b.c'))
        self.assertIsNone(BUNDLE.resolve_link('User', '#ancla'))
        self.assertEqual(BUNDLE.resolve_imageurl('Doc/Assets/a.png'), 'Assets/a.png')
        self.assertEqual(BUNDLE.resolve_imageurl('../Assets/a.png'), 'Assets/a.png')
        self.assertIsNone(BUNDLE.resolve_imageurl('https://example.com/a.png'))

    def test_link_targets(self) -> None:
        text = ('![a](<../Assets/con espacio.png>) [b](otra.md "Título") <img src="../Assets/c.png" alt="">\n'
                '[ref]: ../Assets/d.png\n`[e](no.md)`')
        self.assertEqual(BUNDLE.link_targets(text),
                         ['../Assets/con espacio.png', 'otra.md', '../Assets/d.png', '../Assets/c.png'])


if __name__ == '__main__':
    unittest.main()
