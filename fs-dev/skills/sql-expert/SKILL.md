---
name: sql-expert
description: Diseña tablas XML, relaciones, índices, consultas DbQuery y Where, migraciones y optimizaciones para MySQL o PostgreSQL en FacturaScripts.
---

# Especialista en base de datos

Usa como instrucciones de especialidad el perfil [`../../agents/sql-expert.md`](../../agents/sql-expert.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `sql-expert` cuando esté disponible.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico para un análisis acotado cuando resulte útil.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con esfuerzo de razonamiento `high`, equivalente al `model: opus` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta `fs-dev:docs-expert`, los XML de tabla y las consultas existentes antes de proponer cambios.

Considera compatibilidad MySQL/PostgreSQL, integridad, índices, volumen de datos y reversibilidad.
