---
id: 1592
permalink: como-asignar-una-subcuenta-a-un-cliente
title: Cómo asignar una subcuenta a un cliente en FacturaScripts
creationdate: 25-10-2023 19:32:45
lastmod: 10-03-2026
url: https://facturascripts.com/como-asignar-una-subcuenta-a-un-cliente
---
FacturaScripts genera automáticamente un código o número para cada cliente y, al crear la primera factura, se generará una subcuenta para ese cliente. Sin embargo, también es posible asignar manualmente un **código de cliente** y una **subcuenta**. Para ello, es necesario activar estos campos en el registro del cliente mediante el botón de opciones.

![Opciones del formulario de cliente](https://i.imgur.com/1MYIoUc.png)

Al hacer clic en la opción de cliente en el **botón de opciones**, podrás editar qué campos se visualizan en el formulario, así como otras configuraciones adicionales.

## 👨‍💼 Editar el Código de Cliente
Para activar el campo de **código de cliente**, localiza el campo correspondiente y selecciona &quot;Alinear a la izquierda&quot; en la columna de **visualización**.

![Mostrar código de cliente](https://i.imgur.com/1L9ghJH.png)

Una vez activado, podrás asignar, modificar o cambiar el código para los clientes.

![Codigo de cliente](https://i.imgur.com/zsS6Vh6.png)

## 📓 Editar la Subcuenta del Cliente
Para editar la subcuenta del cliente, es necesario activar el campo de subcuenta. Localízalo y selecciona &quot;Alinear a la izquierda&quot; en la columna de visualización.

![Mostrar subcuenta de cliente](https://i.imgur.com/SoLpVdN.png)

![Subcuenta de cliente](https://i.imgur.com/GEpd8lE.png)

### 📚 Cómo se Generan las Subcuentas
FacturaScripts generará la subcuenta del cliente únicamente al crear facturas, no antes. Si el cliente ya tiene un número de subcuenta asignado, verificará si esta existe, y si no, la creará (si es posible). Si no hay un número de subcuenta asignado, se asignará un nuevo número automáticamente. ¿Cómo? Buscará la cuenta de cliente (en el caso de España, la 430) y creará una subcuenta utilizando el número de cliente. Por ejemplo, si el cliente es el 23, intentará crear la subcuenta 4300000023.

#### ⚠️ Problemas Comunes al Crear Subcuentas
Es importante tener en cuenta que si en el ejercicio se permiten 10 dígitos para las subcuentas, no podrás utilizar una subcuenta con 9 dígitos; deberás utilizar un número de 10 dígitos solamente.

![Ejercicio](https://i.imgur.com/vY1KWOx.png)
