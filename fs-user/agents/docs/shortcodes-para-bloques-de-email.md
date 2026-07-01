---
id: 2757
permalink: shortcodes-para-bloques-de-email
title: ShortCodes para bloques de email
creationdate: 16-04-2026 13:50:28
lastmod: 17-04-2026
url: https://facturascripts.com/publicaciones/shortcodes-para-bloques-de-email
---
### Qué son los shortcodes y por qué usarlos

Un shortcode es una marca de texto con formato especial que `NewMail` interpreta para convertirla en bloques HTML de email.

Ejemplo:

```
[blockTitle type="h2"]Pedido confirmado[/blockTitle]
```

En lugar de escribir HTML manual (más frágil en clientes de correo), defines bloques semánticos (`título`, `texto`, `botón`, etc.) y el sistema los renderiza con el estilo de plantilla de email.

Ventajas principales:

- Mejora la legibilidad del contenido del correo.
- Reduce errores de maquetación HTML en emails.
- Permite reutilizar patrones de contenido.
- Hace más sencillo extender nuevos bloques desde plugins.

### Sintaxis general

Formato con contenido:

```
[blockTipo atributo="valor"]Contenido[/blockTipo]
```

Formato autocierre (sin contenido interno):

```
[blockTipo atributo="valor"]
```

Notas importantes:

- El parser detecta tags con prefijo `block` (por ejemplo, `blockTitle`, `blockText`, `blockButton`).
- Los atributos admiten comillas dobles o simples: `attr="valor"` o `attr='valor'`.
- Todo texto fuera de shortcodes se convierte automáticamente en un bloque de texto.

### Shortcodes nativos disponibles

Los siguientes shortcodes están soportados directamente por `NewMail`.

#### 1) blockTitle

Renderiza un título (`h1`, `h2`, etc.).

Parámetros:

- `type` (opcional): etiqueta HTML del título. Por defecto `h2`.
- `css` (opcional): clase CSS del bloque. Por defecto `title`.
- `style` (opcional): reservado para extensiones; el render nativo no lo aplica directamente.

Ejemplo con todos los parámetros:

```
[blockTitle type="h1" css="title mb-10" style="color:#1f2937;"]Confirmación de pedido[/blockTitle]
```

Ejemplo mínimo:

```
[blockTitle]Confirmación de pedido[/blockTitle]
```

#### 2) blockText

Renderiza un párrafo de texto. Los saltos de línea se convierten a `<br>`.

Parámetros:

- `css` (opcional): clase CSS del párrafo. Por defecto `text`.
- `style` (opcional): reservado para extensiones; el render nativo no lo aplica directamente.

Ejemplo con todos los parámetros:

```
[blockText css="text pb-15" style="font-size:14px;"]Hola Juan,
tu pedido ya está en preparación.[/blockText]
```

Ejemplo mínimo:

```
[blockText]Tu factura está disponible para descarga.[/blockText]
```

#### 3) blockHtml

Inserta HTML libre dentro del correo.

Parámetros:

- No tiene parámetros nativos.

Ejemplo:

```
[blockHtml]<ul><li>Producto A</li><li>Producto B</li></ul>[/blockHtml]
```

#### 4) blockButton

Renderiza un botón/enlace.

Parámetros:

- `label` (opcional): texto visible del botón.
- `href` (opcional): URL del botón.
- `css` (opcional): clase CSS del botón. Por defecto `btn w-100`.
- `style` (opcional): reservado para extensiones; el render nativo no lo aplica directamente.

Comportamiento relevante:

- Si no se define `label`, se usa el contenido interno del shortcode.
- El sistema añade automáticamente `verificode` a la URL:
  - Si `href` ya tiene query string, añade `&verificode=...`
  - Si no, añade `?verificode=...`

Ejemplo con todos los parámetros (autocierre):

```
[blockButton label="Ver pedido" href="https://miempresa.com/pedido/123" css="btn btn-primary" style="background:#0f766e;"]
```

Ejemplo con label en contenido interno:

```
[blockButton href="https://miempresa.com/pedido/123"]Ver pedido[/blockButton]
```

#### 5) blockSpace

Añade un espacio vertical.

Parámetros:

- `height` (opcional): alto en píxeles. Por defecto `30`.

Ejemplo con todos los parámetros:

```
[blockSpace height="20"]
```

Ejemplo mínimo:

```
[blockSpace]
```

### Ejemplo completo de plantilla de cuerpo

```
[blockTitle type="h2" css="title" style=""]Tu pedido ha sido confirmado[/blockTitle]
[blockText css="text" style=""]Hola Marta,
hemos recibido correctamente tu pedido #A-1024.[/blockText]
[blockSpace height="16"]
[blockHtml]<p><strong>Resumen:</strong></p><ul><li>2 x Teclado</li><li>1 x Ratón</li></ul>[/blockHtml]
[blockSpace height="12"]
[blockButton label="Ver detalle del pedido" href="https://miempresa.com/pedido/A-1024" css="btn w-100" style=""]
```

### Recomendaciones de uso

- Usa `blockText` para texto normal y deja `blockHtml` para casos puntuales.
- Evita HTML complejo si no es necesario: mejora compatibilidad entre clientes de correo.
- Mantén clases CSS consistentes con la plantilla de email activa.