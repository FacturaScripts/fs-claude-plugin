---
idproject: 735
name: ServiceRenewals
permalink: servicerenewals
creationdate: 21-07-2026
lastmod: 22-08-2026
version: 1.3
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/ServiceRenewals
---
ServiceRenewals convierte FacturaScripts en tu agenda de renovaciones de servicios. Si vendes dominios, alojamientos web, servidores VPS o dedicados, certificados SSL, mantenimientos, licencias o copias de seguridad, cada servicio tiene su propia fecha de vencimiento y renovarlo a tiempo depende de que alguien se acuerde. Este plugin registra cada servicio contratado por cada cliente, avisa antes del vencimiento, genera el presupuesto de renovación y lo envía por email con el PDF adjunto.

El funcionamiento se apoya en tres piezas. En cada producto defines un perfil de renovación con los valores predeterminados: periodicidad en meses, días de antelación para generar el presupuesto, días de recordatorio y política de renovación. Después creas una suscripción por cada servicio contratado: cliente, producto, identificador concreto (por ejemplo ejemplo.com o vps-production-01), proveedor y su fecha real de vencimiento. Cada renovación queda registrada en un ciclo con su historial completo: cuándo se generó el presupuesto, cuándo se envió, qué factura lo cerró y cuándo avanzó la fecha. La suscripción puede sobrescribir cualquier valor del perfil, incluidos el precio y el email de aviso.

Cuando una suscripción entra en el umbral de antelación, el cron de FacturaScripts genera automáticamente el presupuesto con la línea del producto, el identificador del servicio y el periodo cubierto, y lo envía al email de facturación del cliente. También envía recordatorios los días configurados (por ejemplo 15, 7 y 3 días antes del vencimiento) mientras el presupuesto siga sin facturar. Todos los envíos quedan registrados con su estado y sus reintentos, y las plantillas de los emails se personalizan desde la configuración con marcadores como el nombre del cliente, el servicio o la fecha de vencimiento.

Cuando el presupuesto se transforma en factura (directamente o a través de pedido o albarán), el plugin lo detecta y renueva la suscripción avanzando su fecha de vencimiento el periodo configurado, una sola vez y por meses naturales. Si prefieres controlarlo tú, la política de confirmación manual deja el ciclo pendiente y la fecha solo avanza al pulsar «Confirmar renovación». Las ejecuciones repetidas del cron no crean ciclos, presupuestos ni emails duplicados.

El panel de renovaciones muestra de un vistazo las suscripciones activas, las vencidas, las que vencen en 7 y 30 días, los presupuestos pendientes, las renovaciones por confirmar y los emails fallidos, junto con la lista de próximos vencimientos. El listado principal se puede filtrar por cliente, producto, tipo de servicio, proveedor, estado, fechas de vencimiento y estado del ciclo, y las fichas de cliente y de producto incorporan una pestaña de renovaciones.

Requiere FacturaScripts 2025 o superior, PHP 8.1 o superior y tener configurado el cron de FacturaScripts, imprescindible para las automatizaciones, además de un servidor SMTP para los envíos. El plugin no renueva los servicios en el registrador o proveedor ni realiza cobros automáticos: gestiona el ciclo comercial de la renovación dentro de FacturaScripts. Licencia LGPL 3 o posterior.