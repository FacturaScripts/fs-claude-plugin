---
id: 701
permalink: obtener-un-recurso-concreto-595
title: Obtener un registro específico desde la API
creationdate: 14-05-2018 00:00:00
lastmod: 25-03-2025
url: https://facturascripts.com/obtener-un-recurso-concreto-595
---
Además de poder consultar todos los registros de un recurso, como divisas o productos, también es posible obtener un registro específico. Por ejemplo, si deseamos obtener los datos del impuesto IVA21, debemos realizar una consulta **GET** a la URL `http://localhost:8000/api/3/impuestos/IVA21`.

![listar registro api](https://facturascripts.com/MyFiles/2024/03/2025.png?myft=6f07741f62def380e47d025a89e37ef6c87f80ef)

## Clave primaria
Es importante destacar que la consulta se realiza mediante la clave primaria. Por ejemplo, al consultar `api/3/clientes/123`, estamos accediendo a los datos del cliente cuya clave primaria (en este caso, `codcliente`) es 123. Si deseamos consultar un registro utilizando otro campo, primero debemos filtrar el listado para obtener su clave primaria.

Por ejemplo, si queremos los datos del cliente cuyo teléfono es 666, primero consultamos el listado de clientes filtrando por teléfono, es decir, realizamos la consulta `api/3/clientes?filter[telefono1]=666`. En esta respuesta, obtendremos el `codcliente`, lo que nos permitirá hacer la consulta del registro específico.
