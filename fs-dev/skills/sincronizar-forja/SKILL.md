---
name: sincronizar-forja
description: Sincroniza un plugin local con su ficha de autor en la forja de facturascripts.com mediante fs-mcp: alta del plugin, documentación, traducciones, datos, imágenes, noticias y nuevas versiones.
---

# Skill: Sincronizar un plugin con la forja de facturascripts.com

Úsala cuando el autor de un plugin quiera darlo de alta en facturascripts.com, bajar o subir su documentación, sus
traducciones, los datos o las imágenes de la ficha, publicar una noticia o subir una versión nueva («crea el plugin en
la forja», «baja la documentación de la web», «sube estas páginas», «publica la versión 2.1», «actualiza la
descripción del plugin»).

## Requisitos

- **fs-mcp** con una conexión de **tipo `forja`**: la URL de facturascripts.com y el token de autor. Créala con la
  skill `fs-mcp:add-connection` (`type: "forja"`). Las herramientas `forja_*` solo usan conexiones de ese tipo; sin
  `connection`, la primera de tipo `forja` configurada.
- El **acuerdo de proveedor vigente** en facturascripts.com: la API de autor solo admite los plugins de los que eres
  autor. Si dudas del nombre del plugin, consulta `forja_list_plugins` o `forja_get_plugin`.
- Las herramientas de fs-mcp reciben **rutas absolutas**. Guarda los zip temporales fuera del repositorio del plugin
  (en la carpeta temporal de la sesión), para no versionarlos por error.

Todo lo que se sube se publica en la web. Antes de cada subida (`forja_create_plugin`, `forja_upload_*`,
`forja_update_*`, `forja_create_publication`), resume al usuario qué se va a enviar y espera su confirmación.

## El script del paquete de documentación

fs-mcp solo transporta el zip de documentación; colocarlo en el plugin y prepararlo para subir lo hace el script
[`../../scripts/forja-doc-bundle.py`](../../scripts/forja-doc-bundle.py), relativo a este `SKILL.md`; en Claude Code
equivale a `${CLAUDE_PLUGIN_ROOT}/scripts/forja-doc-bundle.py`. La variable `CLAUDE_PLUGIN_ROOT` no existe en el
entorno de Bash: resuelve antes la ruta absoluta del script y úsala entre comillas. En los ejemplos, `<scripts>`
representa la carpeta del script.

El zip tiene la misma estructura que la carpeta `Doc/` del plugin, con las imágenes incluidas y los enlaces relativos
resueltos; el mismo formato sirve para bajar y para subir:

```
User/*.md        # páginas de uso
Dev/*.md         # páginas de programación
Assets/**        # imágenes y archivos que enlazan las páginas
forja.json       # datos de cada página, con el formato de Doc/forja.json
```

```bash
python3 "<scripts>/forja-doc-bundle.py" unpack "<zip>" "<ruta del plugin>" [--type user|dev|all] [--dry-run]
python3 "<scripts>/forja-doc-bundle.py" pack "<ruta del plugin>" "<zip>" [--pages User/a.md Dev/b.md ...] [--type user|dev|all]
```

- **`unpack`** escribe en `Doc/User`, `Doc/Dev` y `Doc/Assets` (acepta también el prefijo `Doc/` en el zip). Las
  páginas del zip reemplazan su entrada de `Doc/forja.json` y las locales que no vienen se conservan. Quita los
  `.gitkeep` de las carpetas que quedan con contenido, valida `forja.json` y los enlaces, e imprime lo creado,
  actualizado y sin cambios, y los avisos. Rechaza el zip entero, sin escribir nada, si trae rutas absolutas, con `..`
  o enlaces simbólicos. `--dry-run` solo informa. Con `--type`, solo esa sección y las imágenes que usan sus páginas.
- **`pack`** incluye las páginas elegidas (o todas las del tipo), sus entradas de `forja.json` y las imágenes de
  `Doc/Assets` que enlazan (`../Assets/...` en el cuerpo e `imageurl` `Doc/Assets/...`). Avisa de imágenes o enlaces
  `.md` que no existen, de enlaces fuera de `User`/`Dev` y de títulos repetidos. Son **errores** que impiden crear el
  zip un cuerpo de menos de 300 caracteres (el servidor lo rechaza) y un problema de `forja.json` (campo desconocido,
  tipo o valor no admitido, padre que no existe).
- Código de salida: 0 si todo va bien (aunque haya avisos), 1 si hay errores y 2 si la ruta no es un plugin, el core o
  un zip existente.

## Cómo asocia la web cada página

Cada archivo del paquete se asocia a su publicación por la **ruta** (`User/x.md`) y, si no la encuentra, por el
**`permalink`** de su entrada en `forja.json`. Por eso **no cambies el `permalink`** en `forja.json` para renombrar o
mover una página: cambia el `title`. Las páginas de la web que no vienen en el paquete **no se tocan**: subir una sola
página no borra las demás, y para retirar una página publicada hay que hacerlo desde la web (o con
`forja_update_publication`).

## Flujos

### Descargar la documentación

1. `forja_download_docs` con `plugin`, `type` (`all`, `user` o `dev`) y `output_zip` (ruta absoluta del zip temporal).
2. `forja-doc-bundle.py unpack "<zip>" "<plugin>" --dry-run` y resume al usuario qué páginas se crean o cambian.
3. Si lo confirma, repite sin `--dry-run`. Revisa los avisos y el `git diff` de `Doc/`: lo que estaba solo en local
   (páginas y entradas que no vienen en el zip) se conserva.

### Editar y subir la documentación

1. Escribe o corrige las páginas (skill `fs-dev:docs-writer`) y valida la estructura con `fs-dev:crear-documentacion`
   (`create-doc-structure.py --check`).
2. `forja-doc-bundle.py pack "<plugin>" "<zip>"` con `--pages` para subir solo las páginas cambiadas, o sin él para
   todas. Corrige los errores y revisa los avisos antes de seguir.
3. Con la confirmación del usuario, `forja_upload_docs` con `plugin` y `zip_path`. Comunica las páginas creadas,
   actualizadas, sin cambios y los errores que devuelve el servidor.

Para publicar la documentación junto con una versión no hace falta este flujo: ver
[Publicar una versión](#publicar-una-versión).

### Traducciones

- `forja_download_translations` con `plugin` y `plugin_path` (y `lang` para un solo idioma) **sustituye** los archivos
  de `Translation/`: revisa antes que no haya cambios locales sin subir y, después, el `git diff`.
- `forja_upload_translations` sube los `Translation/*.json` del plugin (todos o solo `lang`) o una sola clave con
  `lang`, `key` y `value`. En local solo se mantiene `es_ES.json` (los demás idiomas se traducen en la web), así que
  normalmente se sube con `lang: "es_ES"`.

### Dar de alta un plugin nuevo

Las demás herramientas solo admiten plugins que ya existen en la web. Para uno nuevo:

1. `forja_get_plugin_options` devuelve el cupo (`quota.plugins` de `quota.limit`, que crece con las instalaciones
   activas de todos tus plugins), si puedes crear uno (`can_create`) y los tipos, licencias, colecciones y equipos
   privados admitidos. Si `can_create` es `false`, explica al usuario el motivo (email sin verificar o cupo agotado)
   y no sigas.
2. Toma el `name` del `facturascripts.ini` del plugin: debe coincidir con el de la web para poder subir sus
   versiones. Empieza por una letra y solo admite letras, números, `-` y `_` (de 3 a 50).
3. Con la confirmación del usuario, `forja_create_plugin` con `name` y, si los indica, `type` (`free` por defecto,
   `for-sale`, `sponsor` o `private`), `license` (`LGPL` por defecto), `description`, `idcoleccion`, `idteam` (el
   primer equipo privado del autor por defecto; se crea uno si no tiene) e `idteam_doc`.

El servidor aplica los mismos límites que la web: email verificado, cupo de plugins, nombre libre (sin distinguir
mayúsculas) y equipos privados del autor. El plugin queda **privado** hasta que el personal lo aprueba; mientras
tanto ya se le pueden subir versiones, traducciones y documentación.

### Datos e imágenes del plugin

- `forja_update_plugin` cambia la descripción larga (`description`), la corta (`description_short`), el repositorio
  público (`publicrepo`) y el vídeo de YouTube (`youtube`); solo se envían los campos indicados. Consulta antes los
  datos actuales con `forja_get_plugin`.
- `forja_upload_plugin_image` sube una imagen de la ficha (`image_path`, ruta absoluta) en la posición 1, 2 o 3
  (`position`); `forja_delete_plugin_image` quita la de una posición.

### Noticias y publicaciones

- `forja_list_publications` (con `type` `news`, `user` o `dev`) y `forja_get_publication` (`id`) consultan lo
  publicado.
- `forja_create_publication` crea una noticia (`type: "news"`) con `title` y el cuerpo en Markdown en `body` o
  `body_file`, y opcionalmente `images`, `youtubeid`, `ordernum` e `idparent`. Para redactar la noticia de una versión
  a partir de los commits, usa la skill `fs-dev:skill-notice`.
- `forja_update_publication` (`id`) cambia solo los campos indicados.
- Las páginas de documentación de `Doc/User` y `Doc/Dev` se suben con el paquete
  ([Editar y subir la documentación](#editar-y-subir-la-documentación)), no con estas herramientas: así conservan sus
  imágenes, sus enlaces y los datos de `forja.json`.

### Publicar una versión

1. Comprueba la versión del `facturascripts.ini` y, si procede, audita el plugin con `fs-dev:verificar-min-version`.
2. Desde la carpeta del plugin, `fsmaker zip` (skill `fs-dev:fsmaker`) genera el zip del plugin.
3. Con la confirmación del usuario, `forja_upload_build` con `plugin` y `zip_path` (y `version` solo si no debe
   tomarse del `facturascripts.ini` del zip).
4. Comunica la versión creada, los archivos que el servidor quitó del zip y el informe de documentación.

El servidor **quita del zip de versión** `CLAUDE.md`, `AGENTS.md`, `.claude/`, `.agents/` y `Doc/Context/`, que son
para el equipo y los agentes, e **importa automáticamente `Doc/User` y `Doc/Dev`** con su `Doc/forja.json`: cada
página se asocia igual que en `forja_upload_docs` y las de la web que no vienen no se tocan. Antes de generar el zip,
comprueba las páginas con `forja-doc-bundle.py pack` hacia un zip temporal que no se sube: un cuerpo de menos de 300
caracteres, por ejemplo, también lo rechaza el servidor al importar la versión.

## Reglas

- No hagas commits de lo descargado salvo que el usuario lo pida.
- No subas nada sin confirmación expresa, y nunca un zip de documentación que `pack` no haya creado sin errores.
- No muestres el token de la conexión ni el contenido de `~/.fs-claude.json`.
