---
name: crear-html-twig
description: Crea, usa y extiende vistas Twig en FacturaScripts, incluyendo herencia desde Core o plugins y ganchos para extensión por otros plugins.
---

# Skill: Crear Vistas HTML Twig en FacturaScripts

Las vistas Twig son archivos `.html.twig` ubicados en la carpeta `View/` del plugin. Permiten construir interfaces completamente personalizadas usando el motor de plantillas Twig 3.

## Atajo con fsmaker

Para generar una vista Twig con la estructura base ya preparada:

```bash
fsmaker view
```

fsmaker solicita el nombre de la vista y genera el archivo `.html.twig` en `View/` con la herencia de plantilla correcta. Los apartados siguientes documentan la estructura completa y las funciones disponibles.

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
        <h1>{{ trans('my-title') }}</h1>
    </div>
{% endblock %}

{% block css %}
    {{ parent() }}
    {# CSS adicional aquí #}
{% endblock %}

{% block javascripts %}
    {{ parent() }}
    {# JS adicional aquí #}
{% endblock %}
```

### Sin menú (interfaz mínima)
```twig
{% extends "Master/MicroTemplate.html.twig" %}

{% block body %}
    <h1>Vista mínima</h1>
{% endblock %}
```

---

## 2. Usar la vista desde el controlador

### Como vista principal del controlador
```php
// En el método exec() o privateCore() del controlador:
$this->setTemplate('MiVista'); // carga View/MiVista.html.twig
```

Para desactivar la salida HTML (respuestas JSON, descargas, etc.):
```php
$this->setTemplate(false);
```

### Como pestaña dentro de un PanelController o EditController
```php
protected function createViews(): void
{
    // addHtmlView(viewName, templateName, modelName, title, icon)
    $this->addHtmlView('tab-producto', 'Tab/MiTab', 'Producto', 'producto', 'fas fa-box');
}
```
- El archivo debe estar en `View/Tab/MiTab.html.twig`
- El modelo puede ser cualquier string si no se necesita modelo específico

---

## 3. Variables disponibles en la vista

| Variable | Descripción |
|---|---|
| `fsc` | Referencia al controlador (acceso a propiedades/métodos públicos) |
| `controllerName` | Nombre del controlador activo |
| `template` | Nombre de la plantilla cargada |
| `assetManager` | Assets CSS/JS cargados desde el controlador |
| `log` | Instancia de MiniLog |

### Pasar datos desde el controlador
Declara propiedades públicas en el controlador:
```php
class MiControlador extends Controller
{
    public array $datos = [];

    public function privateCore(&$response, $user, $permissions): void
    {
        parent::privateCore($response, $user, $permissions);
        $this->datos = ['clave' => 'valor'];
    }
}
```

En la vista:
```twig
{% for item in fsc.datos %}
    <p>{{ item }}</p>
{% endfor %}
```

---

## 4. Funciones Twig disponibles

```twig
{# Traducción #}
{{ trans('save') }}
{{ trans('record-save-ok', {'%code%': 'FAC001'}) }}
{{ trans('save', {}, 'de_DE') }}

{# URLs #}
{{ fsc.url() }}
{{ asset('ListFacturaCliente') }}

{# Usuario actual #}
{{ fsc.user.nick }}

{# Token CSRF en formularios #}
{{ formToken() }}
{{ formToken(false) }}  {# solo el valor del token #}

{# Formateo de números #}
{{ number(20.338547) }}
{{ number(20.338547, 4) }}

{# Formateo de precios #}
{{ money(15.42) }}
{{ money(15.42, 'EUR') }}

{# Configuración de la aplicación #}
{% set divisa = settings('default', 'coddivisa') %}
{% set dias = settings('default', 'dias', 7) %}

{# Archivos de la biblioteca #}
{% set file = attachedFile(5) %}
{{ file.path }}

{# Toasts / notificaciones JS #}
{% include 'Macro/Toasts.html.twig' %}
<script>setToast('Mensaje', 'warning', 'Título', 10000);</script>
```

---

## 5. Añadir funciones Twig personalizadas

Desde `Init.php` del plugin, registrar funciones globales usando `Html::addFunction()`:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Html;
use FacturaScripts\Core\Base\InitClass;
use Twig\TwigFunction;

class Init extends InitClass
{
    public function init(): void
    {
        Html::addFunction(
            new TwigFunction('fechaFormato', function (string $formato = 'Y-m-d') {
                return date($formato);
            })
        );
    }

    public function update(): void {}
}
```

Uso en cualquier vista Twig:
```twig
{{ fechaFormato() }}
{{ fechaFormato('d/m/Y') }}
```

---

## 6. Herencia de plantillas

### Heredar de una plantilla del Core
```twig
{% extends '@Core/Master/MenuTemplate.html.twig' %}

{% block body %}
    <h1>Contenido que reemplaza el bloque body del Core</h1>
{% endblock %}
```

### Heredar de una plantilla de otro plugin
```twig
{% extends "@PluginNombrePlugin/MiPlantilla.html.twig" %}

{% block body %}
    {{ parent() }}
    <p>Contenido extra añadido al bloque del plugin</p>
{% endblock %}
```

> Usa el identificador `@Core/` para plantillas del Core y `@PluginNombrePlugin/` para plantillas de un plugin concreto. Esto permite reemplazar la plantilla en `Dinamic/` mientras se sigue heredando de la original.

---

## 7. Ganchos (hooks): permitir que otros plugins extiendan tu vista

Añade puntos de extensión con `getIncludeViews()` en tu plantilla:

```twig
{# View/MiPlantilla.html.twig #}
<html>
    <head>
        {% for includeView in getIncludeViews('MiPlantilla', 'head') %}
            {% include includeView['path'] %}
        {% endfor %}
    </head>
    <body>
        {% for includeView in getIncludeViews('MiPlantilla', 'body') %}
            {% include includeView['path'] %}
        {% endfor %}

        <div id="sidebar">
            {% for includeView in getIncludeViews('MiPlantilla', 'sidebar') %}
                {% include includeView['path'] %}
            {% endfor %}
        </div>
    </body>
</html>
```

- El primer parámetro es el nombre de la plantilla (sin extensión)
- El segundo parámetro es el nombre de la posición (inventado por el autor)
- Se pueden añadir tantas posiciones como se desee

---

## 8. Extender la vista de otro plugin desde tu plugin

Crea los archivos en `Extension/View/` siguiendo la nomenclatura:

```
NOMBRE_PLANTILLA_POSICION_ORDEN.html.twig
```

### Ejemplos de archivos
```
Plugins/MiPlugin/Extension/View/MiPlantilla_head_05.html.twig
Plugins/MiPlugin/Extension/View/MiPlantilla_body_10.html.twig
Plugins/MiPlugin/Extension/View/MiPlantilla_sidebar_15.html.twig
```

- El orden es un número de 2 dígitos (menor = antes). Por defecto es `10`.
- Si hay varios plugins, se ordenan alfabéticamente si no tienen número.

### Contenido de ejemplo

`MiPlantilla_head_05.html.twig`:
```twig
<meta name="mi-plugin" content="activo">
<link rel="stylesheet" href="{{ asset('Plugins/MiPlugin/Assets/CSS/mi-estilo.css') }}">
```

`MiPlantilla_body_10.html.twig`:
```twig
<div class="alert alert-info">
    {{ trans('my-plugin-info') }}
</div>
```

---

## 9. Resumen de ubicaciones

| Archivo | Ubicación |
|---|---|
| Vista principal del plugin | `Plugins/MiPlugin/View/MiVista.html.twig` |
| Pestaña HTML (tab) | `Plugins/MiPlugin/View/Tab/MiTab.html.twig` |
| Extensión de vista de otro plugin | `Plugins/MiPlugin/Extension/View/NombrePlantilla_posicion_orden.html.twig` |

---


## Para más información

Para consultar la documentación oficial completa sobre vistas Twig y herencia de plantillas, invoca el agente **docs-expert** que te proporcionará detalles completos directamente desde la documentación oficial del framework.
