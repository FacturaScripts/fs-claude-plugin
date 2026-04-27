---
idproject: 470
name: CalculoDensidad
permalink: calculodensidad
creationdate: 14-10-2025
lastmod: 23-04-2026
version: 2.21
betaversion: 0
mincore: 2025
maxcore: 2026
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/CalculoDensidad
---

Añade campos de dimensiones para calcular el peso y precio de productos según sus densidades, o también novedad: por kg/metro.  Por densidad:productos cúbicos y cilíndricos, macizos o huecos según espesor de pared.  Y por kg/m: cualquier producto del que sepamos este dato.

CÁLCULO DE LOS KG POR DENSIDAD (al introducir medidas en mm):
===============================================
En la líneas de venta siempre que tengamos definida una &quot;densidad&quot; en Productos- Variantes nos saldrá un botón (regla) que nos permite abrir una ventana modal para introducir el nº de piezas &quot;Unidades&quot; y sus medidas en mm:  &quot;Ancho/Ø, Alto, Largo, y Espesor&quot;
Según lo que introduzcamos y dependiendo de los campos rellenados puede calcular el peso de perfiles cúbicos, cilíndricos y también en su versión tubular a lo largo.

Cúbicos:	Ancho × Alto × Largo
Cúbicos huecos:	Ancho × Alto × Largo × Espesor (pared)
Cilíndricos:	Ø × Largo
Cilíndricos huecos:	Ø × Largo × Espesor (pared)

CÁLCULO DE LOS KG POR KG/M (al introducir su longitud en metros):
===============================================
En la líneas de venta siempre que tengamos definido &quot;kg por metro&quot;  en Productos- Variantes nos saldrá un botón (regla) que nos permite abrir una ventana modal para introducir el nº de piezas &quot;Unidades&quot; y la longitud en metros. Así el sistema calculará automáticamente los kg.
