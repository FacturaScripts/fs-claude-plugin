---
name: frontend-developer
description: Implementa la capa de presentación completa de un plugin de FacturaScripts con varias plantillas Twig, JavaScript, CSS y assets.
---

# Desarrollo frontend

Usa como instrucciones de especialidad el perfil [`../../agents/frontend-developer.md`](../../agents/frontend-developer.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-dev:frontend-developer` cuando esté disponible.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico para una tarea acotada cuando resulte útil.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalente al `model: sonnet` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta la skill `fs-dev:docs-expert` y las vistas existentes antes de elegir patrones de interfaz.
- Para la guía de una sola plantilla Twig, usa la skill `fs-dev:crear-html-twig`.

Respeta la herencia de plantillas, los assets del framework, la accesibilidad y el diseño responsive.
