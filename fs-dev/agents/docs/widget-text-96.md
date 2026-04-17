---
id: 654
permalink: widget-text-96
title: Widget de Texto (WidgetText)
creationdate: 06-10-2018 00:00:00
lastmod: 31-10-2025
url: https://facturascripts.com/widget-text-96
---
El widget de tipo **Texto** (`WidgetText`) es el widget predeterminado en FacturaScripts y permite mostrar y editar contenido en formato de texto plano, limitado a un número máximo de caracteres definidos por la propiedad `maxlength`. Si necesitas introducir textos más extensos, te recomendamos utilizar el [widget de área de texto](https://facturascripts.com/publicaciones/widget-textarea-699).

## Ejemplo de uso

A continuación se muestra un ejemplo de cómo definir un widget de texto en una vista XML:

```xml
&lt;column name=&quot;code&quot; numcolumns=&quot;2&quot; order=&quot;100&quot;&gt;
    &lt;widget type=&quot;text&quot; fieldname=&quot;codcliente&quot;/&gt;
&lt;/column&gt;
```

## Visualización del Widget

Al utilizar este widget, su apariencia será la siguiente en los formularios de edición:

![Widget de texto en edición](https://i.imgur.com/yDV65oi.png)

Y en los listados, se muestra así:

![Widget de texto en listados](https://i.imgur.com/uRCX4Es.png)

## Propiedades del Widget

Puedes personalizar el comportamiento del widget de texto usando las siguientes propiedades:

- **fieldname** (**obligatorio**): Nombre del campo a mostrar y/o editar.
- **required**: Establece si el campo es obligatorio. Si se marca, el formulario no se podrá guardar si el campo está vacío.
- **readonly**: Especifica si el campo es de solo lectura. Valores permitidos: `true`, `false` o `dynamic`.
- **onclick**: Permite definir una URL o controlador al que será redirigido el usuario al hacer clic sobre el texto. Se añade automáticamente el parámetro `?code=` seguido del valor del campo.
- **icon**: [Icono que se mostrará en el campo de edición](https://facturascripts.com/publicaciones/iconos-disponibles-308).
- **maxlength**: Longitud máxima permitida del texto.

## Opciones Avanzadas y Coloreado

Todos los widgets comparten una serie de propiedades y opciones comunes para el coloreado y personalización visual. Puedes consultarlas en la publicación sobre [propiedades comunes de los widgets](https://facturascripts.com/publicaciones/widget-238).
