---
id: 90
permalink: nueva-clase-toolbox-para-agrupar-log-traductor-y-varias-herramientas
title: Nueva clase ToolBox para agrupar log, traductor y varias herramientas más
creationdate: 22-08-2019 20:06:06
lastmod: 23-10-2019
url: https://facturascripts.com/publicaciones/nueva-clase-toolbox-para-agrupar-log-traductor-y-varias-herramientas
---

Al comienzo del desarrollo evaluamos usar un contenedor para almacenar las herramientas más utilizadas, como son el logger y el traductor. Pero esa solución tenía un problema, al hacer $this-&gt;get(&#39;logger&#39;) NetBeans no sabía que eso devuelve un objeto de la clase MiniLog y por tanto no mostraba la lista de métodos disponibles. Por este motivo se descartó.

Esta semana hemos estado modificando el logger y hemos buscado una solución alternativa para agrupar estas herramientas: la clase [ToolBox](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Base/ToolBox.php), que tiene un método para cada una de las herramientas más utilizadas. Hemos añadido el método **toolBox()** a controladores y modelos (a las clases base) para poder acceder más cómodamente. **Estos cambios estarán disponibles a partir de FacturaScripts 2018.09**.

## Obtener el traductor desde un controlador o modelo
```
$i18n = $this-&gt;toolBox()-&gt;i18n();
```
También podemos pasar el código de un idioma como parámetro para obtener un traductor para ese idioma:
```
$i18n = $this-&gt;toolBox()-&gt;i18n(&#39;en_EN&#39;);
```
Obtener la traducción (al idioma predeterminado) de una cadena, por ejemplo &#39;no-data&#39;:
```
$translation = $this-&gt;toolBox()-&gt;i18n()-&gt;trans(&#39;no-data&#39;);
```

## Añadir un mensaje de error al log
```
$this-&gt;toolBox()-&gt;log()-&gt;error(&#39;mi mensaje&#39;);
```
También permite especificar un canal como parámetro:
```
$this-&gt;toolBox()-&gt;log(&#39;mi-canal&#39;)-&gt;error(&#39;mi mensaje&#39;);
```

## Añadir un mensaje de error al log, pero con traducción automática
Sucede que la mayoría de veces que queremos escribir algo en el log, lo queremos traducido. En estos casos debíamos combinar una llamada al log con una al traductor. Para hacernos la vida más fácil hemos creado una clase que traduce automáticamente los mensajes antes de añadirlos al log. Y esta clase se puede llamar directamente desde toolBox():
```
$this-&gt;toolBox()-&gt;i18nLog()-&gt;error(&#39;my-message&#39;);
```
También permite especificar un canal como parámetro:
```
$this-&gt;toolBox()-&gt;i18nLog(&#39;mi-canal&#39;)-&gt;error(&#39;my-message&#39;);
```

## Obtener valores de las preferencias de la aplicación
La divisa predeterminada, la forma de pago, etc... se configuran desde las preferencias de la aplicación en el panel de control. Podemos obtener estos valores con la clase AppSettings, que ahora también es accesible desde toolBox().

Vamos a obtener la divisa predeterminada:
```
$coddivisa = $this-&gt;toolBox()-&gt;appSettings()-&gt;get(&#39;default&#39;, &#39;coddivisa&#39;);
```

## Acceso a la caché
Podemos guardar valores en caché:
```
$this-&gt;toolBox()-&gt;cache()-&gt;set(&#39;mi-clave&#39;, 1234);
```
Y por supuesto, también podemos leerlos:
```
$value = $this-&gt;toolBox()-&gt;cache()-&gt;get(&#39;mi-clave&#39;);
```

## Operaciones con divisas
Podemos formatear una cantidad en la divisa predeterminada:
```
$string = $this-&gt;toolBox()-&gt;coins()-&gt;format(1234.56);
/// 1 234,55 €
```
O convertir una cantidad de euros a USD:
```
$string = $this-&gt;toolBox()-&gt;coins()-&gt;convert(100, &#39;EUR&#39;, &#39;USD&#39;);
```

## Todos los métodos disponibles en toolBox()
- appSettings() : acceso a las preferencias de la aplicación.
- cache() : acceso a la caché.
- coins() : operaciones con divisas.
- events() : acceso al gestor de eventos.
- files() : operaciones con archivos o carpetas.
- i18n() : traductor.
- i18nLog() : logger con traducción automática.
- ipFilter() : operaciones con IP.
- log() : logger.
- numbers() : operaciones con números.
- utils() : conjunto de funciones random.
