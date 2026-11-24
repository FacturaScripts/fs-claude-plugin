---
name: rentabilidad-proyectos
description: "Analiza en FacturaScripts, mediante fs-mcp y el plugin Proyectos, la rentabilidad y el avance de los proyectos: ventas, compras y margen por proyecto, cliente y responsable, lo pendiente de facturar, proyectos con pérdidas o retrasados y tareas vencidas."
---

# Rentabilidad y avance de proyectos

Genera un informe de los proyectos del plugin **Proyectos**: cuánto se ha vendido y comprado en cada uno, qué margen deja, qué queda por facturar y qué proyectos o tareas van con retraso.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Requisito

Las herramientas de proyectos solo funcionan si el plugin **Proyectos** está activo en la instalación; si no lo está, devuelven un error que lo indica. En ese caso, detén el informe y explícalo.

## Datos que puedes pedir (opcionales)

- **Alcance:** proyectos abiertos (predeterminado), cerrados o todos (`editable`).
- **Periodo** por fecha de alta del proyecto. Por defecto, sin límite.
- **Filtro** por cliente (`codcliente`), responsable (`nick`), estado (`idestado`) o empresa (`idempresa`).
- **Proyecto concreto:** si el usuario pregunta por uno, ve directamente al paso 6.

## Cómo calcula el plugin los importes

Explícalo en las notas del informe, porque cambia la lectura de las cifras:

- **Ventas** (`totalventas`) y **compras** (`totalcompras`) son importes **con impuestos** de los documentos vinculados al proyecto. Las ventas suman presupuestos, pedidos, albaranes y facturas de cliente, sin duplicar lo que ya se ha convertido en otro documento: un presupuesto aún no aceptado cuenta ya como venta del proyecto. Las compras suman pedidos, albaranes y facturas de proveedor.
- **Margen** = ventas − compras, y **margen %** = margen / ventas. No incluye horas de trabajo ni costes que no se hayan registrado como documento de compra vinculado al proyecto.
- **Pendiente de facturar** (`totalpendientefacturar`) es el neto **sin impuestos** de los presupuestos, pedidos y albaranes de venta del proyecto que aún no se han facturado.
- No mezcles en una misma columna ni en un mismo porcentaje el pendiente (sin impuestos) con las ventas o el margen (con impuestos).

## Procedimiento

1. **Conexión.** Elige la conexión según el perfil.
2. **Visión general.** Llama a `get_informe_proyectos` con el alcance, el periodo y los filtros. Devuelve el resumen (total, abiertos, cerrados, ventas, compras, margen y pendiente), desgloses por estado, cliente, responsable y mes, y los rankings `top_ventas`, `top_margen` y `margen_negativo`.
3. **Rentabilidad por proyecto.** Llama a `get_rentabilidad_proyectos` con los mismos filtros, `solo_con_movimientos = true` y el orden que pida el usuario (por defecto `margen`). Sube `limit` si hay más proyectos que los 50 predeterminados; los totales cuentan siempre todos.
4. **Alertas económicas.** A partir del paso 3, señala:
   - proyectos con **margen negativo**;
   - proyectos con **compras y sin ventas** (gasto aún sin repercutir al cliente);
   - proyectos con **ventas y sin compras**, que pueden tener costes sin registrar en el proyecto;
   - proyectos **cerrados con pendiente de facturar** mayor que 0: trabajo terminado sin facturar.
5. **Avance y plazos.**
   - `get_tareas_proyecto_vencidas`: tareas no completadas ni canceladas con la fecha de fin pasada, por usuario y por proyecto.
   - `get_informe_tareas_proyecto` (con el mismo periodo, si lo hay): tareas abiertas, completadas y vencidas, carga de trabajo por usuario y días medios hasta completarlas.
   - Proyectos abiertos con la fecha de fin ya pasada: `get_proyectos` con `editable = true` y `fechafin_lte` igual a hoy, recorriendo `offset`.
6. **Detalle de un proyecto** (si se pide o para los 3 proyectos con peor margen). `get_proyecto` trae totales, tareas por fase, usuarios, notas, stock, documentos por tipo y los servicios SAT vinculados si el plugin Servicios está activo. Para ver los documentos concretos, usa `get_documentos_proyecto`.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** número de proyectos (abiertos y cerrados), ventas, compras, margen y margen %, pendiente de facturar y número de proyectos con pérdidas y con retraso.
2. **Rentabilidad por proyecto:** tabla con proyecto, cliente, responsable, estado, ventas, compras, margen y margen %. Añade el pendiente de facturar en una columna aparte, rotulada como sin impuestos.
3. **Por cliente y por responsable:** tablas resumidas con ventas, margen y pendiente.
4. **Alertas:** las del paso 4, cada una con sus proyectos e importes.
5. **Plazos:** proyectos abiertos fuera de plazo, tareas vencidas por usuario (con el retraso medio) y carga de trabajo abierta por usuario.
6. **Recomendaciones:** por ejemplo, facturar lo pendiente de los proyectos cerrados, revisar el presupuesto de los proyectos con pérdidas o redistribuir tareas de los usuarios más cargados.
7. **Notas sobre los datos:** base de cada importe (apartado anterior), alcance y periodo, y limitaciones.

## Cómo actuar en el ERP

- Los proyectos, sus tareas y notas se gestionan desde su listado; los estados de proyecto y las fases de tarea se configuran en **Administrador → Proyectos** (ficha `Proyectos`).
- Para que un documento cuente en un proyecto, hay que vincularlo desde el propio documento o desde la ficha del proyecto. El plugin recalcula los totales al guardar el documento.

## Limitaciones

- El margen solo es fiable si todas las compras y gastos del proyecto se vinculan a él. Las horas del personal no cuentan salvo que se registren como compras.
- Como las ventas incluyen presupuestos no aceptados, un proyecto recién presupuestado muestra ventas y margen que aún no son reales. Si importa distinguirlo, revisa sus documentos con `get_documentos_proyecto`.
