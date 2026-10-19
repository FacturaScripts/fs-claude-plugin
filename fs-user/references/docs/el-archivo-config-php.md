---
id: 1720
permalink: el-archivo-config-php
title: El archivo config.php
creationdate: 08-03-2024 20:51:25
lastmod: 03-10-2026
url: https://facturascripts.com/publicaciones/el-archivo-config-php
---
El archivo **config.php** de FacturaScripts es el que almacena la configuración para conectar a la base de datos, el idioma predeterminado, la clave secreta de la instalación, etc. Este archivo lo genera el instalador y se encuentra en la carpeta donde esté instalado FacturaScripts.

Este archivo php define todas las constantes de configuración (las que no se pueden cambiar desde el panel de control). Y tiene este aspecto:

```
&lt;?php
define(&#39;FS_COOKIES_EXPIRE&#39;, 31536000);
define(&#39;FS_ROUTE&#39;, &#39;&#39;);
define(&#39;FS_DB_TYPE&#39;, &#39;mysql&#39;);
define(&#39;FS_DB_HOST&#39;, &#39;localhost&#39;);
define(&#39;FS_DB_PORT&#39;, 3306);
define(&#39;FS_DB_NAME&#39;, &#39;facturascripts&#39;);
define(&#39;FS_DB_USER&#39;, &#39;root&#39;);
define(&#39;FS_DB_PASS&#39;, &#39;&#39;);
define(&#39;FS_DB_FOREIGN_KEYS&#39;, true);
define(&#39;FS_DB_TYPE_CHECK&#39;, true);
define(&#39;FS_APP_KEY&#39;, &#39;3f9a1c...&#39;);
define(&#39;FS_MYSQL_CHARSET&#39;, &#39;utf8mb4&#39;);
define(&#39;FS_MYSQL_COLLATE&#39;, &#39;utf8mb4_unicode_520_ci&#39;);
define(&#39;FS_LANG&#39;, &#39;es_ES&#39;);
define(&#39;FS_TIMEZONE&#39;, &#39;Europe/Madrid&#39;);
define(&#39;FS_HIDDEN_PLUGINS&#39;, &#39;&#39;);
define(&#39;FS_DISABLE_ADD_PLUGINS&#39;, false);
define(&#39;FS_DISABLE_RM_PLUGINS&#39;, false);
define(&#39;FS_DEBUG&#39;, false);
```

## Lista de constantes
Esta es la lista de constantes que pueden estar en el archivo:

### Base de datos
- **FS_DB_TYPE**: tipo de base de datos (``mysql`` o ``postgresql``).
- **FS_DB_HOST**: ruta al servidor de bases de datos (normalmente ``localhost``).
- **FS_DB_PORT**: puerto de la base de datos (``3306`` para mysql y ``5432`` para postgresql).
- **FS_DB_NAME**: nombre de la base de datos.
- **FS_DB_USER**: usuario de la base de datos.
- **FS_DB_PASS**: contraseña del usuario de la base de datos.
- **FS_DB_FOREIGN_KEYS**: indica si está activado el uso de claves ajenas. Por defecto ``true`` (sí).
- **FS_DB_TYPE_CHECK**: indica si hay que comprobar los tipos de las columnas de las tablas. Por defecto ``true`` (sí).
- **FS_MYSQL_CHARSET**: codificación de la base de datos (``utf8`` para bases de datos antiguas, ``utf8mb4`` para las nuevas).
- **FS_MYSQL_COLLATE**: cotejamiento de la base de datos (``utf8_bin`` para bases de datos antiguas, ``utf8mb4_unicode_520_ci`` para las nuevas).
- **FS_PGSQL_SSL**: modo SSL de la conexión con PostgreSQL (``disable``, ``allow``, ``prefer`` o ``require``). Vacío por defecto.
- **FS_PGSQL_ENDPOINT**: endpoint de PostgreSQL, necesario en algunos servicios en la nube como Neon. Vacío por defecto.

Si en el instalador se indica un socket de MySQL, se añade al final del archivo la línea ``ini_set(&#39;mysqli.default_socket&#39;, &#39;/ruta/al/socket&#39;);``.

### Instalación y seguridad
- **FS_APP_KEY**: clave secreta de la instalación, con la que se firman los tokens de los formularios, de los archivos de MyFiles y de las páginas de error. Ver la sección **La clave secreta** más abajo.
- **FS_TRUSTED_PROXIES**: IPs o rangos de los proxies de confianza adicionales. Ver la sección **Proxies de confianza** más abajo.
- **FS_COOKIES_EXPIRE**: define el número de segundos que dura la cookie. Por defecto 1 año.
- **FS_ROUTE**: la ruta web de acceso. Si está en la carpeta raíz del servidor web, entonces esta constante no tiene valor. Pero si está instalado en una carpeta, por ejemplo facturas, el valor de esta constante será ``&#39;/facturas&#39;``.
- **FS_API_KEY**: clave de API predeterminada y con permisos globales. Si está definida, la API queda activada aunque no se haya activado desde el panel de control.
- **FS_DEBUG**: ``true`` para activar el modo debug. Por defecto es ``false``.
- **FS_DISABLE_DEPLOY_ACTIONS**: ``true`` para deshabilitar las opciones de reconstruir y desactivar plugins de las pantallas de error. Por defecto ``false``.

### Idioma y región
- **FS_LANG**: idioma predeterminado. Por defecto ``es_ES``.
- **FS_TIMEZONE**: zona horaria. Por defecto ``Europe/Madrid``.

### Plugins y almacenamiento
- **FS_HIDDEN_PLUGINS**: lista de plugins ocultos, separados por comas. Por defecto ``&#39;&#39;``.
- **FS_DISABLE_ADD_PLUGINS**: ``true`` para desactivar la posibilidad de añadir plugins. Por defecto es ``false``.
- **FS_DISABLE_RM_PLUGINS**: ``true`` para desactivar la posibilidad de eliminar plugins. Por defecto es ``false``.
- **FS_STORAGE_LIMIT**: límite de almacenamiento de la biblioteca de archivos, en bytes. Por defecto ``0`` (sin límite).

### Datos iniciales (para la instalación)
- **FS_INITIAL_USER**: nombre de usuario inicial.
- **FS_INITIAL_PASS**: contraseña del usuario inicial.
- **FS_INITIAL_EMAIL**: email del usuario inicial.
- **FS_INITIAL_EMPRESA**: nombre de la empresa inicial.
- **FS_INITIAL_CODPAIS**: país predeterminado. Por defecto ``ESP``.

## La clave secreta (FS_APP_KEY)
Desde la versión 2026.7, cada instalación tiene su propia clave secreta, guardada en la constante **FS_APP_KEY**. Con ella se firman los tokens de los formularios, los enlaces a los archivos de MyFiles y los enlaces de las páginas de error para reconstruir o desactivar plugins. Así nadie puede generar tokens válidos aunque conozca el nombre de la base de datos o su usuario.

- **Instalaciones nuevas**: el instalador genera la clave automáticamente (64 caracteres hexadecimales aleatorios). Si existe la variable de entorno ``FS_APP_KEY``, usa su valor.
- **Instalaciones anteriores**: mientras no se añada la constante, FacturaScripts usa una clave derivada de la ruta de instalación y de los datos de conexión a la base de datos, y el **Actualizador** muestra un aviso con la línea exacta que hay que añadir al config.php, por ejemplo:

```
define(&#39;FS_APP_KEY&#39;, &#39;3f9a1c...&#39;);
```

Copia la línea que te muestra el actualizador y pégala en el config.php, antes de la línea de ``FS_DEBUG`` por ejemplo. Los enlaces a archivos que ya hayas compartido seguirán funcionando.

La clave debe tener al menos 32 caracteres. No la compartas ni la cambies sin motivo: al cambiarla dejan de ser válidos los formularios abiertos y los enlaces firmados con la clave anterior.

## Proxies de confianza (FS_TRUSTED_PROXIES)
FacturaScripts usa la IP del cliente para el bloqueo de IPs tras varios intentos fallidos de acceso al login o a la API, y para los registros de actividad. Desde la versión 2026.7 la IP se toma de ``REMOTE_ADDR`` y las cabeceras ``X-Forwarded-For`` y ``CF-Connecting-IP`` solo se tienen en cuenta cuando la petición llega de un proxy de confianza:

- Una IP de red privada o local (por ejemplo, un proxy inverso o un balanceador en la misma red).
- Una IP de Cloudflare. La cabecera ``CF-Connecting-IP`` solo se acepta de Cloudflare o de un proxy configurado.
- Una IP o rango indicado en la constante **FS_TRUSTED_PROXIES**.

Si FacturaScripts está detrás de un proxy con IP pública que no es de Cloudflare, indícalo en el config.php para que se registre la IP real del cliente. Admite IPs o rangos CIDR, separados por comas o en un array:

```
define(&#39;FS_TRUSTED_PROXIES&#39;, &#39;203.0.113.10, 198.51.100.0/24&#39;);
```