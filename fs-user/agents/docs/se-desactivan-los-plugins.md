---
id: 1951
permalink: se-desactivan-los-plugins
title: Se desactivan los plugins
creationdate: 19-12-2024 23:33:26
lastmod: 04-08-2025
url: https://facturascripts.com/publicaciones/se-desactivan-los-plugins
---
Existen varias formas de deshabilitar los plugins:

- Desde el **menú Administrador → Plugins**.
- Eliminando el archivo ``MyFiles/plugins.json``
- Desde una pantalla de error, pulsando el botón de **desactivar plugins**.
- Desde el actualizador.

![pantalla error core](https://facturascripts.com/MyFiles/2024/12/2449.png?myft=6bc3e1ade96b3624ba1d42f7badde6c4c9ed81ba)

## 🚨 Pantalla de error
La pantalla de error de FacturaScripts aparece si se produce un error. Esta pantalla, además de proporcionar más información sobre el fallo, permite:

- Enviarnos un informe del error, para que podamos revisarlo y lanzar actualización.
- Desactivar los plugins. Así los usuarios menos avanzados pueden seguir trabajando si alguno de los plugins falla.
- Reconstruir el Dinamic.

Si quiere impedir que se puedan desactivar los plugins desde la pantalla de error, abra [el archivo config.php](https://facturascripts.com/publicaciones/el-archivo-config-php) de FacturaScripts y ponga a ``false`` la constante ``FS_DISABLE_DEPLOY_ACTIONS``.

## 🚀 Actualizador
El actualizador nos avisará cuando tengamos plugins que todavía no han sido marcados como compatibles con la versión de FacturaScripts que vamos a instalar. En este caso al actualizar se desactivan esos plugins para evitar problemas, a menos que seleccionemos **no desactivar plugins**.

![no desactivar plugins al actualizar](https://facturascripts.com/MyFiles/2025/05/2797.png?myft=c9cbee3b4aca8f0907fae02256afc2c8c7aefb70)

## 📜 Historial
Cada vez que se activa o desactiva un plugin queda un rastro en el historial, que puedes ver desde el **menú Administrador → Logs**, aplicando el filtro de canal **core**.