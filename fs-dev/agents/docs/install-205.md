---
id: 635
permalink: install-205
title: $modelo-&gt;install()
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/publicaciones/install-205
---

El método `install()` del modelo permite añadir registros por defecto a la tabla al momento de crearla.

En ocasiones hay tablas, como `paises`, que es necesario o muy recomendable inicializar con registros. Para estos casos existe el método `install()` en los modelos. Este método es llamado **cuando se crea la tabla** en la base de datos, únicamente en ese instante. Y debe devolver una sentencia SQL para insertar los valores necesarios en la tabla.

## Ejemplo
En este ejemplo de modelo `MiPais` añadimos varios registros cuando se crea la tabla. Para ello devolvemos el SQL necesario.

```
&lt;?php
namespace FacturaScripts\Plugins\TuPlugin\Model;

use FacturaScripts\Core\Model\Base\ModelClass;
use FacturaScripts\Core\Model\Base\ModelTrait;

class MiPais extends ModelClass
{
    use ModelTrait;

    public $id;
    public $name;

    public function install(): string
    {
        // devolvemos el SQL para insertar los registros predeterminados
        return &#39;INSERT into mis_paises (&#39;id&#39;,&#39;name&#39;) VALUES (&#39;1&#39;,&#39;España&#39;),(&#39;2&#39;,&#39;Portugal&#39;);&#39;;
    }

    public static function primaryColumn(): string
    {
        return &#39;id&#39;;
    }

    public static function tableName(): string
    {
        return &#39;mis_paises&#39;;
    }
}
```

## Carpeta Data
En ocasiones queremos añadir tantos registros que es mejor cargarlos desde un archivo CSV. Por defecto, el método `install()` buscará en la **carpeta Data** un **archivo CSV** con el mismo **nombre que la tabla**. El orden de búsqueda es el siguiente:

1. Busca en la carpeta **Data/Codpais/** + nombre del **país** predeterminado en el **panel de control**.
2. Busca en la carpeta **Data/Lang/** + código del **idioma** predeterminado en el [config.php](https://facturascripts.com/publicaciones/el-archivo-config-php)
3. Busca en la carpeta **Data/Lang/ES**.

El primer archivo que encuentre con el nombre de la tabla es el que carga. No es necesario ningún cambio en el modelo.
