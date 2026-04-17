---
id: 670
permalink: el-archivo-init-php-307
title: El archivo Init.php en FacturaScripts
creationdate: 25-06-2018 00:00:00
lastmod: 18-08-2025
url: https://facturascripts.com/el-archivo-init-php-307
---
El archivo **Init.php** es fundamental para el funcionamiento avanzado de los plugins en FacturaScripts. Este archivo permite definir procesos y acciones que se ejecutan automáticamente en distintos momentos del ciclo de vida del plugin, como la carga de la aplicación, instalación, actualización o desinstalación.

## Ubicación del archivo

Debes colocar el archivo **Init.php** en la raíz del directorio de tu plugin.

## Estructura y métodos principales

La clase `Init` debe extender de `InitClass`, y proporciona tres métodos clave:

- **init()**: Se ejecuta cada vez que se carga FacturaScripts (con el plugin activo). Utilízalo para cargar [extensiones de modelos](https://facturascripts.com/publication/extensiones-de-modelos-305), [extensiones de controladores](https://facturascripts.com/publication/extensiones-de-controladores-304), iniciar workers u otras funciones de inicialización.
- **uninstall()**: Se invoca tras la desinstalación del plugin. En este método puedes realizar tareas de limpieza como eliminar datos, archivos asociados o modificar configuraciones.
- **update()**: Se ejecuta tanto en la instalación como la actualización del plugin, permitiendo aplicar cambios en la estructura de datos o configuraciones necesarias para la nueva versión.

## Ejemplo básico de Init.php

```php
&lt;?php

namespace FacturaScripts\Plugins\MyNewPlugin;

use FacturaScripts\Core\Template\InitClass;

class Init extends InitClass
{
    public function init(): void
    {
        // Código que se ejecuta al cargar FacturaScripts si el plugin está activado
    }

    public function uninstall(): void
    {
        // Limpieza de datos o configuraciones al desinstalar el plugin
    }

    public function update(): void
    {
        // Ajustes al instalar o actualizar el plugin
    }
}
```

## Cómo usar Composer en un plugin

Si tu plugin va a utilizar librerías externas gestionadas con Composer, añade la siguiente línea justo después de declarar el namespace en Init.php. Esto asegura que se carguen automáticamente las dependencias definidas:

```php
require_once __DIR__ . &#39;/vendor/autoload.php&#39;;
```

&gt; **Nota:** Antes, ejecuta `composer init` o `composer install` dentro del directorio del plugin para generar el autoload correspondiente.

### Ejemplo ampliado con Composer:

```php
&lt;?php

namespace FacturaScripts\Plugins\MyNewPlugin;

use FacturaScripts\Core\Template\InitClass;

require_once __DIR__ . &#39;/vendor/autoload.php&#39;;

class Init extends InitClass
{
    // Lógica de integración de tu plugin...
}
```

#### Consideraciones sobre `composer.json`

FacturaScripts está basado en **PHP 8.0**. Para asegurar la compatibilidad, debes indicar la versión de PHP en tu archivo `composer.json`:

```json
&quot;config&quot;: {
   &quot;platform&quot;: {
      &quot;php&quot;: &quot;8.0&quot;
   }
}
```
