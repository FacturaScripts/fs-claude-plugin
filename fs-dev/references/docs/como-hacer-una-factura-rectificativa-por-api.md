---
id: 2149
permalink: como-hacer-una-factura-rectificativa-por-api
title: Cómo hacer una factura rectificativa por API
creationdate: 18-06-2025 18:55:50
lastmod: 01-10-2026
url: https://facturascripts.com/publicaciones/como-hacer-una-factura-rectificativa-por-api
---
Desde la versión `2024.94` de FacturaScripts es posible crear facturas rectificativas de cliente con una sola petición a la API, utilizando el endpoint `crearFacturaRectificativaCliente`. Se puede rectificar la factura completa o solo algunas de sus líneas, y en cada línea la cantidad que quieras.

```plaintext
POST /api/3/crearFacturaRectificativaCliente
```

### 📌 Antes de crear una factura rectificativa

Recuerda que una factura rectificativa siempre parte de una factura normal. Por tanto, primero necesitas tener una factura de cliente ya creada.

No puedes rectificar una factura que ya sea una rectificativa: si la factura indicada en `idfactura` ya tiene `idfacturarect`, la API responde con `400`.

📷 Ejemplo de factura original:

![Imagen de una factura de cliente que aún no ha sido rectificada](https://i.imgur.com/b88qLVv.png)

---

### 🧾 Crear factura rectificativa

Haremos una petición **POST** (también se admite **PUT**) al endpoint `crearFacturaRectificativaCliente`. Como en el resto de la API, los datos se envían como un formulario (**form URL encoded**) y la respuesta es JSON.

Campos que admite:

- `idfactura`: el ID de la factura original (obligatorio).
- `fecha`: fecha de la rectificativa (obligatorio).
- `hora`: hora de la rectificativa (opcional; si no se indica, se usa la hora actual).
- `refund_IDLINEA`: cantidad a rectificar de la línea con ese `idlinea` (opcional, ver más abajo).
- `codserie`: serie de la rectificativa (opcional; por defecto, la de la factura original).
- `idestado`: estado de la rectificativa (opcional; por defecto, el mismo estado que la factura original).
- `nick` y `observaciones`: usuario y observaciones de la rectificativa (opcionales).

### 🔢 Elegir qué líneas rectificar

Cada campo `refund_` lleva detrás el **`idlinea`** de la línea de la factura original, **no su posición** dentro de la factura. Por ejemplo, si la factura tiene dos líneas con `idlinea` 1533 y 1534, y quieres devolver 2 unidades de la segunda, debes enviar `refund_1534` con valor `2`. Enviar `refund_2` no se refiere a la segunda línea.

Para conocer los `idlinea` de una factura puedes consultar sus líneas:

```plaintext
GET /api/3/lineafacturaclientes?filter[idfactura]=1234
```

Cómo se interpretan los campos `refund_`:

- La cantidad se indica en **positivo**: la API la convierte en negativo en la rectificativa.
- Solo se incluyen en la rectificativa las líneas con un `refund_` distinto de cero.
- Si no envías ningún `refund_` (o todos valen cero), se rectifica la **factura completa**: todas las líneas con su cantidad original.
- Desde la versión `2026.7`, si envías un `refund_` que no corresponde a ninguna línea de esa factura, la API responde con `400` indicando la clave incorrecta y no crea la rectificativa. En versiones anteriores, si ninguna clave coincidía, se rectificaba la factura completa.

Ejemplo de petición para devolver 2 unidades de una sola línea:

- Petición: POST
- URL: http://localhost:8000/api/3/crearFacturaRectificativaCliente
- Cabeceras:
	- Token: XXXXXX
- Valores del formulario:
	- idfactura: 1234
	- fecha: 2026-10-01
	- refund_1534: 2

📷 Resultado de la rectificación:

![Imagen de la factura rectificativa generada](https://imgur.com/TnsnnxD.png)

### ⚙️ Qué hace la API al rectificar

- Si la factura original todavía es editable, la pasa al primer estado activo no editable (por ejemplo, **Emitida**), ya que una factura rectificada no debe poder modificarse.
- Crea la nueva factura rectificativa, que referencia a la original mediante los campos `idfacturarect` (el `idfactura` de la original) y `codigorect` (su código). Cada línea de la rectificativa guarda en `idlinearect` el `idlinea` de la línea original.
- Asigna a la rectificativa el `idestado` indicado o, si no se indica, el estado de la factura original. Desde la versión `2026.7` esto también se aplica cuando no se envía `idestado`; en versiones anteriores la rectificativa quedaba sin estado y no actualizaba el stock, así que en ellas conviene enviarlo siempre.
- Si la factura original estaba pagada, marca como pagados los recibos de la rectificativa.

Todo se hace en una transacción: si algún paso falla, no se guarda nada.

📷 Relación entre factura original y rectificativa:

![Imagen que muestra la relación entre los identificadores de la factura original y la rectificativa](https://i.imgur.com/yM9WrAv.png)

### 📤 Qué devuelve la API

Si todo va bien, la API responde con código HTTP `200` y un objeto JSON con la nueva factura rectificativa y sus líneas:

```json
{
    &quot;doc&quot;: { &quot;...&quot;: &quot;campos de la factura rectificativa&quot; },
    &quot;lines&quot;: [ &quot;...líneas de la rectificativa...&quot; ]
}
```

Si algo falla, devuelve un objeto con `status` a `error` y un `message` con el detalle:

- `400` si falta `idfactura` o `fecha`, si la factura original ya es una rectificativa o si algún `refund_` no corresponde a una línea de la factura.
- `404` si la factura original no existe.
- `405` si el método no es POST ni PUT.

---

### 🔍 Ver si una factura ha sido rectificada

Para comprobar si una factura ha sido rectificada, busca las facturas cuyo `idfacturarect` sea el `idfactura` que quieres comprobar. Si la lista está vacía, es que aún no ha sido rectificada.

```plaintext
GET /api/3/facturaclientes?filter[idfacturarect]=1234
```

📷 Ejemplo de listado de facturas rectificadas:

![Imagen de un listado de facturas rectificadas](https://i.imgur.com/wFGzWjT.png)

---

Si necesitas más detalles sobre cómo funciona internamente este proceso, puedes revisar el fichero del endpoint en GitHub:

[facturascripts/Core/Controller/ApiCreateFacturaRectificativaCliente.php at master · NeoRazorX/facturascripts · GitHub](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Controller/ApiCreateFacturaRectificativaCliente.php)