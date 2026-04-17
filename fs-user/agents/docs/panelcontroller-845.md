---
id: 682
permalink: panelcontroller-845
title: PanelController
creationdate: 30-04-2018 00:00:00
lastmod: 31-10-2025
url: https://facturascripts.com/panelcontroller-845
---
El PanelController, al igual que el [ListController](https://facturascripts.com/publicaciones/listcontroller-232), es un **controlador extendido** que permite múltiples vistas o pestañas. En este caso, admite distintos tipos de vistas:

- **[ListView](https://facturascripts.com/publicaciones/addlistview-259)**: Para mostrar listados.
- **[EditView](https://facturascripts.com/publicaciones/addeditview-95)**: Para editar los datos de un único modelo.
- **[EditListView](https://facturascripts.com/publicaciones/addeditlistview-505)**: Para editar múltiples registros de un modelo.
- **[HTMLView](https://facturascripts.com/publicaciones/addhtmlview-794)**: Para mostrar HTML con libertad total.

El controlador divide la pantalla en dos zonas: la izquierda es la **zona de navegación** y la derecha visualiza las vistas con los datos correspondientes.

Para usar este controlador, es necesario crear [vistas en formato XML](https://facturascripts.com/publicaciones/las-vistas-xml-xmlview-668), de manera similar a otros controladores extendidos.

## Ejemplo: EditFabricante.php
```php
&lt;?php
namespace FacturaScripts\Core\Controller;

use FacturaScripts\Core\Base\DataBase\DataBaseWhere;
use FacturaScripts\Core\Lib\ExtendedController\PanelController;

class EditFabricante extends PanelController
{
    public function getPageData(): array
    {
        $page = parent::getPageData();
        $page[&#39;title&#39;] = &#39;manufacturer&#39;;
        $page[&#39;menu&#39;] = &#39;warehouse&#39;;
        $page[&#39;icon&#39;] = &#39;fa-folder-open&#39;;
        $page[&#39;showonmenu&#39;] = false;
        return $page;
    }

    protected function createViews() {
        $this-&gt;addEditView(&#39;EditFabricante&#39;, &#39;Fabricante&#39;, &#39;manufacturer&#39;);
        $this-&gt;addListView(&#39;ListProducto&#39;, &#39;Producto&#39;, &#39;products&#39;);
    }

    protected function loadData($viewName, $view) {
        switch ($viewName) {
            case &#39;EditFabricante&#39;:
                $code = $this-&gt;request-&gt;get(&#39;code&#39;);
                $view-&gt;loadData($code);
                break;

            case &#39;ListProducto&#39;:
                $where = [new DataBaseWhere(&#39;codfabricante&#39;, $this-&gt;getModel()-&gt;primaryColumnValue())];
                $view-&gt;loadData(&#39;&#39;, $where);
                break;
        }
    }
}
```

### Método createViews()

Dentro de este método, en nuestra nueva clase, debemos ir creando las diferentes vistas o pestañas que se visualizarán, empleando distintos métodos según el tipo de vista que estemos añadiendo. Al añadir una vista, es necesario especificar el modelo (nombre completo) y el nombre de la vista XML, y opcionalmente el título y el icono para el grupo de navegación:

- **[addEditView()](https://facturascripts.com/publicaciones/addeditview-95)**: Añade una pestaña o vista para editar datos de un único registro de un modelo.
- **[addEditListView()](https://facturascripts.com/publicaciones/addeditlistview-505)**: Añade una vista o pestaña para editar múltiples registros de un modelo.
- **[addListView()](https://facturascripts.com/publicaciones/addlistview-259)**: Añade una pestaña o vista para visualizar en modo lista múltiples registros de un modelo.
- **[addHtmlView()](https://facturascripts.com/publicaciones/addhtmlview-794)**: Añade una pestaña o vista con total libertad sobre el HTML.

Es posible añadir varias vistas o pestañas para un mismo modelo usando una vista XML. Para ello, al añadir la vista se debe emplear un índice numérico comenzando desde 1 y separando el nombre de la vista del índice con un guión (&#39;-&#39;).

```php
$this-&gt;addListView(&#39;ListPartidaImpuesto-1&#39;, &#39;PartidaImpuesto&#39;, &#39;purchases&#39;, &#39;fas fa-sign-in-alt&#39;);
$this-&gt;addListView(&#39;ListPartidaImpuesto-2&#39;, &#39;PartidaImpuesto&#39;, &#39;sales&#39;, &#39;fas fa-sign-out-alt&#39;);
```

Este método tiene una visibilidad de *protected*, lo que permite a los plugins extender nuestra clase y añadir nuevas vistas o modificar las existentes.

### Método loadData()

Este método es llamado por cada una de las vistas para cargar los datos específicos. La llamada incluye el identificador de la vista y el objeto view, permitiendo acceder a todas sus propiedades. La carga de datos puede variar según el tipo de vista, por lo que es responsabilidad del programador asegurar que se carguen correctamente. Aunque esto puede parecer un desafío, también brinda un mayor control sobre los datos que se leen del modelo.

#### ⚠️ Propiedad $this-&gt;hasData

Este controlador verifica durante la carga (en loadData) si **el modelo de la primera pestaña** existe en la base de datos. Por ejemplo, si hemos añadido una pestaña EditView con el modelo Producto en primera posición, comprobará si el producto existe. De no ser así, la navegación entre pestañas quedará bloqueada.

![Pestañas bloqueadas](https://i.imgur.com/huZ4gVO.png)

Si deseamos que las pestañas siempre estén activas, podemos establecer $this-&gt;hasData a true en loadData(). Por ejemplo:

```php
$this-&gt;hasData = true;
```

### Método setTabsPosition()

Este método permite colocar las pestañas a la izquierda, arriba, abajo o abajo a la izquierda:

```php
$this-&gt;setTabsPosition(&#39;left&#39;);       // coloca las pestañas a la izquierda
$this-&gt;setTabsPosition(&#39;top&#39;);        // coloca las pestañas arriba
$this-&gt;setTabsPosition(&#39;bottom&#39;);     // coloca las pestañas abajo (la primera pestaña queda arriba y las demás debajo)
$this-&gt;setTabsPosition(&#39;left-bottom&#39;); // coloca las pestañas abajo a la izquierda (la primera queda arriba y las demás abajo)
```

Cuando están colocadas abajo (bottom), se muestra la ventana principal (primera vista que se añade) y debajo la información de la pestaña seleccionada. Si solo hay una vista o pestaña (además de la principal), se muestra directamente sin el diseño de pestañas.
