---
id: 606
permalink: problemas-frecuentes-instalacion-641
title: Problemas frecuentes durante la instalación
creationdate: 26-04-2018 00:00:00
lastmod: 14-05-2025
url: https://facturascripts.com/problemas-frecuentes-instalacion-641
---
Esta es una pequeña lista de problemas frecuentes en la instalación de FacturaScripts 2025.

## 🚩 COMPOSER ERROR
Si le aparece el mensaje ``COMPOSER ERROR: You need to run: composer install``. Significa que usted no ha seguido el [tutorial de instalación de FacturaScripts](https://facturascripts.com/publicaciones/instalacion-desde-el-zip-331), sino que ha descargado el código fuente a lo loco y sin seguir ni siquiera las propias instrucciones del README.md. Lea y siga las instrucciones del archivo README.md o bien siga el tutorial de instalación.

## ⚠️ You don&#39;t have the mysqli PHP extension installed
Usted no tiene instalada la extensión de PHP para usar MySQL. Esta extensión es necesaria para usar FacturaScripts. Debe instalarla para continuar. El instalador de FacturaScripts ya comprueba las extensiones necesarias y no le permite instalar si falta alguna. Pero puede encontrarse con este problema si traslada la instalación de servidor.

Si tiene FacturaScripts en un hosting, vaya al panel de control, busque la sección de PHP y active la extensión de MySQL. Si por el contrario lo tiene instalado en Linux, tendrá que instalar el paquete de mysql para php.

## 🚫 404: página no encontrada
Es necesario instalar y activar el **mod rewrite** en el Apache, **así como permitir** el uso de **.htaccess** en la carpeta de FacturaScripts. Generalmente en Ubuntu, o derivados, es necesario modificar el archivo **/etc/apache2/apache2.conf** y poner **AllowOverride All** en la carpeta /var/www/html

### ⚪ Página en blanco (no carga el estilo)
Es el mismo problema 404, con la misma solución descrita arriba.

### 🛞 Siempre me carga la página de Plugins o Wizard
Independientemente de la opción del menú que elija, siempre me aparece Admin, Plugins.

Este comportamiento indica un problema con el mod rewrite del Apache. Es necesario **permitir** el uso de **.htaccess** en la carpeta de FacturaScripts. Generalmente en Ubuntu, o derivados, es necesario modificar el archivo **/etc/apache2/apache2.conf** y poner **AllowOverride All** en la carpeta /var/www/html

**En otros servidores web** es recomendable indicar que todo el tráfico lo dirija al archivo **index.php**, en lugar de a la carpeta. Así FacturaScripts se encarga del enrutado.

## 💣 Error 500
Este es un error 500 de FacturaScripts: indica el archivo que falla, un mensaje de error y las versiones de FacturaScripts y de PHP:

![error 500 FacturaScripts](https://facturascripts.com/MyFiles/2024/12/2450.png?myft=2405cb22803ea25d75b80dce15210423021c2e5a)

### 🔥 Error 500 del hosting
Este es un error 500 del hosting o servidor donde esté instalado FacturaScripts. No indica archivo, ni versiones de PHP o FacturaScripts:

![error 500 hosting](https://i.imgur.com/ndb4Cx2.png)

Para saber realmente qué es lo que ha pasado es necesario acceder al log o historial de errores del servidor. En la mayoría de hostings hay una sección llamada log o historial de errores en su panel de control o cPanel.

### ‼️ Otros errores conocidos
En algunos hostings como **1and1** y **Hostinger** es necesario modificar el archivo .htaccess donde pone:

```
&lt;IfModule mod_rewrite.c&gt;
   RewriteEngine On
   RewriteRule . index.php [L]
&lt;/IfModule&gt;
```

Debe cambiarlo por:

```
&lt;IfModule mod_rewrite.c&gt;
   RewriteEngine On
   RewriteBase /
   RewriteRule . index.php [L]
&lt;/IfModule&gt;
```

O bien:

```
&lt;IfModule mod_rewrite.c&gt;
   RewriteEngine On
   RewriteBase /TU-CARPETA/
   RewriteRule . index.php [L]
   RewriteCond %{REQUEST_URI} !Dinamic/Assets/ [NC]
   RewriteCond %{REQUEST_URI} !node_modules/ [NC]
&lt;/IfModule&gt;
```

## 🐧 Fedora / CentOS / Red Hat
La configuración por defecto de estas distribuciones, en concreto SELinux, bloquea cualquier intento de comprobar si la carpeta tiene permisos de escritura. Desactiva o modifica la configuración de SELinux para el correcto funcionamiento de FacturaScripts.
