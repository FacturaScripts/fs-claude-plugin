---
id: 999
permalink: ssl-certificate-problem
title: SSL certificate problem
creationdate: 01-10-2021 19:02:12
lastmod: 20-02-2026
url: https://facturascripts.com/ssl-certificate-problem
---
El **candado** que aparece en la bara de direcciones cuando visita **facturascripts.com** indica que la comunicación con la web es segura. Y es segura porque utilizamos un **certificado SSL válido**. Y es válido porque la fecha de caducidad todavía no se ha alcanzado y el certificado ha sido firmado con otro certificado raíz de plena confianza. Y ese certificado raíz es válido porque su navegador lo tiene en su lista de certificados raíz.

Hasta hace unos años los certificados SSL costaban un riñon y solamente algunas webs los utilizaban. Poco a poco se fue ampliando su adopción y ajustando los precios. Finalmente nació [Let’s Encrypt](https://letsencrypt.org/es/), una autoridad de certificación gratuita, automatizada y abierta. Una autoridad con su propio certificado raíz, que rápidamente fué incluido en la lista de certificados raíz de la mayoría de navegadores y sistemas operativos.

Pero para dar compatibilidad a todo el software que todavía no incluía su certificado raíz en la lista, los certificados que emitía let&#39;s encrypt fueron firmados con otro certificado raíz que si que incluían las versiones antiguas de la mayoría de software. **El 30 de septiembre de 2021 caducó ese certificado raíz**.

Si le aparece el error ``ssl certificate problem certificate has expired``, significa que no tiene actualizada la lista de certificados raíz.
- Si FacturaScripts está instalado en un servidor, instale las últimas actualizaciones del sistema operativo y reinicie si es necesario.
- Si está instalado en un PC, probablemente tenga que actualizar el paquete o copiar el certificado manualmente.
