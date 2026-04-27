---
idproject: 104
name: Produccion
permalink: produccion
creationdate: 19-10-2020
lastmod: 12-01-2026
version: 2.01
betaversion: 2.02
mincore: 2025.51
maxcore: 2025.81
compatible: 
min_php: 8.0
require: StockAvanzado
require_php: 
url: https://facturascripts.com/plugins/Produccion
---

Permite crear recetas para producir/fabricar productos a partir de otros productos del almacén, los llamados ingredientes.

Ejemplo: puedes definir que el producto mueble-caoba se construye con los ingredientes:
- 2 unidades del producto modulo1.
- 1 unidad del producto modulo3.
- 5 unidades de pata-negra.
- 1 unidad de barniz-caoba.

Al cocinar/producir esta receta se restará del stock de los ingredientes y se sumará al stock del producto mueble-caoba. Además se actualizará el coste de mueble-caoba con la suma de los costes de los ingredientes.

Requiere del plugin StockAvanzado (gratuito).
