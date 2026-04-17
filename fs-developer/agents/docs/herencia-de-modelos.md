---
id: 1967
permalink: herencia-de-modelos
title: Herencia de Modelos
creationdate: 25-12-2024 18:29:46
lastmod: 31-12-2025
url: https://facturascripts.com/herencia-de-modelos
---
En FacturaScripts es posible heredar y personalizar cualquier modelo existente. Es importante que, antes de heredar, utilices un alias para evitar conflictos de nombres.

A continuación, se muestra un ejemplo:

```php
&lt;?php
namespace FacturaScripts\Plugins\MyNewPlugin\Model;

use FacturaScripts\Core\Model\Cliente as ParentModel;

class Cliente extends ParentModel
{
    // Aquí puedes personalizar los métodos y propiedades según tus necesidades
}
```

Observa la línea `use FacturaScripts\Core\Model\Cliente as ParentModel;`. En este caso, el alias **ParentModel** se utiliza para referirse a la clase original **Cliente**. Si no empleas un alias, se produciría una colisión de nombres, ya que la nueva clase tendría el mismo nombre que la clase de la que deseas heredar.

## 🌟 Extensión de modelos

Con la herencia tienes limitaciones en los plugins. Si el plugin1 hereda y personaliza el modelo Cliente, por ejemplo, y el plugin2 también hereda y personaliza el mismo modelo, solamente una de las dos personalizaciones funcionará. Para superar estas limitaciones tenemos [las extensiones de modelos](https://facturascripts.com/publicaciones/extensiones-de-modelos).
