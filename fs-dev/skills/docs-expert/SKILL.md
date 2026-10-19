---
name: docs-expert
description: Consulta la documentación técnica incluida de FacturaScripts para responder preguntas de desarrollo sobre modelos, controladores, vistas, extensiones, workers, cron, API REST, plugins, Twig, migraciones y framework. Úsala antes de afirmar detalles propios del ERP.
---

# Documentación técnica de FacturaScripts

Responde a partir de la documentación incluida en [`../../references/docs/`](../../references/docs/), cuya ruta se resuelve respecto a este `SKILL.md`, y del código fuente de FacturaScripts que esté en el espacio de trabajo.

## Flujo

1. Busca por nombre de clase, método y términos funcionales dentro de `../../references/docs/` usando `rg` o la herramienta de búsqueda disponible.
2. Lee completos los documentos relevantes antes de formular la respuesta.
3. Contrasta con el código fuente local cuando la pregunta dependa de la versión instalada o la documentación no sea concluyente.
4. Cita los archivos consultados mediante enlaces o rutas precisas.
5. Separa con claridad lo documentado, lo verificado en código y cualquier inferencia.

Los ejemplos de la documentación contienen entidades HTML (`&lt;`, `&gt;`, `&#39;`, `&quot;`): decodifícalas antes de mostrarlos o reutilizarlos y verifica el código contra el core, porque algún ejemplo trae errores de sintaxis.

Las preguntas sobre el uso del ERP, y no sobre su programación, corresponden a la skill `fs-user:docs-expert`.

No inventes comportamiento específico del framework. Si las fuentes incluidas no cubren el tema y no hay código local que lo confirme, indícalo.

## Compatibilidad de agentes

En Claude Code esta skill puede estar precargada en los agentes especializados del plugin. En Codex aplica estas instrucciones directamente; no depende de que existan los agentes Markdown de Claude.
