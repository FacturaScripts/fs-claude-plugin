---
id: 2627
permalink: como-registrar-una-compra-intracomunitaria
title: Cómo registrar una compra intracomunitaria
creationdate: 11-03-2026 11:57:22
lastmod: 16-03-2026
url: https://facturascripts.com/publicaciones/como-registrar-una-compra-intracomunitaria
---
Una adquisición intracomunitaria de bienes (AIB) se produce cuando compras mercancía a un proveedor de otro país de la Unión Europea. En estas operaciones el proveedor te factura sin IVA (está exento en su país por entrega intracomunitaria) y tú, como comprador, debes autoliquidar el IVA español mediante el mecanismo de autorepercusión.

## Requisitos previos

- Tanto tú como tu proveedor debéis estar dados de alta en el ROI (Registro de Operadores Intracomunitarios) y disponer de un NIF-IVA válido.
- El proveedor debe figurar en FacturaScripts con su NIF intracomunitario (por ejemplo, DE123456789 para un proveedor alemán).

## Crear la factura en FacturaScripts

1. Ve a Contabilidad &gt; Facturas de proveedor y pulsa Nuevo.
2. Selecciona el proveedor comunitario y completa los datos habituales (serie, fecha, forma de pago).
3. En el campo Operación, selecciona Intracomunitaria.
4. Añade las líneas de la factura con el importe y el impuesto que corresponda (por ejemplo, IVA 21%).
5. Guarda la factura.

### Qué hace FacturaScripts automáticamente

Al seleccionar la operación intracomunitaria en una factura de compra, FacturaScripts realiza los siguientes ajustes:

- Mantiene el porcentaje de IVA en cada línea (por ejemplo, 21%) para que quede registrado a efectos contables y de declaración (modelo 303 y modelo 349).
- Establece la excepción fiscal de cada línea como Inversión del sujeto pasivo (art. 84 LIVA), ya que en las AIB el comprador es el sujeto pasivo.
- Elimina el recargo de equivalencia si lo hubiera, ya que no aplica en operaciones intracomunitarias.
- Anula el IVA en los totales del documento, de modo que el total de la factura es igual al neto (base imponible). No pagas IVA al proveedor.

### Asiento contable
 Al aprobar la factura, FacturaScripts genera automáticamente el asiento con la autorepercusión del IVA:

### Factura con varios tipos de IVA
Es posible que una misma factura contenga líneas con distintos tipos de IVA (por ejemplo, unas al 21% y otras al 10%). FacturaScripts calcula la autorepercusión de cada tipo por separado y neutraliza cada uno de ellos en los totales del documento.

### Diferencia con la inversión del sujeto pasivo
Aunque el mecanismo de cálculo es similar (autorepercusión, total sin IVA), son operaciones distintas:

**Intracomunitaria:**
- Proveedor de otro país de la UE
- Fundamento legal: art. 13 y 25 LIVA
- Se declara en el modelo 349
- Aplica a cualquier compra UE

**Inversión del sujeto pasivo:**
- Proveedor nacional
- Fundamento legal: art. 84.Uno.2º LIVA
- No se declara en el modelo 349
- Sectores típicos: construcción, chatarra, inmuebles, oro

### Servicios intracomunitarios
Si en lugar de bienes compras servicios a un proveedor de la UE (consultoría, desarrollo de software, etc.), debes seleccionar la operación Servicios intracomunitarios en lugar de Intracomunitaria. El tratamiento fiscal es el mismo (autorepercusión del IVA), pero se declara en casillas diferentes del modelo 303 y aplica la regla de localización de los artículos 69-70 de la LIVA.

### Notas
- Si el proveedor tiene configurada la operación por defecto como Intracomunitaria en su ficha, las nuevas facturas de compra a ese proveedor la tendrán preseleccionada.
- Las retenciones de IRPF, si las hay, se calculan con normalidad sobre la base imponible.
- La operación se puede indicar también en presupuestos, pedidos y albaranes de compra, y se arrastrará al transformar el documento en factura.