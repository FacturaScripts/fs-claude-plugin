---
name: retencion-clientes
description: "Analiza en FacturaScripts, mediante fs-mcp, la cartera de clientes: clientes perdidos o inactivos, nuevos frente a recurrentes, frecuencia de compra, valor histórico (LTV) y uso del límite de crédito, para priorizar acciones de fidelización."
---

# Retención de clientes

Genera un informe de la salud de la cartera de clientes: cuántos clientes nuevos llegan, cuántos repiten, quién ha dejado de comprar, qué clientes valen más a lo largo del tiempo y quién está cerca de su límite de crédito.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que puedes pedir (opcionales)

- **Periodo** para nuevos frente a recurrentes (fechas). Por defecto, los últimos 12 meses.
- **Meses sin comprar** para considerar perdido a un cliente. Por defecto, 6 (la herramienta usa 12 si no se indica).
- **Ejercicio** para la frecuencia de compra (`codejercicio`).
- **Número de clientes** en el ranking de valor. Por defecto, 20.

## Definiciones

- **Cliente nuevo** en un periodo: su primera factura de toda la historia cae dentro del periodo. **Recurrente:** compra en el periodo y ya tenía facturas anteriores.
- **Cliente perdido:** cliente activo que compró alguna vez pero no tiene facturas en los últimos N meses. La herramienta ya excluye a los que nunca han comprado (están en `get_clientes_sin_compras`) y a los dados de baja.
- **Valor histórico (LTV):** total facturado a un cliente en toda su historia, con su beneficio, ticket medio, primera y última compra y días entre ambas.
- **Importes:** todas las herramientas de esta skill suman el `total` de las facturas, **con impuestos**, y calculan el margen sobre ese total.
- **Uso del crédito:** riesgo alcanzado / riesgo máximo. Solo se puede calcular en los clientes con un riesgo máximo configurado.

## Procedimiento

Lanza las consultas una detrás de otra, no todas a la vez: casi todas recorren todas las facturas y, juntas, pueden superar el límite de peticiones por minuto de la API (error 429).

1. **Conexión.** Elige la conexión según el perfil.
2. **Nuevos frente a recurrentes.** `get_clientes_nuevos_vs_recurrentes` con `fecha_inicio` y `fecha_fin` (obligatorias): número de clientes, importe, beneficio y porcentaje de la facturación de cada grupo. Si interesa la tendencia, repítelo con el periodo anterior de igual duración.
3. **Clientes perdidos.** `get_clientes_perdidos` con `meses`: código, nombre, email, última compra y días sin comprar, del más antiguo al más reciente. Cruza los perdidos con `get_clientes_lifetime_value` para destacar los de más valor histórico.
4. **Valor histórico.** `get_clientes_lifetime_value` con `limit`: los clientes que más han facturado, con beneficio, margen, número de facturas, ticket medio, primera y última compra, días activo y si están de baja. Destaca los de alto valor cuya última compra es antigua: son los perdidos que más importan.
5. **Frecuencia de compra.** `get_clientes_frecuencia_compras` (con `codejercicio` si se ha pedido): número de facturas, total y ticket medio por cliente. Clasifica en compradores frecuentes, ocasionales y de una sola compra.
6. **Clientes sin compras.** `get_clientes_sin_compras` (solo `connection`): clientes que nunca han facturado, con código, nombre, CIF/NIF, email, teléfono, fecha de alta y si están de baja. Separa los dados de alta recientemente (aún pueden comprar) de los antiguos.
7. **Riesgo de crédito.** `get_clientes_riesgo_credito` (solo `connection`): clientes con riesgo máximo configurado ordenados por uso del crédito, marcando los que lo superan.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** clientes activos en el periodo, nuevos y recurrentes con su peso en la facturación, clientes perdidos y facturación histórica de los perdidos de alto valor.
2. **Nuevos frente a recurrentes:** tabla con clientes, importe, beneficio y porcentaje, y comparación con el periodo anterior si se ha hecho.
3. **Clientes perdidos de más valor:** tabla con cliente, última compra, días sin comprar, facturación histórica y email, ordenada por valor.
4. **Ranking de valor:** los clientes con más facturación histórica, señalando los que siguen activos y los que no.
5. **Frecuencia de compra:** reparto entre frecuentes, ocasionales y de una sola compra.
6. **Fichas sin compras:** número y, si son muchas, sugerencia de depurarlas.
7. **Riesgo de crédito:** clientes por encima del 80 % de su límite y los que lo superan.
8. **Recomendaciones:** por ejemplo, contactar a los perdidos de alto valor, ofrecer una segunda compra a los clientes de una sola compra o revisar el límite de los clientes sobreexpuestos.
9. **Notas sobre los datos:** periodos, base con impuestos y limitaciones.

## Cómo actuar en el ERP

- El riesgo máximo de la ficha del cliente es su límite de crédito: al superarlo, el ERP impide guardar nuevas ventas. El riesgo actual suma pedidos y albaranes pendientes y facturas sin cobrar (`tu-primer-cliente-459`).
- Los grupos de clientes y las tarifas permiten aplicar condiciones especiales a los mejores clientes (`los-grupos-de-clientes`, `las-tarifas-de-precios-por-clientes-o-grupos`).
- Para acciones comerciales, el plugin **CRM** gestiona listas de contactos, campañas de email y oportunidades (ficha `CRM`); si está activo, [`pipeline-crm`](../pipeline-crm/SKILL.md) analiza su embudo.

## Limitaciones

- Solo cuentan las facturas: un cliente que compra con albaranes o pedidos aún sin facturar puede aparecer como inactivo.
- El valor histórico y la frecuencia no admiten rango de fechas (el valor histórico es siempre de toda la historia; la frecuencia, de un ejercicio o de toda la historia).
- El cliente genérico de ventas al contado agrupa compras de muchas personas: exclúyelo de los rankings y explícalo.
- Las fichas duplicadas de un mismo cliente se cuentan como clientes distintos.
