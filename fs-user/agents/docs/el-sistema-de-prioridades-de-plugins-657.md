---
id: 611
permalink: el-sistema-de-prioridades-de-plugins-657
title: Sistema de Prioridades de Plugins en FacturaScripts
creationdate: 02-05-2018 00:00:00
lastmod: 18-03-2025
url: https://facturascripts.com/el-sistema-de-prioridades-de-plugins-657
---
En FacturaScripts, es fundamental comprender el sistema de prioridades que rige el funcionamiento de los plugins. **El último plugin activo tiene prioridad sobre los anteriores**. Esto significa que, al consultar una página, se carga el modelo, la vista HTML, XML, un archivo JavaScript o una imagen del plugin con mayor prioridad que contenga el archivo solicitado.

Gracias a este mecanismo, podemos modificar el comportamiento de cualquier página. Simplemente copiamos (o extendemos, si se trata de una clase PHP o vista Twig) el archivo necesario a nuestro plugin, realizamos las modificaciones requeridas y al activar el plugin, que es el último en ser activado, tendrá preferencia sobre los demás.

## Carpeta Dinamic
Para evitar la necesidad de consultar continuamente todos los plugins en busca de un archivo, estos se copian automáticamente a la carpeta **Dinamic**, siguiendo el sistema de prioridades mencionado anteriormente.

Los archivos en **Dinamic** se actualizan cada vez que instalas o actualizas un plugin, o cuando haces clic en el **botón Reconstruir** en el menú Administrador, Plugins.

### Orden de Carga de los Plugins
Desde el listado de plugins (Menú Administrador -&gt; Plugins), puedes observar el orden en que se cargan los plugins. Este orden determina la prioridad en el sistema de carga, asegurando que el último plugin activo tenga mayor prioridad, como se mencionó anteriormente.

![Orden de los plugins](https://facturascripts.com/MyFiles/2025/01/2502.png?myft=9679a24f95878ce4773ce441448716a797041e00)

## Modificación de Archivos Específicos
### Modificar `Core/Controller/ListCliente.php`
Crea el archivo `ListCliente.php` en la carpeta **Controller** de tu plugin. Hereda de la clase original y modifica el archivo según tus necesidades. Activa tu plugin y verás cómo se utiliza tu archivo en lugar del original.

```php
&lt;?php
namespace FacturaScripts\Plugins\MiNuevoPlugin\Controller;

class ListCliente extends \FacturaScripts\Core\Controller\ListCliente
{
	// Tu código aquí
}
```

### Modificar `Core/View/SendMail.html.twig`
Copia el archivo `SendMail.html.twig` a la carpeta **View** de tu plugin y realízale las modificaciones necesarias. Activa tu plugin y verás cómo se utiliza tu archivo en lugar del original.

### Cambiar el Logotipo del Login
Copia la imagen deseada al directorio **Assets/images** de tu plugin y renómbrala a `horizontal-logo.png`. Activa tu plugin y verás cómo se utiliza el nuevo archivo en lugar del original.

## Herencia de Clases
Tanto en los modelos, controladores como en las vistas Twig, puedes heredar de las clases originales. De esta manera, no perderás ninguna de las mejoras que se implementen en el futuro.

### Herencia en Twig
En particular, en una vista de Twig, es posible extender una plantilla externa a tu plugin, como podría ser de **Core** utilizando **@Core**, o de un plugin específico con **@Plugin{NombrePlugin}**, precediéndolo a la ruta de la vista. Este enfoque simplifica la aplicación de cambios específicos, evitando la necesidad de reescribir el archivo completo y garantizando la preservación de las modificaciones de la plantilla padre.
