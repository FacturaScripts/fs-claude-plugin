---
idproject: 603
name: BuscadorAcumulado
permalink: buscadoracumulado
creationdate: 15-05-2026
lastmod: 28-08-2026
version: 2.68
betaversion: 2.63
mincore: 2025
maxcore: 2026.65
compatible: Comentarioprivado,Prepagos
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/BuscadorAcumulado
---
Añade un modo de búsqueda acumulativa a cualquier listado de FacturaScripts. Cuando está activo, cada búsqueda se suma a la anterior en lugar de reemplazarla, permitiendo acotar resultados de forma progresiva sin perder el contexto, y además sincronizable entre vistas (pestañas relacionadas) y con operadores lógicos.

Muy útil para hacer búsquedas en las vistas principales y también en sus listados asociados. Por ejemplo Facturas y sus líneas de Productos: Esto nos permite buscar por ejemplo entre varios clientes que nos han comprado un rodamiento, entre fecha tal, estado tal, y que no sea el 6005 por ejemplo. Hacemos las búsqueda en cada vista que sea necesario, Clientes en la vista principal y el resto de la búsqueda en líneas, cada vez que pulsamos Enter el sistema va acotando y reduciendo la búsqueda de forma acumulada hasta llegar al resultado final. Pudiendo además buscar por campo Todos ó por uno específico: por ejemplo el campo Comentario Privado o Descripción. 

Cada vez que se van acotando los resultados, se muestran solo las líneas acordes al contexto en cada pestaña y se indica en las pestañas el número de documentos o líneas encontradas así como dentro de la vista en el texto de información los encontrados del total, por ejemplo: 12 documentos de 45 ó 140 líneas de 1500...etc

Funciona en todos los listados del sistema (facturas, albaranes, pedidos, clientes, proveedores, artículos, etc.) sin necesidad de configuración, además de mostrar el número de documentos de la vista principal acorde a la busqueda también actualiza el número de líneas de sus pestañas relacionadas. Por ejemplo Vista Facturas y sus otras pestañas Líneas y Recibos.

**Búsqueda acumulativa:**
- Pulsa el botón de capas (🗂) junto al buscador para activar el modo. El botón se pone en amarillo cuando está activo.
- Escribe tu primera búsqueda y pulsa Enter.
- Escribe una segunda búsqueda. Los resultados mostrarán solo los registros que contengan ambos términos.
- Debajo del buscador aparece un badge con todos los términos acumulados y sus operadores.
- Pulsa el botón de limpiar (🗂✕) para borrar la acumulación y volver al listado completo.

**Operadores lógicos:**
- **AND** (por defecto) — el resultado debe contener ambos términos. Reduce el conjunto.
- **OR** — el resultado puede contener cualquiera de los términos. Amplía el conjunto buscando sobre el total de registros.
- **NOT** — el resultado no debe contener este término. Excluye registros.

Selecciona el operador desde el desplegable junto al buscador antes de escribir el siguiente término.

**Agrupación con paréntesis:**
- Usa los botones `(` y `)` para agrupar términos explícitamente.
- Sin paréntesis, la lógica es automática: AND y NOT se acumulan en el grupo actual, OR abre un nuevo grupo.
- Permite construir expresiones complejas: `(&quot;fábrica&quot; AND &quot;norte&quot;) OR (&quot;taller&quot; AND &quot;6005&quot;)`.

**NOT global:**
- Un NOT colocado después de cerrar un grupo `)` excluye el término de todos los grupos simultáneamente.
- `(&quot;azul&quot;) OR (&quot;verde&quot;) NOT &quot;rojo&quot;` excluye rojo de ambos grupos a la vez.

**Sincronización de vistas relacionadas:**
- En listados con pestañas relacionadas, las vistas se sincronizan automáticamente al buscar en la vista principal.
- Filtras la vista principal → las vistas relacionadas muestran automáticamente solo los registros de los resultados filtrados.
- Las vistas relacionadas muestran un badge con el contador de registros (&quot;Recibos: 12 de 180&quot;, &quot;Variantes: 5 de 43&quot;...).

**Selector de campo:**
- Con el modo activo, aparece una fila de casillas con los campos buscables del listado.
- Por defecto está marcado **Todos** — busca en todos los campos como siempre.
- Marca una casilla para limitar la siguiente búsqueda a ese campo. La casilla activa aparece en negrita, por ejemplo Cliente
- El campo seleccionado persiste hasta que lo cambies, permitiendo acumular términos en el mismo campo o combinar campos distintos: `[Cliente] &quot;norte&quot; AND [Observaciones] &quot;urgente&quot;`.
- Sin modo activo las casillas no aparecen — no afectan al funcionamiento normal del buscador.

**Compatible con el plugin Comentarioprivado:**
- Si tienes instalado el plugin Comentarioprivado, el campo &quot;Comentario privado&quot; aparece como columna buscable en los listados de albaranes, facturas, pedidos y presupuestos de venta.
- BuscadorAcumulado lo detecta automáticamente e incluye ese campo en todas las búsquedas acumuladas — sin ninguna configuración adicional.
- Permite buscar y cruzar anotaciones internas con cualquier otro campo del documento usando AND, OR y NOT.
Por ejemplo: buscar en comentarioprivado el texto: &quot;pasar a cobrar&quot;, ó &quot;faltan artículos&quot; junto con otras búsquedas acumuladas...

**Coordinación con los botones del core:**
- &quot;Todos&quot; y cargar un filtro guardado limpian también la acumulación.
- &quot;Limpiar filtros&quot; y la papelera solo limpian los filtros del panel — el stack acumulado se mantiene.

** Desde la v2.1. Compatible con búsquedas mediante filtros de panel y/o botones de búsquedas guardadas.

** Desde la v2.5. Posibilidad de hacer búsquedas de campos vacíos o que estén llenos.

** Desde la v.2.63 uso de campos Joinmodels.

**Combina Potencia con Simplicidad al hacer las búsquedas acumuladas**

**Ir a la documentación para ver como funciona en profundidad el plugin.**