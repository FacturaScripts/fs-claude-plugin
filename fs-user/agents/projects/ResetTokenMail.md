---
idproject: 446
name: ResetTokenMail
permalink: resettokenmail
creationdate: 20-05-2025
lastmod: 23-02-2026
version: 1.7
betaversion: 0
mincore: 2025
maxcore: 2025.9
compatible: PortalCliente
min_php: 8.2
require: 
require_php: 
url: https://facturascripts.com/plugins/ResetTokenMail
---

ResetTokenMail – Recuperación de contraseña moderna con token

Reemplaza el sistema de recuperación de contraseña de FacturaScripts pensado para instalaciones locales, y lo actualiza por un sistema moderno y seguro basado en token por correo electrónico. 

Es compatible con PortalCliente, permitiendo que usuarios internos y contactos del portal puedan restablecer su contraseña de forma autónoma.

Cuando un usuario solicita recuperar su clave, el plugin:

- Verifica si el email ingresado corresponde a un usuario válido (usuario interno o cliente del portal).
- Genera un token de restablecimiento de contraseña con validez temporal.
- Envía un correo con un enlace directo para establecer una nueva clave, sin necesidad de acceder a la base de datos ni conocer la contraseña del sistema.
