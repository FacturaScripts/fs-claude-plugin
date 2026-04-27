---
id: 615
permalink: obtener-parametros-de-la-url-formularios-o-cookies-496
title: Obtener Parámetros de la URL, Formularios o Cookies
creationdate: 30-04-2018 00:00:00
lastmod: 15-04-2026
url: https://facturascripts.com/publicaciones/obtener-parametros-de-la-url-formularios-o-cookies-496
---

Todos los **controladores de FacturaScripts** cuentan con el método [request()](https://facturascripts.com/publicaciones/objeto-request-como-recibir-datos-de-formularios-url-cookies-etc), que permite acceder a los parámetros de la URL (`$_GET`), formularios (`$_POST`) o cookies (`$_COOKIE`). 

En el entorno de [Controller](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Template/Controller.php), la [Request](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Request.php#L26) engloba toda la información de la petición HTTP. Cada componente principal de la petición se divide internamente en objetos del tipo [SubRequest](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Internal/SubRequest.php). Algunas de las principales propiedades del objeto **request** (que son instancias de `SubRequest`) son:

- **query** (equivalente a **$_GET**).
- **request** (equivalente a **$_POST**).
- **server** (equivalente a **$_SERVER**).
- **files** (equivalente a **$_FILES**).
- **cookies** (equivalente a **$_COOKIE**).

## ⚡ Obtener un Parámetro de la URL (GET)

Supongamos que la URL es `http://example.com/MyNewController?idproject=1` y queremos obtener el valor de `idproject`. Podemos usar el método de la SubRequest `query` así:

```php
// Obtiene el valor como string o null si no existe
$value = $this-&gt;request()-&gt;query-&gt;get(&#39;idproject&#39;);

// Opciones tipadas desde query (SubRequest):
$id = $this-&gt;request()-&gt;query-&gt;getInt(&#39;idproject&#39;);
$is_active = $this-&gt;request()-&gt;query-&gt;getBool(&#39;active&#39;, false);
```

También disponemos de un atajo general (menos estricto):
```php
$value = $this-&gt;request()-&gt;query(&#39;idproject&#39;);
```

### ⌨️ Obtener el Valor de un Input de un Formulario (POST)

Imaginemos que tenemos un formulario con un input llamado `description` y queremos obtener el valor enviado (`$_POST`). Podemos acceder a la propiedad `request` de la Request principal (que es una `SubRequest`):

```php
// Obtiene el valor como string o null si no existe
$value = $this-&gt;request()-&gt;request-&gt;get(&#39;description&#39;);
```

También existe un atajo general:
```php
$value = $this-&gt;request()-&gt;input(&#39;description&#39;);
```

&gt; **Nota:** Existen métodos más específicos en las instancias de `SubRequest` (tanto en `$this-&gt;request()-&gt;request` para POST como en `$this-&gt;request()-&gt;query` para GET) para obtener el valor casteado o sanitizado directamente. Ejemplos usando POST:
&gt; ```php
&gt; $id = $this-&gt;request()-&gt;request-&gt;getInt(&#39;id&#39;);
&gt; $price = $this-&gt;request()-&gt;request-&gt;getFloat(&#39;price&#39;, 0.0);
&gt; $active = $this-&gt;request()-&gt;request-&gt;getBool(&#39;active&#39;, false);
&gt; $fecha = $this-&gt;request()-&gt;request-&gt;getDate(&#39;fecha&#39;, date(&#39;Y-m-d&#39;));
&gt; $emails = $this-&gt;request()-&gt;request-&gt;getArray(&#39;emails&#39;);
&gt; ```
&gt; Todos aceptan un segundo parámetro opcional como valor por defecto en caso de que el input o parámetro no exista.

### 🍪 Obtener el Valor Almacenado en una Cookie

Supongamos que hemos guardado una cookie con el nombre `order1` y queremos leer el valor que almacena. Para ello llamamos al método [cookie()](https://facturascripts.com/publicaciones/objeto-request-como-recibir-datos-de-formularios-url-cookies-etc#md_h4):

```php
$value = $this-&gt;request()-&gt;cookie(&#39;order1&#39;);
```

### 🧭 Obtener la IP del Usuario

Para obtener la dirección IP del usuario, se puede usar el siguiente método:

```php
$ip = $this-&gt;request()-&gt;ip();
```

## 🔜 Redireccionar al Usuario

Se puede redirigir a otra página o controlador usando el método `redirect()` del controlador:

```php
$this-&gt;redirect(&#39;ListProducto&#39;);
```

En este caso, estamos redireccionando al controlador `ListProducto`, que muestra el listado de productos.
