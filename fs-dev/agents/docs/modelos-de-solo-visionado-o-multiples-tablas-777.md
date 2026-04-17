---
id: 669
permalink: modelos-de-solo-visionado-o-multiples-tablas-777
title: Modelos de Más de Una Tabla
creationdate: 11-05-2018 00:00:00
lastmod: 03-08-2025
url: https://facturascripts.com/modelos-de-solo-visionado-o-multiples-tablas-777
---
En ocasiones, es necesario mostrar listados que consulten **más de una tabla**. Si el [widget select](https://facturascripts.com/publicaciones/widget-select-557) o el [widget autocomplete](https://facturascripts.com/publicaciones/widget-autocomplete-946) no resuelven nuestro problema, podemos utilizar **JoinModel** para solucionarlo.

## ¿Qué es un JoinModel?
El JoinModel es un tipo especial de modelo que **se utiliza exclusivamente para listados**. Esto significa que **no está diseñado** para crear, editar o eliminar datos. Su única función es la visualización de datos.

### Ejemplo de Uso de JoinModel
Para crear un JoinModel, debemos definir una clase en la carpeta **Model/Join** de nuestro plugin que herede de **Core/Model/Base/JoinModel**. Esta clase debe implementar los métodos `getTables()`, `getFields()` y `getSQLFrom()`, los cuales especificarán las tablas y campos a utilizar.

**Ejemplo: Model/Join/PartidaAsiento.php**: A continuación, crearemos un JoinModel que combine las tablas `partidas` y `asientos`.

```php
namespace FacturaScripts\Plugins\MyNewPlugin\Model\Join;

use FacturaScripts\Core\Model\Base\JoinModel;

class PartidaAsiento extends JoinModel
{
    protected function getFields(): array
    {
        return [
            &#39;concepto&#39; =&gt; &#39;partidas.concepto&#39;,
            &#39;debe&#39; =&gt; &#39;partidas.debe&#39;,
            &#39;fecha&#39; =&gt; &#39;asientos.fecha&#39;,
            &#39;haber&#39; =&gt; &#39;partidas.haber&#39;,
            &#39;idasiento&#39; =&gt; &#39;partidas.idasiento&#39;,
            &#39;idpartida&#39; =&gt; &#39;partidas.idpartida&#39;,
            &#39;numero&#39; =&gt; &#39;asientos.numero&#39;
        ];
    }

    protected function getSQLFrom(): string
    {
        return &#39;partidas LEFT JOIN asientos ON partidas.idasiento = asientos.idasiento&#39;;
    }

    protected function getTables(): array
    {
        return [&#39;asientos&#39;, &#39;partidas&#39;];
    }
}
```

### Descripción de los Métodos

#### `getTables()`
Este método debe devolver el listado de tablas que vamos a utilizar:
```php
protected function getTables(): array
{
    return [
        &#39;asientos&#39;,
        &#39;partidas&#39;,
        &#39;subcuentas&#39;
    ];
}
```

#### `getFields()`
Este método debe devolver un array asociativo con los campos que vamos a utilizar y a qué tabla corresponden:
```php
protected function getFields(): array
{
    return [
        &#39;codejercicio&#39; =&gt; &#39;asientos.codejercicio&#39;,
        &#39;codcuentaesp&#39; =&gt; &#39;subcuentas.codcuentaesp&#39;,
        &#39;descripcion&#39; =&gt; &#39;cuentasesp.descripcion&#39;,
        &#39;codimpuesto&#39; =&gt; &#39;subcuentas.codimpuesto&#39;,
        &#39;iva&#39; =&gt; &#39;partidas.iva&#39;,
        &#39;recargo&#39; =&gt; &#39;partidas.recargo&#39;,
        &#39;baseimponible&#39; =&gt; &#39;SUM(partidas.baseimponible)&#39;
    ];
}
```

#### `getSQLFrom()`
Este método debe devolver la consulta SQL con los JOIN correspondientes:
```php
protected function getSQLFrom(): string
{
    return &#39;asientos&#39;
        . &#39; INNER JOIN partidas ON partidas.idasiento = asientos.idasiento&#39;
        . &#39; INNER JOIN subcuentas ON subcuentas.idsubcuenta = partidas.idsubcuenta&#39;
        . &#39; AND subcuentas.codimpuesto IS NOT NULL&#39;
        . &#39; AND subcuentas.codcuentaesp IS NOT NULL&#39;
        . &#39; LEFT JOIN cuentasesp ON cuentasesp.codcuentaesp = subcuentas.codcuentaesp&#39;;
}
```

## Métodos Opcionales

### `getGroupFields()`
En casos donde se desee agrupar información para obtener totales o datos estadísticos, podemos definir las cláusulas *GROUP BY* y *HAVING* de la sentencia SQL mediante este método. Debe devolver una cadena de texto con los valores a aplicar:
```php
protected function getGroupFields(): string
{
    return &#39;asientos.codejercicio, subcuentas.codcuentaesp,&#39;
        . &#39;cuentasesp.descripcion, subcuentas.codimpuesto,&#39;
        . &#39;partidas.iva, partidas.recargo&#39;;
}
```

### `primaryColumnValue()`
Este método permite especificar cuál es la clave primaria. Al cargar el JoinModel, los checkboxes de cada fila tendrán como valor la clave primaria correspondiente. Este método es necesario si se requiere añadir alguna función extra, como un botón personalizado que interactúe con los checkboxes seleccionados:
```php
public function primaryColumnValue()
{
    return $this-&gt;codejercicio;
}
```

## Edición y Borrado de Datos
Este modelo no permite la edición ni el borrado directamente, ya que utiliza distintas tablas en el proceso de visualización de datos. Sin embargo, se puede establecer un modelo como *principal* sobre el cual se realizarán los procesos de edición y borrado.

Para establecer el modelo principal, se debe llamar al método **setMasterModel()** desde el constructor, pasándole una instancia del modelo:
```php
public function __construct($data = [])
{
    parent::__construct($data);
    $this-&gt;setMasterModel(new Cliente());
}
```

### Métodos `clear()` y `loadFromData()`
Si necesitamos calcular algunos valores, podemos utilizar los métodos `clear()` o `loadFromData()` para ello:
```php
public function clear()
{
    parent::clear();
    $this-&gt;cuotaiva = 0.00;
    $this-&gt;cuotarecargo = 0.00;
    $this-&gt;total = 0.00;
}

protected function loadFromData($data)
{
    parent::loadFromData($data);
    $this-&gt;cuotaiva = $this-&gt;baseimponible * ($this-&gt;iva / 100.00);
    $this-&gt;cuotarecargo = $this-&gt;baseimponible * ($this-&gt;recargo / 100.00);
    $this-&gt;total = $this-&gt;baseimponible + $this-&gt;cuotaiva + $this-&gt;cuotarecargo;
}
```
