---
idproject: 207
name: PagosMultiples
permalink: pagosmultiples
creationdate: 28-04-2022
lastmod: 27-10-2026
version: 2.05
betaversion: 0
mincore: 2026.5
maxcore: 2026.7
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/PagosMultiples
---
Plugin de cobros y pagos múltiples de recibos que permite cobrar y pagar agrupaciones de recibos, de uno o varios clientes o proveedores, en un único asiento contable. El sistema permite seleccionar la cuenta bancaria de destino y gestionar el cobro o el pago mediante talones bancarios y pagarés.

## Talones bancarios
Los talones de clientes y los emitidos a proveedores se gestionan como una cartera de efectos: el plugin controla en qué situación está cada talón y cuándo vence, y genera los asientos de cada paso. Pueden formar parte de un cobro o pago múltiple o darse de alta de forma independiente, desde el listado de talones o desde la ficha del cliente o del proveedor.

- **Estados**: sin seguimiento, en cartera (emitido, en proveedores), depositado, cobrado (cargado, en proveedores) y devuelto/cancelado.
- **Acciones**: depositar en el banco y anular el depósito, cobrar (cargo en banco, en proveedores), devolver con gastos bancarios para volver a presentarlo y cancelar el talón cuando ya no sirve.
- **Varios a la vez**: desde el listado se pueden depositar y cobrar, o cargar en banco, varios talones a la vez, con un asiento por banco.
- **Control**: filtros por estado, tipo, banco y fechas, totales del listado y aviso al entrar en el listado de facturas si hay talones vencidos o que vencen en los próximos 15 días.
- **Bloqueo**: un talón depositado, cobrado o cancelado solo permite modificar su descripción.

Para tener seguimiento y generar asientos, el talón necesita una subcuenta de cartera: efectos comerciales en cartera para los de clientes y efectos comerciales a pagar para los de proveedores. Sin ella, queda registrado sin seguimiento.

## Configuración para talones independientes
Los talones independientes no pagan recibos. Los recibos se pagan en FacturaScripts con una forma de pago que lleve su importe a la subcuenta de cartera, y el talón se encarga después del cobro o del cargo en el banco.

- **Talones de clientes**: crea una cuenta bancaria, por ejemplo «Cartera de talones», con la subcuenta de efectos comerciales en cartera (4310), y una forma de pago «Talón» asociada a esa cuenta. Al recibir el talón, paga los recibos del cliente con esa forma de pago (el importe pasa de la 430 a la 4310) y da de alta el talón con esa misma subcuenta de cartera.
- **Talones emitidos a proveedores**: crea una cuenta bancaria, por ejemplo «Efectos a pagar», con la subcuenta de efectos comerciales a pagar (4010), y una forma de pago «Talón emitido» asociada a esa cuenta. Al emitir el talón, paga los recibos del proveedor con esa forma de pago (la deuda pasa de la 400 a la 4010) y da de alta el talón con esa misma subcuenta.

## Liquidación de agentes
También es posible asignar un agente a la agrupación de recibos de clientes para realizar una liquidación de cobro, de forma similar a un arqueo, donde se indica el efectivo entregado por el agente y se contabilizan las posibles diferencias. La liquidación se puede asignar a una cuenta contable de cartera de efectos. Es útil cuando los cobros los realizan agentes remotos, que operan fuera de la localidad donde está la central administrativa.