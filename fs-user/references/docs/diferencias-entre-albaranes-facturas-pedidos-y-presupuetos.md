---
id: 1088
permalink: diferencias-entre-albaranes-facturas-pedidos-y-presupuetos
title: Diferencias entre Albaranes, Facturas, Pedidos y Presupuestos
creationdate: 19-03-2022 19:24:30
lastmod: 04-09-2026
url: https://facturascripts.com/publicaciones/diferencias-entre-albaranes-facturas-pedidos-y-presupuetos
---
FacturaScripts permite trabajar con presupuestos, pedidos, albaranes y facturas tanto en compras como en ventas. Cada documento representa una fase distinta de la operación y puede generar el siguiente sin tener que volver a escribir las líneas.

## 📝 Presupuestos

Un presupuesto comunica precios y condiciones a un cliente o recoge una oferta de un proveedor. No confirma todavía la operación y, con los estados predeterminados, **no modifica el stock**.

Los presupuestos de venta pueden tener una **fecha de caducidad**. Puedes indicar el plazo predeterminado en **Administrador → Panel de control** y cambiar la fecha en cada presupuesto. Al abrir el listado, los presupuestos vencidos pasan al estado de caducado.

Cuando se acepta un presupuesto, puedes convertirlo en pedido o directamente en factura mediante sus estados.

- [Cómo hacer un presupuesto de venta](https://facturascripts.com/publicaciones/tu-primer-presupuesto-de-venta-351)
- [Cómo aprobar parcialmente un presupuesto](https://facturascripts.com/publicaciones/como-aprobar-parcialmente-un-presupuesto)

## 🛒 Pedidos

Un pedido refleja un compromiso de compra o venta. Con los estados predeterminados:

- Un **pedido de venta** suma unidades a **Reservado**: siguen físicamente en el almacén, pero ya están comprometidas con un cliente.
- Un **pedido de compra** suma unidades a **Pendiente de recibir**: todavía no han llegado, pero esperas recibirlas del proveedor.

Los pedidos se pueden cancelar o convertir en albaranes o facturas.

- [Cómo hacer un pedido de venta](https://facturascripts.com/publicaciones/como-hacer-un-pedido-de-venta)
- [Cómo registrar un pedido de compra](https://facturascripts.com/publicaciones/como-registrar-un-pedido-de-compra)

## 📦 Albaranes

Un albarán acredita la entrega o recepción de mercancía. Con los estados predeterminados, el albarán de venta **resta existencias** y el de compra **suma existencias**.

Después puedes convertir uno o varios albaranes en una factura. Si agrupas varios, obtendrás una sola factura con las cantidades pendientes.

- [Cómo hacer un albarán de venta](https://facturascripts.com/publicaciones/como-hacer-un-albaran-de-venta)
- [Cómo registrar un albarán de compra](https://facturascripts.com/publicaciones/registrar-un-albaran-de-compra)
- [Cómo agrupar albaranes en una sola factura](https://facturascripts.com/publicaciones/como-agrupar-albaranes-en-una-sola-factura)

## 🧾 Facturas

La factura es el documento fiscal de la operación y permite controlar cobros o pagos mediante recibos. Con los estados predeterminados, las facturas de venta restan stock y las de compra lo suman.

Si la factura procede de un albarán, el programa traspasa el movimiento: el documento de destino actualiza el stock y no se cuenta dos veces.

- [Cómo hacer una factura de venta](https://facturascripts.com/publicaciones/como-hacer-una-factura-de-venta)
- [Cómo registrar una factura de compra](https://facturascripts.com/publicaciones/como-registrar-una-factura-de-compra)

## 🔄 El papel de los estados

El efecto real de un documento no depende solo de que sea un presupuesto, pedido, albarán o factura: lo determina su **estado**. Cada estado indica si el documento es editable, cómo actualiza el stock y qué tipo de documento puede generar.

Los valores de **Actualizar stock** son:

- **No hacer nada**: no altera ninguna cantidad.
- **Reservar**: aumenta la cantidad reservada.
- **Prever**: aumenta la cantidad pendiente de recibir.
- **Restar**: reduce las existencias físicas.
- **Sumar**: aumenta las existencias físicas.

Puedes consultar y configurar los estados en **Administrador → Panel de control → Estados**. Si los personalizas, el comportamiento puede ser distinto del descrito arriba.

Para ampliar la información, consulta [los estados del documento](https://facturascripts.com/publicaciones/estados-del-documento-680) y [el stock del producto](https://facturascripts.com/publicaciones/el-stock-de-productos).

## 🪄 Agrupar, dividir o aprobar parcialmente

Desde los listados de presupuestos, pedidos y albaranes puedes seleccionar uno o varios documentos y abrir **Acciones → Agrupar o dividir**. El asistente permite combinar documentos compatibles o generar solamente parte de sus líneas.

Consulta [el asistente para agrupar o partir documentos](https://facturascripts.com/publicaciones/el-asistente-para-agrupar-o-partir-documentos).