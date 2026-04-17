---
id: 697
permalink: las-extensiones-334
title: Las extensiones
creationdate: 23-02-2020 00:00:00
lastmod: 01-04-2026
url: https://facturascripts.com/las-extensiones-334
---
Las extensiones son una forma sencilla para que los plugins modifiquen o añadan funciones nuevas a controladores, modelos, tablas o vistas de otros plugins (o del core), internamente el programa lo **pipe()**.

## No son herencia
Las extensiones o pipes no son herencia. Cuando en una extensión añades código a ejecutar durante el guardado de un modelo en la base de datos, no estás heredando del modelo, sino que estás &quot;incrustando&quot; este nuevo código en el archivo original. Por eso varios plugins pueden añadir extensiones a un mismo archivo, mientras que con herencia no es posible.

## Sólo en archivos soportados
No es posible añadir extensiones a cualquier archivo imaginable. Solamente en aquellos soportados:

- [Extensiones de tablas](/publicaciones/extensiones-de-tablas)
- [Extensiones de modelos](/publicaciones/extensiones-de-modelos)
- [Extensiones de controladores](/publicaciones/extensiones-de-controladores)
- [Extensiones de XMLViews](/publicaciones/extensiones-de-xmlview)
- [Extensiones de vistas HTML](/publicaciones/extensiones-de-vistas-html)

### Extensiones no soportadas
No es posible añadir extensiones a los archivos de:

- Core/Base
- Core/Model/Base
- Core/Lib/ExtendedController

## Extensiones de archivos XML
Las extensiones de archivos xml se aplican automáticamente. Si crear un archivo Extension/Table/productos.xml, el contenido de ese archivo se fusionará automáticamente con el del archivo orginal. El resultado se almacena en la Dinamic/Table/productos.xml, que es el archivo que utiliza finalmente FacturaScripts.

## Extensiones de archivos PHP (controladores y modelos)
Las extensiones de archivos PHP no se cargan automáticamente. Es necesario cargarlas en el archivo [Init.php](/publicaciones/el-archivo-init-php-307) del plugin.

```
public function init() {
   $this-&gt;loadExtension(new Extension\Controller\ListProducto());
}
```
