---
id: 2434
permalink: metodos-getoriginal-isdirty-y-getdirty-del-modelo
title: Métodos getOriginal(), isDirty() y getDirty() del modelo
creationdate: 29-12-2025 19:11:56
lastmod: 29-12-2025
url: https://facturascripts.com/metodos-getoriginal-isdirty-y-getdirty-del-modelo
---
Los modelos de FacturaScripts incluyen métodos para **rastrear cambios en los datos**: `getOriginal()`, `isDirty()` y `getDirty()`. Estos métodos son útiles para detectar qué campos han sido modificados antes de guardar.

## getOriginal()
Devuelve el valor original de un campo tal como fue cargado desde la base de datos.

- Sintaxis
	- public function getOriginal(string $field): mixed
- Parámetros:
	- $field - Nombre del campo del que se quiere obtener el valor original
- Retorno
	- Devuelve el valor original del campo, o null si el campo no existe.

### Ejemplo
```
  $agency = new AgenciaTransporte();
  $agency-&gt;loadFromCode(&#39;MRW&#39;);

  echo $agency-&gt;nombre; // &quot;MRW Express&quot;

  // Modificamos el nombre
  $agency-&gt;nombre = &#39;MRW Internacional&#39;;

  echo $agency-&gt;nombre; // &quot;MRW Internacional&quot;
  echo $agency-&gt;getOriginal(&#39;nombre&#39;); // &quot;MRW Express&quot;

  // Después de guardar, getOriginal() devuelve el nuevo valor
  $agency-&gt;save();
  echo $agency-&gt;getOriginal(&#39;nombre&#39;); // &quot;MRW Internacional&quot;
```

## isDirty()
Verifica si el modelo o un campo específico ha sido modificado desde que fue cargado.

- Sintaxis
	- public function isDirty(?string $field = null): bool
- Parámetros
	- $field (opcional) - Nombre del campo específico a verificar. Si no se especifica, verifica si hay algún cambio en el modelo.
- Retorno
	- Devuelve true si hay cambios, false si no los hay.

### Ejemplos
```
  $agency = new AgenciaTransporte();
  $agency-&gt;loadFromCode(&#39;MRW&#39;);

  // Verificar si el modelo tiene cambios
  echo $agency-&gt;isDirty(); // false (recién cargado)

  // Modificar un campo
  $agency-&gt;nombre = &#39;Nuevo nombre&#39;;

  // Verificar cambios globales
  echo $agency-&gt;isDirty(); // true

  // Verificar campos específicos
  echo $agency-&gt;isDirty(&#39;nombre&#39;); // true
  echo $agency-&gt;isDirty(&#39;telefono&#39;); // false

  // Restaurar al valor original
  $agency-&gt;nombre = $agency-&gt;getOriginal(&#39;nombre&#39;);
  echo $agency-&gt;isDirty(&#39;nombre&#39;); // false

  // Después de guardar, ya no está dirty
  $agency-&gt;nombre = &#39;Otro nombre&#39;;
  $agency-&gt;save();
  echo $agency-&gt;isDirty(); // false
```

## getDirty()
Devuelve un array asociativo con todos los campos que han sido modificados y sus valores actuales.

- Sintaxis
	- public function getDirty(): array
- Retorno
	- Devuelve un array donde las claves son los nombres de los campos modificados y los valores son los valores actuales de esos campos.

### Ejemplo
```
  $agency = new AgenciaTransporte();
  $agency-&gt;loadFromCode(&#39;MRW&#39;);

  // Sin cambios
  print_r($agency-&gt;getDirty()); // []

  // Modificar varios campos
  $agency-&gt;nombre = &#39;MRW Internacional&#39;;
  $agency-&gt;telefono = &#39;+34 912 345 678&#39;;

  // Obtener todos los cambios
  $cambios = $agency-&gt;getDirty();
  print_r($cambios);
  /*
  Array
  (
      [nombre] =&gt; MRW Internacional
      [telefono] =&gt; +34 912 345 678
  )
  */

  // Restaurar un campo al original
  $agency-&gt;nombre = $agency-&gt;getOriginal(&#39;nombre&#39;);
  $cambios = $agency-&gt;getDirty();
  print_r($cambios);
  /*
  Array
  (
      [telefono] =&gt; +34 912 345 678
  )
  */
```

## Casos de uso comunes
Detectar cambios antes de guardar

```
  if ($model-&gt;isDirty()) {
      // Hay cambios pendientes
      $model-&gt;save();
      $this-&gt;addMessage(&#39;Cambios guardados correctamente&#39;);
  } else {
      $this-&gt;addWarning(&#39;No hay cambios que guardar&#39;);
  }
```

## Auditoría de cambios
```
  $cambios = $model-&gt;getDirty();
  foreach ($cambios as $campo =&gt; $valorNuevo) {
      $valorAntiguo = $model-&gt;getOriginal($campo);
      $this-&gt;log(
          &quot;Campo &#39;$campo&#39; cambió de &#39;$valorAntiguo&#39; a &#39;$valorNuevo&#39;&quot;
      );
  }
```

## Validar solo campos modificados
```
  if ($model-&gt;isDirty(&#39;email&#39;)) {
      // Solo validar el email si ha cambiado
      if (!filter_var($model-&gt;email, FILTER_VALIDATE_EMAIL)) {
          $this-&gt;addError(&#39;Email no válido&#39;);
          return false;
      }
  }
```

## Mostrar advertencias al usuario
```
  if ($model-&gt;isDirty(&#39;precio&#39;) && $model-&gt;precio &gt; $model-&gt;getOriginal(&#39;precio&#39;)) {
      $this-&gt;addWarning(&#39;¡Atención! Estás aumentando el precio&#39;);
  }
```
