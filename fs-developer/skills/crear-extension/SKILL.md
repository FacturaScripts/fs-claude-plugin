---
name: crear-extension
description: Crea extensiones de FacturaScripts para modificar modelos, controladores o vistas del core o de otros plugins sin modificar su código fuente.
---

# Skill: Crear Extensión FacturaScripts

Las extensiones permiten añadir funcionalidad a clases del core o de otros plugins **sin modificar su código fuente**.

## Atajo con fsmaker

Antes de crear los archivos a mano, considera usar la herramienta CLI:

```bash
fsmaker extension
```

fsmaker solicita el tipo de extensión (tabla, modelo, controlador, XMLView o vista Twig) y el nombre de la clase a extender, y genera el archivo base con la estructura correcta. Los apartados siguientes documentan la estructura completa para cuando necesites ajustar o completar la extensión manualmente.

## Extensión de Modelo

Archivo: `Plugins/MiPlugin/Extension/Model/NombreModelo.php`

```php
<?php

namespace FacturaScripts\Plugins\MiPlugin\Extension\Model;

use Closure;

class NombreModelo
{
    // Se ejecuta ANTES de guardar el modelo
    public function saveInsert(): Closure
    {
        return function () {
            // $this es el modelo original
            // Código a ejecutar antes de insertar
        };
    }

    // Se ejecuta DESPUÉS de guardar
    public function saveUpdate(): Closure
    {
        return function () {
            // Código a ejecutar después de actualizar
        };
    }

    // Se ejecuta al eliminar
    public function delete(): Closure
    {
        return function () {
            // Código a ejecutar al eliminar
        };
    }

    // Se ejecuta en test() (validación)
    public function test(): Closure
    {
        return function () {
            // Añadir validaciones extra
            // Retorna void, el pipe continúa
        };
    }
}
```

### Métodos disponibles para extender en modelos
- **clear()** — al instanciar el modelo, asigna valores predeterminados
- **delete()** — tras el delete() del modelo
- **deleteBefore()** — antes del delete(); si devuelve `false`, impide el borrado
- **save()** — tras el save() del modelo
- **saveBefore()** — antes del save(); si devuelve `false`, impide el guardado
- **saveInsert()** — tras el saveInsert() del modelo
- **saveInsertBefore()** — antes del saveInsert(); si devuelve `false`, lo impide
- **saveUpdate()** — tras el saveUpdate() del modelo
- **saveUpdateBefore()** — antes del saveUpdate(); si devuelve `false`, lo impide
- **test()** — tras el test() del modelo
- **testBefore()** — antes del test(); si devuelve `false`, lo impide
- **url()** — tras el url() del modelo
- **onChange()** — antes del saveUpdate(), para detectar cambios en columnas

## Extensión de Controlador

Archivo: `Plugins/MiPlugin/Extension/Controller/ListProducto.php`

```php
<?php

namespace FacturaScripts\Plugins\MiPlugin\Extension\Controller;

use Closure;

class ListProducto
{
    public function createViews(): Closure
    {
        return function () {
            // Añadir nueva pestaña al listado de productos
            $this->addView('ListMiModelo', 'MiModelo', 'mi-modelo')
                ->addOrderBy(['name'], 'name')
                ->addSearchFields(['name']);
        };
    }
}
```

### Métodos disponibles para extender en controladores
- **createViews()** — tras el createViews() del controlador
- **execPreviousAction($action)** — tras execPreviousAction(); si devuelve `false`, detiene el controlador
- **loadData($viewName, $view)** — tras loadData() del controlador
- **execAfterAction($action)** — tras execAfterAction() del controlador
- **selectAction($data, $required)** — antes de cargar datos en un widget select; debe devolver array clave=valor

## Extensión de XMLView

Archivo: `Plugins/MiPlugin/Extension/XMLView/EditProducto.xml`

### Añadir una columna nueva

```xml
<?xml version="1.0" encoding="UTF-8"?>
<view>
    <columns>
        <group name="options" numcolumns="12" valign="bottom">
            <column name="usado">
                <widget type="checkbox" fieldname="usado" />
            </column>
        </group>
    </columns>
</view>
```

### Editar una columna ya existente

Usar el atributo **`overwrite="true"`** en la columna que se desea modificar:

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

Sin `overwrite="true"`, la columna se añade de nuevo en lugar de reemplazar la existente.

> **Nota:** Si la vista original ha sido modificada desde el botón de opciones, puede que no se muestre el campo añadido, ya que prevalecerá el estado guardado en la base de datos.

Los XMLView de extensión se fusionan automáticamente con el original.

## Extensión de Tabla

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

Las extensiones de tabla también se fusionan automáticamente.

## Extensión de Vistas HTML (Twig)

Permite añadir contenido en ubicaciones (hooks) definidas en plantillas Twig de otros plugins o del core, **sin sobrescribir** la plantilla original.

### Requisito: la plantilla original debe definir ubicaciones

Para que una plantilla pueda ser extendida, debe llamar a `getIncludeViews()` en cada posición donde permita extensiones:

```twig
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
    </body>
</html>
```

### Crear la extensión desde el plugin

Los archivos se guardan en `Extension/View/` con la nomenclatura obligatoria:

```
NOMBRE_PLANTILLA_UBICACION.html.twig           (orden por defecto: 10)
NOMBRE_PLANTILLA_UBICACION_ORDEN.html.twig     (orden personalizado)
```

Ejemplos:
- `Extension/View/MiPlantilla_head.html.twig` → orden 10 (por defecto)
- `Extension/View/MiPlantilla_head_05.html.twig` → carga antes (orden 5)
- `Extension/View/MiPlantilla_body_20.html.twig` → carga después (orden 20)

Si varios plugins extienden la misma ubicación, se ordenan numéricamente. Sin número se asume 10 y se ordenan alfabéticamente entre ellos.

Ejemplo de contenido del archivo de extensión:

```twig
{# Extension/View/MiPlantilla_head_05.html.twig #}
<meta name="description" content="Mi descripción"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
```

Las extensiones de vistas HTML se cargan **automáticamente**, no hace falta registrarlas en `Init.php`.

## Cargar extensiones PHP en Init.php

Las extensiones de PHP (modelos y controladores) **deben cargarse** en `Init.php`:

```php
public function init(): void
{
    // Extensiones de modelos
    $this->loadExtension(new Extension\Model\Producto());
    $this->loadExtension(new Extension\Model\Cliente());

    // Extensiones de controladores
    $this->loadExtension(new Extension\Controller\ListProducto());
    $this->loadExtension(new Extension\Controller\EditProducto());
}
```

## Reglas importantes

- Las extensiones XML (tablas, XMLViews) y Twig se cargan automáticamente
- Las extensiones PHP deben registrarse en `Init.php`
- No es herencia: múltiples plugins pueden extender la misma clase
- No se pueden extender clases de `Core/Base`, `Core/Model/Base` ni `Core/Lib/ExtendedController`
- **Solo se pueden extender funciones con soporte** (las que internamente usan `pipe()`). Si la función que se quiere modificar no tiene `pipe()`, la única opción es usar herencia PHP convencional
- Cada función de extensión debe devolver un `return function() { ... }`
- No usar `&` en parámetros por referencia dentro del `return function()`


## Para más información

Para consultar la documentación oficial completa sobre extensiones de modelos, controladores y vistas, invoca el agente **docs-expert** que te proporcionará detalles completos directamente desde la documentación oficial del framework.
