---
id: 1636
permalink: widget-radio
title: Widget Radio
creationdate: 14-12-2023 16:49:31
lastmod: 10-01-2026
url: https://facturascripts.com/widget-radio
---
El **Widget Radio** permite a los usuarios elegir entre varias opciones de manera visual. En todo momento, se pueden ver todas las opciones disponibles sin necesidad de desplegar ningún menú.

### ⚙️ Parámetros del Widget

- **fieldname**: Nombre del campo que contiene la información. **Obligatorio**.
- **required**: Impide guardar los datos del formulario si el usuario no ha ingresado nada en el campo.
- **readonly**: Impide modificar el valor del campo.
- **onclick**: URL o controlador al que será redirigido el usuario al hacer clic. A esta URL se le añadirá **?code=** seguido del valor del campo.
- **translate**: Indica si los títulos de los valores a mostrar al usuario deben ser traducidos automáticamente. Establecer en `true` para activar la traducción.

### 🖼️ Valores a Mostrar

Se pueden mostrar **valores fijos** o añadir valores manualmente desde el **controlador**.

#### Valores Fijos

```html
&lt;column name=&quot;template&quot; numcolumns=&quot;12&quot; order=&quot;100&quot;&gt;
    &lt;widget type=&quot;radio&quot; fieldname=&quot;template&quot; required=&quot;true&quot;&gt;
        &lt;values title=&quot;book&quot;&gt;book&lt;/values&gt;
        &lt;values title=&quot;subtract&quot;&gt;subtract&lt;/values&gt;
        &lt;values title=&quot;do-nothing&quot;&gt;do-nothing&lt;/values&gt;
        &lt;values title=&quot;add&quot;&gt;add&lt;/values&gt;
        &lt;values title=&quot;foresee&quot;&gt;foresee&lt;/values&gt;
    &lt;/widget&gt;
&lt;/column&gt;
```

*Tambié se puede especificar el campo `class` para que los botones se muestren en línea utilizando: `form-check-inline`.*

![](https://i.imgur.com/i2njCkq.png)

#### Valores con Imágenes

Se pueden mostrar imágenes en lugar de texto para la selección. Para esto, hay que habilitar la opción de imágenes con **images=&quot;true&quot;** y especificar la ruta donde se encuentran las imágenes en formato **.png** usando **path=&quot;tu-ruta&quot;**.

En el atributo `title` de la etiqueta `&lt;values&gt;` se coloca el nombre del archivo sin la extensión.

```html
&lt;column name=&quot;template&quot; numcolumns=&quot;12&quot; order=&quot;100&quot;&gt;
    &lt;widget type=&quot;radio&quot; images=&quot;true&quot; path=&quot;/Dinamic/Assets/Images/PlantillasPDF/&quot; fieldname=&quot;template2&quot; required=&quot;true&quot;&gt;
        &lt;values title=&quot;template1&quot;&gt;template1.png&lt;/values&gt;
        &lt;values title=&quot;template2&quot;&gt;template2.png&lt;/values&gt;
        &lt;values title=&quot;template3&quot;&gt;template3.png&lt;/values&gt;
        &lt;values title=&quot;template4&quot;&gt;template4.png&lt;/values&gt;
    &lt;/widget&gt;
&lt;/column&gt;
```
