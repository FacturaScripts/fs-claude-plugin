---
id: 2225
permalink: objeto-response-como-devolver-datos
title: La clase Response: cómo devolver datos
creationdate: 26-08-2025 11:13:40
lastmod: 06-10-2025
url: https://facturascripts.com/objeto-response-como-devolver-datos
---
La clase Response se utiliza para construir y enviar una respuesta HTTP al cliente. Permite establecer el código de estado HTTP, las cabeceras, las cookies y el contenido de la respuesta.

Fichero: [Core/Response.php](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Response.php)

Este objeto está disponible en **todos los controladores**, ya sea como propiedad o como método.

```php
// controladores actuales
$this-&gt;response-&gt;json([&#39;mis_datos&#39; =&gt; &#39;1234&#39;]);

// para los nuevos controladores
$this-&gt;response()-&gt;json([&#39;mis_datos&#39; =&gt; &#39;1234&#39;]);
```

## Constantes de Código de Estado HTTP
- HTTP_OK (200)
- HTTP_BAD_REQUEST (400)
- HTTP_UNAUTHORIZED (401)
- HTTP_FORBIDDEN (403)
- HTTP_NOT_FOUND (404)
- HTTP_METHOD_NOT_ALLOWED (405)
- HTTP_INTERNAL_SERVER_ERROR (500)

## Propiedades Públicas
- `$headers`: Un objeto ResponseHeaders que gestiona las cabeceras de la respuesta.

## Métodos Públicos

### header(string $name, string $value): self
Establece una cabecera HTTP para la respuesta.

```php
// método normal
$this-&gt;response-&gt;header(&#39;Content-Type&#39;, &#39;application/json&#39;);

// método alternativo
$this-&gt;response-&gt;headers-&gt;set(&#39;Content-Type&#39;, &#39;application/json&#39;);
```

### setHttpCode(int $http_code): self
Establece el código de estado HTTP para la respuesta.

```php
$this-&gt;response-&gt;setHttpCode(403);
```

### getHttpCode(): int
Devuelve el código de estado HTTP de la respuesta.

```php
$http_code = $this-&gt;response-&gt;getHttpCode();
```

### setContent(string $content): self
Establece el contenido del cuerpo de la respuesta.

```php
$this-&gt;response-&gt;setContent(&#39;Hola mundo&#39;);
```

### getContent(): string
Devuelve el contenido actual de la respuesta.

```php
$content = $this-&gt;response-&gt;getContent();
```

### ↪️ redirect(string $url, int $delay = 0): self
Prepara una redirección a otra URL. Pero no se envía.

- `$url`: La URL a la que se va a redirigir.
- `$delay`: Si es mayor que 0, usa la cabecera Refresh para una redirección retardada. Si no, usa Location para una redirección inmediata (código 302).

```php
$this-&gt;response-&gt;redirect(&#39;Dashboard&#39;)-&gt;send();
```

### 🍪 cookie(string $name, string $value, int $expire = 0, bool $httpOnly = true, ?bool $secure = null, string $sameSite = &#39;Lax&#39;): self
Añade una cookie a la respuesta.

- `$name`: Nombre de la cookie.
- `$value`: Valor de la cookie.
- `$expire`: Timestamp de expiración. Si es 0, usa el valor de configuración cookies_expire.
- `$httpOnly`: Si es true, la cookie solo será accesible a través del protocolo HTTP.
- `$secure`: Si es true, la cookie solo se enviará sobre conexiones seguras (HTTPS). Si es null, se autodetecta.
- `$sameSite`: Controla cuándo se envía la cookie (Lax, Strict, None).

```php
// creo la cookie &#39;hola&#39; con el valor &#39;mundo&#39;
$this-&gt;response-&gt;cookie(&#39;hola&#39;, &#39;mundo&#39;);
```

### 🍪 withoutCookie(string $name): self
Indica al navegador que elimine una cookie estableciendo su tiempo de expiración en el pasado.

```php
// elimino la cookie session
$this-&gt;response-&gt;withoutCookie(&#39;session&#39;);
```

### json(array $data): void
Prepara y envía una respuesta en formato JSON. Establece la cabecera Content-Type a application/json.

```php
$this-&gt;response-&gt;json([&#39;hola&#39; =&gt; &#39;mundo&#39;]);
```

### view(string $view, array $data = []): void
Renderiza una vista de plantilla y la establece como contenido de la respuesta. Envía la respuesta con Content-Type: text/html.

```php
$this-&gt;response-&gt;view(&#39;MyView&#39;); // View/MyView.html.twig
```

### 📄 file(string $file_path, string $file_name = &#39;&#39;, string $disposition = &#39;inline&#39;): void
Envía un fichero como respuesta.

- `$file_path`: Ruta al fichero en el servidor.
- `$file_name`: Nombre que se sugerirá al cliente para el fichero.
- `$disposition`: Tipo de disposición (inline para mostrar en el navegador, attachment para descargar).

```php
// mostrar el archivo con opción de descarga
$this-&gt;response-&gt;file(FS_FOLDER . &#39;/MyFiles/public/miArchivo.pdf&#39;, &#39;factura1.pdf&#39;, &#39;inline&#39;);

// descargar el archivo directamente
$this-&gt;response-&gt;file(FS_FOLDER . &#39;/MyFiles/public/miArchivo.pdf&#39;, &#39;factura1.pdf&#39;, &#39;attachment&#39;);
```

### ⬇️ download(string $file_path, string $file_name = &#39;&#39;): void
Prepara una respuesta para forzar la descarga de un fichero. Establece las cabeceras Content-Disposition a attachment.

```php
// descargar el archivo
$this-&gt;response-&gt;download(FS_FOLDER . &#39;/MyFiles/public/fatura-230.xml&#39;, &#39;fatura230.xml&#39;);
```

### pdf(string $content, string $file_name = &#39;&#39;): void
Prepara y envía una respuesta con contenido PDF. Establece las cabeceras apropiadas para mostrar un PDF en el navegador.

```php
// leer su contenido
$miContenidoPdf = file_get_contents(FS_FOLDER . &#39;/MyFiles/public/miArchivo.pdf&#39;);

// mostrarlo
$this-&gt;response-&gt;pdf($miContenidoPdf, &#39;miArchivo.pdf&#39;);
```

### send(): void
Envía la respuesta completa (código de estado, cabeceras, cookies y contenido) al cliente.

```php
// envio una respuesta &#39;OK&#39; en formato texto y escribo la respuesta con send().
$this-&gt;response
    -&gt;setContent(&#39;OK&#39;)
    -&gt;header(&#39;Content-Type&#39;, &#39;text/plain&#39;)
    -&gt;send();

// normalmente &#39;send()&#39; se llama automáticamente dependiendo del método de Response
// revisar Core/Response.php para ver en qué métodos se llama &#39;send()&#39;
```

### 🚫 disableSend(bool $disable = true): self
Deshabilita el envío de la respuesta. Útil para tests o para manipular la respuesta antes de enviarla.

```php
// desactivo que se envie la respuesta
$this-&gt;response-&gt;disableSend();

// preparo una respuesta
$this-&gt;response-&gt;json([&#39;hola&#39; =&gt; &#39;mundo&#39;]);

// reactivo la respuesta
$this-&gt;response-&gt;disableSend(false);

// envio la respuesta
$this-&gt;response-&gt;send();
```
