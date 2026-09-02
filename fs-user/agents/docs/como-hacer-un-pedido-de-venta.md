---
id: 1619
permalink: como-hacer-un-pedido-de-venta
title: Cómo hacer un pedido de venta
creationdate: 30-11-2023 15:00:25
lastmod: 10-07-2026
url: https://facturascripts.com/publicaciones/como-hacer-un-pedido-de-venta
---
Un pedido de venta es un documento que registra la solicitud de un cliente de comprar productos o servicios de una empresa. En FacturaScripts, los pedidos de venta se crean desde el menú `Ventas → Pedidos`.

## 🛒 Pasos para crear un pedido de venta
Pulsa el botón `Nuevo` desde el listado de pedidos, en el menú `Ventas → Pedidos`.

![crear pedido cliente](https://facturascripts.com/MyFiles/2023/11/1805.png?myft=760e1c3722f29a1be549770ea46efd9be68968ef)

### 👤 Selecciona el cliente
En el campo `Cliente`, selecciona el cliente al que vas a realizar el pedido. Si el cliente no está registrado, puedes crearlo haciendo clic en el botón `Nuevo` de la ventana de clientes.

![asignar cliente](https://facturascripts.com/MyFiles/2023/11/1806.png?myft=6ec9aac5c06054de6e3ced912a1199bad3d6219b)

### 📅 Selecciona la fecha
En el campo `Fecha`, introduce la fecha en la que se realiza el pedido.

### 📦 Añade los productos o servicios
Para añadir productos al pedido puedes escribir la referencia en el campo `Referencia`, pulsar el botón del catálogo de productos para abrir la ventana con todos los productos, o pulsar el botón `Línea` para añadir una línea en blanco.

![añadir linea pedido](https://i.imgur.com/UJRWbuU.png)

#### Indica la cantidad
En el campo `Cantidad`, indica la cantidad de cada producto o servicio que quieres añadir al pedido.

![cantidad pedido](https://i.imgur.com/79iEISx.png)

#### Indica el precio unitario
En el campo `Precio unitario`, indica el precio unitario de cada producto o servicio que quieres añadir al pedido.

![precio linea](https://i.imgur.com/spDKzK3.png)

Si quieres establecer el precio con IVA, haz clic en el campo `Subtotal`. Aparecerá una ventana en la que podrás escribir el precio con IVA y se recalculará el precio unitario para ajustarlo al subtotal indicado.

![asignar total con impuestos](https://i.imgur.com/DAtpJ1F.png)

### 💾 Guarda el pedido
Una vez que hayas añadido todos los productos o servicios al pedido, haz clic en el botón `Guardar`.

## ✅ Aprobar o cancelar el pedido
Una vez creado el pedido, puedes editarlo cuando quieras. También puedes aprobarlo: si ya lo has entregado al cliente, puedes generar el albarán o la factura de venta. Para ello pulsa el botón `Abierto` (el estado actual del pedido). Al pulsarlo aparecerá un desplegable con los estados disponibles para el pedido.

![cambiar estado pedido](https://i.imgur.com/wTJEFoS.png)

Para cancelar el pedido, selecciona el estado `Cancelado`.

## 📋 La lista de pedidos

Al entrar en `Ventas → Pedidos` verás la lista de todos los pedidos. Desde aquí puedes localizar, filtrar y operar sobre ellos sin abrirlos uno a uno.

- **Buscador:** el cuadro de búsqueda superior busca por código, nombre del cliente, `numero2`, CIF/NIF y observaciones.
- **Ordenar:** puedes ordenar por código, cliente, fecha, número, `numero2` o total.
- **Filtros:** pulsa en `Filtros` para acotar por fecha, estado, cliente, agente, almacén, serie, forma de pago, importe, grupo de clientes, país/provincia/ciudad, si tiene adjuntos o si el email está sin enviar, entre otros.
- **Columnas:** con el icono de opciones puedes mostrar u ocultar columnas (coste, beneficio, divisa, retenciones, agente, etc.) para adaptar la vista a lo que necesites.
- **Colores:** cada fila se colorea según su estado — verde si está aprobado, rojo si está cancelado, amarillo si ya no es editable y azul si se ha enviado por email.

Marcando la casilla de una o varias filas, el botón `Acciones` te permite:

- `Aprobar`: convierte los pedidos seleccionados en albarán o factura (según la configuración del estado).
- `Aprobar con la misma fecha`: igual que el anterior, pero el documento generado conserva la fecha del pedido.
- `Agrupar o dividir`: combina varios pedidos en un único documento o los reparte.