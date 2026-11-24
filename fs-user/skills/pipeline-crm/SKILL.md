---
name: pipeline-crm
description: "Analiza en FacturaScripts, mediante fs-mcp y el plugin CRM, el embudo de oportunidades de un periodo: conversión por fuente, interés y comercial, oportunidades olvidadas, avisos pendientes y su paso a presupuesto y venta."
---

# Embudo comercial del CRM

Genera un informe del embudo de oportunidades (leads) del plugin **CRM**: cuántas entran, en qué estado están, cuántas se ganan o se pierden, de dónde vienen las que mejor convierten y cuáles necesitan seguimiento.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Requisito

Las herramientas `*_crm` solo funcionan si el plugin **CRM** está activo en la instalación; si no lo está, devuelven un error que lo indica. En ese caso, detén el informe, explícalo y, si el usuario quiere el embudo de documentos del core (presupuestos, pedidos y facturas), usa `get_funnel_ventas` mediante [`crear-informe`](../crear-informe/SKILL.md).

## Datos que puedes pedir (opcionales)

- **Periodo** por fecha de alta de la oportunidad. Por defecto, los últimos 90 días.
- **Filtro** por usuario asignado (`asignado`), agente (`codagente`), interés (`idinteres`) o fuente (`idfuente`).
- **Días sin actividad** para considerar una oportunidad olvidada. Por defecto, 30.

## Definiciones

- **Situación** de una oportunidad, según las marcas que toma de su estado: **abierta** si es editable; **ganada** si está cerrada y no está rechazada; **perdida** si está cerrada y rechazada. Los estados, sus marcas y su orden los configura cada empresa.
- **Conversión:** ganadas / (ganadas + perdidas). Las abiertas no cuentan, así que un periodo reciente con muchas abiertas puede mostrar una conversión alta sobre pocas oportunidades cerradas: indícalo.
- **Importe** de una oportunidad: el neto (sin impuestos, en la divisa principal) del presupuesto vinculado o, si no tiene, el importe aproximado que se escribió a mano. Señala qué parte del importe abierto es solo aproximada.
- **Oportunidad olvidada:** abierta y sin cambios ni notas en los últimos N días.

## Procedimiento

1. **Conexión.** Elige la conexión según el perfil.
2. **Embudo.** Llama a `get_informe_oportunidades_crm` con el periodo y los filtros. Devuelve:
   - `resumen`: total, abiertas, ganadas, perdidas, importes, conversión y `dias_medios_hasta_cierre`;
   - `embudo_por_estado` en el orden del embudo;
   - desgloses `por_fuente`, `por_interes`, `por_asignado`, `por_agente` y `por_mes`, cada uno con su conversión e importe ganado.
3. **Comparativa** (opcional). Repite el paso 2 con el periodo anterior de igual duración y calcula la variación de oportunidades nuevas, conversión e importe ganado. Si el periodo anterior no tiene oportunidades cerradas, indica "sin datos comparables".
4. **Seguimiento pendiente.**
   - `get_oportunidades_crm_sin_actividad` con los días elegidos: oportunidades olvidadas, de la más antigua a la más reciente, con su importe y contacto.
   - `get_avisos_crm` sin fechas: recordatorios vencidos sin notificar y los de los próximos 7 días, con su contacto y oportunidad.
5. **De la oportunidad a la venta** (opcional). Para las oportunidades ganadas con presupuesto vinculado (`idpresupuesto`, en `get_oportunidades_crm` o en la ficha `get_oportunidad_crm`), comprueba con `get_presupuestoclientes` si el presupuesto sigue editable (pendiente) o ya se convirtió en pedido, albarán o factura. Una oportunidad ganada cuyo presupuesto sigue pendiente es una venta que aún no se ha cerrado en el ERP. Si hay muchas, limita la comprobación a las 20 de mayor importe y dilo.
6. **Detalle** (si el usuario pregunta por una oportunidad o un contacto concreto). Usa `get_oportunidad_crm` o `get_contacto_crm`, que traen notas, presupuesto y adjuntos.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** oportunidades nuevas, abiertas, ganadas y perdidas, conversión, importe ganado, importe abierto (y qué parte es aproximada), días medios hasta el cierre y variación frente al periodo anterior si se ha calculado.
2. **Embudo por estado:** tabla en el orden del embudo con número de oportunidades e importe.
3. **Qué convierte mejor:** tablas por fuente e interés con oportunidades, ganadas, perdidas, conversión e importe ganado. Destaca las fuentes con más volumen y peor conversión, y las de pocas oportunidades pero alta conversión. No saques conclusiones de grupos con menos de 5 oportunidades cerradas.
4. **Por comercial:** tabla por usuario asignado o agente con las mismas columnas y sus oportunidades olvidadas.
5. **Seguimiento pendiente:** oportunidades olvidadas (contacto, estado, días sin actividad, importe) y avisos vencidos o próximos.
6. **Ganadas sin cerrar en el ERP:** si se ha hecho el paso 5.
7. **Recomendaciones:** por ejemplo, revisar las oportunidades olvidadas de mayor importe, invertir en las fuentes que mejor convierten o vincular presupuestos a las oportunidades que solo tienen un importe aproximado.
8. **Notas sobre los datos:** periodo y criterio (fecha de alta), base de los importes (sin impuestos) y limitaciones.

## Cómo actuar en el ERP

- Las oportunidades, sus estados, fuentes e intereses se gestionan desde el menú del CRM (ficha `CRM`). Para cambiar el estado de una oportunidad o crear su presupuesto, abre su ficha.
- Si el usuario quiere que lo hagas tú, recuerda que este informe es de solo lectura: propón la acción y, si la confirma, puede pedirla aparte (fs-mcp tiene `set_estado_oportunidad_crm` y `create_presupuesto_oportunidad_crm`).

## Limitaciones

- La conversión depende de que se cierren las oportunidades: si el equipo deja las perdidas abiertas, la conversión aparente sale más alta y el embudo se llena de oportunidades olvidadas.
- El periodo se aplica a la fecha de alta: una oportunidad creada antes del periodo y ganada dentro de él no aparece.
- Las campañas de email (`get_campanas_crm`) no se vinculan a las oportunidades, así que no se puede medir su conversión directamente.
