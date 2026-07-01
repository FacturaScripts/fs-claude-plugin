---
id: 2425
permalink: como-modificar-el-calculator-desde-un-plugin
title: Cómo modificar el Calculator desde un plugin
creationdate: 22-12-2025 13:24:32
lastmod: 15-06-2026
url: https://facturascripts.com/publicaciones/como-modificar-el-calculator-desde-un-plugin
---
Para modificar los cálculos de totales y subtotales de los albaranes, factura, etc ... debemos crear una clase que implemente el CalculatorModClass:

- `FacturaScripts\Core\Template\CalculatorModClass;`

Por convención se llamará `CalculatorMod` y se ubicará en el directorio `Mod` del plugin.

Podemos editar o recalcular datos al momento de calcular los totales del documento, ya sea para compras y ventas, o solo para uno de ellos.

La función calculate se usa para recalcular el total del documento

```
public function calculate(BusinessDocument $doc, array &$lines): string
{
    $doc-&gt;total = &#39;aquí tu cálculo&#39;;
    return $this-&gt;done();
}
```

Para recalcular las líneas de los documentos se usa calculateLine

```
public function calculateLine(BusinessDocument $doc, BusinessDocumentLine $line): string
{
    $line-&gt;pvptotal = &#39;aquí tu cálculo&#39;;
    return $this-&gt;done();
}
```

Para inicializar los registros se usa clear. Normalmente se inicializan todos los valores a 0, aunque si es necesario se puede utilizar otro valor

```
public function clear(BusinessDocument $doc, array &$lines): string
{
    $doc-&gt;total = 0.0;
    
    foreach ($lines as $line) {
        $line-&gt;total = 0.0;
    }
    
    return $this-&gt;done();
}
```

Para modificar los subtotales se utiliza `updateSubtotals`, donde los subtotales se especifican mediante un array

```
public function updateSubtotals(array &$subtotals, BusinessDocument $doc, array $lines): string
{
    $subtotals[&#39;neto&#39;] += 10;  
    $subtotals[&#39;total&#39;] += 10;  
    return $this-&gt;done();
}
```

Podemos utilizar apply para aplicar configuraciones o precargar datos

```
public function apply(BusinessDocument $doc, array &$lines): string  
{  
    // Obtener y guardar el régimen de IVA una sola vez  
    $subject = $doc-&gt;getSubject();  
    $this-&gt;regimenIVA = $subject-&gt;regimeniva ?? RegimenIVA::TAX_SYSTEM_GENERAL;  
    return $this-&gt;done();  
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

## Nota: hasColumn() en lugar de property_exists()

Los campos añadidos mediante extensiones de modelo no son propiedades declaradas en la clase, sino que se inyectan dinámicamente. Por eso `property_exists()` siempre devuelve `false` aunque el campo exista. Usa `hasColumn()`:

```php
if (false === $doc-&gt;hasColumn(&#39;micampo&#39;)) {
    return $this-&gt;done();
}
```

## Ejemplo completo

Añade un cargo por gestión de 5 € a cualquier documento que tenga líneas.

`Init.php`:

```php
&lt;?php

namespace FacturaScripts\Plugins\TestPlugin;

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

`Mod/CalculatorMod.php`:

```php
&lt;?php

namespace FacturaScripts\Plugins\TestPlugin\Mod;

use FacturaScripts\Core\Template\CalculatorModClass;
use FacturaScripts\Core\Model\Base\BusinessDocument;
use FacturaScripts\Core\Model\Base\BusinessDocumentLine;

class CalculatorMod extends CalculatorModClass
{
    public function apply(BusinessDocument $doc, array &$lines): string
    {
        return $this-&gt;done();
    }

    public function calculateLine(BusinessDocument $doc, BusinessDocumentLine $line): string
    {
        return $this-&gt;done();
    }

    public function calculate(BusinessDocument $doc, array &$lines): string
    {
        return $this-&gt;done();
    }

    public function clear(BusinessDocument $doc, array &$lines): string
    {
        return $this-&gt;done();
    }

    public function accumulateSubtotals(array &$subtotals, BusinessDocument $doc, array &$lines): string
    {
        return $this-&gt;done();
    }

    public function updateSubtotals(array &$subtotals, BusinessDocument $doc, array $lines): string
    {
        // Cargo por gestión de 5 € en todos los documentos con líneas
        if (count($lines) &gt; 0) {
            $subtotals[&#39;neto&#39;] += 5.0;
            $subtotals[&#39;total&#39;] += 5.0;
        }

        return $this-&gt;done();
    }

    public function save(BusinessDocument $doc, array &$lines): string
    {
        return $this-&gt;done();
    }
}
```