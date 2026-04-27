---
id: 336
permalink: configuracion-del-plugin-printticket
title: Configuración del plugin PrintTicket
creationdate: 02-01-2019 00:00:00
lastmod: 27-10-2025
url: https://facturascripts.com/publicaciones/configuracion-del-plugin-printticket
---

Para que el plugin **PrintTicket** funcione correctamente, es necesario instalar la nueva versión de [RemotePrinter](https://facturascripts.com/remote-printer) para FacturaScripts 2020, que encontrarás al final de la página.

### 🚀 Primeros pasos

#### 🖨️ Instalar el plugin PrintTicket 

Instala el plugin **PrintTicket** como lo harías normalmente. Al instalarse, el plugin generará una API Key llamada **remoteprinter**, que se usará para que RemotePrinter pueda acceder a la impresión del ticket en el servidor. Puedes obtener más información sobre la API REST [aquí.](https://facturascripts.com/doc/1/desarrollo-sobre-facturascripts-2018/la-api-rest-de-facturascripts)

#### 🔑 Activar la API Key
Para permitir a RemotePrinter acceder a la API, dirígete al menú Administrador → Panel de control → Api keys. Debería aparecer una llave con la descripción **remoteprinter**; selecciónala para poder configurarla. Asegúrate de que el checkbox esté activado.
![APIKEY](https://i.imgur.com/DLpH32Q.jpg)

En la página de edición de la llave API creada, selecciona el botón &#39;Añadir todo&#39; deshabilitado. 
![APIKEY](https://i.imgur.com/oneQfCT.jpg)

En el recurso **tickets**, marca los checkboxes **Permitir ACCESO** y **Permitir BORRADO**.
![APIKEY](https://i.imgur.com/F3gPBve.jpg)

#### ⚙️ Configuraciones
Ahora puedes agregar las leyendas del ticket en la sección que desees. También puedes seleccionar en qué tipo de documento te gustaría que se muestre.

![APIKEY](https://i.imgur.com/c4kuhFU.jpg)
