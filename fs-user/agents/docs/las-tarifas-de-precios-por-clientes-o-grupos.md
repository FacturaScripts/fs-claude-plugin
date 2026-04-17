---
id: 1081
permalink: las-tarifas-de-precios-por-clientes-o-grupos
title: Las tarifas de precios, por clientes o grupos
creationdate: 11-03-2022 18:02:54
lastmod: 09-04-2026
url: https://facturascripts.com/las-tarifas-de-precios-por-clientes-o-grupos
---
Con las tarifas puede tener distintos precios de venta a distintos clientes o grupos de clientes. Puede gestionar sus tarifas desde el **menú Ventas**, **Tarifas**.

## Crear una tarifa
Para crear una tarifa en **Ventas**, **Tarifas** le damos al + de Nueva y allí colocamos el nombre de la tarifa, la formula a utilizar, esta parte es importante porque tenemos dos opciones:

- Calcular la tarifa a partir del **precio de venta**, esto es cuando al precio de venta le queremos disminuir un valor en porcentaje o en importe.
- Calcular la tarifa a partir del **precio de costo**, esto es si el precio de venta lo queremos calcular en base a un porcentaje o un importe sobre el precio de coste

Las tarifas se pueden definir en base a un porcentaje (Valor X) o un importe (Valor Y), para tener un control y no vender por debajo del precio de costo o por encima del precio de venta podemos marcar los checks que están en la pantalla de creación.

![nueva tarifa](https://i.imgur.com/5KIrBVZ.gif)

### 👨‍💼 Asignar la tarifa a un cliente
Una vez que tenemos creada una Tarifa podemos agregar un cliente en la parte inferior de la pantalla en la opción **Clientes**, le damos click alli y luego veremos las opciones de asignar (**+**) y desasignar (**-**) clientes a esta tarifa, al asignar clientes nos aparecerá el modal de busqueda con lo que agregaremos los clientes, para desasignarlos solo debemos marcar los clientes y luego darle click al boton rojo de desasignar.

![asignar tarifa cliente](https://i.imgur.com/aLxSlbk.gif)

### 👥 Asignar la tarifa a un grupo de clientes
Lo mismo ocurre si en lugar de querer asignar una tarifa a un cliente y queremos hacerlo a un Grupo de clientes, solo debemos darle click en la pantalla de la tarifa a la opción **Grupo de clientes**, allí podremos darle click a asignar (**+**) o desasignar (**-**) Grupos de Clientes, al darle click a asignar podremos ver el modal con un selector de los grupos de clientes que FacturaScripts tiene creados.

![asignar tarifa a grupo clientes](https://i.imgur.com/IdrTsex.gif)

### 🚦 Prioridad de tarifas
Si un cliente tiene asignada la tarifa 1 y el cliente pertenece a un grupo de clientes que tiene asignada la tarifa 2, la tarifa que se aplicará es la tarifa 1, es decir, la tarifa asignada al cliente tiene preferencia sobre la tarifa del grupo.

### 🛠️ Mas control sobre las tarifas
Estas tarifas se aplican sobre todos los productos creados en FacturaScripts, si necesitamos un control mas fino de las mismas o crear descuentos podemos hacer uso del plugin [**Tarifas Avanzadas**](/plugins/tarifasavanzadas).
