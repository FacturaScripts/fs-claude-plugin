---
id: 113
permalink: novedades-en-facturascripts-2018-16
title: Novedades en FacturaScripts 2018.16
creationdate: 21-12-2019 19:32:22
lastmod: 29-12-2020
url: https://facturascripts.com/publicaciones/novedades-en-facturascripts-2018-16
---

Ya se encuentra disponible la **versión 2018.16** de FacturaScripts, la última versión de 2018. Con esta actualización hemos añadido un asistente para **cambiar la contraseña** del usuario, **si la hemos olvidado**. Hemos mejorado las **secuencias** y solucionado todos los errores detectados previamente.

## Novedades
- El instalador comprueba ahora que tengamos activada **la extensión de php file_info**, necesaria para FacturaScripts. Esta extensión solía estar activa en la inmensa mayoría de instalaciones de php, pero hemos detectado muchos hostings que no la están incluyendo por defecto.
- Si hemos olvidado la contraseña para entrar en FacturaScripts, podemos hacer clic en el enlace &quot;**he olvidado mi contraseña**&quot; que nos mostrará un asistente para cambiarla.
- Ahora podemos modificar qué campos son de **sólo lectura** desde las opciones.
- Los productos tienen ahora **fecha de creación**.
- Ahora podemos definir si queremos **rellenar los huecos** en las **secuencias** de documentos.
- Ahora se establece como 1 la candidad por defecto en nuevas líneas de documentos.

## Bugs solucionados
- Solucionado bug al crear facturas cuando hay huecos en la numeración.
- Solucionado bug al calcular los **saldos de las subcuentas** bajo ciertas condiciones.
- Solucionado bug con los nombres de los archivos al exportar a csv o excel en ciertos casos.
- Solucionados bugs con **PostgreSQL**.
- Ya no se permite eliminar un usuario, si este es el único que existe (*si, hay gente que lo hace*).

## Plugins de pago disponibles
- [CRM](https://facturascripts.com/plugins/crm): permite gestionar contactos, sus intereses, fuentes, listas, notas y oportunidades.
- [PlantillasPDF](https://facturascripts.com/plugins/plantillaspdf): permite editar los diseños de facturas, albaranes, etc.
- [PlazosPago](https://facturascripts.com/plugins/plazospago): permite añadir múltiples plazos a una forma de pago, para poder crear formas de pago como 50-50, 30-60-90, etc.
- [RemesasSEPA](https://facturascripts.com/plugins/remesassepa): añade gestión de Remesas bancarias en formatos SEPA CORE, COR1 y B2B.

## Actualizar desde FacturaScripts 2017
En la documentación tienes más información sobre [como migrar desde FacturaScripts 2017](https://facturascripts.com/doc/1/actualizar-desde-facturascripts-2017).
