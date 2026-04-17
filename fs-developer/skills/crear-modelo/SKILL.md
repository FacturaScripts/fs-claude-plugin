---
name: crear-modelo
description: Crea un modelo de FacturaScripts con su clase PHP y archivo XML de tabla.
---

# Skill: Crear Modelo FacturaScripts

Cuando el usuario pida crear un modelo, genera los dos archivos necesarios: la **clase PHP** y el **XML de tabla**.

## Atajo con fsmaker

Antes de crear los archivos a mano, considera usar la herramienta CLI:

```bash
fsmaker model
```

fsmaker solicita el nombre del modelo, nombre de la tabla y las columnas, y genera automáticamente la clase PHP y el XML de tabla. Los pasos siguientes explican la estructura en detalle para cuando necesites ajustar o crear los archivos manualmente.

## Paso 1: Información necesaria

Pregunta al usuario:
- **Nombre del modelo** (singular, PascalCase. Ej: `Project`)
- **Nombre de la tabla** (plural, snake_case. Ej: `projects`)
- **Plugin** al que pertenece
- **Columnas** que tendrá (nombre como snake_case, tipo, obligatorio)

## Paso 2: Crear la clase PHP

Archivo: `Plugins/MiPlugin/Model/NombreModelo.php`

```php
<?php

namespace FacturaScripts\Plugins\MiPlugin\Model;

use FacturaScripts\Core\Template\ModelClass;
use FacturaScripts\Core\Template\ModelTrait;
use FacturaScripts\Core\Tools;

class NombreModelo extends ModelClass
{
    use ModelTrait;

    /** @var bool */
    public $active;

    /** @var string */
    public $creation_date;

    /** @var int */
    public $id;

    /** @var string */
    public $name;

    public function clear(): void
    {
        parent::clear();
        $this->active = true;
        $this->creation_date = Tools::dateTime();
    }

    public static function primaryColumn(): string
    {
        return 'id';
    }

    public static function tableName(): string
    {
        return 'nombre_tabla';
    }

    public function test(): bool
    {
        // Validaciones antes de guardar
        if (empty($this->name)) {
            Tools::log()->error('El nombre es obligatorio');
            return false;
        }
        return parent::test();
    }
}
```

## Paso 3: Crear el XML de tabla

Archivo: `Plugins/MiPlugin/Table/nombre_tabla.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<table>
    <column>
        <name>id</name>
        <type>serial</type>
        <null>NO</null>
    </column>
    <column>
        <name>name</name>
        <type>character varying(100)</type>
        <null>NO</null>
    </column>
    <column>
        <name>active</name>
        <type>boolean</type>
        <default>true</default>
    </column>
    <column>
        <name>creation_date</name>
        <type>timestamp without time zone</type>
    </column>
    <constraint>
        <name>nombre_tabla_pkey</name>
        <type>PRIMARY KEY (id)</type>
    </constraint>
</table>
```

## Tipos de columna más comunes

| Tipo PHP | Tipo XML |
|----------|---------|
| `int` | `integer` o `serial` (autoincrement) |
| `float/double` | `double precision` |
| `string` corto | `character varying(N)` |
| `string` largo | `text` |
| `bool` | `boolean` |
| `date` | `date` |
| `datetime` | `timestamp without time zone` |

## Operaciones comunes con modelos

```php
// Crear
$modelo = new NombreModelo();
$modelo->name = 'Mi nombre';
$modelo->save();

// Leer por ID
$modelo = new NombreModelo();
$modelo->loadFromCode($id);

// Listar todos
$lista = NombreModelo::all();

// Filtrar
use FacturaScripts\Core\Where;
$where = [Where::eq('active', true)];
$lista = NombreModelo::all($where, ['name' => 'ASC']);

// Eliminar
$modelo->delete();
```

## Reglas importantes
- Nombre del modelo: singular, PascalCase (`Project`, `Edificio`)
- Nombre de la tabla: plural, snake_case (`projects`, `edificios`)
- Evitar columnas llamadas `action` o `code`
- Usar solo minúsculas en nombres de columnas y en formato snake_case
- El XML va en `Table/`, no en `Data/Table/`
- La tabla se crea automáticamente, no hace falta SQL manual


## Para más información

Para consultar la documentación oficial completa sobre modelos y tablas en FacturaScripts, invoca el agente **docs-expert** que te proporcionará detalles completos directamente desde la documentación oficial del framework.
