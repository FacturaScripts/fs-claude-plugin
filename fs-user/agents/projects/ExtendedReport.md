---
idproject: 350
name: ExtendedReport
permalink: extendedreport
creationdate: 22-01-2024
lastmod: 29-06-2026
version: 2.01
betaversion: 2.11
mincore: 2025.6
maxcore: 2026.3
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/ExtendedReport
---
Plugin para **FacturaScripts** que proporciona el motor necesario para crear informes a medida dentro de otros plugins.

Permite generar documentos en **PDF**, exportarlos en **CSV** y visualizarlos en pantalla como **HTML**, a partir de dos piezas que el desarrollador crea en su propio plugin:

- Un **modelo de datos PHP** que obtiene las filas a representar.
- Un **diseño XML** que describe cómo se presenta la información.

## ⚠️ A quién va dirigido

Este plugin **no está pensado para el usuario final**. No añade ninguna opción de menú ni funcionalidad directamente usable. Es una herramienta para **desarrolladores** que crean plugins y quieren incluir informes propios sin partir de cero.
Para usarlo necesitas conocimientos de:
- Creación de plugins en FacturaScripts.
- PHP orientado a objetos.
- Estructura básica de los archivos XML del core (XMLView).