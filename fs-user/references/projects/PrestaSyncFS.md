---
idproject: 780
name: PrestaSyncFS
permalink: prestasyncfs
creationdate: 02-09-2026
lastmod: 04-11-2026
version: 1.7
betaversion: 0
mincore: 2025
maxcore: 2030
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/PrestaSyncFS
---
Conecta tu tienda PrestaShop con FacturaScripts: los pedidos de la web entran solos como pedido, albarán o factura de cliente, y el stock de FacturaScripts vuelve a la tienda.

QUÉ HACE
• Importa los pedidos de PrestaShop con sus líneas (referencia, cantidad, precio sin IVA y tipo de IVA) y los gastos de envío.
• NUEVO: eliges en cada tienda qué documento se crea: Pedido de cliente, Albarán de cliente o Factura de cliente. Los documentos quedan enlazados y el stock se descuenta una sola vez.
• Da de alta al cliente con su NIF, email, teléfono y dirección, o lo enlaza si ya existe (por NIF o email).
• Cada pedido de la tienda entra una sola vez, aunque sincronices varias veces o la importación se corte a medias.
• Importa los productos de la tienda por referencia y, si quieres, actualiza su precio y su descripción.
• Envía el stock de FacturaScripts a la tienda, de un almacén concreto o la suma de todos.
• Varias tiendas, cada una con su conexión, serie, forma de pago, almacén y opciones.
• Sincronización con un botón o automática por cron, con lista de pedidos sincronizados y registro de cada operación.

CÓMO FUNCIONA
1. En PrestaShop activa el Webservice y crea una clave API con permiso sobre pedidos, clientes, direcciones, productos y stock.
2. En FacturaScripts pega la URL de la tienda y la clave, y pulsa Probar conexión.
3. Elige los estados de pedido a importar y el documento a crear, y sincroniza (o activa el cron).

PARA QUIÉN
Tiendas online con PrestaShop que llevan la facturación, el almacén o la contabilidad en FacturaScripts y no quieren pasar los pedidos a mano.

NOVEDADES
• 1.6: ajuste Crear como (Pedido, Albarán o Factura de cliente) por tienda y columna con el albarán generado en Pedidos sincronizados.
• 1.5: un pedido ya no puede entrar dos veces aunque la importación se corte; el envío de stock no deja la tienda a cero si no puede leer el stock; la casilla Tienda activa se puede desmarcar.
• 1.4: acciones del panel solo con permiso de modificar y enviadas desde sus botones; la clave API ya no viaja en la página.

ANTES DE ACTUALIZAR FACTURASCRIPTS
• Actualiza primero este plugin a su última versión. Las versiones antiguas declaran compatibilidad solo hasta FacturaScripts 2026.7: cuando salga la próxima versión estable, el actualizador las marcará como incompatibles y su botón Descargar las desactivará. La última versión del plugin está declarada compatible hasta 2030.
• Si ya te sale ese aviso, en el actualizador usa Opciones &gt; No desactivar plugins y actualiza el plugin justo después.

REQUISITOS
• FacturaScripts 2025 o superior y PHP 8.0 o superior, con la extensión cURL.
• PrestaShop con el Webservice activado y una clave API.
• Tu FacturaScripts tiene que poder conectar por internet con la tienda.

AVISO
Revisa los pedidos, clientes y documentos que se crean antes de usarlos en tu facturación o contabilidad, sobre todo al empezar. Configura primero una tienda de pruebas si puedes y consulta con tu asesor cualquier duda fiscal o contable.