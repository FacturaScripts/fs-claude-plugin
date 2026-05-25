---
id: 2628
permalink: como-registrar-una-compra-de-importacion
title: Cómo registrar una compra de importación
creationdate: 11-03-2026 12:02:30
lastmod: 16-03-2026
url: https://facturascripts.com/publicaciones/como-registrar-una-compra-de-importacion
---
Una importación se produce cuando compras mercancía a un proveedor de fuera de la Unión Europea (China, Estados Unidos, Reino Unido, etc.). A diferencia de las compras intracomunitarias, aquí no hay autorepercusión: el IVA se liquida en la aduana mediante el DUA (Documento Único Administrativo), que es un documento independiente de la factura del proveedor.

## Crear la factura en FacturaScripts

1. Ve a Contabilidad &gt; Facturas de proveedor y pulsa Nuevo.
2. Selecciona el proveedor extranjero y completa los datos habituales (serie, fecha, forma de pago).
3. En el campo Operación, selecciona Importación.
4. Añade las líneas de la factura con el importe. El IVA que selecciones da igual, FacturaScripts lo pondrá a 0% automáticamente.
5. Guarda la factura.

### Qué hace FacturaScripts automáticamente
Al seleccionar la operación de importación:

- Pone el IVA de cada línea a 0%, ya que el proveedor extranjero no cobra IVA español.
- Cambia el código de impuesto a IVA0.
- Elimina el recargo de equivalencia.
- No establece excepción fiscal en las líneas, ya que la exención no aplica de la misma forma que en operaciones intracomunitarias o de inversión del sujeto pasivo.

### El total de la factura coincide con el neto (base imponible).
Ejemplo práctico

- Base imponible: 5.000,00
- IVA en línea: 0% (automático)
- Total IVA en factura: 0,00
- Total factura: 5.000,00

### El DUA (liquidación aduanera)
El IVA de la importación se paga en la aduana y se documenta a través del DUA. Este documento es independiente de la factura del proveedor y se contabiliza por separado:

- IVA soportado (472): en el Debe, por el importe del IVA liquidado en aduanas
- Hacienda Pública acreedora (475) o Banco (572): en el Haber

El DUA es el que te da derecho a deducir el IVA de la importación en el modelo 303.

### Diferencia con otras operaciones
Importación (fuera de la UE):
- El proveedor no cobra IVA
- El IVA se paga en aduanas (DUA)
- No hay autorepercusión en la factura
- Las líneas quedan a IVA 0%

Intracomunitaria (dentro de la UE):
- El proveedor no cobra IVA
- El IVA se autoliquida mediante autorepercusión
- Las líneas mantienen el % de IVA para contabilidad
- El total sigue siendo igual al neto

## Notas

- Si el proveedor tiene configurada la operación por defecto como Importación en su ficha, las nuevas facturas de compra a ese proveedor la tendrán preseleccionada.
- Los gastos de aduanas, aranceles y transporte se suelen contabilizar por separado o como líneas adicionales en la factura del transitario.
- Las retenciones de IRPF, si las hay, se calculan con normalidad sobre la base imponible.
- La operación se puede indicar también en presupuestos, pedidos y albaranes de compra, y se arrastrará al transformar el documento en factura.