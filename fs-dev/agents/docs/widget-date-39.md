---
id: 662
permalink: widget-date-39
title: Widget de Fecha
creationdate: 06-10-2018 00:00:00
lastmod: 31-10-2025
url: https://facturascripts.com/widget-date-39
---
En los **archivos XMLView**, se puede utilizar un widget de fecha, denominado **WidgetDate**, para mostrar o editar fechas en el formato predeterminado **dd-mm-yyyy** (por ejemplo: 01-01-2022).

```xml
&lt;column name=&quot;date&quot; display=&quot;right&quot; order=&quot;130&quot;&gt;
	&lt;widget type=&quot;date&quot; fieldname=&quot;fecha&quot;/&gt;
&lt;/column&gt;
```

### Atributos del Widget
A continuación, se describen los atributos disponibles en la etiqueta `widget`:
- **fieldname**: Nombre del campo que contiene la información. **Obligatorio**.
- **required**: Si se activa, impide guardar los datos del formulario si el usuario no ha ingresado información en el campo.
- **readonly**: Si se activa, impide modificar el valor del campo.
- **icon**: [Icono que se mostrará en el campo de edición](https://facturascripts.com/publicaciones/iconos-disponibles-308).

### Ejemplo de Visualización
El widget de fecha se presenta en los formularios de edición y su apariencia puede variar según el navegador:

![Widget de Fecha en Formularios](https://i.imgur.com/27k3zfJ.png)

En los listados, se mostrará de la siguiente manera:

![Widget de Fecha en Listados](https://i.imgur.com/HtREWD1.png)

## Opciones de Coloreado
Recuerda que [todos los widgets tienen una serie de propiedades y opciones comunes](https://facturascripts.com/publicaciones/widget-238).
