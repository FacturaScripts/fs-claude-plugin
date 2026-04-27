---
id: 66
permalink: reunion-de-desarrollo-21-05-2019
title: Reunión de desarrollo (21-05-2019)
creationdate: 21-05-2019 19:12:44
lastmod: 21-05-2019
url: https://facturascripts.com/publicaciones/reunion-de-desarrollo-21-05-2019
---

En esta reunión hemos comentado tanto las novedades para la actualización de esta semana como las novedades de la siguiente actualización.

## FacturaScripts 2018.03
- Nuevo modelo identificador fiscal (admin &gt; id. fiscal) para que el usuario pueda añadir y quitar.
- Ahora se puede seleccionar el identificar fiscal predeterminado en las preferencias.
- Añadidos nuevos identificadores fiscales: NIE, CUIT, CUIL, RUC, RUT...
- Añadidas las columnas riesgo máximo y riesgo actual al cliente. Todavía sin uso.
- Ya no se puede eliminar el almacén por defecto, ni la empresa, ni el país, ni la forma de pago, ni la divisa por defecto.

### Todavía en desarrollo
- [La exportación del plan contable se realizará en formato CSV en lugar de XML](https://facturascripts.com/EditTask?code=135).
- [Quedará registrado todo email enviado para poder consultarlo desde un historial](https://facturascripts.com/EditTask?code=136).
- [El agrupador de documentos impedirá agrupar documentos de distinto cliente/proveedor o divisa](https://facturascripts.com/EditTask?code=123).

### Tareas sin asignar
- [Añadir configuración estándar para República Dominicana](https://facturascripts.com/EditTask?code=103).
- [Añadir configuración estándar para Ecuador](https://facturascripts.com/EditTask?code=104).
- [Añadir configuración estándar para Panamá](https://facturascripts.com/EditTask?code=105).

## FacturaScripts 2018.04
- Eliminadas las columnas pagado de presupuestos, pedidos y albaranes. No se hará un control exahustivo de pagos en estos documentos.
- Nuevo modelo PagoCliente para registrar pagos o adelantos de clientes. Se podrán apuntar pagos o anticipos en las etapas de presupuestos, pedidos y albaranes, pero sin un control exahustivo.
- La generación automática de asientos de facturas usará las cuentas contables especificadas en los impuestos.

## Provincias
El modelo provincias permanece sin uso. Se ha planteado comenzar a utilizarlo para autocompletar el campo provincias en las direcciones, pero como una tarea secundaria, cuando se complete la gestión de pagos.

## Curso de programación
Ya está disponible el [curso básico de programación sobre FacturaScripts 2018](https://facturascripts.com/cursos/curso-basico-de-programacion-version-2018).

## Próxima reunión
El equipo de desarrollo se reúne **todos los martes** a las **10:30** (hora española) en el canal de FacturaScripts en jitsi. Y **de nuevo a las 18:30** (hora española) para los que no han podido acudir a la primera reunión.
https://meet.jit.si/facturascripts

### Chat para programadores
También podéis comentar lo que queráis (sobre FacturaScripts) en nuestro [chat para programadores](https://join.slack.com/t/facturascripts/shared_invite/enQtMjk5OTA0NjA2MjQ0LTAxMDAyY2VjYTQ1YjNkNWFlNjMxNTM3NzcxYzE5N2M0YTMwNGIwY2I1ODlmN2RmNDkwNDNkZjZlZGNkNDYxYzE).
