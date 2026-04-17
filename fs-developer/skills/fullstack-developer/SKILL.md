---
name: fullstack-developer
description: >
  Crea funcionalidades completas end-to-end en FacturaScripts delegando al agente especializado
  `fullstack-developer`. ACTIVAR SIEMPRE que el usuario pida crear una funcionalidad que
  abarque varias capas: modelo + tabla + controlador + vista. Por ejemplo: un CRUD completo,
  una nueva entidad con listado y formulario de edición, un PanelController con múltiples
  pestañas, o cualquier funcionalidad que requiera crear archivos en Model/, Table/,
  Controller/, XMLView/ y opcionalmente View/, Worker/, Translation/ e Init.php. Si la tarea
  es claramente "crear algo completo de principio a fin", activa esta skill.
---

# Skill: fullstack-developer — Desarrollo fullstack de FacturaScripts

Esta skill conecta las peticiones de desarrollo completo del usuario con el agente
`fullstack-developer`, que sabe crear funcionalidades end-to-end manteniendo coherencia
entre todas las capas del framework.

## Por qué usar el agente

El agente `fullstack-developer` garantiza que todas las capas (tabla XML, modelo PHP,
controlador, XMLView, Init.php, traducciones) están correctamente conectadas y siguen las
convenciones de nombres de FacturaScripts. Crear cada capa por separado introduce riesgo
de inconsistencias (nombres de campos, tipos de datos, convenciones de naming).

## Cómo invocar el agente

```
Agente: fullstack-developer
Tarea: [descripción exacta de la funcionalidad completa]
```

El agente:
1. Planifica la arquitectura completa (modelo, controlador, vista)
2. Consulta la documentación para verificar patrones
3. Crea todos los archivos necesarios en orden lógico
4. Verifica la coherencia entre capas
5. Crea traducciones y actualiza Init.php

## Qué tareas activan esta skill

- "Crea un CRUD completo para gestionar proveedores de transporte"
- "Necesito una entidad 'Proyecto' con listado, edición y panel con pestañas"
- "Crea un nuevo módulo para gestionar reservas de salas"
- "Quiero un PanelController con datos principales y líneas de detalle"
- "Crea toda la estructura para gestionar contratos de servicio"
- Cualquier tarea que implique crear una funcionalidad completa desde cero

## Cuándo NO activar esta skill

- Solo necesitas un modelo sin vista ni controlador → usa `backend-developer`
- Solo necesitas modificar un XMLView existente → usa `ui-designer`
- Solo necesitas una plantilla Twig → usa `frontend-developer`
- Solo necesitas crear una extensión → usa `extension-developer`
- Solo necesitas un endpoint de API → usa `api-designer`
- Preguntas sobre documentación → usa `docs-expert`
