---
id: 4789
permalink: widget-json
title: Widget Json
creationdate: 15-10-2026 14:08:53
lastmod: 19-10-2026
url: https://facturascripts.com/publicaciones/widget-json
---
En los **archivos XMLView** se puede utilizar el **Widget Json** (WidgetJson) para mostrar de forma legible un campo que guarda datos en formato JSON. En lugar de enseñar el texto JSON en bruto, el formulario muestra cada clave con su valor y anida los objetos y arrays.

```xml
&lt;column name=&quot;context&quot; numcolumns=&quot;6&quot; order=&quot;110&quot;&gt;
	&lt;widget type=&quot;json&quot; fieldname=&quot;context&quot; readonly=&quot;true&quot;/&gt;
&lt;/column&gt;
```

### Propiedades del Widget Json
- **fieldname**: Nombre del campo que contiene el JSON. **Obligatorio**.
- **readonly**: Impide la modificación del valor. Recomendado, ya que este widget está pensado para consultar datos.
- **rows**: Número de filas del área de texto que se muestra cuando el campo está vacío o no contiene un JSON válido. Por defecto, **3**.

### Visualización
- **En un formulario de edición**, si el campo contiene un JSON válido se muestra cada clave seguida de su valor en negrita. Los objetos y arrays anidados se muestran dentro de su clave, en dos columnas, o en cuatro si tienen más de 15 elementos.
- **Si el campo está vacío o el JSON no es válido**, se muestra un área de texto, igual que el [Widget Textarea](https://facturascripts.com/publicaciones/widget-textarea-699).
- **En un listado** se muestra el texto JSON en bruto, recortado a 60 caracteres. Al pasar el ratón por encima se ve el texto completo.

Por ejemplo, un campo con el valor:

```json
{&quot;user&quot;: &quot;admin&quot;, &quot;ip&quot;: &quot;127.0.0.1&quot;, &quot;data&quot;: {&quot;code&quot;: 15, &quot;total&quot;: 121}}
```

se muestra en el formulario así:

- user: **admin**
- ip: **127.0.0.1**
- data:
    - code: **15**
    - total: **121**

![Widget json](https://facturascripts.com/MyFiles/2026/10/7756_contexto.png?myft=15964d339dc8682df6fd22511008abf9f706299d)

### Guardado del formulario
Cuando el JSON es válido, el listado de claves y valores no se puede editar, pero el widget envía el valor original en un campo oculto, de modo que al guardar el registro el contenido se conserva.

En versiones anteriores a la **2026.71**, este campo oculto no existía y el valor se guardaba vacío. Si tu plugin debe funcionar con esas versiones, usa este widget solo en vistas de consulta, como el detalle de un log, o en formularios que no se guardan.

## 🎨 Opciones de coloreado
Recuerda que [todos los widgets tienen una serie de propiedades y opciones comunes](https://facturascripts.com/publicaciones/widget-238).