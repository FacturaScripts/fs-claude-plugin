---
id: 694
permalink: assetmanager-309
title: AssetManager
creationdate: 30-04-2019 00:00:00
lastmod: 29-05-2025
url: https://facturascripts.com/publicaciones/assetmanager-309
---
`AssetManager` nos permite añadir archivos CSS y JavaScript a la página.

## 📂 Dónde colocar los archivos en su plugin
- Coloque los archivos CSS en la carpeta `Assets/CSS/` de su plugin.
- Coloque los archivos JavaScript en la carpeta `Assets/JS/` de su plugin.
- Si los CSS o JavaScript son dependencias cargadas con NPM, entonces no es necesario moverlos de la carpeta `node_modules` de su plugin.

## ⚡ Carga automática
FacturaScripts cargará automáticamente los archivos CSS y JavaScript que se llamen igual que el controlador. Si el controlador se llama `ListProducto`, cargará los archivos `Dinamic/Assets/CSS/ListProducto.css`, `Dinamic/Assets/JS/ListProducto.js` y `Dinamic/Assets/JS/ListProducto.mjs` (módulo JavaScript) automáticamente, si existen.

Estos archivos se añaden con prioridad 0, por lo que se cargan después de los añadidos manualmente, que tienen prioridad 1 por defecto.

## 🎨 Cargar un CSS manualmente
Para cargar un CSS manualmente podemos llamar a la función `AssetManager::addCss()` o la función `AssetManager::add(&#39;css&#39;)`.

```php
use FacturaScripts\Dinamic\Lib\AssetManager;

AssetManager::addCss(FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/CSS/mycss.css&#39;);

// esta es una forma alternativa de añadir un css
AssetManager::add(&#39;css&#39;, FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/CSS/mycss.css&#39;);
```

En este caso estamos cargando el archivo `mycss.css` del plugin MyPlugin. Recuerde añadir el `use FacturaScripts\Dinamic\Lib\AssetManager;`

Si la misma ruta se añade varias veces, las repeticiones se ignoran: no se cargará el archivo dos veces.

## 📜 Cargar un JS (JavaScript) manualmente
Para cargar un archivo JavaScript manualmente podemos llamar a la función `AssetManager::addJs()` o bien `AssetManager::add(&#39;js&#39;)`.

```php
AssetManager::addJs(FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/JS/myFunctions.js&#39;);

// forma alternativa
AssetManager::add(&#39;js&#39;, FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/JS/myFunctions.js&#39;);
```

En este caso estamos cargando el archivo `myFunctions.js` del plugin MyPlugin. Recuerde añadir el `use FacturaScripts\Dinamic\Lib\AssetManager;`

## 🧩 Cargar un módulo JavaScript
Si el archivo JavaScript usa `import`/`export` (módulos ES), debe cargarse con `AssetManager::addJsModule()` o `AssetManager::add(&#39;mjs&#39;)`, para que se incluya en la página como `&lt;script type=&quot;module&quot;&gt;`. Los módulos se cargan después de los JavaScript normales.

```php
AssetManager::addJsModule(FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/JS/myModule.mjs&#39;);
```

## 🔢 Carga con prioridad
Si necesita cargar un archivo antes que el resto, puede indicar la prioridad como segundo parámetro de `addCss()`, `addJs()` y `addJsModule()`, o como tercer parámetro de `add()`. Cuanto mayor sea la prioridad, antes se carga. Si no se indica, la prioridad es 1.

```php
AssetManager::addCss(FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/CSS/mycss.css&#39;, 9);

// forma alternativa
AssetManager::add(&#39;css&#39;, FS_ROUTE . &#39;/Plugins/MyPlugin/Assets/CSS/mycss.css&#39;, 9);
```