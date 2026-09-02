---
id: 2161
permalink: como-subir-un-archivo-usando-la-api-de-facturascripts
title: Cómo subir archivos usando la API de FacturaScripts
creationdate: 08-07-2025 12:54:28
lastmod: 10-08-2026
url: https://facturascripts.com/publicaciones/como-subir-un-archivo-usando-la-api-de-facturascripts
---
FacturaScripts permite subir y administrar archivos mediante dos endpoints distintos:

- `uploadFiles`: permite subir uno o varios archivos en una sola petición.
- `attachedfiles`: permite consultar, descargar, crear, modificar o eliminar registros de archivos adjuntos.

Los dos endpoints necesitan un token válido de la API. Puede enviarse en la cabecera `Token` o `X-Auth-Token`.

## Subir uno o varios archivos con `uploadFiles`

Este es el endpoint más sencillo cuando solamente queremos subir archivos. Acepta peticiones `POST` y `PUT`:

```http
POST /api/3/uploadFiles
```

La petición debe usar `multipart/form-data` y cada archivo debe incluirse en el parámetro `files[]`. FacturaScripts rechaza las extensiones que podrían permitir ejecutar código en el servidor, como `.php`, `.phar` o `.phtml`.

**Ejemplo con curl:**

```bash
curl -X POST &#39;https://TU-DOMINIO/api/3/uploadFiles&#39; \
  -H &#39;Token: TU_TOKEN&#39; \
  -F &#39;files[]=@/ruta/imagen1.jpg&#39; \
  -F &#39;files[]=@/ruta/documento.pdf&#39;
```

**Ejemplo en PHP:**

```php
&lt;?php

$ch = curl_init(&#39;https://TU-DOMINIO/api/3/uploadFiles&#39;);
$body = [
    &#39;files[0]&#39; =&gt; new CURLFile(&#39;/ruta/imagen1.jpg&#39;),
    &#39;files[1]&#39; =&gt; new CURLFile(&#39;/ruta/documento.pdf&#39;),
];

curl_setopt_array($ch, [
    CURLOPT_POST =&gt; true,
    CURLOPT_POSTFIELDS =&gt; $body,
    CURLOPT_HTTPHEADER =&gt; [&#39;Token: TU_TOKEN&#39;],
    CURLOPT_RETURNTRANSFER =&gt; true,
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
```

**Ejemplo en JavaScript con Axios:**

```js
const axios = require(&#39;axios&#39;);
const FormData = require(&#39;form-data&#39;);
const fs = require(&#39;fs&#39;);

async function subirArchivos() {
  const form = new FormData();
  form.append(&#39;files[]&#39;, fs.createReadStream(&#39;/ruta/imagen1.jpg&#39;));
  form.append(&#39;files[]&#39;, fs.createReadStream(&#39;/ruta/documento.pdf&#39;));

  const response = await axios.post(
    &#39;https://TU-DOMINIO/api/3/uploadFiles&#39;,
    form,
    {
      headers: {
        Token: &#39;TU_TOKEN&#39;,
        ...form.getHeaders(),
      },
    }
  );

  console.log(response.data);
}

subirArchivos();
```

**Ejemplo de petición con Insomnia:**

![Petición al endpoint de la API con Insomnia](https://i.imgur.com/2LRfCQC.png)

La respuesta contiene un array `files` con un registro `AttachedFile` por cada archivo guardado correctamente:

```json
{
  &quot;files&quot;: [
    {
      &quot;idfile&quot;: 123,
      &quot;filename&quot;: &quot;imagen1.jpg&quot;,
      &quot;mimetype&quot;: &quot;image/jpeg&quot;,
      &quot;path&quot;: &quot;MyFiles/2026/08/123_imagen1.jpg&quot;,
      &quot;size&quot;: 15432
    }
  ]
}
```

Los archivos no válidos se omiten. Por tanto, conviene comprobar que el número de elementos devuelto en `files` coincide con el número de archivos enviados. Si ninguno se pudo guardar, se devuelve un array vacío:

![Array files vacío por error en la petición](https://i.imgur.com/Uqeazwn.png)

Al guardar un archivo, FacturaScripts:

- crea su registro `AttachedFile`;
- lo organiza dentro de `MyFiles` por año y mes;
- genera un nombre único que comienza por `idfile`;
- detecta su tipo MIME y tamaño reales;
- comprueba el límite de almacenamiento configurado;
- elimina los metadatos EXIF, XMP e IPTC de imágenes JPEG, PNG y WebP cuando GD está disponible.

## Administrar archivos con `attachedfiles`

El endpoint `/api/3/attachedfiles` es el CRUD completo del modelo `AttachedFile`. La ruta se escribe en minúsculas.

### Listar archivos

```http
GET /api/3/attachedfiles
```

Admite paginación, ordenación y filtros mediante `limit`, `offset`, `sort`, `filter` y `operation`. La cabecera `X-Total-Count` contiene el número total de registros que cumplen los filtros.

Por ejemplo:

```http
GET /api/3/attachedfiles?limit=20&offset=0&sort[idfile]=DESC
```

### Consultar y descargar un archivo

```http
GET /api/3/attachedfiles/123
```

Además de los datos del archivo, la respuesta incorpora:

- `download`: URL firmada válida durante el día en que se genera.
- `download-permanent`: URL firmada permanente.

### Subir un único archivo

También puede crearse un archivo con `POST /api/3/attachedfiles` y una petición `multipart/form-data`:

```bash
curl -X POST &#39;https://TU-DOMINIO/api/3/attachedfiles&#39; \
  -H &#39;Token: TU_TOKEN&#39; \
  -F &#39;file=@/ruta/documento.pdf&#39;
```

Este endpoint crea un único registro `AttachedFile` por petición. Aunque se envíen varios campos de archivo, internamente trabaja con un solo modelo; para una carga múltiple debe utilizarse `uploadFiles`.

### Modificar o eliminar

```http
PUT /api/3/attachedfiles/123
PATCH /api/3/attachedfiles/123
DELETE /api/3/attachedfiles/123
```

`PUT` y `PATCH` modifican los campos del registro. `DELETE` elimina tanto el registro como el archivo físico.

También puede consultarse el esquema del recurso:

```http
GET /api/3/attachedfiles/schema
```

## Vincular el archivo con productos, clientes o documentos

Subir un archivo no lo vincula automáticamente con una factura, pedido, producto, cliente, proveedor u otro registro. Para crear esa relación se utiliza el endpoint `attachedfilerelations`, indicando:

- `idfile`: identificador devuelto al subir el archivo.
- `model`: nombre del modelo relacionado, por ejemplo `FacturaCliente`.
- `modelid`: identificador numérico del registro, por ejemplo el `idfactura` de una factura.
- `modelcode`: código del registro cuando se utiliza una clave textual. Según el modelo relacionado se utilizará `modelid`, `modelcode` o ambos.

En resumen: usa `uploadFiles` para cargas simples o múltiples y `attachedfiles` para listar, descargar, administrar o subir un único archivo.

## Código relacionado

- [ApiUploadFiles.php](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Controller/ApiUploadFiles.php)
- [ApiAttachedFiles.php](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Controller/ApiAttachedFiles.php)
- [AttachedFile.php](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Model/AttachedFile.php)