---
id: 1617
permalink: como-hacer-una-factura-intracomunitaria
title: Cómo Crear una Factura Intracomunitaria
creationdate: 30-11-2023 13:23:32
lastmod: 04-11-2026
url: https://facturascripts.com/publicaciones/como-hacer-una-factura-intracomunitaria
---
Una **factura intracomunitaria** es la que emites a una empresa o profesional de otro país de la Unión Europea con NIF-IVA válido. La entrega de bienes está **exenta de IVA en España** (art. 25 LIVA): no cobras IVA y es el cliente quien lo liquida en su país. Las prestaciones de servicios a empresarios de la UE **no están sujetas** al IVA español por las reglas de localización (arts. 69–70 LIVA): el servicio tributa en el país del cliente.

## Requisitos para Emitir una Factura Intracomunitaria

Para emitir una factura intracomunitaria, se deben cumplir los siguientes requisitos:
- **Empresa:** Debe tener un NIF o CIF registrado en el sistema VIES.
- **Cliente:** Debe poseer un identificador fiscal registrado en el sistema VIES.

El VIES (VAT Information Exchange System) es un sistema de intercambio de información sobre el IVA entre los Estados miembros de la Unión Europea. Este sistema permite a las empresas y particulares comprobar la validez de un NIF intracomunitario y verificar si el titular del mismo está registrado.

FacturaScripts no bloquea la operación si el VIES falla, así que compruébalo antes de emitir la factura.

## Comprobar el VIES de tu Empresa y del Cliente

1. Tanto si eres autónomo como una empresa, desde el menú **Administrador → Empresas**, haz clic en tu empresa o en tus datos como autónomo.
2. En la siguiente página, encontrarás el botón **Comprobar VIES**. Al pulsarlo, se te indicará si estás registrado en el sistema.

   ![Comprobar VIES Empresa](https://i.imgur.com/oYwpA5D.png)

La ficha del cliente (menú **Ventas → Clientes**) tiene el mismo botón **Comprobar VIES** para verificar su NIF-IVA.

También puedes verificarlo utilizando la [herramienta online para validar NIF, CIF, VAT o VIES](https://factura.city/validar-vat) de factura.city.

## Configurar el Cliente (recomendado)

Lo más cómodo es dejar la operación configurada en la ficha del cliente. Así se copia a todas las facturas nuevas y no tienes que acordarte de seleccionarla cada vez. Ve a **Ventas → Clientes**, abre el cliente y elige la **Operación** y la **Excepción de IVA** que le corresponden:

- Si le vendes **bienes**: **Operación: Intracomunitaria** y **Excepción de IVA: España: Exenta – Art. 25 LIVA (entrega intracomunitaria de bienes)**.
- Si le prestas **servicios**: **Operación: Intracomunitaria de servicios** y **Excepción de IVA: España: No sujeta – Arts. 68–70 LIVA (reglas de localización)**.

La operación y la excepción van siempre juntas: si dejas la excepción vacía o eliges otra, la ficha no se guarda y aparece el aviso «La combinación de operación y excepción de IVA no es válida». Pulsa **Guardar**. A partir de ahora, las nuevas facturas, albaranes, pedidos y presupuestos de este cliente tendrán la operación seleccionada. Los documentos que ya existían no cambian.

## Crear una Nueva Factura

1. Desde el menú **Ventas &gt; Facturas**, pulsa el **botón Nuevo** para crear una nueva factura.

   ![Nueva Factura](https://i.imgur.com/YnHRhfn.png)

2. Selecciona al cliente de la lista o pulsa el botón para crear un nuevo cliente.

   ![Asignar Cliente](https://facturascripts.com/MyFiles/2023/11/1806.png?myft=6ec9aac5c06054de6e3ced912a1199bad3d6219b)

### Seleccionar el Tipo de Operación

1. Haz clic en el **botón Detalles**. Se abrirá una ventana con más detalles de la factura.
2. Comprueba que el campo **Operación** indica **Intracomunitaria** (bienes) o **Intracomunitaria de servicios** (servicios). Si no configuraste el cliente, selecciónala aquí.

   ![Detalles Factura](https://i.imgur.com/yAz8dnW.png)

### Añadir Productos o Servicios

Para agregar productos a la factura:
- Escribe la referencia en el campo correspondiente, o
- Pulsa el botón del catálogo de productos para acceder a la lista completa, o
- Presiona el botón de **Línea** para añadir una línea simple a la factura.

   ![Añadir Líneas Factura Intracomunitaria](https://facturascripts.com/MyFiles/2023/11/1807.png?myft=f9436ab47ae383dcf17cc6caf30587d4288c1d61)

### Qué hace FacturaScripts automáticamente

- Con la operación **Intracomunitaria**, pone cada línea con el impuesto **IVA 0%**, elimina el recargo de equivalencia y marca la excepción **España: Exenta – Art. 25 LIVA (entrega intracomunitaria de bienes)**.
- Con la operación **Intracomunitaria de servicios**, pone cada línea con el impuesto **IVA 0%**, elimina el recargo de equivalencia y marca la excepción **España: No sujeta – Arts. 68–70 LIVA (reglas de localización)**.
- El texto de la excepción se imprime al pie del PDF, en el apartado «Excepciones de impuestos», como mención de la exención o de la no sujeción.
- Las retenciones de IRPF, si las hay, se calculan con normalidad.

Este tratamiento automático solo se aplica cuando el país de la empresa es España.

### Guardar la Factura

Para finalizar, pulsa el **botón Guardar**.

## Ver también

- [Cómo hacer una factura de venta](https://facturascripts.com/publicaciones/como-hacer-una-factura-de-venta)
- [Cómo registrar una compra intracomunitaria](https://facturascripts.com/publicaciones/como-registrar-una-compra-intracomunitaria)
- [Régimen IVA](https://facturascripts.com/publicaciones/regimen-iva-369)