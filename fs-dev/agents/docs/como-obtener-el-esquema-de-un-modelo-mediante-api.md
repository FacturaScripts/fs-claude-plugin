---
id: 2228
permalink: como-obtener-el-esquema-de-un-modelo-mediante-api
title: Cómo obtener el esquema de un modelo mediante API
creationdate: 01-09-2025 19:43:48
lastmod: 07-07-2026
url: https://facturascripts.com/publicaciones/como-obtener-el-esquema-de-un-modelo-mediante-api
---
La API de FacturaScripts, además de listar, crear, modificar y eliminar registros de modelos, también permite obtener el esquema de la tabla. Para ello simplemente hay que usar el identificador `schema` después del endpoint.

## Ejemplo
En este ejemplo obtendremos el esquema de la tabla del modelo Familia.

```
http://localhost:8000/api/3/familias/schema
```

La API nos devolverá la lista de campos de la tabla:

```
{
	&quot;codfamilia&quot;: {
		&quot;type&quot;: &quot;varchar(8)&quot;,
		&quot;default&quot;: null,
		&quot;is_nullable&quot;: &quot;NO&quot;
	},
	&quot;codsubcuentacom&quot;: {
		&quot;type&quot;: &quot;varchar(15)&quot;,
		&quot;default&quot;: null,
		&quot;is_nullable&quot;: &quot;YES&quot;
	},
	&quot;codsubcuentairpfcom&quot;: {
		&quot;type&quot;: &quot;varchar(15)&quot;,
		&quot;default&quot;: null,
		&quot;is_nullable&quot;: &quot;YES&quot;
	},
	&quot;codsubcuentaven&quot;: {
		&quot;type&quot;: &quot;varchar(15)&quot;,
		&quot;default&quot;: null,
		&quot;is_nullable&quot;: &quot;YES&quot;
	},
	&quot;descripcion&quot;: {
		&quot;type&quot;: &quot;varchar(100)&quot;,
		&quot;default&quot;: null,
		&quot;is_nullable&quot;: &quot;NO&quot;
	},
	&quot;madre&quot;: {
		&quot;type&quot;: &quot;varchar(8)&quot;,
		&quot;default&quot;: null,
		&quot;is_nullable&quot;: &quot;YES&quot;
	},
	&quot;numproductos&quot;: {
		&quot;type&quot;: &quot;int(11)&quot;,
		&quot;default&quot;: &quot;0&quot;,
		&quot;is_nullable&quot;: &quot;NO&quot;
	}
}
```

Para cada campo se indican tres datos:

- `type`: el tipo de dato de la columna en la base de datos (varía según el motor, por ejemplo `varchar(100)` o `int(11)`).
- `default`: el valor por defecto de la columna, o `null` si no tiene.
- `is_nullable`: `NO` si el campo es obligatorio (no admite nulos) o `YES` si puede quedar vacío.

Es una forma rápida de saber qué campos acepta un recurso y cuáles son obligatorios antes de crear o modificar registros. Los campos que estén ocultos en la API no aparecen en el esquema.