---
id: 2149
permalink: como-hacer-una-factura-rectificativa-por-api
title: Cómo hacer una factura rectificativa por API
creationdate: 18-06-2025 18:55:50
lastmod: 30-12-2025
url: https://facturascripts.com/como-hacer-una-factura-rectificativa-por-api
---
Desde la versión **2024.94** de FacturaScripts es posible crear facturas rectificativas con una sola petición POST a la API, utilizando el endpoint **crearFacturaRectificativaCliente**.

```
POST /api/3/crearFacturaRectificativaCliente
```

### Antes de crear una factura rectificativa

Recuerda que **una factura rectificativa siempre parte de una factura normal**. Por tanto, primero necesitas tener una factura de cliente ya creada.

📷 **Ejemplo de factura original:**

![Imagen de factura no rectificativa](https://i.imgur.com/b88qLVv.png)

---

### Crear factura rectificativa

Haremos una petición **POST** al endpoint `crearFacturaRectificativaCliente` y le pasaremos los siguientes campos:

- `idfactura`: el ID de la factura original.
- `fecha`: fecha en la que se hace la rectificación.
- `hora`: hora exacta.
- `refund_1`: cantidad a devolver
- `refund_2`: cantidad a devolver
- `refund_3`: cantidad a devolver

*Se debe devolver tantas variables refund como líneas necesitamos devolver, donde el número debe ser el id de la línea original, **si queremos devolver 2 unidades de la línea 4 el ejemplo sería: refund4: 2***
  

📷 **Resultado de la rectificación:**

![factura rectificativa](https://imgur.com/TnsnnxD.png)

Esta operación crea automáticamente una nueva factura rectificativa, que referencia a la original. Puedes ver cuál ha sido la factura original a través del campo `idfacturarect`.

📷 **Relación entre factura original y rectificativa:**

![imagen de los id](https://i.imgur.com/yM9WrAv.png)

---

### Ver si una factura hasido rectificada

Si quieres comprobar si una factura ha sido rectificada, simplemente haz una búsqueda de facturas donde `idfacturarect` sea igual al `idfactura` que quieres comprobar. Si la lista está vacía, es que aún no ha sido rectificada.

📷 **Ejemplo de listado de facturas rectificadas:**

![listar facturas rectificadas](https://i.imgur.com/wFGzWjT.png)

---

Si necesitas más detalles sobre cómo funciona internamente este proceso, puedes revisar el fichero del endpoint en GitHub:

[facturascripts/Core/Controller/ApiCreateFacturaRectificativaCliente.php at master · NeoRazorX/facturascripts · GitHub](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Controller/ApiCreateFacturaRectificativaCliente.php)
