---
name: estado-sat
description: "Analiza en FacturaScripts, mediante fs-mcp y el plugin Servicios, la situación del servicio técnico (SAT): servicios abiertos por antigüedad y prioridad, tiempos de resolución, carga y horas por técnico, trabajos pendientes de facturar y máquinas con más incidencias."
---

# Estado del servicio técnico (SAT)

Genera un informe del plugin **Servicios**: qué servicios siguen abiertos y desde cuándo, quién los tiene asignados, cuántas horas se han trabajado, qué trabajo hecho falta por facturar y qué máquinas o clientes concentran más incidencias.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Requisito

Las herramientas `*_at` solo funcionan si el plugin **Servicios** está activo en la instalación; si no lo está, devuelven un error que lo indica. En ese caso, detén el informe y explícalo.

## Datos que puedes pedir (opcionales)

- **Periodo** para la actividad (servicios entrados y horas). Por defecto, el último mes completo. Los servicios abiertos y los trabajos pendientes se miran siempre a fecha de hoy, sin periodo.
- **Filtro** por técnico (`asignado` o `nick`), agente (`codagente`), cliente (`codcliente`), tipo (`idtipo`) o almacén (`codalmacen`).
- **Antigüedad mínima** para destacar un servicio abierto. Por defecto, 15 días.

## Definiciones

- **Servicio abierto:** su estado es editable. Los estados, las prioridades y los tipos los configura cada empresa.
- **Días abierto:** días desde la fecha del servicio hasta hoy.
- **Tiempo de resolución:** días desde la fecha y hora del servicio hasta su último paso a un estado cerrado. El plugin no guarda la fecha de cierre, así que se obtiene del historial (`get_tiempos_resolucion_at`); los servicios cerrados sin ese cambio en el historial (por ejemplo, creados ya cerrados o importados) se cuentan aparte.
- **Importes:** el neto del servicio y el importe de los trabajos (precio × cantidad) son **sin impuestos**.
- **Horas:** se calculan con las fechas y horas de inicio y fin de cada trabajo. Los trabajos sin hora de fin no suman horas y se cuentan aparte.

## Procedimiento

1. **Conexión.** Elige la conexión según el perfil.
2. **Servicios abiertos.** `get_servicios_at_pendientes` con los filtros y un `limit` suficiente (los totales cuentan todos). Devuelve los servicios de más antiguo a más reciente con días abiertos, estado, prioridad, asignado e importe, y el recuento por asignado y por estado. Clasifícalos por antigüedad: hasta 7 días, de 8 a 30, de 31 a 90 y más de 90.
3. **Actividad del periodo.** `get_informe_servicios_at` con el periodo y los filtros: servicios entrados, abiertos y cerrados, neto total y medio, y desgloses por estado, prioridad, tipo, asignado, agente, mes y principales clientes.
4. **Horas trabajadas.** `get_horas_trabajos_at` con el mismo periodo: horas, trabajos, servicios e importe por usuario y por agente, y los trabajos sin hora de fin.
5. **Trabajo pendiente de facturar.** `get_trabajos_at_pendientes` con `excluir_sin_precio = true`: trabajos con precio marcados para facturar, hacer albarán o hacer presupuesto que aún no se han generado, con el importe por acción y por cliente. Señala los que pertenecen a servicios ya cerrados. `resumen.trabajos_sin_precio` dice cuántos trabajos tienen la acción pero precio 0: suelen ser registros de horas que han tomado la acción por defecto del plugin, no dinero pendiente. El detalle se limita a los 20 servicios de más importe, con hasta 10 trabajos cada uno; los totales cuentan todos.
6. **Tiempos de resolución.** `get_tiempos_resolucion_at` con el periodo (por defecto, los últimos 90 días) y los mismos filtros de técnico, cliente, prioridad o tipo: servicios cerrados, días medios y mediana hasta el cierre, reparto por tramos (hasta 1 día, 2 a 7, 8 a 30 y más de 30), por prioridad, tipo, asignado y mes, y los 10 más lentos. Usa la mediana para comparar, porque unos pocos servicios muy largos inflan la media.
7. **Máquinas con más incidencias** (opcional). Obtén los servicios del periodo con `get_servicios_at` y `fecha_gte`/`fecha_lte`, recorriendo `offset`, y cuenta cuántas veces aparece cada máquina en `idmaquina`, `idmaquina2`, `idmaquina3` e `idmaquina4`. Para las 5 que más se repiten, obtén su nombre, número de serie y cliente con `get_maquinas_at` y su historial completo con `get_historial_maquina_at`.
8. **Detalle** (si el usuario pregunta por un servicio). `get_servicio_at` con su id o código trae trabajos, máquinas, checklist, documentos generados e historial.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** servicios abiertos y su importe, días medios abiertos, servicios entrados en el periodo, mediana de días hasta el cierre, horas trabajadas e importe de trabajos pendientes de facturar.
2. **Servicios abiertos por antigüedad:** tabla por tramos y lista de los que superan la antigüedad mínima, con código, cliente, estado, prioridad, asignado, días abiertos e importe.
3. **Carga por técnico:** tabla con servicios abiertos asignados, servicios entrados en el periodo, horas trabajadas, importe de sus trabajos y trabajos sin hora de fin. Señala los servicios abiertos sin asignar.
4. **Actividad del periodo:** desglose por tipo, prioridad y mes, y principales clientes.
5. **Pendiente de facturar:** importe por acción (facturar, albarán, presupuesto) y por cliente, destacando los de servicios ya cerrados, y número de trabajos sin precio.
6. **Tiempos de resolución:** media y mediana, tramos, tabla por prioridad, tipo y técnico, y los servicios más lentos.
7. **Máquinas con más incidencias:** si se ha hecho el paso 7.
8. **Recomendaciones:** por ejemplo, revisar los servicios abiertos más antiguos o de prioridad alta, generar los documentos de los trabajos pendientes, completar las horas de fin de los trabajos o revisar las máquinas reincidentes con su cliente.
9. **Notas sobre los datos:** fecha de corte, periodo, base de los importes (sin impuestos) y limitaciones.

## Cómo actuar en el ERP

- Los servicios se gestionan desde su listado; los estados, prioridades, tipos y la checklist se configuran en el propio plugin (ficha `Servicios`).
- Los presupuestos, albaranes y facturas de los trabajos se generan desde la ficha del servicio, en la pestaña correspondiente, con el botón de la varita mágica (ficha `Servicios`), o con `create_documento_servicio_at` de fs-mcp (plugin Servicios 4.42 o posterior). Confirma antes con el usuario.

## Limitaciones

- Los tiempos de resolución dependen del historial: si se borra o el servicio se creó ya cerrado, no se pueden calcular. El plugin no define plazos por prioridad, así que no hay un cumplimiento de SLA que medir: compara la mediana de cada prioridad.
- Las horas dependen de que los técnicos registren el inicio y el fin de cada trabajo.
- Si un servicio se cierra sin generar los documentos de sus trabajos, ese trabajo queda sin facturar: por eso conviene revisar el apartado de pendientes aunque el servicio esté cerrado.
