---
id: 1366
permalink: formularios-de-edicion-de-facturas-albaranes-etc
title: Formularios de edición de facturas, albaranes, etc
creationdate: 24-01-2023 10:57:37
lastmod: 18-03-2026
url: https://facturascripts.com/formularios-de-edicion-de-facturas-albaranes-etc
---
Los formularios de edición de facturas, albaranes, pedidos y presupuestos son respectivamente `PurchaseController` o `SalesController`, en función de si son de compras o ventas:

- Los formularios de compras heredan de la clase `PurchaseController`.
- Los formularios de venta heredan de la clase `SalesController`.

Para añadir campos o modificarlos en estas clases, se implementarán del mismo modo ya sean documentos de venta o compra. En este ejemplo elegiremos documentos de venta.

## Añadir columnas a la cabecera o pie
Para añadir una columna a la cabecer o pié del formuario debemos crear una clase que implemente uno de estos dos contratos, ya sea para documentos de venta o de compras:

- `FacturaScripts\Core\Contract\SalesModInterface`
- `FacturaScripts\Core\Contract\PurchasesModInterface`

Por convención se llamará `SalesHeaderHTMLMod` o `PurchasesHeaderHTMLMod` y se ubicará en el directorio `Mod` del plugin.

Para añadir una columna a la cabecera, registraremos un nuevo campo e implementaremos el html de ese input:

```php
public function newFields(): array
{
    return [&#39;pruebaNewFields&#39;];
}

public function renderField(SalesDocument $model, string $field): ?string
{
    if ($field == &#39;pruebaNewFields&#39;) {
        return static::pruebaNewFields($model);
    }

    return null;
}

private static function pruebaNewFields(SalesDocument $model): string
{
    $html = &#39;&lt;div class=&quot;col-sm&quot;&gt;&lt;div class=&quot;form-group&quot;&gt;&#39;;
    $html .= &#39;pruebaNewFields&lt;input class=&quot;form-control&quot; type=&quot;text&quot; name=&quot;pruebaNewFields&quot; placeholder=&quot;opcional&quot; value=&quot;&quot;&gt;&#39;;
    $html .= &#39;&lt;/div&gt;&lt;/div&gt;&#39;;

    return $html;
}
```

![campo añadido a cabecera](/MyFiles/2024/11/2386.png?myft=2ceb7473f8390a5e0ec7525e189a494606175b28)

### Añadir columna al modal detalles
Para añadir una columna al modal &quot;Detalle&quot;, registraremos un nuevo campo e implementaremos el html de ese input:

```php
public function newModalFields(): array
{
    return [&#39;pruebaNewModalFields&#39;];
}

public function renderField(SalesDocument $model, string $field): ?string
{
    if ($field == &#39;pruebaNewModalFields&#39;) {
        return static::pruebaNewModalFields($model);
    }

    return null;
}

private static function pruebaNewModalFields(SalesDocument $model): string
{
    $html = &#39;&lt;div class=&quot;col-sm&quot;&gt;&lt;div class=&quot;form-group&quot;&gt;&#39;;
    $html .= &#39;pruebaNewModalFields&lt;input class=&quot;form-control border-danger&quot; type=&quot;text&quot; name=&quot;pruebaNewModalFields&quot; placeholder=&quot;opcional&quot; value=&quot;&quot;&gt;&#39;;
    $html .= &#39;&lt;/div&gt;&lt;/div&gt;&#39;;

    return $html;
}
```

![campo añadido a ventana detalles](/MyFiles/2024/11/2387.png?myft=06d9e15d5755c6b99c23b478fb6f694ef19cd58f)

### Añadir botones
Para añadir &#39;botones&#39; o &#39;input select&#39; a la cabecera, igualmente debemos registrar el botón como nuevo campo e implementar el html:

```php
public function newBtnFields(): array
{
    return [&#39;pruebaNewBtnFields&#39;];
}

public function renderField(SalesDocument $model, string $field): ?string
{
    if ($field == &#39;pruebaNewBtnFields&#39;) {
        return static::pruebaNewBtnFields($model);
    }

    return null;
}

private static function pruebaNewBtnFields(SalesDocument $model): string
{
    $html = &#39;&lt;div class=&quot;col-sm-auto&quot;&gt;&lt;div class=&quot;form-group&quot;&gt;&#39;;
    $html .= &#39;&lt;button type=&quot;button&quot; class=&quot;btn btn-danger&quot;&gt;pruebaNewBtnFields&lt;/button&gt;&#39;;
    $html .= &#39;&lt;/div&gt;&lt;/div&gt;&#39;;

    return $html;
}
```

![añadir botón cabecera](/MyFiles/2024/11/2388.png?myft=f5b11295a92a66c4707a7c28857433cf6a4954db)

En los metodos `newFields()`, `newModalFields()`, `newBtnFields()` se podrá retornar varios campos a renderizar, por ejemplo:

```php
public function newFields(): array
{
    return [&#39;campo1&#39;, &#39;campo2&#39;];
}
```

En los métodos `apply()` y `applyBefore()`, obtendriamos los datos de los nuevos campos que hemos añadido para poder guardarlos en nuestro modelo.

```
public function apply(SalesDocument &$model, array $formData): void
{
	$model-&gt;pruebaNewFields = $formData[&#39;pruebaNewFields&#39;];
	$model-&gt;pruebaNewModalFields = $formData[&#39;pruebaNewModalFields&#39;];
}
```

El código completo de esta clase de ejemplo sería el siguiente:

```php
class SalesHeaderHTMLMod implements SalesModInterface
{

    public function apply(SalesDocument &$model, array $formData): void
    {
        $model-&gt;pruebaNewFields = $formData[&#39;pruebaNewFields&#39;];
				$model-&gt;pruebaNewModalFields = $formData[&#39;pruebaNewModalFields&#39;];
    }

    public function applyBefore(SalesDocument &$model, array $formData): void
    {
        // TODO: Implement applyBefore() method.
    }

    public function assets(): void
    {
        // TODO: Implement assets() method.
    }

    public function newFields(): array
    {
        return [&#39;pruebaNewFields&#39;];
    }

    public function newModalFields(): array
    {
        return [&#39;pruebaNewModalFields&#39;];
    }

    public function newBtnFields(): array
    {
        return [&#39;pruebaNewBtnFields&#39;];
    }

    public function renderField(SalesDocument $model, string $field): ?string
    {
        if ($field == &#39;pruebaNewFields&#39;) {
            return static::pruebaNewFields($model);
        }

        if ($field == &#39;pruebaNewModalFields&#39;) {
            return static::pruebaNewModalFields($model);
        }

        if ($field == &#39;pruebaNewBtnFields&#39;) {
            return static::pruebaNewBtnFields($model);
        }

        return null;
    }

    private static function pruebaNewFields(SalesDocument $model): string
    {
        $html = &#39;&lt;div class=&quot;col-sm&quot;&gt;&lt;div class=&quot;form-group&quot;&gt;&#39;;
        $html .= &#39;pruebaNewFields&lt;input class=&quot;form-control border-danger&quot; type=&quot;text&quot; name=&quot;pruebaNewFields&quot; placeholder=&quot;opcional&quot; value=&quot;&quot;&gt;&#39;;
        $html .= &#39;&lt;/div&gt;&lt;/div&gt;&#39;;

        return $html;
    }

    private static function pruebaNewModalFields(SalesDocument $model): string
    {
        $html = &#39;&lt;div class=&quot;col-sm&quot;&gt;&lt;div class=&quot;form-group&quot;&gt;&#39;;
        $html .= &#39;pruebaNewModalFields&lt;input class=&quot;form-control border-danger&quot; type=&quot;text&quot; name=&quot;pruebaNewModalFields&quot; placeholder=&quot;opcional&quot; value=&quot;&quot;&gt;&#39;;
        $html .= &#39;&lt;/div&gt;&lt;/div&gt;&#39;;

        return $html;
    }

    private static function pruebaNewBtnFields(SalesDocument $model): string
    {
        $html = &#39;&lt;div class=&quot;col-sm-auto&quot;&gt;&lt;div class=&quot;form-group&quot;&gt;&#39;;
        $html .= &#39;&lt;button type=&quot;button&quot; class=&quot;btn btn-danger&quot;&gt;pruebaNewBtnFields&lt;/button&gt;&#39;;
        $html .= &#39;&lt;/div&gt;&lt;/div&gt;&#39;;

        return $html;
    }
}
```


## Añadir columnas a las líneas

Para añadir o modificar columnas en las líneas de los formularios debemos crear una clase que implemente uno de estos contratos, ya sea para documentos de venta o de compras:

- `FacturaScripts\Core\Contract\SalesLineModInterface`
- `FacturaScripts\Core\Contract\PurchasesLineModInterface`

Por convención se llamará `SalesLineHTMLMod` o `PurchasesLineHTMLMod` y se ubicará en el directorio `Mod` del plugin.

Para añadir una columna a la línea, registraremos un nuevo campo e implementaremos el html de ese input:

```php
public function newFields(): array
{
    return [&#39;pruebaNewFields&#39;];
}

public function newTitles(): array
{
	return [&#39;pruebaNewFields&#39;];
}

public function renderField(string $idlinea, SalesDocumentLine $line, SalesDocument $model, string $field): ?string
{
    if ($field == &#39;pruebaNewFields&#39;) {
        return static::pruebaNewFields($idlinea, $line, $model);
    }

    return null;
}

public function renderTitle(SalesDocument $model, string $field): ?string
{
    if ($field == &#39;pruebaNewFields&#39;) {
        return static::pruebaNewFieldsTitle();
    }

    return null;
}

private static function pruebaNewFields(string $idlinea, SalesDocumentLine $line, SalesDocument $model): string
{
    $html = &#39;&lt;div class=&quot;col-sm col-lg-1 order-2&quot;&gt;&#39;;
		$html .= &#39;&lt;div class=&quot;d-lg-none mt-3 small&quot;&gt;Prueba&lt;/div&gt;&#39;;
    $html .= &#39;&lt;input class=&quot;form-control&quot; type=&quot;text&quot; name=&quot;pruebaNewFields_&#39; . $idlinea . &#39;&quot; value=&quot;&#39; . $line-&gt;pruebaNewFields . &#39;&quot;&gt;&#39;;
    $html .= &#39;&lt;/div&gt;&#39;;

    return $html;
}

private function pruebaNewFieldsTitle(): string
{
        return &#39;&lt;div class=&quot;col-lg-1 order-2&quot;&gt;Prueba&lt;/div&gt;&#39;;
}
```

**Nota**: Podemos decidir en que orden aparece la columna con la clase `order-1`, `order-2`, `order-3`, hasta llegar a `order-12`. Debemos colocar tanto al renderiar la columna como en el título de la columna.

![campo añadido a la linea](/MyFiles/2024/11/2389.png?myft=88deeca662eec61c73c4871220ebe6c972613d74)

### Botón 3 puntos
Para añadir una columna al modal de la línea &quot;...&quot;, registraremos un nuevo campo e implementaremos el html de ese input:

```php
public function newModalFields(): array
{
    return [&#39;pruebaNewModalFields&#39;];
}

public function renderField(string $idlinea, SalesDocumentLine $line, SalesDocument $model, string $field): ?string
{
    if ($field == &#39;pruebaNewModalFields&#39;) {
        return static::pruebaNewModalFields($idlinea, $line, $model);
    }

    return null;
}

private static function pruebaNewModalFields(string $idlinea, SalesDocumentLine $line, SalesDocument $model): string
{
    $html = &#39;&lt;div class=&quot;col-6&quot;&gt;&lt;div class=&quot;mb-2&quot;&gt;&#39;;
    $html .= &#39;pruebaNewModalFields&lt;input class=&quot;form-control border-danger&quot; type=&quot;text&quot; name=&quot;pruebaNewModalFields_&#39; . $idlinea . &#39;&quot; value=&quot;&#39; . $line-&gt;pruebaNewModalFields . &#39;&quot;&gt;&#39;;
    $html .= &#39;&lt;/div&gt;&lt;/div&gt;&#39;;

    return $html;
}
```

Con la función `map()` podemos conseguir que se actualicen los datos de una columna en especial al editar la línea, sin perder el foco del cursor de la misma línea.

```
public function map(array $lines, SalesDocument $model): array
{
	$map = [];
	$num = 0;
	foreach ($lines as $line) {
		$num++;
		$idlinea = $line-&gt;idlinea ?? &#39;n&#39; . $num;
		$map[&#39;pruebaNewFields_&#39; . $idlinea] = &#39;aquí hacemos nuestro cálculo&#39;;
	}
	return $map;
}
```

En los métodos `apply()` y `applyToLine()`, obtendriamos los datos de los nuevos campos que hemos añadido para poder guardarlos en nuestro modelo.

```
public function applyToLine(array $formData, SalesDocumentLine &$line, string $id): void
{
	$line-&gt;alto = $formData[&#39;pruebaNewFields_&#39; . $id];
	$line-&gt;alto = $formData[&#39;pruebaNewModalFields_&#39; . $id];
}
```

![campo añadido al modal de la linea](/MyFiles/2024/11/2390.png?myft=a42e2d572c158cbd62778e6b99ef223bd378f894)

El código completo de esta clase de ejemplo sería el siguiente:

```php
class SalesLineMod implements SalesLineModInterface
{

	public function apply(SalesDocument &$model, array &$lines, array $formData): void
	{
	}

	public function applyToLine(array $formData, SalesDocumentLine &$line, string $id): void
	{
			$line-&gt;alto = $formData[&#39;pruebaNewFields_&#39; . $id];
			$line-&gt;alto = $formData[&#39;pruebaNewModalFields_&#39; . $id];
	}

	public function assets(): void
	{
			// TODO: Implement assets() method.
	}
		
	public function getFastLine(SalesDocument $model, array $formData): ?SalesDocumentLine
	{
			return null;
	}
		
	public function map(array $lines, SalesDocument $model): array
	{
			$map = [];
			$num = 0;
			foreach ($lines as $line) {
				$num++;
				$idlinea = $line-&gt;idlinea ?? &#39;n&#39; . $num;
				$map[&#39;pruebaNewFields_&#39; . $idlinea] = &#39;aquí hacemos nuestro cálculo&#39;;
			}
		return $map;
	}

	public function newFields(): array
	{
			return [&#39;pruebaNewFields&#39;];
	}

	public function newModalFields(): array
	{
			return [&#39;pruebaNewModalFields&#39;];
	}

	public function newTitles(): array
	{
			return [&#39;pruebaNewFields&#39;];
	}

	public function renderField(string $idlinea, SalesDocumentLine $line, SalesDocument $model, string $field): ?string
	{
			if ($field == &#39;pruebaNewFields&#39;) {
					return static::pruebaNewFields($idlinea, $line, $model);
			}
		
			if ($field == &#39;pruebaNewModalFields&#39;) {
					return static::pruebaNewModalFields($idlinea, $line, $model);
			}
		
			return null;
	}
		
	public function renderTitle(SalesDocument $model, string $field): ?string
	{
		if ($field == &#39;pruebaNewFields&#39;) {
			return static::pruebaNewFieldsTitle();
		}
		
		return null;
	}
	
	private static function pruebaNewFields(string $idlinea, SalesDocumentLine $line, SalesDocument $model): string
	{
		$html = &#39;&lt;div class=&quot;col-sm col-lg-1 order-2&quot;&gt;&#39;;
		$html .= &#39;&lt;div class=&quot;d-lg-none mt-3 small&quot;&gt;Prueba&lt;/div&gt;&#39;;
		$html .= &#39;&lt;input class=&quot;form-control&quot; type=&quot;text&quot; name=&quot;pruebaNewFields_&#39; . $idlinea . &#39;&quot; value=&quot;&#39; . $line-&gt;pruebaNewFields . &#39;&quot;&gt;&#39;;
		$html .= &#39;&lt;/div&gt;&#39;;
		return $html;
	}
	
	private function pruebaNewFieldsTitle(): string
	{
		return &#39;&lt;div class=&quot;col-lg-1 order-2&quot;&gt;Prueba&lt;/div&gt;&#39;;
	}
	
	private static function pruebaNewModalFields(string $idlinea, SalesDocumentLine $line, SalesDocument $model): string
	{
		$html = &#39;&lt;div class=&quot;col-6&quot;&gt;&lt;div class=&quot;mb-2&quot;&gt;&#39;;
		$html .= &#39;pruebaNewModalFields&lt;input class=&quot;form-control border-danger&quot; type=&quot;text&quot; name=&quot;pruebaNewModalFields_&#39; . $idlinea . &#39;&quot; value=&quot;&#39; . $line-&gt;pruebaNewModalFields . &#39;&quot;&gt;&#39;;
		$html .= &#39;&lt;/div&gt;&lt;/div&gt;&#39;;
		return $html;
	}
}
```


## Modificar los cálculos
Para modificar los cálculos de totales y subtotales de los albaranes, factura, etc ...  debemos crear una clase que implemente el [CalculatorModInterface](https://facturascripts.com/publicaciones/como-modificar-el-calculator-desde-un-plugin).

## Archivo Init
Todos los archivos añadidos al Mod de los docuementos, ya sean de compra o venta, se deben añadir al archivo init para cargalos en la ejecución.

```
use FacturaScripts\Core\Template\InitClass;
use FacturaScripts\Core\Lib\AjaxForms\PurchasesHeaderHTML;
use FacturaScripts\Core\Lib\AjaxForms\PurchasesLineHTML;
use FacturaScripts\Core\Lib\AjaxForms\PurchasesFooterHTML;
use FacturaScripts\Core\Lib\AjaxForms\SalesHeaderHTML;
use FacturaScripts\Core\Lib\AjaxForms\SalesLineHTML;
use FacturaScripts\Core\Lib\AjaxForms\SalesFooterHTML;


class Init extends InitClass
{
    public function init()
    {
        PurchasesHeaderHTML::addMod(new Mod\PurchasesHeaderMod());
        PurchasesLineHTML::addMod(new Mod\PurchasesLineMod());
        PurchasesFooterHTML::addMod(new Mod\PurchasesFooterMod());
        SalesHeaderHTML::addMod(new Mod\SalesHeaderMod());
        SalesLineHTML::addMod(new Mod\SalesLineMod());
        SalesFooterHTML::addMod(new Mod\SalesFooterMod());
    }

    public function uninstall(): void
    {
    }

    public function update(): void
    {
    }
}
```
