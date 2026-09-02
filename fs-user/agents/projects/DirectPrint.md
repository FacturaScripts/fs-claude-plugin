---
idproject: 736
name: DirectPrint
permalink: directprint
creationdate: 22-07-2026
lastmod: 24-07-2026
version: 1.02
betaversion: 
mincore: 2026
maxcore: 2026.5
compatible: PlantillasPDF
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/DirectPrint
---
Plugin para FacturaScripts que centraliza la **impresión directa mediante CUPS**. Permite administrar una lista de impresoras y ofrece un servicio reutilizable para que otros plugins envíen ficheros PDF o texto a una impresora sin abrir el PDF en el navegador.

El núcleo trabaja **solo con ficheros**: no contiene lógica para generar facturas, albaranes u
otros documentos, aunque si permite imprimir documentos ya creados. La creación de dichos documentos debe hacerse desde los plugins que lo necesiten.

## Requisitos del servidor
- Servidor Linux (Ubuntu / Debian / MacOS) con **CUPS** instalado.
- Comandos `lp` y `lpstat` accesibles en el `PATH` del usuario que ejecuta PHP normalmente `www-data`.

## Impresión por acciones
Para no tener que elegir una impresora concreta en el código de cada plugin, DirectPrint ofrece un mapeo **acción → impresora**. Tu plugin registra una **acción** con una clave semántica y luego imprime *por esa acción*; es el administrador quien, desde **Admin → Impresoras → Acciones de impresión**, decide la impresora de cada acción. Si no asigna ninguna, se usa la impresora predeterminada.