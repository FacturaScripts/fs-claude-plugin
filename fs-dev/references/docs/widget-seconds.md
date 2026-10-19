---
id: 4791
permalink: widget-seconds
title: Widget Seconds
creationdate: 15-10-2026 14:08:54
lastmod: 16-10-2026
url: https://facturascripts.com/publicaciones/widget-seconds
---
En los **archivos XMLView** se puede utilizar el **Widget Seconds** (WidgetSeconds) para representar duraciones o retrasos medidos en segundos: tiempos de ejecución, duración de tareas, esperas, etc. Es un [Widget Number](https://facturascripts.com/publicaciones/widget-number-39) que, en los listados, convierte los segundos a la unidad más legible.

```xml
&lt;column name=&quot;duration&quot; display=&quot;right&quot; order=&quot;150&quot;&gt;
	&lt;widget type=&quot;seconds&quot; fieldname=&quot;duration&quot;/&gt;
&lt;/column&gt;
```

El campo debe guardar el valor **en segundos**.

![Campo duration](https://i.imgur.com/3yDwFH8.png)

### Propiedades del Widget Seconds
Admite las mismas propiedades que el [Widget Number](https://facturascripts.com/publicaciones/widget-number-39):
- **fieldname**: Nombre del campo que contiene la información. **Obligatorio**.
- **required**: Evita que se guarden los datos del formulario si el usuario no ha ingresado nada en el campo.
- **readonly**: Impide la modificación del valor.
- **onclick**: URL o controlador al que será redirigido el usuario al hacer clic. A esta URL se le añade **?code=** seguido del valor del campo.
- **icon**: [Icono a mostrar en el campo de edición](https://facturascripts.com/publicaciones/iconos-disponibles-308).
- **min**: Valor mínimo permitido. **Opcional**.
- **max**: Valor máximo permitido. **Opcional**.
- **step**: Valor que se sumará o restará cada vez que se pulse la flecha hacia arriba o hacia abajo.

### Conversión de unidades en los listados
El valor se muestra con los decimales indicados en el apartado **Por defecto** (menú administrador, panel de control) y con la unidad que corresponda:
- **Menos de 60 segundos**: en segundos (**s**). Ejemplo: 45 → **45,00 s**.
- **Menos de 1 hora**: en minutos (**m**). Ejemplo: 90 → **1,50 m**.
- **Menos de 1 día**: en horas (**h**). Ejemplo: 5400 → **1,50 h**.
- **1 día o más**: en días (**d**). Ejemplo: 172800 → **2,00 d**.

Si el campo está vacío se muestra un guion (**-**).

### Visualización
- **En un formulario de edición** se muestra un campo numérico con el valor en segundos, sin convertir.
- **En un listado** se muestra el valor convertido a s, m, h o d.

### Ejemplo con coloreado
Puedes combinarlo con las opciones de coloreado para resaltar las duraciones largas. Las condiciones se evalúan sobre el valor en segundos:

```xml
&lt;column name=&quot;duration&quot; display=&quot;right&quot; order=&quot;150&quot;&gt;
	&lt;widget type=&quot;seconds&quot; fieldname=&quot;duration&quot;&gt;
		&lt;option color=&quot;danger&quot;&gt;gt:30&lt;/option&gt;
	&lt;/widget&gt;
&lt;/column&gt;
```

## 🎨 Opciones de coloreado
Recuerda que [todos los widgets tienen una serie de propiedades y opciones comunes](https://facturascripts.com/publicaciones/widget-238).