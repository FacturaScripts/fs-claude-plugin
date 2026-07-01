---
idproject: 482
name: Comentarioprivado
permalink: comentarioprivado
creationdate: 22-11-2025
lastmod: 01-05-2026
version: 1.57
betaversion: 0
mincore: 2025
maxcore: 2026.3
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/Comentarioprivado
---
Añade un campo de texto llamado Comentario privado en el pie de cada documento de venta: Albaranes, Facturas, Pedidos y Presupuestos. Este nuevo campo de comentario creado es para uso interno y no es imprimible en el mismo documento generado, al contrario que el campo Observaciones que es imprimible e integrado en el documento por defecto.

Puede servir para realizar anotaciones referente al documento:
- Falta servir X
- No facturar hasta el día tal.
- Pasará a recoger el día tal.
- Faltan colocar artículos.
- Modificar precios antes de.
- Revisar
- Numero de apunte frecuente de referencia tal.
- Hemos pasado a cobrar 3 veces... etc,etc

Si editamos este campo para añadir cualquier comentario después de que haya pasado el estado a modo emitido, es necesario pulsar el botón encima del campo para guardar únicamente este campo de información privada. 
Los demás campos del formulario no quedan alterados ya que pueden estar en modo solo lectura, no modificando el contenido de estos.

También se han modificado las Listas de Albaranes, Facturas, Pedidos y Presupuestos para que muestre la columna del campo Comentario privado y hacer sus busquedas relacionadas.

Posibilidad de transferir o no el contenido del comentario privado cuando se generen nuevos documentos. Dentro de los settings del Panel de control - Comentarioprivado : si el check &quot;Transferir comentario privado al generar documentos&quot; está activado se copiará el campo comentarioprivado al nuevo documento, si está desactivado no se copiará el campo al documento.

Leer en la Pestaña Documentación el resto de la explicación del plugin.