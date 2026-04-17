---
id: 2514
permalink: migraciones-de-tablas
title: Migraciones de tablas
creationdate: 05-02-2026 18:08:22
lastmod: 05-02-2026
url: https://facturascripts.com/migraciones-de-tablas
---
El sistema de migraciones de FacturaScripts permite a los plugins ejecutar cambios en los datos de la base de datos de forma controlada y segura. Las migraciones se ejecutan **automáticamente tras instalar o actualizar un plugin** y solo se ejecutan una única vez, quedando registradas en `MyFiles/migrations.json` para evitar su re-ejecución.

## ¿Cuándo usar migraciones?

Las migraciones son útiles para **operaciones sobre datos** que deben ejecutarse una sola vez tras instalar o actualizar el plugin:

- **Rellenar nuevos campos**: Cuando añades un campo a una tabla (mediante XML) y necesitas rellenarlo con valores calculados o por defecto para registros existentes
- **Migrar valores**: Cuando cambias los valores soportados de un campo y necesitas actualizar registros existentes al nuevo formato
- **Normalizar datos**: Transformar datos de versiones anteriores al nuevo formato esperado
- **Limpiar datos inconsistentes**: Eliminar registros huérfanos, desvinculaciones, referencias rotas, etc.
- **Corregir datos**: Arreglar valores incorrectos detectados en versiones anteriores
- **Actualizar configuraciones**: Cambiar valores por defecto de registros existentes

**No uses migraciones para:**
- **Cambios de estructura de tablas**: eso ya lo hace automáticamente el `DbUpdater`  usando los archivos XML en la carpeta `Table/`

## Arquitectura del sistema

### Componentes principales

1. **`Core/Migrations.php`**: Clase que gestiona la ejecución de migraciones
   - `runPluginMigration(MigrationClass $migration)`: Ejecuta una migración individual
   - `runPluginMigrations(array $migrations)`: Ejecuta múltiples migraciones

2. **`Core/Template/MigrationClass.php`**: Clase base abstracta para crear migraciones

3. **`MyFiles/migrations.json`**: Archivo que registra las migraciones ejecutadas

### Flujo de ejecución

```
Usuario instala/actualiza el plugin
    ↓
Sistema ejecuta Plugin Init.php::update()
    ↓
Migrations::runPluginMigration()
    ↓
¿Ya ejecutada? (verifica migrations.json)
    ↓ No
Migration->run() (ejecuta las operaciones SQL)
    ↓
Marcar como ejecutada en migrations.json
```

**Momento de ejecución:**
- Al instalar el plugin por primera vez
- Al actualizar el plugin a una nueva versión
- Se ejecuta una sola vez por instalación (gracias al registro en `migrations.json`)

## Estructura de archivos

```
Plugins/
└── MiPlugin/
    ├── Init.php
    └── Migration/
        ├── FixTablaUsuarios.php
        ├── AgregarCampoPersonalizado.php
        └── LimpiarDatosLegacy.php
```

## Crear una migración paso a paso

### Paso 1: Crear la clase de migración

Crea un archivo en `Plugins/MiPlugin/Migration/` con un nombre descriptivo:

```php
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin\Migration;

use FacturaScripts\Core\Template\MigrationClass;

class RellenarEstadoPedidos extends MigrationClass
{
    /**
     * Identificador único de la migración.
     * Debe ser descriptivo e incluir versión o fecha.
     */
    const MIGRATION_NAME = 'rellenar_estado_pedidos_v1.2.0';

    /**
     * Ejecuta la lógica de la migración
     */
    public function run(): void
    {
        // Verificar que la tabla existe
        if (!$this->db()->tableExists('pedidoscli')) {
            return;
        }

        // Rellenar el nuevo campo 'estado' con valor por defecto
        // para pedidos que no lo tengan
        $sql = "UPDATE pedidoscli SET estado = 'pendiente' WHERE estado IS NULL OR estado = ''";
        $this->db()->exec($sql);
    }
}
```

### Paso 2: Registrar la migración en Init.php

En el método `update()` de tu plugin:

```php
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Base\InitClass;
use FacturaScripts\Core\Migrations;

class Init extends InitClass
{
    public function init(): void
    {
        // Tu código de inicialización
    }

    public function update(): void
    {
        // Ejecutar una migración individual
        Migrations::runPluginMigration(new Migration\RellenarEstadoPedidos());

        // O ejecutar múltiples migraciones
        Migrations::runPluginMigrations([
            new Migration\RellenarEstadoPedidos(),
            new Migration\MigrarTiposCliente(),
            new Migration\LimpiarDatosLegacy(),
        ]);
    }
}
```

## Ejemplos prácticos

### Ejemplo 1: Rellenar un nuevo campo con valor por defecto

**Contexto**: Versión 1.2.0 añade el campo 'prioridad' a la tabla clientes. Los clientes existentes necesitan un valor por defecto.

```php
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin\Migration;

use FacturaScripts\Core\Template\MigrationClass;

/**
 * Rellena el nuevo campo 'prioridad' con valor por defecto para clientes existentes.
 *
 * Versión: 1.2.0
 * Fecha: 2025-02-05
 *
 * Contexto de ejecución:
 * - Usuario actualiza de v1.1.0 a v1.2.0
 * - DbUpdater ya creó el campo 'prioridad' (NULL en registros existentes)
 * - Esta migración rellena el campo para clientes existentes
 * - Nuevos clientes tendrán el valor asignado normalmente desde la aplicación
 */
class RellenarPrioridadClientes extends MigrationClass
{
    const MIGRATION_NAME = 'rellenar_prioridad_clientes_v1.2.0';

    public function run(): void
    {
        if (!$this->db()->tableExists('clientes')) {
            return;
        }

        // Establecer prioridad 'normal' para clientes existentes sin prioridad
        $sql = "UPDATE clientes SET prioridad = 'normal' WHERE prioridad IS NULL OR prioridad = ''";
        $this->db()->exec($sql);
    }
}
```

### Ejemplo 2: Normalizar datos existentes

```php
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin\Migration;

use FacturaScripts\Core\Template\MigrationClass;

/**
 * Normaliza códigos postales eliminando espacios y convirtiendo a mayúsculas.
 */
class NormalizarCodigosPostales extends MigrationClass
{
    const MIGRATION_NAME = 'normalizar_codigos_postales_v2.0.0';

    public function run(): void
    {
        if (!$this->db()->tableExists('direcciones')) {
            return;
        }

        // Normalizar formato de códigos postales
        $sql = "UPDATE direcciones SET codpostal = UPPER(TRIM(codpostal)) WHERE codpostal IS NOT NULL";
        $this->db()->exec($sql);
    }
}
```

## Buenas prácticas

### 1. Nomenclatura clara y descriptiva

```php
// ✓ BIEN: Descriptivo con versión y acción sobre datos
const MIGRATION_NAME = 'rellenar_campo_prioridad_v1.5.0';
const MIGRATION_NAME = 'migrar_estados_pedidos_v2.0.0';
const MIGRATION_NAME = 'limpiar_referencias_huerfanas_2025_02_05';

// ✗ MAL: Poco descriptivo
const MIGRATION_NAME = 'fix1';
const MIGRATION_NAME = 'update';
const MIGRATION_NAME = 'migration';
```

### 2. Verificaciones de seguridad

```php
public function run(): void
{
    // Siempre verificar que las tablas existen
    if (!$this->db()->tableExists('mi_tabla')) {
        return;
    }

    // Verificar columnas si es necesario
    $columns = $this->db()->getColumns('mi_tabla');

    // Tu lógica aquí
}
```

### 3. Idempotencia y prevención de errores

Aunque las migraciones se ejecutan una sola vez, escribe código defensivo:

```php
// ✓ BIEN: Verifica antes de actualizar
public function run(): void
{
    if (!$this->db()->tableExists('clientes')) {
        return;
    }

    // Solo actualizar registros que necesitan cambio
    $sql = "UPDATE clientes SET tipo = 'particular'
            WHERE tipo IS NULL OR tipo = ''";
    $this->db()->exec($sql);
}

// ✗ MAL: Sin verificaciones
public function run(): void
{
    // Podría fallar si la tabla no existe
    $sql = "UPDATE clientes SET tipo = 'particular'";
    $this->db()->exec($sql);
}
```

### 4. Compatibilidad con múltiples motores de base de datos

```php
// Usar sintaxis SQL estándar compatible con MySQL y PostgreSQL
$sql = "UPDATE clientes SET activo = 1 WHERE activo IS NULL";

// Para operaciones específicas de un motor, detectar primero
if ($this->db()->getEngine() === 'mysql') {
    $sql = "UPDATE tabla SET fecha = DATE_ADD(fecha, INTERVAL 1 DAY)";
} else {
    $sql = "UPDATE tabla SET fecha = fecha + INTERVAL '1 day'";
}

// Usar métodos de la clase DataBase cuando sea posible
$valor = $this->db()->var2str('valor');  // Escapa correctamente para el motor
```

### 5. Documentación

```php
/**
 * Migración para corregir facturas duplicadas detectadas en versión 1.4.x
 *
 * Problema: Algunas facturas se duplicaron durante la importación masiva.
 * Solución: Identificar duplicados por codigo+fecha y mantener solo el más antiguo.
 *
 * Versión: 1.5.0
 * Fecha: 2025-02-05
 */
class FixFacturasDuplicadas extends MigrationClass
{
    const MIGRATION_NAME = 'fix_facturas_duplicadas_v1.5.0';

    // ...
}
```

### 6. No eliminar migraciones antiguas

Una vez que una migración se ha publicado, **nunca la elimines**. Los usuarios que actualicen desde versiones antiguas necesitan que todas las migraciones intermedias se ejecuten en orden:

```php
// ✓ BIEN: Mantener todas las migraciones en orden cronológico
Migrations::runPluginMigrations([
    new Migration\FixV1_0_0(),  // Usuario en v0.9 necesita esta
    new Migration\FixV1_1_0(),  // Usuario en v1.0 necesita esta
    new Migration\FixV1_2_0(),  // La más reciente
]);

// ✗ MAL: Eliminar migraciones antiguas
// Un usuario que actualice de v1.0 a v1.2 no ejecutará FixV1_1_0
// y sus datos quedarán inconsistentes
```

### 7. Considera el momento de ejecución

Las migraciones se ejecutan tras instalar/actualizar, ten en cuenta:

```php
// ✓ BIEN: Asumir que los registros ya existen
public function run(): void
{
    // Esta migración solo afecta a datos existentes
    $sql = "UPDATE clientes SET prioridad = 'alta' WHERE total_anual > 100000";
    $this->db()->exec($sql);
}

// ✗ EVITAR: Migraciones que dependen de acciones del usuario
public function run(): void
{
    // MAL: Si el usuario no ha creado clientes aún, esto no hace nada útil
    // y la migración ya no se volverá a ejecutar
    if ($this->db()->select("SELECT COUNT(*) as total FROM clientes")[0]['total'] == 0) {
        return; // No hace nada si no hay clientes
    }
}
```

### Forzar re-ejecución de una migración (solo desarrollo)

Si necesitas probar una migración múltiples veces durante el desarrollo:

1. Elimina la entrada de `MyFiles/migrations.json`
2. Desinstala y vuelve a instalar el plugin
3. O cambia el nombre de `MIGRATION_NAME` temporalmente
