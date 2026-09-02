---
id: 1998
permalink: no-se-actualizan-los-saldos-de-las-cuentas
title: No se actualizan los saldos de las cuentas
creationdate: 13-01-2025 00:10:35
lastmod: 22-07-2026
url: https://facturascripts.com/publicaciones/no-se-actualizan-los-saldos-de-las-cuentas
---
Si tras hacer un asiento no se actualizan los **saldos de las cuentas** o **subcuentas**, probablemente tenga trabajos en segundo plano pendientes. Puede comprobar esto desde el **menú Administrador → Logs**. En la pestaña **eventos de trabajo** puede ver todos, incluídos los que todavía no se han completado.

![cola de trabajos pendientes](https://facturascripts.com/MyFiles/2025/01/2521.png?myft=9b25c82259ddb1716614d95408d8b25e45933ea8)

En la versión 2024 añadimos una **cola de trabajos en segundo plano**, para mover ahí todos los procesos de actualización de saldos y contadores. Procesos que no son críticos y que al mover aquí podíamos mejorar el rendimiento de forma general.

Los procesos en segundo plano se van ejecutando en cada página de FacturaScripts y cuando [se ejecuta el cron](https://facturascripts.com/publicaciones/el-cron-104). Así que si tiene muchos procesos pendientes, ejecute el cron o simplemente abra algunas páginas de FacturaScripts y verá como se van completando.

## Mantenga FacturaScripts actualizado
Puesto que la cola de trabajos es algo nuevo que introdujimos en la versión 2024, con cada actualización hemos solucionado los problemas encontrados y la hemos optimizado. Actualice FacturaScripts de forma regular para tener siempre las últimas mejoras en la cola de trabajos.