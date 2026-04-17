---
name: docs-expert
description: >
  Responde preguntas de programación sobre FacturaScripts consultando la documentación oficial
  a través del agente especializado `docs-expert`. ACTIVAR SIEMPRE que el usuario pregunte
  cualquier cosa relacionada con desarrollo en FacturaScripts: cómo implementar o usar
  modelos, controladores (ListController, EditController, PanelController), vistas (XMLView,
  widgets, filtros, addListView, addEditView, addHtmlView), extensiones de modelos y
  controladores, workers, eventos, cron, API REST, plugins, Twig, migraciones, traducciones,
  permisos, caché, email, base de datos, o cualquier clase/método del core. También activar
  cuando Claude necesite explorar o entender el funcionamiento de un plugin o clase de
  FacturaScripts antes de modificarlo — no esperar a que el usuario pregunte explícitamente.
  No esperes a que el usuario mencione "documentación" o "docs-expert" — si la pregunta
  o tarea involucra código PHP o lógica específica de FacturaScripts, activa esta skill
  inmediatamente.
---

# Skill: docs-expert — Consulta automática a la documentación oficial

Esta skill conecta las preguntas de programación del usuario con el agente `docs-expert`,
que tiene acceso directo a la documentación oficial de FacturaScripts y responde basándose
exclusivamente en ella.

## Por qué usar el agente en lugar de responder directamente

El agente `docs-expert` lee en tiempo real los archivos de documentación en `./agents/docs/`
antes de responder. Esto garantiza que las respuestas reflejen los patrones reales del
framework (que difieren del PHP genérico) y estén respaldadas por fuentes citables. Responder
de memoria introduce el riesgo de mezclar convenciones genéricas con el comportamiento
específico de FacturaScripts.

## Cómo invocar el agente

Usa el agente `docs-expert` pasándole la pregunta del usuario tal como fue formulada:

```
Agente: docs-expert
Tarea: [pregunta exacta del usuario]
```

El agente seguirá este protocolo:
1. Ejecuta `Glob ./agents/docs/**/*.md` para ver todos los archivos disponibles
2. Identifica qué archivos son relevantes para la pregunta
3. Los lee completos con `Read`
4. Si necesita buscar un término concreto, usa `Grep`
5. Responde citando los archivos fuente con ejemplos de código tal como aparecen en la documentación

## Qué preguntas activan esta skill

Actívate ante preguntas como estas (y cualquier variante similar):

- "¿Cómo creo un modelo con relación a otra tabla?"
- "¿Cómo añado un filtro de tipo select en una vista de lista?"
- "¿Qué hace el método `loadFromCode()`?"
- "¿Cómo envío un email desde un plugin?"
- "¿Cómo registro un worker para escuchar eventos de un modelo?"
- "¿Cómo funciona el sistema de extensiones de controladores?"
- "¿Cómo creo un endpoint personalizado en la API REST?"
- "¿Cómo uso la caché en FacturaScripts?"
- "¿Cómo accedo a los parámetros de la URL en un controlador?"
- "¿Cuál es la diferencia entre `insert()` y `save()`?"
- "¿Cómo hago una consulta SQL directa con `DbQuery`?"
- Cualquier pregunta técnica sobre desarrollo o programación en FacturaScripts

## También activa esta skill cuando Claude necesita explorar código

No esperes solo a preguntas directas del usuario. Activa esta skill también cuando Claude
vaya a leer o explorar un plugin de FacturaScripts para entender su funcionamiento antes
de modificarlo. Ejemplos:

- Claude va a leer `PrePagoCliToAccounting.php` para entender cómo se crean los asientos
- Claude necesita entender qué hace `getSubcuenta($codejercicio, $create)` antes de corregirlo
- Claude va a explorar la estructura de un plugin sin una pregunta concreta del usuario
- Claude necesita saber cómo funciona `loadFromDate` o `isBalanced` en el framework

En estos casos, delegar a `docs-expert` garantiza que la comprensión se basa en la
documentación oficial del framework, no en suposiciones o código genérico PHP.

## Cuándo NO activar esta skill

- Preguntas sobre instalación, configuración de servidor o administración del sistema
- Preguntas genéricas de PHP que no son específicas de FacturaScripts
- El usuario explícitamente pide crear un archivo (usa las skills `crear-*` en su lugar)

## Preguntas de seguimiento

Si el usuario hace una pregunta de seguimiento sobre el mismo tema, invoca al agente de nuevo
con el contexto acumulado para que pueda dar una respuesta coherente y conectada.
