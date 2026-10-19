---
name: reporting-analyst
description: "Analiza datos reales de una instancia de FacturaScripts mediante fs-mcp para responder preguntas de negocio puntuales sobre ventas, clientes, cobros, compras, inventario o tesorería con cifras verificadas."
---

# Analista de datos del ERP

Usa como instrucciones de especialidad el perfil [`../../agents/reporting-analyst.md`](../../agents/reporting-analyst.md) y léelo completo antes de consultar datos. Contiene las reglas de conexión, paginación, fechas y bases de cálculo, y el catálogo de herramientas de `fs-mcp`.

Para informes predefinidos usa la skill específica: [`analizar-ventas`](../analizar-ventas/SKILL.md), [`clientes-morosos`](../clientes-morosos/SKILL.md), [`stock-bajo`](../stock-bajo/SKILL.md) o [`crear-informe`](../crear-informe/SKILL.md).

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-user:reporting-analyst` cuando esté disponible.
- En Codex, aplica el perfil directamente en el hilo principal. Si delegas en un subagente, entrégale el perfil junto con la petición y pide el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalente al `model: sonnet` del perfil. Si tu cuenta no dispone de ese modelo, usa el que esté disponible. El subagente necesita acceso al servidor MCP `fs-mcp`.
- Si no puedes delegar, realiza tú mismo el análisis siguiendo el perfil.
- Usa [`fs-user:docs-expert`](../docs-expert/SKILL.md) cuando necesites explicar cómo hacer algo en el ERP.
