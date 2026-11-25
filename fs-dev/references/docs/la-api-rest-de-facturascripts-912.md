---
id: 698
permalink: la-api-rest-de-facturascripts-912
title: API REST de FacturaScripts: guía para desarrolladores
creationdate: 01-05-2018 00:00:00
lastmod: 06-11-2026
url: https://facturascripts.com/publicaciones/la-api-rest-de-facturascripts-912
---
Cómo activar la API REST de FacturaScripts, crear claves, autenticar las peticiones con la cabecera `Token` y resolver los errores habituales. Con vídeo paso a paso.

## 🚀 ¿Cómo usar la API?

Para acceder a la API de FacturaScripts, añade **/api** al final de la URL donde tienes instalado FacturaScripts. Por ejemplo, si tienes FacturaScripts instalado en `localhost:8000`, la URL de la API será: `http://localhost:8000/api/3`.

## 🔌 Activación de la API

La API está desactivada por defecto. Hay dos formas de activarla:

- **Desde el panel de control:** ve a **Administrador → Panel de control**. En la sección **Avanzado**, marca la casilla **Activar API** y haz clic en **Guardar**.
- **Desde el config.php:** define la constante **FS_API_KEY** en el [archivo config.php](https://facturascripts.com/publicaciones/el-archivo-config-php). Su valor es una clave con acceso completo, y la API queda activada aunque no se marque la casilla.

![Activar API](https://i.imgur.com/krqvZOV.png)

Si la API está desactivada, cualquier petición responde con el código HTTP `409`.

## 🔑 Claves de API

Una vez activada la API, aparece la pestaña **Claves API** en el panel de control. Pulsa **Nuevo** para crear una clave:

![Nueva clave API](https://i.imgur.com/j0lz4E8.png)

- **Acceso completo:** la clave puede usar todos los recursos con cualquier método.
- **Sin acceso completo:** la clave solo puede usar los recursos que indiques en la pestaña **Reglas** de la propia clave, y en cada uno solo los métodos que marques (GET, POST, PUT/PATCH y DELETE).
- **Activada:** si desmarcas esta opción, la clave deja de funcionar sin necesidad de borrarla.

Algunos recursos exigen acceso completo aunque la clave tenga reglas, como la gestión de plugins.

## 🔐 Autenticación

Cada petición debe incluir la clave en la cabecera HTTP **`Token`**:

```bash
curl &#39;http://localhost:8000/api/3/clientes&#39; \
  -H &#39;Token: TU_CLAVE_DE_API&#39;
```

Es la cabecera que se usa en todos los ejemplos de esta documentación y la que envía el [cliente HTTP de FacturaScripts](https://facturascripts.com/publicaciones/cliente-http) con `setToken()`.

También se acepta la cabecera **`X-Auth-Token`**, por compatibilidad con clientes que ya la usan. Si una petición incluye las dos, se usa `X-Auth-Token`. No se admiten otras formas de enviar la clave: ni la cabecera `Authorization`, ni un parámetro en la URL.

Las peticiones `OPTIONS` (las comprobaciones previas de CORS que hacen los navegadores) no necesitan clave.

### 🧪 Probar la conexión

Para probarlo con [Insomnia](https://insomnia.rest/download/) o una herramienta similar:

- Introduce la URL de la API (`http://localhost:8000/api/3`) con una petición de tipo **GET**.
- En la **pestaña Headers**, añade la cabecera **Token** con tu clave de API como valor.

Si la clave es correcta, la respuesta es el listado de recursos disponibles.

### ⚠️ Errores de autenticación

Todos devuelven un JSON con `status` igual a `error` y un `message` con el detalle:

- **`409`**: la API está desactivada.
- **`401`**: falta la cabecera, la clave no existe o está desactivada.
- **`403`**: la clave es válida pero no tiene permiso para ese recurso o ese método.
- **`429`**: tu IP está bloqueada durante 10 minutos.

Cada respuesta `401` o `403` cuenta como una alerta de seguridad. Tras 5 alertas desde la misma IP en 10 minutos, la API bloquea esa IP y responde `429`, incluso con una clave correcta. Más información en [Bloqueo de IP](https://facturascripts.com/publicaciones/bloqueo-de-ip-410).

## ❌ Error API-VERSION-NOT-FOUND

![API Version Not Found](https://facturascripts.com/MyFiles/2024/03/2021.png?myft=82c7541b26e4cfcb9078fd8a7ccee69d76e40dea)

Este error indica que no se ha seleccionado la versión de la API. La API está diseñada para soportar múltiples versiones, aunque por el momento solo utilizaremos la versión 3. La URL correspondiente a la versión 3 es: `http://localhost:8000/api/3`.

![Listado de Recursos](https://facturascripts.com/MyFiles/2024/03/2022.png?myft=fd1934bc91748ad90f3360e4a154bc0d784d7c17)

En la sección **Resources**, puedes encontrar todos los recursos o endpoints accesibles a través de la API, como agencias de transporte, agentes, albaranes de cliente y albaranes de proveedor, entre otros.