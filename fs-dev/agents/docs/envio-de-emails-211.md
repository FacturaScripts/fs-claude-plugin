---
id: 920
permalink: envio-de-emails-211
title: Enviar emails con NewMail
creationdate: 08-05-2021 12:06:49
lastmod: 21-10-2025
url: https://facturascripts.com/envio-de-emails-211
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
