---
id: 648
permalink: row-actions-315
title: Row actions
creationdate: 07-05-2018 00:00:00
lastmod: 17-07-2026
url: https://facturascripts.com/publicaciones/row-actions-315
---
Este tipo de row permite definir un grupo de botones a mostrar junto al resto de botones de la pestaña. Dependiendo del tipo de pestaña se visualizarán en un sitio distinto.

## Ejemplo:
```
&lt;rows&gt;
   &lt;row type=&quot;actions&quot;&gt;
      &lt;button action=&quot;boton1&quot; color=&quot;warning&quot; icon=&quot;fa-solid fa-vial&quot; label=&quot;button-1&quot; type=&quot;action&quot;/&gt;
      &lt;button action=&quot;boton2&quot; color=&quot;warning&quot; icon=&quot;fa-solid fa-terminal&quot; label=&quot;button-2&quot; type=&quot;action&quot;/&gt;
   &lt;/row&gt;
&lt;/rows&gt;
```

### 🖱️ Botones
Los botones se definen mediante etiquetas `button` y tienen las siguientes propiedades:
- `type`: indica el tipo de botón.
	- `action`: al hacer clic se recargará la página ejecutando el action indicado en la propiedad `action`. Este action deberá estar implementado en el controlador, ya sea en [execPreviousAction() o execAfterAction()](https://facturascripts.com/publicaciones/controladores-extendidos-367).
	- `js`: al hacer clic ejecutará la función javascript indicada en la propiedad `action`.
	- `link`: al hacer clic se redirecciona a la página indicada en la propiedad `action`.
	- `modal`: al hacer clic mostrará el modal con el name indicado en la propiedad `action`.
- `id`: (opcional) identificador html para poder seleccionarlo desde JavaScript.
- `icon`: (opcional) [icono del botón](https://facturascripts.com/publicaciones/iconos-disponibles-308).
- `label`: texto a mostrar en el botón. Se traducirá automáticamente por FacturaScripts.
- `title`: (opcional) texto del tooltip del botón. Si no se indica, se usa el `label`. También se traduce automáticamente.
- `level`: (opcional) nivel de seguridad aplicable. Por defecto 0. Solamente los usuarios con un nivel de seguridad igual o superior podrán ver este botón.
- `color`: (opcional) indica la configuración de color a utilizar.
- `action`: indica la acción que se envía al controlador, función JavaScript o nombre del modal a mostrar.
- `confirm`: (opcional) si se indica, mostrará al usuario una ventana solicitando confirmación de que desea ejecutar la acción. Solamente aplica a los botones de tipo `action`.
- `target`: (opcional) en los botones de tipo `link`, target del enlace. Por ejemplo `_blank` para abrir en una pestaña nueva.

### 🎨 Colores
- `primary`: azul oscuro
- `info`: azul
- `success`: verde
- `warning`: amarillo
- `danger`: rojo
- `dark`: gris oscuro
- `light`: gris claro
- `secondary`: gris

También puedes usar las variantes con borde `outline-`, por ejemplo `outline-danger` u `outline-primary`.

## Añadir botones desde controladores
También puedes añadir un botón desde tu ListController o EditController. Simplemente usa el método `addButton()` de la pestaña:
```
$this-&gt;tab(&#39;ListProducto&#39;)-&gt;addButton([
	&#39;action&#39; =&gt; &#39;test-action&#39;,
	&#39;icon&#39; =&gt; &#39;fa-solid fa-question&#39;,
	&#39;label&#39; =&gt; &#39;test&#39;
]);
```
Este código añade el botón test a la pestaña ListProducto. Al hacer clic ejecutará la acción test-action del controlador, si la hubiera. Recuerda implementar esta acción en [execPreviousAction() o execAfterAction()](https://facturascripts.com/publicaciones/controladores-extendidos-367).

La forma antigua `$this-&gt;addButton(&#39;ListProducto&#39;, [...])` está obsoleta desde la versión 2026.

Es posible indicar el grupo o row donde se añadirá el botón informando el identificador `row` y como valor el name que identifica al row.
Si no se informa, el botón se añade al row de acciones generales.
```
$this-&gt;tab(&#39;EditEjercicio&#39;)-&gt;addButton([
	&#39;row&#39; =&gt; &#39;footer-actions&#39;,
	&#39;action&#39; =&gt; &#39;import-accounting&#39;,
	&#39;color&#39; =&gt; &#39;warning&#39;,
	&#39;icon&#39; =&gt; &#39;fa-solid fa-file-import&#39;,
	&#39;label&#39; =&gt; &#39;import-accounting-plan&#39;,
	&#39;type&#39; =&gt; &#39;modal&#39;
]);
```
Este código añade el botón importar al row footer con identificador `footer-actions` y mostrará la ventana modal con identificador `import-accounting`.

## 📂 Grupos de botones
Desde la versión 2026 puedes agrupar varios botones en un desplegable. Crea primero el grupo con el método `addButtonGroup()` y añade después los botones con la clave `group`:
```
$this-&gt;tab(&#39;ListFacturaCliente&#39;)-&gt;addButtonGroup([
	&#39;name&#39; =&gt; &#39;doc-actions&#39;,
	&#39;icon&#39; =&gt; &#39;fa-solid fa-circle-check&#39;,
	&#39;label&#39; =&gt; &#39;actions&#39;
]);

$this-&gt;tab(&#39;ListFacturaCliente&#39;)-&gt;addButton([
	&#39;group&#39; =&gt; &#39;doc-actions&#39;,
	&#39;action&#39; =&gt; &#39;approve-document&#39;,
	&#39;icon&#39; =&gt; &#39;fa-solid fa-check&#39;,
	&#39;label&#39; =&gt; &#39;approve-document&#39;
]);
```
Si el grupo no existe todavía, se crea automáticamente al añadir el primer botón que lo referencia.