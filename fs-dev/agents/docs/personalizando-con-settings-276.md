---
id: 689
permalink: personalizando-con-settings-276
title: Personalizando con Settings
creationdate: 01-06-2018 00:00:00
lastmod: 01-04-2026
url: https://facturascripts.com/personalizando-con-settings-276
---
Las pestañas de los **controladores extendidos** disponen de la propiedad Settings, que es accesible mediante los métodos **getSettings** y **setSettings** que nos permiten leer y añadir/modificar la configuración de la pestaña, como por ejemplo los botones de nuevo, eliminar, imprimir, etc.

## 🚫 Desactivar/ocultar la pestaña
```
$this-&gt;tab(&#39;MyView&#39;)-&gt;setSettings(&#39;active&#39;, false);
```

## 🖱️ Desactivar/ocultar el botón nuevo
```
$this-&gt;tab(&#39;MyView&#39;)-&gt;setSettings(&#39;btnNew&#39;, false);
```

## 💾 Desactivar/ocultar el botón guardar
```
$this-&gt;tab(&#39;MyView&#39;)-&gt;setSettings(&#39;btnSave&#39;, false);
```

## ❌ Desactivar/ocultar el botón deshacer
```
$this-&gt;tab(&#39;MyView&#39;)-&gt;setSettings(&#39;btnUndo&#39;, false);
```

## 🗑️ Desactivar/ocultar el botón eliminar
```
$this-&gt;tab(&#39;MyView&#39;)-&gt;setSettings(&#39;btnDelete&#39;, false);
```

## 🖨️ Desactivar/ocultar el botón imprimir
```
$this-&gt;tab(&#39;MyView&#39;)-&gt;setSettings(&#39;btnPrint&#39;, false);
```

## 📝 Cambiar el número de elementos
Por defecto todos los listados usan el número de elementos por lista configurado en el panel de control, pero podemos establecer un número de elementos distinto para una pestaña modificando su propiedad `itemLimit`:

```
$this-&gt;tab(&#39;MyView&#39;)-&gt;setSettings(&#39;itemLimit&#39;, 500);
```

## Opciones exclusivas de ListView
### ☑️ Desactivar/ocultar los checkboxes
Las vistas ListView muestran una columna de checkboxes en la parte izquierda para poder seleccionar y eliminar o realizar otras acciones. Si deseamos desactivarlo, podemos poner checkBoxes a false:
```
$this-&gt;tab(&#39;MyView&#39;)-&gt;setSettings(&#39;checkBoxes&#39;, false);
```

### 🖲️ Desactivar/ocultar el click sobre los elementos de la lista
Al hacer clic sobre un elemento de la lista nos redirecciona a dicho elemento. Si deseamos desactivarlo, podemos poner clickable a false:
```
$this-&gt;tab(&#39;MyView&#39;)-&gt;setSettings(&#39;clickable&#39;, false);
```

### 🔍 Desactivar/ocultar la búsqueda en el megabuscador
El megabuscador de FacturaScripts realiza búsquedas en todas las pestañas de todos los controladores que comienzan por List. Si desea desactivar la búsqueda en alguna de las pestañas, indíquelo de esta forma:
```
$this-&gt;tab(&#39;MyView&#39;)-&gt;setSettings(&#39;megasearch&#39;, false);
```
