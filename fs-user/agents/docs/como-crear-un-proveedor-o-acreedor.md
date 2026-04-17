---
id: 961
permalink: como-crear-un-proveedor-o-acreedor
title: Cómo crear un proveedor o acreedor
creationdate: 24-07-2021 13:42:53
lastmod: 09-04-2026
url: https://facturascripts.com/como-crear-un-proveedor-o-acreedor
---
Desde el **menú Compras → Proveedores**, podrás ver todos los proveedores y acreedores, excepto aquellos que se han dado de baja. Para crear un nuevo proveedor, simplemente haz clic en el **botón nuevo** (el botón verde con un símbolo de más). Al hacerlo, se abrirá la pantalla de nuevo proveedor.

![NuevoProveedor](https://i.ibb.co/wNMJKZx6/Nuevo-Proveedor.png)

## ✏️ Nuevo proveedor

Para crear un nuevo proveedor, solo es obligatorio ingresar un nombre; el resto de los campos son opcionales. Una vez que hayas completado el formulario, pulsa el **botón guardar** (abajo a la derecha). No podrás ver ninguna sección adicional del proveedor hasta que no guardes. No es posible añadir una dirección al proveedor si este aún no existe.

- **Código**: (opcional) es el identificador del proveedor, por ejemplo, 1. Dos proveedores no pueden tener el mismo código.
- **Nombre**: el nombre por el que se conoce al proveedor.
- **Razón social**: (opcional) el nombre oficial del proveedor, que aparecerá en las facturas. Si se deja en blanco, se utilizará el nombre del proveedor.
- **Id. Fiscal**: el tipo de identificador fiscal, por ejemplo, NIF.
- **Número fiscal**: (opcional) el identificador fiscal, generalmente el CIF del proveedor. Ejemplo: B12345678.
- **Persona natural (no jurídica)**: este campo se usa para distinguir entre proveedores particulares y empresas. Si es una empresa, este campo debe estar desmarcado.

## 💼 Términos comerciales

- [Serie](https://facturascripts.com/publicaciones/series-470): (opcional) la serie que se asignará automáticamente a las facturas de este proveedor.
- [Forma de pago](https://facturascripts.com/publicaciones/formas-de-pago-729): (opcional) la forma de pago que se asignará automáticamente a las facturas de este proveedor.
- **Régimen de impuestos**: general, recargo de equivalencia o exento.
- [Retención de IRPF](https://facturascripts.com/publicaciones/impuestos-967): (opcional) la retención (IRPF) que se asignará automáticamente a las facturas de este proveedor.
- **Fecha de baja**: (opcional) puedes dar de baja a un proveedor asignando una fecha de baja.

## 📍 Direcciones del proveedor

Después de guardar los datos mediante el **botón guardar** (abajo a la derecha), se activarán el resto de las secciones. Es el momento de añadir las diferentes direcciones/contactos de nuestro proveedor. Si pulsamos sobre la opción de la izquierda **Direcciones y contactos**, se abrirá la ventana para añadir nuevas direcciones. Al pulsar el botón **+Añadir** (arriba a la izquierda de esta sección), se abrirá una ventana con los siguientes campos para completar:

- **Descripción**: dato necesario para identificar las diferentes direcciones de nuestro proveedor.
- **Dirección**: (opcional) indica el nombre de la vía (calle, plaza, etc.) del cliente.
- **Apartado**: (opcional) indica el apartado de correos del cliente, si lo tiene.
- **Código Postal**: (opcional) código postal para esta dirección del cliente.
- **Ciudad**: (opcional) población correspondiente a esta dirección del cliente.
- **Provincia**: (opcional) provincia de esta dirección del cliente.
- **País**: selecciona, en el desplegable, el país correspondiente a esta dirección del cliente.
- **Nombre**: puede ser distinto al del cliente. Indica el nombre del contacto para esa dirección. Ejemplo: (Sr. Antonio) para el cliente &quot;Empresa Pruebas SL&quot;.
- **Apellidos**: (opcional) apellidos del contacto en esa dirección (Ejemplo: López González).
- **Teléfono**: (opcional) número de teléfono del contacto en esa dirección (Ejemplo: Sr. Antonio).
- **Teléfono 2**: (opcional) otro número de teléfono del contacto en esa dirección (Ejemplo: Sr. Antonio).
- **Email**: (opcional) dirección de correo electrónico del contacto en esa dirección (Ejemplo: Sr. Antonio).

## 🏦 Cuentas bancarias del proveedor

Después de guardar los datos mediante el **botón guardar** (abajo a la derecha), se activarán el resto de secciones como la que estamos detallando. En esta sección, añadiremos todas las cuentas bancarias que nuestro proveedor nos informe para su uso. Para añadir dichas cuentas, tendremos que completar los siguientes campos:

- **Descripción**: dato necesario para identificar las diferentes cuentas de nuestro cliente.
- **IBAN**: el IBAN es el código que identifica un número de cuenta y sucursal, pero también identifica cuentas internacionales de bancos europeos.
- **Swift/BIC**: el código BIC (Bank Identifier Code) o SWIFT sirve para identificar al banco beneficiario de una transferencia (o banco destino).
- **Fecha Mandato**: normalmente es la fecha del mandato SEPA.
- **Principal**: de todas las cuentas bancarias que nos suministre el cliente, la que marquemos como principal será la que normalmente utilizará FacturaScripts.

![Cuentas Bancarias del proveedor](https://i.ibb.co/v68x80fn/Cuentas-Bancarias.png)

## 🗂️ Subcuenta del proveedor

Cuando se crea un proveedor o un acreedor, no es necesario añadirle una subcuenta. Al realizar la primera factura, se crea una subcuenta automáticamente en la 400 (proveedor) o 410 (acreedor) con el código asignado al crear el proveedor/acreedor. Pero si quieres, puedes [cambiar la subcuenta del proveedor manualmente](https://facturascripts.com/publicaciones/como-cambiar-la-subcuenta-de-un-proveedor) 📝

![Subcuentas del proveedor](https://i.ibb.co/6Rg3R1XP/Subcuentas.png)

**Ejemplo**: hemos creado el proveedor &quot;Pinturas Sapi&quot; y FacturaScripts le asigna el código 23. Cuando generamos la primera factura, se crea la subcuenta 400.23. También podemos tener la subcuenta creada con anterioridad; en este caso, debemos rellenar el campo con la subcuenta destinada a este proveedor/acreedor. En esta pestaña aparecen todas las subcuentas asignadas al proveedor/acreedor.

## 🔍 Mostrar proveedores dados de baja

Para mostrar los proveedores dados de baja, dirígete al menú **Compras → Proveedores**, pulsa el botón **Filtros** y en el selector que indica &quot;solamente activos&quot;, selecciona &quot;solamente suspendidos&quot;.

![Filtros de proveedores](https://i.ibb.co/G4K5q9HG/Filtro-Prov.png)
