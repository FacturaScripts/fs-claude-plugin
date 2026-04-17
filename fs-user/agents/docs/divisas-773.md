---
id: 782
permalink: divisas-773
title: Divisas
creationdate: 25-01-2019 00:00:00
lastmod: 07-04-2026
url: https://facturascripts.com/divisas-773
---
Puede gestionar las divisas o monedas soportadas en FacturaScripts desde el **menú Administrador**, **Paises**. Después clic en la **pestaña Divisas**.

![listado de monedas](https://i.imgur.com/L4RW5AE.png)

## Añadir una divisa
Para añadir una moneda haga clic en el **botón nuevo** del listado de divisas. En la siguiente pantalla le solicitará código, dímbolo, descripción, etc:
- **Código**: abreviación ISO de tres caracteres. Por ejemplo USD.
- **Símbolo**: caracter de la moneda usado junto a los precios. Por ejemplo $.
- **Descripción**: nombre de la divisa. Por ejemplo Dolar EE.UU.
- **ISO**: código numérico ISO. Por ejemplo 840. [Wikipedia](https://es.wikipedia.org/wiki/ISO_4217)
- **Tasa de ventas**: tasa de conversión de la divisa a euros, es decir, una unidad de la divisa a cuantos euros equivale.
- **Tasa de compras**: tasa de conversión utilizada para compras. En algunos negocios se suele utilizar una tasa de conversión distinta para compras y ventas. En ambos casos es una tasa de conversión a euros.

![Añadir divisa](https://i.imgur.com/7kcmDqX.png)

## Divisa predeterminada
Puede seleccionar la divisa predeterminada desde el **menú Administrador**, **Panel de control**. En el campo **divisa** de la sección **por defecto**.

![divisa por defecto](https://i.imgur.com/TAD2Ezz.png)

### Precios de productos
Tenga en cuenta que los precios de los productos estarán en la divisa predeterminada. Si ha seleccionado euros, los precios de productos se entiende que están en euros.

## Configuración de decimales
Puede configurar el número de decimales a usar en FacturaScripts desde el menú Administrador, Panel de control, en la sección por defecto.

![decimales facturascripts](https://i.imgur.com/laLMMqp.png)

Tenga en cuenta que esta configuración se aplicará al mostrar números en los listados o al imprimir (excepto con [el plugin PlantillasPDF, que aplica su propia configuración](https://facturascripts.com/publicaciones/como-cambiar-los-decimales-de-cantidad) en facturas, albaranes...).

### Advertencia sobre decimales
No asigne más decimales que los que tiene su divisa o podría tener problemas de redondeo en los totales.
