---
id: 680
permalink: addfilterperiod-315
title: addFilterPeriod()
creationdate: 01-11-2018 00:00:00
lastmod: 04-02-2026
url: https://facturascripts.com/addfilterperiod-315
---
La función `addFilterPeriod()` permite añadir un filtro de rango de fechas en la pestaña del **ListController**. Esto facilita filtrar los datos mostrados en dicha pestaña según un rango de fechas específico.

### Controles Añadidos
El filtro añade tres controles a la vista:
- Un **select** que permite elegir entre periodos predefinidos (como &#39;este mes&#39;, &#39;este trimestre&#39;, etc.).
- Dos campos de tipo **date** para definir la fecha de inicio (&#39;desde&#39;) y la fecha de fin (&#39;hasta&#39;) para el filtro.

### Parámetros
Los parámetros de la función son los siguientes:
- **viewName**: Nombre identificador de la pestaña donde se aplicará el filtro.
- **key**: Identificador del filtro. Generalmente, este es el nombre del campo que deseas filtrar.
- **label**: Etiqueta que se mostrará en el filtro; **se traducirá** automáticamente si es necesario.
- **field**: Campo del modelo sobre el cual se aplicará el filtro.
- **dateTime**: Valor booleano (`true` o `false`) que indica si el campo es de tipo datetime (incluye fecha y hora).

![addFilterPeriod()](https://i.imgur.com/4CzcWEp.gif)

### Ejemplo en un ListController
```php
$this-&gt;addFilterPeriod($viewName, &#39;date&#39;, &#39;period&#39;, &#39;fecha&#39;);

// Si el campo es de tipo datetime o timesince, utilizaríamos de la siguiente forma:
// $this-&gt;addFilterPeriod($viewName, &#39;date&#39;, &#39;period&#39;, &#39;fecha&#39;, true);
```

### Ejemplo en un EditController
```php
$this-&gt;listView($viewName)-&gt;addFilterPeriod(&#39;date&#39;, &#39;period&#39;, &#39;fecha&#39;);

// Si el campo es de tipo datetime o timesince, utilizaríamos de la siguiente forma:
// $this-&gt;listView($viewName)-&gt;addFilterPeriod(&#39;date&#39;, &#39;period&#39;, &#39;fecha&#39;, true);
```
