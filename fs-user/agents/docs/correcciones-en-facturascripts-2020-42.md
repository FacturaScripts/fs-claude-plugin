---
id: 125
permalink: correcciones-en-facturascripts-2020-42
title: Correcciones en FacturaScripts 2020.42
creationdate: 07-04-2020 13:31:24
lastmod: 25-04-2020
url: https://facturascripts.com/publicaciones/correcciones-en-facturascripts-2020-42
---

Esta actualización contiene principalmente **correcciones de errores** encontrados a lo largo del último mes:
- Error al mostrar el **porcentaje de IRPF** al hacer el desglose de impuestos.
- Error al aplicar extensiones de archivos XMLView con etiquetas row.
- Error el ejecutar la extensión deleteBefore() en modelos.
- Error al comprobar algunos campos de MySQL, lo que hacía que aplicase cambios innecesarios.
- Solucionado **descuadre de un céntimo** que ocurría ocasionalmente con lasgunas facturas grandes con múltiples impuestos.
- Ahora el asistente inicial no instala el plan contable predeterminado si la instalación contiene datos de 2017.
- Solucionado bug al crear subcuentas con el punto cuando al final del punto hay más de un dígito.

## Mejoras generales
- Ahora se usa el concepto &quot;cobro del recibo...&quot; para los pagos de recibos de clientes, y &quot;pago del recibo...&quot; para los pagos de recibos de proveedores.
- Podemos ver el **número de mandato** en las **cuentas bancarias** de clientes.
- Al agrupar documentos ahora se añaden líneas adicionales indicando los documentos de donde vienen.

## Mejoras para desarrolladores
- Ya podemos [desactivar los checkboxes en los ListView](https://facturascripts.com/doc/1/desarrollo-sobre-facturascripts-2018/creacion-de-plugins/los-controladores/personalizando-con-settings) que queramos.
- Ahora podemos añadir mediante extensiones columnas a la primera pestaña de los documentos de compra o de venta, gracias al nuevo row type=&quot;business&quot;.
