---
idproject: 16
name: FS2017Migrator
permalink: fs2017migrator
creationdate: 13-11-2018
lastmod: 16-08-2025
version: 3
betaversion: 2.9
mincore: 2025
maxcore: 2025.9
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/FS2017Migrator
---

Permite migrar los datos de FacturaScripts 2017 a la nueva estructura de FacturaScripts. Una vez realizada la migración no se puede seguir trabajando con la versión 2017 (obviamente).

Pasos para una correcta migración:
1. Haga una copia de seguridad de su base de datos y archivos de FacturaScripts 2017.
2. De verdad, haga una copia de seguridad.
3. Recuerde que no se puede trabajar con la versión 2017 y la 2024 a la vez sobre la misma base de datos.
4. Instale FacturaScripts 2024, conectando a la misma base de datos de 2017.
5. Instale el plugin FS2017Migrator en FacturaScripts 2024. Es un plugin, se instala como cualquier plugin. Haga clic en el menú Administrador &gt; Plugins. Clic en el botón añadir, seleccione el archivo zip del plugin y pulse aceptar.
6. Una vez instalado y activado, haga clic en el menú Administrador &gt; Migrador 2017.
7. Copie el zip con los archivos de FacturaScripts 2017 a la carpeta MyFiles/FS2017Migrator de FacturaScripts.
8. Pulse el botón ejecutar.

Errores:
Los errores que aparezcan solamente son importantes si el proceso se detiene. Si no se detiene, puede ignorar los errores.
