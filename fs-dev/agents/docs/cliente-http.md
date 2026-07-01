---
id: 1602
permalink: cliente-http
title: Cliente HTTP de FacturaScripts
creationdate: 22-11-2023 12:43:22
lastmod: 02-06-2025
url: https://facturascripts.com/publicaciones/cliente-http
---
Tenemos un **cliente HTTP** que puedes utilizar para consultar APIs, descargar contenido, consultar otras webs, etc. Simplifica mucho el código en comparación con CURL.

## 🌍 Haciendo una consulta
En este ejemplo consultaremos nuestra web y almacenaremos el resultado (el html) en la variable $html.

```php
use FacturaScripts\Core\Http;

$html = Http::get(&#39;http://facturascripts.com&#39;)-&gt;body();
```

Si queremos añadir parámetros a la url, podemos pasarlos como array en el segundo parámetro:

```php
// equivale a consultar https://tu-api.com/recurso?dato1=valor1
$html = Http::get(&#39;https://tu-api.com/recurso&#39;, [&#39;dato1&#39; =&gt; &#39;valor1&#39;])-&gt;body();
```

### 📦 Procesar JSON
Si vamos a consultar una web que devuelve json, por ejemplo una API, podemos llamar directamente al método `json()` en lugar de a `body()`, esto hace que se procese el JSON devuelto.

```php
$json = Http::get(&#39;https://randomuser.me/api/&#39;)-&gt;json(false); // devuelve un objeto
$jsonArray = Http::get(&#39;https://randomuser.me/api/&#39;)-&gt;json(); // devuelve un array
```

### ✉️ Obtener las cabeceras
Podemos obtener todas las cabeceras con la función `headers()` o una concreta con la función `header()`.

```php
$request = Http::get(&#39;https://movie-quote-api.herokuapp.com/v1/quote/&#39;);

$headers = $request-&gt;headers(); // obtenemos todas las cabeceras

$total = $request-&gt;header(&#39;x-total&#39;); // obtenemos la cabecera &#39;x-total&#39;
```

### ⚠️ Control de errores
Tenemos una serie de funciones que podemos usar para comprobar si la petición ha devuelto errores o no, y cuales. Las funciones son `ok()`, `failed()`, `notFound()`, `errorMessage()` y `status()`.

```php
$request = Http::get(&#39;https://randomuser.me/api/&#39;);

if ($request-&gt;ok()) {
	// la respuesta es correcta, podemos consultar los datos con body()
	echo $request-&gt;body();
}

if ($request-&gt;failed()) {
	// la respuesta no es correcta, podemos consultar el error con errorMessage()
	echo $request-&gt;errorMessage();
	
	// también el código de error
	echo $request-&gt;status();
}

if ($request-&gt;notFound()) {
	// la respuesta no es correcta, ha devuelto código 404
}
```

### ⬇️ Descargar archivos
Si deseas no solo consultar una url, sino almacenar la respuesta en un archivo, es decir, descargar ese archivo a disco. Puedes usar la función `saveAs()`, que devuelve true si se descarga correctamente (código 200).

```php
Http::get(&#39;https://facturascripts.com/PluginInfoList&#39;)
	-&gt;saveAs(&#39;lista.json&#39;); // devuelve true si se descarga correctamente
```

En este caso se guarda en el archivo lista.json de la carpeta de FacturaScripts.

### ⏱️ Establecer timeout
Podemos establecer un tiempo máximo de ejecución con la función `setTimeout()`. Si no se indica, el timeout por defecto es de 30 segundos.

```php
$json = Http::get(&#39;https://randomuser.me/api/&#39;)
	-&gt;setTimeout(10)
	-&gt;json();
```

### ➕ Añadir cabeceras
Podemos añadir una cabecera a la petición con la función `setHeader()`. Para añadir varias, basta con encadenar las llamadas:

```php
$json = Http::get(&#39;https://tu-api.com/recurso&#39;)
	-&gt;setHeader(&#39;mi-cabecera-1&#39;, &#39;mi-valor-1&#39;)
	-&gt;setHeader(&#39;mi-cabecera-2&#39;, &#39;mi-valor-2&#39;)
	-&gt;json();
```

También existe la función `setHeaders()`, pero hay que tener en cuenta que sustituye por completo todas las cabeceras de la petición, y que espera cada entrada ya formateada como `&#39;Clave&#39; =&gt; &#39;Clave: Valor&#39;`. Para el uso normal, utiliza `setHeader()`.

### 🔑 Añadir token
Podemos añadir un token en la cabecera de la petición con el método `setToken()`.

```php
$json = Http::get(&#39;https://facturascripts.com/api/3/&#39;)
	-&gt;setToken(&#39;mi-token&#39;)
	-&gt;json();

// esto sería equivalente
$json = Http::get(&#39;https://facturascripts.com/api/3/&#39;)
	-&gt;setHeader(&#39;Token&#39;, &#39;mi-token&#39;)
	-&gt;json();
```

Para enviar una cabecera de tipo `Authorization: Bearer` podemos usar el método `setBearerToken()`.

```php
$json = Http::get(&#39;https://api.openai.com/v1/chat/completions&#39;)
	-&gt;setBearerToken(&#39;mi-bearer-token&#39;)
	-&gt;json();

// esto sería equivalente
$json = Http::get(&#39;https://api.openai.com/v1/chat/completions&#39;)
	-&gt;setHeader(&#39;Authorization&#39;, &#39;Bearer mi-bearer-token&#39;)
	-&gt;json();
```

### 👤 Establecer usuario y contraseña
Si queremos usar un usuario y contraseña, podemos usar la función `setUser()`.

```php
$json = Http::get(&#39;https://tu-web-con-user.com/servicio&#39;)
	-&gt;setUser(&#39;mi-usuario&#39;, &#39;mi-contraseña&#39;)
	-&gt;json();
```

### 📨 Hacer una petición post
Podemos hacer una petición POST, es decir, enviar datos como si fuese un formulario, llamando a la función post en lugar de a get.

```php
// enviamos los datos como un formulario
$json = Http::post(&#39;https://tu-api.com/recurso&#39;, [
		&#39;dato1&#39; =&gt; &#39;valor1&#39;,
		&#39;dato2&#39; =&gt; &#39;valor2&#39;
	])
	-&gt;json(); // recibimos como json y lo convertimos en array asociativo
```

Si queremos enviar los datos en formato json, podemos usar el método `postJson()`, que convierte el array de datos a json y lo envía con la cabecera correspondiente:

```php
// enviamos los datos en formato json
$json = Http::postJson(&#39;https://tu-api.com/recurso&#39;, [
		&#39;dato1&#39; =&gt; &#39;valor1&#39;,
		&#39;dato2&#39; =&gt; &#39;valor2&#39;
	])
	-&gt;json(); // recibimos como json y lo convertimos en array asociativo
```

También tenemos disponibles las funciones `put()`, `patch()` y `delete()` para hacer las correspondientes peticiones.

### 📎 Enviar archivos
Para enviar archivos por formulario podemos procesarlos previamente con `CURLFile`:

```php
// enviamos un archivo
$file_path = &#39;RUTA DEL ARCHIVO&#39;;
$file = new CURLFile($file_path, mime_content_type($file_path), &#39;NOMBRE DEL ARCHIVO&#39;);
$json = Http::post(&#39;https://tu-api.com/recurso&#39;, [
		&#39;file&#39; =&gt; $file
	])
	-&gt;setHeader(&#39;Content-Type&#39;, &#39;multipart/form-data&#39;)
	-&gt;json(); // recibimos como json y lo convertimos en array asociativo
```

### 🛠️ Opciones avanzadas
Las peticiones se envían con el user-agent `FacturaScripts &lt;versión&gt;`. Si necesitamos otro, podemos cambiarlo con `setUserAgent()`:

```php
$json = Http::get(&#39;https://tu-api.com/recurso&#39;)
	-&gt;setUserAgent(&#39;MiPlugin 1.0&#39;)
	-&gt;json();
```

Y para casos avanzados, `setCurlOption()` permite fijar directamente cualquier opción `CURLOPT_*` de cURL:

```php
$json = Http::get(&#39;https://tu-api.com/recurso&#39;)
	-&gt;setCurlOption(CURLOPT_SSL_VERIFYPEER, false)
	-&gt;json();
```