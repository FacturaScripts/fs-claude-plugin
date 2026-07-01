---
id: 671
permalink: el-archivo-cron-php-855
title: Uso del Archivo Cron.php en FacturaScripts
creationdate: 25-06-2018 00:00:00
lastmod: 12-06-2026
url: https://facturascripts.com/publicaciones/el-archivo-cron-php-855
---
Para que tu plugin **ejecute tareas periódicas**, puedes utilizar el archivo `Cron.php` de tu plugin. El cron de FacturaScripts gestionará todos los procesos cron de los **plugins activos**, siempre y cuando **haya sido configurado** correctamente en el sistema o hosting. Si necesitas ejecutar algo de forma periódica, el mejor lugar para hacerlo es el cron de tu plugin.

&gt; **Importante**: esta página explica cómo programar tareas desde tu plugin, pero nada de esto se ejecutará si el cron de FacturaScripts no está en marcha. Para saber **cómo lanzar y configurar el cron** en tu servidor u hosting, consulta la publicación [Cómo ejecutar el cron de FacturaScripts](https://facturascripts.com/publicaciones/el-cron-104).

## 📋 Ejemplo de Cron.php
A continuación, se muestra un ejemplo de un cron para el plugin `MiPlugin`:

```php
&lt;?php
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

Todo lo que se coloque en la función `run()` se ejecutará cada vez que se active el cron. Por ejemplo, si configuras el cron para que se ejecute cada minuto, la función `run()` se ejecutará cada minuto. Para controlar cuándo debe ejecutarse un trabajo, puedes asignarle un nombre y definir la frecuencia con la que se debe ejecutar.

Si un trabajo tiene mucho código, en lugar de meterlo todo en `Cron.php` puedes organizarlo en clases separadas con la plantilla [CronJobClass](https://facturascripts.com/publicaciones/la-clase-cronjobclass), dejando en `Cron.php` solo la programación de las frecuencias.

### ⏰ Ejecutar un Trabajo Cada Hora
En este ejemplo, crearemos un trabajo llamado `mi-trabajo`. Al llamar a la función `job()`, indicaremos que se realice cada hora con la función `every()` y finalmente pondremos el código a ejecutar en la función `run()`.

```php
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Template\CronClass;

class Cron extends CronClass
{
    public function run(): void
    {
        $this-&gt;job(&#39;mi-trabajo&#39;)
            -&gt;every(&#39;1 hour&#39;)
            -&gt;run(function () {
                // tu código aquí
                // esto se ejecutará cada hora
            });
    }
}
```

Si queremos que el trabajo se ejecute cada 6 horas, simplemente indicaríamos `&#39;6 hours&#39;` como parámetro en la función `every()`. Si deseamos que se ejecute cada 10 días, pondríamos `&#39;10 days&#39;`.

### 📅 Ejecutar Cada Día a una Hora Concreta
Para ejecutar un trabajo cada día a una hora específica, podemos utilizar la función `everyDayAt()`: 

```php
$this-&gt;job(&#39;mi-trabajo&#39;)
    -&gt;everyDayAt(8)
    -&gt;run(function () {
        // tu código aquí
        // esto se ejecutará cada día a las 8h
    });
```

Si el cron no se ha podido ejecutar a las 8, por ejemplo porque el servidor estaba apagado, el trabajo se ejecutará en cuanto el cron vuelva a ejecutarse, aunque ya haya pasado la hora programada. Es más, si la ejecución de ayer se perdió y el cron se ejecuta hoy antes de las 8, el trabajo también se ejecuta, recuperando así la ejecución perdida (al estilo de anacron). Para hacer una **comprobación más estricta**, podemos establecer el segundo parámetro de la función en `true`.

```php
$this-&gt;job(&#39;mi-trabajo&#39;)
    -&gt;everyDayAt(8, true)
    -&gt;run(function () {
        // tu código aquí
        // esto se ejecutará solo entre las 8:00 y las 8:59
    });
```

En modo estricto el trabajo solo se ejecuta dentro de la hora programada (entre las 8:00 y las 8:59). Si el cron no llega a ejecutarse en esa franja, la ejecución de ese día se pierde y no se recupera. Este parámetro estricto está disponible en todas las funciones `every...At()`.

### 📅 Ejecutar Cada Lunes, Martes, etc.
Para ejecutar un trabajo un día específico de la semana, como el lunes, se puede usar la función correspondiente:

```php
$this-&gt;job(&#39;mi-trabajo&#39;)
    -&gt;everyMondayAt(8)
    -&gt;run(function () {
        // tu código aquí
        // esto se ejecutará cada lunes a las 8h
    });
```

- `everyMondayAt()`: Ejecutar cada lunes.
- `everyTuesdayAt()`: Ejecutar cada martes.
- `everyWednesdayAt()`: Ejecutar cada miércoles.
- `everyThursdayAt()`: Ejecutar cada jueves.
- `everyFridayAt()`: Ejecutar cada viernes.
- `everySaturdayAt()`: Ejecutar cada sábado.
- `everySundayAt()`: Ejecutar cada domingo.

### 📅 Ejecutar un Día Concreto de Cada Mes
Para ejecutar un día específico de cada mes, podemos usar la función `everyDay()`: 

```php
$this-&gt;job(&#39;mi-trabajo&#39;)
    -&gt;everyDay(15, 7)
    -&gt;run(function () {
        // tu código aquí
        // esto se ejecutará cada día 15 a las 7h
    });
```

### 📅 Ejecutar el Último Día del Mes
Para ejecutar un trabajo el último día de cada mes, se puede usar la función `everyLastDayOfMonthAt()`: 

```php
$this-&gt;job(&#39;mi-trabajo&#39;)
    -&gt;everyLastDayOfMonthAt(8)
    -&gt;run(function () {
        // tu código aquí
        // esto se ejecutará el último día de cada mes, a las 8h
    });
```

### 📅 Ejecutar un Día Concreto del Año
Para ejecutar un trabajo una vez al año, en un mes y día concretos, se puede usar la función `everyYearAt()`, indicando mes, día y hora:

```php
$this-&gt;job(&#39;mi-trabajo&#39;)
    -&gt;everyYearAt(3, 15, 8)
    -&gt;run(function () {
        // tu código aquí
        // esto se ejecutará cada 15 de marzo a las 8h
    });
```

### 🔒 Evitar Solapamiento
Puedes ejecutar el cron de FacturaScripts tantas veces como desees. Si se ejecuta en paralelo, cada hilo procesará un trabajo distinto. Sin embargo, si necesitas que un trabajo se ejecute de forma exclusiva, puedes utilizar el método `withoutOverlapping()` para impedir que este trabajo se ejecute mientras otros estén en progreso.

```php
$this-&gt;job(&#39;mi-trabajo&#39;)
    -&gt;everyDayAt(8)
    -&gt;withoutOverlapping()
    -&gt;run(function () {
        // tu código aquí
        // esto se ejecutará cada día a las 8h y no podrá ejecutarse al mismo tiempo que otro trabajo
    });
```

Si deseas evitar que un trabajo se ejecute al mismo tiempo que un trabajo específico, por ejemplo, si `trabajo2` no debe ejecutarse simultáneamente con `trabajo3`, pero puede superponerse con `trabajo1`, simplemente pasa el nombre del trabajo como parámetro al método `withoutOverlapping()`. 

```php
$this-&gt;job(&#39;trabajo2&#39;)
    -&gt;everyDayAt(8)
    -&gt;withoutOverlapping(&#39;trabajo3&#39;)
    -&gt;run(function () {
        // tu código aquí
        // esto se ejecutará cada día a las 8h y no podrá ejecutarse junto a trabajo3
    });
```

Para evitar que se ejecute simultáneamente con `trabajo3` o `trabajo4`, simplemente indícalo como parámetros: 

```php
$this-&gt;job(&#39;trabajo2&#39;)
    -&gt;everyDayAt(8)
    -&gt;withoutOverlapping(&#39;trabajo3&#39;, &#39;trabajo4&#39;)
    -&gt;run(function () {
        // tu código aquí
        // esto se ejecutará cada día a las 8h y no podrá ejecutarse junto a trabajo3 o trabajo4
    });
```

### ⚠️ Limitaciones
- Si hay una tarea que se ejecuta cada minuto y otra que se ejecuta menos frecuentemente y sin solapamiento, puede ocurrir que la segunda nunca llegue a ejecutarse, ya que siempre coincidirá cuando la primera esté en ejecución.
- En modo estricto, si el cron no llega a ejecutarse dentro de la hora programada (por ejemplo, una tarea programada a las 23h y un cron que solo se ejecuta a las 12h), el trabajo no se ejecutará nunca. En modo normal esto no ocurre, ya que las ejecuciones perdidas se recuperan en la siguiente ejecución del cron.