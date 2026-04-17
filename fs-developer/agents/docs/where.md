---
id: 1632
permalink: where
title: Where
creationdate: 09-12-2023 21:01:20
lastmod: 07-12-2025
url: https://facturascripts.com/where
---
La clase **Where** se usa en FacturaScripts para definir filtros para consultar a la base de datos. En lugar de escribir el SQL directamente, podemos usar esta clase:

```
use FacturaScripts\Core\Where;

$where = [
	Where::gt(&#39;precio&#39;, 0),
	Where::isNull(&#39;codfamilia&#39;)
];

$sql = &#39;SELECT * FROM productos WHERE &#39; . Where::multiSql($where);
// SELECT * FROM productos WHERE precio &gt; 0 AND codfamilia IS NULL
```

Esta clase se usa activamente con la clase [DbQuery](https://facturascripts.com/publicaciones/dbquery) y pronto con los nuevos modelos:

```
use FacturaScripts\Core\DbQuery;
use FacturaScripts\Core\Where;

$data = DbQuery::table(&#39;productos&#39;)
	-&gt;whereMulti([
		Where::gt(&#39;precio&#39;, 0),
		Where::isNull(&#39;codfamilia&#39;)
	])-&gt;get();
```

## 🧮 Operadores
Existe una función para cualquier operador que queramos usar en el where, de forma que el código sea lo más legible posible:

- ``eq`` (=)
- ``NotEq`` (&lt;&gt;)
- ``lt`` (&lt;)
- ``lte`` (&lt;=)
- ``gt`` (&gt;)
- ``gte`` (&gt;=)
- ``isNull`` (IS NULL)
- ``isNotNull`` (IS NOT NULL)
- ``in`` (IN)
- ``notIn`` (NOT IN)
- ``between`` (BETWEEN)
- ``notBetween`` (NOT BETWEEN)
- ``like`` (LIKE)
- ``notLike`` (NOT LIKE)
- ``xlike`` : esta es una versión nuestra del operador like donde previamente desglosamos las palabras a buscar. Así si busas &#39;mi casa&#39; mostrará tanto las coincidencias con &#39;mi casa&#39; como las que coincidan con &#39;casa mi&#39;.

```
$where = [
	Where::eq(&#39;codfabricante, &#39;123&#39;),
	Where::isNull(&#39;codfamilia&#39;),
	Where::lt(&#39;precio&#39;, 10)
];
// WHERE codfabricante = &#39;123&#39; AND codfamilia IS NULL AND precio &lt; &#39;10&#39;
```

### 👀 Debug
Puedes ver el sql que genera llamando al método `multiSql()`

```
$where = [
	Where::eq(&#39;codfabricante, &#39;123&#39;),
	Where::isNull(&#39;codfamilia&#39;),
	Where::lt(&#39;precio&#39;, 10)
];
echo Where::multiSql($where);
```

### Uso de paréntesis
El siguiente where generaría este SQL: ``sevende = true AND ventasinstock = false OR secompra = true AND nostock = false``

```
$where = [
	Where::eq(&#39;sevende&#39;, true),
	Where::eq(&#39;ventasinstock&#39;, false),
	Where::orEq(&#39;secompra&#39;, true),
	Where::eq(&#39;nostock&#39;, false)
];
```

Pero quizás queríamos agrupar el segundo y tercer elemento o el tercero y el cuarto. Para evitar sorpresas necesitamos una forma intuitiva de indicar cuando agrupar y qué elementos agrupar. Vemos cada una de las posibles combinaciones:

#### ( and ) or ( and )
```
$where = [
	Where::sub([
		Where::eq(&#39;sevende&#39;, true),
		Where::eq(&#39;ventasinstock&#39;, false)
	]),
	Where::orSub([
		Where::eq(&#39;secompra&#39;, true),
		Where::eq(&#39;nostock&#39;, false),
	]),
];
```

#### and ( or ) and
```
$where = [
	Where::eq(&#39;sevende&#39;, true),
	Where::sub([
		Where::eq(&#39;ventasinstock&#39;, false),
		Where::orEq(&#39;secompra&#39;, true),
	]),
	Where::eq(&#39;nostock&#39;, false)
];
```

### 🟰 Comparar campos con field:xxx
Podemos comparar campos con otros campos de la tabla usando el modificador `field:xxx`, que debe habilitarse con el método `useField()` para evitar problemas:

```
$where = [Where::lt(&#39;cantidad, &#39;field:stockmin&#39;)-&gt;useField()];
// WHERE cantidad &lt; stockmin
```
