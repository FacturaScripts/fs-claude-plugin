---
id: 2161
permalink: como-subir-un-archivo-usando-la-api-de-facturascripts
title: Cómo subir archivos usando la API de FacturaScripts
creationdate: 08-07-2025 12:54:28
lastmod: 20-04-2026
url: https://facturascripts.com/publicaciones/como-subir-un-archivo-usando-la-api-de-facturascripts
---
FacturaScripts permite la subida de archivos mediante el uso de su API. Para ello, se debe realizar una petición al endpoint `uploadFiles`.

### Cómo hacer la petición al endpoint

Para hacer la petición, se debe enviar una solicitud **POST** al siguiente endpoint:

```
POST /api/3/uploadFiles
```

En el cuerpo (body) de la petición, se debe incluir el parámetro `files[]` junto al archivo que se desea subir. **FacturaScripts no permite subir archivos con extensión .php.**

**Ejemplo de petición al endpoint de la API con Insomnia**

![Imagen de petición al endpoint de la API con Insomnia](https://i.imgur.com/2LRfCQC.png)

**Ejemplo en PHP:**

```
$ch = curl_init();
$body = [
    &#39;files[]&#39; =&gt; new CURLFile(&#39;/ruta/a/tuArchivo/imagen1.jpg&#39;),
]
$headers = [
    &#39;Token:&#39; . &#39;TuToken&#39;,
];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_URL, &#39;http://TuURL/api/3/uploadFiles&#39;);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
$response = curl_exec($ch);
curl_close($ch);
```

**Ejemplo en JS:**

```
const axios = require(&#39;axios&#39;);
const FormData = require(&#39;form-data&#39;);
const fs = require(&#39;fs&#39;);

async function subirArchivo() {
  const form = new FormData();

  form.append(&#39;files[]&#39;, fs.createReadStream(/ruta/a/tuArchivo/imagen1.jpg), {
    filename: &#39;img1.jpg&#39;,
    contentType: &#39;image/jpeg&#39;
  });

  const headers = {
    &#39;Token&#39;: &#39;TuToken&#39;,
    ...form.getHeaders(),
  };

  const response = await axios.post(&#39;http://TuURL/api/3/uploadFiles&#39;, form, { headers });
}

subirArchivo();
```

Si el archivo se sube correctamente, la API devolverá la información sobre el archivo o archivos subidos. Además, el nombre del archivo se modificará automáticamente en la carpeta `MyFiles` para evitar que se sobrescriba.

En caso de error, la API devolverá un mensaje de error o un array `files[]` vacío.

![Array files vacío por error en la peticion](https://i.imgur.com/Uqeazwn.png)

---

Para más detalles puedes consultar el archivo ApiUploadFiles.php en GitHub:

[facturascripts/Core/Controller/ApiUploadFiles.php at master · NeoRazorX/facturascripts · GitHub](https://github.com/NeoRazorX/facturascripts/blob/master/Core/Controller/ApiUploadFiles.php)

---

## Descargar archivos
Para descargar archivos de la biblioteca tenemos el modelo **AttachedFile** y el endpoint `attachedfiles`. Al consultar este endpoint, además de los datos del archivo obtendremos los campos `download` y `download-permanent`.

- **download**: proporciona un enlace de descarga válido duranete 5 minutos.
- **download-permanent**: proporciona un enlace de descarga válido para siempre.

---

## Vincular con productos/clientes/documentos
Podemos vincular un archivo subido con un producto, cliente, proveedor, factura, etc ... usando el endpoint `attachedfilerelations`. Hay que pasarle el **idfile**, **model** y **modelcode**:

- **idfile**: el id del archivo subido.
- **model**: el nombre del modelo con el que queremos relacionarlo. Ejemplo: FacturaCliente.
- **modelcode**: el identificador del registro en cuestión con el que queremos relacionarlo. Por ejemplo: 234 (factura con idfactura 234).