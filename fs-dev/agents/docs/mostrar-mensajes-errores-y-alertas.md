---
id: 942
permalink: mostrar-mensajes-errores-y-alertas
title: Mostrar mensajes, errores y alertas
creationdate: 09-07-2021 11:06:50
lastmod: 05-09-2025
url: https://facturascripts.com/mostrar-mensajes-errores-y-alertas
---
FacturaScripts permite mostrar mensajes, avisos, alertas y errores desde los controladores o modelos utilizando la clase **Tools**. Asegúrate de incluir la declaración correcta para usar la clase:

```php
use FacturaScripts\Core\Tools;
```

## Mostrar un mensaje

Utiliza el método `notice()` para mostrar mensajes informativos. Por ejemplo:

```php
Tools::log()-&gt;notice(&#39;hola&#39;); // Muestra el mensaje &#39;hola&#39;

// Traduce la cadena &#39;record-updated-correctly&#39; al idioma predeterminado.
Tools::log()-&gt;notice(&#39;record-updated-correctly&#39;);
```

## Mostrar una alerta

Emplea el método `warning()` para mostrar alertas:

```php
Tools::log()-&gt;warning(&#39;hola&#39;); // Muestra &#39;hola&#39;

// Traduce la cadena &#39;access-denied&#39; al idioma predeterminado.
Tools::log()-&gt;warning(&#39;access-denied&#39;);
```

## Mostrar un error

Para indicar errores, utiliza el método `error()`:

```php
Tools::log()-&gt;error(&#39;hola&#39;); // Muestra &#39;hola&#39;

// Traduce la cadena &#39;record-save-error&#39; al idioma predeterminado.
Tools::log()-&gt;error(&#39;record-save-error&#39;);
```

## Mostrar mensajes desde JavaScript

La función `setToast()` en JavaScript permite mostrar mensajes en la vista y acepta cuatro parámetros:

1. **Mensaje**: (obligatorio) Texto a mostrar.
2. **Estilo**: Define el estilo del mensaje. Las opciones incluyen: `completed`, `critical`, `error`, `danger`, `info`, `spinner`, `notice`, `success`, `warning`. Por defecto se utiliza `info`.
3. **Título**: (opcional) Título del mensaje.
4. **Duración**: Tiempo de visualización en milisegundos. Por defecto, 10000 (10 segundos).

Si deseas saber cómo integrar estos mensajes en tu vista HTML, consulta la documentación sobre [Vistas HTML](/publicaciones/las-vistas-html-69).

```html
&lt;script&gt;
setToast(&#39;tu mensaje aquí&#39;, &#39;warning&#39;, &#39;tu título aquí&#39;, 10000);
&lt;/script&gt;
```

## Otros tipos de mensajes

Además de `notice()`, `warning()` y `error()`, la clase **Tools** ofrece otros métodos:

- `debug()`: Agrega mensajes que solo se muestran en la barra de depuración.
- `info()`: Para mensajes informativos adicionales.
- `critical()`: Para errores de mayor gravedad.

## Uso de canales

Por defecto, todos los mensajes se asignan al canal `master`. Sin embargo, es posible especificar un canal diferente al llamar a la función `log()`. Por ejemplo:

```php
Tools::log(&#39;otro-canal&#39;)-&gt;notice(&#39;hola canal&#39;); // El mensaje se añade al canal &#39;otro-canal&#39;
```

## Visualización de logs antiguos

Puedes consultar los logs antiguos desde el menú **Administrador &gt; Logs**. A modo de resumen:

- En el canal `master` se guardan únicamente errores y mensajes críticos.
- En otros canales se almacenan todos los mensajes, excepto los de `debug()`. La retención de estos mensajes se puede configurar desde el **Panel de Control**.

![Historial de logs](https://i.imgur.com/QlxSKHy.png)

![Días de retención de logs](https://i.imgur.com/naRCKf3.png)

## Traducciones

Las traducciones se almacenan en el directorio **Translation** del plugin en archivos JSON. Se pueden gestionar y actualizar desde la sección de traducciones en [la Forja](/forja).

### Uso de traducciones existentes

Si deseas utilizar traducciones ya existentes, visita el [listado de traducciones en español](/EditLanguage?code=es_ES) y selecciona la que mejor se adapte a tus necesidades.
