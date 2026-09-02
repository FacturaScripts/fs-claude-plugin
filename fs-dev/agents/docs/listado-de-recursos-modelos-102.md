---
id: 699
permalink: listado-de-recursos-modelos-102
title: Listado de Recursos Disponibles en la API (Modelos)
creationdate: 14-05-2018 00:00:00
lastmod: 31-08-2026
url: https://facturascripts.com/publicaciones/listado-de-recursos-modelos-102
---
Al acceder a la API indicando únicamente la versión, obtendremos un listado con todos los recursos disponibles a través de la API, tales como agencias de transporte, agentes, albaranes de cliente, entre otros.

## Ejemplo de solicitud

```text
http://localhost:8000/api/3
```

![Lista de recursos API](https://facturascripts.com/MyFiles/2024/03/2022.png?myft=fd1934bc91748ad90f3360e4a154bc0d784d7c17)

Puedes consultar cada uno de estos recursos agregando el nombre del recurso a la URL:

- [http://localhost:8000/api/3/agenciatransportes](http://localhost:8000/api/3/agenciatransportes)
- [http://localhost:8000/api/3/agentes](http://localhost:8000/api/3/agentes)
- ...

Asegúrate de que estás realizando una consulta de tipo GET.

### 📝 Añadir un endpoint

Puedes añadir endpoints a la API desde tus plugins siguiendo la [guía de creación de endpoints para la API](https://facturascripts.com/publicaciones/anadir-un-endpoint-a-la-api).

## 🚫 Ocultar modelos de la API

No todos los modelos deben exponerse. El core ya excluye del listado los modelos auxiliares `CodeModel` y `TotalModel`.

Desde la **versión 2026.65**, los plugins pueden excluir sus propios modelos llamando a `APIModel::excludeModel()` desde la función `init()` del [archivo Init.php](https://facturascripts.com/publicaciones/el-archivo-init-php-307), indicando el nombre de la clase **sin namespace**:

```php
&lt;?php
namespace FacturaScripts\Plugins\MyNewPlugin;

use FacturaScripts\Core\Lib\API\APIModel;
use FacturaScripts\Core\Template\InitClass;

class Init extends InitClass
{
    public function init(): void
    {
        APIModel::excludeModel(&#39;MiModeloInterno&#39;);
    }
}
```

El modelo excluido deja de aparecer en el listado de recursos y, además, su endpoint queda inaccesible: cualquier petición a `/api/3/mimodelointernos` devuelve el error `api-resource-invalid`.