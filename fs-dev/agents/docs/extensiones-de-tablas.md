---
id: 916
permalink: extensiones-de-tablas
title: Extensiones de tablas
creationdate: 08-05-2021 11:01:30
lastmod: 28-05-2025
url: https://facturascripts.com/extensiones-de-tablas
---
Para modificar la tabla de otro plugin (o del core) podemos crear una extensión de esa tabla, es decir, crearemos un archivo xml con el nombre de la tabla en la carpeta **Extension/Table** de nuestro plugin.

## Ejemplo: añadir columnas a la tabla productos
Supongamos que queremos añadir la columna &quot;usado&quot; a la tabla de productos. Lo que normalmente harías es añadir el archivo Table/productos.xml a tu plugin con la columna deseada. **Pero esto no es correcto**. Al hacer esto lo que le estás diciendo a FacturaScripts es que la tabla productos **se compone únicamente** de la columna &quot;usado&quot;.

Para este caso lo correcto es crear el archivo **Extension/Table/productos.xml**:
```
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;table&gt;
    &lt;column&gt;
        &lt;name&gt;usado&lt;/name&gt;
        &lt;type&gt;boolean&lt;/type&gt;
    &lt;/column&gt;
&lt;/table&gt;
```
De esta forma lo que estamos indicando a FacturaScripts es que **añada esta columna** a la definición de la tabla productos.
Los cambios se pueden ver reflejados en el archivos FacturaScripts/Dinamic/Table/productos.xml
**Observación: Las tablas en la base de datos sólo se modifican cuando son llamadas desde Facturascripts,**  en éste caso cuando naveguemos al menú  productos.

### fsmaker
Para crear este archivo con [fsmaker](/publicaciones/fsmaker-0-92-disponible) simplemente ejecutamos:
```
fsmaker extension
```
En el asistente elegimos tabla y después escribimos el nombre de la nueva columna.

## Añadir columnas al modelo
Los modelos de FacturaScripts cargan automáticamente todas las columnas de la tabla, es decir, si la tabla tiene una columna nueva también la va a cargar. Por este motivo **no es necesario modificar el modelo** al añadir una columna a la tabla.


### ¿No ve los cambios del xml en la base de datos?:
Es posible que durante el desarrollo no vea la tabla creada en la base de datos o no se realicen los cambios del xml en la tabla. Si es así, vaya al menú administrador, Plugins y pulse el botón **reconstruir**.

Facturascripts crea las tablas que no existen cuando se instancia el modelo(por ejemplo new FacturaCliente()). Si ha creado un xml y aún no se ha instanciado al menos una vez, no se creará la tabla en la base de datos.

Cuando se realizan cambios en el xml no se aplican hasta que se borra la Cache ya que el sistema usa un sistema de Cache para evitar comprobar las tablas en cada petición. Así que si desea forzar la creación y modificación de la tabla en la base de datos siga los siguientes pasos:

#### Forzar la creación y modificación de las tablas en la base de datos
- Vaya al menú administrador, Plugins y pulse el botón **reconstruir**.
- Instanciar el modelo que quiere actualizar. (por ejemplo new FacturaCliente()).
