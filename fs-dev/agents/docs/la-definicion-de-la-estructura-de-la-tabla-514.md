---
id: 619
permalink: la-definicion-de-la-estructura-de-la-tabla-514
title: La definición de la estructura de la tabla
creationdate: 27-04-2018 00:00:00
lastmod: 01-04-2026
url: https://facturascripts.com/publicaciones/la-definicion-de-la-estructura-de-la-tabla-514
---

FacturaScripts utiliza archivos XML para definir la estructura de las tablas de la base de datos. El núcleo del sistema se encarga de revisar estas tablas para:

- Crear la tabla si no existe.
- Verificar que la tabla tenga todas las columnas necesarias y crearlas en caso de faltar alguna.
- No realizar ninguna acción si la tabla contiene columnas adicionales a las definidas en el XML.

Los archivos XML deben ubicarse en la carpeta **Table** de cada plugin, y cada archivo debe nombrarse exactamente igual que la tabla correspondiente.

## Ejemplo: projects.xml

```xml
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;table&gt;
    &lt;column&gt;
        &lt;name&gt;name&lt;/name&gt;
        &lt;type&gt;character varying(100)&lt;/type&gt;
        &lt;null&gt;NO&lt;/null&gt;
    &lt;/column&gt;
    &lt;column&gt;
        &lt;name&gt;codproject&lt;/name&gt;
        &lt;type&gt;character varying(8)&lt;/type&gt;
        &lt;null&gt;NO&lt;/null&gt;
    &lt;/column&gt;
    &lt;constraint&gt;
        &lt;name&gt;projects_pkey&lt;/name&gt;
        &lt;type&gt;PRIMARY KEY (codproject)&lt;/type&gt;
    &lt;/constraint&gt;
&lt;/table&gt;
```

Cada etiqueta **column** representa una columna de la tabla y puede incluir las siguientes subetiquetas:

- **name**: Nombre de la columna. Se recomienda usar solo minúsculas para evitar conflictos.
- **type**: Tipo de dato que almacenará la columna.
- **null**: Indica si la columna admite valores nulos: `YES` para admitir, `NO` para no admitir. Si esta etiqueta se omite, se asume `YES`.
- **default**: Valor por defecto a asignar cuando no se proporciona uno, especialmente útil al agregar nuevas columnas a tablas con registros preexistentes. Recuerda que para la operación diaria, los valores por defecto deben implementarse en el método `clear()` del modelo, no en el XML.
- **rename**: Permite indicar el nombre anterior de una columna para que el actualizador la renombre en lugar de crearla de cero. Resulta clave cuando cambias el identificador de un campo en tablas que ya existen en instalaciones activas.

### Renombrado de Columnas Existentes

Si necesitas cambiar el nombre de una columna sin perder la información existente, añade la etiqueta **rename** dentro de la columna nueva:

```xml
&lt;column&gt;
    &lt;name&gt;notas&lt;/name&gt;
    &lt;type&gt;text&lt;/type&gt;
    &lt;rename&gt;observaciones&lt;/rename&gt;
&lt;/column&gt;
```

En este ejemplo, FacturaScripts detecta que `notas` debe sustituir a `observaciones` y ejecuta el renombrado durante la actualización de la tabla. Asegúrate de mantener el mismo tipo de datos o actualizarlo para evitar incompatibilidades.

### Nombres Reservados

Evita usar los siguientes nombres para columnas, ya que están reservados:

- action
- activetab
- code

### Tipos de Datos Soportados

FacturaScripts fue originalmente desarrollado para PostgreSQL, por lo que la mayoría de los nombres de tipos de datos corresponden a este sistema. Algunos ejemplos son:

- **serial**: Entero autoincrementable, recomendado para claves primarias numéricas.
- **integer**: Entero convencional.
- **double precision**: Números con decimales.
- **boolean**: Valores lógicos: `true` o `false`.
- **character varying(100)**: Texto de longitud variable, hasta 100 caracteres. Puedes modificar el número para otros rangos.
- **text**: Texto extensible (hasta 4000 caracteres).
- **date**: Fechas.
- **time**: Horas.
- **timestamp**: Fecha y hora.

### Definición de Restricciones: Clave Primaria, Claves Foráneas, etc.

Las restricciones, como claves primarias y foráneas, se definen usando etiquetas **constraint**. Cada restricción debe tener un nombre único, lo que permite al sistema verificar su existencia en la tabla:

- Si la restricción no se encuentra, se crea.
- Si ya existe, no se realiza ninguna acción.
- Si se cambia el nombre de la restricción, se elimina la existente y se crea una nueva.

#### Ejemplo de Clave Foránea

```xml
&lt;constraint&gt;
    &lt;name&gt;ca_albaranesprov_series&lt;/name&gt;
    &lt;type&gt;FOREIGN KEY (codserie) REFERENCES series (codserie) ON DELETE RESTRICT ON UPDATE CASCADE&lt;/type&gt;
&lt;/constraint&gt;
```

En este ejemplo se define que:

- La columna `codserie` de la tabla actual se relaciona con la columna `codserie` de la tabla `series`.
- Se restringe la eliminación en la tabla `series` si existe una dependencia.
- Las actualizaciones en la tabla `series` se propagan a la tabla actual.

#### Ejemplo de Restricción Única

```xml
&lt;constraint&gt;
    &lt;name&gt;uniq_codigo_albaranesprov&lt;/name&gt;
    &lt;type&gt;UNIQUE (codigo, idempresa)&lt;/type&gt;
&lt;/constraint&gt;
```

Este ejemplo asegura que la combinación de `codigo` e `idempresa` sea única en la tabla.

### Definición de Índices

Además de las restricciones, puedes declarar índices adicionales usando la etiqueta **index**. Cada índice debe incluir un nombre (sin el prefijo `fs_`, ya que el sistema lo añadirá automáticamente) y las columnas afectadas, separadas por comas si son varias.

```xml
&lt;index&gt;
    &lt;name&gt;ventas_fecha_idx&lt;/name&gt;
    &lt;columns&gt;fechaalta, idempresa&lt;/columns&gt;
&lt;/index&gt;
```

Al reconstruir, FacturaScripts comprobará qué índices existen en la base de datos y creará, actualizará o eliminará los necesarios para ajustarse al XML.

### ¿No ves los cambios en la base de datos?

Durante el desarrollo puede ocurrir que la tabla no se cree o que los cambios realizados en el XML no se reflejen en la base de datos. Para solucionarlo, sigue estos pasos:

1. Ve al menú **Administrador → Plugins** y pulsa el botón **Reconstruir**.
2. Instancia el modelo correspondiente (por ejemplo, `new FacturaCliente()`).

Recuerda que FacturaScripts crea las tablas que no existen al instanciar el modelo. Además, los cambios en el XML no se aplican hasta que se borre la caché, ya que el sistema utiliza una caché para evitar comprobaciones constantes. Para forzar la aplicación de las modificaciones, es necesaria la reconstrucción mencionada.
