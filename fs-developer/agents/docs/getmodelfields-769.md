---
id: 634
permalink: getmodelfields-769
title: Método getModelFields() del modelo
creationdate: 30-04-2018 00:00:00
lastmod: 29-12-2025
url: https://facturascripts.com/getmodelfields-769
---
El método `getModelFields()` del modelo es una herramienta fundamental en FacturaScripts. **Devuelve un array que contiene las columnas de la tabla junto con sus respectivas propiedades**, lo que resulta especialmente útil cuando no conocemos todos los nombres de columnas del modelo.

## Ejemplo de Uso

A continuación se presenta un ejemplo básico de cómo utilizar `getModelFields()`:

```php
$familia = new Familia();
$fields = $familia-&gt;getModelFields();
```

## Valores Devueltos

El método devuelve un array con información detallada sobre cada columna, incluyendo el tipo de dato, si es clave, el valor por defecto, entre otros. A continuación se muestra una representación de ejemplo de lo que se devuelve:

```php
array (size=3)
  &#39;descripcion&#39; =&gt; 
    array (size=6)
      &#39;type&#39; =&gt; string &#39;varchar(100)&#39; (length=12)
      &#39;key&#39; =&gt; string &#39;&#39; (length=0)
      &#39;default&#39; =&gt; null
      &#39;extra&#39; =&gt; string &#39;&#39; (length=0)
      &#39;is_nullable&#39; =&gt; string &#39;NO&#39; (length=2)
      &#39;name&#39; =&gt; string &#39;descripcion&#39; (length=11)
  &#39;codfamilia&#39; =&gt; 
    array (size=6)
      &#39;type&#39; =&gt; string &#39;varchar(8)&#39; (length=10)
      &#39;key&#39; =&gt; string &#39;PRI&#39; (length=3)
      &#39;default&#39; =&gt; null
      &#39;extra&#39; =&gt; string &#39;&#39; (length=0)
      &#39;is_nullable&#39; =&gt; string &#39;NO&#39; (length=2)
      &#39;name&#39; =&gt; string &#39;codfamilia&#39; (length=10)
  &#39;madre&#39; =&gt; 
    array (size=6)
      &#39;type&#39; =&gt; string &#39;varchar(8)&#39; (length=10)
      &#39;key&#39; =&gt; string &#39;MUL&#39; (length=3)
      &#39;default&#39; =&gt; null
      &#39;extra&#39; =&gt; string &#39;&#39; (length=0)
      &#39;is_nullable&#39; =&gt; string &#39;YES&#39; (length=3)
      &#39;name&#39; =&gt; string &#39;madre&#39; (length=5)
```

## Nota Adicional
Este método es parte del núcleo de FacturaScripts, ofreciendo una vista detallada y programáticamente accesible de la estructura de las tablas del modelo.
