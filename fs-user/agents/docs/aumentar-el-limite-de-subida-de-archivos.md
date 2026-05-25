---
id: 1949
permalink: aumentar-el-limite-de-subida-de-archivos
title: Cómo aumentar el límite de subida de archivos
creationdate: 17-12-2024 19:57:31
lastmod: 04-04-2025
url: https://facturascripts.com/publicaciones/aumentar-el-limite-de-subida-de-archivos
---
Por defecto, PHP limita el tamaño máximo de los archivos que se pueden subir a 8 MB. FacturaScripts incrementa este límite a 99 MB mediante el archivo `.htaccess`. Sin embargo, si el servidor no utiliza Apache o está configurado para ignorar dicho archivo, el límite podría variar.

## Opciones para modificar el límite

### 1. Panel de control del hosting

Si tienes FacturaScripts instalado en un hosting, probablemente cuentas con un panel de control. Para aumentar el límite:

- Accede al panel de control de tu hosting.
- Dirígete a la sección de configuración de PHP.
- Localiza el campo `upload_max_filesize` y ajústalo al valor deseado (por ejemplo, 99 MB o más).

**Ejemplo:**
Si deseas un límite de 150 MB, introduce ese valor en `upload_max_filesize` y asegúrate de que otros parámetros relacionados, como `post_max_size`, sean adecuados.

### 2. Archivo php.ini

Si tienes acceso al archivo `php.ini` del servidor, sigue estos pasos:

- Abre el archivo `php.ini`.
- Busca la directiva `upload_max_filesize` y modifícala, por ejemplo:
  ```ini
  upload_max_filesize = 150M
  ```
- Verifica también el valor de `post_max_size` y ajústalo si es necesario:
  ```ini
  post_max_size = 150M
  ```
- Reinicia el servidor para que los cambios surtan efecto.

### 3. Archivo .htaccess

Si deseas superar los 99 MB, debes editar el archivo `.htaccess` ubicado en la carpeta de FacturaScripts:

- Abre el archivo `.htaccess` con un editor de texto.
- Añade o modifica las siguientes líneas:
  ```apache
  php_value upload_max_filesize 150M
  php_value post_max_size 150M
  ```
- Guarda los cambios y verifica que el servidor aplique la nueva configuración.

Esta guía está basada en el manual de FacturaScripts y busca ofrecerte instrucciones claras y precisas para extender el límite de carga de archivos. Asegúrate de realizar una copia de seguridad de los archivos de configuración antes de realizar cambios significativos.