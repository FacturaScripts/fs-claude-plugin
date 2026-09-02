---
idproject: 612
name: ScheduledMail
permalink: scheduledmail
creationdate: 31-05-2026
lastmod: 31-05-2026
version: 1.1
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/ScheduledMail
---
ScheduledMail añade el envío programado de emails al flujo normal de FacturaScripts. Cuando redactas un email desde el formulario de envío habitual (por ejemplo, al enviar una factura), puedes elegir de forma opcional una fecha y hora futura. Si dejas el campo vacío, el email se envía inmediatamente como siempre; si eliges una fecha futura, el email no se envía en ese momento, sino que se programa y se entrega más tarde.

El campo «Programar envío» se integra en el formulario de envío estándar. Al seleccionar una fecha futura válida, el botón de enviar cambia de color e icono para dejar claro que el correo se programará en lugar de enviarse al instante. Se puede programar con un máximo de 30 días de antelación; este límite se valida tanto en el navegador como en el servidor.

Los emails programados se entregan reutilizando la infraestructura nativa de FacturaScripts: se registran en la cola de trabajos (WorkQueue) y los envía el cron del sistema cuando llega el momento. No se reinventa el envío de correo ni se añade un cron propio: se usan las mismas clases de email, la misma configuración SMTP y el mismo mecanismo de adjuntos que el envío inmediato.

Los adjuntos (el PDF del documento generado y los archivos que subas) se copian a una carpeta propia del plugin para que sigan disponibles aunque el email se programe para dentro de varios días. Cada email programado guarda su estado (pendiente, enviado, fallido o cancelado), y dispone de una pantalla de gestión donde puedes revisar y cancelar los envíos pendientes. El documento relacionado se marca como enviado solo después de la entrega correcta.

Compatible con FacturaScripts 2025 y PHP 8.1 o superior. Requiere tener el cron / la cola de trabajos configurada y en ejecución para que los emails programados se entreguen.