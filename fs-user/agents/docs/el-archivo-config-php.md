---
id: 1720
permalink: el-archivo-config-php
title: El archivo config.php
creationdate: 08-03-2024 20:51:25
lastmod: 13-03-2025
url: https://facturascripts.com/publicaciones/el-archivo-config-php
---
El archivo **config.php** de FacturaScripts es el que almacena la configuración para conectar a la base de datos, el idioma predeterminado, etc. Este archivo lo genera el instalador y se encuentra en la carpeta donde esté instalado FacturaScripts.

Este archivo php define todas las constantes de configuración (las que no se pueden cambiar). Y tiene este aspecto:

```
&lt;?php
define(&#39;FS_COOKIES_EXPIRE&#39;, 31536000);
define(&#39;FS_ROUTE&#39;, &#39;&#39;);
define(&#39;FS_DB_FOREIGN_KEYS&#39;, true);
define(&#39;FS_DB_TYPE_CHECK&#39;, true);
define(&#39;FS_LANG&#39;, &#39;es_ES&#39;);
define(&#39;FS_TIMEZONE&#39;, &#39;Europe/Madrid&#39;);
define(&#39;FS_DB_TYPE&#39;, &#39;mysql&#39;);
define(&#39;FS_DB_HOST&#39;, &#39;localhost&#39;);
define(&#39;FS_DB_PORT&#39;, &#39;3306&#39;);
define(&#39;FS_DB_NAME&#39;, &#39;facturascripts&#39;);
define(&#39;FS_DB_USER&#39;, &#39;root&#39;);
define(&#39;FS_DB_PASS&#39;, &#39;&#39;);
define(&#39;FS_DEBUG&#39;, false);
```

## Lista de constantes
Esta es la lista de constantes que pueden estar en el archivo:

- **FS_COOKIES_EXPIRE**: define el número de segundos que dura la cookie. Por defecto 1 año.
- **FS_DB_TYPE**: tipo de base de datos (``mysql`` o ``postgresql``).
- **FS_DB_HOST**: ruta al servidor de bases de datos (normalmente ``localhost``).
- **FS_DB_PORT**: puerto de la base de datos (``3306`` para mysql y ``5432`` para postgresql).
- **FS_DB_NAME**: nombre de la base de datos.
- **FS_DB_USER**: usuario de la base de datos.
- **FS_DB_PASS**: contraseña del usuario de la base de datos.
- **FS_DB_FOREIGN_KEYS**: indica si está activado el uso de claves ajenas. Por defecto ``true`` (si).
- **FS_DB_TYPE_CHECK**: indica si hay que comprobar los tipos de las columnas de las tablas. Por defecto ``true`` (si).
- **FS_MYSQL_CHARSET**: codificación de la base de datos (``utf8`` para bases de datos antiguas, ``utf8mb4`` para las nuevas).
- **FS_MYSQL_COLLATE**: codificación de la base de datos (``utf8_bin`` para bases de datos antiguas, ``utf8mb4_unicode_520_ci`` para las nuevas).
- **FS_ROUTE**: la ruta web de acceso. Si está en la carpeta raíz del servidor web, entonces esta constante no tiene valor. Pero si está instalado en una carpeta, por ejemplo facturas, ese será el valor de esta constante &#39;facturas&#39;.
- **FS_LANG**: idoma predeterminado. Por defecto ``es_ES``.
- **FS_TIMEZONE**: zona horaria. Por defecto ``Europe/Madrid``.
- **FS_HIDDEN_PLUGINS**: lista de plugins ocultos. Por defecto &#39;&#39;.
- **FS_DEBUG**: ``true`` para activar el modo debug. Por defecto es ``false``.
- **FS_DISABLE_ADD_PLUGINS**: ``true`` para desactivar la posibilidad de añadir plugins. Por defecto es ``false``.
- **FS_DISABLE_DEPLOY_ACTIONS**: ``true`` para deshabilitar las opciones de reconstruir y desactivar plugins de las pantallas de error. Por defecto ``false``.
- **FS_DISABLE_RM_PLUGINS**: ``true`` para desactivar la posibilidad de eliminar plugins. Por defecto es ``false``.
- **FS_API_KEY**: clave de API predeterminada y con permisos globales.
- **FS_INITIAL_USER**: nombre de usuario inicial (para la instalación).
- **FS_INITIAL_PASS**: contraseña del usuario inicial (para la instalación).
- **FS_INITIAL_EMAIL**: email del usuario inicial (para la instalación).
- **FS_INITIAL_EMPRESA**: nombre de la empresa inicial (para la instalación).
- **FS_INITIAL_CODPAIS**: país predeterminado (para la instalación).
- **FS_STORAGE_LIMIT**: límite de almacenamiento en la biblioteca.