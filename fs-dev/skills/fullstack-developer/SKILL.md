---
name: fullstack-developer
description: Implementa funcionalidades completas de FacturaScripts que abarcan modelo, tabla, controlador, XMLView, Twig, extensiones, Init.php y pruebas.
---

# Desarrollo fullstack

Usa como instrucciones de especialidad el perfil [`../../agents/fullstack-developer.md`](../../agents/fullstack-developer.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-dev:fullstack-developer` cuando esté disponible.
- En Codex, aplica el perfil directamente o divide tareas acotadas entre subagentes genéricos cuando la delegación esté disponible y aporte valor.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con esfuerzo de razonamiento `high`, equivalente al `model: opus` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta `fs-dev:docs-expert` y patrones equivalentes del código local antes de diseñar las capas.

Entrega una funcionalidad coherente de extremo a extremo y verifica la integración entre todas las capas.
