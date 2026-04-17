---
id: 1599
permalink: gestion-de-errores
title: Gestión de Errores en FacturaScripts
creationdate: 21-11-2023 21:26:26
lastmod: 05-07-2025
url: https://facturascripts.com/gestion-de-errores
---
En FacturaScripts, podemos lanzar excepciones que redirigen a páginas de error personalizadas. Para ello, es necesario lanzar una `KernelException` especificando el nombre de la página de error que deseamos mostrar. Por ejemplo, para mostrar una página de error de **Permiso Denegado**, utilizaremos el siguiente código:

```php
throw new KernelException(&#39;AccessDenied&#39;, &#39;test&#39;);
```

Las páginas de error son archivos PHP que se encuentran en la **carpeta Error**. Esto permite personalizarlas mediante el uso de plugins.

## Ejemplo de Página de Error

A continuación, se presenta un ejemplo de cómo crear una página de error utilizando un plugin:

```php
namespace FacturaScripts\Plugins\MiPlugin\Error;

use FacturaScripts\Core\Template\ErrorController;

class MiError extends ErrorController
{
    public function run(): void
    {
        // Código de ejemplo para mostrar un error
        echo &#39;ERROR&#39;;
    }
}
```

## Consideraciones

- Asegúrate de que el nombre de la excepción y la página de error correspondan a los definidos en tu aplicación.
- Personalizar las páginas de error ayuda a mejorar la experiencia del usuario al comunicar de manera efectiva el motivo del error.
