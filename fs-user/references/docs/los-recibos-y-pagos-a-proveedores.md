---
id: 4513
permalink: los-recibos-y-pagos-a-proveedores
title: Los recibos y pagos a proveedores
creationdate: 03-09-2026 19:38:43
lastmod: 03-09-2026
url: https://facturascripts.com/publicaciones/los-recibos-y-pagos-a-proveedores
---
Registrar la factura de compra es la mitad del trabajo; la otra mitad es controlar **si ya la has pagado**. Eso se lleva con los **recibos**, que son los vencimientos de pago de la factura.

Los recibos de una factura de compra están en su propia ficha, en el **menú Compras → Facturas**, abriendo la factura y entrando en la pestaña **Recibos**.

## 🧾 Qué es un recibo

Un recibo es una cantidad que hay que pagar en una fecha. Una factura puede tener:

- **Un solo recibo**, si se paga de una vez. Es lo normal.
- **Varios recibos**, si el pago está fraccionado. Por ejemplo, una factura de 3.000 € a pagar en tres plazos genera tres recibos de 1.000 € con vencimientos distintos.

FacturaScripts crea los recibos automáticamente al guardar la factura, según su **forma de pago**.

## 📑 Los campos de un recibo

- **Número**: el orden del recibo dentro de la factura (1, 2, 3…).
- **Importe**: la cantidad de ese vencimiento.
- **Fecha**: la fecha del recibo.
- **Vencimiento**: cuándo hay que pagarlo. Es el campo que usarás para saber qué te toca pagar esta semana.
- **Forma de pago**: cómo se paga ese recibo concreto. Ver [formas de pago](https://facturascripts.com/publicaciones/formas-de-pago-729).
- **Pagado**: la casilla que marca el recibo como liquidado.
- **Fecha de pago**: cuándo se pagó realmente. Se rellena al marcarlo como pagado.
- **Observaciones**: notas internas sobre ese vencimiento.

## ✅ Marcar una factura como pagada

En la pestaña **Recibos** de la factura tienes el botón **Pagado**: selecciona los recibos y púlsalo. El programa pide confirmación, marca los recibos, anota la fecha de pago y actualiza el estado de pago de la factura.

También puedes abrir un recibo concreto y marcar su casilla **Pagado** a mano, que es lo que harás si necesitas poner una fecha de pago distinta de hoy.

Cuando todos los recibos de una factura están pagados, la factura queda como pagada. Si solo has pagado algunos, la factura sigue apareciendo como pendiente, que es justo el comportamiento que interesa.

## ➗ Fraccionar un pago

Si necesitas partir el pago de una factura, usa el botón **Generar recibos** de la pestaña Recibos e indica en cuántos quieres dividirlo. FacturaScripts reparte el importe **pendiente** entre esos recibos.

Dos cosas que conviene saber:

- El reparto se hace sobre lo que queda por pagar, no sobre el total. Si ya habías pagado parte, solo se fracciona el resto.
- Si la factura no tiene nada pendiente, el programa avisa y no genera nada.

## 🔍 Ver todos los recibos pendientes

Para trabajar por vencimientos en lugar de factura a factura, ve al **menú Compras → Facturas** y entra en la pestaña **Recibos**: ahí están los recibos de todas las facturas de compra, y puedes ordenarlos por vencimiento e importe para ver qué toca pagar.

⚠️ Si esa pestaña no te aparece, es porque tu usuario tiene el permiso *mostrar solamente registros del usuario* en esa página: con esa restricción el listado se queda solo con la pestaña de facturas. Ver [grupos y permisos de usuario](https://facturascripts.com/publicaciones/grupos-y-permisos-de-usuario).

## Ver también

- [Cómo registrar una factura de compra](https://facturascripts.com/publicaciones/como-registrar-una-factura-de-compra)
- [Formas de pago](https://facturascripts.com/publicaciones/formas-de-pago-729)
- [Los recibos de facturas](https://facturascripts.com/publicaciones/los-recibos-de-facturas), para el caso de las facturas de venta
- [Menú Compras](https://facturascripts.com/publicaciones/menu-compras)