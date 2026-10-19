---
id: 2032
permalink: las-variantes-de-productos
title: Las variantes de productos
creationdate: 31-01-2025 19:52:04
lastmod: 03-09-2026
url: https://facturascripts.com/publicaciones/las-variantes-de-productos
---
Una variante en FacturaScripts es una diferenciación de un producto que permite gestionar diversas versiones o presentaciones del mismo. Por ejemplo, un producto puede tener **múltiples variantes** según características como **color** o **tamaño**. Cada variante puede tener su propio precio y stock, lo que facilita el control de inventario y la gestión de ventas. Esta funcionalidad es útil para empresas que desean manejar diferentes opciones de un mismo producto sin crear artículos completamente nuevos.

Por defecto todos los productos de FacturaScripts tienen al menos una variante. Puedes ver las variantes de un producto desde la sección de variantes, en el producto.

![ver variante](https://facturascripts.com/MyFiles/2025/01/2592.png?myft=cdb6020a8a4333315a6dee462d014ed90e8684a5)

Puedes añadir variantes simplemente haciendo clic en el botón añadir. Cada variante tendrá una referencia propia, de forma que al comprarla o venderla queda perfectamente identificada.

## 📑 Los campos de una variante

- **Referencia:** el código único de la variante. Es lo que escribes al añadir la línea en un presupuesto, pedido, albarán o factura.
- **Código de barras:** el código de barras de esa variante concreta. Es el campo que usan los lectores y los TPV para localizar el producto, así que si trabajas con lector conviene rellenarlo en cada variante, no solo en una.
- **Atributos:** hasta **4 atributos** por variante (por ejemplo talla, color, medida y peso). Ese es el límite: no se pueden combinar más de cuatro características en una misma variante. Ver [cómo crear atributos](https://facturascripts.com/publicaciones/tu-primer-atributo-515).
- **Precio**, **Coste** y **Margen:** ver [los precios de los productos](https://facturascripts.com/publicaciones/los-precios-del-producto).
- **Stock:** las unidades de esa variante, ver [el stock del producto](https://facturascripts.com/publicaciones/el-stock-de-productos).

## Stocks y precios
Tanto los stocks como los precios se gestionan por variante. Así cada variante del producto tiene su propio stock, es decir, sabe exactamente qué cantidad tiene en el almacén. Y puede tener su propio precio.

![Stock variantes](https://i.imgur.com/5rg1t9V.png)
Ejemplo de stock de diferentes variantes.

![Precio variantes](https://i.imgur.com/CiO7ifY.png)
Ejemplo de diferentes precios en las variantes.

## 🖼️ Una imagen por variante

Las [imágenes del producto](https://facturascripts.com/publicaciones/las-imagenes-de-los-productos) se pueden asignar a una variante concreta, así la camiseta roja muestra su foto y la azul la suya. Es la razón principal para usar variantes en lugar de crear un producto distinto por cada color.

## ⚠️ Antes de eliminar una variante

Una variante que ya se haya comprado o vendido está referenciada en las líneas de esos documentos. Si dejas de usar una combinación, es mejor dejarla con stock 0 que borrarla, para no perder la trazabilidad de los documentos antiguos.

## Ver también

- [Cómo crear un producto o variante](https://facturascripts.com/publicaciones/tu-primer-producto-431)
- [Los precios de los productos](https://facturascripts.com/publicaciones/los-precios-del-producto)
- [El stock del producto](https://facturascripts.com/publicaciones/el-stock-de-productos)
- [Las imágenes de los productos](https://facturascripts.com/publicaciones/las-imagenes-de-los-productos)
- [Cómo crear atributos: tallas y colores](https://facturascripts.com/publicaciones/tu-primer-atributo-515)