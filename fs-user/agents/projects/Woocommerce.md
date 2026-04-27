---
idproject: 413
name: Woocommerce
permalink: woocommerce
creationdate: 02-12-2024
lastmod: 26-12-2024
version: 1.2
betaversion: 1.2
mincore: 2024.5
maxcore: 2024.92
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/Woocommerce
---

Plugin: Sincronización de Pedidos Woocommerce a FacturaScripts

Este plugin permite sincronizar los pedidos de varias tiendas Woocommerce con FacturaScripts utilizando la API Rest de Woocommerce. Puedes configurar múltiples tiendas y gestionar la activación o desactivación de cada una, manteniendo los pedidos actualizados en FacturaScripts.

Requisitos:
1. Woocommerce: Debes tener acceso al API Rest de Woocommerce.
2. FacturaScripts: Tener una instalación de FacturaScripts compatible con el plugin.

Configuración del Plugin

1. Acceso a la configuración:
En FacturaScripts, ve a la configuración del plugin Woocommerce.

2. Agregar una nueva tienda Woocommerce:
Haz clic en el botón Nuevo.

3. Rellena los siguientes campos:
* Endpoint: URL de la tienda Woocommerce. Ejemplo: https://tutienda.com
* Clave del cliente: Clave del cliente.
* Clave secreta cliente: Clave secreta cliente.
* Activo: Marca si esta tienda está activa para sincronización.  

4. Personalizaciones:  
Puedes personalizar el código de factura.

5. Sincronización manual:  
Para la sincronización manual, haz clic en el botón &quot;Descargar facturas&quot; pulsar sobre una tienda en el listado, en el formulario de edición saldrá el botón.  

6. Sincronización automática:
Para la sincronización automática, la tienda tiene que estar activa y tener el check de &quot;cron&quot; activo.

Funcionalidades
* Pedidos: Sincroniza los pedidos nuevos de Woocommerce a FacturaScripts.
* Multiples tiendas: Puedes configurar varias tiendas Woocommerce para sincronización.
