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
- `Doc/forja.json` lo lee la forja de facturascripts.com al subir el plugin o el core para dar de alta la
  documentación. Su formato está en la sección [`Doc/forja.json`](#docforjajson).
- Las carpetas vacías llevan un `.gitkeep` para que git las suba. No lo añadas a carpetas que ya tienen archivos.
- `AGENTS.md` es el archivo de instrucciones para los agentes (Codex lo lee directamente) y es corto: qué es el plugin
  en una o dos frases, el enlace a `Doc/Context/README.md` y la tabla de `Doc/`. `CLAUDE.md` solo lo importa con
  `@AGENTS.md` para Claude Code.
- El `.gitignore` ignora lo mismo que los plugins fiscales, incluidos `/CLAUDE.local.md` y `/AGENTS.override.md`,
  que son las instrucciones locales de cada persona en Claude Code y Codex. No ignora `AGENTS.md`, `CLAUDE.md` ni
  `Doc/`; de `.claude/` y `.agents/` solo ignora lo local (`/.claude/*` y `/.agents/*`, con las excepciones
  `!/.claude/skills` y `!/.agents/skills`).

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

Todos los campos son opcionales:

| Campo | Tipo | Qué indica |
|---|---|---|
| `title` | texto | Título de la página; si falta, se usa el nombre del archivo `.md` formateado |
| `title_short` | texto | Título corto para SEO; si falta, se usa el nombre del archivo `.md` formateado |
| `parent` | texto | Página padre, por su nombre de archivo en la misma sección |
| `ordernum` | número entero | Orden de la página |
| `youtubeid` | texto | Vídeo de YouTube de la página |
| `imageurl` | texto | Imagen principal: una URL o un archivo de `Doc/Assets/` |
| `icon` | texto | Icono de Font Awesome |
| `color` | texto | Color de Bootstrap: `primary`, `secondary`, `success`, `danger`, `warning`, `info` o `dark` |
| `keywords` | texto | Palabras clave para buscar la página, separadas por comas |
| `controllers` | texto | Controladores donde se muestra la página, separados por comas |
| `visibility` | `true` o `false` | Si la página es visible |

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
  que los campos y tipos sean los de la tabla, el color y que exista la página padre.
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
No hagas commits.

## Alternativa con fsmaker

Las versiones de fsmaker que incluyen el comando `docs` (compruébalo con `fsmaker list`) crean la misma estructura
desde la carpeta del plugin o del core con `fsmaker docs`, y `fsmaker plugin` la incluye al crear un plugin. fsmaker
no fusiona un `.gitignore` existente: para eso usa el script.
