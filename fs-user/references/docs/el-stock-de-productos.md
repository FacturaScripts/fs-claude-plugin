---
id: 2034
permalink: el-stock-de-productos
title: El stock del producto
creationdate: 31-01-2025 19:57:15
lastmod: 21-09-2026
url: https://facturascripts.com/publicaciones/el-stock-de-productos
---
El stock de un producto es un aspecto fundamental en la gestión de inventario. FacturaScripts permite controlar la disponibilidad de los productos en distintos almacenes, gestionarla por variante y ver de dónde viene cada cantidad.

Puedes ver el stock de un producto en su ficha, en el **menú Almacén → Productos**, pestaña **Stock**. También tienes una pestaña **Stock** en el propio listado de productos, para verlo todo de golpe.

![Stock de producto](https://i.imgur.com/ca2CTUb.gif)

## 🔢 Las cuatro cantidades del stock

Esto es lo que más confusión genera, y conviene entenderlo antes de nada. Cada línea de stock (una variante en un almacén) tiene cuatro cantidades:

- **Cantidad**: las unidades físicas que hay ahora mismo en el almacén.
- **Reservado**: unidades ya comprometidas en pedidos de cliente, que todavía no han salido.
- **Pendiente recepción**: unidades que vienen de camino en pedidos a proveedor, que todavía no han entrado.
- **Disponible**: lo que realmente puedes vender. **No se escribe a mano, se calcula**: es la cantidad menos lo reservado.

Es decir, si tienes 10 unidades y 3 están reservadas en pedidos de clientes, la cantidad es 10 y el disponible es 7. El disponible nunca baja de 0.

Además puedes fijar el **stock mínimo** y el **stock máximo** de cada variante en cada almacén, y la **ubicación** dentro del almacén. Con el mínimo y el máximo, FacturaScripts puede avisarte de faltantes y excesos en los módulos que lo necesiten.

![Stock por variante](https://i.imgur.com/j8dQG14.png)

## 🔄 Quién mueve el stock

Las cantidades no se tocan a mano: las mueven los documentos según el [estado del documento](https://facturascripts.com/publicaciones/estados-del-documento-680) en que estén. Cada estado tiene un campo **Actualizar stock** y es ahí donde se decide a qué cantidad afecta:

- **Sumar** y **Restar** modifican la **Cantidad**, el stock físico. Es lo que hacen los albaranes y las facturas.
- **Prever** suma a **Pendiente recepción**. Es lo típico de un pedido a proveedor aprobado: la mercancía aún no ha llegado, pero ya sabes que viene.
- **Reservar** suma a **Reservado**. Es lo típico de un pedido de cliente aprobado: la mercancía sigue en el almacén, pero ya está vendida.
- **No hacer nada** deja el stock igual, como en un presupuesto.

Por eso, cuando un pedido se convierte en albarán, la unidad deja de estar *reservada* y se *resta* de la cantidad física: no se cuenta dos veces.

Si el stock de un producto no cuadra con lo que esperas, el sitio donde mirar es la configuración de **Actualizar stock** de tus estados, no el propio stock.

### 🔍 De dónde viene cada número

En la ficha del producto tienes dos pestañas que te dicen exactamente qué documentos están detrás de esas cantidades:

- **Reservado**: las líneas de pedidos de cliente que mantienen unidades reservadas, con la cantidad pedida y la ya servida.
- **Pendiente recepción**: las líneas de pedidos a proveedor que están pendientes de recibir.

Si el reservado o el pendiente te parecen raros, entra en estas pestañas y verás el pedido concreto que lo provoca.

## 🏬 Stock por almacén

Cada producto puede estar presente en uno o varios almacenes y tener un stock independiente en cada uno. Así conoces tanto el stock total de un producto como su reparto por almacén.

Cada vez que se crea una empresa se genera automáticamente un almacén asociado, pero una empresa puede tener varios: ver [cómo crear un almacén](https://facturascripts.com/publicaciones/como-crear-un-almacen).

![Pantalla creación almacenes](https://i.imgur.com/XDukDrM.png)

## 🎨 El stock se lleva por variante

El stock no se guarda por producto, sino por [variante](https://facturascripts.com/publicaciones/las-variantes-de-productos). Al crear un producto se genera su primera variante automáticamente, y si añades más (por talla, color…) cada una lleva su propio stock en cada almacén.

El campo **Stock** que ves en la ficha del producto es la suma de todas sus variantes.

## 🚫 Productos sin control de stock

No todos los productos necesitan stock. En la ficha del producto tienes dos casillas relacionadas:

- **No controlar stock**: para servicios y todo aquello de lo que no tiene sentido llevar inventario. El programa deja de registrar movimientos de ese producto.
- **Permitir venta sin stock**: el producto sí lleva stock, pero te deja venderlo aunque el disponible sea 0. El valor por defecto para los productos nuevos se configura en el [panel de control](https://facturascripts.com/publicaciones/el-panel-de-control), sección *Productos*.

## 📦 Movimientos de stock y transferencias

Una gestión eficiente de almacenes requiere poder mover existencias entre almacenes y ajustar el inventario. Para eso está el [plugin gratuito StockAvanzado](https://facturascripts.com/plugins/stockavanzado), que añade:

- [Ver todos los movimientos de stock de un producto](https://facturascripts.com/publicaciones/como-ver-los-movimientos-de-stock-de-un-producto)
- [Transferencias de stock entre almacenes](https://facturascripts.com/publicaciones/como-hacer-una-transferencia-de-stock-entre-almacenes)
- [Hacer inventario](https://facturascripts.com/publicaciones/como-hacer-inventario-del-almacen)
- [Inventario valorado](https://facturascripts.com/publicaciones/como-hacer-un-inventario-valorado)

## Ver también

- [Cómo crear un producto o variante](https://facturascripts.com/publicaciones/tu-primer-producto-431)
- [Las variantes de productos](https://facturascripts.com/publicaciones/las-variantes-de-productos)
- [Estados del documento](https://facturascripts.com/publicaciones/estados-del-documento-680)
- [Cómo crear un almacén](https://facturascripts.com/publicaciones/como-crear-un-almacen)
- [Menú Almacén](https://facturascripts.com/publicaciones/almacenes-128)