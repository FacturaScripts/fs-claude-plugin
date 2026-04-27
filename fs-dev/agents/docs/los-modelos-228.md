---
id: 618
permalink: los-modelos-228
title: Los modelos
creationdate: 27-04-2018 00:00:00
lastmod: 18-09-2025
url: https://facturascripts.com/publicaciones/los-modelos-228
---

Los modelos en FacturaScripts son clases que representan las tablas de la base de datos y proporcionan una interfaz orientada a objetos para interactuar con los datos. Utilizan el patrón Active Record y están basados en una arquitectura de clase abstracta (`ModelClass`) con un trait (`ModelTrait`) que implementa la funcionalidad básica.

Un modelo es una clase que debe ir en un archivo **con el mismo nombre** y dentro de la **carpeta Model** del plugin.

## Ejemplo: Project.php
Siguiendo con el ejemplo del plugin MyNewPlugin, vamos a añadirle un modelo llamado **Project** para dar de alta proyectos.

```
&lt;?php
namespace FacturaScripts\Plugins\MyNewPlugin\Model;

use FacturaScripts\Core\Template\ModelClass;
use FacturaScripts\Core\Template\ModelTrait;
use FacturaScripts\Core\Tools;

class Project extends ModelClass
{
    use ModelTrait;

    public $active;
    public $creation_date;
    public $id;
    public $name;
		
    public function clear(): void
    {
        parent::clear();
        $this-&gt;active = true;
        $this-&gt;creation_date = Tools::dateTime();
    }

    public static function primaryColumn(): string
    {
        return &#39;id&#39;;
    }

    public static function tableName(): string
    {
        return &#39;projects&#39;;
    }
}
```

El nombre del modelo debe ser siempre en singular y el de la tabla en plural. Si necesita un modelo para edificios, el modelo se debería llamar **Edificio** y la tabla **edificios**.

### Nombres de columna conflictivos
- Evita usar en sus columnas nombres como: **action** y **code**.
- Evita usar nombres con mayúsculas.

### namespace
Es importante recordar que nuestro plugin utiliza el espacio de nombres *FacturaScripts\Plugins\MyNewPlugin*, porque el plugin se llama *MyNewPlugin*. Si cambiamos este espacio de nombres dejará de funcionar. **El espacio de nombres se debe corresponder con la carpeta donde está el archivo**.

### tableName()
Debe devolver el **nombre de la tabla** de la base de datos que utiliza este modelo para leer y guardar los registros. FacturaScripts buscará a continuación el [archivo XML con la definición de la estructura de la tabla](https://facturascripts.com/publicaciones/la-definicion-de-la-estructura-de-la-tabla-514), en la carpeta **Table**. Y usará este archivo para crear o comprobar la estructura de la tabla.

#### Creación de la tabla
No es necesario que crees manualmente la tabla del modelo, ni que ejecutes ningún SQL. Simplemente debes tener el archivo XML en la carpeta Table. FacturaScripts se encargará de generar la tabla automáticamente. Si además quieres rellenar la tabla con registros predefinidos consulta el [método install() del modelo](https://facturascripts.com/publicaciones/install-205).

### primaryColumn()
Esta función debe devolver el **nombre de la columna** de la clave primaria de la tabla. Lo habitual es usar el nombre `id`, pero puedes usar otro nombre. Cuando se busque un registro con este modelo, se buscará por esta columna. Por ejemplo, los siguientes métodos del modelo buscan por ese campo:

- find()
- [get()](https://facturascripts.com/publicaciones/get-695)
- load()
- [loadFromCode()](https://facturascripts.com/publicaciones/loadfromcode-677)

## Ejemplos de uso
Los modelos ofrecen una gran variedad de funciones para operar con los registros. A continuación tienes las más habituales:

### Crear un registro
Para crear nuevos registros del modelo podemos hacer un `new NOMBRE_MODELO()`, asignar los valores y después llamar al método `save()`, o bien usar el método `create()`:

```
// Opción 1: Crear objeto y guardar
$proyecto = new Proyecto();
$proyecto-&gt;name = &#39;Proyecto 1&#39;;
$proyecto-&gt;active = true;

if ($proyecto-&gt;save()) {
   echo &quot;Proyecto guardado correctamente. ID &quot; . $proyecto-&gt;id();
}

// Opción 2: Crear e insertar directamente
$proyecto = Proyecto::create([
   &#39;name&#39; =&gt; &#39;Proyecto 1&#39;,
   &#39;active&#39; =&gt; true
]);
```

### Buscar registros
Para buscar registros concretos tenemos los métodos `find()`, `findWhere()` y `findWhereEq()`. Para buscar muchos registros tenemos el método `all()`:

```
// Buscar por clave primaria
$proyecto = Proyecto::find(123);
if ($proyecto) {
   echo $proyecto-&gt;name;
}

// Buscar por campo específico
$proyecto = Proyecto::findWhereEq(&#39;name&#39;, &#39;Proyecto 1&#39;);

// Buscar por condiciones
$where = [
   Where::eq(&#39;name&#39;, &#39;Proyecto 1&#39;),
   Where::eq(&#39;active&#39;, true),
];
$proyecto = Proyecto::findWhere($where);

// Obtener todos los registros
$proyectos = Proyecto::all();

// Obtener con filtros y orden
$where = [
   Where::eq(&#39;active&#39;, true),
];
$order = [&#39;nombre&#39; =&gt; &#39;ASC&#39;];
$proyectosActivos = Proyecto::all(Where, $order, 0, 10); // offset 0, limit 10
```

### Cargar registros
Una vez instanciado el modelo podemos usar los métodos `load()`, `loadWhere()` y `loadWhereEq()` para cargar los datos de un registro concreto:

```
// Cargar por clave primaria
$proyecto = new Proyecto();
if ($proyecto-&gt;load(123)) {
   echo $proyecto-&gt;name;
}

// Cargar por campo específico
$proyecto = new Proyecto();
if ($proyecto-&gt;loadWhereEq(&#39;name&#39;, &#39;Proyecto 1&#39;)) {
   echo $proyecto-&gt;name;
}

// Cargar por condiciones
$proyecto = new Proyecto();
$where = [
   Where::eq(&#39;name&#39;, &#39;Proyecto 1&#39;),
   Where::eq(&#39;active&#39;, true),
];
if ($proyecto-&gt;loadWhere($where)) {
   echo $proyecto-&gt;name;
}
```

### Actualizar registros
Para actuializar en la base de datos la información de un registro podemos usar los métodos `save()`, `update()` o `updateOrCreate()`:

```
// Cargar y modificar
$proyecto = Proyecto::find(123);
if ($proyecto) {
   $proyecto-&gt;active = false;
   $proyecto-&gt;save();
}

// Actualizar directamente
$proyecto = Proyecto::find(123);
$proyecto-&gt;update([
   &#39;active&#39; =&gt; false
]);

// Actualizar o crear
$proyecto = Proyecto::updateOrCreate([
   &#39;active&#39; =&gt; false
], [
   &#39;name&#39; =&gt; &#39;Proyecto 1&#39;,
   &#39;active&#39; =&gt; false
]);
```

### Eliminar registros
Para eliminar registros de la base de datos tenemos los métodos `delete()` y `deleteWhere()`:

```
// Eliminar un registro específico
$proyecto = Proyecto::find(123);
if ($proyecto) {
   $proyecto-&gt;delete();
}

// Eliminar por condiciones
Proyecto::deleteWhere([
   Where::eq(&#39;activo&#39;, false),
   Where::lt(&#39;creation_date&#39;, &#39;2020-01-01 00:00:00&#39;)
]);
```
