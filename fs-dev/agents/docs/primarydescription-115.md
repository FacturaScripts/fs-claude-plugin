---
id: 630
permalink: primarydescription-115
title: Método primaryDescription() del modelo
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/primarydescription-115
---
El método `primaryDescription()` del modelo **devuelve el valor del campo** especificado en la función [primaryDescriptionColumn()](https://facturascripts.com/publicacion/primarydescriptioncolumn-955). Es empleado principalmente en el [EditController](https://facturascripts.com/publicacion/editcontroller-642) para añadir información junto al título, en la parte derecha de la interfaz.

![Ejemplo de primaryDescriptionColumn](https://i.imgur.com/YStwmvI.png)

Este método puede ser sobreescrito para devolver el valor que desees. Por ejemplo, en el caso de los productos, podrías mostrar la referencia junto con el `idproducto`, de la siguiente manera:

```php
public function primaryDescription(): string
{
	return $this-&gt;referencia . &#39; (&#39; . $this-&gt;idproducto . &#39;)&#39;;
}
```
