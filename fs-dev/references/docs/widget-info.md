---
id: 4788
permalink: widget-info
title: Widget Info
creationdate: 15-10-2026 14:08:52
lastmod: 15-10-2026
url: https://facturascripts.com/publicaciones/widget-info
---
En los **archivos XMLView** se puede utilizar el **Widget Info** (WidgetInfo) para mostrar textos informativos, avisos y enlaces dentro de un formulario. A diferencia del resto de widgets, **no está vinculado a ningún campo del modelo**: no muestra ni guarda ningún valor, solo presenta información al usuario.

```xml
&lt;column name=&quot;help&quot; numcolumns=&quot;12&quot; order=&quot;100&quot;&gt;
	&lt;widget type=&quot;info&quot; text=&quot;my-help-text&quot; icon=&quot;fa-solid fa-circle-info&quot;/&gt;
&lt;/column&gt;
```

### Propiedades del Widget Info
- **text**: Texto a mostrar. Se pasa por el [sistema de traducciones](https://facturascripts.com/publicaciones/las-traducciones-en-plugins), así que lo recomendable es indicar una clave de traducción.
- **alert**: Muestra el contenido dentro de una alerta de Bootstrap. Valores admitidos: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light` y `dark`. Si no se indica, o el valor no es válido, se muestra como texto simple.
- **icon**: [Icono a mostrar](https://facturascripts.com/publicaciones/iconos-disponibles-308) a la izquierda del texto.
- **href**: URL de un botón de enlace que se muestra debajo del texto. Admite URLs `http` y `https` y rutas relativas de la aplicación, como `EditSettings` o `?action=...`. Los enlaces externos se abren en una pestaña nueva.
- **btn-text**: Texto del botón de enlace. También se traduce. Si no se indica, el botón muestra la URL.
- **btn-class**: Clase CSS del botón. Si no se indica, se usa la clase que corresponde al tipo de alerta (por ejemplo, `btn-warning` para `alert=&quot;warning&quot;`) o `btn-secondary` si no hay alerta.
- **template**: Ruta de una vista Twig propia, relativa a la carpeta **View** y sin la extensión `.html.twig`. Si se indica, se renderiza esa vista y se ignoran el resto de opciones. La vista recibe el modelo en la variable **model**.
- **class**: Clases CSS adicionales para el contenedor.
- **fieldname**: Opcional. Este widget no usa ningún campo.

### Ejemplos

Un aviso con un botón que lleva a otra página de la aplicación:

```xml
&lt;column name=&quot;warning&quot; numcolumns=&quot;12&quot; order=&quot;100&quot;&gt;
	&lt;widget type=&quot;info&quot; alert=&quot;warning&quot; icon=&quot;fa-solid fa-triangle-exclamation&quot;
		text=&quot;configure-company-first&quot; href=&quot;EditEmpresa?code=1&quot; btn-text=&quot;edit-company&quot;/&gt;
&lt;/column&gt;
```

Un aviso con un enlace externo, que se abre en una pestaña nueva:

```xml
&lt;column name=&quot;docs&quot; numcolumns=&quot;12&quot; order=&quot;110&quot;&gt;
	&lt;widget type=&quot;info&quot; alert=&quot;info&quot; icon=&quot;fa-solid fa-book&quot; text=&quot;read-the-documentation&quot;
		href=&quot;https://facturascripts.com&quot; btn-text=&quot;documentation&quot;/&gt;
&lt;/column&gt;
```

Una vista Twig propia, para mostrar información calculada a partir del registro:

```xml
&lt;column name=&quot;summary&quot; numcolumns=&quot;12&quot; order=&quot;120&quot;&gt;
	&lt;widget type=&quot;info&quot; template=&quot;Block/MyPluginSummary&quot;/&gt;
&lt;/column&gt;
```

En este caso se renderiza la vista **View/Block/MyPluginSummary.html.twig** de tu plugin, que puede usar `{{ model.codcliente }}` y el resto de propiedades del registro. Si la vista no existe o falla al renderizarse, se muestra el nombre de la plantilla en una alerta roja y el error queda registrado en el log.

### Visualización
- **En un formulario de edición** se muestra el texto, con su icono y botón, como texto simple o dentro de una alerta. No se muestra el título de la columna ni se genera ningún campo de formulario. Si no hay texto ni enlace, no se muestra nada.
- **En un listado** solo se muestra el texto traducido, o la vista Twig si se ha indicado `template`.
- **Al guardar el formulario** el widget se ignora: no modifica ningún campo del modelo.

Texto simple con icono, sin alerta:

![Widget Info como texto simple con icono](https://facturascripts.com/MyFiles/2026/10/7728_captura_de_pantalla_2026_10_15_180257.png?myft=7de22dbf89105b9a9b9cc032c937ce1fc5a11276)

Aviso con alerta `warning` y botón que lleva a otra página de la aplicación:

![Widget Info con alerta warning y botón de enlace interno](https://facturascripts.com/MyFiles/2026/10/7729_captura_de_pantalla_2026_10_15_180305.png?myft=b14280511dad4494c28268d319263ca9b7312a7a)

Aviso con alerta `info` y botón de enlace externo, que se abre en una pestaña nueva:

![Widget Info con alerta info y botón de enlace externo](https://facturascripts.com/MyFiles/2026/10/7730_captura_de_pantalla_2026_10_15_180310.png?myft=d191e1a75c8c75672676ea9f23a13f77d5c366e4)

Vista Twig propia, con datos del registro:

![Widget Info con una vista Twig propia que muestra datos del cliente](https://facturascripts.com/MyFiles/2026/10/7731_captura_de_pantalla_2026_10_15_180313.png?myft=a93b13d346e5af061137df8648b00c1560fb60dc)

Recuerda que [todos los widgets tienen una serie de propiedades y opciones comunes](https://facturascripts.com/publicaciones/widget-238).