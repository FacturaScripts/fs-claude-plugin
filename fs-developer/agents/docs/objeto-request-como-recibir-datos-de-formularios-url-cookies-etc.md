---
id: 2224
permalink: objeto-request-como-recibir-datos-de-formularios-url-cookies-etc
title: La clase Request: cómo recibir datos de formularios, url, cookies, etc ...
creationdate: 26-08-2025 10:54:04
lastmod: 06-10-2025
url: https://facturascripts.com/objeto-request-como-recibir-datos-de-formularios-url-cookies-etc
---
La clase Request se encarga de gestionar toda la información de las peticiones HTTP entrantes. Proporciona una interfaz orientada a objetos para acceder a los datos de $_GET, $_POST, $_COOKIE, $_FILES y $_SERVER.

Fichero: [Core/Request.php](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Request.php)

Este objeto está disponible en **todos los controladores**, ya sea como propiedad o como método.

```
// controladores actuales
$mi_campo = $this-&gt;request-&gt;input(&#39;mi_campo&#39;);

// para los nuevos controladores
$mi_campo = $this-&gt;request()-&gt;input(&#39;mi_campo&#39;);
```

## 🖱️ Obtener parámetros de la url (query)
En ocasiones queremos obtener un parámetro que nos llega en la url, por ejemplo esta:

- http ... /MiControlador?`id=1234`

Para obtener el valor del parámetro id debemos usar el método `query()`:

```
$id = $this-&gt;request()-&gt;query(&#39;id&#39;);

// método alternativo
$id = $this-&gt;request()-&gt;query-&gt;get(&#39;id&#39;);

// todos los parámetros de la url
$all = $this-&gt;request()-&gt;query-&gt;all();
```

## ⌨️ Obtener valores del formulario (input)
Para obtener el valor de un campo que nos llega por formulario debemos usar el método `input()`, que obtiene el parámetro de la entrada request (POST/PUT/PATCH).

```
$mi_campo = $this-&gt;request()-&gt;input(&#39;mi_campo&#39;);

// método alternativo
$mi_campo = $this-&gt;request()-&gt;request-&gt;get(&#39;mi_campo&#39;);

// todos los campos
$all = $this-&gt;request()-&gt;request-&gt;all();
```

### 🔍 Obtener valores de url y formularios
En ocasiones un parámetro podemos recibirlo por la url o bien por formulario. En estos casos tenemos dos métodos para establecer la prioridad:

- `inputOrQuery()`: consulta primero el valor de input y si no existe entonces devuelve el de query (url).
- `queryOrInput()`: consulta primero el valor de query (url) y si no existe entonces devuelve el de input.
- `get()`: consulta primero el valor de query (url) y si no existe entonces devuelve el de query. **Obsoleto**.

Para este ejemplo recibiremos por la url el parámetro `mi_campo=555` y por formulario nos llega `mi_campo=777`:

```
$mi_campo = $this-&gt;request()-&gt;inputOrQuery(&#39;mi_campo&#39;); // 777

$mi_campo = $this-&gt;request()-&gt;queryOrInput(&#39;mi_campo&#39;); // 555

$mi_campo = $this-&gt;request()-&gt;get(&#39;mi_campo&#39;); // 555
```

## 🍪 Cookies
Obtiene el valor de una cookie específica.

```
$mi_cookie = $this-&gt;request()-&gt;cookie(&#39;mi_cookie&#39;);

// método alternativo
$mi_cookie = $this-&gt;request()-&gt;cookies-&gt;get(&#39;mi_cookie&#39;);

// todas las cookies
$cookies = $this-&gt;request()-&gt;cookies-&gt;all();
```

## ✉️ Cabeceras (header)
Para obtener el valor de una cabecera de la petición HTTP debemos usar el método `header()`:

```
$mi_header = $this-&gt;request()-&gt;header(&#39;mi_header&#39;);

// método alternativo
$mi_header = $this-&gt;request()-&gt;headers-&gt;get(&#39;mi_header&#39;);

// todas las cabeceras
$all = $this-&gt;request()-&gt;headers-&gt;all();
```

## 📦 json
Para obtener un json recibido debemos usar el método `json()`, que nos devuelve el json ya convertido en array asocuativo:

```
$json = $this-&gt;request()-&gt;json();
```

Si se especifica $key, devuelve solo ese campo del JSON o el valor por defecto:

```
$name = $this-&gt;request()-&gt;json(&#39;name&#39;); // devuelve solo el campo &#39;name&#39;
$age = $this-&gt;request()-&gt;json(&#39;age&#39;, 0);    // devuelve &#39;age&#39; o 0 si no existe
```

## 🧾 getContent
Devuelve el cuerpo crudo de la petición HTTP. Es útil para peticiones XML o cualquier contenido que no sea form-data:

```
$raw = $this-&gt;request()-&gt;getContent();
```

## Otros métodos Públicos

### static createFromGlobals(): self
Método factoría que crea una instancia de Request a partir de las variables globales de PHP ($_COOKIE, $_FILES, $_SERVER, $_GET, $_POST).

```
$request = Request::createFromGlobals();
```

### all(string ...$key): array
Devuelve un array con todos los parámetros de la petición (query y request). Si se especifican claves,
devuelve un array asociativo con los valores de esas claves.

```
$all = $this-&gt;request()-&gt;all();

// solamente algunos campos
$some = $this-&gt;request()-&gt;all(&#39;campo1&#39;, &#39;campo2&#39;, &#39;campo3&#39;);
```

### browser(): string
Detecta y devuelve el navegador del cliente a partir del User-Agent. Puede devolver: chrome, edge, firefox, safari, opera, ie o unknown.

```
$browser = $this-&gt;request()-&gt;browser(); // firefox

// si prefieres el user-agent completo
$some = $this-&gt;request()-&gt;userAgent();
```

### 📄 file(string $key): ?UploadedFile
Obtiene un fichero subido por su clave. Devuelve un objeto UploadedFile.

```
$upload_file = $this-&gt;request()-&gt;file(&#39;mi_archivo&#39;);

// método alternativo
$upload_file = $this-&gt;request()-&gt;files-&gt;get(&#39;mi_archivo&#39;);

// para varios archivos
$upload_files = $this-&gt;request()-&gt;files-&gt;getArray(&#39;mi_archivo&#39;);
```

### has(): bool
Si necesitas consultar si un parámetro existe, ya llegue por url o por formulario, puedes usar el método `has()`:

```
if ($this-&gt;request()-&gt;has(&#39;mi_campo&#39;) {
	// existe ese campo
}

// comprobamos solamente en la url
if ($this-&gt;request()-&gt;query-&gt;has(&#39;mi_campo&#39;) {
	// existe ese campo
}

// comprobamos solamente por input
if ($this-&gt;request()-&gt;request-&gt;has(&#39;mi_campo&#39;) {
	// existe ese campo
}

// comprobamos en las cookies
if ($this-&gt;request()-&gt;cookies-&gt;has(&#39;mi_campo&#39;) {
	// existe ese campo
}

// comprobamos en las cabeceras
if ($this-&gt;request()-&gt;headers-&gt;has(&#39;mi_campo&#39;) {
	// existe ese campo
}
```

### host(): string
Devuelve el host de la petición.

```
$host = $this-&gt;request()-&gt;host();
```

### ip(): string
Devuelve la dirección IP del cliente. Tiene en cuenta cabeceras de proxy como HTTP_CF_CONNECTING_IP y HTTP_X_FORWARDED_FOR.

```
$ip = $this-&gt;request()-&gt;ip();
```

### isMethod(string $method): bool
Comprueba si el método de la petición es el especificado.

```
if ($this-&gt;request()-&gt;isMethod(Request::METHOD_POST)) {
	// es una petición POST
}
```

### method(): string
Devuelve el método HTTP de la petición (GET, POST, PUT, etc.).

```
$method = $this-&gt;request()-&gt;method();
```

### os(): string
Detecta y devuelve el sistema operativo del cliente a partir del User-Agent. Puede devolver: windows, mac, linux, unix, sun, bsd o unknown.

```
$os = $this-&gt;request()-&gt;os(); // linux
```

### protocol(): string
Devuelve el protocolo de la petición (ej: HTTP/1.1).

```
$protocol = $this-&gt;request()-&gt;protocol();
```

### 🔒 isSecure(): bool
Devuelve true si la petición se ha realizado a través de HTTPS.

```
if ($this-&gt;request()-&gt;isSecure()) {
	// es una petición HTTPS
}
```

### url(?int $position = null): string
Devuelve la URL de la petición sin la query string. Si se proporciona una posición, devuelve la parte de la URL correspondiente a esa posición (separada por /).

```
// http://localhost/MiControlador/1234/?param1=555
$url = $this-&gt;request()-&gt;url(); // http://localhost/MiControlador
$id = $this-&gt;request()-&gt;url(1); // 1234
```

### urlWithQuery(): string
Devuelve la URL con la query string.

```
$url = $this-&gt;request()-&gt;urlWithQuery();
```

### userAgent(): string
Devuelve el User-Agent de la petición.

```
$user_agent = $this-&gt;request()-&gt;userAgent();
```
