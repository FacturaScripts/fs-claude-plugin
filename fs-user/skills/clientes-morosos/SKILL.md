---
name: clientes-morosos
description: "Identifica en FacturaScripts, mediante fs-mcp, los clientes con recibos vencidos sin cobrar y genera un informe de cobros priorizado por antigüedad e importe, con los próximos vencimientos."
---

# Clientes morosos

Genera un informe accionable para el área de cobros a partir de los **recibos** de cliente pendientes. En FacturaScripts cada vencimiento de una factura es un recibo, y la factura solo queda pagada cuando se cobran todos sus recibos (`los-recibos-de-facturas`). Por eso la deuda se calcula por recibos, no por facturas.

Antes de empezar, lee completo el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md): sus reglas de conexión, paginación y fechas son obligatorias en esta skill. Si en Codex delegas el análisis en un subagente, sigue las indicaciones de [`reporting-analyst`](../reporting-analyst/SKILL.md).

## Datos que puedes pedir (opcionales)

- **Orden:** por importe pendiente (predeterminado) o por días de retraso.
- **Horizonte de próximos vencimientos:** 7 días por defecto.
- **Importe mínimo** para incluir a un cliente en la tabla.

## Definiciones

- **Recibo pendiente:** `pagado = false`.
- **Recibo vencido:** pendiente y con `vencimiento` anterior a hoy.
- **Días de retraso de un recibo:** días entre su `vencimiento` y hoy.
- **Retraso de un cliente:** el del recibo vencido más antiguo.
- **Deuda vencida de un cliente:** suma de `importe` de sus recibos vencidos. La deuda pendiente total incluye además los recibos aún no vencidos.
- **Tramos de urgencia** (los mismos límites que `get_aging_cobros`):
  - **Crítico:** más de 90 días de retraso.
  - **Alto:** de 31 a 90 días.
  - **Medio:** de 1 a 30 días.
  - Los recibos que vencen dentro del horizonte elegido no son morosidad: van en una sección aparte de **próximos vencimientos**.

## Procedimiento

1. **Conexión.** Elige la conexión según el perfil.
2. **Recibos pendientes.** Obtén todos los recibos con `get_reciboclientes` y `pagado = false`, recorriendo `offset`. Cada recibo incluye `codcliente`, `codigofactura`, `numero`, `importe`, `fecha`, `vencimiento` y `codpago`. Clasifícalos en vencidos, próximos vencimientos y resto, según las definiciones anteriores.
3. **Datos de los clientes.** Para los clientes con recibos vencidos o próximos, obtén con `get_clientes` (filtrando por `codcliente`) su `nombre`, `cifnif`, `telefono1`, `email`, `riesgoalcanzado` y `riesgomax`.
4. **Contraste.** Llama a `get_clientes_morosos` y comprueba que su deuda total por cliente coincide con la de los recibos vencidos del paso 2. Explica cualquier diferencia. Llama a `get_aging_cobros` para obtener el reparto global por tramos.
5. **Comportamiento de pago** (opcional). `get_dso` da los días medios de cobro de los recibos ya cobrados, por cliente y global. Se mide desde la fecha del recibo hasta la de pago, no desde el vencimiento.
6. **Riesgo de crédito.** Señala los clientes morosos sin `riesgomax` configurado (valor 0) y los que superan su límite según `get_clientes_riesgo_credito`.

## Informe

Usa el formato de informe del perfil con estas secciones:

1. **Resumen:** deuda vencida total, deuda pendiente total, número de clientes morosos, retraso medio ponderado por importe, cliente con mayor deuda y cliente con mayor retraso.
2. **Reparto por tramos:** tabla con los tramos crítico, alto y medio, con su número de recibos e importe, cuadrada con `get_aging_cobros`.
3. **Clientes morosos:** tabla con cliente y CIF/NIF, deuda vencida, número de recibos vencidos, días de retraso, factura del recibo más antiguo (`codigofactura`) y su vencimiento, tramo, y teléfono o email de contacto.
4. **Próximos vencimientos:** recibos que vencen dentro del horizonte, con cliente, factura, importe y fecha.
5. **Recomendaciones por tramo:**
   - **Crítico:** contacto inmediato, revisar el riesgo máximo del cliente para frenar nuevas ventas y valorar reclamación formal con la gestoría o un abogado.
   - **Alto:** llamada y recordatorio por escrito; proponer un plan de pago con varios recibos.
   - **Medio:** recordatorio por email.
   - **Próximos vencimientos:** aviso preventivo a los clientes con historial de retrasos.
6. **Notas sobre los datos:** fecha de corte, número de recibos analizados y limitaciones.

## Cómo actuar en el ERP

- Los recibos de todas las facturas están en **Ventas → Facturas**, pestaña **Recibos**, donde se pueden filtrar por vencimiento y estado de pago. Los de un cliente concreto están en su ficha, pestaña **Recibos** (`los-recibos-de-facturas`).
- Para registrar un cobro, selecciona los recibos y pulsa **Pagado**. Para cobrar en varios plazos, usa **Generar recibos** en la pestaña **Recibos** de la factura; reparte solo el importe que no cubren los recibos existentes (`los-recibos-de-facturas`).
- El **Riesgo máximo** de la ficha del cliente es su límite de crédito: al superarlo, el ERP impide guardar nuevas ventas (`tu-primer-cliente-459`).
- Los listados se pueden exportar a PDF, XLS o CSV para compartirlos (`como-funcionan-los-listados-y-filtros`).
- El core no envía recordatorios automáticos. Existen plugins para ello, como **RecordatorioImpagos** (recordatorios por email según los días de retraso) y **GestionCobros** (secuencias y niveles de reclamación), y **RemesasSEPA** para cobrar recibos domiciliados. Preséntalos como opcionales y con los datos de su ficha.

## Limitaciones

- Las facturas cuya forma de pago las da por pagadas al emitirse no generan deuda pendiente (`formas-de-pago-729`).
- Si los cobros no se marcan en el ERP, los recibos seguirán apareciendo como pendientes aunque el cliente haya pagado: avisa de ello si detectas recibos muy antiguos de clientes habituales.
- El informe no predice impagos futuros; solo muestra la situación a la fecha de corte.
