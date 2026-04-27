---
idproject: 409
name: Prestashop
permalink: prestashop
creationdate: 24-10-2024
lastmod: 23-01-2025
version: 2.4
betaversion: 2.4
mincore: 2024.5
maxcore: 2024.94
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/Prestashop
---

Plugin: Sincronización de Pedidos PrestaShop a FacturaScripts

Este plugin permite sincronizar los pedidos de varias tiendas PrestaShop con FacturaScripts utilizando la API WebService de PrestaShop. Puedes configurar múltiples tiendas y gestionar la activación o desactivación de cada una, manteniendo los pedidos actualizados en FacturaScripts.

Requisitos:
1. PrestaShop: Debes tener acceso al WebService de PrestaShop.
2. FacturaScripts: Tener una instalación de FacturaScripts compatible con el plugin.
3. Permisos: Debes tener habilitado el acceso al WebService en PrestaShop.

Configuración del Plugin

1. Acceso a la configuración:
En FacturaScripts, ve a la configuración del plugin Prestashop.

2. Agregar una nueva tienda PrestaShop:
Haz clic en el botón Nuevo.

3. Rellena los siguientes campos:
* Endpoint: URL de la tienda PrestaShop. Ejemplo: https://tutienda.com
* Token: Clave de API generada en PrestaShop.
* Ultimo pedido: Es el id desde donde empezara a sincronizar ( como un puntero ), al sincronizar nuevos pedidos este id se actualizara automáticamente.  
* Activo: Marca si esta tienda está activa para sincronización.
* Cron: Marca si esta tienda puede ser sincronizada desde el cron.  

4. Personalizaciones:  
Puedes personalizar el código de factura.

5. Sincronización manual:
Descargar como factura: Para la sincronización manual, haz clic en el botón &quot;Descargar facturas&quot; pulsar sobre una tienda en el listado, en el formulario de edición saldrá el botón.  
Descargar como pedido: Para la sincronización manual, haz clic en el botón &quot;Descargar pedidos&quot; pulsar sobre una tienda en el listado, en el formulario de edición saldrá el botón.

6. Sincronización automática:
Para la sincronización automática, la tienda tiene que estar activa y tener el check de &quot;cron&quot; activo.

Funcionalidades
* Pedidos: Sincroniza los pedidos nuevos de PrestaShop a FacturaScripts.
* Multiples tiendas: Puedes configurar varias tiendas PrestaShop para sincronización.
