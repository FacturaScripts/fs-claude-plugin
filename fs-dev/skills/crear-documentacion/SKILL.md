---
name: crear-documentacion
description: Crea o completa la estructura de documentación de un plugin o del core de FacturaScripts (Doc/User, Doc/Dev, Doc/Context, Doc/Assets, Doc/forja.json, AGENTS.md, CLAUDE.md y .gitignore).
---

# Skill: Estructura de documentación de FacturaScripts

Úsala cuando el usuario pida crear, completar o revisar la estructura de documentación de un plugin o del core
(«créame la estructura de documentación», «añade la carpeta Doc», «prepara el plugin para Claude y Codex») y como
parte de la creación de un plugin nuevo (`fs-dev:crear-plugin`).

## La estructura

Es la de los plugins fiscales (FiscalES, Facturae, InformeSII, Ticketbai y Verifactu):

```
<Plugin o core>/
├── Doc/
│   ├── User/          # páginas .md de uso para usuarios
│   ├── Dev/           # páginas .md para personalizarlo desde otro plugin (programadores)
│   ├── Context/       # el porqué del código: decisiones, temas, normativa...
│   │   └── README.md  # índice de Context: qué hay en cada archivo
│   ├── Assets/        # imágenes, vídeos y archivos enlazados desde la documentación
│   └── forja.json     # páginas y sus datos para publicarlas en la forja de facturascripts.com
├── AGENTS.md          # descripción breve del plugin y enlace a Doc/
├── CLAUDE.md          # solo contiene la línea @AGENTS.md
└── .gitignore
```

- `Doc/Context/` se puede dividir en tantos archivos y subcarpetas como haga falta (por ejemplo `NN-tema.md` y
  `Decisiones/NNNN-titulo.md`); su `README.md` hace de índice y se actualiza en el mismo trabajo que cambia el código.
- `Doc/forja.json` guarda los datos con los que se publica cada página de `Doc/User` y `Doc/Dev` en la forja de
  facturascripts.com, y el id de su publicación. Su formato está en la sección [`Doc/forja.json`](#docforjajson) y la
  publicación, en [Publicación en la forja](#publicación-en-la-forja).
- Las carpetas vacías llevan un `.gitkeep` para que git las suba. No lo añadas a carpetas que ya tienen archivos.
- `AGENTS.md` es el archivo de instrucciones para los agentes (Codex lo lee directamente) y es corto: qué es el plugin
  en una o dos frases, el enlace a `Doc/Context/README.md` y la tabla de `Doc/`. `CLAUDE.md` solo lo importa con
  `@AGENTS.md` para Claude Code.
- El `.gitignore` ignora lo mismo que los plugins fiscales, incluidos `/CLAUDE.local.md` y `/AGENTS.override.md`,
  que son las instrucciones locales de cada persona en Claude Code y Codex. No ignora `AGENTS.md`, `CLAUDE.md` ni
  `Doc/`; de `.claude/` y `.agents/` solo ignora lo local (`/.claude/*` y `/.agents/*`, con las excepciones
  `!/.claude/skills` y `!/.agents/skills`).

Al iniciar una sesión en una instalación de FacturaScripts, el hook `SessionStart` de fs-dev recuerda que el core y
cada plugin pueden tener este árbol y da las rutas del `AGENTS.md` y del índice de `Doc/Context/` que existan en el
plugin actual y en el core.

## Doc/forja.json

Agrupa en `User` y `Dev` las páginas de `Doc/User/` y `Doc/Dev/`, cada una por su nombre de archivo, con sus datos para
la forja. La plantilla tiene las dos secciones vacías:

```json
{
    "User": {},
    "Dev": {}
}
```

Ejemplo con una página:

```json
{
    "User": {
        "mi-pagina-de-prueba.md": {
            "title": "Mi página de prueba",
            "title_short": "Página de prueba",
            "permalink": "mi-pagina-de-prueba",
            "parent": "mi-segunda-pagina-de-prueba.md",
            "ordernum": 100,
            "youtubeid": "https://mi-video-de-youtube.com",
            "imageurl": "Doc/Assets/mi-imagen.png",
            "icon": "fa-solid fa-book",
            "color": "info",
            "keywords": "ventas,facturas",
            "controllers": "ListFacturaCliente,EditFacturaCliente",
            "visibility": true
        }
    },
    "Dev": {}
}
```

Todos los campos son opcionales. Las longitudes máximas se cuentan en caracteres:

| Campo | Tipo | Qué indica |
|---|---|---|
| `title` | texto, máx. 200 | Título de la página; obligatorio para publicarla |
| `title_short` | texto, máx. 100 | Título corto para SEO; si falta, la forja recorta el título |
| `permalink` | texto, máx. 200 | Enlace de la página en la web. La forja lo genera a partir del título al crear la publicación y la API no lo cambia: solo es informativo |
| `parent` | texto | Página padre, por su **nombre de archivo con `.md`** en la misma sección (`inicio.md`, no su permalink) |
| `ordernum` | número entero | Orden de la página |
| `youtubeid` | texto | Vídeo de YouTube de la página |
| `imageurl` | texto | Imagen principal: una URL o un archivo de `Doc/Assets/`. La API no la cambia: se pone desde la web |
| `icon` | texto, máx. 50 | Icono de Font Awesome |
| `color` | texto | Color de Bootstrap: `primary`, `secondary`, `success`, `danger`, `warning`, `info` o `dark` |
| `keywords` | texto, máx. 300 | Palabras clave para buscar la página, separadas por comas |
| `controllers` | texto, máx. 300 | Controladores donde se muestra la página, separados por comas y sin espacios (`ListFacturaCliente,EditFacturaCliente`) |
| `visibility` | `true` o `false` | Si la página es visible; es un booleano JSON sin comillas, nunca un texto como `"public"`. La API no la cambia: se cambia desde la web |
| `idpublication` | número entero | Id de la publicación en la forja. Lo escribe `forja_publish_doc_page` al publicar la página; no lo cambies a mano |
| `assets` | objeto | Imágenes de la página ya subidas a la forja (`{"Assets/x.png": {"url": ..., "sha256": ...}}`). Lo escribe `forja_publish_doc_page` para no volver a subirlas |

## Publicación en la forja

- Cada página de `Doc/User` y `Doc/Dev` es una **publicación** de la forja (de tipo `user` o `dev`). La forja **no
  importa** la carpeta `Doc/` del zip de una versión: `forja_build_zip` de fs-mcp la deja fuera del zip, y las páginas
  se publican una a una con `forja_publish_doc_page`, siguiendo la skill `fs-dev:sincronizar-forja`.
- `forja_publish_doc_page` envía los datos de la entrada de `forja.json`, sube las imágenes de `Doc/Assets` que enlaza
  la página y las coloca en su sitio, cambia los enlaces a otras páginas publicadas por su ruta en la web
  (`/publicaciones/...`) y guarda en la entrada el `idpublication` y las imágenes subidas (`assets`). Versiona `Doc/forja.json` con las páginas: sin
  `idpublication`, la página se publicaría otra vez como nueva.
- Una página con `parent` se publica después que su padre. Los enlaces a páginas aún sin publicar se dejan como
  están: cuando estén todas publicadas, se vuelve a publicar la página que las enlaza.
- La web rechaza las páginas sin `title` o con menos de 300 caracteres de cuerpo: `forja_publish_doc_page` lo
  comprueba antes de enviar nada.

## Script

El script [`../../scripts/create-doc-structure.py`](../../scripts/create-doc-structure.py), relativo a este
`SKILL.md`, crea lo que falta sin sobrescribir nada; en Claude Code equivale a
`${CLAUDE_PLUGIN_ROOT}/scripts/create-doc-structure.py`. La variable `CLAUDE_PLUGIN_ROOT` no existe en el entorno de
Bash: resuelve antes la ruta absoluta del script y úsala entre comillas. En los ejemplos, `<scripts>` representa la
carpeta del script.

```bash
python3 "<scripts>/create-doc-structure.py" "<ruta del plugin o del core>" --check
python3 "<scripts>/create-doc-structure.py" "<ruta del plugin o del core>"
```

- Detecta un plugin por su `facturascripts.ini` y el core por `Core/Kernel.php`; en otra carpeta termina con código 2.
- `--check` solo informa de lo que falta. `--json` devuelve el informe en JSON.
- Del `.gitignore` quita solo las reglas que impiden versionar la estructura (`CLAUDE.md`, `AGENTS.md`, `/.claude`
  entero, `.agents`) y añade las que faltan dentro de su sección (o al final, con su comentario, si la sección no
  existe). El resto de reglas no se tocan; `X` y `/X` cuentan como la misma regla.
- En `Doc/forja.json` añade las secciones `User` y `Dev` que falten y valida las páginas: que existan en su carpeta,
  que los campos y tipos sean los de la tabla, las longitudes máximas, el color y que exista la página padre.
- Termina con código 1 si deja tareas **pendientes** que no resuelve solo.

## Pasos

1. Localiza la raíz: la carpeta del plugin (`Plugins/<Plugin>`) o la del core. Si el usuario no la indica y el
   directorio actual no es ninguna de las dos, pregúntale.
2. Ejecuta el script con `--check` y resume al usuario lo que se va a crear y qué reglas del `.gitignore` cambian.
3. Ejecuta el script sin `--check`.
4. Resuelve los pendientes:
   - **CLAUDE.md con instrucciones propias**: mueve su contenido a `AGENTS.md` (sin duplicar lo que ya diga) y deja
     `CLAUDE.md` solo con `@AGENTS.md`. Si el contenido es largo, deja en `AGENTS.md` lo esencial y lleva el
     porqué de las decisiones a `Doc/Context/`, enlazado desde su `README.md`.
   - **AGENTS.md sin enlace a la documentación**: añade el párrafo que remite a `Doc/Context/README.md` y la tabla de
     `Doc/` de la plantilla del script, conservando lo que ya tenga.
   - **Un problema en `Doc/forja.json`** (JSON no válido, una página que no existe, un campo desconocido o un valor
     no admitido): corrígelo según la tabla de [`Doc/forja.json`](#docforjajson) o pregunta al usuario si no está
     claro qué página o valor quería.
   - **Una regla del `.gitignore` ignora `Doc/`** (por ejemplo `/doc/` en el core, que con `core.ignoreCase` también
     ignora `Doc/`): explica el conflicto y pregunta al usuario antes de quitarla o añadir una excepción.
5. Si el script creó `AGENTS.md`, revisa su primera frase: debe decir en una o dos frases qué hace el plugin. Tómalo
   del `README.md`, del `facturascripts.ini` o del código, y no lo alargues: el detalle va en `Doc/`.
6. Repite el script con `--check` para confirmar que la estructura queda completa y resume los cambios.

No escribas páginas de `Doc/User`, `Doc/Dev` o `Doc/Context` ni rellenes `forja.json` salvo que el usuario lo pida.
Para escribir una página de `Doc/User` o `Doc/Dev` con sus capturas, usa la skill `fs-dev:docs-writer`, y para
bajarla o subirla a la forja, `fs-dev:sincronizar-forja`. No hagas commits.

## Alternativa con fsmaker

Las versiones de fsmaker que incluyen el comando `docs` (compruébalo con `fsmaker list`) crean la misma estructura
desde la carpeta del plugin o del core con `fsmaker docs`, y `fsmaker plugin` la incluye al crear un plugin. fsmaker
no fusiona un `.gitignore` existente: para eso usa el script.
