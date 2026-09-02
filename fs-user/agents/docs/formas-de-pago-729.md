---
id: 786
permalink: formas-de-pago-729
title: Formas de Pago
creationdate: 30-08-2019 00:00:00
lastmod: 22-07-2026
url: https://facturascripts.com/publicaciones/formas-de-pago-729
---
Las formas de pago en FacturaScripts sirven para configurar cómo se generan [los recibos de las facturas](https://facturascripts.com/publicaciones/los-recibos-de-facturas), las fechas de vencimiento y la cuenta bancaria donde realizar el cobro. Puedes gestionarlas desde el menú Contabilidad → Formas de pago.

![Listado de formas de pago](https://i.imgur.com/Aizzmyb.gif)

Una forma de pago tiene los siguientes campos:

- `Código`: (oculto) identificador de la forma de pago (alfanumérico de hasta 10 dígitos).
- `Descripción`: nombre de la forma de pago.
- `Vencimiento`: cantidad de días, semanas, meses o años para el vencimiento.
- `Tipo de vencimiento`: indica a qué corresponde la cantidad anterior (días, semanas, meses o años).
- `Cuenta bancaria`: cuenta bancaria a la que va el cobro.
    - Primero tienes que crearla en Contabilidad → Formas de pago, pestaña [Cuentas bancarias](https://facturascripts.com/publicaciones/cuentas-bancarias-28).
    - Si la cuenta bancaria está asociada, se mostrará en las facturas PDF.
- `Activo`: márcalo para que el método esté activo.
- `Domiciliado`: márcalo para indicar que esta forma de pago está domiciliada en el banco. Así se mostrará la cuenta del cliente en las facturas. Si lo que quieres es que se muestre la cuenta bancaria de la empresa (por ejemplo, con la forma de pago &quot;Su transferencia&quot;), no debe estar marcada esta opción.
- `Pagado`: márcalo para que la forma de pago dé por pagado el documento automáticamente.
- `Imprimir cuenta bancaria`: márcalo para que se imprima la cuenta.

Cuando pulses el botón `Guardar`, ya tendrás creada tu forma de pago para usarla más adelante.

![Formulario para añadir una forma de pago](https://i.imgur.com/VDMoixO.png)

## Forma de pago predeterminada
Puedes establecer la forma de pago predeterminada desde el menú Administrador → Panel de control, en el campo `Forma de pago` de la sección &quot;Por defecto&quot;.

![Selección de la forma de pago por defecto](https://i.imgur.com/lML5JIu.gif)

### Forma de pago predeterminada para un cliente/proveedor
En la ficha del cliente o proveedor puedes establecer una forma de pago predeterminada para él.

![Forma de pago predeterminada en la ficha de un cliente](https://i.imgur.com/UdV2plu.gif)

## Plazos de pago: 50-50, 30-60-90 y más
Puedes configurar la forma de pago para fraccionar el pago en varios recibos con el [plugin PlazosPago](https://facturascripts.com/plugins/plazospago).