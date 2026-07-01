---
idproject: 659
name: EnvioRapido
permalink: enviorapido
creationdate: 29-06-2026
lastmod: 30-06-2026
version: 1.1
betaversion: 0
mincore: 2026
maxcore: 2026.3
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/EnvioRapido
---
EnvioRapido integra los principales transportistas españoles en FacturaScripts: genera la etiqueta de envío y el número de seguimiento de SEUR y GLS directamente desde un albarán o un pedido de venta, sin entrar en la web de cada transportista. Desde la ficha del documento, el botón &quot;Generar envío&quot; abre un formulario con los datos del destinatario ya rellenados (dirección, población, teléfono...); eliges transportista, bultos y peso, y el plugin crea el envío, guarda la etiqueta y registra la referencia. Cada documento muestra una pestaña con sus envíos y el estado de cada uno (pendiente, en tránsito, entregado, incidencia, devuelto) con enlace al seguimiento público. Una tarea programada diaria actualiza automáticamente el estado de los envíos en tránsito y, opcionalmente, avisa al cliente por email cuando se entrega. Correos Express y MRW quedan preparados para próximas versiones. Las credenciales de cada transportista se guardan de forma segura y nunca se muestran. Compatible con FacturaScripts 2026 y PHP 8.1+.