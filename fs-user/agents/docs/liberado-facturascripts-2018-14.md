---
id: 105
permalink: liberado-facturascripts-2018-14
title: Liberado FacturaScripts 2018.14
creationdate: 01-11-2019 21:06:02
lastmod: 29-12-2020
url: https://facturascripts.com/publicaciones/liberado-facturascripts-2018-14
---

Ya está disponible la versión 2018.14 de FacturaScripts. Esta actualización sustituye el antiguo informe de documentos por nuevos informes editables. Permite crear impuestos de tipo fijo y mejora varias interfaces.

## Novedades
- El antiguo informe de documentos ha sido sustituido por **informes editables**: ahora podemos crear informes sobre las tablas y columnas que queramos.
- Se ha añadido la posibilidad de crear **impuestos de tipo fijo**. Ahora al crear un nuevo impuesto podemos elegir entre tipo porcentaje o valor fijo.
- Ahora podemos añadir o quitar clientes en un **grupo** de forma mucho más directa. Lo mismo con productos en **familias y fabricantes**.
- Desde clientes o proveedores ahora podemos editar sus **direcciones y contactos** sin cambiar de pantalla.

## Programación
- En esta actualización se ha eliminado **código obsoleto** para llamar al gestor de eventos, al traductor o al log. [Todo ello ha sido sustituido por el método toolBox() presente en modelos y controladores](https://facturascripts.com/publicaciones/funciones-obsoletas-a-eliminar-en-facturascripts-2018-14).
- Ahora se pueden añadir filtros a las pestañas ListView en los EditController, [como en este ejemplo](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Controller/EditGrupoClientes.php#L121).
- Se han añadido las constantes DATE_STYLE, DATETIME_STYLE y HOUR_STYLE a los modelos.

## Plugins de pago disponibles
- [CRM](https://facturascripts.com/plugins/crm): permite gestionar contactos, sus intereses, fuentes, listas, notas y oportunidades.
- [PlantillasPDF](https://facturascripts.com/plugins/plantillaspdf): permite editar los diseños de facturas, albaranes, etc.
- [PlazosPago](https://facturascripts.com/plugins/plazospago): permite añadir múltiples plazos a una forma de pago, para poder crear formas de pago como 50-50, 30-60-90, etc.

## Actualizar desde FacturaScripts 2017
En la documentación tienes más información sobre [como migrar desde FacturaScripts 2017](https://facturascripts.com/doc/1/actualizar-desde-facturascripts-2017).
