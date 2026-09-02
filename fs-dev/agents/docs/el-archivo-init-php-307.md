---
id: 670
permalink: el-archivo-init-php-307
title: El archivo Init.php en FacturaScripts
creationdate: 25-06-2018 00:00:00
lastmod: 31-08-2026
url: https://facturascripts.com/publicaciones/el-archivo-init-php-307
---
El archivo `Init.php` es fundamental para el funcionamiento avanzado de los plugins en FacturaScripts. Este archivo permite definir procesos y acciones que se ejecutan automáticamente en distintos momentos del ciclo de vida del plugin, como la carga de la aplicación, activación, actualización o desactivación.

## 📂 Ubicación del archivo

Debes colocar el archivo `Init.php` en la raíz del directorio de tu plugin.

## 🧩 Estructura y métodos principales

La clase `Init` debe extender de `InitClass`, y proporciona tres métodos clave:

- `init()`: Se ejecuta cada vez que se carga FacturaScripts (con el plugin activo). Utilízalo para cargar [extensiones de modelos](https://facturascripts.com/publicaciones/extensiones-de-modelos), [extensiones de controladores](https://facturascripts.com/publicaciones/extensiones-de-controladores), iniciar workers u otras funciones de inicialización.
- `update()`: Se ejecuta al activar el plugin y al actualizarlo (si está activo), permitiendo aplicar cambios en la estructura de datos o configuraciones necesarias para la nueva versión. Ten en cuenta que instalar el plugin sin activarlo no ejecuta este método.
- `uninstall()`: Se invoca al desactivar el plugin. En este método puedes realizar tareas de limpieza como eliminar datos, archivos asociados o modificar configuraciones.

## 📋 Ejemplo básico de Init.php

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
        // Limpieza de datos o configuraciones al desactivar el plugin
    }

    public function update(): void
    {
        // Ajustes al activar o actualizar el plugin
    }
}
```

## 🧰 Utilidades de InitClass

Además, `InitClass` ofrece algunos métodos de ayuda para usar dentro de `init()` o `update()`:

- `loadExtension()`: Carga una [extensión de modelo](https://facturascripts.com/publicaciones/extensiones-de-modelos) o de [controlador](https://facturascripts.com/publicaciones/extensiones-de-controladores). Además de modelos y controladores concretos, admite clases base para extender varios a la vez: `BusinessDocument`, `SalesDocument`, `PurchaseDocument` (y sus líneas), o todos los controladores `EditController` o `ListController`.

```php
public function init(): void
{
    $this-&gt;loadExtension(new Extension\Model\Cliente());
}
```

- `updateTableData()`: Vuelca de nuevo en la tabla los datos del archivo CSV correspondiente de la carpeta `Data` del plugin. Útil en `update()` para refrescar datos predefinidos tras una actualización.

```php
public function update(): void
{
    $this-&gt;updateTableData(&#39;mi_tabla&#39;);
}
```

## 🔌 Otras llamadas habituales desde init()

Además de los métodos de `InitClass`, desde `init()` se suelen invocar métodos estáticos del core para registrar o ajustar comportamiento. Por ejemplo, `APIModel::excludeModel()` (disponible desde la **versión 2026.65**) oculta un modelo de la [API REST](https://facturascripts.com/publicaciones/listado-de-recursos-modelos-102), indicando el nombre de la clase sin namespace:

```php
public function init(): void
{
    APIModel::excludeModel(&#39;MiModeloInterno&#39;);
}
```

## 📦 Cómo usar Composer en un plugin

Si tu plugin va a utilizar librerías externas gestionadas con Composer, añade la siguiente línea justo después de declarar el namespace en `Init.php`. Esto asegura que se carguen automáticamente las dependencias definidas:

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

FacturaScripts requiere PHP 8.1 o superior. Para asegurar la compatibilidad, debes indicar la versión de PHP en tu archivo `composer.json`:

```json
&quot;config&quot;: {
   &quot;platform&quot;: {
      &quot;php&quot;: &quot;8.1&quot;
   }
}
```