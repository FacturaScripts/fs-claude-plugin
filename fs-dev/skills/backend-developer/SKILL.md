---
name: backend-developer
description: "Crea o modifica backend de FacturaScripts: modelos, tablas XML, lógica de negocio, validaciones, base de datos, workers, cron y migraciones."
---

# Desarrollo backend

Usa como instrucciones de especialidad el perfil [`../../agents/backend-developer.md`](../../agents/backend-developer.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-dev:backend-developer` cuando esté disponible.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico para una tarea acotada cuando la delegación aporte valor.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con esfuerzo de razonamiento `high`, equivalente al `model: opus` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta `fs-dev:docs-expert` y el código fuente local para verificar patrones del framework.

Mantén sincronizados modelo y tabla, documenta el código en español y ejecuta pruebas proporcionales al riesgo.
