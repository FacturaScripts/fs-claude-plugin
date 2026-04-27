---
id: 607
permalink: instalacion-desatendida-204
title: Instalación desatendida
creationdate: 27-04-2018 00:00:00
lastmod: 02-01-2021
url: https://facturascripts.com/publicaciones/instalacion-desatendida-204
---

Para realizar una instalación desatendida o automatizada de FacturaScripts, se puede descomprimir el zip en el directorio del Apache y a continuación realizar uno de estos procedimientos:

## Crear el archivo config.php
Crear el archivo config.php con los datos para conectar a la base de datos.

## Llamar al instalador
Ejecutar una petición http, por ejemplo con CURL, enviando por POST los datos del formulario de instalación. Si además se añade el campo **unattended**, el instalador devolverá el mensaje &#39;OK&#39; si el instalador finaliza sin problemas.
