---
idproject: 647
name: EasyFields
permalink: easyfields
creationdate: 23-06-2026
lastmod: 28-06-2026
version: 1
betaversion: 
mincore: 2025
maxcore: 2026.4
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/EasyFields
---
# EasyFields — Campos personalizados para FacturaScripts

**Añade campos propios a cualquier ficha de FacturaScripts —Cliente, Producto, Factura…— sin programar, organizados en pestañas.** 
Lo que el core no guarda de serie (una talla, un color, una fecha de garantía, una foto, un enlace a otro registro), lo defines tú en minutos y queda integrado en la ficha como si viniera de fábrica.

## Qué resuelve

Cada negocio necesita guardar datos que FacturaScripts no trae: el cumpleaños del cliente, cliente referidor, el número de bastidor, la temporada de una prenda, el peso de producto, talla de calzado del cliente, coste del envío de un proveedor, pedido mínimo de proveedor, notas de un pedido, …
Hasta ahora eso obligaba a tocar código o a apañarlo en el campo de “observaciones”. EasyFields te deja **crear esos campos desde la propia interfaz**, con su tipo, sus reglas y su pestaña, y **sin modificar el esquema del core**: la desinstalación es limpia y el plugin resiste las actualizaciones de FacturaScripts.

## Para quién es

Cualquier empresa que necesite **adaptar las fichas de FacturaScripts a su realidad** sin depender de un programador: tiendas, distribuidoras, talleres, servicios… Si alguna vez pensaste “ojalá pudiera anotar aquí este dato”, esto es para ti.

## Cómo funciona

Defines un **campo** sobre un **target** (el modelo del core: `Cliente`, `Producto`, `FacturaCliente`…), le das un **grupo** —y cada grupo distinto se convierte en una **pestaña** dentro de la ficha— y listo: el campo aparece para rellenarse. Los valores se guardan en tablas propias del plugin con **almacenamiento EAV tipado** (cada dato en su columna según el tipo), de modo que se pueden **filtrar y ordenar** de verdad, no como texto suelto.

## Tipos de campo

10 tipos para cubrir casi cualquier dato:

| Tipo | Para qué |
|---|---|
| **Texto** / **Texto largo** | Notas, códigos, descripciones. |
| **Número** | Cantidades, medidas, importes. |
| **Fecha** | Vencimientos, cumpleaños, garantías. |
| **Sí/No** (booleano) | Marcas y opciones binarias. |
| **Selección** / **Selección múltiple** | Elegir una o varias opciones de una lista. |
| **Relación** | Enlazar con otro registro del core (p. ej. un proveedor desde un producto). |
| **Fichero** / **Foto** | Adjuntar documentos o imágenes al registro. |

## Funciones principales

- **Pestañas automáticas:** cada grupo de campos es una pestaña en la ficha; los campos sin grupo van a la pestaña “Campos personalizados”, que siempre queda al final.
- **Reglas de validación por campo:** obligatorio, longitud mínima/máxima, valor mínimo/máximo, fecha mínima/máxima, nº máximo de ficheros… El dato se valida al guardar.
- **Catálogos reutilizables:** listas de opciones para los campos de selección, definidas una vez y reutilizadas en todos los campos que quieras.
- **Campos de relación:** apuntan a otro modelo del core, con selector y descripción del registro enlazado.
- **En los listados:** muestra un campo personalizado como **columna** y **filtra el listado** por su valor, con el filtro adecuado según el tipo.
- **Borrado en cascada:** al eliminar un registro (o un campo), sus valores se eliminan también; sin datos huérfanos.
- **Administración clara:** tres pestañas para gestionar **Campos**, **Catálogos** y **Valores**.
- **Idiomas:** español e inglés.

## Diseñado para ser fiable

- **No modifica el esquema del core.** Todo vive en las tablas del plugin (`easyfields_*`), con almacenamiento **EAV tipado**: desinstalación limpia y robustez ante actualizaciones.
- **Datos tipados, no un cajón de texto:** cada valor en su columna (texto, número, fecha, booleano, fichero), lo que permite filtrar, ordenar y validar correctamente.
- **Integración nativa:** los campos aparecen en la ficha y en los listados como cualquier otro campo de FacturaScripts, sin plantillas ni parches.

## Requisitos

- FacturaScripts **2025+** (verificado contra 2026.x).
- **PHP 8.1** o superior.