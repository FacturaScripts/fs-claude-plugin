---
idproject: 599
name: EstadoCuentaClienteFS
permalink: estadocuentaclientefs
creationdate: 11-05-2026
lastmod: 11-05-2026
version: 1
betaversion: 0
mincore: 2025.6
maxcore: 2026
compatible: 
min_php: 
require: 
require_php: 
url: https://facturascripts.com/plugins/EstadoCuentaClienteFS
---
Genera estados de cuenta de clientes desde la ficha del cliente, con vista resumida y detallada, fecha de corte, exportación a PDF/CSV/Excel y envío por correo.
El plugin se integra en la ficha del cliente sin tocar el core y permite consultar saldos pendientes, resumir antigüedad, imprimir, exportar y enviar el reporte por correo.

Funcionalidades principales
- Pestaña `Estado de cuenta` dentro de la ficha del cliente.
- Filtro por fecha de corte.
- Dataset detallado por documento y dataset resumido por antigüedad.
- PDF resumido.
- PDF detallado.
- CSV resumido.
- CSV detallado.
- Excel resumido.
- Excel detallado.
- Envío por email del estado de cuenta en PDF.
- Compatibilidad internacional con NCF/e-NCF opcional.

Limitaciones conocidas
- El cálculo actual no incluye anticipos, notas de crédito ni rectificativas.
- Si una factura no tiene recibos suficientes para representar correctamente su saldo a la fecha de corte, el plugin genera una línea sintética de protección para no subestimar el pendiente.
- El paquete de traducciones incluye `es_DO`, `es_ES` y `en_EN` revisados. El resto de idiomas estándar se mantiene como fallback temporal basado en `es_DO`.
- La presentación PDF es funcional y apta para uso real, pero puede seguir refinándose visualmente en versiones futuras.