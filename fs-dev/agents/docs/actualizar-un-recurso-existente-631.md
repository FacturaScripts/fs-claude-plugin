---
id: 703
permalink: actualizar-un-recurso-existente-631
title: Modificar registros desde la API
creationdate: 14-05-2018 00:00:00
lastmod: 07-07-2026
url: https://facturascripts.com/publicaciones/actualizar-un-recurso-existente-631
---
Para modificar o actualizar un registro a través de la API, realizaremos un **PUT** a la ruta sobre el recurso concreto del modelo, indicando solamente los atributos a cambiar. Para este ejemplo modificaremos la divisa `123`, que creamos en el ejemplo anterior, por tanto haremos una petición PUT a `http://localhost:8000/api/3/divisas/123`

![modificar registro mediante api](https://facturascripts.com/MyFiles/2024/03/2029.png?myft=69e85186273bf5b13fbd05e720173eac6cda6e3d)

Fíjate que solamente hemos enviado el campo **descripcion** con el valor `Divisa - 123`. Y eso es lo que ha cambiado. No necesitamos enviar el resto de campos si no queremos cambiarlos.

## Cómo pasar los valores
Aunque la API responde siempre con JSON, para enviar los datos debemos hacerlo como lo haríamos a un formulario, es decir, mediante **form URL encoded**:

![enviar datos api](https://i.imgur.com/3gP30u7.png)

Hay que tener en cuenta que las restricciones son las mismas que al añadir un nuevo recurso.

## Qué devuelve la API
La respuesta siempre es un objeto JSON. El resultado depende de si la actualización se ha realizado con éxito o no.

### Registro actualizado correctamente
Si el registro se guarda, la API responde con código HTTP `200` y un objeto con dos claves:

- `ok`: mensaje informativo de la operación.
- `data`: el registro completo tal y como ha quedado tras la actualización, no solo los campos que has enviado. Es la forma de confirmar el estado final del registro, incluyendo cualquier valor que el propio modelo haya recalculado.

```json
{
    &quot;ok&quot;: &quot;Registro actualizado correctamente.&quot;,
    &quot;data&quot;: {
        &quot;coddivisa&quot;: &quot;123&quot;,
        &quot;descripcion&quot;: &quot;Divisa - 123&quot;,
        &quot;codiso&quot;: null,
        &quot;simbolo&quot;: &quot;?&quot;,
        &quot;tasaconv&quot;: 1,
        &quot;tasaconvcompra&quot;: 1
    }
}
```

### Errores al actualizar
Cuando la actualización no se puede realizar, la respuesta incluye la clave `error` con la descripción del problema. Los casos más habituales son:

- **Registro no encontrado** (HTTP `404`): no existe ningún registro con esa clave primaria en la ruta. Recuerda que a diferencia del alta, el PUT necesita que el recurso ya exista.
- **Faltan datos** (HTTP `400`): no se ha enviado ningún campo que modificar.
- **Error de validación** (HTTP `400`): algún campo no cumple las restricciones definidas en el método test del modelo. El mensaje de `error` incluye el detalle, el mismo que vería el usuario en la aplicación, y en `data` se devuelve el estado del registro.

```json
{
    &quot;error&quot;: &quot;Registro no encontrado&quot;
}
```

Conviene comprobar siempre el código de estado HTTP y la presencia de la clave `error` para saber si la operación se ha completado.