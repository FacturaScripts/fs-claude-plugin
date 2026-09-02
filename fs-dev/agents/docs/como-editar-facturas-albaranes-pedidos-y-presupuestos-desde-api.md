---
id: 3038
permalink: como-editar-facturas-albaranes-pedidos-y-presupuestos-desde-api
title: Cómo editar facturas, albaranes, pedidos y presupuestos desde API
creationdate: 18-06-2026 13:04:10
lastmod: 08-07-2026
url: https://facturascripts.com/publicaciones/como-editar-facturas-albaranes-pedidos-y-presupuestos-desde-api
---
Al igual que podemos crear documentos con una sola petición, también podemos editar un documento de negocio ya existente (factura, albarán, pedido o presupuesto, tanto de venta como de compra) en una única llamada a la API. En la misma operación se actualizan la cabecera y las líneas, se recalculan los totales y se mantiene el stock consistente.

## Editar una factura de cliente
Haremos una petición **PUT** (también se admite **PATCH**) al endpoint `editarFacturaCliente`, indicando en la URL el identificador del documento (por ejemplo, el `idfactura` de la factura). Es obligatorio enviar el campo `lineas`; el resto de campos de la cabecera son opcionales.

```plaintext
PUT /api/3/editarFacturaCliente/1234
```

Datos del ejemplo:
- Petición: PUT
- URL: http://localhost:8000/api/3/editarFacturaCliente/1234
- Cabeceras:
	- Token: XXXXXX
- Valores del formulario:
	- fecha: 2026-01-15
	- lineas: `[{&quot;idlinea&quot;: 42, &quot;cantidad&quot;: 3}, {&quot;referencia&quot;: &quot;producto2&quot;, &quot;cantidad&quot;: 1}]`

### Cómo pasar los valores
Aunque la API responde siempre con JSON, para enviar los datos debemos hacerlo como lo haríamos a un formulario, es decir, mediante **form URL encoded**. El campo `lineas` es un texto en formato **json**.

## Cómo se sincronizan las líneas
El campo `lineas` funciona como una sincronización completa del documento. Para cada línea del envío:

- Si incluye un `idlinea` que ya existe en el documento, esa línea **se modifica** con los valores que envíes.
- Si no incluye `idlinea`, se **crea** una línea nueva (con `referencia` si es un producto, o con `descripcion` si es una línea libre).
- Las líneas que ya existían y **no** aparezcan en el envío **se eliminan**, revirtiendo su stock.

Por tanto, si quieres conservar una línea sin cambios, debes incluirla igualmente en `lineas` con su `idlinea`. Además de `referencia`, `descripcion` y `cantidad`, cada línea admite el resto de campos habituales: `pvpunitario`, `dtopor`, `dtopor2`, `codimpuesto`, `irpf` ...

## Campos que no se pueden modificar
Para no romper la integridad del documento, hay campos que no se pueden cambiar en la edición. Si se intenta, la API responde con un error:

- El **sujeto**: `codcliente` en ventas o `codproveedor` en compras.
- La **empresa**: `idempresa`.
- El **almacén**: `codalmacen`.

Tampoco se modifican por asignación directa la clave primaria ni la numeración del documento (`numero`, `codigo`, `codejercicio`), que se gestionan por sus propios mecanismos.

## Documentos no editables
Si el documento no es editable (por ejemplo, una factura ya cerrada), solo se admiten los campos desbloqueados (como `pagada` o el estado del documento). Cualquier intento de modificar las líneas o el resto de la cabecera se rechaza con un error.

## Marcar la factura como pagada
Si el documento es una factura y envías el campo `pagada` con valor `1`, se marcarán como pagados sus recibos. Para gestionar el pago con más detalle (fecha y forma de pago) existe un endpoint específico: [marcar una factura como pagada desde API](https://facturascripts.com/publicaciones/como-marcar-una-factura-como-pagada-desde-api).

## Otros documentos
El mismo patrón sirve para el resto de documentos de ventas y compras, cambiando el endpoint:

- `editarFacturaCliente` / `editarFacturaProveedor`
- `editarAlbaranCliente` / `editarAlbaranProveedor`
- `editarPedidoCliente` / `editarPedidoProveedor`
- `editarPresupuestoCliente` / `editarPresupuestoProveedor`

## Qué devuelve la API
Si la edición se realiza correctamente, la API responde con código HTTP `200` y un objeto JSON con el documento recalculado y sus líneas:

```json
{
    &quot;doc&quot;: { &quot;...&quot;: &quot;campos del documento&quot; },
    &quot;lines&quot;: [ &quot;...líneas del documento...&quot; ]
}
```

Si algo falla, la respuesta incluye la clave `status` con el valor `error` y un `message` con el detalle. Los códigos más habituales son:

- `405` si el método no es PUT ni PATCH.
- `400` si falta el identificador en la URL o el campo `lineas`.
- `404` si no existe ningún documento con ese identificador.
- `422` si se intenta cambiar el sujeto, la empresa o el almacén, si el documento no es editable, o si no se pueden recalcular los totales.

```json
{
    &quot;status&quot;: &quot;error&quot;,
    &quot;message&quot;: &quot;Documento no editable&quot;
}
```