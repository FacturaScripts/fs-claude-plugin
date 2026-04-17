---
id: 614
permalink: los-controladores-410
title: Los Controladores
creationdate: 27-04-2018 00:00:00
lastmod: 25-02-2026
url: https://facturascripts.com/los-controladores-410
---
Un **controlador** es, básicamente, una página o opción en el menú de FacturaScripts. Cuando haces clic en el **menú Almacén** → **Productos**, estarás ejecutando el controlador [ListProducto.php](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Controller/ListProducto.php). Para saber qué controlador estás ejecutando, observa la barra de direcciones de tu navegador.

### Requisitos para los Controladores
- Los controladores deben estar ubicados en la carpeta **Controller** de su plugin.
- El **nombre del archivo** debe coincidir con el de la **clase** que contiene.
- La clase debe extender de `FacturaScripts\Core\Template\Controller` o de uno de los controladores extendidos.

## Ejemplo: MyNewController.php

```php
&lt;?php
namespace FacturaScripts\Plugins\MyNewPlugin\Controller;

use FacturaScripts\Core\Template\Controller;

class MyNewController extends Controller
{
    public function getPageData(): array
    {
        $data = parent::getPageData();
        $data[&#39;menu&#39;] = &#39;admin&#39;;
        $data[&#39;title&#39;] = &#39;MyNewController&#39;;
        $data[&#39;icon&#39;] = &#39;fa-solid fa-page&#39;;
        return $data;
    }

    public function run(): void
    {
        parent::run();

        // Tu código aquí
    }
}
```

En este ejemplo, hemos añadido esta página al menú de admin, con el título MyNewController y el [icono fa-solid fa-page](https://facturascripts.com/publicaciones/iconos-disponibles-308).

### 🖱️ Función getPageData()
La función `getPageData()` define cómo aparece esta página en el menú, incluyendo a qué menú pertenece, así como su título e icono. Esta función será ejecutada por el núcleo de FacturaScripts cada vez que se invoque el controlador, así como al activar o actualizar el plugin. Devuelve un arreglo con los siguientes datos:

- **name**: nombre de la clase del controlador. No debe ser modificado.
- **title**: título de la página. **Se traducirá** utilizando el traductor integrado.
- **icon**: [icono a mostrar en el menú](https://facturascripts.com/publicaciones/iconos-disponibles-308).
- **menu**: menú en el que aparecerá.
- **submenu**: submenú en el que aparecerá.
- **showonmenu**: TRUE para mostrar en el menú (por defecto), FALSE para ocultar.
- **ordernum**: orden de prioridad en el menú; un número más bajo significa que aparecerá más arriba.

### ⚡ Función run()
La función `run()` es donde inicial la ejecución del controlador. Coloca tu código aquí.

```
public function run(): void
{
   parent::run();
   
   $this-&gt;response()-&gt;setContent(&#39;Hola mundo&#39;)-&gt;send();
}
```

La clase [Response](https://facturascripts.com/publicaciones/objeto-response-como-devolver-datos) se utiliza para construir y enviar una respuesta HTTP al cliente. Permite establecer el código de estado HTTP, las cabeceras, las cookies y el contenido de la respuesta.

### ⚠️ Herencia de Controladores
Puedes heredar y personalizar cualquier controlador existente, pero recuerda **usar un alias antes de heredar**. A continuación se muestra un ejemplo:

```php
&lt;?php
namespace FacturaScripts\Plugins\MyNewPlugin\Controller;

use FacturaScripts\Core\Controller\EditCliente as ParentController;

class EditCliente extends ParentController
{
	// Tu código aquí
}
```

Nota la línea `use FacturaScripts\Core\Controller\EditCliente as ParentController;`. El **as** permite usar EditCliente bajo el alias de ParentController. Si no usas un alias, se producirá una colisión de nombres al definir la nueva clase, ya que ambas clases tendrían el mismo nombre.

### 🌟 Herencia VS extensiones
La herencia tiene limitaciones cuando se trabaja con muchos plugins. Si tu controlador hereda y personaliza el controlador EditCliente y otro plugin que tienes activado también hereda y personaliza el mismo controlador, solamente una de las personalizaciones funcionará. Para superar estas limitaciones creamos [las extensiones de controladores](https://facturascripts.com/publicaciones/extensiones-de-controladores).
