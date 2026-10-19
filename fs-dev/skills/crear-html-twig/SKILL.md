---
name: crear-html-twig
description: Guía para escribir una plantilla Twig concreta de FacturaScripts, con su herencia, sus funciones, su uso desde el controlador y sus ganchos de extensión.
---

# Skill: crear vistas HTML Twig en FacturaScripts

Las vistas Twig son archivos `.html.twig` en la carpeta `View/` del plugin. Se basan en Twig 3 (`las-vistas-html-69.md`).

## Atajo con fsmaker

```bash
fsmaker view
```

fsmaker pide el nombre de la vista y genera el archivo en `View/` con la herencia correcta.

---

## 1. Crear una vista básica

### Ubicación

```
Plugins/MiPlugin/View/MiVista.html.twig
```

### Estructura mínima con menú

```twig
{% extends "Master/MenuTemplate.html.twig" %}

{% block body %}
    {{ parent() }}
    <div class="container-fluid">
        <h1 class="h3">{{ trans('my-title') }}</h1>
    </div>
{% endblock %}

{% block css %}
    {{ parent() }}
{% endblock %}

{% block javascripts %}
    {{ parent() }}
{% endblock %}
```

### Sin menú

```twig
{% extends "Master/MicroTemplate.html.twig" %}

{% block body %}
    <h1>{{ trans('my-title') }}</h1>
{% endblock %}
```

---

## 2. Usar la vista desde el controlador

### Controlador nuevo (`Core\Template\Controller`)

La vista se pinta con `$this->view()`, indicando la extensión:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Controller;

use FacturaScripts\Core\Template\Controller;

class MiVista extends Controller
{
    /** @var array Datos que la vista lee como fsc.datos */
    public $datos = [];

    public function run(): void
    {
        parent::run();
        $this->datos = ['clave' => 'valor'];
        $this->view('MiVista.html.twig'); // View/MiVista.html.twig
    }
}
```

### Controlador antiguo o extendido (`Core\Base\Controller`, List, Edit, Panel)

```php
// en privateCore() o en una acción
$this->setTemplate('MiVista'); // carga View/MiVista.html.twig
$this->setTemplate(false);     // desactiva la salida HTML (JSON, descargas...); booleano, no la cadena 'false'
```

### Como pestaña de un EditController o PanelController

```php
protected function createViews()
{
    parent::createViews(); // en EditController
    // addHtmlView(viewName, plantilla, modelo, título, icono)
    $this->addHtmlView('tab-producto', 'Tab/MiTab', 'Producto', 'product', 'fa-solid fa-box');
}
```

- El archivo debe estar en `View/Tab/MiTab.html.twig` (`addhtmlview-794.md`).
- El modelo puede ser cualquier nombre si no necesitas uno concreto.

---

## 3. Variables disponibles en la vista

| Variable | Descripción |
|---|---|
| `fsc` | El controlador: sus propiedades y métodos públicos |
| `controllerName` | Nombre del controlador activo |
| `template` | Plantilla cargada (controladores antiguos y extendidos) |
| `assetManager` | CSS y JS cargados desde el controlador |
| `log` | Instancia de MiniLog |

Las propiedades públicas del controlador se leen como `{{ fsc.datos }}`:

```twig
{% for clave, valor in fsc.datos %}
    <p>{{ clave }}: {{ valor }}</p>
{% endfor %}
```

---

## 4. Funciones Twig disponibles

```twig
{# Traducción, con parámetros entre % y con idioma concreto #}
{{ trans('save') }}
{{ trans('record-save-ok', {'%code%': 'FAC001'}) }}
{{ trans('save', {}, 'de_DE') }}

{# URLs #}
{{ fsc.url() }}
{{ asset('ListFacturaCliente') }}

{# Usuario actual #}
{{ fsc.user.nick }}

{# Token de seguridad de los formularios #}
{{ formToken() }}
{{ formToken(false) }}  {# solo el valor #}

{# Números y precios #}
{{ number(20.338547) }}
{{ number(20.338547, 4) }}
{{ money(15.42) }}
{{ money(15.42, 'EUR') }}

{# Configuración #}
{% set divisa = settings('default', 'coddivisa') %}
{% set dias = settings('default', 'dias', 7) %}

{# Archivos de la biblioteca #}
{% set file = attachedFile(5) %}
{{ file.path }}

{# Avisos emergentes con JavaScript #}
{% include 'Macro/Toasts.html.twig' %}
<script>setToast('{{ trans('saved')|e('js') }}', 'warning', '{{ trans('title')|e('js') }}', 10000);</script>
```

---

## 5. Añadir funciones Twig propias

Se registran en `Init::init()` con `Html::addFunction()`:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Html;
use FacturaScripts\Core\Template\InitClass;
use Twig\TwigFunction;

class Init extends InitClass
{
    public function init(): void
    {
        Html::addFunction(
            new TwigFunction('miPluginFecha', function (string $formato = 'Y-m-d') {
                return date($formato);
            })
        );
    }

    public function uninstall(): void
    {
    }

    public function update(): void
    {
    }
}
```

Uso: `{{ miPluginFecha() }}` o `{{ miPluginFecha('d/m/Y') }}`. Usa un prefijo propio para no colisionar con otras funciones.

---

## 6. Herencia de plantillas

### Reemplazar una plantilla del core y heredar de ella

```twig
{% extends '@Core/Master/MenuTemplate.html.twig' %}

{% block body %}
    <h1>{{ trans('my-title') }}</h1>
{% endblock %}
```

### Heredar de una plantilla de otro plugin

```twig
{% extends "@PluginNombrePlugin/MiPlantilla.html.twig" %}

{% block body %}
    {{ parent() }}
    <p>{{ trans('extra-content') }}</p>
{% endblock %}
```

Usa `@Core/` para el core y `@Plugin{Nombre}/` para un plugin; la ruta es relativa a su carpeta `View/` (`herencia-de-plantillas-904.md`).

---

## 7. Assets

- Los archivos `Assets/CSS/{Controlador}.css`, `Assets/JS/{Controlador}.js` y `Assets/JS/{Controlador}.mjs` se cargan solos en ese controlador.
- Para otros archivos, usa `FacturaScripts\Dinamic\Lib\AssetManager` desde el controlador: `addCss()`, `addJs()`, `addJsModule()` y la ruta `FS_ROUTE . '/Plugins/MiPlugin/Assets/...'` (`assetmanager-309.md`).
- No añadas `<link>` ni `<script>` a mano para los assets del plugin.

---

## 8. Ganchos: permitir que otros plugins extiendan tu vista

```twig
{# View/MiPlantilla.html.twig #}
{% for includeView in getIncludeViews('MiPlantilla', 'head') %}
    {% include includeView['path'] %}
{% endfor %}

<div id="sidebar">
    {% for includeView in getIncludeViews('MiPlantilla', 'sidebar') %}
        {% include includeView['path'] %}
    {% endfor %}
</div>
```

- El primer parámetro es el nombre de la plantilla, sin extensión ni guiones bajos.
- El segundo es el nombre de la ubicación, que eliges tú y **no puede contener `_`**.
- Puedes añadir tantas ubicaciones como quieras.

---

## 9. Extender la vista de otro plugin o del core

Crea los archivos en `Extension/View/` con el nombre `NOMBREPLANTILLA_UBICACION[_ORDEN].html.twig` (`extensiones-de-vistas-html.md`):

```
Plugins/MiPlugin/Extension/View/MiPlantilla_head_05.html.twig
Plugins/MiPlugin/Extension/View/MiPlantilla_sidebar.html.twig      (orden 10)
Plugins/MiPlugin/Extension/View/MenuTemplate_BodyEnd_20.html.twig  (gancho real del core)
```

- El orden es un número entero; sin número se usa `10`.
- Ganchos reales del core: `MenuTemplate` (`HeadEnd`, `CssAfter`, `BodyEnd`, `JsFooter`...), `PanelController` (`topButtons`), `Dashboard` (`sectionsAfter`...). Busca más con `rg -n "getIncludeViews" Core/View`.
- La plantilla incluida recibe el contexto de la original (`fsc`, `controllerName`...): úsalo para limitarla a un controlador.

```twig
{# Extension/View/MiPlantilla_sidebar.html.twig #}
<div class="alert alert-info">
    {{ trans('my-plugin-info') }}
</div>
```

---

## 10. Resumen de ubicaciones

| Archivo | Ubicación |
|---|---|
| Vista principal | `Plugins/MiPlugin/View/MiVista.html.twig` |
| Pestaña HTML | `Plugins/MiPlugin/View/Tab/MiTab.html.twig` |
| Bloque reutilizable | `Plugins/MiPlugin/View/Block/MiBloque.html.twig` |
| Extensión de una vista ajena | `Plugins/MiPlugin/Extension/View/NombrePlantilla_ubicacion_orden.html.twig` |

## Para más información

Consulta la skill `fs-dev:docs-expert` para revisar la documentación oficial. Para una capa de presentación completa (varias plantillas, JavaScript y assets), usa `fs-dev:frontend-developer`.
