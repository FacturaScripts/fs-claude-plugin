---
id: 649
permalink: row-header-y-footer-565
title: Row header y footer (XMLView)
creationdate: 07-05-2018 00:00:00
lastmod: 17-07-2026
url: https://facturascripts.com/publicaciones/row-header-y-footer-565
---
Los tipos de fila `header` y `footer` permiten definir paneles que se colocan en la cabecera o el pie de página de una pestaña, dependiendo de su tipo.

Para declarar un panel, utilizaremos la etiqueta `group`, donde podemos incluir etiquetas `button` según sea necesario. Cada panel se puede personalizar con los siguientes atributos:
- `name`: identificador único para el grupo.
- `id`: (opcional) identificador HTML del panel, para poder seleccionarlo desde JavaScript o CSS.
- `class`: (opcional) clases CSS que se aplicarán al panel.
- `numcolumns`: (opcional) ancho del panel en columnas de Bootstrap (de 1 a 12). Si no se indica, el panel ocupa el espacio disponible.
- `title`: (opcional) texto que se mostrará como cabecera del panel. Se traduce automáticamente por FacturaScripts.
- `label`: (opcional) texto que se mostrará en el cuerpo del panel, después de los botones. También se traduce automáticamente.
- `footer`: (opcional) texto para el pie del panel. También se traduce automáticamente.
- `html`: (opcional) plantilla Twig que se incluirá en el contenido del card. La plantilla recibe el controlador en la variable `fsc`.

## Ejemplo de fila de tipo header
```
&lt;rows&gt;
	&lt;row type=&quot;header&quot;&gt;
		&lt;group name=&quot;header1&quot; footer=&quot;specials-actions&quot; label=&quot;Esto es una muestra de botones&quot;&gt;
			&lt;button type=&quot;modal&quot; label=&quot;Modal&quot; color=&quot;primary&quot; action=&quot;test&quot; icon=&quot;fa-solid fa-users&quot;/&gt;
			&lt;button type=&quot;action&quot; label=&quot;Action&quot; color=&quot;info&quot; action=&quot;process1&quot; icon=&quot;fa-solid fa-book&quot;/&gt;
		&lt;/group&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```

## Ejemplo de fila de tipo footer
```
&lt;rows&gt;
	&lt;row type=&quot;footer&quot;&gt;
		&lt;group name=&quot;footer_actions&quot; footer=&quot;specials-actions&quot;&gt;
			&lt;button type=&quot;action&quot; label=&quot;add-all-enabled&quot; color=&quot;info&quot; action=&quot;add-api-access-enabled&quot; icon=&quot;fa-solid fa-plus&quot;/&gt;
			&lt;button type=&quot;action&quot; label=&quot;add-all-disabled&quot; color=&quot;info&quot; action=&quot;add-api-access-disabled&quot; icon=&quot;fa-solid fa-plus&quot;/&gt;
		&lt;/group&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```

### 🖱️ Botones
Los botones se definen mediante etiquetas `button` y poseen las siguientes propiedades:
- `type`: especifica el tipo de botón.
	- `action`: al hacer clic, se recargará la página ejecutando la acción indicada en la propiedad `action`. Esta acción debe estar implementada en el controlador.
	- `js`: ejecuta la función JavaScript indicada en la propiedad `action` al hacer clic.
	- `link`: redirige a la página especificada en la propiedad `action` al hacer clic.
	- `modal`: muestra el modal cuyo nombre se indica en la propiedad `action` al hacer clic.
- `id`: (opcional) identificador HTML para su uso desde JavaScript.
- `icon`: (opcional) [icono del botón](https://facturascripts.com/publicaciones/iconos-disponibles-308).
- `label`: texto que se mostrará en el botón. Se traducirá automáticamente por FacturaScripts.
- `title`: (opcional) texto del tooltip del botón. Si no se indica, se usa el `label`. También se traduce automáticamente.
- `level`: (opcional) nivel de seguridad aplicable, siendo 0 por defecto. Solo los usuarios con un nivel de seguridad igual o superior podrán visualizar este botón.
- `color`: (opcional) configuración de color a aplicar.
- `action`: acción que se enviará al controlador, función JavaScript o nombre del modal a mostrar.
- `confirm`: (opcional) si se indica, mostrará al usuario una ventana solicitando confirmación antes de ejecutar la acción. Solamente aplica a los botones de tipo `action`.
- `target`: (opcional) en los botones de tipo `link`, target del enlace. Por ejemplo `_blank` para abrir en una pestaña nueva.

### 🎨 Colores disponibles
- `primary`: azul oscuro
- `info`: azul
- `success`: verde
- `warning`: amarillo
- `danger`: rojo
- `dark`: gris oscuro
- `light`: gris claro
- `secondary`: gris

También puedes usar las variantes con borde `outline-`, por ejemplo `outline-danger` u `outline-primary`.