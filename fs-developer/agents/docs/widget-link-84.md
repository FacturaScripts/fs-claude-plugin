---
id: 664
permalink: widget-link-84
title: Widget Link
creationdate: 07-11-2018 00:00:00
lastmod: 31-10-2025
url: https://facturascripts.com/widget-link-84
---
El widget **Link** se puede utilizar dentro de una columna de un **archivo XMLView** para añadir un enlace que nos llevará a la URL especificada en el campo `fieldname`.

```xml
&lt;column name=&quot;web&quot; order=&quot;130&quot;&gt;
	&lt;widget type=&quot;link&quot; fieldname=&quot;web&quot;/&gt;
&lt;/column&gt;
```

## Visualización en formularios de edición

En los formularios de edición, la etiqueta del campo se convierte en un enlace que apunta al contenido del campo `fieldname` del modelo. En este ejemplo, el campo es `web`.

![widget link edit](https://i.imgur.com/lBXbKxd.png)

## Visualización en listados

En las listados, el widget se muestra de la siguiente manera:

![widget link list](https://i.imgur.com/ZCKXg9n.png)

## Funcionamiento

Al mostrar este widget en pantalla, se generará un enlace a la URL especificada en el campo correspondiente de la base de datos (`fieldname`). El enlace se abrirá en una nueva ventana o pestaña.

### Diferencias con el atributo onclick

La diferencia entre el widget Link y el atributo `onclick` de otros widgets es la siguiente:

- Con el widget Link, el enlace apunta directamente al contenido del campo; si el campo es `web`, entonces lo que contenga el campo `web` del modelo será el enlace.
- Con el atributo `onclick`, se combina la acción que indiques con el contenido del campo `fieldname`. Esto se entiende mejor con un ejemplo:

#### Ejemplo con Widget Link:
```xml
&lt;column name=&quot;web&quot; order=&quot;130&quot;&gt;
	&lt;widget type=&quot;link&quot; fieldname=&quot;web&quot;/&gt;
&lt;/column&gt;
```
Si el campo `web` contiene `https://www.google.es`, el enlace apuntará a esa URL.

#### Ejemplo con Widget Text y onclick:
```xml
&lt;column name=&quot;web&quot; order=&quot;130&quot;&gt;
	&lt;widget type=&quot;text&quot; fieldname=&quot;codcliente&quot; onclick=&quot;https://www.google.es?q=&quot;/&gt;
&lt;/column&gt;
```
Si en el campo `web` tienes `&#39;4567&#39;`, el enlace apuntará a `/ruta-fs/https://www.google.es?q=?code=4567`.
