---
idproject: 362
name: PagoRecibosRedsys
permalink: pagorecibosredsys
creationdate: 03-04-2024
lastmod: 26-06-2026
version: 2.1
betaversion: 1.3
mincore: 2025
maxcore: 2026.3
compatible: PortalCliente
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/PagoRecibosRedsys
---
Cobra facturas, presupuestos, pedidos y albaranes con tarjeta a través de Redsys, usando el modelo de Redirección con 3D Secure / SCA real (la pasarela alojada de Redsys gestiona la tarjeta y la autenticación; sin DIRECTPAYMENT, el fallo que provocaba rechazos bancarios en versiones antiguas).

Funciones principales:
- Enlaces de pago por cada documento, enviables por email, con página que muestra empresa, concepto, cliente e importe.
- Confirmación doble y fiable: notificación servidor-a-servidor (MERCHANT_URL) y retorno firmado del navegador, ambos verificados e idempotentes. Marca los recibos como pagados.
- Cobro desde la ficha: en una factura, enlace de pago de uno o varios recibos seleccionados; en un presupuesto, cobro que al pagarse genera un anticipo.
- Anticipos propios (sin depender de plugins externos) que se convierten en recibos al aplicarlos a una factura.
- Devoluciones parciales o totales por REST, asociadas al cobro y a sus recibos.
- Pago desde el PortalCliente: el cliente paga sus facturas pendientes con esta pasarela.
- Entornos de pruebas y producción separados (cada uno con su FUC, terminal y clave).
- Multidioma: español, inglés, catalán, gallego, euskera, francés, portugués, alemán e italiano.

Compatible con FacturaScripts 2025 y 2026. PHP 8.1+.