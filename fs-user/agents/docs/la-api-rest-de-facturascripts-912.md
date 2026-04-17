---
id: 698
permalink: la-api-rest-de-facturascripts-912
title: Guía de la API REST
creationdate: 01-05-2018 00:00:00
lastmod: 19-03-2025
url: https://facturascripts.com/la-api-rest-de-facturascripts-912
---
La API REST de FacturaScripts ofrece a los desarrolladores una forma sencilla de acceder, crear, modificar y eliminar datos desde aplicaciones externas.

## ¿Cómo usar la API?

Para acceder a la API de FacturaScripts, añade **/api** al final de la URL donde tienes instalado FacturaScripts. Por ejemplo, si tienes FacturaScripts instalado en `localhost:8000`, la URL de la API será: `http://localhost:8000/api/3`.

A continuación, utilizaremos [Insomnia](https://insomnia.rest/download/) para realizar las consultas a la API y recibir respuestas en un formato más legible.

## Activación y autenticación de la API

1. **Activar la API:** Dirígete al **menú Administrador** y selecciona **Panel de control**. En la sección **Por defecto**, marca la casilla **Activar API** y haz clic en **Guardar**.

   ![Activar API](https://i.imgur.com/krqvZOV.png)

2. **Crear una API Key:** Haz clic en la sección **API Keys** y presiona el botón **Nuevo** para crear una nueva clave. Asegúrate de marcar la opción **Acceso completo**.

   ![Nueva clave API](https://i.imgur.com/j0lz4E8.png)

Una vez que hayas creado la API Key, puedes conectarte a la API realizando los siguientes pasos:
- Abre Insomnia.
- Introduce la URL de la API (`http://localhost:8000/api/3`) y asegúrate de que se está realizando una petición de tipo **GET**.
- Ve a la **pestaña Headers** y agrega el campo **Token** con tu clave de API como valor.

## Error API-VERSION-NOT-FOUND

![API Version Not Found](https://facturascripts.com/MyFiles/2024/03/2021.png?myft=82c7541b26e4cfcb9078fd8a7ccee69d76e40dea)

Este error indica que no se ha seleccionado la versión de la API. La API está diseñada para soportar múltiples versiones, aunque por el momento solo utilizaremos la versión 3. La URL correspondiente a la versión 3 es: `http://localhost:8000/api/3`.

![Listado de Recursos](https://facturascripts.com/MyFiles/2024/03/2022.png?myft=fd1934bc91748ad90f3360e4a154bc0d784d7c17)

En la sección **Resources**, puedes encontrar todos los recursos o endpoints accesibles a través de la API, como agencias de transporte, agentes, albaranes de cliente y albaranes de proveedor, entre otros.
