---
id: 2627
permalink: como-registrar-una-compra-intracomunitaria
title: Cómo registrar una compra intracomunitaria
creationdate: 11-03-2026 11:57:22
lastmod: 04-11-2026
url: https://facturascripts.com/publicaciones/como-registrar-una-compra-intracomunitaria
---
Una adquisición intracomunitaria de bienes (AIB) se produce cuando compras mercancía a un proveedor de otro país de la Unión Europea. En estas operaciones el proveedor te factura sin IVA (está exento en su país por entrega intracomunitaria) y tú, como comprador, debes autoliquidar el IVA español mediante el mecanismo de autorepercusión.

## Requisitos previos

- Tanto tú como tu proveedor debéis estar dados de alta en el ROI (Registro de Operadores Intracomunitarios) y disponer de un NIF-IVA válido.
- El proveedor debe figurar en FacturaScripts con su NIF intracomunitario (por ejemplo, DE123456789 para un proveedor alemán).

![NIF](https://i.imgur.com/5nlYh21.png)

## Antes de empezar: configura el proveedor
Lo más cómodo es dejar la operación configurada en la ficha del proveedor. Así se copia a todas las facturas nuevas y no tienes que acordarte de seleccionarla cada vez. Ve a **Compras → Proveedores**, abre el proveedor y revisa estos tres campos:

- **Régimen impuestos**: debe ser **Régimen general**, aunque el proveedor sea extranjero. Si eliges **Exento**, FacturaScripts pone todas las líneas a IVA 0%, no deja cambiar el impuesto y el asiento sale sin autorrepercusión.
- **Operación**: **Intracomunitaria** si te vende bienes, o **Intracomunitaria de servicios** si te presta servicios.
- **Excepción de IVA**: **España: Sujeta – Destinatario sujeto pasivo**, en los dos casos. Va siempre junto con la operación: si la dejas vacía o eliges otra, la ficha no se guarda y aparece el aviso «La combinación de operación y excepción de IVA no es válida».

Pulsa **Guardar**. A partir de ahora, las nuevas facturas, albaranes, pedidos y presupuestos de compra de este proveedor tendrán la operación seleccionada y la excepción en cada línea. Los documentos que ya existían no cambian.

## Crear la factura en FacturaScripts

1. Ve a **Compras → Facturas** y pulsa **Nuevo**.
2. Selecciona el proveedor comunitario y completa los datos habituales (serie, fecha, forma de pago).
3. Pulsa **Detalles** y comprueba que el campo **Operación** indica **Intracomunitaria**. Si no configuraste el proveedor, selecciónala aquí.
4. Añade las líneas de la factura con su importe y **el impuesto que corresponda a la operación** (por ejemplo, IVA 21%). Es importante: FacturaScripts usa ese porcentaje para calcular la autorrepercusión en el asiento. Si dejas la línea sin impuesto o con IVA 0%, el asiento no reflejará el IVA autorrepercutido.
5. Guarda la factura.

![Factura intracomunitaria](https://i.imgur.com/O7IowBs.png)

### Qué hace FacturaScripts automáticamente

Al seleccionar la operación intracomunitaria en una factura de compra, FacturaScripts realiza los siguientes ajustes:

- Mantiene el porcentaje de IVA en cada línea (por ejemplo, 21%) para que quede registrado a efectos contables y de declaración (modelo 303 y modelo 349).
- Establece en cada línea la excepción de IVA **España: Sujeta – Destinatario sujeto pasivo**, que cubre la inversión del sujeto pasivo y las adquisiciones intracomunitarias (art. 85 LIVA), ya que en las AIB el comprador es el sujeto pasivo. Se imprime al pie del PDF, en el apartado «Excepciones de impuestos».
- Elimina el recargo de equivalencia si lo hubiera, ya que no aplica en operaciones intracomunitarias.
- Anula el IVA en los totales del documento, de modo que el total de la factura es igual al neto (base imponible). No pagas IVA al proveedor.
- Este tratamiento automático solo se aplica cuando el país de la empresa es España.

![Linea factura intracomunitaria](https://i.imgur.com/xCmu1Pv.png)

![Pie de factura intracomunitaria](https://i.imgur.com/AU3a3Z0.png)

### Asiento contable
Al guardar la factura, FacturaScripts genera automáticamente el asiento con la autorrepercusión del IVA. Por cada tipo de IVA se carga el **IVA soportado** y se abona el **IVA repercutido** por el mismo importe (base × porcentaje), así que el efecto neto es cero.

Se usan las subcuentas **Subcuenta soportado Intracomunitaria** y **Subcuenta repercutido intracomunitarias** del impuesto (menú **Contabilidad → Impuestos**). En los impuestos de España ya vienen asignadas (4721… y 4771…). Si las dejas vacías, se usan las subcuentas de IVA soportado y repercutido normales. Si cambias la operación de una factura ya guardada, el asiento se regenera.
 
 ![Asiento intracomunitaria](https://i.imgur.com/ODrkLH8.png)

### Factura con varios tipos de IVA
Es posible que una misma factura contenga líneas con distintos tipos de IVA (por ejemplo, unas al 21% y otras al 10%). FacturaScripts calcula la autorepercusión de cada tipo por separado y neutraliza cada uno de ellos en los totales del documento.

### Diferencia con la inversión del sujeto pasivo
Aunque el mecanismo de cálculo es similar (autorepercusión, total sin IVA), son operaciones distintas:

**Intracomunitaria:**
- Proveedor de otro país de la UE
- Fundamento legal: arts. 13, 15 y 85 LIVA
- Se declara en el modelo 349
- Aplica a cualquier compra UE

**Inversión del sujeto pasivo:**
- Proveedor nacional
- Fundamento legal: art. 84.Uno.2º LIVA
- No se declara en el modelo 349
- Sectores típicos: construcción, chatarra, inmuebles, oro

### Servicios intracomunitarios
Si en lugar de bienes compras servicios a un proveedor de la UE (consultoría, desarrollo de software, etc.), debes seleccionar la operación **Intracomunitaria de servicios** en lugar de **Intracomunitaria**. El tratamiento fiscal es el mismo (autorepercusión del IVA), pero se declara en casillas diferentes del modelo 303 y aplica la regla de localización de los artículos 69-70 de la LIVA.

### Notas
- Las retenciones de IRPF, si las hay, se calculan con normalidad sobre la base imponible.
- El campo **Operación** está en la ventana **Detalles** de presupuestos, pedidos, albaranes y facturas de compra. Si lo indicas en un presupuesto, pedido o albarán, se conserva al transformarlo en factura.