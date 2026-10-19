---
name: ui-designer
description: Diseña o modifica XMLView, widgets, columnas, filtros, filas, acciones y modales de FacturaScripts.
---

# Diseño de interfaces

Usa como instrucciones de especialidad el perfil [`../../agents/ui-designer.md`](../../agents/ui-designer.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `ui-designer` cuando esté disponible.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico para una tarea acotada cuando resulte útil.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalente al `model: sonnet` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta `fs-dev:docs-expert` y XMLViews equivalentes del proyecto antes de elegir widgets o filtros.

Mantén coherencia visual, accesibilidad, distribución responsive y compatibilidad con el controlador.
