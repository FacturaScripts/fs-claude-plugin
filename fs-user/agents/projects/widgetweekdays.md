---
idproject: 644
name: WidgetWeekdays
permalink: widgetweekdays
creationdate: 18-06-2026
lastmod: 18-06-2026
version: 1.01
betaversion: 0
mincore: 2026
maxcore: 2026.3
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/WidgetWeekdays
---
Plugin para FacturaScripts que añade widgets para seleccionar los días de la semana en
cualquier combinación, pensado para acciones que deben ejecutarse en determinados días
(tareas recurrentes, horarios, etc.). Incluye dos widgets:

- **`type=&quot;weekdays&quot;`** (base): solo los siete botones de día (lunes → domingo).
- **`type=&quot;weekdaysfull&quot;`**: lo anterior más botones de selección rápida (**Lun-Vie**,  **Todos** y **Ninguno**). Hereda del widget base.

## Almacenamiento

El valor se guarda en un campo `varchar(7)` como una cadena de `1` (día seleccionado) y
`0` (no seleccionado). El orden de los caracteres sigue el estándar **ISO 8601**
(el mismo que usa `DateTimeTools::dayOfWeek()` del ecosistema FacturaScripts):

Ejemplos:

- `1111100` → de lunes a viernes
- `0000011` → fin de semana
- `1111111` → todos los días
- `null`, `&quot;&quot;` o `0000000` → ningún día (un valor nulo o vacío equivale a todo ceros)

Para saber el índice de una fecha basta con `DateTimeTools::dayOfWeek($fecha) - 1`.

## Uso en una vista XML

1. Define el campo en el `Table/` del modelo como `varchar` de longitud 7.
2. En el `XMLView/` usa el widget con `type=&quot;weekdays&quot;`:

```xml
&lt;column name=&quot;days&quot; order=&quot;100&quot;&gt;
    &lt;widget type=&quot;weekdays&quot; fieldname=&quot;days&quot;/&gt;
&lt;/column&gt;
```

## Selección visual

- Botones tipo *toggle* de Bootstrap 5 (`.btn-check`), uno por día.
- Botones de selección rápida: **Lun-Vie**, **Fin de semana**, **Todos** y **Ninguno**.

Toda la lógica de cliente es JavaScript vanilla; un único campo oculto con la cadena de
7 caracteres es lo que se envía en el formulario.

## Filtro en listados (ListView)

El plugin incluye `Lib/ListFilter/WeekdaysFilter` para filtrar un listado por el campo
varchar(7). Se añade como cualquier otro filtro, normalmente desde una extensión del
`ListController` (igual que hace el plugin ProductFamilyFilter), asignándolo al array
`filters` de la vista:

```php
use FacturaScripts\Dinamic\Lib\ListFilter\WeekdaysFilter;

// dentro de createViews() (o de una extensión del controlador):
$this-&gt;views[&#39;MiListView&#39;]-&gt;filters[&#39;weekdays&#39;] =
    new WeekdaysFilter(&#39;weekdays&#39;, &#39;weekdays&#39;, &#39;weekdays&#39;);
// argumentos: (key, fieldname, label)
```

El filtro muestra los 7 días como botones y devuelve los registros que tienen activos
**todos** los días marcados (combinación AND). Para un único día seleccionado equivale a
&quot;registros con ese día activo&quot;. Reutiliza el JS/CSS del propio widget, por lo que no
requiere assets adicionales.