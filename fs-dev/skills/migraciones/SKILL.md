---
name: migraciones
description: Explica cómo crear y registrar migraciones en FacturaScripts para ejecutar cambios en datos de la base de datos una única vez tras instalar o actualizar un plugin.
---

# Skill: Migraciones en FacturaScripts

Las migraciones permiten ejecutar **operaciones sobre datos** de la base de datos de forma controlada, **una única vez**, tras instalar o actualizar un plugin. Se registran en `MyFiles/migrations.json` para evitar su re-ejecución.

> **Importante:** Las migraciones son para **cambios en datos**, NO para cambios en la estructura de las tablas. La estructura se gestiona automáticamente mediante los archivos XML en `Table/`.

## Cuándo usar migraciones

- Rellenar nuevos campos con valores por defecto para registros existentes
- Migrar valores al nuevo formato cuando cambia un campo
- Normalizar datos de versiones anteriores
- Limpiar registros huérfanos o referencias rotas
- Corregir valores incorrectos detectados en versiones anteriores

## Generar con fsmaker

```bash
fsmaker migration
```

Genera un archivo base en `Migration/` listo para completar.

## Estructura de archivos

```
Plugins/MiPlugin/
├── Init.php
└── Migration/
    ├── RellenarEstadoPedidos.php
    ├── NormalizarCodigosPostales.php
    └── LimpiarDatosLegacy.php
```

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
    // Identificador único — debe ser descriptivo e incluir versión o fecha
    const MIGRATION_NAME = 'rellenar_prioridad_clientes_v1.2.0';

    public function run(): void
    {
        // Siempre verificar que la tabla existe
        if (!$this->db()->tableExists('clientes')) {
            return;
        }

        $sql = "UPDATE clientes SET prioridad = 'normal' WHERE prioridad IS NULL OR prioridad = ''";
        $this->db()->exec($sql);
    }
}
```

## Paso 2: Registrar en Init.php

Las migraciones se ejecutan en el método `update()` del `Init.php`:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Base\InitClass;
use FacturaScripts\Core\Migrations;

class Init extends InitClass
{
    public function init(): void
    {
    }

    public function update(): void
    {
        // Una sola migración
        Migrations::runPluginMigration(new Migration\RellenarPrioridadClientes());

        // O varias migraciones en orden cronológico
        Migrations::runPluginMigrations([
            new Migration\FixV1_0_0(),
            new Migration\FixV1_1_0(),
            new Migration\RellenarPrioridadClientes(),
        ]);
    }
}
```

## Flujo de ejecución

```
Usuario instala o actualiza el plugin
    ↓
Sistema ejecuta Init.php::update()
    ↓
Migrations::runPluginMigration()
    ↓
¿Ya ejecutada? → Consulta MyFiles/migrations.json
    ↓ No
Migration->run() → Ejecuta el SQL
    ↓
Marca como ejecutada en migrations.json
```

## Métodos disponibles en MigrationClass

```php
$this->db()->tableExists('nombre_tabla');     // Verifica si existe la tabla
$this->db()->getColumns('nombre_tabla');      // Obtiene columnas de la tabla
$this->db()->exec($sql);                      // Ejecuta SQL sin retorno
$this->db()->select($sql);                    // Ejecuta SQL con retorno de filas
$this->db()->var2str($valor);                 // Escapa un valor para SQL
$this->db()->getEngine();                     // 'mysql' o 'postgresql'
```

## Buenas prácticas

### Nomenclatura del MIGRATION_NAME

```php
// Bien: descriptivo con versión o fecha
const MIGRATION_NAME = 'rellenar_campo_prioridad_v1.5.0';
const MIGRATION_NAME = 'migrar_estados_pedidos_v2.0.0';
const MIGRATION_NAME = 'limpiar_referencias_huerfanas_2025_02_05';

// Mal: genérico
const MIGRATION_NAME = 'fix1';
const MIGRATION_NAME = 'update';
```

### Verificaciones de seguridad

```php
public function run(): void
{
    if (!$this->db()->tableExists('mi_tabla')) {
        return;
    }

    // Solo actualizar registros que necesitan cambio
    $sql = "UPDATE mi_tabla SET campo = 'valor' WHERE campo IS NULL OR campo = ''";
    $this->db()->exec($sql);
}
```

### Compatibilidad MySQL / PostgreSQL

```php
// Usar sintaxis SQL estándar siempre que sea posible
$sql = "UPDATE clientes SET activo = 1 WHERE activo IS NULL";

// Para funciones específicas del motor, detectar primero
if ($this->db()->getEngine() === 'mysql') {
    $sql = "UPDATE tabla SET fecha = DATE_ADD(fecha, INTERVAL 1 DAY)";
} else {
    $sql = "UPDATE tabla SET fecha = fecha + INTERVAL '1 day'";
}
```

### No eliminar migraciones antiguas

Una vez publicada una migración, **nunca eliminarla**. Los usuarios que actualicen desde versiones antiguas necesitan todas las intermedias:

```php
Migrations::runPluginMigrations([
    new Migration\FixV1_0_0(),   // Usuarios en v0.9 la necesitan
    new Migration\FixV1_1_0(),   // Usuarios en v1.0 la necesitan
    new Migration\FixV1_2_0(),   // La más reciente
]);
```

### Forzar re-ejecución durante desarrollo

Si necesitas probar una migración varias veces:
1. Elimina su entrada de `MyFiles/migrations.json`
2. O cambia temporalmente el valor de `MIGRATION_NAME`

## Para más información

Para consultar la documentación oficial completa sobre migraciones en FacturaScripts, invoca el agente **docs-expert** que te proporcionará detalles completos directamente desde la documentación oficial del framework.
