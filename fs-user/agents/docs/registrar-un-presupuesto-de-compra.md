---
id: 2625
permalink: registrar-un-presupuesto-de-compra
title: Cómo registrar un presupuesto de compra
creationdate: 10-03-2026 17:56:10
lastmod: 10-07-2026
url: https://facturascripts.com/publicaciones/registrar-un-presupuesto-de-compra
---
Un presupuesto de compra es un presupuesto que registra la solicitud de compra de productos o servicios a un proveedor. Puedes registrar un presupuesto de compra desde el menú `Compras → Presupuestos`.

## 🧾 Pasos para crear un presupuesto
Pulsa el botón `Nuevo` desde el listado de presupuestos, en el menú `Compras → Presupuestos`.

![Nuevo Presupuesto](https://i.ibb.co/mJy0qfn/Nuevo.png)

### 👤 Agregar proveedor
En la siguiente pantalla busca y selecciona un proveedor, o pulsa el botón `Nuevo` para [crear un proveedor](https://facturascripts.com/publicaciones/como-crear-un-proveedor-o-acreedor). Una vez seleccionado el proveedor, puedes añadir los productos o conceptos al presupuesto:

![Agregar proveedor](https://imgur.com/ScjneL3.jpg)

### 📦 Agregar productos al presupuesto
- Para añadir un producto puedes escribir su referencia en el campo `Referencia`, o pulsar el icono del libro para mostrar el buscador de productos y seleccionarlo desde ahí.
- Para añadir un concepto, pulsa el botón `Línea`.
- Haz clic en el campo `Código de barras` si quieres añadir productos mediante su código de barras.

![Nueva Linea presupuesto](https://i.imgur.com/gEIjpTq.png)

### 📚 Lista de productos
Como hemos comentado, si haces clic en el icono del libro del campo `Referencia`, se abrirá el buscador de productos. Para añadir un producto al presupuesto, simplemente haz clic. Ten en cuenta que solo aparecerán los productos que tengas marcados como `se compra` y no bloqueados. El stock que aparece es el del almacén seleccionado, junto con el precio de coste actual.

![Lista de Productos en presupuesto](https://imgur.com/fdgGXte.jpg)

### ❓ ¿Todavía no tienes productos?
Si todavía no tienes productos en tu lista, puedes añadirlos desde el [listado de productos](https://facturascripts.com/publicaciones/tu-primer-producto-431), en el menú `Almacén → Productos`.

### 🧮 Líneas del presupuesto
En cada línea tienes la referencia (del producto), la descripción del producto o concepto, la cantidad (y el stock), el precio sin impuestos, el porcentaje de descuento, el impuesto y el subtotal con impuestos:

- Para escribir un precio con IVA incluido, haz clic en el campo `Subtotal`: se desplegará una ventana donde puedes indicar el precio con el IVA incluido.
- Para asignar recargo de equivalencia, haz clic en el botón `...` de la línea y rellena el campo `% R.E.`
- Para asignar una retención de IRPF, haz clic en el botón `...` y selecciona el IRPF en el campo `Retención`.
- Para marcar una línea como suplido o con inversión del sujeto pasivo, haz clic en el botón `...` y activa la opción correspondiente.

### 🗂️ Campos del presupuesto
- `Proveedor`: el proveedor al que compras la mercancía. Puedes cambiarlo pulsando el icono del lápiz.
- `Detalles`: si haces clic en el botón `Detalles` podrás modificar otros campos del presupuesto, como la hora, la razón social, el CIF/NIF, la divisa, etc.
- `Serie`: la [serie de facturación](https://facturascripts.com/publicaciones/series-470) en la que incluir este presupuesto.
- `Fecha`.
- `Núm. proveedor`: un campo opcional donde puedes escribir lo que quieras. Algunos escriben el número de expediente del proveedor o del proyecto, otros el número de matrícula del coche o la moto, etc.
- [Forma de pago](https://facturascripts.com/publicaciones/formas-de-pago-729).
- `Dto. global`: porcentaje de descuento global del presupuesto. Se aplica después de los descuentos por línea.

## 🔄 Estados
Los nuevos presupuestos se crean en estado `Abierto` para que puedas añadir y quitar líneas hasta completarlos. Cuando el proveedor haya aceptado el presupuesto y quieras generar un pedido o una factura —o marcarlo como `Cancelado`—, haz clic en el botón `Abierto` (arriba a la derecha) y cambia al siguiente estado.

![Estados del presupuesto](https://i.imgur.com/rtbMR3Y.png)

El presupuesto quedará bloqueado; para volver a editarlo, tendrás que eliminar antes el documento generado.

## ✂️ Agrupar o partir
Esta opción permite crear un pedido o un albarán uniendo varios presupuestos, o usar solo algunos productos del presupuesto para crear el pedido o el albarán.

![Agrupar o Partir](https://i.imgur.com/xpmSvgD.png)