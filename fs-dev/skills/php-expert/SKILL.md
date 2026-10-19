---
name: php-expert
description: Escribe o revisa PHP idiomático de FacturaScripts, PSR-12, Docblocks, Tools, Init.php, extensiones, PHPStan y calidad de código.
---

# Especialista PHP

Usa como instrucciones de especialidad el perfil [`../../agents/php-expert.md`](../../agents/php-expert.md) y léelo completo antes de actuar.

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-dev:php-expert` cuando esté disponible.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico para una revisión acotada cuando resulte útil.
- Si en Codex delegas en un subagente, pide el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalente al `model: sonnet` del perfil; si tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.
- Consulta `fs-dev:docs-expert` y el código local antes de aplicar convenciones específicas del framework.

Escribe comentarios y Docblocks en español, conserva los contratos públicos y ejecuta los analizadores disponibles.
