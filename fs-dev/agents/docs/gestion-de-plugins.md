---
id: 1600
permalink: gestion-de-plugins
title: Gestión de Plugins
creationdate: 21-11-2023 21:29:39
lastmod: 13-03-2025
url: https://facturascripts.com/gestion-de-plugins
---
En FacturaScripts, podemos gestionar los plugins de diversas maneras: activar, desactivar, verificar si un plugin específico está activado y obtener su versión. Para ello, utilizamos la clase `Plugins`.

## ¿Está el Plugin Instalado y Activado?

Para comprobar si un plugin está instalado y activado, podemos utilizar las funciones `Plugins::isInstalled()` y `Plugins::isEnabled()`.

```php
if (Plugins::isInstalled(&#39;Proyectos&#39;)) {
    // El plugin Proyectos está instalado
}

if (Plugins::isEnabled(&#39;Proyectos&#39;)) {
    // El plugin Proyectos está instalado y activado
}
```

## Comprobar la Versión de un Plugin

Si necesitamos verificar la versión instalada de un plugin, utilizamos la función `Plugins::get()`. 

```php
$plugin = Plugins::get(&#39;Proyectos&#39;);
if ($plugin) {
    echo $plugin-&gt;version;
}
```

Es importante tener en cuenta que si el plugin no está instalado, la función devolverá `null`. Podemos combinarla con `isEnabled()` para asegurarnos de que el plugin está activado:

```php
if (Plugins::isEnabled(&#39;Proyectos&#39;) && Plugins::get(&#39;Proyectos&#39;)-&gt;version &gt;= 3) {
    // El plugin Proyectos está instalado, activado y es la versión 3 o superior
}
```

## Lista de Plugins Activados

Para obtener una lista de los plugins actualmente activados, utilizamos la función `Plugins::enabled()`.

```php
var_dump(Plugins::enabled());
```

## Activar un Plugin

Para activar un plugin, simplemente llamamos a la función `Plugins::enable()`, como se muestra a continuación:

```php
if (Plugins::enable(&#39;Proyectos&#39;)) {
    // El plugin se ha activado correctamente
}
```

## Desactivar un Plugin

Para desactivar un plugin, utilizamos la función `Plugins::disable()`. A continuación se muestra un ejemplo:

```php
if (Plugins::disable(&#39;Proyectos&#39;)) {
    // El plugin se ha desactivado correctamente
}
```
