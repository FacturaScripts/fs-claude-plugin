---
id: 1587
permalink: cambiar-los-textos-de-las-plantillas-de-emails
title: Cambiar los textos de las plantillas de emails
creationdate: 14-10-2023 12:51:05
lastmod: 27-10-2025
url: https://facturascripts.com/cambiar-los-textos-de-las-plantillas-de-emails
---
FacturaScripts utiliza unos textos predeterminados a la hora de enviar por email facturas, albaranes, pedidos o presupuestos. Estos textos se pueden modificar desde el **menú Administrador** → **Emails**, pestaña **Notificaciones**.

![notificaciones de email](https://i.imgur.com/J7ujbd5.png)

Existe una plantilla de email distinta para cada tipo de documento: factura, albarán, pedido y presupuesto. Haga clic cualquiera para editar el texto.

![ejemplo plantilla notificación factura](https://i.imgur.com/E08mQKW.png)

Las palabras entre llaves serán sustituidas por el correspondiente código antes de enviar el email. Por ejemplo, ``name`` se reemplazará por el nombre del cliente y ``date`` por la fecha:

- **{name}**: el nombre del cliente.
- **{code}**: el código de la factura, albarán, pedido o presupuesto.
- **{date}**: la fecha del documento.

## Otras notificaciones
Algunos plugins como [el plugin CRM incluyen sus propias notificaciones](https://facturascripts.com/publicaciones/como-configurar-las-notificaciones-del-crm) que también se pueden personalizar. Estos textos se utilizan para enviar los emails automáticamente, por lo que si no queremos que se envíe un tipo de email, simplemente desactivamos esa notificación.

![ejemplo notificación del CRM](https://i.imgur.com/bXPnHoA.png)
