---
id: 4507
permalink: autenticacion-en-2-pasos
title: Autenticación en 2 pasos
creationdate: 03-09-2026 17:00:54
lastmod: 21-09-2026
url: https://facturascripts.com/publicaciones/autenticacion-en-2-pasos
---
La autenticación en 2 pasos (también llamada doble factor o 2FA) añade una segunda comprobación al iniciar sesión: además del usuario y la contraseña, hay que introducir un código de 6 cifras que genera una aplicación en el móvil y que cambia cada pocos segundos.

Así, aunque alguien consiga tu contraseña, no podrá entrar en tu FacturaScripts sin tener también tu móvil. Es muy recomendable activarla, sobre todo si tienes FacturaScripts publicado en internet.

## 📱 Qué necesitas

Una aplicación de códigos temporales en el móvil. Google Authenticator es la más conocida, pero funciona cualquiera compatible con el estándar TOTP (Microsoft Authenticator, Authy, FreeOTP, el gestor de contraseñas que ya uses, etc.).

## ✅ Cómo activarla

1. Ve al **menú Administrador** → **Usuarios** y abre la ficha del usuario. Si no eres administrador, entra en tu propia ficha: cada usuario puede activarla para sí mismo.
2. Pulsa el botón **Activar autenticación en 2 pasos**.
3. Aparecerá un código QR. Escanéalo con la aplicación del móvil. Si no puedes escanearlo, usa el enlace de **Configuración manual** para copiar la clave secreta a mano.
4. La aplicación empezará a mostrar un código de 6 cifras. Escríbelo en el campo **Código de doble factor** y pulsa **Verificar**.

El proceso no termina hasta que verificas el código. Es a propósito: así te aseguras de que la aplicación está bien configurada **antes** de que el programa empiece a pedírtela.

A partir de ese momento, cada vez que inicies sesión, tras el usuario y la contraseña el programa te pedirá el código.

## 🚫 Cómo desactivarla

En la ficha del usuario aparecerá el botón **Desactivar autenticación en 2 pasos**. Al pulsarlo se pide confirmación y, una vez desactivada, el usuario vuelve a entrar solo con usuario y contraseña.

Si más adelante quieres volver a activarla, tendrás que repetir todo el proceso y escanear un **QR nuevo**: por seguridad el programa no vuelve a mostrar una clave secreta que ya está en uso.

## 🆘 He perdido el móvil y no puedo entrar

Un **administrador** puede desactivar la autenticación en 2 pasos de cualquier usuario desde su ficha, sin necesidad del código. Después el usuario podrá entrar con su contraseña y volver a activarla con un móvil nuevo.

⚠️ Si el usuario afectado es el **único administrador** y no tiene acceso a su aplicación de códigos, nadie podrá desactivarla desde el programa. Antes de activar la 2FA en la única cuenta de administrador que tengas, asegúrate de guardar la clave secreta (la de *Configuración manual*) en un lugar seguro, o de tener un segundo usuario administrador.

## 🔍 Ver quién la tiene activada

En el listado de usuarios, en el **menú Administrador** → **Usuarios**, tienes un filtro para mostrar solo los usuarios con la autenticación en 2 pasos **activada** o **desactivada**. Es la forma rápida de comprobar que todo el equipo la tiene puesta.

## Ver también

- [Usuarios y permisos](https://facturascripts.com/publicaciones/usuarios-y-permisos)
- [He olvidado mi contraseña](https://facturascripts.com/publicaciones/he-olvidado-mi-contrasena)
- [Bloqueo de IP](https://facturascripts.com/publicaciones/bloqueo-de-ip-410)