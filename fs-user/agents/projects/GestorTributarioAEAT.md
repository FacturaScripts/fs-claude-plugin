---
idproject: 751
name: GestorTributarioAEAT
permalink: gestortributarioaeat
creationdate: 27-07-2026
lastmod: 27-07-2026
version: 
betaversion: 0.1
mincore: 
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/GestorTributarioAEAT
---
GestorTributarioAEAT es un plugin GRATUITO (version beta) que calcula, verifica y prepara los modelos tributarios de la AEAT a partir de los datos que ya tienes en FacturaScripts: facturas, asientos, impuestos y retenciones.

QUE HACE
- Modelo 303 (IVA - autoliquidacion): calcula las casillas del regimen general (IVA devengado por tipos, recargo de equivalencia e IVA soportado deducible de operaciones interiores), con validaciones de coherencia y resultado a ingresar / a compensar.
- Modelo 349 (operaciones intracomunitarias): clasifica automaticamente, a nivel de linea, entregas y adquisiciones de bienes (claves E/A) y prestaciones y adquisiciones de servicios (claves S/I). La clave T (operaciones triangulares) se senala para revision manual.
- Borrador por modelo: genera un texto de trabajo legible por cada calculo para revisarlo antes de presentar.
- Historial: guarda cada calculo por empresa, ejercicio y periodo, con estado borrador/revisado.

INTEGRACION CON LOS PLUGINS OFICIALES (no los sustituye)
Se integra con los plugins oficiales de modelos de la Forja: Modelo303/390, 111/190, 115/180, 130, 347, 369, InformeSII y Verifactu. Si estan instalados, este panel enlaza a sus informes y servicios oficiales para el calculo definitivo, los asientos contables, el envio VERI*FACTU y la presentacion. GestorTributarioAEAT actua como verificacion cruzada y para huecos aun no cubiertos por un plugin oficial (por ejemplo, el 349).

PARA QUIEN
Autonomos, pymes y asesorias que usan FacturaScripts y quieren un apoyo para calcular y contrastar sus modelos de IVA y operaciones intracomunitarias directamente desde su contabilidad.

IMPORTANTE (version beta)
El resultado es un borrador orientativo; su exactitud depende de la calidad y clasificacion de los datos registrados en FacturaScripts. Este plugin NO presenta declaraciones ante la AEAT. Revise y valide cada resultado con un asesor fiscal antes de cualquier presentacion oficial. Referencia normativa: instrucciones del modelo 303 de la AEAT (ejercicio 2025) y RD 1007/2023. Permanecera en estado beta hasta que el fabricante lo declare estable.

Desarrollado por YAST TELECOM SL.

## Demo online

Prueba el plugin sin instalar nada en [https://gestortributarioaeat.adelantia.com](https://gestortributarioaeat.adelantia.com) — Acceso: usuario demo / contraseña demo1234. Es un entorno público de pruebas (los datos pueden reiniciarse; no introduzcas datos reales).