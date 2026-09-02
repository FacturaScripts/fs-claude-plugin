---
idproject: 686
name: Alias
permalink: alias
creationdate: 07-07-2026
lastmod: 07-07-2026
version: 1
betaversion: 
mincore: 2025
maxcore: 2026.3
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/Alias
---
## Alias 1.00

Primera versión estable del plugin **Alias**, base para gestionar alias (nombres alternativos)
polimórficos reutilizables en distintas áreas de FacturaScripts.

Alias sólo proporciona la estructura base. El uso &quot;real&quot; lo proporcionan plugins asociados (AliasClientes y AliasLocalizaciones)

### Objetivo
El objetivo del plugin es proporcionar un elemento que permita vincular distintos elementos de facturascripts con nombres diversos. Por ejemplo, localizar un punto de interes concreto a través de distintos nombres, o un cliente por diversas abreviaturas recibida de ficheros de importación.

### 🚀 Novedades
- Gestión de **alias reutilizables**: guarda nombres alternativos y los asocia a cualquier entidad del ERP (por tipo + código)
- **Tipos de alias** con catálogo propio; cada tipo registra el plugin responsable que lo crea, de modo que otros plugins (por ejemplo AliasClientes o AliasLocalizaciones) puedan declarar sus propios tipos
- **Favorito único por entidad**: al marcar un alias como favorito, los demás alias de esa misma entidad se desmarcan automáticamente
- **Auditoría** en cada alias: fecha de creación y de última modificación y usuario responsable
- Pantallas de gestión: listado de alias y fichas de edición de alias y de tipos de alias

### ✨ Mejoras
- Listados de alias más informativos (muestran el tipo)

### 🔧 Compatibilidad
- Requiere FacturaScripts 2025 o superior y PHP 8