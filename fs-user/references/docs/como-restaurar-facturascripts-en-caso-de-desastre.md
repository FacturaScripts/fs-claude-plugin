---
id: 1652
permalink: como-restaurar-facturascripts-en-caso-de-desastre
title: Cómo restaurar FacturaScripts en caso de desastre
creationdate: 20-01-2024 20:11:01
lastmod: 07-10-2026
url: https://facturascripts.com/publicaciones/como-restaurar-facturascripts-en-caso-de-desastre
---
Si **tras una actualización** de FacturaScripts tenemos un error que no podemos solucionar, podemos usar este método para restaurar o reinstalar los archivos del núcleo con la última versión estable compatible con la versión de PHP de tu servidor, pero primero debemos tener en cuenta varios casos:

## 🛑 Problema al conectar a la base de datos
Si aparece un mensaje referente a que no se puede conectar a la base de datos, no sigas con este tutorial, ya que restaurar los archivos no va a hacer que se resuelva. Probablemente tengas un problema con el servidor MySQL, en cuyo caso lo mejor es que lo mire un experto o revises el archivo config.php si has cambiado de servidor o de contraseña de la base de datos:

- [Consultar a un experto](https://facturascripts.com/expertos).
- [Guía del archivo config.php](https://facturascripts.com/publicaciones/el-archivo-config-php)

## 📁 Abre la carpeta de FacturaScripts
Si has instalado FacturaScripts en **Windows**, la carpeta suele estar en uno de estos sitios:

- c:\xampp\htdocs\facturas
- c:\xampp\htdocs\facturascripts
- En el escritorio, en una carpeta llamada ``xampp``. Dentro abrimos la carpeta ``htdocs`` y dentro la carpeta ``facturas``.

Si has instalado FacturaScripts en Windows con ServBay, la carpeta suele estar:

    c:\ServBay\www\facturascripts

Si has instalado FacturaScripts en tu hosting, ve al panel de control del hosting y en la sección de archivos, ahí la tendrás.

Una vez localizada la carpeta de FacturaScripts, comprueba si hay un archivo llamado ``replace_index_to_restore``. Si lo encuentras, elimina el archivo ``index`` y renombra ``replace_index_to_restore`` a ``index``. Ahora vuelve a entrar en FacturaScripts y sigue las instrucciones.

**Recomendado:** el archivo ``replace_index_to_restore`` de tu carpeta es el que venía con tu versión de FacturaScripts. Si esa versión es antigua, el archivo también lo es y puede no restaurar bien la instalación. Siempre que puedas, descarga la última versión como se explica a continuación y usa esa.

### 🔍 Descarga la última versión de replace_index_to_restore
Si no encuentras el archivo, o quieres usar la última versión (recomendado), descárgalo desde aquí. Haz **clic derecho** y selecciona **guardar enlace como...**
- https://github.com/NeoRazorX/facturascripts/raw/master/replace_index_to_restore.php

Una vez descargado el archivo:

- Ve a la carpeta de FacturaScripts.
- Copia este archivo. Si ya había un ``replace_index_to_restore``, sustitúyelo.
- Elimina el archivo ``index``
- Renombra ``replace_index_to_restore`` a ``index``
- Vuelve a abrir FacturaScripts y sigue las instrucciones.

## 🔧 Qué hace la restauración
- Descarga la última versión estable de FacturaScripts **compatible con la versión de PHP de tu servidor**. Si tu PHP es antiguo, instalará la última versión que funcione con él, que no tiene por qué ser la más reciente.
- Sustituye las carpetas ``Core``, ``node_modules`` y ``vendor`` y los archivos ``index`` y ``replace_index_to_restore``. Si algo falla durante la sustitución, deja los archivos como estaban.
- Borra la carpeta ``Dinamic``, las cachés (``MyFiles/Cache`` y ``MyFiles/Tmp/FileCache``) y el archivo ``MyFiles/routes.json``. Todo esto se vuelve a generar solo.
- **No toca** la base de datos, el archivo ``config.php``, la carpeta ``Plugins`` ni el resto de archivos de ``MyFiles``. Los plugins que tenías activados siguen activados.

Al terminar verás el mensaje **FacturaScripts restored successfully**. Pulsa en **Click here to continue** para que FacturaScripts reconstruya la carpeta ``Dinamic`` y después vuelve a entrar con normalidad.

### 🧩 Mensajes de error de la restauración
Los mensajes de la restauración aparecen en inglés. Estos son los más habituales:

- **FacturaScripts restoration requires the PHP ZIP extension** o **requires the PHP cURL extension**: falta la extensión ``zip`` o ``curl`` de PHP. Actívala en la configuración de PHP de tu hosting (o en el archivo ``php.ini`` si usas XAMPP) y recarga la página.
- **There is no stable version compatible with PHP ...**: tu versión de PHP es demasiado antigua. Sube la versión de PHP desde el panel de tu hosting y recarga la página.
- **Another restoration process is already running**: ya hay una restauración en marcha. Espera unos minutos y recarga la página.
- **CORE.zip has been removed. Reload this page to download it again**: la descarga estaba incompleta o dañada. Recarga la página para descargarla de nuevo.
- **Unable to ...** (back up, install, create...): el servidor no puede escribir en la carpeta de FacturaScripts. Revisa los permisos de la carpeta o el espacio libre en disco.
- **Cualquier otro error, o la restauración no termina**: descarga de nuevo la última versión de ``replace_index_to_restore`` desde el enlace de GitHub de arriba, sustituye con ella el archivo ``index`` y vuelve a entrar.

### ⏳ ¿Sigue saliendo el mismo error después de renombrar?
Si después de renombrar ``replace_index_to_restore`` a ``index`` sigue apareciendo exactamente el mismo error, lo más probable es que el servidor tenga activado **OPcache** y siga ejecutando el ``index`` antiguo que tiene en memoria. OPcache solo detecta que un archivo ha cambiado si cambia su fecha de modificación, y al renombrar se conserva la fecha original. Esperar no sirve de nada. Haz una de estas cosas:

- Abre el nuevo archivo ``index`` con un editor, guárdalo sin cambiar nada y vuelve a entrar. Así se actualiza su fecha de modificación. Si tienes acceso por SSH, basta con ejecutar ``touch index.php`` en la carpeta de FacturaScripts.
- Reinicia PHP. En **XAMPP**, detén y vuelve a iniciar **Apache** desde el panel de control. En un **hosting**, busca en el panel la opción de reiniciar PHP o de vaciar la caché de OPcache.

### 🧩 ¿El error menciona un plugin?
La restauración no toca los plugins. Si después de restaurar el error menciona un plugin (por ejemplo, una ruta que empieza por ``Plugins/``), pulsa el botón **Desactivar plugins** de la pantalla de error. Después entra en **Administrador &gt; Plugins**, actualiza ese plugin y vuelve a activar los demás.

### ⁉️ ¿No soluciona el problema?
Entonces habla con soporte o con un experto:

- https://facturascripts.com/contacto
- https://facturascripts.com/expertos