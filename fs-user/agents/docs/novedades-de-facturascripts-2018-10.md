---
id: 91
permalink: novedades-de-facturascripts-2018-10
title: Novedades de FacturaScripts 2018.10
creationdate: 03-09-2019 10:13:05
lastmod: 29-12-2020
url: https://facturascripts.com/publicaciones/novedades-de-facturascripts-2018-10
---

En esta ocasión hemos mejorado el proceso de creación de clientes/proveedores mientras se crea una factura. Podemos **vincular los usuarios con un almacén** y con un **agente**. Ahora se incluye el **plan contable predeterminado** para España. Los asientos se pueden imprimir, así como las regularizaciones de IVA. Y los **emails** tienen ahora un **diseño más bonito**.

## Vinculación del usuario
Ahora podemos **vincular un usuario con un almacén**, además de con una empresa. Al crear nuevas facturas se selecciona automáticamente ese almacén. También podemos **vincular al usuario con un agente**, de forma que las nuevas facturas queden vinculadas a ese agente.

## Plan contable predeterminado
Hemos incluido el **plan contable predeterminado** para España. Ahora desde el ejercicio, al importar un plan contable, si no seleccionamos ninguno se usa el predeterminado.

## Regularización de impuestos
La regularización de impuestos, o **trimestre de IVA**, está disponible en el menú Contabilidad &gt; Impuestos, pestaña Regularización. En esta actualización hemos mejorado la visualización del informe, así como la impresión. Este informe se puede usar para enviar a nuestro gestor, ya que incluye el desglose de IVA y las facturas de compra y de venta del trimestre.

## Envío de emails
En las preferencias de la aplicación, en la sección email, ahora podemos establecer la **firma predeterminada**. Es decir, el texto que se va a adjuntar a cada email enviado. Podemos usar este campo para incluir ahí la tiípica coletilla de la **ley de protección de datos**.

También se ha mejorado el diseño de los emails enviados y se han añadido nuevas opciones para facilitar la composición de emails desde plugins.

## Cambios internos y para programadores
- [Se ha añadido la función toolBox() a controladores y modelos](https://facturascripts.com/publicaciones/nueva-clase-toolbox-para-agrupar-log-traductor-y-varias-herramientas), para integrar ahí el log, el traductor, etc...
- Al constructor del controlador se le han quitados los parámetros $cache, $i18n y $log.

## Actualizar desde la versión 2017
FacturaScripts 2017 todavía tiene más plugins que la versión 2018. Por ese y otros motivos no hemos modificado el actualizador de FacturaScripts 2017 para poder pasar a la nueva versión.

Si quiere probar, le recomendamos los siguientes pasos:
- [Haga una copia de seguridad](https://facturascripts.com/doc/2/copias-de-seguridad/como-hacer-una-copia-de-seguridad-de-facturascripts).
- **Instale FacturaScripts 2018** usando la misma base de datos.
- Instale el [plugin FS2017Migrator](https://facturascripts.com/plugins/FS2017Migrator).

También puede probar con una [instalación de pruebas de FacturaScripts](https://facturascripts.com/CloudManager) en nuestra nube privada.
