---
id: 1504
permalink: testeo-de-plugins
title: Pruebas de Plugins (tests unitarios)
creationdate: 29-07-2023 21:31:11
lastmod: 17-03-2026
url: https://facturascripts.com/testeo-de-plugins
---
Podemos realizar pruebas de nuestro plugin utilizando **PHPUnit**, colocando los **tests unitarios** en la carpeta **Test** del plugin. A continuación, podemos observar un ejemplo en el [repositorio de GitHub del plugin Informes](https://github.com/FacturaScripts/informes).

## 🗂️ Estructura de archivos
El plugin debe tener una carpeta **Test** y dentro otra carpeta **main**, donde finalmente van los archivos php con los tests unitarios, además del archivo `install-plugins.txt`

- Test
	- main
		- install-plugins.txt
		- MiTest.php
		- MiSegundoTest.php
		- ...

Si además queremos ejecutar pruebas de nuestro plugin en combinación con otros, podemos crear más carpetas dentro de Test, cada una con un archivo `install-plugins.txt` propio donde indicaremos los plugins a activar para ejecutar esos tests.

- Test
	- main
		- install-plugins.txt
		- MiTest.php
		- MiSegundoTest.php
		- ...
	- informes
		- install-plugins.txt
		- ...

## 📃 Archivo install-plugins.txt

En el archivo `install-plugins.txt` debemos incluir los nombres de los plugins a instalar. Por defecto, se debe añadir el nombre del propio plugin. Si se requieren activar otros plugins previamente, simplemente se debe colocar la lista de plugins a instalar, separados por comas. No olvides incluir el nombre del plugin que estás desarrollando:

```
StockAvanzado,Servicios
```

### 🧪 Creación de un Test Unitario

Podemos crear un test unitario utilizando [fsmaker](/fsmaker) con el parámetro test. Nos pedirá el nombre del archivo y lo creará en la carpeta.

```
fsmaker test
```

También podemos crear el test manualmente. Este debe ser un archivo PHP cuyo nombre termine por Test. Debe usar el espacio de nombres `FacturaScripts\Test\Plugins` y heredar de `PHPUnit\Framework\TestCase`. Además, las funciones a ejecutar dentro del test unitario deben ser **públicas** y tener un nombre que comience por `test`.

```
&lt;?php

namespace FacturaScripts\Test\Plugins;

use PHPUnit\Framework\TestCase;

class MiTest extends TestCase
{
	public function testCreate(): void
	{
		// tu código aquí
	}
}
```

Recuerda que las funciones deben comenzar por `test` y ser `public`, de lo contrario no se ejecutarán al pasar los tests.

### 🚀 Ejecución de Tests

Para ejecutar los tests del plugin podemos usar igualmente fsmaker, pero con la opción run-tests. Debemos indicarle como parámetro la ruta relativa a facturascripts, comunmente se usa de la siguiente manera:
```
fsmaker run-tests ../..
```

Si preferimos ejecutarlos manualemente, debemos copiar los tests del plugin a la carpeta `Test/Plugins` de FacturaScripts, abrir un terminal en la carpeta raíz de FacturaScripts y ejecutar los siguientes comandos:

```
php Test/install-plugins.php
vendor/bin/phpunit phpunit-plugins.xml
```

Si el plugin depende de otro plugin, hay que ejecutar `php Test/install-plugins.php` tantas veces como plugins haya que instalar, ya que se instalan de uno en uno.
