---
id: 1600
permalink: gestion-de-plugins
title: Gestión de Plugins
creationdate: 21-11-2023 21:29:39
lastmod: 13-03-2025
url: https://facturascripts.com/publicaciones/gestion-de-plugins
---
En FacturaScripts, podemos gestionar los plugins de diversas maneras: activar, desactivar, verificar si un plugin específico está activado y obtener su versión. Para ello, utilizamos la clase `Plugins`.

```php
use FacturaScripts\Core\Plugins;
```

Esta página describe cómo gestionar los plugins desde código. Si lo que buscas es instalar o activar plugins como usuario, desde el menú de administración, consulta [Cómo instalar un plugin en FacturaScripts](https://facturascripts.com/publicaciones/como-instalar-un-plugin-en-facturascripts). También se pueden gestionar de forma remota desde la API, como se explica al final de esta página.

## 🔍 ¿Está el Plugin Instalado y Activado?

Para comprobar si un plugin está instalado y activado, podemos utilizar las funciones `Plugins::isInstalled()` y `Plugins::isEnabled()`.

```php
if (Plugins::isInstalled(&#39;Proyectos&#39;)) {
    // El plugin Proyectos está instalado
}

if (Plugins::isEnabled(&#39;Proyectos&#39;)) {
    // El plugin Proyectos está instalado y activado
}
```

## 📦 Obtener los Datos de un Plugin

Si necesitamos verificar la versión instalada de un plugin, utilizamos la función `Plugins::get()`. 

```php
$plugin = Plugins::get(&#39;Proyectos&#39;);
if ($plugin) {
    echo $plugin-&gt;version;
}
```

Es importante tener en cuenta que si el plugin no existe, la función devolverá `null`. Podemos combinarla con `isEnabled()` para asegurarnos de que el plugin está activado:

```php
if (Plugins::isEnabled(&#39;Proyectos&#39;) && Plugins::get(&#39;Proyectos&#39;)-&gt;version &gt;= 3) {
    // El plugin Proyectos está instalado, activado y es la versión 3 o superior
}
```

El objeto devuelto contiene los datos del plugin: `name`, `description`, `version`, `enabled`, `installed`, `order` (orden de carga), y los requisitos de su [facturascripts.ini](https://facturascripts.com/publicaciones/el-archivo-facturascripts-ini-37): `min_version`, `min_php`, `require` y `require_php`.

## 📋 Lista de Plugins

Para obtener una lista con los nombres de los plugins actualmente activados, utilizamos la función `Plugins::enabled()`. Los nombres se devuelven según el orden de activación, que es también el orden en que se cargan los plugins.

```php
var_dump(Plugins::enabled());
```

Si lo que queremos es la lista completa de objetos `Plugin` (activados o no), usamos la función `Plugins::list()`. El primer parámetro indica si se incluyen también los plugins ocultos, y el segundo el campo de ordenación: `name` (por defecto) u `order`.

```php
foreach (Plugins::list() as $plugin) {
    echo $plugin-&gt;name . &#39; &#39; . $plugin-&gt;version . PHP_EOL;
}
```

## ✅ Activar un Plugin

Para activar un plugin, simplemente llamamos a la función `Plugins::enable()`, como se muestra a continuación:

```php
if (Plugins::enable(&#39;Proyectos&#39;)) {
    // El plugin se ha activado correctamente
}
```

La función devuelve false si el plugin no existe, si la carpeta no coincide con el nombre del plugin, o si no se cumplen las dependencias: plugins de `require` activados, extensiones de `require_php` instaladas y compatibilidad con la versión del core y de PHP. Si el plugin ya estaba activado, devuelve true.

## ❌ Desactivar un Plugin

Para desactivar un plugin, utilizamos la función `Plugins::disable()`. A continuación se muestra un ejemplo:

```php
if (Plugins::disable(&#39;Proyectos&#39;)) {
    // El plugin se ha desactivado correctamente
}
```

Tenga en cuenta que al desactivar un plugin, también se desactivan automáticamente los plugins activados que dependan de él.

## ⬇️ Instalar un Plugin desde un Zip

La función `Plugins::add()` instala un plugin a partir de su archivo zip. Antes de descomprimirlo comprueba que el zip contiene un único directorio raíz con su archivo `facturascripts.ini`, y que el plugin es compatible con la versión del core y de PHP. Si ya existía una versión anterior del plugin, se reemplaza; y si estaba activado, se despliegan los cambios.

```php
if (Plugins::add(&#39;/ruta/al/archivo.zip&#39;)) {
    // El plugin se ha instalado correctamente
}
```

La instalación de plugins se puede bloquear añadiendo `disable_add_plugins` a true en el `config.php`.

## 🗑️ Eliminar un Plugin

La función `Plugins::remove()` elimina el directorio del plugin. Solamente se puede eliminar un plugin que esté desactivado.

```php
if (Plugins::remove(&#39;Proyectos&#39;)) {
    // El plugin se ha eliminado correctamente
}
```

La eliminación de plugins se puede bloquear añadiendo `disable_rm_plugins` a true en el `config.php`.

## 🚀 Desplegar los Cambios

La función `Plugins::deploy()` reconstruye la carpeta `Dinamic` combinando el core con los plugins activados, regenera el archivo de [rutas](https://facturascripts.com/publicaciones/enrutado-el-sistema-de-rutas), actualiza la base de datos y limpia la caché. Las funciones `enable()`, `disable()` y `add()` ya la ejecutan automáticamente, por lo que rara vez tendrás que llamarla directamente.

```php
Plugins::deploy();
```

## 🌐 Gestionar Plugins desde la API

Los plugins también se pueden consultar, activar y desactivar de forma remota mediante [la API](https://facturascripts.com/publicaciones/la-api-rest-de-facturascripts-912), con el endpoint `/api/3/plugins`:

- `GET /api/3/plugins` : lista todos los plugins instalados.
- `GET /api/3/plugins/Proyectos` : devuelve la información del plugin Proyectos.
- `POST /api/3/plugins/Proyectos/enable` : activa el plugin Proyectos.
- `POST /api/3/plugins/Proyectos/disable` : desactiva el plugin Proyectos.