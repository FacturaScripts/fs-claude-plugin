---
idproject: 582
name: ExportarColumnasVisibles
permalink: exportarcolumnasvisibles
creationdate: 18-04-2026
lastmod: 18-08-2026
version: 1.8
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/ExportarColumnasVisibles
---
Plugin para FacturaScripts que hace que las descargas a CSV y Excel se parezcan a lo que ves en pantalla, y que añade a los listados de facturas el desglose de IVA por tipo.

** ¿Para qué sirve?**
Cuando abres cualquier listado de FacturaScripts —facturas, pedidos, clientes, productos…— tú decides qué columnas quieres ver, en qué orden, y cuáles no te interesan. Esa preferencia la guardas desde la pantalla de **Opciones** (EditPageOption) y FacturaScripts la respeta perfectamente cuando ves el listado en pantalla o cuando lo imprimes en PDF.

El problema llega cuando pulsas &quot;Descargar CSV&quot; o &quot;Descargar Excel&quot;.

En ese momento FacturaScripts se olvida de tu configuración y vuelca la tabla entera: todos los campos de la base de datos, en el orden en que están guardados internamente, incluidos los técnicos que no tienen ningún valor para ti. El resultado son hojas con decenas de columnas, nombres raros como &quot;codcliente&quot; o &quot;fecharecepcion&quot;, y un desorden que te obliga a reordenar, ocultar y renombrar cada vez que quieres mandar el fichero a un compañero o abrirlo en Excel.

Este plugin arregla exactamente eso, y además resuelve el otro problema del que se queja todo el que manda listados a la gestoría: que el IVA no viene desglosado.

**¿Qué cambia cuando lo instalas?**
En la pantalla de **Opciones** de cada listado aparece un nuevo interruptor en la parte de arriba:

( *) (Exportar a CSV / Excel solo estas columnas y en este orden)

Cuando está **activado** para una vista (por ejemplo, el listado de facturas a clientes):

* Al pulsar **CSV** o **Excel**, el fichero descargado contiene **solo las columnas que tienes visibles** en ese listado.
* Las columnas aparecen **en el mismo orden** que has configurado.
* Las cabeceras salen con el **nombre traducido** que ves en pantalla (por ejemplo, Cliente en vez de &quot;codcliente&quot;, o Fecha en vez de &quot;fecharecepcion&quot;).
* Las casillas de sí/no salen como **Sí** o **No**, no como un 1 y una celda vacía.
* Los desplegables salen con su **descripción completa** —&quot;Domiciliación B2B revisar&quot;— en lugar del código &quot;DOMI2&quot;.
* Se respeta también el **nivel de seguridad**: si una columna está oculta para un usuario concreto, tampoco se exportará para él.

Los importes, las fechas y los números se siguen exportando en bruto a propósito: convertirlos al texto de pantalla los volvería insumables en la hoja de cálculo.

Cuando está **desactivado** (es el valor por defecto), todo sigue funcionando exactamente como siempre: volcado completo, sin cambios.

**El desglose de IVA por tipo**
FacturaScripts guarda en cada factura el IVA total; el desglose por tipo vive en las líneas, así que desde el listado no había forma de verlo. El plugin lo calcula y lo presenta como columnas normales. Por cada tipo de IVA que tengas dado de alta y activo:

* Columna Base 21%	Muestra: La base imponible de las líneas a ese tipo
* Columna IVA 21%	Muestra: La cuota de IVA de esas líneas
* Columna %Rec. 21%	Muestra: El porcentaje de recargo de equivalencia aplicado
* Columna Rec. 21%	Muestra: El importe de ese recargo

Y lo mismo para el 10%, el 4%, el 0%, o el tipo que hayas creado. Si das de alta un IVA nuevo, sus columnas aparecen solas: no hay que tocar nada.

**Por qué es útil**: como cada columna corresponde siempre al mismo tipo, el Excel se puede sumar por columna y sale directamente cuadrado para la gestoría, sin recomponer nada a mano. La suma de las columnas IVA x% de una factura es exactamente su IVA total.

Las columnas nacen ocultas, igual que el resto de columnas de importes del núcleo, y se activan desde Opciones como cualquier otra.

**Grupo de clientes**
El listado de facturas de venta gana una columna **Grupo**, que muestra el nombre del grupo al que pertenece el cliente. El grupo vive en la ficha del cliente, no en la factura, así que el listado no tenía forma de mostrarlo; el plugin lo resuelve con una sola consulta por página. Útil para quien tiene las facturas agrupadas y filtra por grupo en la hoja.

**Las retenciones ya las tienes**
Para el IRPF no hace falta nada del plugin. FacturaScripts ya guarda en cada factura el porcentaje de retención y su importe, y los trae como columnas del núcleo —Retención y Retenciones— ocultas de serie. Se activan desde la misma pantalla de Opciones y se exportan como cualquier otra.

**Exactitud del cálculo**
El desglose se calcula con una sola consulta por página, así que el listado sigue siendo rápido aunque exportes miles de facturas.

En las facturas con un régimen especial —intracomunitarias, exportaciones, inversión del sujeto pasivo, bienes usados (REBU), agencias de viaje o impuestos de importe fijo— el plugin delega en el propio motor de cálculo de FacturaScripts, de modo que lo que ves coincide siempre con lo que dice la factura. Ese camino cuesta varias consultas por factura, así que en instalaciones donde todas las facturas caen en él una exportación muy grande será notablemente más lenta.

**¿Qué consigues con esto?**
* **Informes listos para enviar** sin postproceso manual en Excel.
* **Consistencia** entre lo que ves en pantalla y lo que entregas.
* **IVA desglosado por tipo**, sumable por columna y cuadrado con el total de la factura.
* **Privacidad:** las columnas que has ocultado porque contienen información sensible o técnica ya no aparecen en los ficheros que compartes.
* **Configuración por vista y por usuario**: cada listado puede tener sus propios ajustes, y cada usuario puede personalizarlos si tiene permiso.

**¿Para quién es útil?**
* Administrativos y contables que envían listados de facturas o pedidos a gestorías.
* Comerciales que exportan listados de clientes o presupuestos para trabajar fuera.
* Responsables que preparan informes ejecutivos y no quieren perder 10 minutos limpiando el Excel cada vez.
* Cualquier usuario de FacturaScripts que haya pensado &quot;lo bonito que es el listado en pantalla… y lo feo que se descarga&quot;.

**Compatibilidad**
FacturaScripts 2025 o superior. PHP 8.0 o superior. MySQL/MariaDB y PostgreSQL.

El plugin sustituye la pantalla de Opciones y los exportadores CSV, XLSX y PDF, así que puede entrar en conflicto con otro plugin que sustituya alguno de ellos.

Gratuito, licencia MIT.