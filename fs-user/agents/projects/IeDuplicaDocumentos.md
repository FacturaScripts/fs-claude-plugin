---
idproject: 705
name: IeDuplicaDocumentos
permalink: ieduplicadocumentos
creationdate: 10-07-2026
lastmod: 10-07-2026
version: 1
betaversion: 0.2
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/IeDuplicaDocumentos
---
Plugin para FacturaScripts que permite duplicar de forma masiva documentos de compra y venta (presupuestos, pedidos, albaranes y facturas, tanto de cliente como de proveedor) directamente desde su listado, asignándoles una nueva fecha.

## Funcionalidades
- Botón &quot;Duplicar&quot; en el listado de cada uno de los 8 documentos: Presupuestos Cliente, Pedidos Cliente, Albaranes Cliente, Facturas Cliente, Presupuestos Proveedor, Pedidos Proveedor, Albaranes Proveedor y Facturas Proveedor.
- Permite seleccionar varios documentos a la vez (checkboxes del listado) y duplicarlos todos en una sola acción.
- Modal que pide la fecha del nuevo documento y una confirmación obligatoria antes de ejecutar.
- Copia todas las líneas del documento original (productos, cantidades, precios, descuentos, impuestos) y recalcula los totales.
- Copia los datos de cabecera: cliente/proveedor, empresa, almacén, divisa, forma de pago, serie, descuentos globales (dtopor1/dtopor2) y número de documento del cliente/proveedor (numero2/numproveedor).
- Las observaciones del nuevo documento se sustituyen siempre por #copiado, para distinguirlo del original.
- Al terminar, muestra un mensaje con el número de documentos duplicados correctamente.

## Qué **NO** hace
- No permite editar los datos del documento antes de duplicar (solo la fecha); todo lo demás se copia tal cual del original.
- No duplica documentos de un tipo a otro (por ejemplo, no convierte un pedido en un albarán); el duplicado siempre es del mismo tipo que el original.
- No copia archivos adjuntos, pagos/recibos ni asientos contables asociados al documento original.
- No valida stock, límites de crédito ni otras reglas de negocio más allá de las que ya aplica el propio modelo/Calculator del core al guardar.