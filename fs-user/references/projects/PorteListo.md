---
idproject: 799
name: PorteListo
permalink: portelisto
creationdate: 27-09-2026
lastmod: 18-10-2026
version: 1.4
betaversion: 1.1
mincore: 2025.4
maxcore: 2026.72
compatible: 
min_php: 8
require: 
require_php: curl,openssl
url: https://facturascripts.com/plugins/PorteListo
---
Crea el DeCA, el documento electrónico de control del transporte obligatorio desde el 5 de octubre de 2026, desde los albaranes de cliente de FacturaScripts.

En cada albarán aparece la pestaña PorteListo:
Emitir el DeCA con los datos del albarán (cargador, lugar de carga, destino y mercancía ya rellenos). PorteListo genera el DeCA con su código QR y se lo envía al conductor por WhatsApp.
O enviar el albarán para que la oficina del transportista lo revise y emita.
Portes internacionales: si el destino está fuera de España, el albarán enviado llega a PorteListo preparado como CMR en lugar de DeCA.
Historial: número de DeCA, estado, si el conductor lo ha recibido, PDF, actualizar y anular.

Gratis para cargadores. Los transportistas necesitan un plan de PorteListo con API (el CMR, plan Completo).

Requisitos: FacturaScripts 2025 o superior, PHP 8.0 o superior con curl y una clave de PorteListo (portelisto.com/api).