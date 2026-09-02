---
idproject: 656
name: AsistenteIAFS
permalink: asistenteiafs
creationdate: 29-06-2026
lastmod: 20-08-2026
version: 1.7
betaversion: 
mincore: 2026
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/AsistenteIAFS
---
AsistenteIAFS es un copiloto de inteligencia artificial integrado en FacturaScripts 2026: un chat flotante accesible desde cualquier pantalla que entiende el contexto en el que estás y te ayuda a consultar, analizar y gestionar tu negocio en lenguaje natural, sin saber SQL.

## Funciones principales

- Consultas en lenguaje natural: pregunta por ventas, impagados, stock, márgenes, clientes… y el asistente traduce tu pregunta a SQL de solo lectura y la ejecuta de forma segura.
- Análisis con texto, tablas y gráficos, exportable de forma nativa a CSV, Excel (XLSX) y PDF.
- Integración con el ERP: en lugar de mostrar SQL, navega a cualquier pantalla y te sugiere abrir la ficha del cliente, su listado de facturas filtrado, etc.
- Creación de documentos: desde lenguaje natural o desde archivos adjuntos (p. ej. facturas de proveedor en PDF/imagen), generando un borrador para revisar y confirmar.
- Acciones asistidas que escriben: además de consultar, puede proponer acciones que modifican datos (p. ej. marcar recibos como pagados) siempre con confirmación explícita y registro de auditoría.
- Informes programados: consultas que se ejecutan solas (diario, semanal o mensual) y llegan por email en Excel o CSV.
- Multiproveedor: Anthropic (Claude), OpenAI (ChatGPT) y Google Gemini; eliges el proveedor y el modelo, y usas tu propia clave de API.
- Historial de conversaciones: continúa una conversación anterior o recupera otras.

## Opciones avanzadas

- Llamada nativa a herramientas (tool calling) para respuestas más precisas.
- Respuesta en streaming para ver el texto según se genera.
- Ampliable: otros plugins pueden añadir sus propios tipos de documento, acciones y tablas.

## Seguridad y privacidad

- Consulta de solo lectura blindada (transacción de solo lectura, validación estricta y tablas sensibles bloqueadas).
- Claves de API cifradas (AES-256-GCM) y límite de consumo diario configurable con control de coste por tokens.
- Anonimización RGPD: opción de anonimizar datos personales antes de enviarlos a la IA.

## Demo online

Prueba el plugin sin instalar nada en https://asistenteia.adelantia.com — Acceso: usuario demo / contraseña demo1234. Es un entorno público de pruebas (los datos pueden reiniciarse; no introduzcas datos reales). Guía paso a paso en la pestaña Documentación.

## Requisitos

FacturaScripts 2026, PHP 8.1 o superior. Necesitas tu propia clave del proveedor de IA.

Desarrollado por YAST TELECOM SL (Adelantia).