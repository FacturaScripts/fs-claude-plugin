---
idproject: 554
name: AIAnalytics
permalink: aianalytics
creationdate: 05-03-2026
lastmod: 06-03-2026
version: 3
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/AIAnalytics
---
AIAnalytics convierte FacturaScripts en un sistema de inteligencia empresarial con IA integrada. Analiza automáticamente los datos del ERP y actúa como un consultor experto en facturación, finanzas, clientes, stock, procesos y RRHH, todo desde un panel centralizado dentro de tu propio servidor.
Dashboard ejecutivo

KPIs en tiempo real: facturas del mes, cobros pendientes, vencidas, clientes activos, pedidos y stock bajo mínimos.
Análisis automático de 7 módulos: Facturación, Clientes, Stock, Finanzas, Horarios, Procesos y Anomalías.
Sistema de alertas con niveles de severidad (crítico, alto, medio, bajo) con gestión de resolución.
Resumen ejecutivo generado por IA con las conclusiones y acciones prioritarias del negocio.

Chat con el consultor IA

Conversación en lenguaje natural con contexto real de tus datos del ERP.
Historial de conversaciones por sesión.
Respuestas especializadas en finanzas, ventas, operaciones y gestión.

Exportación del informe

Descarga el resumen ejecutivo en PDF con KPIs, alertas activas y análisis completo.
Envío por email con el PDF adjunto, utilizando el servidor SMTP ya configurado en FacturaScripts.

Dos backends de IA compatibles

Ollama (IA local): análisis 100% en tu servidor, máxima privacidad, sin envío de datos. Requiere VPS o servidor dedicado.
Groq API (IA en la nube): gratuita, sin instalación, compatible con hosting compartido. Utiliza el modelo LLaMA 3.3 70B. Los datos de consulta se envían a los servidores de Groq.
Modo Auto: intenta Ollama primero y, si no está disponible, usa Groq automáticamente.
Modo Solo reglas: análisis estadístico sin ningún servicio externo, siempre disponible.

Configuración

Panel de configuración integrado con pestañas: General, Backend IA, Ollama, Groq y Personalidad IA.
Indicador visual del backend activo en la cabecera del dashboard.
Banner de aviso automático cuando ningún backend de IA está configurado, con acceso directo a la configuración.
Prompt de sistema personalizable para adaptar la personalidad del consultor a tu sector.
Umbrales configurables de morosidad, inactividad de clientes y retención de informes.
Alertas críticas por email.

Requisitos

FacturaScripts 2025 o superior.
Para Ollama: servidor VPS o dedicado con acceso root y mínimo 4 GB de RAM libres.
Para Groq: API key gratuita en console.groq.com (no requiere instalación).
Para exportación PDF y email: librería rospdf incluida en FacturaScripts y SMTP configurado en el panel de administración.