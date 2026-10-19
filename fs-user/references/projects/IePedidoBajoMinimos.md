---
idproject: 766
name: IePedidoBajoMinimos
permalink: iepedidobajominimos
creationdate: 21-08-2026
lastmod: 21-08-2026
version: 1
betaversion: 0
mincore: 2026
maxcore: 2026.7
compatible: 
min_php: 8
require: StockAvanzado
require_php: 
url: https://facturascripts.com/plugins/IePedidoBajoMinimos
---
Automatiza la reposición de stock en tus pedidos de compra. Añade con un solo clic las líneas de los productos que estén bajo mínimos para el proveedor del pedido, calculando automáticamente la cantidad necesaria hasta alcanzar el stock máximo. Incluye además un listado dedicado para consultar, por proveedor y almacén, qué productos están bajo mínimos. Requiere el plugin StockAvanzado.

## ¿Cuándo se añade una línea?

Al pulsar el botón, por cada producto que el proveedor del pedido tiene en su ficha, se añade una línea, solo si se cumplen TODAS estas condiciones sobre el stock de ese producto en el almacén del pedido:

- Existe registro de stock para esa referencia en ese almacén
- &quot;Pendiente de recepción&quot; = 0 (no hay nada pendiente de recibir de ese producto, así evita duplicar pedidos).
- &quot;Disponible&quot; &lt;=  &quot;Stock min.&quot; (está en mínimos o por debajo).
- &quot;Stock max.&quot; - &quot;Disponible&quot; &gt; 0 (la cantidad resultante tiene que ser positiva).
- El producto no está ya en el pedido (por referencia), ni porque estuviera antes de pulsar el botón, ni porque se haya añadido ya en esta misma pasada.

⚠️ Matiz importante: No exige &quot;Stock min.&quot;. Si está a 0, pero &quot;Stock max.&quot; sí tiene un valor y &quot;Disponible&quot; = 0, se genera línea. Es decir, el disparador real es &quot;hay hueco entre lo disponible y el máximo, y estás en mínimos o por debajo&quot;.

## ¿Qué cantidad se pone en la linea?

&quot;Stock max.&quot; - &quot;Disponible&quot;