---
idproject: 773
name: MargenPorTarifa
permalink: margenportarifa
creationdate: 24-08-2026
lastmod: 30-09-2026
version: 1.12
betaversion: 0
mincore: 2026.1
maxcore: 2026.7
compatible: 
min_php: 8.1
require: TarifasAvanzadas
require_php: 
url: https://facturascripts.com/plugins/MargenPorTarifa
---
MargenPorTarifa amplía TarifasAvanzadas con tres funciones pensadas para trabajar por margen, no por precio fijo:

1. **Margen manual (%) por tarifa.** En la pestaña *Precios* de cada producto, la tabla de tarifas de cada variante incorpora una columna **% Margen**. El precio de la tarifa (base imponible) se calcula como `coste × (1 + margen/100)` y el IVA se aplica encima, igual que hace el core con el precio base. El margen queda guardado y el cálculo es vivo: si cambia el coste, la tarifa se recalcula sola, también en presupuestos, pedidos y facturas.
2. **Selector de tarifa en Cambios globales.** Aplica un margen (o un precio) a una tarifa concreta en todas las variantes del producto a la vez, en lugar de afectar solo a la tarifa base del core.
3. **Redondeo de precios a fracciones** (nuevo en la 1.12). Los precios calculados por margen o por fórmula se redondean a múltiplos (0,05 · 0,10 · 0,20 · 0,25 · 0,50 · 1 · 5 · 10 o el valor que quieras) o a terminaciones (,99 · ,95 · ,90 · ,50), hacia arriba, hacia abajo o al más cercano, y sobre el precio con IVA o sin IVA. Se configura en cada tarifa y, para el precio base, en el Panel de control. Nunca vende por debajo del coste ni por encima del PVP por culpa del redondeo, y los precios fijos no se tocan.

**Requisitos:** TarifasAvanzadas instalado y activo · FacturaScripts 2026.1 o superior · PHP 8.1 o superior.

**Licencia:** plugin gratuito. Puedes descargarlo y usarlo sin coste en tus instalaciones de FacturaScripts. Software propietario sujeto al EULA incluido en el plugin: no se permite su redistribución.

MargenPorTarifa es un complemento independiente y no es un producto oficial de TarifasAvanzadas.