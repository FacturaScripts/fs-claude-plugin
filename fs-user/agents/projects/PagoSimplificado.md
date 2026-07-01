---
idproject: 247
name: PagoSimplificado
permalink: pagosimplificado
creationdate: 26-08-2022
lastmod: 20-11-2025
version: 2.04
betaversion: 1.2
mincore: 2025.51
maxcore: 2026.3
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/PagoSimplificado
---
Plugin para FacturaScripts que simplifica el **cobro de recibos de cliente** y el **pago de recibos de proveedor** mediante botones y ventanas modales, sin necesidad de entrar al formulario de pago completo de cada recibo.

Permite resolver, en un único paso y desde el propio recibo, todas las variables que suelen cambiar en el momento real de la operación: **fecha**, **importe**, **forma de pago**, **gastos** y, opcionalmente, la **caja** en la que entra o sale el dinero.

## ¿Qué resuelve?

En FacturaScripts, liquidar un recibo implica abrir el recibo, editar varios campos y, si el cobro es parcial, gestionar a mano el recibo por la diferencia. Este plugin
convierte ese proceso en **tres botones** sobre la ficha del recibo:

- **Cobrar / Pagar**: liquida el recibo. Permite ajustar fecha, importe, forma de pago, gastos y caja en el momento.
- **Devolución**: revierte un recibo ya pagado generando un pago negativo (devolución).
- **Cancelar movimientos**: elimina todos los pagos del recibo y sus contabilizaciones, y lo deja como pendiente.

El botón que se muestra (Cobrar/Pagar **o** Devolución) depende de si el recibo está pagado o no. La cancelación está siempre disponible.

## Resumen de funcionalidades

- ✅ Cobro de recibos de cliente y pago de recibos de proveedor desde la propia ficha del recibo, en una ventana modal.
- ✅ Ajuste en el momento de **fecha de pago**, **importe**, **forma de pago** y **gastos**.
- ✅ **Cobros/pagos a cuenta (parciales)**: si el importe liquidado es inferior al del recibo, se genera **automáticamente** un nuevo recibo por la diferencia pendiente.
- ✅ **Devoluciones** de recibos ya pagados, con soporte para gastos de devolución y manejo correcto de remesas SEPA.
- ✅ **Cancelación total** de un recibo: borra pagos y asientos contables asociados y lo deja pendiente (operación de corrección).
- ✅ **Cajas**: control opcional del efectivo/medio físico donde entra o sale el dinero de cada pago.
- ✅ **Informe de Pagos de Clientes** con filtros por fecha, importe, caja, empresa, forma de pago, cliente, usuario y divisa, con totales.
- ✅ **Trazabilidad**: cada pago registra el usuario que lo hizo, la fecha, la hora y la caja.
- ✅ Las formas de pago ofrecidas se **filtran por la empresa** del recibo.
- ✅ Contabilización extensible (otros plugins pueden añadir líneas al asiento del pago).