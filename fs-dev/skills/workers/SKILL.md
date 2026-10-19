---
name: workers
description: Explica cómo funcionan los workers y la cola de trabajos en FacturaScripts para ejecutar procesos en segundo plano mediante eventos.
---

# Skill: Workers — Cola de Trabajos en FacturaScripts

Los workers permiten ejecutar procesos en **segundo plano**: al final de cada carga de página se procesa un evento de la cola, y cada ejecución del cron procesa un lote, por lo que con el cron configurado la cola avanza mucho más rápido. Se usan para tareas no críticas que no necesitan ejecutarse en el momento exacto de la acción (por ejemplo, actualizar contadores, enviar notificaciones, sincronizar datos).

Documento de referencia: `../../references/docs/la-cola-de-trabajos.md`.

La cola de trabajos se compone de **eventos** y **workers**:
- Los **eventos** se lanzan automáticamente cuando se crea, modifica o elimina un registro.
- Los **workers** son clases PHP que escuchan esos eventos y ejecutan la lógica necesaria.

## Atajo con fsmaker

Para generar automáticamente la clase Worker y registrarla en `Init.php`:

```bash
fsmaker worker
```

---

## Eventos de los modelos

Todos los modelos lanzan automáticamente eventos al operar sobre ellos:

| Acción | Eventos lanzados |
|--------|-----------------|
| Insertar | `Model.NombreModelo.Insert`, `Model.NombreModelo.Save` |
| Modificar | `Model.NombreModelo.Update`, `Model.NombreModelo.Save` |
| Eliminar | `Model.NombreModelo.Delete` |

Ejemplos:
- `Model.Producto.Insert` — al insertar un producto
- `Model.Cliente.Update` — al modificar un cliente
- `Model.FacturaCliente.Delete` — al eliminar una factura

---

## Lanzar eventos personalizados

```php
use FacturaScripts\Core\WorkQueue;

// lanzar un evento inmediatamente
WorkQueue::send('mi-evento', 'valor-identificador');

// lanzar un evento con parámetros adicionales (el valor es un string)
WorkQueue::send('mi-evento', (string)$modelo->id(), $modelo->toArray());

// lanzar un evento para ejecutarse en el futuro (en segundos)
WorkQueue::sendFuture(300, 'mi-evento', 'valor'); // en 5 minutos
```

- Un evento **solo se guarda en la cola si algún worker lo escucha**; si nadie lo escucha, se descarta.
- `send()` devuelve `true` si el evento se ha encolado y `false` si nadie lo escucha o está bloqueado.
- Si se lanza el mismo evento con los mismos datos varias veces en la misma ejecución, solo se encola una vez.

---

## Estructura básica de un Worker

Los workers se crean en la carpeta `Worker/` del plugin:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Worker;

use FacturaScripts\Core\Model\WorkEvent;
use FacturaScripts\Core\Template\WorkerClass;

class MiWorker extends WorkerClass
{
    public function run(WorkEvent $event): bool
    {
        // tu código aquí

        return $this->done();
    }
}
```

`run()` debe devolver un booleano mediante una de estas ayudas:

- `return $this->done();` — el worker ha terminado y los siguientes workers del evento pueden ejecutarse.
- `return $this->stopPropagation();` — el worker ha terminado y **no** se ejecuta ningún otro worker para este evento.

---

## Registrar un worker en Init.php

Para que un worker escuche un evento, hay que registrarlo en la función `init()` del archivo `Init.php`:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Template\InitClass;
use FacturaScripts\Core\WorkQueue;

class Init extends InitClass
{
    public function init(): void
    {
        // escucha solo cuando se modifica un producto
        WorkQueue::addWorker('MiWorker', 'Model.Producto.Update');

        // escucha inserción y eliminación
        WorkQueue::addWorker('MiWorker', 'Model.Producto.Insert');
        WorkQueue::addWorker('MiWorker', 'Model.Producto.Delete');

        // escucha todos los eventos de Producto (usando comodín)
        WorkQueue::addWorker('MiWorker', 'Model.Producto.*');

        // escucha todos los eventos del sistema
        WorkQueue::addWorker('MiWorker', '*');

        // tercer parámetro: posición; se ejecutan de menor a mayor (0 por defecto)
        WorkQueue::addWorker('OtroWorker', 'Model.Producto.Update', -1); // antes que el resto
    }

    public function update(): void
    {
    }

    public function uninstall(): void
    {
    }
}
```

`update()` y `uninstall()` son abstractos en `InitClass` y deben existir aunque estén vacíos.

> **Importante:** Si lanzas eventos en `Init::update()`, debes registrar los workers necesarios también en `update()`, ya que `update()` se ejecuta antes que `init()`.

---

## Acceder a los datos del evento (WorkEvent)

El worker recibe un objeto `WorkEvent` con información del evento:

```php
public function run(WorkEvent $event): bool
{
    // ID del registro (clave primaria del modelo)
    $id = $event->value;

    // todos los parámetros del evento
    $datos = $event->params();

    // un parámetro concreto con valor por defecto
    $referencia = $event->param('referencia', '');
    $precio = $event->param('precio', 0.0);

    return $this->done();
}
```

### Datos en eventos de modelos

Cuando se produce un evento automático de modelo:
- `$event->value` → ID del registro (`$model->id()`)
- `$event->params()` → array con todos los campos del modelo (`$model->toArray()`)

> **Excepción:** Con `$model->update(array $values)` (actualización directa), el evento `Update` solo enviará los campos que se están actualizando, no todos los campos del modelo.

### Datos en eventos personalizados

Con `WorkQueue::send()`, tú decides qué enviar:

```php
// enviar el ID y todos los datos de una factura
WorkQueue::send(
    'Model.FacturaCliente.Paid',
    (string)$factura->idfactura,
    $factura->toArray()
);

// enviar solo los datos que necesites
WorkQueue::send(
    'proceso-especial',
    'identificador',
    ['dato1' => 'valor1', 'dato2' => 'valor2']
);
```

---

## Evitar bucles de eventos

Si el worker modifica el mismo modelo que lanzó el evento, puede crearse un bucle infinito. Para evitarlo, usa `preventNewEvents()`:

```php
public function run(WorkEvent $event): bool
{
    // evitar que se creen nuevos eventos de tipo Model.Producto.Save
    $this->preventNewEvents(['Model.Producto.Save']);

    // tu código aquí (puede modificar el producto sin crear bucle)

    return $this->done();
}
```

Los eventos `Model.WorkEvent.*` están siempre bloqueados, para evitar bucles al guardar los propios eventos de la cola.

---

## Ver la cola de trabajos

La lista de eventos pendientes de procesar se puede consultar desde:
**Menú Administrador → Logs → pestaña "Eventos de trabajos"**

---

## Para más información

Consulta la skill `fs-dev:docs-expert` y `../../references/docs/la-cola-de-trabajos.md`.
