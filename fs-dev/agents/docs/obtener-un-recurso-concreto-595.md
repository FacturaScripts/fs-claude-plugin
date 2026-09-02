---
id: 701
permalink: obtener-un-recurso-concreto-595
title: Obtener un registro específico desde la API
creationdate: 14-05-2018 00:00:00
lastmod: 07-07-2026
url: https://facturascripts.com/publicaciones/obtener-un-recurso-concreto-595
---
Además de poder consultar todos los registros de un recurso, como divisas o productos, también es posible obtener un registro específico. Por ejemplo, si deseamos obtener los datos del impuesto IVA21, debemos realizar una consulta **GET** a la URL `http://localhost:8000/api/3/impuestos/IVA21`.

![listar registro api](https://facturascripts.com/MyFiles/2024/03/2025.png?myft=6f07741f62def380e47d025a89e37ef6c87f80ef)

## Clave primaria
Es importante destacar que la consulta se realiza mediante la clave primaria. Por ejemplo, al consultar `api/3/clientes/123`, estamos accediendo a los datos del cliente cuya clave primaria (en este caso, `codcliente`) es 123. Si deseamos consultar un registro utilizando otro campo, primero debemos filtrar el listado para obtener su clave primaria.

Por ejemplo, si queremos los datos del cliente cuyo teléfono es 666, primero consultamos el listado de clientes filtrando por teléfono, es decir, realizamos la consulta `api/3/clientes?filter[telefono1]=666`. En esta respuesta, obtendremos el `codcliente`, lo que nos permitirá hacer la consulta del registro específico.

## Qué devuelve la API
La respuesta siempre es un objeto JSON.

### Registro encontrado
Si el registro existe, la API responde con código HTTP `200` y el propio registro como objeto JSON, con cada campo del modelo. A diferencia de las operaciones de crear, actualizar o eliminar, aquí la respuesta no viene envuelta en las claves `ok` y `data`: es directamente el registro.

```json
{
    &quot;codimpuesto&quot;: &quot;IVA21&quot;,
    &quot;descripcion&quot;: &quot;IVA 21%&quot;,
    &quot;tipo&quot;: 1,
    &quot;iva&quot;: 21,
    &quot;recargo&quot;: 5.2,
    &quot;codsubcuentarep&quot;: null,
    &quot;codsubcuentasop&quot;: null
}
```

Ten en cuenta que los campos marcados como ocultos en la API no se incluyen en la respuesta.

### Registro no encontrado
Si no existe ningún registro con esa clave primaria, la API responde con código HTTP `404` y un objeto con la clave `error`:

```json
{
    &quot;error&quot;: &quot;Registro no encontrado&quot;
}
```

## Consultar la estructura del recurso
Si en lugar de una clave primaria usamos la palabra `schema`, la API devuelve la definición de los campos del modelo en vez de un registro. Por ejemplo, con `api/3/impuestos/schema` obtenemos, para cada campo, su tipo, su valor por defecto y si admite nulos:

```json
{
    &quot;codimpuesto&quot;: {
        &quot;type&quot;: &quot;character varying(10)&quot;,
        &quot;default&quot;: null,
        &quot;is_nullable&quot;: &quot;NO&quot;
    },
    &quot;iva&quot;: {
        &quot;type&quot;: &quot;double precision&quot;,
        &quot;default&quot;: null,
        &quot;is_nullable&quot;: &quot;YES&quot;
    }
}
```

Es una forma cómoda de conocer qué campos acepta el recurso y cuáles son obligatorios antes de crear o actualizar registros.