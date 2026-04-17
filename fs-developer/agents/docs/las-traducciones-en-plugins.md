---
id: 1278
permalink: las-traducciones-en-plugins
title: Las traducciones en Plugins
creationdate: 18-09-2022 11:33:44
lastmod: 31-10-2025
url: https://facturascripts.com/las-traducciones-en-plugins
---
FacturaScripts almacena las traducciones en archivos json en la carpeta **Translation** del plugin, de esta forma cada plugin puede contener sus propias traducciones. También puedes usar el plugin [Traducciones](https://facturascripts.com/plugins/traducciones) que te ayudará a crear tus traducciones más fácil.

## ¿Cómo puedo traducir un texto?
Nuestro traductor se basa en el concepto clave-valor, es decir, no ponemos textos completos sino que usamos cadenas separadas por guiones (generalmente en inglés) que tengan una traducción en los archivos de traducciones. Por ejemplo, para mostrar el texto **aceptar**, realmente llamamos a traducir &#39;accept&#39;.

```
use FacturaScripts\Core\Tools;

echo Tools::trans(&#39;accept&#39;);
```

Esto funciona porque en los archivos de traducción ya tenemos la cadena accept y su traducción correspondiente:

- Archivo [es_ES.json](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Translation/es_ES.json#L7) de traducciones al español de España.
- Archivo [ca_ES.json](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Translation/ca_ES.json#L7) de traducciones al catalán.

### Traducciones variables
En ocasiones queremos traducir textos incluyendo partes variables, por ejemplo para informar de que falta el plan contable para el ejercicio 2023. Para estos casos pasamos esos valores al traductor en un array como segundo parámetro, y en la traducción reemplazan a las variables correspondientes, que son las que van entre %. Se ve más fácil con un ejemplo:

```
echo Tools::trans(&#39;accounting-data-missing&#39;, [&#39;%exerciseName%&#39; =&gt; &#39;2023&#39;]);
```

Esta cadena usará estra traducción, sustituyendo %exerciseName% por el valor asignado.

```
&quot;accounting-data-missing&quot;: &quot;Pla comptable no trobat per a l&#39;exercici %exerciseName%&quot;,
```

### ¿Puedo usar traducciones existentes?
Si, simplemente ve al [listado de traducciones en español](https://facturascripts.com/traducciones/lang/es_ES) y busca la que más se te adapte.

### ¿Puedo compartir mis traducciones para que me ayuden a traducir?
Si, si publicas tu plugin en la forja (sección mis plugins), en la página del plugin podrás añadir tus traducciones para que el resto de usuarios de la web pueda traducirlas. Después puedes utilizar el script incluido para descargar las traducciones actualizadas.
