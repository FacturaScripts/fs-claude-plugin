---
idproject: 752
name: AnticiposAccounting
permalink: anticiposaccounting
creationdate: 28-07-2026
lastmod: 01-09-2026
version: 1.11
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 7.4
require: Anticipos
require_php: 
url: https://facturascripts.com/plugins/AnticiposAccounting
---
**Complemento del Plugin Anticipos**, para dar **soporte a la contabilización** de los anticipos, tanto de clientes como de proveedores:
- El plugin contempla la generación de asientos para nuevos anticipos, y no tiene en cuenta los existentes que No se generaron con el plugin.
- En el caso de que se produzca una modificación de esos anticipos, que afecte a la contabilización, se localiza el último asiento correspondiente generado con el plugin, y se genera un asiento de compensación con los datos iniciales del anticipo, y otro asiento con los nuevos datos.
- **El plugin No elimina ningún asiento**, para poder seguir toda su historia hasta llegar a la facturación del documento vinculado con el anticipo.