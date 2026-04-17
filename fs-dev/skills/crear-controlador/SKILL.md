---
name: crear-controlador
description: Crea controladores de FacturaScripts (Controller con vista Twig, ListController, EditController o PanelController) con su vista asociada.
---

# Skill: Crear Controlador FacturaScripts

Cuando el usuario pida crear un controlador, determina el tipo adecuado y genera el código.

## Atajo con fsmaker

Antes de crear los archivos a mano, considera usar la herramienta CLI:

```bash
fsmaker controller
```

fsmaker solicita el nombre del controlador, el tipo (ListController, EditController, etc.) y genera el PHP y el XMLView asociado. Los apartados siguientes documentan la estructura completa para cuando necesites crearlos o ajustarlos manualmente.

## Tipos de controlador

| Tipo | Uso | Nombre convención |
|------|-----|-------------------|
| `Controller` | Página personalizada con vista HTML Twig libre | `NombreLibre` |
| `ListController` | Listado de registros con filtros | `ListNombreModelo` |
| `EditController` | Formulario de edición de un registro | `EditNombreModelo` |
| `PanelController` | Combinación de vistas (cabecera + pestañas) | `EditNombreModelo` |

## Controller (vista HTML Twig)

Usar cuando se necesita una página completamente personalizada con una plantilla `.html.twig` en lugar de un XMLView. Ideal para dashboards, páginas de configuración visual, formularios custom, etc.

Archivo PHP: `Plugins/MiPlugin/Controller/MiPagina.php`

```php
<?php

namespace FacturaScripts\Plugins\MiPlugin\Controller;

use FacturaScripts\Core\Template\Controller;

class MiPagina extends Controller
{
    // Propiedades públicas accesibles desde la vista con {{ fsc.miPropiedad }}
    public string $miVariable = '';

    public function getPageData(): array
    {
        $data = parent::getPageData();
        $data['title'] = 'mi-pagina';    // clave de traducción
        $data['menu'] = 'admin';         // ventas, purchases, accounting, admin...
        $data['icon'] = 'fas fa-home';
        // $data['showonmenu'] = false;  // descomentar para ocultar del menú
        return $data;
    }

    public function run(): void
    {
        parent::run();

        // Leer parámetros de URL o formulario
        $id = $this->request->query('id');
        $valor = $this->request->input('campo');

        // Asignar datos que la vista usará como {{ fsc.miVariable }}
        $this->miVariable = 'Hola mundo';

        // Seleccionar la plantilla (por defecto usa el nombre de la clase)
        $this->setTemplate('MiPagina'); // carga View/MiPagina.html.twig
    }
}
```

Vista Twig: `Plugins/MiPlugin/View/MiPagina.html.twig`

```twig
{% extends "Master/MenuTemplate.html.twig" %}
{# Usar "Master/MicroTemplate.html.twig" si no se quiere el menú superior #}

{% block body %}
    {{ parent() }}

    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <h1>{{ trans('mi-pagina') }}</h1>

                {# Acceder a propiedades públicas del controlador #}
                <p>{{ fsc.miVariable }}</p>

                {# URL del controlador actual #}
                <p>URL: {{ fsc.url() }}</p>

                {# Formulario con token de seguridad #}
                <form method="post" action="{{ fsc.url() }}">
                    {{ formToken() }}
                    <input type="text" name="campo" class="form-control">
                    <button type="submit" class="btn btn-primary">
                        {{ trans('save') }}
                    </button>
                </form>
            </div>
        </div>
    </div>
{% endblock %}

{% block css %}
    {{ parent() }}
    {# CSS adicional aquí #}
{% endblock %}

{% block javascripts %}
    {{ parent() }}
    {# JavaScript adicional aquí #}
{% endblock %}
```

### Notas clave del Controller con Twig

- La vista se ubica en `View/` (no en `XMLView/`) y tiene extensión `.html.twig`.
- `setTemplate('NombreVista')` carga `View/NombreVista.html.twig`.
- Las propiedades `public` del controlador son accesibles en Twig como `{{ fsc.propiedad }}`.
- Usar `{{ formToken() }}` en formularios POST para seguridad CSRF.
- Para redirigir: `$this->redirect('OtroControlador');`
- Para desactivar salida HTML (respuestas JSON/API): `$this->setTemplate('false');`

---

## ListController

Archivo: `Plugins/MiPlugin/Controller/ListNombreModelo.php`

```php
<?php

namespace FacturaScripts\Plugins\MiPlugin\Controller;

use FacturaScripts\Core\Lib\ExtendedController\ListController;

class ListNombreModelo extends ListController
{
    public function getPageData(): array
    {
        $page = parent::getPageData();
        $page['title'] = 'nombre-modelo'; // clave de traducción
        $page['menu'] = 'sales';          // ventas, purchases, accounting, admin
        $page['icon'] = 'fas fa-list';
        return $page;
    }

    protected function createViews()
    {
        $this->createViewsNombreModelo();
    }

    protected function createViewsNombreModelo(string $viewName = 'ListNombreModelo'): void
    {
        $this->addView($viewName, 'NombreModelo', 'nombre-modelo', 'fas fa-list')
            ->addOrderBy(['name'], 'name')
            ->addOrderBy(['creation_date'], 'date', 2)
            ->addSearchFields(['name']);
    }
}
```

XMLView: `Plugins/MiPlugin/XMLView/ListNombreModelo.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <columns>
        <column name="name" order="100">
            <widget type="text" fieldname="name" />
        </column>
        <column name="creation-date" order="200">
            <widget type="date" fieldname="creation_date" />
        </column>
        <column name="active" display="center" order="300">
            <widget type="checkbox" fieldname="active" />
        </column>
    </columns>
</view>
```

## EditController

Archivo: `Plugins/MiPlugin/Controller/EditNombreModelo.php`

```php
<?php

namespace FacturaScripts\Plugins\MiPlugin\Controller;

use FacturaScripts\Core\Lib\ExtendedController\EditController;

class EditNombreModelo extends EditController
{
    public function getModelClassName(): string
    {
        return 'NombreModelo';
    }

    public function getPageData(): array
    {
        $page = parent::getPageData();
        $page['title'] = 'nombre-modelo';
        $page['menu'] = 'sales';
        $page['icon'] = 'fas fa-edit';
        $page['showonmenu'] = false; // No mostrar en el menú principal
        return $page;
    }
}
```

XMLView: `Plugins/MiPlugin/XMLView/EditNombreModelo.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <columns>
        <group name="data" numcolumns="8">
            <column name="name" numcolumns="8" order="100">
                <widget type="text" fieldname="name" required="true" />
            </column>
            <column name="creation-date" numcolumns="4" order="200">
                <widget type="date" fieldname="creation_date" />
            </column>
        </group>
        <group name="options" numcolumns="4">
            <column name="active" order="100">
                <widget type="checkbox" fieldname="active" />
            </column>
        </group>
    </columns>
</view>
```

## PanelController

Divide la pantalla en zona de navegación (izquierda) y zona de contenido (derecha) con múltiples pestañas. Admite vistas de tipo `EditView`, `ListView`, `EditListView` y `HtmlView`.

Archivo: `Plugins/MiPlugin/Controller/EditNombreModelo.php`

```php
<?php

namespace FacturaScripts\Plugins\MiPlugin\Controller;

use FacturaScripts\Core\Where;
use FacturaScripts\Core\Lib\ExtendedController\PanelController;

class EditNombreModelo extends PanelController
{
    public function getPageData(): array
    {
        $page = parent::getPageData();
        $page['title'] = 'nombre-modelo';
        $page['menu'] = 'sales';
        $page['icon'] = 'fas fa-edit';
        $page['showonmenu'] = false;
        return $page;
    }

    protected function createViews(): void
    {
        // Primera pestaña: formulario de edición del modelo principal (cabecera)
        $this->addEditView('EditNombreModelo', 'NombreModelo', 'nombre-modelo', 'fas fa-edit');

        // Segunda pestaña: listado de registros relacionados
        $this->addListView('ListOtroModelo', 'OtroModelo', 'otro-modelo', 'fas fa-list');

        // Opcional: posición de las pestañas
        // $this->setTabsPosition('bottom'); // left | top | bottom | left-bottom
    }

    protected function loadData($viewName, $view): void
    {
        switch ($viewName) {
            case 'EditNombreModelo':
                $code = $this->request->query('code');
                $view->loadData($code);
                break;

            case 'ListOtroModelo':
                // Filtrar los registros relacionados por la PK del modelo principal
                $where = [Where::eq('id_nombre_modelo', $this->getModel()->id())];
                $view->loadData('', $where);
                break;
        }
    }
}
```

XMLView cabecera: `Plugins/MiPlugin/XMLView/EditNombreModelo.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <columns>
        <group name="data" numcolumns="8">
            <column name="name" numcolumns="8" order="100">
                <widget type="text" fieldname="name" required="true" />
            </column>
            <column name="creation-date" numcolumns="4" order="200">
                <widget type="date" fieldname="creation_date" />
            </column>
        </group>
        <group name="options" numcolumns="4">
            <column name="active" order="100">
                <widget type="checkbox" fieldname="active" />
            </column>
        </group>
    </columns>
</view>
```

XMLView pestaña relacionada: `Plugins/MiPlugin/XMLView/ListOtroModelo.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <columns>
        <column name="name" order="100">
            <widget type="text" fieldname="name" />
        </column>
        <column name="creation-date" order="200">
            <widget type="date" fieldname="creation_date" />
        </column>
    </columns>
</view>
```

### Notas clave del PanelController

- La **primera vista** que se añade es la principal (cabecera). Si su modelo no existe en BD, el resto de pestañas quedan bloqueadas.
- Para forzar pestañas siempre activas: `$this->hasData = true;` dentro de `loadData()`.
- Métodos para añadir vistas: `addEditView()`, `addListView()`, `addEditListView()`, `addHtmlView()`.
- Si necesitas dos pestañas del mismo XMLView, añade un sufijo numérico: `'ListOtroModelo-1'`, `'ListOtroModelo-2'`.

---

## Menús disponibles

- `sales` — Ventas
- `purchases` — Compras
- `accounting` — Contabilidad
- `warehouse` — Almacén
- `admin` — Administrador

## Añadir filtros al ListController

```php
// En createViewsNombreModelo():
->addFilterCheckbox($viewName, 'active', 'active')
->addFilterDatePicker($viewName, 'creation_date', 'date')
->addFilterSelect($viewName, 'estado', 'state', 'estados', 'nombre')
->addFilterPeriod($viewName, 'creation_date', 'period')
```


## Para más información

Para consultar la documentación oficial completa sobre controladores y vistas HTML, invoca el agente **docs-expert** que te proporcionará detalles completos directamente desde la documentación oficial del framework.
