---
id: 1707
permalink: dbquery
title: DbQuery
creationdate: 01-03-2024 18:21:30
lastmod: 26-01-2026
url: https://facturascripts.com/dbquery
---
La clase **DbQuery** de FacturaScripts permite realizar una amplia variedad de consultas a la base de datos de manera sencilla.

## Seleccionar una tabla
Para hacer consultas sobre una tabla, debemos llamar al método `table()` de la clase **DbQuery**. Por ejemplo, para obtener todos los registros de la tabla de familias, podemos ejecutar:

```php
use FacturaScripts\Core\DbQuery;

$familias = DbQuery::table(&#39;familias&#39;)-&gt;get();
```

Con la función `get()` obtenemos todos los registros y columnas. Si solo queremos algunas columnas, podemos especificarlo con el método `select()`, separando los diferentes nombres de columna por comas:

```php
$descripciones_familias = DbQuery::table(&#39;familias&#39;)-&gt;select(&#39;codfamilia, descripcion&#39;)-&gt;get();
```

### Filtrar los resultados
Es posible aplicar filtros a la consulta. Por ejemplo, para obtener todos los productos de la familia `123`, podemos usar:

```php
// con whereEq aplicamos un filtro de columna = valor
$productos = DbQuery::table(&#39;productos&#39;)-&gt;whereEq(&#39;codfamilia&#39;, &#39;123&#39;)-&gt;get();

// también podemos usar un array Where
$productos = DbQuery::table(&#39;productos&#39;)-&gt;where([Where:eq(&#39;codfamilia&#39;, &#39;123&#39;)])-&gt;get();

// o con un filtro dinámico
$productos = DbQuery::table(&#39;productos&#39;)-&gt;whereCodfamilia(&#39;123&#39;)-&gt;get();
```

La clase soporta filtros directos como `whereBetween()`, `whereEq()`, `whereGt()`, `whereGte()`, `whereIn()`, `whereLike()`, `whereLt()`, `whereLte()`, `whereNotEq()`, `whereNotIn()`, `whereNotNull()` y `whereNull()`. También se puede utilizar un array [Where](https://facturascripts.com/publicaciones/where) para filtros más complejos.

Para mayor comodidad, se pueden aplicar filtros dinámicos usando `where` seguido del nombre de la columna:

```php
// where codfamilia = &#39;123&#39;
$productos = DbQuery::table(&#39;productos&#39;)-&gt;whereCodfamilia(&#39;123&#39;)-&gt;get();

// where codimpuesto = &#39;IVA21&#39;
$productos = DbQuery::table(&#39;productos&#39;)-&gt;whereCodimpuesto(&#39;IVA21&#39;)-&gt;get();
```

### Ordenar los resultados
Para ordenar los resultados, se pueden utilizar las funciones `orderBy()` y `orderMulti()`:

```php
// obtenemos los productos ordenados por precio y stock
$productos = DbQuery::table(&#39;productos&#39;)
	-&gt;orderBy(&#39;precio&#39;, &#39;ASC&#39;)
	-&gt;orderBy(&#39;stockfis&#39;, &#39;ASC&#39;)
	-&gt;get();

// lo mismo, pero con orderMulti()
$productos = DbQuery::table(&#39;productos&#39;)
	-&gt;orderMulti([&#39;precio&#39; =&gt; &#39;ASC&#39;, &#39;stockfis&#39; =&gt; &#39;ASC&#39;])
	-&gt;get();
```

Las llamadas a `orderBy()` y `orderMulti()` añaden esos parámetros a la consulta, es decir, no reemplazan el orden previo. Si deseamos limpiar o quitar el orden anterior, debemos usar la función `reorder()`.

### Obtener el primer resultado
Para obtener solamente el primer resultado de la consulta, utilizamos el método `first()`:

```php
$primera = DbQuery::table(&#39;familias&#39;)-&gt;first();
```

### Obtener el número de registros
Usamos el método `count()` para obtener el número total de registros en la tabla:

```php
$count = DbQuery::table(&#39;familias&#39;)-&gt;count();
```

Si necesitamos el número de valores distintos de una columna, por ejemplo, saber a cuántos países distintos hemos vendido material, podemos hacerlo de varias formas:

```php
// opción 1
$numero = DbQuery::table(&#39;facturascli&#39;)-&gt;count(&#39;codpais&#39;);

// opción 2
$numero = DbQuery::table(&#39;facturascli&#39;)-&gt;selectRaw(&#39;DISTINCT codpais&#39;)-&gt;count();

// opción 3
$data = DbQuery::table(&#39;facturascli&#39;)-&gt;selectRaw(&#39;COUNT(DISTINCT codpais) as c&#39;)-&gt;first();
$numero = $data[&#39;c&#39;];
```

### Obtener máximo, mínimo, media, suma...
Podemos realizar operaciones sobre los resultados, como obtener el valor máximo, el mínimo, la media o la suma:

```php
// el máximo precio de los productos
$max = DbQuery::table(&#39;productos&#39;)-&gt;max(&#39;precio&#39;);

// el mínimo precio de los productos
$min = DbQuery::table(&#39;productos&#39;)-&gt;min(&#39;precio&#39;);

// el precio medio de los productos
$avg = DbQuery::table(&#39;productos&#39;)-&gt;avg(&#39;precio&#39;);

// la suma de todos los precios de los productos
$sum = DbQuery::table(&#39;productos&#39;)-&gt;sum(&#39;precio&#39;);
```

Podemos aplicar filtros a los resultados antes de llamar a la función:

```php
// el máximo precio de los productos de la familia 123
$max = DbQuery::table(&#39;productos&#39;)-&gt;whereEq(&#39;codfamilia&#39;, &#39;123&#39;)-&gt;max(&#39;precio&#39;);
```

### Insertar registros en la tabla
Para añadir registros a una tabla, utilizamos el método `insert()`:

```php
// creamos el producto 777
DbQuery::table(&#39;productos&#39;)-&gt;insert([
	&#39;referencia&#39; =&gt; &#39;777&#39;,
	&#39;descripcion&#39; =&gt; &#39;Producto 777&#39;,
	&#39;precio&#39; =&gt; 7.77
]);
```

El método `insert()` permite insertar múltiples registros a la vez:

```php
// creamos los productos 888 y 999
DbQuery::table(&#39;productos&#39;)-&gt;insert([
	[&#39;referencia&#39; =&gt; &#39;888&#39;, &#39;descripcion&#39; =&gt; &#39;Producto 888&#39;, &#39;precio&#39; =&gt; 8.88],
	[&#39;referencia&#39; =&gt; &#39;999&#39;, &#39;descripcion&#39; =&gt; &#39;Producto 999&#39;, &#39;precio&#39; =&gt; 9.99],
]);
```

### Actualizar registros en la tabla
Podemos actualizar un registro combinando los métodos `whereEq()` y `update()`:

```php
// actualizamos el precio y stock del producto 777
DbQuery::table(&#39;productos&#39;)
	-&gt;whereEq(&#39;referencia&#39;, &#39;777&#39;)
	-&gt;update([
		&#39;precio&#39; =&gt; 8,
		&#39;stockfis&#39; =&gt; 11,
	]);
```

Si no aplicamos ningún filtro `where`, los cambios se aplicarán a toda la tabla. Por ejemplo, para marcar todos los productos como públicos:

```php
// marcamos todos los productos como públicos
DbQuery::table(&#39;productos&#39;)
	-&gt;update([
		&#39;publico&#39; =&gt; true,
	]);
```

### Eliminar registros de la tabla
Al combinar los métodos `whereEq()` y `delete()`, podemos eliminar un registro específico:

```php
// eliminamos el producto 777
DbQuery::table(&#39;productos&#39;)
	-&gt;whereEq(&#39;referencia&#39;, &#39;777&#39;)
	-&gt;delete();
```

También podemos eliminar todos los registros de una tabla omitiendo el filtro `where`:

```php
// eliminamos todos los productos
DbQuery::table(&#39;productos&#39;)-&gt;delete();
```
