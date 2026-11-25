---
id: 778
permalink: regimen-iva-369
title: Régimen IVA
creationdate: 24-12-2018 00:00:00
lastmod: 04-11-2026
url: https://facturascripts.com/publicaciones/regimen-iva-369
---
FacturaScripts permite indicar el régimen de IVA de tu empresa, de cada cliente y de cada proveedor, en el campo **Régimen impuestos** de su ficha. Los nuevos clientes y proveedores se crean con el **Régimen general**.

## Regímenes que cambian el cálculo de las facturas
Con una empresa española, estos regímenes modifican cómo se calculan los impuestos de los documentos:

- **Régimen general** (predeterminado): se aplica el impuesto de cada línea. Es el que corresponde cuando no se aplica ningún régimen especial, también a la mayoría de clientes y proveedores extranjeros.
- **Recargo de equivalencia**: régimen especial de los comerciantes minoristas que venden al consumidor final. Sus proveedores les cobran, además del IVA, un recargo (5,2 % con el IVA del 21 %, 1,4 % con el del 10 % y 0,5 % con el del 4 %) y, a cambio, no presentan autoliquidación de IVA por esa actividad. En FacturaScripts:
  - En **ventas**, se añade el recargo a las líneas si el **cliente** tiene este régimen.
  - En **compras**, se añade si lo tiene **tu empresa** o el **proveedor**. Marcarlo en el proveedor sirve cuando solo una de tus actividades está en recargo de equivalencia.
- **Exento**: para clientes o proveedores cuyas operaciones están exentas de IVA. Todas las líneas de sus documentos pasan al **IVA 0%** y no se puede cambiar el impuesto en la línea. En la ficha, elige también la **Excepción de IVA** que corresponda (por ejemplo, *Exenta – Art. 20 LIVA*) para que se imprima el motivo en el PDF. Marcar tu empresa como exenta no cambia el cálculo: lo que cuenta es el régimen del cliente o proveedor de cada documento.
- **Régimen especial del oro de inversión** (cliente o proveedor): las líneas van sin impuesto y con la excepción *Otras exenciones*.
- **Agricultura, ganadería y pesca** (proveedor): las compras a ese proveedor no llevan recargo de equivalencia y se marcan con la excepción *Otras exenciones*.
- **Régimen especial de bienes usados** (tu empresa): en las ventas de productos de tipo *Segunda mano*, el IVA se calcula sobre el margen (precio de venta menos coste). Consulta [cómo realizar una venta de segunda mano](https://facturascripts.com/publicaciones/como-hacer-una-venta-de-segunda-mano).
- **Régimen especial de las agencias de viajes** (tu empresa): en las ventas, el IVA se calcula sobre el margen.

Los demás regímenes de la lista (simplificado, criterio de caja, grupo de entidades, pequeñas empresas y ventanillas únicas OSS e IOSS) quedan registrados en la ficha para los informes y los plugins que los usan, pero no cambian el cálculo de las facturas.

⚠️ **Cliente o proveedor extranjero**: no lo marques como *Exento* para que sus facturas salgan sin IVA. Déjalo en **Régimen general** e indica la **Operación** en su ficha (intracomunitaria, exportación, importación, inversión del sujeto pasivo…): FacturaScripts pondrá el IVA y la excepción adecuados y generará el asiento correcto. Con el régimen *Exento*, por ejemplo, una compra intracomunitaria o con inversión del sujeto pasivo se queda sin autorrepercusión del IVA.

## Cambiar el régimen de IVA de un cliente
Para asignar un régimen de impuestos a un cliente, haga clic en el **menú Ventas**, **Clientes**, clic en el cliente, seleccione el régimen de IVA en el campo **Régimen impuestos** y pulse el botón guardar.

![cambiar regimen impuestos cliente](https://i.imgur.com/inCE9Ax.png)

Si ha seleccionado recargo de equivalencia, las nuevas facturas que haga a este cliente incluirán el recargo de equivalencia en cada línea. Y si ha seleccionado exento, las nuevas facturas al cliente no incluirán IVA ni recargo de equivalencia:
- [Cómo hacer una factura con recargo de equivalencia](https://facturascripts.com/publicaciones/como-hacer-una-factura-con-recargo-de-equivalencia).

## Cambiar el régimen de IVA de un proveedor
Para cambiar un régimen de IVA de un proveedor, haga clic en el **menú Compras**, **Proveedores**, abra el proveedor y en el campo **Régimen impuestos** seleccione el correspondiente y pulse el botón guardar:

![asignar régimen impuestos proveedor](https://i.imgur.com/S1GfIG9.png)

Si el proveedor está en **recargo de equivalencia**, las compras a ese proveedor llevarán recargo aunque tu empresa no esté en ese régimen. Si está **exento**, las compras irán sin IVA.

## Cambiar el régimen de IVA de la empresa
Si desea cambiar el régimen de IVA de su propia empresa, haga clic en el **menú Administrador**, **Empresas**, clic en la empresa, cambie el campo **Régimen impuestos** y pulse guardar.

![cambiar régimen iva empresa](https://i.imgur.com/IL1ow3T.png)

En la empresa, el régimen afecta al cálculo en estos casos: **recargo de equivalencia** (las compras llevan recargo), **bienes usados** y **agencias de viajes** (IVA sobre el margen en las ventas).

## Ver también

- [Configuración de impuestos y retenciones](https://facturascripts.com/publicaciones/impuestos-967)
- [Cómo hacer una factura con recargo de equivalencia](https://facturascripts.com/publicaciones/como-hacer-una-factura-con-recargo-de-equivalencia)
- [Cómo realizar una venta de segunda mano](https://facturascripts.com/publicaciones/como-hacer-una-venta-de-segunda-mano)
- [Cómo registrar una compra con inversión de sujeto pasivo](https://facturascripts.com/publicaciones/como-registrar-una-compra-con-inversion-de-sujeto-pasivo)