---
id: 1580
permalink: uso-de-la-cache
title: Uso de la caché
creationdate: 04-10-2023 11:32:16
lastmod: 26-08-2025
url: https://facturascripts.com/uso-de-la-cache
---
La caché es un **almacén de memoria temporal**. En ella podemos almacenar la información que queramos para luego recuperarla. Usaremos una clave o identificador para aquello que queramos almacenar o leer. Por ejemplo, si queremos almacenar el número de familias, lo podríamos almacenar en la clave ``num-familias``. Así luego podemos leer el valor de esa clave y obtener el valor que hemos almacenado.

No olvide añadir el correspondiente use de la clase.

```
use FacturaScripts\Core\Cache;
```

FacturaScripts utiliza un sistema propio de caché en archivos, que se guardan en la carpeta **MyFiles/Tmp/FileCache**. No utilizamos memcached, ni ninguna otra implementación.

## Cache::set()
Con la función ``set()`` podemos almacenar un valor que queramos en una clave que indiquemos.

```
Cache::set(&#39;mis-cosas&#39;, &#39;mi-valor&#39;); // almacenamos el valor &#39;mi-valor&#39; en la clave &#39;mis-cosas&#39;
```

## Cache::get()
Con la función ``get()`` podemos obtener el valor almacenado en la clave que indiquemos.

```
echo Cache::get(&#39;mis-cosas&#39;); // esto imprime en pantalla &#39;mi-valor&#39;, que es lo que hemos almacenado antes
```

### cache() en twig
También podemos leer de caché desde plantillas twig. Para ello usaremos la función ``cache()``, que es el equivalente a ``Cache::get()``.

```
{{ cache(&#39;mis-cosas&#39;) }}
```

### Cache::remember()
En muchas ocasiones leeremos de caché y si no encontramos lo que queremos, entonces lo leemos de la base de datos y a continuación lo almacenamos en caché. Este proceso lo podemos simplificar con la función ``remember()``, que hace precisamente eso: si el dato se encuentra en caché, lo devuelve y si no, almacena lo que le digamos y lo devuelve.

```
$numFamilias = Cache::remember(&#39;num-familias&#39;, function () {
	$familia = new Familia();
	return $familia-&gt;count();
});
```

En este ejemplo estamos consultando en la caché el valor de la clave &#39;num-familias&#39;. Si no lo encuentra, entonces ejecutará el callback, que obtiene el número de familias y lo devuelve. La función remember se encargará de almacenarlo en caché.

## Cache::delete()
Para eliminar un valor de una clave podemos llamar a la función ``delete()``.

```
Cache::delete(&#39;mis-cosas&#39;);
```

### Cache::deleteMulti()
Si queremos eliminar múltiples claves a la vez, por ejemplo todas la claves que comiencen por &quot;mis-&quot;, podemos llamar a la función ``deleteMulti()``.

```
Cache::deleteMulti(&#39;min-&#39;); // borra todas las claves que comiencen por &quot;mis-&quot;
```

### Cache::clear()
También podemos eliminar todo el contenido de caché con la función ``clear()``.

```
Cache::clear(); // eliminamos todo
```
