---
idproject: 667
name: FechaPagado
permalink: fechapagado
creationdate: 02-07-2026
lastmod: 02-07-2026
version: 1
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/FechaPagado
---
Añade un botón F.PAGADO en los Recibos de facturas de proveedores y de clientes para marcar los recibos seleccionados todos como pagados a la vez eligiendo una fecha de pago distinta a la actual.

- El botón original &quot;Pagado&quot; de FacturaScripts marca los recibos como pagados usando siempre la fecha de hoy. Cuando el pago se registra días después de que realmente se hizo (por ejemplo, al conciliar movimientos bancarios o al ponerse al día con la contabilidad), esa fecha de hoy no es correcta. Si tenemos 10 recibos con una fecha anterior pagada al día de hoy nos cuesta entrar en cada recibo y ponerla la fecha anterior correcta de pago.

- FechaPagado añade un botón &quot;F.PAGADO&quot; junto al botón &quot;Pagado&quot; original, tanto en los recibos de facturas de proveedor como en los de facturas de cliente. Al pulsarlo, se abre un pequeño calendario para elegir la fecha de pago real, y todos los recibos seleccionados quedan marcados como pagados con esa fecha en una única operación visual, ahorrando tiempo. Puedes seleccionar 1 recibo o varios de la lista de recibos.

**Funcionalidades:**
- Funciona igual en Compras (recibos de proveedor) y en Ventas (recibos de cliente).
- Selección múltiple: marca varios recibos a la vez y aplícales la misma fecha de pago de una sola vez.
- Los recibos que ya estaban pagados no se tocan, aunque estén incluidos en la selección.
- No requiere configuración: se instala, se activa, y el botón aparece automáticamente.

**Casos de uso típicos:**
- Conciliación bancaria: registras varios pagos a la vez con la fecha real del extracto bancario. Útil cuando se cargan en la cuenta los recibos el día 20 y estás viéndolo en una fecha posterior, por ejemplo el 25.
- Regularización contable a fin de mes: pones al día pagos de cada día que se hicieron durante el mes pero no se registraron en su momento.
- Corrección de errores: si un recibo se marcó como pagado con la fecha equivocada, puedes desmarcarlo y volver a marcarlo con F.PAGADO indicando la fecha correcta.