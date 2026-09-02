---
id: 2149
permalink: como-hacer-una-factura-rectificativa-por-api
title: Cómo hacer una factura rectificativa por API
creationdate: 18-06-2025 18:55:50
lastmod: 15-07-2026
url: https://facturascripts.com/publicaciones/como-hacer-una-factura-rectificativa-por-api
---
Desde la versión `2024.94` de FacturaScripts es posible crear facturas rectificativas con una sola petición POST a la API, utilizando el endpoint `crearFacturaRectificativaCliente`.

```
POST /api/3/crearFacturaRectificativaCliente
```

### 📌 Antes de crear una factura rectificativa

Recuerda que una factura rectificativa siempre parte de una factura normal. Por tanto, primero necesitas tener una factura de cliente ya creada.

No puedes rectificar una factura que ya sea una rectificativa: si la factura indicada en `idfactura` ya tiene `idfacturarect`, la API responde con `400`.

📷 Ejemplo de factura original:

![Imagen de una factura de cliente que aún no ha sido rectificada](https://i.imgur.com/b88qLVv.png)

---

### 🧾 Crear factura rectificativa

Haremos una petición POST al endpoint `crearFacturaRectificativaCliente` y le pasaremos los siguientes campos:

- `idfactura`: el ID de la factura original (obligatorio).
- `fecha`: fecha en la que se hace la rectificación (obligatorio).
- `hora`: hora exacta.
- `refund_1`: cantidad a devolver.
- `refund_2`: cantidad a devolver.
- `refund_3`: cantidad a devolver.

Opcionalmente también puedes enviar `codserie`, `nick`, `observaciones` e `idestado` para la nueva factura rectificativa.

Debes enviar tantas variables `refund` como líneas quieras devolver, donde el número es el id de la línea original. Por ejemplo, para devolver 2 unidades de la línea 4 enviarías `refund_4`: 2.

📷 Resultado de la rectificación:

![Imagen de la factura rectificativa generada](https://imgur.com/TnsnnxD.png)

Esta operación crea automáticamente una nueva factura rectificativa, que referencia a la original. Puedes ver cuál ha sido la factura original a través del campo `idfacturarect`.

Si todo va bien, la API responde con código HTTP `200` y un objeto JSON con la nueva factura rectificativa y sus líneas (`doc` y `lines`). Si algo falla, devuelve un objeto con `status` a `error` y un `message` con el detalle (por ejemplo, `400` si falta `idfactura` o `fecha`, o si la factura original ya es una rectificativa, y `404` si la factura original no existe).

📷 Relación entre factura original y rectificativa:

![Imagen que muestra la relación entre los identificadores de la factura original y la rectificativa](https://i.imgur.com/yM9WrAv.png)

---

### 🔍 Ver si una factura ha sido rectificada

Si quieres comprobar si una factura ha sido rectificada, simplemente haz una búsqueda de facturas donde `idfacturarect` sea igual al `idfactura` que quieres comprobar. Si la lista está vacía, es que aún no ha sido rectificada.

📷 Ejemplo de listado de facturas rectificadas:

![Imagen de un listado de facturas rectificadas](https://i.imgur.com/wFGzWjT.png)

---

Si necesitas más detalles sobre cómo funciona internamente este proceso, puedes revisar el fichero del endpoint en GitHub:

[facturascripts/Core/Controller/ApiCreateFacturaRectificativaCliente.php at master · NeoRazorX/facturascripts · GitHub](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Controller/ApiCreateFacturaRectificativaCliente.php)