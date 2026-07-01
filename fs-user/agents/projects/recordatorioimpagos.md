---
idproject: 611
name: RecordatorioImpagos
permalink: recordatorioimpagos
creationdate: 29-05-2026
lastmod: 26-06-2026
version: 1.3
betaversion: 0
mincore: 2025
maxcore: 2026.3
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/RecordatorioImpagos
---
Automatiza el envío de recordatorios de pago a tus clientes con facturas vencidas, sin que tengas que estar pendiente cada día. Defines la estrategia una vez (qué se envía, cuándo y a quién), y el plugin se encarga del seguimiento diario por ti.

Cada día, a la hora que tú elijas, el sistema revisa las facturas no pagadas de los clientes con seguimiento activado y envía el recordatorio que corresponde en cada caso. Si una factura sigue impagada, en la próxima ejecución se envía el siguiente paso de la secuencia, escalando el tono progresivamente.

Características principales:

- Plantillas de email totalmente editables con marcadores dinámicos: {nombre_cliente}, {codigo_factura}, {importe}, {dias_retraso}, {fecha_vencimiento}, {fecha_factura}, {nombre_empresa}, {email_cliente}, {cifnif_cliente}.
- Secuencias configurables con tantos pasos como quieras y dos tipos de disparador: por días desde el vencimiento, o por días desde el último aviso enviado (con opción de repetir indefinidamente hasta el cobro).
- Activación opt-in por cliente: nadie recibe nada hasta que tú lo actives explícitamente en su ficha. También puedes activar/desactivar el seguimiento en todos los clientes a la vez con un solo clic.
- Interruptor maestro global para pausar todo el sistema sin perder la configuración.
- Adjunta automáticamente el PDF de la factura en cada envío.
- Historial completo de envíos con filtros por resultado y por fecha.
- Reconoce automáticamente facturas con varios recibos a plazos (30/60/90 días) y calcula el retraso desde el primero no pagado.
- Solo procesa facturas ya emitidas: las que están en borrador o boceto se ignoran automáticamente.
- Si el cliente paga (marcas el recibo como pagado), deja de recibir recordatorios sin necesidad de hacer nada más.
- Ejecución manual desde el panel para pruebas o para forzar un ciclo cuando lo necesites.

Listo desde el primer día:

El plugin se instala con 4 plantillas predefinidas (Cordial, Firme, Requerimiento, Insistencia) y una secuencia &quot;Estándar 7/15/30&quot; lista para usar. Si te valen, activas el interruptor maestro, marcas los clientes que quieres incluir y a partir del día siguiente el sistema empieza a trabajar por ti.

Configuración centralizada:

Todo se gestiona desde una única pantalla en el menú Administrador → &quot;Recordatorio de impagos&quot;, con cuatro pestañas: Secuencias, Plantillas, Historial y Configuración. Nada queda disperso por el sistema.