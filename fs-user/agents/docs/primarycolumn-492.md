---
id: 639
permalink: primarycolumn-492
title: Método primaryColumn() del modelo
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/primarycolumn-492
---
El método **primaryColumn()** del modelo devuelve el nombre de la columna que actúa como clave primaria en la tabla. Esta función, junto con [el método tableName()](https://facturascripts.com/publicaciones/tablename-298), es fundamental para la correcta implementación de un modelo en FacturaScripts.

```php
public static function primaryColumn(): string
{
    // Reemplace &#39;id&#39; con el nombre de la columna que es la clave primaria
    return &#39;id&#39;;
}
```

Es importante recordar que además debe existir un archivo XML con el mismo nombre que la tabla en la carpeta `Table` del plugin. Este archivo contiene [la definición de la estructura de la tabla](https://facturascripts.com/publicaciones/la-definicion-de-la-estructura-de-la-tabla-514).
