---
idproject: 772
name: TransportesDeCA
permalink: transportesdeca
creationdate: 24-08-2026
lastmod: 09-10-2026
version: 1.31
betaversion: 0
mincore: 2026
maxcore: 2026.7
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/TransportesDeCA
---
Gestiona los transportes dentro de FacturaScripts, tanto si cargas tu propia mercancía (cantera, planta de áridos, fábrica…) como si eres una **empresa de transportes** que lleva la mercancía de sus clientes. Das de alta vehículos, transportistas y conductores una vez, y en cada albarán registras el pesaje y el transporte sin salir del documento que ya usas para facturar. Y emites el DeCA (Documento Electrónico de Control Administrativo) cumpliendo la Orden FOM/2861/2012 y la Resolución de 5 de junio de 2026, obligatorio desde el 5 de octubre de 2026.

Al elegir el vehículo, la carga se rellena sola con la última combinación que usó (remolque, tara, MMA, autorización especial, empresa de transporte y conductor). Registras el pesaje —uno o varios materiales— y al guardar cada material se vuelca a su línea del albarán en la unidad en que lo vendes: toneladas, kilos, metros cúbicos o unidades. Desde ahí emites el DeCA con su código QR, que se mantiene al día con cualquier cambio y queda registrado tal como exige la norma.

Sirve igual para tus albaranes de venta (con DeCA) y para tus albaranes de compra de proveedor (sin DeCA), reutilizando la misma báscula.

Características principales:

- **Para productores y para empresas de transportes:** en la ficha de cada empresa eliges su papel. Como **productor** (por defecto), el origen es tu almacén y el cargador, quien contrata el transporte. Como **empresa de transportes**, cumplimentas el DeCA para tu cliente: tu empresa figura como transportista efectivo, tu cliente como cargador contractual, y en cada carga indicas el lugar de carga, el destinatario y la mercancía. Si subcontratas el viaje, las figuras se invierten solas. Admite instalaciones multiempresa, cada empresa con su rol.
- **Maestros propios** en el menú Almacén: Vehículos (matrícula, remolque principal, tara, MMA, autorización especial, empresa de transporte, conductor por defecto y cliente/proveedor habitual), Empresas de transporte y Conductores, con relación entre conductores y transportistas.
- **Varios remolques por vehículo:** cada combinación vehículo + remolque guarda su tara, su MMA y su autorización. Se registran solas al pesar.
- **Varios materiales en una carga:** granel, palets, sacos o big bags en el mismo camión, cada uno con su peso y su línea del albarán; reparto automático y aviso si no cuadra con lo pesado.
- **Volcado según cómo vendes cada producto:** toneladas, kilos, metros cúbicos (con su densidad), unidades/bultos o nada (por ejemplo, un porte que se cobra por viaje).
- **Pestaña Carga** dentro del albarán: pesaje con neto en vivo, aviso de **sobrecarga**, obra/destino propuesta con la dirección del cliente, horas con botón &quot;Ahora&quot;, observaciones para el DeCA y observaciones internas, y &quot;Deshacer cambios&quot;.
- **¿Quién contrata el transporte?** El cliente, tu empresa (venta puesta en obra o porte subcontratado) o transporte privado complementario (sin DeCA): el cargador contractual del documento siempre es el correcto.
- **DeCA conforme a la Resolución de 5-6-2026:** borrador, emisión con código correlativo y fecha y hora, comprobación de todos los datos del artículo 6 (cargador con domicilio, autorización especial, observaciones y reservas…), PDF con QR y fechas como metadatos.
- **Modificaciones con trazabilidad:** cualquier cambio en un DeCA emitido exige un motivo y queda registrado en el propio documento, con los valores anteriores marcados como no válidos. El QR muestra siempre la versión vigente.
- **DeCA agrupado:** varios albaranes del mismo cargador y transportista en un único documento.
- **Conservación de al menos un año** y anulación cuando el servicio no se realiza.
- **Envío por email** al conductor, a la empresa de transporte y al cliente (los dos ejemplares del artículo 8), con registro de cada envío.
- **Listado de DeCA** con filtros por estado, fechas, cliente y transportista.
- **Compatible con VeriFactu por diseño:** no crea líneas extra ni líneas a importe 0.
- **Autocontenido:** PDF y QR con las librerías del propio núcleo de FacturaScripts.

Listo desde el primer día: se instala como cualquier plugin y crea sus tablas al activarlo. Das de alta tus vehículos y transportistas, abres un albarán, rellenas la pestaña Carga y emites el DeCA.