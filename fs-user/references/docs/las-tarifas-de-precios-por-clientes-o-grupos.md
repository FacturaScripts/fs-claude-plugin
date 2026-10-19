---
id: 1081
permalink: las-tarifas-de-precios-por-clientes-o-grupos
title: Las tarifas de precios, por clientes o grupos
creationdate: 11-03-2022 18:02:54
lastmod: 04-09-2026
url: https://facturascripts.com/publicaciones/las-tarifas-de-precios-por-clientes-o-grupos
---
Las tarifas permiten calcular precios de venta distintos para determinados clientes o grupos. Puedes gestionarlas desde **Ventas → Tarifas**.

## ➕ Crear una tarifa

Pulsa **Nuevo**, escribe un nombre y elige la fórmula que se aplicará. FacturaScripts ofrece dos bases de cálculo:

- **Precio de venta**: resta al precio de venta el porcentaje **Valor X** y después el importe **Valor Y**.
- **Precio de coste**: suma al coste el porcentaje **Valor X** y después el importe **Valor Y**.

Por ejemplo, con base en el precio de venta, **Valor X = 10** aplica un descuento del 10 %. Con base en el coste, **Valor X = 20** añade un margen del 20 % sobre ese coste.

Puedes utilizar **Valor Y** para sumar o restar además un importe fijo. Los precios se guardan sin impuestos.

![Nueva tarifa](https://i.imgur.com/5KIrBVZ.gif)

### Límites del precio

- **No vender por debajo del coste**: si la fórmula produce un precio inferior al coste, utiliza el coste.
- **No vender por encima del precio de venta**: si la fórmula supera el precio de venta general, utiliza ese precio como máximo.

Después de guardar, la pestaña **Productos** muestra el precio general, el coste y el resultado de la tarifa para cada producto o variante. Utilízala para comprobar la fórmula antes de asignarla.

## 👤 Asignar la tarifa a un cliente

Abre la tarifa y entra en la pestaña **Clientes**. Pulsa **Añadir**, busca el cliente y selecciónalo. Para quitar la tarifa a uno o varios clientes, márcalos y pulsa **Quitar de la lista**.

También puedes asignarla desde la ficha del cliente, en **Ventas → Clientes**, campo **Tarifa**.

![Asignar tarifa a un cliente](https://i.imgur.com/aLxSlbk.gif)

## 👥 Asignar la tarifa a un grupo

En la ficha de la tarifa, abre la pestaña **Grupo de clientes** y utiliza **Añadir** o **Quitar de la lista**. También puedes hacerlo desde **Ventas → Clientes → Grupos**, editando el grupo.

![Asignar tarifa a un grupo](https://i.imgur.com/IdrTsex.gif)

Si un cliente tiene una tarifa propia y además pertenece a un grupo con otra tarifa, **tiene prioridad la tarifa asignada directamente al cliente**.

## 🧾 Cuándo se aplica

La tarifa se aplica al añadir un producto a un presupuesto, pedido, albarán o factura de venta. Cambiar una tarifa no recalcula las líneas que ya existen en documentos guardados.

Las tarifas del núcleo utilizan una única fórmula para todos los productos. Si necesitas precios fijos, reglas por familia o producto, fechas, excepciones o descuentos acumulables, consulta el plugin [TarifasAvanzadas](https://facturascripts.com/plugins/tarifasavanzadas).

## Ver también

- [Cómo crear un cliente](https://facturascripts.com/publicaciones/tu-primer-cliente-459)
- [Los grupos de clientes](https://facturascripts.com/publicaciones/los-grupos-de-clientes)
- [Los precios del producto](https://facturascripts.com/publicaciones/los-precios-del-producto)
- [Menú Ventas](https://facturascripts.com/publicaciones/menu-ventas)