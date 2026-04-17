---
id: 644
permalink: columns-88
title: Columns (XMLView)
creationdate: 07-05-2018 00:00:00
lastmod: 28-05-2025
url: https://facturascripts.com/columns-88
---
En los archivos de la carpeta XMLView tenemos la estructura de campos a mostrar en listados o formularios de edición. Un archivo debe tener una **etiqueta view** y dentro de esta una **etiqueta column**.

Dentro de la **etiqueta column** podemos tener varias [etiquetas column](/publicaciones/column-725), si el archivo es para un listado, o varias [etiquetas group](/publicaciones/group-747), si el archivo es para un formulario de edición. Las etiquetas group o grupos sirven para agrupar varias columnas.

```
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;view&gt;
    &lt;columns&gt;
        &lt;group name=&quot;data&quot; numcolumns=&quot;12&quot;&gt;
            &lt;column name=&quot;id&quot; display=&quot;none&quot; order=&quot;100&quot;&gt;
                &lt;widget type=&quot;text&quot; fieldname=&quot;id&quot; /&gt;
            &lt;/column&gt;
            &lt;column name=&quot;name&quot; order=&quot;110&quot;&gt;
                &lt;widget type=&quot;text&quot; fieldname=&quot;nombre&quot; /&gt;
            &lt;/column&gt;
            &lt;column name=&quot;price&quot; display=&quot;right&quot; order=&quot;120&quot;&gt;
                &lt;widget type=&quot;number&quot; fieldname=&quot;precio&quot; /&gt;
            &lt;/column&gt;
        &lt;/group&gt;
    &lt;/columns&gt;
&lt;/view&gt;
```

## Los name son identificadores
Recuerda que el **atributo name** en las etiquetas son usados por FacturaScripts como identificador, así que no podrás tener dos grupos o columnas con el mismo name.
