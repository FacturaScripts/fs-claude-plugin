---
name: document-expert
description: Implementa o corrige lógica completa de presupuestos, pedidos, albaranes y facturas de FacturaScripts (creación, líneas, Calculator, estados, impuestos y retenciones).
---

# Documentos de compra y venta

Usa como instrucciones de especialidad el perfil [`../../agents/document-expert.md`](../../agents/document-expert.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-dev:document-expert` cuando esté disponible.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico para una tarea acotada cuando resulte útil.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con esfuerzo de razonamiento `high`, equivalente al `model: opus` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta la skill `fs-dev:docs-expert` y las clases reales de documentos del proyecto antes de cambiar la lógica de negocio.
- Para la guía de un solo Mod de formulario o de cálculo, usa la skill `fs-dev:mods`.

Preserva el ciclo de vida del documento y verifica totales, estados, stock y contabilidad afectados.
