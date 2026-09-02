---
idproject: 367
name: AccesosCliente
permalink: accesoscliente
creationdate: 27-05-2024
lastmod: 20-08-2026
version: 3.4
betaversion: 
mincore: 2025
maxcore: 2026.65
compatible: Proyectos
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/AccesosCliente
---
AccesosCliente es un gestor de contraseñas para clientes y proyectos integrado en FacturaScripts 2026. Guarda los accesos (usuario, contraseña, URL y notas) cifrados con AES-256-GCM y controla quién los usa.

## Funciones principales

- **Almacenamiento cifrado (AES-256-GCM):** la contraseña no se precarga; se revela o se copia bajo demanda comprobando permisos.
- **Historial de auditoría:** registro de quién, cuándo, qué acción e IP en cada acceso.
- **Generador de contraseñas seguras:** con medidor de fortaleza.
- **Categorías y caducidad:** con aviso de renovación.
- **Botones de copiado:** de usuario y contraseña.
- **Control por permisos de proyecto:** con pestaña de accesos en la ficha de cliente y de proyecto.

## Demo online

Prueba el plugin sin instalar nada en [https://accesoscliente.adelantia.com](https://accesoscliente.adelantia.com) — Acceso: usuario demo / contraseña demo1234. Es un entorno público de pruebas (los datos pueden reiniciarse; no introduzcas datos reales). Guía paso a paso en la pestaña Documentación.

## Requisitos

FacturaScripts 2026, PHP 8.1 o superior.

Desarrollado por YAST TELECOM SL (Adelantia).