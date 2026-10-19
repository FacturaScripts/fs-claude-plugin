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
        $this->name = Tools::noHtml($this->name);
        if (empty($this->name)) {
            // clave de traducción del plugin, definida en Translation/es_ES.json
            Tools::log()->warning('mi-plugin-nombre-obligatorio');
            return false;
        }

        // comprueba los NOT NULL y la longitud máxima de cada columna
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
        <type>timestamp</type>
    </column>
    <constraint>
        <name>nombre_tabla_pkey</name>
        <type>PRIMARY KEY (id)</type>
    </constraint>
    <index>
        <name>nombre_tabla_creation_date_idx</name>
        <columns>creation_date</columns>
    </index>
</table>
```

El `<index>` es opcional: úsalo cuando una columna (no clave) se use habitualmente en `WHERE`, `ORDER BY` o `JOIN`, para mejorar el rendimiento de las consultas.

## Tipos de columna más comunes

| Tipo PHP | Tipo XML |
|----------|---------|
| `int` | `integer` o `serial` (autoincrement) |
| `float/double` | `double precision` |
| `string` corto | `character varying(N)` |
| `string` largo | `text` |
| `bool` | `boolean` |
| `date` | `date` |
| `datetime` | `timestamp` |
| hora | `time` |

## Operaciones comunes con modelos

```php
use FacturaScripts\Core\Where;

// Crear
$modelo = new NombreModelo();
$modelo->name = 'Mi nombre';
$modelo->save();                               // llama a test() antes de guardar
$modelo = NombreModelo::create(['name' => 'Otro']);

// Leer
$modelo = NombreModelo::find($id);             // ?NombreModelo
$modelo = NombreModelo::findWhereEq('name', 'Mi nombre');
$modelo = new NombreModelo();
$modelo->load($id);                            // o loadWhere([...]) / loadWhereEq('campo', $valor)

// Listar y contar
$lista = NombreModelo::all([Where::eq('active', true)], ['name' => 'ASC'], 0, 50);
$lista = NombreModelo::allWhereEq('active', true);
$total = NombreModelo::count([Where::eq('active', true)]);

// Actualizar y detectar cambios
$modelo->name = 'Nuevo nombre';
if ($modelo->isDirty('name')) {
    $anterior = $modelo->getOriginal('name');
}
$modelo->save();

// Eliminar
$modelo->delete();
NombreModelo::deleteWhere([Where::eq('active', false)]);
```

Evita `loadFromCode()` y `primaryColumnValue()`, que están obsoletos: usa `load()`/`loadWhere()` e `id()`. Para relaciones entre modelos usa `belongsTo()` y `hasMany()` (`relaciones-de-tablas.md`).

## Reglas importantes

- Nombre del modelo: singular, PascalCase (`Project`, `Edificio`).
- Nombre de la tabla: plural, snake_case (`projects`, `edificios`).
- Evita columnas llamadas `action`, `activetab` o `code`, que están reservadas.
- Usa solo minúsculas y snake_case en los nombres de columna.
- El XML va en `Table/`, con el mismo nombre que la tabla.
- La tabla se crea automáticamente; no hace falta SQL manual. Tras cambiar el XML, pulsa **Reconstruir** en Administrador → Plugins.
- Las validaciones van en `test()`; no existe `validate()`.
- Además de `<constraint>` (`PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`), el XML admite `<index>`; los índices compuestos se declaran con varias columnas separadas por comas. Para diseño avanzado de datos, consulta la skill `fs-dev:sql-expert`.

## Para más información

Consulta la skill `fs-dev:docs-expert` y, en `../../references/docs/`, los documentos `los-modelos-228.md`, `la-definicion-de-la-estructura-de-la-tabla-514.md`, `test-625.md` y `metodos-getoriginal-isdirty-y-getdirty-del-modelo.md`.
