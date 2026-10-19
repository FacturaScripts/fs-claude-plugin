---
name: document-expert
description: Trabaja con documentos de compra y venta de FacturaScripts, Calculator, líneas, estados, conversiones, impuestos, retenciones y Mods.
---

# Documentos de compra y venta

Usa como instrucciones de especialidad el perfil [`../../agents/document-expert.md`](../../agents/document-expert.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `document-expert` cuando esté disponible.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico para una tarea acotada cuando resulte útil.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con esfuerzo de razonamiento `high`, equivalente al `model: opus` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta `fs-dev:docs-expert` y las clases reales de documentos del proyecto antes de cambiar lógica de negocio.

Preserva el ciclo de vida del documento y verifica totales, estados, stock y contabilidad afectados.
