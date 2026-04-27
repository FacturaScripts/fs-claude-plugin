---
id: 612
permalink: creacion-de-plugins-210
title: Creación de Plugins
creationdate: 27-04-2018 00:00:00
lastmod: 08-12-2025
url: https://facturascripts.com/publicaciones/creacion-de-plugins-210
---

Un plugin permite añadir nuevas funcionalidades a FacturaScripts. Si desea realizar cambios en el código de FacturaScripts, **no modifique los archivos del núcleo**, ya que al actualizar perderá esos cambios. En su lugar, debe crear un plugin con las modificaciones deseadas.

## ¿Cómo crear un plugin?
Para crear un plugin, lo primero que necesita es **crear una nueva carpeta** dentro de la **carpeta Plugins**. El nombre de la carpeta será el nombre del plugin y debe comenzar con una letra, sin contener espacios. Ejemplos:

- `MiPlugin` → Correcto
- `2024Plugin` → Incorrecto, no puede comenzar con un número
- `Mi Plugin` → Incorrecto, no puede contener espacios

Dentro del directorio del plugin, debe tener la siguiente estructura de archivos y carpetas:

- Assets/
  - CSS/
  - Images/
  - JS/
- Controller/
- Model/
- Table/
- Translation/
- View/
- XMLView/
- [facturascripts.ini](https://facturascripts.com/publicaciones/el-archivo-facturascripts-ini-37)

### Ejemplo: MyNewPlugin
Cree la carpeta `MyNewPlugin` dentro de `Plugins`. Luego, dentro de ella, cree las carpetas `Assets`, `Controller`, `Model`, `Table`, `View` y `XMLView`. También necesita crear el archivo `[facturascripts.ini](https://facturascripts.com/publicaciones/el-archivo-facturascripts-ini-37)` con el siguiente contenido:

```
name = &#39;MyNewPlugin&#39;
description = &#39;Mi fantástico nuevo plugin para FacturaScripts&#39;
version = 1
min_version = 2025
```

Una vez hecho esto, su plugin será reconocido y podrá activarlo, aunque aún no tendrá ninguna funcionalidad. **Si no le funciona, es probable que haya escrito mal el nombre `facturascripts.ini`.**

## 🧰 fsmaker
También puede [crear rápidamente la estructura de plugins, modelos y controladores con fsmaker](https://facturascripts.com/como-crear-plugin#fsmaker), la nueva herramienta de línea de comandos de FacturaScripts, disponible para Linux y macOS.

```
fsmaker plugin
```

## 📁 Espacios de nombres
Cada clase debe estar en el espacio de nombres correspondiente a su carpeta. Por ejemplo, la clase `Producto` pertenece al espacio de nombres **FacturaScripts\Core\Model\Producto** porque se encuentra en el directorio `Core\Model`.

Cada plugin tiene su espacio de nombres reservado, correspondiente a **FacturaScripts\Plugins\{NOMBRE_DEL_PLUGIN}**. Por ejemplo, los controladores del plugin `MyPlugin` tendrán el siguiente namespace:

```
namespace FacturaScripts\Plugins\MyPlugin\Controller;
```

## 🚦 El sistema de prioridades de plugins
El último plugin activo tiene prioridad sobre los anteriores, y así sucesivamente. Puede [leer más detalles sobre el sistema de prioridades aquí](https://facturascripts.com/publicaciones/el-sistema-de-prioridades-de-plugins-657).

## 🧪 El modo debug
Para mayor comodidad, puede activar el modo debug, que habilitará la barra de debug en la parte inferior derecha, facilitando el proceso de depuración. Simplemente edite el archivo [config.php](https://facturascripts.com/publicaciones/el-archivo-config-php) en el directorio de FacturaScripts y configure la constante **FS_DEBUG** a `true`.

```
define(&#39;FS_DEBUG&#39;, true);
```

También puede pulsar el **botón reconstruir** desde el **menú Administrador → Plugins**. Esto limpia la caché y reconstruye el Dinamic.
