---
name: docs-writer
description: Escribe una página de documentación de uso o de programación de un plugin o del core de FacturaScripts, paso a paso, con capturas anotadas y anonimizadas, y la registra en Doc/forja.json.
---

# Redacción de documentación con capturas

Úsala cuando el usuario pida documentar cómo se hace algo en un plugin o en el core («créame la documentación de cómo
firmar una factura», «documenta cómo se configura...», «escribe la página de desarrollo para extender...»). La página
va en `Doc/User/` (uso) o `Doc/Dev/` (programación), sus capturas en `Doc/Assets/<nombre-de-la-página>/` y sus datos
en `Doc/forja.json`. Para crear o revisar solo la estructura de `Doc/`, usa `fs-dev:crear-documentacion`.

Usa como instrucciones de especialidad el perfil [`../../agents/docs-writer.md`](../../agents/docs-writer.md) y léelo
completo antes de actuar, junto con la [guía de estilo](../../references/documentacion/guia-de-estilo.md) y el
[formato del escenario de capturas](../../references/documentacion/escenario-de-capturas.md).

## Rutas de los scripts

Los scripts están en [`../../scripts/`](../../scripts/), relativa a este `SKILL.md`; en Claude Code equivale a
`${CLAUDE_PLUGIN_ROOT}/scripts/`. La variable `CLAUDE_PLUGIN_ROOT` no existe en el entorno de Bash: resuelve antes la
ruta absoluta de la carpeta y úsala entre comillas. En los ejemplos, `<scripts>` representa esa ruta.

```bash
python3 "<scripts>/doc-screenshots.py" "<escenario.json>" --check
FS_DOC_USER='<usuario>' FS_DOC_PASSWORD='<contraseña>' python3 "<scripts>/doc-screenshots.py" "<escenario.json>" --scan
FS_DOC_USER='<usuario>' FS_DOC_PASSWORD='<contraseña>' python3 "<scripts>/doc-screenshots.py" "<escenario.json>"
python3 "<scripts>/create-doc-structure.py" "<plugin o core>" --check
```

El script de capturas necesita Python 3 y Google Chrome o Chromium; no instala nada.

## Ejecución portable

- En Claude Code, delega al agente nativo `fs-dev:docs-writer` cuando esté disponible. Si el agente devuelve una
  pregunta (por ejemplo, la instalación de pruebas o sus credenciales), házsela al usuario y vuelve a delegar con la
  respuesta.
- En Codex, aplica el perfil directamente o pásalo a un subagente genérico. Si en Codex delegas en un subagente, pide
  el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalente al `model: sonnet` del perfil; si
  tu cuenta no dispone de ese modelo, usa el que esté disponible.
- Si no puedes delegar, realiza tú mismo el trabajo siguiendo el perfil.

Antes de terminar, muestra al usuario las capturas generadas para que confirme que no queda ningún dato real y que las
marcas son correctas.
