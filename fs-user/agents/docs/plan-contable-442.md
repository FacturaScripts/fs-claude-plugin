---
id: 784
permalink: plan-contable-442
title: Plan contable
creationdate: 06-03-2019 00:00:00
lastmod: 22-07-2026
url: https://facturascripts.com/publicaciones/plan-contable-442
---
El plan de cuentas comprende el listado de cuentas, subcuentas y [cuentas especiales](https://facturascripts.com/publicaciones/cuentas-especiales). Está vinculado al ejercicio, es decir, **cada ejercicio** puede tener una relación de cuentas y subcuentas distinta.

El plan de cuentas es **multinivel**: hay cuentas, cuentas hijas (*puede haber cuentas hijas de cuentas hijas*) y, finalmente, las subcuentas. Todas las subcuentas deben tener la misma longitud, definida en el campo `Longitud de subcuenta` del ejercicio. Por ejemplo, en el plan contable predeterminado para España tenemos las cuentas `1`, `10`, `100` y, finalmente, la subcuenta `1000000000`.

## Importar plan contable
Puedes importar el plan contable de un ejercicio desde el menú Contabilidad → Ejercicios: haz clic en el ejercicio y, en la siguiente pantalla, pulsa el botón `Importar` (situado en la parte de abajo).

![Botón para importar el plan contable de un ejercicio](https://facturascripts.com/MyFiles/2026/02/4081.png?myft=49418fb478dfdd485a76b066099c54d9d00c94df)

### Plan contable predeterminado
FacturaScripts ya incluye un plan contable predeterminado para algunos países como España, Colombia, Ecuador, etc. Si al importar no seleccionas ningún archivo, **se usará el plan contable predeterminado**. Puedes descargar los siguientes planes pulsando sobre los enlaces con el botón derecho y eligiendo &quot;Guardar enlace como&quot;:

- [España](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/ESP/defaultPlan.csv): plan general contable de 10 dígitos.
    - [Plan contable de 9 dígitos](https://facturascripts.com/MyFiles/2024/09/2241.csv?myft=f6d7bb2918bf7adef29cbe59c67c5e7c21a74d0b).
    - [Plan contable de 8 dígitos](https://facturascripts.com/MyFiles/2024/09/2242.csv?myft=ed4e5f3baae20d0fc70560daec247f0d054ad902).
    - [Plan contable de 7 dígitos](https://facturascripts.com/MyFiles/2024/09/2243.csv?myft=7ce0c8bb4143c8e51fd35afaa8159db767f94b12).
- [Colombia](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/COL/defaultPlan.csv)
- [Ecuador](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/ECU/defaultPlan.csv)
- [Perú](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/PER/defaultPlan.csv)
- [Rep. Dominicana](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/DOM/defaultPlan.csv)
- [Uruguay](https://github.com/NeoRazorX/facturascripts/raw/master/Core/Data/Codpais/URY/defaultPlan.csv)

### Crea tu propio plan contable
Puedes crear tu propio plan contable desde Excel. Solo tienes que crear una hoja de cálculo con 3 columnas: `cuenta`, `descripcion` y `cuentaesp`:

- `cuenta`: el número de cuenta, por ejemplo `100`.
- `descripcion`: la descripción de esa cuenta, por ejemplo &quot;Capital social&quot; (sin las comillas).
- `cuentaesp`: la [cuenta especial](https://facturascripts.com/publicaciones/cuentas-especiales) vinculada, si la hubiese. Por ejemplo &quot;CAJA&quot; (sin las comillas).

Guarda el archivo como CSV y selecciónalo al importar el plan contable. Ten en cuenta que todas las subcuentas deben tener la misma longitud, y esta debe coincidir con la indicada en el campo `Longitud de subcuenta` del ejercicio. Es decir, si quieres subcuentas de longitud 7, pon `7` en ese campo antes de importar el plan contable.

#### Cuentas especiales
[Las cuentas especiales](https://facturascripts.com/publicaciones/cuentas-especiales) sirven para que FacturaScripts sepa cuál es, por ejemplo, la cuenta de caja. En España es la `570`, pero en otros países es otra cuenta. Por eso, cuando FacturaScripts tiene que generar el asiento de pago de una factura, no busca la cuenta `570`, sino la primera cuenta identificada como cuenta de caja.

### Preguntas frecuentes

#### ¿Se puede crear el ejercicio 2034 hoy mismo, sin esperar al 1 de enero de 2034?
Sí, FacturaScripts permite crear ejercicios contables de manera anticipada. Es útil para planificar la contabilidad del próximo año sin tener que esperar a que finalice el ejercicio actual. Para ello, ve al menú Contabilidad → Ejercicios y crea un nuevo ejercicio con el año deseado. El sistema no tiene restricciones de fechas para esta operación.

#### ¿Qué ocurre al crear un ejercicio nuevo? ¿Incluye un plan contable automáticamente?
No. Cuando creas un nuevo ejercicio contable en FacturaScripts, se genera sin plan contable. Es intencional, para que puedas decidir cómo gestionarlo:

- Configurarlo desde cero.
- O copiar el plan contable de un ejercicio anterior.

Así tienes total flexibilidad en la gestión de la contabilidad.

##### ¿Cómo copiar el plan contable de otro ejercicio?
Puedes copiar el plan contable del ejercicio anterior al nuevo simplemente cerrando el ejercicio anterior. O bien ve al ejercicio que quieras y pulsa el botón `Exportar`: se descargará un archivo con el plan contable. Después abre el ejercicio donde quieras copiarlo, pulsa el botón `Importar`, selecciona el archivo descargado y acepta.