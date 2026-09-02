---
id: 616
permalink: guardar-una-cookie-994
title: Cómo guardar una cookie
creationdate: 30-04-2018 00:00:00
lastmod: 11-07-2026
url: https://facturascripts.com/publicaciones/guardar-una-cookie-994
---
Desde un controlador se pueden leer cookies usando el objeto `Request` (con `$this-&gt;request()`) y guardar o borrar cookies usando el objeto `Response` (con `$this-&gt;response()`).

&gt; `request()` es un método público, pero `response()` es un método protegido del controlador: las cookies solo se pueden guardar o borrar desde dentro del propio controlador (por ejemplo en `execPreviousAction`), no desde un modelo u otra clase.

### Leer una cookie
```php
$valor = $this-&gt;request()-&gt;cookie(&#39;nombre_cookie&#39;);
```

También se puede indicar un valor por defecto si la cookie no existe:

```php
$valor = $this-&gt;request()-&gt;cookie(&#39;nombre_cookie&#39;, &#39;valor_por_defecto&#39;);
```

El método devuelve el valor de la cookie como string o null si no existe y no se ha indicado valor por defecto.

### Guardar una cookie
```php
$this-&gt;response()-&gt;cookie(&#39;nombre_cookie&#39;, &#39;valor&#39;);
```

Por defecto, FacturaScripts usa el tiempo de expiración configurado en `cookies_expire` (un año, 31536000 segundos, salvo que se haya cambiado en la configuración).

Si queremos indicar una fecha de expiración concreta, debemos pasar un timestamp:

```php
$expire = time() + 3600; // 1 hora
$this-&gt;response()-&gt;cookie(&#39;nombre_cookie&#39;, &#39;valor&#39;, $expire);
```

La firma del método es:

```php
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

- `$name`: nombre de la cookie.
- `$value`: valor de la cookie.
- `$expire`: timestamp de expiración. Si es 0, se usa la configuración `cookies_expire`.
- `$httpOnly`: si es true, la cookie no será accesible desde JavaScript.
- `$secure`: si es null, se detecta automáticamente si la petición usa HTTPS.
- `$sameSite`: política SameSite. Admite `Lax` (por defecto), `Strict` o `None`. Si usas `None`, los navegadores exigen además que `$secure` sea true.

Las cookies se envían sobre la ruta configurada en `FS_ROUTE`, de modo que siguen funcionando cuando FacturaScripts está instalado en un subdirectorio.

### Borrar una cookie
```php
$this-&gt;response()-&gt;withoutCookie(&#39;nombre_cookie&#39;);
```

Internamente reescribe la cookie con un valor vacío y una fecha de expiración en el pasado, por lo que debe llamarse antes de que se envíe la respuesta.

### Ejemplo completo
```php
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