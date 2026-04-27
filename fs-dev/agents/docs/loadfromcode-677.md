---
id: 627
permalink: loadfromcode-677
title: Métodos load(), loadWhere() y loadWhereEq() del modelo
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/publicaciones/loadfromcode-677
---

Los modelos tienen los métodos `load()` y `loadWhere()` para recuperar registros. El método `loadFromCode()` permanece como alias por compatibilidad, pero **está en desuso** y debería evitarse en el código nuevo.

## ⚡ load($code)
Permite cargar el registro cuyo valor de clave primaria coincide con `$code`.

### Parámetros
- **code**: Valor de la clave primaria. Si es `null`, el método devuelve `FALSE` sin realizar consultas.

### Retorno y efectos
- Devuelve `TRUE` si encuentra el registro y carga los datos en el modelo.
- Devuelve `FALSE` si no existe y limpia el estado (`clear()`), dejando el modelo sin identificador.
- Tras una carga correcta se sincronizan los valores originales (`syncOriginal()`), lo que permite detectar cambios antes de guardar.

### Ejemplo: Cargar el cliente 123
```php
use FacturaScripts\Core\Model\Cliente;

$cliente = new Cliente();
if ($cliente-&gt;load(&#39;123&#39;)) {
    // OK, hemos cargado los datos del cliente 123
} else {
    // No existe ningún cliente 123
}
```

## ⚡ loadWhere(array $where, array $order = [])
Permite cargar el primer registro que cumple una lista de filtros.

### Parámetros
- **where**: Array de filtros. Lo habitual es usar objetos de la clase `FacturaScripts\Core\Where`.
  - Construye filtros `AND`/`OR` con métodos como `Where::eq()`, `Where::orLike()`, `Where::sub()`, etc.
  - Puedes filtrar varios campos a la vez usando el separador `|` en la definición (`Where::like(&#39;nombre|razonsocial&#39;, &#39;demo&#39;)`).
  - Los operadores soportados incluyen `=`, `!=`, `&gt;`, `&lt;`, `BETWEEN`, `IN`, `LIKE`, `XLIKE`, `REGEXP`, además de comparaciones entre columnas mediante valores `Where::column(&#39;campo&#39;, &#39;field:otro_campo&#39;)`.
- **order**: (opcional) Array asociativo `[&#39;campo&#39; =&gt; &#39;ASC|DESC&#39;]` que se aplica al conjunto filtrado. Admite varios campos de ordenación.

### Retorno y efectos
- Devuelve `TRUE` si encuentra un registro y lo carga.
- Devuelve `FALSE` si no hay coincidencias y limpia el estado del modelo.
- También sincroniza los valores originales para que funciones como `hasChanged()` sigan operativas.

### Ejemplo: Cargar el cliente con teléfono 555444333
```php
use FacturaScripts\Core\Model\Cliente;
use FacturaScripts\Core\Where;

$cliente = new Cliente();
if ($cliente-&gt;loadWhere([Where::eq(&#39;telefono1&#39;, &#39;555444333&#39;)])) {
    // OK
} else {
    // Cliente no encontrado
}
```

### Ejemplo: Combinar filtros complejos
```php
use FacturaScripts\Core\Model\Cliente;
use FacturaScripts\Core\Where;

$where = [
    Where::like(&#39;telefono1|telefono2&#39;, &#39;%444%&#39;),
    Where::eq(&#39;estado&#39;, &#39;ACTIVO&#39;),
    Where::isNull(&#39;fechabaja&#39;)
];

$cliente = new Cliente();
if ($cliente-&gt;loadWhere($where, [&#39;fechaalta&#39; =&gt; &#39;DESC&#39;])) {
    // Cliente activo más reciente con un teléfono que contiene 444
}
```

### Ejemplo: Cargar el primer producto con stock mayor que 0
```php
use FacturaScripts\Core\Model\Producto;
use FacturaScripts\Core\Where;

$producto = new Producto();
$producto-&gt;loadWhere([Where::gt(&#39;stockfis&#39;, 0)], [&#39;stockfis&#39; =&gt; &#39;ASC&#39;]);
```

## ⚡ loadWhereEq(string $field, $value)
Atajo para llamar a `loadWhere()` con un filtro de igualdad sobre un único campo.

### Parámetros
- **field**: Nombre del campo sobre el que se aplicará el filtro.
- **value**: Valor que debe tener el campo. Se convierte a SQL mediante `var2str`, por lo que puedes pasar cadenas, números o nulos.

### Retorno y efectos
- Devuelve `TRUE` si encuentra un registro con el valor indicado.
- Devuelve `FALSE` si no hay coincidencias y limpia el estado del modelo.
- Internamente llama a `loadWhere([Where::eq($field, $value)])`, por lo que comparte el mismo comportamiento que `loadWhere()`.

### Ejemplo: Cargar un almacén por código
```php
use FacturaScripts\Core\Model\Almacen;

$almacen = new Almacen();
if ($almacen-&gt;loadWhereEq(&#39;codigo&#39;, &#39;MADRID&#39;)) {
    // Almacén encontrado
}
```

## Evita `loadFromCode()`
`loadFromCode()` sigue existiendo como alias para proyectos antiguos, pero está **deprecated**. No admite todas las capacidades de `Where` y será retirado en futuras versiones. Siempre que necesites cargar datos:

- Usa `load($codigo)` si conoces la clave primaria.
- Usa `loadWhere($filtros, $orden)` para cualquier otra búsqueda.
