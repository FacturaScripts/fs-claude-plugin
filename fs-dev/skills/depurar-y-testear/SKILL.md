---
name: depurar-y-testear
description: Guía para depurar, testear y verificar código en FacturaScripts usando el modo debug, los logs, las páginas de error y PHPUnit.
---

# Skill: Depurar y testear en FacturaScripts

La documentación de referencia está en [`../../references/docs/`](../../references/docs/), relativa a este archivo: `testeo-de-plugins.md`, `anadir-una-github-action-para-ejecutar-los-tests-unitarios.md`, `mostrar-mensajes-errores-y-alertas.md`, `gestion-de-errores.md`, `profundizando-en-el-core.md` y `test-625.md`. Sus ejemplos contienen entidades HTML (`&lt;`, `&#39;`…): decodifícalas antes de reutilizarlos.

## Activar el modo debug

Editar `config.php` en la raíz de FacturaScripts:

```php
define('FS_DEBUG', true);
```

Esto activa la barra de debug en la parte inferior derecha, con las consultas, los mensajes del log y los temporizadores del Kernel.

## Mostrar mensajes y errores

```php
use FacturaScripts\Core\Tools;

// mensajes que se muestran al usuario en la interfaz (canal master por defecto)
Tools::log()->notice('record-updated-correctly');
Tools::log()->warning('access-denied');
Tools::log()->error('record-save-error');

// error con parámetros de traducción
Tools::log()->error('field-value-too-long', ['%field%' => 'nombre']);

// otros niveles
Tools::log()->info('Mensaje informativo');
Tools::log()->critical('Error grave');
Tools::log()->debug('Solo visible en la barra de debug');

// canal propio: se guarda en el historial de logs
Tools::log('mi-plugin')->info('Acción completada');
```

Desde JavaScript, la función `setToast(mensaje, estilo, título, duración)` muestra un aviso en la vista.

## Ver logs

Los logs antiguos se consultan en **Administrador > Logs**:

- En el canal `master` solo se guardan los errores y los mensajes críticos.
- En los demás canales se guardan todos los mensajes salvo los de `debug()`; los días de retención se configuran en el Panel de control.

## Medir tiempos de ejecución

```php
use FacturaScripts\Core\Kernel;

Kernel::startTimer('mi-prueba');
// código a medir
$total = Kernel::stopTimer('mi-prueba'); // segundos
```

Con el modo debug activo, los temporizadores aparecen en la barra de debug.

## Páginas de error

Para detener la ejecución y mostrar una página de error se lanza una `KernelException` con el nombre de la página. Un plugin puede añadir las suyas en la carpeta `Error/`, heredando de `FacturaScripts\Core\Template\ErrorController`:

```php
use FacturaScripts\Core\KernelException;

throw new KernelException('AccessDenied', 'motivo');
```

## Reconstruir Dinamic

Cuando los cambios no se reflejan, pulsa el botón **Reconstruir** en **Administrador → Plugins**, o desactiva y activa el plugin.

## Tests unitarios con PHPUnit

### Estructura

Los tests van en la carpeta `Test/main/` del plugin, junto a un `install-plugins.txt` con los plugins a activar, separados por comas, incluido el propio:

```
MiPlugin/
└── Test/
    └── main/
        ├── install-plugins.txt     # MiPlugin (o MiPlugin,OtroPlugin)
        └── NombreModeloTest.php
```

Se pueden crear más carpetas dentro de `Test/`, cada una con su `install-plugins.txt`, para probar el plugin junto a otros.

### Crear un test

```bash
# desde la carpeta del plugin; fsmaker crea el archivo, no lo ejecuta
fsmaker test
```

Archivo `Test/main/NombreModeloTest.php`:

```php
<?php

namespace FacturaScripts\Test\Plugins;

use FacturaScripts\Dinamic\Model\NombreModelo;
use PHPUnit\Framework\TestCase;

final class NombreModeloTest extends TestCase
{
    public function testCrearRegistro(): void
    {
        $modelo = new NombreModelo();
        $modelo->name = 'Test';
        $this->assertTrue($modelo->save());
        $this->assertNotEmpty($modelo->id());

        // limpiar
        $this->assertTrue($modelo->delete());
    }

    public function testValidacion(): void
    {
        $modelo = new NombreModelo();
        $modelo->name = ''; // inválido si el test() del modelo lo exige
        $this->assertFalse($modelo->test());
        $this->assertFalse($modelo->save());
    }
}
```

El namespace es siempre `FacturaScripts\Test\Plugins`, el archivo termina en `Test.php` y los métodos de test son públicos y empiezan por `test`. La validación del modelo está en su método `test()`, que `save()` ejecuta antes de guardar.

### Ejecutar los tests

```bash
# desde la carpeta del plugin; el argumento es la ruta a FacturaScripts
fsmaker run-tests ../..
```

Sin la ruta, `fsmaker run-tests` se detiene. Para ejecutarlos manualmente, desde la raíz de FacturaScripts:

```bash
# 1. copiar los tests del plugin a Test/Plugins
cp -r Plugins/MiPlugin/Test/main Test/Plugins

# 2. instalar los plugins (una vez por cada plugin requerido)
php Test/install-plugins.php

# 3. ejecutar la suite de plugins
vendor/bin/phpunit -c phpunit-plugins.xml
```

`composer test` y `vendor/bin/phpunit` sin `-c phpunit-plugins.xml` ejecutan los tests **del core**, no los del plugin.

### GitHub Action

`fsmaker github-action` crea el workflow `.github/workflows/tests.yml`, que ejecuta los tests en cada push y pull request. El workflow de la documentación fija el runner en `ubuntu-26.04` para que un cambio de la imagen `ubuntu-latest` no rompa los tests sin revisarlo, y prueba PHP 8.1 a 8.4 con MySQL (MariaDB) y PostgreSQL.

## Verificar estilo de código

Los scripts `composer cs-check`, `composer cs-fix` y `composer phpstan` son del `composer.json` del core, y `phpstan` solo analiza `Core/`. Para un plugin, ejecuta los binarios sobre su carpeta desde la raíz de FacturaScripts:

```bash
vendor/bin/phpcs Plugins/MiPlugin      # verificar estilo
vendor/bin/phpcbf Plugins/MiPlugin     # corregir estilo
vendor/bin/phpstan analyse Plugins/MiPlugin
```

## Errores comunes y soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| Clase no encontrada | Namespace incorrecto | Verificar que el namespace coincide con la ruta del archivo |
| Vista no carga | XMLView con nombre incorrecto | El nombre del XMLView debe coincidir exactamente con el viewName |
| Tabla no creada | XML de tabla con errores | Verificar la sintaxis del XML en `Table/` y reconstruir |
| Cambios sin efecto | Dinamic sin regenerar | Pulsar Reconstruir en Administrador → Plugins |
| Extensión no se aplica | No cargada en Init.php | Añadir `$this->loadExtension(...)` en `Init::init()` |
| Los tests no encuentran el plugin | Falta `install-plugins.txt` o no incluye el plugin | Crear el archivo en `Test/main/` con el nombre del plugin |

## Para más información

Consulta la skill `fs-dev:testing-expert` para escribir y revisar tests en profundidad, y la skill `fs-dev:docs-expert` para responder a partir de la documentación oficial incluida en el plugin.
