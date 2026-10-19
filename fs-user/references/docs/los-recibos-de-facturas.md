---
id: 1084
permalink: los-recibos-de-facturas
title: Los recibos de facturas
creationdate: 15-03-2022 01:15:43
lastmod: 04-09-2026
url: https://facturascripts.com/publicaciones/los-recibos-de-facturas
---
Una factura de venta puede cobrarse de una vez o en varios plazos. FacturaScripts representa cada vencimiento mediante un **recibo** y utiliza esos recibos para saber si la factura está cobrada, pendiente o vencida.

Encontrarás los recibos al abrir una factura desde **Ventas → Facturas** y entrar en su pestaña **Recibos**. FacturaScripts crea al menos uno automáticamente al guardar la factura, según la [forma de pago](https://facturascripts.com/publicaciones/formas-de-pago-729).

## 📑 Los campos de un recibo

- **Número**: orden del recibo dentro de la factura.
- **Importe**: cantidad que se debe cobrar en ese vencimiento.
- **Fecha**: fecha de emisión del recibo.
- **Vencimiento**: fecha prevista de cobro.
- **Forma de pago**: forma de pago de ese recibo concreto.
- **Pagado**: indica si el recibo ya se ha cobrado.
- **Fecha de pago**: fecha real del cobro.
- **Observaciones**: notas internas sobre el vencimiento.

## ✅ Marcar una factura como cobrada

En la pestaña **Recibos** de la factura, selecciona uno o varios recibos y pulsa **Pagado**. Tras confirmar, FacturaScripts marca los recibos, asigna la fecha de pago y actualiza el estado de cobro de la factura.

![Marcar recibo como pagado](https://facturascripts.com/MyFiles/2025/10/3310.png?myft=3efc65b4ff52e6ce51d26ccd4c35d4054cb1222d)

También puedes abrir un recibo, marcar la casilla **Pagado** y guardar. Utiliza esta opción si necesitas cambiar la fecha de pago, la forma de pago, el importe, los gastos o las observaciones.

![Editar un recibo](https://facturascripts.com/MyFiles/2025/10/3311.png?myft=2d4eb7fa7e9f158b09805ef319d237d02bfe8f0d)

La factura queda marcada como pagada cuando la suma de los recibos cobrados alcanza su total. Si solo cobras algunos, la factura continúa pendiente.

## 📅 Fecha de vencimiento

La fecha de vencimiento se calcula a partir de la **fecha de la factura** y del plazo configurado en su forma de pago.

Si has indicado **Días de pago** en la ficha del cliente, FacturaScripts mueve el vencimiento al siguiente de esos días. Por ejemplo, con `1,15` escogerá el próximo día 1 o 15 que no sea anterior al vencimiento calculado.

## ➗ Generar varios recibos

En la pestaña **Recibos**, pulsa **Generar recibos** e indica cuántos quieres crear. El programa reparte entre ellos el importe que todavía no está cubierto por otros recibos.

También puedes indicar importes concretos en el formulario. Antes de generar más recibos, comprueba los existentes: la suma de todos debería coincidir con el total de la factura.

Para crear automáticamente esquemas como 30-60-90 o 50-50, utiliza el plugin [PlazosPago](https://facturascripts.com/plugins/plazospago).

## 🔍 Ver todos los recibos pendientes

Ve a **Ventas → Facturas** y abre la pestaña **Recibos**. Desde allí puedes ordenar y filtrar los recibos de todas las facturas por fecha, vencimiento, importe o estado de pago.

También encontrarás los recibos de un cliente dentro de su ficha, en la pestaña **Recibos**.

## 🔌 Anticipos y remesas

- El plugin [Anticipos](https://facturascripts.com/plugins/anticipos) registra cobros a cuenta anteriores a la factura y permite vincularlos con clientes y documentos.
- El plugin [RemesasSEPA](https://facturascripts.com/plugins/remesassepa) agrupa recibos pendientes en remesas y genera el archivo XML para el banco.

## Ver también

- [Cómo hacer una factura de venta](https://facturascripts.com/publicaciones/como-hacer-una-factura-de-venta)
- [Formas de pago](https://facturascripts.com/publicaciones/formas-de-pago-729)
- [Menú Ventas](https://facturascripts.com/publicaciones/menu-ventas)