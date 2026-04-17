---
id: 675
permalink: addfiltercheckbox-458
title: addFilterCheckbox()
creationdate: 01-05-2018 00:00:00
lastmod: 07-04-2026
url: https://facturascripts.com/addfiltercheckbox-458
---
Añade un filtro de tipo **checkbox** o de selección booleana a la pestaña del **ListController**. Permite filtrar los resultados aplicando el filtro a la columna indicada.

## Parámetros:
- **viewName**: nombre identificador de la pestaña. Nombre de la vista
- **key**: identificador del filtro. Generalmente el nombre del campo que quieras filtrar.
- **label**: etiqueta a mostrar en el filtro. **Se traducirá**.
- **field**: nombre del campo del modelo donde se aplica el filtro.
- **operation**: (opcional) permite invertir el filtro, es decir, que al marcar se filtren los resultados que tienen el field en false, en lugar de true.
- **matchValue**: (opcional) permite especificar el valor a comprobar. Por defecto = True. Ha de coincidir el valor
- **default**: (opcional) tipo databaseWhere. Array con los valores a aplicar cuando el filtro está vacío.

![addFilterCheckbox()](https://i.imgur.com/wbXmvy8.gif)

### Ejemplo: filtrar las facturas pagadas.
Imaginemos que queremos añadir un filtro para mostrar solamente las facturas pagadas, es decir, las que tienen la columna pagada a **TRUE**.

```
$this-&gt;addFilterCheckbox(&#39;ListFacturaCliente&#39;, &#39;pagada&#39;, &#39;paid&#39;, &#39;pagada&#39;);
```

### Ejemplo: filtrar las facturas impagadas.
Ahora imaginemos que queremos mostrar solamente las facturas **NO pagadas**, es decir, las que tienen la columna pagada a **FALSE**.

```
$this-&gt;addFilterCheckbox(&#39;ListFacturaCliente&#39;, &#39;pagada&#39;, &#39;paid&#39;, &#39;pagada&#39;,&#39;IS NOT&#39;);
```

### Ejemplo: filtrar facturas sin enviar por email.
Ahora imaginemos que queremos mostrar solamente las facturas que todavía no se han enviado por email, es decir, las que tienen la columna femail a **NULL**.

```
$this-&gt;addFilterCheckbox(&#39;ListFacturaCliente&#39;, &#39;femail&#39;, &#39;email-send&#39;, &#39;femail&#39;, &#39;IS&#39;, null);
```

### Ejemplo en un EditController
En los EditController no se puede llamar directamente a $this-&gt;addFilterCheckbox(). Hay que hacerlo con $this-&gt;views.

```
$this-&gt;listView($viewName)-&gt;addFilterCheckbox(&#39;pagada&#39;, &#39;paid&#39;, &#39;pagada&#39;);
```
