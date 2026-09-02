---
idproject: 643
name: EnviarFacturaEmailApi
permalink: enviarfacturaemailapi
creationdate: 17-06-2026
lastmod: 17-06-2026
version: 1
betaversion: 
mincore: 2025
maxcore: 2026.6
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/EnviarFacturaEmailApi
---
EnviarFacturaEmailApi añade un endpoint a la API REST de FacturaScripts (`POST /api/3/enviarFacturaCliente/{idfactura}`) para enviar facturas de cliente por email con su PDF adjunto desde cualquier sistema externo, sin entrar en el panel. El envío lo realiza el propio FacturaScripts, respetando tu servidor SMTP, tus plantillas y el historial de emails, por lo que el resultado es idéntico a un envío manual. Además es idempotente: no reenvía una factura ya enviada salvo que se indique con el parámetro force, evitando correos duplicados ante reintentos.