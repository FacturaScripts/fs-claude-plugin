---
id: 2425
permalink: como-modificar-el-calculator-desde-un-plugin
title: Cómo modificar el Calculator desde un plugin
creationdate: 22-12-2025 13:24:32
lastmod: 17-03-2026
url: https://facturascripts.com/como-modificar-el-calculator-desde-un-plugin
---
Para modificar los cálculos de totales y subtotales de los albaranes, factura, etc ...  debemos crear una clase que implemente el CalculatorModClass:

- `FacturaScripts\Core\Template\CalculatorModClass;`

Por convención se llamará `CalculatorMod` y se ubicará en el directorio `Mod` del plugin.

Podemos editar o recalcular datos al momento de calcular los totales del documento, ya sea para compras y ventas, o solo para uno de ellos.

La función calculate se usa para recalcular el total del documento

```
public function calculate(BusinessDocument &$doc, array &$lines): bool
{
	$doc-&gt;total = &#39;aquí tu cálculo&#39;;
	return true;
}
```

Para recalcular las líneas de los documentos se usa calculateLine

```
public function calculateLine(BusinessDocument $doc, BusinessDocumentLine &$line): bool
{
	$line-&gt;pvptotal = &#39;aquí tu cálculo&#39;;
	return true;
}
```

Para inicializar los registros se usa clear. Normalmente se inicializan todos los valores a 0, aunque si es necesario se puede utilizar otro valor

```
public function clear(BusinessDocument &$doc, array &$lines): bool
{
	$doc-&gt;total = 0.0;
	
	foreach ($lines as $line) {
		$line-&gt;total = 0.0;
	}
	
	return true;
}
```

Para modificar los subtotales se utiliza getSubtotals, donde los subtotales se especifican mediante un array

```
public function getSubtotals(array &$subtotals, BusinessDocument $doc, array $lines)
{
	$subtotals[&#39;neto&#39;] += 10;  
	$subtotals[&#39;total&#39;] += 10;  
	return true;
}
```

Podemos utilizar apply para aplicar configuraciones o precargar datos

```
public function apply(BusinessDocument &$doc, array &$lines): bool  
{  
	// Obtener y guardar el régimen de IVA una sola vez  
	$subject = $doc-&gt;getSubject();  
	$this-&gt;regimenIVA = $subject-&gt;regimeniva ?? RegimenIVA::TAX_SYSTEM_GENERAL;  
	return true;  
}
```

## Archivo Init
Como cualquier mod, debemos cargarlo desde [el archivo Init.php del plugin](https://facturascripts.com/publicaciones/el-archivo-init-php-307):

```
&lt;?php

namespace FacturaScripts\Plugins\MyNewPlugin;

use FacturaScripts\Core\Template\InitClass;
use FacturaScripts\Core\Lib\Calculator;

class Init extends InitClass
{
    public function init(): void
    {
        Calculator::addMod(new Mod\CalculatorMod());
    }

    public function uninstall(): void
    {
    }

    public function update(): void
    {
    }
}
```

Para más información sobre el Init, puedes consultar la [documentación del Init](https://facturascripts.com/publicaciones/el-archivo-init-php-307)
