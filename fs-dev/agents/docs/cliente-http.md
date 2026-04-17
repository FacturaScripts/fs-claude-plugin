---
id: 1602
permalink: cliente-http
title: Cliente HTTP de FacturaScripts
creationdate: 22-11-2023 12:43:22
lastmod: 02-06-2025
url: https://facturascripts.com/cliente-http
---
Tenemos un **cliente HTTP** que puedes utilizar para consultar APIs, descargar contenido, consultar otras webs, etc. Simplifica mucho el código en comparación con CURL.

## Haciendo una consulta
En este ejemplo consultaremos nuestra web y almacenaremos el resultado (el html) en la variante $html.

```
use FacturaScripts\Core\Http;

$html = Http::get(&#39;http://facturascripts.com&#39;)-&gt;body();
```

### Porcesar JSON
Si vamos a consultar una web que devuelve json, por ejemplo una API, podemos llamar directamente al método ``json()`` en lugar de a ``body()``, esto hace que se procese el JSON devuelto.

```
$json = Http::get(&#39;https://randomuser.me/api/&#39;)-&gt;json(false); // devuelve un objeto
$jsonArray = Http::get(&#39;https://randomuser.me/api/&#39;)-&gt;json(); // devuelve un array
```

### Obtener las cabeceras
Podemos obtener todas las cabeceras con la función ``headers()`` o una concretra con la función ``header()``.

```
$request = Http::get(https://movie-quote-api.herokuapp.com/v1/quote/&#39;);

$headers = $request-&gt;headers(); // obtenemos todas las cabeceras

$total = $request-&gt;header(&#39;x-total&#39;); // obtenemos la cabecera &#39;x-total&#39;
```

### ⚠️ Control de errores
Tenemos una serie de funciones que podemos usar para comprobar si la petición ha devuelto errores o no, y cuales. Las funciones son ``ok()``, ``failed()``, ``notFound()``, ``errorMessage()`` y ``status()``.

```
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
Si deseas no solo consultar una url, sino almacenar la respuesta en un archivo, es decir, descargar ese archivo a disco. Puedes usar la función ``saveAs()``.

```
Http::get(&#39;https://facturascripts.com/PluginInfoList&#39;)
	-&gt;saveAs(&#39;lista.json&#39;); // devuelve true si se descarga correctamente
```

En este caso se guarda en el archivo lista.json de la carpeta de FacturaScripts.

### ⏱️ Establecer timeout
Podemos establecer un tiempo máximo de ejecución con la función ``setTimeout()``.

```
$json = Http::get(&#39;https://randomuser.me/api/&#39;)
	-&gt;setTimeout(10)
	-&gt;json();
```

### Añadir cabeceras
Podemos añadir una cabecera a la petición con la función ``setHeader()`` o varias con la función ``setHeaders()``.

```
$json = Http::get(&#39;https://tu-api-com/recurso&#39;)
	-&gt;setHeader(&#39;mi-cabecera&#39;, &#39;mi-valor&#39;)
	-&gt;json();

$json2 = Http::get(&#39;https://tu-api-com/recurso&#39;)
	-&gt;setHeaders([
		&#39;mi-cabecera-1&#39;, &#39;mi-valor-1&#39;,
		&#39;mi-cabecera-2&#39;, &#39;mi-valor-2&#39;
	])
	-&gt;json();
```

### 🔑 Añadir token
Podemos añadir un token en la cabecera de la petición con el método ``setToken()``.

```
$json = Http::get(&#39;https://facturascripts.com/api/3/&#39;)
	-&gt;setToken(&#39;mi-token&#39;)
	-&gt;json();

// esto sería equivalente
$json = Http::get(&#39;https://facturascripts.com/api/3/&#39;)
	-&gt;setHeader(&#39;Token&#39;, &#39;mi-token&#39;)
	-&gt;json();
```

Para enviar una cabecera de tipo `Authorization: Bearer` podemos usar el método ``setBearerToken()``.

```
$json = Http::get(&#39;https://api.openai.com/v1/chat/completions&#39;)
	-&gt;setBearerToken(&#39;mi-bearer-token&#39;)
	-&gt;json();

// esto sería equivalente
$json = Http::get(&#39;https://api.openai.com/v1/chat/completions&#39;)
	-&gt;setBearerToken(&#39;mi-bearer-token&#39;)
	-&gt;json();
```

### 👤 Establecer usuario y contraseña
Si queremos usar un usuario y contraseña, podemos usar la función ``setUser()``.

```
$json = Http::get(&#39;https://tu-web-con-user.com/servicio&#39;)
	-&gt;setUser(&#39;mi-usuario&#39;, &#39;mi-contraseña&#39;)
	-&gt;json();
```

### Hacer una petición post
Podemos hacer una petición POST, es decir, enviar datos como si fuese un formulario, llamando a la función post en lugar de a get.

```
// enviamos los datos como un formulario
$json = Http::post(&#39;https://tu-api-com/recurso&#39;, [
		&#39;dato1&#39; =&gt; &#39;valor1&#39;,
		&#39;dato2&#39; =&gt; &#39;valor2&#39;
	])
	-&gt;json(); // recibimos como json y lo convertimos en array asociativo
```

Si queremos enviar los datos en formato json, podemos usar el método ``postJson()``, que convierte el array de datos a json y lo envía con la cabecera correspondiente:

```
// enviamos los datos en formato json
$json = Http::postJson(&#39;https://tu-api.com/recurso&#39;, [
		&#39;dato1&#39; =&gt; &#39;valor1&#39;,
		&#39;dato2&#39; =&gt; &#39;valor2&#39;
	])
	-&gt;json(); // recibimos como json y lo convertimos en array asociativo
```

También tenemos disponibles las funciones ``put()`` y ``delete()`` para hacer las correspondientes peticiones.

### 📎 Enviar archivos
Para enviar archivos por formulario podemos procesarlos previamente con `CURLFile`:

```
// enviamos un archivo
$file_path = &#39;RUTA DEL ARCHIVO&#39;;
$file = new CURLFile($file_path, mime_content_type($file_path), &#39;NOMBRE DEL ARCHIVO&#39;);
$json = Http::post(&#39;https://tu-api.com/recurso&#39;, [
		&#39;file&#39; =&gt; $file
	])
	-&gt;setHeader(&#39;Content-Type&#39;, &#39;multipart/form-data&#39;)
	-&gt;json(); // recibimos como json y lo convertimos en array asociativo
```
