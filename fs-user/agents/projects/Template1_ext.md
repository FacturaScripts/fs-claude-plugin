---
idproject: 472
name: Template1_ext
permalink: template1-ext
creationdate: 19-10-2025
lastmod: 02-04-2026
version: 2.32
betaversion: 0
mincore: 2025.43
maxcore: 2026
compatible: IeOmitelineas
min_php: 
require: PlantillasPDF
require_php: 
url: https://facturascripts.com/plugins/Template1_ext
---

Plantilla para el plugin PlantillasPDF. (QR_code Verifactu centrado). Imagen de Fondo. Formatos Independientes. Asignación formatos clientes. Líneas super comprimidas. En Facturas muestra albaranes agrupados con su Subtotal o no. 
A la opción de &quot;Mostrar subtotales por Albarán&quot; se ha añadido la posibilidad de &quot;Mostrar solo la 1ª línea descripción de Albaranes en Facturas&quot;, útil en empresas de servicios con una primera línea de descripción del trabajo realizado y las líneas siguientes con artículos. En este caso legalmente se acepta la factura siempre que vayan los albaranes adjuntos a la factura ya que la primera línea tiene que hacer referencia inequívoca al citado albarán con su número, fecha y descripción concluyente. 

- Posibilidad de Imprimir con un Diseño Nuevo de cabecera: &quot;Logo Izquierda y Empresa debajo, QR_Code central, y Cliente en zona derecha&quot;. Útil para no desperdiciar espacio en facturas Verifactu.

- Se añade la posibilidad de tocar el &quot;Margen superior&quot; (siempre que elijamos el Diseño nuevo activo)&quot;. Esta opción es válida para que quepa el QR_Code de Verifactu (valor mínimo recomendado 55), también el de los datos de la Empresa facturadora (si tenemos una fuente muy grande, ampliar este margen del diseño nuevo).

- Se añade la posibilidad para Albaranes de definir la &quot;Distancia de Logo a Cliente (Diseño nuevo activo)&quot;, útil en albaranes que no llevan evidentemente el QR_Code.

- Posibilidad de cambiar el &quot;Tamaño de la fuente de la Empresa (Diseño nuevo activo)&quot;

Actualización para el formato de documentos de más de una página:
- Solo muestra el Qr_code en la primera página
- Solo se muestran los datos del cliente en la primera página.
- Nuevos sumatorios resumen en páginas múltiples: &quot;Suma y sigue:&quot; y &quot;Sumas anteriores&quot;.
- Plantilla con textos en múltiples idiomas  (es necesaria una versión mínima 6.3 del plugin PlantillasPDF)

-Nueva actualización para que respete y muestre en el pie los vencimientos de los recibos aunque esté marcada como pagada.
-Añadida una casilla en los ajustes del plugin para &quot;Mostrar más dígitos del banco (8 primeros + X + 4 últimos)&quot;.
-Nueva casilla &quot;Ocultar descuento total&quot; por Formato: opción para ocultar la línea &quot;Descuento total&quot; del pie del documento (nueva versión plantillaspdf).

- CONFIGURACIÓN INDEPENDIENTE POR FORMATOS DE DOCUMENTO
  Posibilidad de establecer El tipo de Fuente, el Tamaño, y el Color de los datos: Empresa, Cliente, Factura, Líneas, y Pie de página, de forma independiente y para cada Formato de Impresión.
- IMAGEN TRANSPARENTE EN FONDO o IMAGEN EN ZONA DELANTERA.
 Posibilidad de elegir Opacidad y posición.

NOVEDAD:
- Posibilidad de asignar un Formato de Impresión de Facturas predefinido a cada uno de nuestros Clientes.
    
Basada en la Plantilla Template1 de PlantillasPDF.

Una vez Instalado el Plugin debemos seleccionar la Plantilla supercomprimida dentro de ADMINISTRADOR - PLANTILLASPDF - GENERAL.

Se recomienda utilizar una fuente mínima para que quepan más líneas al ocupar un menor espacio vertical.

Leer en las diferentes pestañas de la Documentación para saber como funcionan los valores de ajustes del plugin.
