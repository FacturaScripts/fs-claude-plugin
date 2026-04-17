---
id: 702
permalink: anadir-un-nuevo-recurso-502
title: Crear o añadir registros desde la API
creationdate: 14-05-2018 00:00:00
lastmod: 28-05-2025
url: https://facturascripts.com/anadir-un-nuevo-recurso-502
---
Para crear o añadir un nuevo registro mediante la API, por ejemplo un producto, utilizaremos el método **POST** sobre la ruta del recurso del modelo, donde para los atributos del modelo en concreto, como mínimo, serán obligatorios todos aquellos que no puedan ser nulos. Para este ejemplo crearemos una nueva divisa, por lo que haremos una consulta POST a `http://localhost:8000/api/3/divisas`

![añadir registro mediante api](https://facturascripts.com/MyFiles/2024/03/2028.png?myft=a4d57fd0d91d2f3ab5253dfc6a75cb322a86b16e)

En este ejemplo hemos creado una divisa con código ``123`` y descripción ``Divisa 123``.

## Cómo pasar los valores
Aunque la API responde siempre con JSON, para enviar los datos debemos hacerlo como lo haríamos a un formulario, es decir, mediante **form URL encoded**:

![enviar datos api](https://i.imgur.com/3gP30u7.png)

En determinadas situaciones, puede que haya ciertas restricciones adicionales, como que un campo deba tener una longitud mínima/máxima, que sea de tipo booleano o numérico... Estas restricciones se añaden desde el método test dentro del modelo concreto, de modo que se obliga a cumplir dichas condiciones para hacer el guardado o inserción del registro. En caso de error, se recibirán los detalles del problema, es el mismo error que puede recibir el usuario.

## Crear facturas
Ten en cuenta que modelos como las facturas de cliente tienen mayor complejidad, hay que añadir las líneas, recalcular, etc. Para este caso hemos creado un endpoint especial, para poder [crear facturas de venta con una sola llamada a la API](https://facturascripts.com/publicaciones/como-crear-facturas-desde-api).
