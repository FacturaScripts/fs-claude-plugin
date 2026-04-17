---
id: 1604
permalink: anadir-un-endpoint-a-la-api
title: Cómo Añadir un Endpoint Personalizado a la API
creationdate: 23-11-2023 17:40:18
lastmod: 22-12-2025
url: https://facturascripts.com/anadir-un-endpoint-a-la-api
---
Desde la **versión 2023.1** de FacturaScripts, agregar nuevos endpoints a la API es más sencillo gracias al renovado [sistema de enrutamiento](https://facturascripts.com/publicaciones/profundizando-en-el-core). Solo necesitas crear un controlador que herede de **ApiController** y registrar la ruta en el archivo **Init.php** de tu plugin.

## 1. Registrar la Ruta en el Archivo Init.php
En la función `init()` de tu archivo [Init.php](https://facturascripts.com/publicaciones/el-archivo-init-php-307), añade la nueva ruta y asígnala al controlador correspondiente. Ejemplo:

```php
&lt;?php
namespace FacturaScripts\Plugins\MyNewPlugin;

use FacturaScripts\Core\Template\InitClass;
use FacturaScripts\Core\Controller\ApiRoot;
use FacturaScripts\Core\Kernel;

class Init extends InitClass
{
    public function init(): void
    {
        // Registra la nueva ruta en la API y vincúlala al controlador personalizado
        Kernel::addRoute(&#39;/api/3/mi-endpoint&#39;, &#39;ApiControllerPruebas&#39;, -1);
        ApiRoot::addCustomResource(&#39;mi-endpoint&#39;);
    }
}
```

## 2. Crear tu ApiController Personalizado
Debes crear el archivo `ApiControllerPruebas.php` en la carpeta **Controller** de tu plugin. Este controlador gestionará la lógica de tu nuevo endpoint:

```php
&lt;?php
namespace FacturaScripts\Plugins\MyNewPlugin\Controller;

use FacturaScripts\Core\Template\ApiController;

class ApiControllerPruebas extends ApiController
{
    protected function runResource(): void
    {
        // Lógica del endpoint
        $this-&gt;response()-&gt;json([&#39;hola&#39; =&gt; &#39;mundo&#39;]));
    }
}
```

Puedes personalizar la lógica modificando el contenido dentro de `runResource()` según tus necesidades.

## 3. Ejemplo de Consumo del Endpoint
Una vez implementado el endpoint, puedes hacer solicitudes a:

```
https://tusitio.com/api/3/mi-endpoint
```

La respuesta será:

```json
{
    &quot;hola&quot;: &quot;mundo&quot;
}
```
