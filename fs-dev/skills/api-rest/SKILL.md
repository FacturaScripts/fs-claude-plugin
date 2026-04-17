---
name: api-rest
description: Explica cómo usar la API REST de FacturaScripts para listar, crear, modificar y eliminar registros, y cómo añadir endpoints personalizados desde un plugin. Úsalo cuando el usuario pregunte sobre la API REST, endpoints, autenticación con API key, o cómo crear endpoints personalizados en un plugin.
---

# Skill: API REST de FacturaScripts

La API REST de FacturaScripts permite acceder, crear, modificar y eliminar datos desde aplicaciones externas. La URL base siempre es `{url-instalacion}/api/3`.

## Activación y autenticación

1. **Activar la API:** Menú Administrador → Panel de control → sección "Por defecto" → marcar "Activar API" → Guardar.
2. **Crear una API Key:** Menú Administrador → Panel de control → sección "API Keys" → botón "Nuevo" → marcar "Acceso completo".
3. **Autenticar las peticiones:** Añadir la cabecera `Token: {tu-api-key}` en cada petición.

---

## Operaciones CRUD básicas

### GET — Listar registros

```
GET /api/3/impuestos
```

Por defecto devuelve 50 registros. Usa `limit` y `offset` para paginar:

```
GET /api/3/impuestos?limit=10&offset=0    # página 1
GET /api/3/impuestos?limit=10&offset=10   # página 2
GET /api/3/impuestos?limit=10&offset=20   # página 3
```

El total de registros disponibles se devuelve en la cabecera `X-Total-Count`.

#### Filtros

```
# filtro por valor exacto
GET /api/3/impuestos?filter[codimpuesto]=IVA21

# varios filtros (AND por defecto)
GET /api/3/impuestos?filter[codimpuesto]=IVA21&filter[tipo]=1

# operadores de comparación
GET /api/3/productos?filter[precio_gt]=100      # precio > 100
GET /api/3/productos?filter[precio_gte]=100     # precio >= 100
GET /api/3/productos?filter[precio_lt]=50       # precio < 50
GET /api/3/productos?filter[precio_lte]=50      # precio <= 50
GET /api/3/productos?filter[referencia_neq]=X   # referencia != X
GET /api/3/productos?filter[referencia_like]=pez # referencia contiene "pez"

# cambiar AND por OR entre filtros
GET /api/3/divisas?filter[descripcion_like]=PESO&filter[tasaconv_gt]=2&operation[tasaconv_gt]=OR
```

#### Ordenación

```
# ordenar por un campo
GET /api/3/divisas?sort[coddivisa]=DESC

# ordenar por varios campos
GET /api/3/productos?sort[precio]=ASC&sort[stockfis]=DESC
```

---

### GET — Obtener un registro concreto

La consulta se hace por la **clave primaria** del modelo:

```
GET /api/3/impuestos/IVA21
GET /api/3/clientes/CLI001
```

Si necesitas buscar por otro campo, primero filtra el listado para obtener la clave primaria:

```
# buscar cliente por teléfono
GET /api/3/clientes?filter[telefono1]=666
# → obtenemos codcliente → luego:
GET /api/3/clientes/codcliente-obtenido
```

---

### POST — Crear un nuevo registro

```
POST /api/3/divisas
Content-Type: application/x-www-form-urlencoded

coddivisa=123&descripcion=Divisa+123
```

> Los datos se envían como **form URL encoded**, aunque la respuesta siempre es JSON. Solo son obligatorios los campos que no pueden ser nulos en el modelo.

---

### PUT — Modificar un registro existente

```
PUT /api/3/divisas/123
Content-Type: application/x-www-form-urlencoded

descripcion=Divisa+-+123
```

Solo se envían los campos que se quieren cambiar, no es necesario enviar todos.

---

### DELETE — Eliminar un registro

```
DELETE /api/3/divisas/123
```

Devuelve HTTP 200 si se eliminó correctamente, o un código de error con el mensaje JSON.

---

## Recursos disponibles

La lista de todos los recursos (endpoints) disponibles se consulta directamente:

```
GET /api/3
```

---

## Añadir endpoints personalizados desde un plugin

### Atajo con fsmaker

```bash
fsmaker api
```

Genera automáticamente los endpoints REST para los modelos del plugin.

### Manualmente: paso 1 — registrar la ruta en Init.php

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin;

use FacturaScripts\Core\Controller\ApiRoot;
use FacturaScripts\Core\Kernel;
use FacturaScripts\Core\Template\InitClass;

class Init extends InitClass
{
    public function init(): void
    {
        Kernel::addRoute('/api/3/mi-endpoint', 'ApiControllerPruebas', -1);
        ApiRoot::addCustomResource('mi-endpoint');
    }
}
```

### Manualmente: paso 2 — crear el ApiController

Crear `Controller/ApiControllerPruebas.php` en el plugin:

```php
<?php
namespace FacturaScripts\Plugins\MiPlugin\Controller;

use FacturaScripts\Core\Template\ApiController;

class ApiControllerPruebas extends ApiController
{
    protected function runResource(): void
    {
        // lógica del endpoint personalizado
        $this->response()->json(['hola' => 'mundo']);
    }
}
```

El endpoint quedará disponible en:
```
GET /api/3/mi-endpoint
```

---

## Para más información

Para consultar la documentación oficial completa sobre la API REST de FacturaScripts, invoca el agente **docs-expert** que te proporcionará detalles completos directamente desde la documentación oficial del framework.
