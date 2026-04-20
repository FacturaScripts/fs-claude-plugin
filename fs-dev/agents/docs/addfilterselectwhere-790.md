---
id: 679
permalink: addfilterselectwhere-790
title: addFilterSelectWhere()
creationdate: 07-10-2018 00:00:00
lastmod: 31-10-2025
url: https://facturascripts.com/addfilterselectwhere-790
---
Añade un filtro de tipo **select** a la pestaña del **ListController**. Este filtro tiene la característica de ser **un filtro de filtros configurables**. Cada una de las opciones del select aplica un filtro [Where](https://facturascripts.com/publicaciones/where) predefinido en el controlador. Por ejemplo, una opción puede filtrar todos los datos que tengan `false` en la columna `debaja`, y otra opción puede filtrar todos los registros cuyo `codpais` sea `ESP`. Además, si el usuario no selecciona ninguna opción, **se aplica automáticamente la primera opción**.

## Parámetros:
- **viewName**: Nombre identificador de la pestaña.
- **key**: Identificador del filtro. Generalmente, se utiliza el nombre del campo que se desea filtrar.
- **label**: Etiqueta que se mostrará en el filtro. **Se traducirá** automáticamente.
- **values**: Array que contiene la lista de valores a mostrar en el desplegable. Se compone de una etiqueta y un array de [Where](https://facturascripts.com/publicaciones/where), el cual se aplicará al seleccionar esa opción.

![addFilterSelectWhere()](https://i.imgur.com/QGa06pI.gif)

### Ejemplo: filtrar los clientes según su estado
Filtrar en la lista de clientes (vista `ListCliente`) los clientes según el estado designado en su ficha.

```
$this-&gt;addFilterSelectWhere(&#39;ListCliente&#39;, &#39;status&#39;, [
	[&#39;label&#39; =&gt; Tools::trans(&#39;all&#39;), &#39;where&#39; =&gt; []],
	[&#39;label&#39; =&gt; Tools::trans(&#39;only-active&#39;), &#39;where&#39; =&gt; [Where::eq(&#39;debaja&#39;, false)]],
	[&#39;label&#39; =&gt; Tools::trans(&#39;only-suspended&#39;), &#39;where&#39; =&gt; [Where::eq(&#39;debaja&#39;, true)]]
]);
```

### Ejemplo en un EditController
En los `EditController`, no se puede llamar directamente a `$this-&gt;addFilterSelectWhere()`. Debe hacerse a través de `$this-&gt;views`.

```
$this-&gt;views[$viewName]-&gt;addFilterSelectWhere(&#39;status&#39;, [
	[&#39;label&#39; =&gt; Tools::trans(&#39;all&#39;), &#39;where&#39; =&gt; []],
	[&#39;label&#39; =&gt; Tools::trans(&#39;only-active&#39;), &#39;where&#39; =&gt; [Where::eq(&#39;debaja&#39;, false)]],
	[&#39;label&#39; =&gt; Tools::trans(&#39;only-suspended&#39;), &#39;where&#39; =&gt; [Where::eq(&#39;debaja&#39;, true)]]
]);
```
