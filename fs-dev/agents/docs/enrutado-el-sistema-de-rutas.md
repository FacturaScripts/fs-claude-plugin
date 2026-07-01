---
id: 1626
permalink: enrutado-el-sistema-de-rutas
title: Enrutado
creationdate: 05-12-2023 00:10:16
lastmod: 29-05-2025
url: https://facturascripts.com/publicaciones/enrutado-el-sistema-de-rutas
---
FacturaScripts almacena las rutas disponibles en el archivo `MyFiles/routes.json`. Este archivo se actualiza automáticamente cada vez que se instala, desinstala o actualiza un plugin. También al reconstruir.

## ⚡ Enrutado automático
Por defecto FacturaScripts asigna una ruta a cada controlador, con el nombre del propio controlador. Por ejemplo: la ruta `/ListProducto` ejecuta el controlador `ListProducto.php`.

Además, la ruta `/` ejecuta el controlador configurado como página de inicio en los ajustes (por defecto, `Root`).

## 🔧 Rutas especiales
Existen algunas rutas especiales que añade directamente el kernel:

- `/` : ejecuta la página de inicio, o el instalador si todavía no hay base de datos configurada.
- `/AdminPlugins` : ejecuta el panel de plugins.
- `/api` y `/api/*` : ejecutan la API. Además existen rutas `/api/3/...` para endpoints concretos: crear y exportar documentos de compra y venta, pagar facturas, archivos adjuntos, imágenes de productos, subir archivos y gestionar plugins.
- `/Core/Assets/*` : ejecuta el controlador Files.
- `/cron` : ejecuta el cron de cada plugin.
- `/deploy` : reconstruye la carpeta Dinamic y el archivo de rutas, siempre que no exista ya el directorio Dinamic.
- `/Dinamic/Assets/*` : ejecuta el controlador Files.
- `/login` : ejecuta el formulario de login.
- `/MyFiles/*` : ejecuta el controlador Myfiles, que filtra que no se accedan a archivos confidenciales sin el correspondiente token de autorización.
- `/node_modules/*` : ejecuta el controlador Files.
- `/Plugins/*` : ejecuta el controlador Files.
- `/Updater` : ejecuta el actualizador.

Las rutas especiales exactas se añaden con posición 1 y las de comodín con posición 2, mientras que las rutas de los controladores (y las que añadas manualmente) tienen posición 0 por defecto. Como las rutas se evalúan de menor a mayor posición, cualquier ruta tuya tiene preferencia sobre las especiales.

## ✍️ Enrutado manual
Pero también podemos añadir rutas personalizadas llamando directamente a `Kernel::addRoute()`. Por ejemplo, vamos a hacer que el controlador `ListProducto.php` también se ejecute para la ruta `/productos`:

```php
use FacturaScripts\Core\Kernel;

Kernel::addRoute(&#39;/productos&#39;, &#39;ListProducto&#39;);
```

Si queremos hacer esto en nuestro plugin, lo ideal es colocar esta llamada en la función `init()` del [archivo Init.php del plugin](https://facturascripts.com/publicaciones/el-archivo-init-php-307). También podemos añadir una función a ejecutar cada vez que se reconstruya el archivo de rutas, por ejemplo para tener más control:

```php
Kernel::addRoutes(function () {
	// tu código aquí
	// por ejemplo, puedes leer de una tabla y después, para cada registro, llamar a la función addRoute()
	// Kernel::addRoute(...);
});
```

## 🎯 Cómo se resuelve la URL
Una URL ejecuta una ruta si coincide exactamente con ella, o si la ruta termina en `*` y la URL comienza por ese prefijo. El comodín solo puede ir al final de la ruta. Se ejecuta el controlador de la primera ruta que encaje, evaluándolas de menor a mayor posición.

## 🔢 Prioridades en las rutas
Podemos controlar las prioridades en las rutas, es decir, que una ruta tenga preferencia sobre otra, con el tercer parámetro, `position`: por defecto es 0. Las rutas se ordenan de menor posición a mayor. Si pones un número mayor, la ruta va después de todas las rutas con posición 0, y si pones un número menor, va antes que el resto.

```php
Kernel::addRoute(&#39;/productos/*&#39;, &#39;ProductoController&#39;); // esta ruta va primero
Kernel::addRoute(&#39;/productos/mios/*&#39;, &#39;MiProductoController&#39;); // esta ruta va después
```

En este ejemplo, cuando accedamos a la ruta `/productos/mios/1` se ejecutará el controlador `ProductoController`, porque esa ruta es compatible y se ha añadido antes. Si queremos que la segunda ruta se evalúe antes, podemos ponerle una posición -1:

```php
Kernel::addRoute(&#39;/productos/*&#39;, &#39;ProductoController&#39;);
Kernel::addRoute(&#39;/productos/mios/*&#39;, &#39;MiProductoController&#39;, -1); // esta ruta va antes que el resto
```

Ahora al entrar en la ruta `/productos/mios/1` se ejecutará el controlador `MiProductoController`, ya que esa ruta se ha añadido con una posición anterior a la primera. Recuerda: **las rutas se ordenan de menor a mayor posición**.

## 🆔 Rutas con identificador (customId)
El cuarto parámetro de `addRoute()` es un identificador opcional. Al añadir una ruta con un `customId`, se elimina antes cualquier ruta anterior que tenga ese mismo identificador. Es útil para rutas dinámicas, por ejemplo las leídas de una tabla: si la ruta cambia, basta con volver a añadirla con el mismo identificador y la anterior desaparece, sin dejar rutas huérfanas.

```php
Kernel::addRoute(&#39;/promo-verano&#39;, &#39;MiLanding&#39;, 0, &#39;mi-plugin-landing&#39;);

// más adelante, la promo cambia de url; la ruta anterior se reemplaza
Kernel::addRoute(&#39;/promo-invierno&#39;, &#39;MiLanding&#39;, 0, &#39;mi-plugin-landing&#39;);
```