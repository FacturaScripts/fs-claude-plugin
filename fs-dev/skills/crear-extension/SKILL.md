---
name: crear-extension
description: Guía para escribir un archivo de extensión concreto de FacturaScripts (modelo, controlador, tabla, XMLView o vista Twig) y registrarlo en Init.php.
---

# Skill: crear una extensión de FacturaScripts

Las extensiones añaden o modifican funcionalidad de clases del core o de otros plugins **sin modificar su código fuente**. No son herencia: varios plugins pueden extender la misma clase (`las-extensiones-334.md`).

## Atajo con fsmaker

```bash
fsmaker extension
```

fsmaker pregunta el tipo (tabla, modelo, controlador, XMLView o vista) y el nombre, y genera el archivo base. Los apartados siguientes sirven para completarlo o crearlo a mano.

## Extensión de modelo

Archivo: `Plugins/MiPlugin/Extension/Model/Producto.php`

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Extension\Model;

use Closure;
use FacturaScripts\Core\Tools;

class Producto
{
    // ANTES de insertar: devolver false impide la inserción
    public function saveInsertBefore(): Closure
    {
        return function () {
            // $this es el modelo Producto
        };
    }

    // DESPUÉS de actualizar
    public function saveUpdate(): Closure
    {
        return function () {
            if ($this->isDirty('precio')) {
                Tools::log()->notice('price-changed');
            }
        };
    }

    // ANTES de borrar: devolver false impide el borrado
    public function deleteBefore(): Closure
    {
        return function () {
        };
    }

    // ANTES de validar: devolver false impide test() y, por tanto, save()
    public function testBefore(): Closure
    {
        return function () {
        };
    }

    // Método nuevo: $producto->miPluginUsado()
    public function miPluginUsado(): Closure
    {
        return function () {
            return (bool)$this->usado;
        };
    }
}
```

### Métodos disponibles para extender en modelos (`extensiones-de-modelos.md`)

- **clear()**: al instanciar el modelo; asigna valores predeterminados.
- **delete()**: después del `delete()` del modelo.
- **deleteBefore()**: antes del `delete()`; si devuelve `false`, impide el borrado.
- **save()**: después del `save()` del modelo.
- **saveBefore()**: antes del `save()`; si devuelve `false`, impide el guardado.
- **saveInsert()**: después del `saveInsert()` del modelo.
- **saveInsertBefore()**: antes del `saveInsert()`; si devuelve `false`, lo impide.
- **saveUpdate()**: después del `saveUpdate()` del modelo.
- **saveUpdateBefore()**: antes del `saveUpdate()`; si devuelve `false`, lo impide.
- **test()**: después del `test()` del modelo.
- **testBefore()**: antes del `test()`; si devuelve `false`, lo impide.
- **url()**: después del `url()` del modelo.
- **onChange()**: antes del `saveUpdate()`, para detectar cambios en columnas.

Para comparar valores usa `isDirty()`, `getOriginal()` y `getDirty()` (`metodos-getoriginal-isdirty-y-getdirty-del-modelo.md`).

## Extensión de controlador

Archivo: `Plugins/MiPlugin/Extension/Controller/EditProducto.php`

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Extension\Controller;

use Closure;
use FacturaScripts\Core\Where;

class EditProducto
{
    public function createViews(): Closure
    {
        return function () {
            // $this es el controlador EditProducto
            $this->addListView('ListMiModelo', 'MiModelo', 'my-model', 'fa-solid fa-list')
                ->addOrderBy(['fecha'], 'date', 2)
                ->addSearchFields(['nombre'])
                ->setSettings('group', 'warehouse'); // grupo de pestañas (2026.7)
        };
    }

    public function loadData(): Closure
    {
        return function ($viewName, $view) {
            if ($viewName === 'ListMiModelo') {
                $idproducto = $this->tabModelValue('EditProducto', 'idproducto'); // 2026.5+
                $view->loadData('', [Where::eq('idproducto', $idproducto)]);
                $this->miPluginTotal = $view->count; // propiedad dinámica con prefijo propio
            }
        };
    }
}
```

### Métodos disponibles para extender en controladores (`extensiones-de-controladores.md`)

- **createViews()**: después del `createViews()` del controlador.
- **execPreviousAction($action)**: después del `execPreviousAction()`; si devuelve `false`, detiene el controlador.
- **loadData($viewName, $view)**: después del `loadData()` del controlador.
- **execAfterAction($action)**: después del `execAfterAction()` del controlador.
- **selectAction($data, $required)**: antes de cargar los datos de un widget select; devuelve un array de pares `key`/`value`.

Novedades de la versión 2026.7:

- **Agrupar pestañas**: `->setSettings('group', 'clave')` en la vista que añades, o `$this->setSettings($viewName, 'group', 'clave')` para mover una del controlador. Las claves `sales`, `purchases` y `warehouse` ya tienen traducción.
- **Propiedades dinámicas**: `$this->miPropiedad` ya no provoca el aviso de PHP 8.2; usa un prefijo propio del plugin.

Solo los controladores extendidos (List, Edit, Panel) y los antiguos de `Core\Base\Controller` admiten extensiones; los que heredan de `Core\Template\Controller`, no.

## Extensión de XMLView

Archivo: `Plugins/MiPlugin/Extension/XMLView/EditProducto.xml`

### Añadir una columna nueva

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <columns>
        <group name="options" numcolumns="12" valign="bottom">
            <column name="usado" order="500">
                <widget type="checkbox" fieldname="usado"/>
            </column>
        </group>
    </columns>
</view>
```

### Reemplazar una columna existente

Repite el grupo y la columna con el mismo `name` y añade **`overwrite="true"`**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <columns>
        <group name="options" numcolumns="12" valign="bottom">
            <column name="usado" overwrite="true">
                <widget type="select" fieldname="usado" translate="true" required="true">
                    <values title="yes">1</values>
                    <values title="no">0</values>
                </widget>
            </column>
        </group>
    </columns>
</view>
```

Sin `overwrite="true"`, los elementos con el mismo `name` se fusionan y los hijos nuevos se añaden; una columna acabaría con dos widgets.

> **Nota:** si la vista se ha personalizado con el botón de opciones, prevalece la configuración guardada en la base de datos.

## Extensión de tabla

Archivo: `Plugins/MiPlugin/Extension/Table/productos.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<table>
    <column>
        <name>mi_campo</name>
        <type>character varying(100)</type>
    </column>
</table>
```

No crees `Table/productos.xml` en tu plugin: indicaría que la tabla solo tiene esa columna. El modelo carga la columna nueva sin cambios (`extensiones-de-tablas.md`).

## Extensión de vista Twig

Añade contenido en ubicaciones (ganchos) de una plantilla, **sin sobrescribirla** (`extensiones-de-vistas-html.md`).

### La plantilla original debe declarar el gancho

```twig
{% for includeView in getIncludeViews('MiPlantilla', 'head') %}
    {% include includeView['path'] %}
{% endfor %}
```

### Nombre del archivo en `Extension/View/`

```
NOMBREPLANTILLA_UBICACION.html.twig          (orden 10)
NOMBREPLANTILLA_UBICACION_ORDEN.html.twig    (orden propio)
```

- El core separa las partes por `_`: ni la plantilla ni la ubicación pueden contener guiones bajos.
- Los archivos se ordenan por el número de orden; sin número se asume `10`.

Ejemplos con ganchos reales del core:

- `Extension/View/MenuTemplate_JsFooter_20.html.twig`: al final de todas las páginas con menú.
- `Extension/View/PanelController_topButtons.html.twig`: botones superiores de los controladores de pestañas (filtra con `{% if controllerName == 'EditProducto' %}`).
- `Extension/View/Dashboard_sectionsAfter.html.twig`: secciones extra del escritorio.

Busca más ganchos con `rg -n "getIncludeViews" Core/View`.

## Cargar las extensiones PHP en Init.php

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Template\InitClass;

class Init extends InitClass
{
    public function init(): void
    {
        $this->loadExtension(new Extension\Model\Producto());
        $this->loadExtension(new Extension\Controller\EditProducto());
    }

    public function uninstall(): void
    {
    }

    public function update(): void
    {
    }
}
```

`loadExtension()` acepta también extensiones de clases base que se aplican a varias clases: `BusinessDocument`, `SalesDocument`, `PurchaseDocument` y sus líneas, o todos los `EditController` o `ListController` (`el-archivo-init-php-307.md`).

## Reglas importantes

- Las extensiones XML (tablas y XMLView) y Twig se cargan automáticamente; las PHP, en `Init::init()`.
- No se pueden extender clases de `Core/Base`, `Core/Model/Base` ni `Core/Lib/ExtendedController`.
- **Solo se pueden extender los métodos con `pipe()`/`pipeFalse()`**. Si no existe ese punto, la alternativa es la herencia convencional, con sus limitaciones.
- Cada método de la extensión devuelve una `Closure`; dentro, `$this` es el objeto extendido.
- Devolver `false` solo detiene la ejecución en los puntos `*Before` y en `execPreviousAction`.
- No uses `&` en los parámetros de la closure; devuelve el valor modificado.
- Usa `Where` para los filtros y `Tools::log()` para los mensajes.

## Para más información

Consulta la skill `fs-dev:docs-expert` para revisar la documentación oficial. Para una tarea que abarque varias extensiones a la vez, usa `fs-dev:extension-developer`.
