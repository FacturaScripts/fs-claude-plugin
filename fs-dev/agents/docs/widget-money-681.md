---
id: 658
permalink: widget-money-681
title: Widget Money
creationdate: 06-10-2018 00:00:00
lastmod: 03-01-2026
url: https://facturascripts.com/widget-money-681
---
En los **archivos XMLView** se puede utilizar el **Widget Money** para mostrar o editar cantidades monetarias. La principal diferencia con respecto al [Widget Number](/publicaciones/widget-number-39) es que busca en el modelo un **campo coddivisa** para identificar [la divisa](/publicaciones/divisas-773) y mostrar el símbolo correspondiente. Así, el usuario siempre tiene claridad sobre la moneda que está visualizando (euros, dólares, pesos, etc.).

### Ejemplo de uso del Widget Money

```xml
&lt;column name=&quot;amount&quot; display=&quot;right&quot; order=&quot;130&quot;&gt;
	&lt;widget type=&quot;money&quot; fieldname=&quot;total&quot;/&gt;
&lt;/column&gt;
```

### Parámetros del Widget Money
- **fieldname**: Nombre del campo que contiene la información. **Obligatorio**.
- **required**: Impide guardar los datos del formulario si el usuario no ingresa nada en el campo.
- **readonly**: Evita que se modifique el valor.
- **onclick**: URL o controlador al que será redirigido el usuario al hacer clic. A esta URL se le añade **?code=** y el valor del campo.
- **icon**: [Ícono a mostrar en el campo de edición](/publicaciones/iconos-disponibles-308).
- **decimal**: Número de decimales a mostrar. Por defecto, será el indicado en el apartado **Por defecto** (menú administrador &gt; panel de control) de FacturaScripts.
- **min**: Valor mínimo admitido. **Opcional**.
- **max**: Valor máximo admitido. **Opcional**.
- **step**: Valor que se sumará o restará cada vez que se pulse la flecha hacia arriba o hacia abajo.

### Visualización del Widget Money
A continuación, se muestran ejemplos de cómo se presenta el Widget Money en diferentes contextos:
- **En un formulario de edición:**

![Widget Money en formulario de edición](https://i.imgur.com/T9AOP8l.png)

- **En un listado:**

![Widget Money en listado](https://i.imgur.com/GVEvkx6.png)

## 🎨 Opciones de coloreado
Recuerda que [todos los widgets tienen una serie de propiedades y opciones comunes](/publicaciones/widget-238).
