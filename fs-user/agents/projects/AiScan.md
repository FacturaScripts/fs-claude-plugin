---
idproject: 559
name: AiScan
permalink: aiscan
creationdate: 13-03-2026
lastmod: 24-05-2026
version: 7.2
betaversion: 7.1
mincore: 2025
maxcore: 2026.2
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/AiScan
---
AiScan automatiza la introducción de facturas de proveedor permitiéndote escanear documentos PDF e imágenes desde una pantalla dedicada en el menú de Compras. Sube uno o varios archivos de golpe y deja que la inteligencia artificial extraiga automáticamente los datos del proveedor, número de factura, fechas, importes, impuestos y líneas de detalle.

Al acceder a Compras &gt; AiScan puedes subir múltiples PDFs o imágenes a la vez. El plugin los analiza en paralelo utilizando el proveedor de IA configurado (OpenAI, Google Gemini, Mistral o cualquier endpoint compatible con OpenAI). También permite usar la Browser Prompt API de Google Chrome para procesar los documentos en local, sin enviar datos a servicios externos.

Los datos extraídos de cada documento se muestran en un panel de revisión donde puedes validar y corregir proveedor, cabecera, líneas e impuestos antes de crear la factura de compra. Si subes varios archivos, un asistente te guía documento a documento. Cada línea cuenta con un modal de edición detallado donde puedes ajustar descripción, cantidad, precio, descuentos, impuestos y retenciones, además de buscar y seleccionar productos de tu catálogo.

El plugin busca automáticamente coincidencias con proveedores existentes por NIF/CIF o nombre, y empareja los productos extraídos con los de tu base de datos por SKU o descripción. Si no encuentra coincidencia, permite seleccionar manualmente o crear datos nuevos.

El prompt de extracción se mantiene actualizado con cada versión del plugin. Desde la configuración puedes consultar el prompt base completo y añadir instrucciones adicionales que se concatenan automáticamente, sin necesidad de mantener el prompt entero a mano.

Compatible con FacturaScripts 2025 y PHP 8.1 o superior. No requiere dependencias externas más allá de la clave API del proveedor de IA elegido.