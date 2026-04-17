---
id: 997
permalink: php-fatal-error-cannot-declare-class-cpdf-because-the-name-is-already-in-use-in-opt-lampp
title: PHP Fatal error:  Cannot declare class Cpdf
creationdate: 29-09-2021 11:38:52
lastmod: 25-02-2026
url: https://facturascripts.com/php-fatal-error-cannot-declare-class-cpdf-because-the-name-is-already-in-use-in-opt-lampp
---
¿Le aparece este mensaje de error al usar FacturaScripts?

&gt; ``PHP Fatal error:  Cannot declare class Cpdf, because the name is already in use in /opt/lampp/lib/php/Cpdf.php on line 19``

Este error se presenta cuando el servidor donde tenemos FacturaScripts tiene instalada la **extensión cpdf** entre las opciones de PHP. Para solucionarlo es necesario desactivar esta extensión de PHP.

## Hosting
Vaya al panel de control de hosting y en la sección de PHP, localice la sección de extensiones, busque cpdf y desactívela.

## XAMPP
En la carpeta de xampp, localice el archivo php.ini y busque esta línea:

```
extension=php_cpdf.dll
```

Cámbiela por esta, guarde y reinicie el apache.

```
;extension=php_cpdf.dll
```
