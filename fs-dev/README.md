# fs-dev — Plugin para desarrolladores de FacturaScripts

Plugin para Claude Code y Codex orientado a desarrolladores que crean o mantienen plugins de FacturaScripts. Proporciona skills especializadas, perfiles de IA, documentación técnica y automatizaciones para todas las tareas del ciclo de desarrollo.

## Índice

- [Skills disponibles](#skills-disponibles)
- [Agentes especializados](#agentes-especializados)
- [Detección automática de contexto](#detección-automática-de-contexto)
- [Scripts automáticos](#scripts-automáticos)

---

## Skills disponibles

Las skills se activan solas cuando la petición encaja con su descripción. Para invocarlas explícitamente:

- **Claude Code**: escribe `/` seguido de su nombre, por ejemplo `/fs-dev:crear-plugin` o `/fs-dev:analizar-bug`.
- **Codex**: elígela en el selector de `/skills` o menciónala en el mensaje escribiendo `$` seguido de su nombre.

### Creación de estructura

| Skill | Descripción |
|---|---|
| `fs-dev:crear-plugin` | Crea la estructura completa de un nuevo plugin con todos los archivos necesarios |
| `fs-dev:crear-modelo` | Crea un modelo PHP con su clase y archivo XML de tabla |
| `fs-dev:crear-controlador` | Crea controladores (ListController, EditController, PanelController) con su vista asociada |
| `fs-dev:crear-extension` | Crea extensiones para modificar modelos o controladores sin tocar el código fuente |
| `fs-dev:crear-xmlview` | Crea o modifica XMLViews: columnas, widgets, filtros y acciones |
| `fs-dev:crear-html-twig` | Crea y extiende vistas Twig con herencia del Core o de otros plugins |

### Desarrollo backend

| Skill | Descripción |
|---|---|
| `fs-dev:backend-developer` | Desarrollo de modelos, lógica de negocio, operaciones de BD, Workers y Cron |
| `fs-dev:php-expert` | Código PHP idiomático y de calidad: patrones PHP 8.0+, PSR-12, uso correcto de la clase Tools |
| `fs-dev:sql-expert` | Consultas SQL con DbQuery y Where, índices, migraciones, MySQL/PostgreSQL |
| `fs-dev:extension-developer` | Creación de extensiones para el Core o plugins externos mediante Closures |
| `fs-dev:document-expert` | Trabaja con documentos de compra/venta: presupuestos, pedidos, albaranes, facturas |
| `fs-dev:migraciones` | Crea y registra migraciones para cambios en datos de la BD que se ejecutan una sola vez |
| `fs-dev:workers` | Explica y crea la cola de trabajos en segundo plano mediante eventos |
| `fs-dev:cron` | Explica y crea tareas periódicas mediante `Cron.php` y `CronClass` |
| `fs-dev:mods` | Crea mods para modificar documentos de compra/venta visualmente (cabecera y líneas) |

### Desarrollo frontend

| Skill | Descripción |
|---|---|
| `fs-dev:frontend-developer` | Desarrollo de plantillas Twig, JavaScript, CSS/SCSS e integración con Bootstrap 5 |
| `fs-dev:ui-designer` | Diseño de interfaces: XMLViews con columnas, widgets, filtros, filas de estado y acciones |

### Desarrollo completo

| Skill | Descripción |
|---|---|
| `fs-dev:fullstack-developer` | Desarrollo completo end-to-end: modelo + tabla + controlador + vista + extensiones + Init.php |
| `fs-dev:api-rest` | Explica la API REST, autenticación por token y cómo añadir endpoints personalizados |
| `fs-dev:api-designer` | Diseña y crea nuevos endpoints REST con el perfil especializado (agente nativo en Claude Code; perfil aplicado directamente en Codex) |

### Documentación y análisis

| Skill | Descripción |
|---|---|
| `fs-dev:docs-expert` | Responde preguntas de programación consultando la documentación oficial de FacturaScripts |
| `fs-dev:analizar-bug` | Analiza y corrige bugs en plugins: comportamiento incorrecto, errores inesperados, datos incorrectos |
| `fs-dev:testing-expert` | Tests PHPUnit, PHPStan, CS-Check, depuración y control de calidad |
| `fs-dev:depurar-y-testear` | Guía para depurar con modo debug (FS_DEBUG), logs con Tools::log() y PHPUnit |
| `fs-dev:verificar-min-version` | Audita un plugin: si cumple el `min_version` de su `facturascripts.ini` y qué comportamientos sensibles para la seguridad tiene |
| `fs-dev:fsmaker` | Usa la herramienta CLI `fsmaker` para generar estructuras automáticamente |

### Git y colaboración

| Skill | Descripción |
|---|---|
| `fs-dev:skill-commit` | Buenas prácticas para commits claros, atómicos y bien descritos |
| `fs-dev:skill-pull-request` | Crea pull requests bien estructurados con resumen y plan de pruebas |
| `fs-dev:skill-notice` | Redacta en el chat un changelog o noticia de cambios a partir de un rango de commits o versiones |

---

## Agentes especializados

En Claude Code, estos archivos se cargan como agentes nativos y las skills de perfil (`api-designer`, `testing-expert`, etc.) delegan en ellos. En Codex, las skills leen los mismos archivos como perfiles de especialidad y los aplican directamente o los entregan a un subagente genérico cuando procede.

| Agente | Modelo en Claude Code | Modelo en Codex al delegar | Rol |
|---|---|---|---|
| `fs-dev:api-designer` | Opus | `gpt-6.1-sol` (esfuerzo `high`) | Diseño de endpoints REST y API personalizada |
| `fs-dev:backend-developer` | Opus | `gpt-6.1-sol` (esfuerzo `high`) | Desarrollo backend: modelos, BD, Workers, Cron |
| `fs-dev:compatibility-auditor` | Sonnet | `gpt-6.1-sol` | Compatibilidad de un plugin con las versiones del core (`min_version`) y auditoría de seguridad |
| `fs-dev:docs-expert` | Haiku | No aplica: la skill se usa directamente | Documentación oficial y preguntas de programación |
| `fs-dev:document-expert` | Opus | `gpt-6.1-sol` (esfuerzo `high`) | Documentos de compra y venta (presupuestos, facturas, albaranes, pedidos) |
| `fs-dev:extension-developer` | Sonnet | `gpt-6.1-sol` | Creación de extensiones para el Core o plugins externos |
| `fs-dev:frontend-developer` | Sonnet | `gpt-6.1-sol` | Capa frontend, plantillas Twig, JavaScript y CSS |
| `fs-dev:fullstack-developer` | Opus | `gpt-6.1-sol` (esfuerzo `high`) | Funcionalidades completas end-to-end |
| `fs-dev:php-expert` | Sonnet | `gpt-6.1-sol` | PHP idiomático y patrones de calidad para FacturaScripts |
| `fs-dev:sql-expert` | Opus | `gpt-6.1-sol` (esfuerzo `high`) | Base de datos, optimización SQL y migraciones |
| `fs-dev:testing-expert` | Sonnet | `gpt-6.1-sol` | Tests, PHPUnit, PHPStan y control de calidad |
| `fs-dev:ui-designer` | Sonnet | `gpt-6.1-sol` | Diseño de interfaces XMLView |

---

## Detección automática de contexto

Al iniciar la sesión (`SessionStart`), el plugin comprueba si el directorio de trabajo está dentro de una instalación de FacturaScripts (la raíz del core o un plugin bajo `Plugins/`) y, si es así, añade el contexto de desarrollo correspondiente. Un repositorio de plugin situado fuera de una instalación no se detecta.

La detección solo se hace al iniciar la sesión, en ambos hosts. Si cambias de directorio durante la sesión, abre una sesión nueva en Claude Code o un hilo nuevo en Codex para volver a detectarlo. El evento `CwdChanged` de Claude Code no se usa porque su salida no se añade al contexto del modelo.

Cuando se detecta un proyecto, las skills y agentes tienen acceso al contexto completo del framework para dar respuestas más precisas.

---

## Scripts automáticos

El plugin ejecuta un hook `PostToolUse` secuencial tras cada escritura o edición: primero actualiza el copyright y después ordena la clase. Acepta `Write`/`Edit` de Claude Code y `apply_patch` de Codex (con `tool_input.command` como texto o como lista), incluso cuando un parche modifica varios archivos. Procesa archivos `.php`, `.xml` y `.twig`.

- **Nunca bloquea:** sale siempre con código 0 y deja los errores y avisos en stderr.
- **Avisa al modelo:** si modifica un archivo, devuelve `hookSpecificOutput.additionalContext` para que el modelo lo relea antes de volver a editarlo. Si no cambia nada, no escribe en stdout.
- **Respeta el formato:** conserva los finales de línea (LF o CRLF) y el BOM, y no modifica los archivos que no son UTF-8 válido.

### Actualización de copyright

Actualiza el año de la cabecera de copyright de los archivos modificados. El formato estándar de FacturaScripts es:

```php
 * This file is part of FacturaScripts
 * Copyright (C) 2013-2026 Carlos Garcia Gomez <carlos@facturascripts.com>
```

- Solo cambia la primera línea `Copyright (C)` del primer bloque de comentario (`/* */`, `<!-- -->` o `{# #}`), sin tocar otros autores ni cadenas del código.
- Amplía el rango hasta el año actual y admite variantes como `2023, Autor`, rangos con espacios, líneas sin autor o sin año y listas de años (amplía el último). Los años futuros no se tocan.
- Un archivo nuevo recibe solo el año actual: en Claude Code, cuando `Write` crea el archivo (`tool_response.type` es `create`); en Codex, con `*** Add File:`. Reescribir un archivo existente conserva su rango.

Solo actúa sobre archivos de FacturaScripts: los que declaran un namespace `FacturaScripts\\` o están dentro de un plugin (carpeta con `facturascripts.ini`) o de una instalación del core. Los archivos de otros proyectos, como Laravel o módulos de terceros, no se modifican aunque el plugin esté activo globalmente.

### Ordenación de miembros de clase

Ordena los miembros de las clases PHP según el estándar de FacturaScripts:

1. Traits usados por la clase
2. Constantes
3. Propiedades públicas
4. Propiedades protegidas y privadas
5. Métodos abstractos
6. Métodos públicos
7. Métodos protegidos y privados

Cada grupo se ordena alfabéticamente. La transformación solo actúa sobre clases con namespace `FacturaScripts\\` y es conservadora:

- Reconoce `final const`, constantes tipadas, `var` y `use A, B { … }`, y mantiene cada comentario junto a su miembro, incluidos los de la línea de `{` y los posteriores al último miembro.
- No reordena si encuentra algún miembro que no reconoce, y no toca los `enum` ni las clases anónimas.
- No escribe si el resultado no conserva exactamente los mismos caracteres visibles que el original.

### Auditoría de `min_version`

`scripts/check-min-version.py` no es un hook: se ejecuta a petición, desde la skill `fs-dev:verificar-min-version` o a mano.

```bash
python3 fs-dev/scripts/check-min-version.py <ruta_plugin> [--core <ruta_core>] [--json] [--include-tests] [--min-confidence alta|media|baja] [--plugins-dir <dir>] [--max-version <versión>] [--workers <n>]
```

- `--include-tests`: analiza también `Test/`, excluido por defecto.
- `--min-confidence`: descarta los símbolos de confianza inferior a la indicada.
- `--plugins-dir`: directorio `Plugins/` donde atribuir los símbolos de otros plugins y auditar los de `require`.
- `--max-version`: versión del core que el plugin debe soportar; incumple si usa algo retirado en ella o antes.
- `--workers`: consultas simultáneas a git (8 por defecto).

Extrae del plugin las clases (incluidos los `use` agrupados con llaves), llamadas estáticas (también con el nombre completo de la clase), métodos, propiedades y puntos de extensión `pipe` del core, y comprueba en qué etiqueta de versión aparece cada uno (`git grep` con búsqueda por bisección sobre el repositorio del core). Con eso calcula el `min_version` real, avisa de los símbolos eliminados en versiones recientes y devuelve `0` si el plugin cumple, `1` si no y `2` ante un error de configuración (la ruta no contiene `facturascripts.ini` o faltan el clon del core o git) o un error inesperado.

Para no confundir el código del core con el ajeno, descarta los campos que el plugin declara en sus XML de tabla y los métodos de clases nativas de PHP, y atribuye a su origen los símbolos que aportan otros plugins instalados (prefiriendo los de `require`) o las librerías de `vendor/`. Un `pipe('X')` que no existe en el core y que nada del plugin invoca se señala aparte: esa extensión probablemente nunca llega a ejecutarse.

La ruta del core se busca en `--core`, la variable `FS_CORE_PATH`, la clave `settings.corePath` (o su alias `settings.coreRepoPath`) de `~/.fs-claude.json`, la raíz de la instalación cuando el plugin vive en `Plugins/` y, por último, el directorio actual.

### Auditoría de seguridad

`scripts/check-security.py` tampoco es un hook: la skill `fs-dev:verificar-min-version` lo ejecuta junto a la auditoría de `min_version`, y puede lanzarse a mano. No necesita el clon del core.

```bash
python3 fs-dev/scripts/check-security.py <ruta_plugin> [--json] [--min-severity alta|media|baja|info] [--include-tests] [--include-vendor]
```

Enumera lo que conviene conocer antes de confiar en un plugin: ejecución de comandos del sistema, código dinámico u ofuscado, conexiones de red salientes con su destino, scripts cargados desde terceros, lectura de credenciales o datos de la instalación, escritura de código o de la configuración del servidor, controladores sin autenticación, concesión de privilegios, credenciales escritas en el código y archivos que el servidor podría ejecutar fuera de FacturaScripts (por ejemplo, PHP dentro de `Assets/`). Señala como posible envío de datos los archivos que leen datos sensibles y abren una conexión, e inventaría los dominios externos que menciona el código.

Antes de buscar llamadas elimina comentarios y cadenas, de modo que un `exec` en un comentario, en un texto o como nombre de método no cuenta. Cada hallazgo indica su severidad y cuándo se ejecuta: al instalar (`Init::update()`), en cada petición (`Init::init()`), en cron, desde un controlador público o en el navegador. Los scripts que abortan fuera de `php-cli`, como el `Translation/updater.php` que genera fsmaker, se rebajan un nivel. Los tests, a cualquier profundidad, y `vendor/` se excluyen salvo que se pidan.

Analiza también las extensiones PHP no estándar (`.phtml`, `.inc`, `.pht`, `.php3` a `.php8`): dentro de `Assets/`, cualquier PHP o ejecutable es de gravedad alta; fuera, esas extensiones son de gravedad baja. Señala además las llamadas dinámicas (`$var(`, callbacks con una función peligrosa literal) y los `include` construidos con `__DIR__` y una variable.

Ninguno de estos comportamientos está prohibido: el informe no decide si el plugin es malicioso. Devuelve `0` si no hay hallazgos de severidad media o alta, `1` si los hay y `2` si la ruta no es válida o se produce un error inesperado.

---

## Configuración personalizada (`~/.fs-claude.json`)

Puedes desactivar cualquiera de los dos scripts automáticos creando o editando el archivo `~/.fs-claude.json` en tu directorio home. Este archivo es compartido por todos los plugins de fs-claude y se encuentra en:

- **macOS / Linux**: `/Users/tu-usuario/.fs-claude.json`
- **Windows**: `C:\Users\tu-usuario\.fs-claude.json`

### Opciones disponibles

```json
{
  "settings": {
    "sortClassMembers": true,
    "updateCopyright": true
  }
}
```

| Variable | Tipo | Por defecto | Descripción |
|----------|------|-------------|-------------|
| `sortClassMembers` | boolean | `true` | Activa o desactiva la ordenación automática de miembros en clases PHP |
| `updateCopyright` | boolean | `true` | Activa o desactiva la actualización automática del año de copyright |

### Ejemplo: desactivar la ordenación de clases

```json
{
  "settings": {
    "sortClassMembers": false,
    "updateCopyright": true
  }
}
```

Si el archivo no existe, ambas transformaciones se ejecutan con su comportamiento por defecto (activadas). Los cambios de estas opciones surten efecto en la siguiente edición. Si cambia la definición del hook, Claude Code debe recargar el plugin y Codex debe revisar de nuevo el hook desde `/hooks` y abrir un hilo nuevo.
