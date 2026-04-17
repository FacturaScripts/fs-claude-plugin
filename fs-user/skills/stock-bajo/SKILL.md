# Stock Bajo

name: stock-bajo
description: Identifica productos con stock por debajo del mínimo y genera alertas de reposición

## Descripción

Este skill detecta automáticamente:
- Productos con stock actual < stock mínimo
- Cuánta cantidad falta
- Recomendación de reorden
- Productos sin movimiento (sin venta)

Esencial para gestión de inventario y evitar roturas de stock.

## Cómo usar

1. Activa el skill: `/stock-bajo`
2. Responde (opcional):
   - **¿Incluir solo productos sin venta?** Sí/No
   - **Almacén específico o todos?** (si tienes múltiples)
   - **Ordenar por:** Urgencia, Referencia, Stock

3. Recibirás tabla con productos a reponer

## Lo que necesita

- Conexión activa a FacturaScripts vía fs-mcp
- Productos configurados con stock mínimo
- Almacenes registrados

## Información que obtendrás

### Tabla de productos bajo stock
Columnas:
- **Referencia:** Código único del producto
- **Descripción:** Nombre comercial
- **Stock actual:** Cantidad en almacén ahora
- **Stock mínimo:** Cantidad configurada como mínimo
- **Falta:** Cuántas unidades ordenar para llegar a mínimo
- **Almacén:** Dónde está el problema

### Productos sin venta
Apartado separado con:
- Productos que nunca se vendieron
- Productos sin movimiento hace > X meses
- Recomendación: ¿Descatar? ¿Promocionar?

### Resumen de acción
- Total productos bajo stock
- Total unidades faltantes
- Urgencia: Cuántos son CRÍTICO (0 unidades)
- Gasto estimado de reposición (si tienes costos)

## Categorización por urgencia

- 🔴 **CRÍTICO:** Stock = 0 (sin existencias)
- 🟠 **ALTO:** Stock < 50% mínimo
- 🟡 **MEDIO:** Stock entre 50-100% mínimo
- 🟢 **OK:** Monitoreo regular

## Cómo interpretar

### "Falta" (Quantity to Order)
Diferencia entre stock mínimo y stock actual.
Ejemplo: Mínimo 100, Actual 30 → Falta 70

**Acción:** Ordena al proveedor esa cantidad (o más).

### Productos sin venta
No aparecen en facturas de cliente. Opciones:
- **Mantener:** Repuestos o productos lentamente movibles
- **Promocionar:** Hacer oferta para mover stock
- **Descartar:** Si obsoleto, eliminar para liberar capital

### Stock en múltiples almacenes
Si tienes varios almacenes:
- Verás por almacén dónde hay faltante
- Opción: Trasladar entre almacenes
- Opción: Ordenar solo donde hace falta

## Estrategia de reposición

### Paso 1: Priorizar por urgencia
1. Repone CRÍTICOS (stock = 0) inmediatamente
2. Repone ALTO en siguiente orden
3. MEDIO según disponibilidad de caja

### Paso 2: Crear orden de compra
Usa esta información para generar **Pedido a proveedor**:
1. Ve a **Compras > Pedidos de proveedores**
2. Crea pedido con las cantidades recomendadas
3. FacturaScripts sugiere proveedor y precio

### Paso 3: Monitorear recepción
Cuando llega la mercancía:
1. Recíbela en **Albarán de proveedor**
2. Stock se actualiza automáticamente
3. Retirado de lista de "bajo stock"

## Productos relacionados

### Familias de bajo stock
Si una familia completa está baja (ej: "Camisetas rojas talla M, L, XL"):
- **Consideración:** ¿Es patrón de venta? ¿Tendencia?
- **Acción:** Compra al mayorista para todo el rango

### Variantes
Si tienes variantes de producto (colores, tallas):
- El skill muestra cada variante por separado
- Cada una tiene su stock mínimo configurado

## Limitaciones

- Solo detecta productos con stock mínimo configurado
- Requiere que almacenes estén registrados
- No predice demanda futura

## Consejos

💡 Configura stock mínimo realista:
- Para productos de venta rápida: stock mínimo = 1-2 semanas de venta
- Para lentos: stock mínimo = stock de seguridad

💡 Ejecuta este skill semanalmente

💡 Combina con datos de proveedores:
- Si proveedor tarda 2 semanas → sube stock mínimo
- Si proveedor es rápido → baja stock mínimo

💡 Exporta a Excel para compartir con almacén

💡 Usa alertas automáticas para CRÍTICOS

## Acciones por tipo de producto

### Productos de venta alta
Reposición frecuente y cantidades grandes:
- **Ejemplo:** Botella de agua
- **Acción:** Orden semanal, stock mínimo alto

### Productos lentos
Reposición ocasional:
- **Ejemplo:** Equipo especial
- **Acción:** Orden bajo demanda, stock mínimo bajo

### Productos estacionales
Varían según temporada:
- **Ejemplo:** Ropa de invierno
- **Acción:** Sube mínimo en otoño/invierno, baja primavera

### Productos sin venta
- **Evaluación:** ¿Es necesario mantener?
- **Acción:** Considera descartar o promocionar
