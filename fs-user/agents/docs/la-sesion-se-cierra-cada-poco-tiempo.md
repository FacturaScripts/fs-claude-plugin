---
id: 2146
permalink: la-sesion-se-cierra-cada-poco-tiempo
title: La sesión se cierra cada poco tiempo
creationdate: 17-06-2025 20:20:00
lastmod: 17-06-2025
url: https://facturascripts.com/publicaciones/la-sesion-se-cierra-cada-poco-tiempo
---
Cuando inicias sesión con un usuario en FacturaScripts, la sesión se mantiene abierta durante mucho tiempo o hasta que la cierres (menú de usuario, arriba a la derecha, y clic en cerrar sesión).

## ⌛ Duración de la sesión
La sesión de usuario se almacena en una cookie en el navegador y esta se mantiene durante el tiempo que tengas configurado en el [archivo config.php](https://facturascripts.com/publicaciones/el-archivo-config-php) de FacturaScripts. En concreto es la constante `FS_COOKIES_EXPIRE` y por defecto su valor es `31536000` (1 año en segundos).

## 👥 Iniciar sesión con el mismo usuario
Como medida de seguridad, dos personas no pueden iniciar sesión con el mismo usuario. Cuando la segunda persona inicie sesión con el usuario, se cerrará la sesión del primero. Y aparecerá el mensaje de: `cookie de sesión no válida: probablemente haya iniciado sesión desde otro dispositivo o navegador`.

Simplemente [cree un usuario](https://facturascripts.com/publicaciones/usuarios-y-permisos) para cada persona que vaya a usar FacturaScripts. No es necesario ni recomendable que todo el mundo use el mismo usuario.