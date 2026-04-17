---
id: 785
permalink: secuencias-de-documentos-184
title: Secuencias de documentos
creationdate: 30-04-2019 00:00:00
lastmod: 10-04-2026
url: https://facturascripts.com/secuencias-de-documentos-184
---
No se pueden modificar los numeros de facturas manualmente, pero con las secuencias de documentos podemos cambiar la numeración de facturas, albaranes, pedidos y presupuestos, así como el patrón con el que se genera el código identificador. Para editar las secuencias haga clic en el **menú Administrador**, **Panel de control**, pestaña **secuencias**.

## Campos de una secuencia
- **Tipo de documento**: albarán de cliente, albarán de proveedor, factura de cliente...
- **Empresa**: la empresa a la que se aplica.
- **Ejercicio**: el ejercicio al que se aplica. Si no selecciona ninguno, se aplica para todos (*excepto para aquellos ejercicios que si tengan una secuencia asignada*). [¿Qué son los ejercicios?](/publicaciones/los-ejercicios-contables)
- **Serie**: la serie a la que se aplica. [¿Qué son las series?](/publicaciones/series-470)
- **Número**: el siguiente numero a utilizar. Es un contador.
- **Longitud del número**: si queremos rellenar con ceros, se añadirán los necesarios hasta que la longitud del número sea la indicada.
- **Número inicial**: el número en el que empieza esta secuencia, normalmente el 1.
- **Usar huecos**: marcar si queremos que al eliminar una factura, la siguiente que creemos utilice ese hueco.
- **Patrón**: el patrón a utilizar para generar **el código del documento**. Este patrón admite variables como:
	- **{FECHA}**: se sustituye por la fecha del documento en formato d-m-Y, por ejemplo 17-05-2027.
	- **{HORA}**: se sustituye por la hora del documento en formato H:i:s en formato 24h, por ejemplo 15:46:21.
	- **{FECHAHORA}**: se sustituye por la fecha y hora del documento en formato d-m-Y H:i:s, por ejemplo 27-11-2027 18:33:15.
	- **{ANYO}**: se sustituye por el año del documento, por ejemplo 2027.
	- **{ANYO2}**: se sustituye por el año del documento, por ejemplo 2027.
	- **{DIA}**: se sustituye por el día del documento, por ejemplo 25.
	- **{EJE}**: se sustituye por el ejercicio del documento. Por ejemplo: 2027.
	- **{EJE2}**: se sustituye por los dos últimos caracteres del ejercicio del documento. Por ejemplo: 19.
	- **{MES}**: se sustituye por el mes del documento, por ejemplo: 09.
	- **{NUM}**: se sustituye por el número del documento. Por ejemplo: 47.
	- **{SERIE}**: se sustituye por la serie del documento. Por ejemplo: A.
	- **{0NUM}**: se sustituye por el número del documento, pero relleno con ceros. Por ejemplo: 000047.
	- **{0SERIE}**: se sustituye por la serie del documento, pero rellenada con ceros hasta 2 caracteres. Por ejemplo: 0A.
	- **{NOMBREMES}**: se sustituye por el nombre del mes de la fecha del documento, por ejemplo si la fecha es 13-07-2022 pondrá Julio.

### Patrones de ejemplo
- FAC{EJE}{SERIE}{NUM}: se sustituye por FAC + el ejercicio + la serie + el número del documento. Ejemplo: FAC2027A47.
- {SERIE}{0NUM}: se sustituye por la serie + el número relleno con ceros. Ejemplo: A000047.
- {ANYO}-{MES}-{NUM}: 2027-09-123

### Comenzar las facturas por la número 87
Si deseamos que la primera factura de venta comience por el número 87, por ejemplo. Solamente debemos crear o editar la secuencia para **factura de cliente** indicando 87 en el **número inicial**. Después pulsar el botón guardar. Tenga en cuenta que esto no altera las facturas anteriores.

## Secuencias y series
También es posible editar las secuencias de documentos desde las series, en el **menú contabilidad**, **series**. Haga clic en una serie para ver las secuencias vinculadas. Tenga en cuenta que toda secuencia está vinculada a una serie.

### Secuencias autogeneradas
Cada vez que creamos una facturas, albarán, pedido o presupuestos, FacturaScripts busca una secuencia para ese tipo de documento, serie y ejercicio y en caso de no encontrar ninguna, crea automáticamente una nueva con los datos de la última secuencia encontrada.

### Prioridades
El sistema usará la primera secuencia que coincida con el documento. Por ejemplo, si se está creando una factura de 2027 en la serie A, se buscará:

- La primera secuencia para facturas de cliente, en la serie A y el ejercicio 2027.
- La primera secuencia para facturas de cliente, en la serie A y sin ejercicio asignado.

La primera secuencia que se encuentre es la que se usará.

## Búsquedas habituales
Cambiar numeracion de facturas, cambiar numero factura, numero inicial de factura.
