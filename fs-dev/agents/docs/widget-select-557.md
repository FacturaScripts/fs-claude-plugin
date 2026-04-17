---
id: 660
permalink: widget-select-557
title: Widget Select
creationdate: 06-10-2018 00:00:00
lastmod: 03-01-2026
url: https://facturascripts.com/widget-select-557
---
El widget select, o WidgetSelect, permite mostrar valores que están relacionados con otras tablas (*o con la misma*). Un ejemplo muy sencillo es un selector de país.

```
&lt;column name=&quot;country&quot; numcolumns=&quot;2&quot; order=&quot;150&quot;&gt;
	&lt;widget type=&quot;select&quot; fieldname=&quot;codpais&quot; required=&quot;true&quot;&gt;
		&lt;values source=&quot;paises&quot; fieldcode=&quot;codpais&quot; fieldtitle=&quot;nombre&quot;/&gt;
	&lt;/widget&gt;
&lt;/column&gt;
```

- **fieldname**: nombre del campo que contiene la información. **Obligatorio**.
- **required**: impide guardar los datos del formulario si el usuario no ha escrito nada en el campo.
- **readonly**: impide modificar el valor.
- **onclick**: URL o controlador al que será redirigido el usuario al hacer clic. A esta URL se le añade **?code=** y el valor del campo.
- **icon**: [icono a mostrar en el campo de edición](/publicaciones/iconos-disponibles-308).
- **translate**: true para indicar que se traduzcan automáticamentelos títulos de los valores a mostrar al usuario.
- **limit**: por defecto hay un máximo del 1000 elementos en el selector, pero se puede especificar un límite distinto.

**Definición de la clase**: puede ver la lista completa de propiedades y métodos del widget select en la [documentación de la clase WidgetSelect](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Widget-WidgetSelect.html).

🎨 **Opciones de coloreado**: recuerde que [todos los widgets tienen una serie de propiedades y opciones comunes](/publicaciones/widget-238).

Así es como se ve el widget select en los formularios de edición:

![widget select edit](https://i.imgur.com/21Ml5vi.png)

Y así es como se ve en los listados:

![widget select list](https://i.imgur.com/0D7zNya.png)

## 🔠 Valores a mostrar
Podemos mostrar los **valores de una tabla** concreta, **valores fijos** o incluso podemos añadir valores manualmente desde el **controlador**.

### Valores fijos
```
&lt;widget type=&quot;select&quot; fieldname=&quot;actualizastock&quot; translate=&quot;true&quot; required=&quot;true&quot;&gt;
	&lt;values title=&quot;book&quot;&gt;-2&lt;/values&gt;
	&lt;values title=&quot;subtract&quot;&gt;-1&lt;/values&gt;
	&lt;values title=&quot;do-nothing&quot;&gt;0&lt;/values&gt;
	&lt;values title=&quot;add&quot;&gt;1&lt;/values&gt;
	&lt;values title=&quot;foresee&quot;&gt;2&lt;/values&gt;
&lt;/widget&gt;
```

### Valores de una tabla
```
&lt;widget type=&quot;select&quot; fieldname=&quot;codpais&quot; required=&quot;true&quot;&gt;
	&lt;values source=&quot;paises&quot; fieldcode=&quot;codpais&quot; fieldtitle=&quot;nombre&quot;/&gt;
&lt;/widget&gt;
```

- **source**: nombre de la tabla a consultar. También podemos poner el nombre de un modelo, por ejemplo Proveedor.
- **fieldcode**: columna de la tabla para el valor seleccionado. Si en source se ha escrito el nombre de un modelo, esta columna es opcional.
- **fieldtitle**: columna de la tabla para el texto a mostrar al usuario.
	- Si no se indica fieldtitle, se usa fieldcode.
	- Si en source se ha escrito el nombre de un modelo, esta columna es opcional (es necesario sobreescribir la funcion [primaryDescriptionColumn()](https://facturascripts.com/publicaciones/primarydescriptioncolumn-955) del modelo o se usa fieldcode).
	- Si se ha indicado translate en el widget, este texto se traducirá.

#### 🔍 Filtrar valores
Si queremos mostrar solamente algunos valores de una tabla, por ejemplo todas las provincias del país seleccionado, podemos usar los parámetros **parent** y **fieldfilter**:

```
&lt;widget type=&quot;select&quot; fieldname=&quot;codpais&quot; required=&quot;true&quot;&gt;
	&lt;values source=&quot;paises&quot; fieldcode=&quot;codpais&quot; fieldtitle=&quot;nombre&quot;/&gt;
&lt;/widget&gt;
&lt;widget type=&quot;select&quot; fieldname=&quot;provincia&quot; parent=&quot;codpais&quot; required=&quot;true&quot;&gt;
	&lt;values source=&quot;provincias&quot; fieldcode=&quot;provincia&quot; fieldtitle=&quot;nombre&quot; fieldfilter=&quot;codpais&quot;/&gt;
&lt;/widget&gt;
```

En el segundo select, el de provincias, estamos mostrando solamente aquellas que coinciden con el país seleccionado.

### ⚙️ Añadir valores desde el controlador
Si necesitamos cargar una lista muy concreta de valores en un widget select, podemos usar el método [setValuesFromArray()](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Widget-WidgetSelect.html#method_setValuesFromArray):

```
$column = $this-&gt;tab(VIEW_NAME)-&gt;columnForName(NAME_DE_LA_COLUMNA_EN_EL_XMLVIEW);
if($column && $column-&gt;widget-&gt;getType() === &#39;select&#39;) {
	$customValues = [
		[&#39;value&#39; =&gt; &#39;1&#39;, &#39;title&#39; =&gt; &#39;UNO&#39;],
		[&#39;value&#39; =&gt; &#39;2&#39;, &#39;title&#39; =&gt; &#39;DOS&#39;],
		[&#39;value&#39; =&gt; &#39;3&#39;, &#39;title&#39; =&gt; &#39;TRES&#39;],
		[&#39;value&#39; =&gt; &#39;14&#39;, &#39;title&#39; =&gt; &#39;CATORCE&#39;],
	];
	$column-&gt;widget-&gt;setValuesFromArray($customValues);
	
	// si entre los valores quieres que esté null, mejor ejecuta eso
	//$column-&gt;widget-&gt;setValuesFromArray($customValues, false, true);
}
```

**¿El widget está en un modal?** Si el select está en un modal, entonces hay que reemplazar la primera línea por esta:

```
$column = $this-&gt;tab(VIEW_NAME)-&gt;columnModalForName(NAME_DE_LA_COLUMNA_EN_EL_XMLVIEW);
```

Sustituir VIEW_NAME por el nombre de la vista/pestaña que sea, y NAME_DE_LA_COLUMNA_EN_EL_XMLVIEW por el name de la columna que contiene el widget en el archivo xmlview.

### Con CodeModel
También podemos usar la clase **CodeModel** para obtener los valores y cargarlos en el widget. Por ejemplo, vamos a cargar una lista con los clientes y su número de teléfono, y entonces usar el método [setValuesFromCodeModel()](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Widget-WidgetSelect.html#method_setValuesFromCodeModel):

```
$column = $this-&gt;tab(VIEW_NAME)-&gt;columnForName(NAME_DE_LA_COLUMNA_EN_EL_XMLVIEW);
if($column && $column-&gt;widget-&gt;getType() === &#39;select&#39;) {
	$customValues = $this-&gt;codeModel-&gt;all(&#39;clientes&#39;, &#39;codcliente&#39;, &#39;telefono1&#39;);
	$column-&gt;widget-&gt;setValuesFromCodeModel($customValues);
}
```

### onChange desde javascript
Si quieres ejecutar código javascript cuando haya cambios en el selector, debes añadirlo así:

```
$(&#39;select[name=&quot;NOMBRE_SELECTOR&quot;]&#39;).on(&#39;change&#39;, function () {
	// tu código aquí
});
```
