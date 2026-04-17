---
id: 965
permalink: fecha-no-valida-ya-hay-facturas-con-fecha-posterior
title: Fecha no válida. Ya hay facturas con fecha posterior
creationdate: 01-08-2021 13:35:28
lastmod: 30-03-2026
url: https://facturascripts.com/fecha-no-valida-ya-hay-facturas-con-fecha-posterior
---
Las facturas son documentos mercantiles y tienen una serie de **restricciones legales** que se deben cumplir, entre ellas: la numeración y fechas debe ser correlativa, sin huecos.

## Ejemplo
Si la factura 13 tiene fecha del 11-10-2024, la factura 14 no puede tener fecha del 10-10-2024, porque eso es anterior. En estos casos, cuando intentamos guardar la factura 14, nos mostrará el mensaje ``Fecha no válida. Ya hay facturas con fecha posterior``.

### Solución
Para este ejemplo, lo correcto es asignar la fecha 11-10-2024 a la factura 14. Así evitamos el problema.

### Series
Si necesita facturar a ritmos distintos, por ejemplo porque hace ventas a diario, pero también atiende a algunos clientes a los que factura a final de mes, lo ideal sería que crease [series distintas](/publicaciones/series-470) para estos casos, así las ventas de diario las puede tener en una serie y el resto en otra.

### Albaranes
Si en su negocio es habitual hacer las facturas a posteriori, lo recomendable es que trabaje con [albaranes](/como-hacer-un-albaran-de-venta), no con facturas. Los albaranes no tienen esta restricción y se pueden agrupar en facturas rápida y cómodamente.
