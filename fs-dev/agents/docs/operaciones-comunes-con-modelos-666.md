---
id: 620
permalink: operaciones-comunes-con-modelos-666
title: Operaciones comunes con modelos
creationdate: 28-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/publicaciones/operaciones-comunes-con-modelos-666
---

Ya nos ha quedado claro qué es un modelo, ahora vamos a ver lo que podemos hacer con él.

## Utilizar un modelo
Recuerda que tenemos todo separado por espacios de nombres, si vamos a operar desde un controlador, por ejemplo, deberemos indicar arriba, justo debajo de namespace, que vamos a usar este modelo:

```
use FacturaScripts\Plugins\MyNewPlugin\Model\Project;
```

Aunque lo más recomendable es cargar los modelos siempre del dinamic, ya que estos llevan las extensiones cargadas:

```
use FacturaScripts\Dinamic\Model\Project;
```

## 📝 Crear y guardar un registro
Siguiendo con nuestro ejemplo del modelo Project, vamos a crear un nuevo proyecto. Para guardar el registro en la base de datos llamaremos al [método save() del modelo](https://facturascripts.com/publicaciones/save-782).

```
$newProject = new Project();
$newProject-&gt;codproject = &#39;test&#39;;
$newProject-&gt;name = &#39;test&#39;;
$newProject-&gt;save();
```

### 🔍 Obtener un registro del que conocemos su identificador o clave primaria:
Para cargar los datos de un registro almacenado en la base de datos llamaremos al [método load() del modelo](https://facturascripts.com/publicaciones/loadfromcode-677) o `find()`.

```
// supongamos que es &#39;test&#39;
$project = new Project();
if ($project-&gt;load(&#39;test&#39;)) {
	// lo hemos encontrado
}

// también podemos usar find()
$project = Project::find(&#39;test&#39;);
if($project) {
	// existe
}
```

### 🗑️ Eliminar un registro:
Para eliminar un registro de la base de datos llamaremos al [método delete() del modelo](https://facturascripts.com/publicaciones/delete-986).

```
// supongamos que es &#39;test&#39;
$project = new Project();
if ($project-&gt;load(&#39;test&#39;)) {
	// lo hemos encontrado
	$project-&gt;delete();
	// eliminado
}
```

### 📖 Leer muchos registros
Podemos leer muchos registros de la base de datos, o todos, con el [método all() del modelo](https://facturascripts.com/publicaciones/all-863). Este método permite filtros, ordenación y paginación.

```
foreach (Producto::all() as $producto) {
	// $producto es el producto que estamos consultando en este momento
}
```

### 🔢 Contar registros
También podemos obtener el número de registros en la base de datos llamando al [método count() del modelo](https://facturascripts.com/publicaciones/count-882). Este método además permite pasar filtros para obtener el contador de aquellos registros que cumplan los filtros.

```
$total = Producto::count();
```
