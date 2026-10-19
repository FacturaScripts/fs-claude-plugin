---
name: extension-developer
description: Implementa una tarea completa de extensión de FacturaScripts que combine varios archivos (tabla, modelo, controlador, XMLView, Twig e Init.php) sobre el core u otro plugin.
---

# Desarrollo de extensiones

Usa como instrucciones de especialidad el perfil [`../../agents/extension-developer.md`](../../agents/extension-developer.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-dev:extension-developer` cuando esté disponible.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico para una tarea acotada cuando resulte útil.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalente al `model: sonnet` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta la skill `fs-dev:docs-expert` y el código que se va a extender para confirmar los puntos de extensión y sus firmas.
- Para la guía de un solo archivo de extensión, usa la skill `fs-dev:crear-extension`.

Implementa siempre desde `Extension/`; no modifiques `Core/` ni el plugin extendido.
