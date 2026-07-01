---
idproject: 663
name: ConectorTelegram
permalink: conectortelegram
creationdate: 30-06-2026
lastmod: 30-06-2026
version: 1
betaversion: 0
mincore: 2026
maxcore: 2026.3
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/ConectorTelegram
---
ConectorTelegram envia notificaciones automaticas a un canal o grupo de Telegram cuando ocurren eventos relevantes en tu FacturaScripts. Sin coste de API, sin intermediarios: solo necesitas el Bot Token gratuito de Telegram.

Eventos que puede notificar (activables uno a uno):
- Factura de cliente cobrada (pagada).
- Stock de articulo por debajo del minimo.
- Pedido de cliente aprobado.
- Presupuesto de cliente enviado.
- Albaran de cliente creado.
- Vencimiento de documento proximo (integracion opcional con AvisaDoc).
- Recibo impagado pasado su vencimiento.

Caracteristicas:
- Mensajes con formato (negrita, datos del documento) enviados al instante desde la propia operativa.
- Deteccion por tarea programada (cron) horaria para stock bajo, impagos y vencimientos, sin duplicar avisos en 24h.
- Modo silencioso opcional y umbrales configurables (dias de impago y dias de antelacion de vencimientos).
- Registro completo de envios con su estado.
- El Bot Token nunca se muestra en logs ni en respuestas.

Configuracion sencilla desde el Panel de control: pega el Bot Token (de @BotFather) y el Chat ID del canal, activa los eventos que quieras y pulsa Probar conexion.

Requisitos: FacturaScripts 2026, PHP 8.1+, cURL. Compatible con MySQL 8+ y PostgreSQL 11+. Sin dependencias externas.

Desarrollado por YAST TELECOM SL (Adelantia). Software libre bajo licencia LGPL-3.0.