---
id: 4508
permalink: los-logs-y-el-registro-de-actividad
title: Los logs y el registro de actividad
creationdate: 03-09-2026 17:01:22
lastmod: 14-10-2026
url: https://facturascripts.com/publicaciones/los-logs-y-el-registro-de-actividad
---
FacturaScripts guarda un registro de lo que ocurre en el programa: errores, avisos, inicios de sesión, cambios en los datos y ejecuciones de tareas automáticas. Puedes consultarlo en el **menú Administrador** → **Logs**.

Es la primera pantalla que hay que mirar cuando algo no funciona, cuando quieres saber quién hizo un cambio o cuando sospechas de un acceso no autorizado.

La página tiene tres pestañas: **Historial**, **Crons** y **Eventos de trabajo**.

## 📜 Historial

El listado de mensajes registrados. De cada uno se guarda la fecha y hora, el canal, el nivel, el usuario, la IP, la dirección de la página y el mensaje.

### Canales

El **canal** indica de qué parte del programa viene el mensaje. Los que trae el core son:

- **master**: el canal general, el que se usa cuando no se indica otro. De este canal **solo se guardan los errores y los fallos críticos**; los avisos y las notificaciones normales se muestran en pantalla pero no se registran.
- **audit**: el registro de auditoría, con los cambios importantes en los datos (documentos, asientos…), los cambios de IBAN en las cuentas bancarias de la empresa y de los proveedores, y los accesos al programa.
- **core**, **api** y **cron**: mensajes del núcleo, de las peticiones a la API y de las tareas programadas.

Los plugins pueden crear sus propios canales, así que en tu instalación pueden aparecer más.

![Historial](https://i.imgur.com/VyJTb69.png)

### Niveles

El **nivel** indica la gravedad del mensaje: *info*, *notice*, *warning*, *error* y *critical*. Los mensajes de nivel *debug* no se guardan nunca.

### Filtros

El listado tiene filtros por **canal**, **nivel**, **usuario**, **IP**, **dirección web**, **modelo** y **periodo**, además del buscador, que busca en el mensaje, el contexto y la dirección. Combinándolos puedes responder a preguntas concretas, por ejemplo qué hizo un usuario determinado la semana pasada, o desde qué IPs se ha intentado entrar.

### 🗑️ Borrar logs

Con el tiempo los logs ocupan espacio. Tienes dos formas de limpiarlos:

- **Automáticamente**: en el [panel de control](https://facturascripts.com/publicaciones/el-panel-de-control), sección *Avanzado*, el campo **Nº días retención logs** indica cuántos días se conservan. El [cron](https://facturascripts.com/publicaciones/el-cron-104) se encarga de borrar los más antiguos, así que necesitas tener el cron configurado para que esta limpieza funcione.
- **Manualmente**: con el botón **Eliminar** de la pestaña *Historial*, indicando un rango de fechas y, opcionalmente, un canal.

⚠️ El canal **audit** no se puede borrar ni modificar. Es el registro de auditoría, y el programa lo protege a propósito: ni eligiéndolo en el borrado manual ni al borrar todos los canales a la vez. Si un usuario tiene la restricción de ver solamente sus propios registros, el borrado manual solo afectará a sus propios logs.

![Modal eliminar](https://i.imgur.com/U1sn48X.png)

## ⚙️ Crons

Muestra las tareas programadas que existen en tu instalación, de qué plugin son, cuándo se ejecutaron por última vez, cuánto tardaron y cuántas veces se ejecutan al día.

Puedes seleccionar tareas y usar los botones **Activar** y **Desactivar** para decidir cuáles se ejecutan. Es útil para apagar una tarea concreta que esté dando problemas o consumiendo demasiado, sin tener que desactivar el plugin entero.

Si en esta pestaña no ves fechas recientes, es señal de que el cron no se está ejecutando. Revisa [cómo ejecutar el cron de FacturaScripts](https://facturascripts.com/publicaciones/el-cron-104).

![Pestaña crons](https://i.imgur.com/wsJN5f6.png)

## 📅 Eventos de trabajo

Algunas tareas no se hacen en el momento, sino que se dejan apuntadas para que el cron las procese después: recalcular stock, actualizar precios de coste, enviar emails, etc. Esta pestaña muestra esa cola de trabajos pendientes.

De cada evento se ve el nombre, cuándo se creó, cuándo se completó y cuánto tardó, y puedes filtrar por **estado** (pendientes o hechos), por **nombre** y por **periodo**.

Si ves muchos eventos **pendientes** acumulados, es otra señal de que el cron no está funcionando: las tareas se están apuntando pero nadie las ejecuta.

![Pestaña eventos de trabajo](https://i.imgur.com/3o7xKu2.png)

## Ver también

- [Cómo ejecutar el cron de FacturaScripts](https://facturascripts.com/publicaciones/el-cron-104)
- [El Panel de control](https://facturascripts.com/publicaciones/el-panel-de-control)
- [Bloqueo de IP](https://facturascripts.com/publicaciones/bloqueo-de-ip-410)