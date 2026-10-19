---
idproject: 556
name: AIDocumentos
permalink: aidocumentos
creationdate: 10-03-2026
lastmod: 16-10-2026
version: 9.6
betaversion: 0
mincore: 2025
maxcore: 2030
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/AIDocumentos
---
AIDocumentos lee tus facturas de proveedor con IA y las mete en FacturaScripts: subes el PDF o la foto, el plugin saca proveedor, número, fecha, base, IVA y líneas, y te deja el borrador listo para revisar.NOVEDAD 9.4 — LA CARPETA QUE LE PASAS A TU GESTORÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cada factura que se contabiliza deja ahora una copia ordenada en la carpeta que tú digas, pensada para compartirla directamente con quien te lleva los impuestos:

    2026/T1/Mi-Empresa-SL/2026-02-14_ENDESA-ENERGIA_FE2026-000123.pdf

• Por defecto se ordena por **año / trimestre / empresa**, que es lo que pide un gestor: abre el trimestre que le toca declarar y ahí está todo. Hay otras cuatro formas por si prefieres otra.
• El nombre del fichero empieza por la fecha, así que ordena solo, y lleva el proveedor y el número: se sabe qué es sin abrirlo. Sin acentos ni caracteres raros, para que no dé problemas en Windows.
• **El archivo original no se toca.** Esto es una copia aparte; puedes borrar la carpeta entera y volver a generarla cuando quieras.
• Si activas esto teniendo ya documentos procesados, se pueden reordenar los anteriores sin volver a escanear nada.

Se configura en Opciones &gt; AIDocumentos, en «La carpeta que le pasas a tu gestoría». Si lo dejas vacío, el plugin funciona como siempre y no copia nada.

CORREGIDO 9.3 — SI USAS MySQL O MariaDB, ACTUALIZA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
La pantalla de métricas de AIDocumentos (documentos por mes, importe, tiempo ahorrado, uso por proveedor de IA) fallaba en instalaciones con MySQL o MariaDB con dos mensajes de este tipo:

«You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version...»

El motivo: la consulta que agrupa los documentos por mes estaba escrita en el dialecto de PostgreSQL, y una de las funciones no se llama igual en MySQL. El servidor rechazaba la consulta entera. No afectaba a los datos ni a los documentos ya procesados — solo a esa pantalla, que no llegaba a pintarse.

Ya está reescrita con SQL estándar que entienden los dos motores. Si te salía ese mensaje, actualiza y desaparece. Gracias a quien lo reportó.

Desde esta versión los plugins se prueban contra **PostgreSQL y MariaDB** antes de publicarse, no solo contra uno.

NOVEDAD 9.2 — EL PANEL, ESCRITO EN CASTELLANO DE VERDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hasta la 9.1 se leía «Configuracion IA», «Revision automatica diaria», «Anadir linea», «Ultima ejecucion automatica», «Tamano max. MB» y «Arrastra el documento aqui». Cuarenta y cinco textos sin una sola tilde, y una ene donde va una eñe.

En un plugin que se paga, eso no da la talla. Están todos repasados.

Y se ha quitado un botón «Exportar CSV» duplicado: cuando tenías borradores pendientes aparecía dos veces, uno debajo del otro.

ACTUALIZA A LA 9.1 — CORRECCIÓN DE SEGURIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
En versiones anteriores, la aprobación masiva de borradores se ejecutaba con un simple enlace y el panel no comprobaba el token de formulario en ninguna de sus acciones. Con la sesión abierta, una página ajena podía hacer que tu navegador creara facturas de proveedor sin que tú lo pidieras. En la 9.1 todas las acciones que cambian datos van por POST y con token. Es una actualización recomendada para todos.

NOVEDAD 9.1 — ver antes de aprobar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aprobar en bloque crea facturas de proveedor de verdad. Ahora hay un botón para VER primero la lista de lo que se va a aprobar —proveedor, número, fecha, importe y confianza de cada borrador— y aprobarla desde ahí. Con volumen, es la diferencia entre usar la aprobación masiva o no atreverse.

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