---
id: 663
permalink: widget-file-359
title: Widget de Archivos (WidgetFile)
creationdate: 06-10-2018 00:00:00
lastmod: 09-04-2026
url: https://facturascripts.com/publicaciones/widget-file-359
---

El **Widget de Archivos** (WidgetFile) permite mostrar y adjuntar archivos en los formularios estándar de FacturaScripts.

## Ejemplo de Implementación
A continuación se presenta un ejemplo de cómo implementar el widget de archivos en un formulario:

```xml
&lt;column name=&quot;full-path&quot; order=&quot;110&quot;&gt;
	&lt;widget type=&quot;file&quot; fieldname=&quot;myfile&quot;/&gt;
&lt;/column&gt;
```

Así es como se ve el widget de archivos en un formulario de edición. El aspecto puede variar dependiendo del navegador:

![Widget de Archivos en Edición](https://i.imgur.com/mdsp1Yz.png)

## Funcionamiento
Este widget permite al usuario adjuntar un archivo que se filtra previamente para evitar la carga de código PHP. Finalmente, **el archivo se mueve a la carpeta `MyFiles`** de FacturaScripts, y el valor almacenado en el modelo es el nombre del archivo. Es responsabilidad del programador mover el archivo a la ubicación deseada.

### Filtrar Tipos de Archivos
Es posible filtrar el tipo de archivos que el campo aceptará utilizando el parámetro **accept**. En el siguiente ejemplo, solamente se admiten archivos con extensiones `.xlsx` o `.xls`:

```xml
&lt;column name=&quot;file&quot; numcolumns=&quot;12&quot;&gt;
   &lt;widget type=&quot;file&quot; fieldname=&quot;myfile&quot; accept=&quot;.xlsx,.xls&quot;/&gt;
&lt;/column&gt;
```

### Permitir Múltiples Archivos
Si se desea permitir la selección de múltiples archivos, se puede añadir el parámetro `multiple` y establecerlo en `true`:

```xml
&lt;column name=&quot;file&quot; numcolumns=&quot;12&quot;&gt;
   &lt;widget type=&quot;file&quot; fieldname=&quot;myfile&quot; accept=&quot;.xlsx,.xls&quot; multiple=&quot;true&quot;/&gt;
&lt;/column&gt;
```

### Obtener el archivo
En el controlador recibiremos el archivo mediante la [Request](https://facturascripts.com/publicaciones/objeto-request-como-recibir-datos-de-formularios-url-cookies-etc). Podemos consultar el archivo por el nombre del campo:

```
$uploadFile = $this-&gt;request-&gt;file(&#39;myfile&#39;);

// también poddemos consultar así
$uploadFile = $this-&gt;request-&gt;files-&gt;get(&#39;myfile&#39;);
```
