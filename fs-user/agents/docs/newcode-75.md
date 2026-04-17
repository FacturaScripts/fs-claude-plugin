---
id: 628
permalink: newcode-75
title: Método newCode() del modelo
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/newcode-75
---
La función `$modelo-&gt;newCode()` obtiene el siguiente número disponible para el campo específico que se solicite. Esta funcionalidad es útil para evitar la generación de duplicados en las entradas del sistema.

### Uso
Para utilizar esta función, simplemente invoca `$modelo-&gt;newCode()` en el contexto adecuado del modelo correspondiente.

### Ejemplo
```php
$nuevoCodigo = $modelo-&gt;newCode();
echo &#39;El siguiente número disponible es: &#39; . $nuevoCodigo;
```
Este código imprimirá el siguiente número disponible para el modelo que se esté utilizando.
