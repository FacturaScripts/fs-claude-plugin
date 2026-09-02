---
idproject: 706
name: AutoEnvioFacturas
permalink: autoenviofacturas
creationdate: 10-07-2026
lastmod: 10-07-2026
version: 1
betaversion: 
mincore: 2026
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/AutoEnvioFacturas
---
Envía por email las facturas de cliente en cuanto las emites, sin que tengas que acordarte de darle al botón. El plugin revisa cada minuto las facturas ya emitidas, adjunta el PDF y las manda al contacto de facturación (o, si no lo hay, al email del cliente). Los bocetos nunca se envían.

Y lo más importante si trabajas con la ley antifraude: es compatible con el plugin oficial Verifactu. En ejercicios en modo Verifactu, el email solo sale cuando la factura ya está registrada y el QR ya figura en el PDF. Nunca se escapa una factura sin QR.

Lo configuras una vez y se olvida el tema. Eliges desde qué fecha empezar, cuántos emails salen por ejecución, un pequeño margen de gracia antes de enviar (por si rectificas algo recién emitido) y una copia oculta opcional. El cuerpo del email es una notificación editable con marcadores {name}, {code}, {date}, {total} y {company}.

Trae garantía de no duplicados: usa el mismo campo que el botón de &quot;enviar&quot; manual, así que envío automático y envío a mano se respetan entre sí. Si un envío falla, reintenta hasta 3 veces y lo deja registrado. Todo el historial —una fila por factura, con su estado— queda a la vista en Administrador → Email.

Instalación inmediata: copia, activa, marca la fecha de inicio y enciende el interruptor. Viene desactivado de fábrica para que no salga nada hasta que tú lo decidas.

Requisitos: FacturaScripts 2026 o superior · PHP 8.1+ · cuenta de email de salida configurada · cron del servidor. Compatible con el plugin Verifactu oficial.