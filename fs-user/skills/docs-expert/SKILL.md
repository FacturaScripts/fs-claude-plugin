---
name: docs-expert
description: >
  Responde preguntas sobre cómo usar FacturaScripts consultando la documentación
  oficial de usuarios a través del agente especializado `docs-expert`.
  ACTIVAR SIEMPRE que el usuario pregunte cómo hacer una operación, dónde encontrar
  una función, cómo fluye un proceso (presupuesto→factura), cómo gestionar clientes,
  inventario, compras, contabilidad, o cualquier aspecto práctico de uso del ERP.
  También activar cuando Claude necesite explorar la documentación de usuario
  antes de responder sobre procedimientos — no esperar a que el usuario pregunte
  explícitamente. No esperes a que mencione "documentación" — si la pregunta o
  tarea involucra procedimientos operativos en FacturaScripts, activa esta skill.
---

# Skill: docs-expert — Consulta automática a la documentación de usuario

Esta skill conecta las preguntas de usuarios sobre operaciones en FacturaScripts con el
agente especializado `docs-expert`, que tiene acceso directo a la documentación de usuario
oficial y responde basándose exclusivamente en ella.

## Por qué usar el agente en lugar de responder directamente

El agente `docs-expert` lee en tiempo real los archivos de documentación en
`./agents/docs/` antes de responder. Esto garantiza que las respuestas reflejen
los procedimientos reales de FacturaScripts, incluyan pasos exactos, y estén respaldadas
por fuentes citables. Responder de memoria introduce el riesgo de omitir detalles,
confundir pasos, o proporcionar instrucciones incompletas para operaciones complejas.

## Cómo invocar el agente

Usa el agente `docs-expert` pasándole la pregunta del usuario tal como fue formulada:

```
Agente: docs-expert
Tarea: [pregunta exacta del usuario]
```

El agente seguirá este protocolo:

1. Ejecuta `Glob ./agents/docs/**/*.md` para ver todos los archivos disponibles
2. Identifica qué archivos son relevantes para la pregunta (guía-clientes, guia-facturacion, etc)
3. Los lee completos con `Read`
4. Si necesita buscar un término concreto o comparar secciones, usa `Grep`
5. Responde citando los archivos fuente con pasos y ejemplos tal como aparecen en la documentación

## Qué preguntas activan esta skill

Actívate ante preguntas como estas (y cualquier variante similar):

**Sobre procedimientos y operaciones:**
- "¿Cómo creo un nuevo cliente en FacturaScripts?"
- "¿Cuál es el flujo de venta desde presupuesto hasta factura?"
- "¿Cómo registro una factura de proveedor?"
- "¿Cómo gestiono el stock y repongo productos?"
- "¿Cómo registro un cobro de una factura?"
- "¿Cómo hago una devolución de cliente?"
- "¿Cómo concilio mi cuenta bancaria?"

**Sobre localización de funciones:**
- "¿Dónde está la opción para crear un grupo de clientes?"
- "¿Cómo accedo a los históricos de un cliente?"
- "¿Dónde veo el estado de un pedido?"
- "¿Cómo genero un informe de ventas?"

**Sobre conceptos y flujos:**
- "¿Qué diferencia hay entre albarán y factura?"
- "¿Cómo funciona el sistema de tarifas de precios?"
- "¿Cuándo se cierra un ejercicio fiscal?"
- "¿Cómo se calcula el IVA en una factura?"

**Sobre buenas prácticas:**
- "¿Cómo debo organizar mis clientes en grupos?"
- "¿Cuál es el flujo recomendado para compras?"
- "¿Cómo mantener el inventario actualizado?"

**Cualquier pregunta sobre "cómo hacer X" en FacturaScripts para usuarios finales**

## También activa esta skill cuando Claude necesita explorar procedimientos

No esperes solo a preguntas directas del usuario. Activa esta skill también cuando Claude
vaya a responder sobre procedimientos operativos en FacturaScripts y necesite verificar
detalles en la documentación oficial de usuario. Ejemplos:

- Claude va a explicar cómo crear una factura y necesita pasos exactos
- Claude va a responder sobre el flujo de documentos de venta
- Claude necesita confirmar dónde está una funcionalidad en la interfaz
- Claude va a explicar un concepto contable (diferencia entre asientos, subcuentas)

En estos casos, delegar a `fs-user-docs-expert` garantiza que la respuesta se basa en
la documentación oficial del usuario, no en suposiciones.

## Cuándo NO activar esta skill

- Preguntas de desarrollo (crear plugins, extender FacturaScripts) → usa `fs-dev:fs-docs-expert`
- Preguntas sobre instalación, configuración de servidor o administración del sistema
- Preguntas genéricas que no requieren documentación específica de FacturaScripts
- El usuario explícitamente pide crear algo personalizado (usa otros skills en su lugar)

## Preguntas de seguimiento

Si el usuario hace una pregunta de seguimiento sobre el mismo tema, invoca al agente de
nuevo con el contexto acumulado para que pueda dar una respuesta coherente y conectada.

## Red Flags - Cuándo DEBES activar esta skill

Estos patrones significan que DEBES invocar la skill:

- El usuario pregunta "¿Cómo...?" sobre una operación en FacturaScripts
- El usuario dice "¿Dónde está...?" refiriéndose a una función o menú
- El usuario pregunta sobre flujos de documentos (presupuesto→factura, compras, etc)
- El usuario pregunta "¿Cuál es la diferencia entre...?" (albarán vs factura, etc)
- Claude va a responder sobre procedimientos y duda de detalles exactos
- Claude necesita verificar dónde está algo en la interfaz
- Una respuesta requiere referencia a la documentación oficial

**Estos patrones significan que NO necesitas la skill:**

- Pregunta sobre desarrollo/plugins → usa `fs-dev:fs-docs-expert`
- Pregunta técnica de PHP/arquitectura → usa `fs-dev:fs-docs-expert`
- Pregunta sobre instalación de servidor → no necesita skill
- Pregunta genérica no específica de FacturaScripts → responde directamente

## Racionalizaciones comunes (y por qué están mal)

| Racionalización | Por qué está mal | Solución |
|-----------------|------------------|----------|
| "Solo es una pregunta simple, puedo responder sin skill" | Respuestas simples de memoria pierden detalles exactos, pasos, campos específicos | Invoca la skill siempre para operaciones en FS |
| "Ya conozco cómo funciona FacturaScripts, no necesito docs" | Tu conocimiento puede estar desactualizado o incompleto; la documentación es la fuente de verdad | Usa la skill para respuestas citables |
| "El usuario está apurado y solo quiere una respuesta rápida" | Una respuesta rápida pero incompleta causa confusión después; la skill te da pasos exactos igual de rápido | Usa la skill |
| "Esta es una pregunta de desarrollo, no de usuario" | Si alguien pregunta cómo USAR algo (no cómo programarlo), usa fs-user-docs-expert | Distingue entre "usar" (fs-user) vs "desarrollar" (fs-dev) |
| "Puedo responder esto combinando mi conocimiento general" | Mezclar conocimiento genérico con FacturaScripts causa errores; FacturaScripts tiene flujos y conceptos únicos | Consulta la documentación oficial |

## Cómo invocar correctamente

**Formato:**
```
Usuario pregunta: "¿Cómo creo un cliente?"

→ Invoca: Agente fs-user-docs-expert con la pregunta exacta

Agente lee: ./agents/docs/tu-primer-cliente-459.md (y otros relevantes)

Respuesta: Pasos exactos, campos documentados, citados de la fuente oficial
```

**NO hagas esto:**
```
Usuario pregunta: "¿Cómo creo un cliente?"

→ Respondes directamente de memoria sin invocar la skill

→ Resultado: Respuesta incompleta, detalles faltantes, no citada
```
