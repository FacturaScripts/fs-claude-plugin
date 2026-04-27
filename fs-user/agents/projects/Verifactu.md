---
idproject: 448
name: Verifactu
permalink: verifactu
creationdate: 27-05-2025
lastmod: 05-02-2026
version: 0.84
betaversion: 0
mincore: 2025.71
maxcore: 2025.9
compatible: PlantillasPDF
min_php: 
require: 
require_php: soap
url: https://facturascripts.com/plugins/Verifactu
---

Este plugin añade soporte para Verifactu: Veri-factu es el sistema de la AEAT (Agencia Tributaria Española) para la recepción automática de facturas emitidas. Forma parte del marco legal establecido por la Ley Antifraude y afectará a todas las empresas y autónomos que emiten facturas en España.

¿Es obligatorio?
Sí, es obligatorio para todas las empresas y autónomos ubicados en España, aunque la entrada en vigor es progresiva:

- 1 de enero de 2027: Obligatorio para empresas (personas jurídicas).
- 1 de julio de 2027: Obligatorio para autónomos (personas físicas).

❎ Excepciones:
- Los autónomos o empresas residentes en el país vasco quedan excluidas de Verifactu. Deben usar Ticketbai.
- Las empresas acogidas en el Suministro Inmediato de Información (SII) también están excluidas.

🧪 Modo de pruebas:
- En el modo de pruebas las facturas se mandan al entorno de pruebas de hacienda, que es como el real, pero sin riesgos.
- El modo de pruebas está forzado en el plugin hasta nuevo aviso. Para evitar que metas la pata y mandes facturas de prueba al entorno real de hacienda.
- Cuando el modo real este disponible, simplemente desactiva el modo de pruebas y ya está ✅
