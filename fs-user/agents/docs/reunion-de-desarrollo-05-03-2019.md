---
id: 28
permalink: reunion-de-desarrollo-05-03-2019
title: Reunión de desarrollo 05-03-2019
creationdate: 05-03-2019 20:08:47
lastmod: 05-03-2019
url: https://facturascripts.com/publicaciones/reunion-de-desarrollo-05-03-2019
---

Hoy hemos tratado algunos problemas encontrados en la gestión **multi-empresa** de las **formas de pago**. El diseño no estaba lo suficientemente depurado y hemos decidido corregirlo. Hasta la RC teníamos un diseño de 3 tablas: formaspago, formaspagoempresa y cuentasbanco. Para la versión final lo hemos reducido a 2: formaspago y cuentasbanco.

## formaspago
El modelo FormaPago ahora se vincula con empresa, es decir, cada empresa tiene sus formas de pago. Hemos añadido el idempresa al modelo y la tabla, además de añadir el listado de formas de pago a la ficha de la propia empresa.

FormaPago también se vincula directamente con CuentaBanco, como lo teníamos en la versión 2017. Así podemos vincular una forma de pago con una cuenta bancaria y generar los asientos de pago en la subcuenta vinculada.

## cuentasbanco
El modelo CuentaBanco ahora incluye un código de subcuenta (codsubcuenta), con lo que podemos vincular una cuenta bancaria con una subcuenta.

## API
Ya completamos la **revisión** y la corrección de [los errores detectados previamente en la API](https://facturascripts.com/publicaciones/reunion-de-desarrollo-26-02-2019). Además hemos mejorado el soporte de filtros, pudiendo ahora filtrar con operadores =, &gt;, &lt;, &gt;=, &lt;=, != y like. Todos los cambios han sido añadidos a [la documentación de la API](https://facturascripts.com/doc/1/desarrollo-sobre-facturascripts-2018/la-api-rest-de-facturascripts/obtener-un-listado-de-elementos-de-un-recurso).

## Todo listo para la versión final
El trabajo con las formas de pago ya se ha completado y seguimos con las pruebas para publicar la versión final este mismo mes ;-)

## Próxima reunión
El equipo de desarrollo se reúne **todos los martes** a las **10:30** (hora española) en el canal de FacturaScripts en jitsi. Y **de nuevo a las 18:30** (hora española) para los que no han podido acudir a la primera reunión.
https://meet.jit.si/facturascripts

### Chat para programadores
También podéis comentar lo que queráis (sobre FacturaScripts) en nuestro [chat para programadores](https://join.slack.com/t/facturascripts/shared_invite/enQtMjk5OTA0NjA2MjQ0LTAxMDAyY2VjYTQ1YjNkNWFlNjMxNTM3NzcxYzE5N2M0YTMwNGIwY2I1ODlmN2RmNDkwNDNkZjZlZGNkNDYxYzE).
