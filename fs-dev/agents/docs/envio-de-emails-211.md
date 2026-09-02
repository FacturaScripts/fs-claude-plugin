---
id: 920
permalink: envio-de-emails-211
title: Enviar emails con NewMail
creationdate: 08-05-2021 12:06:49
lastmod: 09-08-2026
url: https://facturascripts.com/publicaciones/envio-de-emails-211
---
Podemos enviar emails desde FacturaScripts utilizando la clase [NewMail](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Email-NewMail.html). Esta clase facilita el envío de emails con los datos configurados en el menú **Administrador → Emails**.

```php
use FacturaScripts\Dinamic\Lib\Email\NewMail;

$mail = NewMail::create()
    -&gt;to(&#39;pepe@gmail.com&#39;, &#39;Pepe&#39;)
    -&gt;subject(&#39;Hola Pepe&#39;)
    -&gt;body(&#39;Hola Pepe, esto es una prueba&#39;);

if ($mail-&gt;send()) {
    // Email enviado correctamente.
}
```

## 📎 Añadir un archivo adjunto

Usaremos el método `addAttachment()` de la clase `NewMail` para añadir archivos adjuntos al email:

```php
$mail = NewMail::create()
    -&gt;to(&#39;pepe@gmail.com&#39;, &#39;Pepe&#39;)
    -&gt;subject(&#39;Hola Pepe&#39;)
    -&gt;body(&#39;Hola Pepe, esto es una prueba&#39;)
    -&gt;addAttachment(&#39;el-archivo.pdf&#39;, &#39;Nombre del archivo para el cliente.pdf&#39;);

if ($mail-&gt;send()) {
    // Email enviado correctamente.
}
```

## ✉️ Enviar con copia

El campo CC en los emails significa &quot;con copia&quot;. Se utiliza para enviar una copia a otras personas además del destinatario principal. Las personas incluidas en CC pueden ver las direcciones de los demás destinatarios.

```php
$mail = NewMail::create()
    -&gt;to(&#39;pepe@gmail.com&#39;, &#39;Pepe&#39;)
    -&gt;cc(&#39;jose@gmail.com&#39;, &#39;Jose&#39;)
    -&gt;cc(&#39;antonio@gmail.com&#39;, &#39;Antonio&#39;)
    -&gt;subject(&#39;Hola&#39;)
    -&gt;body(&#39;Hola, esto es una prueba&#39;);

if ($mail-&gt;send()) {
    // Email enviado correctamente.
}
```

### 👁️‍🗨️ Enviar con copia oculta

El campo BCC significa &quot;con copia oculta&quot;. Permite enviar una copia sin mostrar la dirección de esos destinatarios al resto.

```php
$mail = NewMail::create()
    -&gt;to(&#39;pepe@gmail.com&#39;, &#39;Pepe&#39;)
    -&gt;bcc(&#39;jose@gmail.com&#39;, &#39;Jose&#39;)
    -&gt;bcc(&#39;antonio@gmail.com&#39;, &#39;Antonio&#39;)
    -&gt;subject(&#39;Hola&#39;)
    -&gt;body(&#39;Hola, esto es una prueba&#39;);

if ($mail-&gt;send()) {
    // Email enviado correctamente.
}
```

## 📫 Notificaciones

En ocasiones debemos mandar el mismo tipo de email muchas veces. Para estos casos podemos preparar una notificación con el texto precargado, que además podrá modificar el usuario.

### 📝 Cómo crear una notificación

Para crear una notificación usaremos el modelo `EmailNotification`:

```php
use FacturaScripts\Dinamic\Model\EmailNotification;

$notificationModel = new EmailNotification();
$notificationModel-&gt;name = &#39;mi-notificacion&#39;;
$notificationModel-&gt;subject = &#39;mi-titulo&#39;;
$notificationModel-&gt;body = &#39;mi-texto&#39;;
$notificationModel-&gt;enabled = true;
$notificationModel-&gt;save();
```

Podemos usar cadenas de texto a reemplazar, como `{name}`, que será sustituida por el nombre del contacto o cliente al que enviemos el email.

### 📨 Cómo enviar una notificación de email

Para enviar la notificación llamaremos a la clase [MailNotifier](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Email-MailNotifier.html):

```php
use FacturaScripts\Dinamic\Lib\Email\MailNotifier;

MailNotifier::send(&#39;mi-notificacion&#39;, $email, $name);
```

Si hemos incluido otras cadenas de texto a reemplazar, por ejemplo una fecha de vencimiento y un nombre de proyecto, podemos pasar sus valores en el cuarto parámetro:

```php
// Texto: &quot;Hola {name}, la fecha de vencimiento del proyecto
// {project} es {expiration}&quot;.
MailNotifier::send(&#39;mi-notificacion&#39;, $email, $name, [
    &#39;project&#39; =&gt; &#39;Proyecto 123&#39;,
    &#39;expiration&#39; =&gt; &#39;11-12-2024&#39;,
]);
```

### 📝 Textos predeterminados para emails

Cuando el usuario envía por email una factura, albarán u otro modelo, FacturaScripts utiliza [textos predeterminados](https://facturascripts.com/publicaciones/cambiar-los-textos-de-las-plantillas-de-emails). Estos textos son notificaciones como `sendmail-AlbaranCliente` o `sendmail-FacturaCliente`.

Puedes conseguir el mismo comportamiento con tus modelos creando una notificación cuyo nombre sea `sendmail-` seguido del nombre de la clase del modelo.

## Shortcodes y bloques de email

`NewMail` convierte los siguientes shortcodes en bloques nativos:

- `[blockTitle]...[/blockTitle]` → `TitleBlock`.
- `[blockText]...[/blockText]` → `TextBlock`.
- `[blockHtml]...[/blockHtml]` → `HtmlBlock`.
- `[blockButton label=&quot;Reservar&quot; href=&quot;https://example.com&quot;]` → `ButtonBlock`.
- `[blockSpace height=&quot;20&quot;]` → `SpaceBlock`.

Puedes consultar más ejemplos en [Shortcodes para bloques de email](https://facturascripts.com/publicaciones/shortcodes-para-bloques-de-email).

Además, los bloques se pueden crear directamente desde PHP y añadir al cuerpo con `addMainBlock()` o al pie con `addFooterBlock()`.

### Ejemplo de BoxBlock desde PHP

```php
use FacturaScripts\Core\Lib\Email\BoxBlock;
use FacturaScripts\Core\Lib\Email\TextBlock;

$box = new BoxBlock(
    [
        new TextBlock(&#39;Línea 1 del contenido de la caja.&#39;),
        new TextBlock(&#39;Línea 2 del contenido de la caja.&#39;),
    ],
    &#39;block mb-15&#39;,
    &#39;border: 1px solid #d1d5db; padding: 12px;&#39;
);

$mail-&gt;addMainBlock($box);
```

Parámetros de `BoxBlock`:

- `$blocks`: lista de bloques hijos (`BaseBlock[]`).
- `$css`: clase CSS opcional del contenedor.
- `$style`: valor disponible para extensiones; el render nativo no lo aplica directamente.

### Ejemplo de TableBlock desde PHP

```php
use FacturaScripts\Core\Lib\Email\TableBlock;

$table = new TableBlock(
    [&#39;Producto&#39;, &#39;Cantidad&#39;, &#39;Precio&#39;],
    [
        [&#39;Teclado&#39;, &#39;2&#39;, &#39;29.90 EUR&#39;],
        [&#39;Ratón&#39;, &#39;1&#39;, &#39;19.90 EUR&#39;],
    ],
    &#39;table mb-15 w-100&#39;,
    &#39;font-size: 13px;&#39;
);

$mail-&gt;addMainBlock($table);
```

Parámetros de `TableBlock`:

- `$header`: cabeceras de la tabla.
- `$rows`: filas de la tabla (`array&lt;array&lt;string&gt;&gt;`).
- `$css`: clase CSS opcional de la tabla.
- `$style`: valor disponible para extensiones; el render nativo no lo aplica directamente.

## Crear un shortcode personalizado

Para añadir un shortcode propio hay que crear una clase de bloque dentro de `Lib/Email` del plugin. La clase debe heredar de `BaseBlock` e implementar `fromShortcode()` para transformar los atributos y el contenido del shortcode en una instancia.

Por ejemplo, en `Plugins/MiPlugin/Lib/Email/AlertBlock.php`:

```php
namespace FacturaScripts\Plugins\MiPlugin\Lib\Email;

use FacturaScripts\Core\Lib\Email\BaseBlock;

class AlertBlock extends BaseBlock
{
    private string $text;

    public function __construct(string $text, string $css = &#39;&#39;, string $style = &#39;&#39;)
    {
        $this-&gt;text = $text;
        $this-&gt;css = $css;
        $this-&gt;style = $style;
    }

    public static function fromShortcode(array $attrs, string $content): static
    {
        return new static(
            $content,
            $attrs[&#39;css&#39;] ?? &#39;&#39;,
            $attrs[&#39;style&#39;] ?? &#39;&#39;
        );
    }

    public function render(bool $footer = false): string
    {
        $css = empty($this-&gt;css) ? &#39;alert&#39; : $this-&gt;css;

        return &#39;&lt;div class=&quot;&#39; . $css . &#39;&quot; style=&quot;&#39; . $this-&gt;style . &#39;&quot;&gt;&#39;
            . $this-&gt;text
            . &#39;&lt;/div&gt;&#39;;
    }
}
```

Registraremos la clase usando su nombre, sin pasar un callable:

```php
use FacturaScripts\Dinamic\Lib\Email\NewMail;

NewMail::addBlockHandler(&#39;AlertBlock&#39;);
```

Una vez desplegado el plugin podremos utilizar el nuevo shortcode:

```txt
[blockAlert css=&quot;alert alert-warning&quot; style=&quot;border: 1px solid #f59e0b; padding: 10px;&quot;]
Recuerda revisar los datos antes de confirmar.
[/blockAlert]
```

El nombre debe mantener la correspondencia `AlertBlock` → `[blockAlert]`. El método `fromShortcode()` recibe los atributos como array y el contenido interno como texto.