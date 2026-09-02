---
id: 779
permalink: series-470
title: Las series de facturación
creationdate: 08-01-2019 00:00:00
lastmod: 13-08-2026
url: https://facturascripts.com/publicaciones/series-470
---
Las series son una forma de separar la facturación, ya sea por tipo de actividad o por cualquier otro motivo. Toda factura debe pertenecer a una serie. Puedes configurarlas desde el menú Contabilidad → Series.

Para crear una serie nueva, haz clic en el botón `Nuevo` y rellena los campos que se solicitan:

- `Código`: un código para la serie.
- `Descripción`: una descripción identificativa para la serie.
- `Tipo`: indica si la serie es de tipo rectificativa o simplificada.
- `Sin impuesto`: indica si a esta serie se le aplican o no impuestos.

Cuando pulses el botón `Guardar`, ya tendrás creada tu nueva serie para usarla más adelante.

![Formulario de una serie de facturación](https://i.imgur.com/3frb2d8.png)

## ⭐ Series predeterminadas
FacturaScripts crea una serie general, una serie simplificada (*para las facturas simplificadas*) y una serie rectificativa (*donde deben ir obligatoriamente las facturas rectificativas*). Puedes seleccionar la serie predeterminada (*la que se asigna a las nuevas facturas*) desde el menú Administrador → Panel de control, en el campo `Serie`: elige la que quieras y pulsa el botón `Guardar`.

![Selección de la serie predeterminada](https://i.imgur.com/zLmwmEi.png)

### 👤 Serie predeterminada por usuario
A nivel de usuario también puedes asignar una serie predeterminada, de forma que cuando ese usuario crea una factura se selecciona automáticamente esa serie.

![Serie predeterminada de un usuario](https://i.imgur.com/0ZDOEy3.png)

### 🤝 Series para clientes y proveedores
También puedes asignar una serie predeterminada a un cliente o proveedor desde su propia ficha, en el campo `Serie` del apartado de términos comerciales. Así, las facturas que le hagas tendrán asignada esa serie.

![Serie predeterminada en la ficha de un cliente](https://i.imgur.com/x3iPGj4.gif)

### 📊 Prioridad
La serie del cliente/proveedor tiene prioridad sobre la del usuario, y la del usuario sobre la del panel de control.

## 🔢 Numeración de facturas, albaranes y otros documentos
La numeración de facturas, albaranes, pedidos, presupuestos y demás documentos que sigan el estándar de FacturaScripts se configura desde las [secuencias de documentos](https://facturascripts.com/publicaciones/secuencias-de-documentos-184).

## 🖨️ Formato de impresión por serie
También puedes hacer que cada serie tenga un [formato de impresión](https://facturascripts.com/publicaciones/los-formatos-de-impresion-de-facturascripts) específico.