---
name: fsmaker
description: Explica y usa la herramienta CLI fsmaker para generar automáticamente la estructura base de plugins, modelos, controladores, extensiones, tests y otros archivos de FacturaScripts.
---

# Skill: fsmaker — Generador de Código para FacturaScripts

`fsmaker` es una herramienta de línea de comandos (CLI) que genera automáticamente los archivos con la estructura base necesaria para desarrollar plugins en FacturaScripts. Evita escribir código repetitivo a mano y garantiza que los archivos siguen las convenciones del framework.

## Versión actual

```bash
fsmaker --version
# fsmaker 2.2.0
```

## Listado de comandos

```bash
fsmaker
# o
fsmaker list
```

| Comando | Descripción |
|---------|-------------|
| `plugin` | Crea la estructura básica de un nuevo plugin |
| `model` | Crea un nuevo modelo con su tabla XML |
| `controller` | Crea un nuevo controlador (Controller, ListController o EditController) |
| `view` | Crea una vista Twig en la carpeta View |
| `extension` | Crea una extensión de tabla, modelo, controlador, XMLView o vista |
| `init` | Crea un archivo Init.php para el plugin |
| `cron` | Crea un archivo Cron.php para el plugin |
| `cronjob` | Crea un nuevo CronJob y lo registra en Cron.php |
| `worker` | Crea un nuevo Worker y lo registra en Init.php |
| `migration` | Crea una nueva migración |
| `mod` | Crea un mod para Modelos (Calculator, HTML Header, Line, Footer) |
| `api` | Genera automáticamente endpoints API REST para los modelos |
| `test` | Crea un nuevo test para el plugin |
| `run-tests` | Ejecuta los tests de FacturaScripts |
| `translations` | Actualiza los archivos de traducción |
| `upgrade` | Actualiza archivos PHP, XML, Twig e INI del plugin |
| `upgrade-bs5` | Actualiza las vistas XML de Bootstrap 4 a Bootstrap 5 |
| `github-action` | Crea un archivo de GitHub Action para testing |
| `gitignore` | Crea un archivo .gitignore para FacturaScripts |
| `agent-ai` | Copia los archivos de configuración de IA para Claude Code |
| `zip` | Genera un archivo ZIP del plugin actual |

---

## Uso básico: crear un plugin completo

Desde la carpeta raíz de FacturaScripts o dentro del directorio `Plugins/`:

```bash
fsmaker plugin
```

fsmaker hace preguntas interactivas (nombre, descripción, versión mínima) y genera toda la estructura de carpetas y archivos (`facturascripts.ini`, `Init.php`, etc.).

---

## Comandos más usados en el desarrollo

### Crear modelo + tabla XML
```bash
fsmaker model
```
Genera `Model/NombreModelo.php` y `Table/nombre_tabla.xml` con la estructura base.

### Crear controlador
```bash
fsmaker controller
```
Genera el controlador del tipo elegido (Controller, ListController, EditController) y su XMLView asociado.

### Crear vista Twig
```bash
fsmaker view
```
Genera un archivo `.html.twig` en `View/` con la plantilla base.

### Crear extensión
```bash
fsmaker extension
```
Genera una extensión de modelo, controlador, XMLView, tabla o vista para modificar clases existentes sin tocar su código fuente.

### Crear test
```bash
fsmaker test
```
Genera un archivo de test PHPUnit en `Test/` listo para ejecutar.

### Ejecutar tests
```bash
fsmaker run-tests
```
Lanza los tests del plugin con PHPUnit (equivalente a `vendor/bin/phpunit`).

### Crear CronJob
```bash
fsmaker cronjob
```
Genera la clase del job y lo registra automáticamente en `Cron.php`.

### Crear Worker
```bash
fsmaker worker
```
Genera la clase Worker y la registra en `Init.php`.

### Crear migración
```bash
fsmaker migration
```
Genera el archivo de migración para cambios estructurales en tablas.

### Generar endpoints API REST
```bash
fsmaker api
```
Genera automáticamente los endpoints REST para los modelos del plugin.

### Actualizar traducciones
```bash
fsmaker translations
```
Actualiza o sincroniza los archivos JSON de traducción en `Translation/`.

### Actualizar plugin (upgrade)
```bash
fsmaker upgrade
```
Actualiza archivos PHP, XML, Twig e INI para adaptarlos a versiones más recientes del framework.

### Empaquetar plugin como ZIP
```bash
fsmaker zip
```
Genera un archivo ZIP del plugin listo para distribuir.

---

## Cuándo usar fsmaker vs. crear los archivos a mano

| Situación | Recomendación |
|-----------|---------------|
| Estructura inicial de un plugin nuevo | Usar `fsmaker plugin` |
| Nuevo modelo con tabla | Usar `fsmaker model` — evita errores en el XML |
| Controlador con XMLView | Usar `fsmaker controller` — genera los dos archivos |
| Test nuevo | Usar `fsmaker test` — preconfigura el namespace y clase |
| Añadir columnas/lógica al modelo generado | Editar manualmente el archivo generado |
| Extensiones complejas | `fsmaker extension` genera la base; completar a mano |

---

## Notas importantes

- fsmaker debe ejecutarse desde la **raíz del plugin** o desde la raíz de FacturaScripts según el comando.
- Los archivos generados son **plantillas base** — siempre hay que revisarlos y adaptarlos a la lógica real del plugin.
- `fsmaker agent-ai` instala o actualiza los archivos de configuración de Claude Code para el proyecto.

## Documentación relacionada de skills

- `.claude/skills/crear-plugin.md` — estructura completa de un plugin
- `.claude/skills/crear-modelo.md` — modelos y tablas XML
- `.claude/skills/crear-controlador.md` — controladores y XMLViews
- `.claude/skills/crear-extension.md` — extensiones de modelos/controladores/vistas
- `.claude/skills/depurar-y-testear.md` — tests y depuración
