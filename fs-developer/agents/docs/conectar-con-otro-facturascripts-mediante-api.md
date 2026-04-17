---
id: 2080
permalink: conectar-con-otro-facturascripts-mediante-api
title: Conectar con otro FacturaScripts mediante la API
creationdate: 21-03-2025 18:30:39
lastmod: 06-02-2026
url: https://facturascripts.com/conectar-con-otro-facturascripts-mediante-api
---
Si deseas que tu plugin se conecte a otra instalación de FacturaScripts, puedes utilizar el [Cliente HTTP](https://facturascripts.com/publicaciones/cliente-http) para [conectar a la API REST](https://facturascripts.com/publicaciones/la-api-rest-de-facturascripts-912) de la otra instalación.

## Pasos para conectar

1. Activa la API desde el **panel de control** de la otra instalación de FacturaScripts.
2. Crea una **clave de API**.
3. Utiliza el **Cliente HTTP** para establecer la conexión.

### Ejemplo: Obtener la lista de productos

En este ejemplo, obtenemos la lista de productos de la otra instalación de FacturaScripts mediante una consulta a la API:

```php
$products = Http::get(&#39;https://donde-este-el-otro-fs/api/3/productos&#39;)
    -&gt;setToken(&#39;tu-clave-de-api&#39;)
    -&gt;json();

foreach ($products as $row) {
    Tools::log()-&gt;notice(&#39;Producto &#39; . $row[&#39;referencia&#39;]);
}
```

Estamos consultando el endpoint de productos, recibiendo los resultados e imprimiendo la referencia de cada producto encontrado.

**Nota:** Por defecto, se reciben un máximo de 50 elementos. Si hay más de 50 productos, solo se recibirán los primeros 50. Para obtener más productos, debes [usar la paginación](https://facturascripts.com/publicaciones/obtener-un-listado-de-elementos-de-un-recurso-326#md_h1).

## Crear un producto

Para crear un producto mediante la API en la otra instalación de FacturaScripts, debemos hacer una petición POST:

```php
$response = Http::post(&#39;https://donde-este-el-otro-fs/api/3/productos&#39;, [
    &#39;referencia&#39; =&gt; &#39;nuevo-1234&#39;,
    &#39;descripcion&#39; =&gt; &#39;producto nuevo&#39;,
    &#39;precio&#39; =&gt; 11
])
-&gt;setToken(&#39;tu-clave-de-api&#39;)
-&gt;json();
```

Con esta petición estamos creando un producto con referencia `nuevo-1234`. Los datos completos del producto se reciben en la respuesta, en el objeto `$response`.
