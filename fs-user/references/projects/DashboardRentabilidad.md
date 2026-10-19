---
idproject: 794
name: DashboardRentabilidad
permalink: dashboardrentabilidad
creationdate: 18-09-2026
lastmod: 07-10-2026
version: 8.2
betaversion: 0
mincore: 2025
maxcore: 2026.7
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/DashboardRentabilidad
---
Convierte las cuentas de tu contabilidad en un cuadro de mando de rentabilidad claro y visual, sin depender de hojas de cálculo externas. Organiza tus gastos e ingresos en bloques y subbloques, asigna cuentas o subcuentas contables y obtén un informe mensual de gasto, ingreso, beneficio y % de beneficio por cada bloque y un total general del ejercicio.

📼 [Como configurarlo](https://youtu.be/2izwUTPzptM)  
📼 [Cómo funciona](https://youtu.be/_RZ2zMpnA20)

Características
- Jerarquía configurable: Cuadro de mando → Bloque → Subbloque → Cuenta. Puedes tener tantos cuadros de mando independientes como necesites.
- Cada cuenta admite una subcuenta concreta o una cuenta contable completa (por ejemplo la 62), que expande automáticamente todas sus subcuentas.
- Porcentaje de reparto fijo por cuenta, o porcentaje mensual distinto para cada mes del ejercicio.
- Subbloques manuales para conceptos que no vienen de contabilidad (ajustes, estimaciones), rellenando el valor de cada mes a mano.
- Comentarios de texto libre por subbloque y mes, editables desde el propio informe.
- Informe con filtro de meses, columna TOTAL, gráfica de evolución mensual y exportación a Excel (.xlsx) con importes numéricos y colores.
- Importación/exportación de la configuración completa de un cuadro de mando en JSON, para reutilizarla en otras instalaciones.

Ejemplos de uso

Una asesoría quiere saber, mes a mes, cuánto gana con cada línea de negocio. 
Crea un cuadro de mando con un bloque por línea («Asesoría fiscal», «Laboral», «Contabilidad») y, dentro de cada bloque, subbloques para ingresos y gastos directos. 
Asigna las cuentas 705 y 623 al bloque de asesoría fiscal, y las 629 al de gastos generales con un 30 % de reparto entre los tres bloques. 
En segundos obtiene el beneficio y el margen de cada línea, con una gráfica para la reunión mensual y un Excel para el comparativo anual.

Una empresa de distribución vende tres familias de producto y quiere saber cuál es rentable cada mes. 
Da de alta un cuadro de mando con un bloque por familia («Calzado», «Textil», «Accesorios») y, dentro de cada bloque, subbloques de ventas y coste directo. 
Como cada familia tiene sus propias subcuentas de venta (700000, 700010, 700020) y de compra (600000, 600010, 600020), las asigna a su bloque; los gastos generales (629) los reparte entre las tres líneas con porcentajes (45 %, 35 %, 20 %). 
En el informe ve el margen de cada familia mes a mes, con totales por línea y un total general, y decide con la gráfica y el Excel dónde subir precio o reforzar stock.