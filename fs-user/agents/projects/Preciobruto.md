---
idproject: 500
name: Preciobruto
permalink: preciobruto
creationdate: 16-12-2025
lastmod: 23-07-2026
version: 1.5
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/Preciobruto
---
Muestra en la línea el precio de compra, el descuento de compra y el % aumento, también nuestro precio de coste y beneficio, y podemos cambiar estos, por ejemplo un margen de beneficio menor para ese artículo y esa línea del documento de venta. Cuando no tengamos referencia calcula el precio en la línea con Precio bruto, Dto. proveedor y Aumento, para productos.

Este plugin es Útil para cuando NO queramos dar de alta un servicio o producto ocasional (con su referencia en el almacén) y queramos guardar el precio de coste y nuestro importe de beneficio sobre la misma línea para que calcule automáticamente su precio o pvp unitario, o queramos ver visualmente los valores de un producto con referencia.

Si es un artículo proveniente de una compra ocasional:
Introduciremos en la misma línea como de forma normal, la descripción, cantidad y ahora su Precio bruto, el descuento de nuestro proveedor que nos hace de ese artículo, el % de ganancia que queramos aplicar (beneficio), y también si queremos podemos colocar el origen: el proveedor y una referencia de este.

También puede servir para introducir una descripción con su importe de coste asociado, y el aumento beneficio o ganancia que queramos aplicar: para ello rellenaríamos el Precio bruto, aplicariamos un descuento del 0% (con lo que el precio bruto sería nuestro precio de coste), y luego nuestra ganancia.

El plugin calcula también el Coste total y los Beneficios, de estas líneas de productos sin referencias asociadas que llevan el precio bruto, en el pie de página.

A la hora de imprimir el documento: albarán, facturas, pedidos, presupuestos, etc, solo se muestran los campos normales definidos: Cantidades, Descripción, Precio unitario (pvp) etc, con lo que estos campos del plugin Preciobruto quedan ocultos para el cliente en la impresión final ya que solo sirven para definir el precio o pvp unitario de este producto ocasional sin estar dado de alta en el almacén.

Si introducimos un artículo que ya está guardado en el almacén, es decir, que tenga Referencia, mostrará en estos campos el precio bruto, el descuento de proveedor y el Margen de beneficio ganancia que hayamos introducido en la ficha del producto referenciado, pudiendo cambiar estos para esa línea, campos que crearán el precio unitario para el cliente.

Notas: 
Si queremos saber el precio de coste o neto del artículo se puede ver este a través del modal, botón con los tres puntos al final de la línea.
Para que se calculen los campos es necesario pulsar Enter o TAB, o se actualizarán al guardar el documento.