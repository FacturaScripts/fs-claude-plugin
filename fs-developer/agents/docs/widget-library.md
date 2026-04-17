---
id: 1627
permalink: widget-library
title: Widget Library
creationdate: 06-12-2023 20:55:37
lastmod: 31-10-2025
url: https://facturascripts.com/widget-library
---
El widget de archivos adjuntos, conocido como **WidgetLibrary**, permite seleccionar o subir archivos adjuntos. Este widget es ideal cuando se desea que el usuario suba un archivo específico, como un logotipo o similar.

### Ejemplo de uso

Aquí tienes un ejemplo de cómo implementar el widget en un formulario:

```html
&lt;column name=&quot;logo&quot; numcolumns=&quot;3&quot; order=&quot;100&quot;&gt;
    &lt;widget type=&quot;library&quot; fieldname=&quot;id_logo&quot; accept=&quot;.gif,.jpg,.png&quot;/&gt;
&lt;/column&gt;
```

### Atributos del Widget

Los atributos disponibles en la etiqueta del widget son los siguientes:

- **fieldname**: Nombre del campo que contiene la información. **Obligatorio**.
- **accept**: Lista de extensiones permitidas, como por ejemplo `.gif`, `.jpg` y `.png`.
- **onclick**: URL o controlador al que será redirigido el usuario al hacer clic en el widget. A esta URL se le añade **?code=** seguido del valor del campo.

### Visualización en Formularios

Así es como se visualiza este widget en los **formularios de edición**: muestra un botón con el nombre del archivo seleccionado. Al pulsar este botón, se abre un modal donde se puede buscar archivos en la biblioteca o añadir nuevos.

![Widget Library](https://i.imgur.com/v5v6vAn.png)

### Visualización en Listados

En los **listados**, el widget muestra el nombre del archivo seleccionado:

![Listado Widget Biblioteca](https://i.imgur.com/pcQdhem.png)
