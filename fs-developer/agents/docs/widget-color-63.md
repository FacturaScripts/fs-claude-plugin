---
id: 665
permalink: widget-color-63
title: Widget Color
creationdate: 18-10-2019 00:00:00
lastmod: 31-01-2026
url: https://facturascripts.com/widget-color-63
---
En los archivos XMLView puedes usar el widget color (WidgetColor) para mostrar o editar colores de forma sencilla.

## 🔍 Descripción

El widget muestra una muestra del color, su representación hexadecimal editable (ej. `#ff0000`) y, al hacer clic, abre un selector de color del navegador para elegir otro valor.

- El valor que guarda el campo debe estar en formato hexadecimal `#RRGGBB` (las mayúsculas/minúsculas no afectan normalmente).
- El campo referido por `fieldname` debe existir en el modelo y ser capaz de almacenar una cadena con el valor hexadecimal.

## ⚙️ Atributos

Ejemplos de atributos que puedes usar en el widget:

- `fieldname` (obligatorio): nombre del campo del modelo que contiene el color.
- `required`: evita guardar el formulario si el campo está vacío.
- `readonly`: muestra el color pero no permite modificarlo.

&gt; Nota: el atributo `order` pertenece al elemento `column` y controla la posición, no al widget en sí.

## 🧾 Ejemplos de uso

Ejemplo básico (campo editable):

```xml
&lt;column name=&quot;color1&quot; order=&quot;100&quot;&gt;
  &lt;widget type=&quot;color&quot; fieldname=&quot;color1&quot;/&gt;
&lt;/column&gt;
```

Ejemplo con campo obligatorio:

```xml
&lt;column name=&quot;color2&quot; order=&quot;110&quot;&gt;
  &lt;widget type=&quot;color&quot; fieldname=&quot;color2&quot; required=&quot;true&quot;/&gt;
&lt;/column&gt;
```

Ejemplo sólo lectura:

```xml
&lt;column name=&quot;color_preview&quot; order=&quot;120&quot;&gt;
  &lt;widget type=&quot;color&quot; fieldname=&quot;color_preview&quot; readonly=&quot;true&quot;/&gt;
&lt;/column&gt;
```

Si quieres un valor por defecto, define ese valor en la base de datos o en el modelo (por ejemplo, al crear el registro) para que el widget lo muestre al abrir el formulario.

## 👀 Vista en el formulario

En el formulario verás:

- Una pequeña muestra del color seleccionado.
- El código hexadecimal editable (`#RRGGBB`).
- Al pulsar sobre el control se abre el selector de color del navegador para elegir visualmente.

![widget color edicion](https://i.imgur.com/7Ftv6Vm.png)

## ⚠️ Notas y recomendaciones

- Asegúrate de que `fieldname` coincide exactamente con el nombre del campo del modelo; si no existe, el widget no mostrará ni guardará valor.
- Valida en el modelo que el contenido esté en formato hexadecimal si necesitas garantizar consistencia (p. ej. mediante una regla de validación antes de guardar).
- Si el color no se muestra correctamente, comprueba el valor almacenado en la base de datos: debe ser una cadena tipo `#rrggbb`.

## ❓ Solución de problemas rápida

- No aparece color: revisa que `fieldname` exista en el modelo y que el registro tenga un valor en formato hexadecimal.
- No se puede editar: comprueba si el widget tiene `readonly=&quot;true&quot;` o si el formulario está en modo sólo lectura.

Si necesitas más ejemplos concretos (por ejemplo, integración con un modelo concreto), dime el caso y te preparo la muestra XMLView y las indicaciones para el modelo.
