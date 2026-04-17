---
id: 917
permalink: extensiones-de-xmlview
title: Extensiones de XMLView
creationdate: 08-05-2021 11:08:08
lastmod: 07-11-2025
url: https://facturascripts.com/extensiones-de-xmlview
---
Para modificar o añadir columnas a un XMLView de otro plugin (o del núcleo), podemos crear una extensión. Esto implica crear un archivo XML con los cambios y colocarlo en la carpeta **Extension/XMLView** de nuestro plugin.

## Ejemplo: Añadir columnas a un XMLView
Imaginemos que hemos añadido la columna &quot;usado&quot; al producto. Para incluir esta columna en la vista del producto, utilizaremos un widget de tipo checkbox y lo incluiremos en una extensión en el archivo **Extension/XMLView/EditProducto.xml**:

```xml
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;view&gt;
    &lt;columns&gt;
        &lt;group name=&quot;options&quot; numcolumns=&quot;12&quot; valign=&quot;bottom&quot;&gt;
            &lt;column name=&quot;usado&quot;&gt;
                &lt;widget type=&quot;checkbox&quot; fieldname=&quot;usado&quot; /&gt;
            &lt;/column&gt;
        &lt;/group&gt;
    &lt;/columns&gt;
&lt;/view&gt;
```

De esta manera, estamos indicando a FacturaScripts que incluya la columna &quot;usado&quot; dentro del grupo &quot;options&quot; de la lista de columnas del archivo `XMLView/EditProducto.xml`.

## Ejemplo: Editar columnas en un XMLView
Ahora, imaginemos que deseamos editar una columna ya creada previamente. Podemos modificarla utilizando el atributo **overwrite=&quot;true&quot;** y lo incluiremos en una extensión en el archivo **Extension/XMLView/EditProducto.xml**:

```xml
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;view&gt;
    &lt;columns&gt;
        &lt;group name=&quot;options&quot; numcolumns=&quot;12&quot; valign=&quot;bottom&quot;&gt;
            &lt;column name=&quot;usado&quot; overwrite=&quot;true&quot;&gt;
                &lt;widget type=&quot;select&quot; fieldname=&quot;usado&quot; translate=&quot;true&quot; required=&quot;true&quot;&gt;
                    &lt;values title=&quot;book&quot;&gt;-2&lt;/values&gt;
                    &lt;values title=&quot;subtract&quot;&gt;-1&lt;/values&gt;
                    &lt;values title=&quot;do-nothing&quot;&gt;0&lt;/values&gt;
                    &lt;values title=&quot;add&quot;&gt;1&lt;/values&gt;
                    &lt;values title=&quot;foresee&quot;&gt;2&lt;/values&gt;
                &lt;/widget&gt;
            &lt;/column&gt;
        &lt;/group&gt;
    &lt;/columns&gt;
&lt;/view&gt;
```

De este modo, estamos diciendo a FacturaScripts que edite la columna &quot;usado&quot; dentro del grupo &quot;options&quot; de la lista de columnas del archivo `XMLView/EditProducto.xml`. En este caso, hemos reemplazado el widget de tipo checkbox por un widget de tipo select.

### Nota
Cuando la vista que se está extendiendo ha sido modificada directamente desde el botón de opciones, puede que no se muestre el campo añadido, ya que prevalecerá el estado de la vista modificada en la base de datos.
