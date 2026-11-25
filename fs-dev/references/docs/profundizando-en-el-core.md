---
id: 1598
permalink: profundizando-en-el-core
title: Profundizando en el CORE
creationdate: 21-11-2023 17:30:38
lastmod: 23-11-2026
url: https://facturascripts.com/publicaciones/profundizando-en-el-core
---
FacturaScripts es también un framework PHP, por lo que también implementa los mismos conceptos que otros frameworks:

- [Enrutado](https://facturascripts.com/publicaciones/enrutado-el-sistema-de-rutas)
- [Gestión de errores](https://facturascripts.com/publicaciones/gestion-de-errores)
- [Gestión de plugins](https://facturascripts.com/publicaciones/gestion-de-plugins)
- [Logs](https://facturascripts.com/publicaciones/mostrar-mensajes-errores-y-alertas)
- [Caché](https://facturascripts.com/publicaciones/uso-de-la-cache)
- [Acceso a base de datos](https://facturascripts.com/publicaciones/acceso-a-la-base-de-datos-818)
- [Colas de trabajo](https://facturascripts.com/publicaciones/la-cola-de-trabajos)

## El Kernel
El kernel de FacturaScripts se encarga tanto del enrutado como de la gestión de errores, además de proporcionar funciones para comprobar tiempos de ejecución.

### Versión de FacturaScripts
Podemos obtener la versión de FacturaScripts que estamos ejecutando llamando a la función ``Kernel::version()``.

```
use FacturaScripts\Core\Kernel;

echo Kernel::version();
```

### Obtener el tiempo de ejecución
Podemos obtener el tiempo de ejecución llamando a la función ``Kernel::getExecutionTime()``. Este función nos devuelve el tiempo total, en segundos, con 5 decimales.

```
echo Kernel::getExecutionTime(); // 0.00123
```

### Calcular un tiempo de ejecución
Si queremos saber cuanto tardamos en ejecutar una determinada función o bloque de código, podemos usar un temporizador. Para ello debemos iniciarlo llamando a la función ``Kernel::startTimer()`` y luego detenerlo llamando a ``Kernel::stopTimer()``.

```
// iniciamos un temporizador
Kernel::startTimer(&#39;mi-prueba&#39;);

// tu código aquí

// detenemos el temporizador
$total = Kernel::stopTimer(&#39;mi-prueba&#39;);
echo $total; // este es el tiempo de ejecución, en segundos

// también podemos obtener el tiempo llamando a getTimer()
echo Kernel::getTimer(&#39;mi-prueba&#39;);
```

Si tenemos activado el [modo debug](https://facturascripts.com/publicaciones/creacion-de-plugins-210#md_h6), podremos ver los temporizadores en la primera sección de la **barra de debug**. El propio core crea varios durante el recorrido de una petición (ver más abajo): `kernel::init` (paso 3), `plugins::init` (paso 5), `kernel::run` (pasos 6 a 9) y `Controller::html-render` (renderizado de la plantilla).

![barra debug](https://i.imgur.com/MSECHqv.png)

## Recorrido de una petición
Todas las peticiones entran por `index.php`, tanto las del navegador como las de la API o el cron. Este diagrama muestra el recorrido completo, desde que llega la petición hasta que se envía la respuesta. Los números coinciden con los apartados que vienen a continuación.

![Flujo](https://facturascripts.com/MyFiles/2026/11/8352_flujo_index_kernel.png?myft=8e8989ad8ba80b13ddccc10c5e3bf9f7b115a63c17d2c9342df26ffca017a039)

### 0. Modo mantenimiento
Antes de cargar nada, `index.php` comprueba si existe el archivo `MyFiles/maintenance`, que se crea mientras se instala una actualización (ver `Core/Maintenance.php`). Si está activo y no ha caducado, responde con un **503** sin cargar el autoloader, porque las carpetas `Core` y `vendor` pueden estar a medio sustituir. La respuesta es JSON en `/api`, texto plano en `/cron` y HTML en el resto. La petición que continúa la actualización trae el token en la url (`?maintenance=...`) y sí pasa.

### 1. Carga de la configuración
Se carga `vendor/autoload.php` y, si existe, `config.php`. Después se desactiva el límite de tiempo (`set_time_limit(0)` e `ignore_user_abort(true)`) y se establece la zona horaria con `Tools::config(&#39;timezone&#39;, &#39;Europe/Madrid&#39;)`.

### 2. Gestor de errores fatales
`CrashReport::init()` abre el buffer de salida con `ob_start()` y registra `CrashReport::shutdown()` con `register_shutdown_function()`. Si en cualquier punto posterior se produce un **error fatal de PHP** (también un `Error` o `TypeError` que nadie captura), `CrashReport::shutdown()` limpia el buffer, responde con un **500**, guarda el detalle en `MyFiles/crash_&lt;hash&gt;.json` y muestra el error en HTML, JSON o texto según el tipo de petición.

### 3. Inicialización del Kernel
`Kernel::init()` arranca el temporizador `kernel::init` y:

- Define las constantes antiguas `FS_CODPAIS`, `FS_CURRENCY_POS`, `FS_ITEM_LIMIT`, `FS_NF0`, `FS_NF1` y `FS_NF2`, para dar soporte a plugins antiguos.
- Establece el idioma con `Translator::setDefaultLang()`, a partir de la cookie `fsLang` o de la configuración.
- Registra el mod de cálculo `CalculatorModSpain` con `Calculator::addMod()`.
- Registra los workers del core con `WorkQueue::addWorker()`.

### 4. Cálculo de la url
Si se ejecuta desde la terminal con `php index.php -cron`, la url es `/cron`. En cualquier otro caso es la ruta de `$_SERVER[&#39;REQUEST_URI&#39;]`.

### 5. Carga de plugins
`Plugins::init()` recorre los plugins activos, en su orden, y llama a `Plugin::init()` de cada uno. Este método ejecuta la clase `Init` del plugin:

- `Init::update()`, si el plugin se acaba de activar o actualizar.
- `Init::uninstall()`, si se acaba de desactivar.
- `Init::init()`, en cada petición mientras el plugin esté activo. Aquí es donde los plugins cargan sus extensiones y añaden rutas.

`update()` y `uninstall()` se protegen con `Kernel::lock()` para que no se ejecuten dos veces a la vez.

Este paso **no se ejecuta** si la url es `/deploy` o si falta `db_name` en la configuración, porque entonces se va a mostrar el instalador o a reconstruir la carpeta `Dinamic` y los plugins no pueden usar la base de datos.

### 6. Ejecución del Kernel y carga de rutas
`Kernel::run($url)` arranca el temporizador `kernel::run` y calcula la url relativa con `getRelativeUrl()`, que la sanea y le quita la ruta base de la instalación (`Tools::config(&#39;route&#39;)`).

Después, `Kernel::loadRoutes()` carga las rutas:

- **Sin base de datos configurada** (`db_name` vacío): solo se cargan las rutas del instalador. `/` apunta a `Installer` y `/Core/Assets/*` y `/node_modules/*` a `Files`. Cualquier otra url da página no encontrada.
- **Con base de datos**: `loadDefaultRoutes()` añade las rutas predeterminadas (`/`, `/api`, `/api/3/...`, `/cron`, `/deploy`, `/login`, `/MyFiles/*`, `/Plugins/*`, etc.) y después se añaden las del archivo `MyFiles/routes.json`, que contiene una ruta por cada controlador de `Dinamic/Controller` y las añadidas por los plugins. Al final se ordenan por `position`: primero las de posición menor.

El archivo `MyFiles/routes.json` se genera al activar o desactivar plugins, con `Kernel::rebuildRoutes()` y `Kernel::saveRoutes()`.

### 7. Resolución de la ruta y ejecución del controlador
`Kernel::runController()` recorre las rutas y se queda con la primera que encaja con la url, ya sea por coincidencia exacta o por comodín (las rutas terminadas en `*`). Si ninguna encaja, lanza `KernelException(&#39;PageNotFound&#39;)`.

Con la ruta encontrada, `checkControllerClass()` busca la clase del controlador en `Dinamic\Controller` y, si no existe, en `Core\Controller`. Después crea el controlador con `new $controller($name, $url)` y llama a su método `run()`. Lo que ocurre dentro depende del tipo de controlador; está detallado más abajo, en el apartado «Las ramas principales».

### 8. Envío de la respuesta
Cuando el controlador termina, `Kernel::finishRequest()` cierra la conexión con el navegador para que no espere por el trabajo que todavía queda en el servidor: usa `fastcgi_finish_request()` si está disponible y, si no, envía `Connection: close` y vacía el buffer. En la terminal (cron) no hace nada.

### 9. Gestión de errores
Si el controlador, o la búsqueda de la ruta, lanza una excepción, `Kernel::run()` la captura y `Kernel::getErrorHandler()` elige el controlador de errores:

- Si es una `KernelException`, usa la clase indicada en la propia excepción (`$exception-&gt;handler`), buscándola primero en `Dinamic\Error` y luego en `Core\Error`. Por ejemplo `PageNotFound` (404), `AccessDenied`, `AuthenticationRequired` (redirige al login), `DisabledApi`, `InvalidApiToken`, `AlreadyInstalled`...
- Si es cualquier otra excepción, usa `DefaultError`, que guarda el error, responde con un 500 y muestra el mensaje, el fragmento de código y el log.

Finalmente se llama a `$handler-&gt;run()`, que genera la página de error. Un plugin puede sustituir cualquiera de estas páginas creando una clase con el mismo nombre en su carpeta `Error`.

Solo se capturan objetos `Exception`. Los errores de PHP (`Error`, `TypeError`...) no pasan por aquí y los gestiona `CrashReport::shutdown()` (paso 2).

### 10. ¿Se ha sustituido el código?
Si durante la petición se han reemplazado archivos del núcleo o de un plugin (por ejemplo, al actualizar), el controlador lo marca con `Kernel::markCodeReplaced()`. En ese caso `Kernel::codeReplaced()` devuelve `true` e `index.php` termina sin ejecutar nada más, porque las clases nuevas del disco se mezclarían con las antiguas ya cargadas en memoria.

### 11. Tareas finales
Si hay conexión con la base de datos, `index.php` aprovecha que el navegador ya tiene su respuesta para:

- Ejecutar la cola de trabajos con `WorkQueue::run()`.
- Actualizar la telemetría con `Telemetry::init()-&gt;update()`.
- Guardar los logs con `MiniLog::save()` y cerrar la conexión con `$db-&gt;close()`.

## Las ramas principales
Este segundo diagrama detalla qué hace el método `run()` de cada tipo de controlador. Las cajas rojas son las excepciones que lanzan y que acaban en la gestión de errores del paso 9.

![Qué hace cada tipo de controlador](https://facturascripts.com/MyFiles/2026/11/8353_ramas_controladores.png?myft=8be001b0c19db5e60c06f846696a3ac95fc9fef33ad8a18bd02a0ff902495423)

### Instalador
Cuando no hay `db_name` en la configuración, la única ruta disponible es `/`, que ejecuta `Installer::run()`. Este controlador comprueba los requisitos con `searchErrors()` y muestra el formulario `Installer/Install.html.twig`. Al enviarlo por POST ejecuta `createDataBase()`, `createFolders()`, `saveHtaccess()` y `saveInstall()`, que escribe el `config.php`, y muestra `Installer/Redir.html.twig`. Si se llega al instalador con FacturaScripts ya instalado, su constructor lanza `KernelException(&#39;AlreadyInstalled&#39;)`.

### Controladores normales
Los controladores de las pantallas (`ListController`, `EditController`, `PanelController` y los que heredan directamente de `Core\Base\Controller`) siguen `Base\Controller::run()`:

1. Crean un objeto `Response`.
2. Intentan autenticar al usuario con `auth()`, a partir de las cookies `fsNick` y `fsLogkey`.
3. Si lo consiguen, ejecutan `privateCore($response, $user, $permissions)`, que lanza `KernelException(&#39;AccessDenied&#39;)` si el usuario no tiene permiso para esta página.
4. Si no, ejecutan `publicCore($response)`, que muestra la plantilla `Login/Login.html.twig`.
5. Renderizan la plantilla con `$response-&gt;view()` y la envían con `$response-&gt;send()`.

Los controladores que heredan de `Core\Template\Controller` (por ejemplo `Root`) siguen `Template\Controller::run()`: autentican con `auth()` y, si el controlador requiere autenticación (`$requiresAuth`) y no hay sesión, lanzan `KernelException(&#39;AuthenticationRequired&#39;)`, que redirige al login. Después comprueban los permisos con `ControllerPermissions` (`AccessDenied` si no hay acceso), cargan la empresa y los assets con `AssetManager`, y la clase hija genera y envía la respuesta.

### API
Las rutas `/api` y `/api/3/...` usan controladores que heredan de `ApiController`. Su `run()` hace estas comprobaciones, en este orden, y lanza una `KernelException` en cuanto una falla:

1. La API está activada (`api_key` en `config.php` o `enable_api` en el panel de control). Si no: `DisabledApi`.
2. Si la petición es `OPTIONS`, responde solo con las cabeceras CORS.
3. La IP no está bloqueada por exceso de incidencias (`clientHasManyIncidents()`). Si no: `IpBannedOnApi`.
4. El token de las cabeceras `X-Auth-Token` o `Token` es válido (`validateApiToken()`). Si no: `InvalidApiToken`.
5. No se ha superado el límite de peticiones (`checkRateLimit()`). Si no: `ApiRateLimitExceeded`.
6. La clave tiene permiso sobre el recurso (`isAllowed()`). Si no: `ForbiddenApiEndpoint`.
7. La versión de la url es la 3. Si no: `MissingApiVersion` o `InvalidApiVersion`.

Superadas las comprobaciones, se llama a `runResource()`, que cada controlador de la API implementa. En `ApiRoot` busca el recurso en el mapa de modelos y lanza `InvalidApiResource` si no existe. Al final se envía la respuesta en JSON con `$response-&gt;send()`.

### Cron
El cron se ejecuta con `php index.php -cron` o visitando `/cron`. `Cron::run()` responde en texto plano y ejecuta tres pasos:

1. `runPlugins()`: llama a `Cron::run()` de cada plugin activo que tenga la clase `Plugins\&lt;Plugin&gt;\Cron`.
2. `runCoreJobs()`: los trabajos periódicos del core.
3. `runWorkQueue()`: procesa la cola de trabajos.

Después de cada paso comprueba `Maintenance::isActive()`: si se ha empezado a instalar una actualización, se detiene. Al terminar muestra los mensajes del log y limpia la caché caducada con `Cache::expire()`.

### Otras rutas
- `/deploy` ejecuta `Deploy::run()`, que reconstruye la carpeta `Dinamic` con `Plugins::deploy()` si no existe. Recuerde que en esta ruta no se cargan los plugins (paso 5).
- `/login` ejecuta `Login`.
- `/Core/Assets/*`, `/Dinamic/Assets/*`, `/Plugins/*` y `/node_modules/*` sirven archivos estáticos con `Files`, y `/MyFiles/*` con `Myfiles`.