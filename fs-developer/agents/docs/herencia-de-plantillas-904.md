---
id: 642
permalink: herencia-de-plantillas-904
title: Herencia de plantillas
creationdate: 16-01-2019 00:00:00
lastmod: 29-05-2025
url: https://facturascripts.com/herencia-de-plantillas-904
---
Para que su plantilla herede de otra plantilla twig, simplemente debe usar la función extends:

## Herencia simple
```
{% extends &#39;Master/MenuTemplate.html.twig&#39; %}

{% block body %}
	&lt;h1&gt;Hola mundo&lt;/h1&gt;
{% endblock %}
```
Esta vista hereda de *Master/MenuTemplate.html.twig*, que es la vista de FacturaScripts que incluye el menú superior. Si por el contrario no queremos el menú, podemos heredar de *Master/MicroTemplate.html.twig*

## Reemplazar una plantilla y heredar de ella
Si lo que desea es reemplazar una plantilla, pero heredando de esa misma plantilla, entonces debe usar el **identificador @** para indicar dónde buscar la plantilla:
- Si la plantilla está en Core, el identificador es @Core/
- Si la plantilla está en un plugin, el identificador es @Plugin**NombrePlugin**/

### Ejemplo con @Core/
```
{% extends &#39;@Core/Master/MenuTemplate.html.twig&#39; %}

{% block body %}
	&lt;h1&gt;Hola mundo&lt;/h1&gt;
{% endblock %}
```

### Ejemplo con @PluginNombrePlugin
```
{% extends &quot;@Pluginecommerce/ShoppingCart.html.twig&quot; %}

{% block body %}
	&lt;h1&gt;Hola mundo&lt;/h1&gt;
{% endblock %}
```
