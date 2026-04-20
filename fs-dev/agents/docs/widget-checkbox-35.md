---
id: 659
permalink: widget-checkbox-35
title: Widget Checkbox
creationdate: 06-10-2018 00:00:00
lastmod: 31-10-2025
url: https://facturascripts.com/widget-checkbox-35
---
En los **archivos XMLView** podemos usar un widget checkbox, o WidgetCheckbox, para mostrar o editar valores de verdadero o falso.

```
&lt;column name=&quot;email-sent&quot; display=&quot;center&quot; order=&quot;140&quot;&gt;
	&lt;widget type=&quot;checkbox&quot; fieldname=&quot;femail&quot;/&gt;
&lt;/column&gt;
```

Así es cómo se ve el widget checkbox en formularios de edición:

![widget checkbox formulario](https://i.imgur.com/qPomoRs.png)

Y así es cómo se ve el widget checkbox en listados:

![widget checkbox listados](https://i.imgur.com/OonKO4l.png)

## Alineación vertical
Cuando mezcla columnas select, text y checkbox sucede que las checkbox se alinean en la parte de arriba. Puede modificar este comportamiento cambiando la alineación vertical de la [etiqueta group](https://facturascripts.com/publicaciones/group-747) con el **parámetro valign**. Ejemplo:

```
&lt;group name=&quot;data&quot; numcolumns=&quot;12&quot; valign=&quot;bottom&quot;&gt;
    &lt;column name=&quot;name&quot; order=&quot;100&quot;&gt;
        &lt;widget type=&quot;text&quot; fieldname=&quot;nombre&quot; /&gt;
    &lt;/column&gt;
    &lt;column name=&quot;active&quot; order=&quot;110&quot;&gt;
        &lt;widget type=&quot;checkbox&quot; fieldname=&quot;activo&quot; /&gt;
    &lt;/column&gt;
&lt;/group&gt;
```
