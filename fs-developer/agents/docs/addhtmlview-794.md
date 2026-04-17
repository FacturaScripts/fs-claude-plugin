---
id: 687
permalink: addhtmlview-794
title: addHtmlView()
creationdate: 14-12-2018 00:00:00
lastmod: 15-04-2025
url: https://facturascripts.com/addhtmlview-794
---
La función `addHtmlView()` se utiliza para agregar una pestaña personalizada en FacturaScripts mediante una plantilla HTML específica. Esto brinda una flexibilidad total para mostrar datos de forma personalizada en la interfaz de usuario.

## Ejemplo de Uso

El siguiente ejemplo muestra cómo añadir una pestaña llamada `myproduct` que utiliza la plantilla `view/myproduct.html.twig`. Es necesario crear este archivo en tu plugin.

```php
protected function createViews() {
    $this-&gt;addHtmlView(&#39;myproduct&#39;, &#39;myproduct&#39;, &#39;Producto&#39;, &#39;product&#39;, &#39;fas fa-code-branch&#39;);
}
```

## Parámetros

- **ViewName**: Nombre de la pestaña que se va a crear.
- **TemplateName**: Nombre de la plantilla Twig. Por ejemplo, si la plantilla se llama `miplantilla.html.twig`, solo se debe indicar `miplantilla`.
- **ModelName**: Nombre del modelo a usar. Este parámetro puede ser cualquier valor si no se requiere un modelo específico.
- **Title**: Título que se mostrará en la pestaña. Este título es traducible.
- **Icon**: Ícono que se asociará a la pestaña.

## Uso del Motor de Plantillas Twig

FacturaScripts integra el [motor de plantillas Twig](https://facturascripts.com/publicaciones/las-vistas-html-69), lo que permite aprovechar características como:

- Variables
- Bucles
- Condicionales (if)
- Filtros

Para obtener más información, consulta la [documentación sobre vistas HTML](https://facturascripts.com/publicaciones/las-vistas-html-69).

### Ejemplo Básico en Twig

```twig
{% extends &#39;Master/MenuTemplate.html.twig&#39; %}

{% block body %}
    &lt;h1&gt;Hola Mundo&lt;/h1&gt;
{% endblock %}
```

Esta funcionalidad permite ampliar la capacidad de personalización de la interfaz de FacturaScripts e integrar funcionalidades específicas según las necesidades de cada usuario.
