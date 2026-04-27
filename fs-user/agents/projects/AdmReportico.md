---
idproject: 126
name: AdmReportico
permalink: admreportico
creationdate: 12-06-2021
lastmod: 15-02-2025
version: 1.31
betaversion: 1.23
mincore: 2024.5
maxcore: 2024.96
compatible: 
min_php: 7.2
require: 
require_php: 
url: https://facturascripts.com/plugins/AdmReportico
---

Este Plugin te permite administrar los informes diseñados con el &quot;Diseñador de Informes Reportico&quot;. Informes que podremos descargar en formato PDF o en CSV, para estadísticas o para imprimir documentos. He incluido 4 informes de prueba:

- &#39;AnticiposPedidosCli.xml&#39;, si tienes instalado el plugin &#39;Anticipos&#39;, te servirá para entregar un comprobante del anticipo recibido a cuenta de un pedido de cliente.

- &#39;PedidosClientes.xml&#39;, obtendrás un documento en formato PDF, para imprimir o enviar un pedido a tu cliente.

- &#39;InterAnualPresupAcept.xml&#39;, conseguirás un documento con importes y unidades de presupuestos de venta aceptados en los últimos 72 meses. Incluye una gráfica al final del documento.

- &#39;ProductosEntregados.xml&#39;, estadística de los productos entregados (albaranes de venta), desglosado por empresas. Incluye una gráfica al final del documento.

El plugin añade un botón para acceder a cada informe diseñado, para obtener el documento correspondiente.

En la documentación publicada junto con esta versión del plugin, están las instrucciones para instalar y configurar Reportico, para poder utilizarlo mediante este plugin.

Este NO es un plugin para usuarios noveles, sino para usuarios experimentados y con acceso total al servidor donde tenga alojado FacturaScripts. No pienses que lo vas a instalar y vas a poder diseñar informes enseguida. Necesitarás realizar unas cuantas acciones y disponer de tiempo para el aprendizaje hasta conseguir diseñar informes con el &quot;Diseñador de Informes Reportico&quot; ( diseñador que actualmente está integrado en Laravel, Joomla o Yii ).

Se irán publicando videos con una muestra de diseño de informe, sencillo al principio, y se irá ampliando poco a poco hasta conseguir un informe completo y que sea útil. ¡¡¡ Estad atentos a las publicaciones !!!

( Desde la V0.61 se ha incluido soporte para las Preferencias de Aplicación de FS, accesible desde Admin &gt; Panel de Control &gt; reportico. para indicar la ruta donde se ha instalado el diseñador de informes Reportico. La primera vez que se instala este plugin, el usuario ha de ingresar la &quot;url absoluta a reportico&quot; (http://loQueSea o https://loQueSea ).

( Desde la V0.81 se ha reconfigurado la forma de incluir los botones de acción para acceder al diseñador de informes Reportico, y sobre todo a los diferentes informes. Ahora se ha de seleccionar el informe que se desee utilizar y pulsar el botón &quot;doble-Check&quot; para que se pueda construir el enlace a dicho informe. En ese momento se nos mostrará un mensaje con el enlace al informe. Al hacer clic en el enlace, se abrirá una nueva pestaña en el navegador, con el informe seleccionado. Con lo que se ha conseguido evitar tener que incluir un botón para cada informe, como se hacía hasta ahora.  ).
