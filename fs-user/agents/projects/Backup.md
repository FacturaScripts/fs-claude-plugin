---
idproject: 116
name: Backup
permalink: backup
creationdate: 08-03-2021
lastmod: 26-03-2026
version: 3.4
betaversion: 3.5
mincore: 2025.6
maxcore: 2026
compatible: 
min_php: 
require: 
require_php: zip
url: https://facturascripts.com/plugins/Backup
---

Permite crear y restaurar copias de seguridad de la base de datos (sólo MySQL) y los archivos de FacturaScripts. Imprescindible para no perder datos en caso de problemas.

Menú:
Añade la sección &quot;copia de seguridad&quot; al menú administrador.

Aviso:
Si está instalado en un hosting o servidor, el usuario de la base de datos debe tener el permiso &quot;LOCK TABLES&quot; y suficiente memoria en PHP como para copiar esa base de datos. En caso contrario es mejor exportar la base de datos desde el panel de control del hosting.

Consejos:
- Haz una copia de seguridad al menos una vez al mes.
- Guarda las copias de seguridad en un pendrive o disco duro externo y en un lugar seguro y alejado del PC o servidor donde tengas instalado FacturaScripts. En caso de incendio o desastre, de nada sirve una copia de seguridad si la tienes en la misma habitación.
- Evita dejar estos archivos en ordenadores inseguros. Cualquiera que obtenga estos archivos tendrá acceso a toda tu facturación y la información de tus clientes.
