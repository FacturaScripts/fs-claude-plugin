---
idproject: 328
name: MegaInvoicer
permalink: megainvoicer
creationdate: 27-09-2023
lastmod: 27-05-2026
version: 2.1
betaversion: 
mincore: 2026.3
maxcore: 2026.65
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/MegaInvoicer
---
Este asistente permite facturar de forma masiva los albaranes seleccionados, tanto albaranes de compra como albaranes de venta.

Permite facturar cada albarán individualmente o agruparlos por proveedor o cliente.

Cuando realiza las facturas con albaranes agrupados sigue el siguiente patrón para que no existan albaranes incompatibles en una misma factura:

No se agruparán:
-	Albaranes con distinta empresa.
-	Albaranes con distinto cliente/proveedor.
-	Albaranes de distinta serie.
-	Albaranes con distinta divisa.
-	Albaranes con distinto almacén.
-	Albaranes con distintos descuentos globales de albarán.

Además, se puede seleccionar si desea que se añada en la factura una línea extra con los datos del albarán (código, fecha albarán) y a continuación el resto de líneas del albarán.

Finalmente se debe seleccionar el documento generado, normalmente “FacturaCliente” o “FacturaProveedor”.