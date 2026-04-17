---
id: 652
permalink: column-725
title: Etiqueta Column (XMLView)
creationdate: 07-05-2018 00:00:00
lastmod: 13-05-2025
url: https://facturascripts.com/column-725
---
La etiqueta `&lt;column&gt;` en **XMLView** se utiliza para definir una columna que se mostrará en la interfaz, así como sus propiedades de tamaño, visibilidad y orden. A continuación se presenta un ejemplo de cómo definir el contenido de una columna utilizando un widget:

```xml
&lt;column name=&quot;code&quot; numcolumns=&quot;4&quot; order=&quot;100&quot;&gt;
	&lt;widget type=&quot;text&quot; fieldname=&quot;codigo&quot; /&gt;
&lt;/column&gt;
```

## Propiedades
- **name**: Identificador interno de la columna. **Es obligatorio y debe ser único**. Se recomienda usar minúsculas y nombres en inglés.
- **display**: Modo de visualización de la columna. Posibles valores:
    - **none**: La columna está oculta.
    - **left**: El contenido está alineado a la izquierda (opción predeterminada).
    - **center**: El contenido está centrado.
    - **right**: El contenido está alineado a la derecha.
- **level**: Nivel de seguridad aplicable a la columna. El valor por defecto es 0. Solo los usuarios con un nivel de seguridad igual o superior podrán ver esta columna.
- **id**: Identificador HTML que se aplica al objeto. **Opcional**.
- **title**: Título de la columna. Si no se especifica, se utiliza el valor del atributo **name**. **Se traduce automáticamente**.
- **titleurl**: URL de destino a la que se redirige al usuario al hacer clic en el título de la columna.
- **description**: Descripción detallada del campo que facilita la comprensión al usuario. Visible únicamente en las pestañas de edición. **Se traduce automáticamente**.
- **order**: Posición que ocupa la columna dentro del grupo. Cuanto mayor sea el número, antes aparecerá la columna.
- **numcolumns**: Número de columnas que ocupa esta columna en el diseño. Por defecto, se ajusta automáticamente.

### Las 12 Columnas
FacturaScripts utiliza Bootstrap para el diseño de interfaces. Este framework CSS divide el espacio horizontal en 12 columnas, lo que simplifica la definición del tamaño de los campos. No es necesario preocuparse por si el campo debe medir 100px o 150px; simplemente debe decidir cuántas de las 12 columnas debería ocupar. Esto es importante para ajustar el tamaño de un grupo o una columna. De lo contrario, FacturaScripts ajustará automáticamente el tamaño.
