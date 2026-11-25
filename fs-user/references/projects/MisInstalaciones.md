---
idproject: 829
name: MisInstalaciones
permalink: misinstalaciones
creationdate: 09-11-2026
lastmod: 09-11-2026
version: 1
betaversion: 0
mincore: 2026.5
maxcore: 2026.72
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/MisInstalaciones
---
# MisInstalaciones

Controla desde un único panel todas tus instalaciones de FacturaScripts. MisInstalaciones se conecta a cada instalación remota mediante la API REST del core, así que no tienes que instalar nada en ellas.

## ¿Qué puedes hacer?
- **Registrar tus instalaciones** con su nombre, URL, API key y observaciones
- **Probar la conexión** con un clic
- **Gestionar los plugins**: consulta los plugins activos e inactivos de cada instalación y actívalos o desactívalos sin entrar en ella
- **Consultar sus datos**: versión de FacturaScripts, número de plugins instalados y usuarios con su estado y sus grupos
- **Revisar los errores**: con el plugin VisorErrores en la instalación remota, consulta y elimina sus errores críticos y revisa los errores de base de datos

## Compatible con VisorErrores
Si la instalación remota tiene activado **VisorErrores 1.6 o superior**, aparecen dos pestañas más:
- **Visor de Errores**: lista los errores críticos de la instalación y permite borrar uno o todos
- **Logs de base de datos**: muestra los últimos errores de base de datos registrados

Sin VisorErrores, el resto del panel funciona con normalidad y esas pestañas no se muestran.

## Rápido y seguro
- La ficha se abre al momento y cada pestaña se carga solo cuando la necesitas
- Solo se aceptan conexiones https
- La API key solo aparece en el formulario de la instalación: no se envía en las pestañas, en las exportaciones ni en la API

## Requisitos
- FacturaScripts 2026.5 o superior en la instalación donde instales el plugin
- API REST activada en las instalaciones remotas
- Una API key con acceso a users, roles, roleusers y plugins (y a visorerrores si usas VisorErrores)
- FacturaScripts 2026.1 o superior en la remota para activar y desactivar plugins, y 2026.4 o superior para ver su versión