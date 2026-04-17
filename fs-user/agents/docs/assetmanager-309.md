---
id: 694
permalink: assetmanager-309
title: AssetManager
creationdate: 30-04-2019 00:00:00
lastmod: 29-05-2025
url: https://facturascripts.com/assetmanager-309
---
El Assetmanager nos permitirá añadir archivos CSS y Javascript a la página.

## Dónde colocar los archivos en su plugin
- Coloque los archivos CSS en la carpeta **Assets/CSS/** de su plugin.
- Coloque los archivos JavaScript en la carpeta **Assets/JS/** de su plugin.
- Si los CSS o JavaScript son dependencias cargadas con NPM, entontes **no es necesario moverlos** de la carpeta node_modules de su plugin.

## Carga automática
FacturaScripts cargará automáticamente los archivos CSS y JavaScript que se llamen igual que el controlador. Si el controlador se llama **ListProducto**, cargará los archivos **Dinamic/Assets/CSS/ListProducto.css** y **Dinamic/Assets/JS/ListProducto.js** automáticamente, si existen.

### Cargar un CSS manualmente
Para cargar un CSS manualmente podemos llamar a la función ``AssetManager::addCss()`` o la función ``AssetManager::add(&#39;css&#39;)``.

```
use FacturaScripts\Dinamic\Lib\AssetManager;

AssetManager::addCss(FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/CSS/mycss.css&#39;);

// esta es una forma alternativa de añadir un css
AssetManager::add(&#39;css&#39;, FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/CSS/mycss.css&#39;);
```

En este caso estamos cargando el archivo mycss.css del plugin MyPlugin. Recuerde añadir el use FacturaScripts\Dinamic\Lib\AssetManager;

## Cargar un JS (Javascript) manualmente
Para cargar un archivo JavaScript manualmente podemos llamar a la función ``AssetManager::addJs()`` o bien ``AssetManager::add(&#39;js&#39;)``.

```
AssetManager::addJs(FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/JS/myFunctions.js&#39;);

// forma alternativa
AssetManager::add(&#39;js&#39;, FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/JS/myFunctions.js&#39;);
```

En este caso estamos cargando el archivo myFunctions.js del plugin MyPlugin. Recuerde añadir el use FacturaScripts\Dinamic\Lib\AssetManager;

## Carga con prioridad
Si necesita cargar un archivo antes que el resto, el tercer parámetro del método AssetManager::add($type, $location, $priority = 1) es la prioridad. Cuanto mayor sea la prioridad, antes se carga.

```
AssetManager::add(&#39;css&#39;, FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/CSS/mycss.css&#39;, 9);
```
