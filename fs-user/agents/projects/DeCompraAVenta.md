---
idproject: 586
name: DeCompraAVenta
permalink: decompraaventa
creationdate: 30-04-2026
lastmod: 30-04-2026
version: 1
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/DeCompraAVenta
---
# DeCompraAVenta

Plugin para FacturaScripts que permite crear documentos de venta desde documentos de compra.

## Qué hace

Añade un botón **Crear documento de venta** en los edit views de:

- Presupuesto de proveedor
- Pedido de proveedor
- Albarán de proveedor
- Factura de proveedor

El botón abre el controlador `DeCompraAVenta`, donde el usuario selecciona:

- Cliente destino
- Tipo de documento de venta a generar: presupuesto, pedido, albarán o factura

Al generar, el plugin crea un documento de venta nuevo. No transforma ni clona el documento de compra. Solo usa las líneas del documento origen para crear nuevas líneas en el documento de venta.

## Manual de usuario

1. Abre un documento de compra compatible.
2. Pulsa **Crear documento de venta**.
3. Selecciona el cliente.
4. Selecciona el documento de venta a crear.
5. Pulsa **Generar**.
6. FacturaScripts redirige automáticamente al documento de venta creado.