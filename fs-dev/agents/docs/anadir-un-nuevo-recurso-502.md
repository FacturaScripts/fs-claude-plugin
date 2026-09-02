---
id: 702
permalink: anadir-un-nuevo-recurso-502
title: Crear o añadir registros desde la API
creationdate: 14-05-2018 00:00:00
lastmod: 07-07-2026
url: https://facturascripts.com/publicaciones/anadir-un-nuevo-recurso-502
---
Para crear o añadir un nuevo registro mediante la API, por ejemplo un producto, utilizaremos el método **POST** sobre la ruta del recurso del modelo, donde para los atributos del modelo en concreto, como mínimo, serán obligatorios todos aquellos que no puedan ser nulos. Para este ejemplo crearemos una nueva divisa, por lo que haremos una consulta POST a `http://localhost:8000/api/3/divisas`

![añadir registro mediante api](https://facturascripts.com/MyFiles/2024/03/2028.png?myft=a4d57fd0d91d2f3ab5253dfc6a75cb322a86b16e)

En este ejemplo hemos creado una divisa con código `123` y descripción `Divisa 123`.

## Cómo pasar los valores
Aunque la API responde siempre con JSON, para enviar los datos debemos hacerlo como lo haríamos a un formulario, es decir, mediante **form URL encoded**:

![enviar datos api](https://i.imgur.com/3gP30u7.png)

En determinadas situaciones, puede que haya ciertas restricciones adicionales, como que un campo deba tener una longitud mínima/máxima, que sea de tipo booleano o numérico... Estas restricciones se añaden desde el método test dentro del modelo concreto, de modo que se obliga a cumplir dichas condiciones para hacer el guardado o inserción del registro. En caso de error, se recibirán los detalles del problema, es el mismo error que puede recibir el usuario.

## Qué devuelve la API
La respuesta siempre es un objeto JSON. El resultado depende de si el guardado se ha realizado con éxito o no.

### Registro creado correctamente
Si el registro se guarda, la API responde con código HTTP `200` y un objeto con dos claves:

- `ok`: mensaje informativo de la operación.
- `data`: el registro tal y como ha quedado guardado, incluyendo los valores que haya calculado o completado el propio modelo (por ejemplo, la clave primaria autogenerada, fechas, o campos con valor por defecto).

```json
{
    &quot;ok&quot;: &quot;Registro actualizado correctamente.&quot;,
    &quot;data&quot;: {
        &quot;coddivisa&quot;: &quot;123&quot;,
        &quot;descripcion&quot;: &quot;Divisa 123&quot;,
        &quot;codiso&quot;: null,
        &quot;simbolo&quot;: &quot;?&quot;,
        &quot;tasaconv&quot;: 1,
        &quot;tasaconvcompra&quot;: 1
    }
}
```

Es importante leer el contenido de `data` en la respuesta, ya que ahí aparecen los valores definitivos del registro. Esto es especialmente útil cuando la clave primaria se genera de forma automática (campos autoincrementales), porque es la forma de conocer el identificador del nuevo registro.

### Errores al guardar
Cuando el guardado no se puede realizar, la respuesta incluye la clave `error` con la descripción del problema, y en la mayoría de los casos una clave `data` con los datos del registro implicado. Los casos más habituales son:

- **Faltan datos** (HTTP `400`): no se ha enviado ningún campo en la petición.
- **Registro duplicado** (HTTP `400`): ya existe un registro con esa clave primaria. En `data` se devuelve el registro existente.
- **Error de validación** (HTTP `400`): algún campo no cumple las restricciones definidas en el método test del modelo (longitud, tipo, valores obligatorios...). El mensaje de `error` incluye el detalle del problema, el mismo que vería el usuario en la aplicación.

```json
{
    &quot;error&quot;: &quot;Ha ocurrido un error mientras se guardaban los datos - El campo descripcion no puede estar vacío.&quot;
}
```

Conviene comprobar siempre el código de estado HTTP y la presencia de la clave `error` para saber si la operación se ha completado.

## Crear facturas
Ten en cuenta que modelos como las facturas de cliente tienen mayor complejidad, hay que añadir las líneas, recalcular, etc. Para este caso hemos creado un endpoint especial, para poder [crear facturas de venta con una sola llamada a la API](https://facturascripts.com/publicaciones/como-crear-facturas-desde-api).