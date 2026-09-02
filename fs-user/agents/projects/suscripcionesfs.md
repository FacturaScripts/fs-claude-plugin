---
idproject: 628
name: SuscripcionesFS
permalink: suscripcionesfs
creationdate: 10-06-2026
lastmod: 10-06-2026
version: 1
betaversion: 
mincore: 2025
maxcore: 2026.5
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/SuscripcionesFS
---
SuscripcionesFS convierte FacturaScripts en un gestor de cuotas y suscripciones recurrentes. Define tus planes, da de alta a tus clientes y deja que el sistema facture solo cada mes (o el periodo que elijas) y avise de los impagos por WhatsApp y email.

CÓMO FUNCIONA
━━━━━━━━━━━━━
1. Crea planes con su precio, periodicidad (mensual, trimestral, semestral o anual) e IVA.
2. Da de alta la suscripción de cada cliente, con su fecha de próxima factura.
3. El plugin factura automáticamente las cuotas vencidas (botón manual o cron diario), genera la factura de cliente y avanza la fecha al siguiente periodo.
4. Envía recordatorios de impago a los clientes con recibos vencidos por WhatsApp y email.

CARACTERÍSTICAS PRINCIPALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Planes de cuota con periodicidad mensual, trimestral, semestral o anual.
• Suscripciones por cliente con estados activa / pausada / cancelada.
• Facturación automática por cron, o manual con un botón.
• Avisos de impago por WhatsApp (Meta Cloud API) y email (SMTP), con plantillas. Reutiliza la configuración de WhatsAppFS si la tienes.
• Cuadro de mando con MRR, suscripciones activas, cuotas vencidas, renovaciones e impagos.
• Historial detallado de cada facturación.

REQUISITOS
━━━━━━━━━━
• FacturaScripts 2025 o superior y PHP 8.0 o superior.
• WhatsApp: cuenta de Meta for Developers (Cloud API). Opcional si solo usas email.
• Email: SMTP configurado en FacturaScripts.

PARA QUIÉN ES
━━━━━━━━━━━━━
Negocios con ingresos recurrentes: gimnasios, academias, asociaciones, despachos, mantenimientos o cuotas de socios que quieran automatizar la facturación periódica y reducir la morosidad.