---
idproject: 659
name: EnvioRapido
permalink: enviorapido
creationdate: 29-06-2026
lastmod: 20-08-2026
version: 1.4
betaversion: 
mincore: 2026
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/EnvioRapido
---
EnvioRapido integra los principales transportistas españoles en FacturaScripts 2026: genera la etiqueta de envío y el número de seguimiento de SEUR y GLS directamente desde un albarán o un pedido de venta, sin entrar en la web de cada transportista.

## Funciones principales

- **Generación de envíos:** desde la ficha del documento, el botón «Generar envío» abre un formulario con los datos del destinatario ya rellenados; eliges transportista, bultos y peso, y crea el envío, guarda la etiqueta y registra la referencia.
- **Seguimiento de estados:** cada documento muestra sus envíos y su estado (pendiente, en tránsito, entregado, incidencia, devuelto) con enlace al seguimiento público.
- **Actualización automática:** una tarea programada diaria actualiza el estado de los envíos en tránsito y, opcionalmente, avisa al cliente por email al entregarse.
- **Transportistas:** SEUR y GLS operativos; Correos Express y MRW preparados para próximas versiones.
- **Credenciales seguras:** las credenciales de cada transportista se guardan de forma segura y nunca se muestran.

## Demo online

Prueba el plugin sin instalar nada en [https://enviorapido.adelantia.com](https://enviorapido.adelantia.com) — Acceso: usuario demo / contraseña demo1234. Es un entorno público de pruebas (los datos pueden reiniciarse; no introduzcas datos reales). Guía paso a paso en la pestaña Documentación.

## Requisitos

FacturaScripts 2026, PHP 8.1 o superior.

Desarrollado por YAST TELECOM SL (Adelantia).