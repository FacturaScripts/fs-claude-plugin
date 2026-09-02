---
id: 979
permalink: descargar-archivos-de-myfiles
title: Descarga de Archivos desde MyFiles
creationdate: 28-08-2021 12:07:26
lastmod: 11-07-2026
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

## AttachedFiles
Para descargar archivos de la biblioteca tenemos el modelo **AttachedFile**. Podemos llamar al método url(&#39;download&#39;) del modelo para obtener el enlace de descarga del archivo. También admite el valor **download-permanent**.

- **download**: proporciona un enlace de descarga válido durante el día en curso (deja de ser válido a las 00:00).
- **download-permanent**: proporciona un enlace de descarga válido para siempre.