---
id: 787
permalink: logotipo-y-lopd-299
title: Cambiar el logotipo y LOPD
creationdate: 30-10-2019 00:00:00
lastmod: 03-09-2026
url: https://facturascripts.com/publicaciones/logotipo-y-lopd-299
---
Puede cambiar el logotipo desde la configuración de la empresa. Para ello haga clic en el **menú Administrador, Empresas**, a continuación, haga clic en la empresa que desea cambiar. En la siguiente pantalla, haga clic en el **botón seleccionar**, en el campo logotipo (situado en la parte derecha) y seleccione el archivo del logotipo. No olvide pulsar el botón guardar.

- El logotipo debe ser una imagen **jpg, png o gif**. Otros formatos, como webp o svg, no se aceptan aquí.
- Se recomienda que el tamaño en pixeles no sea mayor a 1024x1024.
- El tamaño máximo del archivo lo marca la configuración de PHP de tu servidor, normalmente 2MB. Si necesitas subir algo más grande, mira [cómo aumentar el límite de subida de archivos](https://facturascripts.com/publicaciones/aumentar-el-limite-de-subida-de-archivos).
- Si el logotipo tiene fondo transparente, usa png: el jpg no admite transparencia y el fondo saldrá negro o blanco.

![añadir logotipo empresa facturascript](https://i.imgur.com/Ho2u8yK.gif)

Al imprimir facturas se utiliza el logotipo de la empresa de la factura.

Los logotipos se guardan en la [biblioteca de archivos](https://facturascripts.com/publicaciones/la-biblioteca-de-archivos), así que puedes subirlos una vez y reutilizarlos, y el botón **seleccionar** te deja elegir entre los que ya tengas subidos.

### 🖨️ Un logotipo distinto por formato de impresión
Además del logotipo de la empresa, cada [formato de impresión](https://facturascripts.com/publicaciones/los-formatos-de-impresion-de-facturascripts) puede tener el suyo. Si un formato tiene logotipo propio, ese es el que se usa en los documentos que lo utilicen, por delante del de la empresa. Es la forma de tener marcas distintas por serie o por tipo de documento sin crear más empresas.

### ✉️ El logotipo de los emails
Los emails que envía FacturaScripts tienen también su propio logotipo, en el **menú Administrador** → **Email**, campo **logotipo**.

⚠️ Ten en cuenta que ese logo se incrusta en el email como un enlace a tu instalación: si FacturaScripts solo es accesible desde tu red local, quien reciba el email no podrá ver la imagen. El programa te avisa de esto al guardar si detecta que la instalación no es accesible desde internet.

### 🔓 La imagen de la pantalla de acceso
La imagen que se ve al iniciar sesión no es el logotipo, se configura aparte: está en el [panel de control](https://facturascripts.com/publicaciones/el-panel-de-control), sección **Avanzado**, campo **Imagen de login**. Ahí sí se admite webp además de jpg, png y gif.

&gt;
&gt;&gt; **Nota:** Para personalizar el formato de las facturas puede utilizar el plugin de [PlantillasPDF](https://facturascripts.com/plugins/plantillaspdf).
&gt;
&gt;&gt; **Nota:** Puede tener varios logos o imágenes en su Biblioteca y así cambiar el logo a usar conforme a sus necesidades en el tiempo.
&gt;

## Texto de protección de datos en facturas
Para añadir un texto en todas las facturas debe crear un nuevo formato de impresión. Para ello haga clic en el **menú Administrador**, **Panel de control**, clic en la sección **formatos de impresión** y clic en el **botón nuevo**.

![nuevo formato impresion](https://i.imgur.com/sfpTzFP.png)

A continuación escriba el texto y aplique automáticamente a facturas de cliente.

![aplicar lopd](https://i.imgur.com/z3JAINN.png)

Para aplicar también a presupuestos, pedidos y albaranes, haga lo mismo pero seleccionando presupuesto de cliente, pedido de cliente y albarán de cliente.

### Firma del email
También puede incluir el texto de protección de datos en la firma del email. Para ello haga clic en el **menú Administrador, email**. En el campo firma puede incluir el texto.

![firma email](https://i.imgur.com/sS9CVyG.png)

## Ver también

- [Empresas](https://facturascripts.com/publicaciones/empresas-524)
- [Formatos de impresión](https://facturascripts.com/publicaciones/los-formatos-de-impresion-de-facturascripts)
- [La biblioteca de archivos](https://facturascripts.com/publicaciones/la-biblioteca-de-archivos)