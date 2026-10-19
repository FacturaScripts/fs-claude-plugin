---
id: 4510
permalink: las-imagenes-de-los-productos
title: Las imágenes de los productos
creationdate: 03-09-2026 19:02:03
lastmod: 16-09-2026
url: https://facturascripts.com/publicaciones/las-imagenes-de-los-productos
---
Cada producto puede tener varias imágenes. Se gestionan desde la ficha del producto, en el **menú Almacén → Productos**, pestaña **Imágenes**.

Las imágenes no salen en los PDF de facturas ni albaranes: sirven para identificar el producto dentro del programa y, sobre todo, para las tiendas online y los TPV que se conectan a FacturaScripts.

![Producto con imagenes](https://i.imgur.com/pgfTm9t.png)

## ➕ Añadir imágenes

En la pestaña **Imágenes** pulsa el botón **Añadir**, elige el archivo y guarda. Los formatos admitidos son **gif, jpg y png**.

El tamaño máximo del archivo lo marca la configuración de PHP de tu servidor, normalmente 2MB. Si necesitas subir imágenes más grandes, mira [cómo aumentar el límite de subida de archivos](https://facturascripts.com/publicaciones/aumentar-el-limite-de-subida-de-archivos).

Puedes subir tantas imágenes como quieras por producto.

![Formulario para añadir imagenes](https://i.imgur.com/gVMPd4i.png)

## 🏷️ Imágenes por variante

Al añadir una imagen puedes elegir a qué **variante** corresponde, o dejar **Todas las variantes**.

- Si eliges **Todas las variantes**, la imagen representa al producto en general.
- Si eliges una variante concreta, la imagen se asocia solo a ella. Es lo que te permite tener una foto por color: la camiseta roja con su imagen y la azul con la suya, dentro del mismo producto.

Esta es la razón práctica de trabajar con [variantes](https://facturascripts.com/publicaciones/las-variantes-de-productos) en lugar de crear un producto por color.

![Imagenes por variante](https://i.imgur.com/GtGCUgF.png)

## ↕️ Ordenar las imágenes

Las imágenes se pueden **arrastrar** para cambiar su orden. El orden importa porque la primera imagen es la que suele usarse como imagen principal del producto en las tiendas online.

## 🗑️ Eliminar una imagen

Cada imagen tiene su botón de eliminar y pide confirmación. Al borrarla se eliminan también las miniaturas que el programa haya generado de ella.

## 🖼️ Miniaturas

FacturaScripts genera automáticamente miniaturas de cada imagen en la carpeta `MyFiles/Tmp/Thumbnails`, para no tener que cargar la imagen completa cada vez que se muestra un listado.

Es una carpeta temporal: se puede borrar sin miedo, porque las miniaturas se vuelven a generar solas a partir de las imágenes originales. Las imágenes de verdad se guardan en la [biblioteca de archivos](https://facturascripts.com/publicaciones/la-biblioteca-de-archivos), junto con el resto de adjuntos.

## Ver también

- [Cómo crear un producto o variante](https://facturascripts.com/publicaciones/tu-primer-producto-431)
- [Las variantes de productos](https://facturascripts.com/publicaciones/las-variantes-de-productos)
- [La biblioteca de archivos](https://facturascripts.com/publicaciones/la-biblioteca-de-archivos)