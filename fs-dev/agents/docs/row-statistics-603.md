---
id: 647
permalink: row-statistics-603
title: Row statistics
creationdate: 07-05-2018 00:00:00
lastmod: 10-03-2026
url: https://facturascripts.com/row-statistics-603
---
Este tipo de row permite definir botones o etiquetas que muestran datos calculados en el momento por el controlador. Estas etiquetas se definen con la etiqueta **datalabel** que tiene estos atributos:
- **icon**: [icono de la etiqueta](https://facturascripts.com/publicaciones/iconos-disponibles-308).
- **label**: texto del botón. **Se traducirá automáticamente**.
- **function**: nombre de la función del controlador que se ejecuta para devolver el texto a visualizar.
- **link**: URL destino, donde se redigirá al usuario al hacer click sobre el botón.

### Ejemplo:
```
&lt;rows&gt;
	&lt;row type=&quot;statistics&quot;&gt;
		&lt;datalabel icon=&quot;fa fa-copy&quot; label=&quot;Alb. Pdtes:&quot; function=&quot;nombre_function&quot; link=&quot;#&quot;/&gt;
		&lt;datalabel icon=&quot;fa fa-copy&quot; label=&quot;Pdte Cobro:&quot; function=&quot;nombre_function&quot; link=&quot;#&quot;/&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```
