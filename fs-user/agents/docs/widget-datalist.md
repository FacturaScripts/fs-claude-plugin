---
id: 1064
permalink: widget-datalist
title: Widget Datalist
creationdate: 03-03-2022 09:46:21
lastmod: 31-10-2025
url: https://facturascripts.com/widget-datalist
---
El **Widget Datalist**, también conocido como **WidgetList**, es una especialización del [WidgetSelect](https://facturascripts.com/publicaciones/widget-select-557) que permite mostrar valores relacionados con otras tablas (o incluso con la misma tabla) en función del texto introducido por el usuario. A diferencia de mostrar la lista completa de valores, este widget presenta una lista de posibles coincidencias conforme el usuario escribe.

## Ejemplo Básico

Un ejemplo sencillo es un selector de ciudad en el menú **Administrador &gt; Empresas** al elegir una empresa:

```xml
&lt;column name=&quot;city&quot; numcolumns=&quot;4&quot; order=&quot;130&quot;&gt;
	&lt;widget type=&quot;datalist&quot; fieldname=&quot;ciudad&quot;&gt;
		&lt;values source=&quot;ciudades&quot; fieldcode=&quot;ciudad&quot; fieldtitle=&quot;ciudad&quot; limit=&quot;9000&quot;/&gt;
	&lt;/widget&gt;
&lt;/column&gt;
```

![Widget Datalist en el campo Ciudad](https://i.imgur.com/oCU4ONH.gif)

## Ejemplo de Selectores Anidados

El **datalist** también es útil para crear selectores anidados. Por ejemplo, para que las provincias se carguen una vez que se selecciona un país, el código del datalist sería:

```xml
&lt;column name=&quot;province&quot; numcolumns=&quot;4&quot; order=&quot;140&quot;&gt;
	&lt;widget type=&quot;datalist&quot; fieldname=&quot;provincia&quot; parent=&quot;codpais&quot;&gt;
		&lt;values source=&quot;provincias&quot; fieldcode=&quot;provincia&quot; fieldtitle=&quot;provincia&quot; fieldfilter=&quot;codpais&quot;/&gt;
	&lt;/widget&gt;
&lt;/column&gt;
```

En este ejemplo, utilizamos las propiedades **parent** y **fieldfilter**.

## Propiedades del Widget

Las propiedades disponibles en la etiqueta del widget son:

- **fieldname**: Nombre del campo que contiene la información. **Obligatorio**.
- **required**: Impide guardar los datos del formulario si el usuario no ha escrito nada en el campo.
- **readonly**: Impide modificar el valor.
- **onclick**: URL o controlador al que será redirigido el usuario al hacer clic, añadiendo **?code=** y el valor del campo a esta URL.
- **icon**: [Icono a mostrar en el campo de edición](https://facturascripts.com/publicaciones/iconos-disponibles-308).
- **translate**: Establecer en true para traducir automáticamente los títulos de los valores a mostrar al usuario.
- **parent**: Indica el **fieldname** del widget si el datalist depende de otro widget datalist o select.
- **fieldfilter**: Campo del datalist o select que se utiliza para filtrar la información del datalist actual.

## Definición de la Clase

Consulta la lista completa de propiedades y métodos del widget select en la [documentación de la clase WidgetDatalist](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Widget-WidgetDatalist.html).

## Opciones de Coloreado

Recuerda que [todos los widgets tienen una serie de propiedades y opciones comunes](https://facturascripts.com/publicaciones/widget-238).

## Valores a Mostrar

Podemos mostrar **valores de una tabla** concreta, **valores fijos** o incluso añadir valores manualmente desde el **controlador**.

### Valores de una Tabla

```xml
&lt;widget type=&quot;datalist&quot; fieldname=&quot;codpais&quot; required=&quot;true&quot;&gt;
	&lt;values source=&quot;paises&quot; fieldcode=&quot;codpais&quot; fieldtitle=&quot;nombre&quot;/&gt;
&lt;/widget&gt;
```

- **source**: Nombre de la tabla a consultar. También se puede usar el nombre de un modelo, por ejemplo, **Proveedor**.
- **fieldcode**: Columna de la tabla para el valor seleccionado. Esta columna es opcional si en **source** se ha escrito el nombre de un modelo.
- **fieldtitle**: Columna de la tabla para el texto a mostrar al usuario. Si no se indica, se utiliza **fieldcode**. Esta columna es opcional en el caso de modelos.
	- Si se ha indicado **translate** en el widget, este texto será traducido.

### Valores Fijos

```xml
&lt;widget type=&quot;datalist&quot; fieldname=&quot;actualizastock&quot; translate=&quot;true&quot; required=&quot;true&quot;&gt;
	&lt;values title=&quot;book&quot;&gt;-2&lt;/values&gt;
	&lt;values title=&quot;subtract&quot;&gt;-1&lt;/values&gt;
	&lt;values title=&quot;do-nothing&quot;&gt;0&lt;/values&gt;
	&lt;values title=&quot;add&quot;&gt;1&lt;/values&gt;
	&lt;values title=&quot;foresee&quot;&gt;2&lt;/values&gt;
&lt;/widget&gt;
```

### Añadir Valores desde el Controlador

Para cargar una lista específica de valores en un widget datalist, se puede usar el método [setValuesFromArray()](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Widget-WidgetDatalist.html#method_setValuesFromArray):

```php
$column = $this-&gt;views[VIEW_NAME]-&gt;columnForName(NAME_DE_LA_COLUMNA_EN_EL_XMLVIEW);
if($column && $column-&gt;widget-&gt;getType() === &#39;datalist&#39;) {
	$customValues = [
		[&#39;value&#39; =&gt; &#39;1&#39;, &#39;title&#39; =&gt; &#39;UNO&#39;],
		[&#39;value&#39; =&gt; &#39;2&#39;, &#39;title&#39; =&gt; &#39;DOS&#39;],
		[&#39;value&#39; =&gt; &#39;3&#39;, &#39;title&#39; =&gt; &#39;TRES&#39;],
		[&#39;value&#39; =&gt; &#39;14&#39;, &#39;title&#39; =&gt; &#39;CATORCE&#39;],
	];
	$column-&gt;widget-&gt;setValuesFromArray($customValues);
	
	// Para incluir un valor null, usa la siguiente línea:
	// $column-&gt;widget-&gt;setValuesFromArray($customValues, false, true);
}
```

Recuerda sustituir **VIEW_NAME** por el nombre de la vista/pestaña correspondiente, y **NAME_DE_LA_COLUMNA_EN_EL_XMLVIEW** por el nombre de la columna que contiene el widget en el archivo xmlview.

### Con CodeModel

También es posible utilizar la clase **CodeModel** para obtener valores y cargarlos en el widget. Por ejemplo, para cargar una lista de clientes y sus números de teléfono, se utilizará el método [setValuesFromCodeModel()](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Widget-WidgetDatalist.html#method_setValuesFromCodeModel):

```php
$column = $this-&gt;views[VIEW_NAME]-&gt;columnForName(NAME_DE_LA_COLUMNA_EN_EL_XMLVIEW);
if($column && $column-&gt;widget-&gt;getType() === &#39;datalist&#39;) {
	$customValues = $this-&gt;codeModel-&gt;all(&#39;clientes&#39;, &#39;codcliente&#39;, &#39;telefono1&#39;);
	$column-&gt;widget-&gt;setValuesFromCodeModel($customValues);
}
```
