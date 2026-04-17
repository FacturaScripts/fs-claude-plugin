---
id: 696
permalink: modelos-especiales-568
title: Modelos Especiales en FacturaScripts
creationdate: 11-10-2019 00:00:00
lastmod: 07-11-2025
url: https://facturascripts.com/modelos-especiales-568
---
Existen varios modelos en FacturaScripts que no tienen correspondencia con tablas físicas en la base de datos, lo que implica que **no pueden ser utilizados para la grabación o eliminación de datos**. La función de estos modelos es complementar el resto de los modelos existentes, facilitando las operaciones de lectura de información de manera global y evitando así la necesidad de crear métodos repetidos en distintos modelos.

### CodeModel
El modelo `CodeModel` se utiliza cuando necesitamos obtener una lista de registros de alguna tabla, con el único campo de código o identificativo y su descripción. Dado que es un modelo muy simple, no incluye todos los procesos de carga que normalmente llevan los modelos, limitándose únicamente a la lectura y devolución de los datos solicitados. Este modelo se utiliza, por ejemplo, en la carga de un widget de tipo «select», donde se presenta al usuario una lista de opciones para que pueda seleccionar una de ellas.

El único método que ofrece es el `all`, el cual, a diferencia de otros modelos, es estático. Esto significa que no es necesario crear una instancia del objeto `CodeModel` para ejecutarlo.

#### Ejemplo de carga de lista con código y descripción
El último parámetro de la llamada al método `all`, denominado `$addEmpty`, permite indicar si necesitamos que se inserte un `CodeModel` en blanco al principio del array que se devuelve con los datos. Esto es útil cuando queremos asignar los valores de retorno a un widget select donde el valor no es obligatorio.

```php
$rows = CodeModel::all(&#39;agentes&#39;, &#39;codagente&#39;, &#39;nombre&#39;, false);
```

### TotalModel
El modelo `TotalModel` está diseñado especialmente para realizar cálculos estadísticos (SUM, AVG, COUNT, MAX, MIN, etc.). Aunque no es obligatorio, podemos ejecutar los cálculos agrupando por un campo «código». Al ejecutar el método `all`, se devuelve un array de `TotalModel` con la estructura (code, totals), donde `code` contiene el identificador de agrupación y `totals` es un array con cada uno de los cálculos solicitados.

#### Ejemplo: Albaranes de venta sin facturar por cliente

```php
$where = [new DataBase\DataBaseWhere(&#39;ptefactura&#39;, TRUE)];
$totals = Model\TotalModel::all(&#39;albaranescli&#39;, $where, [&#39;total&#39; =&gt; &#39;SUM(total)&#39;, &#39;count&#39; =&gt; &#39;COUNT(1)&#39;], &#39;codcliente&#39;);
```
