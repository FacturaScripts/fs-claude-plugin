---
id: 784
permalink: plan-contable-442
title: Plan contable
creationdate: 06-03-2019 00:00:00
lastmod: 04-02-2026
url: https://facturascripts.com/plan-contable-442
---
El plan de cuentas comprende el listado de cuentas, subcuentas y [cuentas especiales](https://facturascripts.com/publicaciones/cuentas-especiales). Este plan contable está vinculado al ejercicio, es decir, **cada ejercicio** puede tener una relación de cuentas y subcuentas distinta.

Este plan de cuentas es **multi-nivel**: tenemos cuentas, cuentas hijas (*puede haber cuentas hijas de cuentas hijas*) y finalmente las subcuentas. Las subcuentas deben tener todas la misma longitud, que vendrá definida en el campo **longitud de subcuenta** del ejercicio. Por ejemplo, en el plan contable predeterminado para España tenemos las cuentas 1, 10, 100 y finalmente la subcuenta 1000000000.

## Importar plan contable
Puede importar el plan contable para el ejercicio 2024 haciendo clic en el **menú Contabilidad** &gt; **Ejercicios**, clic en 2024 y, en la siguiente pantalla, clic en el **botón importar** (situado en la parte de abajo).

![importar plan contable](https://facturascripts.com/MyFiles/2026/02/4081.png?myft=49418fb478dfdd485a76b066099c54d9d00c94df)

### Plan contable predeterminado
FacturaScripts ya incluye un plan contable predeterminado para algunos paises como España, Colombia, Ecuador, etc. Si al importar no selecciona ningún archivo, **se seleccionará el plan contable predeterminado**. Puede descargar los siguientes planes pulsando sobre los enlaces, botón derecho, guardar enlace como.

- [España](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/ESP/defaultPlan.csv): plan general contable de 10 dígitos.
	- [Plan contable de 9 dígitos](https://facturascripts.com/MyFiles/2024/09/2241.csv?myft=f6d7bb2918bf7adef29cbe59c67c5e7c21a74d0b).
	- [Plan contable de 8 dígitos](https://facturascripts.com/MyFiles/2024/09/2242.csv?myft=ed4e5f3baae20d0fc70560daec247f0d054ad902).
	- [Plan contable de 7 dígitos](https://facturascripts.com/MyFiles/2024/09/2243.csv?myft=7ce0c8bb4143c8e51fd35afaa8159db767f94b12).
- [Colombia](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/COL/defaultPlan.csv)
- [Ecuador](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/ECU/defaultPlan.csv) ``-&gt; faltan cuentas especiales``
- [Perú](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/PER/defaultPlan.csv) ``-&gt; faltan cuentas especiales``
- [Rep. Dominicana](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/DOM/defaultPlan.csv) ``-&gt; faltan cuentas especiales``
- [Uruguay](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/URY/defaultPlan.csv) ``-&gt; faltan cuentas especiales``

### Cree su propio plan contable
Puede crear su propio plan contable desde Excel. Simplemente cree una hoja de cálculo con 3 columnas: **cuenta, descripcion y cuentaesp**:
- **cuenta**: el número de cuenta, por ejemplo: 100.
- **descripción**: la descripción de esa cuenta, por ejemplo: &quot;Capital social&quot; (sin las comillas).
- **cuentaesp**: la [cuenta especial](https://facturascripts.com/publicaciones/cuentas-especiales) vinculada, si la huviese. Ejemplo: &quot;CAJA&quot; (sin las comillas).

Guarde el archivo como csv y seleccione ese archivo al importar el plan contable. Tenga en cuenta que todas las subcuentas deben tener la misma longitud y esta debe ser la indicada en el campo **longitud subcuenta** del ejercicio. Es decir, que si desea tener subcuentas de longitud 7, deberá poner 7 en el campo longitud de subcuenta del ejercicio antes de importar el plan contable.

#### Cuentas especiales
[Las cuentas especiales](https://facturascripts.com/publicaciones/cuentas-especiales) sirven para que FacturaScripts sepa cual es, por ejemplo, la cuenta de caja. En España es la 570, pero en otros paises es otra cuenta. Por eso FacturaScripts cuando tiene que generar un asiento de pago de una factura no busca la cuenta 570, sino la primera cuenta identificada como cuenta de caja.

### FAQs
A continuación tiene una pequeña recopilación de preguntas frecuentes y su respuesta:

#### ¿Se puede crear el ejercicio 2034 hoy mismo, sin esperar al 1 de enero de 2034?
Sí, FacturaScripts permite crear ejercicios contables de manera anticipada. Esto es útil para planificar la contabilidad del próximo año sin tener que esperar a que finalice el ejercicio actual. Para hacerlo, simplemente vaya al menú Contabilidad, Ejercicios y cree un nuevo ejercicio con el año deseado. El sistema no tiene restricciones de fechas para esta operación.

#### ¿Qué ocurre al crear un ejercicio nuevo? ¿Incluye un plan contable automáticamente?
No. Cuando crea un nuevo ejercicio contable en FacturaScripts, este se genera sin un plan contable. Esto es intencional para que pueda decidir cómo gestionarlo:

- Puede configurarlo desde cero.
- O bien, copiar un plan contable de un ejercicio anterior.

Esto garantiza flexibilidad en la gestión de la contabilidad.

##### ¿Cómo copiar el plan contable de otro ejercicio?
Puede copiar el plan contable del ejercicio anterior al nuevo simplemente cerrando el ejercicio anterior. O bien puede ir al ejercicio que desee y pulsar el **botón exportar**, se descargará un archivo con el plan contable. Después abra el ejercicio donde desee copiar el plan contable y pulsar el botón **importar plan contable**, le pedirá un archivo, seleccione el archivo anteriormente descargado y pulse aceptar.
