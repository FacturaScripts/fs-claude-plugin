---
name: salud-inventario
description: "Analiza en FacturaScripts, mediante fs-mcp, la salud del inventario: valor del stock a coste por almacén y familia, stock muerto sin ventas, excesos sobre el stock máximo, rotación y días de cobertura, y productos que no se venden."
---

# Salud del inventario

Genera un informe del dinero inmovilizado en el almacén y de cómo se mueve: cuánto vale el stock, qué parte no se vende, qué productos superan su máximo y cuántos días de venta cubre cada uno. Complementa a [`stock-bajo`](../stock-bajo/SKILL.md), que solo mira los faltantes por debajo del mínimo.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación y fechas son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que puedes pedir (opcionales)

- **Almacén** (`codalmacen`). Solo lo admiten la valoración y el sobrestock; la rotación y el stock muerto suman siempre todos los almacenes.
- **Días sin ventas** para considerar un producto como stock muerto. Por defecto, 180.
- **Días** para medir la velocidad de venta en la rotación. Por defecto, 90.

## Definiciones

- En FacturaScripts el stock se lleva **por variante y almacén** (`el-stock-de-productos`). Las herramientas identifican cada artículo por su `referencia`, que en los productos con variantes es la de la variante.
- **Valor a coste:** cantidad física × `coste` de la variante. No es valor de venta ni incluye impuestos.
- **Stock muerto:** referencias con stock mayor que 0 que no aparecen en ninguna línea de factura de venta de los últimos N días.
- **Sobrestock:** registros de stock con `stockmax` mayor que 0 y cantidad por encima de él. Sin máximo configurado, no se detecta exceso.
- **Días de cobertura:** stock actual / ventas diarias medias del periodo. Una referencia con stock y sin ventas tiene cobertura indefinida.

## Procedimiento

Lanza las consultas una detrás de otra, no todas a la vez: la rotación, el stock muerto y los productos no vendidos recorren todas las facturas y líneas de venta y, juntos, pueden superar el límite de peticiones por minuto de la API (error 429) o tardar bastante en instalaciones grandes.

1. **Conexión.** Elige la conexión según el perfil.
2. **Valoración.** `get_valoracion_inventario` (con `codalmacen` si se ha pedido): cantidad y valor a coste totales, `porAlmacen` y `porFamilia`.
3. **Stock muerto.** `get_stock_muerto` con `dias`: referencia, descripción, familia, fabricante y stock actual, de más a menos unidades. La herramienta no da su valor: obtén el `coste` de las 20 primeras referencias con `get_variantes` (filtrando por `referencia`) y calcula el valor inmovilizado. Si son más, indica que el valor es solo de esas 20.
4. **Sobrestock.** `get_productos_sobrestock` (con `codalmacen` si se ha pedido): referencia, almacén, cantidad, máximo y excedente. Valora el excedente con el coste de la variante igual que en el paso 3.
5. **Rotación.** `get_rotacion_stock` con `dias`: por referencia, stock actual, unidades vendidas en el periodo, venta diaria media y días de cobertura. Destaca las referencias con más de 365 días de cobertura y las de menos de 15, que pueden quedarse sin stock pronto (contrástalas con [`stock-bajo`](../stock-bajo/SKILL.md)).
6. **Catálogo sin ventas** (opcional). `get_productos_no_vendidos` con `dias`: productos del catálogo sin ventas en el periodo, tengan o no stock. Sirve para depurar el catálogo, no para medir dinero inmovilizado.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** valor total del stock a coste, valor estimado del stock muerto y del excedente sobre máximos, número de referencias con cobertura excesiva y con riesgo de rotura.
2. **Valor por almacén y por familia:** tablas con unidades y valor a coste, y porcentaje sobre el total.
3. **Stock muerto:** tabla con referencia, descripción, familia, stock, coste unitario y valor.
4. **Excesos sobre el máximo:** tabla con referencia, almacén, cantidad, máximo, excedente y su valor.
5. **Rotación:** las referencias con más días de cobertura (y valor) y las de menos días.
6. **Catálogo sin ventas:** número de productos y los más relevantes, si se ha pedido.
7. **Recomendaciones:** por ejemplo, liquidar o promocionar el stock muerto, frenar compras de lo que excede el máximo, ajustar los mínimos y máximos o dar de baja productos sin movimiento.
8. **Notas sobre los datos:** fecha de corte, periodos usados, base a coste y limitaciones.

## Cómo actuar en el ERP

- El stock, el mínimo y el máximo de cada variante y almacén se consultan y editan en la pestaña de stock del producto (`el-stock-de-productos`, `almacenes-128`).
- El coste de las variantes puede actualizarse solo con cada compra si se elige una política de precios de coste (`politicas-de-precios-de-coste`).
- Para movimientos, traspasos entre almacenes o regularizaciones, el plugin **StockAvanzado** amplía la gestión del core (consulta su ficha antes de recomendarlo).

## Limitaciones

- Los valores dependen del `coste` de las variantes: si está a 0 o desactualizado, la valoración y el stock muerto salen infravalorados.
- La familia se asigna buscando la referencia del stock entre las de los productos: el stock de variantes con referencia propia aparece en "(sin familia)" en la valoración por familia.
- La rotación y el stock muerto solo cuentan ventas facturadas: lo vendido en albaranes o pedidos aún sin facturar no cuenta como venta, y las rectificativas restan unidades.
- Las cantidades son las del momento de la consulta; no hay histórico del valor del stock.
