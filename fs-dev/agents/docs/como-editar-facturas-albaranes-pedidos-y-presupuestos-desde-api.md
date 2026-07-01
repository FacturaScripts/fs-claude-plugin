---
id: 3038
permalink: como-editar-facturas-albaranes-pedidos-y-presupuestos-desde-api
title: Cómo editar facturas, albaranes, pedidos y presupuestos desde API
creationdate: 18-06-2026 13:04:10
lastmod: 18-06-2026
url: https://facturascripts.com/publicaciones/como-editar-facturas-albaranes-pedidos-y-presupuestos-desde-api
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
	- lineas: ```[{"referencia": "producto1", "cantidad": 2}, {"descripcion": "Mano de obra", "cantidad": 1, "pvpunitario": 5.43}]```
	- pagada: 1