---
id: 704
permalink: eliminar-un-recurso-concreto-122
title: Eliminar registros desde la API
creationdate: 14-05-2018 00:00:00
lastmod: 09-07-2025
url: https://facturascripts.com/eliminar-un-recurso-concreto-122
---
Para eliminar un registro mediante la API, haremos una consulta **DELETE** al recurso que queramos eliminar. Para este ejemplo eliminaremos la divisa ``123``, que creamos en el ejemplo anterior, por tanto haremos una consulta DELETE sobre `http://localhost:8000/api/3/divisas/123`

![eliminar recurso mediante API](/MyFiles/2024/03/2030.png?myft=94dc0666ee58afbac347bf3c7042743133bd2a68)

En esta caso no debemos enviar nada más, es simplemente una consulta DELETE. Recibiremos un código **http 200** si ha sido eliminada correctamente o bien otro código si nos e ha podido eliminar, y el mensaje de error en el json de respuesta.
