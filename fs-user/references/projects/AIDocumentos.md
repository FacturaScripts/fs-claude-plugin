---
idproject: 556
name: AIDocumentos
permalink: aidocumentos
creationdate: 10-03-2026
lastmod: 23-11-2026
version: 10.6
betaversion: 0
mincore: 2025
maxcore: 2030
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/AIDocumentos
---
Sube la factura del proveedor en PDF o foto: AIDocumentos la lee con la IA que elijas y te deja el borrador listo para revisar y aprobar en FacturaScripts.

QUÉ HACE
• Lee facturas de proveedor, albaranes y tickets (PDF, JPG, PNG, WEBP) y saca proveedor, NIF, número, fechas, base, IVA, IRPF, total y líneas.
• Factura electrónica Facturae (XML y XSIG firmado): datos exactos al instante, sin pasar por la IA.
• Entrada manual, por lotes, desde un buzón de correo (también automática cada día) o por API con token.
• Cada documento entra como borrador: lo revisas junto al original y lo apruebas. Aprobación en bloque de los de confianza alta, viendo antes la lista.
• Comprueba la letra de control del NIF/CIF, la aritmética de la factura y si ya existe, para no duplicarla.
• Reglas por proveedor (serie y forma de pago fijas), emparejado con albaranes pendientes y tickets como nota de gasto (con GastosFS).
• NUEVO: Extractos bancarios. Importa el Norma 43, el CSV o el PDF/foto del extracto, comprueba los saldos y propone el recibo pendiente de cada movimiento. Nada se marca pagado hasta que lo confirmas, y se puede deshacer.
• Métricas de uso y horas de tecleo ahorradas, informe mensual por email y avisos de borradores pendientes.
• Copia de las facturas importadas en carpetas por año y trimestre, para tu gestoría.

CÓMO FUNCIONA
1. Configura tu proveedor de IA con tu propia clave (o tu servidor local).
2. Sube el documento, reenvíalo al buzón o mándalo por la API.
3. Revisa el borrador y pulsa Aprobar: se crea la factura de proveedor con el original adjunto.

PARA QUIÉN
Empresas, autónomos y gestorías que teclean muchas facturas de proveedor y quieren dejar de hacerlo sin perder el control.

NOVEDADES
• 10.6: Iberbox, solo para pasar las facturas a tu gestoría: botón «Avisar a mi gestoría» con el correo ya escrito para que se haga su cuenta gratis y te pase el enlace de su buzón; las facturas quedan en su cuenta y las puede abrir y editar.
• 10.5: la carpeta de la gestoría, también en Iberbox: cuenta gratis desde el panel (2 GB al empezar y hasta 5 GB) y las facturas llegan solas y cifradas al buzón de tu gestoría.
• 10.4: la carpeta de la gestoría te avisa si la has puesto dentro de la instalación de FacturaScripts (o de MyFiles), donde un servidor nginx mal ajustado podría entregar las facturas a quien adivine la ruta; y los originales se guardan con un nombre mucho más difícil de adivinar.
• 10.3: más seguro: las claves de IA, el token de subida y la contraseña del buzón ya no salen por la API de FacturaScripts; y si la base de datos falla justo al comprobar si una factura ya existe, el documento se queda en espera en vez de crear una factura duplicada.
• 10.2: extractos del banco más listos: el Norma 43 en .txt del BBVA (y en latin-1 o CP850) se lee bien; una transferencia que paga varios recibos o solo una parte; reglas para ignorar comisiones o asignar un concepto a un cliente o proveedor; y los PDF largos se leen por partes en vez de cortarse.
• 10.1: al crear la factura desde la pantalla «Analizar con IA» ya no se pierden las líneas, y al editar una línea se conservan el descuento, el recargo, el IRPF y la referencia.
• 10.0: Extractos bancarios con conciliación de recibos; la dirección antigua de la API funciona sin sesión; las IP de los rechazos se borran a los 90 días.
• 9.8: la subida por API funciona solo con el token, sin sesión abierta, y siempre como borrador.
• 9.7: correcciones de seguridad (acciones con token, permisos de solo lectura respetados, claves fuera de la página).

ANTES DE ACTUALIZAR FACTURASCRIPTS
• Actualiza primero este plugin a su última versión. Las versiones antiguas declaran compatibilidad solo hasta FacturaScripts 2026.7: cuando salga la próxima versión estable, el actualizador las marcará como incompatibles y su botón Descargar las desactivará. La última versión del plugin está declarada compatible hasta 2030.
• Si ya te sale ese aviso, en el actualizador usa Opciones &gt; No desactivar plugins y actualiza el plugin justo después.

REQUISITOS
• FacturaScripts 2025 o superior y PHP 8.1 o superior, con la extensión cURL.
• Tu propia cuenta de IA: OpenAI, Google Gemini, Mistral, Groq o un servidor compatible con OpenAI (Ollama, LM Studio u OpenRouter), también local. El consumo lo pagas a tu proveedor de IA.
• Para el correo, la extensión IMAP de PHP. Para PDF con Groq o servidor compatible, Imagick o pdftoppm.

AVISO
La IA puede equivocarse al leer un documento: AIDocumentos propone y tú validas. Revisa borradores y conciliaciones antes de confirmarlos y consulta con tu asesor cualquier duda fiscal o contable.