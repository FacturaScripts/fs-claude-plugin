---
id: 707
permalink: migrar-los-modelos-924
title: Guía para Migrar Modelos de FacturaScripts 2017 a 2018
creationdate: 27-05-2018 00:00:00
lastmod: 19-03-2025
url: https://facturascripts.com/migrar-los-modelos-924
---
Desde FacturaScripts 2018, hemos adoptado [espacios de nombres, autoloading y notación CamelCase](https://facturascripts.com/publicaciones/antes-de-empezar-a-programar-580). Por ello, es necesario renombrar tus modelos siguiendo estas nuevas pautas: **la primera letra del nombre en mayúscula y sin guiones bajos.**

## Procedimiento de Renombrado

### Ejemplo Antes de la Migración

```php
&lt;?php

class my_model extends fs_model
{
    ...
}
```

### Ejemplo Después de la Migración

```php
&lt;?php
namespace FacturaScripts\Plugins\NOMBRE_PLUGIN\Model;

use FacturaScripts\Core\Model\Base;

class MyModel extends Base\ModelClass
{
    use Base\ModelTrait;
}
```

## Funciones Obligatorias

Los modelos ahora requieren conocer el nombre de la tabla y de la clave primaria. Debes implementar las funciones [tableName()](https://facturascripts.com/publicaciones/tablename-298) y [primaryColumn()](https://facturascripts.com/publicaciones/primarycolumnvalue-328).

```php
public static function primaryColumn()
{
    // Sustituye &#39;id&#39; por el nombre de la columna que es la clave primaria
    return &#39;id&#39;;
}

public static function tableName()
{
    // Sustituye &#39;my_table&#39; por el nombre de la tabla
    return &#39;my_table&#39;;
}
```

### Eliminación del Constructor

En versiones anteriores, existía un constructor extenso:

```php
public function __construct($data = false)
{
    parent::__construct(&#39;my_table&#39;);
    if ($data) {
        $this-&gt;id = $this-&gt;intval($data[&#39;id&#39;]);
        ...
    } else {
        $this-&gt;id = null;
        ...
    }
}
```

Ahora, la función [loadFromData()](https://facturascripts.com/publicaciones/loadfromdata-673) sustituye la parte &#39;if&#39; y [clear()](https://facturascripts.com/publicaciones/clear-396) reemplaza el &#39;else&#39;. Implementa &#39;clear()&#39; si necesitas **valores por defecto:**

```php
public function clear()
{
    parent::clear();
    $this-&gt;fecha = Tools::date();
    $this-&gt;hora = Tools::hour();
}
```

## Simplificación del Código

FacturaScripts 2018 facilita un desarrollo más rápido y eficiente. Elimina funciones que ya están implementadas por defecto, tales como:
- `construct()`
- `get()` y derivados
- `exists()`
- `save()`
- `delete()`
- `test()`
- `all()` y derivados
- `url()`

Consulta más acerca de [operaciones comunes con modelos](https://facturascripts.com/publicaciones/operaciones-comunes-con-modelos-666) en nuestra documentación.

### Uso de la Clase Tools

Las funciones `no_html()` y `random_string()` ahora residen en `Core\Tools`. Añade el `use` adecuado y llama a las funciones con la sintaxis:

```php
// Coloca debajo del namespace
use FacturaScripts\Core\Tools;
...
public function test()
{
    $this-&gt;random = Tools::randomString(99);
    $this-&gt;observaciones = Tools::noHtml($this-&gt;observaciones);
}
```
