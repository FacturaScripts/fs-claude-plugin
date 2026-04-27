---
id: 3
permalink: reunion-de-desarrollo-27-11-2018
title: Reunión de desarrollo 27-11-2018
creationdate: 27-11-2018 10:57:11
lastmod: 27-11-2018
url: https://facturascripts.com/publicaciones/reunion-de-desarrollo-27-11-2018
---

En esta reunión hemos analizado los desarrollos de esta semana, que son dos grandes bloques:

## La web (plugins webportal y community)
La nueva web ya está **completada al 80%** y lo que resta de semana se trabajará para implementar la **pasarela de pago** para poder **comprar plugins**, que es a groso modo lo único que falta respecto a la web antigua.

La pasarela de pago, obviamente será una implementación reducida y no un tienda online propiamente dicha, puesto que en una semana no se puede hacer tanto. Pero es un comienzo para ir dotando a FacturaScripts de **capacidades de ecommerce**.

## Plugin tesorería
El plugin tesorería ya lleva unas semanas de desarrollo. El **diseño de los modelos** ya está muy avanzado y empieza a coger forma.

Se mantiene la disposición anterior de tener en compras los **listados de recibos** de facturas de compra y en ventas los recibos de facturas de venta. Como novedad se añade una **pestaña remesas** al lado de la de recibos (*tanto en compras como en venta*). Y es que ahora se soportan tanto remesas de compras como de ventas, puesto que se ha simplificado el concepto de remesas para aunar tanto las **remesas bancarias** como los pagos múltiples.

### Ejemplo
Un cliente con varios recibos de varias facturas las paga todas en un único pago. Anteriormente usaríamos el asistente para hacer el pago, pero claro, no queda constancia de que se han pagado a la vez, solamente de que están pagadas. Ahora crearemos una remesa, que no deja de ser una agrupación de recibos, y la marcamos como pagada. Los recibos quedan pagados y sabemos que han sido todos a la vez.

## Próxima reunión
El equipo de desarrollo se reune **todos los martes** a las **10:30** (hora española) en el canal de FacturaScripts en jitsi.
https://meet.jit.si/facturascripts
