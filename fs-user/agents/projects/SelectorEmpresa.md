---
idproject: 746
name: SelectorEmpresa
permalink: selectorempresa
creationdate: 25-07-2026
lastmod: 25-07-2026
version: 1
betaversion: 
mincore: 2026
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/SelectorEmpresa
---
Plugin gratuito para cambiar de empresa activa en instalaciones multiempresa de FacturaScripts 2026.

Añade una página &quot;Empresa activa&quot; (menú Empresa) con una tarjeta por empresa y un botón Activar. Al activar una empresa se fija como empresa de la sesión (idempresa), de modo que los documentos y los plugins que filtran por empresa pasan a trabajar sobre la empresa seleccionada. Recuerda la última empresa elegida por cada usuario y la restaura automáticamente en el siguiente acceso, y muestra en todo momento cuál es la empresa activa.

Compatibilidad con EmpresaAcceso: usa el mismo mecanismo de empresa de sesión y respeta sus permisos de acceso por usuario (solo ofrece y activa las empresas autorizadas para cada usuario). No depende de sus clases: detecta su tabla en tiempo de ejecución, de modo que si EmpresaAcceso no está instalado el selector permite todas las empresas.

Ideal cuando gestionas varias empresas en la misma instalación y quieres cambiar de una a otra de forma rápida y segura. Desarrollado por YAST TELECOM SL.

## Demo online

Prueba el plugin sin instalar nada en [https://selectorempresa.adelantia.com](https://selectorempresa.adelantia.com) — Acceso: usuario demo / contraseña demo1234. Es un entorno público de pruebas (los datos pueden reiniciarse; no introduzcas datos reales).