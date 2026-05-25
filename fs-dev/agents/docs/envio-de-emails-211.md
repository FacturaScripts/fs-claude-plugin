---
id: 920
permalink: envio-de-emails-211
title: Enviar emails con NewMail
creationdate: 08-05-2021 12:06:49
lastmod: 16-04-2026
url: https://facturascripts.com/publicaciones/envio-de-emails-211
---
Podemos enviar emails desde FacturaScripts utilizando la clase [NewMail](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Email-NewMail.html). Este clase facilita el envío de emails desde FacturaScripts. Utiliza los datos del correo configurado en el menú administrador, emails.

```
use FacturaScripts\Dinamic\Lib\Email\NewMail;

$mail = NewMail::create()
	-&gt;to(&#39;pepe@gmail.com&#39;, &#39;Pepe&#39;)
	-&gt;subject(&#39;Hola Pepe&#39;)
	-&gt;body(&#39;Hola Pepe, esto es una prueba&#39;);

if ($mail-&gt;send()) {
	// email enviado correctamente
}
```

## 📎 Añadir un archivo adjunto
Usaremos el método ``addAttachment()`` de la clase NewMail para añadir archivos adjuntos al email:

```
$mail = NewMail::create()
	-&gt;to(&#39;pepe@gmail.com&#39;, &#39;Pepe&#39;)
	-&gt;subject(&#39;Hola Pepe&#39;)
	-&gt;body(&#39;Hola Pepe, esto es una prueba&#39;)
	-&gt;addAttachment(&#39;el-archivo.pdf&#39;, &#39;Nombre del archivo para el cliente.pdf&#39;);

if ($mail-&gt;send()) {
	// email enviado correctamente
}
```

## ✉️ Enviar con copia
El campo CC en los emails significa &quot;con copia&quot;. Se utiliza para enviar una copia de un correo electrónico a otras personas además del destinatario principal. Las personas que se incluyen en el campo CC reciben una copia del mensaje, pero no se consideran destinatarios principales.

El campo CC se puede utilizar para varios propósitos, entre los que se incluyen:
- Mantener a otros informados de un correo electrónico. Por ejemplo, si envías un correo electrónico a un cliente, puedes incluir a tu gerente en el campo CC para que esté al tanto de la conversación.
- Obtener comentarios de otras personas. Si estás trabajando en un proyecto, puedes enviar un correo electrónico a tus compañeros de equipo en el campo CC para obtener su opinión.
- Remitir un correo electrónico a otras personas. Si recibes un correo electrónico que crees que puede ser útil para otras personas, puedes reenviarlo en el campo CC.

```
$mail = NewMail::create()
	-&gt;to(&#39;pepe@gmail.com&#39;, &#39;Pepe&#39;)
	-&gt;cc(&#39;jose@gmail.com&#39;, &#39;Jose&#39;)
	-&gt;cc(&#39;antonio@gmail.com&#39;, &#39;Antonio&#39;)
	-&gt;subject(&#39;Hola&#39;)
	-&gt;body(&#39;Hola, esto es una prueba&#39;);

if ($mail-&gt;send()) {
	// email enviado correctamente
}
```

### 👁️‍🗨️ Enviar con copia oculta
El campo BCC, que significa &quot;con copia oculta&quot;, se utiliza para enviar una copia de un correo electrónico a otras personas sin que los demás destinatarios puedan ver sus direcciones de correo electrónico.

El campo BCC se puede utilizar para varios propósitos, entre los que se incluyen:
- Proteger la privacidad de las direcciones de correo electrónico. Por ejemplo, si estás enviando un correo electrónico a un grupo de personas, puedes utilizar el campo BCC para ocultar las direcciones de correo electrónico de los demás destinatarios.
- Enviar un correo electrónico a un grupo grande de personas sin abrumar a los destinatarios principales. Si estás enviando un correo electrónico a un grupo grande de personas, puedes utilizar el campo BCC para evitar que los destinatarios principales reciban una respuesta de todos los demás destinatarios.
- Enviar un correo electrónico a personas que no se conocen entre sí. Si estás enviando un correo electrónico a personas que no se conocen entre sí, puedes utilizar el campo BCC para evitar que conozcan las direcciones de correo electrónico de los demás.

```
$mail = NewMail::create()
	-&gt;bcc(&#39;jose@gmail.com&#39;, &#39;Jose&#39;)
	-&gt;bcc(&#39;antonio@gmail.com&#39;, &#39;Antonio&#39;)
	-&gt;subject(&#39;Hola&#39;)
	-&gt;body(&#39;Hola, esto es una prueba&#39;);

if ($mail-&gt;send()) {
	// email enviado correctamente
}
```

## 📫 Notificaciones
En ocasiones debemos mandar el mismo tipo de email muchas veces. Para estos casos, en lugar de escribir todo el texto cada vez, podemos preparar una notificación con el texto precargado (que además podrá modificar el usuario).

### 📝 Cómo crear una notificación
Para crear la notificación usaremos el modelo MailNotification:

```
$notificationModel-&gt;name = &#39;mi-notificacion&#39;;
$notificationModel-&gt;subject = &#39;mi-titulo&#39;;
$notificationModel-&gt;body = &#39;mi-texto&#39;;
$notificationModel-&gt;enabled = true;
$notificationModel-&gt;save();
```

Podemos usar cadenas de texto a reemplazar, como ``{name}``, que será reemplazado por el nombre del contacto o cliente al que enviemos el email.

### 📨 Cómo enviar un notificación de email
Para enviar la notificación simplemente debemos llamar a la clase [MailNotifier](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Email-MailNotifier.html):

```
MailNotifier::send(&#39;mi-notificacion&#39;, $email, $name);
```

Si hemos incluído otras cadenas de texto a reemplazar en el email, por ejemplo una fecha de vencimiento y un nombre de proyecto, podemos incluir esos valores a reemplazar en los parámetros.

```
// Si el texto de la notificación es &quot;Hola {name}, la fecha de vencimiento del proyecto {project} es {expiration}&quot;
// Podemos enviar la notificación así

MailNotifier::send(&#39;mi-notificacion&#39;, $email, $name, [
	&#39;project&#39; =&gt; &#39;Proyecto 123&#39;,
	&#39;expiration&#39; =&gt; &#39;11-12-2024&#39;
]);
```

### 📝 Textos predeterminados para emails
Cuando el usuario envía por email una factura, albarán, etc ... Tenemos unos [textos predeterminados](https://facturascripts.com/publicaciones/cambiar-los-textos-de-las-plantillas-de-emails) para esos emails, que realmente son notificaciones: `sendmail-AlbaranCliente`, `sendmail-FacturaCliente` ... puedes conseguir el mismo comportamiento con tus modelos simplemente creando una notificación para cada uno con el prefijo `sendmail-`.

## Shortcodes
Puedes aprender sobre el uso de los shortcodes de [aquí](https://facturascripts.com/publicaciones/shortcodes-para-bloques-de-email).

`NewMail` parsea shortcodes y crea bloques nativos para:

- `blockTitle` -&gt; `TitleBlock`
- `blockText` -&gt; `TextBlock`
- `blockHtml` -&gt; `HtmlBlock`
- `blockButton` -&gt; `ButtonBlock`
- `blockSpace` -&gt; `SpaceBlock`
- `blockBox` -&gt; `BoxBlock`
- `blockSpace` -&gt; `SpaceBlock`

- Usarlos directamente por código PHP.
- Exponerlos como shortcodes personalizados con `NewMail::addBlockHandler()`.

### Ejemplo de BoxBlock (uso por código)

```php
use FacturaScripts\Core\Lib\Email\BoxBlock;
use FacturaScripts\Core\Lib\Email\TextBlock;

$box = new BoxBlock(
  [
    new TextBlock(&#39;Línea 1 del contenido de la caja.&#39;),
    new TextBlock(&#39;Línea 2 del contenido de la caja.&#39;)
  ],
  &#39;block mb-15&#39;,
  &#39;border:1px solid #d1d5db;padding:12px;&#39;
);

$mail-&gt;addMainBlock($box);
```

Parámetros de `BoxBlock`:

- `$blocks` (array): lista de bloques hijos (`BaseBlock[]`).
- `$css` (opcional): clase CSS del contenedor.
- `$style` (opcional): reservado para extensiones; el render nativo no lo aplica directamente.

### Ejemplo de TableBlock (uso por código)

```php
use FacturaScripts\Core\Lib\Email\TableBlock;

$table = new TableBlock(
  [&#39;Producto&#39;, &#39;Cantidad&#39;, &#39;Precio&#39;],
  [
    [&#39;Teclado&#39;, &#39;2&#39;, &#39;29.90 EUR&#39;],
    [&#39;Raton&#39;, &#39;1&#39;, &#39;19.90 EUR&#39;]
  ],
  &#39;table mb-15 w-100&#39;,
  &#39;font-size:13px;&#39;
);

$mail-&gt;addMainBlock($table);
```

Parámetros de `TableBlock`:

- `$header` (array): cabeceras de la tabla.
- `$rows` (array): filas (`array&lt;array&lt;string&gt;&gt;`).
- `$css` (opcional): clase CSS de la tabla.
- `$style` (opcional): reservado para extensiones; el render nativo no lo aplica directamente.

### Ejemplo de BoxBlock como shortcode personalizado

Registro del handler:

```php
use FacturaScripts\Core\Lib\Email\BoxBlock;
use FacturaScripts\Core\Lib\Email\NewMail;
use FacturaScripts\Core\Lib\Email\TextBlock;

NewMail::addBlockHandler(&#39;box&#39;, function (array $attrs, string $content) {
  return new BoxBlock(
    [new TextBlock($content)],
    $attrs[&#39;css&#39;] ?? &#39;&#39;,
    $attrs[&#39;style&#39;] ?? &#39;&#39;
  );
});
```

Uso del shortcode con todos los parámetros:

```txt
[blockBox css=&quot;block mb-15&quot; style=&quot;border:1px solid #d1d5db;padding:12px;&quot;]
Este texto se renderiza dentro de una caja.
[/blockBox]
```

### Ejemplo de TableBlock como shortcode personalizado

Registro del handler:

```php
use FacturaScripts\Core\Lib\Email\NewMail;
use FacturaScripts\Core\Lib\Email\TableBlock;

NewMail::addBlockHandler(&#39;table&#39;, function (array $attrs, string $content) {
  $header = isset($attrs[&#39;header&#39;]) ? explode(&#39;|&#39;, $attrs[&#39;header&#39;]) : [];
  $rows = [];

  if (!empty($attrs[&#39;rows&#39;])) {
    foreach (explode(&#39;;&#39;, $attrs[&#39;rows&#39;]) as $line) {
      $rows[] = explode(&#39;,&#39;, $line);
    }
  }

  return new TableBlock(
    $header,
    $rows,
    $attrs[&#39;css&#39;] ?? &#39;&#39;,
    $attrs[&#39;style&#39;] ?? &#39;&#39;
  );
});
```

Uso del shortcode con todos los parámetros:

```txt
[blockTable header=&quot;Producto|Cantidad|Precio&quot; rows=&quot;Teclado,2,29.90 EUR;Raton,1,19.90 EUR&quot; css=&quot;table mb-15 w-100&quot; style=&quot;font-size:13px;&quot;]
```

### Ejemplo completo: crear y añadir tu propio shortcode

Este ejemplo crea un bloque personalizado `AlertBlock`, lo registra como shortcode `blockAlert` y muestra cómo usarlo en el cuerpo del email.

1. Crear la clase del bloque.

```php
namespace MiPlugin\Lib\Email;

use FacturaScripts\Core\Lib\Email\BaseBlock;

class AlertBlock extends BaseBlock
{
  private $text;

  public function __construct(string $text, string $css = &#39;&#39;, string $style = &#39;&#39;)
  {
    $this-&gt;text = $text;
    $this-&gt;css = $css;
    $this-&gt;style = $style;
  }

  public function render(bool $footer = false): string
  {
    return &#39;&lt;div class=&quot;&#39; . (empty($this-&gt;css) ? &#39;alert&#39; : $this-&gt;css) . &#39;&quot;&gt;&#39; . $this-&gt;text . &#39;&lt;/div&gt;&#39;;
  }
}
```

2. Registrar el shortcode en el arranque de tu plugin.

```php
use FacturaScripts\Core\Lib\Email\NewMail;
use MiPlugin\Lib\Email\AlertBlock;

NewMail::addBlockHandler(&#39;alert&#39;, function (array $attrs, string $content) {
  return new AlertBlock(
    $content,
    $attrs[&#39;css&#39;] ?? &#39;&#39;,
    $attrs[&#39;style&#39;] ?? &#39;&#39;
  );
});
```

3. Usar el shortcode en el texto del correo.

```txt
[blockAlert css=&quot;alert alert-warning&quot; style=&quot;border:1px solid #f59e0b;padding:10px;&quot;]
Recuerda revisar los datos antes de confirmar.
[/blockAlert]
```

Parámetros del shortcode `blockAlert` en este ejemplo:

- `css` (opcional): clase CSS del bloque.
- `style` (opcional): atributo disponible para tu implementación.
- Contenido interno (obligatorio en este ejemplo): texto que se renderiza dentro de la alerta.

### Resumen rápido de bloques

- Nativos por shortcode: `TitleBlock`, `TextBlock`, `HtmlBlock`, `ButtonBlock`, `SpaceBlock`, `BoxBlock`, `TableBlock`.
- Ampliables por plugin: cualquier bloque propio mediante `addBlockHandler()`.