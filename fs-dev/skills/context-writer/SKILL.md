---
name: context-writer
description: Rellena Doc/Context de un plugin o del core de FacturaScripts a partir de su historial git (del commit más antiguo al más nuevo) y de su código, y completa los docblocks que faltan sin cambiar el código.
---

# Contexto del código a partir del historial

Úsala cuando el usuario pida rellenar, generar o actualizar el contexto de un plugin o del core («rellena la carpeta
Context», «genera la documentación de contexto», «documenta el código del plugin») y, sin que lo pida, cuando
`fs-dev:crear-documentacion` crea la estructura de `Doc/` y `Doc/Context/` queda vacío.

Hace dos cosas, siempre sin cambiar el código:

1. **`Doc/Context/`**: lee el historial git del commit más antiguo al más nuevo y el código actual, y escribe los temas,
   las decisiones y el índice `README.md` según el [contenido de Doc/Context](../../references/documentacion/contexto.md).
2. **Docblocks**: completa la documentación de los archivos, clases, propiedades y métodos PHP que no la tienen o la
   tienen mal. Solo comentarios: ni una instrucción del código cambia.

Usa como instrucciones de especialidad el perfil [`../../agents/context-writer.md`](../../agents/context-writer.md) y
léelo completo antes de actuar.

## Rutas de los scripts

Los scripts están en [`../../scripts/`](../../scripts/), relativa a este `SKILL.md`; en Claude Code equivale a
`${CLAUDE_PLUGIN_ROOT}/scripts/`. La variable `CLAUDE_PLUGIN_ROOT` no existe en el entorno de Bash: resuelve antes la
ruta absoluta de la carpeta y úsala entre comillas. En los ejemplos, `<scripts>` representa esa ruta.

```bash
python3 "<scripts>/create-doc-structure.py" "<plugin o core>" --check --json   # context_empty
python3 "<scripts>/doc-only-guard.py" start "<plugin o core>"
python3 "<scripts>/doc-only-guard.py" check "<plugin o core>"
python3 "<scripts>/doc-only-guard.py" stop "<plugin o core>"
```

`doc-only-guard.py start` guarda un marcador en la carpeta de git del repositorio (nunca en el árbol de trabajo) y,
mientras existe, el hook de edición de fs-dev no actualiza el copyright ni ordena las clases de ese proyecto; caduca a
las 12 horas si se queda olvidado. `check` compara cada PHP con su versión de partida sin comentarios ni espacios (con
el tokenizador de PHP si hay `php` en el PATH) y avisa de cualquier otro archivo cambiado fuera de `Doc/`, `AGENTS.md`,
`CLAUDE.md` y `.gitignore`. Termina con código 1 si hay infracciones.

## Plugins grandes

Si el plugin tiene muchos archivos PHP, reparte el trabajo:

- Un agente lee el historial y el código y escribe `Doc/Context/`.
- Uno o varios agentes documentan el código por carpetas que no se solapan (`Model/`, `Controller/`, `Lib/`...).
- Quien coordina ejecuta `start` antes de lanzarlos y `check` y `stop` cuando todos terminan, y revisa que el índice
  de `Doc/Context/README.md` enlaza cada archivo.

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-dev:context-writer` cuando esté disponible. Si el agente devuelve una
  pregunta (la URL del repositorio, acotar un historial muy largo), házsela al usuario y vuelve a delegar con la
  respuesta.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico. Si en Codex delegas en un subagente, pide
  el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalente al `model: sonnet` del perfil; si
  tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.

Antes de terminar, confirma que `doc-only-guard.py check` no da infracciones y que el modo está desactivado
(`status`). Resume los archivos de `Doc/Context/` creados, los PHP documentados y los hallazgos. No hagas commits.
