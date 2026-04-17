---
id: 603
permalink: requisitos-917
title: Requisitos
creationdate: 23-04-2018 00:00:00
lastmod: 04-12-2025
url: https://facturascripts.com/requisitos-917
---
Los requisitos para la versión 2025 son:

- **PHP 8.0** o superior.
- **Apache 2**.
- **MySQL 8** o superior. O bien MariaDB 11.2 o superior.
	- También está soportado PostgreSQL 11 o superior. Aunque su uso es bajo entre los programadores y puede algunos plugins presenten problemas.

Los requisitos recomendados son:

- PHP 8.1
- Apache 2.4.
- MySQL 8 ó MariaDB 11.2.

También se necesita que la instalación de PHP tenga las siguientes **extensiones activadas**:

- bcmath
- curl
- fileinfo
- gd
- mbstring
- openssl
- simplexml
- zip

Y por último, que Apache tenga activado el **mod_rewrite**.

## NGINX, lighttpd, IIS u otros
Es posible utilizar FacturaScripts con cualquier servidor web que puede usar PHP, no solamente con Apache. Eso si, en caso de no usar Apache, hay que configurar el servidor web para que redireccione todo el tráfico al **index.php** de FacturaScripts, como hace [el archivo htaccess](https://github.com/NeoRazorX/facturascripts/blob/master/htaccess-sample#L16).

## ¿Son unos requistos altos?
Lo cierto es que no. Hoy en día todas las aplicaciones PHP se están desarrollando sobre PHP 8. En cuanto a las extensiones necesarias, realmente son las extensiones que vienen por defecto en cualquier instalación de PHP, y que debe cumplir cualquier hosting PHP.

### ¿Cómo saber si cumplo los requisitos?
El propio instalador le informará si falla algún requisito. Además, en la esquina superior derecha del instalador tiene un **botón phpinfo** en el que si hace clic podrá ver todos los detalles de tu instalación PHP.

![phpinfo()](https://facturascripts.com/MyFiles/2024/06/2180.png?myft=eb0b467a8e99a6da1212bd2f9cd947cdbfbfbb07)

### Mi hosting no cumple los requisitos ¿Que hago?
Cambie de hosting, así de claro. A lo largo de estos años nos hemos encontrado multitud de hostings que recortan las características de PHP o MySQL de forma absurda, o que utilizan extensiones con más de 10 años de antigüedad y numerosas vulnerabilidades.

En el pasado hemos intentado esquivar estos problemas programando soluciones alternativas en el núcleo, pero llega un punto que es absurdo. Perdemos más tiempo de desarrollo en parchear los problemas de los hostings que en añadir nuevas características realmente interesantes para los usuarios. Por eso en esta nueva versión hemos decidido dejar de parchear los problemas de los hostings. Elija un hosting que no recorte la instalación de PHP o MySQL.
