---
id: 794
permalink: tu-primer-cliente-459
title: Cómo crear un cliente
creationdate: 24-12-2018 00:00:00
lastmod: 09-04-2026
url: https://facturascripts.com/tu-primer-cliente-459
---
Desde el **menú Ventas, Clientes** puede ver todos los clientes (salvo los que ha dado de baja). Para crear un nuevo cliente simplemente pulse el **botón nuevo**. Al hacer clic se abrirá la pantalla de nuevo cliente.

![crear cliente](https://i.imgur.com/63bqwky.png)

También puede [importar clientes desde](https://facturascripts.com/publicaciones/como-importar-clientes-de-excel) un Excel usando el plugin CSVimport.

## Nuevo cliente
Para un nuevo cliente solamente es obligatorio escribir un nombre, el resto de campos son opcionales. Cuando haya rellenado el formulario pulse el **botón guardar**, abajo a la derecha. No podrá ver ninguna sección más del cliente hasta que no guarde. Sencillamente no es posible añadir una dirección al cliente si el cliente todavía no existe.

- **Nombre**: el nombre por el que se conoce al cliente.
- **Razón social**: (opcional) el nombre oficial del cliente, el que aparecerá en las facturas. Si se deja en blanco se usará el nombre del cliente.
- **Id. Fiscal**: el tipo de identificador fiscal, por ejemplo NIF.
- **Número fiscal**: (opcional) el identificador fiscal, generalmente el dni o cif del cliente. Ejemplo: 12345678X
- **Persona natural (no jurídica)**: para distinguir a los clientes particulares de las empresas. Si es una empresa, este campo debe estar desmarcado.

### Asignar un número de cliente
Puedes asignar o [cambiar el código de cliente activando la columna código desde el botón opciones](https://facturascripts.com/publicaciones/como-asignar-una-subcuenta-a-un-cliente).

### Información de contacto
- **Teléfono**: (opcional) número de teléfono de contacto del cliente.
- **Teléfono 2**: (opcional) otro número de teléfono de contacto del cliente.
- **Email**: (opcional) dirección de correo electrónico del cliente.

### Términos comerciales
- **Agente**: (opcional) el [agente comercial](https://facturascripts.com/publicaciones/los-agentes-que-son-y-para-que-sirven) asignado. Todas las facturas para este cliente se asignarán automáticamente a este comercial. Esto es útil para asignar comisiones de todas las ventas del cliente.
- [Tarifa](https://facturascripts.com/publicaciones/las-tarifas-de-precios-por-clientes-o-grupos): (opcional) la tarifa especial que se asignará al cliente. Podemos usar este campo para asignarle una tarifa distinta a la del grupo.
- **Grupo**: (opcional) el grupo de clientes al que pertenece. En el grupo podemos asignar una tarifa y se le aplica al cliente, salvo si el cliente tiene asignada una tarifa directamente.
- [Serie](https://facturascripts.com/publicaciones/series-470): (opcional) la serie que se asignará automáticamente a las facturas de este cliente.
- [Forma de pago](https://facturascripts.com/publicaciones/formas-de-pago-729): (opcional) la forma de pago que se asignará automáticamente a las facturas de este cliente.
- **Días de pago**: (opcional) si se ha pactado con el cliente unos días concretos de pago, por ejemplo el día 1 y el 15, podemos escribir esos días en este campo. Los nuevos recibos de las facturas de este cliente usarán esos días para la fecha de vencimiento.
- **Riesgo actual**: (calculado automáticamente) es el importe que suman todas las facturas y albaranes sin pagar del cliente.
- **Riesgo máximo**: (opcional) el importe máximo que autorizamos a este cliente, por ejemplo 2 000€. Una vez alcanzado, el sistema no permitirá hacer más ventas a este cliente.
- **Régimen de impuestos**: general, recargo de equivalencia o exento.
- [Retención de IRPF](https://facturascripts.com/publicaciones/impuestos-967): (opcional) la retención que se asignará automáticamente a las facturas de este cliente.
- **Fecha de baja**: (opcional) podemos dar de baja un cliente asignando una fecha de baja.

### Direcciones de cliente
Después de guardar los datos mediante el **botón guardar**,  abajo a la derecha, se activarán el resto de secciones.  También se habrá creado una dirección para el cliente (se puede observar que en el apartado **Información de contacto**, ya aparece esta dirección bajo la denominación de **Dirección de facturación**), que se ha de completar con los datos correspondientes:
- **Descripción**: Dato necesario para reconocer las diferentes direcciones de un cliente. También podemos indicar una Dirección de envío(opcional), en ese mismo apartado, que tendrá que estar dada de alta como una dirección mas del cliente.
- **Dirección**: (opcional) indique el nombre la la vía (calle, plaza, etc.) del cliente.
- **Apartado**: (opcional) indique el apartado de correos del cliente, si lo tiene.
- **Código Postal**: (opcional) código postal para esta dirección del cliente.
- **Ciudad**: (opcional) Población de esta dirección del cliente.
- **Provincia**: (opcional) Provincia de esta dirección del cliente.
- **País**: seleccione, en el desplegable, el país correspondiene a esta dirección del cliente.
- **Nombre**: puede ser distinto al del cliente. Se trata de indicar el nombre del contacto para esa dirección. Ejemplo: (Sr. Antonio) para el cliente &quot;Empresa Pruebas SL&quot;.
- **Apellidos**: (opcional) apellidos del contacto en esa dirección (Sr. Antonio). Ejemplo: López González.
- **Teléfono**: (opcional) número de teléfono del contacto en esa dirección (Sr. Antonio).
- **Teléfono 2**: (opcional) otro número de teléfono del contacto en esa dirección (Sr. Antonio).
- **Email**: (opcional) dirección de correo electrónico del contacto en esa dirección (Sr. Antonio).

### Cuentas bancarias de cliente
Después de guardar los datos mediante el **botón guardar** (abajo a la derecha) se activarán el resto de secciones  como de la que estamos detallando. En esta sección añadiremos todas las cuentas bancarias que nuestro cliente nos informe para su uso. Para añadir dichas cuentas bancarias tendríamos que ir rellenando los campos siguientes:

- **Descripción**: Dato necesario para reconocer las diferentes cuentas de nuestro cliente.
- **IBAN**:  El IBAN es el código de identificación del número de cuenta y sucursal, pero es aquel que identifica las cuentas internacionales de bancos europeos.
- **Swift/BIC**:  El código BIC (Bank Identifier Code) o SWIFT sirve para identificar al banco beneficiario de una transferencia (o banco destino).
- **Fecha Mandato**:  Normalmente es la fecha del mandato SEPA.
- **Principal**:  De todas las cuentas bancarias que nos suministre el cliente, la que marquemos como principal será la que normalmente usará FacturaScripts.

### Subcuentas de cliente
En esta sección podemos ver la cuenta contable del cliente. Una para cada ejercicio. Si quiere [cambiar la subcuenta del cliente, puede activar el campo subcuenta desde el botón opciones](https://facturascripts.com/publicaciones/como-asignar-una-subcuenta-a-un-cliente).

## Eliminar un cliente
Podremos eliminar el cliente, pulsando el botón eliminar situado abajo a la izquierda, siempre que este cliente no tenga ya facturas, albaranes, pedidos o presupuestos asignados. Si ya los tiene, lo mejor es **dar de caja** el cliente.

### Dar de baja el cliente
Para dar de baja un cliente y que no aparezca más al hacer facturas, simplemente debemos asignar una fecha de baja.

![desactivar cliente](https://i.imgur.com/pKQyNPu.png)

## Mostrar clientes dados de baja
Para mostrar los clientes dados de baja nos dirigimos al menú ventas, clientes, pulsamos el botón filtros y en el selector que indica &quot;solamente activos&quot; seleccionamos &quot;solamente suspendidos&quot;.

![listar clientes desactivados](https://i.imgur.com/sDB0URw.png)
