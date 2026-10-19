---
name: mods
description: Guía para escribir y registrar un Mod concreto de FacturaScripts (cabecera, pie, líneas o Calculator) en los formularios de presupuestos, pedidos, albaranes y facturas.
---

# Skill: Mods en FacturaScripts

Los **mods** modifican el formulario de los documentos de compra y venta (presupuestos, pedidos, albaranes y facturas) y sus cálculos. Actúan en la parte del controlador y de la interfaz (HTML generado por AJAX), no en el modelo (`formularios-de-edicion-de-facturas-albaranes-etc.md`).

> **No confundir con las extensiones:**
> - **Mods**: campos y comportamiento del formulario del documento, y cálculo de totales.
> - **Extensiones de modelos**: comportamiento del modelo en cualquier contexto (guardado, borrado, validación...).

## Documentos afectados

| Tipo | Ventas | Compras |
|------|--------|---------|
| Presupuestos | `PresupuestoCliente` | `PresupuestoProveedor` |
| Pedidos | `PedidoCliente` | `PedidoProveedor` |
| Albaranes | `AlbaranCliente` | `AlbaranProveedor` |
| Facturas | `FacturaCliente` | `FacturaProveedor` |

## Tipos de mod

Las interfaces están en `FacturaScripts\Core\Contract` y las clases de registro en `FacturaScripts\Core\Lib\AjaxForms`:

| Zona | Interfaz o clase base | Registrar en |
|------|-----------------------|--------------|
| Cabecera ventas | `SalesModInterface` | `SalesHeaderHTML::addMod()` |
| Pie ventas | `SalesModInterface` | `SalesFooterHTML::addMod()` |
| Líneas ventas | `SalesLineModInterface` | `SalesLineHTML::addMod()` |
| Cabecera compras | `PurchasesModInterface` | `PurchasesHeaderHTML::addMod()` |
| Pie compras | `PurchasesModInterface` | `PurchasesFooterHTML::addMod()` |
| Líneas compras | `PurchasesLineModInterface` | `PurchasesLineHTML::addMod()` |
| Cálculos | `FacturaScripts\Core\Template\CalculatorModClass` | `FacturaScripts\Core\Lib\Calculator::addMod()` |

`CalculatorModInterface` está obsoleta desde 2026: extiende `CalculatorModClass`.

Usa una clase distinta para la cabecera y otra para el pie. El core ejecuta `apply()` y pinta `newFields()` en las dos zonas, así que registrar la misma clase en ambas duplica el campo y aplica los datos dos veces.

## Generar con fsmaker

```bash
fsmaker mod
```

fsmaker pregunta el tipo de mod (Calculator, cabecera, líneas o pie) y genera el archivo base en `Mod/`.

## Estructura de archivos

```
Plugins/MiPlugin/
├── Init.php
└── Mod/
    ├── SalesHeaderMod.php
    ├── SalesFooterMod.php
    ├── SalesLineMod.php
    ├── PurchasesHeaderMod.php
    ├── PurchasesLineMod.php
    └── CalculatorMod.php
```

## Ejemplo: mod de cabecera de ventas

Implementa `SalesModInterface` (o `PurchasesModInterface`, con `PurchaseDocument`):

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Mod;

use FacturaScripts\Core\Contract\SalesModInterface;
use FacturaScripts\Core\Model\Base\SalesDocument;
use FacturaScripts\Core\Tools;

class SalesHeaderMod implements SalesModInterface
{
    // Después de aplicar los datos estándar del formulario
    public function apply(SalesDocument &$model, array $formData): void
    {
        if (isset($formData['mi_campo'])) {
            $model->mi_campo = Tools::noHtml($formData['mi_campo']);
        }
    }

    // Antes de aplicar los datos estándar del formulario
    public function applyBefore(SalesDocument &$model, array $formData): void
    {
    }

    // CSS/JS adicionales (AssetManager)
    public function assets(): void
    {
    }

    // Botones o selectores de la cabecera
    public function newBtnFields(): array
    {
        return [];
    }

    // Campos nuevos de la cabecera (o del pie, si se registra en SalesFooterHTML)
    public function newFields(): array
    {
        return ['mi_campo'];
    }

    // Campos nuevos del modal «Detalle»
    public function newModalFields(): array
    {
        return [];
    }

    // HTML de cada campo; null si este mod no lo gestiona
    public function renderField(SalesDocument $model, string $field): ?string
    {
        if ($field !== 'mi_campo') {
            return null;
        }

        return '<div class="col-sm-3"><div class="mb-2">' . Tools::trans('my-field')
            . '<input type="text" name="mi_campo" class="form-control" value="'
            . htmlspecialchars((string)($model->mi_campo ?? '')) . '"/>'
            . '</div></div>';
    }
}
```

## Ejemplo: mod de líneas de ventas

Implementa `SalesLineModInterface`. Para compras, `PurchasesLineModInterface` usa `PurchaseDocument` y `BusinessDocumentLine`. Los campos llevan el sufijo `_{idlinea}`, y el HTML usa `div` con clases de rejilla y `order-1` a `order-12`, tanto en el campo como en el título:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Mod;

use FacturaScripts\Core\Contract\SalesLineModInterface;
use FacturaScripts\Core\Model\Base\SalesDocument;
use FacturaScripts\Core\Model\Base\SalesDocumentLine;
use FacturaScripts\Core\Tools;

class SalesLineMod implements SalesLineModInterface
{
    public function apply(SalesDocument &$model, array &$lines, array $formData): void
    {
    }

    public function applyToLine(array $formData, SalesDocumentLine &$line, string $id): void
    {
        $line->mi_campo_linea = Tools::noHtml($formData['mi_campo_linea_' . $id] ?? $line->mi_campo_linea);
    }

    public function assets(): void
    {
    }

    // Línea personalizada para la búsqueda rápida; null para la estándar
    public function getFastLine(SalesDocument $model, array $formData): ?SalesDocumentLine
    {
        return null;
    }

    // Mapa nombre_del_campo => valor que se refresca sin perder el foco
    public function map(array $lines, SalesDocument $model): array
    {
        $map = [];
        $num = 0;
        foreach ($lines as $line) {
            $num++;
            $idlinea = $line->idlinea ?? 'n' . $num;
            $map['mi_campo_linea_' . $idlinea] = $line->mi_campo_linea;
        }
        return $map;
    }

    public function newFields(): array
    {
        return ['mi_campo_linea'];
    }

    // Campos del modal «...» de la línea
    public function newModalFields(): array
    {
        return [];
    }

    public function newTitles(): array
    {
        return ['mi_campo_linea'];
    }

    public function renderField(string $idlinea, SalesDocumentLine $line, SalesDocument $model, string $field): ?string
    {
        if ($field !== 'mi_campo_linea') {
            return null;
        }

        return '<div class="col-sm col-lg-1 order-2">'
            . '<div class="d-lg-none mt-3 small">' . Tools::trans('my-line-field') . '</div>'
            . '<input type="text" name="mi_campo_linea_' . $idlinea . '" class="form-control" value="'
            . htmlspecialchars((string)($line->mi_campo_linea ?? '')) . '"/>'
            . '</div>';
    }

    public function renderTitle(SalesDocument $model, string $field): ?string
    {
        if ($field !== 'mi_campo_linea') {
            return null;
        }

        return '<div class="col-lg-1 order-2">' . Tools::trans('my-line-field') . '</div>';
    }
}
```

Para guardar `mi_campo` y `mi_campo_linea`, añade las columnas con extensiones de tabla (`Extension/Table/facturascli.xml`, `Extension/Table/lineasfacturascli.xml`, etc.).

## Ejemplo: mod de cálculos

Extiende `CalculatorModClass` con las firmas exactas del core (`como-modificar-el-calculator-desde-un-plugin.md`). Solo hace falta sobrescribir los métodos que uses:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Mod;

use FacturaScripts\Core\Model\Base\BusinessDocument;
use FacturaScripts\Core\Model\Base\BusinessDocumentLine;
use FacturaScripts\Core\Template\CalculatorModClass;

class CalculatorMod extends CalculatorModClass
{
    // Pone los totales a cero o a su valor inicial
    public function clear(BusinessDocument $doc, array &$lines): string
    {
        return $this->done();
    }

    // Aplica configuraciones o precarga datos
    public function apply(BusinessDocument $doc, array &$lines): string
    {
        return $this->done();
    }

    // Recalcula una línea
    public function calculateLine(BusinessDocument $doc, BusinessDocumentLine $line): string
    {
        return $this->done();
    }

    // Modifica los subtotales
    public function updateSubtotals(array &$subtotals, BusinessDocument $doc, array $lines): string
    {
        if (count($lines) > 0) {
            $subtotals['neto'] += 5.0;
            $subtotals['total'] += 5.0;
        }
        return $this->done();
    }

    // Recalcula los totales del documento
    public function calculate(BusinessDocument $doc, array &$lines): string
    {
        return $this->done();
    }
}
```

- También existen `accumulateSubtotals(array &$subtotals, BusinessDocument $doc, array &$lines)` y `save(BusinessDocument $doc, array &$lines)`.
- Devuelve `$this->done()` para continuar, `$this->stopMods()` para saltar los demás mods de la fase o `$this->stopAll()` para cancelar el cálculo.
- Para los campos añadidos por extensiones usa `$doc->hasColumn('campo')`, no `property_exists()`.

## Registro en Init.php

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Lib\AjaxForms\PurchasesHeaderHTML;
use FacturaScripts\Core\Lib\AjaxForms\PurchasesLineHTML;
use FacturaScripts\Core\Lib\AjaxForms\SalesFooterHTML;
use FacturaScripts\Core\Lib\AjaxForms\SalesHeaderHTML;
use FacturaScripts\Core\Lib\AjaxForms\SalesLineHTML;
use FacturaScripts\Core\Lib\Calculator;
use FacturaScripts\Core\Template\InitClass;

class Init extends InitClass
{
    public function init(): void
    {
        SalesHeaderHTML::addMod(new Mod\SalesHeaderMod());
        SalesFooterHTML::addMod(new Mod\SalesFooterMod());
        SalesLineHTML::addMod(new Mod\SalesLineMod());
        PurchasesHeaderHTML::addMod(new Mod\PurchasesHeaderMod());
        PurchasesLineHTML::addMod(new Mod\PurchasesLineMod());
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

## Cuándo usar mods o extensiones de modelo

| Necesidad | Solución |
|-----------|----------|
| Añadir un campo en la cabecera o el pie de una factura | Mod con `SalesModInterface` + extensión de tabla |
| Añadir una columna en las líneas de un pedido | Mod con `SalesLineModInterface` + extensión de tabla |
| Modificar los cálculos de totales | Mod con `CalculatorModClass` |
| Añadir lógica al guardar el modelo en cualquier contexto | Extensión de modelo |
| Validar o impedir el guardado o el borrado | Extensión de modelo (`testBefore`, `deleteBefore`...) |

## Para más información

Consulta la skill `fs-dev:docs-expert` para revisar la documentación oficial. Para cambios de lógica documental más amplios, usa `fs-dev:document-expert`.
