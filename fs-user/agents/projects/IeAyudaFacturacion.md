---
idproject: 204
name: IeAyudaFacturacion
permalink: ieayudafacturacion
creationdate: 16-04-2022
lastmod: 03-09-2025
version: 2.2
betaversion: 1.3
mincore: 2025.3
maxcore: 2026
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/IeAyudaFacturacion
---

Facilita la facturación periódica de albaranes existentes:
1. En la lista de albaranes aparecen, por defecto, sólo los pendientes de facturar ordenados por código de cliente. Así podemos ir facturando albaranes independientes o agrupando por cliente de una forma más rápida. Siempre se pueden cambiar los filtros y órdenes de forma manual.
2. Al generar documentos agrupados (por ejemplo facturas), vuelve a la vista original (albaranes). Esto nos permite facturar más rápido, ya que no hay que volver a la lista de nuevo y filtrar u ordenar de nuevo. Esta funcionalidad afecta a las agrupaciones de cualquier documento (presupuestos, pedidos, albaranes).
3. En los documentos generados, se suprime la línea en blanco entre los documentos orígenes y se acorta la línea discontínua (-----...). Para que al buscar los productos facturados a este cliente no salga información inservible.
4. Al agrupar albaranes de compra, solicita el número de la factura de compra, para que no &quot;arrastre&quot; el número de albarán.
5. Al facturar albaranes de venta o guardar facturas, comprueba si hay alguna línea con cantidad y sin precio. En este caso, muestra aviso, aunque permite continuar con la operación. Útil para comprobar si nos hemos quedado sin marcar algún precio.
6. En la pantalla &quot;Agrupar o partir&quot;, muestra precio unitario y total de línea. En rojo si es cero o negativo.
