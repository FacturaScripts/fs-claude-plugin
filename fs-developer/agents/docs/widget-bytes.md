---
id: 1629
permalink: widget-bytes
title: Widget Bytes
creationdate: 07-12-2023 12:54:00
lastmod: 06-02-2026
url: https://facturascripts.com/widget-bytes
---
El widget Bytes sirve para mostrar tamaños de archivos o carpetas de forma legible (KB, MB, GB, TB). Toma valores enteros y los convierte automáticamente con la función `Tools::bytes()`

## 🧾 ¿Qué hace?

Muestra un número entero representando un tamaño en bytes (o en otra unidad si usas &quot;multiplier&quot;) y lo formatea en la unidad más adecuada (KB, MB, GB, TB) para facilitar su lectura.

## ⚙️ Uso básico

Inserta el widget en una columna de XMLView así:

```xml
&lt;column name=&quot;size&quot; display=&quot;right&quot; order=&quot;150&quot;&gt;
    &lt;widget type=&quot;bytes&quot; fieldname=&quot;file_size&quot;/&gt;
&lt;/column&gt;
```

- fieldname: nombre del campo que contiene el valor.
- display=&quot;right&quot;: alinea el contenido a la derecha en el listado (recomendado para números).

## 🛠️ Parámetro multiplier

Si el valor almacenado no está en bytes, puedes usar el parámetro multiplier para indicar el factor por el que debe multiplicarse el valor antes de convertirlo. Por ejemplo, si tu campo guarda megabytes (MB) y quieres que el widget los muestre formateados, usa multiplier con el número de bytes que hay en 1 MB (1024 * 1024 = 1048576):

```xml
&lt;column name=&quot;size&quot; display=&quot;right&quot; order=&quot;150&quot;&gt;
    &lt;widget type=&quot;bytes&quot; fieldname=&quot;file_size&quot; multiplier=&quot;1048576&quot;/&gt;
&lt;/column&gt;
```

Ejemplos de multiplicadores frecuentes:

- KB (kibibyte): 1024
- MB (mebibyte): 1048576 (1024^2)
- GB (gibibyte): 1073741824 (1024^3)
- TB (tebibyte): 1099511627776 (1024^4)

Nota: el multiplier debe ser el número de bytes que representa una unidad de la magnitud en la que se guarda tu dato.

## 🔢 Ejemplos de entrada y salida

- Si el campo file_size = 2048 (bytes) y no usas multiplier → se mostrará &quot;2 KB&quot;.
- Si el campo file_size = 5 y usas multiplier=&quot;1048576&quot; (el campo guarda megabytes) → se mostrará &quot;5 MB&quot;.
- Si el campo file_size = 1536 (bytes) → se mostrará &quot;1.5 KB&quot; (según redondeo y formato locales de Tools::bytes()).

## ℹ️ Comportamiento en la interfaz

- En formularios de edición se representa como un widget de tipo number (permitiendo introducir el valor bruto).
- En listados se muestra formateado en la unidad más adecuada (por ejemplo: &quot;1.2 MB&quot;).

Puedes usar display=&quot;right&quot; en la etiqueta &lt;column&gt; para alinear correctamente valores numéricos en los listados.

![widget bytes](https://i.imgur.com/wWz00eZ.png)

## 🔍 Detalle técnico

Internamente este widget llama a `Tools::bytes()` para formatear el número en la unidad adecuada. Si necesitas un comportamiento distinto, puedes sobrecargar ese método o preprocesar el valor en la consulta/agregación antes de pasarlo al widget.
