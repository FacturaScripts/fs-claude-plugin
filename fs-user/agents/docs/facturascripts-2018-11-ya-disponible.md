---
id: 94
permalink: facturascripts-2018-11-ya-disponible
title: FacturaScripts 2018.11 ya disponible
creationdate: 15-09-2019 13:37:11
lastmod: 29-12-2020
url: https://facturascripts.com/publicaciones/facturascripts-2018-11-ya-disponible
---

En esta actualización se ha mejorado el **asistente de configuración**, las interfaces para dispositivos móviles, la tolerancia a plugins rotos y una larga lista de mejorar para desarrolladores.

## Mejoras generales
- El **asistente de configuración** permite ahora rellenar más información de la empresa, como el nombre corto, el CIF/NIF, teléfonos, etc. Además al guardar redirige directamente al listado de facturas de venta, para que el flujo desde la instalación hasta la creación de la primera factura sea más rápido.
- La interfaz de los listados ahora se adapta mejor a pantallas más pequeñas, como las de los **smartphone**. Los elementos están ahora más separados y mejor organizados.
- Se ha mejorado la tolerancia a errores del **gestor de plugins**, de forma que ahora un plugin roto no bloqueará esta pantalla.

## Mejoras para desarrolladores
- Se ha añadido [whoops](https://github.com/filp/whoops) como **manejador de errores** cuando FacturaScripts está en **modo debug**. Este manejador nos da información más completa en caso de error, con una **traza**, una **previsualización del archivo y la línea con errores**, etc.
- Se ha sustituido la barra de debug (anteriormente **phpdebugbar**) por un componente propio con un mejor rendimiento.
- Se ha añadido **soporte para extensiones en los plugins**. De esta manera es posible que dos o más plugins modifiquen (sin solaparse) un mismo modelo, controlador, etc. Puede ver un ejemplo de uso de extensiones en el [código de SamplePlugin](https://github.com/FacturaScripts/SamplePlugin).
