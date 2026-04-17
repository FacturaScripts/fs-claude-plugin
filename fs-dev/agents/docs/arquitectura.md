# Arquitectura y Estructura de FacturaScripts

## Estructura de carpetas

```
facturascripts/
├── Core/
│   ├── Assets/             # CSS, JS, fuentes, imágenes
│   ├── Base/               # DataBase, MiniLog, Utils...
│   │   └── DataBase/       # Engines MySQL/PostgreSQL, DataBaseWhere
│   ├── Contract/           # Interfaces
│   ├── Controller/         # Controladores core (EditXxx, ListXxx...)
│   ├── Data/               # XMLs estructura de tablas
│   ├── DataSrc/            # Fuentes de datos en caché
│   ├── Html/               # Plantillas Twig
│   ├── Lib/
│   │   ├── API/            # API REST
│   │   ├── Accounting/     # Contabilidad
│   │   ├── AjaxForms/      # Calculadora de documentos
│   │   ├── Email/          # NewMail
│   │   ├── Export/         # PDF, Excel
│   │   ├── ExtendedController/  # ListController, EditController, PanelController
│   │   ├── ListFilter/     # Filtros para ListController
│   │   ├── PDF/
│   │   └── Widget/         # Widgets de XMLView
│   ├── Model/
│   │   └── Base/           # ModelClass, BusinessDocument...
│   ├── Migrations.php
│   └── Kernel.php
├── Dinamic/                # Generado automáticamente, nunca editar
├── Plugins/MiPlugin/
│   ├── Assets/
│   ├── Controller/
│   ├── Data/               # XMLs tablas adicionales
│   ├── Extension/          # Extensiones del core
│   ├── Html/
│   ├── Lib/
│   ├── Model/
│   ├── Translation/        # JSON de traducciones
│   ├── XMLView/
│   ├── facturascripts.ini
│   ├── Init.php
│   └── Cron.php
├── Test/
└── vendor/
```

## Patrón MVC

- **Modelos** (`Core/Model/`) — tablas de la base de datos
- **Controladores** (`Core/Controller/`) — lógica de negocio y peticiones HTTP
- **Vistas** (`Core/Html/` + `XMLView/`) — Twig + XML de vistas

## Sistema Dinamic

`Dinamic/` es una copia generada del core que permite a los plugins extender clases sin tocar el código fuente. Se regenera automáticamente al instalar/desinstalar plugins.

## Autoloading PSR-4

```
FacturaScripts\Core\     → Core/
FacturaScripts\Dinamic\  → Dinamic/
FacturaScripts\Plugins\  → Plugins/
FacturaScripts\Test\     → Test/
```

## Controladores extendidos

- **ListController** — Listados con filtros, búsqueda y paginación
- **EditController** — Formulario de edición de un registro
- **PanelController** — Combinación lista + edición

## XMLView

Las vistas se definen en XML (`.xml`): columnas, widgets, filtros y acciones. El sistema genera el HTML automáticamente.

## Sistema de Extensiones

Los plugins extienden el core sin modificarlo desde `Extension/`:
- `Extension/Controller/` — controladores
- `Extension/Model/` — modelos
- `Extension/Lib/` — librerías
- `Extension/View/` — vistas XML
- `Extension/Html/` — vistas HTML

## facturascripts.ini (ejemplo)

```ini
name = MiPlugin
version = 1
description = Descripción del plugin
min_version = 2022.1
max_version = 9999
```

## Sistema de prioridades de plugins

Los archivos con el mismo nombre en `Dinamic/` se sobreescriben según la prioridad del plugin (mayor número = mayor prioridad).
