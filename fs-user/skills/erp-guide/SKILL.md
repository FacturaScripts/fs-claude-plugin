---
name: erp-guide
description: "Guía paso a paso para realizar una operación concreta en FacturaScripts: crear, registrar, configurar o corregir algo en ventas, compras, almacén, contabilidad o administración."
---

# Guía de operaciones del ERP

Usa como instrucciones de especialidad el perfil [`../../agents/erp-guide.md`](../../agents/erp-guide.md) y léelo completo antes de responder. Las rutas `${CLAUDE_PLUGIN_ROOT}/references/...` del perfil equivalen a `../../references/...` respecto a este `SKILL.md`.

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-user:erp-guide` cuando esté disponible.
- En Codex, aplica el perfil directamente en el hilo principal. Si delegas en un subagente, entrégale el perfil junto con la pregunta y pide el modelo `gpt-6-luna` con esfuerzo de razonamiento `high`, equivalente al `model: haiku` del perfil. Si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, responde tú mismo siguiendo el perfil.
- Aplica siempre el protocolo de [`fs-user:docs-expert`](../docs-expert/SKILL.md) para localizar y citar la documentación.
