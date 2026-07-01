---
idproject: 584
name: ProductosCliente
permalink: productoscliente
creationdate: 26-04-2026
lastmod: 13-06-2026
version: 1.1
betaversion: 0
mincore: 2025
maxcore: 2026.3
compatible: BasicImportExport
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/ProductosCliente
---
El plugin ProductosCliente permite definir para cada producto una referencia, descripción, precio y/o descuento especiales según el cliente al que le vendemos.

Ejemplos:
  - Un cliente nos pide que en sus presupuestos, albaranes y facturas aparezcan sus referencias de producto (las mismas que usa el cliente internamente en su sistema), o incluso sus descripciones de producto (más detalladas que las nuestras, o en otro idioma, por ejemplo), ya sea para todos los productos que le vendamos o solamente para unos pocos en concreto.
  - Queremos aplicar descuentos a ciertos productos, con un precio distinto para cada cliente, de forma muy sencilla (sin necesidad de crear y asignar tarifas).

Para ello, el plugin añade una nueva sección llamada &quot;Especial por cliente&quot; debajo de cada producto (en la pantalla habitual de los productos, menú Almacén / Productos, seleccionando cualquier producto).
En un principio esta sección está vacía (ningún cliente tiene nada especial para ese producto), pero le podemos añadir tantos &quot;casos especiales&quot; como queramos, simplemente haciendo clic en el botón &quot;Añadir&quot; y escogiendo para qué cliente será el caso especial.

Para cada cliente y producto podremos definir una o más de las características siguientes:
  - una referencia de producto especial (que le aparecerá al cliente al lado de nuestra referencia de producto)
  - una descripción de producto especial (que le aparecerá al cliente en vez de la descripción habitual del producto)
  - un precio especial (que sustituirá al precio habitual del producto, sólo para ese cliente)
  - un descuento especial (que se le aplicará sólo a ese cliente para ese producto)

Cuando posteriormente realicemos un presupuesto, albarán o factura para un cliente, si ponemos algún producto que tenga definidos una referencia, descripción, precio o descuento para ese cliente, ya aparecerán automáticamente escritos esos datos especiales.

Para los clientes que no tengan definido un caso especial, aparecerán la referencia, descripción, precio y descuento &quot;normales&quot; del producto.

El plugin ha sido diseñado pensando en la sencillez y facilidad de uso. No hay ningún botón para guardar los cambios, a medida que vayamos creando o modificando casos especiales, estos ya quedarán automáticamente guardados.
Como ayuda extra, si definimos un descuento especial, se nos mostrará al lado cómo quedará el precio con el descuento aplicado.


PRODUCTOS CON VARIANTES
Por el momento, este plugin sólo crea casos especiales a nivel de producto, no a nivel de variante.
Si no trabajamos con variantes esto no nos afecta.
Si trabajamos con productos que tienen 2 o más variantes, deberemos tener en cuenta que las referencias, descripciones, precios y descuentos especiales que creemos en la pantalla del producto serán así para todas las variantes de ese producto.
Aún en ese caso, sigue siendo correcto definir un descuento especial por cliente para todas las variantes de un producto, o un precio fijo especial por cliente para todas las variantes de un producto, si estas no deben tener precios distintos entre ellas.


IMPORTACIÓN DE CASOS ESPECIALES DESDE UN ARCHIVO CSV
Existe la posibilidad de importar las características especiales de los productos por cliente desde un archivo CSV. 
Para ello, utilice el plugin gratuito BasicImportExport: https://facturascripts.com/plugins/basicimportexport


ACTUALIZACIONES DEL PLUGIN
El pago por este plugin da derecho a recibir hasta 8 años de actualizaciones.