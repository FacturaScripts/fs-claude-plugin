---
name: impuestos-trimestre
description: "Calcula en FacturaScripts, mediante fs-mcp, el IVA repercutido y soportado de un trimestre o periodo, con desglose por tipo, recargo, retenciones y la diferencia orientativa para el modelo 303, y revisa las facturas que pueden descuadrarlo."
---

# IVA del trimestre

Prepara un resumen del IVA de un periodo (normalmente un trimestre) a partir de las facturas de venta y de compra, para revisarlo antes de presentar la liquidación o de enviarlo a la gestoría.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que debes pedir

- **Periodo** (obligatorio). Si el usuario no lo indica, propón el último trimestre natural completo (1T: enero a marzo; 2T: abril a junio; 3T: julio a septiembre; 4T: octubre a diciembre) y confírmalo. Convierte el periodo en fechas `YYYY-MM-DD`.
- **Comparativa** (opcional): el mismo trimestre del año anterior.

## Qué calcula la herramienta

`get_impuestos_periodo` suma las facturas por su **fecha de factura**:

- **Repercutido** (facturas de cliente) y **soportado** (facturas de proveedor): número de facturas, base imponible, IVA, recargo de equivalencia, retenciones de IRPF, suplidos y total. Son los totales que guarda cada factura, pasados a la divisa principal con su tasa de conversión.
- **Desglose por tipo** de IVA y recargo, recalculado desde las líneas con los descuentos globales de cada factura, igual que el core. `diferencia_iva_desglose` compara ese desglose con el IVA total de las facturas: si no es 0, hay redondeos, impuestos de importe fijo o modificaciones de algún plugin, y manda el total de las facturas.
- **Liquidación orientativa:** IVA repercutido más recargo, menos IVA soportado. El recargo soportado no se resta porque no es deducible.

## Procedimiento

1. **Conexión.** Elige la conexión según el perfil.
2. **IVA del periodo.** Llama a `get_impuestos_periodo` con `fecha_desde` y `fecha_hasta`. Si devuelve un aviso de demasiadas facturas para el desglose, acota el periodo (por meses) y suma los resultados.
3. **Comparativa** (si se ha pedido). Repite el paso 2 con el mismo periodo del año anterior y calcula la variación de bases y cuotas.
4. **Revisión de facturas.** Comprueba lo que suele descuadrar una liquidación:
   - `get_facturas_con_errores`: quédate con las facturas del periodo (total cero, totales que no cuadran, rectificativas con signo incorrecto).
   - Tipos de IVA a 0 en el desglose: pueden ser exportaciones, operaciones intracomunitarias, inversión del sujeto pasivo o exentas. Indícalo para que el usuario lo revise, porque en el modelo 303 van en casillas propias.
   - Facturas de proveedor registradas con fecha fuera del trimestre en que se recibieron: la herramienta no lo detecta; recuérdalo en las notas.
5. **Regularizaciones registradas** (opcional). `get_regularizacionimpuestos` lista las regularizaciones de IVA guardadas en el ERP, que crea el plugin **Modelo303** al calcular cada trimestre. Si existe la del periodo, compara sus cifras con las del paso 2; si la lista está vacía, simplemente no se usa ese plugin.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen:** IVA repercutido (con recargo), IVA soportado y diferencia, con el resultado orientativo (a ingresar o a compensar o devolver) y la comparativa si se ha calculado.
2. **IVA repercutido:** tabla por tipo con base, cuota de IVA y cuota de recargo, y totales de retenciones y suplidos.
3. **IVA soportado:** la misma tabla para las compras.
4. **Avisos:** diferencia del desglose, facturas con errores del periodo, tipos a 0 y divisas distintas.
5. **Notas sobre los datos:** periodo y criterio (fecha de factura), número de facturas y limitaciones. Deja claro que es una orientación y que la liquidación la debe validar quien presente el modelo.

## Cómo actuar en el ERP

- El core no calcula la regularización de IVA. El plugin **Modelo303** la calcula por trimestre desde **Informes → Modelo 303**, muestra el resumen de compras y ventas sujetas a IVA y genera el asiento del pago (ficha `Modelo303`). Para el suministro inmediato de información existe **InformeSII** (ficha `InformeSII`). Preséntalos como opcionales y con los datos de su ficha.

## Limitaciones

- No distingue facturas no deducibles, prorrata, criterio de caja, operaciones intracomunitarias ni inversión del sujeto pasivo: todas suman en su tipo.
- Usa la fecha de la factura; la liquidación real puede depender de la fecha de devengo o de recepción.
- El IRPF que aparece es el retenido en las facturas; las retenciones de nóminas o alquileres registradas solo en contabilidad no están.
