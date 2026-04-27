---
idproject: 217
name: IeBeneficios
permalink: iebeneficios
creationdate: 07-05-2022
lastmod: 26-03-2026
version: 3.4
betaversion: 2.7
mincore: 2025.3
maxcore: 2026
compatible: 
min_php: 
require: TarifasAvanzadas
require_php: 
url: https://facturascripts.com/plugins/IeBeneficios
---

Añade el cálculo de costes y beneficios por documento de venta y compra. Éstos datos sólo serán visibles si se activa la opción &quot;Acceso a beneficios de documentos&quot; en la ficha del **usuario**

Se han añadido 2 campos en las líneas de documentos de venta:
-**Coste** que recupera el coste de la variante, aunque puede ser editado manualmente
-**Beneficio** el subtotal del beneficio de la línea (en euros y en porcentaje de beneficios **sobre venta**)
Y otros 3 nuevos campos en el pie:
- **Coste** con el total de los costes del documento
- **Beneficio** calculado sobre el neto (neto - costes)
- **% margen** porcentaje de margen de beneficio del documento **sobre ventas**

En documentos de compra, se añaden 2 campos a las líneas:
-**Pvp** que recupera el pvp de la variante, aunque puede ser editado manualmente
-**Beneficio** el subtotal del beneficio de la línea (en euros y en porcentaje de beneficios **sobre venta**)
Y otros 3 nuevos campos en el pie:
- **Pvp documento** con el total de los precios de venta del documento
- **Beneficio** calculado sobre el neto (neto - costes)
- **% margen** porcentaje de margen de beneficio del documento **sobre ventas**

Si transformamos el documento, los datos se &quot;arrastran&quot; al nuevo. Por ejemplo, de presupuesto a pedido.
**Listados**
Los datos se muestran en los listados de presupuestos, pedidos, albaranes y facturas de venta. El campo beneficio es visible y el de coste está oculto. Para habilitarlo: Opciones-&gt;[Tipo documento]-&gt;Habilitar Coste

Permite actualización de precios de venta de forma automática con los valores introducidos en los documentos de compra. Configurable desde Administrador-&gt;Panel de Control-&gt;Política de actualización de precios

Requiere: https://facturascripts.com/plugins/tarifasavanzadas
