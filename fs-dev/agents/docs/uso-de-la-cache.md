---
id: 1580
permalink: uso-de-la-cache
title: Uso de la caché
creationdate: 04-10-2023 11:32:16
lastmod: 26-08-2025
url: https://facturascripts.com/publicaciones/uso-de-la-cache
---
La caché es un almacén de memoria temporal. En ella podemos almacenar la información que queramos para luego recuperarla. Usaremos una clave o identificador para aquello que queramos almacenar o leer. Por ejemplo, si queremos almacenar el número de familias, lo podríamos almacenar en la clave `num-familias`. Así luego podemos leer el valor de esa clave y obtener el valor que hemos almacenado.

No olvide añadir el correspondiente use de la clase.

```php
use FacturaScripts\Core\Cache;
```

FacturaScripts utiliza un sistema propio de caché en archivos, que se guardan en la carpeta `MyFiles/Tmp/FileCache`. No utilizamos memcached, ni ninguna otra implementación. Cada clave se guarda como un archivo, por lo que las barras `/` y `\` de las claves se convierten en `_`.

**Todas las entradas expiran a la hora**: no se puede indicar un tiempo de vida por clave. Si una entrada tiene más de una hora, `get()` la dará por caducada y devolverá el valor por defecto.

## 💾 Cache::set()
Con la función `set()` podemos almacenar un valor que queramos en una clave que indiquemos.

```php
Cache::set(&#39;mis-cosas&#39;, &#39;mi-valor&#39;); // almacenamos el valor &#39;mi-valor&#39; en la clave &#39;mis-cosas&#39;
```

## 📖 Cache::get()
Con la función `get()` podemos obtener el valor almacenado en la clave que indiquemos. Si la clave no existe o ha expirado, devuelve null, o el valor por defecto que indiquemos como segundo parámetro.

```php
echo Cache::get(&#39;mis-cosas&#39;); // esto imprime en pantalla &#39;mi-valor&#39;, que es lo que hemos almacenado antes

echo Cache::get(&#39;otra-clave&#39;, &#39;nada&#39;); // como la clave no existe, imprime &#39;nada&#39;
```

### cache() en twig
También podemos leer de caché desde plantillas twig. Para ello usaremos la función `cache()`, que es el equivalente a `Cache::get()`.

```twig
{{ cache(&#39;mis-cosas&#39;) }}
```

## 🔍 Cache::has()
Con la función `has()` podemos comprobar si existe una entrada vigente (no expirada) para una clave.

```php
if (Cache::has(&#39;mis-cosas&#39;)) {
    // hay valor en caché
}
```

## 🔄 Cache::remember()
En muchas ocasiones leeremos de caché y si no encontramos lo que queremos, entonces lo leemos de la base de datos y a continuación lo almacenamos en caché. Este proceso lo podemos simplificar con la función `remember()`, que hace precisamente eso: si el dato se encuentra en caché, lo devuelve y si no, almacena lo que le digamos y lo devuelve.

```php
$numFamilias = Cache::remember(&#39;num-familias&#39;, function () {
	$familia = new Familia();
	return $familia-&gt;count();
});
```

En este ejemplo estamos consultando en la caché el valor de la clave `num-familias`. Si no lo encuentra, entonces ejecutará el callback, que obtiene el número de familias y lo devuelve. La función remember se encargará de almacenarlo en caché.

Tenga en cuenta que `remember()` considera que null es ausencia de valor: si el callback devuelve null, no se cacheará y se volverá a ejecutar en cada llamada. No use esta función para cachear nulls intencionados.

## 🗑️ Cache::delete()
Para eliminar un valor de una clave podemos llamar a la función `delete()`.

```php
Cache::delete(&#39;mis-cosas&#39;);
```

### Cache::deleteMulti()
Si queremos eliminar múltiples claves a la vez, por ejemplo todas la claves que comiencen por `mis-`, podemos llamar a la función `deleteMulti()`.

```php
Cache::deleteMulti(&#39;mis-&#39;); // borra todas las claves que comiencen por &quot;mis-&quot;
```

### Cache::clear()
También podemos eliminar todo el contenido de caché con la función `clear()`.

```php
Cache::clear(); // eliminamos todo
```

## ⚡ Cache::withMemory()
La función `withMemory()` devuelve una variante de la caché que añade un nivel adicional en memoria. Es útil cuando se consulta la misma clave muchas veces dentro de la misma petición, para no leer del disco cada vez. Ofrece las mismas funciones (`get()`, `set()`, `remember()`, `delete()`...).

```php
$cache = Cache::withMemory();
foreach ($lineas as $linea) {
    $impuesto = $cache-&gt;remember(&#39;impuesto-&#39; . $linea-&gt;codimpuesto, function () use ($linea) {
        return $linea-&gt;getTax();
    });
}
```