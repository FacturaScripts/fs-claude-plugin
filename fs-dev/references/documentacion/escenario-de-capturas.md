# Escenario de capturas de `doc-screenshots.py`

El script `fs-dev/scripts/doc-screenshots.py` hace las capturas de una página de documentación a partir de un
escenario JSON. Abre Google Chrome (o Chromium) sin interfaz con un perfil temporal, inicia sesión, recorre cada
pantalla, anonimiza los datos personales, dibuja las marcas, comprueba que no queda ningún dato personal visible y
guarda un PNG por captura. No necesita dependencias: solo Python 3 y Chrome.

```bash
FS_DOC_USER='<usuario>' FS_DOC_PASSWORD='<contraseña>' \
  python3 "<scripts>/doc-screenshots.py" "<escenario.json>" [--scan] [--only <nombre> ...] [--check]
```

- `--check` valida el escenario sin abrir Chrome.
- `--scan` no guarda imágenes: para cada captura ejecuta sus pasos y devuelve la URL, el título, el tamaño de la página,
  los **controles visibles** con el `target` que se puede usar en los pasos y si cambian datos (`changes_data`), y los
  datos personales que quedarían a la vista. Úsalo para descubrir los selectores antes de escribir las marcas.
- `--only` repite solo las capturas indicadas.
- `--output-dir` sustituye a `output_dir` y `--chrome` indica el ejecutable (también `FS_DOC_CHROME`).
- Imprime un JSON con cada captura: `file`, `width`, `height`, `anonymized` (valor ficticio y valor real enmascarado)
  o `error` y `leaks`. Código 0 si todo va bien, 1 si falla alguna captura y 2 si el escenario no es válido o Chrome
  no arranca.

Las credenciales se leen **solo** de las variables de entorno (`FS_DOC_USER` y `FS_DOC_PASSWORD` por defecto). Nunca
las escribas en el escenario ni en ningún archivo.

## Estructura

```json
{
  "base_url": "https://fs.localhost/",
  "login": true,
  "output_dir": "<plugin>/Doc/Assets/<nombre-de-la-página>",
  "viewport": {"width": 1280, "height": 800, "scale": 1},
  "redact": {"keep": ["Contado"], "replace": {"Mi Empresa Real SL": "Empresa Ejemplo SL"}, "blur": [".firma"]},
  "hide": [".toast"],
  "captures": [
    {
      "name": "01-menu-ventas-facturas",
      "url": "Dashboard",
      "steps": [{"click": "text=Ventas"}],
      "highlight": [
        {"target": "text=Ventas", "label": "1"},
        {"target": ".dropdown-menu.show >> text=Facturas", "label": "2", "arrow": "right"}
      ],
      "clip": ["nav.navbar", ".dropdown-menu.show"],
      "margin": 24
    }
  ]
}
```

| Clave | Qué es |
|---|---|
| `base_url` | URL de la instalación; las `url` y los `goto` relativos se resuelven contra ella |
| `login` | `true` para iniciar sesión con `FS_DOC_USER` y `FS_DOC_PASSWORD`, u `{"user_env": "...", "password_env": "..."}` |
| `output_dir` | Carpeta de las imágenes; se crea si no existe |
| `viewport` | Tamaño de la ventana (por defecto 1280 × 800) y `scale` (2 para pantallas retina; ocupa cuatro veces más) |
| `timeout` | Segundos de espera máximos al cargar o buscar (por defecto 20) |
| `insecure` | Acepta certificados propios; por defecto, solo en `localhost`, `*.localhost`, `*.test` y `file://` |
| `redact` | Anonimización común a todas las capturas (ver abajo) |
| `hide` | Selectores CSS que se ocultan en todas las capturas |
| `captures` | Lista de capturas, en orden; cada una sigue en la página donde terminó la anterior si no tiene `url` |

### Cada captura

| Clave | Qué es |
|---|---|
| `name` | Nombre único; el archivo es `<name>.png` salvo que se indique `file` |
| `url` | Pantalla que se abre antes de los pasos |
| `steps` | Pasos que preparan la pantalla (ver abajo) |
| `highlight` | Marcas: `target`, `nth`, `label` (número o texto del círculo), `arrow` (`true` o `left`, `right`, `up`, `down`: lado desde el que llega la flecha), `note` (texto junto a la flecha o bajo el recuadro), `color` y `padding` |
| `clip` | Selector o lista de selectores: la imagen se recorta al rectángulo que los abarca a ellos **y a las marcas**, más `margin` píxeles (16 por defecto) |
| `full_page` | `true` para capturar la página entera en lugar de la ventana |
| `redact`, `hide` | Se suman a los del escenario |

Sin `clip` ni `full_page`, se captura la ventana; si la primera marca no está a la vista, la página se desplaza hasta
ella.

### Destinos (`target`)

- Un selector CSS: `a[href="#EnvioFiscalVerifactu"]`, `input[name="query"]`, `input.listAction[value="508"]`.
- `text=Texto`: el elemento visible cuyo texto es exactamente ese (si no hay ninguno, el que lo contiene), subiendo al
  botón, enlace o pestaña que lo contiene.
- `zona >> destino`: busca solo dentro de los elementos visibles de la zona. Úsalo cuando el texto se repite:
  `.dropdown-menu.show >> text=Verifactu` (el estado, no la pestaña).
- `nth` elige el siguiente cuando hay varios (empieza en 0).
- Las casillas de las filas de un listado son `input.listAction` y su `value` es el código del registro.

### Pasos

| Paso | Qué hace |
|---|---|
| `{"goto": "ListFacturaCliente"}` | Abre otra pantalla |
| `{"click": "text=Acciones"}` | Pulsa un elemento y espera a que termine lo que lance (navegación o AJAX) |
| `{"fill": "input[name=\"query\"]", "value": "FAC2026A"}` | Escribe en un campo sin enviar el formulario |
| `{"select": "select[name=\"codserie\"]", "value": "A"}` | Elige una opción por su valor o su texto |
| `{"wait": 500}` | Espera unos milisegundos |
| `{"wait_for": ".modal.show"}` | Espera a que aparezca un elemento |
| `{"scroll_to": "text=Datos fiscales"}` | Desplaza la página hasta el elemento |
| `{"eval": "..."}` | Ejecuta JavaScript; úsalo solo para leer o preparar la vista (por ejemplo, enviar un formulario de búsqueda) |

Los clics que pueden cambiar datos se **bloquean**: botones que envían un formulario POST, enlaces con `action=` y
textos como «Guardar», «Eliminar», «Enviar», «Dar de alta», «Anular» o «Generar». Solo se permiten con
`"allow_change": true` en el paso, y eso exige el permiso expreso del usuario o una instalación desechable. Una
búsqueda o un filtro que se envían por POST no cambian datos: para ellos usa `fill` y un `eval` que envíe el
formulario (`document.querySelector('input[name="query"]').form.submit()`).

## Anonimización (`redact`)

Antes de cada captura, con `auto` activado (por defecto):

1. **Campos** de formulario por su `name`: nombres y razón social, NIF, email, teléfonos, dirección y cuentas
   bancarias. En los desplegables de cliente o proveedor, el texto de sus opciones.
2. **Columnas** de los listados por su cabecera: Cliente, Proveedor, Nombre, CIF/NIF, Email, Teléfono, Dirección...
3. **Patrones** en todo el texto, los campos y los atributos `title`: emails, NIF/CIF/NIE, teléfonos e IBAN.
4. Cada valor real encontrado se sustituye **en toda la página** (también en el título, las descripciones y los
   desplegables) y siempre por el **mismo** valor ficticio durante la ejecución: «Cliente Ejemplo 1», «Proveedor
   Ejemplo 1», `00000001R`, `usuario1@ejemplo.com`, `600 000 001`, `Calle Ejemplo, 1`, `ES00 0000 0000 0000 0000 0001`.
5. Oculta los **logotipos de la marca** (imágenes con «FacturaScripts» en su texto alternativo) sin mover el resto de
   la pantalla.
6. Desenfoca las imágenes de los **códigos QR** (llevan el NIF del emisor) y los selectores de `blur`.

| Clave | Qué es |
|---|---|
| `auto` | `false` desactiva la anonimización automática (no lo hagas salvo con datos de demostración) |
| `keep` | Valores que se dejan tal cual porque no son personales («Contado», «Varios»...) |
| `replace` | `{"valor real": "valor ficticio"}` para lo que no se detecta solo: el nombre de la empresa (`{"FS": "Mi Empresa"}`), una persona en una descripción, una marca... Los valores de menos de cuatro letras se sustituyen solo como palabra completa |
| `blur` | Selectores CSS que se desenfocan: firmas, imágenes, logotipos... |

Después de anonimizar y marcar, el script busca otra vez patrones y valores reales en todo lo visible, y también la
**marca** («FacturaScripts», «factura.city» o «FS», categoría `marca`), que no puede verse porque la página se publica
en las dos webs. Si encuentra algo, **no guarda la imagen** y devuelve `leaks` (categoría, valor enmascarado y dónde
está): añádelo a `replace`, a `blur` o a `hide` y repite. En las instalaciones de prueba, el nombre corto de la empresa
suele ser «FS» y aparece en la barra de menú y en títulos como «Tablero de FS». La comprobación no ve el texto dentro de imágenes ni los nombres que no sigan un patrón y no estén en
un campo o columna conocidos: revisa siempre cada imagen a ojo.
