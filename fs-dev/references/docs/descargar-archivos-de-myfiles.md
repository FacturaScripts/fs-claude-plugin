---
id: 979
permalink: descargar-archivos-de-myfiles
title: Descarga de Archivos desde MyFiles
creationdate: 28-08-2021 12:07:26
lastmod: 06-11-2026
url: https://facturascripts.com/publicaciones/descargar-archivos-de-myfiles
---
Los archivos añadidos por el usuario o generados por plugins se almacenan en la carpeta **MyFiles**. Para descargar estos archivos, no basta con ingresar la ruta en el navegador; es necesario un token de autorización para evitar que terceros accedan a información sensible de la empresa.

## 🔓 Excepción en MyFiles/Public

Hay una excepción: los archivos almacenados en la carpeta **MyFiles/Public** pueden ser descargados **sin necesidad de un token**.

### 🔐 Obtención del Token

Para descargar archivos almacenados en la carpeta **MyFiles**, debemos invocar la **clase MyFilesToken** y utilizar el método **get()** para obtener el token de descarga.

#### Ejemplo de cómo obtener la URL de descarga

**Nota:** La ruta del archivo no debe comenzar con `/`.

```php
$path = &#39;MyFiles/archivo.pdf&#39;;
$url = $path . &#39;?myft=&#39; . MyFilesToken::get($path, true);
```

Como atajo, `MyFilesToken::getUrl()` devuelve directamente la ruta con el token ya añadido (acepta los mismos parámetros que `get()`):

```php
$url = MyFilesToken::getUrl(&#39;MyFiles/archivo.pdf&#39;, true);
```

La función **get()** acepta un **segundo parámetro** booleano (true o false):
* Si se establece en **true**, el token permitirá descargar el archivo en cualquier momento, obteniendo así un token con validez permanente.
* Si se establece en **false**, el archivo solo podrá descargarse durante el mismo día. A las 00:00 horas, el token dejará de ser válido.

### 📅 Fecha de Vencimiento Concreta

Si desea obtener un token que caduque más allá del mismo día, por ejemplo, en una semana, puede especificar la fecha de vencimiento como tercer parámetro:

```php
$path = &#39;MyFiles/archivo.pdf&#39;;
$url = $path . &#39;?myft=&#39; . MyFilesToken::get($path, false, &#39;11-11-2026&#39;);
```

Este token expirará el 11 de noviembre de 2026.

### 📃 Obtener el Token desde una Plantilla Twig

Si tenemos la ruta del archivo y deseamos obtener la URL con el token directamente desde la vista, podemos utilizar la función `myFilesUrl()`:

```twig
&lt;a href=&quot;{{ myFilesUrl(ruta) }}&quot;&gt;Descargar&lt;/a&gt;
```

La función `myFilesUrl()` admite los mismos parámetros que `MyFilesToken::get()`: `myFilesUrl(ruta, permanent = false, expiration = &#39;&#39;)`. Por defecto genera un token de un día; pásale `true` como segundo argumento para obtener un enlace permanente.

## 🧾 Tipos de archivo permitidos

El controlador **Myfiles** solo sirve los archivos cuya extensión está en la lista de `Myfiles::isFileSafe()`. Para cualquier otra extensión devuelve la página de error **UnsafeFile** («Archivo no seguro»), aunque el token sea correcto y aunque el archivo esté en `MyFiles/Public`. Los archivos sin extensión sí se sirven.

Hasta la versión 2026.72 no estaban en la lista bmp, eml, heic, heif, m4a, msg, odp, pps, ppsx, ppt, rtf, tar, tif, tiff ni wav.

```
7z, accdb, ai, avi, bmp, cdr, css, csv, doc, docx, dwg, dxf, eml, eot, gif, gz, heic, heif, html, ico,
ics, jfif, jpeg, jpg, js, json, lbx, m4a, map, md, mdb, mkv, mov, mp3, mp4, msg, ndg, odp, ods, odt,
ogg, pdf, png, pps, ppsx, ppt, pptx, rar, rtf, sql, step, svg, tar, tif, tiff, ttf, txt, wav, webm,
webp, woff, woff2, xls, xlsm, xlsx, xml, xsig, zip
```

Para evitar ataques XSS, los archivos **eml, svg, xml, xsig, html, htm y xhtml**, y los que por su tipo MIME real sean HTML, XML, SVG o correo (`message/rfc822`), se envían siempre como descarga (`Content-Disposition: attachment`). Los **csv** también se descargan, para que el navegador no los muestre como texto.

### Al subir archivos

La subida usa una lista distinta: `UploadedFile::isValid()` solo **rechaza** las extensiones que podrían ejecutarse en el servidor: htaccess, htm, html, phar, php, php3, php4, php5, php7, php8, pht, phtm, phtml, phps y shtml.

Por tanto, se puede subir un archivo que luego Myfiles no servirá, como un psd o un exe. Si tu plugin solo debe aceptar archivos descargables, compruébalo antes de moverlo:

```php
use FacturaScripts\Core\Tools;
use FacturaScripts\Dinamic\Controller\Myfiles;

if (false === Myfiles::isFileSafe($uploadFile-&gt;getClientOriginalName())) {
    Tools::log()-&gt;error(&#39;file-not-supported&#39;);
    return;
}
```

Para imágenes, `UploadedFile::isValidImage()` limita la extensión a gif, jpeg, jpg, png y webp, y comprueba el tipo MIME real del contenido. Las miniaturas de `ProductoImagen` solo se generan para gif, jpg, jpeg y png.

La lista para los usuarios está en [La biblioteca de archivos](https://facturascripts.com/publicaciones/la-biblioteca-de-archivos).

## AttachedFiles
Para descargar archivos de la biblioteca tenemos el modelo **AttachedFile**. Podemos llamar al método url(&#39;download&#39;) del modelo para obtener el enlace de descarga del archivo. También admite el valor **download-permanent**.

- **download**: proporciona un enlace de descarga válido durante el día en curso (deja de ser válido a las 00:00).
- **download-permanent**: proporciona un enlace de descarga válido para siempre.