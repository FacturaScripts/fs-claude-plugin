---
name: tesoreria
description: "Analiza en FacturaScripts, mediante fs-mcp, la tesorería a corto plazo: cobros y pagos pendientes por antigüedad, recibos vencidos de clientes y proveedores, previsión de caja por semanas y días medios de cobro."
---

# Tesorería a corto plazo

Genera una visión conjunta de lo que la empresa tiene que cobrar y pagar: cuánto está vencido, qué entra y sale en las próximas semanas y si la caja prevista queda en positivo o en negativo. Trabaja con los **recibos** de clientes y de proveedores, que son los vencimientos de cada factura (`los-recibos-de-facturas`, `los-recibos-y-pagos-a-proveedores`).

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que puedes pedir (opcionales)

- **Horizonte** de la previsión de caja. Por defecto, 60 días.
- **Periodo** para los días medios de cobro. Por defecto, 12 meses.
- **Saldo de partida** en bancos, si el usuario lo conoce: fs-mcp no lo obtiene (ver limitaciones).

## Definiciones

- **Recibo pendiente:** `pagado = false`. **Vencido:** pendiente y con `vencimiento` anterior a hoy.
- **Importes:** el `importe` de un recibo es la parte de la factura que vence en esa fecha, **con impuestos**. Todas las cifras de esta skill tienen esa misma base, así que cobros y pagos sí se pueden restar entre sí.
- **Tramos de antigüedad** (los de `get_aging_cobros` y `get_aging_pagos`): no vencido, 1-30, 31-60, 61-90 y más de 90 días desde el vencimiento.
- **Previsión de caja:** cobros menos pagos con vencimiento entre hoy y el horizonte, agrupados por semana (cada semana empieza en lunes). **No incluye lo ya vencido**: muéstralo aparte, porque es dinero que debería haber entrado o salido y aún no lo ha hecho.
- **Días medios de cobro (DSO):** media de días entre la fecha del recibo y su fecha de pago, solo en los recibos ya cobrados. Se mide desde la fecha del recibo, no desde el vencimiento.

## Procedimiento

Lanza las consultas una detrás de otra, no todas a la vez: cada una recorre todos los recibos y, juntas, pueden superar el límite de peticiones por minuto de la API (error 429).

1. **Conexión.** Elige la conexión según el perfil.
2. **Antigüedad de cobros.** `get_aging_cobros` (solo admite `connection`): total pendiente y tramos con número de recibos e importe.
3. **Antigüedad de pagos.** `get_aging_pagos` (solo `connection`): lo mismo para los recibos de proveedor.
4. **Vencidos por tercero.** `get_clientes_morosos` y `get_pagos_pendientes_proveedor` (solo `connection`) dan, por cliente y por proveedor, la deuda vencida y sus recibos. Quédate con los 10 mayores de cada lado.
5. **Previsión semanal.** `get_cash_flow_proyectado` con `dias` igual al horizonte: total de cobros y pagos previstos, neto y `proyeccionSemanal` (semana, cobros, pagos, neto). Calcula el saldo acumulado semana a semana partiendo de 0 o del saldo de partida que dé el usuario, y señala la primera semana en que quedaría en negativo.
6. **Días medios de cobro.** `get_dso` con `meses`: DSO global y por cliente. Compáralo con los plazos de las formas de pago habituales si el usuario los conoce.
7. **Contraste** (opcional). `get_dashboard_resumen` devuelve en `tesoreria` los cobros y pagos pendientes y vencidos: deben coincidir con la suma de los tramos de los pasos 2 y 3. Explica cualquier diferencia: por ejemplo, los tramos no cuentan los recibos sin fecha de vencimiento.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** cobros pendientes y vencidos, pagos pendientes y vencidos, saldo neto pendiente (cobros − pagos), neto previsto en el horizonte y DSO global.
2. **Antigüedad:** tabla con los tramos en filas y dos columnas (cobros y pagos) con número de recibos e importe.
3. **Vencidos más relevantes:** los 10 clientes con más deuda vencida y los 10 proveedores a los que más se debe vencido.
4. **Previsión semanal:** tabla con semana, cobros, pagos, neto y saldo acumulado; marca las semanas con neto negativo.
5. **Días medios de cobro:** DSO global y los clientes que más tardan en pagar, con su número de recibos.
6. **Recomendaciones:** por ejemplo, reclamar los cobros vencidos antes de la semana con saldo negativo, negociar el aplazamiento de pagos concretos o revisar las condiciones de pago de los clientes con DSO alto.
7. **Notas sobre los datos:** fecha de corte, horizonte, base con impuestos y limitaciones.

## Cómo actuar en el ERP

- Los recibos de clientes están en **Ventas → Facturas**, pestaña **Recibos**, y los de proveedores en la pestaña **Recibos** de cada factura de compra; ahí se marcan como pagados o se fraccionan con **Generar recibos** (`los-recibos-de-facturas`, `los-recibos-y-pagos-a-proveedores`).
- Las cuentas bancarias de la empresa se configuran como se explica en `cuentas-bancarias-28`.
- Para profundizar, usa [`clientes-morosos`](../clientes-morosos/SKILL.md) en los cobros y [`pagos-proveedores`](../pagos-proveedores/SKILL.md) en los pagos.
- Plugins opcionales relacionados (consulta su ficha antes de recomendarlos): **Informes** (informes de tesorería), **RemesasSEPA** (remesas de recibos domiciliados) y **ConciliacionBancaria** (cuadrar los movimientos del banco).

## Limitaciones

- fs-mcp no conoce el saldo real de los bancos ni los movimientos bancarios: la previsión es la variación por vencimientos, no el saldo de caja. Si el usuario no da un saldo de partida, el saldo acumulado parte de 0.
- Solo cuenta lo que tiene recibo: nóminas, impuestos, cuotas o gastos que no se registran como facturas de compra no aparecen.
- Si los cobros y pagos no se marcan en el ERP, los recibos siguen apareciendo como pendientes aunque ya se hayan liquidado.
- `get_dso` solo mide los recibos cobrados con fecha de pago; no dice nada de los que siguen pendientes.
