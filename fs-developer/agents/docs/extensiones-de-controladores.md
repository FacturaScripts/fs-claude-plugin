---
id: 919
permalink: extensiones-de-controladores
title: Extensiones de controladores
creationdate: 08-05-2021 11:27:09
lastmod: 19-03-2026
url: https://facturascripts.com/extensiones-de-controladores
---
Para modificar el comportamiento o añadir pestañas o secciones a controladores de otros plugins (o del core) podemos usar una extensión o pipe, es decir, crearemos un archivo php con el mismo nombre que el controlador en la carpeta **Extension/Controller** de nuestro plugin.

## Las extensiones no son herencia
Las extensiones no son herencia. No se puede extender cualquier función imaginable, solamente las que tienen soporte. Y cada función que añadas en una extensión debe tener un **return function()**.

### Métodos disponibles para extender
- **createViews()** se ejecuta una vez realizado el [createViews() del controlador](https://facturascripts.com/publicaciones/listcontroller-232).
- **execPreviousAction()** se ejecuta después del [execPreviousAction() del controlador](https://facturascripts.com/publicaciones/controladores-extendidos-367). **Si devolvemos false** detenemos la ejecución del controlador.
- **loadData()** se ejecuta tras el loadData() del controlador. Recibe los parámetros $viewName y $view.
- **execAfterAction()** se ejecuta tras el [execAfterAction() del controlador](https://facturascripts.com/publicaciones/controladores-extendidos-367).
- **selectAction** se ejecuta antes de cargar datos en el [widget select](https://facturascripts.com/publicaciones/widget-select-557).

### Ejemplo createViews
Esto sirve para poder añadir pestañas o cualquier método a controladores que ya existen. Siguiendo con el ejemplo vamos a añadir la pestaña de logs al listado de productos (controlador ListProducto). Para ello creamos el archivo **Extension/Controller/ListProducto.php**:

```
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin\Extension\Controller;

use Closure;

class ListProducto
{
   public function createViews(): Closure
   {
      return function() {
         $this-&gt;addView(&#39;ListLogMessage&#39;, &#39;LogMessage&#39;, &#39;log&#39;);
      };
   }
}
```

### Ejemplo loadData
Esto sirve para hacer acciones al momento de cargar los datos en las vistas, por ejemplo cargar los logs de la pestaña que antes añadimos en el createviews, pero solo cuando el log sea del tipo error. Para ello creamos el archivo **Extension/Controller/ListProducto**. Este método recibe dos parámetros **$viewName** (lleva solo el nombre en formato string de la pestaña que se está ejecutando en ese momento) y **$view** (lleva un objeto con los datos de la pestaña).
```
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin\Extension\Controller;

use Closure;

class ListProducto
{
   public function loadData(): Closure
   {
      return function($viewName, $view) {
				if ($viewName === &#39;ListLogMessage&#39;) {
					$where = [new DataBaseWhere(&#39;tipo&#39;, &#39;error&#39;)];
					$view-&gt;loadData(&#39;&#39;, $where);
					break;
				}
      };
   }
}
```

### Ejemplo execPreviousAction
Esto sirve para ejecutar una acción antes de la ejecución del controlador, por ejemplo para capturar que hacer al clicar un botón. Recibe como parámetro un string **$action** con el nombre de la acción.
```
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin\Extension\Controller;

use Closure;

class ListProducto
{
   public function execPreviousAction(): Closure
   {
      return function($action) {
				if ($action === &#39;clic-button&#39;) {
					// aquí ponemos nuestro código para ejecutar con está acción
					return;
				}
      };
   }
}
```

### Ejemplo execAfterAction
Esto sirve para ejecutar una acción después de la ejecución del controlador, por ejemplo para capturar que hacer al clicar un botón. Recibe como parámetro un string **$action** con el nombre de la acción.
```
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin\Extension\Controller;

use Closure;

class ListProducto
{
   public function execAfterAction(): Closure
   {
      return function($action) {
				if ($viewName === &#39;clic-button&#39;) {
					// aquí ponemos nuestro código para ejecutar con está acción
					return;
				}
      };
   }
}
```

### Ejemplo selectAction
Esto sirve para devolver los datos que debe llevar un select, debe devolver siempre un array con los datos clave=valor. Recibe como parámetros **$data** (un array con los datos recibidos por get/post) y **$required** (para indicar si el select es de tipo requerido o no).
```
&lt;?php
namespace FacturaScripts\Plugins\MiPlugin\Extension\Controller;

use Closure;

class ListProducto
{
   public function selectAction(): Closure
   {
      return function($data, $required) {
				$results = [];
        foreach ($this-&gt;codeModel-&gt;all($data[&#39;source&#39;], $data[&#39;fieldcode&#39;], $data[&#39;fieldtitle&#39;], !$required, $where) as $value) {
            // no usar fixHtml() aquí porque compromete la seguridad
            $results[] = [&#39;key&#39; =&gt; $value-&gt;code, &#39;value&#39; =&gt; $value-&gt;description];
        }
        return $results; 
      };
   }
}
```

Recuerda que las funciones deben tener un **return function()** y que debes cargar la extensión desde el archivo **Init.php** del plugin.

### Cargar extensiones en el Init.php
Las extensiones de archivos xml se integran automáticamente al activar el plugin o reconstruir Dinamic. En cambio, las extensiones de archivos php se deben cargar explícitamente llamando al método ``loadExtension()`` del [archivo Init.php del plugin](https://facturascripts.com/publicaciones/el-archivo-init-php-307), en el método **init()**.

```
public function init(): void
{
   // cargamos la extensión del controlador ListProducto
   $this-&gt;loadExtension(new Extension\Controller\ListProducto());
}
```

## fsmaker
Para hacer este mismo proceso con [fsmaker](https://facturascripts.com/publicaciones/fsmaker-0-92-disponible) ejecutamos:

```
fsmaker extension
```

En el asistente elegimos controlador y escribimos el nombre del controlador.

## ¿No funciona?
Los errores más comunes son:
- **Tener un namespace incorrecto**. El namespace debe reflejar la ruta donde está el archivo. Si el archivo está en la carpeta Extension/Model de tu plugin, el namespace debe incluir Extension\Model.
- **Intentar extender funciones que no soportan extensiones**. Solamente las funciones o métodos indicados arriba se pueden extender.
- **No usar return function()**. Las funciones deben devolver un return function(), y si no, no funcionará. Si la función necesita parámetros, estos deben ir en el return function().
- **No cargar la extensión desde el Init.php del plugin**.

### Parámetros por referencia
Si crear funciones personalizadas y estas incluyen parámetros no se debe poner &quot;&&quot; en los parámetros ya que no está permitido, y causará problemas. Como sugerencia puedes devolverte el parámetro que deseas modificar.

**Ejemplo mal**
```
public function applyStockChangesFromWork(): Closure
{
		return function (&$stock) {
			$stock-&gt;cantidad = 5;
		};
}
```

**Ejemplo Bueno**
```
public function applyStockChangesFromWork(): Closure
{
		return function ($stock) {
			$stock-&gt;cantidad = 5;
			return $stock;
		};
}
```
