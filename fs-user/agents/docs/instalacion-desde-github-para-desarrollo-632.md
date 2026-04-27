---
id: 604
permalink: instalacion-desde-github-para-desarrollo-632
title: Instalación desde github (para desarrollo)
creationdate: 23-04-2018 00:00:00
lastmod: 26-01-2021
url: https://facturascripts.com/publicaciones/instalacion-desde-github-para-desarrollo-632
---

Para instalar FacturaScripts 2020 descargando el **código** directamente desde **github**, y suponiendo que esté usando Linux o macOS, debe colocarse en la carpeta del **servidor web** y ejecutar los siguientes comandos:
```
git clone https://github.com/NeoRazorX/facturascripts.git
cd facturascripts
composer install
npm install
```
Esto suponiendo que tenga instalado git, composer y npm.

## ¡¡¡Advertencia!!!
``Este método de instalación es para desarrollo. Si usted no es programador, evite seguir este método.`` En su lugar use el método de [instalación desde ZIP](https://facturascripts.com/publicaciones/instalacion-desde-el-zip-331).

## Instalación de dependencias en Ubuntu 18.04 o superior
Al ser la distribución Linux más usada, aquí le indicamos el procedimiento para instalar las dependencias. Para otras distribuciones, por favor, diríjase a los foros de esas otras distribuciones.
```
sudo apt install mysql-server libapache2-mod-php php-mysql php-xml php-zip php-mbstring php-bcmath php-curl php-gd git composer npm
```

### Apache
FacturaScripts 2020 utiliza urls amigables, por lo que es necesario que actives el **mod rewrite** en Apache:
```
sudo a2enmod rewrite
```
Por último es necesario indicar al Apache que lea el archivo .htaccess de FacturaScripts. Para ello debemos modificar la configuración del Apache:
```
sudo nano /etc/apache2/apache2.conf
```
Donde pone **Directory /var/www/**:
```
&lt;Directory /var/www/&gt;
	Options Indexes FollowSymLinks
	AllowOverride None
	Require all granted
&lt;/Directory&gt;
```
Se debe cambiar **AllowOverride None** por **AllowOverride All**. Por último hay que reiniciar el Apache.
```
sudo service apache2 restart
```

### MySQL 8
PHP no soporta caching_sha2_authentication, que es el nuevo método de autenticación de MySQL 8. Por eso lo más cómodo es que crees un nuevo usuario con el sistema anterior de autenticación:
```
sudo mysql -u root
CREATE USER &#39;root2&#39;@&#39;%&#39; IDENTIFIED WITH mysql_native_password BY &#39;NEWPASSWORD&#39;;
GRANT ALL PRIVILEGES ON *.* TO &#39;root2&#39;@&#39;%&#39;;
FLUSH PRIVILEGES;
```
Otra opción es que cambies el método de autenticación de root:
```
sudo mysql -u root
USE mysql;
FLUSH PRIVILEGES;
ALTER USER &#39;root&#39;@&#39;localhost&#39; IDENTIFIED WITH caching_sha2_password BY &#39;NEWPASSWORD&#39;;
ALTER USER &#39;root&#39;@&#39;localhost&#39; IDENTIFIED WITH mysql_native_password BY &#39;NEWPASSWORD&#39;;
```

#### MySQL 5
La instalación por defecto de mysql viene ahora sin contraseña para root y con autenticación por shocket. Puede crear un usuario nuevo manualmente, o puede asignar una nueva contraseña para root.
```
sudo mysql -u root
USE mysql;
UPDATE user SET plugin=&#39;mysql_native_password&#39; WHERE user=&#39;root&#39;;
UPDATE user SET authentication_string=password(&#39;NEWPASSWORD&#39;) WHERE user=&#39;root&#39;;
FLUSH PRIVILEGES;
exit;
```
