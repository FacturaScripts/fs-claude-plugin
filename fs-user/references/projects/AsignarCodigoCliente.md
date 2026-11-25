---
idproject: 475
name: AsignarCodigoCliente
permalink: asignarcodigocliente
creationdate: 04-11-2025
lastmod: 23-10-2026
version: 1.04
betaversion: 0
mincore: 2026.6
maxcore: 2026.7
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/AsignarCodigoCliente
---
Asigna automáticamente el código a los nuevos clientes y proveedores cuando se crean sin indicarlo, aprovechando los huecos que haya en la numeración.

## 🔢 Código automático sin saltos
Cuando se da de alta un cliente o proveedor sin código, el plugin busca el primer número libre entre los códigos que ya existen, en lugar de continuar siempre desde el último. Así se recuperan los saltos que dejan las bajas o los borrados y se aprovechan todos los códigos disponibles. Si se escribe un código a mano, se respeta tal cual.

Solo se tienen en cuenta los códigos numéricos: los códigos con letras se ignoran al calcular el siguiente número.

## 📒 Comprobación de la subcuenta contable
Antes de asignar un número, el plugin comprueba que no exista ya la subcuenta contable que le correspondería (4300 para clientes; 4000 y 4100 para proveedores y acreedores). De esta forma se evita reutilizar un código que ya se usó en contabilidad aunque el cliente o proveedor ya no exista.

## ⚙️ Configuración
Desde el Panel de control, en el apartado &quot;Nuevos proveedores y clientes&quot;, se puede elegir:
- Rellenar con ceros a la izquierda (por ejemplo, 000125) o dejar el número tal cual (125).
- La longitud máxima del código de cliente y de proveedor, entre 2 y 6 caracteres.

## 📏 Control de longitud máxima
El plugin impide guardar un cliente o proveedor nuevo cuyo código supere la longitud máxima configurada, también cuando el código se escribe a mano. Es especialmente útil en España: para mantener las subcuentas en los 10 dígitos que usa FacturaScripts (4 de la cuenta y 6 del código), el código no debe superar los 6 dígitos.

Si en la web no se usan encabezados, cada apartado funciona igual como párrafo suelto, empezando por el título en negrita.