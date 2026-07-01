---
idproject: 618
name: XV1
permalink: xv1
creationdate: 02-06-2026
lastmod: 02-06-2026
version: 0
betaversion: 1.18
mincore: 0
maxcore: 2026.3
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/XV1
---
MargenVentas añade gestión de coste y margen en documentos de venta de FacturaScripts. Permite trabajar directamente en presupuestos, pedidos, albaranes y facturas de cliente mostrando el coste de la línea, calculando el precio unitario a partir del margen indicado y apoyándose en el beneficio nativo del documento.

Funciones principales

Añade un campo de margen en líneas de venta.
Recupera automáticamente el último coste del artículo; si no existe, usa 0.
Recalcula el precio unitario a partir de coste + margen.
Muestra visualmente los campos de coste y margen diferenciados del precio y descuento.
Permite elegir la posición de las columnas de coste y margen en la línea.
Controla la visibilidad por usuario mediante permiso propio del plugin.
Usa el totalbeneficio nativo de FacturaScripts, sin duplicar totales.
Configuración

Activación por usuario con el campo margenventas.
Configuración global desde Administrador &gt; Ajustes, pestaña margenventas.
Posición configurable de las columnas de coste y margen dentro de la línea del documento.
Compatibilidad