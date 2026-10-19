---
id: 1183
permalink: politicas-de-precios-de-coste
title: Políticas de precios de coste
creationdate: 03-06-2022 17:47:18
lastmod: 03-09-2026
url: https://facturascripts.com/publicaciones/politicas-de-precios-de-coste
---
Puedes hacer que los precios de coste de tus productos se actualicen automáticamente con cada nueva compra. ¿Cómo? Seleccionando una política de precios de coste en el **menú Administrador → Panel de control**, sección *Productos*. Tienes varias opciones a elegir:

![Selector de la política de precios de coste en el Panel de control](https://i.imgur.com/iYUOV12.png)

⚠️ También debes marcar la opción **actualizar precios de proveedores**, que está justo al lado en esa misma sección del [panel de control](https://facturascripts.com/publicaciones/el-panel-de-control). Es imprescindible: los cálculos se hacen sobre los precios de tus proveedores, así que si esa casilla está desmarcada FacturaScripts no registra el precio de la compra y **la política no se aplica nunca**. Si has elegido una política y ves que el coste no cambia, esto es lo primero que hay que revisar.

Si no seleccionas ninguna política, el precio de coste no se calcula solo: lo introduces a mano en la variante del producto.

## 🕒 Último precio de compra
El precio de coste del producto será el último precio al que se lo hayas comprado a cualquier proveedor.

## ⚖️ Precio medio de compra
El precio de coste del producto será la media de los precios de compra a los distintos proveedores del producto.

## 📦 Precio de coste real
El precio de coste del producto será la media de los precios de compra de las unidades que tengas en stock. Es decir, si tienes 2 unidades, una la compraste a 5€ y la otra a 15€, el precio de coste será 10€.

## 🔝 Precio más alto
El precio de coste del producto será siempre el precio de compra más alto que tenga alguno de sus proveedores. Es decir, si para un producto tienes un proveedor que lo vende a 5€ y otro a 7€, el precio de coste del producto será 7€.

## 🧾 Precio de compra y precio de coste no son lo mismo

FacturaScripts los guarda por separado:

- El **precio de compra** es lo que te cobra cada proveedor, y se guarda por proveedor en la ficha del producto.
- El **precio de coste** es un dato de la variante del producto, uno solo, y es el que se usa para calcular márgenes y beneficios.

La política de precio de coste es precisamente la regla que decide cómo se pasa de lo primero a lo segundo cuando tienes varios proveedores o varias compras a distinto precio.

## Ver también

- [El Panel de control](https://facturascripts.com/publicaciones/el-panel-de-control)
- [Los precios de los productos](https://facturascripts.com/publicaciones/los-precios-del-producto)
- [Cómo registrar una factura de compra](https://facturascripts.com/publicaciones/como-registrar-una-factura-de-compra)
- [Menú Compras](https://facturascripts.com/publicaciones/menu-compras)