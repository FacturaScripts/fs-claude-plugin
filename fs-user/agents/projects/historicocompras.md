---
idproject: 623
name: HistoricoCompras
permalink: historicocompras
creationdate: 04-06-2026
lastmod: 15-08-2026
version: 1.3
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/HistoricoCompras
---
Crea un historial de precios de los productos comprados. Registra los cambios de precios de los productos con fecha, descuentos, márgenes, usuario y política de precio. Con este plugin tienes trazabilidad completa del historial de precios directamente en la ficha de cada producto, para cualquier tipo de producto: con o sin proveedor, con o sin variantes por atributos, con cualquier política de precio de coste.

### Qué hace exactamente

Al abrir cualquier producto aparece una nueva pestaña **Historial de precios** con todos los cambios registrados, ordenados del más reciente al más antiguo.

Cada fila muestra: fecha y hora, referencia y descripción de la variante con sus atributos, nombre del proveedor, código del proveedor con enlace a su ficha, origen del cambio, precio bruto, descuento, neto, coste, margen, precio de venta, usuario, divisa y política de coste.

### Cuándo se actualiza el historial

- Al modificar el precio de un proveedor en la pestaña Proveedores de la ficha del producto
- Al añadir o eliminar un proveedor de un producto
- Al editar el precio, coste o margen directamente en la variante
- Al recibir un albarán o factura de proveedor con &quot;Actualizar precios de proveedor&quot; activo

### Copia de producto

Al copiar un producto el historial del nuevo producto empieza vacío — el precio heredado de la copia no tiene relevancia histórica. El historial empieza cuando el usuario asigna o modifica el precio real del nuevo producto.

### Compatible con todas las políticas de precio de coste

Captura el coste exacto que el core calcula: último precio, precio medio, precio más alto o precio actual de stock.

### Soporte para variantes con atributos

Cada variante tiene su propio historial independiente con la descripción completa incluyendo todos sus atributos.

### Panel de administración

Desde **Administración → Panel de Control → HistoricoCompras** hay un botón para importar o reimportar el historial desde cero.

### Traducciones

25 idiomas: español y 11 variantes latinoamericanas, catalán, valenciano, gallego, euskera, inglés, alemán, francés, italiano, portugués (Portugal y Brasil), polaco, checo y turco.