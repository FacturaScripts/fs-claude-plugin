---
idproject: 487
name: SafeIPLogin
permalink: safeiplogin
creationdate: 27-11-2025
lastmod: 20-08-2026
version: 2.03
betaversion: 
mincore: 2026.41
maxcore: 2026.6
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/SafeIPLogin
---
SafeIPLogin es un plugin para FacturaScripts que añade una capa adicional de seguridad al panel de acceso, permitiendo restringir el inicio de sesión únicamente a direcciones IP autorizadas. Su objetivo es evitar accesos no deseados incluso aunque la contraseña haya sido comprometida.

Es especialmente útil para:
    - Servidores expuestos a internet.
    - Empresas que solo permiten el acceso desde determinadas oficinas.
    - Instalaciones donde se exige un nivel de seguridad adicional.

Resumen de formatos soportados por la White List:
    - IP individual	88.24.115.92				Solo esa IP puede iniciar sesión
    - Rango		192.168.1.10-192.168.1.50	Cualquier IP comprendida en ese intervalo
    - CIDR / Subred	192.168.1.0/24				Permite una red completa o rango definido por máscara

El plugin implementa una White List de direcciones IP, es decir, una lista de orígenes autorizados desde los que se permite iniciar sesión.
Si la IP del usuario no aparece en la White List (usando cualquiera de los formatos anteriores), el acceso es bloqueado automáticamente.

También es posible administrar la lista de ips y usuarios bloqueados por fallos consecutivos en el login, permitiendo ver las ocurrencias y eliminarlas si se desea volver activar el acceso desde dicha ip o usuario.