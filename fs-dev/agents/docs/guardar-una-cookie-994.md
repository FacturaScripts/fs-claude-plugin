---
id: 616
permalink: guardar-una-cookie-994
title: Cómo guardar una cookie
creationdate: 30-04-2018 00:00:00
lastmod: 11-06-2026
url: https://facturascripts.com/publicaciones/guardar-una-cookie-994
---
Desde un controlador se pueden leer cookies usando el objeto `Request` y guardar o borrar cookies usando el objeto `Response`.

### Leer una cookie
```php
$valor = $this-&gt;request()-&gt;cookie(&#39;nombre_cookie&#39;);
```

También se puede indicar un valor por defecto si la cookie no existe:

```
$valor = $this-&gt;request()-&gt;cookie(&#39;nombre_cookie&#39;, &#39;valor_por_defecto&#39;);
```

El método devuelve el valor de la cookie como string o null si no existe y no se ha indicado valor por defecto.

### Guardar una cookie
```
$this-&gt;response()-&gt;cookie(&#39;nombre_cookie&#39;, &#39;valor&#39;);
```

Por defecto, FacturaScripts usa el tiempo de expiración configurado en cookies_expire.

Si queremos indicar una fecha de expiración concreta, debemos pasar un timestamp:

```
$expire = time() + 3600; // 1 hora
$this-&gt;response()-&gt;cookie(&#39;nombre_cookie&#39;, &#39;valor&#39;, $expire);
```

La firma del método es:

```
$this-&gt;response()-&gt;cookie(
      string $name,
      ?string $value,
      int $expire = 0,
      bool $httpOnly = true,
      ?bool $secure = null,
      string $sameSite = &#39;Lax&#39;
);
```

Parámetros principales:

- $name: nombre de la cookie.
- $value: valor de la cookie.
- $expire: timestamp de expiración. Si es 0, se usa la configuración cookies_expire.
- $httpOnly: si es true, la cookie no será accesible desde JavaScript.
- $secure: si es null, se detecta automáticamente si la petición usa HTTPS.
- $sameSite: política SameSite. Por defecto es Lax.

### Borrar una cookie
```
$this-&gt;response()-&gt;withoutCookie(&#39;nombre_cookie&#39;);
```

### Ejemplo completo
```
protected function execPreviousAction($action)
{
      // leer cookie
      $modo = $this-&gt;request()-&gt;cookie(&#39;mi_modo&#39;, &#39;normal&#39;);

      // guardar cookie
      if ($action === &#39;cambiar-modo&#39;) {
          $nuevoModo = $this-&gt;request()-&gt;input(&#39;modo&#39;, &#39;normal&#39;);
          $this-&gt;response()-&gt;cookie(&#39;mi_modo&#39;, $nuevoModo);
      }

      // borrar cookie
      if ($action === &#39;borrar-modo&#39;) {
          $this-&gt;response()-&gt;withoutCookie(&#39;mi_modo&#39;);
      }

      return parent::execPreviousAction($action);
}
```