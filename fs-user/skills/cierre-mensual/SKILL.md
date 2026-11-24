---
name: cierre-mensual
description: "Prepara en FacturaScripts, mediante fs-mcp, el resumen de cierre de un mes para dirección: ventas, compras, IVA, resultado acumulado, cobros, pagos, previsión de caja, inventario y calidad de datos, más CRM, Proyectos y Servicios si están activos."
---

# Cierre mensual

Genera un resumen ejecutivo de un mes con lo más importante de cada área, en una sola página, para revisarlo con dirección o la gestoría. No profundiza: para cada área remite a la skill específica.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que debes pedir

- **Mes** a cerrar (obligatorio). Si el usuario no lo indica, propón el último mes completo y confírmalo. Convierte el mes en fechas `YYYY-MM-DD` de inicio y fin.
- **Bloques** a incluir (opcional). Por defecto, todos los disponibles.

## Bases de cálculo

- Las **ventas** y **compras** del mes se dan sobre la base imponible (`neto`) y con impuestos (`total`), sumando las facturas del mes.
- **Cobros, pagos y previsión de caja** salen de los recibos, con impuestos.
- El **inventario** se valora a coste, sin impuestos.
- Los bloques de **CRM**, **Proyectos** y **Servicios** tienen sus propias bases (ver el perfil): indícalas junto a cada cifra y no las sumes con las demás.

## Procedimiento

Lanza las consultas una detrás de otra, no todas a la vez: varias recorren todas las facturas o recibos y, juntas, pueden superar el límite de peticiones por minuto de la API (error 429). Si una consulta falla, sigue con las demás y menciónalo en las notas.

1. **Conexión y ejercicio.** Elige la conexión según el perfil y consulta `get_ejercicios` para saber a qué ejercicio pertenece el mes.
2. **Ventas.** `get_facturaclientes` con `fecha_gte` y `fecha_lte` del mes, recorriendo `offset`: número de facturas, clientes distintos, `neto`, `total`, `totalbeneficio` y margen sobre `neto`. Para comparar, suma los meses equivalentes de `get_tiempo_beneficios_todos_clientes` (filtra por `codejercicio`; devuelve `neto`, `total` y beneficio por mes) para el mes anterior y el mismo mes del año anterior, consultando otro ejercicio si hace falta.
3. **Compras.** `get_facturaproveedores` con `fecha_gte` y `fecha_lte` del mes, recorriendo `offset`: número de facturas, `neto` y `total`. Para la comparación, `get_evolucion_compras_mensual` con `codejercicio` (neto, IVA y total por mes).
4. **Cobros y pagos pendientes.** `get_aging_cobros` y `get_aging_pagos` (solo `connection`): pendiente total y vencido por tramos a fecha de hoy. Aclara que es la foto de hoy, no la del último día del mes.
5. **Previsión de caja.** `get_cash_flow_proyectado` con `dias = 30`: cobros, pagos y neto previstos por semana. No incluye lo ya vencido.
6. **Inventario.** `get_valoracion_inventario` (solo `connection` o `codalmacen`): valor total del stock a coste, a fecha de hoy.
7. **Calidad de datos.**
   - `get_facturas_con_errores` (solo `connection`; revisa todas las facturas): quédate con las del mes. Ya no marca las rectificativas por tener importes negativos.
   - `get_albaranes_pendientes_facturar` (solo `connection`): albaranes del mes o anteriores aún sin facturar, con su neto (`netoPendienteFacturar`) y su total.
8. **IVA del mes.** `get_impuestos_periodo` con las fechas del mes y `desglose = false`: IVA repercutido y soportado y la diferencia orientativa. Si la empresa liquida por trimestres, indica qué parte del trimestre lleva acumulada y remite a [`impuestos-trimestre`](../impuestos-trimestre/SKILL.md).
9. **Resultado acumulado del ejercicio.** `get_cuenta_resultados` con el `codejercicio` del mes: ingresos, gastos y resultado contables del ejercicio hasta hoy. Solo tiene sentido si la contabilidad está al día; si el resultado es 0 o muy distinto de ventas menos compras, avísalo en lugar de presentarlo.
10. **CRM** (si el plugin está activo). `get_informe_oportunidades_crm` con las fechas del mes: oportunidades nuevas, ganadas, perdidas, conversión e importe ganado (sin impuestos).
11. **Proyectos** (si el plugin está activo). `get_rentabilidad_proyectos` con `editable = true` y `solo_con_movimientos = true`: margen de los proyectos abiertos (ventas y compras con impuestos) y pendiente de facturar (sin impuestos); y `get_tareas_proyecto_vencidas` para el número de tareas vencidas.
12. **Servicios** (si el plugin está activo). `get_informe_servicios_at` con las fechas del mes (servicios entrados y cerrados, neto sin impuestos), `get_horas_trabajos_at` con las mismas fechas y `get_servicios_at_pendientes` para los abiertos a hoy.

En los pasos 10 a 12, si la herramienta devuelve un error de plugin no activo, omite el bloque sin detener el informe y menciónalo en una línea de las notas.

## Informe

Usa el formato de informe del perfil, breve, con estas secciones:

1. **Cifras clave del mes:** tabla con ventas (neto y total), beneficio y margen, compras (neto y total) y variación frente al mes anterior y al mismo mes del año anterior.
2. **IVA y resultado:** IVA repercutido, soportado y diferencia del mes, y resultado contable acumulado del ejercicio.
3. **Cobros y pagos:** pendiente y vencido de cada lado, y neto previsto en los próximos 30 días.
4. **Inventario:** valor a coste.
5. **Actividad de los plugins:** una línea o una pequeña tabla por cada plugin activo.
6. **Alertas:** facturas con errores del mes, albaranes sin facturar, vencidos de más de 90 días, semanas con caja prevista negativa y, si procede, proyectos con margen negativo o servicios muy antiguos.
7. **Próximos pasos:** qué revisar a fondo y con qué skill: [`analizar-ventas`](../analizar-ventas/SKILL.md), [`impuestos-trimestre`](../impuestos-trimestre/SKILL.md), [`informe-contable`](../informe-contable/SKILL.md), [`rentabilidad`](../rentabilidad/SKILL.md), [`tesoreria`](../tesoreria/SKILL.md), [`clientes-morosos`](../clientes-morosos/SKILL.md), [`pagos-proveedores`](../pagos-proveedores/SKILL.md), [`salud-inventario`](../salud-inventario/SKILL.md), [`pendiente-facturar`](../pendiente-facturar/SKILL.md), [`pipeline-crm`](../pipeline-crm/SKILL.md), [`rentabilidad-proyectos`](../rentabilidad-proyectos/SKILL.md) o [`estado-sat`](../estado-sat/SKILL.md).
8. **Notas sobre los datos:** mes analizado, qué cifras son del mes y cuáles son la foto de hoy, bases de cada bloque, bloques omitidos y limitaciones.

## Cómo actuar en el ERP

- El **Tablero** del menú Informes muestra compras, ventas, impuestos y nuevos clientes de los últimos meses (`menu-informes`).
- El plugin **Informes** añade balances, cuenta de resultados y tesorería, y los modelos fiscales los aportan plugins como **Modelo303** (consulta sus fichas antes de recomendarlos).

## Limitaciones

- El IVA es una orientación calculada desde las facturas y el resultado sale de los saldos contables: no sustituyen a la liquidación ni a las cuentas oficiales.
- Cobros, pagos, previsión e inventario son la situación a fecha de la consulta; si se cierra un mes pasado, no reflejan cómo estaban el último día de ese mes.
- Las cifras dependen de que el mes esté completo en el ERP: facturas de compra registradas tarde cambian el resultado.
