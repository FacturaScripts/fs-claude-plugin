---
idproject: 106
name: AgruparProducto
permalink: agruparproducto
creationdate: 03-11-2020
lastmod: 04-11-2026
version: 2.03
betaversion: 1.32
mincore: 2026.6
maxcore: 2026.72
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/AgruparProducto
---
**Vende cada producto por unidades, packs, cajas o palets sin duplicar referencias.** Define todos los formatos de un mismo producto, cada uno con su cantidad, su descuento, su código de barras, su peso y sus medidas, mientras el stock se sigue controlando en unidades.

**Por ejemplo, para un producto PILA:**

- **PACK** de 3 unidades.
- **CAJA** de 30 unidades, con un 5 % de descuento.
- **PALET** de 180 unidades, con un 10 % de descuento.

Si vendes 60 unidades, se aplica el descuento de la caja. Si vendes 360, el del palet. Tú solo introduces la cantidad.

**Qué consigues:**

- **Una sola referencia para todos los formatos**: evita crear un producto por cada caja o pack y mantén el catálogo y el stock limpios.
- **Ventas más rápidas**: la línea toma automáticamente la cantidad del formato habitual de cada producto.
- **Descuentos por cantidad automáticos**: se aplican en las ventas cuando la cantidad es múltiplo de la agrupación.
- **Código de barras por formato**: lee el código de una caja y la línea se crea con su cantidad y su descuento, en los documentos de venta y en el TPV del plugin TPVneo.

**Peso, medidas y volumen de cada formato:**

Una caja no pesa ni mide lo mismo que la suma de sus unidades, porque también cuentan el envoltorio y el cartón. Por eso puedes guardar los datos físicos de cada producto y de cada formato:

- **Peso del producto**: el de una unidad, en su ficha.
- **Peso y medidas de la agrupación**: peso total, ancho, alto y fondo de cada formato.
- **Volumen automático**: se calcula al guardar a partir de las medidas.
- **Asignación masiva**: aplica el peso y las medidas a muchos productos de una vez, eligiendo cuáles con filtros.