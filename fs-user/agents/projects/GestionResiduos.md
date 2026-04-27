---
idproject: 336
name: GestionResiduos
permalink: gestionresiduos
creationdate: 16-11-2023
lastmod: 25-04-2026
version: 1
betaversion: 2
mincore: 2025
maxcore: 2026
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/GestionResiduos
---

Informe de RAEE (Residuos de Aparatos Elóctricos y Electrónicos) para distribuidores y productores de AEE.

El plugin añade dos campos a la ficha del producto:
- Peso (gramos): peso unitario del producto en gramos. Se usa para calcular el peso total de RAEE en el informe.
- RAEE: marca si el producto está sujeto a la normativa RAEE.

Genera un informe (PDF o CSV) a partir de las facturas de venta, filtrando únicamente los productos marcados como RAEE en su ficha (`productos.raee = 1`). Para cada línea calcula el peso total (`peso_gr * cantidad / 1000`) y muestra los totales en unidades y kilogramos.

Filtros disponibles:
- Almacén / empresa
- Serie
- Fabricante
- Familia
- Tipo de fecha (creación o devengo) y rango (por defecto, el trimestre actual)
- Formato de salida: PDF o CSV
