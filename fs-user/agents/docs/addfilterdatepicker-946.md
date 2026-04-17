---
id: 676
permalink: addfilterdatepicker-946
title: addFilterDatePicker()
creationdate: 01-05-2018 00:00:00
lastmod: 10-11-2025
url: https://facturascripts.com/addfilterdatepicker-946
---
Añade un **filtro** de tipo **fecha** (solo fecha, sin hora) a la pestaña del **ListController**. Este filtro permite filtrar los resultados según la columna indicada.

## Parámetros:
- **viewName**: Nombre identificador de la pestaña.
- **key**: Nombre identificador del filtro. Generalmente, es el nombre del campo que deseas filtrar.
- **label**: Etiqueta que se mostrará en el filtro. **Se traducirá** automáticamente.
- **field**: Nombre del campo del modelo donde se aplica el filtro.
- **operation**: La operación a aplicar (`&gt;`, `&gt;=`, `=`, `&lt;`, `&lt;=`). Por defecto es `&gt;=`.
- **dateTime**: Indica si el campo es de tipo datetime (`true` para incluir fecha y hora).

![addFilterDatePicker](https://i.imgur.com/cDqU9yH.gif)

### Ejemplo en un ListController
```php
// Añade un filtro con operación &gt;=
$this-&gt;addFilterDatePicker($viewName, &#39;fecha&#39;, &#39;date&#39;, &#39;fecha&#39;);

// Si queremos que la operación sea &lt;=
// $this-&gt;addFilterDatePicker($viewName, &#39;fecha&#39;, &#39;date&#39;, &#39;fecha&#39;, &#39;&lt;=&#39;);

// Si el campo es de tipo datetime o timesince, se haría así
// $this-&gt;addFilterDatePicker($viewName, &#39;fecha&#39;, &#39;date&#39;, &#39;fecha&#39;, &#39;&lt;=&#39;, true);
```

### Ejemplo en un EditController
```php
$this-&gt;listView($viewName)-&gt;addFilterDatePicker(&#39;fecha&#39;, &#39;date&#39;, &#39;fecha&#39;);

// Si queremos que la operación sea &lt;=
// $this-&gt;listView($viewName)-&gt;addFilterDatePicker(&#39;fecha&#39;, &#39;date&#39;, &#39;fecha&#39;, &#39;&lt;=&#39;);

// Si el campo es de tipo datetime o timesince, se haría así
// $this-&gt;listView($viewName)-&gt;addFilterDatePicker(&#39;fecha&#39;, &#39;date&#39;, &#39;fecha&#39;, &#39;&lt;=&#39;, true);
```
