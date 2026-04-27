---
idproject: 122
name: FSVarios
permalink: fsvarios
creationdate: 28-05-2021
lastmod: 15-05-2022
version: 21.08
betaversion: 0
mincore: 
maxcore: 2022.6
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/FSVarios
---

Pequeñas funciones para Facturascripts basadas en peticiones recibidas:
- Calcula la letra del NIF en clientes y proveedores.
- A partir del código postal devuelve la población y provincia (si se encuentra en la lista de poblaciones). Se entrega fichero de poblaciones con sus códigos postales y provincias de España en formato CSV para su importación.
- En la lista de productos se añaden dos vistas: Productos con stock mínimo y Stock detallado que muestra el stock según almacenes y variantes.
- En la lista de facturas de venta se añade una vista que muestra las líneas de factura mostrando el cliente y la fecha venta.
- En la lista de facturas de compra se muestra una vista que muestra las líneas de factura mostrando el proveedor y la fecha de compra

NOTA: No se garantiza que la lista de códigos postales incluya el 100% de los códigos postales de España. Los códigos postales se buscan por población, no por calle y número.
