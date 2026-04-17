---
id: 673
permalink: listcontroller-232
title: ListController en FacturaScripts
creationdate: 30-04-2018 00:00:00
lastmod: 26-08-2025
url: https://facturascripts.com/listcontroller-232
---
El `ListController` está diseñado para gestionar listados en FacturaScripts, permitiendo mostrar una o varias pestañas, cada una con el listado de registros de un modelo. Utiliza archivos de [XMLView](https://facturascripts.com/publicaciones/las-vistas-xml-xmlview-668) para definir qué columnas mostrar y cómo deben visualizarse.

![Ejemplo de ListController](https://i.imgur.com/ypHJTSg.png)

## Ejemplo completo: ListProject.php

A continuación, se muestra cómo implementar un listado de proyectos en el ejemplo `MyNewProject`:

```php
&lt;?php
namespace FacturaScripts\Plugins\MyNewPlugin\Controller;

use FacturaScripts\Core\Lib\ExtendedController\ListController;

class ListProject extends ListController
{
    public function getPageData(): array
    {
        $page = parent::getPageData();
        $page[&#39;title&#39;] = &#39;projects&#39;;
        $page[&#39;menu&#39;] = &#39;sales&#39;;
        $page[&#39;icon&#39;] = &#39;fas fa-search&#39;;
        return $page;
    }

    protected function createViews()
    {
        // Se crean las pestañas usando funciones separadas para mayor claridad
        $this-&gt;createViewsProject();
    }

    protected function createViewsProject(string $viewName = &#39;ListProject&#39;): void
    {
        $this-&gt;addView($viewName, &#39;Project&#39;)
            -&gt;addOrderBy([&#39;name&#39;], &#39;name&#39;)
            -&gt;addSearchFields([&#39;name&#39;]);
    }
}
```

## Métodos principales de ListController

### createViews()

En este método se deben crear todas las pestañas mediante `addView()` y definir sus campos de búsqueda, filtros y opciones de ordenación.

### addView()

Añade una nueva pestaña para listar los registros de un modelo. Parámetros:
- **viewName**: Nombre identificador de la pestaña, debe coincidir con el archivo XMLView.
- **modelName**: Nombre del modelo a mostrar.
- **viewTitle** (opcional): Título de la pestaña, traducido automáticamente.
- **icon** (opcional): Icono que se mostrará en la pestaña.

### Columnas a mostrar

El controlador busca un archivo [XMLView](https://facturascripts.com/publicaciones/las-vistas-xml-xmlview-668) con el mismo nombre que la pestaña (`viewName`). Este archivo determina qué columnas se mostrarán y su formato.

### addColor()

Permite añadir colores personalizados a las filas del listado. Más información en [Añadir colores desde el controlador](https://facturascripts.com/publicaciones/row-status-477).

Ejemplo de uso:

```php
$this-&gt;addColor($viewName, $value, $status-&gt;idestado, $color, $title);
```

Parámetros de `addColor()`:
- **$fieldName**: Campo en el que se realiza la comprobación, debe coincidir con el *fieldname* del XML.
- **$value**: Valor a comparar.
- **$color**: Color a mostrar en la fila.
- **$title**: Descripción que se muestra en la leyenda del color.

### addSearchFields()

Define los campos sobre los que actuará el buscador integrado de la pestaña.
- **viewName**: Nombre identificador de la pestaña.
- **fields**: Array con los campos a buscar.

Ejemplo:

```php
$this-&gt;addSearchFields($viewName, [&#39;name&#39;, &#39;description&#39;]);
// Alternativamente
$this-&gt;listView($viewName)-&gt;addSearchFields([&#39;name&#39;, &#39;description&#39;]);
```

### addOrderBy()

Añade opciones de ordenación para la pestaña.
- **viewName**: Nombre de la pestaña.
- **fields**: Campos de ordenación (acepta expresiones de SQL `ORDER BY`).
- **label** (opcional): Título de la opción de ordenación. Si no se especifica, se usará el primer campo.
- **default** (opcional): 1 para orden ascendente por defecto, 2 para descendente.

**Nota:** Es recomendable incluir dos opciones de ordenación por campo: una ascendente y otra descendente.

**Ejemplos:**

```php
// Epígrafes
$this-&gt;addOrderBy(&#39;ListEpigrafe&#39;, [&#39;descripcion&#39;], &#39;description&#39;)
    -&gt;addOrderBy([&#39;CONCAT(codepigrafe, codejercicio)&#39;], &#39;code&#39;, 2)
    -&gt;addOrderBy([&#39;codejercicio&#39;]);

// Clientes
$this-&gt;addOrderBy(&#39;ListCliente&#39;, [&#39;codcliente&#39;], &#39;code&#39;)
    -&gt;addOrderBy([&#39;nombre&#39;], &#39;name&#39;, 1)
    -&gt;addOrderBy([&#39;fecha&#39;], &#39;date&#39;)
    -&gt;addOrderBy([&#39;codgrupo&#39;, &#39;codcliente&#39;], &#39;group&#39;);

// Grupos
$this-&gt;addOrderBy(&#39;ListGrupoClientes&#39;, [&#39;codgrupo&#39;], &#39;code&#39;)
    -&gt;addOrderBy([&#39;nombre&#39;], &#39;name&#39;, 1);
```

## Personalización con Settings

Todas las vistas permiten personalizar su comportamiento mediante la propiedad *settings*. Para más detalles, consulte [Personalizando con settings](https://facturascripts.com/publicaciones/personalizando-con-settings-276).

## Añadir filtros al listado

`ListController` incluye un sistema para filtrar los datos de manera flexible, permitiendo al usuario seleccionar entre varias opciones según lo que configures. Cada filtro debe ser correctamente parametrizado con el nombre de la vista, el campo sobre el que se aplica, la etiqueta y otros detalles.
