---
id: 3006
permalink: la-clase-cronjobclass
title: La clase CronJobClass
creationdate: 12-06-2026 17:42:27
lastmod: 12-06-2026
url: https://facturascripts.com/publicaciones/la-clase-cronjobclass
---
Cuando un plugin tiene tareas periódicas con mucho código, meterlo todo dentro del archivo `Cron.php` lo vuelve difícil de leer y mantener. Para esos casos, FacturaScripts ofrece la plantilla `CronJobClass`: una clase donde colocar el código de cada trabajo por separado, dejando en `Cron.php` únicamente la programación de cuándo debe ejecutarse cada uno.

&gt; **Importante**: esta página explica cómo organizar el código de los trabajos. Para programar las frecuencias de ejecución consulta [Uso del Archivo Cron.php](https://facturascripts.com/publicaciones/el-archivo-cron-php-855), y para lanzar y configurar el cron en tu servidor, [Cómo ejecutar el cron de FacturaScripts](https://facturascripts.com/publicaciones/el-cron-104).

## 🤔 Diferencia entre Cron y CronJob
El `Cron.php` de tu plugin es el encargado de decidir **cuándo** se ejecuta cada trabajo (cada hora, cada día a las 8h, etc.). Un CronJob es la tarea específica: contiene **qué** se ejecuta. El Cron llama a los CronJobs según la programación que hayas definido.

No confundas estas dos clases de nombre parecido:

- `FacturaScripts\Core\Template\CronJobClass`: la plantilla que se explica en esta página, para organizar el código de tus trabajos.
- `FacturaScripts\Core\Model\CronJob`: el modelo que devuelve la función `job()` en `Cron.php`, con el que se programan las frecuencias (`every()`, `everyDayAt()`...) y que guarda en la base de datos cuándo se ejecutó cada trabajo por última vez.

## 📋 Ejemplo de CronJob
Crea la clase en la carpeta `CronJob` de tu plugin, extendiendo de `CronJobClass`. Debe definir la constante `JOB_NAME` (el nombre del trabajo) y el método estático `run()` con el código a ejecutar:

```php
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin\CronJob;

use FacturaScripts\Core\Template\CronJobClass;

class MiCronJob extends CronJobClass
{
    const JOB_NAME = &#39;mi-cron-job&#39;;

    public static function run(): void
    {
        // tu código aquí
    }
}
```

## 🔗 Conexión con Cron.php
La clase no se ejecuta sola: hay que registrarla en el `Cron.php` del plugin, que es quien decide la frecuencia. Por ejemplo, para ejecutar `MiCronJob` cada día a las 8h:

```php
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Template\CronClass;
use FacturaScripts\Plugins\MiPlugin\CronJob\MiCronJob;

class Cron extends CronClass
{
    public function run(): void
    {
        $this-&gt;job(MiCronJob::JOB_NAME)
            -&gt;everyDayAt(8)
            -&gt;run(function () {
                MiCronJob::run();
            });
    }
}
```

Así `Cron.php` queda como un índice de trabajos y sus frecuencias, y el código de cada trabajo vive en su propia clase.

## 🧰 Utilidades de CronJobClass
Además de organizar el código, `CronJobClass` ofrece algunas utilidades para usar dentro de `run()`:

### echo() y text()
La función `echo()` imprime texto en la salida del cron y además lo va acumulando internamente. Si solo quieres acumular el texto sin imprimirlo, usa `text()`.

```php
public static function run(): void
{
    self::echo(&#39;Procesando facturas...&#39;);
}
```

### saveEcho()
Guarda todo el texto acumulado con `echo()` y `text()` como mensajes de log en el canal `JOB_NAME`, y vacía el acumulador. Útil para dejar constancia de lo que hizo el trabajo y poder consultarlo después en el listado de logs.

```php
public static function run(): void
{
    self::echo(&#39;Procesadas 42 facturas.&#39;);
    self::saveEcho();
}
```

### sendToAdmins()
Envía un email a todos los usuarios administradores, por ejemplo para avisar de que algo requiere su atención. Si el envío falla, el texto se imprime en la salida del cron.

```php
public static function run(): void
{
    self::sendToAdmins(&#39;Aviso del cron&#39;, &#39;Hay 5 facturas pendientes de revisar.&#39;);
}
```