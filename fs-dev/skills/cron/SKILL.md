---
name: cron
description: Explica cómo programar tareas periódicas en plugins de FacturaScripts con Cron.php (CronClass) y organizar su código con CronJobClass.
---

# Skill: Cron — Tareas periódicas en FacturaScripts

Cada plugin puede tener un archivo `Cron.php` que hereda de `CronClass` y decide **cuándo** se ejecuta cada trabajo. El código de cada trabajo puede vivir en clases separadas de la carpeta `CronJob/`, que heredan de `CronJobClass` y contienen **qué** se ejecuta. El cron de FacturaScripts procesa los `Cron.php` de todos los plugins activos.

Documentos de referencia: `../../references/docs/el-archivo-cron-php-855.md` y `../../references/docs/la-clase-cronjobclass.md`.

## Requisito previo

Nada de esto se ejecuta si el cron de FacturaScripts no está configurado en el servidor o hosting (por ejemplo, cada minuto). Cada ejecución del cron también procesa un lote de la cola de trabajos (skill `fs-dev:workers`).

## Atajo con fsmaker

```bash
# Crear el archivo Cron.php base del plugin
fsmaker cron

# Crear un nuevo CronJob y registrarlo en Cron.php
fsmaker cronjob
```

---

## Estructura básica de Cron.php

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Template\CronClass;

class Cron extends CronClass
{
    public function run(): void
    {
        $this->job('mi-trabajo')
            ->every('1 hour')
            ->run(function () {
                // código a ejecutar cada hora
            });
    }
}
```

El código que pongas directamente en `run()` se ejecuta en **cada** ejecución del cron. Para controlar la frecuencia, define trabajos con nombre mediante `job()`.

## Organizar el código con CronJobClass

Cuando un trabajo tiene mucho código, colócalo en `CronJob/` y deja en `Cron.php` solo la programación:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\CronJob;

use FacturaScripts\Core\Template\CronJobClass;

class MiCronJob extends CronJobClass
{
    const JOB_NAME = 'mi-cron-job';

    public static function run(): void
    {
        self::echo('Procesando facturas...');
        // tu código aquí
        self::saveEcho(); // guarda lo acumulado como log en el canal JOB_NAME
    }
}
```

```php
// Cron.php
use FacturaScripts\Plugins\MiPlugin\CronJob\MiCronJob;

$this->job(MiCronJob::JOB_NAME)
    ->everyDayAt(8)
    ->run(function () {
        MiCronJob::run();
    });
```

Utilidades de `CronJobClass` (todas estáticas): `echo()` imprime y acumula texto, `text()` solo lo acumula, `saveEcho()` lo guarda en el log y vacía el acumulador, y `sendToAdmins($asunto, $cuerpo)` envía un email a los administradores.

No la confundas con `FacturaScripts\Core\Model\CronJob`, el modelo que devuelve `job()` y que guarda en la base de datos cuándo se ejecutó cada trabajo.

---

## Frecuencias de ejecución

| Método | Ejemplo | Cuándo |
|---|---|---|
| `every($periodo)` | `every('6 hours')`, `every('10 days')` | Cada intervalo |
| `everyDayAt($hora, $strict = false)` | `everyDayAt(8)` | Cada día a las 8h |
| `everyMondayAt()` … `everySundayAt()` | `everyMondayAt(8)` | Un día de la semana |
| `everyDay($dia, $hora, $strict = false)` | `everyDay(15, 7)` | El día 15 de cada mes a las 7h |
| `everyLastDayOfMonthAt($hora, $strict = false)` | `everyLastDayOfMonthAt(8)` | El último día del mes |
| `everyYearAt($mes, $dia, $hora, $strict = false)` | `everyYearAt(3, 15, 8)` | Cada 15 de marzo a las 8h |

### Modo normal y modo estricto

- **Modo normal** (por defecto): si el cron no se ejecutó a la hora programada (por ejemplo, porque el servidor estaba apagado), el trabajo se ejecuta en cuanto el cron vuelva a ejecutarse. Si se perdió la ejecución de ayer y el cron corre hoy antes de la hora, también se ejecuta, recuperándola (al estilo de anacron).
- **Modo estricto** (`true` como último parámetro de cualquier `every...At()`): el trabajo solo se ejecuta dentro de la hora programada (con `everyDayAt(8, true)`, entre las 8:00 y las 8:59). Si el cron no se ejecuta en esa franja, la ejecución de ese día se pierde.

```php
$this->job('mi-trabajo')
    ->everyDayAt(8, true)
    ->run(function () {
        // solo entre las 8:00 y las 8:59
    });
```

### Consultar la frecuencia programada (desde 2026.7)

Cada trabajo guarda cómo se programó, con el método y sus parámetros (`every(6 hours)`, `everyDayAt(8)`, `everyMondayAt(9, strict)`…). Se registra en la siguiente ejecución y se muestra en Administrador → Logs, pestaña **Crons**, y en la ficha de cada trabajo, junto con la última ejecución, la duración y el número de fallos. Si el plugin depende de esta información, usa `min_version = 2026.7` o superior.

---

## Evitar solapamiento

El cron puede ejecutarse en paralelo y cada hilo procesa un trabajo distinto. Para que un trabajo no se ejecute mientras otros están en curso:

```php
// no se ejecuta mientras haya cualquier otro trabajo en curso
$this->job('mi-trabajo')
    ->everyDayAt(8)
    ->withoutOverlapping()
    ->run(function () {
        // código exclusivo
    });

// no se ejecuta mientras trabajo3 o trabajo4 estén en curso
$this->job('trabajo2')
    ->everyDayAt(8)
    ->withoutOverlapping('trabajo3', 'trabajo4')
    ->run(function () {
        // código
    });
```

---

## Limitaciones importantes

- Si hay una tarea que se ejecuta cada minuto y otra menos frecuente con `withoutOverlapping()`, puede que la segunda no llegue a ejecutarse nunca, porque siempre coincidirá con la primera en curso.
- En modo estricto, si el cron nunca se ejecuta dentro de la hora programada (por ejemplo, una tarea a las 23h con un cron que solo corre a las 12h), el trabajo no se ejecutará nunca. En modo normal no ocurre, porque las ejecuciones perdidas se recuperan.

---

## Para más información

Consulta la skill `fs-dev:docs-expert` y los documentos `el-archivo-cron-php-855.md` y `la-clase-cronjobclass.md` de `../../references/docs/`.
