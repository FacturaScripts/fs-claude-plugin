---
idproject: 656
name: AsistenteIAFS
permalink: asistenteiafs
creationdate: 29-06-2026
lastmod: 29-06-2026
version: 1
betaversion: 0
mincore: 2026
maxcore: 2026.3
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/AsistenteIAFS
---
Copiloto de inteligencia artificial integrado en FacturaScripts. Un chat flotante accesible desde cualquier pantalla que entiende el contexto en el que estas y te ayuda a consultar, analizar y gestionar tu negocio en lenguaje natural.

## Funciones principales
- **Consultas en lenguaje natural** sobre tus datos (ventas, impagados, stock, margenes, clientes...), traducidas internamente a SQL de SOLO LECTURA y ejecutadas de forma segura (sin acceso a usuarios, claves ni ajustes).
- **Analisis** con texto, tablas y graficos, con exportacion a CSV.
- **Integracion con el ERP**: en lugar de mostrar SQL, sugiere abrir la ficha del cliente, su listado de facturas filtrado, etc.
- **Creacion de documentos** desde lenguaje natural o desde archivos adjuntos (p. ej. facturas de proveedor en PDF/imagen): genera un BORRADOR (factura de proveedor/cliente, presupuesto, pedido, albaran o gasto) para revisar y confirmar antes de guardar.
- **Sugerencias** para aumentar ventas, beneficio y productividad.
- **Multiproveedor**: Anthropic (Claude), OpenAI y Google Gemini; eliges el modelo y usas tu propia API key.
- **Historial de conversaciones**: continua una conversacion anterior o recupera otras.

## Seguridad y privacidad
- Claves API cifradas en reposo (AES-256-GCM).
- Consultas blindadas de solo lectura (sin tablas de usuarios/ajustes).
- Limite de consumo diario configurable y coste estimado.
- Opcion de anonimizar datos personales (RGPD) antes de enviarlos a la IA.

&gt; Importante: el asistente usa IA y puede cometer errores; la supervision humana final es siempre necesaria. Cada cliente utiliza su propia clave de API del proveedor de IA elegido.