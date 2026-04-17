---
name: cron
description: Explica cómo funcionan las tareas periódicas (cron jobs) en FacturaScripts mediante el archivo Cron.php y la clase CronClass.
---

# Skill: Cron — Tareas Periódicas en FacturaScripts

El sistema de cron de FacturaScripts permite ejecutar tareas periódicas en los plugins. Cada plugin puede tener su propio archivo `Cron.php` que hereda de `CronClass`. El cron del sistema gestionará automáticamente todos los procesos cron de los plugins activos.

## Requisito previo

El cron del sistema debe estar configurado correctamente en el servidor o hosting para que se ejecute periódicamente (por ejemplo, cada minuto).

## Atajo con fsmaker

Para generar automáticamente el archivo `Cron.php` y añadir un nuevo CronJob:

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
        // tu código aquí
    }
}
```

Todo el código dentro de `run()` se ejecutará cada vez que se active el cron. Para controlar la frecuencia de ejecución de trabajos individuales, se usa el método `job()`.

---

## Frecuencias de ejecución

### Cada X horas o días

```php
public function run(): void
{
    // ejecutar cada hora
    $this->job('mi-trabajo')
        ->every('1 hour')
        ->run(function () {
            // código a ejecutar cada hora
        });

    // ejecutar cada 6 horas
    $this->job('otro-trabajo')
        ->every('6 hours')
        ->run(function () {
            // código a ejecutar cada 6 horas
        });

    // ejecutar cada 10 días
    $this->job('trabajo-dias')
        ->every('10 days')
        ->run(function () {
            // código a ejecutar cada 10 días
        });
}
```

### Cada día a una hora concreta

```php
$this->job('mi-trabajo')
    ->everyDayAt(8)
    ->run(function () {
        // se ejecutará cada día a las 8h
    });
```

Si necesitas una comprobación más estricta (solo ejecutar exactamente a esa hora, sin recuperar ejecuciones perdidas):

```php
$this->job('mi-trabajo')
    ->everyDayAt(8, true)
    ->run(function () {
        // solo se ejecutará a las 8h exactas
    });
```

### Un día concreto de la semana

```php
$this->job('mi-trabajo')
    ->everyMondayAt(8)
    ->run(function () {
        // cada lunes a las 8h
    });
```

Métodos disponibles por día de la semana:
- `everyMondayAt()` — lunes
- `everyTuesdayAt()` — martes
- `everyWednesdayAt()` — miércoles
- `everyThursdayAt()` — jueves
- `everyFridayAt()` — viernes
- `everySaturdayAt()` — sábado
- `everySundayAt()` — domingo

### Un día concreto de cada mes

```php
$this->job('mi-trabajo')
    ->everyDay(15, 7)
    ->run(function () {
        // cada día 15 a las 7h
    });
```

### El último día del mes

```php
$this->job('mi-trabajo')
    ->everyLastDayOfMonthAt(8)
    ->run(function () {
        // el último día de cada mes, a las 8h
    });
```

---

## Evitar solapamiento

Si un trabajo no debe ejecutarse mientras otros estén en progreso, usa `withoutOverlapping()`:

```php
// no se ejecuta si hay otro trabajo en progreso
$this->job('mi-trabajo')
    ->everyDayAt(8)
    ->withoutOverlapping()
    ->run(function () {
        // código exclusivo
    });
```

Para evitar solapamiento solo con trabajos concretos:

```php
// no se ejecuta si trabajo3 o trabajo4 están en progreso
$this->job('trabajo2')
    ->everyDayAt(8)
    ->withoutOverlapping('trabajo3', 'trabajo4')
    ->run(function () {
        // código
    });
```

---

## Limitaciones importantes

- Si hay una tarea que se ejecuta cada minuto con `withoutOverlapping()`, puede impedir que otras tareas menos frecuentes lleguen a ejecutarse.
- Si una tarea está programada para las 23h y el cron se ejecuta a las 23:59, puede que nunca llegue a ejecutarse ese día.
- El cron puede ejecutarse en paralelo: cada hilo procesará un trabajo distinto.

---

## Para más información

Para consultar la documentación oficial completa sobre tareas periódicas con cron en FacturaScripts, invoca el agente **docs-expert** que te proporcionará detalles completos directamente desde la documentación oficial del framework.