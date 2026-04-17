---
id: 892
permalink: cuentas-especiales
title: Cuentas Especiales
creationdate: 30-01-2021 18:19:33
lastmod: 19-08-2025
url: https://facturascripts.com/cuentas-especiales
---
Las cuentas especiales permiten a FacturaScripts identificar, por ejemplo, cuál es la cuenta de caja. En España, esta es la 570, pero en otros países puede variar. Por eso, cuando FacturaScripts necesita **generar un asiento** de pago de una factura, no busca la cuenta 570, sino la primera cuenta que se ha identificado como cuenta de caja.

Para que se realice la **generación de los asientos automáticos** correctamente, es fundamental que el plan contable contenga las cuentas especiales necesarias, que son: CAJA, CLIENTE, COMPRAS, IVAREP, IVASOP, PROVEEDOR y VENTAS.

## ⚠️ Errores Comunes
Si encuentras alguno de los siguientes mensajes de error, significa que no tienes asignada alguna de las cuentas especiales:
- Subcuenta del cliente no encontrada | No se encontró la cuenta de cliente.
- Subcuenta de proveedor no encontrada | No se encontró la cuenta de proveedor.
- Subcuenta de IVA repercutido no encontrada.
- Subcuenta de IVA soportado no encontrada.
- Subcuenta de IRPF no encontrada.
- Subcuenta de compras no encontrada.
- Subcuenta de ventas no encontrada.
- Subcuenta de suplidos no encontrada.
- Subcuenta de pérdidas y ganancias no encontrada.

## ✏️ Cómo Asignar una Cuenta Especial
Imagina que quieres identificar la cuenta 200 como cuenta de VENTA. Ve al menú **Contabilidad → Cuentas contables**, en la pestaña de cuentas, busca la cuenta 200 y haz clic en ella. Selecciona la opción &quot;Cuentas de ventas&quot; en el campo &quot;cuenta especial&quot; y pulsa guardar.

![cuenta especial](https://i.imgur.com/AQMxdV9.png)

Con esto, conseguimos que FacturaScripts utilice la primera subcuenta de 200 como cuenta de ventas para los asientos de facturas de ventas.

También puedes hacerlo directamente **con una subcuenta**, por ejemplo, la 2000000000. Solo necesitas editar la subcuenta, seleccionar la **cuenta especial** y guardar:

![subcuenta especial](https://i.imgur.com/DU9QiJW.png)

## 📊 Cuentas de IVA Soportado y Repercutido
Para que FacturaScripts pueda generar los asientos de facturas cuando hay productos con IVA, es necesario que haya una cuenta o subcuenta identificada como cuenta especial de IVA soportado y otra de IVA repercutido.

Otra opción es vincular las subcuentas directamente con el impuesto, desde el menú **Contabilidad → Impuestos**.

![subcuenta de IVA repercutido](https://i.imgur.com/2RKMnkH.png)
**Importante**: Las subcuentas seleccionadas deben existir.
