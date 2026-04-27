---
id: 42
permalink: reunion-de-desarrollo-16-04-2019
title: Reunión de desarrollo 16-04-2019
creationdate: 16-04-2019 20:19:25
lastmod: 16-04-2019
url: https://facturascripts.com/publicaciones/reunion-de-desarrollo-16-04-2019
---

En esta reunión hemos detallado la forma en la que **personalizar la numeración** y **código** de facturas, albaranes, etc... en FacturaScripts 2018. Finalmente nos hemos decantado por un diseño similar a Odoo, pero adaptado a nuestro entorno.

## Problemática
En FacturaScripts 2017 se debía modificar la serie para indicar en qué número de factura empezar. Esto limita mucho ya que solamente sirve para facturas de venta y nada más. Para el código de facturas, albaranes, ect... disponíamos de varios algoritmos a elegir, pero ofreciendo un número de opciones muy limitado para la demanda que hay.

## Solución propuesta
Hemos optado por añadir un **nuevo modelo** para registrar estas personalizaciones. Un modelos donde podamos indicar **tipo de documento**, ejercicio, serie, **número inicial** y patrón. El patrón admitirá el uso de algunas variables como {EJE}, para sustituir por el ejercicio, {SERIE}, {NUM}, etc. De este modo podríamos:
- Indicar que las primera factura para 2019 sea la nº 87.
- Indicar que el primer pedido de 2019 en la serie A sea el nº 468.
- Indicar que el código de las facturas de venta será FAC{EJE}{SERIE}{0NUM}, lo cual lo transformaría en FAC2019A000087.
- Indicar que el código de los albaranes de venta para 2020 será {SERIE}{EJE}{0NUM}, que lo transformará en A2019000001.

Creemos que este sistema es lo suficiente versátil para cubrir las necesidades de la inmensa mayoría.

## Otros temas
También hemos estado comentando sobre el sistema de retenciones, las subcuentas por impuestos y las regularizaciones de stock, que hemos aparcado temporalmente.

## Tareas a completar esta semana
- [Añadir método redirect($url) a la clase Controller](https://facturascripts.com/EditTask?code=91).
- [Añadir la configuración inicial para México](https://facturascripts.com/EditTask?code=94).
- [Añadir los impuestos de Canarias (IGIC) a la lista de impuestos de España](https://facturascripts.com/EditTask?code=93).
- [Añadir el modelo SecuenciaDocumento para personalizar la numeración](https://facturascripts.com/EditTask?code=82).
- [Restaurar la configuración de subcuentas para los impuestos](https://facturascripts.com/EditTask?code=96).

## Actualización
Cuando estas tareas estén completas (previsiblemente el Lunes) se lanzará FacturaScripts 2018.019

## Próxima reunión
El equipo de desarrollo se reúne **todos los martes** a las **10:30** (hora española) en el canal de FacturaScripts en jitsi. Y **de nuevo a las 18:30** (hora española) para los que no han podido acudir a la primera reunión.
https://meet.jit.si/facturascripts

### Chat para programadores
También podéis comentar lo que queráis (sobre FacturaScripts) en nuestro [chat para programadores](https://join.slack.com/t/facturascripts/shared_invite/enQtMjk5OTA0NjA2MjQ0LTAxMDAyY2VjYTQ1YjNkNWFlNjMxNTM3NzcxYzE5N2M0YTMwNGIwY2I1ODlmN2RmNDkwNDNkZjZlZGNkNDYxYzE).
