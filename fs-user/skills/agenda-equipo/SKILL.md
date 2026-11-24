---
name: agenda-equipo
description: "Prepara en FacturaScripts, mediante fs-mcp, la agenda de trabajo de una persona o de todo el equipo: avisos y oportunidades del CRM, tareas de proyecto vencidas o próximas, servicios SAT asignados y presupuestos pendientes, según los plugins activos."
---

# Agenda del equipo

Genera, para un usuario o para todo el equipo, la lista de lo que tiene pendiente y lo que vence pronto, reuniendo en un solo informe la información que está repartida entre el CRM, los proyectos, el servicio técnico y las ventas. Es útil como repaso semanal o para preparar una reunión de equipo.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación y fechas son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Requisitos

Cada bloque depende de un plugin: CRM, **Proyectos** y **Servicios**. Si una herramienta devuelve un error de plugin no activo, omite ese bloque sin detener el informe y menciónalo en las notas. El bloque de presupuestos es del core y siempre está disponible. Si ninguno de los tres plugins está activo, avisa de que la agenda se limitará a los presupuestos pendientes y pregunta si sigue interesando.

## Datos que puedes pedir (opcionales)

- **Persona:** el usuario (`nick`) de FacturaScripts. Por defecto, todo el equipo agrupado por usuario. Si el usuario da un nombre, búscalo en `get_users` para obtener su `nick`.
- **Horizonte** para lo que vence pronto. Por defecto, 7 días.
- **Días sin actividad** para considerar olvidada una oportunidad. Por defecto, 30.

## Usuarios y agentes

Los plugins asignan el trabajo a **usuarios** (`nick` o `asignado`), mientras que los documentos de venta del core se asignan a **agentes** (`codagente`). Para unir ambos, obtén con `get_users` el `codagente` de cada usuario. Lo que tenga un agente sin usuario vinculado va en un apartado "Sin usuario asignado".

## Procedimiento

1. **Conexión y usuarios.** Elige la conexión según el perfil y obtén los usuarios con `get_users` (`nick`, nombre si lo tiene y `codagente`).
2. **CRM** (plugin CRM).
   - `get_avisos_crm` con `fecha_hasta` = hoy + horizonte (y `nick` si es una persona): recordatorios vencidos sin notificar y próximos, con contacto y oportunidad. Los avisos marcados para todos (`paratodos`) van en un apartado común.
   - `get_oportunidades_crm_sin_actividad` con los días elegidos (y `asignado` si es una persona): oportunidades olvidadas con su importe.
3. **Proyectos** (plugin Proyectos).
   - `get_tareas_proyecto_vencidas` (con `nick` si es una persona): tareas con la fecha de fin pasada, con días de retraso.
   - **Tareas que vencen pronto:** `get_tareas_proyecto` con `fechafin_gte` = hoy y `fechafin_lte` = hoy + horizonte (y `nick`), recorriendo `offset`. Descarta las que estén en una fase de tipo completada o cancelada; los tipos de cada fase están en `get_fases_tarea`.
4. **Servicio técnico** (plugin Servicios).
   - `get_servicios_at_pendientes` (con `asignado` si es una persona): servicios abiertos con días abiertos, estado y prioridad. Los que no tienen asignado van en el apartado "Sin usuario asignado".
5. **Presupuestos** (core). `get_presupuestos_pendientes`: presupuestos sin convertir con su agente, importe (con impuestos) y fecha de fin de oferta. Destaca los vencidos y los que vencen dentro del horizonte, y asígnalos al usuario mediante su `codagente`.
6. **Agrupación.** Junta todo por usuario. Ordena dentro de cada uno: primero lo vencido, después lo que vence dentro del horizonte y por último lo demás.

## Informe

Usa el formato de informe del perfil. Si es para una persona, omite la tabla de equipo.

1. **Resumen del equipo:** tabla con una fila por usuario y columnas de avisos vencidos, oportunidades olvidadas, tareas vencidas, tareas que vencen pronto, servicios abiertos y presupuestos que vencen pronto. Señala quién acumula más pendientes.
2. **Agenda por persona:** para cada usuario, una lista breve con tres apartados:
   - **Vencido:** avisos del CRM, tareas y presupuestos con la fecha pasada, y servicios abiertos más antiguos de lo habitual.
   - **Esta semana** (o el horizonte elegido): avisos, tareas y presupuestos que vencen.
   - **Seguimiento:** oportunidades olvidadas de mayor importe.
   Cada línea indica qué es, a quién afecta (cliente, contacto o proyecto) y la fecha o los días.
3. **Sin usuario asignado:** servicios, avisos comunes y documentos de agentes sin usuario.
4. **Recomendaciones:** por ejemplo, repartir el trabajo de quien tenga más pendientes, asignar los servicios sin técnico o cerrar las oportunidades olvidadas que ya no siguen vivas.
5. **Notas sobre los datos:** fecha de corte, horizonte, bloques omitidos por no tener el plugin activo y limitaciones.

## Limitaciones

- La agenda solo refleja lo registrado en el ERP con fecha y usuario. Las tareas sin fecha de fin, los avisos sin fecha y los servicios sin asignar no se pueden repartir por persona.
- Si un usuario no tiene agente vinculado, sus presupuestos no se le pueden atribuir.
- Este informe es de solo lectura: no marca avisos como notificados ni cambia estados.
