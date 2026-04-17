---
id: 656
permalink: widget-textarea-699
title: Widget Textarea
creationdate: 06-10-2018 00:00:00
lastmod: 31-10-2025
url: https://facturascripts.com/widget-textarea-699
---
El widget de textarea, o WidgetTextarea, permite mostrar y editar contenido como texto plano, pero con varias diferencias respecto al [widget text](/publicaciones/widget-text-96):
- El texto puede ser **mucho más largo y con múltiples líneas**.
- Los textos largos son **acortados automáticamente** al mostrarlos en listados.

```
&lt;column name=&quot;observations&quot; numcolumns=&quot;12&quot; order=&quot;100&quot;&gt;
	&lt;widget type=&quot;textarea&quot; fieldname=&quot;observaciones&quot;/&gt;
&lt;/column&gt;
```

Estos son los atributos disponibles en la etiqueta widget:
- **fieldname**: nombre del campo que contiene la información. **Obligatorio**.
- **required**: impide guardar los datos del formulario si el usuario no ha escrito nada en el campo.
- **readonly**: impide modificar el valor.
- **onclick**: URL o controlador al que será redirigido el usuario al hacer clic. A esta URL se le añade **?code=** y el valor del campo.
- **maxlength**: longitud máxima del texto.
- **rows**: altura del cuadro de texto, en líneas.

Así es como se ve el widget textarea en los formularios de edición:

![widget textarea edit](https://i.imgur.com/tw4OZZ9.png)

Y así es como se ve el widget textarea en los listados. Nótese como el texto aparece recortado.

![widget textarea list](https://i.imgur.com/RGEsFQl.png)
