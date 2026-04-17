---
id: 643
permalink: las-vistas-xml-xmlview-668
title: Las vistas XML (XMLView)
creationdate: 01-05-2018 00:00:00
lastmod: 07-04-2026
url: https://facturascripts.com/las-vistas-xml-xmlview-668
---
Los controladores extendidos como [ListController](/publicaciones/listcontroller-232) y [EditController](/publicaciones/editcontroller-642), utilizan **archivos XML** para definir las columnas, grupos, widgets y botones a mostrar en una pestaña. De esta forma podemos personalizar rápidamente un listado o formulario sin necesidad de editar PHP. Estos archivos se deben almacenar en la **carpeta XMLView** del plugin.

## Estructura del XML
El elemento raíz del archivo XML será la **etiqueta view** y se podrán incluir las siguientes etiquetas a modo de grupo:
- [Etiqueta columns](/publicaciones/columns-88): (obligatoria) para definir la lista de campos que se visualizan en la vista.
- [Etiqueta rows](/publicaciones/rows-304): (opcional) permite definir condiciones especiales para la filas, así como añadir botones a las vistas.
- [Etiqueta modals](/publicaciones/modals-718): (opcional) define un formulario modal que será visualizado mediante la interacción con un botón definido en la vista.

### Ejemplo: vista para ListController
Aquí podemos ver que se definen 3 columnas a mostrar, más un row status, que sirve para indicar los colores a aplicar.
```
&lt;?xml version=&#39;1.0&#39; encoding=&#39;UTF-8&#39;?&gt;
&lt;view&gt;
    &lt;columns&gt;
        &lt;column name=&#39;code&#39; order=&#39;100&#39;&gt;
            &lt;widget type=&#39;text&#39; fieldname=&#39;codigo&#39; /&gt;
        &lt;/column&gt;
        &lt;column name=&#39;description&#39; order=&#39;105&#39;&gt;
            &lt;widget type=&#39;text&#39; fieldname=&#39;descripcion&#39; /&gt;
        &lt;/column&gt;
        &lt;column name=&#39;state&#39; display=&#39;center&#39; order=&#39;110&#39;&gt;
            &lt;widget type=&#39;text&#39;&gt;
                &lt;option color=&#39;success&#39; fieldname=&#39;estado&#39;&gt;ABIERTO&lt;/option&gt;
                &lt;option color=&#39;warning&#39; fieldname=&#39;estado&#39;&gt;CERRADO&lt;/option&gt;
            &lt;/widget&gt;
        &lt;/column&gt;
    &lt;/columns&gt;
    &lt;rows&gt;
        &lt;row type=&#39;status&#39;&gt;
            &lt;option color=&#39;info&#39; fieldname=&#39;estado&#39;&gt;Pendiente&lt;/option&gt;
            &lt;option color=&#39;warning&#39; fieldname=&#39;estado&#39;&gt;Parcial&lt;/option&gt;
        &lt;/row&gt;
    &lt;/rows&gt;
&lt;/view&gt;
```

### Ejemplo: vista para EditController
Aquí podemos ver que se definen dos grupos de columnas para este formulario.
```
&lt;?xml version=&#39;1.0&#39; encoding=&#39;UTF-8&#39;?&gt;
&lt;view&gt;
    &lt;columns&gt;
        &lt;group name=&#39;data&#39; numcolumns=&#39;8&#39; title=&#39;Identificación internacional&#39; icon=&#39;fa-globe&#39;&gt;
            &lt;column name=&#39;code&#39; numcolumns=&#39;4&#39; order=&#39;100&#39;&gt;
                &lt;widget type=&#39;text&#39; fieldname=&#39;codigo&#39; /&gt;
            &lt;/column&gt;
            &lt;column name=&#39;description&#39; numcolumns=&#39;8&#39; order=&#39;105&#39;&gt;
                &lt;widget type=&#39;text&#39; fieldname=&#39;descripcion&#39; /&gt;
            &lt;/column&gt;
        &lt;/group&gt;
        &lt;group name=&#39;state&#39; numcolumns=&#39;4&#39;&gt;
            &lt;column name=&#39;state&#39; display=&#39;center&#39; order=&#39;100&#39;&gt;
                &lt;widget type=&#39;text&#39;&gt;
                    &lt;option color=&#39;success&#39; fieldname=&#39;estado&#39;&gt;ABIERTO&lt;/option&gt;
                    &lt;option color=&#39;warning&#39; fieldname=&#39;estado&#39;&gt;CERRADO&lt;/option&gt;
                &lt;/widget&gt;
            &lt;/column&gt;
        &lt;/group&gt;
    &lt;/columns&gt;
&lt;/view&gt;
```

### ¿Los cambios no se aplican?
Tenga en cuenta que durante el desarrollo del plugin, los archivos de Dinamic no se actualizan a menos que pulse el **botón reconstruir** del **menú Administrador, Plugins**.

Además, como a nivel de usuario puede personalizar los listados y formularios desde el **botón opciones** de cada pantalla, si después hace cambios en el XML, no se verán reflejados. Vaya al botón opciones de esa pantalla y después elimine los cambios.
