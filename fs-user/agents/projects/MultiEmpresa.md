---
idproject: 464
name: MultiEmpresa
permalink: multiempresa
creationdate: 05-08-2025
lastmod: 10-11-2025
version: 2.01
betaversion: 0
mincore: 2025.51
maxcore: 2025.81
compatible: 
min_php: 8
require: 
require_php: 
url: https://facturascripts.com/plugins/MultiEmpresa
---

Plugin que añade los recursos necesarios (tablas, campos, vistas, etc.) para trabajar con múltiples empresas dentro de una misma instalación. Este plugin permite definir valores por defecto diferenciados manteniendo una jerarquía de prioridades entre configuraciones para:

- Cada empresa
- Cada cliente o proveedor

priorizando los datos por defecto en este orden:
Cliente / Proveedor → Empresa → Configuración general de la aplicación

Esto es necesario cuando se trabaja en entornos donde una única instalación de FacturaScripts gestiona varias empresas (ej. grupos empresariales, asesorías o gestores), este plugin facilita una gestión más eficiente, permitiendo:
- Aplicar condiciones personalizadas por cliente/proveedor según la empresa,
- Centralizar la gestión en una única interfaz sin mezclar información.
