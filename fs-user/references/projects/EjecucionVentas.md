---
idproject: 216
name: EjecucionVentas
permalink: ejecucionventas
creationdate: 07-05-2022
lastmod: 01-06-2026
version: 1.5
betaversion: 1.3
mincore: 2026
maxcore: 2026.7
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/EjecucionVentas
---
Añade la columna **% ejecutado** a las líneas de presupuestos, pedidos, albaranes y facturas de venta. En ella indicas qué parte de cada concepto se ha completado, y el neto de la línea se ajusta a ese porcentaje. Es útil para certificaciones de obra, facturas por avance de proyecto o entregas parciales.

# Cálculo
El neto de la línea (ya con los descuentos aplicados) se multiplica por el porcentaje ejecutado. Los impuestos y los totales del documento se calculan sobre ese neto ajustado. Ejemplos:
- Cantidad 1, precio 60 y ejecutado 50%: el neto será 30.
- Cantidad 2, precio 50 y ejecutado 20%: el neto será 20.
- Cantidad 1, precio 100, descuento 10% y ejecutado 50%: el neto será 45.

# Detalles
- Las líneas nuevas empiezan con un 100% ejecutado, así que los documentos se comportan igual que sin el plugin hasta que cambies el valor.
- El valor admite decimales y va de 0 a 100. Si escribes un valor fuera de ese rango, se ajusta al límite más cercano.
- Solo afecta a los documentos de venta. Los documentos de compra no cambian.