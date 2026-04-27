---
id: 133
permalink: novedades-en-facturascripts-2020-61
title: Novedades en FacturaScripts 2020.61
creationdate: 19-06-2020 11:33:53
lastmod: 29-12-2020
url: https://facturascripts.com/publicaciones/novedades-en-facturascripts-2020-61
---

En esta actualización se ha mejorado el aspecto general de todos los listados y formularios, además de añadir nuevas características muy demandadas.

## Novedades
- Los **listados** ahora muestran los **totales por página** de todas las **columnas de tipo moneda**.
- Se ha mejorado el asistente de personalización de listados y formularios (el botón opciones) para que sea más intuitivo. Además ahora se pueden **personalizar los títulos de las columnas** y el número de decimales a utilizar (en las columnas de números, moneda o porcentajes).
- Se ha mejorado la **validación de IBAN** añadiendo soporte para todos los tipos internacionales de IBAN, no solamente el español.
- En la configuración de emails ahora podemos indicar una o varias direcciones de email a las que **enviar copia de todos los emails enviados**.
- El asistente para enviar emails ahora permite que los plugins puedan añadir más **bandejas de salida**. El plugin MultiEmails será el primero en usar esta característica.
- **Nuevos filtros**: facturas sin asiento, documentos con recargo, retención o suplidos.
- El **agrupador de documentos** ahora nos permite añadir el resto de documentos del cliente/proveedor. También podemos indicar si queremos añadir o no las líneas adicionales indicando el documento de origen.
- Ahora podemos definir **márgenes sobre precio de coste** en las variantes, que si combinamos con **una política de precio de coste**, conseguimos que los precios de venta se recalculen automáticamente con cada compra.

## Correcciones
- Al crear la subcuenta de un accreedor ahora se usa la cuenta correcta.
- Solucionado bug al guardar la nueva subcuenta creada para el cliente.
- Solucionado bug al generar los asientos contables de facturas cuando la subcuenta del banco no existe.
- Solucionado bug con bucles en familias.

## Mejoras para desarrolladores
- Ya se puede desactivar el evento clicable en los listview.
- Los business documents ahora permiten rows action.
- Los widget autocomplete ahora permiten indicar una columna que actue como filtro para los resultados.
- Añadido soporte para enlaces de pago en los recibos.

## Fin de soporte PHP 7.0
A partir de la siguiente actualización retiraremos el soporte a PHP 7.0 y **la versión mínima será PHP 7.1 o superior**. Además esperamos dar el salto a PHP 7.2 antes de final de año, pero queremos dar tiempo a los clientes a actualizar.

### ¿Por qué estos cambios?
PHP está evolucionando rápidamente y cada versión nueva mejora el rendimiento y añade nuevas carcaterísticas interesantes para los desarrolladores. Nos hace la vida más fácil. Por este motivo todos los proyectos van saltando a versiones más modernas cada poco tiempo. Además de que el propio desarrollo de PHP incita a moverse a versiones más modernas. [Aquí puedes ver el calendario de soporte de versiones de PHP](https://www.php.net/supported-versions.php).

Con el cambio a PHP 7.1 podremos actualizar nuestros componentes symfony a la versión 4.4.
