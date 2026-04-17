---
id: 959
permalink: problemas-con-la-configuracion-de-max-input-vars
title: Problemas con la configuración de max_input_vars
creationdate: 21-07-2021 23:42:52
lastmod: 30-03-2026
url: https://facturascripts.com/problemas-con-la-configuracion-de-max-input-vars
---
Cada campo de un formulario es una variable y **PHP tiene un límite de variables** que puede aceptar de un formulario, este es **max_input_vars**, que se define en el archivo **php.ini**, aunque generalmente se puede modificar desde el **.htaccess**.

El mensaje ``&quot;con la configuración actual de PHP (max_input_vars) no podrás trabajar con documentos de más de 71 líneas&quot;`` se refiere precisamente a este límite. Para trabajar con más líneas es necesario aumentar el valor de **max_input_vars**.

## Modificar max_input_vars
El valor de **max_input_vars** se define en el archivo **php.ini**, aunque generalmente se puede modificar desde el archivo **.htaccess**.

### ¿Dónde está el .htaccess?
Este archivo se encuentra en el directorio de FacturaScripts, y no se vé afectado por las actualizaciones, así que los cambios que haga ahí no se perderán. En la mayoría de instalaciones este archivo se aplica automáticamente, aunque existen hostings o configuraciones de servidor donde este archivo no se aplica. Contacte con su proveedor de hosting para más información.

### ¿Dónde está el php.ini?
Generalmente está en /etc/php/apache2/php.ini. Pero si se trata de un hosting, no podrá acceder a este archivo, quedando únicamente la opción del panel de control del hosting, si lo tiene.
