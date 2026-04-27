---
id: 651
permalink: modals-718
title: Modals (XMLView)
creationdate: 07-05-2018 00:00:00
lastmod: 28-05-2025
url: https://facturascripts.com/publicaciones/modals-718
---

Los formularios modales son vistas complementarias a la vista principal, que permanecen ocultas hasta que se pulsa su **botón de tipo modal**. Estos formularios se declaran de manera muy similar a lo detallado en la sección COLUMNS. Podemos definir todos los modals que necesitemos, simplemente añadiendo grupos (etiqueta group) dentro de la etiqueta modals del XMLView.

## Ejemplo de modal:
```
&lt;modals&gt;
	&lt;group name=&quot;test&quot; title=&quot;other-data&quot; icon=&quot;fas fa-users&quot;&gt;
		&lt;column name=&quot;name&quot; numcolumns=&quot;12&quot; description=&quot;desc-custommer-name&quot;&gt;
			&lt;widget type=&quot;text&quot; fieldname=&quot;nombre&quot; required=&quot;true&quot; /&gt;
		&lt;/column&gt;
		&lt;column name=&quot;create-date&quot; numcolumns=&quot;6&quot;&gt;
			&lt;widget type=&quot;date&quot; fieldname=&quot;fechaalta&quot; readonly=&quot;true&quot; /&gt;
		&lt;/column&gt;
		&lt;column name=&quot;blocked-date&quot; numcolumns=&quot;6&quot;&gt;
			&lt;widget type=&quot;date&quot; fieldname=&quot;fechabaja&quot; /&gt;
		&lt;/column&gt;
	&lt;/group&gt;
&lt;/modals&gt;
```

### Mostrar un modal
Para mostrar un modal que ya hayamos definido en **modals** debemos definir un **botón de tipo modal** en un row type actions, header o footer. Además este botón debe indicar el nombre del modal en su **propiedad action**.

#### Ejemplo:
```
&lt;rows&gt;
	&lt;row type=&quot;actions&quot;&gt;
		&lt;button type=&quot;modal&quot; label=&quot;mostrar&quot; color=&quot;warning&quot; action=&quot;test&quot; /&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```

### Modal de distinto tamaño
Podemos mostrar una ventana de modal más pequeña añadiendo **class=&quot;modal-sm&quot;** al grupo del modal. También podemos mostrar una ventana más grande con **class=&quot;modal-lg&quot;** o **class=&quot;modal-xl&quot;**.

### ModalInsert
También podemos hacer que al pulsar el botón nuevo en un listado aparezca un modal elegido, en lugar de redirigir al controlador del modelo. Para lograr esto solamente debemos indicar en el campo modalInsert el name del modal.

```
$this-&gt;setSettings($viewName, &#39;modalInsert&#39;, &#39;add-lote&#39;);
// en este caso al hacer clic en el botón nuevo se mostrará el modal con name &#39;add-lote&#39;
```
