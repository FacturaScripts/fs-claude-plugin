---
id: 624
permalink: delete-986
title: $modelo-&gt;delete() - Método para eliminar registros
creationdate: 30-04-2018 00:00:00
lastmod: 17-11-2026
url: https://facturascripts.com/publicaciones/delete-986
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

## 🔄 Qué ocurre al llamar a delete()
Desde la versión 2026.8, `delete()` se ejecuta dentro de una transacción y sigue este orden:

- **1. Extensiones `deleteBefore()`**. Se ejecutan antes de modificar nada. Si alguna devuelve `false`, la eliminación se cancela.
- **2. Se abre una transacción**, salvo que ya haya una abierta.
- **3. `onDeleteBefore()`**. Aquí el modelo elimina sus datos relacionados. Si devuelve `false`, la eliminación se cancela.
- **4. `DELETE`** del registro.
- **5. `onDelete()`**, una vez eliminado el registro.
- **6. Se confirma la transacción** y se ejecutan las extensiones `delete()`.

Si alguno de los pasos 3 a 5 devuelve `false` o lanza una excepción, se deshace la transacción y la base de datos queda como estaba.

![esquema delete()](https://facturascripts.com/MyFiles/2026/11/8240_esquema_delete.png?myft=bc36bf48f5008e7f7f393c93f7d031de145471e050882d87211f4b570767ed85)

## 🧩 Eliminar datos relacionados: onDeleteBefore()
Si tu modelo tiene datos relacionados que deben eliminarse con él (líneas, pagos...), no sobrescribas `delete()`: usa `onDeleteBefore()`. Así las [extensiones del modelo](https://facturascripts.com/publicaciones/extensiones-de-modelos) pueden impedir la eliminación antes de que se pierda nada, y todo va dentro de la misma transacción.

```php
protected function onDeleteBefore(): bool
{
    // eliminamos las líneas antes de eliminar el registro
    foreach ($this-&gt;getLines() as $line) {
        if (false === $line-&gt;delete()) {
            return false;
        }
    }

    return parent::onDeleteBefore();
}
```

Algunas pautas:

- **Datos relacionados de la base de datos**: en `onDeleteBefore()`. Se recuperan si algo falla.
- **Archivos del disco** y cualquier otra cosa que no se pueda deshacer: en `onDelete()`, cuando el registro ya se ha eliminado.
- **Comprobaciones que impiden eliminar** (el registro está bloqueado, no es editable...): pueden seguir en `delete()`, antes de `parent::delete()`, siempre que no modifiquen nada.
- `onDeleteBefore()` existe a partir de la versión 2026.8. Si lo usas en un plugin, indica `min_version = 2026.8` en su `facturascripts.ini`.

```php
protected function onDelete(): void
{
    // el registro ya está eliminado: ahora eliminamos su archivo
    if (file_exists($this-&gt;getFullPath())) {
        unlink($this-&gt;getFullPath());
    }

    parent::onDelete();
}
```

Tienes la explicación completa del cambio en [esta noticia](https://facturascripts.com/publicaciones/ondeletebefore-eliminaciones-seguras-en-los-modelos-a-partir-de-facturascripts-2026-8).