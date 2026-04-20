---
id: 968
permalink: como-crear-facturas-desde-api
title: Cómo crear facturas, albaranes, pedidos y presupuestos desde API
creationdate: 05-08-2021 13:44:13
lastmod: 11-10-2025
url: https://facturascripts.com/como-crear-facturas-desde-api
---
Podemos crear facturas de venta con una sola petición **POST** a la API al endpoint ``crearFacturaCliente``. Una forma sencilla de comprobar si tu API lo permite es [consultar la lista de recursos](https://facturascripts.com/publicaciones/listado-de-recursos-modelos-102). Si aparece crearFacturaCliente, entonces puedes usarlo.

![consultar lista de recursos de la api](https://facturascripts.com/MyFiles/2024/03/2031.png?myft=73bf2b0e7d86dbea6243fa144c5ff2bc3e6b8aa2)

## Crear factura de cliente
Haremos una petición **POST** al endpoint ``crearFacturaCliente`` y le pasaremos obligatoriamente los campos ``codcliente`` y ``lineas``. Adicionalmente le podemos pasar cualquier otro campo de la factura, como ``fecha``, ``hora``, ``codpago``, ``codserie``, ``direccion``, ``ciudad``, ``provincia`` ...

En este caso ``lineas`` debe ser un **json** con las líneas de las facturas, que deberán tener los campos ``referencia`` o ``descripcion``, y opcionalmente el resto de campos que puede tener una línea: ``cantidad``, ``pvpunitario``, ``dtopor``, ``dtopor2``, ``codimpuesto``, ``irpf`` ...

![creación factura venta mediante api fs](https://facturascripts.com/MyFiles/2024/03/2032.png?myft=06b8d34f98439a7120410e02b4b9ac2cceeca1d0)

Datos del ejemplo:
- Petición: POST
- URL: http://localhost:8083/api/3/crearFacturaCliente
- Cabeceras:
	- Token: XXXXXX
- Valores del formulario:
	- codcliente: 1
	- lineas: ```[{&quot;referencia&quot;: &quot;producto1&quot;, &quot;cantidad&quot;: 2}, {&quot;descripcion&quot;: &quot;Mano de obra&quot;, &quot;cantidad&quot;: 1, &quot;pvpunitario&quot;: 5.43}]```
	- pagada: 1

### Cómo pasar los valores
Aunque la API responde siempre con JSON, para enviar los datos debemos hacerlo como lo haríamos a un formulario, es decir, mediante **form URL encoded**:

![enviar datos api](https://i.imgur.com/3gP30u7.png)

### Crear factura de proveedor
Para crear facturas de compra simplemente hay que usar el endpoint `crearFacturaProveedor` y proporcionar un `codproveedor` en lugar del codcliente.

## Crear albaranes
Hay que hacer una peticion **POST** al endpoint ``crearAlbaranCliente`` o ``crearAlbaranProveedor`` y le pasaremos obligatoriamente los campos  ``codcliente`` o ``codproveedor`` y ``lineas``. Adicionalmente le podemos pasar cualquier otro campo de la factura, como ``cifnif``, ``fecha``, ``hora``, ``codpago``, ``codserie``, ``direccion``, ``ciudad``, ``provincia`` ...

ejemplo:

- Petición: POST
- URL: http://localhost:8000/api/3/crearAlbaranCliente
- Cabeceras:
	- Token: XXXXXX
- Valores del formulario:
	- codcliente: 5
	- lineas: ```[{&quot;referencia&quot;: &quot;producto1&quot;, &quot;cantidad&quot;: 2}, {&quot;descripcion&quot;: &quot;Mano de obra&quot;, &quot;cantidad&quot;: 1, &quot;pvpunitario&quot;: 5.43}]```

![crear albaran](https://i.imgur.com/L04Vc8m.png)

## Crear pedidos
Para crear pedidos hay que hacer una peticion **POST** al endpoint ``crearPedidoCliente`` o ``crearPedidoProveedor``. Será necesario pasarle obligatoriamente los campos ``codcliente`` o ``codproveedor`` y ``lineas`` a traves de un formulario, ademas se pueden añadir otros campos al pedido como ``hora``, ``codpago``, ``codserie``, ``direccion``, ``ciudad``, ``provincia`` ...

ejemplo:

- Petición: POST
- URL: http://localhost:8000/api/3/crearPedidoCliente
- Cabeceras:
	- Token: XXXXXX
- Valores del formulario:
	- codcliente: 5
	- lineas: ```[{&quot;referencia&quot;: &quot;producto1&quot;, &quot;cantidad&quot;: 2}, {&quot;descripcion&quot;: &quot;Mano de obra&quot;, &quot;cantidad&quot;: 1, &quot;pvpunitario&quot;: 5.43}]```

![crear pedido](https://i.imgur.com/Cd09xv5.png)

## Crear presupuestos
Si queremos crear un presupuesto usando la API de facturascripts tenemos que hacer una peticion **POST** al endpoinnt ``crearPresupuestoCliente `` o ``crearPresupuestoProveedor``. Se le pasará obligatoriamente los campos ``codcliente`` o ``codproveedor`` y ``lineas``, ademas se pueden añadir otros campos a los presupuestos como ``hora``, ``codpago``, ``codserie``, ``direccion``, ``ciudad``, ``provincia`` ...

ejemplo:

- Petición: POST
- URL: http://localhost:8000/api/3/crearPresupuestoCliente
- Cabeceras:
	- Token: XXXXXX
- Valores del formulario:
	- codcliente: 5
	- lineas: ```[{&quot;referencia&quot;: &quot;producto1&quot;, &quot;cantidad&quot;: 2}, {&quot;descripcion&quot;: &quot;Mano de obra&quot;, &quot;cantidad&quot;: 1, &quot;pvpunitario&quot;: 5.43}]```

![crear presupuesto](https://i.imgur.com/1j7IeXs.png)
