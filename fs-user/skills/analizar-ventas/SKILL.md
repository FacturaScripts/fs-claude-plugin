---
name: analizar-ventas
description: "Analiza las ventas de un periodo en FacturaScripts mediante fs-mcp y genera un informe ejecutivo con cifras clave, comparativas, mejores clientes y productos, y tendencias."
---

# Análisis de ventas

Genera un informe ejecutivo de las ventas facturadas en un periodo con datos reales de la instancia.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que debes pedir

- **Periodo** (obligatorio). Si el usuario no lo indica, propón el último mes completo y confírmalo. Convierte expresiones como "enero de 2026" o "el último trimestre" en fechas `YYYY-MM-DD`.
- **Comparativas** (opcional; por defecto, sí): el periodo anterior de igual duración y el mismo periodo del año anterior.
- **Rentabilidad** (opcional; por defecto, sí): beneficio y margen.

## Procedimiento

1. **Conexión y ejercicios.** Elige la conexión según el perfil y consulta `get_ejercicios` para saber a qué ejercicio o ejercicios pertenece el periodo.
2. **Facturas del periodo.** Obtén todas las facturas de cliente con `get_facturaclientes` filtrando `fecha_gte` y `fecha_lte`, recorriendo `offset`. Calcula:
   - número de facturas y de clientes distintos;
   - base imponible (`neto`), IVA (`totaliva`) y total (`total`);
   - ticket medio sobre la base imponible (`neto` / número de facturas);
   - beneficio (`totalbeneficio`) y margen sobre la base imponible (`totalbeneficio` / `neto`).
   Las facturas rectificativas tienen importes negativos y restan; menciónalas si existen.
3. **Mejores clientes.** Agrupa las facturas del paso 2 por `codcliente` y `nombrecliente` y ordena por base imponible. Muestra los 10 primeros con su número de facturas, base imponible, ticket medio y porcentaje sobre el total. No uses `get_clientes_top_facturacion` salvo que el periodo coincida con un ejercicio completo, porque solo filtra por ejercicio y suma importes con impuestos.
4. **Productos más vendidos.**
   - Si el periodo coincide con un ejercicio completo, usa `get_productos_mas_vendidos` con su `codejercicio`. Ordena por cantidad y sus importes no incluyen impuestos.
   - En otro caso, obtén las líneas de las facturas del periodo con `get_lineafacturaclientes` filtrando por `idfactura` y agrúpalas por `referencia`, sumando `cantidad` y `pvptotal`.
   - Si el periodo tiene muchas facturas (más de 200, aproximadamente), ofrece en su lugar el ranking del ejercicio completo y advierte de la diferencia.
   - Las líneas sin referencia son conceptos libres: agrúpalas aparte como "Otros conceptos".
5. **Comparativas.** Calcula las mismas cifras del paso 2 para cada periodo de comparación.
   - Si los periodos son meses completos, puedes sumar los meses de `get_tiempo_beneficios_todos_clientes` (por ejercicio), que ya devuelve `neto`, `total` y beneficio mensuales.
   - En otro caso, repite el paso 2 con las fechas de comparación.
   - Expresa la variación en porcentaje. Si el periodo de comparación no tiene ventas, indica "sin datos comparables" en lugar de un 0 % o un infinito.
6. **Tendencia.** Si el periodo abarca más de un mes, muestra la evolución mensual de la base imponible con `get_tiempo_beneficios_todos_clientes`. Si hay datos del ejercicio anterior, compara los mismos meses para detectar estacionalidad. Esta herramienta no calcula un "tiempo hasta beneficios"; úsala solo como evolución mensual.
7. **Rentabilidad** (si se ha pedido).
   - Indica los clientes con mayor beneficio a partir del paso 3.
   - Si el periodo coincide con un ejercicio, añade las facturas vendidas por debajo de coste con `get_facturas_margen_negativo`.
   - Advierte que el beneficio depende del precio de coste registrado en los productos: si los costes están vacíos o desactualizados, el margen no es fiable.
8. **Ventas aún sin facturar** (opcional). Si `get_albaranes_pendientes_facturar` devuelve albaranes del periodo, menciónalos como ventas entregadas pendientes de facturar.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** base imponible, total con impuestos, número de facturas, ticket medio y variaciones frente a los periodos de comparación.
2. **Mejores clientes:** tabla con los 10 primeros.
3. **Productos más vendidos:** tabla con referencia, descripción, cantidad, importe sin impuestos y porcentaje sobre las ventas de productos.
4. **Rentabilidad:** beneficio, margen y alertas de margen negativo, si se ha pedido.
5. **Tendencia:** evolución mensual y estacionalidad, si procede.
6. **Recomendaciones:** basadas en los datos, como concentración de ventas en pocos clientes, caídas frente al periodo anterior o márgenes bajos.
7. **Notas sobre los datos:** base de cada importe, número de registros analizados y limitaciones.

## Referencias para el usuario

- En el ERP, el **Tablero** del menú Informes muestra compras, ventas, impuestos y nuevos clientes de los últimos tres meses (`menu-informes`).
- El plugin **Informes** añade desgloses de ventas y compras, resultados anuales y tesorería (ficha `Informes`).
- Para un informe con otros cortes (por familia, agente, serie o almacén), usa [`crear-informe`](../crear-informe/SKILL.md).
