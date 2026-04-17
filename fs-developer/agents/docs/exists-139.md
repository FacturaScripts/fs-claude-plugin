---
id: 625
permalink: exists-139
title: Método exists() del modelo
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/exists-139
---
El método **exists()** del modelo **devuelve true** si el registro correspondiente se encuentra en la **base de datos**. A continuación se muestra un ejemplo:

```
$familia = new Familia();
$familia-&gt;codfamilia = &#39;test4&#39;;
$familia-&gt;descripcion = &#39;test4&#39;;
if ($familia-&gt;exists()) {
    // &#39;test4&#39; está en la tabla familias
} else {
    // &#39;test4&#39; NO está en la tabla familias
}
```

## ⚠️ Clave primaria
Es importante tener en cuenta que la comprobación se realiza en base a la [clave primaria del modelo](https://facturascripts.com/publicaciones/primarycolumn-492). Por ejemplo, considere el siguiente caso:

```
$producto = new Producto();
$producto-&gt;referencia = &#39;1234&#39;;
$existe = $producto-&gt;exists();
```

Puede parecer erróneo pensar que `$existe` será `true` si existe un producto con la referencia `1234`. Sin embargo, esto no es correcto. **La clave primaria del modelo Producto es `idproducto`**, por lo que, aunque se especifique una referencia válida, si no se ha asignado un `idproducto`, el método **exists()** devolverá `false`.

Puedes comprobar el [diagrama de clases](https://facturascripts.com/publicaciones/diagramas-de-tablas) para ver todas las clases que tiene FacturaScripts.
