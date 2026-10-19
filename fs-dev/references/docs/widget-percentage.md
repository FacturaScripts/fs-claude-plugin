---
id: 4790
permalink: widget-percentage
title: Widget Percentage
creationdate: 15-10-2026 14:08:53
lastmod: 19-10-2026
url: https://facturascripts.com/publicaciones/widget-percentage
---
En los **archivos XMLView** se puede utilizar el **Widget Percentage** (WidgetPercentage) para mostrar o editar porcentajes: descuentos, impuestos, comisiones, márgenes, etc. Funciona igual que el [Widget Number](https://facturascripts.com/publicaciones/widget-number-39), pero en los listados añade el símbolo **%** al valor y en los formularios muestra por defecto el icono de porcentaje.

```xml
&lt;column name=&quot;dto&quot; display=&quot;right&quot; order=&quot;130&quot;&gt;
	&lt;widget type=&quot;percentage&quot; fieldname=&quot;dtopor&quot;/&gt;
&lt;/column&gt;
```

El valor se guarda tal cual en el campo: un 21 % se almacena como **21**, no como 0,21.

### Propiedades del Widget Percentage
- **fieldname**: Nombre del campo que contiene la información. **Obligatorio**.
- **required**: Evita que se guarden los datos del formulario si el usuario no ha ingresado nada en el campo.
- **readonly**: Impide la modificación del valor.
- **onclick**: URL o controlador al que será redirigido el usuario al hacer clic. A esta URL se le añade **?code=** seguido del valor del campo.
- **icon**: [Icono a mostrar en el campo de edición](https://facturascripts.com/publicaciones/iconos-disponibles-308). Por defecto es `fa-solid fa-percentage`.
- **decimal**: Número de decimales a mostrar. Por defecto, será el indicado en el apartado **Por defecto** (menú administrador, panel de control) de FacturaScripts.
- **min**: Valor mínimo permitido. **Opcional**.
- **max**: Valor máximo permitido. **Opcional**.
- **step**: Valor que se sumará o restará cada vez que se pulse la flecha hacia arriba o hacia abajo.

Por ejemplo, para limitar un descuento entre 0 y 100 y mostrarlo sin decimales:

```xml
&lt;column name=&quot;dto&quot; display=&quot;right&quot; order=&quot;130&quot;&gt;
	&lt;widget type=&quot;percentage&quot; fieldname=&quot;dtopor&quot; decimal=&quot;0&quot; min=&quot;0&quot; max=&quot;100&quot;/&gt;
&lt;/column&gt;
```

### Visualización
- **En un formulario de edición** se muestra un campo numérico con el icono de porcentaje a la izquierda.
![Widget percentaje](https://facturascripts.com/MyFiles/2026/10/7754_3klr6j9.png?myft=b07e1591b053751e9bb8ba7041c0444dfd4a1918)
- **En un listado** se muestra el número formateado seguido de **%**, por ejemplo **21,00%**. Si el campo está vacío se muestra un guion (**-**).
![Widget percentaje listado](https://facturascripts.com/MyFiles/2026/10/7755_porcentaje.png?myft=457050f832a08b206ea7ef39b180fa008e3188b3)

## 🎨 Opciones de coloreado
Recuerda que [todos los widgets tienen una serie de propiedades y opciones comunes](https://facturascripts.com/publicaciones/widget-238).