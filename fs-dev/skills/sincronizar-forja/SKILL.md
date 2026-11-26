---
name: sincronizar-forja
description: Sincroniza un plugin local con su ficha de autor en la forja de facturascripts.com mediante el plugin fs-forja: documentación, traducciones, datos, imágenes, noticias, versiones, errores e issues.
---

# Skill: Sincronizar un plugin con la forja de facturascripts.com

Úsala cuando el autor de un plugin (o un miembro de su equipo) quiera publicar su documentación, subir o bajar sus
traducciones, cambiar los datos o las imágenes de la ficha, publicar una noticia o una versión nueva, o consultar los
errores y las issues del plugin («sube estas páginas a la web», «publica la versión 2.1», «pon estable la 2.0»,
«actualiza la descripción del plugin», «qué errores tiene el plugin»).

## Requisitos

- El plugin **fs-forja** activo: su servidor MCP es el que ofrece las herramientas `forja_*` (fs-mcp ya no las
  tiene). Si no aparecen, pide al usuario que active fs-forja desde el gestor de plugins y abra una sesión nueva.
- Una conexión de **tipo `forja`** con la URL de facturascripts.com y el token de autor. Compruébala con
  `forja_list_connections` y, si no hay ninguna, créala con la skill `fs-forja:add-connection` (o la herramienta
  `forja_add_connection`). Las herramientas `forja_*` solo usan conexiones de ese tipo; sin `connection`, la primera
  configurada. Las conexiones de fs-mcp (instalaciones del ERP) no sirven para la forja.
- **Acceso a la API de autor**: lo concede el personal de facturascripts.com en la ficha del contacto. Con el acceso,
  la pestaña **avanzado** de PortalForja permite generar el token, que solo se muestra al generarlo; al retirar el
  acceso se borra el token. Sin acceso, la forja responde 403.
- El plugin debe **existir ya en la web**: la API no crea plugins, que se dan de alta desde la web. Admite los plugins
  de los que eres autor y los de los equipos en los que estás aceptado; los demás responden 404. Si dudas del nombre,
  consulta `forja_list_plugins`.
- Las herramientas de fs-forja reciben **rutas absolutas**.

Todo lo que se sube se publica en la web. Antes de cada envío (`forja_publish_doc_page`, `forja_upload_*`,
`forja_update_*`, `forja_create_publication`, `forja_set_build_status`) y de cada borrado (`forja_delete_publication`,
`forja_delete_plugin_image`), resume al usuario qué se va a enviar o borrar y espera su confirmación.

## Flujos

### Publicar la documentación de `Doc/`

La forja no importa la carpeta `Doc/` del zip de una versión: cada página de `Doc/User` y `Doc/Dev` es una
**publicación** de tipo `user` o `dev`, que se crea y se actualiza con `forja_publish_doc_page`.

1. Escribe o corrige las páginas (skill `fs-dev:docs-writer`) y valida la estructura y `Doc/forja.json` con
   `fs-dev:crear-documentacion` (`create-doc-structure.py --check`).
2. Publica **primero las páginas padre**: una página con `parent` en `forja.json` falla si su padre aún no tiene
   publicación.
3. Para cada página, `forja_publish_doc_page` con `plugin`, `plugin_path` y `page` (`User/x.md` o `Dev/x.md`) y
   `dry_run: true`. Resume al usuario lo que devuelve: si se crea o se actualiza, los campos, las imágenes que se suben
   o se reutilizan, los enlaces que no se pueden resolver y los campos que se ignoran.
4. Con su confirmación, repite sin `dry_run`. Comunica la URL de cada página y los avisos.
5. Si alguna página enlaza otra que aún no estaba publicada, el enlace queda como estaba: cuando estén todas
   publicadas, vuelve a publicar las páginas con avisos de enlaces sin resolver.

Qué hace `forja_publish_doc_page`:

- Toma de la entrada de la página en `forja.json` `title` (obligatorio), `title_short`, `ordernum`, `icon`, `color`,
  `keywords`, `controllers`, `youtubeid` y `parent`. El tipo sale de la carpeta (`User` → `user`, `Dev` → `dev`).
  `permalink`, `imageurl` y `visibility` no se pueden cambiar por la API: se ignoran con un aviso y se ajustan en la
  web.
- Sube las imágenes locales que enlaza la página (normalmente `../Assets/...`) y las coloca en su sitio. Una imagen
  que ya se subió (por esta página o por otra) y no ha cambiado se reutiliza.
- Cambia los enlaces a otras páginas de `Doc/User` o `Doc/Dev` que ya tienen publicación por su ruta en la web,
  relativa al sitio (`/publicaciones/...`), como los enlaces que se escriben en la web.
- Guarda en la entrada de la página el `idpublication` y las imágenes subidas (`assets`). **Haz commit de
  `Doc/forja.json`** junto con las páginas: sin `idpublication`, la siguiente vez se crearía una publicación nueva.
- Rechaza, sin enviar nada, una página sin `title`, con menos de 300 caracteres de cuerpo, con imágenes que no existen
  o que están fuera de `Doc/`, y una entrada con un `idpublication` que ya no existe en la forja (quítalo para crearla
  de nuevo).

Crear publicaciones tiene los mismos límites que la web (email verificado y máximos diarios y semanales): si se agotan,
la forja responde 429 y hay que seguir otro día. Para retirar una página publicada, `forja_delete_publication` (solo
quien la escribió) y quita su `idpublication` de `forja.json`.

Para traer a `Doc/` una página escrita en la web, `forja_get_publication` devuelve su texto en Markdown: guárdala en
`Doc/<sección>/<archivo>.md` y añade su entrada en `forja.json` con el `title` y el `idpublication`.

### Traducciones

- `forja_download_translations` con `plugin` y `plugin_path` (y `lang` para un solo idioma) **sustituye** los archivos
  de `Translation/`: revisa antes que no haya cambios locales sin subir y, después, el `git diff`. Un idioma sin
  traducciones en la web no vacía el archivo local.
- `forja_upload_translations` sube los `Translation/*.json` del plugin (todos o solo `lang`) o una sola clave con
  `lang`, `key` y `value`. En local solo se mantiene `es_ES.json` (los demás idiomas se traducen en la web), así que
  normalmente se sube con `lang: "es_ES"`.
- Antes de subir, comprueba que **ninguna clave tiene mayúsculas**: la web rechaza la subida si una clave lleva alguna
  (las mayúsculas solo pueden ir en el valor). Si encuentras una, renómbrala a minúsculas en el JSON y en todos los
  usos del código (PHP, Twig y XMLView) antes de subir.
- La subida sigue las reglas de la web: **cada idioma enviado cuesta puntos** (no se cobran si nada cambia), hay topes
  diarios y semanales de claves nuevas y un máximo de claves por idioma, y los textos quedan **pendientes de
  revisión**. Las claves nuevas se crean en todos los idiomas con el texto en español. No se cambian las claves del
  proyecto principal ni las revisadas por alguien de más nivel: salen en `skipped` con su motivo. Comunica `created`,
  `updated`, `unchanged`, `skipped`, `points_spent` y `points`.
- Las traducciones **no se pueden borrar** por la API: las claves de la web que ya no están en local se quedan. Si hay
  que borrarlas, se pide al personal.

### Datos e imágenes del plugin

- `forja_get_plugin` devuelve la ficha con su salud (`health`) y los requisitos de catálogo que le faltan
  (`health_requirements`): mientras quede alguno, la salud es 0. Úsalo para explicar al autor qué completar.
- `forja_update_plugin` cambia la descripción (`description`), el repositorio público (`publicrepo`, URL http(s)) y
  el vídeo de YouTube (`youtube`); solo se envían los campos indicados. La descripción corta no se edita: la forja la
  vuelve a generar al cambiar la descripción.
- `forja_upload_plugin_image` sube una imagen de la ficha (`image_path`, ruta absoluta) en la posición 1, 2 o 3
  (`position`; la 1 es la portada) o en el primer hueco libre; `forja_delete_plugin_image` quita la de una posición.
  La forja compacta las imágenes para no dejar huecos.

### Noticias

- `forja_list_publications` (con `type` `news`, `user` o `dev`) y `forja_get_publication` (`id`) consultan lo
  publicado.
- `forja_create_publication` crea una noticia (`type: "news"`) con `title` y el cuerpo en Markdown (al menos 300
  caracteres) en `body` o `body_file`, y opcionalmente `title_short`, `youtube`, `icon`, `color`, `keywords` e
  `images`, que la forja añade al final del texto. Para redactar la noticia de una versión a partir de los commits, usa
  la skill `fs-dev:skill-notice`.
- `forja_update_publication` (`id`) cambia solo los campos indicados; si editas una publicación de otro miembro del
  equipo, quedas como coautor.
- Las páginas de `Doc/User` y `Doc/Dev` se publican con `forja_publish_doc_page`, no con estas herramientas: así
  conservan sus imágenes en su sitio, sus enlaces y los datos de `forja.json`.

### Publicar una versión

1. Comprueba la versión del `facturascripts.ini` y, si procede, audita el plugin con `fs-dev:verificar-min-version`.
2. `forja_build_zip` con `source_path` (ruta absoluta de la carpeta del plugin o del core) crea el zip en una carpeta
   temporal: carpeta raíz con el `name` del `facturascripts.ini` (`facturascripts` en el core), permisos 0755/0644 y
   sin archivos ocultos (`.git`, `.claude`...), `Test`, `Doc`, archivos de IA, `phpunit*.xml`, metadatos del sistema
   ni enlaces simbólicos; en el core, tampoco `Plugins`, `Dinamic`, `MyFiles` ni `config*.php`. Sirve para «créame el
   zip del plugin X» o «créame el zip del core».
3. Enseña al usuario el resumen: nombre, versión, archivos, lo excluido por grupo y los avisos. Si falla (por
   ejemplo, `composer.json` sin `vendor`), explica cómo arreglarlo; no lo empaquetes de otra forma para saltarte el
   error.
4. Con la confirmación del usuario, `forja_upload_build` con `plugin` y `zip_path` (y `version` solo si no debe
   tomarse del `facturascripts.ini` del zip). Tras subirlo con éxito, borra el zip temporal de `forja_build_zip`;
   pasa `keep_zip: true` si el usuario quiere conservarlo. Un zip que no creó `forja_build_zip` (por ejemplo, de
   `fsmaker zip`) nunca se borra.
5. Comunica la versión creada, los avisos (por ejemplo, los archivos de desarrollo que la forja quitó del zip) y qué
   pasó con el zip local (`local_zip`).

La versión nueva queda en **beta**. Cuando el autor lo decida, `forja_set_build_status` con `version` y `status`
(`stable`, `beta` o `disabled`) cambia su estado; la forja puede dejarla en beta si la versión del core que necesita
no es estable, así que comunica el estado con el que ha quedado. `forja_list_builds` lista las versiones con su
estado y sus descargas. La documentación no viaja en el zip: publícala con
[`forja_publish_doc_page`](#publicar-la-documentación-de-doc).

### Errores e issues

- `forja_list_errors` lista los informes de error que envían las instalaciones (filtro `status`: `investigating` o
  `solved`, y `limit`/`offset`), y `forja_get_error` (`hash`) devuelve uno completo: mensaje, archivo y línea,
  versiones de core y PHP, plugins activos y la solución si la hay. Para investigar y corregir un error, sigue la
  skill `fs-dev:analizar-bug` con esos datos.
- `forja_list_issues` (filtro `status`: `open` o `closed`) y `forja_get_issue` (`id`) consultan las issues en solo
  lectura. La conversación de una issue solo se ve si la creaste, eres de su equipo de soporte o has comentado en
  ella; si no, la forja responde 403. Para contestar, hazlo en la web.

## Reglas

- No hagas commits salvo que el usuario lo pida; recuérdale que `Doc/forja.json` guarda los `idpublication`.
- No envíes ni borres nada sin confirmación expresa, y publica las páginas de documentación con `dry_run` primero.
- Ten en cuenta que subir traducciones gasta puntos del autor: dilo antes de subirlas.
- No muestres el token de la conexión ni el contenido de `~/.fs-ai.json`.
