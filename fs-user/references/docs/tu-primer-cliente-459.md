---
id: 794
permalink: tu-primer-cliente-459
title: Cómo crear un cliente
creationdate: 24-12-2018 00:00:00
lastmod: 04-09-2026
url: https://facturascripts.com/publicaciones/tu-primer-cliente-459
---
Desde el **menú Ventas → Clientes** puedes consultar todos los clientes activos. Para crear uno, pulsa el botón **Nuevo** (el botón verde con el signo `+`).

![Crear cliente](https://i.imgur.com/63bqwky.png)

También puedes [importar clientes desde Excel o CSV](https://facturascripts.com/publicaciones/como-importar-clientes-de-excel) con el plugin CSVimport.

## ✏️ Crear un cliente

Para crear el cliente solo necesitas escribir su **nombre**; los demás campos obligatorios ya tienen un valor predeterminado. Pulsa **Guardar** para crear la ficha y activar el resto de las pestañas.

- **Código**: identificador interno del cliente. FacturaScripts lo genera automáticamente. Si quieres escribirlo tú, muestra la columna desde el botón **Opciones** antes de guardar.
- **Nombre**: nombre comercial o nombre por el que conoces al cliente.
- **Persona / Empresa**: indica si se trata de una persona física o de una empresa.
- **Id. fiscal**: tipo de identificador, por ejemplo, NIF.
- **Número fiscal**: NIF, CIF u otro identificador fiscal del cliente.

La **razón social** se encuentra en el apartado de información de contacto. Es el nombre oficial que aparecerá en los documentos; si la dejas vacía, se utilizará el nombre del cliente.

## 📞 Información de contacto

En la ficha principal puedes guardar los teléfonos, el email, el idioma y las direcciones predeterminadas de facturación y envío.

Al guardar un cliente nuevo, FacturaScripts crea automáticamente su primer contacto. En la pestaña **Direcciones y contactos** puedes completar esa dirección y añadir tantas como necesites. Cada registro puede contener una descripción, dirección postal, país, nombre de contacto, teléfonos y email.

Después, selecciona en la ficha principal qué contacto se usará como **Dirección de facturación** y cuál como **Dirección de envío**.

## 💼 Términos comerciales

- **Agente**: comercial que se asignará a los nuevos documentos del cliente.
- [**Tarifa**](https://facturascripts.com/publicaciones/las-tarifas-de-precios-por-clientes-o-grupos): tarifa de venta propia del cliente. Tiene prioridad sobre la tarifa de su grupo.
- [**Grupo**](https://facturascripts.com/publicaciones/los-grupos-de-clientes): permite aplicar al cliente la tarifa o subcuenta configurada en el grupo.
- [**Serie**](https://facturascripts.com/publicaciones/series-470): serie predeterminada de sus documentos de venta.
- [**Forma de pago**](https://facturascripts.com/publicaciones/formas-de-pago-729): forma de pago predeterminada.
- **Días de pago**: días concretos del mes en los que vence el pago, separados por comas; por ejemplo, `1,15`.
- **Riesgo actual**: suma calculada a partir de pedidos pendientes, albaranes pendientes y facturas sin cobrar.
- **Riesgo máximo**: límite de crédito autorizado. Si el cliente ya ha superado el límite, FacturaScripts impide guardar nuevas ventas y muestra un aviso.
- **Régimen de IVA**, **Operación**, **Excepción de IVA** y [**Retención**](https://facturascripts.com/publicaciones/impuestos-967): valores fiscales que se copiarán a los nuevos documentos del cliente.
- **Fecha de baja**: permite desactivar al cliente sin borrar su historial.

Los cambios en estas condiciones se aplican a los documentos nuevos; no modifican automáticamente los documentos que ya existen.

## 🏦 Cuentas bancarias

En la pestaña **Cuentas bancarias de cliente** puedes añadir sus cuentas. La **Descripción** es obligatoria; también puedes indicar IBAN, SWIFT/BIC, mandato SEPA, fecha del mandato y cuál es la cuenta principal.

## 📚 Subcuentas contables

La pestaña **Subcuentas** muestra la cuenta contable del cliente en cada ejercicio. No necesitas crearla al dar de alta al cliente: FacturaScripts puede generarla cuando se contabiliza la primera factura.

Si necesitas usar una cuenta concreta, consulta [cómo asignar una subcuenta a un cliente](https://facturascripts.com/publicaciones/como-asignar-una-subcuenta-a-un-cliente).

## 🗑️ Eliminar o dar de baja un cliente

Puedes eliminar un cliente con el botón **Eliminar** de su ficha si no tiene registros asociados. Si ya tiene documentos, recibos u otros datos relacionados, conserva el historial y asígnale una **Fecha de baja**.

Los clientes dados de baja dejan de aparecer al crear ventas. Para consultarlos, ve a **Ventas → Clientes**, pulsa **Filtros** y cambia **Solamente activos** por **Solamente suspendidos**.

![Listar clientes dados de baja](https://i.imgur.com/sDB0URw.png)