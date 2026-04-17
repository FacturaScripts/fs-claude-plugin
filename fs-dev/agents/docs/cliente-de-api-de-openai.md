---
id: 1672
permalink: cliente-de-api-de-openai
title: Cliente de API de OpenAI
creationdate: 18-02-2024 13:27:43
lastmod: 08-12-2025
url: https://facturascripts.com/cliente-de-api-de-openai
---
A partir de la **versión 2024**, FacturaScripts incorpora la clase `OpenAi` ubicada en la carpeta `Lib`, que simplifica el uso de las APIs de **OpenAI** para la generación de texto (chatGPT), imágenes (DALL-E) y audio (TTS) mediante inteligencia artificial.

&gt; Nota: Para utilizar estas APIs necesitas una clave API, lo cual puede generar costes. Consulta más detalles en la [página de precios de OpenAI](https://platform.openai.com/docs/pricing).

---

## Uso de chatGPT

La función `chat()` de la clase `OpenAi` permite interactuar con chatGPT, recibiendo un array de mensajes y devolviendo la respuesta en formato string.

**Ejemplo de uso:**

```php
$mensajes = [];
$pregunta = &#39;¿Qué es FacturaScripts?&#39;;
$respuesta = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;setUserMessage($mensajes, $pregunta)
    -&gt;chat($mensajes);

echo $respuesta; // Ejemplo de salida: &quot;FacturaScripts es un software de código abierto para la gestión empresarial...&quot;
```

### Selección de Modelos

De forma predeterminada se utiliza el modelo **gpt-5-mini**, optimizado por su rapidez y coste. Si deseas utilizar modelos específicos como **GPT5** o **GPT5.1**, puedes especificarlo como parámetro.

**Ejemplo con GPT 5.1:**

```php
$mensajes = [];
$pregunta = &#39;¿Qué es FacturaScripts?&#39;;
$respuesta = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;setUserMessage($mensajes, $pregunta)
    -&gt;chat($mensajes, &#39;&#39;, &#39;gpt-5.1&#39;);
```

---

## Generación de Imágenes con IA

Utiliza la función `image()` para generar imágenes a partir de una descripción en texto.

**Ejemplo de generación de imagen:**

```php
$image_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;image(&#39;an illustration for an accounting software&#39;);

echo $image_path; // Ejemplo: MyFiles/image_XXXXX.png (imagen generada)
```

### Versiones de DALL-E

- **DALL-E 2:** Genera imágenes en resoluciones de 256x256 (por defecto), 512x512 o 1024x1024.
- **DALL-E 3:** Para utilizar DALL-E 3, llama a la función `dalle3()`. Este modelo genera imágenes en las resoluciones predeterminadas de 1024x1024, 1792x1024 o 1024x1792.

**Ejemplo utilizando DALL-E 3:**

```php
$image_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;dalle3(&#39;an illustration for an accounting software&#39;);
```

### Especificación de Tamaños de Imagen

Puedes ajustar la resolución de la imagen mediante los parámetros `width` y `height` de las funciones. Ten en cuenta que:

- Con **DALL-E 2** se permiten únicamente los tamaños 256x256, 512x512 y 1024x1024.
- Con **DALL-E 3** se permiten los tamaños 1024x1024, 1792x1024 y 1024x1792.

Si se solicita una resolución fuera de estos rangos, **FacturaScripts la redimensionará automáticamente**.

**Ejemplo de ajuste de resolución:**

```php
$image_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;image(&#39;an illustration for an accounting software&#39;, 800, 800); // Genera una imagen de 800x800 (con redimensionamiento si es necesario)
```

Para DALL-E 3 con redimensionamiento:

```php
$image_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;dalle3(&#39;an illustration for an accounting software&#39;, 2048, 2048);

// Se genera a 1024x1024 y luego se redimensiona a 2048x2048
```

---

## Generación de Audio con IA

Utiliza la función `audio()` para transformar texto en un archivo de audio. El método devuelve la ruta del archivo generado.

**Ejemplo de uso:**

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

Puedes seleccionar una voz específica pasando el nombre de la voz como **segundo parámetro** a la función `audio()`.

**Ejemplo con voz `nova`:**

```php
$audio_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;audio(&#39;Esto es una prueba de audio&#39;, &#39;nova&#39;);
```

### Formatos de Audio

El formato predeterminado del audio es `mp3`. Sin embargo, también puedes generar archivos en formato `opus`, `aac` o `flac` especificándolo en el **tercer parámetro**.

**Ejemplo generando audio en formato AAC:**

```php
$audio_path = OpenAi::init(&#39;TU_CLAVE_API&#39;)
    -&gt;audio(&#39;Esto es una prueba de audio&#39;, &#39;alloy&#39;, &#39;aac&#39;);
```
