---
idproject: 685
name: GoogleLogin
permalink: googlelogin
creationdate: 06-07-2026
lastmod: 11-08-2026
version: 1
betaversion: 
mincore: 2025.6
maxcore: 2026.6
compatible: 
min_php: 
require: 
require_php: curl
url: https://facturascripts.com/plugins/GoogleLogin
---
# GoogleLogin — Entrar con Google para FacturaScripts

Permite a los usuarios de una instalación de FacturaScripts iniciar sesión con su cuenta de Google, en vez de (o además de) usuario y contraseña.

El email de la cuenta de Google debe coincidir con el email de un usuario ya existente en esa instalación. El plugin no crea usuarios nuevos: solo abre
sesión a los que ya existen.

## Dos modos de funcionamiento

### Modo directo

Pensado para cualquier instalación de FacturaScripts, tuya o de un tercero.
Habla directamente con Google, con tu propia app OAuth.

**Alta:**

1. Instala y activa el plugin (Administrador → Plugins → Añadir → sube el zip → Activar).
2. Ve a **Administrador → Entrar con Google**.
3. En &quot;Modo&quot; elige **Directo**.
4. La propia pantalla te muestra la URL exacta de tu instalación
   (`https://tudominio.com/LoginGoogleCallback`) — apúntala, la necesitas en el paso siguiente.
5. En [Google Cloud Console](https://console.cloud.google.com/):
   - Crea un proyecto (o usa uno existente).
   - Configura la pantalla de consentimiento OAuth (nombre de la app, email de soporte).
   - Crea credenciales → **ID de cliente de OAuth 2.0** → tipo **Aplicación web**.
   - En &quot;URI de redireccionamiento autorizados&quot;, añade *exactamente* la URL del paso 4.
   - Guarda y copia el **Client ID** y el **Client Secret** que te da Google.
6. Pega ambos en los campos correspondientes de la pantalla del plugin y guarda.
7. Ya aparece el botón &quot;Entrar con Google&quot; en el login. Sin dependencias externas: habla directo con Google, nadie más interviene.

El Client Secret es tuyo, de tu proyecto de Google Cloud — nadie más lo conoce ni lo necesita.

### Modo broker (uso interno de misfacturas.eu)

Pensado para instalaciones alojadas en misfacturas.eu. En vez de hablar directamente con Google, la instalación delega el intercambio OAuth en `auth.misfacturas.eu`, que ya tiene su propia app de Google registrada — así no hace falta crear un proyecto en Google Cloud por cada empresa.

**Este modo no es de alta pública.** No hay ningún formulario de registro: el &quot;Broker Secret&quot; es un valor interno de misfacturas.eu, el mismo para todas sus empresas, que el sistema de aprovisionamiento escribe automáticamente en cada instalación nueva junto con el subdominio correspondiente. Si compras/instalas este plugin fuera de misfacturas.eu, usa el **modo directo**.

## ¿Cómo sabe FacturaScripts a quién dejar entrar?

Ni el modo directo ni el broker crean usuarios. Tras verificar la cuenta de Google (directamente o vía el broker), el plugin busca un usuario **activo** cuyo campo `email` coincida exactamente con el de la cuenta de Google. Si no lo encuentra, muestra un aviso y no abre sesión. Para dar acceso a alguien nuevo por Google, primero tiene que existir como usuario normal en Administrador → Usuarios, con ese email.

## Seguridad

- El token que certifica el login (ya sea del intercambio directo con Google   o de vuelta del broker) tiene una validez de 60 segundos y va firmado (HS256). Una vez verificado, el plugin abre sesión exactamente igual que un   login con contraseña (mismas cookies, mismo mecanismo de `logkey`).
- El Client Secret (modo directo) y el Broker Secret (modo broker) se guardan   en la configuración interna de FacturaScripts; trátalos como cualquier otra contraseña — no los compartas ni los subas a repositorios públicos.