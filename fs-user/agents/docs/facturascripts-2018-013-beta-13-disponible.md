---
id: 4
permalink: facturascripts-2018-013-beta-13-disponible
title: FacturaScripts 2018.013 (beta 13) disponible
creationdate: 03-12-2018 12:41:57
lastmod: 03-12-2018
url: https://facturascripts.com/publicaciones/facturascripts-2018-013-beta-13-disponible
---

Ya podéis descargar la beta 13 de FacturaScripts 2018. Esta nueva ronda de betas están enfocadas en facilitar el desarrollo del plugin webportal, sobre el que se construye la web.

## Novedades
Las novedades de esta beta son respecto al tratamiento de contactos:
- Se ha añadido la traducción al **valenciano**. Gracias a **amparginer_1156** y **raloses_1155**.
- Se han añadidos las funciones getCustomer() y getSupplier() al modelo contacto.
- Para cada cliente o proveedor nuevo, ahora se crea un contacto asociado, lo que hace más intuitivo añadir direcciones.
- Se admite contacto como sujeto de un documento de venta. Esto facilita mucho la parte de ecommerce (*el nuevo plugin ecommerce*), puesto que podemos crear nuevos prespuestos y pedidos sabiendo únicamente el contacto que los crea.
- Se ha añadido la función getAvaliableStatus() a los documentos, de tal forma que podemos consultar los disponibles y alterar el estado con muy poco código.

### Cómo actualizar
Como siempre, puedes actualizar desde el menú admin -&gt; panel de control -&gt; actualizador.

### Cambios en la web
La pasarela de pago ya ha sido probada con éxito, pero se ha retrasado el cambio definitivo en la web para tener unos días más para hacer pruebas. El cambio definitivo sucederá en los próximos días.
