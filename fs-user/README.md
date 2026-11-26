# fs-user — Plugin para usuarios de FacturaScripts

Plugin para Claude Code y Codex orientado a usuarios contables, administrativos y comerciales que trabajan con FacturaScripts en su día a día. No requiere conocimientos técnicos.

Permite analizar datos del ERP, generar informes ejecutivos y resolver dudas sobre el uso del sistema.

## Índice

- [Skills disponibles](#skills-disponibles)
- [Agentes especializados](#agentes-especializados)
- [Detección automática de contexto](#detección-automática-de-contexto)

---

## Skills disponibles

En Claude Code invoca una skill con `/fs-user:<nombre>`, por ejemplo `/fs-user:analizar-ventas`. En Codex selecciónala con `/skills` o menciónala con `$`. En ambos hosts el asistente también puede elegirla automáticamente según tu petición.

> Las skills de análisis consultan los datos reales de tu instancia, así que necesitan el plugin `fs-mcp` configurado con una conexión a FacturaScripts. Las skills de ayuda funcionan sin conexión, a partir de la documentación incluida.

### Análisis e informes

| Skill | Descripción |
|---|---|
| `fs-user:analizar-ventas` | Informe ejecutivo de las ventas de un periodo: cifras clave, comparativas, mejores clientes y productos, y tendencias |
| `fs-user:clientes-morosos` | Clientes con recibos vencidos sin cobrar, priorizados por antigüedad e importe, con los próximos vencimientos |
| `fs-user:stock-bajo` | Variantes con stock disponible por debajo de su mínimo en cada almacén, con la cantidad que conviene reponer |
| `fs-user:pendiente-facturar` | Lo vendido o trabajado que aún no se ha facturado: albaranes, pedidos y, con los plugins Servicios y Proyectos, trabajos SAT y proyectos |
| `fs-user:pipeline-crm` | Embudo de oportunidades del plugin CRM: conversión por fuente, interés y comercial, oportunidades olvidadas y avisos |
| `fs-user:rentabilidad-proyectos` | Ventas, compras, margen y pendiente de facturar de los proyectos (plugin Proyectos), con alertas de pérdidas y retrasos |
| `fs-user:estado-sat` | Servicio técnico (plugin Servicios): servicios abiertos por antigüedad, carga y horas por técnico, trabajos por facturar y máquinas reincidentes |
| `fs-user:agenda-equipo` | Agenda por persona o de todo el equipo: avisos del CRM, tareas de proyecto, servicios SAT asignados y presupuestos que vencen |
| `fs-user:cierre-mensual` | Resumen de cierre de un mes para dirección: ventas, compras, IVA, resultado, cobros, pagos, caja, inventario y plugins activos |
| `fs-user:tesoreria` | Cobros y pagos pendientes por antigüedad, días medios de cobro y previsión de caja por semanas |
| `fs-user:pagos-proveedores` | Lo que se debe a proveedores: vencidos, próximos vencimientos y plan de pagos |
| `fs-user:rentabilidad` | Márgenes por cliente, producto y familia, y facturas vendidas por debajo de coste |
| `fs-user:salud-inventario` | Valoración del stock, stock muerto, sobrestock, rotación y productos sin ventas |
| `fs-user:retencion-clientes` | Clientes perdidos, inactivos, nuevos frente a recurrentes, frecuencia de compra, valor y riesgo de crédito |
| `fs-user:impuestos-trimestre` | Modelos fiscales de un trimestre o del año (303/390, 111/190, 115/180, 130, 347, 349 y 369) con las cifras de sus plugins, o el IVA orientativo desde las facturas |
| `fs-user:informe-contable` | Pérdidas y ganancias y balance de situación abreviados de un ejercicio, con comparativa y ratios |
| `fs-user:crear-informe` | Informe a medida: ventas por familia, agente o serie, clientes, compras, inventario, tesorería o documentos pendientes |
| `fs-user:reporting-analyst` | Análisis puntual de cualquier pregunta de negocio con los datos del ERP |

### Asistencia y documentación

| Skill | Descripción |
|---|---|
| `fs-user:como-usar-erp` | Orientación para aprender y administrar FacturaScripts: conceptos, menús, rutas de aprendizaje, instalación y errores frecuentes |
| `fs-user:erp-guide` | Guía paso a paso para realizar una operación concreta en el ERP |
| `fs-user:docs-expert` | Busca y cita la documentación de usuario y, si el core no cubre la necesidad, el catálogo de plugins |

La documentación incluida es una copia local de las publicaciones de <https://facturascripts.com/publicaciones> y del catálogo de plugins. Las respuestas citan el título y la URL de cada artículo.

---

## Agentes especializados

En Claude Code estos perfiles se cargan como agentes nativos con su propio modelo. En Codex las skills con el mismo nombre leen el perfil y lo aplican en el hilo principal; si delegan en un subagente, piden el modelo equivalente indicado en [`COMPATIBILITY.md`](../COMPATIBILITY.md#modelos-de-los-perfiles).

| Agente | Modelo en Claude Code | Modelo en Codex al delegar | Rol |
|---|---|---|---|
| `fs-user:erp-guide` | Haiku | `gpt-6-luna` (esfuerzo `high`) | Guía de operaciones para usuarios finales |
| `fs-user:reporting-analyst` | Sonnet | `gpt-6.1-sol` | Análisis de datos e informes de ventas, cobros, compras, inventario y tesorería |
| `fs-user:docs-expert` | Haiku | No aplica: la skill se usa directamente | Consulta y cita de la documentación de usuario |

---

## Detección automática de contexto

Al iniciar la sesión, en ambos hosts, el plugin comprueba si el directorio de trabajo está dentro de una instalación de FacturaScripts y, si es así, recuerda al asistente qué plugin usar para cada tipo de petición: `fs-user` para el uso del ERP, `fs-mcp` para consultar datos y `fs-dev` para programación. Las skills funcionan igual aunque no se detecte ninguna instalación.

Si cambias de directorio durante la sesión, abre una sesión nueva en Claude Code o un hilo nuevo en Codex para volver a detectarlo.
