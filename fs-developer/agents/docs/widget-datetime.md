---
id: 1286
permalink: widget-datetime
title: Widget Datetime
creationdate: 30-09-2022 13:00:01
lastmod: 31-10-2025
url: https://facturascripts.com/widget-datetime
---
En los **archivos XMLView** podemos usar un widget de fecha y hora, o WidgetDatetime, para mostrar o editar fecha y hora a la vez.

```
&lt;column name=&quot;creation-date&quot; display=&quot;right&quot; order=&quot;190&quot;&gt;
	&lt;widget type=&quot;datetime&quot; fieldname=&quot;creationdate&quot;/&gt;
&lt;/column&gt;
```

Estos son los atributos disponibles en la etiqueta widget:
- **fieldname**: nombre del campo que contiene la información. **Obligatorio**.
- **required**: impide guardar los datos del formulario si el usuario no ha escrito nada en el campo.
- **readonly**: impide modificar el valor.

Así es cómo se ve el widget datetime en los formularios de edición. Aunque dependiendo del navegador puede variar su aspecto:

![widget datetime](https://i.imgur.com/Oyv8nra.png)

Y así es como se ve el widget datetime en los listados:

![widget datetime](https://i.ibb.co/6J4tJQ9/datetime.png)
