---
id: 2224
permalink: objeto-request-como-recibir-datos-de-formularios-url-cookies-etc
title: La clase Request: cómo recibir datos de formularios, url, cookies, etc ...
creationdate: 26-08-2025 10:54:04
lastmod: 02-05-2026
url: https://facturascripts.com/publicaciones/objeto-request-como-recibir-datos-de-formularios-url-cookies-etc
---
La clase Request se encarga de gestionar toda la información de las peticiones HTTP entrantes. Proporciona una interfaz orientada a objetos para acceder a los datos de $_GET, $_POST, $_COOKIE, $_FILES y $_SERVER.

Fichero: [Core/Request.php](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Request.php)

Este objeto está disponible en **todos los controladores**, ya sea como propiedad o como método.

```php
// controladores actuales
$mi_campo = $this-&gt;request-&gt;input(&#39;mi_campo&#39;);

// para los nuevos controladores
$mi_campo = $this-&gt;request()-&gt;input(&#39;mi_campo&#39;);
```

## 🖱️ Obtener parámetros de la url (query)
En ocasiones queremos obtener un parámetro que nos llega en la url, por ejemplo esta:

- http ... /MiControlador?`id=1234`

Para obtener el valor del parámetro id debemos usar el método `query()`:

```php
$id = $this-&gt;request()-&gt;query(&#39;id&#39;);

// método alternativo
$id = $this-&gt;request()-&gt;query-&gt;get(&#39;id&#39;);

// todos los parámetros de la url
$all = $this-&gt;request()-&gt;query-&gt;all();
```

## ⌨️ Obtener valores del formulario (input)
Para obtener el valor de un campo que nos llega por formulario debemos usar el método `input()`, que obtiene el parámetro de la entrada request (POST/PUT/PATCH).

```php
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
- `get()`: consulta primero el valor de query (url) y si no existe entonces devuelve el de input. **Obsoleto**.

Para este ejemplo recibiremos por la url el parámetro `mi_campo=555` y por formulario nos llega `mi_campo=777`:

```php
$mi_campo = $this-&gt;request()-&gt;inputOrQuery(&#39;mi_campo&#39;); // 777

$mi_campo = $this-&gt;request()-&gt;queryOrInput(&#39;mi_campo&#39;); // 555

$mi_campo = $this-&gt;request()-&gt;get(&#39;mi_campo&#39;); // 555
```

## 🛡️ Obtener valores tipados
Los métodos `query()` e `input()` devuelven siempre string (o null). Si queremos el valor ya validado y convertido a un tipo concreto, podemos usar los getters tipados sobre `query` (url) o `request` (formulario):

```php
$id = $this-&gt;request()-&gt;query-&gt;getInt(&#39;id&#39;);
$activo = $this-&gt;request()-&gt;request-&gt;getBool(&#39;activo&#39;);
$precio = $this-&gt;request()-&gt;request-&gt;getFloat(&#39;precio&#39;, 0.0);
```

Si el valor no existe o no es válido para ese tipo, se devuelve el valor por defecto (segundo parámetro, null si no se indica). Los getters disponibles son:

- `getInt()`: número entero.
- `getFloat()`: número decimal.
- `getBool()`: booleano.
- `getString()`: string.
- `getAlnum()`: solo caracteres alfanuméricos (elimina el resto).
- `getEmail()`: email válido.
- `getUrl()`: url válida.
- `getDate()`: fecha.
- `getDateTime()`: fecha y hora.
- `getHour()`: hora.
- `getOnly()`: el valor solo si está en la lista de valores permitidos: `getOnly(&#39;estado&#39;, [&#39;abierto&#39;, &#39;cerrado&#39;])`.
- `getArray()`: array.

Estos getters también están disponibles en `cookies` y `headers`. Existen además versiones directas sobre el objeto request (`$this-&gt;request()-&gt;getInt(&#39;id&#39;)`), pero están obsoletas: usa siempre la forma `query-&gt;` o `request-&gt;`, que deja claro de dónde se lee el dato.

## 🍪 Cookies
Obtiene el valor de una cookie específica.

```php
$mi_cookie = $this-&gt;request()-&gt;cookie(&#39;mi_cookie&#39;);

// método alternativo
$mi_cookie = $this-&gt;request()-&gt;cookies-&gt;get(&#39;mi_cookie&#39;);

// todas las cookies
$cookies = $this-&gt;request()-&gt;cookies-&gt;all();
```

## ✉️ Cabeceras (header)
Para obtener el valor de una cabecera de la petición HTTP debemos usar el método `header()`:

```php
$mi_header = $this-&gt;request()-&gt;header(&#39;mi_header&#39;);

// método alternativo
$mi_header = $this-&gt;request()-&gt;headers-&gt;get(&#39;mi_header&#39;);

// todas las cabeceras
$all = $this-&gt;request()-&gt;headers-&gt;all();
```

## 📦 json
Para obtener un json recibido debemos usar el método `json()`, que nos devuelve el json ya convertido en array asociativo:

```php
$json = $this-&gt;request()-&gt;json();
```

Si se especifica $key, devuelve solo ese campo del JSON o el valor por defecto:

```php
$name = $this-&gt;request()-&gt;json(&#39;name&#39;); // devuelve solo el campo &#39;name&#39;
$age = $this-&gt;request()-&gt;json(&#39;age&#39;, 0);    // devuelve &#39;age&#39; o 0 si no existe
```

## 🧾 getContent
Devuelve el cuerpo crudo de la petición HTTP. Es útil para peticiones XML o cualquier contenido que no sea form-data:

```php
$raw = $this-&gt;request()-&gt;getContent();
```

## Otros métodos Públicos

### static createFromGlobals(): self
Método factoría que crea una instancia de Request a partir de las variables globales de PHP ($_COOKIE, $_FILES, $_SERVER, $_GET, $_POST).

```php
$request = Request::createFromGlobals();
```

### all(string ...$key): array
Devuelve un array con todos los parámetros de la petición (query y request). Si se especifican claves,
devuelve un array asociativo con los valores de esas claves.

```php
$all = $this-&gt;request()-&gt;all();

// solamente algunos campos
$some = $this-&gt;request()-&gt;all(&#39;campo1&#39;, &#39;campo2&#39;, &#39;campo3&#39;);
```

### browser(): string
Detecta y devuelve el navegador del cliente a partir del User-Agent. Puede devolver: chrome, edge, firefox, safari, opera, ie o unknown.

```php
$browser = $this-&gt;request()-&gt;browser(); // firefox

// si prefieres el user-agent completo
$some = $this-&gt;request()-&gt;userAgent();
```

### 📄 file(string $key): ?UploadedFile
Obtiene un fichero subido por su clave. Devuelve un objeto UploadedFile.

```php
$upload_file = $this-&gt;request()-&gt;file(&#39;mi_archivo&#39;);

// método alternativo
$upload_file = $this-&gt;request()-&gt;files-&gt;get(&#39;mi_archivo&#39;);

// para varios archivos
$upload_files = $this-&gt;request()-&gt;files-&gt;getArray(&#39;mi_archivo&#39;);
```

### fullUrl(): string
Devuelve la URL absoluta completa de la petición: protocolo, host, path y query string.

```php
// http://localhost/MiControlador?id=1234
$url = $this-&gt;request()-&gt;fullUrl();
```

### getBasePath(): string
Devuelve el path de la petición, sin host ni query string.

```php
// http://localhost/MiControlador?id=1234
$path = $this-&gt;request()-&gt;getBasePath(); // /MiControlador
```

### has(string ...$key): bool
Si necesitas consultar si un parámetro existe, ya llegue por url o por formulario, puedes usar el método `has()`:

```php
if ($this-&gt;request()-&gt;has(&#39;mi_campo&#39;)) {
	// existe ese campo
}

// podemos comprobar varios campos a la vez; deben existir todos
if ($this-&gt;request()-&gt;has(&#39;campo1&#39;, &#39;campo2&#39;)) {
	// existen ambos campos
}

// comprobamos solamente en la url
if ($this-&gt;request()-&gt;query-&gt;has(&#39;mi_campo&#39;)) {
	// existe ese campo
}

// comprobamos solamente por input
if ($this-&gt;request()-&gt;request-&gt;has(&#39;mi_campo&#39;)) {
	// existe ese campo
}

// comprobamos en las cookies
if ($this-&gt;request()-&gt;cookies-&gt;has(&#39;mi_campo&#39;)) {
	// existe ese campo
}

// comprobamos en las cabeceras
if ($this-&gt;request()-&gt;headers-&gt;has(&#39;mi_campo&#39;)) {
	// existe ese campo
}
```

Para lo contrario, comprobar que falta algún parámetro, los objetos `query`, `request`, `cookies` y `headers` ofrecen el método `isMissing()`:

```php
if ($this-&gt;request()-&gt;query-&gt;isMissing(&#39;mi_campo&#39;)) {
	// no existe ese campo en la url
}
```

### host(): string
Devuelve el host de la petición.

```php
$host = $this-&gt;request()-&gt;host();
```

### ip(): string
Devuelve la dirección IP del cliente. Tiene en cuenta cabeceras de proxy como HTTP_CF_CONNECTING_IP y HTTP_X_FORWARDED_FOR.

```php
$ip = $this-&gt;request()-&gt;ip();
```

### isMethod(string $method): bool
Comprueba si el método de la petición es el especificado.

```php
if ($this-&gt;request()-&gt;isMethod(Request::METHOD_POST)) {
	// es una petición POST
}
```

### method(): string
Devuelve el método HTTP de la petición (GET, POST, PUT, etc.).

```php
$method = $this-&gt;request()-&gt;method();
```

### os(): string
Detecta y devuelve el sistema operativo del cliente a partir del User-Agent. Puede devolver: windows, mac, linux, unix, sun, bsd o unknown.

```php
$os = $this-&gt;request()-&gt;os(); // linux
```

### protocol(): string
Devuelve el protocolo de la petición (ej: HTTP/1.1).

```php
$protocol = $this-&gt;request()-&gt;protocol();
```

### 🔒 isSecure(): bool
Devuelve true si la petición se ha realizado a través de HTTPS.

```php
if ($this-&gt;request()-&gt;isSecure()) {
	// es una petición HTTPS
}
```

### url(?int $position = null): string
Devuelve la URL de la petición sin la query string. Si se proporciona una posición, devuelve la parte de la URL correspondiente a esa posición (separada por /).

```php
// http://localhost/MiControlador/1234/?param1=555
$url = $this-&gt;request()-&gt;url(); // http://localhost/MiControlador
$id = $this-&gt;request()-&gt;url(1); // 1234
```

### urlWithQuery(): string
Devuelve la URL con la query string.

```php
$url = $this-&gt;request()-&gt;urlWithQuery();
```

### userAgent(): string
Devuelve el User-Agent de la petición.

```php
$user_agent = $this-&gt;request()-&gt;userAgent();
```