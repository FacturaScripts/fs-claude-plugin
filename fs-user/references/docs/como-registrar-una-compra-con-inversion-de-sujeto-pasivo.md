---
id: 2629
permalink: como-registrar-una-compra-con-inversion-de-sujeto-pasivo
title: Cómo registrar una compra con inversión de sujeto pasivo
creationdate: 11-03-2026 12:22:04
lastmod: 06-11-2026
url: https://facturascripts.com/publicaciones/como-registrar-una-compra-con-inversion-de-sujeto-pasivo
---
La inversión del sujeto pasivo (art. 84 LIVA) es un mecanismo fiscal en el que el comprador, en lugar del vendedor, es quien debe declarar y liquidar el IVA de la operación. Es habitual en servicios de construcción, compraventa de inmuebles, entregas de chatarra y determinadas operaciones entre empresarios.

## Cómo funciona
Cuando recibes una factura con inversión del sujeto pasivo, el proveedor te factura sin IVA. Sin embargo, tú como comprador debes autoliquidar ese IVA: lo declaras como IVA soportado (deducible) y como IVA repercutido al mismo tiempo. El efecto neto en tu liquidación de IVA es cero, pero queda correctamente reflejado en los libros de registro y en el modelo 303.

## Antes de empezar: configura el proveedor
Lo más cómodo es dejar la operación configurada en la ficha del proveedor. Así se copia a todas las facturas nuevas y no tienes que acordarte de seleccionarla cada vez. Ve a **Compras → Proveedores**, abre el proveedor y revisa estos tres campos:

- **Régimen impuestos**: debe ser **Régimen general**, aunque el proveedor sea extranjero. Si eliges **Exento**, FacturaScripts pone todas las líneas a IVA 0%, no deja cambiar el impuesto y el asiento sale sin autorrepercusión.
- **Operación**: **Inversión de sujeto pasivo**.
- **Excepción de IVA**: **España: Sujeta – Destinatario sujeto pasivo**. Va siempre junto con la operación: si la dejas vacía o eliges otra, la ficha no se guarda y aparece el aviso «La combinación de operación y excepción de IVA no es válida».

Pulsa **Guardar**. A partir de ahora, las nuevas facturas, albaranes, pedidos y presupuestos de compra de este proveedor tendrán la operación seleccionada y la excepción en cada línea. Los documentos que ya existían no cambian.

![Configuracion del proveedor](https://facturascripts.com/MyFiles/2026/11/8077_configurar_proveedor.png?myft=0bc58aa3797ea9e4e429080ec73249fc59958e9c)

## Crear la factura en FacturaScripts

1. Ve a **Compras → Facturas** y pulsa **Nuevo**.
2. Selecciona el proveedor y completa los datos habituales (serie, fecha, forma de pago).
3. Pulsa **Detalles** y comprueba que el campo **Operación** indica **Inversión de sujeto pasivo**. Si no configuraste el proveedor, selecciónala aquí.
4. Añade las líneas de la factura con su importe y **el impuesto que corresponda a la operación** (por ejemplo, IVA 21%). Es importante: FacturaScripts usa ese porcentaje para calcular la autorrepercusión en el asiento. Si dejas la línea sin impuesto o con IVA 0%, el asiento no reflejará el IVA autorrepercutido.
5. Guarda la factura.

![Detalles factura](https://i.imgur.com/9Bb84vN.png)

### Qué hace FacturaScripts automáticamente
Al seleccionar la operación de inversión del sujeto pasivo, FacturaScripts realiza los siguientes ajustes de forma automática:

- Mantiene el porcentaje de IVA en cada línea (por ejemplo, 21%) para que quede registrado a efectos contables y de declaración.
- Establece en cada línea la excepción de IVA **España: Sujeta – Destinatario sujeto pasivo** (art. 84.Uno LIVA), que se imprime al pie del PDF, en el apartado «Excepciones de impuestos».
- Elimina el recargo de equivalencia si lo hubiera.
- Anula el IVA en los totales del documento, de modo que el total de la factura es igual al neto (base imponible). Es decir, no pagas IVA al proveedor. Si hay retención de IRPF, se descuenta con normalidad.

![Lineas factura](https://i.imgur.com/IroXnuK.png)

![Pie factura](https://i.imgur.com/76gSe5H.png)

### Asiento contable
Al guardar la factura, FacturaScripts genera el asiento con la autorrepercusión del IVA. Por cada tipo de IVA se carga el **IVA soportado** y se abona el **IVA repercutido** por el mismo importe (base × porcentaje), así que el efecto neto es cero y al proveedor solo se le debe la base.

Se usan las subcuentas **Subcuenta soportado Intracomunitaria** y **Subcuenta repercutido intracomunitarias** del impuesto (menú **Contabilidad → Impuestos**). En los impuestos de España ya vienen asignadas (4721… y 4771…). Si las dejas vacías, se usan las subcuentas de IVA soportado y repercutido normales. Si cambias la operación de una factura ya guardada, el asiento se regenera.

![Asiento factura](https://i.imgur.com/SE6Hupa.png)

## Si eres tú quien emite la factura (venta)
Si eres el proveedor en una operación con inversión del sujeto pasivo (por ejemplo, ejecutas obras para un contratista principal, o vendes chatarra o inmuebles en los supuestos del art. 84.Uno.2º LIVA), la factura de venta se emite sin IVA:

1. Ve a **Ventas → Facturas** y pulsa **Nuevo**.
2. Pulsa **Detalles** y, en el campo **Operación**, selecciona **Inversión de sujeto pasivo**.
3. Añade las líneas y guarda la factura.
![Inversion de sujeto pasivo](https://facturascripts.com/MyFiles/2026/11/8080_inversion_sujeto_pasivo.png?myft=24efd3d482e8ba613ef1663622eb2e879a59170c)

FacturaScripts pone cada línea con el impuesto **IVA 0%**, elimina el recargo de equivalencia y marca la excepción **España: Sujeta – Destinatario sujeto pasivo** (art. 84.Uno LIVA), que se imprime al pie del PDF. Así queda en la factura la mención a la inversión del sujeto pasivo. El total de la factura es la base imponible (menos la retención de IRPF, si la hay).
![IVA0](https://facturascripts.com/MyFiles/2026/11/8081_excepcion_impuesto.png?myft=14fe18a011d9314ec3952d5da2621e16181bd76a)

Para que todas las facturas a un cliente salgan así, en su ficha elige **Operación: Inversión de sujeto pasivo** y **Excepción de IVA: España: Sujeta – Destinatario sujeto pasivo**.
![Excepcion de impuesto](https://facturascripts.com/MyFiles/2026/11/8082_excepcion_impuesto.png?myft=06fa490cf271755fe4f06adf9d387f9d4238cd1c)

## Notas

- El campo **Operación** está en la ventana **Detalles** de presupuestos, pedidos, albaranes y facturas, tanto de compra como de venta. Si lo indicas en un presupuesto, pedido o albarán, se conserva al transformarlo en factura.
- Este tratamiento automático solo se aplica cuando el país de la empresa es España.

## Ver también

- [Cómo registrar una factura de compra](https://facturascripts.com/publicaciones/como-registrar-una-factura-de-compra)
- [Cómo registrar una compra intracomunitaria](https://facturascripts.com/publicaciones/como-registrar-una-compra-intracomunitaria)
- [Cómo registrar una compra de importación](https://facturascripts.com/publicaciones/como-registrar-una-compra-de-importacion)
- [Cómo hacer una factura de venta](https://facturascripts.com/publicaciones/como-hacer-una-factura-de-venta)
- [Régimen IVA](https://facturascripts.com/publicaciones/regimen-iva-369)