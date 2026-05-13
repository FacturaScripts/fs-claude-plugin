# fs-user — Plugin para usuarios de FacturaScripts

Plugin para [Claude Code](https://claude.ai/code) orientado a usuarios contables, administrativos y comerciales que trabajan con FacturaScripts en su día a día. No requiere conocimientos técnicos.

Permite analizar datos del ERP, generar informes ejecutivos y resolver dudas sobre el uso del sistema.

## Índice

- [Skills disponibles](#skills-disponibles)
- [Agentes especializados](#agentes-especializados)
- [Detección automática de contexto](#detección-automática-de-contexto)

---

## Skills disponibles

Invoca cualquier skill escribiendo su nombre en el chat. Ejemplos: `/fs-user:analizar-ventas`, `/fs-user:como-usar-erp`.

> Para que las skills de análisis funcionen con datos reales, necesitas tener el plugin `fs-mcp` configurado con tu conexión a FacturaScripts. Sin él, el asistente puede responder preguntas generales pero no acceder a tus datos.

### Análisis e informes

| Skill | Descripción |
|---|---|
| `fs-user:analizar-ventas` | Analiza las ventas del período seleccionado y genera un informe ejecutivo con cifras clave, tendencias y comparativas |
| `fs-user:clientes-morosos` | Identifica clientes con deuda pendiente, ordena por antigüedad e importe, y genera un plan de seguimiento de cobros |
| `fs-user:stock-bajo` | Identifica productos con stock por debajo del mínimo definido y genera alertas de reposición ordenadas por urgencia |
| `fs-user:crear-informe` | Crea un informe personalizado con cualquier dato disponible en FacturaScripts según tus necesidades |

### Asistencia y documentación

| Skill | Descripción |
|---|---|
| `fs-user:como-usar-erp` | Asistente interactivo para aprender a usar FacturaScripts: facturación, clientes, inventario, compras y contabilidad |
| `fs-user:docs-expert` | Responde preguntas sobre cómo hacer cualquier operación en FacturaScripts consultando la documentación oficial |

---

## Agentes especializados

Los agentes se activan automáticamente desde las skills o puedes invocarlos directamente en el chat.

| Agente | Modelo | Rol |
|---|---|---|
| `fs-user:erp-guide` | Haiku | Guía de uso para usuarios finales: facturación, gestión de clientes, inventario, compras y contabilidad |
| `fs-user:reporting-analyst` | Sonnet | Análisis de datos e informes ejecutivos: ventas, cobros, inventario y tesorería |
| `fs-user:docs-expert` | Haiku | Documentación oficial orientada a usuarios finales |

---

## Detección automática de contexto

El plugin detecta automáticamente si el directorio de trabajo está relacionado con FacturaScripts y ajusta el contexto de los agentes. Esto ocurre al iniciar la sesión y al cambiar de directorio.
