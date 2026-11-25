---
id: 776
permalink: impuestos-967
title: Configuración de impuestos y retenciones
creationdate: 24-12-2018 00:00:00
lastmod: 04-11-2026
url: https://facturascripts.com/publicaciones/impuestos-967
---
Antes de empezar a facturar, es necesario configurar los impuestos (el **IVA**). Puedes crear, editar o eliminar impuestos desde el menú Contabilidad → Impuestos. Al instalar FacturaScripts se crean automáticamente los impuestos predeterminados para tu país. Si has seleccionado España, se crean los impuestos para España.

![Listado de impuestos de IVA](https://i.imgur.com/yGwg9MP.png)

## Impuesto predeterminado
El impuesto predeterminado se selecciona desde el **menú Administrador → Panel de control**, sección *Por defecto*. Será el impuesto que se aplique a los nuevos productos o líneas de factura.

![Selección del impuesto por defecto](https://i.imgur.com/uwf8Xlo.png)

### Configurar excepciones o zonas de impuestos
Las excepciones o zonas de impuestos te permiten **aplicar un impuesto distinto** en función del país o provincia del cliente. Se configuran desde el propio impuesto sobre el que quieres aplicar la excepción: ve al menú Contabilidad → Impuestos, haz clic en el impuesto y en la parte de abajo podrás crear las excepciones.

![Zonas de impuesto de un impuesto](https://i.imgur.com/AD1kFTy.png)

Elige a qué país se aplica (`-` para todos los países), luego la provincia (`-` para todas las provincias del país seleccionado), el impuesto que se aplicará finalmente y, opcionalmente, la **Excepción de IVA** que se pondrá en la línea (por ejemplo, para que las ventas a una zona que no tributa por IVA salgan al 0% con su excepción). Repite el proceso en cada impuesto sobre el que quieras crear excepciones.

Cómo se aplican las zonas:
- Solo afectan a los documentos de **venta**, según el país y la provincia de la dirección del documento.
- Si varias zonas coinciden, se aplica la de mayor **prioridad** (el número más alto). Las zonas nuevas se crean con prioridad 1.
- No se aplican si la serie es **Sin impuestos** o si el cliente está en régimen **Exento**.

## Excepciones de IVA (operaciones exentas o no sujetas)
Cuando una operación va sin IVA, la factura debe indicar el motivo. En FacturaScripts se hace con la **Excepción de IVA**, que se imprime al pie del PDF, en el apartado «Excepciones de impuestos». Puedes indicarla:
- En el **producto**, si siempre está exento (por ejemplo, formación exenta del art. 20 LIVA). El producto debe tener un impuesto al 0%: si tiene excepción y un impuesto con otro porcentaje, no se puede guardar.
- En la ficha del **cliente** o **proveedor**, si todas sus operaciones lo están. Se copia a las líneas de sus documentos nuevos.
- En cada **línea** del documento, desde el botón **...** de la línea.

Al elegir una operación especial en el documento (intracomunitaria, exportación, inversión del sujeto pasivo…), FacturaScripts pone la excepción adecuada automáticamente. Las excepciones *Exenta – Art. 22 LIVA* y *Exenta – Arts. 23–24 LIVA* ponen siempre la línea al IVA 0%.

## Series sin impuestos
Si una serie está marcada como **Sin impuestos**, todas las líneas de sus documentos irán al IVA 0%, sea cual sea el cliente o proveedor. Consulta [las series de facturación](https://facturascripts.com/publicaciones/series-470).

## Subcuentas contables del impuesto
En cada impuesto puedes indicar, de forma opcional, las subcuentas de IVA repercutido y soportado, con y sin recargo de equivalencia, y las **intracomunitarias**. Estas últimas se usan para la autorrepercusión del IVA en las compras intracomunitarias y con inversión del sujeto pasivo. Si dejas vacías las intracomunitarias, se usan las de IVA soportado y repercutido del propio impuesto; y si estas también están vacías, las [cuentas especiales](https://facturascripts.com/publicaciones/cuentas-especiales) de IVA soportado y repercutido.

## Retenciones
Si eres un profesional obligado a retener **IRPF** en tus facturas emitidas, configúralo desde el menú Contabilidad → Impuestos, pestaña Retenciones.

![Listado de retenciones de IRPF](https://i.imgur.com/rJBemFG.png)

- Para que **las facturas de un cliente** tengan una retención determinada, asigna esa retención al cliente desde su ficha.
![Retención en la ficha del cliente](https://i.imgur.com/550mqa6.png)
- Para que **todas las facturas** de venta tengan una retención determinada, asígnala en el [panel de control](https://facturascripts.com/publicaciones/el-panel-de-control), sección *Por defecto*, campo **Retención**.
![Retención en el panel de control](https://i.imgur.com/5LbYkIv.png)
- [Cómo hacer una factura con IRPF](https://facturascripts.com/publicaciones/como-hacer-una-factura-con-irpf).

## Informes
Con el plugin [Informes](https://facturascripts.com/plugins/informes) puedes consultar un desglose de los impuestos de las facturas, también por operación y excepción de IVA, desde el menú Informes → Impuestos.

## Ver también

- [El Panel de control](https://facturascripts.com/publicaciones/el-panel-de-control)
- [Cuentas especiales](https://facturascripts.com/publicaciones/cuentas-especiales)
- [Régimen IVA](https://facturascripts.com/publicaciones/regimen-iva-369)
- [Cómo registrar una compra con inversión de sujeto pasivo](https://facturascripts.com/publicaciones/como-registrar-una-compra-con-inversion-de-sujeto-pasivo)
- [Menú Contabilidad](https://facturascripts.com/publicaciones/menu-contabilidad)