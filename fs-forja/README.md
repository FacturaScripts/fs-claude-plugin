# fs-forja — Servidor MCP de la forja de FacturaScripts

Plugin para Claude Code y Codex que proporciona un servidor [MCP (Model Context Protocol)](https://modelcontextprotocol.io) conectado a la **API de autor de la forja de [facturascripts.com](https://facturascripts.com)** (`/api/3/forja`). Permite a los autores de plugins publicados, y a los miembros aceptados de sus equipos, gestionarlos desde el asistente: datos e imágenes, traducciones, versiones, publicaciones (noticias y documentación), informes de error e issues.

Es independiente de **fs-mcp**, que conecta con la API REST de una instalación del ERP para consultar y modificar sus datos. Cada plugin tiene su servidor y sus herramientas; solo comparten el archivo de configuración `~/.fs-ai.json`.

## Requisitos

- **Node.js ≥ 18**. El servidor es un proceso Node.js empaquetado en un único archivo (`server/dist/index.js`) que ya lleva dentro sus dependencias: no hace falta `npm install` ni `node_modules`.
- Acceso a la API de autor concedido por el personal de facturascripts.com y un token de autor (ver [Obtener el token](#obtener-el-token)).

El manifiesto usa el mismo lanzador portable que fs-mcp: toma `CLAUDE_PLUGIN_ROOT` en Claude Code y el directorio de trabajo del plugin en Codex.

Para desarrollarlo, `node_modules` no se versiona: ejecuta `npm ci` en `fs-forja/server` antes del primer `npm run build` o `npm test`. La compilación deja en `build/` los módulos sueltos de `tsc`, que usan los tests, y genera con esbuild el bundle `dist/index.js`, el único archivo de `dist/` que se sube al repositorio.

## Índice

- [Obtener el token](#obtener-el-token)
- [Configurar la conexión](#configurar-la-conexión)
- [Skills disponibles](#skills-disponibles)
- [Herramientas de conexión](#herramientas-de-conexión)
- [Herramientas](#herramientas)
- [Documentación de Doc](#documentación-de-doc)
- [Zip de una versión](#zip-de-una-versión)

---

## Obtener el token

El acceso a la API de autor lo concede el personal de facturascripts.com en la ficha del contacto. Con el acceso concedido, la pestaña **avanzado** de PortalForja (área de cliente) permite generar el token, que **solo se muestra al generarlo**: guárdalo entonces en la conexión. La forja solo guarda su hash, y al retirar el acceso se borra. Con el token se gestionan los plugins de los que el contacto es autor y los de los equipos en los que está aceptado, identificados por su `name`; la API no crea plugins, que se dan de alta desde la web.

## Configurar la conexión

Usa la skill `/fs-forja:add-connection` o la herramienta `forja_add_connection`. La conexión se guarda en `~/.fs-ai.json`, junto a las conexiones de fs-mcp, con `"type": "forja"`:

```json
"forja-autor": {
  "name": "Forja (autor)",
  "url": "https://facturascripts.com",
  "token": "token-de-autor",
  "type": "forja"
}
```

- fs-forja **solo usa las conexiones de tipo `forja`**: no lista, no usa ni sustituye las conexiones de fs-mcp (las que no tienen `type` o tienen `"type": "api"`), y **nunca cambia la conexión por defecto**, que es de fs-mcp. fs-mcp, a su vez, ignora las conexiones de tipo `forja`.
- Las herramientas `forja_*` usan por defecto la **primera conexión de tipo forja** configurada. Si tienes varias, indica cuál con el parámetro `connection`.
- Usa una clave que no tengas ya, por ejemplo `forja-autor`. Si existe una conexión de fs-mcp con esa clave (por ejemplo, una conexión `api` a facturascripts.com llamada `forja`), `forja_add_connection` falla y no la toca. Una conexión de tipo forja existente solo se sustituye con `overwrite: true`.
- La URL debe ser exactamente `https://facturascripts.com`, sin `www.` ni `http://`: el cliente no sigue redirecciones ni rutas absolutas, para que el token de autor no llegue a otra dirección, y si la forja redirige el error dice adónde para corregir la URL. Si pegas la de la API (`.../api/3/forja`), se quita esa ruta al guardar.
- Las herramientas solo suben archivos con la extensión de su uso (imágenes gif, jpeg, jpg, png o webp; zips que lo son de verdad; cuerpos `.md`, `.markdown` o `.txt`), comprobada tras resolver los enlaces simbólicos, y `forja_publish_doc_page` solo sube imágenes que están dentro de la carpeta `Doc` del plugin. Así una ruta manipulada no puede publicar en la web, por ejemplo, el archivo de conexiones.
- El servidor lee `~/.fs-ai.json` al arrancar. Si añades la conexión editando el archivo (y no con `forja_add_connection`), abre una sesión nueva en Claude Code o un hilo nuevo en Codex.

Para usar otro archivo, configura la opción `FS_CONNECTIONS_FILE` del plugin; normalmente se deja vacía.

## Skills disponibles

| Skill | Descripción |
|---|---|
| `fs-forja:add-connection` | Guía para añadir o sustituir la conexión de tipo forja con el token de autor |

El flujo completo para sincronizar un plugin local con su ficha (documentación, traducciones, datos, imágenes, noticias, versiones, errores e issues) está en la skill `fs-dev:sincronizar-forja` del plugin fs-dev, que usa las herramientas de fs-forja.

## Herramientas de conexión

| Herramienta | Qué hace |
|---|---|
| `forja_add_connection` | Añade una conexión de tipo forja (`key`, `name`, `url`, `token`; `rejectUnauthorized` y `overwrite` opcionales) |
| `forja_list_connections` | Lista las conexiones de tipo forja e indica cuál se usa por defecto |

## Herramientas

| Herramienta | Qué hace |
|---|---|
| `forja_list_plugins` / `forja_get_plugin` | Lista tus plugins y los de tus equipos (con tu papel, `author` o `team`, y su salud) u obtiene la ficha de uno, con los requisitos de catálogo que le faltan (`health_requirements`) |
| `forja_update_plugin` | Cambia `description`, `publicrepo` o `youtube`. La descripción corta no se edita: la forja la regenera |
| `forja_upload_plugin_image` / `forja_delete_plugin_image` | Sube una imagen a una posición (1-3, la 1 es la portada) o al primer hueco libre, o quita la de una posición |
| `forja_download_translations` | Escribe `<plugin_path>/Translation/<idioma>.json` (todos los idiomas o solo `lang`), sustituyendo los archivos locales; un idioma sin traducciones en la web no vacía el local |
| `forja_upload_translations` | Sube los archivos de `<plugin_path>/Translation/` (todos o solo `lang`) o una sola clave con `lang`, `key` y `value`. Como en la web, cada idioma enviado cuesta 10 puntos (no se cobran si nada cambia), admite hasta 500 claves (el plugin no envía un archivo con más), hay topes diarios y semanales de claves nuevas y los textos quedan pendientes de revisión. Las claves que comparten varios plugins no se cambian. Devuelve `created`, `updated`, `unchanged`, `skipped`, `points_spent` y `points`. Las traducciones no se pueden borrar por la API |
| `forja_build_zip` | Crea en una carpeta temporal el zip de una versión a partir de la carpeta local (`source_path`) de un plugin o del core. Ver [Zip de una versión](#zip-de-una-versión) |
| `forja_list_builds` / `forja_upload_build` | Lista las versiones con su estado o publica el zip de una nueva (`version` opcional), que queda en beta. Si el zip lo creó `forja_build_zip`, lo borra tras subirlo con éxito salvo `keep_zip: true`; los demás zips nunca se borran |
| `forja_set_build_status` | Cambia el estado de una versión (`beta`, `stable` o `disabled`); la forja puede dejarla en beta si necesita un core que no es estable |
| `forja_list_publications` / `forja_get_publication` | Lista las publicaciones (`type`: `news`, `user` o `dev`) u obtiene una con su texto |
| `forja_create_publication` / `forja_update_publication` | Crea o modifica una publicación: `type`, `title`, `title_short`, cuerpo Markdown en `body` o `body_file` (`.md`, `.markdown` o `.txt`), `ordernum`, `idparent`, `youtube`, `icon`, `color`, `keywords`, `controllers` e `images`, que la forja añade al final del texto. El cuerpo debe tener al menos 300 caracteres (se comprueba antes de enviar). Crear exige el email verificado y tiene los mismos límites que la web: 20 publicaciones al día y 100 a la semana |
| `forja_delete_publication` | Borra una publicación; solo quien la escribió |
| `forja_publish_doc_page` | Publica o actualiza una página de `Doc/User` o `Doc/Dev` como publicación. Ver [Documentación de Doc](#documentación-de-doc) |
| `forja_list_errors` / `forja_get_error` | Lista los informes de error del plugin (`status`: `investigating` o `solved`; `limit` y `offset`) u obtiene uno completo por su `hash` |
| `forja_list_issues` / `forja_get_issue` | Lista las issues del plugin (`status`: `open` o `closed`; `limit` y `offset`) u obtiene una con su conversación, si puedes verla en la web. Solo lectura |

Las rutas locales (`plugin_path`, `source_path`, `zip_path`, `image_path`, `body_file`, `images`) deben ser absolutas (se admite `~`), porque el servidor MCP no se ejecuta en la carpeta de tu proyecto.

## Documentación de Doc

La forja no importa la carpeta `Doc/` del zip de una versión: cada página de `Doc/User` y `Doc/Dev` es una publicación de tipo `user` o `dev`. `forja_publish_doc_page` (`plugin`, `plugin_path` y `page`, por ejemplo `User/configuracion.md`) la crea o la actualiza:

- Envía los datos de su entrada en `Doc/forja.json`: `title` (obligatorio), `title_short`, `ordernum`, `icon`, `color`, `keywords`, `controllers`, `youtubeid` (como `youtube`) y `parent`, que debe estar publicada antes. `permalink`, `imageurl` y `visibility` no se pueden cambiar por la API: se ignoran con un aviso.
- Sube las imágenes locales que enlaza (dentro de `Doc/`, normalmente `../Assets/...`) y las coloca en su sitio; una imagen ya subida que no ha cambiado se reutiliza. Los enlaces a otras páginas de `Doc` ya publicadas se cambian por su ruta en la web, relativa al sitio (`/publicaciones/...`, como los que se escriben en la web); los demás se dejan como están, con un aviso.
- Guarda en la entrada de la página `idpublication` y las imágenes subidas (`assets`, con su URL y su hash), para actualizarla después en lugar de crear otra. Versiona `Doc/forja.json` con las páginas.
- Rechaza, sin enviar nada, una página sin `title`, con menos de 300 caracteres, con imágenes que no existen o fuera de `Doc/`, o con un `idpublication` que ya no existe en la forja.
- Con `dry_run: true` solo devuelve lo que haría: campos, imágenes que se suben o se reutilizan, enlaces y avisos.

## Zip de una versión

`forja_build_zip` prepara el zip que se sube con `forja_upload_build`, para que llegue a Forja tal y como lo recibirá quien descargue la versión. Basta con pedir «créame el zip del plugin X» o «créame el zip del core»:

- **Plugin**: carpeta con un `facturascripts.ini`. Lee su `name` y su `version` (numérica, por ejemplo `1.5`) y mete todo en una carpeta raíz con ese `name`, aunque la carpeta local se llame de otra forma.
- **Core**: carpeta con `Core/Kernel.php` y sin `facturascripts.ini`. La versión es la de `Kernel::version()` y la carpeta raíz, `facturascripts`, la que espera el actualizador. Exige `Core`, `vendor` y `node_modules`, y avisa si `vendor` trae dependencias de desarrollo.
- **Se quita**: los archivos y carpetas ocultos (`.git`, `.github`, `.claude`, `.agents`, `.DS_Store`, `.gitignore`...), la carpeta `Test` y la carpeta `Doc` de la raíz, los archivos de asistentes de IA (`CLAUDE.md`, `AGENTS.md`, `AGENTS.override.md`, `CLAUDE.local.md`, `GEMINI.md`), la configuración de PHPUnit (`phpunit*.xml`, `phpunit*.xml.dist`), los metadatos del sistema (`__MACOSX`, `Thumbs.db`, `desktop.ini`) y los enlaces simbólicos. En el core, también `Plugins`, `Dinamic`, `MyFiles` y los `config*.php` de la raíz, que tienen las claves de la base de datos.
- Las carpetas van con permisos 0755 y los archivos con 0644, como al empaquetar a mano.
- Falla, sin crear el zip, si un plugin tiene `composer.json` o `package.json` en la raíz sin `vendor` o `node_modules`, porque Forja lo rechazaría.
- El zip queda en `<carpeta temporal del sistema>/fs-forja-builds/<nombre>-XXXX/<nombre>-<versión>.zip`. La herramienta devuelve su ruta, el tipo, el nombre, la versión, los archivos incluidos, el tamaño y un resumen de lo excluido por grupo, con las primeras rutas de cada uno.

Forja también quita del zip al publicarlo los archivos de IA, de desarrollo y los metadatos del sistema, y avisa de lo que ha quitado. La documentación no viaja en el zip: se publica con `forja_publish_doc_page`.

Errores habituales: **401** token no válido, **402** puntos insuficientes (traducciones), **403** acceso a la API no concedido (o IP bloqueada tras varios intentos fallidos), **404** recurso inexistente o plugin que no es tuyo ni de tu equipo y **429** límite de peticiones, publicaciones o traducciones superado. Los mensajes del servidor se devuelven tal cual, con el estado HTTP y su código.

### Límites de la API

La forja admite **30 peticiones por minuto y 300 por hora desde cada IP**, y **bloquea la IP 10 minutos** cuando recibe 5 peticiones con un token no válido en 10 minutos, aunque haya peticiones correctas entre medias. El servidor de fs-forja los respeta por su cuenta y los comparte entre las conexiones que apuntan al mismo servidor:

- Espacia las peticiones para no pasar de 28 por minuto ni de 290 por hora; si hace falta esperar más de 90 segundos, devuelve un error con el tiempo que falta en vez de enviar la petición.
- Si la forja responde 429 con `Retry-After` (por ejemplo, porque otra sesión de Claude Code o de Codex ha hecho peticiones desde la misma IP), deja de enviar peticiones ese tiempo y, si es corto, repite la petición una vez; ese 429 se da antes de atender la petición, así que no se duplica nada. Los 429 por los topes diarios o semanales de publicaciones y traducciones no se repiten.
- Tras 3 rechazos por token no válido en 10 minutos deja de probar tokens sin comprobar (los que ya han funcionado siguen pudiendo usarse). Al corregir el token con `forja_add_connection` permite un intento más, sin llegar nunca al quinto. Si la forja responde 403 después de esos rechazos, lo toma como el bloqueo de la IP y espera 10 minutos.
