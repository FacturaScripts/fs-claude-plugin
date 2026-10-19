---
id: 1587
permalink: cambiar-los-textos-de-las-plantillas-de-emails
title: Cambiar los textos de las plantillas de emails
creationdate: 14-10-2023 12:51:05
lastmod: 03-09-2026
url: https://facturascripts.com/publicaciones/cambiar-los-textos-de-las-plantillas-de-emails
---
FacturaScripts utiliza unos textos predeterminados a la hora de enviar por email facturas, albaranes, pedidos o presupuestos. Estos textos se pueden modificar desde el **menú Administrador** → **Emails**, pestaña **Notificaciones**.

![notificaciones de email](https://i.imgur.com/J7ujbd5.png)

Existe una plantilla de email distinta para cada tipo de documento: factura, albarán, pedido y presupuesto. Haga clic cualquiera para editar el texto.

![ejemplo plantilla notificación factura](https://i.imgur.com/E08mQKW.png)

Las palabras entre llaves son **shortcodes**: se sustituyen por el dato correspondiente antes de enviar el email. Funcionan tanto en el **asunto** como en el **cuerpo** del mensaje.

- **{code}**: el código del documento (la factura, albarán, pedido o presupuesto).
- **{name}**: el nombre del cliente o del proveedor.
- **{date}**: la fecha del documento.
- **{total}**: el importe total del documento.
- **{number2}**: el número de documento del cliente o del proveedor, si lo has anotado en el documento.
- **{contact_name}**: el nombre del contacto de facturación.
- **{contact_surname}**: los apellidos del contacto de facturación.

Si un dato no existe en ese documento (por ejemplo, no hay contacto de facturación), el shortcode se sustituye por texto vacío, no se queda escrito en el email.

### ⚠️ La plantilla tiene que estar activa
Cada plantilla tiene una casilla **Activo**. Si la desactivas, FacturaScripts no la usa: vuelve a los textos por defecto que trae el programa traducidos. Es decir, desactivar la plantilla de un documento no impide enviar ese tipo de email, solo deja de aplicar tu texto personalizado.

## Otras notificaciones
Algunos plugins como [el plugin CRM incluyen sus propias notificaciones](https://facturascripts.com/publicaciones/como-configurar-las-notificaciones-del-crm) que también se pueden personalizar. Estos textos se utilizan para enviar los emails automáticamente, por lo que si no queremos que se envíe un tipo de email, simplemente desactivamos esa notificación.

![ejemplo notificación del CRM](https://i.imgur.com/bXPnHoA.png)

## Ver también

- [Envío de emails](https://facturascripts.com/publicaciones/envio-de-emails)
- [ShortCodes para bloques de email](https://facturascripts.com/publicaciones/shortcodes-para-bloques-de-email)
- [Cambiar el logotipo y LOPD](https://facturascripts.com/publicaciones/logotipo-y-lopd-299)