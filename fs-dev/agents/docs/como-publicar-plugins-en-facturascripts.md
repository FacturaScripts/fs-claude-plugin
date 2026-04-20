---
id: 1
permalink: como-publicar-plugins-en-facturascripts
title: Cómo publicar plugins en facturascripts.com
creationdate: 23-11-2018 13:26:56
lastmod: 31-12-2025
url: https://facturascripts.com/como-publicar-plugins-en-facturascripts
---
Si has creado un plugin y quieres publicarlo en **facturascripts.com** simplemente ve al **menú Programadores** → [La forja](https://facturascripts.com/forja) y en la pestaña **mis plugins** pulsa el **botón añadir**. Debes haber iniciado sesión para que aparezca el botón añadir. No se pueden publicar plugins de forma anónima.

![publicar plugin](https://i.imgur.com/DL7UBYc.png)

En la siguiente pantalla elige un nombre, una licencia y una descripción para tu plugin. **¿Tienes el código público en github, gitlab o similar?** Si quieres puedes indicarlo en el campo git.

## 💾 Crea el zip de tu plugin
Para empaquetas un plugin, comprime la carpeta del plugin en formato zip. Comprime la carpeta, no el contenido, es decir, ve a la carpeta Plugins de FacturaScripts, y ahí selecciona la carpeta de tu plugin y comprímela en zip.

### 🚨 Problemas con el zip creado en Ubuntu y derivados
En las últimas versiones de Ubuntu y derivados, al comprimir mediante el asistente visual, lo hace empleando la versión 2 de zip, que todavía no está implementada en PHP. Por este motivo te va a indicar un error en todos los zips que comprimas así. Es mejor que en el caso de Linux lo comprimas en línea de comandos:

```
zip -r nombre-zip.zip carpeta-plugin
```

También puedes usar [fsmaker](https://facturascripts.com/fsmaker):

```
fsmaker zip
```

### 🏷️ La versión es incorrecta
El campo version solamente acepta valores numéricos, enteros o decimales, para poder comparar fácilmente y saber si estamos usando una versión anterior. **Evita versiones como**:

- 0.1.2.3 (esto no es un número)
- A1234 (tampoco es un número)
- 1.2beta
- alpha

## 🗞️ Publica tu primera build
Ahora solamente falta subir el **zip** con los archivos del plugin.

- Haz clic en la **pestaña editar** de la página del plugin.
- En la **sección de zips** pulsa el botón añadir, aparecerá un formulario.
- Selecciona el archivo zip, indica la versión y pulsa guardar.

### 📚 Tipos de plugins
- **Gratuitos**: todo el mundo puede descargarlos, sin necesidad de registro.
- [De pago](https://facturascripts.com/como-vender-plugins): vende tus plugins directamente a través de esta web para llegar al mayor número de clientes. Define un precio, licencia y plazo de actualizaciones. Solamente aquellos que compren el plugin podrán descargarlo o actualizarlo.
- **Privados**: registra incluso plugins privados para utilizar el sistema de actualizaciones de FacturaScripts. Crea suscripciones para los usuarios que desee y solamente ellos podrán descargar o actualizar el plugin.
