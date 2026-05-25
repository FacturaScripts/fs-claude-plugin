---
id: 1652
permalink: como-restaurar-facturascripts-en-caso-de-desastre
title: Cómo restaurar FacturaScripts en caso de desastre
creationdate: 20-01-2024 20:11:01
lastmod: 15-05-2026
url: https://facturascripts.com/publicaciones/como-restaurar-facturascripts-en-caso-de-desastre
---
Si **tras una actualización** de FacturaScripts tenemos un error que no podemos solucionar, podemos usar este método para restaurar o reinstalar todos los archivos a las últimas versiones estables, pero primero debemos tener en cuenta varios casos:

## 🛑 Problema al conectar a la base de datos
Si aparece un mensaje referente a que no se puede conectar a la base de datos, no sigas con este tutorial, ya que restaurar los archivos no va a hacer que se resuelva. Probablemente tengas un problema con el servidor MySQL, en cuyo caso lo mejor es que lo mire un experto o revises el archivo config.php si has cambiado de servidor o de contraseña de la base de datos:

- [Consultar a un experto](https://facturascripts.com/expertos).
- [Guía del archivo config.php](https://facturascripts.com/publicaciones/el-archivo-config-php)

## 📁 Abre la carpeta de FacturaScripts
Si has instalado FacturaScripts en **Windows**, la carpeta suele estar en uno de estos sitios:

- c:\xampp\htdocs\facturas
- c:\xampp\htdocs\facturascripts
- En el escritorio, en una carpeta llamada ``xampp``. Dentro abrimos la carpeta ``htdocs`` y dentro la carpeta ``facturas``.

Si has instalado FacturaScripts en Windows con Servbay, la carpeta suele estar:

    c:\ServBay\www\facturascripts

Si has instalado FacturaScripts en tu hosting, ve al panel de control del hosting y en la sección de archivos, ahí la tendrás.

Una vez localizada la carpeta de FacturaScripts, comprueba si hay un archivo llamado ``replace_index_to_restore``. Si lo encuentras, elimina el archivo ``index`` y renombra ``replace_index_to_restore`` a ``index``. Ahora vuelve a entrar en FacturaScripts y sigue las instrucciones.

### 🔍 ¿No localizas replace_index_to_restore?
Si no encuentras el archivo, puedes descargarlo desde aquí. Haz **clic derecho** y selecciona **guardar enlace como...**
- https://github.com/NeoRazorX/facturascripts/raw/master/replace_index_to_restore.php

Una vez descargado el archivo:

- Ve a la carpeta de FacturaScripts.
- Copia este archivo.
- Elimina el archivo ``index``
- Renombra ``replace_index_to_restore`` a ``index``
- Vuelve a abrir FacturaScripts y sigue las instrucciones.

### ⁉️ ¿No soluciona el problema?
Entonces habla con soporte o con un experto:

- https://facturascripts.com/contacto
- https://facturascripts.com/expertos