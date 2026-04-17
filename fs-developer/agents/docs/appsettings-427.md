---
id: 692
permalink: appsettings-427
title: Settings: opciones del panel de control
creationdate: 22-10-2018 00:00:00
lastmod: 07-04-2026
url: https://facturascripts.com/appsettings-427
---
En ocasiones queremos leer y escribir información referente a la configuración general o de nuestro plugin en concreto. Para estos casos FacturaScripts ofrece un modelo ``Settings`` con una serie de funciones de acceso rápido para leer y escribir, además de una forma sencilla de [añadir secciones al panel de control mediante archivos en la carpeta XMLView](/publicaciones/preferencias-de-la-aplicacion-314).

## Leer datos de Settings
La información de settings se organiza en **grupos** y **propiedades**. Cada una de las secciones que ve en el panel de control es un grupo, y cada campo es una propiedad. Si queremos consultar una propiedad podemos usar la función ``Tools::settings()``.

```
Use FacturaScripts\Core\Tools;

$coddivisa = Tools::settings(&#39;default&#39;, &#39;coddivisa&#39;);
```

En este ejemplo estamos consultando la divisa predeterminada, que se encuentra en el campo ``coddivisa`` del grupo ``default``. En otros casos puede que no tengamos un valor almacenado, por lo que podemos establecer un **valor predeterminado** en el tercer parámetro de la función.

```
$coddivisa = Tools::settings(&#39;default&#39;, &#39;coddivisa&#39;, &#39;EUR&#39;);
// si por algún motivo no estuviese guardado un valor de &#39;coddivisa&#39;, se devuelve &#39;EUR&#39;
```

### Leer desde twig
También podemos consultar esto desde las plantillas html usando la función ``settings()``.

```
{{ settings(&#39;default&#39;, &#39;coddivisa&#39;) }}
```

### Modificar datos de Settings
Si queremos modificar los datos de settings, podemos usar la función ``Tools::settingsSet()``, que modifica la propiedad que indiquemos, pero sin guardar los cambios. Para guardarlos en la base de datos debemos usar la función ``Tools::settingsSave()``.

```
Tools::settingsSet(&#39;default&#39;, &#39;coddivisa&#39;, &#39;USD&#39;); // establecemos la divisa USD como predeterminada
Tools::settingsSave(); // guardamos los cambios
```

## Leer datos del config.php
Algunos datos como el nombre de la base de datos se almacenan en el archivo [config.php](/publicaciones/el-archivo-config-php) y no pueden ser modificados desde el programa. Pero pueden ser consultados con la función ``Tools::config()``.

```
$db_name = Tools::config(&#39;db_name&#39;);
```

En este ejemplo estamos consultando el nombre de la base de datos. Los nombres de las propiedades se pueden escribir tal cual aparecen en el [config.php](/publicaciones/el-archivo-config-php), en este caso ``FS_DB_NAME``, o se pueden escribir sin el prefijo ``FS_`` y en minúsculas, para mayor comodidad.

Esta función también admite establecer un **valor predeterminado** en caso de que no se encuentre en el config:

```
$mi_propiedad = Tools::config(&#39;mi_propiedad&#39;, &#39;valor1&#39;);
// si mi_propiedad no está definido en el config, se devuelve el valor &#39;valor1&#39;
```

También podemos consultar estas propiedades desde twig con la función ``config()``:

```
{{ config(&#39;db_name&#39;) }}
```
