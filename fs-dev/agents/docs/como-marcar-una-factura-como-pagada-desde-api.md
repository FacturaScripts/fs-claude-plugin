---
id: 2283
permalink: como-marcar-una-factura-como-pagada-desde-api
title: Cómo marcar una factura como pagada desde API
creationdate: 09-10-2025 16:05:38
lastmod: 09-10-2025
url: https://facturascripts.com/como-marcar-una-factura-como-pagada-desde-api
---
Para marcar una factura como pagada desde API debemos usar los endpoints:

- `pagarFacturaCliente`
- `pagarFacturaProveedor`

Y enviar la fecha de pago, el codigo de la forma de pago y el campo pagada:

- `fechapago`: fecha del pago
- `codpago`: código de la forma de pago
- `pagada`: bool (0/1)

## Ejemplo
Para marcar como pagada la factura de cliente con id 1234, haríamos una petición **POST** a `htts://donde-este-fs-instalado/api/3/pagarFacturaCliente/1234` con los siguientes campos:

- `fechapago`: 2025-10-10
- `codpago`: TRANSF
- `pagada`: 1
