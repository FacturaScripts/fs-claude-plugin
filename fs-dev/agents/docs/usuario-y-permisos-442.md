---
id: 617
permalink: usuario-y-permisos-442
title: Consultar el usuario actual y sus permisos en FacturaScripts
creationdate: 30-04-2018 00:00:00
lastmod: 04-06-2025
url: https://facturascripts.com/usuario-y-permisos-442
---
La clase **Session** de la carpeta *Core* permite consultar y almacenar información del usuario actual desde controladores, modelos y otras clases. Esta herramienta también facilita añadir temporalmente información accesible durante la ejecución actual de la aplicación.

## Añadir información a la sesión
Puedes guardar información personalizada en la sesión usando el método `Session::set()`:

```php
$data = [&#39;color1&#39; =&gt; &#39;rojo&#39;, &#39;color2&#39; =&gt; &#39;verde&#39;];
Session::set(&#39;colores&#39;, $data);
```

&gt; **Nota:** Esta información solo estará disponible durante la ejecución actual.

## Obtener el usuario actual
Para acceder al usuario autenticado actual, utiliza:

```php
$user = Session::user();
if ($user) {
    Tools::log()-&gt;notice($user-&gt;nick);
}
```

### Desde un controlador
En los controladores puedes acceder directamente con:

```php
Tools::log()-&gt;notice($this-&gt;user-&gt;nick);
```

&gt; **Alternativa:** En los controladores, la variable `$this-&gt;user` almacena el usuario actual (es el mismo usuario guardado en la sesión) y solo puede usarse dentro de los controladores.

## Consultar permisos del usuario actual
La clase `User` (objeto retornado por Session) dispone del método `can()` para consultar permisos sobre controladores específicos.

```php
$user = Session::user();

if ($user && $user-&gt;can(&#39;EditPedidoCliente&#39;)) {
    Tools::log()-&gt;notice(&#39;El usuario puede acceder a la edición de pedidos de cliente.&#39;);
}

if ($user && $user-&gt;can(&#39;EditPedidoCliente&#39;, &#39;update&#39;)) {
    Tools::log()-&gt;notice(&#39;El usuario puede editar pedidos de cliente.&#39;);
}
```

### Parámetros del método `can()`
- **$pageName** (obligatorio): nombre del controlador a comprobar.
- **$permission** (opcional): permiso específico a consultar (por defecto es &quot;access&quot;). Permisos disponibles: 
  - `access` (acceso),
  - `delete` (eliminar),
  - `export` (exportar/imprimir),
  - `import` (importar),
  - `update` (modificar),
  - `only-owner-data` (solo ver datos propios).

#### Ejemplo de uso en vistas o plugins personalizados
En pestañas o listados donde solo ciertos usuarios pueden acceder a controladores como EditPresupuestoCliente, EditPedidoCliente, etc., se recomienda consultar los permisos antes de mostrar la información.

### Consulta rápida de permisos en el controlador
La propiedad `$this-&gt;permissions` de los controladores resume los permisos del usuario para ese controlador:

```php
var_dump($this-&gt;permissions);
```

Propiedades principales:
- `allowAccess` (bool): acceso permitido.
- `allowDelete` (bool): permiso para eliminar.
- `allowUpdate` (bool): permiso para modificar.
- `allowExport` (bool): permiso para exportar/imprimir.
- `allowImport` (bool): permiso para importar datos.
- `onlyOwnerData` (bool): sólo ver datos propios.
- `accessMode` (int): nivel de acceso.

&gt; **Nota:** `$this-&gt;permissions` solo está disponible en los controladores.

## Modificar permisos del usuario actual en el controlador
Si necesitas alterar los permisos para el controlador en ejecución, usa el método `set()` en `$this-&gt;permissions`:

```php
// allowAccess, accessMode, allowDelete, allowUpdate, onlyOwnerData
$this-&gt;permissions-&gt;set(true, 99, true, true, false);
```

Esto te permite personalizar los permisos del usuario para el controlador actual de forma puntual, por ejemplo, para conceder acceso temporal:

```php
// Conceder acceso, con nivel 2, sin permisos de eliminar ni modificar
$this-&gt;permissions-&gt;set(true, 2, false, false, false);
```

Esta técnica es útil cuando deseas otorgar permisos extras en extensiones o funcionalidades específicas sin modificar la configuración global de roles/permisos.
