---
id: 123
permalink: problemas-al-actualizar-facturascripts-2017
title: ¿Problemas al actualizar FacturaScripts 2017?
creationdate: 04-03-2020 19:55:37
lastmod: 09-03-2020
url: https://facturascripts.com/publicaciones/problemas-al-actualizar-facturascripts-2017
---

En los últimos días hemos observado que el **actualizador de FacturaScripts 2017** tenías problemas al descargar algunas actualizaciones. Finalmente hemos encontrado el problema en un cambio en **las cabeceras de github**. Al redirecciar han cambiado la cabecera Location por location en minúscula. Ya está solucionado en la última actualización.

## Síntomas
Si al descargar actualizaciones del **núcleo** o de **plugins gratuitos** obtienes errores, es mejor que apliques estos cambios.

## Solución
Edita el archivo **fs_functions.php** del **directorio base** de FacturaScripts. A continuación localiza la línea:
```
preg_match(&quot;/(Location:|URI:)[^(\n)]*/&quot;, $header, $matches);
```
**Y cámbiala por esta otra**:
```
preg_match(&quot;/(Location:|URI:)[^(\n)]*/i&quot;, $header, $matches);
```
Con este cambio ya deberías poder actualizar sin problemas. Si continuan los problemas, usa la **sección contacto**.
