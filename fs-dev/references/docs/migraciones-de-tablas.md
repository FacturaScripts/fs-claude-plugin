---
id: 2514
permalink: migraciones-de-tablas
title: Migraciones de tablas
creationdate: 05-02-2026 18:08:22
lastmod: 19-09-2026
url: https://facturascripts.com/publicaciones/migraciones-de-tablas
---
El sistema de migraciones de FacturaScripts permite a los plugins ejecutar cambios en los datos de la base de datos de forma controlada y segura. Las migraciones se ejecutan **automáticamente tras instalar o actualizar un plugin** y solo se ejecutan una única vez, quedando registradas en `MyFiles/migrations.json` para evitar su re-ejecución.

Si una migración falla (lanza una excepción), el error se registra en el log, la migración **no se marca como ejecutada** y se reintentará en la siguiente actualización.

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
   - `runPluginMigration(MigrationClass $migration): bool`: Ejecuta una migración individual. Devuelve `true` si se ha aplicado (o ya lo estaba) y `false` si ha fallado
   - `runPluginMigrations(array $migrations): bool`: Ejecuta varias migraciones **en el orden recibido** y se detiene en la primera que falla
   - `run(): bool`: Ejecuta las migraciones del núcleo, también deteniéndose en la primera que falla

2. **`Core/Template/MigrationClass.php`**: Clase base abstracta para crear migraciones
   - `run(): void`: método abstracto donde escribes la migración
   - `exec(string $sql): void`: ejecuta SQL y lanza `RuntimeException` si falla
   - `db(): DataBase`: conexión a la base de datos (compartida entre migraciones)
   - `getFullMigrationName(): string`: identificador con el que se registra la migración

3. **`MyFiles/migrations.json`**: Archivo que registra las migraciones ejecutadas, por su nombre completo

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
Migration-&gt;run() (ejecuta las operaciones SQL)
    ↓                        ↘ lanza excepción
Marcar como ejecutada        Se registra el error en el log,
en migrations.json           NO se marca como ejecutada
    ↓                        y se detienen las siguientes
Devuelve true                Devuelve false
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
    const MIGRATION_NAME = &#39;rellenar_estado_pedidos_v1.2.0&#39;;

    /**
     * Ejecuta la lógica de la migración
     */
    public function run(): void
    {
        // Verificar que la tabla existe
        if (!$this-&gt;db()-&gt;tableExists(&#39;pedidoscli&#39;)) {
            return;
        }

        // Rellenar el nuevo campo &#39;estado&#39; con valor por defecto
        // para pedidos que no lo tengan
        // exec() lanza una excepción si el SQL falla, así la migración no
        // se marca como ejecutada y se reintenta en la próxima actualización
        $this-&gt;exec(&quot;UPDATE pedidoscli SET estado = &#39;pendiente&#39; WHERE estado IS NULL OR estado = &#39;&#39;&quot;);
    }
}
```

### Paso 2: Registrar la migración en Init.php

En el método `update()` de tu plugin:

```php
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Migrations;
use FacturaScripts\Core\Template\InitClass;
use FacturaScripts\Core\Tools;

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

### Paso 3 (opcional): Comprobar el resultado

Tanto `runPluginMigration()` como `runPluginMigrations()` devuelven `bool`, así que puedes reaccionar si algo ha fallado:

```php
public function update(): void
{
    if (false === Migrations::runPluginMigrations([
        new Migration\RellenarEstadoPedidos(),
        new Migration\MigrarTiposCliente(),
    ])) {
        // alguna migración ha fallado: el error ya está en el log
        // y las pendientes se reintentarán en la próxima actualización
        Tools::log()-&gt;warning(&#39;Hay migraciones pendientes de MiPlugin.&#39;);
    }
}
```

## Identificador de la migración

Una migración se registra en `migrations.json` con su **nombre completo**, que devuelve `getFullMigrationName()`:

```
NombreDelPlugin::MIGRATION_NAME
```

El nombre del plugin se deduce del namespace de la clase (`FacturaScripts\Plugins\MiPlugin\Migration\...`), por lo que dos plugins pueden usar el mismo `MIGRATION_NAME` sin colisionar. Aun así, conviene que el nombre sea descriptivo e incluya la versión.

## Control de errores

El núcleo captura cualquier excepción lanzada desde `run()`. Cuando una migración falla:

- Se registra el error en el log con el nombre de la migración, la clase de la excepción, el archivo y la línea (`MIGRATION ERROR: MiPlugin::mi_migracion - mensaje`)
- **No** se marca como ejecutada, así que se reintentará en la próxima actualización del plugin
- `runPluginMigration()` devuelve `false`
- Si la lanzaste con `runPluginMigrations()`, **las migraciones siguientes no se ejecutan**: el orden de la lista se entiende como dependencia, y todas ellas quedan pendientes junto con la fallida

Como las migraciones pueden reintentarse (y porque al borrar `migrations.json` se ejecutarían todas de nuevo), escríbelas siempre de forma idempotente.

### El helper `exec()`

`DataBase::exec()` devuelve `false` cuando el SQL falla y deja el error solo en el log de base de datos, donde pasa desapercibido: la migración se marcaría como ejecutada aunque no haya hecho nada. Por eso `MigrationClass` incorpora `exec()`, que lanza una `RuntimeException` si la sentencia falla:

```php
public function run(): void
{
    if (!$this-&gt;db()-&gt;tableExists(&#39;clientes&#39;)) {
        return;
    }

    // ✓ BIEN: si el SQL falla, lanza excepción y la migración se reintenta
    $this-&gt;exec(&quot;UPDATE clientes SET tipo = &#39;particular&#39; WHERE tipo IS NULL&quot;);

    // ✗ MAL: el fallo se ignora y la migración queda marcada como ejecutada
    $this-&gt;db()-&gt;exec(&quot;UPDATE clientes SET tipo = &#39;particular&#39; WHERE tipo IS NULL&quot;);
}
```

Para señalar cualquier otro problema, lanza una excepción desde `run()`. `run()` sigue devolviendo `void`, por lo que las migraciones de plugins ya publicadas no necesitan ningún cambio.

## Ejemplos prácticos

### Ejemplo 1: Rellenar un nuevo campo con valor por defecto

**Contexto**: Versión 1.2.0 añade el campo &#39;prioridad&#39; a la tabla clientes. Los clientes existentes necesitan un valor por defecto.

```php
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin\Migration;

use FacturaScripts\Core\Template\MigrationClass;

/**
 * Rellena el nuevo campo &#39;prioridad&#39; con valor por defecto para clientes existentes.
 *
 * Versión: 1.2.0
 * Fecha: 2025-02-05
 *
 * Contexto de ejecución:
 * - Usuario actualiza de v1.1.0 a v1.2.0
 * - DbUpdater ya creó el campo &#39;prioridad&#39; (NULL en registros existentes)
 * - Esta migración rellena el campo para clientes existentes
 * - Nuevos clientes tendrán el valor asignado normalmente desde la aplicación
 */
class RellenarPrioridadClientes extends MigrationClass
{
    const MIGRATION_NAME = &#39;rellenar_prioridad_clientes_v1.2.0&#39;;

    public function run(): void
    {
        if (!$this-&gt;db()-&gt;tableExists(&#39;clientes&#39;)) {
            return;
        }

        // Establecer prioridad &#39;normal&#39; para clientes existentes sin prioridad
        $this-&gt;exec(&quot;UPDATE clientes SET prioridad = &#39;normal&#39; WHERE prioridad IS NULL OR prioridad = &#39;&#39;&quot;);
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
    const MIGRATION_NAME = &#39;normalizar_codigos_postales_v2.0.0&#39;;

    public function run(): void
    {
        if (!$this-&gt;db()-&gt;tableExists(&#39;direcciones&#39;)) {
            return;
        }

        // Normalizar formato de códigos postales
        $this-&gt;exec(&quot;UPDATE direcciones SET codpostal = UPPER(TRIM(codpostal)) WHERE codpostal IS NOT NULL&quot;);
    }
}
```

## Buenas prácticas

### 1. Nomenclatura clara y descriptiva

```php
// ✓ BIEN: Descriptivo con versión y acción sobre datos
const MIGRATION_NAME = &#39;rellenar_campo_prioridad_v1.5.0&#39;;
const MIGRATION_NAME = &#39;migrar_estados_pedidos_v2.0.0&#39;;
const MIGRATION_NAME = &#39;limpiar_referencias_huerfanas_2025_02_05&#39;;

// ✗ MAL: Poco descriptivo
const MIGRATION_NAME = &#39;fix1&#39;;
const MIGRATION_NAME = &#39;update&#39;;
const MIGRATION_NAME = &#39;migration&#39;;
```

### 2. Verificaciones de seguridad

```php
public function run(): void
{
    // Siempre verificar que las tablas existen
    if (!$this-&gt;db()-&gt;tableExists(&#39;mi_tabla&#39;)) {
        return;
    }

    // Verificar columnas si es necesario
    $columns = $this-&gt;db()-&gt;getColumns(&#39;mi_tabla&#39;);

    // Tu lógica aquí
}
```

### 3. Idempotencia y prevención de errores

Aunque las migraciones se ejecutan una sola vez, escribe código defensivo:

```php
// ✓ BIEN: Verifica antes de actualizar
public function run(): void
{
    if (!$this-&gt;db()-&gt;tableExists(&#39;clientes&#39;)) {
        return;
    }

    // Solo actualizar registros que necesitan cambio
    $this-&gt;exec(&quot;UPDATE clientes SET tipo = &#39;particular&#39;
            WHERE tipo IS NULL OR tipo = &#39;&#39;&quot;);
}

// ✗ MAL: Sin verificaciones
public function run(): void
{
    // Podría fallar si la tabla no existe
    $this-&gt;exec(&quot;UPDATE clientes SET tipo = &#39;particular&#39;&quot;);
}
```

### 4. Informa de los fallos

Usa `$this-&gt;exec()` en lugar de `$this-&gt;db()-&gt;exec()` y lanza una excepción cuando detectes un problema. Si te tragas el error, la migración quedará marcada como ejecutada y no volverá a intentarse:

```php
// ✓ BIEN: el fallo hace que la migración se reintente
public function run(): void
{
    $this-&gt;exec(&quot;UPDATE clientes SET tipo = &#39;particular&#39; WHERE tipo IS NULL&quot;);
}

// ✗ MAL: si el SQL falla, nadie se entera
public function run(): void
{
    try {
        $this-&gt;db()-&gt;exec(&quot;UPDATE clientes SET tipo = &#39;particular&#39; WHERE tipo IS NULL&quot;);
    } catch (Exception $e) {
        // silencio
    }
}
```

### 5. Compatibilidad con múltiples motores de base de datos

```php
// Usar sintaxis SQL estándar compatible con MySQL y PostgreSQL
$sql = &quot;UPDATE clientes SET activo = 1 WHERE activo IS NULL&quot;;

// Para operaciones específicas de un motor, detectar primero
if ($this-&gt;db()-&gt;getEngine() === &#39;mysql&#39;) {
    $sql = &quot;UPDATE tabla SET fecha = DATE_ADD(fecha, INTERVAL 1 DAY)&quot;;
} else {
    $sql = &quot;UPDATE tabla SET fecha = fecha + INTERVAL &#39;1 day&#39;&quot;;
}

// Usar métodos de la clase DataBase cuando sea posible
$valor = $this-&gt;db()-&gt;var2str(&#39;valor&#39;);  // Escapa correctamente para el motor
```

### 6. Documentación

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
    const MIGRATION_NAME = &#39;fix_facturas_duplicadas_v1.5.0&#39;;

    // ...
}
```

### 7. No eliminar migraciones antiguas

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

### 8. Considera el momento de ejecución

Las migraciones se ejecutan tras instalar/actualizar, ten en cuenta:

```php
// ✓ BIEN: Asumir que los registros ya existen
public function run(): void
{
    // Esta migración solo afecta a datos existentes
    $this-&gt;exec(&quot;UPDATE clientes SET prioridad = &#39;alta&#39; WHERE total_anual &gt; 100000&quot;);
}

// ✗ EVITAR: Migraciones que dependen de acciones del usuario
public function run(): void
{
    // MAL: Si el usuario no ha creado clientes aún, esto no hace nada útil
    // y la migración ya no se volverá a ejecutar
    if ($this-&gt;db()-&gt;select(&quot;SELECT COUNT(*) as total FROM clientes&quot;)[0][&#39;total&#39;] == 0) {
        return; // No hace nada si no hay clientes
    }
}
```

## Forzar re-ejecución de una migración (solo desarrollo)

Si necesitas probar una migración múltiples veces durante el desarrollo:

1. Elimina la entrada de `MyFiles/migrations.json`
2. Desinstala y vuelve a instalar el plugin
3. O cambia el nombre de `MIGRATION_NAME` temporalmente