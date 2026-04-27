---
idproject: 176
name: fsRepublicaDominicana
permalink: fsrepublicadominicana
creationdate: 10-01-2022
lastmod: 19-02-2026
version: 1.34
betaversion: 1.25
mincore: 2025
maxcore: 2026
compatible: 
min_php: 8.2
require: 
require_php: 
url: https://facturascripts.com/plugins/fsRepublicaDominicana
---

Plugin base para generar los comprobantes fiscales NCF para República Dominicana

- Requisitos de Instalación
Para un correcto funcionamiento la instalación de FacturaScripts debe hacerse eligiendo el idioma Español de República Dominicana, la zona horaria: América/Santo_Domingo y el País República Dominicana

- Configuración Inicial
Para una correcta configuración primero se debe agregar en Contabilidad &gt; República Dominicana &gt; Maestro de NCF, la lista de tipos de comprobante autorizados por DGII para su emisión.

Los comprobantes fiscales soportados en este momento son todos los comprobantes físicos desde el 01 hasta el 17 y los electrónicos que inician en 31.

- Impresión de Comprobantes de Venta
La impresión de facturas también permite imprimir el tipo de comprobante fiscal, el numero de NCF y la fecha de vencimiento si esta aplica.
En el caso de los comprobantes electrónicos se generará con los datos que se suban del XML generado por el facturador electrónico gratuito de la DGII.

- Verificación de NCF de Proveedores
En el modulo de registro de facturas de proveedores puede verificar si el numero de NCF de un proveedor ya ha sido registrado con anterioridad antes de darle a guardar.

- Limitantes del plugin
El plugin no es completamente compatible con otros plugins que modifiquen las facturas de ventas o compras, cuando encuentre un problema de este tipo debe contactar primero al soporte del plugin no compatible y luego validar con el plugin de República Dominicana.

- Secciones que añade el plugin a FacturaScripts
El plugin agrega los siguientes submenus:

En Contabilidad agrega el submenu República Dominicana con las siguientes secciones:
- Impuestos: Aquí estan los impuestos adicionales como son ISC, CDT, Propina Legal y Primera Placa con sus correspondientes tasas.
- Maestro de NCF: Aquí se agregan las autorizaciones de emisión de NCF de la DGII.
- Tipo de Anulaciones: Aquí se puede dar mantenimiento a los tipos de anulaciones de DGII.
- Tipo de Movimiento: Aquí se puede dar mantenimiento a los tipos de movimientos de DGII.
- Tipo de NCF: Aquí se puede dar mantenimiento a las descripciones de los tipos de NCF.
- Tipo de Pago: Aquí se puede dar mantenimiento a los tipos de pago de DGII.

En Informes se agrega el submenu República Dominicana con las siguientes opciones:

- Informes Fiscales: Aquí uno puede generar los informes 606, 607 y 608 y un informe general con las compras y ventas.
El plugin agrega los siguientes campos en la parte final de la pantalla de Ventas &gt; Clientes

- Tipo de comprobante: Para indicar el tipo de comprobante que se le debe generar a este cliente
- Tipos de Pago: Para indicar cual es la forma de pago que se debe reportar de este cliente.
El plugin agrega los siguientes campos en la parte final de la pantalla Compras &gt; Proveedores

- Tipos de Pago: Este campo es para indicar cual es el tipo de pago que se tiene pactado con este cliente según la codificación de DGII.
- Tipos de Anulación: Ayudan en la gestión de los tipos de anulación al generar una nota de credito de una factura.
