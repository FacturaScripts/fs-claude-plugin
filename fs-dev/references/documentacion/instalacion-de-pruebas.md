# Instalación de pruebas para las capturas

Las capturas de la documentación se hacen en una instalación del programa donde se pueda pulsar y cambiar datos sin
miedo y en la que nada llegue a un organismo, a un cliente o a producción. Este documento explica cómo elegirla, cómo
crear una desechable y cómo dejarla «limpia».

## Qué instalación usar

Antes de capturar, pregunta al usuario cuál de estas tres opciones prefiere (si trabajas como subagente, termina y
devuelve la pregunta):

1. **Una instalación de pruebas que ya tenga**: pide su URL y el usuario. La contraseña no se escribe en ningún
   archivo: se pasa por `FS_DOC_USER` y `FS_DOC_PASSWORD`, o se toma de las instrucciones locales del proyecto
   (`CLAUDE.local.md`, `AGENTS.override.md`) si ya están ahí.
2. **Crear una desechable** copiando una instalación existente (ver abajo). Es la mejor opción cuando hay que pulsar
   botones que cambian datos o enviar algo a un entorno de pruebas.
3. **Usar solo los datos que ya existen, sin cambiar nada**: se captura lo que hay, sin pulsar ninguna acción que
   guarde, envíe o borre. Si no hay un registro en el estado que hay que enseñar, se dice en el informe en lugar de
   crearlo.

En las tres, comprueba antes que el plugin está activado y si la instalación tiene datos reales: si los tiene, avisa
al usuario y extrema la revisión de las imágenes.

## Crear una instalación desechable

Es una copia de una instalación que ya funciona, con su propia carpeta, su propia base de datos y su propia web local.
Pide permiso al usuario antes de crearla y dile qué vas a copiar y dónde.

1. **Copia la carpeta del programa** entera (con `Plugins/`, `MyFiles/` y `Dinamic/`) a una carpeta nueva, por ejemplo
   `rsync -a <instalación>/ <copia>/`.
2. **Copia la base de datos** en una nueva vacía, con el mismo motor:
   - MySQL o MariaDB: `mysqldump --single-transaction --routines <bd> | mysql <bd_copia>`.
   - PostgreSQL: `pg_dump <bd> | psql <bd_copia>`.

   Pasa la contraseña de la base de datos por la configuración del cliente (`~/.my.cnf`, `~/.pgpass`) o por una
   variable de entorno, nunca en un archivo del repositorio ni en un mensaje.
3. **Edita `config.php` de la copia**: `FS_DB_NAME` (y el usuario si cambia) apuntando a la base nueva, `FS_ROUTE` si
   la web va en otra ruta y `FS_DEBUG` a `false`. **Conserva `FS_APP_KEY`** y `FS_TIMEZONE` tal cual: con otra clave
   no se pueden descifrar las contraseñas guardadas (certificados, correo, claves de API).
4. **Crea una web local** que apunte a la carpeta de la copia con el servidor que use la persona (Apache, Nginx,
   Docker, Laragon, Valet, ServBay...), con la misma versión de PHP y un dominio local (`*.localhost` o `*.test`, cuyos
   certificados acepta el script de capturas). Si el host tiene el MCP de ServBay, puedes crearla con él, siguiendo
   su flujo de confirmación.
5. Abre la web, inicia sesión y comprueba que carga y que el plugin está activado.

Al terminar la documentación, pregunta al usuario si se borra la copia (web, carpeta y base de datos) o se conserva
para regenerar las capturas.

## Dejarla limpia

Una instalación limpia hace que las capturas muestren solo lo que explica la página y que ninguna prueba salga de la
máquina:

- **Una sola empresa**: si hay varias, en la copia borra las que sobran o, si no se puede, deja como predeterminada la
  que se va a enseñar y no captures selectores de empresa.
- **Solo los plugins que se documentan** (y los que exigen como dependencia) activados, para que no aparezcan menús,
  pestañas ni botones de otros.
- **Entorno de pruebas en todos los sistemas que comunican con un organismo** (Verifactu, TicketBAI, SII, FACe...) y
  con cualquier servicio externo (pasarelas de pago, tiendas, mensajería): revisa la configuración del plugin y la de
  cada empresa.
- **El correo hacia un servidor local de pruebas** (Mailpit, MailHog o similar) en la configuración de email, para que
  ningún envío llegue a un cliente.
- **`FS_DEBUG` desactivado** en `config.php`, para que no salga la barra de depuración.

## Lo que no se hace nunca

- **No ejecutes el cron** (`cron.php`, la tarea programada o el botón que lo lanza) ni workers que procesen colas: son
  los que envían en segundo plano.
- **No pulses acciones que envíen a producción**: envíos a organismos en entorno real, correos a clientes reales,
  cobros, sincronizaciones con servicios externos.
- **Antes de pulsar nada**, comprueba que no hay nada pendiente de enviar a producción (registros en cola o en estado
  «pendiente» con el entorno real configurado, envíos programados). Si lo hay, para y pregunta al usuario: cualquier
  acción o el cron podría enviarlo.
