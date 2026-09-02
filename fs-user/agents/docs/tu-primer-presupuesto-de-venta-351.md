---
id: 799
permalink: tu-primer-presupuesto-de-venta-351
title: Cómo hacer un presupuesto de venta
creationdate: 02-04-2019 00:00:00
lastmod: 10-07-2026
url: https://facturascripts.com/publicaciones/tu-primer-presupuesto-de-venta-351
---
Para crear un presupuesto ve al menú `Ventas → Presupuestos` y haz clic en el botón `Nuevo`.

![nuevo presupuesto](https://i.imgur.com/Rh4niJe.png)

## 🧾 Pasos básicos para crear un presupuesto
1. En la nueva ventana indica el `cliente` escribiendo su código, DNI o nombre.
2. En el campo `Referencia` escribe el código, producto o servicio que necesitas agregar.
3. Se resalta automáticamente el campo `Cantidad`: ahí indicas la cantidad que quieres agregar o vender.
4. Para agregar más productos o servicios, vuelve al punto 2.
5. En el apartado `Observaciones` puedes añadir detalles relacionados con la entrega o el servicio prestado.
6. Cuando todo esté como quieres, haz clic en `Guardar` y se asignará un número al presupuesto.
7. Después puedes imprimirlo o enviarlo por email al cliente.

Si haces clic en el icono de la flecha hacia abajo del campo `Referencia`, se autocompletarán todos los datos de esa línea, que puedes modificar directamente ahí.

![Líneas del presupuesto](https://i.imgur.com/zvFakqn.png)

## 🔍 Detalle
Una vez terminado el presupuesto, guarda la ficha y se activará una pestaña llamada `Detalle`. Dentro de ella encontrarás todo el detalle del presupuesto, como la fecha y hora en la que se emitió, la dirección de facturación, la dirección de envío, etc.

En el apartado de atributos puedes elegir la serie, la forma de pago, la divisa y la tasa de conversión del presupuesto. Además, puedes seleccionar el agente que realiza el presupuesto y, si es conveniente, la fecha del email enviado.

![Interfaz de detalles](https://i.imgur.com/vO9cgtl.png)

## ✅ Finalizar el presupuesto
Una vez guardado, haz clic en el desplegable que al principio pone `Abierto` y cámbialo por `Pedido`. Con esta acción el presupuesto queda finalizado y se generará automáticamente un pedido asociado. Si no necesitas generar un pedido ni un albarán para este movimiento, también puedes generar una factura directamente: cambia el desplegable de `Abierto` a `Facturar`.

![facturar presupuesto](https://i.imgur.com/dXKKqA6.png)

## 📋 La lista de presupuestos

Al entrar en `Ventas → Presupuestos` verás la lista de todos los presupuestos. Desde aquí puedes localizar, filtrar y operar sobre ellos sin abrirlos uno a uno.

- **Buscador:** el cuadro de búsqueda superior busca por código, nombre del cliente, `numero2`, CIF/NIF y observaciones.
- **Ordenar:** puedes ordenar por código, cliente, fecha, número, total o por la fecha de caducidad (`finoferta`).
- **Filtros:** pulsa en `Filtros` para acotar por fecha, estado, cliente, agente, almacén, serie, forma de pago, importe, grupo de clientes, país/provincia/ciudad, si tiene adjuntos o si el email está sin enviar, entre otros.
- **Columnas:** con el icono de opciones puedes mostrar u ocultar columnas (coste, beneficio, divisa, retenciones, agente, etc.) para adaptar la vista a lo que necesites.
- **Colores:** cada fila se colorea según su estado — verde si está aprobado, rojo si está cancelado o caducado, amarillo si ya no es editable y azul si se ha enviado por email.

Marcando la casilla de una o varias filas, el botón `Acciones` te permite:

- `Aprobar`: convierte los presupuestos seleccionados en pedido o factura (según la configuración del estado).
- `Aprobar con la misma fecha`: igual que el anterior, pero el documento generado conserva la fecha del presupuesto.
- `Agrupar o dividir`: combina varios presupuestos en un único documento o los reparte.

Los presupuestos cuya fecha de caducidad (`finoferta`) ya ha pasado se marcan automáticamente como *Caducados* al abrir la lista.