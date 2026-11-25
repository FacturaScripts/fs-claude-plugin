---
id: 663
permalink: widget-file-359
title: Widget de Archivos (WidgetFile)
creationdate: 06-10-2018 00:00:00
lastmod: 06-11-2026
url: https://facturascripts.com/publicaciones/widget-file-359
---
El widget `file` muestra un campo para subir un archivo en los formularios de edición (EditController, EditView). Al guardar, el archivo se copia a la carpeta `MyFiles` y en el campo del modelo se guarda **solo el nombre del archivo**, no la ruta.

```xml
&lt;column name=&quot;file&quot; numcolumns=&quot;12&quot;&gt;
    &lt;widget type=&quot;file&quot; fieldname=&quot;myfile&quot;/&gt;
&lt;/column&gt;
```

Debajo del campo se muestra automáticamente el tamaño máximo de subida que admite el servidor (el menor de `upload_max_filesize` y `post_max_size` de PHP).

Así es como se ve el widget de archivos en un formulario de edición. El aspecto puede variar dependiendo del navegador:

![Widget de Archivos en Edición](https://i.imgur.com/mdsp1Yz.png)

## Atributos

- **`fieldname`**: campo del modelo donde se guarda el nombre del archivo.
- **`accept`**: extensiones o tipos MIME que ofrece el selector del navegador, por ejemplo `.xlsx,.xls` o `image/*`. Es solo una ayuda para el usuario: **no se valida en el servidor**.
- **`multiple`**: con `multiple=&quot;true&quot;` el navegador permite elegir varios archivos. El widget no los procesa por sí solo; mira la sección «Varios archivos».

Además admite los atributos comunes de los widgets, como `readonly` o `required`. En modo solo lectura se muestra el nombre del archivo en un campo de texto, sin selector.

```xml
&lt;column name=&quot;file&quot; numcolumns=&quot;12&quot;&gt;
    &lt;widget type=&quot;file&quot; fieldname=&quot;myfile&quot; accept=&quot;.xlsx,.xls&quot;/&gt;
&lt;/column&gt;
```

## Qué hace al guardar

1. Si no se ha seleccionado ningún archivo, no hace nada: el campo conserva su valor.
2. Descarta el archivo si su extensión está bloqueada o si la subida ha fallado. Se bloquean las extensiones que podrían ejecutarse en el servidor (`php`, `phtml`, `phar`, `htaccess`, `html`…). En ese caso se muestra un error y el campo no cambia. El resto de tipos se aceptan, pero después solo se pueden descargar los de la [lista de tipos permitidos](https://facturascripts.com/publicaciones/descargar-archivos-de-myfiles).
3. Mueve el archivo a `MyFiles/` con su nombre original. Si ya existe un archivo con ese nombre, le antepone un número aleatorio (`123456_factura.pdf`) para no sobrescribirlo.
4. Guarda en el campo del modelo el nombre final, que puede no coincidir con el original.

**Archivos demasiado grandes:** si el archivo supera `upload_max_filesize`, PHP lo descarta antes de que llegue al widget y no se muestra ningún error: el guardado continúa como si no se hubiera elegido archivo. Si la petición completa supera `post_max_size`, se pierden todos los datos del formulario. Por eso el widget muestra el tamaño máximo bajo el campo.

Lo que ocurra después es responsabilidad del plugin: moverlo a otra carpeta, renombrarlo, crear un `AttachedFile`, borrar el archivo anterior al sustituirlo, etc. El widget no borra nunca archivos de `MyFiles`.

## Leer el archivo en un controlador propio

Si procesas el formulario tú mismo, obtén el archivo con el objeto `Request`. Devuelve un `UploadedFile`, o `null` si no se ha enviado ninguno:

```php
$uploadFile = $this-&gt;request-&gt;file(&#39;myfile&#39;);
if (null === $uploadFile) {
    return;
}

if (false === $uploadFile-&gt;isValid()) {
    Tools::log()-&gt;error($uploadFile-&gt;getErrorMessage());
    return;
}

$uploadFile-&gt;move(FS_FOLDER . &#39;/MyFiles/&#39;, $uploadFile-&gt;getClientOriginalName());
```

`isValid()` comprueba también las extensiones bloqueadas, así que úsalo siempre antes de mover el archivo. Para imágenes existe `isValidImage()`, que además limita la extensión a gif, jpeg, jpg, png y webp, comprueba el tipo MIME real del contenido (no el que envía el navegador) y, si está disponible la extensión GD, verifica que el archivo se pueda abrir como imagen.

## Varios archivos

Con `multiple=&quot;true&quot;` el formulario envía un array de archivos. `file()` devuelve `null` en este caso; hay que usar `getArray()`:

```php
foreach ($this-&gt;request-&gt;files-&gt;getArray(&#39;myfile&#39;) as $uploadFile) {
    if (false === $uploadFile-&gt;isValid()) {
        Tools::log()-&gt;error($uploadFile-&gt;getErrorMessage());
        continue;
    }

    // mover o procesar cada archivo
}
```

El guardado automático del widget (EditController) ignora los archivos cuando se usa `multiple`, porque el campo del modelo solo puede guardar un nombre. Procésalos tú mismo en el controlador, como en el ejemplo anterior.

&gt; **Versiones anteriores:** hasta la 2026.72, usar `multiple=&quot;true&quot;` en un formulario que guarda EditController provoca un error al enviar varios archivos, y un aviso de error al guardar sin elegir ninguno. Si tu plugin debe funcionar con esas versiones, no uses `multiple` en formularios de edición estándar.