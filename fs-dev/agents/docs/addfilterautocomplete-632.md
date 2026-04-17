---
id: 674
permalink: addfilterautocomplete-632
title: addFilterAutocomplete()
creationdate: 01-05-2018 00:00:00
lastmod: 28-05-2025
url: https://facturascripts.com/addfilterautocomplete-632
---
Añade un filtro de tipo **autocompletar** a la pestaña del **ListController**. Permite filtrar los resultados aplicando el filtro a la columna indicada. Los resultados para autocompletar los puede extraer de la tabla que le indiquemos.

## Parámetros:
- **viewName**: nombre identificador de la pestaña.
- **key**: identificador del filtro. Generalmente el nombre del campo que quieras filtrar.
- **label**: etiqueta a mostrar en el filtro. **Se traducirá**.
- **field**: nombre del campo del modelo donde se aplica el filtro.
- **table**: nombre de la tabla donde buscar todos los resultados a autocompletar.
- **fieldcode**: nombre de la columna de la tabla donde buscar.
- **fieldtitle**: nombre de la columna de la tabla donde buscar. Pero para mostrar esta columna al usuario en lugar de fieldcode.
- **where**: (opcional) array de filtros para la búsqueda.

![addFilterAutocomplete()](https://i.imgur.com/oPgXT6x.gif)

### Ejemplo: añadir un filtro autocompletar
Imaginemos que queremos añadir un filtro por país al listado de facturas de venta en ListFacturaCliente.php

```
$this-&gt;addFilterAutocomplete(&#39;ListFacturaCliente&#39;, &#39;codpais&#39;, &#39;country&#39;, &#39;codpais&#39;, &#39;facturascli&#39;, &#39;codpais&#39;, &#39;codpais&#39;);
```

Esto nos permite filtrar por país. Pero cuando el usuario escriba sobre este campo, solamente va a autocompletar con los resultados de la tabla de **facturascli**. Y además solamente va a poner el código del país, no el nombre, porque **el nombre no está** en la tabla de facturas.

Imaginemos que queremos hacer el mismo filtro, pero que aparezcan todos los nombres de los países. Para eso lo mejor es que filtremos indicando que queremos que los resultados los busque en la **tabla paises**.

```
$this-&gt;addFilterAutocomplete(&#39;ListFacturaCliente&#39;, &#39;codpais&#39;, &#39;country&#39;, &#39;codpais&#39;, &#39;paises&#39;, &#39;codpais&#39;, &#39;nombre&#39;);
```

Ahora si. Está filtrando todos los resultados de facturas del país indicado, pero sacando los nombres de los paises de la tabla paises.

### Ejemplo en un EditController
En los EditController no se puede llamar directamente a $this-&gt;addFilterAutocomplete(). Hay que hacerlo con $this-&gt;views.

```
$this-&gt;listView($viewName)-&gt;addFilterAutocomplete(&#39;codpais&#39;, &#39;country&#39;, &#39;codpais&#39;, &#39;paises&#39;, &#39;codpais&#39;, &#39;nombre&#39;);
```
