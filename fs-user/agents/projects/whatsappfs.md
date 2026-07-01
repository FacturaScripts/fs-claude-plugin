---
idproject: 609
name: WhatsAppFS
permalink: whatsappfs
creationdate: 27-05-2026
lastmod: 27-05-2026
version: 4
betaversion: 0
mincore: 2025
maxcore: 2026.3
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/WhatsAppFS
---
Notificaciones WhatsApp para clientes y administrador
Envía notificaciones automáticas por WhatsApp a tus clientes cuando se emite una factura, se cobra un recibo o se registra un pedido, y recibe en tu propio teléfono un aviso instantáneo de todo lo que ocurre en tu FacturaScripts. Integración directa con la API oficial de WhatsApp Business Cloud (Meta), sin servicios intermediarios ni costes por mensaje añadidos.
¿Qué hace este plugin?
WhatsAppFS conecta tu FacturaScripts con la API oficial de WhatsApp para que, sin tocar nada, tu cliente reciba un mensaje cuando le emites una factura o le confirmas un cobro, y tú recibas un aviso en tu móvil cada vez que pasa algo importante en el negocio: una venta nueva, un cobro recibido o un resumen diario de los recibos vencidos. Todo configurable: tú decides qué eventos disparan aviso al administrador, cuáles al cliente, y con qué texto.
Características principales

Configuración de un teléfono del administrador para recibir todos los avisos del sistema, con botón de &quot;Enviar mensaje de prueba&quot; para verificar la configuración.
Notificaciones automáticas en cinco eventos: nueva factura emitida, nuevo presupuesto, nuevo pedido, recibo pagado y resumen diario de recibos vencidos.
Interruptores independientes por evento: para cada evento puedes activar o desactivar el aviso al admin y al cliente por separado.
Plantillas de mensaje completamente personalizables, una para el admin y otra para el cliente en cada evento, con variables como nombre, importe, número de factura, fecha, etc.
Envío masivo de recordatorios a recibos vencidos desde el panel, con selección manual y respeto a los rate limits de Meta.
Envío rápido manual: formulario para mandar un WhatsApp puntual a cualquier número desde el propio FacturaScripts.
Registro histórico de todos los mensajes enviados con estado (enviado, entregado, leído, error), tipo, destinatario, contenido y trazabilidad al modelo de origen.
Si el cliente no tiene teléfono guardado, el sistema lo omite silenciosamente sin romper el flujo. Si el admin no está configurado, los avisos se descartan sin error.
CRON diario con resumen de recibos vencidos: una sola notificación al día con el total de vencidos, importe pendiente y top 5 clientes morosos.

Requisitos

FacturaScripts 2025 o superior.
Cuenta de Meta for Developers con WhatsApp Business activado (Cloud API).
Phone Number ID y Access Token permanente generados en Meta. La API es gratuita en su tramo inicial; consulta los precios de Meta para volúmenes altos.

Cómo configurarlo en 5 minutos

Instala el plugin desde Administración → Plugins, subiendo el ZIP.
Abre el menú Ventas → WhatsApp FS.
Introduce el Phone Number ID y el Access Token de tu app de Meta (los encuentras en developers.facebook.com → tu app → WhatsApp → API Setup).
Configura el teléfono del administrador (formato internacional, ej. +34666123456) y pulsa &quot;Enviar mensaje de prueba&quot; para verificar.
En la tabla de eventos, activa los interruptores que quieras y, opcionalmente, edita las plantillas con el icono del lápiz. Guarda y listo: a partir de ese momento las notificaciones se disparan solas.

Para quién es este plugin
Pensado para autónomos y PYMEs que quieren saber al instante cuándo se emite una factura sin tener que abrir el ordenador, reducir la morosidad enviando recordatorios automáticos profesionales por WhatsApp en lugar de por email (que muchos clientes no leen) y dar una imagen más cuidada al cliente confirmando emisiones de factura y cobros por el canal que la gente realmente mira.
Privacidad y seguridad
El plugin se comunica directamente con la API de Meta usando el token que tú configuras. No hay servidores intermedios, ni Estudio Cinco ni terceros ven los mensajes que envías. Los datos viajan únicamente entre tu instalación de FacturaScripts y los servidores de WhatsApp.