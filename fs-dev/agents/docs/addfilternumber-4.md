---
id: 677
permalink: addfilternumber-4
title: addFilterNumber()
creationdate: 01-05-2018 00:00:00
lastmod: 25-03-2025
url: https://facturascripts.com/addfilternumber-4
---
La función **addFilterNumber()** añade un filtro de tipo **numérico** a la pestaña del **ListController**. Gracias a este método, es posible filtrar los resultados aplicando un filtro sobre el campo especificado.

## Parámetros

- **viewName**: Nombre identificador de la pestaña donde se aplicará el filtro.
- **key**: Identificador del filtro, generalmente el nombre del campo a filtrar.
- **label**: Etiqueta que se mostrará en el filtro. **Esta será traducida**.
- **field**: Campo del modelo sobre el que se aplicará el filtro.
- **operation** (opcional): Operación de comparación a aplicar. Por defecto es `&gt;=`.

![cómo se ve el filtro](https://i.imgur.com/JRUhHn3.gif)

## Uso en ListController

### Ejemplo básico

A continuación, un ejemplo para filtrar registros en el que el total es mayor o igual que un valor especificado:

```php
// Añadir filtro: total mayor o igual
$this-&gt;addFilterNumber($viewName, &#39;total-gt&#39;, &#39;amount&#39;, &#39;total&#39;, &#39;&gt;=&#39;);
```

### Ejemplo con selección de pestaña

Se puede seleccionar inicialmente la pestaña utilizando el método `listView()`:

```php
// Seleccionar la pestaña y añadir un filtro
$this-&gt;listView($viewName)-&gt;addFilterNumber(&#39;total-gt&#39;, &#39;amount&#39;, &#39;total&#39;, &#39;&gt;=&#39;);
```

### Ejemplo encadenado

Es posible encadenar múltiples filtros en la misma vista:

```php
// Encadenar filtros para total mayor y total menor
$this-&gt;listView($viewName)
    -&gt;addFilterNumber(&#39;total-gt&#39;, &#39;amount&#39;, &#39;total&#39;, &#39;&gt;=&#39;)
    -&gt;addFilterNumber(&#39;total-lt&#39;, &#39;amount&#39;, &#39;total&#39;, &#39;&lt;&#39;);
```

## Uso en EditController

Se puede utilizar la función dentro de un EditController para agregar filtros tanto para valores mayores o iguales como para menores o iguales:

```php
// Añadir filtros en un EditController
$this-&gt;listView($viewName)
    -&gt;addFilterNumber(&#39;total-gt&#39;, &#39;amount&#39;, &#39;total&#39;, &#39;&gt;=&#39;)
    -&gt;addFilterNumber(&#39;total-lt&#39;, &#39;amount&#39;, &#39;total&#39;, &#39;&lt;=&#39;);
```

Con estos ejemplos se ilustra cómo utilizar la función addFilterNumber() para filtrar listados numéricos de forma sencilla y flexible dentro de FacturaScripts.
