---
idproject: 687
name: AliasClientes
permalink: aliasclientes
creationdate: 07-07-2026
lastmod: 07-07-2026
version: 1
betaversion: 
mincore: 2025
maxcore: 2026.3
compatible: 
min_php: 8
require: Alias
require_php: 
url: https://facturascripts.com/plugins/AliasClientes
---
## AliasClientes 1.00

Primera versión estable de **AliasClientes**, que integra el plugin base **Alias** en las fichas de
clientes y proveedores para gestionar sus nombres alternativos (alias).

### 🚀 Novedades
- Gestión de **alias en la ficha del cliente**: nueva pestaña para añadir y administrar los alias del cliente
- Gestión de **alias en la ficha del proveedor**: misma funcionalidad para proveedores
- Aprovecha el plugin **Alias** (tipos &quot;cliente&quot; y &quot;proveedor&quot;) en lugar de una tabla propia, con **favorito único** por entidad
- **Borrado en cascada**: al eliminar un cliente o un proveedor, sus alias se eliminan automáticamente (sin registros huérfanos)
- Registra en el catálogo de tipos de alias los tipos &quot;cliente&quot; y &quot;proveedor&quot; con su descripción traducida, indicando que este plugin es el responsable

### 🔧 Compatibilidad
- Requiere el plugin **Alias** y FacturaScripts 2025 o superior con PHP 8
- Publicado bajo licencia **GPL v3**