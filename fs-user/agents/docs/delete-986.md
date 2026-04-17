---
id: 624
permalink: delete-986
title: $modelo-&gt;delete() - Método para eliminar registros
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/delete-986
---
El método `delete()` del modelo se utiliza para eliminar un registro de la base de datos. Este método devuelve `true` si el registro se ha eliminado con éxito, o `false` en caso de que ocurra algún error.

## Ejemplo: Eliminar un registro específico
Supongamos que queremos eliminar el proyecto llamado &#39;test&#39;:

```php
$project = new Project();
if ($project-&gt;load(&#39;test&#39;)) {
    // Registro encontrado, procedemos a eliminarlo.
    $project-&gt;delete();
    // Registro eliminado.
}
```

### Ejemplo: Eliminar varios registros
Supongamos que queremos eliminar todos los productos que están bloqueados:

```php
$where = [Where::eq(&#39;bloqueado&#39;, true)];
foreach(Producto::all($where) as $producto) {
	$producto-&gt;delete();
}
```

En este caso, primero llamado al [método `all()` del modelo](https://facturascripts.com/publicaciones/all-863) para obtener todos los productos bloqueados. Después, recorremos el conjunto resultante con un bucle `foreach` y llamamos al método `delete()` para eliminar cada registro.

### deleteWhere($where)

Desde la versión 2025 podemos llamar directamente al método `deleteWhere()` para eliminar múltiples registros con una sola llamada.

```php
$where = [Where::eq(&#39;bloqueado&#39;, true)];
Producto::deleteWhere($where);
```

En este ejemplo eliminamos todos los productos bloqueados.
