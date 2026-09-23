# fs-dev — Plugin para desarrolladores de FacturaScripts

Plugin para Claude Code y Codex orientado a desarrolladores que crean o mantienen plugins de FacturaScripts. Proporciona skills especializadas, perfiles de IA, documentación técnica y automatizaciones para todas las tareas del ciclo de desarrollo.

## Índice

- [Skills disponibles](#skills-disponibles)
- [Agentes especializados](#agentes-especializados)
- [Detección automática de contexto](#detección-automática-de-contexto)
- [Scripts automáticos](#scripts-automáticos)

---

## Skills disponibles

Invoca cualquier skill escribiendo su nombre en el chat. Ejemplos: `/fs-dev:crear-plugin`, `/fs-dev:analizar-bug`.

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
| `fs-dev:api-designer` | Diseña y crea nuevos endpoints REST delegando al agente especializado |

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

---

## Agentes especializados

En Claude Code, estos archivos se cargan como agentes nativos. En Codex, las skills leen los mismos archivos como perfiles de especialidad y los aplican directamente o los entregan a un subagente genérico cuando procede.

| Agente | Modelo | Rol |
|---|---|---|
| `fs-dev:api-designer` | Opus | Diseño de endpoints REST y API personalizada |
| `fs-dev:backend-developer` | Opus | Desarrollo backend: modelos, BD, Workers, Cron |
| `fs-dev:compatibility-auditor` | Sonnet | Compatibilidad de un plugin con las versiones del core (`min_version`) y auditoría de seguridad |
| `fs-dev:docs-expert` | Haiku | Documentación oficial y preguntas de programación |
| `fs-dev:document-expert` | Opus | Documentos de compra y venta (presupuestos, facturas, albaranes, pedidos) |
| `fs-dev:extension-developer` | Sonnet | Creación de extensiones para el Core o plugins externos |
| `fs-dev:frontend-developer` | Sonnet | Capa frontend, plantillas Twig, JavaScript y CSS |
| `fs-dev:fullstack-developer` | Opus | Funcionalidades completas end-to-end |
| `fs-dev:php-expert` | Sonnet | PHP idiomático y patrones de calidad para FacturaScripts |
| `fs-dev:sql-expert` | Opus | Base de datos, optimización SQL y migraciones |
| `fs-dev:testing-expert` | Sonnet | Tests, PHPUnit, PHPStan y control de calidad |
| `fs-dev:ui-designer` | Sonnet | Diseño de interfaces XMLView |

---

## Detección automática de contexto

El plugin detecta automáticamente si el directorio de trabajo es un proyecto de FacturaScripts y activa el contexto de desarrollo correspondiente:

- **Al iniciar la sesión** — se analiza el directorio de trabajo actual.
- **Al cambiar de directorio en Claude Code** — el evento `CwdChanged` actualiza el contexto.

Codex no ofrece `CwdChanged`; si cambias el directorio de trabajo, abre un hilo nuevo para volver a ejecutar `SessionStart`.

Cuando se detecta un proyecto, las skills y agentes tienen acceso al contexto completo del framework para dar respuestas más precisas.

---

## Scripts automáticos

El plugin ejecuta un hook secuencial tras cada escritura o edición. Acepta `Write`/`Edit` de Claude Code y `apply_patch` de Codex, incluso cuando un parche modifica varios archivos.

### Actualización de copyright

Actualiza el año en las cabeceras de copyright de los archivos PHP, XML y Twig que hayas modificado. El formato estándar de FacturaScripts es:

```php
 * This file is part of FacturaScripts
 * Copyright (C) 2013-2025 Carlos Garcia Gomez <carlos@facturascripts.com>
```

El script detecta el año actual y actualiza el rango si es necesario, sin modificar el resto de la cabecera.

### Ordenación de miembros de clase

Ordena automáticamente los miembros de las clases PHP según el estándar de FacturaScripts:

1. Traits usados por la clase
2. Constantes
3. Propiedades públicas
4. Propiedades protegidas y privadas
5. Métodos abstractos
6. Métodos públicos
7. Métodos protegidos y privados

Cada grupo se ordena alfabéticamente. La transformación solo actúa sobre clases con namespace `FacturaScripts\\`.

Esto garantiza que el código siempre siga el mismo orden, facilitando la revisión y la consistencia entre plugins.

### Auditoría de `min_version`

`scripts/check-min-version.py` no es un hook: se ejecuta a petición, desde la skill `fs-dev:verificar-min-version` o a mano.

```bash
python3 fs-dev/scripts/check-min-version.py <ruta_plugin> [--core <ruta_core>] [--json]
```

Extrae del plugin las clases, llamadas estáticas, métodos, propiedades y puntos de extensión `pipe` del core, y comprueba en qué etiqueta de versión aparece cada uno (`git grep` con búsqueda por bisección sobre el repositorio del core). Con eso calcula el `min_version` real, avisa de los símbolos eliminados en versiones recientes y devuelve `0` si el plugin cumple, `1` si no y `2` si falta el clon del core.

Para no confundir el código del core con el ajeno, descarta los campos que el plugin declara en sus XML de tabla y los métodos de clases nativas de PHP, y atribuye a su origen los símbolos que aportan otros plugins instalados (prefiriendo los de `require`) o las librerías de `vendor/`. Un `pipe('X')` que no existe en el core y que nada del plugin invoca se señala aparte: esa extensión probablemente nunca llega a ejecutarse.

La ruta del core se busca en `--core`, la variable `FS_CORE_PATH`, la clave `settings.corePath` de `~/.fs-claude.json`, la raíz de la instalación cuando el plugin vive en `Plugins/` y, por último, el directorio actual.

### Auditoría de seguridad

`scripts/check-security.py` tampoco es un hook: la skill `fs-dev:verificar-min-version` lo ejecuta junto a la auditoría de `min_version`, y puede lanzarse a mano. No necesita el clon del core.

```bash
python3 fs-dev/scripts/check-security.py <ruta_plugin> [--json] [--min-severity alta|media|baja|info] [--include-tests] [--include-vendor]
```

Enumera lo que conviene conocer antes de confiar en un plugin: ejecución de comandos del sistema, código dinámico u ofuscado, conexiones de red salientes con su destino, scripts cargados desde terceros, lectura de credenciales o datos de la instalación, escritura de código o de la configuración del servidor, controladores sin autenticación, concesión de privilegios, credenciales escritas en el código y archivos que el servidor podría ejecutar fuera de FacturaScripts (por ejemplo, PHP dentro de `Assets/`). Señala como posible envío de datos los archivos que leen datos sensibles y abren una conexión, e inventaría los dominios externos que menciona el código.

Antes de buscar llamadas elimina comentarios y cadenas, de modo que un `exec` en un comentario, en un texto o como nombre de método no cuenta. Cada hallazgo indica su severidad y cuándo se ejecuta: al instalar (`Init::update()`), en cada petición (`Init::init()`), en cron, desde un controlador público o en el navegador. Los scripts que abortan fuera de `php-cli`, como el `Translation/updater.php` que genera fsmaker, se rebajan un nivel. `Test/` y `vendor/` se excluyen salvo que se pidan.

Ninguno de estos comportamientos está prohibido: el informe no decide si el plugin es malicioso. Devuelve `0` si no hay hallazgos de severidad media o alta, `1` si los hay y `2` si la ruta no es válida.

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
