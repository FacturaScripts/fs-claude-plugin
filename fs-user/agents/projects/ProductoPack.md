---
idproject: 107
name: ProductoPack
permalink: productopack
creationdate: 04-11-2020
lastmod: 17-06-2026
version: 2.02
betaversion: 1.45
mincore: 2026
maxcore: 2026.41
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/ProductoPack
---
Plugin para [FacturaScripts](https://www.facturascripts.com) que permite agrupar varios productos bajo una única referencia de pack. Al introducir esa referencia en un documento de compra o venta y guardarlo, el sistema la expande automáticamente con los artículos que la componen.

Piénsalo como una **plantilla de líneas**: una sola referencia añade al documento todos los productos del pack, en las cantidades definidas, sin introducirlos uno a uno.


## ¿Para qué sirve?

- **Lotes y cestas**: agrupa productos que siempre se venden juntos bajo una sola referencia.
- **Kits y materiales**: un kit de instalación, un pack de mantenimiento, un conjunto de piezas estándar.
- **Agilizar la entrada de datos**: cualquier combinación de productos que repitas frecuentemente puede convertirse en un pack.


## Dos modos de funcionamiento

**Pack (lista de ítems)** — Los componentes existen en tu almacén por separado con su propio stock. Al guardar el documento, la referencia del pack se sustituye por las líneas individuales de cada componente y se descuenta el stock correspondiente.

**Caja** — El producto existe físicamente como unidad ya montada. Los componentes no están en tu stock por separado. Al guardar, la referencia de la caja permanece y su descripción se enriquece con el detalle del contenido.


## Características principales

- Funciona en todos los documentos de compra y venta: presupuestos, pedidos, albaranes y facturas.
- Configurable por tipo de documento: solo ventas, solo compras o ambos.
- Un mismo producto puede tener packs distintos por variante.
- Precio fijo o calculado automáticamente como suma de los componentes.
- Opciones de descripción: solo el pack, solo los ítems, o ambos.
- Orden de aparición de los ítems en el documento.
- Descuento individual por componente.
- Función de copia de pack entre variantes.