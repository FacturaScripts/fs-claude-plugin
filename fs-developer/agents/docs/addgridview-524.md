---
id: 686
permalink: addgridview-524
title: addGridView() - (obsoleto)
creationdate: 11-05-2018 00:00:00
lastmod: 29-05-2025
url: https://facturascripts.com/addgridview-524
---
Añade una vista para editar un registro *padre* de un modelo y múltiples registros *hijos* de un modelo. La edición de los registros hijos se realiza mediante el componente handsontable que nos permite editar los datos a modo de hoja de cálculo. Sólo es posible tener una única vista Grid dentro de un PanelController. Se usa dentro de la función **createViews()** del PanelController.  Debido a la necesidad de enlazar la vista padre con su detalle este método difiere de los otros métodos usados para añadir vistas. En este caso debemos informar con un array la vista padre y la hija. El array debe contener las claves **name** y **model** junto con sus valores.

``OBSOLETO: fue eliminado de FacturaScripts 2022``

El tratamiento de las dos vistas (padre y detalle) se realiza de manera conjunta por lo que en caso de utilizar un EditController como base de nuestro controlador **no debemos** llamar al método padre en createViews (esto crearía dos veces la vista padre).

Para el correcto renderizado de estás vistas es necesario usar la plantilla GridView o una que herede de esta. Esta sólo es utilizada cuando el modelo padre tiene un registro de datos. En caso de ser un alta nueva, se utiliza la plantilla EditView visualizando sólo el formulario para introducir los datos del padre y al grabar se refrescará la página visualizando el grid de datos.

```
protected function createViews()
{
    $master = [&#39;name&#39; =&gt; &#39;EditAsiento&#39;, &#39;model&#39; =&gt; &#39;Asiento&#39;];
    $detail = [&#39;name&#39; =&gt; &#39;EditPartida&#39;, &#39;model&#39; =&gt; &#39;Partida&#39;];
    $this-&gt;addGridView($master, $detail, &#39;accounting-entry&#39;, &#39;fas fa-balance-scale&#39;);
    $this-&gt;views[&#39;EditAsiento&#39;]-&gt;template = &#39;EditAsiento.html.twig&#39;;
    $this-&gt;setTabsPosition(&#39;bottom&#39;);
}
```

El modelo que se indica para los datos padre debe implementar la interface GridModelInterface. Dicha interface obliga a implementar los métodos accumulateAmounts y initTotals encargados del cálculo de importes totales. En caso de no necesitar importes totales se deben implementar vacíos.

El método accumulateAmounts recibe un array con los datos del registro detalle que se está procesando.

```
/// Acumular importes en su total
public function accumulateAmounts(array &$detail)
{
    $haber = isset($detail[&#39;haber&#39;]) ? (float) $detail[&#39;haber&#39;] : 0.0;
    $this-&gt;importe += round($haber, (int) FS_NF0);
}

/// Inicializar atributos de totales
public function initTotals()
{
    $this-&gt;importe = 0.00;
}
```

## Personalización:

La plantilla GridView añade la carga de archivos y la creación de los objetos necesarios para gestionar el grid de datos, y creando un nuevo bloque denominado **gridcard** donde inserta el grid. Los datos son cargados en una variable de JavaScript denominada **documentLineData** y la visualización se realiza dentro de un card de bootstrap, en el bloque body con el identificador **document-lines**.

```
{% block gridcard %}
    &lt;div class=&quot;col&quot;&gt;
        {# Grid data panel #}
        &lt;div class=&quot;card&quot;&gt;
            &lt;div class=&quot;card-body p-0&quot;&gt;
                &lt;div id=&quot;document-lines&quot;&gt;&lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
{% endblock %}
```

Aunque estas tareas se realizan de manera automática es posible personalizar la apariencia creando nuestras propias plantillas de manera sencilla heredando de la plantilla base y sobrescribiendo el bloque *gridcard*. En este caso debemos asegurarnos que nuestra plantilla incluya una división con el identificador *document-lines* dónde se incluirá el grid.

```
{% block gridcard %}
    &lt;div class=&quot;col-9 mr-2&quot;&gt;
        &lt;div class=&quot;card&quot;&gt;
            &lt;div class=&quot;card-header&quot;&gt;
                &lt;span&gt;&lt;small id=&quot;account-description&quot;&gt;&lt;/small&gt;&lt;/span&gt;
                &lt;span class=&quot;float-right&quot;&gt;&lt;small&gt;&lt;strong&gt;{{ i18n.trans(&#39;unbalance&#39;) }}: &lt;span id=&quot;unbalance&quot;&gt;0.00&lt;/span&gt;&lt;/strong&gt;&lt;/small&gt;&lt;/span&gt;
            &lt;/div&gt;
            &lt;div class=&quot;body&quot;&gt;
                &lt;div id=&quot;document-lines&quot;&gt;&lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
{% endblock %}
```

## Establecer automatismos:

La vista lleva incorporado un gestor de eventos que hacen de intermediario entre nuestro código y el componente HandsOnTable, simplificando la personalización y evitando que tengamos que conocer en profundidad el componente. La propia vista utiliza algunos de estos eventos para su correcto funcionamiento, por lo que si se realizan configuraciones sobre el componente HandsOnTable directamente, puede dejar de funcionar correctamente.

Para añadir un control sobre el Grid añadiremos un archivo de JavaScript con el nombre del controlador en la carpeta *Assets/JS* que será cargado automáticamente junto con la vista. En el evento **$(document).ready** de nuestro archivo introduciremos los eventos a controlar realizando una llamada a la función **addEvent** por cada evento a controlar.

```
$(document).ready(function () {
    // Controla que se haya cargado el componente Grid
    if (document.getElementById(&quot;document-lines&quot;)) {
        // Añade eventos al gestor de eventos
        addEvent(&quot;afterChange&quot;, customAfterChange);
        addEvent(&quot;afterSelection&quot;, customAfterSelection);
    }
});
```

### addEvent
Esta función añade un evento al gestor de eventos. En la llamada indicaremos el nombre del evento a controlar y la función que se ejecutará cuando se lance el evento. Los eventos de estado que se pueden controlar tienen dos partes.

- **before**: Se ejecuta antes de iniciar el evento indicado.
- **after**: Se ejecuta después de completarse el evento indicado.

Así el evento con nombre **beforeChange** se ejecutará antes de comenzar la edición de una celda, mientras que el evento **afterChange** se ejecutará después de terminar la edición. Algunos ejemplos de eventos. Más información en la documentación del componente [HandsOnTable](https://handsontable.com/docs/7.0.2/Hooks.html#event).

- **BeginEditing**:	Se activa cuando el editor se abra y se procesa.
- **Change**:	Se ejecuta cuando una o más celdas hayan sido cambiadas. Por razones de rendimiento, la matriz de cambios es null para durante el evento loadData.
- **ColumnMove**:	Se ejecuta cuando se cambia el orden de los índices visuales de una columna.
- **ColumnResize**:	Se ejecuta cuando se cambia el tamaño de una columna.
- **Copy**:	Al hacer un copiar hacia el portapapeles.
- **Cut**:	Al hacer un cortar hacia el portapapeles.
- **Paste**:	Al pegar el contenido del portapapeles.
- **Undo**:	Al deshacer un cambio.
- **Select**:	Al seleccionar una celda o fila.
- **Deselect**:	Al deseleccionar una celda o fila.
- **OnCellMouseDown**: Al pulsar el botón del ratón sobre una celda.
- **OnCellMouseOver**: Al pasar el cursor del ratón sobre una celda.

## Métodos incorporados
Además del gestor de eventos, las vistas Grid incorporan una serie de funciones JavaScript para facilitar la programación de tareas personalizadas.

- **getGridColumnName**: Obtiene el nombre de campo asociado a una columna.
- **getGridData**:	Nos retorna un array con la estructura de datos. Se puede indicar el nombre de campo donde almacenar el índice del orden actual de las líneas
- **getGridFieldData**: Para obtener el valor de una celda. Devemos indicar el indice de la fila y el nombre de campo.
- **getGridRowValues**: Nos retorna un array con los datos de la fila indicada.
- **setGridRowValues**: Establece los valores informados en un array a una fila. El array con los datos debe estar formado por las claves “field” y “value” por cada columna que deseamos cambiar.
- **selectCell**:	Selecciona una celda o un rango de celdas.
- **deselectCell**:	Deselecciona todas las celdas.
- **getRowSelected**:	Obtiene la fila seleccionada.
- **getColumnSelected**: Obtiene la celda seleccionada.

### Ejemplos de uso
```
// Selecionar fila y cambiar sus valores
var selectedRow = getRowSelected();
if (selectedRow !== null) {
    var vatBody = $(&quot;#modal&quot; + idmodal).find(&quot;.modal-body&quot;);
    var values = [
        {&quot;field&quot;: &quot;documento&quot;, &quot;value&quot;: vatBody.find(&quot;.form-group input[name=\&quot;documento\&quot;]&quot;).val()},
        {&quot;field&quot;: &quot;cifnif&quot;, &quot;value&quot;: vatBody.find(&quot;.form-group input[name=\&quot;cifnif\&quot;]&quot;).val()},
        {&quot;field&quot;: &quot;baseimponible&quot;, &quot;value&quot;: vatBody.find(&quot;.form-group input[name=\&quot;baseimponible\&quot;]&quot;).val()},
        {&quot;field&quot;: &quot;iva&quot;, &quot;value&quot;: vatBody.find(&quot;.form-group input[name=\&quot;iva\&quot;]&quot;).val()},
        {&quot;field&quot;: &quot;recargo&quot;, &quot;value&quot;: vatBody.find(&quot;.form-group input[name=\&quot;recargo\&quot;]&quot;).val()}
    ];
    setGridRowValues(selectedRow, values);
}

// Cargar datos del grid a un formulario modal
var values = getGridRowValues(selectedRow);
var vatBody = $(&quot;#modal&quot; + idmodal).find(&quot;.modal-body&quot;);
vatBody.find(&quot;.form-group input[name=\&quot;cifnif\&quot;]&quot;).val(values[&quot;cifnif&quot;]);
vatBody.find(&quot;.form-group input[name=\&quot;baseimponible\&quot;]&quot;).val(values[&quot;baseimponible&quot;]);
vatBody.find(&quot;.form-group input[name=\&quot;iva\&quot;]&quot;).val(values[&quot;iva&quot;]);
vatBody.find(&quot;.form-group input[name=\&quot;recargo\&quot;]&quot;).val(values[&quot;recargo&quot;]);

// Seleccionar la primera celda del grid
selectCell(0, 0);

// Deseleccionar todas las celdas
deselectCell();
```
