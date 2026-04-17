---
id: 641
permalink: las-vistas-html-69
title: Las vistas HTML
creationdate: 01-05-2018 00:00:00
lastmod: 21-05-2025
url: https://facturascripts.com/las-vistas-html-69
---
FacturaScripts utiliza el motor de plantillas **Twig**, un potente sistema que permite el uso de bloques, macros, funciones, extensiones y herencia entre plantillas. Los archivos de las vistas HTML deben tener la extensión **.html.twig** y se deben almacenar en la carpeta **View** del plugin correspondiente.

## Ejemplo de Plantilla: MyNewView.html.twig
Este es un ejemplo básico de plantilla HTML:

```twig
{% extends &quot;Master/MenuTemplate.html.twig&quot; %}

{% block body %}
    {{ parent() }}
    &lt;h1&gt;Hola mundo&lt;/h1&gt;
{% endblock %}

{% block css %}
    {{ parent() }}
{% endblock %}

{% block javascripts %}
    {{ parent() }}
{% endblock %}
```

Esta vista hereda del archivo `Master/MenuTemplate.html.twig`, una plantilla de FacturaScripts que incluye el menú superior. Si prefieres no incluir el menú, puedes heredar de `Master/MicroTemplate.html.twig` para una interfaz más minimalista.

## Selección de Vistas desde el Controlador
Para seleccionar una vista diferente desde el controlador, simplemente llama a la función `setTemplate()` especificando el nombre de la vista, sin la extensión:

```php
$this-&gt;setTemplate(&#39;MyNewView&#39;); // Esto selecciona View/MyNewView.html.twig
```

Si prefieres desactivar la salida HTML, puedes pasar el valor `false` a `setTemplate()`:

```php
$this-&gt;setTemplate(&#39;false&#39;); // Desactiva la salida HTML
```

## Variables Disponibles en la Vista
- **assetManager**: Acceder al JavaScript o CSS cargado desde el controlador.
- **controllerName**: Nombre del controlador ejecutado.
- **fsc**: Referencia al controlador en ejecución, permitiendo el acceso a todas sus propiedades y métodos públicos.
- **log**: Instancia del MiniLog.
- **template**: Nombre de la plantilla cargada actualmente.

Para pasar una variable desde el controlador a la vista, simplemente defínela como pública en el controlador y accede a ella desde la vista:

```twig
{{ fsc.mi_variable }}
```

## Obtener URLs desde la Vista
- Para obtener la URL de la página actual, puedes utilizar la función `url()` proporcionada por el controlador:

```twig
{{ fsc.url() }}
```

- Para obtener la URL de un controlador específico, usa la función `asset()`:

```twig
{{ asset(&#39;ListFacturaCliente&#39;) }}
```

## Acceso al Nombre del Usuario
Para obtener el nombre del usuario actual:

```twig
{{ fsc.user.nick }}
```

## 🈯 Traducir Texto
Usa la función `trans()` para traducir textos al idioma del usuario:

```twig
{{ trans(&#39;save&#39;) }}
```

Para incluir parámetros en la traducción, por ejemplo, cuando quieres incluirlo en la traducción, incluye esos datos como segundo parámetros al llamar a la función:

```twig
{{ trans(&#39;save&#39;, {&#39;code&#39;:&#39;FAC1578&#39;}) }}
```

Y para traducir a un idioma específico, especifica el idioma como tercer parámetro de la función:

```twig
{{ trans(&#39;save&#39;, {}, &#39;de_DE&#39;) }}
```

## 📁 Gestión de Archivos de la Biblioteca
Obten un objeto archivo con su path usando su ID desde la biblioteca:

```twig
{% set file = attachedFile(5) %}
{{ file.path }}
```

## 🔑 Inserción de Tokens en Formularios
Obtén el input con el token necesario para formularios:

```twig
{{ formToken() }}
```

Para obtener sólo el token:

```twig
{{ formToken(false) }}
```

## 🔢 Formateo Avanzado de Números
Para formatear números de acuerdo con los decimales configurados:

```twig
{{ number(20.338547) }}
```

O especifica los decimales manualmente:

```twig
{{ number(20.338547, 4) }}
```

## 💲 Formateo de Precios con Divisa
Formatea números como precios, usando la divisa por defecto del sistema:

```twig
{{ money(15.42) }}
```

Especifica una divisa personalizada:

```twig
{{ money(15.42, &#39;EUR&#39;) }}
```

## ⚙️ Acceso a Parámetros de Configuración
Para obtener configuraciones específicas guardadas:

```twig
{% set divisa = settings(&#39;default&#39;, &#39;coddivisa&#39;) %}
{% set decimales = settings(&#39;default&#39;, &#39;decimals&#39;) %}
```

Incluye un valor por defecto si no se encuentra el dato:

```twig
{% set dias = settings(&#39;default&#39;, &#39;dias&#39;, 7) %}
```

## 🧰 Añadir Funciones Personalizadas
Puedes ampliar la clase `Html` añadiendo funciones desde tu plugin para utilizarlas en cualquier vista Twig. Aquí un ejemplo para añadir una función que devuelve la fecha actual en un formato especificado:

```php
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Html;
use FacturaScripts\Core\Base\InitClass;
use Twig\TwigFunction;

class Init extends InitClass
{
   public function init()
   {
      Html::addFunction(
         new TwigFunction(&#39;fecha&#39;, function (string $format = &#39;Y-m-d H:i:s&#39;) {
            return date($format);
         })
      );
   }
}
```

Modo de uso en la plantilla twig:

```twig
{{ fecha() }}
{{ fecha(&#39;d-m-Y&#39;) }}
```

## Mensajes con `setToast` de JavaScript
Para mostrar animaciones de log, incluye la vista `Toasts` y usa:

```twig
{% include &#39;Macro/Toasts.html.twig&#39; %}

&lt;script&gt;
setToast(&#39;tu mensaje aquí&#39;, &#39;warning&#39;, &#39;tu título aquí&#39;, 10000);
&lt;/script&gt;
```

## Documentación Oficial de Twig
Consulta la documentación completa de Twig en [twig.symfony.com](https://twig.symfony.com/doc/3.x/).
