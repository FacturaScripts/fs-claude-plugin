---
idproject: 627
name: MarketingIA
permalink: marketingia
creationdate: 10-06-2026
lastmod: 10-06-2026
version: 1
betaversion: 0
mincore: 2025
maxcore: 2026.3
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/MarketingIA
---
MarketingIA convierte los datos que ya tienes en FacturaScripts en campañas que venden. Elige a quién quieres llegar, escribe en una frase qué quieres conseguir y la IA redacta el mensaje por ti. Después lo envías por WhatsApp y email a tus clientes en un par de clics, sin salir de FacturaScripts y sin herramientas externas.

CÓMO FUNCIONA
━━━━━━━━━━━━━
1. Segmenta desde tus propios datos: por grupo de clientes, por inactividad (los que hace tiempo que no compran), por clientes activos o por tus mejores clientes según facturación. Filtra además por quién tiene email, teléfono o ambos.
2. Genera el mensaje con IA: escribe el objetivo de la campaña (p. ej. &quot;15% de descuento este mes para reactivar clientes&quot;) y el tono, y la IA crea el texto de WhatsApp, el asunto y el cuerpo del email. Lo revisas y editas lo que quieras.
3. Prueba y envía: manda primero una prueba a tu propio número o email y, cuando esté perfecto, lanza la campaña. Cada envío queda registrado con su estado.

CARACTERÍSTICAS PRINCIPALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Segmentación de clientes desde el ERP: grupo, inactividad, actividad reciente y mejores clientes por facturación.
• Redacción automática con IA multi-proveedor: Groq (gratis), OpenAI, Google Gemini, Mistral o cualquier endpoint compatible con OpenAI (Ollama, etc.).
• Envío por WhatsApp (API oficial de Meta Cloud) y por email (servidor SMTP de FacturaScripts).
• Personalización por cliente con variables {{nombre}} y {{empresa}}.
• Envío de prueba antes de lanzar la campaña.
• Historial de campañas y registro detallado de cada envío (enviado / error) con el motivo.
• Lista de exclusión (RGPD): emails y teléfonos que nunca recibirán campañas.
• Tope de seguridad de destinatarios por campaña.
• Reutiliza la configuración de WhatsAppFS y la clave de IA de AIDocumentos si ya los tienes instalados: cero configuración duplicada.

REQUISITOS
━━━━━━━━━━
• FacturaScripts 2025 o superior.
• PHP 8.0 o superior.
• Para WhatsApp: cuenta de Meta for Developers con WhatsApp Business (Cloud API). Opcional: si solo quieres email, no hace falta.
• Para email: servidor SMTP configurado en FacturaScripts.
• Para la IA: una API Key gratuita de Groq (console.groq.com) u otro proveedor a elección.

PRIVACIDAD
━━━━━━━━━━
El plugin se comunica directamente con la API de IA elegida y con Meta/tu SMTP usando tus propias credenciales; no hay servidores intermediarios. Envía solo a clientes que esperan tu comunicación e incluye siempre una vía de baja, conforme al RGPD.