---
idproject: 327
name: dlmRefProveedor
permalink: dlmrefproveedor
creationdate: 20-09-2023
lastmod: 17-10-2023
version: 1.1
betaversion: 0
mincore: 2022.5
maxcore: 2024.1
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/dlmRefProveedor
---

El plugin dlmRefProveedor, añade a presupuestos, pedidos, albaranes y facturas de compra la columna ref proveedor.

De esta forma cuando seleccionemos un producto que tenga asignada referencia de proveedor, para el proveedor sobre el que estamos creando el documento de compra, aparecerá la referencia correspondiente en la nueva columna.

Además esta columna podrá visualizarse en los documentos PDF, siempre y cuando tengamos el plugin PlantillasPDF , añadiendo a input &#39;Columna de las Líneas&#39; del configurador de plantillasPDF la opción &#39;refproveedor&#39; que es de tipo &#39;text&#39;.
