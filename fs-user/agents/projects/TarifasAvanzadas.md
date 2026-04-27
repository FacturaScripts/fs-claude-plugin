---
idproject: 89
name: TarifasAvanzadas
permalink: tarifasavanzadas
creationdate: 07-07-2020
lastmod: 24-04-2026
version: 2.4
betaversion: 2.41
mincore: 2025.81
maxcore: 2026
compatible: CSVimport
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/TarifasAvanzadas
---

Añade gestión de descuentos de venta, ya sea por cliente, por grupo de clientes, por familia, por producto, por fecha o incluso descuentos generales. Los descuentos se pueden acumular o no, y con las prioridades podemos indicar qué descuentos queremos aplicar antes que otros o colocar excepciones.

Ejemplos que se pueden conseguir con este plugin:
- Descuento del 5% para todas las compras de un cliente concreto.
- Descuento del 10% para todas las compras de un grupo de clientes, excepto en la familia BOX, que será del 2%.
- Descuento general del 7% para todas las ventas durante el black friday.
- Descuento del 20% para las ventas del producto 123 hasta final de mes.
- Descuento del 15% para el cliente Pepe cuando compra el producto 222.

Este plugins añade la sección de precios en los productos. Desde esta sección puede modificar los precios y tarifas de las variantes del producto.

Además este plugin amplia las opciones de tarifas de venta. Las tarifas en FacturaScripts son fórmulas para calcular precios de venta distintos al general.
- Permite definir reglas distintas por familias. Por ejemplo, podemos indicar que para la familia 123 queremos un descuento del 5%, mientras que para el resto queremos un 10%.
- Permite definir precios fijos por tarifa en productos.
- Permite indicar los precios finales con impuestos incluidos, es decir, podemos indicar que queremos que un producto se venda a 10€. El precio sin IVA se calculará automáticamente.
