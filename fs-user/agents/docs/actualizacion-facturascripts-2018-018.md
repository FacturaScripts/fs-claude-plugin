---
id: 39
permalink: actualizacion-facturascripts-2018-018
title: Actualización FacturaScripts 2018.018
creationdate: 12-04-2019 10:53:07
lastmod: 18-06-2019
url: https://facturascripts.com/publicaciones/actualizacion-facturascripts-2018-018
---

Ya está disponible la primera actualización de FacturaScripts 2018 tras el lanzamiento, con correcciones a los problemas detectados y algunas mejoras.

## Mejoras generales
- El listado de plugins (admin &gt; panel de control &gt; plugins) ahora también muestra los plugins disponibles en la web.
- Añadida la fuente &quot;presupuestos de proveedor&quot; al informe de documentos.
- Ya se puede exportar el plan contable de un ejercicio.
- Ahora al crear nuevas facturas, albaranes, etc, se muestra el mensaje de &quot;datos guardados correctamente&quot;.

## Mejoras para desarrollo
- Se ha ampliado la funcionalidad de la [clase ModelOnChange](https://facturascripts.com/doc/1/desarrollo-sobre-facturascripts-2018/creacion-de-plugins/los-modelos/modelonchangeclass) añadiendo los métodos onDelete() y onInsert().

## Correcciones
- Se ha solucionado el problema al  crear o editar elementos secundarios de una vista justo después de crear un elemento. Ejemplo: crear un producto nuevo y a continuación crear una nueva variante para ese producto.
- Solucionado el bug que generaba nuevos ejercicios innecesarios cuando el almacén no tiene una empresa asignada.
- Solucionado el bug que permitía vender productos sin stock que no permiten la venta sin stock. Esto solamente se aplica cuando efectivamente hay que restar stock (albaranes y facturas de venta).
- Solucionado bug al generar la subcuenta para el primer proveedor.

## Cómo actualizar
Puedes actualizar desde el menú admin &gt; panel de control &gt; actualizador.

## Próxima actualización
La siguiente actualización está programada para la semana del 22 de abril.
