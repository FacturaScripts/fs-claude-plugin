---
id: 661
permalink: widget-autocomplete-946
title: Guía del Widget Autocomplete
creationdate: 06-10-2018 00:00:00
lastmod: 31-10-2025
url: https://facturascripts.com/publicaciones/widget-autocomplete-946
---

El **Widget Autocomplete** en los archivos **XMLView** permite autocompletar valores asociados a otra tabla o a la misma. A diferencia del [widget select](https://facturascripts.com/publicaciones/widget-select-557), este widget no selecciona opciones predefinidas; los usuarios escriben para que el sistema sugiera posibles valores.

```xml
&lt;column name=&quot;customer&quot; numcolumns=&quot;3&quot; order=&quot;190&quot;&gt;
	&lt;widget type=&quot;autocomplete&quot; fieldname=&quot;codcliente&quot; onclick=&quot;EditCliente&quot;&gt;
		&lt;values source=&quot;clientes&quot; fieldcode=&quot;codcliente&quot; fieldtitle=&quot;nombre&quot;/&gt;
	&lt;/widget&gt;
&lt;/column&gt;
```

## Atributos del Widget

Los siguientes son los atributos disponibles para la etiqueta `&lt;widget&gt;`:

- **fieldname**: Nombre del campo que contiene la información. **Es obligatorio**.
- **required**: Previene el guardado del formulario si no se ingresa un valor en el campo.
- **readonly**: Hace que el campo no sea editable. Si se pone en `dinamic solo se puede editar al crear un nuevo registro.
- **onclick**: URL o controlador al que se redirigirá al usuario al hacer clic. Se añade **?code=** seguido del valor del campo.
- **icon**: [Icono a mostrar en el campo de edición](https://facturascripts.com/publicaciones/iconos-disponibles-308).
- **translate**: Si se establece en true, los títulos de los valores se traducirán automáticamente.
- **strict**: true (predeterminado) para no permitir valores fuera de los dados.

## Ejemplos de Visualización

### En Formularios de Edición

![Widget Autocomplete en edición](https://i.imgur.com/f3ng5Oh.png)

### En Listados

![Widget Autocomplete en listado](https://i.imgur.com/hkjlRxT.png)

## Definición de la Clase

Consulta la lista completa de propiedades y métodos del Widget Autocomplete en la [documentación de la clase WidgetAutocomplete](https://doc.facturascripts.com/classes/FacturaScripts-Core-Lib-Widget-WidgetAutocomplete.html).

## Configuración de Valores

Al igual que el widget select, el Widget Autocomplete requiere una etiqueta `&lt;values&gt;` para definir la fuente de los valores. Las propiedades disponibles para `&lt;values&gt;` son:

- **source**: Nombre de la tabla o modelo a consultar (por ejemplo, Cliente).
- **fieldcode**: Columna que contiene el valor seleccionado. Opcional si `source` es un modelo.
- **fieldtitle**: Columna que contiene el texto mostrado al usuario.
  - Si no se especifica **fieldtitle**, se utiliza **fieldcode**.
  - Opcional si `source` es un modelo.
  - Si **translate** está activado, el texto se traducirá.
- **fieldfilter**: (Opcional) Nombre de otro widget para enlazar resultados.

### Nota

Si se utiliza un modelo en **source** y no se especifican **fieldcode** y **fieldtitle**, se mostrará el ID guardado. Para mostrar el valor correspondiente, es necesario especificar estos atributos.

### Ejemplo de Uso

- Con **source=Contacto**, si no se especifican **fieldcode** y **fieldtitle**, el valor será el ID del contacto.
- Con **fieldcode=&quot;idcontacto&quot;** y **fieldtitle=&quot;nombre&quot;**, se mostrará el nombre completo del contacto.

## Modificación de Valores desde el Controlador

Es posible personalizar los valores devueltos sobrescribiendo el método **autocompleteAction()** en el controlador, el cual devuelve un JSON con los valores para el widget.

## Opciones de Coloreado

Recuerda que [todos los widgets comparten propiedades y opciones comunes](https://facturascripts.com/publicaciones/widget-238).
