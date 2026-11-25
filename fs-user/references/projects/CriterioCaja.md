---
idproject: 466
name: CriterioCaja
permalink: criteriocaja
creationdate: 18-08-2025
lastmod: 23-10-2026
version: 2.05
betaversion: 0
mincore: 2026.5
maxcore: 2026.7
compatible: PagoSimplificado,PagosMultiples,RemesasSEPA
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/CriterioCaja
---
Aplica el Régimen Especial del Criterio de Caja (RECC) en la gestión del IVA. Con este régimen, el impuesto no se devenga al emitir o recibir la factura, sino en el momento efectivo del cobro o del pago. Pensado para autónomos y pequeñas empresas que quieren mejorar su liquidez sin renunciar a una contabilidad correcta.

## ⚙️ Cómo funciona
Basta con indicar en la empresa el régimen de IVA de criterio de caja y asignar a cada impuesto sus subcuentas de criterio de caja (repercutido y soportado). A partir de ahí, al contabilizar cada cobro o pago, el plugin traspasa automáticamente el IVA desde esas subcuentas a las de IVA habituales, en proporción al importe cobrado o pagado, de modo que los cobros y pagos parciales también quedan bien reflejados. Las facturas intracomunitarias se tratan igualmente.

## 📊 Informe de impuestos
Incluye el informe &quot;Impuestos: Criterio de caja&quot;, que lista el IVA, el recargo de equivalencia y el IRPF de ventas o compras según la fecha de cobro o pago, con filtros por empresa, serie, divisa y país. Indica el tipo de operación de cada factura (general, intracomunitaria…), muestra los totales por tipo de operación y tipo de impuesto, y se puede exportar a PDF, Excel o CSV.

## 🔗 Compatible con otros plugins
Funciona también con los cobros y pagos generados por PagoSimplificado, PagosMultiples y RemesasSEPA.