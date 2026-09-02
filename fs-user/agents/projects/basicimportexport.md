---
idproject: 620
name: BasicImportExport
permalink: basicimportexport
creationdate: 03-06-2026
lastmod: 24-07-2026
version: 1.02
betaversion: 0.1
mincore: 2025
maxcore: 2026.65
compatible: ProductosCliente
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/BasicImportExport
---
BasicImportExport es un plugin gratuito que ofrece una importación y exportación basicas de productos, clientes y proveedores desde/hacia un archivo CSV.


IMPORTACIÓN

Este plugin le será útil si es usted un nuevo usuario de FacturaScripts y necesita portar productos, clientes y/o proveedores desde otro programa de facturación hacia FacturaScripts, o si simplemente tiene todos sus datos en un Excel o similar.
Si además usted usa el pugin ProductosCliente, BasicImportExport también le servirá para importar los datos especiales por cliente (referencia, descripción, precio y/o descuento del producto distintos según al cliente al que le vendamos).

También puede utilizarlo para crear o actualizar información en masa. En vez de crear o editar cada producto, cliente o proveedor uno a uno en FacturaScripts, puede hacer una lista de estos en CSV e importarlos todos de una sola vez. Por ejemplo, puede ser muy útil para actualizar los precios de varios productos, o realizar una regularización básica del stock, simplemente haciendo una lista en Excel con la &quot;referencia del producto&quot; y su precio (o la &quot;referencia del producto&quot; y su stock actual&quot;), e importarla.

¿Hay peligro de duplicar los datos si los importo 2 veces, o si algún producto, cliente o proveedor ya existía en FacturaScripts?
Si las referencias estan bien escritas, no hay peligro. Si la referencia del producto, o el nombre de cliente/proveedor (alias) no existen en FacturaScripts, se creará un nuevo producto, cliente o proveedor. Pero si ya existe, simplemente se actualizarán sus datos. Las columnas que estén en blanco dentro del CSV, no serán modificadas dentro de FacturaScripts.
Aún así, se recomienda realizar siempre una copia de seguridad de su base de datos antes de realizar una importación.


EXPORTACIÓN

El plugin también permite exportar productos, clientes y proveedores hacia un archivo CSV.
El propio CORE de FacturaScripts ya le permite &quot;imprimir&quot; a CSV o XLS, exportando a fichero todos los campos de la tabla clientes, productos, etc. pero no exporta por ejempo el cliente con su dirección fiscal, o los productos con su código de barras, ya que dicha información está en otras tablas.
El plugin BasicImportExport sí que le exportará estos datos.


EXPORTAR PARA LUEGO IMPORTAR

Las columnas exportadas son exactamente las mismas (y en el mismo orden) que las que se requieren para importar.
Esto ofrece una posibilidad muy interesante: exportar, modificar lo que se quiera desde Excel y volver a importarlo.
Con ello se actualizarán solo los datos que usted haya cambiado desde Excel.
También podrá exportar los datos de una instalación de FacturaScripts para importarlos fácilmente en otra.


FRAGMENTACIÓN

Tanto la importación como la exportación se realiza por fragmentos (no se sube o descarga todo el archivo CSV entero de una vez). Esto asegura un consumo mínimo de memoria en el servidor, y que no haya problemas de timeout cuando tratamos con archivos CSV grandes.


PERMISOS DE IMPORTACIÓN Y EXPORTACIÓN

Si el usuario no tiene permiso de importación o exportación sobre ListProductos, ListClientes o ListProveedores, no le aparecerá la opción de importar o exportar productos, clientes o proveedores respectivamente. Estos permisos se configuran en el menú Administrador / Usuarios / pestaña Grupos / haciendo clic en un grupo. No olvide asignar los usuarios deseados a este grupo para que hereden los permisos configurados aquí.


OTROS PLUGINS DE IMPORTACIÓN Y EXPORTACIÓN

Existen otros plugins de importación y exportación de datos para FacturaScripts, de forma que puede escoger el que más se ajuste a sus necesidades.

- BasicImportExport. Es el más básico y es gratuito. Permite importar y exportar solamente productos, clientes y proveedores. También permite importar características especiales de productos para usar con el plugin ProductosCliente. Los datos deben estar en un formato concreto para poderse importar. El plugin está mantenido por un único programador (aún así, la respuesta ante preguntas e incidencias es bastante rápida).

- CSVImport. Es el importador oficial de FacturaScripts y es mucho más potente y versátil que BasicImportExport. Permite importar prácticamente cualquier cosa, sin importar en qué formato estén los datos. Importación configurable y también por plantillas predefinidas. Solo importación (no exporta). Es un plugin de pago pero su precio es más que asequible. Mantenido por el mismo equipo de programadores que mantiene el CORE de FacturaScripts, por lo que su continuidad y compatibilidad están más que aseguradas. Es el plugin de importación recomendado.
https://facturascripts.com/plugins/csvimport

- Exporter. Es un pugin de exportación avanzada. Realiza exportaciones en background, Solo exporta (no importa). Mantenido por el mismo equipo de programadores que mantiene el CORE de FacturaScripts.
https://facturascripts.com/plugins/exporter

- ExportarColumnasVisibles. Permite filtrar y ordenar los datos exportados por el propio CORE (cuando imprimimos un listado en excel o CSV).
https://facturascripts.com/plugins/exportarcolumnasvisibles