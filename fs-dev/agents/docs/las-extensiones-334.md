---
id: 697
permalink: las-extensiones-334
title: Las extensiones
creationdate: 23-02-2020 00:00:00
lastmod: 11-07-2026
url: https://facturascripts.com/publicaciones/las-extensiones-334
---
Las extensiones son una forma sencilla para que los plugins modifiquen o añadan funciones nuevas a controladores, modelos, tablas o vistas de otros plugins (o del core), internamente el programa lo **pipe()**.

## No son herencia
Las extensiones o pipes no son herencia. Cuando en una extensión añades código a ejecutar durante el guardado de un modelo en la base de datos, no estás heredando del modelo, sino que estás &quot;incrustando&quot; este nuevo código en el archivo original. Por eso varios plugins pueden añadir extensiones a un mismo archivo, mientras que con herencia no es posible.

## Sólo en archivos soportados
No es posible añadir extensiones a cualquier archivo imaginable. Solamente en aquellos soportados:

- [Extensiones de tablas](https://facturascripts.com/publicaciones/extensiones-de-tablas)
- [Extensiones de modelos](https://facturascripts.com/publicaciones/extensiones-de-modelos)
- [Extensiones de controladores](https://facturascripts.com/publicaciones/extensiones-de-controladores)
- [Extensiones de XMLViews](https://facturascripts.com/publicaciones/extensiones-de-xmlview)
- [Extensiones de vistas HTML](https://facturascripts.com/publicaciones/extensiones-de-vistas-html)

### Extensiones no soportadas
No es posible añadir extensiones a los archivos de:

- Core/Base
- Core/Model/Base
- Core/Lib/ExtendedController

## Extensiones de archivos XML
Las extensiones de archivos xml se aplican automáticamente. Si creas un archivo Extension/Table/productos.xml, el contenido de ese archivo se fusionará automáticamente con el del archivo original. El resultado se almacena en la Dinamic/Table/productos.xml, que es el archivo que utiliza finalmente FacturaScripts.

## Extensiones de archivos PHP (controladores y modelos)
Las extensiones de archivos PHP no se cargan automáticamente. Es necesario cargarlas en el archivo [Init.php](https://facturascripts.com/publicaciones/el-archivo-init-php-307) del plugin.

```php
public function init(): void
{
    $this-&gt;loadExtension(new Extension\Controller\ListProducto());
}
```

### La clase de extensión
Cada extensión es una clase cuyos métodos devuelven un `Closure`. El nombre de cada método debe coincidir con el punto de extensión (el `pipe()`) que ofrece el controlador o modelo. Dentro del `Closure`, `$this` es la instancia del objeto extendido:

```php
namespace FacturaScripts\Plugins\MyNewPlugin\Extension\Controller;

use Closure;

class ListProducto
{
    public function createViews(): Closure
    {
        return function () {
            // $this es el controlador ListProducto que se está extendiendo
            // aquí se añade el código nuevo, por ejemplo una vista o un botón
        };
    }
}
```

Puntos de extensión habituales en los controladores son `createViews`, `loadData`, `execPreviousAction`, `execAfterAction`, y en los modelos `saveInsertBefore`, `saveUpdateBefore`, `delete`, etc. Si un método de la extensión no devuelve un `Closure`, FacturaScripts lanzará una excepción. En los puntos que usan `pipeFalse()` (como `saveBefore` o `execPreviousAction`), devolver `false` dentro del `Closure` detiene la ejecución del resto de la cadena.