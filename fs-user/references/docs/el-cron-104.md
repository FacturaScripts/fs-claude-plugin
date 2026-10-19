---
id: 774
permalink: el-cron-104
title: Cómo ejecutar el cron de FacturaScripts
creationdate: 07-08-2018 00:00:00
lastmod: 10-10-2026
url: https://facturascripts.com/publicaciones/el-cron-104
---
FacturaScripts necesita un proceso **cron**: una tarea que se ejecuta automáticamente cada hora y se encarga del trabajo de mantenimiento. Antes solo lo usaban algunos plugins, pero hoy el propio núcleo del programa depende de él, así que **conviene configurarlo siempre**.

Sin cron, estas tareas no se hacen:

- Borrar los logs antiguos y los eventos de trabajo ya procesados, según los días de retención del [panel de control](https://facturascripts.com/publicaciones/el-panel-de-control).
- Actualizar el estado de los **recibos** y marcar las **facturas impagadas**.
- Recalcular los datos de familias y fabricantes, y revisar los archivos adjuntos.
- Volver a crear las notificaciones de email predeterminadas que se hayan borrado.
- Procesar la **cola de trabajos**: las tareas que el programa deja apuntadas para hacerlas después (recálculos de stock, precios de coste, envíos de email, etc.).
- Todo lo que necesiten los plugins que tengas instalados.

Cada una de esas tareas del núcleo se ejecuta una vez al día, a una hora distinta, así que el cron debe lanzarse **al menos cada hora** para que le toque el turno a todas.

Configurar el cron se hace de forma distinta según dónde tengas instalado FacturaScripts. Aquí lo explicamos para un hosting, Linux, Windows y Mac.

## 💻 Ejecutar el cron desde el navegador
Puede ejecutar el cron manualmente desde el navegador, simplemente añada **/cron** al final de la url donde acceda a FacturaScripts, por ejemplo: http://localhost/facturascripts/cron

### ⌨️ Ejecutar el cron desde el terminal
Añadiendo el parámetro **-cron** al llamar al **index.php** se ejecutará el cron.

```
cd donde-tengas-facturascripts
php index.php -cron
```

## 🧰 Configurar el cron en un hosting
La mayoría de hostings tienen una sección de **tareas programas** o cron en su **panel de control**. Desde ahí podrá crear una tarea programada para ejecutar el cron cada hora.
- Si el formulario solamente deja escribir una url, escriba la url donde tenga FacturaScripts con /cron al final. Ejemplo: http://mi-dominio.com/facturas/cron
- Si el formulario deja escribir comandos como este ``php index.php``, entonces escriba este comando ``php carpeta-donde-tengas-facturascripts/index.php -cron``

### 🐧 Configurar el cron en Linux
La opción más sencilla es crear un script en la carpeta **/etc/cron.hourly**, para que se ejecute cada hora:

```
cd /etc/cron.hourly
sudo touch facturascripts
sudo chmod +x facturascripts
sudo nano facturascripts
```

Esto crea el archivo y abre el editor de textos nano para poder editarlo. Escriba esto en el archivo:

```
#!/bin/sh
cd donde-tengas-facturascripts
php index.php -cron
```

Para guardar pulse **ctrl+o** y **ctrl+x**.

### 🪟 Configurar el cron en Windows
En Windows se usa el **Programador de tareas**. Ábrelo y crea una tarea básica:

1. Elige que se repita **diariamente** y, en las opciones avanzadas de la tarea, marca que se repita **cada 1 hora** durante 1 día.
2. Como acción, elige **Iniciar un programa**.
3. En *Programa o script* escribe la ruta a php.exe, por ejemplo `C:\xampp\php\php.exe`.
4. En *Agregar argumentos* escribe `index.php -cron`.
5. En *Iniciar en* escribe la carpeta donde tengas FacturaScripts, por ejemplo `C:\xampp\htdocs\facturascripts`.

El campo *Iniciar en* es importante: si no lo rellenas, PHP no encontrará los archivos de FacturaScripts.

### 🍎 Configurar el cron en Mac
En macOS se usa crontab, igual que en Linux. Abre el Terminal y ejecuta `crontab -e`, y añade esta línea para que se ejecute cada hora en punto:

```
0 * * * * cd /ruta/a/facturascripts && /usr/bin/php index.php -cron
```

Guarda y cierra el editor. Puedes comprobar que la línea se ha guardado con `crontab -l`.

Si macOS bloquea el acceso a la carpeta, tendrás que dar permiso de *Acceso total al disco* a `cron` en Ajustes del Sistema → Privacidad y seguridad.

## ✅ Comprobar que el cron funciona
Ve al **menú Administrador** → **Logs**, pestaña **Crons**. Ahí verás cada tarea con su plugin, su **frecuencia** (por ejemplo, `everyDayAt(3)` para cada día a las 3h o `every(1 hour)` para cada hora), la fecha de su última ejecución, cuánto tardó y cuántas veces se ejecuta al día. Si las fechas no son recientes, el cron no se está ejecutando.

Para localizar las tareas que dan problemas, marca el filtro **Fallido** o ordena el listado por **Fallos**. Haciendo clic en una tarea verás su ficha con todos los detalles.

En la pestaña **Eventos de trabajo** de la misma página puedes ver la cola de tareas pendientes. Si se acumulan muchas sin completarse, es otra señal de que el cron no funciona.

Desde la pestaña **Crons** también puedes **activar y desactivar** tareas concretas, por si alguna te da problemas o consume demasiado.

## Ver también

- [Los logs y el registro de actividad](https://facturascripts.com/publicaciones/los-logs-y-el-registro-de-actividad)
- [El Panel de control](https://facturascripts.com/publicaciones/el-panel-de-control)