---
name: pendiente-facturar
description: "Localiza en FacturaScripts, mediante fs-mcp, todo lo vendido o trabajado que aún no se ha facturado: albaranes sin facturar, pedidos sin servir y, si están activos los plugins Servicios y Proyectos, trabajos SAT y proyectos pendientes de facturar."
---

# Pendiente de facturar

Genera una lista de los ingresos que la empresa ya ha ganado (o comprometido) y todavía no ha facturado, para que no se queden olvidados. Combina los documentos de venta del core con el trabajo pendiente de los plugins **Servicios** y **Proyectos** cuando están activos.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que puedes pedir (opcionales)

- **Cliente** concreto (`codcliente`). Por defecto, todos.
- **Antigüedad mínima** para destacar un documento. Por defecto, 30 días.
- **Incluir presupuestos** pendientes como cartera comercial. Por defecto, no: un presupuesto aún no es una venta.

## Orígenes y bases de cálculo

Cada origen usa una base distinta. **No sumes importes de bases distintas** en un mismo total; da un subtotal por base y dilo en las notas.

| Origen | Herramienta | Qué es | Base |
|---|---|---|---|
| Albaranes sin facturar | `get_albaranes_pendientes_facturar` | Mercancía o trabajo entregado (albarán editable) | Con impuestos (`total`) |
| Pedidos sin servir | `get_pedidos_pendientes_servir` | Ventas confirmadas aún sin albarán ni factura | Con impuestos (`total`) |
| Trabajos SAT pendientes | `get_trabajos_at_pendientes` (plugin Servicios) | Trabajos marcados para facturar, albaranar o presupuestar sin documento generado | Sin impuestos (precio × cantidad) |
| Proyectos con pendiente | `get_rentabilidad_proyectos` con `orden = pendiente` (plugin Proyectos) | Presupuestos, pedidos y albaranes del proyecto sin facturar | Sin impuestos (neto) |
| Presupuestos (opcional) | `get_presupuestos_pendientes` | Ofertas sin convertir; marca las vencidas | Con impuestos (`total`) |

**Solapamientos:**

- El pendiente de un proyecto está formado por presupuestos, pedidos y albaranes que **ya aparecen** en las listas del core si están vinculados a él. Preséntalo como "de lo anterior, vinculado a proyectos", nunca como un importe adicional.
- Los trabajos SAT pendientes todavía no tienen documento, así que no se solapan con los albaranes ni con los pedidos. Los albaranes que ya se generaron desde un servicio aparecen como albaranes sin facturar.

## Procedimiento

1. **Conexión.** Elige la conexión según el perfil. Lanza las consultas de los pasos siguientes una detrás de otra, no todas a la vez: cada una recorre todos los registros y, juntas, pueden superar el límite de peticiones por minuto de la API (error 429).
2. **Albaranes y pedidos.** Llama a `get_albaranes_pendientes_facturar` y a `get_pedidos_pendientes_servir`. Ambos recorren todos los documentos editables y devuelven el detalle con cliente, fecha, importe y días transcurridos. Filtra por cliente si se ha pedido y clasifica por antigüedad: hasta 30 días, de 31 a 90 y más de 90.
3. **Trabajos SAT.** Llama a `get_trabajos_at_pendientes` (sin filtro de acción, o con `codcliente`). Si devuelve un error de plugin no activo, omite este origen y menciónalo en las notas.
   - Separa los importes por acción: lo marcado para **factura** y **albarán** es facturable; lo marcado para **presupuesto** es cartera. Señala los trabajos de servicios ya cerrados (`abierto = false`).
   - **Trabajos sin precio.** La acción de un trabajo nuevo la decide un ajuste del plugin, y en muchas instalaciones es "hacer factura" aunque el trabajo solo sirva para registrar horas, con precio 0. Cuenta aparte los trabajos con importe 0: no son dinero pendiente, sino trabajo que quizá debería haberse valorado. Si todos los trabajos pendientes tienen importe 0, dilo así en lugar de presentar el origen como "0 € pendientes".
   - **Volumen.** La herramienta devuelve todos los trabajos con su detalle y, en instalaciones con mucho SAT, la respuesta puede ser enorme. Usa sobre todo su `resumen` (`por_accion` y `por_cliente`) y lista solo los servicios con más importe. Si el resultado es demasiado grande para leerlo, repite la consulta por cliente (`codcliente`) o por acción (`accion`).
4. **Proyectos.** Llama a `get_rentabilidad_proyectos` con `orden = pendiente` y, si se ha pedido, `codcliente`. Quédate con los proyectos con pendiente mayor que 0 y separa los cerrados (`editable = false`), que son trabajo terminado sin facturar. Si el plugin no está activo, omite este origen y menciónalo.
5. **Presupuestos** (si se han pedido). `get_presupuestos_pendientes`: total, vencidos según su fecha de fin de oferta y reparto por agente.
6. **Agrupación por cliente.** Junta por `codcliente` los albaranes, pedidos y trabajos SAT, manteniendo las columnas de cada base separadas. Obtén el nombre de los clientes que no lo traigan con `get_clientes`.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** número e importe de albaranes sin facturar y de pedidos sin servir (con impuestos); importe de trabajos SAT facturables y de proyectos con pendiente (sin impuestos); y cuánto de todo ello tiene más de 90 días.
2. **Albaranes sin facturar:** tabla con código, cliente, fecha, días e importe, de más antiguo a más reciente.
3. **Pedidos sin servir:** misma tabla.
4. **Trabajos SAT pendientes:** por servicio (código, cliente, abierto o cerrado, acción, importe), destacando los de servicios cerrados.
5. **Proyectos con pendiente de facturar:** proyecto, cliente, estado (abierto o cerrado) e importe pendiente, como parte de lo anterior.
6. **Por cliente:** tabla con una columna por origen, de mayor a menor importe.
7. **Cartera** (si se ha pedido): presupuestos pendientes y trabajos SAT para presupuestar, con los vencidos aparte.
8. **Recomendaciones:** por ejemplo, facturar los albaranes de más de 30 días agrupados por cliente, generar los documentos de los trabajos de servicios cerrados, facturar los proyectos cerrados con pendiente, o anular los pedidos y presupuestos que ya no van a servirse.
9. **Notas sobre los datos:** fecha de corte, base de cada origen, solapamientos, orígenes omitidos por no tener el plugin activo y limitaciones.

## Cómo actuar en el ERP

- Varios albaranes de un mismo cliente se pueden agrupar en una sola factura (`como-agrupar-albaranes-en-una-sola-factura`); para facturar solo una parte, usa el asistente para agrupar o partir documentos (`el-asistente-para-agrupar-o-partir-documentos`).
- Los documentos de los trabajos SAT se generan desde la pestaña correspondiente de la ficha del servicio (ficha `Servicios`).
- Los documentos de un proyecto se ven en su ficha; al facturarlos, el plugin actualiza su pendiente (ficha `Proyectos`).

## Limitaciones

- Un albarán, pedido o presupuesto cuenta como pendiente mientras sea editable. Si se ha facturado fuera del ERP o se ha anulado sin cambiar su estado, seguirá apareciendo: avisa de los muy antiguos.
- Los trabajos SAT solo aparecen si se marcaron con una acción de facturación al registrarlos, y su importe solo es real si se registraron con precio.
- Este informe no incluye las facturas emitidas y no cobradas: para eso usa [`clientes-morosos`](../clientes-morosos/SKILL.md).
