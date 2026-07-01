---
id: 2877
permalink: como-actualizar-la-version-de-php
title: Cómo actualizar la versión de PHP
creationdate: 15-05-2026 12:19:06
lastmod: 20-05-2026
url: https://facturascripts.com/publicaciones/como-actualizar-la-version-de-php
---
FacturaScripts 2026 requiere **PHP 8.1 o superior**. Si actualmente utilizas una versión anterior de PHP, tendrás que actualizarla antes de instalar o actualizar FacturaScripts 2026.

&gt; FacturaScripts mantiene compatibilidad con las versiones de PHP durante muchos años.  
&gt; Este tipo de cambio no ocurre continuamente y normalmente solo será necesario actualizar PHP una vez cada 2 o 3 años.

## Si usas un hosting

En la mayoría de hostings, cambiar la versión de PHP es muy sencillo:

1. Accede al panel de control de tu hosting.
2. Busca una sección llamada:
   - PHP
   - Selector de PHP
   - Versión de PHP
   - Configuración PHP
3. Selecciona **PHP 8.1** o una versión superior.
4. Guarda los cambios.

Cada proveedor utiliza un panel distinto (cPanel, Plesk, DirectAdmin, panel propio, etc.), pero el proceso suele ser similar.

## Si usas FacturaScripts en tu PC (XAMPP)

Si tienes FacturaScripts instalado localmente con XAMPP, recomendamos instalar una nueva versión de XAMPP con PHP actualizado.

## 1. Hacer una copia de seguridad

Antes de empezar, haz una copia de seguridad con el [plugin Backup](https://facturascripts.com/plugins/backup). Son 2 archivos, uno con la base de datos y otro con el resto de archivos. Guarda siempre estos archivos en otra carpeta o pendrive por seguridad.

## 2. Cerrar XAMPP

Detén y cierra completamente:

- Apache
- MySQL/MariaDB

Después cierra el panel de control de XAMPP.

## 3. Descargar la nueva versión

Descarga la última versión desde:

- https://facturascripts.com/instalar-windows

Instala la nueva versión siguiendo el asistente de instalación.

## 4. Restaurar la copia de seguridad

Una vez instalado:

1. Instala de nuevo el [plugin Backup](https://facturascripts.com/plugins/backup).
2. Restaura la copia de seguridad.
3. Comprueba que todo funciona correctamente.

## Si usas FacturaScripts en tu PC (ServBay)

1. Abre ServBay y ve al apartado "Paquetes" en el lateral izquierdo.
2. Selecciona PHP en la seccion de "Lenguajes" y comprueba si ya tienes instalada la versión de PHP deseada, si no, simplemente dale a descargar en la felcha verde.
3. Ahora ve a la sección "Sitios web" del lateral izquierdo, haz clic en tu instalación web de FS y busca el campo "Versión de PHP" y selecciona la deseada.

Nota: En la configuración de ServBay tambien puede establecer la versión de PHP que quiera usar por defecto, ya que ServBay permite tener múltiples versiones de PHP a la vez y usar una u otra en cada instalacion como se quiera.

## Recomendación

Siempre es recomendable probar primero la actualización en una copia o entorno de pruebas antes de actualizar el sistema principal.