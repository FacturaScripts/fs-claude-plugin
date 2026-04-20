---
id: 1626
permalink: enrutado-el-sistema-de-rutas
title: Enrutado
creationdate: 05-12-2023 00:10:16
lastmod: 29-05-2025
url: https://facturascripts.com/enrutado-el-sistema-de-rutas
---
FacturaScripts almacena las rutas disponibles en el archivo ``MyFiles/routes.json``. Este archivo se actualiza automáticamente cada vez que se instala, desinstala o actualiza un plugin. También al reconstruir.

### Enrutado automático
Por defecto FacturaScripts asigna una ruta a cada controlador, con el nombre del propio controlador. Por ejemplo: la ruta ``/ListProducto`` ejecuta el controlador ``ListProducto.php``

### Rutas especiales
Existen algunas rutas especiales que añade directamente el kernel:

- ``/api`` : ejecuta la API.
- ``/Core/Assets/*`` : ejecuta el controlador Files.
- ``/cron`` : ejecuta el cron de cada plugin.
- ``/deploy`` : reconstruye la carpeta Dinamic y el archivo de rutas, siempre que no exista ya el directorio Dinamic.
- ``/Dinamic/Assets/*`` : ejecuta el controlador Files.
- ``/install`` : ejecuta el instalador.
- ``/login`` : ejecuta el formulario de login.
- ``/MyFiles/*`` : ejecuta el controlador Myfiles, que filtra que no se accedan a archivos confidenciales sin el correspondiente token de autorización.
- ``/node_modules/*`` : ejecuta el controlador Files.
- ``/Plugins/*`` : ejecuta el controlador Files.

### Enrutado manual
Pero también podemos añadir rutas personalizadas llamando directamente a **Kernel::addRoute()**. Por ejemplo, vamos a hacer que el controlador ``ListProducto.php`` también se ejecute para la ruta ``/productos``:

```
use FacturaScripts\Core\Kernel;

Kernel::addRoute(&#39;/productos&#39;, &#39;ListProducto&#39;);
```

Si queremos hacer esto en nuestro plugin, lo ideal es colocar esta llamada en la función ``init()`` del [archivo Init.php del plugin](https://facturascripts.com/publicaciones/el-archivo-init-php-307). También podemos añadir una función a ejecutar cada vez que se reconstruya el archivo de rutas, por ejemplo para tener más control:

```
Kernel::addRoutes(function () {
	// tu código aquí
	// por ejemplo, puedes leer de una tabla y después, para cada registro, llamar a la función addRoute()
	// Kernel::addRoute(...);
});
```

### Prioridades en las rutas
Podemos controlar las **prioridades** en las rutas, es decir, que una ruta tenga preferencia sobre otra, con el tercer parámetro, ``position``: **por defecto es 0**. Las rutas se ordenan de menor posición a mayor. Si pones un número mayor, la ruta va después de todas las rutas con posición 0, y si pones un número menor, va antes que el resto.

```
Kernel::addRoute(&#39;/productos/*&#39;, &#39;ProductoController&#39;); // esta ruta va primero
Kernel::addRoute(&#39;/productos/mios/*&#39;, &#39;MiProductoController&#39;); // esta ruta va después
```

En este ejemplo, cuando accedamos a la ruta ``/productos/mios/1`` se ejecutará el controlador ``ProductoController``, porque esa ruta es compatible y se ha añadido antes. Si queremos que la segunda ruta se evalúe antes, podemos ponerle una posición -1:

```
Kernel::addRoute(&#39;/productos/*&#39;, &#39;ProductoController&#39;);
Kernel::addRoute(&#39;/productos/mios/*&#39;, &#39;MiProductoController&#39;, -1); // esta ruta va antes que el resto
```

Ahora al entrar en la ruta ``/productos/mios/1`` se ejecutará el controlador ``MiProductoController``, ya que esa ruta se ha añadido con una posición anterior a la primera. Recuerda: **las rutas se ordenan de menor a mayor posición**.
