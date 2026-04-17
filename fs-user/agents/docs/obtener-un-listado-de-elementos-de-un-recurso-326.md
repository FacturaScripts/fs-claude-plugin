---
id: 700
permalink: obtener-un-listado-de-elementos-de-un-recurso-326
title: Listar, filtrar y ordenar registros desde la API
creationdate: 14-05-2018 00:00:00
lastmod: 02-05-2025
url: https://facturascripts.com/obtener-un-listado-de-elementos-de-un-recurso-326
---
Para ilustrar cómo listar registros a través de la API de **FacturaScripts**, utilizaremos el recurso de **impuestos**, que contiene un número reducido de elementos. Para ello, realiza una consulta de tipo **GET** a la siguiente URL:

```plaintext
http://localhost:8000/api/3/impuestos
```

![Listado API FacturaScripts](/MyFiles/2024/03/2023.png?myft=27bc34fe9327fa401fb8515a391715ef08ad46c3)

Este listado está **limitado a 50** elementos por defecto y comienza desde el primer elemento. Para obtener más o menos registros de golpe, puedes usar los parámetros **?limit=50&offset=0**.

## 📖 Paginación

Para recibir más resultados, es necesario indicar desde qué elemento deseas continuar recibiendo datos. En este ejemplo, obtendremos 50 elementos comenzando desde el 1 (saltando el primer elemento, que es el 0):

```plaintext
http://localhost:8000/api/3/impuestos?offset=1
```

![Paginación API FacturaScripts](/MyFiles/2024/03/2024.png?myft=6259506c7763771b1e5fa6165c59ac671830ef7b)

### Ejemplos de paginación

Partiendo de los parámetros **offset** y **limit**, podemos estructurar la paginación de la siguiente manera (con un límite de 3 elementos por página):

- **Página 1**: `?offset=0&limit=3` - devolverá los elementos 0, 1 y 2.
- **Página 2**: `?offset=3&limit=3` - devolverá los elementos 3, 4 y 5.
- **Página 3**: `?offset=6&limit=3` - devolverá los elementos 6, 7 y 8.

## 🔎 Filtros

Puedes aplicar varios filtros al listado para obtener solo los resultados que cumplan con ciertos criterios. Para ello, basta con agregar el parámetro `filter[nombre_columna]=valor` a tu consulta.

### 🔎 Filtrado por `codimpuesto`

Para obtener todos los registros con el valor `IVA21` en `codimpuesto`:

```plaintext
http://localhost:8000/api/3/impuestos?filter[codimpuesto]=IVA21
```

### 🔎 Filtrado por `codimpuesto` y `tipo`

Se pueden usar varios filtros a la vez, así que para obtener todos los registros con el valor `IVA21` en `codimpuesto` y el valor `1` en `tipo`, usaríamos esta url:

```plaintext
http://localhost:8000/api/3/impuestos?filter[codimpuesto]=IVA21&filter[tipo]=1
```

### 🔎 Filtrar por `iva`

Para obtener todos los registros con un valor de `iva` superior a `8` usaremos esta url:

```plaintext
http://localhost:8000/api/3/impuestos?filter[iva_gt]=8
```

### 🔎 Filtrar mayor que, menor, distinto, etc
Los filtros aplican por defecto el operador `=`, es decir, buscan coincidencias exactas, pero puedes usar otros operadores añadiendo un sufijo al nombre de la columna. Aquí tienes algunos ejemplos:

- `filter[tasaconv_gt]=2` -&gt; `tasaconv` mayor que 2.
- `filter[tasaconv_gte]=2` -&gt; `tasaconv` mayor o igual que 2.
- `filter[tasaconv_lt]=2` -&gt; `tasaconv` menor que 2.
- `filter[tasaconv_lte]=2` -&gt; `tasaconv` menor o igual que 2.
- `filter[tasaconv_neq]=2` -&gt; `tasaconv` distinto de 2.
- `filter[descripcion_like]=PESO` -&gt; `descripción` contiene `PESO`.

Es decir, si quieres obtener todos los productos cuya referencia contenga `pez`, debes usar el filtro `filter[referencia_like]=pez`

### 🔎 Combinar filtros

Por defecto, cada filtro se aplica con una operación `AND`, lo que significa que se deben cumplir todos los filtros para que un registro sea devuelto. Sin embargo, puedes cambiar esto a `OR`. Por ejemplo, para obtener un listado de todas las divisas que contengan `PESO` en su descripción **O QUE** su `tasaconv` sea mayor que `2`:

```plaintext
http://localhost:8000/api/3/divisas?filter[descripcion_like]=PESO&filter[tasaconv_gt]=2&operation[tasaconv_gt]=OR
```

## ⬇️ Ordenación

Para obtener todos los registros que contengan en `descripcion` la palabra **PESOS**, ordenados por `coddivisa` de forma **descendente**, utiliza la siguiente consulta:

```plaintext
http://localhost:8000/api/3/divisas?filter[descripcion_like]=PESOS&sort[coddivisa]=DESC
```

Del mismo modo que se pueden combinar filtros, también se pueden combinar ordenaciones, por ejemplo por precio y stock:

```plaintext
http://localhost:8000/api/3/productos?sort[precio]=ASC&sort[stockfis]=DESC
```

## 🔢 Total de registros

En la respuesta de la API, el campo **X-Total-Count** en la cabecera te proporciona el número total de registros de la consulta, sin aplicar límites ni desplazamientos. Esto es útil para saber, por ejemplo:

- El total de productos disponibles si estás realizando una consulta sobre productos.
- El total de productos de la familia X si estás consultando los productos específicos de esa familia.
