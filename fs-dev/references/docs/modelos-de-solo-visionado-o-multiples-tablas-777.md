---
id: 669
permalink: modelos-de-solo-visionado-o-multiples-tablas-777
title: Modelos de Más de Una Tabla
creationdate: 11-05-2018 00:00:00
lastmod: 16-10-2026
url: https://facturascripts.com/publicaciones/modelos-de-solo-visionado-o-multiples-tablas-777
---
En ocasiones, es necesario mostrar listados que consulten **más de una tabla**. Si el [widget select](https://facturascripts.com/publicaciones/widget-select-557) o el [widget autocomplete](https://facturascripts.com/publicaciones/widget-autocomplete-946) no resuelven nuestro problema, podemos utilizar **JoinModel** para solucionarlo.

## ¿Qué es un JoinModel?
El JoinModel es un tipo especial de modelo pensado para **consultar y mostrar** datos de varias tablas, normalmente en listados. Es un modelo **de solo lectura**: no tiene método `save()`, así que no permite crear ni modificar registros.

Lo que sí puede hacer es trabajar con un **modelo principal** (*master*): a través de él se eliminan registros, se comprueba si existen y se obtiene la URL de cada fila del listado. Lo vemos en el apartado «El modelo principal».

### Ejemplo de Uso de JoinModel
Para crear un JoinModel, debemos definir una clase en la carpeta **Model/Join** de nuestro plugin que herede de **Core/Template/JoinModel**. Esta clase debe implementar los métodos `getTables()`, `getFields()` y `getSQLFrom()`, los cuales especificarán las tablas y campos a utilizar.

**Ejemplo: Model/Join/PartidaAsiento.php**: A continuación, crearemos un JoinModel que combine las tablas `partidas` y `asientos`, con `Partida` como modelo principal.

```php
namespace FacturaScripts\Plugins\MyNewPlugin\Model\Join;

use FacturaScripts\Core\Template\JoinModel;
use FacturaScripts\Dinamic\Model\Partida;

class PartidaAsiento extends JoinModel
{
    public function __construct(array $data = [])
    {
        parent::__construct($data);
        $this-&gt;setMasterModel(new Partida());
    }

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

Fíjate en que `getFields()` incluye `idpartida`, la clave primaria de `Partida`, con su mismo nombre como alias. Es necesario para que funcionen `load()`, `id()`, `delete()`, `exists()` y `url()`.

### Descripción de los Métodos

#### `getTables()`
Este método debe devolver el listado de **todas** las tablas que intervienen en la consulta, incluidas las de los `JOIN`:
```php
protected function getTables(): array
{
    return [
        &#39;asientos&#39;,
        &#39;cuentasesp&#39;,
        &#39;partidas&#39;,
        &#39;subcuentas&#39;
    ];
}
```

Esta lista se usa para tres cosas:

- **Comprobar que existen las tablas**: si falta alguna, `all()` y `count()` no devuelven resultados.
- **Obtener el tipo de cada campo**: solo se detecta el tipo de los campos cuya tabla está en la lista.
- **Invalidar la caché**: los resultados de `count()` y `totalSum()` sin filtros se guardan en caché y se borran cuando cambia alguna de estas tablas. Si olvidas una, podrías ver totales desactualizados.

#### `getFields()`
Este método debe devolver un array asociativo con los campos de la consulta: la clave es el **alias** con el que accederemos al campo (`$fila-&gt;iva`) y el valor, la **expresión SQL** (normalmente `tabla.columna`, aunque también admite funciones como `SUM()`):
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

Si el JoinModel tiene modelo principal, incluye su clave primaria con su mismo nombre como alias.

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

## Obtener los datos con all()

Una vez definido el JoinModel, los registros se consultan con el método estático `all()`, que devuelve un array de instancias del modelo:

```php
// todos los registros
$filas = PartidaAsiento::all();

foreach ($filas as $fila) {
    echo $fila-&gt;numero . &#39;: &#39; . $fila-&gt;concepto;
}
```

La firma completa es `all(array $where = [], array $order = [], int $offset = 0, int $limit = 0)`:

- `$where`: array de objetos `FacturaScripts\Core\Where` para filtrar los resultados.
- `$order`: array asociativo con el campo y el sentido, por ejemplo `[&#39;asientos.fecha&#39; =&gt; &#39;DESC&#39;]`.
- `$offset` y `$limit`: para paginar (0 en `$limit` significa sin límite).

```php
use FacturaScripts\Core\Where;

$where = [
    Where::eq(&#39;asientos.codejercicio&#39;, &#39;2024&#39;),
    Where::gt(&#39;partidas.debe&#39;, 0),
];
$order = [&#39;asientos.fecha&#39; =&gt; &#39;DESC&#39;];

$filas = PartidaAsiento::all($where, $order, 0, 50);
```

### Atajo: allWhereEq()
Para el caso más frecuente, filtrar por un campo igual a un valor, existe el atajo `allWhereEq()`, con ordenación opcional en el tercer parámetro. Ten en cuenta que en los JoinModel los filtros se aplican sobre el nombre SQL real del campo (`tabla.campo`), no sobre el alias definido en `getFields()`:

```php
$filas = PartidaAsiento::allWhereEq(&#39;asientos.codejercicio&#39;, &#39;2024&#39;, [&#39;asientos.fecha&#39; =&gt; &#39;DESC&#39;]);
```

Además, `totalSum()` devuelve la suma de un campo aplicando el mismo tipo de filtros (indicando el nombre del campo tal y como se definió en `getFields()`):

```php
$totalDebe = (new PartidaAsiento())-&gt;totalSum(&#39;debe&#39;, [
    Where::eq(&#39;asientos.codejercicio&#39;, &#39;2024&#39;),
]);
```

### Contar registros: count() y countWhereEq()
Para contar registros sin traértelos todos, usa `count()`, con un array de filtros opcional, o el atajo `countWhereEq()`. Igual que en `allWhereEq()`, los filtros se aplican sobre el nombre SQL real del campo:

```php
// total de partidas del ejercicio 2024
$total = PartidaAsiento::countWhereEq(&#39;asientos.codejercicio&#39;, &#39;2024&#39;);

// con varios filtros
$total = PartidaAsiento::count([
    Where::eq(&#39;asientos.codejercicio&#39;, &#39;2024&#39;),
    Where::gt(&#39;partidas.debe&#39;, 0),
]);
```

## Cargar un registro: load(), loadWhere() y loadWhereEq()
Para cargar una sola fila en el propio objeto se usan los mismos métodos que en el resto de modelos. Todos devuelven `true` si encuentran el registro y, si no, limpian el modelo y devuelven `false`:

- **`load($code)`**: carga la fila cuya clave primaria del modelo principal es `$code`. Requiere modelo principal y que su clave primaria esté en `getFields()`.
- **`loadWhere($where, $order)`**: carga la primera fila que cumple los filtros.
- **`loadWhereEq($campo, $valor)`**: atajo de `loadWhere()` para un único filtro de igualdad.

Igual que en `all()`, los filtros usan el nombre SQL real del campo:

```php
$fila = new PartidaAsiento();
if ($fila-&gt;load($idpartida)) {
    echo $fila-&gt;numero . &#39;: &#39; . $fila-&gt;concepto;
}

$fila-&gt;loadWhereEq(&#39;asientos.numero&#39;, 125);
```

## Métodos Opcionales

### `getGroupFields()`
En casos donde se desee agrupar información para obtener totales o datos estadísticos, podemos definir la cláusula *GROUP BY* de la sentencia SQL mediante este método. Debe devolver una cadena de texto con los campos por los que agrupar:
```php
protected function getGroupFields(): string
{
    return &#39;asientos.codejercicio, subcuentas.codcuentaesp,&#39;
        . &#39;cuentasesp.descripcion, subcuentas.codimpuesto,&#39;
        . &#39;partidas.iva, partidas.recargo&#39;;
}
```

Devuelve **solo la lista de campos**: no añadas aquí un `HAVING` ni otras cláusulas, porque `count()` también usa esta cadena dentro del `SELECT` y la consulta fallaría.

### `id()`
Devuelve el valor de la clave primaria de cada fila. Por defecto es el valor de la clave primaria del modelo principal (en el ejemplo, `idpartida`); sin modelo principal, devuelve `null`. Al cargar el JoinModel en un listado, los checkboxes de cada fila tienen este valor, así que es lo que reciben los botones personalizados que trabajan con las filas seleccionadas.

Puedes sobrescribirlo para usar otro campo:
```php
public function id()
{
    return $this-&gt;codejercicio;
}
```

Ten en cuenta que `delete()`, `exists()` y `url()` también usan `id()` para buscar el registro del modelo principal: si lo sobrescribes, debe seguir devolviendo un valor de su clave primaria.

En versiones anteriores este método se llamaba `primaryColumnValue()`, que sigue funcionando pero está obsoleto (*deprecated*).

## El modelo principal
El JoinModel combina varias tablas, así que no sabe por sí solo sobre qué registro debe actuar. Para eso se establece un modelo **principal** llamando a **setMasterModel()** desde el constructor y pasándole una instancia de un modelo que herede de `Core/Template/ModelClass`:
```php
public function __construct(array $data = [])
{
    parent::__construct($data);
    $this-&gt;setMasterModel(new Cliente());
}
```

Con el modelo principal establecido, estos métodos trabajan sobre el registro del modelo principal cuya clave primaria es `id()`:

- **`delete()`**: carga el registro completo del modelo principal y llama a su `delete()`. Así se aplican sus comprobaciones y sus extensiones: por ejemplo, al borrar desde `PartidaAsiento` no se puede eliminar una partida de un asiento bloqueado. Devuelve `false` si no hay modelo principal o si su `delete()` no permite el borrado.
- **`exists()`**: comprueba si existe ese registro en la tabla del modelo principal. Sin modelo principal, devuelve `true` si la consulta tiene algún resultado.
- **`url()`**: devuelve la URL del registro en el modelo principal, que es la que se abre al pulsar una fila del listado. Sin modelo principal, devuelve una cadena vacía.

Para crear o modificar datos, usa directamente el modelo principal (o el modelo que corresponda), nunca el JoinModel.

### Métodos `clear()` y `loadFromData()`
Si necesitamos calcular algunos valores, podemos sobrescribir los métodos `clear()` o `loadFromData()`. Respeta su firma pública, con todos sus parámetros, o PHP dará un error fatal:
```php
public function clear(): void
{
    parent::clear();
    $this-&gt;cuotaiva = 0.00;
    $this-&gt;cuotarecargo = 0.00;
    $this-&gt;total = 0.00;
}

public function loadFromData(array $data = [], array $exclude = []): void
{
    parent::loadFromData($data, $exclude);
    $this-&gt;cuotaiva = $this-&gt;baseimponible * ($this-&gt;iva / 100.00);
    $this-&gt;cuotarecargo = $this-&gt;baseimponible * ($this-&gt;recargo / 100.00);
    $this-&gt;total = $this-&gt;baseimponible + $this-&gt;cuotaiva + $this-&gt;cuotarecargo;
}
```