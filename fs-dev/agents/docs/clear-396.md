---
id: 622
permalink: clear-396
title: Método clear() de los modelos
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/publicaciones/clear-396
---

El método **clear()** &#39;limpia&#39; las propiedades del modelo y asigna valores por defecto. **Se ejecuta automáticamente en el constructor del modelo**, lo que significa que cada vez que se crea una nueva instancia de un modelo utilizando `new`, también se ejecuta `clear()` para asignar los valores predeterminados.

## Comportamiento predeterminado

Por defecto, este método **asigna el valor `null` a todas las propiedades del modelo**, salvo que no permita valor `null` en la columna, entonces asigna el valor `default` de la columna en la tabla. Recuerda que [el XML de la tabla](https://facturascripts.com/publicaciones/la-definicion-de-la-estructura-de-la-tabla-514) es el que determina las columnas, tipos, etc.

## Personalización en el modelo
Podemos sobrescribir el método `clear()` en nuestro modelo para asignar otros valores. Por ejemplo, si tenemos una propiedad llamada `creation_date`, podemos asignar la fecha y hora actual en este método:

```php
public function clear(): void
{
    parent::clear();
    $this-&gt;creation_date = Tools::dateTime();
}
```

## Otros usos

Este método también se puede utilizar para crear varios registros utilizando un mismo objeto. **Ejemplo**:

```php
// Creamos un nuevo producto
$product = new Producto();
$product-&gt;referencia = $product-&gt;descripcion = &#39;test&#39;;
$product-&gt;save();

// Ahora utilizamos clear() para usar el mismo objeto y crear un nuevo producto
$product-&gt;clear();
$product-&gt;referencia = $product-&gt;descripcion = &#39;test2&#39;;
$product-&gt;save();
```

En este ejemplo, hemos creado dos productos utilizando el mismo objeto. Aunque la utilidad de este enfoque puede ser limitada, es importante conocer sus posibilidades.

## ⚠️ load(), loadWhere() ...
Los métodos para leer un registro de la base de datos, **si no encuentran el registro**, llaman internamente al método `clear()` para volver a dejarlo limpio.
