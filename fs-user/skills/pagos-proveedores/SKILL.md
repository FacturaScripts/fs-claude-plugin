---
name: pagos-proveedores
description: "Revisa en FacturaScripts, mediante fs-mcp, lo que la empresa debe a proveedores y acreedores: recibos vencidos sin pagar por antigüedad e importe y calendario de próximos pagos para planificar la tesorería."
---

# Pagos a proveedores

Genera un informe para planificar los pagos a partir de los **recibos** de proveedor pendientes. Igual que en ventas, cada vencimiento de una factura de compra es un recibo, y la factura solo queda pagada cuando se pagan todos sus recibos (`los-recibos-y-pagos-a-proveedores`). Por eso la deuda se calcula por recibos, no por facturas.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación y fechas son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que puedes pedir (opcionales)

- **Horizonte** del calendario de próximos pagos. Por defecto, 30 días.
- **Proveedor** concreto (`codproveedor`).
- **Orden:** por importe (predeterminado) o por días de retraso.

## Definiciones

- **Recibo pendiente:** `pagado = false`. **Vencido:** pendiente y con `vencimiento` anterior a hoy.
- **Días de retraso:** días entre el `vencimiento` y hoy. El retraso de un proveedor es el de su recibo vencido más antiguo.
- **Importes:** el `importe` de cada recibo es **con impuestos** (la parte de la factura de compra que vence ese día).
- **Tramos** (los mismos que `get_aging_pagos`): 1-30, 31-60, 61-90 y más de 90 días de retraso. Lo que vence dentro del horizonte no es retraso: va en el calendario de próximos pagos.

## Procedimiento

Lanza las consultas una detrás de otra, no todas a la vez, para no superar el límite de peticiones por minuto de la API (error 429).

1. **Conexión.** Elige la conexión según el perfil.
2. **Recibos pendientes.** Obtén todos los recibos con `get_reciboproveedores` y `pagado = false` (y `codproveedor` si se ha pedido), recorriendo `offset`. Cada recibo incluye `codproveedor`, `codigofactura`, `numero`, `importe`, `fecha`, `vencimiento` y `codpago`. Clasifícalos en vencidos, próximos pagos (vencimiento entre hoy y el horizonte) y resto. Para acotar, la herramienta admite `vencimiento_gte` y `vencimiento_lte`.
3. **Datos de los proveedores.** Para los proveedores con recibos vencidos o próximos, obtén con `get_proveedores` (filtrando por `codproveedor`) su `nombre`, `cifnif`, `telefono1`, `email` y si es `acreedor`.
4. **Contraste.** `get_pagos_pendientes_proveedor` (solo admite `connection`) devuelve la deuda vencida por proveedor con sus recibos: debe coincidir con los vencidos del paso 2. `get_aging_pagos` (solo `connection`) da el reparto global por tramos. Explica cualquier diferencia: por ejemplo, los tramos no cuentan los recibos sin fecha de vencimiento.
5. **Calendario.** Agrupa los próximos pagos por semana y, si el usuario quiere ver la caja completa, remite a [`tesoreria`](../tesoreria/SKILL.md), que cruza estos pagos con los cobros previstos.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen:** deuda vencida total, deuda pendiente total, número de proveedores con recibos vencidos, retraso medio ponderado por importe y pagos que vencen dentro del horizonte.
2. **Reparto por tramos:** tabla con número de recibos e importe por tramo, cuadrada con `get_aging_pagos`.
3. **Recibos vencidos por proveedor:** tabla con proveedor y CIF/NIF, deuda vencida, número de recibos, días de retraso, factura del recibo más antiguo (`codigofactura`) y su vencimiento, y teléfono o email.
4. **Calendario de próximos pagos:** por semana, con proveedor, factura, importe, vencimiento y forma de pago.
5. **Recomendaciones:** por ejemplo, pagar primero los recibos más antiguos o de proveedores críticos, pedir aplazamiento de los que no se puedan atender o revisar si hay recibos vencidos que en realidad ya se pagaron y no se marcaron.
6. **Notas sobre los datos:** fecha de corte, número de recibos analizados, base con impuestos y limitaciones.

## Cómo actuar en el ERP

- Los recibos de una factura de compra están en **Compras → Facturas**, pestaña **Recibos**. Para registrar un pago, selecciona los recibos y pulsa **Pagado**; para una fecha de pago distinta de hoy, abre el recibo y marca su casilla a mano (`los-recibos-y-pagos-a-proveedores`).
- Para fraccionar un pago, usa **Generar recibos** en esa misma pestaña; reparte solo el importe pendiente (`los-recibos-y-pagos-a-proveedores`).
- Los vencimientos dependen de la forma de pago de la factura (`formas-de-pago-729`).

## Limitaciones

- Si los pagos no se marcan en el ERP, los recibos siguen apareciendo como pendientes aunque ya se hayan pagado: avisa si hay recibos muy antiguos de proveedores habituales.
- Las facturas cuya forma de pago las da por pagadas al registrarse no generan deuda pendiente (`formas-de-pago-729`).
- Solo aparecen los gastos registrados como facturas de compra: impuestos, nóminas o cuotas sin factura no forman parte del informe.
