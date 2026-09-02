---
idproject: 666
name: ValidaNIF
permalink: validanif
creationdate: 02-07-2026
lastmod: 03-07-2026
version: 1.1
betaversion: 
mincore: 2026
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: openssl,soap,dom
url: https://facturascripts.com/plugins/ValidaNIF
---
## ¿Para qué sirve?

ValidaNIF permite comprobar los NIF de clientes y proveedores directamente desde FacturaScripts utilizando el servicio oficial de calidad de datos identificativos de la AEAT (VNifV2).

El plugin añade un botón de validación en las fichas de clientes y proveedores, desde el que se puede verificar si el NIF/CIF y el nombre o razón social coinciden con los datos disponibles en AEAT. Su objetivo es ayudarte a detectar datos fiscales incorrectos antes de emitir documentos, presentar impuestos o mantener una ficha de cliente/proveedor con información poco fiable. Es útil para evitar errores de identificación a la hora de enviar los datos a Verifactu.

El plugin muestra el resultado de forma clara:

- **IDENTIFICADO**: los datos han sido verificados correctamente en el censo.
- **NO IDENTIFICADO**: AEAT no reconoce la combinación de NIF/CIF y nombre indicada.

Cuando la validación es correcta, ValidaNIF también muestra el nombre o razón social censal devuelto por AEAT.

Para empresas, basta con indicar un NIF/CIF válido para que AEAT devuelva el resultado con la razón social registrada en el censo de empresarios. Por otro lado, para personas físicas o autónomos, es necesaria la correcta combinación de NIF/DNI con nombre y apellidos (o una aproximación muy cercana) para que se devuelva la identificación censal de la persona.

## Configuración

Incluye una pantalla de configuración para subir el certificado digital necesario para la conexión con el servicio de AEAT y probar la misma haciendo llamadas manuales al servicio.

1. Instala y activa el plugin desde el administrador de FacturaScripts.
2. Entra en **Administrador &gt; ValidaNIF**.
3. Sube el certificado digital a utilizar para la conexión con AEAT.
4. Usa la prueba de conexión para confirmar que el certificado se reconoce correctamente y que el servicio funciona.

Una vez configurado, podrás validar NIF/CIF directamente desde las páginas de clientes y proveedores sin necesidad de escribir manualmente los datos en la página de configuración.


## Disclaimer
La finalidad de este servicio es posibilitar la validación de los datos identificativos de los contribuyentes y facilitar así el correcto cumplimiento de las obligaciones tributarias. El posible uso para otras finalidades o el abuso de este servicio podrá suponer el bloqueo del acceso al mismo, de forma temporal o permanente.

La información proporcionada por este servicio web se realiza consultando los datos identificativos disponibles en el momento. Esta información podría variar si se producen posteriores cambios en los datos identificativos. 

Este plugin no modifica los datos del cliente o proveedor automáticamente. La validación se realiza bajo demanda y muestra el resultado devuelto por AEAT para que el usuario pueda revisar la información antes de emitir documentos o presentar impuestos.