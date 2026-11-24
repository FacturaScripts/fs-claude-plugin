---
name: estado-sat
description: "Analiza en FacturaScripts, mediante fs-mcp y el plugin Servicios, la situación del servicio técnico (SAT): servicios abiertos por antigüedad y prioridad, carga y horas por técnico, trabajos pendientes de facturar y máquinas con más incidencias."
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
- **Días abierto:** días desde la fecha del servicio hasta hoy. El plugin no guarda una fecha de cierre, así que no se puede calcular el tiempo medio de resolución de los servicios cerrados; para uno concreto, el historial de `get_servicio_at` muestra cuándo cambió de estado.
- **Importes:** el neto del servicio y el importe de los trabajos (precio × cantidad) son **sin impuestos**.
- **Horas:** se calculan con las fechas y horas de inicio y fin de cada trabajo. Los trabajos sin hora de fin no suman horas y se cuentan aparte.

## Procedimiento

1. **Conexión.** Elige la conexión según el perfil.
2. **Servicios abiertos.** `get_servicios_at_pendientes` con los filtros y un `limit` suficiente (los totales cuentan todos). Devuelve los servicios de más antiguo a más reciente con días abiertos, estado, prioridad, asignado e importe, y el recuento por asignado y por estado. Clasifícalos por antigüedad: hasta 7 días, de 8 a 30, de 31 a 90 y más de 90.
3. **Actividad del periodo.** `get_informe_servicios_at` con el periodo y los filtros: servicios entrados, abiertos y cerrados, neto total y medio, y desgloses por estado, prioridad, tipo, asignado, agente, mes y principales clientes.
4. **Horas trabajadas.** `get_horas_trabajos_at` con el mismo periodo: horas, trabajos, servicios e importe por usuario y por agente, y los trabajos sin hora de fin.
5. **Trabajo pendiente de facturar.** `get_trabajos_at_pendientes` sin filtro de acción: trabajos marcados para facturar, hacer albarán o hacer presupuesto que aún no se han generado, con el importe por acción y por cliente. Señala los que pertenecen a servicios ya cerrados. Cuenta aparte los trabajos con importe 0: suelen ser registros de horas sin precio que han tomado la acción por defecto del plugin, no dinero pendiente. Si hay muchos trabajos, usa el `resumen` de la herramienta y, si la respuesta es demasiado grande, repite la consulta por cliente o por acción.
6. **Máquinas con más incidencias** (opcional). Obtén los servicios del periodo con `get_servicios_at` y `fecha_gte`/`fecha_lte`, recorriendo `offset`, y cuenta cuántas veces aparece cada máquina en `idmaquina`, `idmaquina2`, `idmaquina3` e `idmaquina4`. Para las 5 que más se repiten, obtén su nombre, número de serie y cliente con `get_maquinas_at` y su historial completo con `get_historial_maquina_at`.
7. **Detalle** (si el usuario pregunta por un servicio). `get_servicio_at` con su id o código trae trabajos, máquinas, checklist, documentos generados e historial.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** servicios abiertos y su importe, días medios abiertos, servicios entrados en el periodo, horas trabajadas e importe de trabajos pendientes de facturar.
2. **Servicios abiertos por antigüedad:** tabla por tramos y lista de los que superan la antigüedad mínima, con código, cliente, estado, prioridad, asignado, días abiertos e importe.
3. **Carga por técnico:** tabla con servicios abiertos asignados, servicios entrados en el periodo, horas trabajadas, importe de sus trabajos y trabajos sin hora de fin. Señala los servicios abiertos sin asignar.
4. **Actividad del periodo:** desglose por tipo, prioridad y mes, y principales clientes.
5. **Pendiente de facturar:** importe por acción (facturar, albarán, presupuesto) y por cliente, destacando los de servicios ya cerrados.
6. **Máquinas con más incidencias:** si se ha hecho el paso 6.
7. **Recomendaciones:** por ejemplo, revisar los servicios abiertos más antiguos o de prioridad alta, generar los documentos de los trabajos pendientes, completar las horas de fin de los trabajos o revisar las máquinas reincidentes con su cliente.
8. **Notas sobre los datos:** fecha de corte, periodo, base de los importes (sin impuestos) y limitaciones.

## Cómo actuar en el ERP

- Los servicios se gestionan desde su listado; los estados, prioridades, tipos y la checklist se configuran en el propio plugin (ficha `Servicios`).
- Los presupuestos, albaranes y facturas de los trabajos se generan desde la ficha del servicio, en la pestaña correspondiente, con el botón de la varita mágica (ficha `Servicios`).

## Limitaciones

- Sin fecha de cierre no hay tiempos de resolución ni cumplimiento de plazos por prioridad: solo la antigüedad de lo que sigue abierto.
- Las horas dependen de que los técnicos registren el inicio y el fin de cada trabajo.
- Si un servicio se cierra sin generar los documentos de sus trabajos, ese trabajo queda sin facturar: por eso conviene revisar el apartado de pendientes aunque el servicio esté cerrado.
