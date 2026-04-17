---
id: 706
permalink: migrar-los-xml-de-las-tablas-800
title: Migrar los XML de las tablas de 2017
creationdate: 27-05-2018 00:00:00
lastmod: 29-05-2025
url: https://facturascripts.com/migrar-los-xml-de-las-tablas-800
---
Como hemos comentado, los archivos XML de las tablas que solían estar en **model/table** en las versiones 2015/2017, ahora deben estar en la carpeta **Table** del plugin.

## Cambios a realizar en el XML
La mayor parte de facturaScripts 2018 ha sido reescrita en inglés, y el resto se cambiará en futuras revisiones. Las etiquetas de los XML de las tablas también han sido reemplazadas por sus equivalentes en inglés:
- &lt; tabla &gt; es ahora &lt; table &gt;
- &lt; columna &gt; es ahora &lt; column &gt;
- &lt; nombre &gt; es ahora &lt; name &gt;
- &lt; tipo &gt; es &lt; type &gt;
- &lt; nulo &gt; es &lt; null &gt;
- &lt; defecto &gt; es &lt; default &gt;
- &lt; restriccion &gt; es &lt; constraint &gt;
- &lt; consulta &gt; es &lt; type &gt;

Puedes leer más sobre [los archivos XML de las tablas de FacturaScripts 2018](/publicaciones/la-definicion-de-la-estructura-de-la-tabla-514) en la documentación.

### Script de migración
Puedes copiar este archivo al directorio donde tengas los xml para hacer la transformación.
```
&lt;?php
chdir(__DIR__);
foreach (scandir(__DIR__) as $filename) {
    if (is_file($filename) && substr($filename, -4) === &#39;.xml&#39;) {
        $txt = file_get_contents($filename);
        $transform = [
            &#39;tabla&gt;&#39; =&gt; &#39;table&gt;&#39;,
            &#39;columna&gt;&#39; =&gt; &#39;column&gt;&#39;,
            &#39;nombre&gt;&#39; =&gt; &#39;name&gt;&#39;,
            &#39;tipo&gt;&#39; =&gt; &#39;type&gt;&#39;,
            &#39;nulo&gt;&#39; =&gt; &#39;null&gt;&#39;,
            &#39;defecto&gt;&#39; =&gt; &#39;default&gt;&#39;,
            &#39;restriccion&gt;&#39; =&gt; &#39;constraint&gt;&#39;,
            &#39;consulta&gt;&#39; =&gt; &#39;type&gt;&#39;,
        ];

        $final = strtr($txt, $transform);
        file_put_contents($filename, $final);
        echo $filename . &#39;\n&#39;;
    }
}
```
