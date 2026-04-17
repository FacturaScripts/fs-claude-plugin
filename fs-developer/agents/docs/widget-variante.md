---
id: 1631
permalink: widget-variante
title: Widget Variante
creationdate: 07-12-2023 23:38:56
lastmod: 01-04-2026
url: https://facturascripts.com/widget-variante
---
El widget Variante permite seleccionar un producto o variante desde el catálogo de productos, donde podemos buscar y filtrar por fabricante y familia.

```
&lt;column name=&quot;reference&quot; numcolumns=&quot;3&quot; order=&quot;110&quot;&gt;
	&lt;widget type=&quot;variante&quot; fieldname=&quot;referencia&quot;/&gt;
&lt;/column&gt;
```

Por defecto usa el campo **referencia**, pero podemos indicar otro campo como idproducto añadiendo el parámetro ``match``:

```
&lt;column name=&quot;product&quot; numcolumns=&quot;3&quot; order=&quot;110&quot;&gt;
	&lt;widget type=&quot;variante&quot; fieldname=&quot;idproducto&quot; match=&quot;idproducto&quot;/&gt;
&lt;/column&gt;
```

Así es como se ve el widget en un formulario de edición.

![widget listado productos](https://i.imgur.com/u07qfy4.png)

Muestra un botón con la referencia del producto seleccionado, al hacer clic mostrará un modal con el **catálogo de productos**, donde podremos buscar y filtrar por fabricante y familia:

![ventana productos](https://i.imgur.com/6jzhIzG.png)
