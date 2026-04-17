---
id: 941
permalink: fatal-error-allowed-memory-size-of-xxx-bytes-exhausted
title: Fatal error: Allowed memory size of XXX bytes exhausted
creationdate: 09-07-2021 10:49:10
lastmod: 17-02-2026
url: https://facturascripts.com/fatal-error-allowed-memory-size-of-xxx-bytes-exhausted
---
Si le aparece el error ``Fatal error: Allowed memory size of XXX bytes exhausted``, lo que significa es que el proceso PHP se ha quedado sin memoria para ejecutarse. No se refiere a espacio en disco o memoria RAM, se refiere al límite de memoria que tiene asignado PHP. Este límite varía en cada sistema, pero suele ser de 128MB.

## ¿Cómo soluciono el problema?
- Si el problema se presenta al **intentar imprimir un listado gigantesco** o bien al imprimir docenas de facturas a la vez, simplemente intente no imprimir tanto a la vez, o bien aumente el límite de memoria de PHP.
- ¿Falla desde que ha añadido un **logotipo**? Probablemente está usando un logotipo de resolución gigantesca. Mejor reduzca la resolución a algo más manejable como 800x600.
- Si el problema se presenta al hacer una **copia de seguridad** en un hosting, mejor haga la copia de seguridad desde el propio panel de control del hosting.

## Aumentar el límite de memoria de PHP
Si está usando un hosting, debe ponerse en contacto con el proveedor de hosting para que lo haga. Si la instalación es suya, puede aumentar el límite de memoria editando la constante **memory_limit** del archivo **php.ini**
