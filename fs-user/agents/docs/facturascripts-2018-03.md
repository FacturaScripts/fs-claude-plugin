---
id: 68
permalink: facturascripts-2018-03
title: FacturaScripts 2018.03
creationdate: 27-05-2019 12:51:45
lastmod: 29-12-2020
url: https://facturascripts.com/publicaciones/facturascripts-2018-03
---

Ya puede descargar, desde la [sección descargar](https://facturascripts.com/descargar), la versión **2018.03** de FacturaScripts. O bien utilizar el actualizador (menú Administrador &gt; Panel de control &gt; Actualizador).

## Retenciones
Para esta versión hemos mejorado el soporte de **retenciones** (principalmente IRPF). Ahora ya puede asignar retenciones a clientes y proveedores, de forma que si necesita cambiar el porcentaje, puede hacerlo desde el menú Contabilidad &gt; Impuestos (pestaña retenciones), en lugar de ir proveedor por proveedor o cliente por cliente. También se puede seleccionar la retención predeterminada, para que al crear clientes o proveedores se les asigne automáticamente.

## Otras mejoras
- Ya puede especificar subcuentas para cada tipo de retención, de forma que al generar los asientos se usarán esas subcuentas.
- La **generación automática de asientos** a partir de facturas ahora desglosa los totales para cada impuesto, creando una línea para cada impuesto y usando las subcuentas especificadas en la configuración de ese impuesto.
- Añadido botón para **generar asientos** en la pestaña asientos de la factura.
- Añadidas configuraciones predeterminadas para **Argentina, Chile, Colombia, Ecuador, Panamá y República Dominicana**.
- Todos los **emails enviados** desde FacturaScripts quedan ahora registrados en Adminsitrador &gt; Panel de control &gt; Logs, pestaña emails enviados.
- Nuevos **identificadores fiscales**: CUIL, CUIT, NIE, NIT, RIF, RUC, RUN, RUT. Además, ahora se pueden modificar desde  el menú Administrador &gt; ID: fiscales.
- En general, se ha mejorado la elección de colores en muchos listados para que sea más representativa. Por ejemplo, en presupuestos, pedidos y albaranes se utiliza el verde solamente para resaltar los documentos aprobados.
- La ficha de un impuesto muestra ahora las zonas asociadas a ese impuesto, es decir, aquellos paises o provincias donde ese impuesto se aplica distinto o no se aplica.
- La ficha de un país muestra ahora sus provincias.
- Se ha mejorado la ordenación de variantes dentro de un producto y valores dentro de un atributo para que tenga un orden más natural.

## Correcciones
Para evitar problemas, ahora se impide eliminar:
- La empresa predeterminada.
- El almacén predeterminado.
- El país predeterminado.
- La forma de pago predeterminada.
- La serie predeterminada.

También se ha modificado el **agrupador de documentos** para impedir agrupar documento de distinto cliente o proveedor o divisa. Y en presupuestos, pedidos albaranes y facturas, ya no se puede cambiar el estado del documento si este ya ha sido aprobado.

## Actualizar desde la versión 2017
FacturaScripts 2017 todavía tiene más plugins que la versión 2018. Por ese y otros motivos no hemos modificado el actualizador de FacturaScripts 2017 para poder pasar a la nueva versión.

Si quiere probar, le recomendamos los siguientes pasos:
- [Haga una copia de seguridad](https://facturascripts.com/doc/2/copias-de-seguridad/como-hacer-una-copia-de-seguridad-de-facturascripts).
- **Instale FacturaScripts 2018** usando la misma base de datos.
- Instale el [plugin FS2017Migrator](https://facturascripts.com/plugins/FS2017Migrator).

También puede probar con una [instalación de pruebas de FacturaScripts](https://facturascripts.com/CloudManager) en nuestra nube privada.
