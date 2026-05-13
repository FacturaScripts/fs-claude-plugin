# fs-dev — Plugin para desarrolladores de FacturaScripts

Plugin para [Claude Code](https://claude.ai/code) orientado a desarrolladores que crean o mantienen plugins de FacturaScripts. Proporciona skills especializadas, agentes de IA y automatizaciones para todas las tareas del ciclo de desarrollo.

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
| `fs-dev:fsmaker` | Usa la herramienta CLI `fsmaker` para generar estructuras automáticamente |

### Git y colaboración

| Skill | Descripción |
|---|---|
| `fs-dev:skill-commit` | Buenas prácticas para commits claros, atómicos y bien descritos |
| `fs-dev:skill-pull-request` | Crea pull requests bien estructurados con resumen y plan de pruebas |

---

## Agentes especializados

Los agentes son instancias de Claude con contexto específico de FacturaScripts. Se activan automáticamente desde las skills o puedes invocarlos directamente desde el chat.

| Agente | Modelo | Rol |
|---|---|---|
| `fs-dev:api-designer` | Opus | Diseño de endpoints REST y API personalizada |
| `fs-dev:backend-developer` | Opus | Desarrollo backend: modelos, BD, Workers, Cron |
| `fs-dev:docs-expert` | Haiku | Documentación oficial y preguntas de programación |
| `fs-dev:document-expert` | Opus | Documentos de compra y venta (presupuestos, facturas, albaranes, pedidos) |
| `fs-dev:extension-developer` | Opus | Creación de extensiones para el Core o plugins externos |
| `fs-dev:frontend-developer` | Opus | Capa frontend, plantillas Twig, JavaScript y CSS |
| `fs-dev:fullstack-developer` | Opus | Funcionalidades completas end-to-end |
| `fs-dev:php-expert` | Opus | PHP idiomático y patrones de calidad para FacturaScripts |
| `fs-dev:sql-expert` | Opus | Base de datos, optimización SQL y migraciones |
| `fs-dev:testing-expert` | Sonnet | Tests, PHPUnit, PHPStan y control de calidad |
| `fs-dev:ui-designer` | Opus | Diseño de interfaces XMLView |

---

## Detección automática de contexto

El plugin detecta automáticamente si el directorio de trabajo es un proyecto de FacturaScripts y activa el contexto de desarrollo correspondiente. Esto ocurre en dos momentos:

- **Al iniciar la sesión** — se analiza el directorio de trabajo actual.
- **Al cambiar de directorio** — si navegas a una carpeta de FacturaScripts, el contexto se actualiza.

Cuando se detecta un proyecto, las skills y agentes tienen acceso al contexto completo del framework para dar respuestas más precisas.

---

## Scripts automáticos

El plugin ejecuta dos scripts automáticamente tras cada escritura o edición de archivos PHP:

### Actualización de copyright

Actualiza el año en las cabeceras de copyright de los archivos PHP, XML y Twig que hayas modificado. El formato estándar de FacturaScripts es:

```php
 * This file is part of FacturaScripts
 * Copyright (C) 2013-2025 Carlos Garcia Gomez <carlos@facturascripts.com>
```

El script detecta el año actual y actualiza el rango si es necesario, sin modificar el resto de la cabecera.

### Ordenación de miembros de clase

Ordena automáticamente los miembros de las clases PHP según el estándar de FacturaScripts:

1. Constantes públicas
2. Constantes protegidas
3. Constantes privadas
4. Propiedades públicas (estáticas primero)
5. Propiedades protegidas
6. Propiedades privadas
7. Constructor
8. Métodos públicos (estáticos primero, luego alfabético)
9. Métodos protegidos
10. Métodos privados

Esto garantiza que el código siempre siga el mismo orden, facilitando la revisión y la consistencia entre plugins.
