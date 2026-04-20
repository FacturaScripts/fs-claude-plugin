---
id: 684
permalink: addeditlistview-505
title: addEditListView()
creationdate: 04-05-2018 00:00:00
lastmod: 05-06-2025
url: https://facturascripts.com/addeditlistview-505
---
La función `addEditListView()` permite añadir una pestaña o sección en el [EditController](https://facturascripts.com/publicaciones/editcontroller-642) o PanelController para editar múltiples registros de un modelo. Se utiliza dentro del método **createViews()** del controlador.

## Sintaxis

```php
$this-&gt;addEditListView($viewName, $modelName, $viewTitle, $viewIcon);
```

- **$viewName**: Identificador o nombre interno de la pestaña o sección. Ejemplo: `EditProducto`.
- **$modelName**: Nombre del modelo asociado. Ejemplo: `Producto`.
- **$viewTitle**: Título visible de la pestaña o sección (será traducido automáticamente). Ejemplo: `products`.
- **$viewIcon**: *(opcional)* Icono a utilizar. Ejemplo: `fas fa-folder`.

## Ejemplo de uso

```php
protected function createViews()
{
    // Importante: llamar primero al método del padre
    parent::createViews();

    // Añadimos la pestaña agrupando la lógica
    $this-&gt;createViewsProductos();
}

protected function createViewsProductos(string $viewName = &#39;EditCuentaBancoCliente&#39;)
{
    $this-&gt;addEditListView($viewName, &#39;CuentaBancoCliente&#39;, &#39;customer-banking-accounts&#39;, &#39;fas fa-piggy-bank&#39;);
}
```

![Ejemplo de addEditListView](https://i.imgur.com/vflxqSm.png)

---

## Versión mini o &quot;inline&quot;

Para activar la versión reducida o &quot;inline&quot; de la pestaña, añade:

```php
$this-&gt;tab($viewName)-&gt;setInLine(true);
```

---

## Relación con XMLView

La pestaña añadida utilizará un archivo [XMLView](https://facturascripts.com/publicaciones/las-vistas-xml-xmlview-668) con el mismo nombre que la pestaña. Por ejemplo, para `EditCuentaBancoCliente`, el archivo debe llamarse **XMLView/EditCuentaBancoCliente.xml**. Este archivo define los campos que se mostrarán en el formulario.

---

## Método loadData($viewName, $view)

Para cargar los datos en la pestaña (por ejemplo, editar una cuenta bancaria), implementa el método `loadData()`. Este método es llamado por `PanelController` y `EditController` al cargar los valores de cada pestaña o sección.

### Ejemplo de implementación:

```php
protected function loadData($viewName, $view)
{
    switch ($viewName) {
        default:
            // Importante: mantener la llamada al padre
            parent::loadData($viewName, $view);
            break;

        case &#39;EditProducto&#39;:
            // Obtener codcliente desde la pestaña EditCliente y filtrar
            $codcliente = $this-&gt;getViewModelValue(&#39;EditCliente&#39;, &#39;codcliente&#39;);
            $where = [new DataBaseWhere(&#39;codcliente&#39;, $codcliente)];
            $view-&gt;loadData(&#39;&#39;, $where);
            break;
    }
}
```

---

## Obtener valores de otro modelo con getViewModelValue()

Utiliza `getViewModelValue()` para acceder a valores del modelo asociado a otra pestaña o vista dentro del mismo controlador.

```php
// Obtener el valor de codcliente del modelo de la pestaña EditCliente
$codcliente = $this-&gt;getViewModelValue(&#39;EditCliente&#39;, &#39;codcliente&#39;);
```
