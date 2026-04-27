---
id: 103
permalink: funciones-obsoletas-a-eliminar-en-facturascripts-2018-14
title: Funciones obsoletas a eliminar en FacturaScripts 2018.14
creationdate: 23-10-2019 11:03:46
lastmod: 23-10-2019
url: https://facturascripts.com/publicaciones/funciones-obsoletas-a-eliminar-en-facturascripts-2018-14
---

En la siguiente actualización de FacturaScripts, la 2018.14 que llegará en dos semanas, se eliminarán las siguiente funciones ya obsoletas:

## Controladores
En FacturaScripts 2018.09 se introdujo la función [toolBox()](https://facturascripts.com/publicaciones/nueva-clase-toolbox-para-agrupar-log-traductor-y-varias-herramientas) en controladores y modelos, para hacer más accesible las herramientas más comunes: traductor, log, utils, etc...

### $this-&gt;i18n
El traductor está ahora en $this-&gt;toolBox()-&gt;i18n()

### $this-&gt;miniLog
El log está ahora disponible en $this-&gt;toolBox()-&gt;log() o en $this-&gt;toolBox()-&gt;i18nLog(), si lo queremos con traducción automática.

## Modelos
Los modelos también incluyen la función [toolBox()](https://facturascripts.com/publicaciones/nueva-clase-toolbox-para-agrupar-log-traductor-y-varias-herramientas) para agrupar las herramientas más comunes.

### self::$i18n
El traductor está ahora en $this-&gt;toolBox()-&gt;i18n()

### self::$miniLog
El log está ahora disponible en $this-&gt;toolBox()-&gt;log() o en $this-&gt;toolBox()-&gt;i18nLog(), si lo queremos con traducción automática.

## Eventos
Los eventos serán sustituidos por extensiones. Puedes ver un ejemplo de cómo [ejecutar código antes de guardar un producto en este ejemplo](https://github.com/FacturaScripts/SamplePlugin/blob/master/Extension/Model/Producto.php#L47).
