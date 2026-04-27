---
id: 646
permalink: row-status-477
title: Row status (XMLView)
creationdate: 07-05-2018 00:00:00
lastmod: 31-10-2025
url: https://facturascripts.com/publicaciones/row-status-477
---

El tipo de estado permite **colorear las filas en función del valor de un campo** del registro o de una serie de condiciones. Se declara mediante la inclusión de una relación de uno o varios registros **option**, indicando la configuración que se aplicará para la fila. Los atributos que se pueden especificar son:

- **color** (obligatorio): Para indicar el color deseado.
- **fieldname**: Indica sobre qué campo se valida la opción.
- **title**: Texto identificativo para el usuario de la opción.

```xml
&lt;rows&gt;
	&lt;row type=&quot;status&quot;&gt;
		&lt;option color=&quot;success&quot; fieldname=&quot;estado&quot; title=&quot;open&quot;&gt;ABIERTO&lt;/option&gt;
		&lt;option color=&quot;warning&quot; fieldname=&quot;estado&quot; title=&quot;closed&quot;&gt;CERRADO&lt;/option&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```

### 🎨 Colores
Los colores para la selección provienen de la biblioteca Bootstrap:
- **info**: azul
- **success**: verde
- **warning**: amarillo
- **danger**: rojo
- **light**: gris claro
- **secondary**: negro

### 🧮 Operadores
Se pueden usar los siguientes operadores en el valor de la etiqueta *option*:
- `gt:`: Se aplica si el valor del campo del modelo es **mayor que** el valor indicado.
- `gte:`: Se aplica si el valor del campo del modelo es **mayor o igual que** el valor indicado.
- `lt:`: Se aplica si el valor del campo del modelo es **menor que** el valor indicado.
- `lte:`: Se aplica si el valor del campo del modelo es **menor o igual que** el valor indicado.
- `neq:`: Se aplica si el valor del campo del modelo es **distinto de** el valor indicado.
- `null:`: Se aplica si el valor del campo del modelo **es nulo**.
- `notnull:`: Se aplica si el valor del campo del modelo **no es nulo**.

En cualquier otro caso, se realizará una comprobación de igualdad, es decir, que el valor del campo del modelo sea **igual** al valor indicado.

También se puede usar el comodín `field:XXX` para comparar con el valor de otra columna.

### Declaración de las Condiciones
Para declarar condiciones, se pueden utilizar los siguientes métodos:
- Un único campo: Se declara el atributo **fieldname** dentro de la declaración del **row**, indicando el nombre del campo que contendrá los valores.
- Varios campos: Se declara el atributo **fieldname** dentro de la declaración del **option**, indicando el nombre del campo que contendrá los valores.
- Ambos: Se declara el atributo **fieldname** dentro de **row** y dentro de los **option** que no utilicen el campo general indicado dentro de *row*.

### Ejemplo para Condiciones con un Mismo Campo
```xml
&lt;rows&gt;
	&lt;row type=&quot;status&quot; fieldname=&quot;estado&quot;&gt;
		&lt;option color=&quot;info&quot; title=&quot;pending&quot;&gt;Pendiente&lt;/option&gt;
		&lt;option color=&quot;warning&quot; title=&quot;partial&quot;&gt;Parcial&lt;/option&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```
- Pinta la fila de color azul si el campo **&#39;estado&#39;** es **&#39;Pendiente&#39;**.
- Pinta la fila de color amarillo si el campo **&#39;estado&#39;** es **&#39;Parcial&#39;**.

#### Ejemplo para Condiciones con Distintos Campos y Valores
```xml
&lt;rows&gt;
	&lt;row type=&quot;status&quot;&gt;
		&lt;option color=&quot;info&quot; fieldname=&quot;nostock&quot;&gt;1&lt;/option&gt;
		&lt;option color=&quot;danger&quot; fieldname=&quot;bloqueado&quot;&gt;1&lt;/option&gt;
		&lt;option color=&quot;success&quot; fieldname=&quot;stockfis&quot;&gt;gt:1&lt;/option&gt;
		&lt;option color=&quot;warning&quot; fieldname=&quot;stockfis&quot;&gt;lt:1&lt;/option&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```
- Pinta la fila de color azul si el campo **&#39;nostock&#39;** es **&#39;Verdadero&#39;**.
- Pinta la fila de color rojo si el campo **&#39;bloqueado&#39;** es **&#39;Verdadero&#39;**.
- Pinta la fila de color verde si el campo **&#39;stockfis&#39;** es **mayor que 0**.
- Pinta la fila de color amarillo si el campo **&#39;stockfis&#39;** es **menor que 1**.

#### Ejemplo para Comparar con Otro Campo
```xml
&lt;rows&gt;
	&lt;row type=&quot;status&quot;&gt;
		&lt;option color=&quot;danger&quot; fieldname=&quot;disponible&quot;&gt;lt:field:stockmin&lt;/option&gt;
	&lt;/row&gt;
&lt;/rows&gt;
```
- Pinta la fila de color rojo si el campo **&#39;disponible&#39;** es menor que el valor del campo **&#39;stockmin&#39;**.

### Añadir Colores desde el Controlador
Desde `ListController`, también se pueden añadir colores a los listados:
```php
$this-&gt;addColor($viewName, &#39;nostock&#39;, 1, &#39;info&#39;, &#39;no controla stock&#39;);
```

Desde `EditController`, también se pueden añadir colores a los listados:
```php
$this-&gt;view[$viewName]-&gt;addColor(&#39;nostock&#39;, 1, &#39;info&#39;, &#39;no controla stock&#39;);
```

La **función addColor()** tiene los siguientes parámetros:
- **$fieldName**: Nombre del campo sobre el cual realizar la comprobación, igual a *fieldname* en el XML.
- **$value**: Valor a comprobar; el **$fieldName** se comparará con este valor.
- **$color**: Color a mostrar en la fila.
- **$title**: Texto a mostrar en la leyenda de los colores.
