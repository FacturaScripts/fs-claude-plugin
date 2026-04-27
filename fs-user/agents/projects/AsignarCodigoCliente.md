---
idproject: 475
name: AsignarCodigoCliente
permalink: asignarcodigocliente
creationdate: 04-11-2025
lastmod: 17-01-2026
version: 1.03
betaversion: 0
mincore: 2025.6
maxcore: 2025.81
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/AsignarCodigoCliente
---

Si el cliente no tiene un código al crearlo busca un código intercalado entre los códigos existentes. Esto permite recuperar saltos en las numeraciones y asegurarnos el completo uso de los códigos libres. Al comprobar el nuevo número también comprueba que no exista la subcuenta contable para verificar que no se ha utilizado con anterioridad. También permite configurar si el nuevo código debe ser rellenado con ceros a la izquierda o si preferimos el número tal cuál (sin relleno). Además añade un control de longitud máxima del código. Esto es muy práctico para casos como España donde si se quiere respetar la longitud de subcuenta determinada por Facturascripts en 10 dígitos el código de cliente no debe exceder de los 6 dígitos.
