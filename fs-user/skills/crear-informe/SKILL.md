---
name: crear-informe
description: "Crea en FacturaScripts, mediante fs-mcp, un informe a medida con los cortes, filtros y periodo que pida el usuario: ventas por familia, agente o serie, clientes, compras, inventario, tesorería o pendientes."
---

# Informe personalizado

Diseña y genera un informe a partir de la petición del usuario con datos reales de la instancia. Si la petición encaja con una skill específica, úsala en su lugar: [`analizar-ventas`](../analizar-ventas/SKILL.md) para un resumen de ventas, [`clientes-morosos`](../clientes-morosos/SKILL.md) para deuda vencida y [`stock-bajo`](../stock-bajo/SKILL.md) para reposición.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo, y su catálogo de herramientas, son obligatorios en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Paso 1: concretar la petición

Si la petición no lo deja claro, pregunta solo lo imprescindible:

- **Qué medir y por qué cortes:** por ejemplo, ventas por familia o clientes perdidos.
- **Periodo:** fechas concretas o ejercicio. Recuerda que muchas herramientas de agregación solo filtran por ejercicio completo.
- **Filtros:** cliente, familia, serie, almacén, agente…
- **Orden y número de filas.**
- **Base de los importes:** con impuestos o base imponible, si el usuario es contable y no lo indica.

Antes de consultar datos, confirma en una frase el diseño del informe: columnas, periodo y fuente.

## Paso 2: elegir la fuente

| Petición | Herramientas | Observaciones |
|---|---|---|
| Ventas por familia o fabricante | `get_ventas_por_familia`, `get_ventas_por_fabricante` | Por ejercicio; importes sin impuestos (líneas) |
| Ventas por agente, serie, almacén o forma de pago | `get_ventas_por_agente`, `get_ventas_por_serie`, `get_ventas_por_almacen`, `get_ventas_por_forma_pago` | Por ejercicio; importes con impuestos |
| Ventas por cliente o producto en fechas concretas | `get_facturaclientes` con `fecha_gte`/`fecha_lte`, y sus líneas con `get_lineafacturaclientes` | Agrega tú los datos; para periodos largos, ofrece el ejercicio completo |
| Comparativa entre dos periodos | `get_comparativa_ventas_periodos` | Importes con impuestos; los rangos no deben solaparse |
| Evolución mensual de ventas o compras | `get_tiempo_beneficios_todos_clientes`, `get_evolucion_compras_mensual` | Por ejercicio; incluyen base imponible y total |
| Embudo comercial y documentos pendientes | `get_funnel_ventas`, `get_presupuestos_pendientes`, `get_pedidos_pendientes_servir`, `get_albaranes_pendientes_facturar` | El embudo acepta fechas |
| Clientes: nuevos, perdidos, inactivos, valor y frecuencia | `get_clientes_nuevos_vs_recurrentes`, `get_clientes_perdidos`, `get_clientes_sin_compras`, `get_clientes_lifetime_value`, `get_clientes_frecuencia_compras` | `get_clientes_perdidos` admite el número de meses sin comprar |
| Rentabilidad | `get_clientes_top_margen`, `get_productos_top_margen`, `get_facturas_margen_negativo` | Depende del precio de coste registrado en los productos |
| Compras y proveedores | `get_top_proveedores_compras`, `get_compras_por_familia`, `get_facturaproveedores` | Las dos primeras, por ejercicio; la última acepta fechas |
| Cobros y pagos pendientes | `get_aging_cobros`, `get_aging_pagos`, `get_pagos_pendientes_proveedor`, `get_reciboclientes`, `get_reciboproveedores` | La deuda se mide por recibos |
| Tesorería prevista | `get_cash_flow_proyectado` | Cobros y pagos pendientes de los próximos N días, por semanas |
| Inventario | `get_valoracion_inventario`, `get_rotacion_stock`, `get_stock_muerto`, `get_productos_sobrestock`, `get_productos_no_vendidos`, `get_stocks` | La valoración usa el coste de la variante |
| Resumen para dirección | `get_dashboard_resumen` | Últimos N días desde hoy, con comparativa |
| Calidad de los datos | `get_facturas_con_errores` | Facturas con total 0 o incoherencias |

Si ninguna herramienta analítica encaja, construye el informe con las herramientas genéricas `get_*` del modelo correspondiente y sus filtros, y explica cómo lo has calculado.

## Paso 3: lo que no se puede calcular con fs-mcp

Dilo antes de empezar y ofrece la alternativa:

- **Balance de situación, pérdidas y ganancias, sumas y saldos o libro mayor:** no hay herramientas que los calculen. En el ERP los aporta el plugin **Informes** desde el menú Informes (`menu-informes`). Con `get_partidas` y `get_subcuentas` solo se pueden obtener datos contables en bruto.
- **Centros de coste:** no forman parte del core; la analítica por centros de coste la aporta el plugin **quickPurchaseInvoice**.
- **Gastos de personal, nóminas o departamentos:** el core no gestiona nóminas ni departamentos.
- **Gastos por concepto:** solo se pueden aproximar con las compras por familia o con las partidas por subcuenta.
- **Modelos fiscales (303, 347…):** los aportan plugins específicos (`menu-informes`). El ERP incluye un informe de impuestos en el menú Informes.

## Paso 4: generar el informe

- Usa el formato de informe del perfil.
- Ordena las tablas según lo pedido e incluye totales y porcentajes cuando aporten valor.
- Si el usuario pide un gráfico, usa una tabla y, si ayuda, un gráfico de barras en texto. No generas archivos Excel ni imágenes. Si el usuario quiere la tabla en una hoja de cálculo, ofrécela en CSV para copiar.
- Para un informe recurrente, explica cómo repetir la misma petición. En el ERP se pueden crear informes gráficos propios desde el menú Informes (`menu-informes`) y exportar cualquier listado a PDF, XLS o CSV (`como-funcionan-los-listados-y-filtros`).

## Ejemplos de peticiones

- "Ventas por familia del ejercicio 2026, ordenadas de mayor a menor": `get_ventas_por_familia`.
- "Clientes que no compran desde hace tres meses": `get_clientes_perdidos` con `meses = 3`.
- "Cobros y pagos previstos para las próximas ocho semanas": `get_cash_flow_proyectado` con `dias = 56`.
- "Productos con stock que no se venden desde hace seis meses": `get_stock_muerto` con `dias = 180`.
- "Facturas vendidas por debajo de coste este ejercicio": `get_facturas_margen_negativo`.
