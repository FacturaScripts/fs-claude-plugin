---
idproject: 803
name: ModelosIGIC
permalink: modelosigic
creationdate: 29-09-2026
lastmod: 22-11-2026
version: 1.3
betaversion: 0
mincore: 2025.7
maxcore: 2026.72
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/ModelosIGIC
---
ModelosIGIC añade a FacturaScripts los modelos 420 y 425 del IGIC (Impuesto General Indirecto Canario) de la Agencia Tributaria Canaria. El Modelo 420 es la autoliquidación trimestral del IGIC y el Modelo 425 la declaración-resumen anual. El plugin calcula las casillas del IGIC devengado en las ventas y del deducible en las compras a partir de las facturas registradas, agrupadas por tipo impositivo, y muestra el resultado a ingresar o a compensar del periodo. Cada casilla indica si se calcula entera, en parte o si hay que completarla en el programa de ayuda de la ATC, y cada regla cita su fuente oficial (BOC, BOE e instrucciones de la ATC).

Desde la pantalla del Modelo 420 eliges el trimestre, revisas la previsualización y guardas la regularización, que crea el asiento contable correspondiente. Cada declaración queda registrada con su estado (borrador, presentada o rectificada), el número de referencia de la ATC, la fecha de presentación y la lista de facturas incluidas, y puedes crear una declaración rectificativa a partir de una ya presentada. Como función experimental, el plugin genera para el Modelo 420 un fichero .atc con el formato del programa de ayuda oficial de la ATC (ejercicios 2025 y 2026): se importa en el programa de ayuda, que lo valida, y desde allí se presenta la declaración. El formato se ha comprobado con las clases del propio programa, pero todavía no se ha usado en una presentación real.

Este plugin es un fork y evolución del plugin original modelos_420_425_canarias (https://github.com/FacturaScripts/modelos_420_425_canarias), creado para FacturaScripts 2017 por Carlos García Gómez (NeoRazorX) y Francesc Pineda, que dejó de ser compatible a partir de FacturaScripts 2018. Se ha reescrito por completo para FacturaScripts moderno y actualizado a la normativa vigente en 2026, manteniendo la licencia AGPL-3.0 y los créditos de sus autores originales. Todas las referencias a la normativa aplicada (BOC, BOE e instrucciones de la ATC), junto con los puntos pendientes de verificar, están documentadas en https://github.com/erseco/facturascripts-plugin-ModelosIGIC/blob/main/doc/NORMATIVA.md.

El código es libre y se desarrolla en GitHub: https://github.com/erseco/facturascripts-plugin-ModelosIGIC. Si encuentras un error, un importe que no cuadra con el programa de ayuda de la ATC o un cambio normativo que falte, abre una issue en https://github.com/erseco/facturascripts-plugin-ModelosIGIC/issues. Las contribuciones mediante pull request también son bienvenidas.

Compatible con FacturaScripts 2025.7 y PHP 8.1 o superior. Requiere una empresa con los impuestos IGIC y el plan contable configurados. Licencia AGPL-3.0.