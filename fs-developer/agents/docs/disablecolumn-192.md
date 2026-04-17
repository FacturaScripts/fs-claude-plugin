---
id: 688
permalink: disablecolumn-192
title: Método disableColumn() en Controladores Extendidos
creationdate: 04-05-2018 00:00:00
lastmod: 15-04-2025
url: https://facturascripts.com/disablecolumn-192
---
El método `disableColumn()` permite ocultar, deshabilitar o bloquear un campo o columna específico en las pestañas o vistas de un PanelController en FacturaScripts. Este método es muy útil para personalizar la interfaz del usuario, permitiendo mostrar u ocultar información según las necesidades del negocio.

## Uso Básico: Ocultar una Columna
Para ocultar una columna, basta con pasar el parámetro correspondiente en el método. Por ejemplo, en el siguiente código se desactiva la columna **customer** en la vista `ListFacturaCliente`:

```php
$this-&gt;tab(&#39;ListFacturaCliente&#39;)-&gt;disableColumn(&#39;customer&#39;, true);
```

Es fundamental utilizar el **nombre** exacto de la columna, tal y como se define en la vista XML. A continuación se muestra un ejemplo de definición de una columna en XML:

```xml
&lt;column name=&quot;customer&quot; order=&quot;120&quot;&gt;
    &lt;widget type=&quot;text&quot; fieldname=&quot;nombrecliente&quot; /&gt;
&lt;/column&gt;
```

## Uso Avanzado: Configurar un Campo de Solo Lectura
El método `disableColumn()` también permite configurar un campo como solo lectura. Para ello, se utiliza un tercer parámetro que afecta la propiedad `readonly` del widget. Este parámetro puede tener los valores **&#39;false&#39;**, **&#39;true&#39;** o **&#39;dinamic&#39;**. En el siguiente ejemplo se establece el campo **email** como solo lectura en la vista `EditCliente`:

```php
$this-&gt;tab(&#39;EditCliente&#39;)-&gt;disableColumn(&#39;email&#39;, false, &#39;true&#39;);
```

## Notas Adicionales
- Asegúrate de utilizar los nombres de campo tal y como están definidos en la vista XML para evitar errores.
- La opción de solo lectura puede configurarse de forma dinámica evaluando el estado u otros parámetros en tiempo de ejecución.

Con estas configuraciones, puedes adaptar la interfaz a las necesidades específicas de tu negocio, mejorando la experiencia del usuario y la seguridad de la información mostrada.
