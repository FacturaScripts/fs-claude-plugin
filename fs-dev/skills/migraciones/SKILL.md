---
name: migraciones
description: Explica cómo crear y registrar migraciones de datos en FacturaScripts, que se ejecutan una única vez al activar o actualizar un plugin.
---

# Skill: Migraciones en FacturaScripts

Las migraciones permiten ejecutar **operaciones sobre datos** de forma controlada y **una única vez**, tras activar o actualizar un plugin. Las ejecutadas se registran en `MyFiles/migrations.json` para no repetirlas.

> **Importante:** las migraciones son para **cambios en datos**, nunca para cambios de estructura. La estructura la gestiona automáticamente `DbUpdater` a partir de los XML de `Table/`.

Documento de referencia: `../../references/docs/migraciones-de-tablas.md`.

## Cuándo usar migraciones

- Rellenar nuevos campos con valores para registros existentes.
- Migrar valores a un nuevo formato.
- Normalizar datos de versiones anteriores.
- Limpiar registros huérfanos o referencias rotas.
- Corregir valores incorrectos o actualizar configuraciones de registros existentes.

## Generar con fsmaker

```bash
fsmaker migration
```

Genera un archivo base en `Migration/` listo para completar.

## Paso 1: Crear la clase de migración

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Migration;

use FacturaScripts\Core\Template\MigrationClass;

/**
 * Rellena el campo 'prioridad' para clientes existentes al actualizar a v1.2.0.
 */
class RellenarPrioridadClientes extends MigrationClass
{
    /** Identificador descriptivo, con versión o fecha. */
    const MIGRATION_NAME = 'rellenar_prioridad_clientes_v1.2.0';

    public function run(): void
    {
        if (false === $this->db()->tableExists('clientes')) {
            return;
        }

        // exec() lanza RuntimeException si el SQL falla: la migración no se marca
        // como ejecutada y se reintentará en la próxima actualización
        $this->exec("UPDATE clientes SET prioridad = 'normal' WHERE prioridad IS NULL OR prioridad = ''");
    }
}
```

## Paso 2: Registrar en Init.php

Las migraciones se lanzan desde `update()`, que se ejecuta al activar el plugin y al actualizarlo si está activo:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Migrations;
use FacturaScripts\Core\Template\InitClass;
use FacturaScripts\Core\Tools;

class Init extends InitClass
{
    public function init(): void
    {
    }

    public function update(): void
    {
        // Varias migraciones en orden cronológico: se detiene en la primera que falle
        $ok = Migrations::runPluginMigrations([
            new Migration\FixV1_0_0(),
            new Migration\FixV1_1_0(),
            new Migration\RellenarPrioridadClientes(),
        ]);

        if (false === $ok) {
            // el error ya está en el log y las pendientes se reintentarán en la próxima actualización
            Tools::log()->warning('Hay migraciones pendientes de MiPlugin.');
        }

        // Para una sola migración: Migrations::runPluginMigration(new Migration\RellenarPrioridadClientes());
    }

    public function uninstall(): void
    {
    }
}
```

`init()`, `update()` y `uninstall()` son abstractos en `Core\Template\InitClass` y deben existir aunque estén vacíos.

## Flujo de ejecución

```
Usuario activa o actualiza el plugin
    ↓
Init::update()
    ↓
Migrations::runPluginMigration(s)()
    ↓
¿Ya está en migrations.json? → Sí: se considera aplicada (true)
    ↓ No
Migration->run()
    ↓                              ↘ lanza excepción
Se marca como ejecutada            Se registra en el log (MIGRATION ERROR: MiPlugin::nombre - mensaje),
y devuelve true                    NO se marca, devuelve false y, con runPluginMigrations(),
                                   no se ejecutan las siguientes
```

Las migraciones fallidas se reintentan en la siguiente actualización, y borrar `migrations.json` las ejecutaría todas de nuevo: escríbelas siempre de forma **idempotente**.

## API de MigrationClass

```php
const MIGRATION_NAME = 'nombre_v1.0.0';      // obligatorio
public function run(): void                  // tu lógica; lanza una excepción para indicar fallo
$this->exec($sql);                           // ejecuta SQL y lanza RuntimeException si falla
$this->db();                                 // conexión DataBase compartida entre migraciones
static::getFullMigrationName();              // 'MiPlugin::nombre_v1.0.0', el identificador registrado

// Métodos útiles de DataBase
$this->db()->tableExists('nombre_tabla');    // bool
$this->db()->getColumns('nombre_tabla');     // columnas de la tabla
$this->db()->select($sql);                   // array de filas
$this->db()->var2str($valor);                // escapa un valor para SQL
$this->db()->type();                         // 'mysql' o 'postgresql'
```

No uses `$this->db()->exec()` para modificar datos: devuelve `false` y deja el error solo en el log de base de datos, así que la migración quedaría marcada como ejecutada aunque no haya hecho nada.

## Buenas prácticas

### Nomenclatura de MIGRATION_NAME

El identificador registrado es `NombrePlugin::MIGRATION_NAME`; el plugin se deduce del namespace, así que dos plugins pueden usar el mismo nombre sin colisionar. Aun así, hazlo descriptivo:

```php
// Bien: descriptivo, con versión o fecha
const MIGRATION_NAME = 'rellenar_campo_prioridad_v1.5.0';
const MIGRATION_NAME = 'limpiar_referencias_huerfanas_2025_02_05';

// Mal: genérico
const MIGRATION_NAME = 'fix1';
```

### Verificaciones e idempotencia

```php
public function run(): void
{
    if (false === $this->db()->tableExists('mi_tabla')) {
        return;
    }

    // Solo los registros que necesitan el cambio
    $this->exec("UPDATE mi_tabla SET campo = 'valor' WHERE campo IS NULL OR campo = ''");
}
```

Para señalar cualquier otro problema, lanza una excepción desde `run()`; no la captures en silencio.

### Compatibilidad MySQL / PostgreSQL

```php
// Usa SQL estándar siempre que sea posible
$sql = 'UPDATE clientes SET activo = true WHERE activo IS NULL';

// Para funciones específicas del motor, comprueba el tipo con type()
if ($this->db()->type() === 'mysql') {
    $sql = 'UPDATE tabla SET fecha = DATE_ADD(fecha, INTERVAL 1 DAY)';
} else {
    $sql = "UPDATE tabla SET fecha = fecha + INTERVAL '1 day'";
}
$this->exec($sql);
```

No compares `getEngine()` con una cadena: devuelve el objeto del motor, no su nombre (el ejemplo de la documentación tiene este error).

### No eliminar migraciones antiguas

Una vez publicada una migración, **nunca la elimines**: quien actualice desde versiones antiguas necesita todas las intermedias, en orden.

### Forzar la reejecución durante el desarrollo

1. Elimina su entrada de `MyFiles/migrations.json`.
2. O cambia temporalmente el valor de `MIGRATION_NAME`.

## Para más información

Consulta la skill `fs-dev:docs-expert` y `../../references/docs/migraciones-de-tablas.md`.
