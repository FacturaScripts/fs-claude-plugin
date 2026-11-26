---
name: impuestos-trimestre
description: "Prepara en FacturaScripts, mediante fs-mcp, los modelos fiscales de un trimestre o del año (303/390 de IVA, 111/190, 115/180, 130, 347, 349 y 369) con las cifras de sus plugins, o el IVA orientativo desde las facturas si no están instalados, y revisa lo que puede descuadrarlos."
---

# Impuestos del trimestre

Prepara el resumen de los impuestos de una empresa para un trimestre (o para el año) antes de presentarlos o de enviarlos a la gestoría: el IVA y, si la instalación tiene sus plugins, los demás modelos fiscales con las mismas cifras que muestran sus pantallas.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación, fechas y bases de cálculo son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que debes pedir

- **Empresa** (si la instalación tiene varias): `get_empresas` y confírmala por nombre.
- **Periodo** (obligatorio): trimestre (`T1`-`T4`), mes (`01`-`12`, para el 303 mensual, el 349 o el IOSS del 369) o `ANUAL` para los anuales (390, 190, 180 y 347), que tienen sus propias herramientas. Si el usuario no lo indica, propón el último trimestre natural completo y confírmalo.
- **Año** del ejercicio. Si la empresa tiene ejercicios con códigos que no son el año (`GE25`, `0001`...), usa `idempresa` + `anio`: las herramientas buscan el ejercicio de esa empresa. Con `codejercicio`, manda el ejercicio indicado.
- **Comparativa** (opcional): el mismo periodo del año anterior.

## Herramientas

| Modelo | Herramienta | Qué devuelve |
|---|---|---|
| 303 (IVA) | `get_modelo_303` | Casillas de la autoliquidación desde las partidas de IVA, resultado (casilla 71) y regularización guardada o cálculo provisional |
| 390 (IVA anual) | `get_modelo_390` | Casillas propias del resumen anual, resultado de la liquidación anual (casilla 86), los periodos liquidados del año y si cuadran |
| 111 | `get_modelo_111` | Perceptores, base y retenciones del trabajo (01-03) y de actividades económicas (07-09) y total a ingresar |
| 190 | `get_modelo_190` | Detalle anual por perceptor, totales (casillas 01-03) y los errores que impiden generar su fichero (informativo) |
| 115 | `get_modelo_115` | Arrendadores, base y retenciones de alquileres (casillas 01-05) |
| 180 | `get_modelo_180` | Desglose anual por arrendador e inmueble y totales (casillas 01-03) (informativo) |
| 130 | `get_modelo_130` | Pago fraccionado del IRPF acumulado desde enero (casillas 01 a 19) |
| 347 | `get_modelo_347` | Clientes y proveedores por encima de 3.005,06 € con el total por trimestre (informativo) |
| 349 | `get_modelo_349` | Operadores intracomunitarios con su clave y base (informativo) |
| 369 | `get_modelo_369` | Ventas OSS/IOSS por país y tipo de IVA y la cuota a ingresar |
| Todos | `get_resumen_modelos_fiscales` | Resultado y avisos de cada modelo del trimestre (con el total a ingresar) o de los anuales (sin total), y los que no se pueden calcular |
| IVA orientativo | `get_impuestos_periodo` | IVA repercutido y soportado desde las facturas por su fecha, con desglose por tipo (no necesita plugins) |

Las `get_modelo_*` solo leen: usan la misma clase que la pantalla del plugin y no generan asientos ni guardan nada. Necesitan su plugin en una versión con endpoint; si no está, el error dice qué plugin y versión faltan.

## Procedimiento

1. **Conexión.** Elige la conexión según el perfil.
2. **Visión general.** Llama a `get_resumen_modelos_fiscales` con la empresa, el año y el periodo. Te dice qué modelos tiene la instalación, su resultado y sus avisos. No presentes como obligatorios los modelos que no apliquen a la empresa (por ejemplo, el 130 en una sociedad, o el 349 y el 369 sin ventas a la UE): indícalo como pregunta.
3. **Detalle de cada modelo con resultado o avisos.** Llama a su `get_modelo_NNN` con `detalle: true` para ver casillas, facturas o partidas. En el 303 revisa sobre todo las casillas 27 (IVA devengado), 45 (deducible), 46, 69 y 71, y si la regularización está guardada (`regularizacion.existe`); si no lo está, las casillas manuales (compensaciones de periodos anteriores, complementarias) valen 0.
4. **Sin plugin del 303.** Si `get_modelo_303` no está disponible, usa `get_impuestos_periodo` con las fechas del periodo (`desglose: true`) y deja claro que es una orientación desde las facturas, no la cifra del modelo. Si devuelve un aviso de demasiadas facturas, acota por meses y suma.
5. **Contraste (opcional).** Con el plugin del 303 instalado, compara su resultado con la diferencia de `get_impuestos_periodo`: una diferencia suele deberse a asientos de IVA manuales, facturas sin contabilizar o fechas de asiento distintas de la de la factura.
6. **Comparativa** (si se ha pedido). Repite los pasos 2 y 3 con el año anterior y calcula la variación de bases y cuotas.
7. **Revisión.** Comprueba lo que suele descuadrar los modelos:
   - Los avisos de cada modelo: facturas sin asiento (no cuentan en los modelos que parten de la contabilidad), importes de IVA que no encajan en ninguna casilla, subcuentas de retenciones sin configurar.
   - `get_facturas_con_errores`: facturas del periodo con total cero, totales que no cuadran o rectificativas con signo incorrecto.
   - Tipos de IVA a 0: exportaciones, intracomunitarias, inversión del sujeto pasivo o exentas, que van en casillas propias del 303.
   - Retenciones contadas en el 111 y en el 115 a la vez: pasa cuando el plan contable no separa las de alquileres (cuenta especial IRPFA). El aviso del modelo lo indica.
   - En los anuales: si el 390 avisa de que faltan regularizaciones o de que la casilla 86 no cuadra con lo liquidado en el año, revisa los periodos de la lista `periodos`; en el 190, los `errores` de su `resumen` (NIF que falta, importes negativos) impiden generar el fichero; en el 180, los arrendadores sin inmueble se declaran sin referencia catastral.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen:** tabla de modelos con su resultado (a ingresar, a devolver o compensar, o informativo) y el total a ingresar del periodo (en el resumen anual no hay total: lo ingresado está en los trimestrales), con la comparativa si se ha calculado.
2. **IVA (303/390):** casillas principales (bases y cuotas devengadas por tipo, deducible, resultado) o, sin plugin, el IVA repercutido y soportado por tipo con su diferencia orientativa.
3. **Retenciones y pagos a cuenta:** 111, 115 y 130 con perceptores, bases y retenciones.
4. **Informativos:** 347, 349 y 369 con el número de terceros u operadores y los importes.
5. **Avisos:** los de cada modelo, facturas con errores y lo que deba revisar la gestoría.
6. **Notas sobre los datos:** empresa, ejercicio y periodo, de dónde sale cada cifra (contabilidad o facturas) y que la presentación la debe validar quien firme el modelo.

## Cómo actuar en el ERP

- Cada modelo se presenta desde su pantalla en **Informes → Modelos fiscales**: allí se genera el fichero de la AEAT y, en el 111, 130 y 303, el asiento de la liquidación. El 303 y el 390 se guardan como regularizaciones de IVA (ficha `Modelo303`), donde se introducen las casillas manuales. Para el suministro inmediato de información existe **InformeSII**. Consulta las fichas de los plugins con la skill `docs-expert` antes de recomendarlos.

## Limitaciones

- Las herramientas no presentan modelos, no generan los ficheros de la AEAT ni crean asientos: eso se hace desde la pantalla de cada plugin.
- Los modelos que parten de la contabilidad (111, 130, 303) no cuentan las facturas sin asiento; los que parten de las facturas (115, 347, 349, 369) no ven los asientos manuales.
- `get_impuestos_periodo` usa la fecha de la factura y no distingue facturas no deducibles, prorrata, criterio de caja ni operaciones especiales.
