---
id: 645
permalink: rows-304
title: Rows (XMLView)
creationdate: 07-05-2018 00:00:00
lastmod: 28-05-2025
url: https://facturascripts.com/publicaciones/rows-304
---

Dentro de la etiqueta rows de los **archivos XMLView** va la configuración u opciones especiales de la interfaz, como por ejemplo los colores a aplicar a las filas, botones a añadir a la interfaz, etc. Estas opciones las definimos mediante **etiquetas row**.

```
&lt;rows&gt;
	&lt;row type=&quot;status&quot;&gt;
		&lt;option color=&quot;info&quot; fieldname=&quot;importe&quot;&gt;0&lt;/option&gt;
		&lt;option color=&quot;success&quot; fieldname=&quot;importe&quot;&gt;gt:1000&lt;/option&gt;
		&lt;option color=&quot;warning&quot; fieldname=&quot;editable&quot;&gt;1&lt;/option&gt;
	&lt;/row&gt;
	&lt;row type=&quot;actions&quot;&gt;
		&lt;button type=&quot;action&quot; label=&quot;renumber&quot; color=&quot;warning&quot; action=&quot;renumber&quot; icon=&quot;fas fa-sort-numeric-down&quot;/&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```

## Type único
No podemos incluir dos veces el mismo tipo de row, es decir, si ya tienes un row type=&quot;status&quot;, no puedes añadir otro.
