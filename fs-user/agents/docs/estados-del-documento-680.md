---
id: 775
permalink: estados-del-documento-680
title: Estados del documento
creationdate: 24-12-2018 00:00:00
lastmod: 14-10-2025
url: https://facturascripts.com/estados-del-documento-680
---
No es lo mismo un presupuesto aceptado, que uno rechazado, ni es lo mismo un albarán rechazado que uno devuelto. Por eso en FacturaScripts los estados de presupuestos, pedidos, albaranes y facturas son configurables, para que pueda configurarlos como desee.

## Cómo ver el estado de un documento
Para ver el estado de un albarán, factura, pedido o presupuesto, debe fijarse en el selector de estado de la parte derecha:

![cambiar estado documento](https://i.imgur.com/J2jRL2D.png)

## Cómo configurar los estados
Puede ver los estados disponibles haciendo clic en el **menú Administrador** &gt; **Panel de control**, y después en la sección **estados**.

![cambiar estados facturascript](https://i.imgur.com/ejNI5oH.png)

### Tipo de documento
Indica a qué tipo de documentos se aplica este estado, por ejemplo, pedidos de cliente. Si filtra el listado por tipo de documento **pedido de cliente**, podrás ver todos los estados para los pedidos de cliente.

### Por defecto
Indica si este estado es el estado que se le asigna a todos los pedidos nuevos, en el caso de que el estado sea para pedidos. Evite marcar un estado como por defecto y a la vez **no editable**, ya que no podrá ni añadir líneas al crearlo.

### Editable
Indica si los documentos en este estado podrán ser editables. Por ejemplo, el estado cancelado para los pedidos de cliente indica no editable, por ese motivo los pedidos cancelados no son editables, y no se pueden modificar, ni añadir, ni quitar líneas.

### Actualizar stock
Indica de qué forma actualiza el stock este estado. Puedes ver que los albaranes nuevos restan de stock, mientras los devueltos no hacen nada. Cuando se edita un albarán nuevo y se marca como devuelto, como antes restaba de stock y el nuevo estado es no hacer nada, el resultado es que deshace la resta de stock, es decir, suma.

Los valores posibles de ``actualizastock`` son:
- Reservar (-2).
- Restar (-1).
- No hacer nada (0).
- Sumar (1).
- Prever (2).

### Generar tipo de documento
Indica si este estado genera algún documento nuevo. Por ejemplo, puede ver que los pedidos aprobados generan albaranes. Si quiere aprobar los pedidos directamente a facturas, simplemente cambie el estado para que genere facturas, o cree un nuevo estado.

#### Facturar presupuestos
Para poder facturar presupuestos necesita un estado que tenga como **tipo de documento** presupuesto de compra (o de venta), como **generar tipo de documento** factura de compra (o de venta) y que tenga editable desmarcado.

![facturar presupuesto proveedor](https://i.imgur.com/tYheQJA.png)

#### Facturar pedidos
Para poder facturar pedidos necesita un estado que tenga como **tipo de documento** pedido de compra (o de venta), como **generar tipo de documento** factura de compra (o de venta) y que tenga editable desmarcado.

![facturar pedido](https://i.imgur.com/iy1BXXd.png)

#### No mezcle documentos de compra y venta
Con los estados solamente se puede pasar a documentos del mismo tipo, es decir, de compras a compras o de ventas a ventas, pero no se puede hacer que al aprobar un pedido de venta se genere uno de compra. Los estados no sirven para esto.

### Bloqueado
Los estados predeterminados están bloqueados para evitar que usuarios inexpertos los modifiquen. Es mejor que no los modifique. Pero si insiste en modificarlos, debe hacer clic en el botón opciones para mostrar la columna bloqueado. A continuación podrá desbloquear y modificar.
