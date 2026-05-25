---
id: 2035
permalink: error-unable-to-write-in-the-cache-directory
title: # Error: Unable to write in the cache directory
creationdate: 03-02-2025 19:05:35
lastmod: 17-03-2025
url: https://facturascripts.com/publicaciones/error-unable-to-write-in-the-cache-directory
---
El error &quot;Unable to write in the cache directory&quot; indica que el **directorio de caché** no tiene permisos de escritura. Para solucionar este problema, existen dos opciones:

1. **Modificar permisos**: Cambia los permisos del directorio para permitir la escritura.
2. **Eliminar el directorio**: Puedes eliminar el directorio `MyFiles/Cache`. FacturaScripts lo volverá a crear automáticamente.

Para realizar estas acciones, sigue estos pasos:

1. Abre la carpeta donde está instalado FacturaScripts.
2. Localiza la carpeta `MyFiles` y ábrela.
3. Dentro de `MyFiles`, localiza el directorio `Cache` y elimínalo.

Con cualquiera de estos métodos, deberías poder resolver el problema y permitir que FacturaScripts funcione correctamente.