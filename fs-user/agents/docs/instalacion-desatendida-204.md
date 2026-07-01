---
id: 607
permalink: instalacion-desatendida-204
title: Instalación desatendida
creationdate: 27-04-2018 00:00:00
lastmod: 30-06-2026
url: https://facturascripts.com/publicaciones/instalacion-desatendida-204
---
La instalación desatendida permite poner en marcha FacturaScripts sin usar el asistente web, ideal para automatizar despliegues (scripts, CI/CD o contenedores Docker). El punto de partida siempre es el mismo: descomprimir el zip de FacturaScripts en el directorio del servidor web. A partir de ahí tienes tres opciones.

## Opción 1: crear el archivo config.php
Si ya conoces los datos de conexión, basta con crear el archivo `config.php` en la raíz de la instalación. En el primer arranque FacturaScripts creará las tablas y dejará el sistema listo. Un ejemplo mínimo para MySQL:

```php
&lt;?php
define(&#39;FS_DB_TYPE&#39;, &#39;mysql&#39;);
define(&#39;FS_DB_HOST&#39;, &#39;localhost&#39;);
define(&#39;FS_DB_PORT&#39;, 3306);
define(&#39;FS_DB_NAME&#39;, &#39;facturascripts&#39;);
define(&#39;FS_DB_USER&#39;, &#39;root&#39;);
define(&#39;FS_DB_PASS&#39;, &#39;tu_contraseña&#39;);
define(&#39;FS_LANG&#39;, &#39;es_ES&#39;);
define(&#39;FS_INITIAL_USER&#39;, &#39;admin&#39;);
define(&#39;FS_INITIAL_PASS&#39;, &#39;tu_contraseña_admin&#39;);
```

Las claves `FS_INITIAL_USER` y `FS_INITIAL_PASS` son opcionales: si las defines, se creará automáticamente ese usuario administrador en el primer arranque.

## Opción 2: llamar al instalador por POST
Lanza una petición HTTP **POST** al instalador (por ejemplo con CURL) enviando los datos del formulario de instalación. Si añades el campo `unattended`, el instalador responde con el texto &#39;OK&#39; cuando termina sin problemas (en lugar de mostrar la pantalla de redirección):

```bash
curl -X POST https://tu-dominio.com/ \
  -d fs_db_type=mysql \
  -d fs_db_host=localhost \
  -d fs_db_port=3306 \
  -d fs_db_name=facturascripts \
  -d fs_db_user=root \
  -d fs_db_pass=tu_contraseña \
  -d fs_initial_user=admin \
  -d fs_initial_pass=tu_contraseña_admin \
  -d fs_lang=es_ES \
  -d unattended=1
```

Campos admitidos en el POST:

- `fs_db_type`: tipo de base de datos (`mysql` o `postgresql`).
- `fs_db_host`: servidor de la base de datos.
- `fs_db_port`: puerto de la base de datos.
- `fs_db_name`: nombre de la base de datos.
- `fs_db_user`: usuario de la base de datos.
- `fs_db_pass`: contraseña de la base de datos.
- `fs_initial_user`: nick del usuario administrador que se creará.
- `fs_initial_pass`: contraseña de ese usuario administrador.
- `fs_lang`: idioma por defecto, por ejemplo `es_ES`.
- `fs_debug`: activa el modo depuración (`true` o `false`).
- `unattended`: marca la instalación como desatendida para que devuelva &#39;OK&#39;.

&gt; **Importante**: en PostgreSQL el nombre de la base de datos debe ir en minúsculas.

## 🐳 Opción 3: variables de entorno (Docker)
Cuando todavía no existe el archivo `config.php`, el instalador toma los valores por defecto de un conjunto de variables de entorno. Es la forma más cómoda en Docker: defines las variables en el contenedor y el instalador las usará como valores predeterminados.

```bash
docker run -d -p 8080:80 \
  -e FS_DB_TYPE=mysql \
  -e FS_DB_HOST=db \
  -e FS_DB_PORT=3306 \
  -e FS_DB_NAME=facturascripts \
  -e FS_DB_USER=root \
  -e FS_DB_PASS=tu_contraseña \
  -e FS_INITIAL_USER=admin \
  -e FS_INITIAL_PASS=tu_contraseña_admin \
  -e FS_LANG=es_ES \
  -e FS_DEBUG=false \
  tu-imagen-de-facturascripts
```

Variables disponibles: `FS_DB_TYPE`, `FS_DB_HOST`, `FS_DB_PORT`, `FS_DB_NAME`, `FS_DB_USER`, `FS_DB_PASS`, `FS_INITIAL_USER`, `FS_INITIAL_PASS`, `FS_LANG` y `FS_DEBUG`.

Ten en cuenta que estas variables solo aportan los valores por defecto; la instalación se completa igual que en la opción 2, lanzando una petición POST con el campo `unattended` (los datos enviados en el POST tienen prioridad sobre las variables de entorno). También puedes abrir la pantalla del instalador con los campos ya cubiertos y terminar el proceso manualmente.