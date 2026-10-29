---
name: crear-plugin
description: Crea la estructura completa de un nuevo plugin para FacturaScripts con todos los archivos necesarios.
---

# Skill: Crear Plugin FacturaScripts

Cuando el usuario pida crear un nuevo plugin para FacturaScripts, sigue estos pasos:

## Atajo con fsmaker

Antes de crear los archivos a mano, considera usar la herramienta CLI:

```bash
fsmaker plugin
```

fsmaker solicita el nombre, descripción y versión mínima, y genera toda la estructura de carpetas y archivos automáticamente. Las versiones con el comando `docs` incluyen también la estructura de documentación; si la instalada no lo tiene (`fsmaker list`), complétala después con el Paso 5. Los pasos siguientes explican la estructura y el contenido en detalle para cuando necesites crearlos o modificarlos manualmente.

## Paso 1: Obtener información del plugin

Pregunta al usuario:
- **Nombre del plugin** (sin espacios, empieza por mayúscula. Ej: `MiPlugin`)
- **Descripción** breve
- **Versión mínima de FacturaScripts** (por defecto: 2025, que es el mínimo admitido; súbela si el plugin usa API más reciente, por ejemplo la frecuencia programada del cron de la 2026.7)

## Paso 2: Crear la estructura de carpetas

Crea la siguiente estructura en `Plugins/NombrePlugin/`:

```
Plugins/NombrePlugin/
├── Assets/
│   ├── CSS/
│   ├── Images/
│   └── JS/
├── Doc/
│   ├── User/
│   ├── Dev/
│   ├── Context/
│   │   └── README.md
│   ├── Assets/
│   └── forja.json
├── Controller/
├── Extension/
│   ├── Controller/
│   ├── Model/
│   └── View/
├── Model/
├── Table/
├── Translation/
├── View/
├── XMLView/
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── facturascripts.ini
└── Init.php
```

Las carpetas vacías llevan un `.gitkeep` para que git las suba.

## Paso 3: Crear facturascripts.ini

```ini
name = 'NombrePlugin'
description = 'Descripción del plugin'
version = 1
min_version = 2025
```

Reglas (`el-archivo-facturascripts-ini-37.md`):

- `name` debe coincidir exactamente con el nombre de la carpeta, incluidas mayúsculas y minúsculas.
- `version` es un número entero o decimal (`1`, `1.5`); no se admite `1.0.1` ni `1.0-beta`.
- `min_version` debe ser 2025 o superior; si es menor, el plugin no se puede activar.
- Campos opcionales: `min_php` (decimal, p. ej. `8.2`), `require` (plugins necesarios, separados por comas), `require_php` (extensiones de PHP, p. ej. `'soap,imap'`) y `compatible` (solo informativo para facturascripts.com).

## Paso 4: Crear Init.php

```php
<?php

namespace FacturaScripts\Plugins\NombrePlugin;

use FacturaScripts\Core\Template\InitClass;

class Init extends InitClass
{
    /** Se ejecuta en cada carga de FacturaScripts con el plugin activo. */
    public function init(): void
    {
        // Cargar extensiones, workers, rutas...
        // $this->loadExtension(new Extension\Model\Cliente());
    }

    /** Se ejecuta al desactivar el plugin. */
    public function uninstall(): void
    {
        // Limpieza opcional de datos o configuración
    }

    /** Se ejecuta al activar el plugin y al actualizarlo si está activo (instalarlo sin activar no lo ejecuta). */
    public function update(): void
    {
        // Migraciones de datos, datos iniciales, ajustes de configuración...
    }
}
```

Los tres métodos son abstractos en `InitClass` y deben existir aunque estén vacíos (`el-archivo-init-php-307.md`).

## Paso 5: Crear la estructura de documentación

Crea `Doc/`, `AGENTS.md`, `CLAUDE.md` y el `.gitignore` siguiendo la skill `fs-dev:crear-documentacion`: su script los
crea en un solo paso sin sobrescribir nada. Después escribe en la primera frase de `AGENTS.md` qué hace el plugin, a
partir de la descripción del Paso 1.

## Reglas importantes

- El nombre del plugin no puede empezar por número ni contener espacios.
- El namespace siempre es `FacturaScripts\Plugins\NombrePlugin`, y cada clase lleva el namespace de su carpeta.
- Nunca modifiques archivos de `Core/` ni `Dinamic/`.
- Activa el plugin desde Administrador → Plugins tras crearlo; el botón **Reconstruir** limpia la caché y regenera `Dinamic/`.


## Para más información

Consulta la skill `fs-dev:docs-expert` y, en `../../references/docs/`, los documentos `creacion-de-plugins-210.md`, `el-archivo-facturascripts-ini-37.md` y `el-archivo-init-php-307.md`.
