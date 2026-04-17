---
id: 874
permalink: he-olvidado-mi-contrasena
title: He olvidado mi contraseña
creationdate: 14-12-2020 20:25:21
lastmod: 10-01-2026
url: https://facturascripts.com/he-olvidado-mi-contrasena
---
Si ha olvidado la contraseña, pruebe esto:
- Usuario: **admin**
- Contraseña: **admin**

## ¿No funciona?
Pruebe con el usuario **admin** y la contraseña que usted recuerde.

### Nada, no funciona...
Mire en la **barra del navegador** ¿Qué pone?

![barra del navegador](https://i.imgur.com/6cHnv0d.png)

Si pone **facturascripts.com** ``usted no está en su instalación de FacturaScripts``, usted intenta entrar como administrador en nuestra web. De la misma forma que la llave de su casa no sirve para abrir la caja fuerte del banco, su clave de FacturaScripts no servirá para esta web. Además de que **sus facturas no están aquí**. Esto es una web de soporte y descargas.

### 🔍 ¿Dónde instaló FacturaScripts?
* Si lo instaló en su PC, entonces la dirección suele ser http://localhost/facturas o bien http://localhost/facturascripts o https://facturas.localhost
* Si lo instaló en su hosting, entonces la dirección será la de su web.

Si estándo en la dirección correcta, la contraseña no funciona, haga clic en el enlace &quot;**he olvidado mi contraseña**&quot;.

![recuperar contraseña FacturaScripts](https://i.imgur.com/XAwg0Cp.png)
![cambiar contraseña](https://i.imgur.com/YYlcl1g.png)

Escriba su nombre de usuario (normalmente es **admin**), la nueva contraseña, de nuevo la nueva contraseña y por último la contraseña de la base de datos.

### 🔐 Contraseña de la base de datos
- Si ha instalado FacturaScripts en Windows, **normalmente la contraseña está en blanco**, así que puede **dejar este campo en blanco**.
- Si no funciona, cambió la contraseña de la base de datos, lo instaló en un hosting o no tiene ni la menor idea de qué es una contraseña de base de datos, vaya a la carpeta de FacturaScripts, abra el archivo config.php, ahí tiene la contraseña:

#### 🤷‍♂️ No tengo ni idea de dónde está FacturaScripts
Si instaló FacturaScripts en Windows, normalmente FacturaScripts se encuentra en:
- c:\xamp\htdocs\facturas
- c:\ServBay\www\facturascripts

#### 📃 Localizar la contraseña de base de datos en el config.php
En la carpeta de FacturaScripts, abra el archivo config.php:

```
&lt;?php
define(&#39;FS_COOKIES_EXPIRE&#39;, 604800);
define(&#39;FS_ROUTE&#39;, &#39;&#39;);
define(&#39;FS_DB_FOREIGN_KEYS&#39;, true);
define(&#39;FS_DB_TYPE_CHECK&#39;, true);
define(&#39;FS_MYSQL_CHARSET&#39;, &#39;utf8&#39;);
define(&#39;FS_MYSQL_COLLATE&#39;, &#39;utf8_bin&#39;);
define(&#39;FS_LANG&#39;, &#39;es_ES&#39;);
define(&#39;FS_TIMEZONE&#39;, &#39;Europe/Madrid&#39;);
define(&#39;FS_DB_TYPE&#39;, &#39;mysql&#39;);
define(&#39;FS_DB_HOST&#39;, &#39;mysql&#39;);
define(&#39;FS_DB_PORT&#39;, &#39;3306&#39;);
define(&#39;FS_DB_NAME&#39;, &#39;facturascripts&#39;);
define(&#39;FS_DB_USER&#39;, &#39;root&#39;);
define(&#39;FS_DB_PASS&#39;, &#39;password123&#39;);
define(&#39;FS_CACHE_HOST&#39;, &#39;&#39;);
define(&#39;FS_CACHE_PORT&#39;, &#39;&#39;);
define(&#39;FS_CACHE_PREFIX&#39;, &#39;ODJK4zH3&#39;);
define(&#39;FS_HIDDEN_PLUGINS&#39;, &#39;&#39;);
define(&#39;FS_DEBUG&#39;, true);
define(&#39;FS_DISABLE_ADD_PLUGINS&#39;, false);
define(&#39;FS_DISABLE_RM_PLUGINS&#39;, false);
```

En este ejemplo puede ver que la línea que indica la contraseña de la base de datos es:

```
define(&#39;FS_DB_PASS&#39;, &#39;password123&#39;);
```

Para este ejemplo la contraseña es **password123**. Esta es la contraseña que debe poner en el campo &quot;contraseña base de datos&quot;. **Nota**: cambiar la contraseña en este archivo no cambia la contraseña de la base de datos. Límítese a localizarla, sin más.

contraseña olvidada
