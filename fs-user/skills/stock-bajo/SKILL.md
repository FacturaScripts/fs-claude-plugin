---
name: stock-bajo
description: "Detecta en FacturaScripts, mediante fs-mcp, las variantes con stock disponible por debajo de su stock mínimo en cada almacén y genera alertas de reposición priorizadas, teniendo en cuenta lo reservado y lo pendiente de recibir."
---

# Stock bajo mínimos

Genera una lista de reposición a partir del stock mínimo configurado. En FacturaScripts el stock se lleva **por variante y almacén**, y cada registro tiene cuatro cantidades: cantidad física, reservada (pedidos de cliente), pendiente de recepción (pedidos a proveedor) y disponible (cantidad menos reservada). El stock mínimo y el máximo se fijan por variante y almacén (`el-stock-de-productos`).

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión y paginación son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que puedes pedir (opcionales)

- **Almacén:** uno concreto o todos (predeterminado).
- **Orden:** por urgencia (predeterminado), referencia o cobertura.
- **Objetivo de reposición:** hasta el stock máximo (predeterminado cuando existe) o hasta el mínimo.

## Definiciones

- **Registro analizable:** registro de stock con `stockmin > 0` de un producto que controla stock (`nostock = false`) y no está bloqueado (`bloqueado = false`).
- **Stock proyectado:** `disponible + pterecibir`.
- **Bajo mínimos:** stock proyectado menor que `stockmin`.
- **Cantidad sugerida:** `stockmax − stock proyectado` si `stockmax > stockmin`; en otro caso, `stockmin − stock proyectado`. Si el resultado es negativo, no sugieras compra.
- **Urgencia:**
  - **Crítica:** `disponible ≤ 0`. El disponible puede ser negativo si el producto permite la venta sin stock.
  - **Alta:** `disponible` por debajo del 50 % del `stockmin`.
  - **Media:** el resto de los registros bajo mínimos.
  - Si un registro tiene `disponible < stockmin` pero lo pendiente de recibir ya lo cubre, no es una alerta: inclúyelo en la sección **cubierto por pedidos en curso**.

## Procedimiento

1. **Conexión y almacenes.** Elige la conexión según el perfil y obtén los almacenes con `get_almacenes`.
2. **Stock.** Obtén todos los registros con `get_stocks` (filtrando por `codalmacen` si el usuario lo pide), recorriendo `offset`. Cada registro incluye `referencia` (de la variante), `idproducto`, `codalmacen`, `cantidad`, `reservada`, `pterecibir`, `disponible`, `stockmin` y `stockmax`.
   No uses `get_productos_bajo_stock` para esta skill: compara la cantidad con un umbral global y no con el `stockmin` de cada registro.
3. **Productos.** Para los registros con `stockmin > 0`, obtén con `get_productos` la `descripcion`, `nostock`, `bloqueado`, `secompra` y `codfamilia`. Descarta los que no controlan stock o están bloqueados.
4. **Clasificación.** Aplica las definiciones y calcula la cantidad sugerida de cada registro bajo mínimos.
5. **Proveedores y coste** (opcional). Con `get_productoproveedores` (por `referencia`), indica el proveedor y el último precio de compra registrado. Si no lo hay, usa el `coste` de la variante (`get_variantes`). Estima el importe de reposición y avisa si faltan precios.
6. **Configuración incompleta.** Cuenta los registros de productos con control de stock que tienen `stockmin = 0`: no se pueden evaluar y conviene configurarlos.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen:** registros bajo mínimos por urgencia, unidades sugeridas, importe estimado de reposición y almacenes afectados.
2. **Reposición necesaria:** tabla con referencia, descripción, almacén, cantidad, reservada, pendiente de recibir, disponible, mínimo, máximo, cantidad sugerida, urgencia y proveedor habitual. Cada variante va en su propia fila.
3. **Cubierto por pedidos en curso:** registros cuya reposición ya está pedida.
4. **Configuración pendiente:** número de productos sin stock mínimo y ejemplos.
5. **Recomendaciones:** agrupar las compras por proveedor, revisar los mínimos de los productos que caen a menudo en urgencia crítica y, si hay varios almacenes, valorar redistribuir existencias entre ellos.
6. **Notas sobre los datos:** fecha de corte, número de registros analizados y limitaciones.

## Cómo actuar en el ERP

- El stock de cada producto está en **Almacén → Productos**, pestaña **Stock**, donde se fijan el mínimo, el máximo y la ubicación por variante y almacén (`el-stock-de-productos`).
- Para reponer, crea un pedido desde **Compras → Pedidos** y selecciona el proveedor. El ERP propone el último precio de compra registrado para ese proveedor y producto (`como-registrar-un-pedido-de-compra`, `menu-compras`).
- Con los estados predeterminados, el pedido a proveedor suma a **pendiente de recepción**, y el albarán o la factura de compra suman a la cantidad física (`el-stock-de-productos`, `menu-compras`).
- Si el stock no cuadra con lo esperado, revisa el campo **Actualizar stock** de los estados del documento (`estados-del-documento-680`).
- El core no genera pedidos ni avisos automáticos de reposición, ni mueve stock entre almacenes. Existen plugins para ello, como **IePedidoBajoMinimos** (añade al pedido de compra los productos bajo mínimos; requiere StockAvanzado), **EasyPurchase** (propone pedidos y calcula mínimos y máximos) y **StockAvanzado** (transferencias entre almacenes, movimientos e inventario). Preséntalos como opcionales y con los datos de su ficha.

## Limitaciones

- Solo se evalúan los registros con stock mínimo configurado.
- La cantidad sugerida no predice la demanda futura. Para estimar la cobertura, `get_rotacion_stock` relaciona las ventas recientes con el stock actual.
- Para productos sin venta o con exceso de stock, usa `get_stock_muerto` o `get_productos_sobrestock` desde [`crear-informe`](../crear-informe/SKILL.md). No los mezcles con esta lista de reposición.
