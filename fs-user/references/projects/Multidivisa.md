---
idproject: 775
name: Multidivisa
permalink: multidivisa
creationdate: 27-08-2026
lastmod: 28-09-2026
version: 1.69
betaversion: 1.02
mincore: 2026.41
maxcore: 2026.65
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/Multidivisa
---
**Multidivisa** permite trabajar en FacturaScripts con documentos emitidos en monedas distintas de la divisa principal de la empresa, manteniendo la contabilidad en la moneda principal configurada.

El plugin añade soporte multidivisa tanto a documentos de venta como de compra, mostrando el equivalente en la divisa principal y la tasa de conversión aplicada.

También adapta la contabilización de facturas, cobros y pagos para que los asientos se generen correctamente en la divisa principal.

Principales funcionalidades:

- Soporte para presupuestos, pedidos, albaranes y facturas de cliente.
- Soporte para presupuestos, pedidos, albaranes y facturas de proveedor.
- Compatible con cualquier divisa configurada en FacturaScripts.
- Visualización del equivalente en la divisa principal.
- Visualización de la tasa de conversión utilizada.
- Integración con PlantillasPDF.
- Contabilización de facturas de cliente en la divisa principal.
- Contabilización de facturas de proveedor en la divisa principal.
- Contabilización de cobros y pagos en la divisa principal.
- Visualización de cobros y pagos en la divisa correspondiente al recibo.
- Redondeo de los importes contables a dos decimales.
- Compatibilidad con TicketBAI para facturas de cliente emitidas en divisa extranjera.
- Corrección del redondeo del total TicketBAI para evitar diferencias de céntimos entre líneas y total.
- No modifica el core de FacturaScripts.

La integración con TicketBAI se aplica exclusivamente a las facturas de cliente. Los documentos de compra no intervienen en TicketBAI.