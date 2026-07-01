---
idproject: 556
name: AIDocumentos
permalink: aidocumentos
creationdate: 10-03-2026
lastmod: 18-05-2026
version: 7.1
betaversion: 0
mincore: 2025
maxcore: 2026.3
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/AIDocumentos
---
AIDocumentos escanea y digitaliza tus facturas de proveedor sin teclear un solo dato. Sube una foto o PDF, o configura tu buzón de correo, y la IA extrae todos los campos en segundos y crea la factura en FacturaScripts con un solo clic.

CÓMO FUNCIONA
━━━━━━━━━━━━━
1. Sube una imagen o PDF de la factura (JPG, PNG, WEBP, PDF) — o configura IMAP para procesar adjuntos de correo automáticamente.
2. La IA lee el documento y extrae: proveedor, NIF/CIF, número de factura, fecha, concepto, base imponible, % IVA, cuota IVA, % IRPF y total.
3. Revisas los datos extraídos y, si son correctos, pulsas «Aprobar y crear factura» — FacturaScripts crea la factura de proveedor al instante.

CARACTERÍSTICAS PRINCIPALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Reconocimiento OCR con IA generativa (Groq Vision / Llama 4 Scout 17B).
• Soporte multi-empresa: detecta la empresa receptora por NIF o nombre, con empresa por defecto configurable.
• Detección automática de duplicados (mismo proveedor + fecha + importe).
• Soporte completo de IRPF / retenciones.
• Vista previa del documento original junto a los datos extraídos.
• Edición en línea de cualquier campo antes de aprobar.
• Re-análisis con IA de documentos ya guardados.
• Lectura automática de correo IMAP con programación por cron.
• Historial completo con filtros por estado, origen, proveedor y fecha.
• Dashboard con estadísticas: procesados hoy, borradores pendientes, importados este mes y confianza media.
• Exportación opcional del archivo original a una carpeta local organizada por empresa/año/mes.
• Compatibilidad total con IVA peninsular, IVA reducido, IVA superreducido, IGIC (Canarias) y operaciones exentas.

REQUISITOS
━━━━━━━━━━
• FacturaScripts 2025 o superior.
• PHP 8.0 o superior.
• API Key gratuita de Groq (console.groq.com) — sin coste para volúmenes normales.
• Para conversión de PDF: extensión PHP Imagick o poppler-utils instalado en el servidor.
• Para lectura de correo: extensión PHP IMAP habilitada y acceso a un buzón IMAP.

PRIVACIDAD
━━━━━━━━━━
Las imágenes se envían a la API de Groq únicamente para la extracción de datos y no se almacenan en sus servidores según su política de privacidad.