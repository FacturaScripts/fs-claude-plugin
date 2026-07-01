---
idproject: 582
name: ExportarColumnasVisibles
permalink: exportarcolumnasvisibles
creationdate: 18-04-2026
lastmod: 18-04-2026
version: 1.1
betaversion: 0
mincore: 2025
maxcore: 2026.3
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/ExportarColumnasVisibles
---
Plugin para FacturaScripts que hace que las descargas a CSV y Excel se parezcan a lo que ves en pantalla.

 ¿Para qué sirve?

Cuando abres cualquier listado de FacturaScripts —facturas, pedidos, clientes, productos…— tú decides qué columnas quieres ver, en qué orden, y cuáles no te interesan. Esa preferencia la guardas desde la pantalla de **Opciones** (EditPageOption) y FacturaScripts la respeta perfectamente cuando ve el listado en pantalla o cuando lo imprime en PDF.

El problema llega cuando pulsas &quot;Descargar CSV&quot; o &quot;Descargar Excel&quot;.

En ese momento FacturaScripts se olvida de tu configuración y vuelca la tabla entera: todos los campos de la base de datos, en el orden en que están guardados internamente, incluidos los técnicos que no tienen ningún valor para ti. El resultado son hojas con decenas de columnas, nombres raros como `codcliente` o `fecharecepcion`, y un desorden que te obliga a reordenar, ocultar y renombrar cada vez que quieres mandar el fichero a un compañero o abrirlo en Excel.

Este plugin arregla exactamente eso.

¿Qué cambia cuando lo instalas?

En la pantalla de **Opciones** de cada listado aparece un nuevo interruptor en la parte de arriba:

&quot;Exportar a CSV / Excel solo estas columnas y en este orden&quot;

Cuando está activado para una vista (por ejemplo, el listado de facturas a clientes):

- Al pulsar CSV o Excel, el fichero descargado contiene solo las columnas que tienes visibles en ese listado.
- Las columnas aparecen en el mismo orden que has configurado.
- Las cabeceras salen con el nombre traducido que ves en pantalla (por ejemplo, &quot;Cliente&quot; en vez de `codcliente`, o &quot;Fecha&quot; en vez de `fecharecepcion`).
- Se respeta también el &quot;nivel de seguridad&quot;: si una columna está oculta para un usuario concreto, tampoco se exportará para él.

Cuando está desactivado (es el valor por defecto), todo sigue funcionando exactamente como siempre: volcado completo, sin cambios.

 ¿Qué consigues con esto?

- Informes listos para enviar sin postproceso manual en Excel.
- Consistencia entre lo que ves en pantalla y lo que entregas.
- Privacidad: las columnas que has ocultado porque contienen información sensible o técnica, ya no aparecen en los ficheros que compartes.
- Configuración por vista y por usuario: cada listado puede tener sus propios ajustes, y cada usuario puede personalizarlos si tiene permiso.

 ¿Para quién es útil?

- Administrativos y contables que envían listados de facturas o pedidos a gestorías.
- Comerciales que exportan listados de clientes o presupuestos para trabajar fuera.
- Responsables que preparan informes ejecutivos y no quieren perder 10 minutos limpiando el Excel cada vez.
- Cualquier usuario de FacturaScripts que haya pensado &quot;lo bonito que es el listado en pantalla… y lo feo que se descarga&quot;.