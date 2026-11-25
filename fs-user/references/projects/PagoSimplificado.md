---
idproject: 247
name: PagoSimplificado
permalink: pagosimplificado
creationdate: 26-08-2022
lastmod: 16-10-2026
version: 2.08
betaversion: 1.2
mincore: 2026.5
maxcore: 2026.72
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/PagoSimplificado
---
Simplifica el cobro de recibos de cliente y el pago de recibos de proveedor: desde la propia ficha del recibo, con un botón y una ventana, se indican en el momento la fecha, el importe, la forma de pago, los gastos y, si se usa, la caja donde entra o sale el dinero. Sin abrir el formulario de pago completo de cada recibo.

## 💶 Cobros y pagos a cuenta
Si el importe cobrado o pagado es menor que el del recibo, se genera automáticamente un nuevo recibo por la diferencia pendiente. Las formas de pago que se ofrecen se filtran por la empresa del recibo, y opcionalmente la forma de pago real del cobro se copia a la factura cuando tiene un único recibo.

## ↩️ Devoluciones y cancelaciones
Un recibo ya pagado se puede devolver, con sus gastos de devolución y teniendo en cuenta las remesas SEPA. Y si hubo un error, la cancelación elimina todos los pagos del recibo y sus asientos contables y lo deja de nuevo pendiente.

## 🧮 Cajas e informe de cobros
Control opcional de cajas para saber en qué caja entra o sale cada pago. Cada pago registra el usuario, la fecha, la hora y la caja, y el informe de pagos de clientes permite filtrar por fecha, importe, caja, empresa, forma de pago, cliente, usuario y divisa, con totales.