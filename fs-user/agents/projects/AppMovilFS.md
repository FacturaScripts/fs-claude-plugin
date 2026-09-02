---
idproject: 733
name: AppMovilFS
permalink: appmovilfs
creationdate: 17-07-2026
lastmod: 21-08-2026
version: 1.4
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/AppMovilFS
---
Convierte tu FacturaScripts en una aplicacion web instalable en el movil (PWA) y anade un centro de notificaciones. Los usuarios pueden instalar FacturaScripts como app en su telefono o escritorio y reciben avisos dentro de la aplicacion, con un icono de campana flotante y contador de no leidas. Incluye una API muy sencilla para que cualquier otro plugin envie notificaciones a un usuario a traves de este: Notificador::enviar(nick, titulo, mensaje, url, icono, origen). Soporta notificaciones push web opcionales (requiere claves VAPID y la libreria minishlink/web-push). Manifest y service worker con ambito global, panel de configuracion (nombre de la app, color, push) y boton de instalacion. Ideal para centralizar avisos de vencimientos, jornada, pedidos y cualquier evento de tus plugins.