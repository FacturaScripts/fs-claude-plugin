---
id: 811
permalink: bloqueo-de-ip-410
title: Bloqueo de IP
creationdate: 04-09-2019 00:00:00
lastmod: 03-10-2026
url: https://facturascripts.com/publicaciones/bloqueo-de-ip-410
---
FacturaScripts bloqueará automáticamente el acceso desde una IP tras registrar varias alertas de seguridad seguidas: **6 en el acceso por el formulario web** y **5 en la API**, mostrando el mensaje &quot;**Por motivos de seguridad se ha bloqueado durante 10 minutos el acceso desde su IP**&quot;. También puede salir un **error 429**, que es el mismo caso pero en la API. La IP quedará bloqueada durante 10 minutos.

## Alertas de seguridad
- Intentar iniciar sesión con una contraseña incorrecta.
- Intentar cambiar la contraseña del usuario con una clave incorrecta de la base de datos.
- Intento fallido de autenticación en la API.
- Intento fallido de burlar los permisos del usuario.

### Motivos
La motivación de este sistema de seguridad es evitar que se pueda **obtener acceso al sistema por fuerza bruta**, es decir, utilizando bots que prueban muchos usuarios y contraseñas distintas hasta encontrar el correcto. Lo mismo con la API. Este sistema es necesario para mantener la seguridad de su sistema. Por eso implementamos este baneo de IPs.

### ¿Está usando fsprinter?
Si está usando versiones antiguas de fsprinter y la clave de API configurada ya no está activa, esas consultas de fsprinter pueden bloquear su IP. Cierre fsprinter para comprobar si ese es el problema.

### ¿Se bloquea a todos los usuarios a la vez?
FacturaScripts identifica a cada cliente por su IP. Si está instalado detrás de un **proxy inverso, un balanceador o un CDN**, todas las peticiones pueden llegar con la IP del proxy y, tras varios fallos de cualquier usuario, se bloquearía el acceso a todos.

Desde la versión 2026.7, las cabeceras ``X-Forwarded-For`` y ``CF-Connecting-IP`` solo se usan para obtener la IP real cuando la petición llega de un proxy de confianza: una IP de red privada o local, una IP de Cloudflare o una IP o rango indicado en la constante **FS_TRUSTED_PROXIES** del [config.php](https://facturascripts.com/publicaciones/el-archivo-config-php). Así nadie puede falsear su IP para saltarse este bloqueo.

Si su proxy tiene una IP pública y no es Cloudflare, añádala al config.php:

```
define(&#39;FS_TRUSTED_PROXIES&#39;, &#39;203.0.113.10&#39;);
```

## ✅ Solución
Podemos restaurar el acceso y desbloquear las IPs **esperando 10 minutos** o bien:
- Eliminando el contenido de la carpeta **MyFiles/Tmp/FileCache** de FacturaScripts.