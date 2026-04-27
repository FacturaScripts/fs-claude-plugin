---
idproject: 419
name: Intrastat
permalink: intrastat
creationdate: 16-01-2025
lastmod: 12-12-2025
version: 2.01
betaversion: 0
mincore: 2025.6
maxcore: 2025.81
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/Intrastat
---

Añade una nueva opción en el menú Informes que permite la generación del archivo Intrastat para su presentación telemática.

Para la generación del informe se añaden nuevas datos que son necesarios:
- a la variante de los productos el código HS
- a los documentos los datos de transporte: condición de entrega, transporte y puerto.

Los datos de transporte se pueden indicar al crear el documento, o en el momento de elaborar el informe pudiendo asignar a la selección de documentos los mismos valores de una sóla vez.
