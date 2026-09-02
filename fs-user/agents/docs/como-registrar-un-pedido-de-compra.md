---
id: 2624
permalink: como-registrar-un-pedido-de-compra
title: Cómo registrar un pedido de compra
creationdate: 10-03-2026 17:53:00
lastmod: 10-07-2026
url: https://facturascripts.com/publicaciones/como-registrar-un-pedido-de-compra
---
Un pedido de compra es un pedido que registra la solicitud de compra de productos o servicios a un proveedor. Puedes añadir pedidos de compra desde el menú `Compras → Pedidos`.

## 🧾 Pasos para crear un pedido
Pulsa el botón `Nuevo` desde el listado de pedidos, en el menú `Compras → Pedidos`.

![Nuevo pedido](https://imgur.com/n6oZ6OZ.png)

### 👤 Agregar proveedor
En la siguiente pantalla busca y selecciona un proveedor, o pulsa el botón `Nuevo` para [crear un proveedor](https://facturascripts.com/publicaciones/como-crear-un-proveedor-o-acreedor). Una vez seleccionado el proveedor, puedes añadir los productos o conceptos al pedido:

![Agregar proveedor](https://imgur.com/ScjneL3.jpg)

### 📦 Agregar productos al pedido
- Para añadir un producto puedes escribir su referencia en el campo `Referencia`, o pulsar el icono del libro para mostrar el buscador de productos y seleccionarlo desde ahí.
- Para añadir un concepto, pulsa el botón `Línea`.
- Haz clic en el campo `Código de barras` si quieres añadir productos mediante su código de barras.

![Nueva Linea Pedido](https://i.imgur.com/IapnLH1.png)

### 📚 Lista de productos
Como hemos comentado, si haces clic en el icono del libro del campo `Referencia`, se abrirá el buscador de productos. Para añadir un producto al pedido, simplemente haz clic. Ten en cuenta que solo aparecerán los productos que tengas marcados como `se compra` y no bloqueados. El stock que aparece es el del almacén seleccionado, junto con el precio de coste actual.

![Lista de Productos en pedido](https://imgur.com/fdgGXte.jpg)

### ❓ ¿Todavía no tienes productos?
Si todavía no tienes productos en tu lista, puedes añadirlos desde el [listado de productos](https://facturascripts.com/publicaciones/tu-primer-producto-431), en el menú `Almacén → Productos`.

### 🧮 Líneas del pedido
En cada línea tienes la referencia (del producto), la descripción del producto o concepto, la cantidad, el precio sin impuestos, el porcentaje de descuento, el impuesto y el subtotal con impuestos:

- Para escribir un precio con IVA incluido, haz clic en el campo `Subtotal`: se desplegará una ventana donde puedes indicar el precio con el IVA incluido.
- Para asignar un 2.º descuento, haz clic en el botón `...` y rellena el campo `% Dto. 2`.
- Para asignar recargo de equivalencia, haz clic en el botón `...` de la línea y rellena el campo `% R.E.`
- Para asignar una retención de IRPF, haz clic en el botón `...` y selecciona el IRPF en el campo `Retención`.
- Para agregar una excepción de IVA, haz clic en el botón `...` y selecciona la opción en el campo `Excepción de IVA`.
- Para marcar una línea como suplido o con inversión del sujeto pasivo, haz clic en el botón `...` y activa la opción correspondiente.

### 🗂️ Campos del pedido
- `Proveedor`: el proveedor al que compras la mercancía. Puedes cambiarlo pulsando el icono del lápiz.
- `Detalles`: si haces clic en el botón `Detalles` podrás modificar otros campos del pedido, como la hora, la razón social, el CIF/NIF, la divisa, etc.
- `Serie`: la [serie de facturación](https://facturascripts.com/publicaciones/series-470) en la que incluir este pedido.
- `Fecha`.
- `Núm. proveedor`: un campo opcional donde puedes escribir lo que quieras. Algunos escriben el número de expediente del proveedor o del proyecto, otros el número de matrícula del coche o la moto, etc.
- [Forma de pago](https://facturascripts.com/publicaciones/formas-de-pago-729).
- `Dto. global`: porcentaje de descuento global del pedido. Se aplica después de los descuentos por línea.

## 🔄 Estados
Los nuevos pedidos se crean en estado `Abierto` para que puedas añadir y quitar líneas hasta completarlos. Cuando el proveedor haya aceptado el pedido y quieras generar un albarán o una factura —o marcarlo como `Cancelado`—, haz clic en el botón `Abierto` (arriba a la derecha) y cambia al siguiente estado.

![Estados del pedido](https://i.imgur.com/rzuz0NW.png)

El pedido quedará bloqueado; para volver a editarlo, tendrás que eliminar antes el documento generado.

## ✂️ Agrupar o partir
Esta opción permite crear un albarán o una factura uniendo varios pedidos, o usar solo algunos productos del pedido para crear el albarán o la factura.

![Agrupar o Partir](https://i.imgur.com/2KmWTg3.png)