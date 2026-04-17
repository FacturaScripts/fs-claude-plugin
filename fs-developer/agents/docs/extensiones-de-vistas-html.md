---
id: 1311
permalink: extensiones-de-vistas-html
title: Extensiones de Vistas HTML
creationdate: 03-11-2022 09:50:56
lastmod: 07-04-2026
url: https://facturascripts.com/extensiones-de-vistas-html
---
Podemos añadir ubicaciones a nuestras plantillas twig de tal forma que otro plugin pueda añadir contenido en esa ubicación. **NO es herencia**, no estamos machacando los datos originales, estamos añadiendo contenido extra en una ubicación determinada.

Al crear la plantilla Twig tenemos que proporcionar a dicha plantilla las ubicaciones en las que permitimos que otros programadores puedan extender y añadir contenido.

### Añadir ubicaciones
Esto es un ejemplo de como crear una plantilla llamada **MiPlantilla** con ubicaciones. Llamamos la funcion ``getIncludeViews()``, donde tendremos que pasarle el nombre de la propia plantilla y el nombre de la posición (la posición es un nombre que nos inventaremos).
```
&lt;html&gt;
	&lt;head&gt;
    {% for includeView in getIncludeViews(&#39;MiPlantilla&#39;, &#39;head&#39;) %}
        {% include includeView[&#39;path&#39;] %}
    {% endfor %}
	&lt;/head&gt;
	&lt;body&gt;
    {% for includeView in getIncludeViews(&#39;MiPlantilla&#39;, &#39;body&#39;) %}
        {% include includeView[&#39;path&#39;] %}
    {% endfor %}
		&lt;div id=&quot;menu&quot;&gt;
        {% for includeView in getIncludeViews(&#39;MiPlantilla&#39;, &#39;menu&#39;) %}
            {% include includeView[&#39;path&#39;] %}
        {% endfor %}
		&lt;/div&gt;
	&lt;/body&gt;
&lt;/html&gt;
```
Podremos añadir todas ubicaciones que queramos en nuestras plantillas, para dar mejor y mayor integración con plugins de terceros.

### Extender desde un plugin
Ahora desde nuestro plugin vamos a añadir contenido en la plantilla anterior. Dentro de la carpeta **Extension/View** debemos crear el archivo **MiPlantilla_head.html.twig**. Para cada ubicación que queramos extender tendremos que crear el archivo, por ejemplo: *MiPlantillabody.html.twig y MiPlantillamenu.html.twig.*

Además podriamos añadir una ordenación a los archivos twig. Imaginemos que varios plugins extienden y añaden contenido al mismo archivo ¿que pasa?, por defecto todos los archivos se ordenan por orden alfabético y un número 10 al final, si no hemos establecido nosotros el número. Si queremos asegurarnos que nuestra extesión se cargue antes o después solo debemos renombrar el archivo así: **MiPlantilla_head_05.html.twig, MiPlantilla_body_13.html.twig y MiPlantilla_menu_09.html.twig**.

Notese la **nomenclatura obligatoria** de los archivos: NOMBRE_PLANTILLA_UBICACION TWIG_ORDENACION.html.twig

Ahora en cualquiera de nuestros archivos twig para extender añadimos nuestro código personalizado.

MiPlantilla_head_05.html.twig
```
&lt;title&gt;Extensiones de Vistas HTML&lt;/title&gt;
&lt;meta name=&quot;description&quot; content=&quot;Descripción de la página&quot;/&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;/&gt;
&lt;meta name=&quot;generator&quot; content=&quot;FacturaScripts&quot;/&gt;
```

MiPlantilla_menu_09.html.twig
```
&lt;nav class=&quot;navbar navbar-expand-lg navbar-light bg-light&quot;&gt;
  &lt;a class=&quot;navbar-brand&quot; href=&quot;#&quot;&gt;Navbar&lt;/a&gt;
  &lt;button class=&quot;navbar-toggler&quot; type=&quot;button&quot; data-toggle=&quot;collapse&quot; data-target=&quot;#navbarNav&quot; aria-controls=&quot;navbarNav&quot; aria-expanded=&quot;false&quot; aria-label=&quot;Toggle navigation&quot;&gt;
    &lt;span class=&quot;navbar-toggler-icon&quot;&gt;&lt;/span&gt;
  &lt;/button&gt;
  &lt;div class=&quot;collapse navbar-collapse&quot; id=&quot;navbarNav&quot;&gt;
    &lt;ul class=&quot;navbar-nav&quot;&gt;
      &lt;li class=&quot;nav-item active&quot;&gt;
        &lt;a class=&quot;nav-link&quot; href=&quot;#&quot;&gt;Home &lt;span class=&quot;sr-only&quot;&gt;(current)&lt;/span&gt;&lt;/a&gt;
      &lt;/li&gt;
      &lt;li class=&quot;nav-item&quot;&gt;
        &lt;a class=&quot;nav-link&quot; href=&quot;#&quot;&gt;Features&lt;/a&gt;
      &lt;/li&gt;
      &lt;li class=&quot;nav-item&quot;&gt;
        &lt;a class=&quot;nav-link&quot; href=&quot;#&quot;&gt;Pricing&lt;/a&gt;
      &lt;/li&gt;
      &lt;li class=&quot;nav-item&quot;&gt;
        &lt;a class=&quot;nav-link disabled&quot;&gt;Disabled&lt;/a&gt;
      &lt;/li&gt;
    &lt;/ul&gt;
  &lt;/div&gt;
&lt;/nav&gt;
```
