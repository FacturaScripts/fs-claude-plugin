---
id: 798
permalink: tu-primer-atributo-515
title: Cómo crear atributos: tallas y colores
creationdate: 09-01-2019 00:00:00
lastmod: 09-04-2026
url: https://facturascripts.com/tu-primer-atributo-515
---
Puede gestionar los atributos desde el **menú Almacén → Atributos**.

## 📝 Crear un atributo
Para crear un atributo, acceda al **menú Almacén → Atributos** y haga clic en el **botón nuevo**.

![nuevo atributo](https://imgur.com/k2b6uzL.gif)

Se abrirá un formulario para crear un nuevo atributo con los siguientes campos:

- **Código:** (opcional) un código único para el atributo. No debe repetirse. Ejemplo: `talla`.
- **Nombre:** el nombre del atributo. Por ejemplo: `Talla`.
- **Selector:** Indica en cuál de los 4 atributos disponibles en la ficha del producto se mostrarán estos valores. Por ejemplo, en el atributo 1 se pueden mostrar los colores y en el atributo 2 las tallas. Si este campo no se rellena, todos los valores aparecerán en todos los atributos.

Para finalizar, haga clic en el **botón guardar**, ubicado en la parte inferior derecha.

### 📑 Asignar valores a un atributo
Para añadir valores al atributo, haga clic en el **botón añadir** situado en la parte inferior del formulario. Esto desplegará el formulario para añadir valores.

Los campos del formulario son:

- **Valor:** el valor del atributo. Por ejemplo, `M`, para la talla M.
- **Orden:** un número para ordenar los valores. Por defecto, se ordenan alfabéticamente. Si desea que por ejemplo la talla `S` aparezca antes que la `M`, debe asignar un número menor a la talla `S`, como por ejemplo 99.

En esta imagen puede observar el orden asignado:

![orden valores atributo](https://imgur.com/0xkp5pc.gif)

### 📦 Usar atributos en productos o variantes
Si desea crear una variante para el producto `Camiseta1`, simplemente deberá pulsar sobre el **botón nuevo** y proceder a crearla (ver imagen siguiente). En esta variante, hemos asignado el atributo `Tallas` en el selector 1 y el atributo `Colores` en el selector 2. En la ficha del producto, los valores de cada atributo solo aparecerán en los selectores correspondientes. En cambio, en el atributo 3 se mostrarán los valores de medidas y pesos, ya que no tienen un selector vinculado.

![variante con talla](https://imgur.com/Ni75V8O.gif)

Como se observa en la imagen anterior, hemos hecho clic en el botón de nueva variante y hemos completado tanto los atributos como el campo **Precio**. Este campo es el que usará FacturaScripts cuando utilice una referencia (como la de esta variante) para crear su albarán, presupuesto, pedido o factura.

![variante con color](https://imgur.com/8kXPkMg.gif)
