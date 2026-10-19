---
id: 4509
permalink: la-biblioteca-de-archivos
title: La biblioteca de archivos
creationdate: 03-09-2026 17:02:09
lastmod: 16-09-2026
url: https://facturascripts.com/publicaciones/la-biblioteca-de-archivos
---
La biblioteca es el almacén de archivos de FacturaScripts. Todo lo que subes al programa acaba aquí: los logotipos, la imagen de la pantalla de acceso, los documentos que adjuntas a una factura o a un cliente, las imágenes de los productos, etc. Puedes consultarla en el **menú Administrador** → **Biblioteca**.

## 📎 El listado de archivos

De cada archivo se guarda el código, el nombre, el tipo, el tamaño y la fecha y hora en que se subió. Puedes ordenar por cualquiera de esos campos y filtrar por **tipo de archivo** y por **periodo**, además de buscar por nombre.

Ordenar por **tamaño** de mayor a menor es la forma rápida de encontrar qué está ocupando el espacio.

![Listado de archivos](https://i.imgur.com/uMFBVWB.png)
![Filtado de archivos](https://i.imgur.com/sc6AFGq.png)

### ⬇️ Descargar archivos

Marca las casillas de los archivos que quieras y pulsa el botón **Descargar**. Si seleccionas varios, se descargan juntos.

### ⬆️ Subir archivos

Puedes subir archivos directamente desde aquí con el botón **Nuevo**, pero lo habitual es que lleguen solos: cuando adjuntas un documento a una factura, cuando subes un logotipo o cuando añades una imagen a un producto, el archivo se guarda en la biblioteca automáticamente.

Si al subir un archivo grande recibes un error, el límite lo pone la configuración de PHP, no FacturaScripts. Consulta [cómo aumentar el límite de subida de archivos](https://facturascripts.com/publicaciones/aumentar-el-limite-de-subida-de-archivos).

## 🗂️ Dónde se guardan

Los archivos se guardan en la carpeta **MyFiles** de tu instalación, organizados en subcarpetas por año y mes. Es importante tenerlo en cuenta para las **copias de seguridad**: si solo copias la base de datos, perderás todos los adjuntos. Necesitas guardar también la carpeta MyFiles.

Los enlaces a los archivos incluyen un código de verificación, para que nadie pueda descargar un adjunto adivinando su dirección.

## 📊 Límite de espacio

Si tu instalación tiene configurado un límite de almacenamiento (la opción `storage_limit` del [archivo config.php](https://facturascripts.com/publicaciones/el-archivo-config-php), que usan sobre todo los alojamientos compartidos), ocurren dos cosas:

- Al entrar en la biblioteca verás un **aviso** cuando hayas superado el 80% del espacio, indicando cuánto has usado, cuánto queda y cuál es el límite.
- Si un archivo nuevo no cabe, la subida se rechaza con un error y el archivo no se guarda.

Si te acercas al límite, ordena por tamaño y borra lo que ya no necesites.

![Limite de espacio](https://i.imgur.com/JmJCwxh.png)

## ⚠️ Antes de borrar

Al eliminar un archivo de la biblioteca desaparece también de donde estuviera vinculado: el adjunto de esa factura, el logotipo de ese formato de impresión o la imagen de ese producto. Comprueba a qué está asociado antes de borrarlo.

## Ver también

- [Cambiar el logotipo y LOPD](https://facturascripts.com/publicaciones/logotipo-y-lopd-299)
- [Cómo aumentar el límite de subida de archivos](https://facturascripts.com/publicaciones/aumentar-el-limite-de-subida-de-archivos)
- [El archivo config.php](https://facturascripts.com/publicaciones/el-archivo-config-php)
- [Cómo restaurar FacturaScripts en caso de desastre](https://facturascripts.com/publicaciones/como-restaurar-facturascripts-en-caso-de-desastre)