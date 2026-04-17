---
id: 678
permalink: addfilterselect-572
title: addFilterSelect()
creationdate: 01-05-2018 00:00:00
lastmod: 07-04-2026
url: https://facturascripts.com/addfilterselect-572
---
Añade un filtro de tipo **selector** a la pestaña del **ListController**. Permite filtrar los resultados por el campo indicado.

## Parámetros:
- **viewName**: nombre identificador de la pestaña.
- **key**: identificador del filtro. Generalmente el nombre del campo que quieras filtrar.
- **label**: etiqueta a mostrar en el filtro. **Se traducirá**.
- **field**: campo del modelo sobre el que aplicar el filtro.
- **values**: array de valores posibles para filtrar.

![addFilterSelect()](https://i.imgur.com/rhAFnDv.gif)

### Ejemplo: filtrar facturas por país.
```
$countries = $this-&gt;codeModel-&gt;all(&#39;paises&#39;, &#39;codpais&#39;, &#39;nombre&#39;);
$this-&gt;addFilterSelect(&#39;ListFacturaCliente&#39;, &#39;codpais&#39;, &#39;country&#39;, &#39;codpais&#39;, $countries);
```

### Ejemplo: filtrar facturas por ciudad.
```
$cities = $this-&gt;codeModel-&gt;all(&#39;facturascli&#39;, &#39;ciudad&#39;, &#39;ciudad&#39;);
$this-&gt;addFilterSelect(&#39;ListFacturaCliente&#39;, &#39;ciudad&#39;, &#39;city&#39;, &#39;ciudad&#39;, $cities);
```

### Ejemplo: filtrar por valore fijos
```
$countries = [
	[&#39;code&#39; =&gt; &#39;ESP&#39;, &#39;description&#39; =&gt; &#39;Spain&#39;],
	[&#39;code&#39; =&gt; &#39;USA&#39;, &#39;description&#39; =&gt; &#39;United States&#39;],
];
$this-&gt;addFilterSelect(&#39;ListFacturaCliente&#39;, &#39;codpais&#39;, &#39;country&#39;, &#39;codpais&#39;, $countries);

// también funciona así
$countries = [
	&#39;ESP&#39; =&gt; &#39;Spain&#39;,
	&#39;USA&#39; =&gt; &#39;United States&#39;,
];
$this-&gt;addFilterSelect(&#39;ListFacturaCliente&#39;, &#39;codpais&#39;, &#39;country&#39;, &#39;codpais&#39;, $countries);
```

### Ejemplo en un EditController
```
$countries = $this-&gt;codeModel-&gt;all(&#39;paises&#39;, &#39;codpais&#39;, &#39;nombre&#39;);
$this-&gt;listView($viewName)-&gt;addFilterSelect(&#39;codpais&#39;, &#39;country&#39;, &#39;codpais&#39;, $countries);
```
