---
id: 703
permalink: actualizar-un-recurso-existente-631
title: Modificar registros desde la API
creationdate: 14-05-2018 00:00:00
lastmod: 09-07-2025
url: https://facturascripts.com/actualizar-un-recurso-existente-631
---
Para modificar o actualizar un registro a través de la API, realizaremos un **PUT** a la ruta sobre el recurso concreto del modelo, indicando solamente los atributos a cambiar. Para este ejemplo modificaremos la divisa ``123``, que creamos en el ejemplo anterior, por tanto haremos una petición PUT a `http://localhost:8000/api/3/divisas/123`

![modificar registro mediante api](https://facturascripts.com/MyFiles/2024/03/2029.png?myft=69e85186273bf5b13fbd05e720173eac6cda6e3d)

Fíjate que solamente hemos enviado el campo **descripcion** con el valor ``Divisa - 123``. Y eso es lo que ha cambiado. No necesitamos enviar el resto de campos si no queremos cambiarlos.

## Cómo pasar los valores
Aunque la API responde siempre con JSON, para enviar los datos debemos hacerlo como lo haríamos a un formulario, es decir, mediante **form URL encoded**:

![enviar datos api](https://i.imgur.com/3gP30u7.png)

Hay que tener en cuenta que las restricciones son las mismas que al añadir un nuevo recurso.
