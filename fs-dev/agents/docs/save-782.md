---
id: 631
permalink: save-782
title: Método save() del modelo
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/save-782
---
La función `save()` del modelo se utiliza para guardar un registro en la base de datos. **Devuelve `true`** si el registro se ha guardado correctamente y **`false`** en caso contrario.

## Ejemplo
```php
$cliente = new Cliente();
$cliente-&gt;nombre = &#39;Pepe&#39;;
$cliente-&gt;cifnif = &#39;1234&#39;;
$cliente-&gt;save();
```

### Inserción y actualización
La función `save()` se encarga de verificar si el registro ya existe en la base de datos:
- Si el registro no existe, crea uno nuevo utilizando un **INSERT**.
- Si el registro ya existe, lo actualiza utilizando un **UPDATE**.

Internamente, el modelo utiliza dos funciones auxiliares:
- **saveInsert()**: para realizar la inserción en la tabla.
- **saveUpdate()**: para ejecutar la actualización del registro en la tabla.

### Problemas habituales
Antes de llevar a cabo la inserción o actualización, la función `save()` llama internamente a la [función `test()` del modelo](https://facturascripts.com/publicaciones/test-625). Esta función comprueba, entre otras cosas, que no existen valores `NULL` en aquellas columnas que tienen una restricción `NOT NULL`. Por lo tanto, si `save()` devuelve `true`, podría ser que la función `test()` sea la que está controlando el proceso.
