---
id: 918
permalink: extensiones-de-modelos
title: Extensiones de modelos
creationdate: 08-05-2021 11:11:12
lastmod: 12-09-2025
url: https://facturascripts.com/extensiones-de-modelos
---
Para modificar el comportamiento de modelos de otro plugins (o del core) podemos crear una extensión o pipe de ese modelo, es decir, crearemos un archivo php con el nombre del modelo en la carpeta **Extension/Model** de nuestro plugin.

## Las extensiones no son herencia
Las extensiones no son herencia. No se puede extender cualquier función imaginable, solamente las que tienen soporte. Y cada función que añadas en una extensión debe tener un **return function()**.

## Ejemplo: añadir métodos a un modelo
Como ya hemos comentado al añadir una columna a una tabla automáticamente se añade esa propiedad al modelo. Las extensiones para modelos se usarán únicamente para métodos o funciones. Y como también hemos comentado, **las extensiones no son herencia**, solamente son una forma de añadir métodos a una clase, pero sin extender y sin padre.

Continuando con el ejemplo vamos a añadir un método &quot;usado()&quot; que nos devolverá el valor de &quot;usado&quot;. Podemos consultar este valor directamente, pero para el ejemplo imaginaremos que no. Para añadir el método &quot;usado()&quot; crearemos el archivo **Extension/Model/Producto.php**:

```
&lt;?php
namespace FacturaScripts\Plugins\MiPLugin\Extension\Model;

use Closure;

class Producto
{
   public function usado(): Closure
   {
      return function() {
         return $this-&gt;usado;
      };
   }
}
```

Fíjate que no hay ningún extends Producto. No estamos heredando del modelo, solamente estamos añadiendo el método &quot;usado()&quot;. Y fíjate además que el método devuelve una función, esta función es la que se añade al modelo. Pero para ello primero hay que cargar la extensión en el archivo **Init.php** del plugin.

### Cargar extensiones en el Init.php
Las extensiones de archivos xml se integran automáticamente al activar el plugin o reconstruir Dinamic. En cambio, las extensiones de archivo php se deben cargar explícitamente llamando al método ``loadExtension()`` del [archivo Init.php del plugin](https://facturascripts.com/publicaciones/el-archivo-init-php-307), en el método **init()**.

```
public function init(): void
{
   // cargamos la extensión del modelo Producto
   $this-&gt;loadExtension(new Extension\Model\Producto());
}
```

### Métodos disponibles para extender
- **clear()** se ejecuta cuando se instancia un objeto del modelo, por ejemplo al hacer new Producto(). Asigna valores predeterminados.
- **delete()** se ejecuta una vez realizado el [delete() del modelo](https://facturascripts.com/publicaciones/delete-986).
- **deleteBefore()** se ejecuta antes de hacer el delete() del modelo. **Si devolvemos false**, impedimos el delete().
- **save()** se ejecuta una vez realizado el [save() del modelo](https://facturascripts.com/publicaciones/save-782).
- **saveBefore()** se ejecuta antes de hacer el save() del modelo. **Si devolvemos false**, impedimos el save().
- **saveInsert()** se ejecuta una vez realizado el saveInsert() del modelo.
- **saveInsertBefore()** se ejecuta antes de hacer el saveInsert() del modelo. **Si devolvemos false**, impedimos el saveInsert().
- **saveUpdate()** se ejecuta una vez realizado el saveUpdate() del modelo.
- **saveUpdateBefore()** se ejecuta antes de hacer el saveUpdate() del modelo. **Si devolvemos false**, impedimos el saveUpdate().
- **test()** se ejecuta una vez realizado el test() del modelo.
- **testBefore()** se ejecuta antes de hacer el test() del modelo. **Si devolvemos false**, impedimos el test();
- **url()** se ejecuta una vez realizado el url() del modelo.
- **onChange()** se ejecuta antes del saveUpdate() y sirve para detectar cambios en columnas.

Aquí tienes un esquema de en qué orden se ejecutan las funciones y extensiones de un modelo:

![esquema ejecución de extensiones](https://facturascripts.com/MyFiles/2025/03/2738.png?myft=a56aa3c2890a9815cd2ff98becc7054e26111494)

## fsmaker
Para hacer este mismo proceso con [fsmaker](https://facturascripts.com/publicaciones/fsmaker-0-92-disponible) ejecutamos:

```
fsmaker extension
```

En el asistente elegimos modelo, escribimos el nombre, etc.

## ¿No funciona?
Los errores más comunes son:
- **Tener un namespace incorrecto**. El namespace debe reflejar la ruta donde está el archivo. Si el archivo está en la carpeta Extension/Model de tu plugin, el namespace dene incluir Extension\Model.
- **Intentar extender funciones que no soportan extensiones**. Solamente las funciones o métodos indicados arriba se pueden extender.
- **No usar return function()**. Las funciones deben devolver un return function(), y si no, no funcionará. Si la función necesita parámetros, estos deben ir en el return function().
- **No cargar la extensión desde el Init.php del plugin**.

### Parámetros por referencia
Si crear funciones personalizadas y estas incluyen parámetros no se debe poner &quot;&&quot; en los parámetros ya que no está permitido, y causará problemas. Como sugerencia puedes devolverte el parámetro que deseas modificar.

**Ejemplo mal**
```
public function applyStockChangesFromWork(): Closure
{
		return function (&$stock) {
			$stock-&gt;cantidad = 5;
		};
}
```

**Ejemplo Bueno**
```
public function applyStockChangesFromWork(): Closure
{
		return function ($stock) {
			$stock-&gt;cantidad = 5;
			return $stock;
		};
}
```
