---
idproject: 576
name: ExportContable
permalink: exportcontable
creationdate: 07-04-2026
lastmod: 07-04-2026
version: 0
betaversion: 1.1
mincore: 0
maxcore: 2025.9
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/ExportContable
---
Exporta tus asientos a ContaPlus y Contasol

Ya está disponible la primera versión pública del plugin ExportContable, pensado para que puedas entregar a tu gestoría los asientos contables de FacturaScripts en el formato que esperan los dos programas más utilizados del mercado: ContaPlus (Sage 50) y Contasol (Sage).
¿Qué hace?
Genera un fichero CSV (UTF-8 con BOM, separador ;) listo para importar desde el asistente de importación de ContaPlus o Contasol, con todos los asientos del rango de fechas que elijas. Detecta automáticamente la longitud de subcuenta configurada en cada ejercicio y normaliza los códigos para que cuadren con tu plan contable.
Características principales

Selector de programa destino: ContaPlus (26 columnas, formato subdiarios) o Contasol (13 columnas, formato Diario).
Filtros rápidos por periodo: mes actual, mes anterior, trimestre actual, trimestre anterior, año actual, año anterior.
Filtro por rango libre de fechas (desde/hasta).
Selector de empresa (en instalaciones multi-empresa) y de ejercicio.
Botón de previsualización para ver cuántos asientos y partidas se van a exportar antes de generar el fichero.
Resolución automática de subcuentas leyendo longsubcuenta del ejercicio.
Instrucciones de importación incluidas en la propia pantalla del plugin.

Cómo se usa
Una vez instalado, encontrarás la entrada &quot;ExportContable&quot; en el menú de Contabilidad. Eliges programa, empresa, ejercicio y periodo, pulsas Previsualizar para verificar y luego Exportar a CSV. El fichero se descarga directamente en tu navegador.
Compatibilidad

FacturaScripts 2025 o superior
PHP 8.0 o superior

Notas
El plugin exporta en formato CSV porque es el que aceptan los asistentes de importación modernos de ambos programas y evita los problemas de codificación del antiguo xDiario.txt de ancho fijo. Si tu gestor necesita el formato legacy, abre un hilo y lo añadimos.