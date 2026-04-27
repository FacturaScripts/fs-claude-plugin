---
id: 23
permalink: real-candidate-de-facturascripts-2018-ya-disponible
title: Real Candidate de FacturaScripts 2018 ya disponible
creationdate: 09-02-2019 12:10:13
lastmod: 09-02-2019
url: https://facturascripts.com/publicaciones/real-candidate-de-facturascripts-2018-ya-disponible
---

Hemos publicado la versión que consideramos **Real Candidate** de FacturaScripts 2018, es decir, la versión que consideramos ya estable para empezar a trabajar. Y la lista de cambios desde la última beta es esta:
- Ahora se pueden **convertir contactos** en clientes con presionar un botón.
- Solucionado bug al guardar valores de filtros de periodo.
- Se ha mejorado la creación automática de ejercicios para intentar usar el año como código siempre que sea posible.
- Actualizadas las traducciones.

## Correcciones al editar facturas, albaranes, etc...
- Se han solucionado los bugs que permitían cambiar cliente, almacén, serie, fecha, etc... en documentos ya aprobados.
- Se ha añadido el estado completado a las facturas, para que no sean editables.
- Las nuevas facturas ahora establecen su **fecha de vencimiento** en base a la configuración de la forma de pago.
- Solucionado bug al buscar artículos con mayúsculas.
- Solucionado bug al recargar los datos de un artículo cuando se selecciona otro artículo al hacer un presupuesto, pedido, etc...
- Añadido soporte para **facturas rectificativas**.
- Ya se pueden ver y editar las **observaciones** desde la pestaña principal de presupuestos, pedidos, etc...
- Solucionado bug que se producía bajo ciertas condiciones al mostrar la rejilla de excel de las líneas de presupuestos, pedidos, etc...
- Revisada todo el proceso de **generación de asientos** de facturas para operar correctamente.

## Mejoras de programación
- Se puede especificar el parámetro rows de los [widgets textarea](https://facturascripts.com/doc/1/desarrollo-sobre-facturascripts-2018/creacion-de-plugins/las-vistas-xml-xmlview/columns/widget/widget-textarea) desde el xmlview.
- La generación de números y códigos para facturas, albaranes, etc, se realiza ahora en la clase [Lib/BusinessDocumentCode](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Lib/BusinessDocumentCode.php) para poder personalizarla vía plugins.
- Reducida la complejidad del modelo BusinessDocument y añadido una nueva clase [ModelOnChangeClass](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Model/Base/ModelOnChangeClass.php) para poder tratar modelos sobre los que queremos realizar ciertas acciones cuando hay cambios en sus propiedades.
- [Más de 200 iconos nuevos disponibles](https://fontawesome.com/changelog/latest). 1 500 en total.

## Preguntas frecuentes
### ¿Cuando saldrá la versión final?
Cuando solucionemos los problemas más graves que detectemos en esta versión.

### ¿Cómo puedo probar esta nueva versión?
La forma más fácil es [crear una nueva instalación de pruebas](https://facturascripts.com/CloudManager), seleccionado la versión 2018. También puedes descargar esta nueva versión desde la sección descargas.

### ¿Cómo puedo actualizar desde la versión 2017?
Con el plugin de migración, pero todavía está en desarrollo.

### ¿Funcionan los plugins de 2017 en esta nueva versión?
No, no funcionan. Ha sido un rediseño completo. Lanzaremos actualizaciones de los principales plugins. Si no tienes caducados los plugins de 2017, podrás actualizar (cuando lancemos las actualizaciones).

### ¿Cómo puedo migrar mis plugins de 2017?
Puedes empezar revisando la [documentación sobre migración de plugins de 2017](https://facturascripts.com/doc/1/migracion-de-plugins-de-facturascripts-2015-2017).
