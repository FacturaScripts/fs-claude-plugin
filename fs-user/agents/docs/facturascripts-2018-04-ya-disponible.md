---
id: 73
permalink: facturascripts-2018-04-ya-disponible
title: FacturaScripts 2018.04 ya disponible
creationdate: 17-06-2019 13:37:19
lastmod: 29-12-2020
url: https://facturascripts.com/publicaciones/facturascripts-2018-04-ya-disponible
---

En esta actualización hemos añadido soporte para **recibos de facturas**, **comisiones de agentes** y **liquidación** de esas comisiones.

## Recibos de facturas
Hemos integrado parte del **plugin tesorería** en el núcleo. Ahora para cada factura se genera un **recibo**. Podemos modificar el recibo y reducir el importe para añadir más recibos, podemos marcar el recibo como **pagado** y la factura se actualizará, etc. Por cada modificación del recibo, ya sea marcar pagado o impagado, se generará un **asiento de pago** o de devolución.

La fecha de vencimiento ha sido eliminada de las facturas, ahora son los recibos los que tienen fecha de vencimiento y esta se calcula en base a la forma de pago y se ajusta en base a los **días de pago** configurados en el **cliente** (1,15,31).

Los recibos ahora están disponibles en la pestaña recibos de los listados de facturas y también podemos ver los recibos de cada cliente o proveedor en sus respectivas pantallas.

## Plugin tesorería
El plugin tesorería estará disponible el mes que viene. Este plugin integra el sistema de **plazos de pago** (30-60-90, 50% al inicio, 50% al final, etc...) y las remesas bancarias.

## Comisiones de agentes
En lugar de tener una comisión por agente, hemos añadido un **nuevo sistema de comisiones** por empresa, cliente, familia o producto. De esta forma se podrá establecer una comisión general para un agente, pero una distinta si vende productos de tal familia o si vende tal producto en concreto.

Las comisiones de cada documento de venta se calculan ahora al momento y se pueden ver en la pestaña detalles. También están disponibles en los listados, aunque las columnas están ocultas por defecto, pero podemos activarlas desde las opciones.

Además ahora se puede previsualizar la **liquidación** de las comisiones y generar la factura correspondiente.

## Otras mejoras
- Se han añadido nuevos filtros a los listados de clientes y proveedores.
- Ahora se pueden renumerar los asientos de un ejercicio concreto o de todos los ejercicios abiertos.
- La exportación del plan contable de un ejercicio se realiza ahora con formato csv.

## Mejoras para programadores
- Los botones ahora permiten el parámetro &quot;confirm&quot;, para indicar que al pulsar el botón se debe mostrar una ventana solicitando confirmación al usuario.
- Se ha añadido el método getClientIp() a la clase IPFilter, para devolver la IP real del usuario. El motivo es que el método getClientIp() de la clase request de symfony no tiene en cuenta las cabeceras propias de cloudflare, y la IP que ofrece no es la real.
- El método disableColumn() de las pestañas de los controladores extendidos ahora tiene un tercer parámetro para indicar si lo que queremos es marcar el campo como no editable.

## Actualizar desde la versión 2017
FacturaScripts 2017 todavía tiene más plugins que la versión 2018. Por ese y otros motivos no hemos modificado el actualizador de FacturaScripts 2017 para poder pasar a la nueva versión.

Si quiere probar, le recomendamos los siguientes pasos:
- [Haga una copia de seguridad](https://facturascripts.com/doc/2/copias-de-seguridad/como-hacer-una-copia-de-seguridad-de-facturascripts).
- **Instale FacturaScripts 2018** usando la misma base de datos.
- Instale el [plugin FS2017Migrator](https://facturascripts.com/plugins/FS2017Migrator).

También puede probar con una [instalación de pruebas de FacturaScripts](https://facturascripts.com/CloudManager) en nuestra nube privada.
