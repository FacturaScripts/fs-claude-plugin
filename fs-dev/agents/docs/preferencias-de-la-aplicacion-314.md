---
id: 693
permalink: preferencias-de-la-aplicacion-314
title: Cómo crear preferencias de aplicación para su plugin
creationdate: 22-10-2018 00:00:00
lastmod: 13-03-2025
url: https://facturascripts.com/preferencias-de-la-aplicacion-314
---
Si necesita añadir opciones de configuración a su plugin, puede crear su propia sección en el apartado **Por defecto** (menú administrador &gt; panel de control) de FacturaScripts. El controlador que gestiona estas secciones es **EditSettings**, un controlador especial que carga automáticamente una sección para cada archivo XML dentro de **XMLView** cuyo nombre comience con el prefijo **Settings**.

Ejemplos de archivos XML válidos:

```
default -&gt; SettingsDefault.xml
email -&gt; SettingsEmail.xml
logs -&gt; SettingsLog.xml

myplugin -&gt; SettingsMyPlugin.xml
```

## Creación del archivo XML
Para crear una nueva sección de configuración, debe crear un archivo llamado **SettingsMyPlugin.xml** en la carpeta **XMLView** de su plugin. Recuerde que, al añadir un nuevo archivo XML, debe regenerar la configuración dinámica (menú administrador &gt; Plugins &gt; botón Reconstruir).

Aquí tiene un ejemplo del contenido que debe tener el archivo:

```
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;view&gt;
    &lt;columns&gt;
        &lt;group name=&quot;data&quot; numcolumns=&quot;12&quot;&gt;
            &lt;column name=&quot;name&quot; display=&quot;none&quot; order=&quot;0&quot;&gt;
                &lt;widget type=&quot;text&quot; fieldname=&quot;name&quot; readonly=&quot;true&quot; required=&quot;true&quot; /&gt;
            &lt;/column&gt;
            &lt;column name=&quot;email&quot; order=&quot;100&quot;&gt;
                &lt;widget type=&quot;text&quot; fieldname=&quot;email&quot; icon=&quot;fas fa-envelope&quot; /&gt;
            &lt;/column&gt;
        &lt;/group&gt;
    &lt;/columns&gt;
&lt;/view&gt;
```

En este ejemplo, hemos nombrado el archivo **SettingsMyPlugin.xml** siguiendo el ejemplo de **MyPlugin**, pero puede darle cualquier nombre, siempre que inicie con **Settings**, sea un archivo XML y se encuentre dentro de la carpeta **XMLView**.

### Columna &#39;name&#39; Obligatoria
Los archivos de configuración deben incluir obligatoriamente una columna **name** para garantizar un funcionamiento correcto:

```
&lt;column name=&quot;name&quot; display=&quot;none&quot; order=&quot;0&quot;&gt;
   &lt;widget type=&quot;text&quot; fieldname=&quot;name&quot; readonly=&quot;true&quot; required=&quot;true&quot; /&gt;
&lt;/column&gt;
```

### Leer configuración
Puede acceder a los valores de cualquiera de los campos de configuración de su plugin utilizando `Tools::settings()` desde cualquier controlador o modelo:

```
use FacturaScripts\Core\Tools;

Tools::settings(&#39;myplugin&#39;, &#39;nombre-campo&#39;);
```

## No utilice EditSettings si...
Como ha visto, **EditSettings** permite añadir opciones de configuración simplemente añadiendo un archivo XMLView con el prefijo **Settings**. Sin embargo, si busca implementar funcionalidades más complejas, es recomendable crear su propio controlador.
