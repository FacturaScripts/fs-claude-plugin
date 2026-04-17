---
id: 616
permalink: guardar-una-cookie-994
title: Cómo guardar una cookie
creationdate: 30-04-2018 00:00:00
lastmod: 04-04-2025
url: https://facturascripts.com/guardar-una-cookie-994
---
Para guardar o modificar una cookie, debemos utilizar los objetos `Cookie` y `response` del controlador.

## Cargar el Namespace
Antes de crear o modificar una cookie, es necesario declarar que vamos a usar la clase `Cookie`. Para ello, debes incluir la siguiente línea justo debajo del namespace:

```
use Symfony\Component\HttpFoundation\Cookie;
```

## Ejemplo: Guardar una cookie
En este ejemplo, vamos a guardar una cookie con el nombre `order1` y el valor `&#39;ASC&#39;`.

```php
$expire = time() + 3600; // Expira en 1 hora
$this-&gt;response-&gt;headers-&gt;setCookie(new Cookie(&#39;order1&#39;, &#39;ASC&#39;, $expire));
```

## Consideraciones
- **Duración**: La duración de la cookie se define mediante la variable `$expire`. En el ejemplo, se establece para que expire en 1 hora.
- **Accesibilidad**: Asegúrate de que la cookie sea accesible desde las rutas correspondientes de tu aplicación.
