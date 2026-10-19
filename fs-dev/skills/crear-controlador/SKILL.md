---
name: crear-controlador
description: Guía para escribir un controlador concreto de FacturaScripts (Controller con Twig, ListController, EditController o PanelController) y su vista asociada.
---

# Skill: crear un controlador de FacturaScripts

Cuando el usuario pida un controlador, determina el tipo adecuado y genera el código (`los-controladores-410.md`, `controladores-extendidos-367.md`).

## Atajo con fsmaker

```bash
fsmaker controller
```

fsmaker pide el nombre y el tipo, y genera el PHP y el XMLView asociado. Los apartados siguientes sirven para crearlos o ajustarlos a mano.

## Tipos de controlador

| Tipo | Uso | Convención de nombre |
|------|-----|----------------------|
| `Controller` (`Core\Template\Controller`) | Página libre con plantilla Twig | `NombreLibre` |
| `ListController` | Listado con búsqueda, filtros y pestañas | `ListNombreModelo` |
| `EditController` | Ficha de edición de un registro, con pestañas opcionales | `EditNombreModelo` |
| `PanelController` | Varias pestañas definidas a mano | `EditNombreModelo` |

## Controller (vista Twig libre)

Para dashboards, asistentes o formularios a medida. Hereda de `FacturaScripts\Core\Template\Controller`: la lógica va en `run()`, la petición se lee con `$this->request()` y la vista se pinta con `$this->view()`, indicando la extensión `.html.twig`.

Archivo PHP: `Plugins/MiPlugin/Controller/MiPagina.php`

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Controller;

use FacturaScripts\Core\Template\Controller;
use FacturaScripts\Core\Tools;

class MiPagina extends Controller
{
    /** @var string Valor que la vista lee como fsc.miVariable */
    public $miVariable = '';

    public function getPageData(): array
    {
        $data = parent::getPageData();
        $data['title'] = 'my-page';   // clave de traducción
        $data['menu'] = 'admin';      // sales, purchases, accounting, warehouse, admin...
        $data['icon'] = 'fa-solid fa-house';
        // $data['showonmenu'] = false;
        return $data;
    }

    public function run(): void
    {
        parent::run();

        // Parámetros de la URL y del formulario
        $id = $this->request()->query('id');
        $valor = $this->request()->input('campo');

        if ($this->request()->input('action') === 'save' && $this->validateFormToken()) {
            Tools::log()->notice('record-updated-correctly');
        }

        $this->miVariable = 'Hola mundo';
        $this->view('MiPagina.html.twig'); // View/MiPagina.html.twig
    }
}
```

Vista Twig: `Plugins/MiPlugin/View/MiPagina.html.twig`

```twig
{% extends "Master/MenuTemplate.html.twig" %}
{# "Master/MicroTemplate.html.twig" si no se quiere el menú superior #}

{% block body %}
    {{ parent() }}
    <div class="container-fluid">
        <h1 class="h3">{{ trans('my-page') }}</h1>
        <p>{{ fsc.miVariable }}</p>

        <form method="post" action="{{ fsc.url() }}">
            {{ formToken() }}
            <input type="hidden" name="action" value="save"/>
            <input type="text" name="campo" class="form-control mb-3">
            <button type="submit" class="btn btn-primary">{{ trans('save') }}</button>
        </form>
    </div>
{% endblock %}
```

### Notas del Controller

- La vista va en `View/` con extensión `.html.twig`, y las propiedades `public` se leen como `{{ fsc.propiedad }}`.
- Respuestas sin HTML: `$this->response()->json($datos);` o `$this->response()->file($ruta, $nombre)` (`objeto-response-como-devolver-datos.md`).
- Redirección: `$this->response()->redirect('OtroControlador')->send();`.
- `Core\Template\Controller` no tiene `setTemplate()`, `redirect()` ni la propiedad `$this->request`, y no admite extensiones. Esos métodos pertenecen al `Core\Base\Controller` antiguo, en el que se basan los controladores extendidos.

---

## ListController

Archivo: `Plugins/MiPlugin/Controller/ListNombreModelo.php`

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Controller;

use FacturaScripts\Core\Lib\ExtendedController\ListController;
use FacturaScripts\Core\Tools;
use FacturaScripts\Core\Where;

class ListNombreModelo extends ListController
{
    public function getPageData(): array
    {
        $page = parent::getPageData();
        $page['title'] = 'model-names';
        $page['menu'] = 'sales';
        $page['icon'] = 'fa-solid fa-list';
        return $page;
    }

    protected function createViews()
    {
        $this->createViewsNombreModelo();
    }

    protected function createViewsNombreModelo(string $viewName = 'ListNombreModelo'): void
    {
        $this->addView($viewName, 'NombreModelo', 'model-names', 'fa-solid fa-list')
            ->addOrderBy(['name'], 'name')
            ->addOrderBy(['creation_date'], 'date', 2)
            ->addSearchFields(['name'])
            // filtros encadenados sobre la vista: sin $viewName
            ->addFilterCheckbox('active', 'active', 'active')
            ->addFilterPeriod('creation_date', 'period', 'creation_date')
            ->addFilterSelect('codpais', 'country', 'codpais', $this->codeModel->all('paises', 'codpais', 'nombre'))
            ->addFilterSelectWhere('type', [
                ['label' => Tools::trans('all'), 'where' => []],
                ['label' => Tools::trans('only-active'), 'where' => [Where::eq('active', true)]],
            ]);

        $this->tab($viewName)->addButton([
            'action' => 'recalculate',
            'icon' => 'fa-solid fa-calculator',
            'label' => 'recalculate',
        ]);
    }
}
```

XMLView: `Plugins/MiPlugin/XMLView/ListNombreModelo.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <columns>
        <column name="name" order="100">
            <widget type="text" fieldname="name"/>
        </column>
        <column name="creation-date" display="right" order="110">
            <widget type="date" fieldname="creation_date"/>
        </column>
        <column name="active" display="center" order="120">
            <widget type="checkbox" fieldname="active"/>
        </column>
    </columns>
</view>
```

### Filtros

Los métodos de `ListController` reciben el `$viewName` como primer parámetro; los de la vista (`$this->listView($viewName)` o el encadenado tras `addView()`), no.

| Método del controlador | Parámetros tras `$viewName` |
|------------------------|-----------------------------|
| `addFilterCheckbox()` | `key, label, field, operation = '=', matchValue = true, default = []` |
| `addFilterSelect()` | `key, label, field, array $values` |
| `addFilterSelectWhere()` | `key, array $values` (etiqueta y array de `Where` por opción) |
| `addFilterAutocomplete()` | `key, label, field, table, fieldcode, fieldtitle, where` |
| `addFilterNumber()` | `key, label, field, operation = '>='` |
| `addFilterDatePicker()` | `key, label, field, operation = '>='` |
| `addFilterPeriod()` | `key, label, field, dateTime = false` |

Usa `Where` (`FacturaScripts\Core\Where`) en lugar del obsoleto `DataBaseWhere`. Consulta cada `addfilter*.md`.

---

## EditController

Archivo: `Plugins/MiPlugin/Controller/EditNombreModelo.php`

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Controller;

use FacturaScripts\Core\Lib\ExtendedController\EditController;
use FacturaScripts\Core\Where;

class EditNombreModelo extends EditController
{
    public function getModelClassName(): string
    {
        return 'NombreModelo';
    }

    public function getPageData(): array
    {
        $page = parent::getPageData();
        $page['title'] = 'model-name';
        $page['menu'] = 'sales';
        $page['icon'] = 'fa-solid fa-pen-to-square';
        return $page;
    }

    protected function createViews()
    {
        parent::createViews(); // crea la pestaña principal EditNombreModelo

        $this->addListView('ListOtroModelo', 'OtroModelo', 'related', 'fa-solid fa-list');
        $this->setTabGroup('ListOtroModelo', 'sales'); // grupo de pestañas (2026.7)
    }

    protected function loadData($viewName, $view)
    {
        switch ($viewName) {
            case 'ListOtroModelo':
                $where = [Where::eq('id_nombre_modelo', $this->getModel()->id())];
                $view->loadData('', $where);
                break;

            default:
                parent::loadData($viewName, $view); // carga la pestaña principal
                break;
        }
    }
}
```

- `EditController` crea la pestaña principal `Edit{Modelo}` y la carga por el parámetro `code`; sobrescribe `createViews()` y `loadData()` llamando al padre (`editcontroller-642.md`).
- `getModel()` devuelve el modelo de la pestaña principal (solo en `EditController`).
- `tab($viewName)` devuelve una pestaña y `activeTab()`, la seleccionada; `setReadOnly(true)` deja de solo lectura una pestaña de edición (`EditView`).
- `EditController` fuerza `showonmenu = false`, y su pestaña principal tiene `btnPrint` activado.

XMLView: `Plugins/MiPlugin/XMLView/EditNombreModelo.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <columns>
        <group name="data" numcolumns="8">
            <column name="name" numcolumns="8" order="100">
                <widget type="text" fieldname="name" required="true"/>
            </column>
            <column name="creation-date" numcolumns="4" order="110">
                <widget type="date" fieldname="creation_date"/>
            </column>
        </group>
        <group name="options" numcolumns="4" valign="bottom">
            <column name="active" order="100">
                <widget type="checkbox" fieldname="active"/>
            </column>
        </group>
    </columns>
</view>
```

---

## PanelController

Divide la pantalla en navegación (pestañas) y contenido. Admite pestañas `EditView`, `ListView`, `EditListView` y `HtmlView` (`panelcontroller-845.md`).

Archivo: `Plugins/MiPlugin/Controller/EditNombreModelo.php`

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Controller;

use FacturaScripts\Core\Lib\ExtendedController\PanelController;
use FacturaScripts\Core\Where;

class EditNombreModelo extends PanelController
{
    public function getPageData(): array
    {
        $page = parent::getPageData();
        $page['title'] = 'model-name';
        $page['menu'] = 'sales';
        $page['icon'] = 'fa-solid fa-pen-to-square';
        $page['showonmenu'] = false;
        return $page;
    }

    protected function createViews()
    {
        // Primera pestaña: la principal
        $this->addEditView('EditNombreModelo', 'NombreModelo', 'model-name', 'fa-solid fa-pen-to-square');

        // Pestañas relacionadas, agrupadas bajo un encabezado (2026.7)
        $this->addListView('ListOtroModelo', 'OtroModelo', 'related', 'fa-solid fa-list')
            ->setSettings('group', 'sales');

        // $this->setTabsPosition('top'); // left (por defecto) | top | bottom | left-bottom
    }

    protected function loadData($viewName, $view)
    {
        switch ($viewName) {
            case 'EditNombreModelo':
                $view->loadData($this->request->get('code'));
                break;

            case 'ListOtroModelo':
                // PanelController no tiene getModel(): se lee el modelo de la pestaña principal
                $id = $this->tab('EditNombreModelo')->model->id();
                $view->loadData('', [Where::eq('id_nombre_modelo', $id)]);
                break;
        }
    }
}
```

### Notas del PanelController

- La **primera pestaña** es la principal. Si su registro no existe, las demás quedan bloqueadas; `$this->hasData = true;` en `loadData()` las mantiene activas.
- Métodos para añadir pestañas: `addEditView()`, `addListView()`, `addEditListView()` y `addHtmlView()`.
- Para dos pestañas con el mismo XMLView, añade un sufijo numérico: `'ListOtroModelo-1'` y `'ListOtroModelo-2'`.
- **Agrupar pestañas (2026.7)**: con las pestañas a la izquierda, `setTabGroup($viewName, 'clave')` o `setSettings('group', 'clave')`; `getTabGroups()` devuelve las vistas agrupadas por clave.
- **Navegación entre registros (2026.7)**: al abrir un registro desde un listado aparecen las flechas ‹ n/m ›. Es automático (parámetro `navfrom`); `getNavigation()` devuelve `prev`, `next`, `position` y `count`, o un array vacío.
- Botones: `$this->tab($viewName)->addButton([...])` y `addButtonGroup([...])`. La forma `$this->addButton($viewName, [...])` está obsoleta.
- Valores de otra pestaña: `$this->tabModelValue($viewName, $campo)` desde 2026.5; antes, `getViewModelValue()`.

---

## Menús disponibles

- `sales`: Ventas
- `purchases`: Compras
- `accounting`: Contabilidad
- `warehouse`: Almacén
- `reports`: Informes
- `admin`: Administrador

## Para más información

Consulta la skill `fs-dev:docs-expert` para revisar la documentación oficial. Para el diseño detallado de los XMLView, usa `fs-dev:crear-xmlview` o `fs-dev:ui-designer`.
