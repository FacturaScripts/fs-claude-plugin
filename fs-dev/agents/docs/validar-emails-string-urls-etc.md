---
id: 1591
permalink: validar-emails-string-urls-etc
title: Validar Emails, Cadenas y URLs
creationdate: 25-10-2023 12:45:17
lastmod: 25-03-2025
url: https://facturascripts.com/validar-emails-string-urls-etc
---
En FacturaScripts disponemos de la [clase Validator](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Validator.php) en el core, que agrupa diversas funciones para validar datos de forma sencilla y eficaz.

## Uso de la Clase Validator

Para utilizar la clase, recuerda incluir la declaración `use` al inicio de tu archivo PHP:

```php
use FacturaScripts\Core\Validator;
```

### Validar un Email

Para verificar si un email es correcto, utiliza el método `Validator::email()`, pasando como parámetro el email a comprobar. El método retorna `true` si el email es válido.

```php
if (Validator::email(&quot;mi@email.com&quot;)) {
    echo &quot;El email es correcto&quot;;
}
```

### Validar la Longitud de una Cadena

El método `Validator::string()` permite comprobar si una cadena tiene una longitud válida, definida entre un mínimo y un máximo.

**Parámetros:**
- `string $text`: Cadena a comprobar.
- `int $min`: Longitud mínima requerida.
- `int $max`: Longitud máxima permitida.

**Ejemplo:**

```php
// Verificar que &#39;mi casa&#39; tiene al menos 5 caracteres
if (Validator::alphaNumeric(&#39;mi casa&#39;, 5)) {
    echo &quot;La cadena tiene 5 o más caracteres&quot;;
}

// Verificar que &#39;mi casa&#39; tiene al menos 10 caracteres (no se cumple)
if (Validator::alphaNumeric(&#39;mi casa&#39;, 10)) {
    // No se ejecuta porque la cadena tiene menos de 10 caracteres
}

// Verificar que &#39;mi casa&#39; tiene entre 2 y 5 caracteres (no se cumple)
if (Validator::alphaNumeric(&#39;mi casa&#39;, 2, 5)) {
    // No se ejecuta porque la cadena excede 5 caracteres
}
```

### Validar que una Cadena Contenga Solo Números y Letras

El método `Validator::alphaNumeric()` comprueba si una cadena contiene únicamente números y letras. Además, permite especificar caracteres extra permitidos y validar la longitud.

**Parámetros:**
- `string $text`: La cadena a validar.
- `string $extra`: Caracteres adicionales permitidos, además de números y letras.
- `int $min`: Longitud mínima válida.
- `int $max`: Longitud máxima válida.

**Ejemplos:**

```php
// Validar que &#39;test1234&#39; contenga solo números y letras
if (Validator::alphaNumeric(&#39;test1234&#39;)) {
    echo &quot;Contiene únicamente números y letras&quot;;
}

// &#39;test 1234&#39; contiene un espacio, por lo tanto no es válido
if (Validator::alphaNumeric(&#39;test 1234&#39;)) {
    // No se ejecuta
}

// Validar incluyendo espacios permitidos
if (Validator::alphaNumeric(&#39;test 1234&#39;, &#39; &#39;)) {
    echo &quot;Contiene únicamente números, letras y espacios&quot;;
}

// Validar incluyendo puntos permitidos
if (Validator::alphaNumeric(&#39;test.1234&#39;, &#39;.&#39;)) {
    echo &quot;Contiene únicamente números, letras y puntos&quot;;
}

// Validar incluyendo puntos y el símbolo &#39;+&#39;
if (Validator::alphaNumeric(&#39;test.1234++&#39;, &#39;.+&#39;)) {
    echo &quot;Contiene únicamente números, letras, puntos y el símbolo &#39;+&#39;&quot;;
}

// Validar longitud mínima; &#39;test.1234&#39; no cumple con 10 caracteres
if (Validator::alphaNumeric(&#39;test.1234&#39;, &#39;.+&#39;, 10)) {
    // No se ejecuta
}
```

### Validar una URL

El método `Validator::url()` verifica si una URL es válida.

**Parámetros:**
- `string $url`: La URL a comprobar.
- `bool $strict`: Si se establece en `true`, se exige que la URL comience con un protocolo válido (por ejemplo, `http://` o `https://`).

**Ejemplos:**

```php
// Validación de una URL con protocolo
if (Validator::url(&quot;http://google.com&quot;)) {
    echo &quot;La URL es válida&quot;;
}

// Validación de una URL sin protocolo (se considera válida de forma laxa)
if (Validator::url(&quot;google.com&quot;)) {
    echo &quot;La URL también es válida en modo laxo&quot;;
}

// Validación estricta (requiere protocolo)
if (Validator::url(&quot;google.com&quot;, true)) {
    // No se ejecuta, ya que falta el protocolo
}
```
