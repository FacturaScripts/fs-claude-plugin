---
id: 672
permalink: controladores-extendidos-367
title: Controladores Extendidos de FacturaScripts
creationdate: 05-07-2018 00:00:00
lastmod: 12-05-2025
url: https://facturascripts.com/controladores-extendidos-367
---
Para facilitar el desarrollo en FacturaScripts, se han creado controladores específicos: **ListController** para listados y **EditController** y **PanelController** para la edición de registros. Se recomienda utilizar estos controladores siempre que sea posible, ya que reducen el tiempo de desarrollo y garantizan una integración más fluida con el resto de FacturaScripts. Además, cualquier mejora futura que se implemente estará disponible automáticamente en su desarrollo.

![Ejemplo de ListController](https://i.imgur.com/ypHJTSg.png)

## Primero listar, después editar
La filosofía de diseño de interfaces de usuario de FacturaScripts consiste en:
- **Visualizar primero un listado de registros** para buscar o filtrar (implementado con **ListController**).
- **Editar un registro** al hacer clic sobre él o pulsar el botón nuevo (realizado por **EditController** o **PanelController**).

![Ejemplo de EditController](https://i.imgur.com/CJqxDlx.png)

## Conceptos Generales
La ejecución del controlador sigue estos pasos:
1. Recepción de los parámetros enviados por la vista, normalmente mediante POST.
2. Ejecución de las tareas previas a la carga de datos (método **execPreviousAction**).
3. Carga de los datos de los modelos (método **loadData**).
4. Ejecución de las tareas posteriores a la carga de datos (método **execAfterAction**).

![Ciclo de Vida del Controlador](https://facturascripts.com/MyFiles/2025/04/2757.png?myft=6b5994dc7ef9dcaa3acb143f8fb8e6779bdb9824)

Este método de trabajo simplifica la comprensión y el seguimiento del código del controlador. Aunque no todos los controladores se ajustan a este patrón, se recomienda mantenerlo para facilitar futuros mantenimientos.

### execPreviousAction()
Este método se ejecuta justo antes de la carga de datos y puede interrumpir la ejecución del controlador devolviendo `false`. Es ideal para tareas especiales solicitadas desde la vista mediante AJAX o por los **botones de acción** en la vista. Algunas de las tareas que actualmente se gestionan son: *autocomplete*, *save* y *delete*.

**Ejemplo: Adición de nuevas acciones**
```php
protected function execPreviousAction($action)
{
   if ($action === &#39;hello&#39;) {
      // Si el controlador recibe action=hello, ejecutamos esta función
      Tools::log()-&gt;notice(&#39;hello&#39;);
      return true; // Continuamos con la carga normal
   } elseif ($action === &#39;hello-json&#39;) {
      // Devolvemos un JSON
      $this-&gt;request-&gt;setContent(json_encode([&#39;message&#39; =&gt; &#39;hello&#39;]));
      return false; // No continuamos con la carga de datos
   }
   return parent::execPreviousAction($action);
}
```

### execAfterAction()
Este método se ejecuta después de la carga de datos y antes de que se visualicen al usuario. Como los datos de los modelos ya han sido leídos, cualquier cambio que se realice sobre ellos no se reflejará en la vista. Algunas de las tareas que actualmente se gestionan son: *insert* (permite establecer valores por defecto al crear un nuevo registro), *export*, *megasearch*.

```php
protected function execAfterAction($action)
{
   if ($action === &#39;bye&#39;) {
      Tools::log()-&gt;notice(&#39;bye&#39;);
      return;
   }
   parent::execAfterAction($action);
}
```
