---
id: 4391
permalink: anadir-una-pestana-de-archivos-a-un-editcontroller
title: Añadir una pestaña de archivos a un EditController
creationdate: 20-08-2026 09:35:36
lastmod: 02-11-2026
url: https://facturascripts.com/publicaciones/anadir-una-pestana-de-archivos-a-un-editcontroller
---
FacturaScripts ya incluye en el núcleo una funcionalidad preparada para adjuntar archivos a cualquier modelo (facturas, clientes, proveedores, artículos, etc.) desde un **EditController**. Consiste en añadir una nueva pestaña en la que se utiliza:

- El trait **FacturaScripts\Core\Lib\ExtendedController\DocFilesTrait**, que aporta la lógica de subida, edición y borrado de archivos.
- La plantilla **Core/View/Tab/DocFiles.html.twig**, que dibuja la pestaña. También está disponible **Core/View/Tab/PreviewFiles.html.twig**, que muestra una vista previa de cada archivo (ver más abajo).
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

En **execPreviousAction()** hay que capturar las acciones propias de la gestión de archivos y delegarlas en los métodos del trait. La acción **sort-files** guarda el orden cuando el usuario arrastra los archivos en la pestaña:

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

        case &#39;sort-files&#39;:
            return $this-&gt;sortFilesAction();
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
            $view-&gt;loadData(&#39;&#39;, $where, [&#39;orden&#39; =&gt; &#39;ASC&#39;, &#39;creationdate&#39; =&gt; &#39;DESC&#39;]);
            break;

        default:
            parent::loadData($viewName, $view);
            break;
    }
}
```

El valor de **model** debe coincidir con el nombre del modelo al que se adjuntan los archivos, y **modelid** con el identificador del registro actualmente cargado (normalmente obtenido del parámetro **code** de la petición). El orden por **orden** respeta la posición que el usuario haya dado a los archivos al arrastrarlos.

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

            case &#39;sort-files&#39;:
                return $this-&gt;sortFilesAction();
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
                $view-&gt;loadData(&#39;&#39;, $where, [&#39;orden&#39; =&gt; &#39;ASC&#39;, &#39;creationdate&#39; =&gt; &#39;DESC&#39;]);
                break;

            default:
                parent::loadData($viewName, $view);
                break;
        }
    }
}
```

## Plantilla con vista previa: PreviewFiles
Si prefieres ver el contenido de cada archivo sin descargarlo, usa la plantilla **Tab/PreviewFiles** en lugar de **Tab/DocFiles**. Solo cambia el segundo parámetro de **createViewDocFiles()**:

```
protected function createViews()
{
    parent::createViews();
    $this-&gt;createViewDocFiles(&#39;files&#39;, &#39;Tab/PreviewFiles&#39;);
}
```

El resto del controlador (trait, acciones y carga de datos) es exactamente igual. Las dos plantillas comparten funciones: añadir varios archivos a la vez, editar las observaciones, desvincular o eliminar, ordenar arrastrando y respetar los permisos del usuario. La diferencia está en cómo se muestra cada archivo:

- **DocFiles**: cuadrícula de tarjetas. Las imágenes se ven en miniatura y el resto de archivos como un botón de descarga.
- **PreviewFiles**: un archivo por fila con la vista previa a la derecha (arriba en móvil). Muestra imágenes, reproduce vídeos (mp4, ogg y webm) e incrusta los PDF. Para otros tipos indica que la vista previa no está disponible.

PreviewFiles resulta útil cuando lo habitual son PDF o vídeos, por ejemplo nóminas, contratos o documentación de empleados.

## Extensiones
Además, la vista **DocFiles.html.twig** tiene sus propias extensiones *formAddBody y formEditBody* para que otros plugins puedan añadir contenido mediante [extensiones](https://facturascripts.com/publicaciones/extensiones-de-vistas-html). **PreviewFiles.html.twig** usa esas mismas extensiones de DocFiles, así que los campos que añada un plugin aparecen en las dos plantillas.