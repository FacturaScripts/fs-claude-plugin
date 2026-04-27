---
id: 640
permalink: modelonchangeclass-559
title: ModelOnChangeClass (obsoleto)
creationdate: 21-03-2019 00:00:00
lastmod: 18-08-2025
url: https://facturascripts.com/publicaciones/modelonchangeclass-559
---

En ocasiones necesitamos saber cuando ha cambiado el valor de una propiedad de un modelo, y qué valor tenía antes. Para estos casos podemos heredar de la clase **ModelOnChangeClass** en lugar de **ModelClass**.

## setPreviousData(array $fields = [])
**Debemos** sobreescribir esta función para definir de qué campos queremos tener los valores previos. En este ejemplo vamos a definir que nos interesan los valores de status y total:
```
protected function setPreviousData(array $fields = [])
{
   $more = [&#39;status&#39;, &#39;total&#39;];
   parent::setPreviousData(array_merge($more, $fields));
}
```

## previousData
Podemos consultar el valor previo de una columna consultando el array $this-&gt;previousData del modelo. Por ejemplo, para la propiedad status, sería:
```
$this-&gt;previousData[&#39;status&#39;];
```

## onChange($field)
Esta es la función que se ejecutará **antes** del saveUpdate(), es decir, cuando se van a guardar los datos actualizados en la base de datos. En este ejemplo **vamos a impedir guardar** si se ha cambiado el total:
```
protected function onChange($field)
{
   switch ($field) {
      case &#39;total&#39;:
         return false;

      default:
         return parent::onChange($field);
   }
}
```

## onDelete()
Esta función será ejecutada tras eliminar los datos de la base de datos, cuando se ha hecho un delete(). **Si necesitas hacer comprobaciones antes de eliminar**, entonces mejor sobreescribe la función delete().

## onInsert()
Esta función será ejecutada cada vez que se ejecuta el saveInsert(), es decir, al guardar este registro en los datos por primera vez. **Si necesitas hacer comprobaciones antes de insertar**, entonces mejor sobreescribe la función saveInsert().

## onUpdate()
Esta función será ejecutada cada vez que se ejecuta el saveUpdate(), es decir, al actualizar este registro. Si necesitas hacer comprobaciones antes de actualizar, entonces mejor sobreescribe la función saveUpdate().
