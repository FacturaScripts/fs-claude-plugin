---
id: 793
permalink: tu-primer-producto-431
title: Cómo crear un producto o variante
creationdate: 24-12-2018 00:00:00
lastmod: 03-09-2026
url: https://facturascripts.com/publicaciones/tu-primer-producto-431
---
En el **menú Almacén → Productos** puede consultar todos los productos de su catálogo, tanto los que compra como los que vende. Si no está familiarizado con los listados de FacturaScripts, le recomendamos leer estos artículos:

- [Cómo usar los listados y filtros en FacturaScripts](https://facturascripts.com/publicaciones/como-funcionan-los-listados-y-filtros).
- [Cómo importar productos desde Excel](https://facturascripts.com/publicaciones/como-importar-productos-de-excel).

## 📝 Crear un Nuevo Producto
Para añadir un producto, haga clic en el **botón &quot;Nuevo&quot;** dentro del listado de productos. Se abrirá el formulario de creación, donde solo es obligatorio completar el campo **Descripción**. El resto de campos son opcionales.

![Crear producto](https://facturascripts.com/MyFiles/2025/01/2590.png?myft=95f3d332cb347ed6f553f3b6ef40fa9e28990e1e)

### 📑 Campos del Producto
- **Referencia:** Código único del producto. Si se deja en blanco, se generará automáticamente sumando 1 a la referencia numérica más alta.
- **Fabricante:** Indica el fabricante del producto. [Más información](https://facturascripts.com/publicaciones/tu-primer-fabricante-538).
- **Familia:** Agrupación de productos similares, como &quot;aceites&quot;. [Más información](https://facturascripts.com/publicaciones/tu-primera-familia-43).
- **Impuesto:** Indica el impuesto aplicable al producto. [Más información](https://facturascripts.com/publicaciones/impuestos-967).
- **Excepción de IVA:** para los casos en que la operación no lleva el IVA habitual (exenta, no sujeta, inversión del sujeto pasivo...). Déjalo vacío si el producto se factura con su impuesto normal.
- **Tipo:** el tipo de producto a efectos de facturación. Las opciones son *Normal*, *Servicio*, *Segunda mano*, *Arrendamiento local negocio* y *Viaje*. Los cuatro últimos corresponden a operaciones con reglas fiscales propias, así que conviene marcarlos bien si te aplican.
- **Descripción:** Nombre del producto que aparecerá en presupuestos, pedidos, albaranes y facturas.
- **Stock:** Muestra la cantidad disponible del producto, incluyendo sus variantes.
- **No controlar stock:** Marque esta opción si no desea gestionar el stock de este producto.
- **Se compra:** Habilita el producto para compras.
- **Se vende:** Habilita el producto para ventas.
- **Permitir venta sin stock:** Permite vender el producto incluso si el stock es 0.
- **Bloqueado:** Desactiva el producto en compras y ventas y lo muestra en rojo en los listados.
- **Público:** Indica si el producto debe sincronizarse con la tienda online.
- **Observaciones:** Notas internas que no aparecerán en documentos como facturas o albaranes.
- **Cuenta para compras:** Cuenta contable utilizada al generar asientos de facturas de compras.
- **Cuenta de ventas:** Cuenta contable utilizada al generar asientos de facturas de ventas.
- **Cuenta para retenciones:** Cuenta contable de la retención (IRPF) en las compras de este producto.
- **Fecha de creación** y **última actualización:** informativos, no se pueden editar.

Si no rellenas las cuentas contables del producto, se usan las de su [familia](https://facturascripts.com/publicaciones/tu-primera-familia-43). Es lo más práctico: configurar las cuentas una vez por familia en lugar de producto a producto.

### 💾 Guardar el Producto
Una vez completado el formulario, haga clic en **&quot;Guardar&quot;** (abajo a la derecha). Hasta que no guarde, no podrá acceder a más secciones del producto, como variantes o stock.

![Nuevo producto](https://i.imgur.com/qnoGGL0.gif)

## 🗂️ Las pestañas del producto

Una vez guardado, el producto muestra varias pestañas:

- **Variantes:** las distintas versiones del producto, con su referencia, precio y coste. Ver [las variantes de productos](https://facturascripts.com/publicaciones/las-variantes-de-productos) y [los precios de los productos](https://facturascripts.com/publicaciones/los-precios-del-producto).
- **Imágenes:** las fotos del producto, que se pueden asignar a una variante concreta. Ver [las imágenes de los productos](https://facturascripts.com/publicaciones/las-imagenes-de-los-productos).
- **Archivos:** documentos que quieras adjuntar al producto (fichas técnicas, certificados, manuales). Se guardan en la [biblioteca de archivos](https://facturascripts.com/publicaciones/la-biblioteca-de-archivos).
- **Stock:** las unidades por variante y almacén. Ver [el stock del producto](https://facturascripts.com/publicaciones/el-stock-de-productos).
- **Reservado:** los pedidos de cliente que tienen unidades reservadas de este producto.
- **Pendiente recepción:** los pedidos a proveedor que están pendientes de recibir.
- **Proveedores:** a quién le compras este producto y en qué condiciones.

## 👥 Proveedores del Producto
En la pestaña **Proveedores**, se almacenan automáticamente los datos de los proveedores conforme se crean facturas de compra. También es posible añadir proveedores manualmente.

![Proveedor producto](https://i.imgur.com/2ofWAiY.png)

Cada registro muestra información sobre la última compra del producto, incluyendo el proveedor y las condiciones de compra.

## Ver también

- [Las variantes de productos](https://facturascripts.com/publicaciones/las-variantes-de-productos)
- [Los precios de los productos](https://facturascripts.com/publicaciones/los-precios-del-producto)
- [El stock del producto](https://facturascripts.com/publicaciones/el-stock-de-productos)
- [Las imágenes de los productos](https://facturascripts.com/publicaciones/las-imagenes-de-los-productos)