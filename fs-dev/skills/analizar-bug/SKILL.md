---
name: analizar-bug
description: Diagnostica y corrige comportamientos incorrectos, errores inesperados o datos erróneos en plugins de FacturaScripts; úsala también para revisar código cuando se busca la causa de un fallo.
---

# Análisis de bugs en FacturaScripts

## Flujo

1. Reproduce o concreta el comportamiento observado y separa hechos de hipótesis.
2. Usa `fs-dev:docs-expert` para establecer el comportamiento esperado y verificar patrones del framework.
3. Lee completo el perfil [`../../agents/backend-developer.md`](../../agents/backend-developer.md) para analizar la causa e implementar la corrección cuando el usuario haya pedido arreglarla. Si el fallo está en otra capa, usa el perfil correspondiente: [`frontend-developer`](../../agents/frontend-developer.md) para Twig, JavaScript o CSS; [`ui-designer`](../../agents/ui-designer.md) para XMLView; [`extension-developer`](../../agents/extension-developer.md) para extensiones; [`document-expert`](../../agents/document-expert.md) para documentos de compra y venta; o [`api-designer`](../../agents/api-designer.md) para la API.
4. Lee completo el perfil [`../../agents/testing-expert.md`](../../agents/testing-expert.md) para diseñar una prueba que falle antes y pase después.
5. Ejecuta las verificaciones relevantes e informa de cualquier limitación.

## Ejecución portable

En Claude Code puedes delegar cada fase a sus agentes nativos. En Codex aplica los perfiles directamente o usa subagentes genéricos para tareas acotadas cuando estén disponibles y aporten valor. Si delegas, pide para la fase de `backend-developer` el modelo `gpt-6.1-sol` con esfuerzo de razonamiento `high` y para la de `testing-expert` el modelo `gpt-6.1-sol` con el esfuerzo de razonamiento predeterminado, equivalentes a los `model` de sus perfiles (para otro perfil, pide el modelo indicado en su skill); si tu cuenta no dispone de esos modelos, usa el que esté disponible. Si no hay delegación, completa el flujo tú mismo.

Si el usuario solo pide diagnóstico, no cambies archivos. No amplíes el alcance ni atribuyas al bug problemas preexistentes sin evidencia.
