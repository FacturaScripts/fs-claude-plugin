---
name: rentabilidad
description: "Analiza en FacturaScripts, mediante fs-mcp, la rentabilidad de las ventas de un ejercicio: clientes, productos y familias que más margen dejan, productos con margen bajo y facturas vendidas por debajo de coste."
---

# Rentabilidad de las ventas

Genera un informe de dónde gana y dónde pierde dinero la empresa al vender: qué clientes, productos y familias aportan más beneficio, cuáles tienen márgenes bajos y qué facturas se han vendido por debajo de coste.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que puedes pedir

- **Ejercicio** (recomendado). Todas las herramientas de esta skill filtran solo por `codejercicio`, no por fechas. Consulta `get_ejercicios` para conocer su código. Sin ejercicio, analizan toda la historia: avísalo.
- **Número de filas** de cada ranking. Por defecto, 10.

## Bases de cálculo

El beneficio de una venta es el importe vendido menos el coste registrado. Hay dos bases distintas y **no se pueden mezclar** en una misma tabla ni comparar sus porcentajes:

| Herramienta | Qué suma | Base | Margen % sobre |
|---|---|---|---|
| `get_clientes_top_margen` | `total` y `totalbeneficio` de las facturas | Con impuestos | El total con impuestos (sale menor que sobre la base imponible) |
| `get_facturas_margen_negativo` | Facturas con `totalbeneficio` < 0 | Con impuestos | El total con impuestos |
| `get_productos_top_margen` | `pvptotal` y coste × cantidad de las líneas | Sin impuestos | El importe sin impuestos |
| `get_ventas_por_familia` | Igual que productos, agrupado por familia | Sin impuestos | El importe sin impuestos |

Si el usuario quiere el margen de un cliente sobre la base imponible, calcúlalo con `get_facturaclientes` filtrando por `codejercicio` y `codcliente` (recorriendo `offset`): `totalbeneficio` / `neto`.

## Procedimiento

Lanza las consultas una detrás de otra, no todas a la vez: varias recorren todas las líneas de factura y, juntas, pueden superar el límite de peticiones por minuto de la API (error 429).

1. **Conexión y ejercicio.** Elige la conexión según el perfil y confirma el ejercicio con `get_ejercicios`.
2. **Clientes.** `get_clientes_top_margen` con `codejercicio` y `limit`: por cliente, total facturado, coste, beneficio, margen % y número de facturas, ordenados por beneficio. Para detectar clientes que facturan mucho y dejan poco, compáralo con `get_clientes_top_facturacion` (misma base con impuestos).
3. **Productos.** `get_productos_top_margen` con `codejercicio` y `limit`. Devuelve dos rankings: `topPorBeneficioAbsoluto` y `topPorMargenPorcentual` (este último solo con productos de al menos 3 unidades vendidas). Las líneas sin referencia (conceptos libres) se agrupan juntas: menciónalas aparte.
4. **Familias.** `get_ventas_por_familia` con `codejercicio`: importe, coste, beneficio y margen % por familia, sin impuestos. Ordena por beneficio y destaca las familias con margen por debajo de la media.
5. **Ventas por debajo de coste.** `get_facturas_margen_negativo` con `codejercicio`: facturas con beneficio negativo, de la mayor pérdida a la menor, con cliente y agente.
6. **Fiabilidad del coste** (opcional, si los márgenes parecen anómalos). Muestrea con `get_variantes` los productos con margen del 100 % o muy alto: si su `coste` es 0, el margen no es real.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** beneficio y margen de las ventas del ejercicio (indicando la base), cliente, producto y familia que más beneficio aportan, y número e importe de facturas con pérdidas.
2. **Clientes por beneficio:** tabla con cliente, facturado, beneficio, margen % y número de facturas (con impuestos). Señala los clientes de alta facturación y margen bajo.
3. **Productos:** dos tablas, por beneficio absoluto y por margen %, con referencia, descripción, unidades, importe, coste, beneficio y margen % (sin impuestos).
4. **Familias:** tabla por familia (sin impuestos).
5. **Facturas por debajo de coste:** código, fecha, cliente, agente, total, coste y pérdida.
6. **Recomendaciones:** por ejemplo, revisar precios o descuentos de los clientes y productos con margen bajo, investigar las facturas con pérdidas o corregir costes a 0.
7. **Notas sobre los datos:** ejercicio, base de cada tabla y limitaciones.

## Cómo actuar en el ERP

- El precio de coste vive en cada variante del producto y puede actualizarse solo con cada compra si se elige una política de precios de coste en el **Panel de control** (`politicas-de-precios-de-coste`, `las-variantes-de-productos`).
- Los precios de venta y las tarifas por cliente o grupo se explican en `los-precios-del-producto` y `las-tarifas-de-precios-por-clientes-o-grupos`.

## Limitaciones

- Todo el beneficio depende del coste registrado en el momento de la venta: si los costes están vacíos o desactualizados, los márgenes no son fiables.
- Las facturas rectificativas restan importe y beneficio en su ejercicio.
- `get_ventas_por_familia` asigna la familia buscando la referencia de la línea entre las referencias de los productos. Las líneas de variantes con referencia propia y las líneas sin referencia caen en "(sin familia)": si ese grupo es grande, avísalo.
- No hay herramienta de beneficio por agente con base imponible; `get_ventas_por_agente` da total y beneficio con impuestos.
