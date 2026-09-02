---
idproject: 608
name: Alquileres
permalink: alquileres
creationdate: 25-05-2026
lastmod: 17-07-2026
version: 1.5
betaversion: 
mincore: 2026
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/Alquileres
---
Permite gestionar alquileres de productos para negocios como empresas de alquiler de coches, inmuebles, maquinaria, equipos audiovisuales, etc.

Cada alquiler se asocia a un cliente y pasa por cuatro estados: Presupuesto, Activo, Pendiente de revisión y Cerrado. Puedes definir precio por periodo (hora, día, semana, mes, trimestre o año), descuento, fianza y tipo de facturación única o periódica. El número de periodos se calcula automáticamente a partir de las fechas de inicio y fin.

En la pestaña Productos añades los artículos que se alquilan, cada uno con su precio por periodo y descuento. En la pestaña Conceptos añades cargos adicionales como seguros o gastos de entrega. Puedes crear un catálogo de conceptos reutilizables para agilizar la entrada de datos. En la pestaña Facturas se muestran todas las facturas generadas para ese alquiler. En la pestaña Historial queda registrada cada acción realizada con fecha, hora y usuario.

Al activar el alquiler se genera automáticamente la factura de fianza (si tiene) y se envía un correo al cliente. El sistema puede notificar al cliente y al agente cuando un alquiler esté próximo a vencer. Cuando vence, el sistema lo marca automáticamente como pendiente de revisión, y desde ahí puedes cerrarlo indicando el importe de fianza devuelto: si es menor que la fianza cobrada, se genera automáticamente la factura de retención. Los alquileres periódicos generan facturas automáticamente cada periodo sin intervención manual. Desde cualquier alquiler cerrado o activo puedes crear una renovación, que genera un nuevo presupuesto copiando los productos, conceptos y condiciones.

En la ficha del cliente aparece una pestaña con todos sus alquileres. En la ficha del producto puedes indicar si permite alquiler simultáneo: si está desactivado, el sistema impedirá que ese producto esté en dos alquileres activos solapados a la vez.

También tenemos un informe con el total de alquileres, activos, alquileres en los últimos 30 días y en el último año, el importe por meses, por años, alquileres por estado, por agente y por cliente.