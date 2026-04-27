---
id: 655
permalink: widget-number-39
title: Widget Number
creationdate: 06-10-2018 00:00:00
lastmod: 31-10-2025
url: https://facturascripts.com/publicaciones/widget-number-39
---

En los **archivos XMLView**, se puede usar un widget de tipo número, o **WidgetNumber**, para mostrar y editar contenido en formato numérico.

```xml
&lt;column name=&quot;quantity&quot; display=&quot;right&quot; order=&quot;150&quot;&gt;
	&lt;widget type=&quot;number&quot; fieldname=&quot;cantidad&quot;/&gt;
&lt;/column&gt;
```

### Propiedades del Widget Number
- **fieldname**: Nombre del campo que contiene la información. **Obligatorio**.
- **required**: Evita que se guarden los datos del formulario si el usuario no ha ingresado nada en el campo.
- **readonly**: Impide la modificación del valor.
- **onclick**: URL o controlador al que será redirigido el usuario al hacer clic. A esta URL se le añade **?code=** seguido del valor del campo.
- **icon**: [Icono a mostrar en el campo de edición](https://facturascripts.com/publicaciones/iconos-disponibles-308).
- **decimal**: Número de decimales a mostrar. Por defecto, será el indicado en el apartado **Por defecto** (menú administrador, panel de control) de FacturaScripts.
- **min**: Valor mínimo permitido. **Opcional**.
- **max**: Valor máximo permitido. **Opcional**.
- **step**: Valor que se sumará o restará cada vez que se pulse la flecha hacia arriba o hacia abajo.

### Ejemplos de Visualización
Así es como se ve el widget number en un formulario de edición estándar:

![Widget Number Edición](https://i.imgur.com/UKIuNmE.png)

Y así es como se presenta un widget number en un listado:

![Widget Number Listado](https://i.imgur.com/EdsAqwh.png)

## 🎨 Opciones de Coloreado
Recuerda que [todos los widgets tienen una serie de propiedades y opciones comunes](https://facturascripts.com/publicaciones/widget-238).
