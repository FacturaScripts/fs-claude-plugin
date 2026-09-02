---
id: 1672
permalink: cliente-de-api-de-openai
title: Cliente de API de OpenAI
creationdate: 18-02-2024 13:27:43
lastmod: 24-08-2026
url: https://facturascripts.com/publicaciones/cliente-de-api-de-openai
---
FacturaScripts incorpora la clase `OpenAi`, ubicada en la carpeta `Lib`, que simplifica el uso de las APIs de **OpenAI** para la generación de texto (chatGPT), imágenes y audio mediante inteligencia artificial.

&gt; Nota: Para utilizar estas APIs necesitas una clave API, lo cual puede generar costes. Consulta más detalles en la [página de precios de OpenAI](https://platform.openai.com/docs/pricing).

Todas las peticiones tienen un timeout por defecto de 60 segundos, que se puede cambiar con `setTimeout()`.

---

## 💬 Uso de chatGPT

La función `chat()` de la clase `OpenAi` permite interactuar con chatGPT, recibiendo un array de mensajes y devolviendo la respuesta en formato string.

```php
$mensajes = [];
$pregunta = &#39;¿Qué es FacturaScripts?&#39;;
$respuesta = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;setUserMessage($mensajes, $pregunta)
    -&gt;chat($mensajes);

echo $respuesta; // Ejemplo de salida: &quot;FacturaScripts es un software de código abierto para la gestión empresarial...&quot;
```

Con `setSystemMessage()` podemos añadir también un mensaje de sistema, con las instrucciones de comportamiento:

```php
$mensajes = [];
$respuesta = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;setSystemMessage($mensajes, &#39;Eres un asistente experto en contabilidad española.&#39;)
    -&gt;setUserMessage($mensajes, &#39;¿Qué es el modelo 303?&#39;)
    -&gt;chat($mensajes);
```

Y con `getTotalTokens()` obtenemos los tokens consumidos en la última petición de chat:

```php
$tokens = OpenAi::init(&#39;TU_CLAVE_API&#39;)-&gt;getTotalTokens();
```

### Selección de Modelos

De forma predeterminada se utiliza el modelo **gpt-5.4-mini**, optimizado por su rapidez y coste. Si deseas utilizar otro modelo, puedes especificarlo como tercer parámetro (el segundo es el identificador de usuario final, que puedes dejar vacío).

```php
$mensajes = [];
$pregunta = &#39;¿Qué es FacturaScripts?&#39;;
$respuesta = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;setUserMessage($mensajes, $pregunta)
    -&gt;chat($mensajes, &#39;&#39;, &#39;gpt-5.4&#39;);
```

### Respuestas estructuradas (JSON)

La función `chatJson()` fuerza al modelo a responder con el formato indicado en `response_format`, y devuelve la respuesta ya convertida en array:

```php
$mensajes = [];
$formato = [
    &#39;type&#39; =&gt; &#39;json_schema&#39;,
    &#39;json_schema&#39; =&gt; [
        &#39;name&#39; =&gt; &#39;clasificacion&#39;,
        &#39;schema&#39; =&gt; [
            &#39;type&#39; =&gt; &#39;object&#39;,
            &#39;properties&#39; =&gt; [
                &#39;categoria&#39; =&gt; [&#39;type&#39; =&gt; &#39;string&#39;],
                &#39;confianza&#39; =&gt; [&#39;type&#39; =&gt; &#39;number&#39;]
            ]
        ]
    ]
];
$resultado = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;setUserMessage($mensajes, &#39;Clasifica este producto: tornillo de acero M8&#39;)
    -&gt;chatJson($mensajes, $formato);
```

---

## 🎨 Generación de Imágenes con IA

Utiliza la función `image()` para generar imágenes a partir de una descripción en texto. Por defecto se utiliza el modelo **gpt-image-2**. La imagen se guarda en la carpeta `MyFiles` y la función devuelve su ruta relativa.

```php
$image_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;image(&#39;an illustration for an accounting software&#39;);

echo $image_path; // Ejemplo: MyFiles/image_XXXXX.png
```

Estas peticiones son lentas, por lo que usan un timeout mínimo de **180 segundos**, aunque hayas indicado uno menor con `setTimeout()`.

### Tamaños de Imagen

Con **gpt-image-2** puedes solicitar directamente cualquier tamaño que cumpla las restricciones del modelo:

- ancho y alto múltiplos de **16**,
- máximo **3840** píxeles por lado,
- proporción entre el lado largo y el corto **no mayor de 3:1**,
- y entre **655.360** y **8.294.400** píxeles en total.

Si el tamaño no cumple esas condiciones (o utilizas otro modelo), la imagen se generará en el tamaño soportado más cercano según su orientación (**1024x1024**, **1536x1024** o **1024x1536**) y después **FacturaScripts la redimensionará automáticamente** al tamaño solicitado.

```php
$image_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;image(&#39;an illustration for an accounting software&#39;, 800, 800);

// Se genera a 1024x1024 y luego se redimensiona a 800x800
```

### Opciones avanzadas

La firma completa es `image($prompt, $width, $height, $count, $model, $options)`. En el array `options` se pueden indicar parámetros adicionales de la API:

- `output_format`: `png` (por defecto), `jpeg` o `webp`. Cualquier otro valor devuelve una cadena vacía y registra un error en el log.
- `output_compression`: nivel de compresión para `jpeg` y `webp`.
- `moderation`: nivel de moderación de contenido. `content_moderation` se mantiene como alias por compatibilidad.

```php
$image_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;image(&#39;an illustration for an accounting software&#39;, 1024, 1024, 1, &#39;gpt-image-2&#39;, [
        &#39;output_format&#39; =&gt; &#39;jpeg&#39;
    ]);
```

&gt; Nota: como `image()` devuelve la ruta de un único archivo, los parámetros `count` (distinto de 1) y `stream` se ignoran, dejando un aviso en el log.

---

## 🔊 Generación de Audio con IA

Utiliza la función `audio()` para transformar texto en un archivo de audio (modelo **gpt-4o-mini-tts**). El método guarda el archivo en `MyFiles` y devuelve su ruta.

```php
$audio_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;audio(&#39;Esto es una prueba de audio generada mediante IA y almacenada en un archivo mp3&#39;);

echo $audio_path; // Ejemplo: MyFiles/audio_XXX.mp3
```

### Selección de Voces

Por defecto, se utiliza la voz `alloy`. Las voces adicionales disponibles son:

- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`

Puedes seleccionar una voz específica pasando el nombre de la voz como segundo parámetro a la función `audio()`.

```php
$audio_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;audio(&#39;Esto es una prueba de audio&#39;, &#39;nova&#39;);
```

### Formatos de Audio

El formato predeterminado del audio es `mp3`. Sin embargo, también puedes generar archivos en formato `opus`, `aac` o `flac` especificándolo en el tercer parámetro. El cuarto parámetro permite cambiar el modelo.

```php
$audio_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;audio(&#39;Esto es una prueba de audio&#39;, &#39;alloy&#39;, &#39;aac&#39;);
```

### Transcripción de Audio

El proceso inverso, convertir un archivo de audio en texto, se hace con la función `audioTranscript()` (modelo **gpt-4o-transcribe**), pasando el archivo como `CURLFile`:

```php
$file_path = Tools::folder(&#39;MyFiles&#39;, &#39;nota-de-voz.mp3&#39;);
$file = new CURLFile($file_path, mime_content_type($file_path), &#39;nota-de-voz.mp3&#39;);

$texto = OpenAi::init(&#39;TU_CLAVE_API&#39;)-&gt;audioTranscript($file);
```

---

## 🤖 API de Asistentes

La clase también cubre la API de asistentes de OpenAI (Assistants v2), con sus hilos, archivos y almacenes de vectores. Todos estos métodos devuelven la respuesta de la API como array (vacío en caso de error, que se registra en el log).

### Asistentes
- `assistantCreate($params)` : crea un asistente con los parámetros indicados.
- `assistantRead($idAssistant)` : devuelve los datos de un asistente.
- `assistantUpdate($idAssistant, $params)` : actualiza un asistente.

### Hilos de conversación
- `threadCreate()` : crea un hilo de conversación.
- `threadRead($idThread)` : devuelve los datos de un hilo.
- `threadMessages($idThread, $idRun)` : devuelve los mensajes de un hilo, opcionalmente de una ejecución concreta.
- `threadMessageCreate($message, $idThread)` : añade un mensaje a un hilo.
- `threadRun($idThread, $idAssistant)` : ejecuta un asistente sobre un hilo.
- `threadRunRead($idThread, $idRun)` : devuelve el estado de una ejecución.
- `threadRunSubmitToolOutputs($idThread, $idRun, $outputs)` : envía los resultados de las herramientas que ha solicitado una ejecución.

### Archivos
- `fileUpload($file, $purpose)` : sube un archivo (`CURLFile`) a OpenAI, por defecto con propósito `assistants`.
- `fileList()` : lista los archivos subidos.
- `fileRead($idFile)` : devuelve los datos de un archivo.
- `fileDelete($idFile)` : elimina un archivo.

### Almacenes de vectores (vector stores)
- `vectorCreate($data)` : crea un almacén de vectores.
- `vectorRead($idVector)` : devuelve los datos de un almacén.
- `vectorFiles($idVector)` : lista los archivos de un almacén.
- `vectorFile($idVector, $idFile)` : añade un archivo al almacén.
- `vectorFileDelete($idVector, $idFile)` : elimina un archivo del almacén.