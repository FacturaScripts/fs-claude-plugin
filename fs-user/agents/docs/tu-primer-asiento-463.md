---
id: 792
permalink: tu-primer-asiento-463
title: Cómo hacer un asiento contable
creationdate: 24-12-2018 00:00:00
lastmod: 22-07-2026
url: https://facturascripts.com/publicaciones/tu-primer-asiento-463
---
Puedes ver y crear asientos contables desde el menú Contabilidad → Asientos contables. Pulsa el botón `Nuevo` y, en la siguiente pantalla, selecciona la fecha y escribe el concepto. Para añadir líneas escribe la subcuenta que quieras o pulsa el botón para mostrar el listado de subcuentas y elegir una. No olvides guardar.

![Creación de un asiento contable paso a paso](https://i.imgur.com/Zrt8904.gif)

Dentro de esta sección encontrarás tres pestañas: Asientos contables, Conceptos predefinidos y Diarios. En [Conceptos predefinidos](https://facturascripts.com/publicaciones/los-conceptos-predefinidos) puedes guardar los textos que más usas (con comodines que se sustituyen automáticamente), y en [Diarios](https://facturascripts.com/publicaciones/los-diarios-contables) puedes agrupar los asientos según su origen.

## Crear tu primer asiento
Ve a la pestaña Asientos contables y pulsa el botón `Nuevo` (el `+` con fondo verde).

![Formulario para crear un nuevo asiento](https://i.imgur.com/vOMr4qP.png)

El campo `Fecha` viene relleno con la fecha actual; cámbialo si lo necesitas. A continuación escribe el `Concepto` del asiento (por ejemplo: factura..., traspaso..., etc.).

El siguiente paso es añadir las líneas. Sitúate en el campo `Subcuenta` y escribe el número. Puedes autocompletar los ceros con el punto: si escribes `700.0` se completa a `7000000000`. También puedes pulsar el icono del libro azul para buscar la subcuenta por nombre o por número.

![Selección de subcuenta desde el listado](https://i.imgur.com/twPylbd.png)

Si quieres importar un plan de cuentas, consulta la sección de documentación Configuración → Plan de cuentas.

Solo queda completar el `Debe` o el `Haber` y repetir con la siguiente línea, igual que con la primera. Verás que el sistema completa automáticamente el importe contrario a partir de la primera línea.

Puedes introducir los datos muy rápido usando solo el teclado: con la tecla TAB vas saltando de campo en campo.

Si hubiera algún **descuadre**, el sistema te avisa abajo a la derecha. Puedes corregir las líneas directamente o eliminarlas pulsando el icono de la papelera roja que hay a la derecha de cada una.

Cuando termines, guarda el asiento y, si te interesa, bloquéalo con el botón amarillo. Siempre podrás desbloquearlo cuando lo necesites.

Pulsando de nuevo el botón `+` verde de la parte superior puedes seguir introduciendo asientos, o volver al listado en la pestaña Todos.

## ⚠️ Asientos descuadrados
Si tienes asientos descuadrados, es decir, asientos cuyo debe no suma lo mismo que el haber, aparecerá una pestaña Descuadrados en el menú Contabilidad → Asientos contables.

## 🔢 Renumerar asientos
Con el tiempo, al eliminar asientos o al crearlos con fechas anteriores, la numeración puede quedar con huecos o desordenada. Para dejarla correlativa de nuevo ve al menú Contabilidad → Asientos contables y, en el listado, pulsa el botón `Renumerar`.

Se abre una ventana en la que solo tienes que elegir el ejercicio que quieres renumerar y confirmar. FacturaScripts recorre todos los asientos de ese ejercicio y les asigna el campo `numero` de forma correlativa empezando en `1`.

El orden que se aplica es:

- Primero por `fecha`, de la más antigua a la más reciente.
- Dentro de la misma fecha, los asientos de apertura (`operacion = &#39;A&#39;`) van antes que el resto.
- Como último criterio de desempate, el identificador interno del asiento.

Ten en cuenta que **solo se pueden renumerar los ejercicios abiertos**. Si el ejercicio está cerrado, el proceso no hace nada y te avisa de ello. La renumeración se realiza dentro de una transacción, así que si algo falla no se aplica ningún cambio.