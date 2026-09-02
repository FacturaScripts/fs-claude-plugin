---
id: 785
permalink: secuencias-de-documentos-184
title: Secuencias de documentos
creationdate: 30-04-2019 00:00:00
lastmod: 21-07-2026
url: https://facturascripts.com/publicaciones/secuencias-de-documentos-184
---
No se pueden modificar los numeros de facturas manualmente, pero con las secuencias de documentos podemos cambiar la numeración de facturas, albaranes, pedidos y presupuestos, así como el patrón con el que se genera el código identificador. Para editar las secuencias haga clic en el **menú Administrador**, **Panel de control**, pestaña **secuencias**.

## Campos de una secuencia
- **Tipo de documento**: albarán de cliente, albarán de proveedor, factura de cliente...
- **Empresa**: la empresa a la que se aplica.
- **Ejercicio**: el ejercicio al que se aplica. Si no selecciona ninguno, se aplica para todos (*excepto para aquellos ejercicios que si tengan una secuencia asignada*). [¿Qué son los ejercicios?](https://facturascripts.com/publicaciones/los-ejercicios-contables)
- **Serie**: la serie a la que se aplica. [¿Qué son las series?](https://facturascripts.com/publicaciones/series-470)
- **Número**: el siguiente numero a utilizar. Es un contador.
- **Longitud del número**: si queremos rellenar con ceros, se añadirán los necesarios hasta que la longitud del número sea la indicada.
- **Número inicial**: el número en el que empieza esta secuencia, normalmente el 1.
- **Usar huecos**: marcar si queremos que, al eliminar una factura, la siguiente que creemos reutilice ese número libre en lugar de dejar un salto en la numeración. Su funcionamiento tiene varios detalles importantes, explicados en el apartado [Uso de huecos](#md_h8).
- **Patrón**: el patrón a utilizar para generar **el código del documento**. Este patrón admite variables como:
	- **{FECHA}**: se sustituye por la fecha del documento en formato d-m-Y, por ejemplo 17-05-2027.
	- **{HORA}**: se sustituye por la hora del documento en formato H:i:s en formato 24h, por ejemplo 15:46:21.
	- **{FECHAHORA}**: se sustituye por la fecha y hora del documento en formato d-m-Y H:i:s, por ejemplo 27-11-2027 18:33:15.
	- **{ANYO}**: se sustituye por el año del documento, por ejemplo 2027.
	- **{ANYO2}**: se sustituye por el año del documento, por ejemplo 27.
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

## ✅ Validaciones del patrón y del número

Al guardar una secuencia, FacturaScripts comprueba varias cosas:

- La `longitud del número` debe estar entre 1 y 10. Fuera de ese rango no se guarda.
- El patrón no puede estar vacío y **debe incluir un número** (`{NUM}` o `{0NUM}`). Sin número no se guarda, porque generaría códigos duplicados.
- El código generado no puede superar los 20 caracteres. Si lo supera, no se guarda.

Además, el sistema muestra avisos (que no impiden guardar) cuando el patrón puede provocar códigos duplicados:

- Si no incluye ejercicio ni fecha (`{EJE}`, `{EJE2}`, `{ANYO}`, `{ANYO2}`, `{FECHA}` o `{FECHAHORA}`) y la secuencia no tiene un ejercicio asignado.
- Si escribes el año fijo en el patrón (por ejemplo `2027`) en lugar de usar `{ANYO}` o `{EJE}`. Así el patrón se reutiliza año tras año sin tener que editarlo.
- Si no incluye serie (`{SERIE}` o `{0SERIE}`).

## Uso de huecos

Cuando eliminas una factura, su número queda libre y se crea un *hueco* en la numeración. La opción `usar huecos` decide qué pasa con ese número:

- Si está **desactivada**, el hueco se queda vacío para siempre y la numeración sigue avanzando.
- Si está **activada**, la siguiente factura que crees reutilizará ese número libre antes de seguir avanzando el contador.

### Activado por defecto en facturas de cliente

Cuando FacturaScripts crea una secuencia automáticamente (ver [Secuencias autogeneradas](#secuencias-autogeneradas)), la opción `usar huecos` se activa sola **solo** para las facturas de cliente. El resto de documentos (albaranes, pedidos, presupuestos y facturas de proveedor) nacen con los huecos desactivados, aunque puedes cambiarlo cuando quieras.

### ⚠️ Facturas de cliente en España

En España la numeración de las facturas debe ser correlativa y sin saltos. Por eso, si desmarcas `usar huecos` en una secuencia de facturas de cliente y el país por defecto es España, verás este aviso:

&gt; **Si desmarcas el uso de huecos en facturas y eliminas alguna se quedará el hueco en la facturación y tendrás problemas con hacienda.**

Salvo que sepas muy bien lo que haces, deja esta opción activada en las facturas de cliente.

### La fecha de la factura se ajusta al rellenar un hueco

Este es el detalle más importante y el que más sorprende: cuando una factura nueva reutiliza un hueco, **su fecha y hora se cambian automáticamente a las del documento anterior al hueco**. De esta forma el orden por fecha sigue coincidiendo con el orden por número, tal y como exige la numeración correlativa.

Es decir, si rellenas un hueco antiguo, la factura no tomará la fecha de hoy, sino la que corresponde a su posición en la secuencia. Tenlo en cuenta antes de rellenar huecos de ejercicios ya cerrados.

### Límite de 1000 documentos

El relleno automático de huecos no revisa toda la facturación: solo mira **los últimos 1000 documentos** de la secuencia. Un hueco más antiguo que eso ya no se rellenará solo, aunque la opción esté activada. Los huecos por debajo del `número inicial` tampoco se rellenan.

### 🔍 Buscar huecos en las facturas

En la lista de facturas de cliente (menú `Ventas` → `Facturas`) tienes el botón **Buscar huecos**, que revisa toda la facturación de las secuencias que usan huecos y te avisa de los que encuentra, separados en dos grupos:

- Los que **sí se rellenarán** automáticamente con la próxima factura (están dentro del límite de 1000). Aparecen como aviso, indicando serie, número, fecha y empresa.
- Los que **ya no se rellenarán** por quedar fuera de ese límite. Aparecen como error, para que sepas que esos números quedarán vacíos de forma permanente.

Si no aparece ningún hueco, verás un mensaje indicándolo. Este botón solo está disponible para usuarios con permiso para ver datos de otros usuarios, porque analiza todas las facturas.

## Búsquedas habituales
Cambiar numeracion de facturas, cambiar numero factura, numero inicial de factura, huecos en la numeración, facturas correlativas, buscar huecos.