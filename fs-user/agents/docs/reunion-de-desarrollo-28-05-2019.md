---
id: 69
permalink: reunion-de-desarrollo-28-05-2019
title: Reunión de desarrollo (28-05-2019)
creationdate: 29-05-2019 12:55:07
lastmod: 29-05-2019
url: https://facturascripts.com/publicaciones/reunion-de-desarrollo-28-05-2019
---

Hoy, tras el lanzamiento de [la versión 2018.03 de FacturaScripts](https://facturascripts.com/publicaciones/facturascripts-2018-03), hemos comentado las novedades a incluir en la siguiente actualización, la **2018.04**.

## FacturaScripts 2018.04
Esta es la siguiente actualización en la que ya estamos trabajando y que **llegará previsiblemente la semana que viene**. Las novedades serán:
- La exportación del **plan contable** se realizará en formato **CSV** en lugar de XML (no llegó a tiempo para la versión anterior).
- Eliminación de las columnas pagado de presupuestos, pedidos y albaranes. No se hará un control exhaustivo de pagos en estos documentos.
- Eliminación de las columnas irpf de clientes y proveedores, ya que ahora se vincula con retenciones.
- **Nuevos filtros** de retenciones, series y formas de pago en los listados de clientes y proveedores.
- Nuevo campo de identificador fiscal para la ficha de la empresa.
- Nuevo modelo **PagoCliente** para registrar pagos o adelantos de clientes. Se podrán apuntar pagos o anticipos en las etapas de presupuestos, pedidos y albaranes, pero sin un control exhaustivo.

## FacturaScripts 2018.05
También hemos hablado de desarrollar un **nuevo informe de facturas** para poder obtener el desglose de impuestos de las facturas (de compra o de venta) del periodo seleccionado. Imprescindible para que muchos clientes se lo puedan enviar a sus gestores. Este nuevo informe probáblemente no esté listo hasta la versión 2018.05, versión que se espera para **finales de Junio**.

## Tareas pendientes
Estas son las tareas pendientes de desarrollo. Si deseas encargarte de alguna de ellas, solicítalo en el chat para programadores.
- [Eliminar columnas irpf de clientes y proveedores (eliminar de los xml de las tablas)](https://facturascripts.com/EditTask?code=143).
- [Añadir claves ajenas de clientes y proveedores a retenciones, series y formas de pago](https://facturascripts.com/EditTask?code=144).
- [Añadir filtros: retenciones, serie y forma de pago a los listados de clientes y proveedores](https://facturascripts.com/EditTask?code=145).
- [Crear informe de impuestos para poder sacar el desglose de impuestos en facturas de compra o de venta](https://facturascripts.com/EditTask?code=146).
- [Eliminar columnas &quot;pagado&quot; de los xml de las tablas de albaranes, facturas, pedidos y presupuestos](https://facturascripts.com/EditTask?code=139).
- [Añadir columna tipoidfiscal (como en clientes y proveedores) a empresa](https://facturascripts.com/EditTask?code=155).

## Próxima reunión
El equipo de desarrollo se reúne **todos los martes** a las **10:30** (hora española) en el canal de FacturaScripts en jitsi. Y **de nuevo a las 18:30** (hora española) para los que no han podido acudir a la primera reunión.
https://meet.jit.si/facturascripts

### Chat para programadores
También podéis comentar lo que queráis (sobre FacturaScripts) en nuestro [chat para programadores](https://join.slack.com/t/facturascripts/shared_invite/enQtMjk5OTA0NjA2MjQ0LTAxMDAyY2VjYTQ1YjNkNWFlNjMxNTM3NzcxYzE5N2M0YTMwNGIwY2I1ODlmN2RmNDkwNDNkZjZlZGNkNDYxYzE).
