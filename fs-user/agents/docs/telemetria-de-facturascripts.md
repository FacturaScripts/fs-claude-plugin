---
id: 1395
permalink: telemetria-de-facturascripts
title: Telemetría de FacturaScripts
creationdate: 11-02-2023 18:49:12
lastmod: 25-08-2026
url: https://facturascripts.com/publicaciones/telemetria-de-facturascripts
---
FacturaScripts **no envía** ningún tipo de información a nuestros servidores, **salvo en estos casos**:
- Cuando abres el **actualizador**: se solicita a la web la lista de plugins y sus últimas versiones, para saber si hay algo que actualizar.
- Cuando abres la **lista de plugins**: se solicita a la web la lista de plugins, para mostrarlos en la pestaña de más plugins.
- Cuando abres el **tablero**: se solicita a la web la lista de **últimas noticias**, para mostrarlas en el tablero.
- Cuando **pulsas el botón de enviar informes de errores** en el actualizador: se envían los archivos de error (crash) que se hayan guardado en MyFiles. Estos informes nunca se envían solos, siempre tienes que pulsar el botón.

## ®️ Instalaciones registradas
Si has **registrado tu instalación** (desde el actualizador, botón registrar) FacturaScripts enviará **una vez a la semana** a nuestros servidores los siguientes datos:
- El identificador de la instalación registrada.
- La versión de FacturaScripts.
- La versión de PHP.
- El motor de base de datos (MySQL/MariaDB o PostgreSQL).
- El sistema operativo del servidor.
- El idioma predeterminado.
- El país predeterminado.
- La lista de plugins activos.

No se envían datos de tus clientes, proveedores, artículos, facturas ni de ningún otro documento. Tampoco se envían contraseñas ni datos de acceso.

Puedes ver más detalles en el código fuente de la clase [Telemetry.php](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Telemetry.php), que es la que se encarga de esta tarea.

### 🤷‍♂️ ¿Para qué necesitamos esta información?
Conocer aproximadamente cuantas instalaciones hay de cada **versión de PHP** nos ayuda a determinar cuándo podemos aumentar los requisitos y cuando no. Gracias a esta información sabemos qué versión de PHP es la dominante en cada momento, y así elegimos el mínimo necesario sin dejar a nadie atrás:

![versiones php telemetria](https://i.imgur.com/UuRlfkl.png)

Conocer aproximadamente cuantas instalaciones hay de cada versión de FacturaScripts nos ayuda a comprender los **ciclos de actualización** de la gente, para saber si debemos lanzar muchas actualizaciones con pocos cambios o pocas actualizaciones con muchos cambios. Y conocer cuantas instalaciones hay con cada **idioma** o **país** nos ayuda a determinar cuanto esfuerzo dedicar a cada uno.

### 🚫 ¿Cómo puedo desactivar la telemetría?
La telemetría está **desactivada por defecto**. Solamente se activa si registras la instalación, como ya hemos comentado, desde el botón **registrar** del actualizador.

![registrar instalacion](https://i.imgur.com/8Iea4s8.png)

Si ya tenías la instalación registrada y quieres **desvincularla**, simplemente ve al actualizador, pulsa el botón administrar y después **desvincular**:

![eliminar instalacion registrada](https://i.imgur.com/OgyNcDG.png)

Ten en cuenta que al desvincular la instalación **no podrás descargar ni actualizar los plugins de pago** desde el actualizador, ya que la descarga se firma con los datos de la instalación registrada.