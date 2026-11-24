---
name: informe-contable
description: "Prepara en FacturaScripts, mediante fs-mcp, la cuenta de pérdidas y ganancias y el balance de situación abreviados de un ejercicio a partir de la contabilidad, con comparativa, ratios básicos y avisos de descuadres."
---

# Informe contable del ejercicio

Prepara un resumen contable de un ejercicio: qué ha ganado o perdido la empresa según la contabilidad, cómo se reparte entre ingresos y gastos, y cuál es su situación patrimonial con algunos ratios básicos.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que debes pedir

- **Ejercicio** (obligatorio). Consulta `get_ejercicios` para conocer los códigos, sus fechas y si están abiertos o cerrados, y propón el ejercicio en curso si el usuario no lo indica.
- **Comparativa** (opcional; por defecto, sí si existe): el ejercicio anterior.
- **Parte:** pérdidas y ganancias, balance o ambos (predeterminado).

## Cómo se calcula

- Ambos informes usan el cuadro de cuentas del **Plan General Contable español**, que es el que trae FacturaScripts para España. Si la empresa usa otro plan contable (otro país), las agrupaciones no son válidas: dilo y no presentes las cifras.
- Parten de los saldos de las subcuentas del ejercicio, que FacturaScripts actualiza en segundo plano y pueden ir ligeramente por detrás de los últimos asientos (`menu-contabilidad`).
- **Pérdidas y ganancias** (`get_cuenta_resultados`): ingresos (grupo 7) menos gastos (grupo 6), sin los asientos de regularización ni de cierre, así que también sirve para ejercicios ya cerrados. Importes sin impuestos.
- **Balance** (`get_balance_situacion`): grupos 1 a 5 sin el asiento de cierre. Si el ejercicio no se ha regularizado, el resultado de 6 y 7 se suma al patrimonio neto (`resultado_sin_regularizar`). Las subcuentas de los grupos 4 y 5 van al activo o al pasivo según el signo de su saldo, y todo ese pasivo se presenta como corriente.

## Procedimiento

1. **Conexión y ejercicio.** Elige la conexión según el perfil y confirma el ejercicio con `get_ejercicios`.
2. **Pérdidas y ganancias.** `get_cuenta_resultados` con `codejercicio` y, si hay comparativa, `codejercicio_comparar`. Devuelve ingresos, gastos, resultado y margen, el desglose por grupo y por cuenta, y la variación frente al otro ejercicio.
3. **Balance.** `get_balance_situacion` con `codejercicio`: activo no corriente y corriente (existencias, deudores, tesorería e inversiones), patrimonio neto, pasivo no corriente y corriente, ratios y `descuadre`. Para la comparativa, repítelo con el ejercicio anterior.
4. **Contraste con la facturación.** Compara los ingresos del grupo 70 con la base imponible de las ventas del ejercicio (`get_tiempo_beneficios_todos_clientes` con `codejercicio`, sumando `neto`). Una diferencia grande suele indicar facturas sin contabilizar o asientos manuales: señálala.
5. **Revisión de avisos.**
   - Si `descuadre` no es 0, el balance no cuadra: puede haber asientos descuadrados o saldos de subcuentas pendientes de actualizar.
   - Si `asientos_excluidos` muestra regularización o cierre, menciónalo: las cifras son las del ejercicio antes de cerrarlo.
   - Si el resultado es 0 o casi 0 con ventas registradas, la contabilidad probablemente no está generada o al día.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen ejecutivo:** ingresos, gastos, resultado y margen, con su variación; total de activo, patrimonio neto y pasivo; fondo de maniobra, liquidez y endeudamiento.
2. **Pérdidas y ganancias:** tabla por grupo (ventas, compras, servicios exteriores, personal, amortizaciones, financieros…) con importe, peso sobre los ingresos y comparativa; las cuentas más relevantes de cada grupo.
3. **Balance de situación:** activo, patrimonio neto y pasivo por bloques y grupos, con comparativa.
4. **Ratios:** fondo de maniobra (activo corriente − pasivo corriente), liquidez (activo corriente / pasivo corriente) y endeudamiento (pasivo / total), con una explicación breve de cada uno.
5. **Avisos:** descuadre, contraste con la facturación y estado de la contabilidad.
6. **Notas sobre los datos:** ejercicio, plan contable, momento de los saldos y limitaciones. Deja claro que es un informe de gestión, no las cuentas anuales.

## Cómo actuar en el ERP

- Los asientos, el plan contable y la regularización y el cierre del ejercicio están en el menú **Contabilidad** (`menu-contabilidad`).
- El balance de situación, la cuenta de pérdidas y ganancias, el libro mayor y el balance de sumas y saldos oficiales los aporta el plugin **Informes** (ficha `Informes`).

## Limitaciones

- Agrupación abreviada del PGC español: no reproduce todos los epígrafes de las cuentas anuales ni separa el pasivo de los grupos 4 y 5 entre corto y largo plazo.
- Solo por ejercicio completo (a la fecha de la consulta): no calcula el resultado de un mes o trimestre concreto.
- Si la contabilidad no se genera automáticamente desde las facturas, o se lleva en otro programa, las cifras no reflejan la actividad real.
