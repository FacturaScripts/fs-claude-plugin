---
id: 705
permalink: migracion-de-plugins-de-2015-2017-822
title: Migración de plugins antiguos
creationdate: 27-05-2018 00:00:00
lastmod: 03-02-2026
url: https://facturascripts.com/migracion-de-plugins-de-2015-2017-822
---
No existe el código perfecto. Crear un framework con nuevas funciones que sea compatible hacia atrás por los siglos de los siglos es el santo grial de los informáticos. Hasta ahora, nadie lo ha conseguido, y cada cierto tiempo es necesario romper la compatibilidad con plugins antiguos, a veces poco y otras, mucho.

## 🧰 fsmaker
Tenemos una herramienta en línea de comandos para simplificar el desarrollo de plugins y, entre las muchas opciones que tiene, está la opción `upgrade`, para hacer automáticamente los cambios necesarios para adaptar el plugin a la última versión de FacturaScripts:
- https://facturascripts.com/fsmaker

## ⚙️ Cambios en la v2025
- El requisito mínimo es ahora PHP 8.0.
- 📌 Todos los plugins que tengan **min_version** &lt; 2025 se consideran incompatibles.
- Los modelos deben heredar ahora de `Core/Template/ModelClass` y usar `Core/Template/ModelTrait` (en lugar de los archivos de `Core/Model/Base`).
- Los modelos que antes heredaban de **ModelOnChangeClass** deben heredar ahora de `Core/Template/ModelClass` (no pierden funciones, los nuevos modelos ya incorporan esos cambios). Cambia las menciones de `$this-&gt;previousData[KEY]` por `$this-&gt;getOriginal(KEY)`.
- El [método clear() de los modelos](https://facturascripts.com/publicaciones/clear-396) debe terminar en **void**.
- El [método all() de los modelos](https://facturascripts.com/publicaciones/all-863) ya no tiene el límite de 50 elementos por defecto.
- En los modelos, hay que reemplazar las llamadas a `property_exists($model, &#39;nombre_columna&#39;)` por `$model-&gt;hasColumn(&#39;nombre_columna&#39;)`.
- Se ha reemplazado la clase Request de Symfony por una propia y compatible. Conoce nuestra nueva [clase Request](https://facturascripts.com/publicaciones/objeto-request-como-recibir-datos-de-formularios-url-cookies-etc).
- También hemos reemplazado la clase Response de Symfony por otra propia y compatible. Consulta la nueva [clase Response](https://facturascripts.com/publicaciones/objeto-response-como-devolver-datos).
- En los listados se reemplazó `code` por `codes` para los checkbox. Además, ahora hay que usar `$this-&gt;request-&gt;request-&gt;getArray(&#39;codes&#39;)` para obtener el array.

## ⚙️ Cambios en la v2024
- El requisito mínimo es ahora PHP 7.4.
- La clase **CronClass** se encuentra ahora en `Core/Template` y ha sido rediseñada para facilitar la creación de [tareas programadas](https://facturascripts.com/publicaciones/el-archivo-cron-php-855).
- La clase **InitClass** también se ha movido a `Core/Template`. Revisa la documentación del [Init.php](https://facturascripts.com/publicaciones/el-archivo-init-php-307).

## ⚙️ Cambios en la v2023
- El requisito mínimo es ahora PHP 7.3.
- La clase `Core/Base/Cache` ha sido reemplazada por [Core/Cache](https://facturascripts.com/publicaciones/uso-de-la-cache).
- La función `getClientIp()` de la clase **IpFilter** ha sido reemplazada por la misma función en `Core/Session`.
- La clase `Core/App/WebRender` ha sido reemplazada por `Core/Html`.
- La clase `Core/Base/PluginManager` ha sido reemplazada por [Core/Plugins](https://facturascripts.com/publicaciones/gestion-de-plugins).
- La clase `Core/Base/DownloadTools` ha sido reemplazada por [Core/Http](https://facturascripts.com/publicaciones/cliente-http).
- La clase `Core/App/AppSettings` ha sido reemplazada por [Core/Tools](https://facturascripts.com/publicaciones/appsettings-427).
- La clase `Core/Base/ToolBox` ha sido reemplazada por `Core/Tools`.
- Las llamadas a `i18n.trans()` en las plantillas HTML han sido reemplazadas por `trans()`.
- Las llamadas a `appSettings.get()` en las plantillas HTML han sido reemplazadas por `settings()`.
- Las llamadas a `fsc.toolBox().coins().format()` en las plantillas HTML han sido reemplazadas por `money()`.
- Las llamadas a `fsc.toolBox().numbers().format()` en las plantillas HTML han sido reemplazadas por `number()`.

## ⚙️ Cambios en la v2022
La versión 2022 requiere como mínimo PHP 7.2. Además, se puede requerir una versión superior de PHP desde [el archivo facturascripts.ini del plugin](https://facturascripts.com/publicaciones/el-archivo-facturascripts-ini-37). También [se han abandonado los gidview](https://facturascripts.com/publicaciones/addgridview-524) y se han [rediseñado los formularios de albaranes, facturas, pedidos, presupuestos y asientos](https://facturascripts.com/publicaciones/facturascripts-2022-beta-disponible).

### 📌 Min version &gt;= 2020
Todos los plugins que tengan en su archivo **facturascripts.ini** un min_version menor que 2020 se consideran incompatibles con la versión 2022.

### 📌 Forzado del tipo de retorno en muchas funciones
Para reducir los errores de programación y facilitar las herramientas de análisis de código, se han forzado los tipos de retorno de muchas funciones. Por ejemplo, la función **getPageData()** de [los controladores](https://facturascripts.com/publicaciones/los-controladores-410) debe forzar el tipo de retorno array:

![forzado tipo retorno php](https://i.imgur.com/Qhku2vl.png)

La diferencia está en que **getPageData()**: array indica a PHP que lo que devuelve la función debe ser un array o, de lo contrario, debe detener la ejecución. Lo mismo aplica para la función **getModelClassName()** de los [EditController](https://facturascripts.com/publicaciones/editcontroller-642), que debe forzar el retorno de string:

```php
&lt;?php
namespace FacturaScripts\Core\Controller;

class EditFabricante extends \FacturaScripts\Core\Lib\ExtendedController\EditController
{
    public function getModelClassName(): string
    {
        return &#39;Fabricante&#39;;
    }
}
```

En los modelos, se debe forzar el tipo de retorno de las siguientes funciones (si las tiene el modelo):
- **delete(): bool**
- **install(): string**
- **loadFromCode($code, array $where = [], array $order = []): bool**
- **primaryColumn(): string**
- **primaryDescriptionColumn(): string**
- **tableName(): string**
- **test(): bool**
- **save(): bool**
- **saveInsert(array $values = []): bool**
- **saveUpdate(array $values = []): bool**
- **url(string $type = &#39;auto&#39;, string $list = &#39;List&#39;): string**

### 🔄 Calculator sustituye a BusinessDocTool
Se ha reemplazado la clase BusinessDocTool para calcular los totales de facturas, albaranes, pedidos y presupuestos:

```php
$tools = new BusinessDocumentTools();
$tools-&gt;recalculate($albaran);
```

Ahora se debe usar la nueva **clase Calculator**:

```php
$lines = $albaran-&gt;getLines();
Calculator::calculate($albaran, $lines, true);
```

## ⚙️ Cambios en la v2020
Los modelos de más de una tabla, conocidos como ModelView, se renombraron a [JoinModel](https://facturascripts.com/publicaciones/modelos-de-solo-visionado-o-multiples-tablas-777).

## ⚙️ Cambios en la v2018
La versión 2018 es un rediseño completo, por lo que no tiene compatibilidad con la versión 2017 o anteriores. Hemos renombrado las carpetas existentes y añadido algunas nuevas. La nueva estructura queda así:
- **Controller**: anteriormente llamada **controller**. Contiene todos los controladores del plugin.
- **Model**: anteriormente llamada **model**. Contiene todos los modelos del plugin.
- **Table**: anteriormente llamada **model/table**. Contiene los archivos XML con la estructura de cada tabla usada por los modelos del plugin.
- **View**: anteriormente llamada **view**. Contiene las vistas HTML usadas por el plugin.
