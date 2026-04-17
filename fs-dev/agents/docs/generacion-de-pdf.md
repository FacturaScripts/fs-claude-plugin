---
id: 921
permalink: generacion-de-pdf
title: Generación de PDF y Excel
creationdate: 08-05-2021 12:11:57
lastmod: 05-12-2025
url: https://facturascripts.com/generacion-de-pdf
---
Podemos usar la clase **ExportManager** para crear archivos PDF o Excel destinados a diversos fines, como albaranes, facturas, pedidos, o presupuestos, así como para generar listados personalizados.

### 1. Ejemplo: Imprimir una factura en PDF
Usaremos la clase ``ExportManager`` para generar un PDF con la factura.

```
use FacturaScripts\Dinamic\Lib\ExportManager;

// Creamos una instancia de FacturaCliente
$factura = new FacturaCliente();

// Cargamos los datos de la factura con código 123
if ($factura-&gt;loadFromCode(123)) {
	// La factura 123 existe
	
	// Creamos una instancia de ExportManager
	$export = new ExportManager();
	$export-&gt;newDoc(&#39;PDF&#39;);
	
	// Añadimos una página con la factura utilizando el método addBusinessDocPage()
	$export-&gt;addBusinessDocPage($factura);
	
	// Obtenemos el contenido del PDF generado
	$pdfContent = $export-&gt;getDoc();
	
	// Podemos almacenar el PDF según sea necesario
	if (file_put_contents(&#39;nombre_del_archivo.pdf&#39;, $pdfContent)) {
		// Archivo PDF generado correctamente
	} else {
		// Ha ocurrido un error al guardar el archivo PDF
	}
	
	// Si estamos en un controlador, podemos devolver el PDF directamente al navegador
	$this-&gt;setTemplate(false);
	$export-&gt;show($this-&gt;response);
}
```

### 2. Ejemplo: Imprimir un listado en Excel
Podemos usar la clase ExportManager para generar un Excel e incluirle un listado.

```
use FacturaScripts\Dinamic\Lib\ExportManager;

// Creamos una instancia de ExportManager
$export = new ExportManager();
$export-&gt;newDoc(&#39;XLS&#39;);

// Obtenemos todos los clientes
$clientes = Cliente::all();

// Configuramos las columnas del listado de clientes
$columns = [&#39;Código&#39;, &#39;Nombre&#39;, &#39;Teléfono&#39;, &#39;Email&#39;];

// Creamos un array para almacenar las filas de datos de clientes
$rows = [];

// Recorremos todos los clientes y agregamos sus datos a las filas
foreach ($clientes as $cliente) {
    $rows[] = [$cliente-&gt;codcliente, $cliente-&gt;nombre, $cliente-&gt;telefono1, $cliente-&gt;email];
}

// Agregamos una página con una tabla que enumera los datos de los clientes
$export-&gt;addTablePage($columns, $rows, [], &#39;Listado de Clientes&#39;);

// Si estamos en un controlador, podemos devolver el PDF directamente al navegador
$this-&gt;setTemplate(false);

// devolvemos el Excel al navegador
$export-&gt;show($this-&gt;response);
```

## Crear un PDF, Excel o CSV
Con la clase ``ExportManager``, podemos crear PDFs, Excel o archivos csv. Solamente debemos indicar el tipo al llamar al método ``newDoc()``:

```
$export = new ExportManager();
$export-&gt;newDoc(&#39;PDF&#39;); // XLS para Excel y CSV para archivos csv
```

### Añadir una factura, albarán, pedido o presupuesto
Con la función ``addBusinessDocPage()`` de la clase ``ExportManager`` podemos añadir al PDF o Excel un documento de compra o venta.

```
// cargamos un pedido
$pedido = new PedidoCliente(),
$pedido-&gt;loadFromCode(1234);

// añadimos el pedido al ExportManager
$export-&gt;addBusinessDocPage($pedido);
```

### Añadir otros modelos
Con el método ``addModelPage()`` de la clase ``ExportManager`` podemos añadir cualquier modelo al PDF o Excel. Nos mostrará todas sus propiedades con sus valores, de forma muy genérica.

```
// cargamos un producto
$producto = new Producto(),
$producto-&gt;loadFromCode(1234);

// añadimos el producto al ExportManager
$export-&gt;addModelPage($producto);
```

### Añadimos un listado de un modelo
Con el método ``addListModelPage()`` de la clase ``ExportManager`` podemos añadir un listado de registros de un mismo modelo. Por ejemplo: un listado de productos.

```
$model = new Producto();
$where = [];
$orderBy = [];
$offset = 0;
$manager-&gt;addModelPage($model, $where, $orderBy, $offset);
```

### Añadir una tabla
Para añadir una tabla al PDF o Excel podemos usar el método ``addTablePage()`` de la clase ``ExportManager``.

```
$manager-&gt;addTablePage($headers, $rows);
```
