# Compatibilidad entre Claude Code y Codex

El repositorio mantiene una única implementación para ambos hosts. Separar un `fs-codex-plugin` duplicaría skills, documentación, versiones y mantenimiento sin aportar una capacidad que no pueda resolverse desde este marketplace compartido.

| Componente | Claude Code | Codex | Implementación compartida |
|---|---|---|---|
| Skills | Nativas | Nativas | `*/skills/*/SKILL.md` |
| Agentes especializados | Agentes Markdown nativos | Perfiles leídos por las skills; delegación genérica opcional | `*/agents/*.md` |
| Scripts y referencias desde skills y perfiles | `${CLAUDE_PLUGIN_ROOT}` sustituida en el contenido; no existe en Bash | Rutas relativas al `SKILL.md` o al perfil | `fs-dev/scripts/`, `*/references/` |
| Modelo de cada perfil | Campo `model` del agente | Solicitado por la skill al delegar; sin delegación, el modelo de la sesión | Tabla de equivalencias de este documento |
| Inicio de sesión | `SessionStart` | `SessionStart` | `*/hooks/hooks.json` |
| Comando de los hooks | `command` en los tres sistemas (Git Bash en Windows) | `command` en Linux y macOS; `commandWindows` con `cmd.exe` en Windows | `scripts/run-python.sh` y scripts de Python 3 |
| Cambio de directorio | Requiere sesión nueva; `CwdChanged` no añade su salida al contexto | Requiere hilo nuevo; el evento no existe | Solo `SessionStart` |
| Idioma de las respuestas | `UserPromptSubmit` con `additionalContext` | `UserPromptSubmit` con `additionalContext` | `fs-dev/scripts/language-reminder.py` |
| Ediciones automáticas | `Write` y `Edit` | `apply_patch` | `fs-dev/scripts/post-edit.py` |
| Servidores MCP | Raíz mediante `CLAUDE_PLUGIN_ROOT` | Raíz mediante el directorio de trabajo del plugin | Lanzador portable definido en `fs-mcp/.claude-plugin/plugin.json` y `fs-forja/.claude-plugin/plugin.json` |
| Módulos privados | `settings.localModulesPath` | `settings.localModulesPath` | `~/.fs-ai.json` |
| Conexiones | `connections` de `~/.fs-ai.json` | `connections` de `~/.fs-ai.json` | fs-mcp usa las de tipo `api` y fs-forja, las de tipo `forja` |

## Automatización de ediciones

El hook `PostToolUse` normaliza los formatos de entrada de ambos hosts. Procesa todos los archivos de un parche en orden estable y ejecuta primero la actualización de copyright y después la ordenación de la clase PHP. De este modo no hay dos hooks escribiendo simultáneamente el mismo archivo.

El hook nunca bloquea: sale siempre con código 0 y deja los errores en stderr, porque Codex no documenta la salida 1 en `PostToolUse`. Cuando modifica un archivo, devuelve `hookSpecificOutput.additionalContext` en ambos hosts para que el modelo lo relea antes de volver a editarlo. Un archivo cuenta como nuevo cuando `Write` informa `tool_response.type: "create"` (Claude Code) o el parche usa `*** Add File:` (Codex).

En Codex, los hooks instalados deben revisarse desde `/hooks`. Cualquier cambio en `hooks.json` invalida la confianza anterior. El modificador de clase solo actúa sobre archivos PHP con namespace `FacturaScripts\\`.

## Linux, macOS y Windows

Los cuatro plugins funcionan en los tres sistemas. Las diferencias se resuelven así:

- **Hooks.** Todos son scripts de Python 3; no queda ninguno en bash. Cada hook declara dos comandos:
  - `command`: `sh "${CLAUDE_PLUGIN_ROOT}/scripts/run-python.sh" "${CLAUDE_PLUGIN_ROOT}/scripts/<script>.py"`. Claude Code lo ejecuta con `sh -c` en Linux y macOS y con Git Bash en Windows, con `${CLAUDE_PLUGIN_ROOT}` sustituida con barras `/`. Codex lo ejecuta con `$SHELL -lc` en Linux y macOS. `run-python.sh` elige `python3` o `python` en Linux y macOS, y `py -3`, `python` o `python3` en Windows: allí `python3` suele ser el alias de la Microsoft Store, que no ejecuta nada si Python no se ha instalado desde la tienda.
  - `commandWindows`: `py -3 "<ruta>\scripts\<script>.py" || python "<ruta>\scripts\<script>.py"`. Es un campo de Codex, que en Windows lo usa en lugar de `command` y lo ejecuta con `cmd.exe /C`, sustituyendo `${CLAUDE_PLUGIN_ROOT}` por la ruta nativa con barras invertidas. Claude Code lo ignora y `claude plugin validate --strict` lo acepta. Como los scripts salen siempre con 0, el `||` solo prueba `python` cuando `py` no existe.
- **Requisitos en Windows.** Python 3 (de python.org, que instala el lanzador `py`, o de la Microsoft Store). Claude Code necesita además Git for Windows: sin Git Bash ejecuta los hooks con PowerShell, que no entiende `command`. Codex no necesita Git Bash.
- **Codificación.** En Windows, Python usa la página de códigos local (cp1252) en las tuberías. Los scripts fuerzan UTF-8 en stdin, stdout y stderr y al leer la salida de los subprocesos, para que el JSON de los hooks y los acentos lleguen intactos.
- **Rutas.** Los avisos de los hooks muestran las rutas relativas con `/` en todos los sistemas. El contexto de `SessionStart` da las rutas de la documentación en el formato nativo.
- **Capturas de la documentación.** `doc-screenshots.py` habla con Chrome por la tubería de DevTools (`--remote-debugging-pipe`) en Linux y macOS. En Windows, donde Python no puede pasar los descriptores 3 y 4 al proceso hijo, usa un WebSocket local en 127.0.0.1 (`--remote-debugging-port=0`). También localiza Chrome, Chromium y Edge en sus carpetas de Windows.
- **Tokenizador de PHP.** `doc-only-guard.py` pasa a PHP rutas de archivos temporales en lugar de código con `-r`, porque en Windows `php` suele ser un lanzador `.cmd` o `.bat` que estropea los argumentos con saltos de línea y comillas.
- **Servidores MCP.** Se lanzan con `node` y el lanzador portable de `plugin.json`, igual en los tres sistemas. En Windows, la subida de archivos de fs-mcp bloquea también las carpetas de Windows y de `ProgramData`, y acepta la carpeta temporal del sistema aunque esté dentro de `AppData`.
- **Permisos y enlaces.** Los permisos 0600 y 0700 del archivo de conexiones y de la carpeta temporal de fs-forja solo existen en Linux y macOS; en Windows el archivo queda protegido por los permisos del perfil del usuario. Crear enlaces simbólicos exige en Windows el modo de desarrollador, así que las pruebas que los necesitan se omiten si no se pueden crear.
- **Antivirus.** Windows Defender impide leer los archivos que parecen una webshell. `check-security.py` declara en `limitaciones` cualquier archivo que no puede leer y lo cuenta en `sin_analizar`. Los ejemplos de `fs-dev/tests/test_check_security.py` escapan con `\xNN` una letra de cada palabra sensible para que Defender no marque el archivo de pruebas. Los archivos temporales que esas pruebas escriben sí los bloquea, y esas pruebas se omiten en ese equipo.

## Idioma de las respuestas

El hook `UserPromptSubmit` de `fs-dev` lee `settings.language` de `~/.fs-ai.json` (español por defecto) y devuelve el aviso en `hookSpecificOutput.additionalContext`, que ambos hosts añaden al contexto del modelo. No usa `matcher`, porque Codex lo ignora en este evento. Sale siempre con código 0: el código 2 bloquearía el mensaje del usuario en los dos hosts.

Al ser un hook del plugin, no se ejecuta en los proyectos que desactivan `fs-dev`. Una preferencia que deba aplicarse siempre corresponde a la configuración del usuario: el ajuste `language` de Claude Code, `~/.claude/CLAUDE.md` o `~/.codex/AGENTS.md`.

## Referencias y perfiles

Las referencias viven fuera de `agents/` para que ningún host las interprete como agentes:

- `fs-dev/references/docs/`: documentación técnica.
- `fs-dev/references/documentacion/`: guía de estilo y formato del escenario de capturas de `docs-writer`, y contenido de `Doc/Context` de `context-writer`. La
  sincronización de la documentación no la toca. Las capturas las hace `fs-dev/scripts/doc-screenshots.py` con Chrome
  sin interfaz, igual en los dos hosts, sin depender del navegador integrado de ninguno.
- `fs-user/references/docs/`: documentación para usuarios.
- `fs-user/references/projects/`: catálogo de extensiones.

Los agentes de Claude Code precargan la skill `docs-expert`. En Codex, cada skill especializada lee el mismo perfil Markdown y puede aplicarlo en el hilo principal o proporcionárselo a un subagente genérico.

Hay dos excepciones al patrón «perfil = skill del mismo nombre»:

- `docs-expert`: la skill contiene las instrucciones completas y el agente de Claude Code la precarga; la skill no lee el perfil.
- `compatibility-auditor`: su skill se llama `verificar-min-version`, que ejecuta los scripts y lee el perfil para interpretar el informe.

## Scripts y referencias desde skills y perfiles

Claude Code sustituye `${CLAUDE_PLUGIN_ROOT}` en el cuerpo de skills y agentes al cargarlos, pero la variable no existe en el entorno de los comandos que el modelo ejecuta con Bash, y un perfil abierto como archivo conserva el texto literal. Codex no sustituye la variable en ningún caso.

Por eso las skills y los perfiles indican las rutas de forma relativa al propio archivo: desde un `SKILL.md`, `../../scripts/` y `../../references/docs/`; desde un perfil de `agents/`, `../scripts/` y `../references/docs/`. `${CLAUDE_PLUGIN_ROOT}` solo se cita como equivalente en Claude Code. El comando que se ejecuta lleva la ruta absoluta ya resuelta y entre comillas.

## Modelos de los perfiles

Claude Code aplica el campo `model` del frontmatter de cada agente. Codex no carga los agentes Markdown, su manifiesto de plugin no admite agentes y ni el frontmatter de `SKILL.md` ni `agents/openai.yaml` permiten fijar un modelo. Por eso cada skill de perfil indica, para cuando delega en un subagente, el modelo y el esfuerzo de razonamiento equivalentes. Codex documenta que el modelo puede pedirse en la propia delegación. Si la skill aplica el perfil en el hilo principal, se usa el modelo de la sesión.

| `model` en Claude Code | Modelo solicitado en Codex | Esfuerzo de razonamiento |
|---|---|---|
| `haiku` | `gpt-6-luna` | `high` |
| `sonnet` | `gpt-6.1-sol` | Predeterminado del cliente |
| `opus` | `gpt-6.1-sol` | `high` |

Fuentes: <https://learn.chatgpt.com/docs/agent-configuration/subagents> y <https://learn.chatgpt.com/docs/models>, consultadas en octubre de 2026. Si OpenAI retira o renombra estos modelos, actualiza esta tabla y las skills que los citan (`rg "gpt-6" fs-dev/skills fs-user/skills`). Quien quiera fijar el modelo de forma permanente puede definir sus propios agentes TOML en `~/.codex/agents/`; esa configuración es del usuario y el plugin no la instala.

## Recarga durante desarrollo local

- Claude Code: ejecuta `/reload-plugins` o reinicia la sesión.
- Codex: reinstala el plugin desde el marketplace local cuando cambie su versión y abre un hilo nuevo.
- Codex hooks: revisa y autoriza de nuevo la definición desde `/hooks`.
- MCP: abre una sesión nueva o reinicia el host para reiniciar el proceso del servidor.

El archivo compartido entre Claude Code y Codex es `~/.fs-ai.json`. Por retrocompatibilidad, si no existe y sí existe el antiguo `~/.fs-claude.json`, los scripts, las skills y los servidores MCP usan el antiguo.

Los lanzadores MCP de fs-mcp y fs-forja usan `CLAUDE_PLUGIN_ROOT` cuando Claude Code la exporta y, en su ausencia, el directorio de trabajo que Codex resuelve respecto a la raíz instalada del plugin. Esto evita rutas absolutas y permite distribuir el mismo manifiesto en ambos hosts.
