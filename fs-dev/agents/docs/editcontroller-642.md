---
id: 681
permalink: editcontroller-642
title: EditController
creationdate: 30-04-2018 00:00:00
lastmod: 12-07-2026
url: https://facturascripts.com/publicaciones/editcontroller-642
---
Es un **controlador extendido** para editar muy rápidamente los valores de un modelo. Como el resto de controladores extendidos, hace uso de [vistas XML](https://facturascripts.com/publicaciones/las-vistas-xml-xmlview-668).

![ejemplo editcontroller](https://i.imgur.com/jAdhJWj.png)

## Ejemplo: EditFabricante.php
Este es un controlador muy sencillo para editar el modelo Fabricante. Basta con indicar el nombre del modelo; del resto se encarga EditController:
```php
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
Esta función debe devolver el nombre del modelo a editar. No se necesita nada más para tener una ficha de edición funcional.

### getModel()
Devuelve el modelo de la pestaña principal, ya cargado durante loadData(). Es la forma habitual de acceder al registro que se está editando desde cualquier método del controlador:
```php
$fabricante = $this-&gt;getModel();
$codigo = $fabricante-&gt;codfabricante;
```

### Nombre de la pestaña principal
Puedes obtener el nombre de la pestaña principal con el método **getMainViewName()**. El nombre siempre es Edit + getModelClassName() (por ejemplo, EditFabricante).

### Campos a editar
Este controlador buscará automáticamente un archivo con el nombre **Edit{NOMBRE_DEL_MODELO}.xml** en la [carpeta XMLView](https://facturascripts.com/publicaciones/las-vistas-xml-xmlview-668). Este archivo es el que define la interfaz de usuario, qué campos editar y cómo.

### Vista de sólo lectura
Es posible establecer las vistas *Edit* como sólo lectura desde el controlador. Esto cambia el template Twig que se usará para renderizar la vista, de modo que no se incluirán los botones de borrado y guardado de datos, además de visualizar los datos sin posibilidad de edición. Para activar o desactivar esta opción debemos llamar al método **setReadOnly()** de la vista:
```php
$this-&gt;tab($this-&gt;getMainViewName())-&gt;setReadOnly(true);
```

### 🛠️ Qué hace createViews() por defecto
Aunque en el ejemplo no lo veas, EditController implementa `createViews()` por ti. Ese método crea la pestaña principal con `addEditView()` usando el modelo de getModelClassName(), toma el título y el icono de getPageData() y activa el botón de imprimir:
```php
protected function createViews()
{
    $viewName = &#39;Edit&#39; . $this-&gt;getModelClassName();
    $this-&gt;addEditView($viewName, $this-&gt;getModelClassName(), $title, $icon);
    $this-&gt;setSettings($viewName, &#39;btnPrint&#39;, true);
}
```
Si necesitas añadir más pestañas, sobreescribe `createViews()` y **llama primero a `parent::createViews()`** para no perder la pestaña principal.

### 📥 Qué hace loadData() por defecto
EditController también trae su propio `loadData()` para la pestaña principal. Se encarga de:

- Localizar el registro por el parámetro `code` (o por la clave primaria del modelo cuando no se llama *code*).
- Comprobar si el usuario tiene permiso sobre esos datos (`checkOwnerData`); si no, muestra la pantalla de acceso denegado.
- Avisar con `record-not-found` si se pide un código que no existe.
- Añadir la descripción del registro (`primaryDescription()`) al título de la página.

Por eso, cuando añadas pestañas nuevas y sobreescribas `loadData()`, deja el `default` llamando a `parent::loadData()` para que la pestaña principal siga cargándose.

## Añadir más pestañas
Al ser una extensión de [PanelController](https://facturascripts.com/publicaciones/panelcontroller-845), este controlador permite añadir más tipos de pestañas o secciones para ver o editar otros modelos relacionados. Dispones de [addEditView()](https://facturascripts.com/publicaciones/addeditview-95), [addEditListView()](https://facturascripts.com/publicaciones/addeditlistview-505) y [addHtmlView()](https://facturascripts.com/publicaciones/addhtmlview-794). Puedes añadir pestañas extendiendo `createViews()` y `loadData()`:
```php
protected function createViews()
{
    parent::createViews();
    $this-&gt;addListView(&#39;ListProducto&#39;, &#39;Producto&#39;, &#39;products&#39;, &#39;fas fa-cubes&#39;);
}

protected function loadData($viewName, $view)
{
    switch ($viewName) {
        case &#39;ListProducto&#39;:
            $where = [Where::eq(&#39;codfabricante&#39;, $this-&gt;getModel()-&gt;id())];
            $view-&gt;loadData(&#39;&#39;, $where);
            break;

        default:
            parent::loadData($viewName, $view);
            break;
    }
}
```
Puedes leer más sobre cómo añadir pestañas y tipos de pestañas en la documentación de [PanelController](https://facturascripts.com/publicaciones/panelcontroller-845).

## 🔘 Botones y acciones personalizadas
Con **addButton()** puedes añadir botones propios a una pestaña. Se indican la acción, el color, el icono y la etiqueta (que se traduce); con `confirm` en true se pide confirmación antes de ejecutar:
```php
$this-&gt;addButton($viewName, [
    &#39;action&#39; =&gt; &#39;add-product&#39;,
    &#39;color&#39; =&gt; &#39;success&#39;,
    &#39;icon&#39; =&gt; &#39;fa-solid fa-folder-plus&#39;,
    &#39;label&#39; =&gt; &#39;add&#39;,
]);
```
Cuando el usuario pulsa el botón, se envía su `action`. Para responder, sobreescribe **execPreviousAction()** (se ejecuta antes de cargar los datos) o **execAfterAction()** (después), y deja el `default` delegando en el padre:
```php
protected function execPreviousAction($action)
{
    switch ($action) {
        case &#39;add-product&#39;:
            $this-&gt;addProductAction();
            return true;

        default:
            return parent::execPreviousAction($action);
    }
}
```
Para los botones que actúan sobre las filas de un listado, consulta [Row actions](https://facturascripts.com/publicaciones/row-actions-315).

## 🙈 Por qué no aparece en el menú
EditController fuerza `showonmenu = false` en su getPageData(), por lo que estos controladores no se muestran en el menú: se abren desde el listado correspondiente (por ejemplo, al pulsar una fila de ListFabricante). Si quieres cambiar el título, el icono o el menú, sobreescribe getPageData() llamando a `parent::getPageData()`.

## 🖨️ Impresión y exportación
La pestaña principal trae activado el botón de imprimir (`btnPrint`), de modo que puedes exportar la ficha a PDF u otros formatos. Si no quieres ese botón en una vista, desactívalo con:
```php
$this-&gt;setSettings($viewName, &#39;btnPrint&#39;, false);
```

## 🗂️ Acceder a las pestañas: tab() y activeTab()

Al heredar de [PanelController](https://facturascripts.com/publicaciones/panelcontroller-845), este controlador dispone de los métodos `tab()` y `activeTab()` para acceder a las vistas desde cualquier parte del controlador.

`tab($viewName)` devuelve el objeto de una vista concreta por su nombre (lanza una excepción `View not found` si no existe), y `activeTab()` devuelve la vista que el usuario tiene seleccionada en ese momento:

```php
// la pestaña principal (Edit + nombre del modelo)
$view = $this-&gt;tab($this-&gt;getMainViewName());

// la pestaña activa y su modelo
$model = $this-&gt;activeTab()-&gt;model;
```

Tienes más detalle en la documentación de [PanelController](https://facturascripts.com/publicaciones/panelcontroller-845).