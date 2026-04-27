---
id: 613
permalink: el-archivo-facturascripts-ini-37
title: El archivo facturascripts.ini
creationdate: 27-04-2018 00:00:00
lastmod: 13-08-2025
url: https://facturascripts.com/publicaciones/el-archivo-facturascripts-ini-37
---

El archivo `facturascripts.ini` es imprescindible para cada plugin, ya que define información clave sobre el mismo. A continuación, se describen los campos que debe contener y las recomendaciones para su correcta utilización.

## Campos Obligatorios

- **name**: Indica el nombre del plugin. _Debe coincidir exactamente con el nombre del directorio del plugin_.
- **description**: Proporciona una descripción breve pero completa del plugin.
- **version**: Especifica la versión del plugin. _Debe ser un número entero o decimal_.
  - **Ejemplo correcto:** `version = 1.0`
  - **Ejemplo incorrecto:** `version = 1.0.1` (no se acepta formato triple)
  - **Ejemplo incorrecto:** `version = 1.0-beta` (se debe utilizar formato decimal)
- **min_version**: Establece la **versión mínima de FacturaScripts** necesaria para el funcionamiento del plugin.
  - **Ejemplo:** `min_version = 2025`

## Campos Opcionales

- **min_php**: Define la **versión mínima de PHP** requerida. _Debe usarse un formato decimal_.
  - **Ejemplo correcto:** `min_php = 8.2`
  - **Ejemplo incorrecto:** `min_php = 8.4.5`

- **require**: Lista los **plugins requeridos** para que el plugin funcione correctamente. Si son varios, deben estar separados por comas sin espacios.
  - **Ejemplo correcto:** `require = &#39;POS&#39;`
  - **Ejemplo incorrecto:** `require = &#39;POS, Servicios&#39;` (no se deben incluir espacios)
  - **Ejemplo correcto:** `require = &#39;POS,Servicios&#39;`

- **require_php**: Especifica las **extensiones de PHP necesarias**, separadas por comas sin espacios.
  - **Ejemplo correcto:** `require_php = &#39;soap&#39;`
  - **Ejemplo incorrecto:** `require_php = &#39;soap, imap&#39;` (no se deben incluir espacios)
  - **Ejemplo correcto:** `require_php = &#39;soap,imap&#39;`

- **compatible**: Indica los **plugins compatibles**. La lista debe escribirse sin espacios después de las comas.
  - **Ejemplo correcto:** `compatible = &#39;POS&#39;`
  - **Ejemplo incorrecto:** `compatible = &#39;POS, Servicios&#39;`
  - **Ejemplo correcto:** `compatible = &#39;POS,Servicios&#39;`

## Ejemplo de facturascripts.ini

A continuación se muestra un ejemplo básico del archivo:

```
name = &#39;MyNewPlugin&#39;
description = &#39;My fantastic new plugin for FacturaScripts&#39;
version = 1
min_version = 2025
```

Este ejemplo indica que se trata del plugin **MyNewPlugin**, en su versión **1**, y que requiere **FacturaScripts 2025** o una versión superior para su funcionamiento.

## Detalle del Campo: name

El campo **name** indica el nombre del plugin y _debe coincidir exactamente_ con el nombre del directorio en el que se encuentra el plugin. Errores comunes incluyen:

- Errores tipográficos en el nombre del archivo `facturascripts.ini` (por ejemplo, añadir o faltar una &#39;s&#39;).
- Inconsistencias entre el nombre del directorio y el valor del campo `name`.

### Ejemplos de Casos Correctos e Incorrectos

- **Correcto:**
  - Carpeta: `Miplugin`
  - Configuración: `name = &#39;Miplugin&#39;`

- **Incorrecto:**
  - Carpeta: `Mi plugin` y configuración: `name = &#39;Miplugin&#39;` (no se deben usar espacios en el nombre de la carpeta).
  - Carpeta: `Miplugin` y configuración: `name = &#39;MiPlugin&#39;` (la &#39;p&#39; debe estar en minúscula para mantener la coherencia).
