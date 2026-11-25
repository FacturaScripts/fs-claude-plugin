---
idproject: 706
name: AutoEnvioFacturas
permalink: autoenviofacturas
creationdate: 10-07-2026
lastmod: 05-11-2026
version: 1.2
betaversion: 0
mincore: 2026.65
maxcore: 2026.72
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/AutoEnvioFacturas
---
Envía **automáticamente por email** cada factura de cliente que emites, con su **PDF adjunto**, sin tocar un botón. Y si trabajas con **Verifactu**, el email no sale hasta que el **QR** ya está en el PDF.

AutoEnvioFacturas revisa cada minuto las facturas emitidas y las manda al **contacto de facturación** del cliente (o, si no tiene, al email del cliente). Los **bocetos nunca se envían**, y cada factura sale **una sola vez**, también si alguien la manda a mano con el botón de enviar.

**Características principales:**

- **Envío automático por cron**: las facturas emitidas salen solas, cada minuto, con el PDF en el formato de impresión predeterminado.
- **Compatible con Verifactu**: en ejercicios en modo Verifactu, solo se envía la factura ya registrada, con su QR en el PDF. Nunca una anulada.
- **Margen antes de enviar**: unos minutos de cortesía (1 por defecto) para corregir una factura recién emitida antes de que salga.
- **Email editable**: asunto y texto con marcadores `{name}`, `{code}`, `{date}`, `{total}`, `{company}`, `{email}` y, desde la 1.2, `{payment_method}` (forma de pago), `{due_date}` (vencimiento) y `{bank_account}` (cuenta para el pago), desde Administrador → Email → Notificaciones. La lista completa está en la propia pestaña de ajustes.
- **Historial de envíos con colores**: una fila por factura con su estado (enviado, error, sin email, programado, reenvío, esperando Verifactu) y el **motivo real** de cada fallo.
- **Repetir y Reenvío**: reintenta los envíos fallidos o reenvía una factura ya enviada desde el propio historial, sin tocar la base de datos.
- **Reintentos controlados**: hasta 3 intentos por factura ante fallos de correo, y avisos claros en Administrador → Logs.
- **Nunca dos veces**: aunque el cron se lance dos veces a la vez o falle algo al marcar la factura como enviada, cada factura sale una sola vez. Y las facturas bloqueadas (sin email, esperando a Verifactu) nunca retrasan a las demás.
- **Copia oculta (CCO)** opcional, **límite de emails por pasada** y **fecha de inicio** para no enviar facturas antiguas.

**Listo en dos minutos**: se instala desactivado. Eliges desde qué fecha enviar, marcas *Activo* y guardas. Todo se configura dentro de **Administrador → Email**, en dos pestañas nuevas: *Envío de facturas por email* e *Historial de envíos*.

**Requisitos:** FacturaScripts 2026.65 o superior (probado en 2026.7, 2026.71 y 2026.72), PHP 8.1 o superior, una cuenta de email configurada en Administrador → Email y el cron del servidor ejecutándose cada minuto. Para el flujo con QR, el plugin oficial Verifactu.