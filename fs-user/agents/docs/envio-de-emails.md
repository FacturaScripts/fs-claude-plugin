---
id: 876
permalink: envio-de-emails
title: Envío de emails
creationdate: 17-12-2020 23:09:58
lastmod: 17-03-2026
url: https://facturascripts.com/envio-de-emails
---
Puede configurar el envío de emails en FacturaScripts desde el **menú Administrador**, **Email**. En el cual podemos usar diferentes proveedores de email, donde recibir la respuesta de email e incluso configurar email con copia. A continuación encontrará la configuración necesaria para los principales proveedores de email.

![Pantalla creación de email](https://i.imgur.com/0vLEgia.png)

## ✉️ Configurar Gmail
Google ha endurecido el proceso para enviar emails desde aplicaciones externas. Por este motivo es recomendable que [active la verificación en dos pasos en su cuenta de google](https://www.google.com/landing/2step/?hl=es). Además debe crear una [contraseña de aplicación](https://support.google.com/accounts/answer/185833?hl=es) (tipo: otros), que será la contraseña que debe introducir en el campo contraseña del formulario de email de FacturaScripts.

El resto de opciones son:

- **Usuario**: vacío
- **Host**: smtp.gmail.com
- **Puerto**: 465
- **Encriptación**: SSL
- **Envío por**: SMTP
- **Autenticación**: vacío
- **Baja seguridad**: desactivado

## ✉️ Configurar Office 365
Consulta la documentación de Microsoft. Es posible que tengas que activar la autenticación en 2 pasos y generar contraseña de aplicación.

- **Usuario**: el email
- **Host**: smtp.office365.com
- **Puerto**: 587
- **Encriptación**: TLS
- **Envío por**: SMTP
- **Autenticación**: vacío
- **Baja seguridad**: desactivado

### ⚠️ Outlook
Microsoft está actualizando las cuentas gratuitas de outlook para impedir en la práctica el envío de correos desde aplicaciones externas. Ahora requieren de autenticación mediante pantalla oauth2 alojada en azure. Pantalla que requiere de la creación de claves privadas que no se pueden distribuir y por tanto no podemos incluir en software libre.

## ✉️ Configurar IONOS
Si eres cliente de este proveedor de servicios, usa la siguiente configuración:

- **Usuario**: el email
- **Host**: smtp.ionos.es
- **Puerto**: 587
- **Encriptación**: TLS
- **Controlador de correo**: SMTP
- **Autenticación**: LOGIN
- **Baja seguridad**: desactivado

## 📫 Otros servicios de correo
Introduzca su email y la contraseña del email. A continuación rellene:
- **Usuario**: el usuario para el email. Generalmente lo que va antes de la @.
- **Host**: la dirección del servidor de correo. Si es un hosting, el host suele ser **localhost**.
- **Puerto**: generalmente el 465 si es con encriptación SSL. Alternativamente suelen ser el 25 o el 587.
- **Encriptación**: generalmente es SSL o TLS.
- **Envío por**: generalmente suele ser SMTP, pero si el hosting ofrece correo propio, entonces suele ser Mail o Sendmail.
- **Autenticación**: este campo se suele dejar en blanco, pero si obtiene el error &quot;authentication failed&quot; aunque usuario y contraseña sean correctos, entonces seleccione LOGIN.
- **Baja seguridad**: los certificados autofirmados son algo habitual en servidores dedicados, aunque poco seguros. Active esta opción si no puede conectar a su servidor de correo aunque los datos sean correctos.

### 📝 ¿Dónde obtener esta información?
Se la debe proporcionar su proveedor de email.
- Si es un hosting, suele haber una sección email en el panel de control con toda esta información.
- Si es un servicio de correo externo, suele tener una sección &quot;clientes de correo&quot; en configuración o en ayuda, con toda esta información.

### ⚠️ Problemas frecuentes
- Intentar usar gmail, pero sin verificación en dos pasos, ni contraseña de aplicación. Active la verificación en dos pasos y cree una contraseña de aplicación (tipo: otros).
- Intentar conectar con SSL pero con un puerto de TLS, o con TLS con un puerto de SSL. Su proveedor de hosting le tiene que decir claramente qué puerto usar. Cuando se está usando un puerto y encriptación incorrecto suele aparecer el mensaje ``SSL operation failed with code 1. OpenSSL Error messages:error:1408F10B:SSL routines:ssl3_get_record:wrong version number``.
	- El puerto 465 se suele usar con encriptación SSL.
	- El puerto 587 se suele usar con encriptación TLS.
- Probar solamente con SMTP. Muchos hostings llevan Mail o Sendmail y no soportan SMTP. Pruebe con los 3 antes de desistir.

### 🗑️ SPAM
Si tus correos siempre llegan a la carpeta de **no deseados** o no llegan, usa esta web para verificar los problemas:

- https://www.mail-tester.com/
