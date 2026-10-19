---
name: api-rest
description: Explica cómo consumir la API REST de FacturaScripts (activación, clave API, listar, filtrar, crear, modificar y eliminar registros, endpoints especiales) y cómo añadir un endpoint personalizado desde un plugin.
---

# Skill: API REST de FacturaScripts

La API REST de FacturaScripts permite acceder, crear, modificar y eliminar datos desde aplicaciones externas. La URL base siempre es `{url-instalacion}/api/3`.

La documentación de referencia está en [`../../references/docs/`](../../references/docs/), relativa a este archivo, empezando por [`la-api-rest-de-facturascripts-912.md`](../../references/docs/la-api-rest-de-facturascripts-912.md). Sus ejemplos contienen entidades HTML (`&lt;`, `&#39;`…): decodifícalas antes de reutilizarlos.

## Activación y autenticación

1. **Activar la API:** menú Administrador → Panel de control → sección **Avanzado** → marcar **Activar API** → Guardar.
2. **Crear una clave API:** en la pestaña **Claves API**, botón **Nuevo** → marcar **Acceso completo**. Sin acceso completo, la clave necesita un permiso por recurso.
3. **Autenticar las peticiones:** añadir la cabecera `Token: {tu-clave}` (o `X-Auth-Token: {tu-clave}`) en cada petición.

---

## Operaciones CRUD básicas

### GET: listar registros

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
GET /api/3/divisas?filter[codiso_null]=1        # codiso IS NULL
GET /api/3/divisas?filter[codiso_notnull]=1     # codiso IS NOT NULL

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

### GET: obtener un registro concreto

La consulta se hace por la **clave primaria** del modelo:

```
GET /api/3/impuestos/IVA21
GET /api/3/clientes/CLI001
```

La respuesta es directamente el registro, sin envoltorio, o un 404 con `{"error": "Registro no encontrado"}`. Si necesitas buscar por otro campo, primero filtra el listado para obtener la clave primaria:

```
# buscar cliente por teléfono
GET /api/3/clientes?filter[telefono1]=666
# → obtenemos codcliente → luego:
GET /api/3/clientes/codcliente-obtenido
```

Con la palabra `schema` en lugar de la clave primaria se obtiene la estructura del recurso (`type`, `default` e `is_nullable` de cada campo):

```
GET /api/3/familias/schema
```

---

### POST: crear un nuevo registro

```
POST /api/3/divisas
Content-Type: application/x-www-form-urlencoded

coddivisa=123&descripcion=Divisa+123
```

> Los datos se envían como **form URL encoded**, aunque la respuesta siempre es JSON. Solo son obligatorios los campos que no pueden ser nulos en el modelo.

---

### PUT: modificar un registro existente

```
PUT /api/3/divisas/123
Content-Type: application/x-www-form-urlencoded

descripcion=Divisa+-+123
```

Solo se envían los campos que se quieren cambiar, no es necesario enviar todos.

---

### DELETE: eliminar un registro

```
DELETE /api/3/divisas/123
```

---

### Respuestas de POST, PUT y DELETE

- **Éxito:** HTTP 200 con `{"ok": "…", "data": {…}}`. En `data` está el registro tal como ha quedado (o el eliminado); léelo para conocer la clave autogenerada y los valores calculados.
- **Error:** `{"error": "…"}`, a veces con `data`:
  - 400: no se ha enviado ningún campo, el registro está duplicado, la validación del método `test()` del modelo ha fallado o el borrado lo impiden las restricciones.
  - 404: en PUT o DELETE, el registro no existe.
- **Campos no permitidos (desde la versión 2026.7):** la API rechaza con 400 cualquier escritura en campos ocultos como `password`, `logkey`, `two_factor_secret_key` o `apikey` (`api: fields not allowed: …`). Para cambiar la contraseña de un usuario se envían `newPassword` y `newPassword2`.

---

## Recursos disponibles

La lista de todos los recursos (endpoints) disponibles se consulta directamente:

```
GET /api/3
```

Todos los modelos se exponen automáticamente salvo `CodeModel` y `TotalModel`. Desde la versión 2026.65, un plugin puede ocultar los suyos con `APIModel::excludeModel('MiModelo')` (`use FacturaScripts\Core\Lib\API\APIModel;`) en `Init::init()`.

## Endpoints especiales del core

| Endpoint | Para qué sirve | Documento |
|---|---|---|
| `crearFacturaCliente`, `crearFacturaProveedor`, `crearAlbaran*`, `crearPedido*`, `crearPresupuesto*` | Crear un documento con sus líneas en una sola petición POST (`lineas` en JSON) | `como-crear-facturas-desde-api.md` |
| `editarFacturaCliente/{id}` y demás `editar*` | Editar cabecera y líneas con PUT o PATCH | `como-editar-facturas-albaranes-pedidos-y-presupuestos-desde-api.md` |
| `crearFacturaRectificativaCliente` | Rectificar una factura completa o líneas concretas (`refund_<IDLINEA>`) | `como-hacer-una-factura-rectificativa-por-api.md` |
| `pagarFacturaCliente/{id}`, `pagarFacturaProveedor/{id}` | Marcar como pagada con `fechapago`, `codpago` y `pagada` | `como-marcar-una-factura-como-pagada-desde-api.md` |
| `exportarFacturaCliente/{id}` y demás `exportar*` | PDF, XLS o CSV (`type`, `lang`, `format`) | `como-obtener-el-pdf-de-una-factura-desde-la-api.md` |
| `uploadFiles`, `attachedfiles`, `attachedfilerelations` | Subir, descargar y vincular archivos | `como-subir-un-archivo-usando-la-api-de-facturascripts.md` |
| `plugins` | Listar, activar y desactivar plugins | `listar-activar-y-desactivar-plugins-desde-la-api.md` |

Todos los documentos están en [`../../references/docs/`](../../references/docs/).

---

## Añadir endpoints personalizados desde un plugin

### Atajo con fsmaker

```bash
fsmaker api
```

Desde la carpeta del plugin, pide el nombre del controlador y la ruta (`/api/3/...`), crea el controlador en `Controller/` y registra la ruta y el recurso en `Init.php`.

### Manualmente: paso 1, registrar la ruta en Init.php

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

    public function uninstall(): void
    {
    }

    public function update(): void
    {
    }
}
```

### Manualmente: paso 2, crear el ApiController

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
        $this->response->json(['hola' => 'mundo']);
    }
}
```

El endpoint quedará disponible en:
```
GET /api/3/mi-endpoint
```

La autenticación y los permisos los comprueba `ApiController` antes de ejecutar `runResource()`. Para diseñar endpoints más completos (métodos, validación, códigos HTTP), usa la skill `fs-dev:api-designer`.

---

## Para más información

Consulta la skill `fs-dev:docs-expert` para responder con detalle a partir de la documentación oficial incluida en el plugin.
