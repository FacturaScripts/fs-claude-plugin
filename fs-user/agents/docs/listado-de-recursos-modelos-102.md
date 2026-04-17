---
id: 699
permalink: listado-de-recursos-modelos-102
title: Listado de Recursos Disponibles en la API (Modelos)
creationdate: 14-05-2018 00:00:00
lastmod: 08-07-2025
url: https://facturascripts.com/listado-de-recursos-modelos-102
---
Al acceder a la API indicando únicamente la versión, obtendremos un listado con todos los recursos disponibles a través de la API, tales como agencias de transporte, agentes, albaranes de cliente, entre otros.

## Ejemplo de solicitud

```text
http://localhost:8000/api/3
```

![Lista de recursos API](https://facturascripts.com/MyFiles/2024/03/2022.png?myft=fd1934bc91748ad90f3360e4a154bc0d784d7c17)

Puedes consultar cada uno de estos recursos agregando el nombre del recurso a la URL:

- [http://localhost:8000/api/3/agenciatransportes](http://localhost:8000/api/3/agenciatransportes)
- [http://localhost:8000/api/3/agentes](http://localhost:8000/api/3/agentes)
- ...

Asegúrate de que estás realizando una consulta de tipo GET.

### 📝 Añadir un endpoint

Puedes añadir endpoints a la API desde tus plugins siguiendo la [guía de creación de endpoints para la API](https://facturascripts.com/publicaciones/anadir-un-endpoint-a-la-api).
