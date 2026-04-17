---
id: 811
permalink: bloqueo-de-ip-410
title: Bloqueo de IP
creationdate: 04-09-2019 00:00:00
lastmod: 26-03-2026
url: https://facturascripts.com/bloqueo-de-ip-410
---
FacturaScripts bloqueará automáticamente el acceso desde una IP tras anotar **5 alertas de seguridad**, mostrando el mensaje &quot;**Por motivos de seguridad se ha bloqueado temporalmente el acceso desde su IP**&quot;. También puede salir un **error 429**, que es el mismo caso. La IP quedará bloqueada o baneada durante 10 minutos.

## Alertas de seguridad
- Intentar iniciar sesión con una contraseña incorrecta.
- Intentar cambiar la contraseña del usuario con una clave incorrecta de la base de datos.
- Intento fallido de autenticación en la API.
- Intento fallido de burlar los permisos del usuario.

### Motivos
La motivación de este sistema de seguridad es evitar que se pueda **obtener acceso al sistema por fuerza bruta**, es decir, utilizando bots que prueban muchos usuarios y contraseñas distintas hasta encontrar el correcto. Lo mismo con la API. Este sistema es necesario para mantener la seguridad de su sistema. Por eso implementamos este baneo de IPs.

### ¿Esta usando fsprinter o mc20printer?
Si está usando versiones antiguas de fsprinter y la clave de API configurada ya no está activa, esas consultas de fsprinter pueden bloquear su IP. Cierre fsprinter para comprobar si ese es el problema.

## ✅ Solución
Podemos restaurar el acceso y desbloquear las IPs **esperando 10 minutos** o bien:
- Eliminando la carpeta **MyFiles/Tmp/FileCache** de FacturaScripts.
- Eliminando el archivo **MyFiles/Cache/ip.list** de la carpeta de FacturaScripts
