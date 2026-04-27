---
id: 27
permalink: reunion-de-desarrollo-26-02-2019
title: Reunión de desarrollo 26-02-2019
creationdate: 26-02-2019 11:47:46
lastmod: 26-02-2019
url: https://facturascripts.com/publicaciones/reunion-de-desarrollo-26-02-2019
---

En esta reunión hemos comentado la buena acogida de la Real Candidate de FacturaScripts 2018, que lanzamos a principio de mes. Apenas hay dos bugs abiertos de baja incidencia, así que pronto tendremos la versión final.

## Trabajo pendiente
Las correcciones o mejoras pendientes para la versión final son:
- Corregir el modelo partida para que en su función onChange(), si se cambia codsubcuenta, se recalcule el idsubcuenta.
- Impedir tener dos ejercicios en la misma empresa en el mismo periodo.
- Solucionar bug que permite crear nuevas facturas con un almacén que no se corresponde con la empresa.
- Solucionar bug que al crear una nueva variante se modifica la referencia del artículo.
- Al crear nuevas facturas y buscar por referencia, que muestre también los atributos de la variante.
- Comprobar el bug que permite desde la API insertar nuevo registros sin comprobar si estos existen previamente.

## Próxima reunión
El equipo de desarrollo se reúne **todos los martes** a las **10:30** (hora española) en el canal de FacturaScripts en jitsi. Y **de nuevo a las 18:30** (hora española) para los que no han podido acudir a la primera reunión.
https://meet.jit.si/facturascripts

### Chat para programadores
También podéis comentar lo que queráis (sobre FacturaScripts) en nuestro [chat para programadores](https://join.slack.com/t/facturascripts/shared_invite/enQtMjk5OTA0NjA2MjQ0LTAxMDAyY2VjYTQ1YjNkNWFlNjMxNTM3NzcxYzE5N2M0YTMwNGIwY2I1ODlmN2RmNDkwNDNkZjZlZGNkNDYxYzE).
