---
id: 4431
permalink: listar-activar-y-desactivar-plugins-desde-la-api
title: Listar, activar y desactivar plugins desde la API
creationdate: 27-08-2026 13:35:28
lastmod: 27-08-2026
url: https://facturascripts.com/publicaciones/listar-activar-y-desactivar-plugins-desde-la-api
---
La API de FacturaScripts incluye un endpoint especial, `plugins`, que no corresponde a ningún modelo de la base de datos. Permite consultar los plugins instalados y, si la API key tiene acceso completo, activarlos o desactivarlos de forma remota.

Todas las peticiones necesitan la cabecera `Token` (o `X-Auth-Token`) con la API key, igual que el resto de la API.

## Listar los plugins

```
GET http://localhost:8000/api/3/plugins
```

Devuelve un array con los plugins **instalados**. Los plugins ocultos y los que solo están en la carpeta de descargas (sin instalar) no aparecen.

```
[
    {
        &quot;compatible&quot;: true,
        &quot;description&quot;: &quot;Terminal punto de venta&quot;,
        &quot;enabled&quot;: true,
        &quot;folder&quot;: &quot;POS&quot;,
        &quot;min_version&quot;: 2026.0,
        &quot;min_php&quot;: 8.0,
        &quot;name&quot;: &quot;POS&quot;,
        &quot;require&quot;: [&quot;Tickets&quot;],
        &quot;require_php&quot;: [&quot;bcmath&quot;],
        &quot;version&quot;: 1.5
    }
]
```

Significado de cada campo:

- `compatible`: indica si el plugin es compatible con esta versión de FacturaScripts y con este PHP.
- `description`: la descripción del `facturascripts.ini` del plugin.
- `enabled`: `true` si el plugin está activado.
- `folder`: nombre de la carpeta dentro de `Plugins`.
- `min_version`: versión mínima de FacturaScripts que necesita.
- `min_php`: versión mínima de PHP que necesita.
- `name`: nombre del plugin. Es el identificador que se usa en el resto de peticiones.
- `require`: lista de plugins de los que depende.
- `require_php`: lista de extensiones de PHP que necesita.
- `version`: versión del plugin.

Además, la respuesta incluye la cabecera `X-Core-Version` con la versión del core instalado, útil para comprobar compatibilidades sin hacer una segunda petición.

## Filtrar y ordenar

El listado admite los parámetros `filter` y `sort`, con la misma sintaxis que el resto de recursos de la API.

Para obtener solo los plugins activados:

```
GET http://localhost:8000/api/3/plugins?filter[enabled]=1
```

Los filtros aceptan los sufijos habituales para cambiar el operador:

- `_neq`: distinto de. Ejemplo: `filter[name_neq]=POS`
- `_gt`, `_gte`: mayor que, mayor o igual que. Ejemplo: `filter[version_gte]=2`
- `_lt`, `_lte`: menor que, menor o igual que.
- `_like`: contiene el texto (sin distinguir mayúsculas). Ejemplo: `filter[description_like]=ticket`
- `_null`, `_notnull`: el campo es nulo o no lo es.

Para ordenar se usa `sort`, indicando `ASC` o `DESC`:

```
GET http://localhost:8000/api/3/plugins?sort[version]=DESC
```

## Obtener un plugin concreto

```
GET http://localhost:8000/api/3/plugins/POS
```

Devuelve un único objeto con los mismos campos que el listado. Si el plugin no existe o no está instalado, responde con un `404`:

```
{
    &quot;status&quot;: &quot;error&quot;,
    &quot;message&quot;: &quot;plugin-not-found: POS&quot;
}
```

Si el plugin está marcado como oculto, responde con un `403` y el mensaje `plugin-hidden`.

## Activar un plugin

```
POST http://localhost:8000/api/3/plugins/POS/enable
```

Respuesta correcta:

```
{
    &quot;status&quot;: &quot;success&quot;,
    &quot;message&quot;: &quot;plugin-enabled&quot;
}
```

Si la activación falla, la respuesta es un `400` con `status: error`. En ese caso `message` no es un texto fijo, sino los mensajes del log de la operación, que explican el motivo: dependencias sin cumplir, plugin no compatible, etc.

## Desactivar un plugin

```
POST http://localhost:8000/api/3/plugins/POS/disable
```

```
{
    &quot;status&quot;: &quot;success&quot;,
    &quot;message&quot;: &quot;plugin-disabled&quot;
}
```

Al igual que en la activación, si algo falla se devuelve un `400` con los mensajes del log.

## Permisos y errores comunes

- **Las acciones `enable` y `disable` requieren el método POST.** Con cualquier otro método la respuesta es un `405` con el mensaje `method-not-allowed`.
- **Requieren una API key con acceso completo.** Si la clave no lo tiene, la respuesta es un `403` con el mensaje `full-access-required`.
- Para *listar* plugins no hace falta acceso completo, pero si la API key no lo tiene, necesita un permiso para el recurso `plugins` con la opción de lectura marcada. Se configura en **Administrador &gt; API Keys**, en la pestaña de permisos.
- Cualquier otra acción distinta de `enable` o `disable` devuelve un `400` con el mensaje `invalid-action`.

## Ejemplo con cURL

Listar los plugins activados:

```
curl -H &quot;Token: MI-API-KEY&quot; \
  &quot;http://localhost:8000/api/3/plugins?filter[enabled]=1&quot;
```

Activar un plugin:

```
curl -X POST -H &quot;Token: MI-API-KEY&quot; \
  &quot;http://localhost:8000/api/3/plugins/POS/enable&quot;
```

Tenga en cuenta que activar o desactivar un plugin regenera la carpeta `Dinamic` y puede requerir una actualización de la base de datos, por lo que la petición puede tardar varios segundos.

Si lo que necesitas es activar o desactivar plugins desde código PHP, en lugar de por la API, consulta [Gestión de Plugins](https://facturascripts.com/publicaciones/gestion-de-plugins).