---
id: 704
permalink: eliminar-un-recurso-concreto-122
title: Eliminar registros desde la API
creationdate: 14-05-2018 00:00:00
lastmod: 07-07-2026
url: https://facturascripts.com/publicaciones/eliminar-un-recurso-concreto-122
---
Para eliminar un registro mediante la API, haremos una consulta **DELETE** al recurso que queramos eliminar. Para este ejemplo eliminaremos la divisa `123`, que creamos en el ejemplo anterior, por tanto haremos una consulta DELETE sobre `http://localhost:8000/api/3/divisas/123`

![eliminar recurso mediante API](https://facturascripts.com/MyFiles/2024/03/2030.png?myft=94dc0666ee58afbac347bf3c7042743133bd2a68)

En este caso no debemos enviar nada más, es simplemente una consulta DELETE. Recibiremos un código **http 200** si ha sido eliminada correctamente o bien otro código si no se ha podido eliminar, y el mensaje de error en el json de respuesta.

## Qué devuelve la API
La respuesta siempre es un objeto JSON.

### Registro eliminado correctamente
Si el registro se elimina, la API responde con código HTTP `200` y un objeto con dos claves:

- `ok`: mensaje informativo de la operación.
- `data`: los datos del registro que se acaba de eliminar, por si necesitas conservarlos o registrar la operación.

```json
{
    &quot;ok&quot;: &quot;¡Registro eliminado correctamente!&quot;,
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

### Errores al eliminar
Cuando no se puede eliminar, la respuesta incluye la clave `error` con la descripción del problema. Los casos más habituales son:

- **Registro no encontrado** (HTTP `404`): no existe ningún registro con esa clave primaria en la ruta.
- **Error al eliminar** (HTTP `400`): el registro existe pero no se ha podido borrar, por ejemplo porque otros registros dependen de él y las restricciones de la base de datos lo impiden.

```json
{
    &quot;error&quot;: &quot;Registro no encontrado&quot;
}
```

Conviene comprobar siempre el código de estado HTTP y la presencia de la clave `error` para saber si la operación se ha completado.