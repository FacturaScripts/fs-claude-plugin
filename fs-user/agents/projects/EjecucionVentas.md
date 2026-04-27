---
idproject: 216
name: EjecucionVentas
permalink: ejecucionventas
creationdate: 07-05-2022
lastmod: 26-08-2025
version: 1.4
betaversion: 1.3
mincore: 2025
maxcore: 2026
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/EjecucionVentas
---

Añade la columna ejecutado (número con decimales) a las líneas de facturas, albaranes, pedidos y presupuestos de venta. Permite especificar ahí el porcentaje de ejecución de ese concepto (cuánto se ha completado).

# Cálculo
Al asignar un porcentaje de ejecutado se actualizará el neto de la línea. El nuevo neto será el resultado de multiplicar el neto por el porcentaje ejecutado. Ejemplos:
- Si la cantidad es 1, el precio 60 y ejecutado un 50%, el neto será 30.
- Si la cantidad es 2, el precio 50 y ejecutado un 20%, el neto será 20.
