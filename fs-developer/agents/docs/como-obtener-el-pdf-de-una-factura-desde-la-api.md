---
id: 1778
permalink: como-obtener-el-pdf-de-una-factura-desde-la-api
title: Obtener el PDF de una factura desde la API
creationdate: 14-06-2024 21:13:15
lastmod: 11-10-2025
url: https://facturascripts.com/como-obtener-el-pdf-de-una-factura-desde-la-api
---
A partir de la versión **2024.5** de FacturaScripts ya es posible descargar el PDF de una factura de cliente a través de la API. Simplemente hay que hacer una petición **GET** al endpoint ``api/3/exportarFacturaCliente/123``, reemplazando 123 por el id de la factura.

![obtener pdf api facturascripts](https://i.imgur.com/7RuaYuf.png)

También es posible obtener un **Excel** o CSV usando el parámetro ``type`` (admite ``PDF``, ``XLS`` y ``CSV``). Siguiendo el ejemplo anterior, si queremos la factura en Excel, haríamos la siguiente llamada: ``api/3/exportarFacturaCliente/123?type=XLS``.

Parámetros opcionales disponibles en todos los endpoints de exportación:

- ``type``: formato de salida. Valores admitidos ``PDF`` (por defecto), ``XLS`` y ``CSV``.
- ``lang``: código de idioma (por ejemplo ``es_ES`` o ``en_EN``) para generar el documento traducido.
- ``format``: identificador numérico del formato de impresión a utilizar. Si no se indica, se aplica el formato predeterminado del documento. Aquí puedes leer más sobre los formatos de impresión personalizados en la [documentación de formatos de impresión](https://facturascripts.com/publicaciones/los-formatos-de-impresion-de-facturascripts).

Ejemplo:
```php
GET &#39;https://miFacturaScripts.com/api/3/exportarFacturaCliente/123?type=PDF&lang=es_ES&#39;
```

## Albaranes, pedidos y presupuestos

Siguiendo el mismo patrón es posible exportar el resto de documentos de ventas y compras usando estos endpoints:

- ``api/3/exportarAlbaranCliente/{id}``
- ``api/3/exportarAlbaranProveedor/{id}``
- ``api/3/exportarFacturaProveedor/{id}``
- ``api/3/exportarPedidoCliente/{id}``
- ``api/3/exportarPedidoProveedor/{id}``
- ``api/3/exportarPresupuestoCliente/{id}``
- ``api/3/exportarPresupuestoProveedor/{id}``

Si trabajas con formatos de impresión personalizados, añade el parámetro ``format`` con el identificador numérico del formato que quieras aplicar. Por ejemplo: ``api/3/exportarFacturaCliente/123?type=PDF&format=5`` devolverá la factura usando el formato 5. Si no se indica ningún ``format`` se usará el formato predeterminado del documento.
