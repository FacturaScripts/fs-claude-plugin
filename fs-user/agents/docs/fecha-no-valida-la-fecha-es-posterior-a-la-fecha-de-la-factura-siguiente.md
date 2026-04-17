---
id: 966
permalink: fecha-no-valida-la-fecha-es-posterior-a-la-fecha-de-la-factura-siguiente
title: Fecha no válida. La fecha es posterior a la fecha de la factura siguiente
creationdate: 01-08-2021 13:45:06
lastmod: 30-03-2026
url: https://facturascripts.com/fecha-no-valida-la-fecha-es-posterior-a-la-fecha-de-la-factura-siguiente
---
Las facturas son documentos mercantiles y tienen una serie de requisitos legales que se deben cumplir, como son: los números y fechas deben ser correlativos, sin huecos. Por ejemplo, si la factura 11 tiene fecha del 03-11-2021, la factura 12 **no puede tener** fecha del 01-11-2021.

## Caso práctico
Tenemos 20 facturas de venta, la fecha de la última factura es del 12-11-2021 y queremos cambiar la fecha de la nº19. Primero, **esto no se debe hacer**, ese es el primer fallo. Pero si continuamos y cambiamos la fecha de la factura 19 al 13-11-2021, FacturaScripts nos lo impedirá y mostrará el mensaje de ``Fecha no válida. La fecha es posterior a la fecha de la factura siguiente.``

### Series
Si necesita facturar a ritmos distintos, por ejemplo porque hace ventas a diario, pero también atiende a algunos clientes a los que factura a final de mes, lo ideal sería que crease [series distintas](/publicaciones/series-470) para estos casos, así las ventas de diario las puede tener en una serie y el resto en otra.

### Albaranes
Si en su negocio estaba acostumbrado a modificar las facturas a posteriori, mejor trabaje con [albaranes](/como-hacer-un-albaran-de-venta), que no tienen estas restricciones. Y genere las facturas a final de mes.
