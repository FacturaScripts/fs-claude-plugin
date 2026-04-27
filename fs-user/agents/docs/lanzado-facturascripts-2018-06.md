---
id: 86
permalink: lanzado-facturascripts-2018-06
title: Lanzado FacturaScripts 2018.06
creationdate: 31-07-2019 10:07:32
lastmod: 29-12-2020
url: https://facturascripts.com/publicaciones/lanzado-facturascripts-2018-06
---

Esta actualización trae **validación de múltiples campos**, como son el **IBAN**, CIF, DNI y NIF. Además de múltiples mejoras en el tratamiento de recibos y un largo etcétera.

## Validación de campos
Desde el menú administrador &gt; ids fiscales, ahora podemos marcar cuales de ellos queremos que se validen. De esta forma cada vez que creemos un cliente o proveedor se comprobará que su **identificador fiscal** sea válido.

## Mejoras en recibos
- Ahora podemos **crear múltiples recibos** con dos clics desde la pestaña recibos de la factura.
- También desde la pestaña recibos, ahora podemos **marcar como pagados** los recibos directamente.
- Podemos crear o marcar **formas de pago** como pagadas, de forma que los recibos que se creen lo hagan directamente pagados.

## Regularización de impuestos
Ya está completada la regularización de impuestos (el **trimestre de IVA** o modelo 303). Podemos crear nuevas regularizaciones de impuestos desde el menú contabilidad &gt; impuestos, en la pestaña regularizaciones.

## Internacionalización
En esta actualización se ha añadido soporte inicial para **Costa Rica**, y se ha actualizado el soporte para **Colombia**, República Dominicana y Uruguay.

## El actualizador
El actualizador de FacturaScripts ahora soporta **actualizaciones beta** para el núcleo o los plugins. Estas actualizaciones beta aparecen marcadas en amarillo y con el botón beta.

## Otros cambios
- Ahora podemos especificar la **forma de pago** y **divisa** directamente al crear nuevas facturas, albaranes, etc.
- Al imprimir facturas, albaranes, etc, ahora se abre en una **nueva pestaña**.
- La ficha de **subcuenta** muestra ahora las líneas de asientos (partidas) referentes a esa subcuenta.

## Cambios internos y para programadores
- Se ha mejorado el soporte para **PostgreSQL**.
- Las columnas de **tipo serial** ya no necesitan la etiqueta **default** en el [xml de la tabla](https://facturascripts.com/doc/1/desarrollo-sobre-facturascripts-2018/creacion-de-plugins/los-modelos/la-definicion-de-la-estructura-de-la-tabla).
- Mejorada la comprobación de los **archivos zip** de los plugins para evitar formatos o estructuras no válidas.
- [DataBaseWhere](https://facturascripts.com/doc/1/desarrollo-sobre-facturascripts-2018/creacion-de-plugins/acceso-a-la-base-de-datos/databasewhere) ahora transforma &quot;= null&quot; en &quot;is null&quot; y &quot;!= null&quot; en &quot;is not null&quot;. Además se ha añadido el operador XLIKE, que hace lo mismo que LIKE, pero separando las palabras, es decir, si estás buscando &quot;gran caja&quot; encuentra tanto resultados que ponga &quot;gran caja&quot; como &quot;caja grande&quot;.

## Actualizar desde la versión 2017
FacturaScripts 2017 todavía tiene más plugins que la versión 2018. Por ese y otros motivos no hemos modificado el actualizador de FacturaScripts 2017 para poder pasar a la nueva versión.

Si quiere probar, le recomendamos los siguientes pasos:
- [Haga una copia de seguridad](https://facturascripts.com/doc/2/copias-de-seguridad/como-hacer-una-copia-de-seguridad-de-facturascripts).
- **Instale FacturaScripts 2018** usando la misma base de datos.
- Instale el [plugin FS2017Migrator](https://facturascripts.com/plugins/FS2017Migrator).

También puede probar con una [instalación de pruebas de FacturaScripts](https://facturascripts.com/CloudManager) en nuestra nube privada.
