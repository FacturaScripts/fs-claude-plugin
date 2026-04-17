---
id: 1088
permalink: diferencias-entre-albaranes-facturas-pedidos-y-presupuetos
title: Diferencias entre Albaranes, Facturas, Pedidos y Presupuestos
creationdate: 19-03-2022 19:24:30
lastmod: 09-04-2026
url: https://facturascripts.com/diferencias-entre-albaranes-facturas-pedidos-y-presupuetos
---
FacturaScripts te permite gestionar Albaranes, Facturas, Pedidos y Presupuestos sin necesidad de instalar nada, tanto en **compras** como en **ventas**.

## Presupuestos
El presupuesto es el punto de partida para muchas empresas. Si un cliente o posible cliente solicita el precio de un servicio o material, lo habitual es crear un presupuesto de venta (menú **Ventas &gt; Presupuestos**). Los presupuestos **no modifican el stock** del almacén; no se reserva nada, simplemente se ofrece un precio.

A los presupuestos se les puede asignar una **fecha de vencimiento**, a partir de la cual caducan. Esta fecha se puede asignar en el campo de vencimiento en los detalles del presupuesto y también se puede configurar de forma global en el panel de control.

![Fin oferta presupuesto](https://i.imgur.com/4RpvrpU.png)

Los presupuestos se pueden rechazar o **convertir en pedidos** o facturas simplemente cambiando su estado. También se pueden agrupar o dividir.

![Aprobar presupuesto](https://i.imgur.com/WUI1dah.png)

## Pedidos
Se considera un pedido cuando el cliente muestra una clara intención de compra y se establece un compromiso (menú **Ventas &gt; Pedidos**). Los pedidos **reservan stock**. Cuando se trata de pedidos de compra, las cantidades se suman al campo **pendiente de recibir** del stock del producto. En el caso de los pedidos de venta, las cantidades se suman al campo **reservada**.

![Cantidad reservada y pendiente de recepción](https://i.imgur.com/2lVM5Op.png)

Los pedidos se pueden cancelar o **convertir en albaranes** o facturas cambiando su estado. Junto a este menú tenemos acceso al presupuesto asociado a este pedido. También se pueden agrupar o dividir.

![Aprobar pedido](https://i.imgur.com/fDuJYKo.png)

## Albaranes
El albarán es un documento que acredita la **entrada o salida de material del almacén** (menú **Ventas &gt; Albaranes** o **Menú Compras &gt; Albaranes**). Los albaranes de compra **aumentan el stock**, y los de venta **disminuyen el stock** ya que corresponden a material que sale del almacén.

Los albaranes pueden ser devueltos o **convertidos en facturas**, y también se pueden agrupar o dividir. Junto a este menú tenemos acceso al pedido asociado a este albarán.

![Aprobar albarán](https://i.imgur.com/ClFiqKy.png)

## Facturas
Las facturas (menú **Ventas &gt; Facturas** o **Menú Compras &gt; Facturas**) actúan de manera similar a los albaranes respecto al stock. Las facturas de compra **aumentan el stock**, mientras que las de venta **disminuyen el stock**. Aquí también tenemos  acceso al albarán asociado a esta factura.

![Ejempo factura](https://i.imgur.com/TgxTXmN.png)

## Estados y Transiciones
Puedes configurar los estados de cada tipo de documento y las transiciones que se pueden realizar desde el **panel de control**, en la [sección Estados](https://facturascripts.com/publicaciones/estados-del-documento-680).
