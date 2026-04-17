---
id: 1395
permalink: telemetria-de-facturascripts
title: Telemetría de FacturaScripts
creationdate: 11-02-2023 18:49:12
lastmod: 19-03-2026
url: https://facturascripts.com/telemetria-de-facturascripts
---
FacturaScripts **no envía** ningún tipo de información a nuestros servidores, **salvo en estos casos**:
- Cuando abre el **actualizador**: se solicita a la web la lista de plugins y sus últimas versiones, para saber si hay algo que actualizar.
- Cuando abre la **lista de plugins**: se solicita a la web la lista de plugins, para mostrarlos en la pestaña de más plugins.
- Cuando abre el **tablero**: se solicita a la web la lista de **últimas noticias**, para mostrarlas en el tablero.

## ®️ Instalaciones registradas
Si ha **registrado su instalación** (desde el actualizador, botón registrar) FacturaScripts enviará periódicamente a nuestros servidores los siguientes datos:
- La versión de FacturaScripts.
- La versión de PHP.
- La versión de MySQL o Mariadb.
- El idioma predeterminado.
- El país predeterminado.
- La lista de plugins activos.

Puede ver más detalles en el código fuente de la clase [TelemetryManager.php](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Base/TelemetryManager.php), que es la que se encarga de esta tarea.

### 🤷‍♂️ ¿Para qué necesitamos esta información?
Conocer aproximadamente cuantas instalaciones hay de cada **versión de PHP** nos ayuda a determinar cuándo podemos aumentar los requisitos y cuando no. Nos encantaría saltar directamente a PHP 8.4, pero gracias a esta información sabemos que la versión 8.1 es la dominante hoy en día:

![versiones php telemetria](https://i.imgur.com/UuRlfkl.png)

Conocer aproximadamente cuantas instalaciones hay de cada versión de FacturaScripts nos ayuda a comprender los **ciclos de actualización** de la gente, para saber si debemos lanzar muchas actualizaciones con pocos cambios o pocas actualizaciones con muchos cambios. Y conocer el cuantas instalaciones hay con cada **idioma** o **país** nos ayuda a determinar cuanto esfuerzo dedicar a cada uno.

### 🚫 ¿Cómo puedo desactivar la telemetría?
La telemetría está **desactivada por defecto**. Solamente se activa si registras la instalación, como ya hemos comentado, desde el botón **registrar** del actualizador.

![registrar instalacion](https://i.imgur.com/8Iea4s8.png)

Si ya tenías la instalación registrada y quieres **desvincularla**, simplemente ve al actualizador, pulsa el botón administrar y después **desvincular**:

![eliminar instalacion registrada](https://i.imgur.com/OgyNcDG.png)
