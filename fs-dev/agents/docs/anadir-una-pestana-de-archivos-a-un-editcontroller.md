---
id: 4391
permalink: anadir-una-pestana-de-archivos-a-un-editcontroller
title: Añadir una pestaña de archivos a un EditController
creationdate: 20-08-2026 09:35:36
lastmod: 20-08-2026
url: https://facturascripts.com/publicaciones/anadir-una-pestana-de-archivos-a-un-editcontroller
---
FacturaScripts ya incluye en el núcleo una funcionalidad preparada para adjuntar archivos a cualquier modelo (facturas, clientes, proveedores, artículos, etc.) desde un **EditController**. Consiste en añadir una nueva pestaña en la que se utiliza:

- El trait **FacturaScripts\Core\Lib\ExtendedController\DocFilesTrait**, que aporta la lógica de subida, edición y borrado de archivos.
- La plantilla **Core/Tab/DocFiles.html.twig**, que dibuja la pestaña.
- El método **createViewDocFiles()**, que registra la vista de la nueva sección.

Con esto lo único necesario es extender el controlador que se quiera modificar.
## 1. Usar el trait **DocFilesTrait**

En el controlador que extiende al **EditController** original, se añade:

```
use \FacturaScripts\Core\Lib\ExtendedController\DocFilesTrait;
```

Y al empezar la clase se llama al trait para cargarlo:
```
class MyClase {
	use DocFilesTrait;
}
```


## 2. Registrar la vista en **createViews()**

Se sobrescribe **createViews()**, se llama al método padre y se registra la nueva sección con **createViewDocFiles()**:

```
protected function createViews()
{
    parent::createViews();
    $this-&gt;createViewDocFiles(&#39;files&#39;, &#39;Tab/DocFiles&#39;);
}
```

El primer parámetro (**&#39;files&#39;**) es el nombre de la vista/sección y el segundo es la plantilla a usar (**Tab/DocFiles**, ya incluida en el core).

## 3. Enrutar las acciones de archivos

En **execPreviousAction()** hay que capturar las acciones propias de la gestión de archivos y delegarlas en los métodos del trait:

```
protected function execPreviousAction($action)
{
    switch ($action) {
        case &#39;add-file&#39;:
            return $this-&gt;addFileAction();

        case &#39;delete-file&#39;:
            return $this-&gt;deleteFileAction();

        case &#39;edit-file&#39;:
            return $this-&gt;editFileAction();

        case &#39;unlink-file&#39;:
            return $this-&gt;unlinkFileAction();
    }

    return parent::execPreviousAction($action);
}
```

## 4. Cargar los archivos del registro actual en **loadData()**

Los archivos se guardan en el modelo de documentos adjuntos indicando a qué modelo y a qué registro pertenecen (**model** y **modelid**). Por tanto, al cargar la vista **files** hay que filtrar por esos dos campos:

```
protected function loadData($viewName, $view)
{
    switch ($viewName) {
        case &#39;files&#39;:
            $code = $this-&gt;request-&gt;get(&#39;code&#39;);
            $where = [
                Where::eq(&#39;model&#39;, &#39;Cliente&#39;),
                Where::eq(&#39;modelid&#39;, $code)
            ];
            $view-&gt;loadData(&#39;&#39;, $where);
            break;

        default:
            parent::loadData($viewName, $view);
            break;
    }
}
```

El valor de **model** debe coincidir con el nombre del modelo al que se adjuntan los archivos, y **modelid** con el identificador del registro actualmente cargado (normalmente obtenido del parámetro **code** de la petición).

## Ejemplo completo

```
&lt;?php

namespace FacturaScripts\Plugins\DocumentosProcli\Controller;

use FacturaScripts\Core\Lib\ExtendedController\DocFilesTrait;
use FacturaScripts\Core\Where;

class EditCliente extends \FacturaScripts\Core\Controller\EditCliente
{
    use DocFilesTrait;

    protected function createViews()
    {
        parent::createViews();
        $this-&gt;createViewDocFiles(&#39;files&#39;, &#39;Tab/DocFiles&#39;);
    }

    protected function execPreviousAction($action)
    {
        switch ($action) {
            case &#39;add-file&#39;:
                return $this-&gt;addFileAction();

            case &#39;delete-file&#39;:
                return $this-&gt;deleteFileAction();

            case &#39;edit-file&#39;:
                return $this-&gt;editFileAction();

            case &#39;unlink-file&#39;:
                return $this-&gt;unlinkFileAction();
        }

        return parent::execPreviousAction($action);
    }

    protected function loadData($viewName, $view)
    {
        switch ($viewName) {
            case &#39;files&#39;:
                $code = $this-&gt;request-&gt;get(&#39;code&#39;);
                $where = [
                    Where::eq(&#39;model&#39;, &#39;Cliente&#39;),
                    Where::eq(&#39;modelid&#39;, $code)
                ];
                $view-&gt;loadData(&#39;&#39;, $where);
                break;

            default:
                parent::loadData($viewName, $view);
                break;
        }
    }
}
```

## Extensiones
Además, la vista **DocFiles.html.twig** tiene sus propias extensiones *formAddBody y formEditBody* para que otros plugins puedan añadir contenido mediante [extensiones](https://facturascripts.com/publicaciones/extensiones-de-vistas-html).