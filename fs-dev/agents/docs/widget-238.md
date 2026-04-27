---
id: 653
permalink: widget-238
title: Widget (XMLView)
creationdate: 07-05-2018 00:00:00
lastmod: 01-04-2026
url: https://facturascripts.com/publicaciones/widget-238
---

El **widget** es un componente que pertenece a una columna y se encarga de representar el contenido. Cada columna puede contener únicamente un widget.

```xml
&lt;column name=&quot;code&quot; numcolumns=&quot;4&quot; order=&quot;100&quot;&gt;
    &lt;widget type=&quot;text&quot; fieldname=&quot;codigo&quot;/&gt;
&lt;/column&gt;
```

## Propiedades Comunes

- **type**: Especifica el tipo de widget. Si FacturaScripts no encuentra una clase adecuada, se carga un widget de tipo texto por defecto.
- **fieldname**: Nombre del campo que almacena la información. **Este campo es obligatorio**.
- **required**: Si se activa, se impide guardar los datos del formulario si el usuario no ha ingresado información en el campo.
- **readonly**: Esta propiedad impide la modificación del valor del campo. Los valores posibles son: `true`, `false`, `dynamic`.
- **onclick**: URL o controlador al que se redirige al usuario al hacer clic. A esta URL se le añade `?code=` seguido del valor del campo.
- **fieldclick**: Si se informa un *onclick* es posible indicar sobre que campo se ejecutará. Si no se informa se usará el valor de *fieldname*.

## Opciones de Coloreo

Similar a las [status row types](https://facturascripts.com/publicaciones/row-status-477), se pueden implementar opciones de coloreo para el contenido del widget:

```xml
&lt;widget type=&quot;text&quot; fieldname=&quot;estado&quot;&gt;
    &lt;option color=&quot;success&quot;&gt;ABIERTO&lt;/option&gt;
    &lt;option color=&quot;warning&quot;&gt;CERRADO&lt;/option&gt;
&lt;/widget&gt;
```

### Colores Disponibles

- **info**: Azul
- **success**: Verde
- **warning**: Amarillo
- **danger**: Rojo
- **light**: Gris claro
- **secondary**: Negro

### Operadores Especiales

- Si el valor comienza con `gt:`: Se aplica si el valor del campo del modelo es **mayor que** el indicado.
- Si el valor comienza con `gte:`: Se aplica si el valor del campo del modelo es **mayor o igual que** el indicado.
- Si el valor comienza con `lt:`: Se aplica si el valor del campo del modelo es **menor que** el indicado.
- Si el valor comienza con `lte:`: Se aplica si el valor del campo del modelo es **menor o igual que** el indicado.
- Si el valor comienza con `neq:`: Se aplica si el valor del campo del modelo es **distinto de** el indicado.
- Si el valor es `null:`: Se aplica si el valor del campo del modelo **es nulo**.
- Si el valor es `notnull:`: Se aplica si el valor del campo del modelo **no es nulo**.
- Para cualquier otro caso, se lleva a cabo una verificación de igualdad, es decir, se comprueba que el valor del campo del modelo sea **igual** al indicado.

## Tipos de Widgets

El núcleo de FacturaScripts incluye los siguientes tipos de widgets: **text**, **textarea**, **password**, **number**, **money**, **autocomplete**, **select**, **checkbox**, **date**, y **file**. Además, cada plugin puede añadir nuevos tipos de widgets o personalizar los existentes en el núcleo.
