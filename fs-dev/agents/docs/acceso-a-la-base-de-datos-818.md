---
id: 667
permalink: acceso-a-la-base-de-datos-818
title: Acceso a la Base de Datos
creationdate: 11-05-2018 00:00:00
lastmod: 01-04-2026
url: https://facturascripts.com/acceso-a-la-base-de-datos-818
---
La clase [DataBase](https://doc.facturascripts.com/classes/FacturaScripts-Core-Base-DataBase.html) nos permite operar directamente con la base de datos de FacturaScripts. Se conecta automáticamente al iniciar FacturaScripts y mantiene **una única instancia** durante toda la ejecución.

## Limitaciones
No es posible conectar a otra base de datos que no sea la de FacturaScripts.

## Conexión y Desconexión
FacturaScripts establece la conexión automáticamente al iniciar y la desconecta al finalizar la ejecución. No es necesario ni recomendable llamar manualmente a los métodos `connect()` o `close()`.

## Acceso desde Modelos y Controladores
Los modelos pueden acceder a la base de datos directamente llamando a **self::$dataBase**, mientras que los controladores lo hacen mediante **$this-&gt;dataBase**.

Para el resto de las clases, es necesario utilizar el namespace:
```php
use FacturaScripts\Core\Base\DataBase;

$dataBase = new DataBase();
```

### Realizar un SELECT
Para ejecutar una consulta SELECT y obtener los resultados, se puede utilizar el método [select()](https://doc.facturascripts.com/classes/FacturaScripts-Core-Base-DataBase.html#method_select).
```php
$dataBase = new DataBase();
$data = $dataBase-&gt;select(&#39;SELECT DISTINCT ciudad FROM clientes;&#39;);
var_dump($data);
```
Este método devuelve un array con los resultados. Si no hay resultados, el array estará vacío.

### Paginación
Para realizar un SELECT con paginación, se puede utilizar el método [selectLimit()](https://doc.facturascripts.com/classes/FacturaScripts-Core-Base-DataBase.html#method_selectLimit).
```php
$dataBase = new DataBase();
$limit = 100;
$offset = 100;
$data = $dataBase-&gt;selectLimit(&#39;SELECT * FROM clientes&#39;, $limit, $offset);
var_dump($data);
```
En esta consulta, se obtiene el listado de clientes, limitado a 100 elementos, comenzando desde el elemento número 100, es decir, es como obtener la segunda página de resultados de la consulta. Con **$limit** indicamos cuántos elementos devolver, y con **$offset** indicamos desde qué posición hacerlo.

### Insertar, Actualizar o Eliminar
Para ejecutar consultas de tipo INSERT, UPDATE o DELETE, utilice el método [exec()](https://doc.facturascripts.com/classes/FacturaScripts-Core-Base-DataBase.html#method_exec).
```php
$dataBase = new DataBase();
$dataBase-&gt;exec(&quot;UPDATE clientes SET ciudad = &#39;Alicante&#39;;&quot;);
```
Este método devuelve TRUE si la consulta se ejecuta correctamente, o FALSE en caso contrario.

### Transacciones
Las transacciones permiten **deshacer cambios** en la base de datos. Una transacción consta de tres pasos:
- Iniciar la transacción.
- Realizar cambios.
- Confirmar cambios o deshacer la transacción.

```php
// Iniciamos la transacción
$dataBase = new DataBase();
$dataBase-&gt;beginTransaction();

// Realizamos cambios
$dataBase-&gt;exec(&quot;UPDATE clientes SET ciudad = &#39;Alicante&#39;;&quot;);

// Decidimos qué hacer
if( ... ) {
   $dataBase-&gt;rollback(); // Deshacer
} else {
   $dataBase-&gt;commit(); // Confirmar
}
```

Las transacciones también se aplican a los cambios realizados por **modelos**, es decir, que podemos utilizarlas incluso al operar con modelos:
```php
// Iniciamos la transacción
$dataBase = new DataBase();
$dataBase-&gt;beginTransaction();

// Creamos 100 productos
$total = 0;
for($num = 1; $num &lt;= 100; $num++) {
   $newProduct = new Producto();
   $newProduct-&gt;descripcion = &#39;Producto &#39; . $num;
   $newProduct-&gt;referencia = &#39;producto&#39; . $num;
   if(false === $newProduct-&gt;save()) {
      break;
   }
   $total++;
}

// Si hemos creado menos de 100 productos, deshacemos los cambios (los productos desaparecen)
if($total &lt; 100) {
   $dataBase-&gt;rollback(); // Deshacer
} else {
   $dataBase-&gt;commit(); // Confirmar
}
```

#### Transacciones Anidadas
FacturaScripts **no permite** hacer transacciones dentro de otras transacciones. Sin embargo, podemos comprobar si ya estamos dentro de una transacción o iniciar una nueva:
```php
// Comprobamos o iniciamos la transacción
$dataBase = new DataBase();
$newTransaction = false === $dataBase-&gt;inTransaction() && $dataBase-&gt;beginTransaction();

// Realizamos cambios
...

// Decidimos qué hacer
if(false === $newTransaction) {
  // La transacción no la hemos iniciado nosotros, así que no hacemos nada
} if( ... ) {
   $dataBase-&gt;rollback(); // Deshacer
} else {
   $dataBase-&gt;commit(); // Confirmar
}
```
