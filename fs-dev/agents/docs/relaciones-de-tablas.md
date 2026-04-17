---
id: 2435
permalink: relaciones-de-tablas
title: Relaciones de tablas
creationdate: 29-12-2025 23:42:03
lastmod: 10-01-2026
url: https://facturascripts.com/relaciones-de-tablas
---
En FacturaScripts puedes definir claves ajenas (foreign keys) en el XML de la tabla (ver: https://facturascripts.com/publicaciones/la-definicion-de-la-estructura-de-la-tabla-514) usando la etiqueta `constraint`. Además de la definición en el esquema, para poder trabajar con esas relaciones desde el modelo debes crear métodos que utilicen las helpers disponibles, principalmente `belongsTo()` y `hasMany()`.

A continuación te explico cuándo usar cada una, su sintaxis típica y ejemplos prácticos.

## 🔗 belongsTo()

Usa `belongsTo()` cuando el registro actual pertenece a otro registro (relación muchos-a-uno). La firma habitual es:

```
belongsTo(ModelClass::class, &#39;foreign_key&#39;)
```

- ModelClass::class: la clase del modelo relacionado.
- &#39;foreign_key&#39;: la columna en la tabla actual que guarda la referencia.

Ejemplo: obtener la familia de un producto

La familia del producto se guarda en la columna `codfamilia`. Define en el modelo Producto el método:

```
public function familia(): ?Familia
{
	return $this-&gt;belongsTo(Familia::class, &#39;codfamilia&#39;);
}
```

Uso:

```
$producto = (new Producto)-&gt;find(1);
$familia = $producto-&gt;familia(); // puede ser null si no hay relación
if ($familia) {
	echo $familia-&gt;nombre;
}
```

Consejos:
- Tipa el retorno con `?Clase` si puede ser nulo. 
- Comprueba la existencia antes de acceder a propiedades para evitar errores.
- Si vas a recuperar muchas entidades y sus familias, carga las relaciones en la consulta para evitar consultas repetidas (N+1).

## 📚 hasMany()

Usa `hasMany()` cuando quieres obtener todos los registros relacionados (relación uno-a-muchos). La firma típica es:

```
hasMany(ModelClass::class, &#39;foreign_key&#39;)
```

- ModelClass::class: el modelo que contiene la referencia hacia la tabla actual.
- &#39;foreign_key&#39;: la columna en la tabla relacionada que apunta al id (o clave) del modelo actual.

Ejemplo: obtener todas las variantes de un producto

Las variantes se relacionan con el producto mediante `idproducto`. Define en el modelo Producto:

```
public function getVariantes(): array
{
	return $this-&gt;hasMany(Variante::class, &#39;idproducto&#39;);
}
```

Uso:

```
$producto = (new Producto)-&gt;find(1);
$variantes = $producto-&gt;getVariantes();
foreach ($variantes as $variante) {
	echo $variante-&gt;descripcion . &quot;\n&quot;;
}
```

Consejos:
- `hasMany()` suele devolver un array de modelos.
- Puedes ordenar o filtrar los resultados desde la consulta si la API del modelo lo permite.

## 🔁 Relaciones inversas (ejemplo práctico)

Si en Producto defines `familia()` con `belongsTo()`, en el modelo Familia puedes definir la inversa con `hasMany()` para obtener todos los productos de una familia:

```
public function productos(): array
{
	return $this-&gt;hasMany(Producto::class, &#39;codfamilia&#39;);
}
```

Esto te permite navegar en ambos sentidos: desde Producto hacia Familia y desde Familia hacia Productos.

## ✅ Buenas prácticas y notas

- Define las constraints en el XML para mantener la integridad referencial y luego crea los métodos en los modelos para aprovecharlas en el código.
- Nombra los métodos de forma clara y coherente (por ejemplo: `familia()` para belongsTo, `getVariantes()` o `variantes()` para hasMany).
- Añade índices en las columnas usadas como foreign keys para mejorar el rendimiento de consultas.
- Usa tipado en los métodos (por ejemplo `: ?Familia` o `: array`) para mayor claridad y autocompletado en el IDE.
- Evita el problema N+1 cargando relaciones cuando recuperes listas grandes.
