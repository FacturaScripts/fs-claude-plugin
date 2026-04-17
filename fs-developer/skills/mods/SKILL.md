---
name: mods
description: Explica cómo crear y registrar mods en FacturaScripts para modificar visualmente o en el controlador los documentos de compra y venta (presupuestos, pedidos, albaranes, facturas).
---

# Skill: Mods en FacturaScripts

Los **mods** permiten modificar el comportamiento visual y del controlador de los documentos de compra y venta: presupuestos, pedidos, albaranes y facturas. Se usan exclusivamente para la **parte del controlador y la interfaz de pantalla** (HTML renderizado dinámicamente vía AJAX).

> **Importante — no confundir con extensiones:**
> - **Mods** → modifican la parte del controlador (lo que se ve y procesa en pantalla en los documentos de compra/venta)
> - **Extensiones de modelos** → modifican el modelo en todo el entorno (guardado, cálculos, relaciones, etc.)

## Documentos afectados

| Tipo | Modelos de venta | Modelos de compra |
|------|-----------------|-------------------|
| Presupuestos | PresupuestoCliente | PresupuestoProveedor |
| Pedidos | PedidoCliente | PedidoProveedor |
| Albaranes | AlbaranCliente | AlbaranProveedor |
| Facturas | FacturaCliente | FacturaProveedor |

## Tipos de mod disponibles

| Tipo | Interfaz a implementar | Registrar en |
|------|----------------------|-------------|
| Cabecera ventas | `SalesModInterface` | `SalesHeaderHTML::addMod()` |
| Pie ventas | `SalesModInterface` | `SalesFooterHTML::addMod()` |
| Líneas ventas | `SalesLineModInterface` | `SalesLineHTML::addMod()` |
| Cabecera compras | `PurchasesModInterface` | `PurchasesHeaderHTML::addMod()` |
| Pie compras | `PurchasesModInterface` | `PurchasesFooterHTML::addMod()` |
| Líneas compras | `PurchasesLineModInterface` | `PurchasesLineHTML::addMod()` |
| Calculadora | `CalculatorModInterface` | `Calculator::addMod()` |

## Generar con fsmaker

```bash
fsmaker mod
```

fsmaker pregunta el tipo de mod (Sales, Purchases, Calculator, HTML Header, Line, Footer) y genera el archivo base en `Mod/`.

## Estructura de archivos

```
Plugins/MiPlugin/
├── Init.php
└── Mod/
    ├── SalesMod.php          # Cabecera/pie de ventas
    ├── SalesLineMod.php      # Líneas de ventas
    ├── PurchasesMod.php      # Cabecera/pie de compras
    ├── PurchasesLineMod.php  # Líneas de compras
    └── CalculatorMod.php     # Modificar cálculos
```

## Ejemplo: Mod de cabecera/pie de ventas

Implementa `SalesModInterface` (o `PurchasesModInterface` para compras):

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Mod;

use FacturaScripts\Core\Contract\SalesModInterface;
use FacturaScripts\Core\Model\Base\SalesDocument;

class SalesMod implements SalesModInterface
{
    // Se ejecuta ANTES de aplicar los datos del formulario al modelo
    public function applyBefore(SalesDocument &$model, array $formData): void
    {
    }

    // Se ejecuta DESPUÉS de aplicar los datos del formulario al modelo
    public function apply(SalesDocument &$model, array $formData): void
    {
        $model->mi_campo = $formData['mi_campo'] ?? $model->mi_campo;
    }

    // Carga assets (CSS/JS) adicionales
    public function assets(): void
    {
    }

    // Campos extra para los botones de acción
    public function newBtnFields(): array
    {
        return [];
    }

    // Nuevos campos en la cabecera o pie del documento
    public function newFields(): array
    {
        return ['mi_campo'];
    }

    // Nuevos campos en el modal del documento
    public function newModalFields(): array
    {
        return [];
    }

    // Renderiza el HTML de un campo concreto
    public function renderField(SalesDocument $model, string $field): ?string
    {
        if ($field === 'mi_campo') {
            return '<div class="col-sm-6">'
                . '<div class="form-group">'
                . '<label>Mi Campo</label>'
                . '<input type="text" name="mi_campo" value="' . $model->mi_campo . '" class="form-control">'
                . '</div>'
                . '</div>';
        }

        return null;
    }
}
```

## Ejemplo: Mod de líneas de ventas

Implementa `SalesLineModInterface` (o `PurchasesLineModInterface` para compras):

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Mod;

use FacturaScripts\Core\Contract\SalesLineModInterface;
use FacturaScripts\Core\Model\Base\SalesDocument;
use FacturaScripts\Core\Model\Base\SalesDocumentLine;

class SalesLineMod implements SalesLineModInterface
{
    // Aplica datos del formulario a todas las líneas
    public function apply(SalesDocument &$model, array &$lines, array $formData): void
    {
    }

    // Aplica datos a una línea concreta
    public function applyToLine(array $formData, SalesDocumentLine &$line, string $id): void
    {
        $line->mi_campo_linea = $formData['mi_campo_linea_' . $id] ?? $line->mi_campo_linea;
    }

    // Assets adicionales
    public function assets(): void
    {
    }

    // Para añadir lógica en la búsqueda rápida de líneas
    public function getFastLine(SalesDocument $model, array $formData): ?SalesDocumentLine
    {
        return null;
    }

    // Mapeo adicional de datos de líneas
    public function map(array $lines, SalesDocument $model): array
    {
        return $lines;
    }

    // Nuevos campos en las líneas
    public function newFields(): array
    {
        return ['mi_campo_linea'];
    }

    // Nuevos campos en el modal de líneas
    public function newModalFields(): array
    {
        return [];
    }

    // Nuevos títulos de columnas
    public function newTitles(): array
    {
        return ['mi_campo_linea'];
    }

    // Renderiza el HTML de un campo de línea
    public function renderField(string $idlinea, SalesDocumentLine $line, SalesDocument $model, string $field): ?string
    {
        if ($field === 'mi_campo_linea') {
            return '<td>'
                . '<input type="text" name="mi_campo_linea_' . $idlinea . '" value="' . $line->mi_campo_linea . '" class="form-control">'
                . '</td>';
        }

        return null;
    }

    // Renderiza el HTML del título de una columna
    public function renderTitle(SalesDocument $model, string $field): ?string
    {
        if ($field === 'mi_campo_linea') {
            return '<th>Mi Campo Línea</th>';
        }

        return null;
    }
}
```

## Paso clave: Registrar en Init.php

Los mods se registran en el método `init()` del `Init.php`:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Base\InitClass;
use FacturaScripts\Core\Lib\AjaxForms\SalesFooterHTML;
use FacturaScripts\Core\Lib\AjaxForms\SalesHeaderHTML;
use FacturaScripts\Core\Lib\AjaxForms\SalesLineHTML;
use FacturaScripts\Core\Lib\AjaxForms\PurchasesFooterHTML;
use FacturaScripts\Core\Lib\AjaxForms\PurchasesHeaderHTML;
use FacturaScripts\Core\Lib\AjaxForms\PurchasesLineHTML;
use FacturaScripts\Core\Lib\Calculator;

class Init extends InitClass
{
    public function init(): void
    {
        // Mod para cabecera de ventas
        SalesHeaderHTML::addMod(new Mod\SalesMod());

        // Mod para pie de ventas (misma clase si implementa SalesModInterface)
        SalesFooterHTML::addMod(new Mod\SalesMod());

        // Mod para líneas de ventas
        SalesLineHTML::addMod(new Mod\SalesLineMod());

        // Mod para cabecera de compras
        PurchasesHeaderHTML::addMod(new Mod\PurchasesMod());

        // Mod para pie de compras
        PurchasesFooterHTML::addMod(new Mod\PurchasesMod());

        // Mod para líneas de compras
        PurchasesLineHTML::addMod(new Mod\PurchasesLineMod());

        // Mod de calculadora
        Calculator::addMod(new Mod\CalculatorMod());
    }

    public function update(): void
    {
    }
}
```

## Ejemplo: Mod de calculadora

Para modificar los cálculos de totales y subtotales:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Mod;

use FacturaScripts\Core\Template\CalculatorModClass;
use FacturaScripts\Core\Model\Base\BusinessDocument;

class CalculatorMod extends CalculatorModClass
{
    // Precarga datos antes de calcular
    public function apply(BusinessDocument &$doc, array &$lines): bool
    {
        return true;
    }

    // Limpia/inicializa valores antes de recalcular
    public function clear(BusinessDocument &$doc, array &$lines): bool
    {
        return true;
    }

    // Recalcula el total del documento
    public function calculate(BusinessDocument &$doc, array &$lines): bool
    {
        // $doc->total = mi_cálculo;
        return true;
    }

    // Recalcula una línea individual
    public function calculateLine(BusinessDocument $doc, BusinessDocumentLine &$line): bool
    {
        // $line->pvptotal = mi_cálculo;
        return true;
    }

    // Modifica los subtotales mostrados
    public function getSubtotals(array &$subtotals, BusinessDocument $doc, array $lines)
    {
        // $subtotals['neto'] += 10;
        return true;
    }
}
```

## Cuándo usar mods vs extensiones de modelo

| Necesidad | Solución correcta |
|-----------|-------------------|
| Añadir un campo visual en la cabecera de una factura | Mod `SalesModInterface` |
| Añadir una columna en las líneas de un pedido | Mod `SalesLineModInterface` |
| Modificar los cálculos de totales | Mod `CalculatorModInterface` |
| Añadir lógica al guardar el modelo (en cualquier contexto) | Extensión de modelo |
| Modificar métodos del modelo (test, save, delete) | Extensión de modelo |
| Añadir relaciones entre modelos | Extensión de modelo |

## Para más información

Para consultar la documentación oficial completa sobre mods en documentos de compra/venta, invoca el agente **docs-expert** que te proporcionará detalles completos directamente desde la documentación oficial del framework.