---
id: 1601
permalink: la-cola-de-trabajos
title: La cola de trabajos
creationdate: 21-11-2023 23:26:04
lastmod: 17-03-2026
url: https://facturascripts.com/publicaciones/la-cola-de-trabajos
---
En ocasiones queremos ejecutar procesos en &quot;segundo plano&quot;, por ejemplo, actualizar el número de productos de una familia cuando se añade un producto. Este proceso no es fundamental, es decir, no necesitamos ese contador actualizado al momento de añadir el producto. Para este tipo de procesos usamos la cola de trabajos.

La cola de trabajos se ejecuta al final de cada ejecución. Es decir, cada vez que abrimos una página (como por ejemplo un producto o el listado de clientes), al final del proceso se procesa un evento de la cola. Por tanto estos trabajos en &quot;segundo plano&quot; se ejecutan al final y de uno en uno. Por eso se usa para procesos no fundamentales.

Además, cada ejecución de [el cron](https://facturascripts.com/publicaciones/el-cron-104) procesa un lote de eventos pendientes de la cola, por lo que con el cron configurado la cola avanza mucho más rápido.

## 🧩 Eventos y workers
La cola de trabajos se compone de eventos y workers. Cada vez que se añade un producto, cliente, etc, se lanza un evento. Por otro lado tenemos los workers, que son clases PHP registradas para &quot;escuchar&quot; estos eventos y procesar.

Tenga en cuenta que **un evento solamente se guarda en la cola si hay algún worker registrado que lo escuche**. Si lanzamos un evento que nadie escucha, se descarta y no aparecerá en la cola.

### Eventos de los modelos
Todos los modelos lanzan automáticamente eventos cuando se añade, modifica o elimina contenido. Por ejemplo:

- Cuando añadimos un producto se lanzan los eventos `Model.Producto.Insert` y `Model.Producto.Save`
- Cuando modificamos un producto se lanza el evento `Model.Producto.Update` y `Model.Producto.Save`
- Cuando eliminamos un producto se lanza el evento `Model.Producto.Delete`

Para otros modelos se lanzan los mismos eventos, pero con el nombre del modelo en cuestión.

### Lanzar eventos personalizados
Podemos lanzar un evento en cualquier momento llamando a `WorkQueue::send()`.

```php
// lanzamos el evento &#39;test-event&#39; con el valor &#39;test-value&#39;
WorkQueue::send(&#39;test-event&#39;, &#39;test-value&#39;);
```

La función devuelve true si el evento se ha guardado en la cola, y false si ningún worker lo escucha o está bloqueado. Si lanzamos el mismo evento con los mismos datos varias veces en la misma ejecución, solamente se encola una vez.

También podemos lanzar eventos para que se procesen pasados unos segundos llamando a `WorkQueue::sendFuture()`.

```php
// lanzamos el evento &#39;test-event&#39; para que se procese en 300 segundos (5 minutos)
WorkQueue::sendFuture(300, &#39;test-event&#39;, &#39;test-value&#39;);
```

## ⚙️ Workers
Los workers son clases PHP que se encuentran en la carpeta `Worker` y que podemos registrar en la cola de trabajos para procesar ciertos eventos. Este sería un ejemplo básico de worker:

```php
namespace FacturaScripts\Plugins\MiPlugin\Worker;

use FacturaScripts\Core\Model\WorkEvent;
use FacturaScripts\Core\Template\WorkerClass;

class MiWorker extends WorkerClass
{
	public function run(WorkEvent $event): bool
	{
		// tu código aquí
		
		return $this-&gt;done();
	}
}
```

La función `run()` debe devolver un booleano, y tiene dos ayudas para ello:

- `return $this-&gt;done();` : el worker ha terminado y los siguientes workers del evento pueden ejecutarse.
- `return $this-&gt;stopPropagation();` : el worker ha terminado y NO se ejecuta ningún worker más para este evento.

### Registrar un worker
Para hacer que un worker &quot;escuche&quot; un evento podemos llamar a `WorkQueue::addWorker()` en la función `init()` del [archivo Init.php](https://facturascripts.com/publicaciones/el-archivo-init-php-307) de nuestro plugin. En el siguiente ejemplo registraremos el worker MiWorker para que escuche el evento de cuando se modifica un producto.

```php
WorkQueue::addWorker(&#39;MiWorker&#39;, &#39;Model.Producto.Update&#39;);
```

Con esto conseguimos que nuestro worker se ejecute si se modifica algún producto. Podemos registrar un worker para muchos eventos, simplemente hay que registrarlo varias veces:

```php
WorkQueue::addWorker(&#39;MiWorker&#39;, &#39;Model.Producto.Insert&#39;);
WorkQueue::addWorker(&#39;MiWorker&#39;, &#39;Model.Producto.Delete&#39;);

// esta es otra opción
WorkQueue::addWorker(&#39;MiWorker&#39;, &#39;Model.Producto.*&#39;);
```

Incluso podemos hacer que escuche todos los eventos:

```php
WorkQueue::addWorker(&#39;MiWorker&#39;, &#39;*&#39;);
```

Si varios workers escuchan el mismo evento, podemos controlar el orden de ejecución con el tercer parámetro, `position`: los workers se ejecutan de menor a mayor posición (0 por defecto).

```php
WorkQueue::addWorker(&#39;MiWorker&#39;, &#39;Model.Producto.Update&#39;, -1); // este worker va antes que el resto
```

#### Eventos en el Init::update()
El método `Init::update()` de los plugins se ejecuta antes del `Init::init()`, por lo que si lanzas algún evento en el update, debes añadir los workers necesarios también en el update().

### Evitar bucles de eventos
En ocasiones queremos ejecutar un trabajo cuando se modifica un producto, y este trabajo modifica a su vez el producto, por lo que se crea un nuevo evento que desencadena un bucle infinito. Para evitar este problema, podemos desactivar la generación de ese evento en el propio worker llamando al método `preventNewEvents()`:

```php
namespace FacturaScripts\Plugins\MiPlugin\Worker;

use FacturaScripts\Core\Model\WorkEvent;
use FacturaScripts\Core\Template\WorkerClass;

class MiWorker extends WorkerClass
{
	public function run(WorkEvent $event): bool
	{
		// evitamos que se creen nuevos eventos de tipo Model.Producto.Save
		$this-&gt;preventNewEvents([&#39;Model.Producto.Save&#39;]);
		
		// tu código aquí
		
		return $this-&gt;done();
	}
}
```

Los eventos `Model.WorkEvent.*` están siempre bloqueados, precisamente para evitar bucles infinitos al guardar los propios eventos de la cola.

### El parámetro WorkEvent $event
Cuando un worker se ejecuta, recibe como parámetro un objeto de tipo `WorkEvent` que contiene información sobre el evento. Este objeto tiene dos propiedades importantes para acceder a los datos:

- `$event-&gt;value`: Contiene el valor principal del evento (normalmente el ID del registro)
- `$event-&gt;params()`: Devuelve un array con parámetros adicionales

También existe `$event-&gt;param(&#39;clave&#39;, &#39;valorPorDefecto&#39;)` para obtener un parámetro concreto con valor por defecto opcional.

#### Eventos de modelos (Insert, Update, Save, Delete)
Cuando se produce un evento automático de modelo, el sistema envía estos datos:

- `$event-&gt;value`: El ID del registro (resultado de `$model-&gt;id()`)
- `$event-&gt;params()`: Array con todos los campos del modelo (resultado de `$model-&gt;toArray()`)

Por ejemplo, cuando insertamos un producto con referencia &quot;PROD-001&quot; y precio 10.50:

```php
// el evento se lanza automáticamente así:
WorkQueue::send(
    &#39;Model.Producto.Insert&#39;,
    &#39;5&#39;,                    // ID del producto insertado
    [                       // todos los campos del producto
        &#39;idproducto&#39; =&gt; 5,
        &#39;referencia&#39; =&gt; &#39;PROD-001&#39;,
        &#39;precio&#39; =&gt; 10.50,
        &#39;descripcion&#39; =&gt; &#39;Mi producto&#39;,
        // ... resto de campos
    ]
);
```

En nuestro worker podemos acceder a todos estos datos:

```php
public function run(WorkEvent $event): bool
{
    // obtenemos el ID
    $idproducto = $event-&gt;value; // &quot;5&quot;
    
    // obtenemos todos los datos
    $datos = $event-&gt;params(); // array con todos los campos
    
    // accedemos a campos específicos
    $referencia = $event-&gt;param(&#39;referencia&#39;); // &quot;PROD-001&quot;
    $precio = $event-&gt;param(&#39;precio&#39;); // 10.50
    
    return $this-&gt;done();
}
```

**Importante**: Los eventos Insert, Save y Delete siempre envían el array completo del modelo. Sin embargo, cuando usamos el método `$model-&gt;update(array $values)` directamente (en lugar de modificar campos y hacer `save()`), el evento Update sólo enviará los campos que se están actualizando, no todos los campos del modelo.

#### Eventos personalizados
Cuando lanzamos eventos personalizados con `WorkQueue::send()`, nosotros decidimos qué enviamos en el value y en los params. Por ejemplo:

```php
// lanzamos un evento personalizado cuando una factura se paga
WorkQueue::send(
    &#39;Model.FacturaCliente.Paid&#39;,
    $factura-&gt;idfactura,    // el ID de la factura
    $factura-&gt;toArray()     // todos los datos de la factura
);
```

O podemos enviar sólo los datos que necesitemos:

```php
// evento con parámetros personalizados
WorkQueue::send(
    &#39;proceso-especial&#39;,
    &#39;identificador&#39;,
    [
        &#39;dato1&#39; =&gt; &#39;valor1&#39;,
        &#39;dato2&#39; =&gt; &#39;valor2&#39;
    ]
);
```

En resumen: 
- Eventos de modelos: `$event-&gt;value` es el ID y `$event-&gt;params()` contiene todos los campos del modelo (excepto en algunos casos de Update)
- Eventos personalizados: `$event-&gt;value` y `$event-&gt;params()` contienen lo que nosotros decidamos al lanzar el evento

### 👀 Ver la cola de trabajos
Podemos ver la lista de eventos a procesar desde el menú administrador, logs. En la pestaña de eventos de trabajos.

![eventos de la cola de trabajos](https://i.imgur.com/cs06SIg.png)