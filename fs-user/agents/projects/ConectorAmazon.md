---
idproject: 679
name: ConectorAmazon
permalink: conectoramazon
creationdate: 05-07-2026
lastmod: 20-08-2026
version: 1.5
betaversion: 
mincore: 2026
maxcore: 2026.65
compatible: 
min_php: 8.1
require: 
require_php: 
url: https://facturascripts.com/plugins/ConectorAmazon
---
ConectorAmazon conecta Amazon Seller Central (SP-API) con FacturaScripts 2026 para automatizar pedidos, inventario y facturación de tus ventas en el marketplace.

## Funciones principales

- **Multicuenta:** gestiona varias cuentas de Amazon con credenciales de la SP-API cifradas (AES-256-GCM), que nunca se muestran completas.
- **Mapeo de productos:** referencia interna de FacturaScripts ↔ ASIN/SKU de Amazon, con sincronización opcional de stock y precio.
- **Importación de pedidos:** desde Amazon (SP-API Orders) con comprador, país, importe y estado.
- **Facturación:** genera facturas de cliente en FacturaScripts a partir de cada pedido (cliente genérico o por país de venta).
- **Devoluciones/reembolsos:** con enlace a notas de crédito.
- **Panel de ventas por canal:** total de ventas Amazon, comisiones, pedidos pendientes de sincronizar y productos mapeados.

## Demo online

Prueba el plugin sin instalar nada en [https://conectoramazon.adelantia.com](https://conectoramazon.adelantia.com) — Acceso: usuario demo / contraseña demo1234. Es un entorno público de pruebas (los datos pueden reiniciarse; no introduzcas datos reales). Guía paso a paso en la pestaña Documentación.

## Requisitos

FacturaScripts 2026, PHP 8.1 o superior.

Desarrollado por YAST TELECOM SL (Adelantia).