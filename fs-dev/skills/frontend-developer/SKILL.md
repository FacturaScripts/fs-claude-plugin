---
name: frontend-developer
description: Crea o modifica Twig, JavaScript, CSS, assets, Bootstrap y funciones de presentación en plugins de FacturaScripts.
---

# Desarrollo frontend

Usa como instrucciones de especialidad el perfil [`../../agents/frontend-developer.md`](../../agents/frontend-developer.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `frontend-developer` cuando esté disponible.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico para una tarea acotada cuando resulte útil.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalente al `model: sonnet` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta `fs-dev:docs-expert` y las vistas existentes antes de elegir patrones de interfaz.

Respeta la herencia de plantillas, los assets del framework, la accesibilidad y el diseño responsive.
