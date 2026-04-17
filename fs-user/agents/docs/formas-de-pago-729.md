---
id: 786
permalink: formas-de-pago-729
title: Formas de Pago
creationdate: 30-08-2019 00:00:00
lastmod: 07-04-2026
url: https://facturascripts.com/formas-de-pago-729
---
Las formas de pago en FacturaScripts sirven para configurar la forma en la que se generan [los recibos de las facturas](https://facturascripts.com/publicaciones/los-recibos-de-facturas), las fechas de vencimiento y la cuenta bancaria donde realizar el cobro. Puede gestionar las formas de pago desde el **menú Contabilidad**, **Formas de pago**.

![lista de formas de pago](https://i.imgur.com/Aizzmyb.gif)

Una forma de pago tiene los siguientes campos:
* **Código**: (oculto) identificador de la forma de pago (Alfanumérico de hasta 10 dígitos).
* **Descripción**: Nombre  de la forma de pago.
* **Vencimiento**: Cantidad de días, semanas, meses o años para el vencimiento de dicha forma de pago.
* **Tipo de vencimiento**: Seleccionamos a que corresponde la cantidad indicada en vencimiento. Como indique anteriormente pueden ser días, semanas, meses o años.
* **Cuenta Bancaria**: Cuenta bancaria a la que va dicho cobro.
	* Tendremos primero que crearla en **Contabilidad**, **Formas de Pago**, **[Cuentas Bancarias](https://facturascripts.com/publicaciones/cuentas-bancarias-28)**
	* Si la cuenta bancaria esta asociada se mostrará en las facturas PDF.
* **Activo**: Marcar para que el método este activo.
* **Domiciliado**: Marcar para indicar que esta forma de pago está domiciliada en el Banco. De esta forma se mostrará la cuenta del cliente en las facturas. Si lo que queremos es que se muestre la cuenta bancaria de la empresa (p,ej. con Forma Pago: Su transferencia), no puede estar marcada la opción Domiciliado.
* **Pagado**: Marcar para que la forma de pago automáticamente, de por pagado el documento.
* **Imprimir cuenta bancaria**: Marcar para que imprima la cuenta.

Una vez hagamos clic en el botón Guardar, ya tendremos creada nuestra forma de pago para posteriormente utilizarla.

![añadir forma de pago](https://i.imgur.com/VDMoixO.png)

## Forma de pago predeterminada
Podemos establecer la forma de pago predeterminada desde el **menú Administrador→ Panel de control**. En el campo &quot;forma de pago&quot; de la sección &quot;por defecto&quot;.

![forma de pago por defecto](https://i.imgur.com/lML5JIu.gif)

### Forma de pago predeterminada para un cliente/proveedor
En la ficha del cliente/proveedor podemos establecer una forma de pago predeterminada para ese cliente/proveedor.

![forma de pago para un cliente](https://i.imgur.com/UdV2plu.gif)

## Plazos de pago, 50-50, 30-60-90 y más
Puede configurar la forma de pago para fraccionar el pago en varios recibos con el [plugin PlazosPago](https://facturascripts.com/plugins/plazospago).
