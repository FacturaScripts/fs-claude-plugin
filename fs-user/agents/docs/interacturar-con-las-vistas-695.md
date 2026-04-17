---
id: 690
permalink: interacturar-con-las-vistas-695
title: Interacción con las Vistas
creationdate: 19-10-2018 00:00:00
lastmod: 15-04-2025
url: https://facturascripts.com/interacturar-con-las-vistas-695
---
Las vistas XML permiten controlar los objetos en la pantalla de manera sencilla. A continuación, se mostrarán algunos ejemplos sobre cómo acceder y modificar la configuración de una columna y su widget desde nuestro controlador. Es importante recordar dos conceptos clave:

1. **Controladores extendidos**: Son contenedores de vistas (**$this-&gt;views**).
2. **Proceso de carga**: Se realiza según el siguiente patrón:
   - **Añadir vista**: Carga la configuración de la vista para el usuario activo.
   - **Cargar datos**: Lee los datos del modelo de la vista.
   - **Pintado de la vista**: Utilizando una plantilla Twig, se compone y visualiza la vista al usuario.

Existen dos procesos donde se cargan los datos de configuración de la vista, lo que permite alterarlos antes de que el usuario los reciba.

## Selección de Columnas
Una vez cargada la vista, para modificar la configuración de una columna y/o de su widget, primero debemos acceder a la columna. Para esto, **la vista** tiene dos métodos que devuelven un objeto de la clase **ColumnItem**:
- **columnForField**: Devuelve la columna cuyo *fieldname* es igual al indicado.
- **columnForName**: Devuelve la columna que tiene como *name* el indicado.

```php
// Establece el tamaño de la columna en 6 y amplía el nivel de seguridad a 50
$column1 = $this-&gt;views[&#39;Nombre_de_Vista&#39;]-&gt;columnForField(&#39;Nombre_del_campo&#39;);
$column1-&gt;numColumns = 6;
$column1-&gt;level = 50;

// Establece una longitud máxima de los datos a 50 caracteres
$column2 = $this-&gt;views[&#39;Nombre_de_Vista&#39;]-&gt;columnForName(&#39;Nombre_de_la_columna&#39;);
$column2-&gt;widget-&gt;maxLength = 50;
```

## Activar y Desactivar Columnas
Además de poder activar y desactivar columnas mediante la propiedad *readOnly* del widget de la columna, existe un método más directo desde la vista. Para ello, utilizaremos el método *disableColumn*, indicando el *name* de la columna en el archivo XML y si deseamos que esté habilitada o no.

```php
// Desactivar mediante Widget (NO RECOMENDADO)
$column = $this-&gt;views[&#39;Nombre_de_Vista&#39;]-&gt;columnForField(&#39;Nombre_del_campo&#39;);
$column-&gt;widget-&gt;readonly = &#39;true&#39;;

// Desactivar mediante Vista (RECOMENDADO)
$this-&gt;views[&#39;Nombre_de_Vista&#39;]-&gt;disableColumn(&#39;Nombre_de_la_columna&#39;, true);
```

## Selección de Filtros en ListController
Para controladores que heredan de ListController, es posible personalizar o alterar los filtros añadidos a una vista. Debemos seleccionar la vista y luego seleccionar el filtro consultando la propiedad **filters**, que contiene un array con cada uno de los filtros definidos (un array de *BaseFilter*). Para seleccionar el filtro, utilizaremos el nombre que indicamos como *key* al añadirlo a la vista.

```php
// Ejemplo de carga manual de valores en filtros de tipo select
$companyFilter = $this-&gt;views[&#39;ListEmployee&#39;]-&gt;filters[&#39;company&#39;];
$companyFilter-&gt;options[&#39;values&#39;] = $this-&gt;codeModel-&gt;all(&#39;empresas&#39;, &#39;idempresa&#39;, &#39;nombre&#39;);

$departmentsFilter = $this-&gt;views[&#39;ListEmployee&#39;]-&gt;filters[&#39;company&#39;];
$departmentsFilter-&gt;options[&#39;values&#39;] = $this-&gt;codeModel-&gt;all(&#39;departments&#39;, &#39;id&#39;, &#39;name&#39;);

// Ejemplo de captura del valor del filtro
$companyFilter = $this-&gt;views[&#39;ListEmployee&#39;]-&gt;filters[&#39;company&#39;];
if ($companyFilter-&gt;value !== &#39;&#39;) {
    [ ... nuestras instrucciones PHP ... ]
}
```

## Añadir Botones de Acción
También puedes añadir un botón de acción utilizando el método **addButton()**. Por ejemplo, este botón redirige al controlador EditProducto.

```php
$this-&gt;addButton(&#39;ListProducto&#39;, [
    &#39;action&#39; =&gt; &#39;EditProducto&#39;,
    &#39;icon&#39; =&gt; &#39;fas fa-plus&#39;,
    &#39;label&#39; =&gt; &#39;Nuevo&#39;,
    &#39;type&#39; =&gt; &#39;link&#39;
]);
```

Para más detalles sobre los botones, consulta la sección de [acciones en fila](https://facturascripts.com/publicaciones/row-actions-315).
