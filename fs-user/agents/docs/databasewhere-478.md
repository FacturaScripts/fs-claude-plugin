---
id: 668
permalink: databasewhere-478
title: Clase DataBaseWhere (obsoleta)
creationdate: 11-05-2018 00:00:00
lastmod: 06-12-2025
url: https://facturascripts.com/databasewhere-478
---
La clase `DataBaseWhere` en FacturaScripts se utiliza para **filtrar resultados** en los métodos [all()](https://facturascripts.com/publicaciones/all-863), [count()](https://facturascripts.com/publicaciones/count-882) y [loadFromCode()](https://facturascripts.com/publicaciones/loadfromcode-677) de los modelos. Podemos pasar un array de `DataBaseWhere` a estos métodos para aplicar los filtros deseados.

Esta clase fué reemplazada por Where a partir de la versión 2025.

## Introducción a la Clase
Para utilizar `DataBaseWhere`, primero debemos asegurarnos de cargar la clase:

```php
use FacturaScripts\Core\Base\DataBase\DataBaseWhere;
```

### Constructor de DataBaseWhere
- **fields**: Nombre del campo sobre el que se realiza el filtro. Puede ser una lista, como `&#39;campo1|campo2|campo3&#39;`.
- **value**: Valor por el cual se filtra. También puede compararse con otro campo usando el prefijo `field:`.
- **operator**: (opcional) `&#39;=&#39;` por defecto. Operadores permitidos: `=`, `&lt;`, `&gt;`, `&lt;=`, `&gt;=`, `!=`, `IN`, `NOT IN`, `IS`, `IS NOT`, `LIKE`, `XLIKE`, `REGEXP`.
- **operation**: (opcional) `&#39;AND&#39;` por defecto. Operadores lógicos: `AND`, `OR`. Importante: esta operación se aplica al propio elemento, no al siguiente.
- **useField**: (opcional) `false` por defecto. Activa/desactiva el modificador field:xxx.

### Ejemplos de Uso

#### Ejemplo 1: Obtener productos de la familia 1234
```php
$productoModel = new Producto();
$where = [new DataBaseWhere(&#39;codfamilia&#39;, &#39;1234&#39;)];
$productos1234 = $productoModel-&gt;all($where);
```
Este código devuelve todos los productos que pertenecen a la familia 1234.

#### Ejemplo 2: Stock por debajo del mínimo
```php
$stockModel = new Stock();
$where = [new DataBaseWhere(&#39;cantidad&#39;, 1, &#39;&lt;&#39;)];
$stockMinimo = $stockModel-&gt;all($where);
```

También podemos comparar contra otro campo usando el modificador `fiedl:xxx`, asignando true como 5º parámetro para activar el uso de field:

```php
$stockModel = new Stock();
$where = [new DataBaseWhere(&#39;cantidad&#39;, &#39;field:stockmin&#39;, &#39;&lt;&#39;, &#39;AND&#39;, true)];
$stockMinimo = $stockModel-&gt;all($where);
```

#### Ejemplo 3: Facturas de un cliente en diciembre de 2020
```php
$facturaModel = new FacturaCliente();
$where = [
   new DataBaseWhere(&#39;codcliente&#39;, &#39;1&#39;),
   new DataBaseWhere(&#39;fecha&#39;, &#39;01-12-2020&#39;, &#39;&gt;=&#39;) ,
   new DataBaseWhere(&#39;fecha&#39;, &#39;31-12-2020&#39;, &#39;&lt;=&#39;)
];
$facturasDiciembre = $facturaModel-&gt;all($where);
```

#### Ejemplo 4: Contar facturas sin pagar de un cliente
```php
$facturaModel = new FacturaCliente();
$where = [
   new DataBaseWhere(&#39;codcliente&#39;, &#39;1&#39;),
   new DataBaseWhere(&#39;pagada&#39;, false)
];
$numero = $facturaModel-&gt;count($where);
```

#### Ejemplo 5: Variantes con referencia o código de barras 666
```php
$varianteModel = new Variante();
$where = [new DataBaseWhere(&#39;codbarras|referencia&#39;, &#39;666&#39;)];
$variantes666 = $varianteModel-&gt;all($where);
```

#### Ejemplo 6: Borrar clientes sin teléfono o con email admin@admin.com
```php
$clienteModel = new Cliente();
$where = [
   new DataBaseWhere(&#39;telefono1&#39;, &#39;&#39;),
   new DataBaseWhere(&#39;email&#39;, &#39;admin@admin.com&#39;, &#39;=&#39;, &#39;OR&#39;)
];
foreach($clienteModel-&gt;all($where) as $cliente) {
   $cliente-&gt;delete();
}
```
El operador `OR` se aplica aquí al segundo elemento.

### 🧮 Uso de Operadores
#### Operador IS e IS NOT
```php
$where = [new DataBaseWhere(&#39;nombre&#39;, null)];
// RESULTADO: where nombre IS NULL

$where = [new DataBaseWhere(&#39;nombre&#39;, null, &#39;IS&#39;)];
// RESULTADO: where nombre IS NULL

$where = [new DataBaseWhere(&#39;nombre&#39;, null, &#39;IS NOT&#39;)];
// RESULTADO: where nombre IS NOT NULL
```

#### Operador IN y NOT IN
```php
$where = [
   new DataBaseWhere(&#39;codejercicio&#39;, &#39;2018&#39;),
   new DataBaseWhere(&#39;codcuentaesp&#39;, &#39;IVAREX,IVAREP,IVARRE&#39;, &#39;IN&#39;)
];
// RESULTADO: where codejercicio = &#39;2018&#39; and codcuentaesp in (&#39;IVAREX&#39;,&#39;IVAREP&#39;,&#39;IVARRE&#39;)

$where = [new DataBaseWhere(&#39;codcliente&#39;, &quot;select codcliente from contactos where codpais = &#39;ESP&#39;&quot;, &#39;IN&#39;)];
// RESULTADO: where codcliente IN (select codcliente from contactos where codpais = &#39;ESP&#39;)
```

#### Operador LIKE
```php
$where = [new DataBaseWhere(&#39;nombre&#39;, &#39;sanchez&#39;, &#39;LIKE&#39;)];
// RESULTADO: where nombre LIKE &#39;%sanchez%&#39;
```
Buscar al principio o al final:
- Al principio: `&#39;sanchez%&#39;`
- Al final: `&#39;%sanchez&#39;`

#### Operador XLIKE
Este operador permite buscar múltiples palabras. Por ejemplo:
```php
$where = [new DataBaseWhere(&#39;descripcion&#39;, &#39;gran caja&#39;, &#39;XLIKE&#39;)];
// RESULTADO: where (descripcion LIKE &#39;%gran%&#39; AND descripcion LIKE &#39;%caja%&#39;)
```
