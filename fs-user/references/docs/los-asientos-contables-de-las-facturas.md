---
id: 4542
permalink: los-asientos-contables-de-las-facturas
title: Los asientos contables de las facturas
creationdate: 04-09-2026 17:44:38
lastmod: 04-09-2026
url: https://facturascripts.com/publicaciones/los-asientos-contables-de-las-facturas
---
FacturaScripts genera automáticamente un asiento contable al guardar una factura de venta o de compra con un total distinto de cero. El asiento queda vinculado a la factura y puedes consultarlo desde su pestaña **Asientos**.

Si la configuración contable está incompleta, la factura puede guardarse sin asiento. En ese caso puedes corregir la configuración y volver a generarlo, de forma individual o en bloque.

## ⚙️ Qué contabiliza FacturaScripts

El asiento de la factura recoge:

- La deuda del cliente o con el proveedor.
- Las ventas o compras, separadas por las subcuentas configuradas en los productos o familias cuando corresponda.
- El IVA soportado o repercutido y el recargo de equivalencia.
- Las retenciones, los suplidos y las particularidades de operaciones intracomunitarias o con inversión del sujeto pasivo.

Si un producto o su familia no tienen una subcuenta específica, se utiliza la [cuenta especial](https://facturascripts.com/publicaciones/cuentas-especiales) de ventas o compras. En las facturas rectificativas se usan las cuentas especiales de devoluciones cuando están configuradas.

La fecha del asiento es la **Fecha de devengo** de la factura; si está vacía, se utiliza la fecha de la factura. El diario y el canal analítico se toman de la [serie](https://facturascripts.com/publicaciones/series-470).

## 🧾 Generar el asiento de una factura

1. Abre la factura desde **Ventas → Facturas** o **Compras → Facturas**.
2. Entra en la pestaña **Asientos**.
3. Si no aparece ningún asiento, pulsa **Generar asiento contable**.

Cuando termina correctamente, el asiento aparece en esa misma pestaña y puedes abrirlo para revisar sus partidas.

Si la factura ya tiene un asiento vinculado, FacturaScripts muestra un aviso y no crea otro.

## 🪄 Generar los asientos pendientes en bloque

En los listados **Ventas → Facturas** y **Compras → Facturas**, abre el botón **Acciones** y pulsa **Generar asientos contables**. El botón solo aparece cuando hay facturas recientes pendientes de contabilizar.

No necesitas seleccionar facturas. Esta acción no utiliza las filas marcadas ni los filtros del listado: en cada ejecución procesa hasta 300 facturas del mismo tipo que cumplan estas condiciones:

- No tienen asiento vinculado.
- Su total es distinto de cero.
- Su fecha está dentro del último año.
- El usuario tiene permiso para acceder a ellas.

Si hay más de 300, vuelve a ejecutar la acción. Para una factura de hace más de un año, utiliza el botón **Generar asiento contable** de su propia pestaña **Asientos**.

Si una factura del lote no se puede contabilizar, la operación se cancela. Corrige el error indicado y vuelve a ejecutarla.

## 🔍 Encontrar facturas sin asiento

En el listado de facturas, pulsa **Filtros** y activa **Factura sin asiento contable**. Así podrás localizar las facturas que necesitan revisión, incluidas las antiguas que la acción masiva no procesa.

## 🔄 Qué ocurre al modificar o eliminar una factura

Cuando modificas datos que cambian la contabilidad de una factura editable, FacturaScripts elimina el asiento vinculado y genera uno nuevo con los importes actualizados. Por este motivo, los cambios manuales realizados directamente en ese asiento pueden perderse si después vuelves a modificar la factura.

Al eliminar una factura también se eliminan sus recibos y su asiento. Si el asiento no se puede eliminar, tampoco se elimina la factura.

Para corregir una factura ya emitida o contabilizada es preferible crear una [factura rectificativa](https://facturascripts.com/publicaciones/como-hacer-una-factura-rectificativa-o-devolucion), conservando así la trazabilidad.

## 💰 Asiento de la factura y asiento del cobro o pago

Son operaciones distintas:

- El **asiento de la factura** registra la venta o compra, los impuestos y la deuda con el cliente o proveedor.
- El **asiento del cobro o pago** cancela esa deuda contra la cuenta bancaria o de caja de la forma de pago.

Al marcar un recibo como pagado, FacturaScripts registra el pago y genera su asiento automáticamente. Si ese asiento no se pudo crear, abre el recibo, entra en la pestaña **Pagos**, selecciona el pago y pulsa **Generar asiento contable**.

Consulta [los recibos de facturas de venta](https://facturascripts.com/publicaciones/los-recibos-de-facturas) o [los recibos y pagos a proveedores](https://facturascripts.com/publicaciones/los-recibos-y-pagos-a-proveedores) para ampliar esta parte.

## ⚠️ Motivos habituales por los que no se genera

- La factura tiene total cero o ya tiene un asiento.
- El [ejercicio contable](https://facturascripts.com/publicaciones/los-ejercicios-contables) no existe, está cerrado o no tiene un plan contable cargado.
- Faltan cuentas o subcuentas en el ejercicio.
- No se puede obtener la subcuenta del cliente, proveedor o acreedor.
- Faltan [cuentas especiales](https://facturascripts.com/publicaciones/cuentas-especiales) de ventas, compras, devoluciones, suplidos u otras necesarias.
- Los [impuestos o retenciones](https://facturascripts.com/publicaciones/impuestos-967) no tienen las subcuentas necesarias.
- El asiento resultante no cuadra.

Lee el aviso que aparece al generar el asiento: normalmente indica la cuenta, el impuesto, el cliente, el proveedor o el ejercicio que debes revisar.

## Ver también

- [Cómo hacer una factura de venta](https://facturascripts.com/publicaciones/como-hacer-una-factura-de-venta)
- [Cómo registrar una factura de compra](https://facturascripts.com/publicaciones/como-registrar-una-factura-de-compra)
- [Cómo hacer un asiento contable](https://facturascripts.com/publicaciones/tu-primer-asiento-463)
- [Plan contable](https://facturascripts.com/publicaciones/plan-contable-442)
- [Menú Contabilidad](https://facturascripts.com/publicaciones/menu-contabilidad)