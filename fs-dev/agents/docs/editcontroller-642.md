---
id: 681
permalink: editcontroller-642
title: EditController
creationdate: 30-04-2018 00:00:00
lastmod: 28-05-2025
url: https://facturascripts.com/editcontroller-642
---
Es un **controlador extendido** para editar muy rápidamente los valores de un modelo. Como el resto de controladores extendidos, hace uso de [vistas XML](https://facturascripts.com/publicaciones/las-vistas-xml-xmlview-668).

![ejemplo editcontroller](https://i.imgur.com/jAdhJWj.png)

## Ejemplo: EditFabricante.php
Este es un controlador muy sencillo para editar el modelo Fabricante.
```
&lt;?php
namespace FacturaScripts\Core\Controller;

use FacturaScripts\Core\Lib\ExtendedController\EditController;

class EditFabricante extends EditController
{
    public function getModelClassName(): string
    {
        return &#39;Fabricante&#39;;
    }
}
```

### getModelClassName()
Esta función debe devolver el nombre del modelo a editar. No se necesita nada más.

### Nombre de la pestaña principal
Puedes obtener el nombre de la pestaña principal con el método **getMainViewName()**. El nombre siempre es Edit + getModelClassName().

### Campos a editar
Este controlador buscará automáticamente un archivo con el nombre **Edit{NOMBRE_DEL_MODELO}.xml** en la [carpeta XMLView](https://facturascripts.com/publicaciones/las-vistas-xml-xmlview-668). Este archivo es el que define la interfaz de usuario, qué campos editar y cómo.

Es posible establecer las vistas *Edit* como sólo lectura desde el controlador. Esto cambia el template TWig que se usará para renderizar la vista de modo que no se incluirán los botones de borrado y guardado de datos, además de visualizar los datos sin posibilidad de edición. Para activar o desactivar esta opción debemos llamar al método **setReadOnly** de la vista.

## Añadir más pestañas
Al ser una extensión de [PanelController](https://facturascripts.com/publicaciones/panelcontroller-845), este controlador permite añadir más tipos de pestañas o secciones para ver o editar otros modelos relacionados. Puedes añadir más pestañas extendiendo las funciones **createViews()** y **loadData()**:
```
protected function createViews()
{
	parent::createViews();
	$this-&gt;addListView(&#39;ListProducto&#39;, &#39;Producto&#39;, &#39;products&#39;, &#39;fas fa-cubes&#39;);
}

protected function loadData($viewName, $view)
{
	switch ($viewName) {
		case &#39;ListProducto&#39;:
			$where = [new DataBaseWhere(&#39;codfabricante&#39;, $this-&gt;getModel()-&gt;primaryColumnValue())];
			$view-&gt;loadData(&#39;&#39;, $where);
			break;

		default:
			parent::loadData($viewName, $view);
			break;
	}
}
```
Puedes leer más sobre cómo añadir pestañas y tipos de pestañas en la documentación de [PanelController](https://facturascripts.com/publicaciones/panelcontroller-845).
