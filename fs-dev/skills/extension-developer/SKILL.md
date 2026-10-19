---
name: extension-developer
description: Crea extensiones de modelos, controladores, XMLView, tablas o Twig de FacturaScripts sin modificar el core ni el plugin original.
---

# Desarrollo de extensiones

Usa como instrucciones de especialidad el perfil [`../../agents/extension-developer.md`](../../agents/extension-developer.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `extension-developer` cuando esté disponible.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico para una tarea acotada cuando resulte útil.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalente al `model: sonnet` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta `fs-dev:docs-expert` y el código que se va a extender para confirmar hooks y firmas.

Implementa siempre desde `Extension/`; no modifiques `Core/` ni el plugin extendido.
