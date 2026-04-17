---
id: 649
permalink: row-header-y-footer-565
title: Row header y footer (XMLView)
creationdate: 07-05-2018 00:00:00
lastmod: 18-03-2025
url: https://facturascripts.com/row-header-y-footer-565
---
Los tipos de fila **header** y **footer** permiten definir paneles que se colocan en la cabecera o el pie de página de una pestaña, dependiendo de su tipo.

Para declarar un panel, utilizaremos la etiqueta **group**, donde podemos incluir etiquetas **button** según sea necesario. Cada apartado del panel se puede personalizar con los siguientes atributos:
- **name**: Identificador único para el grupo.
- **class**: Clases CSS que se aplicarán al panel.
- **title**: Texto que se mostrará como cabecera del panel.
- **label**: Texto que se mostrará en el cuerpo del panel.
- **footer**: Texto para el pie del panel.
- **html**: Plantilla Twig que se incluirá en el contenido del card.

## Ejemplo de Fila de Tipo Header
```
&lt;rows&gt;
	&lt;row type=&#39;header&#39;&gt;
		&lt;group name=&#39;footer1&#39; footer=&#39;specials-actions&#39; label=&#39;Esto es una muestra de botones&#39;&gt;
			&lt;button type=&#39;modal&#39; label=&#39;Modal&#39; color=&#39;primary&#39; action=&#39;test&#39; icon=&#39;fas fa-users&#39;/&gt;
			&lt;button type=&#39;action&#39; label=&#39;Action&#39; color=&#39;info&#39; action=&#39;process1&#39; icon=&#39;fas fa-book&#39;/&gt;
		&lt;/group&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```

## Ejemplo de Fila de Tipo Footer
```
&lt;rows&gt;
	&lt;row type=&#39;footer&#39;&gt;
		&lt;group name=&#39;footer_actions&#39; footer=&#39;specials-actions&#39;&gt;
			&lt;button type=&#39;action&#39; label=&#39;add-all-enabled&#39; color=&#39;info&#39; action=&#39;add-api-access-enabled&#39; icon=&#39;fas fa-plus&#39;/&gt;
			&lt;button type=&#39;action&#39; label=&#39;add-all-disabled&#39; color=&#39;info&#39; action=&#39;add-api-access-disabled&#39; icon=&#39;fas fa-plus&#39;/&gt;
		&lt;/group&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```

### Botones
Los botones se definen mediante etiquetas **button** y poseen las siguientes propiedades:
- **type**: Especifica el tipo de botón.
	- **action**: Al hacer clic, se recargará la página ejecutando la acción indicada en esta propiedad. Esta acción debe estar implementada en el controlador.
	- **js**: Ejecuta la función JavaScript indicada en la propiedad action al hacer clic.
	- **link**: Redirige a la página especificada en la propiedad action al hacer clic.
	- **modal**: Muestra el modal cuyo nombre se indica en la propiedad action al hacer clic.
- **id**: Identificador HTML para su uso desde JavaScript.
- **icon**: [Icono del botón](https://facturascripts.com/publicaciones/iconos-disponibles-308).
- **label**: Texto que se mostrará en el botón. Este se traducirá automáticamente por FacturaScripts.
- **level**: Nivel de seguridad aplicable, siendo 0 por defecto. Solo los usuarios con un nivel de seguridad igual o superior podrán visualizar este botón.
- **color**: Configuración de color a aplicar.
- **action**: Acción que se enviará al controlador, función JavaScript o nombre del modal a mostrar.

### Colores Disponibles
- **info**: Azul
- **success**: Verde
- **warning**: Amarillo
- **danger**: Rojo
- **light**: Gris claro
- **secondary**: Negro
