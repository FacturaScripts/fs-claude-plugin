---
id: 636
permalink: loadfromdata-673
title: $modelo-&gt;loadFromData()
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/loadfromdata-673
---
El método `loadFromData()` de un modelo asigna los valores de un array proporcionado al objeto.

### Parámetros
- **Primer parámetro (requerido):** Un array clave/valor que contiene el nombre de la columna y su correspondiente valor a asignar.
- **Segundo parámetro (opcional):** Un array que incluye los nombres de las columnas que se desean excluir del primer parámetro.

### Ejemplo de uso
```php
$familia = new Familia();
var_dump($familia-&gt;codfamilia); // Devuelve NULL

$familia-&gt;loadFromData([&#39;codfamilia&#39; =&gt; &#39;1234&#39;, &#39;descripcion&#39; =&gt; &#39;Descripción 1234&#39;]);
var_dump($familia-&gt;codfamilia); // Devuelve 1234
```

### Ejemplo de exclusión de columnas
```php
$familia = new Familia();
$familia-&gt;codfamilia = &#39;123&#39;;
$familia-&gt;descripcion = &#39;Familia 123&#39;;

$familia-&gt;loadFromData([&#39;codfamilia&#39; =&gt; &#39;666&#39;, &#39;descripcion&#39; =&gt; &#39;Familia 666&#39;], [&#39;descripcion&#39;]);
var_dump($familia-&gt;codfamilia); // Devuelve 666
var_dump($familia-&gt;descripcion); // Devuelve Familia 123
```
