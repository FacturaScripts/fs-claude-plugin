---
name: frontend-developer
description: >
  Desarrolla la capa frontend de FacturaScripts delegando al agente especializado
  `frontend-developer`. ACTIVAR SIEMPRE que el usuario pida crear o modificar: plantillas
  Twig (.html.twig), herencia de plantillas (MenuTemplate, MicroTemplate), JavaScript
  personalizado, CSS/SCSS, integración con Bootstrap 5, gestión de assets con AssetManager,
  funciones Twig personalizadas (Html::addFunction), macros Twig, o extensiones de vistas
  Twig (getIncludeViews). No esperes a que el usuario mencione "frontend" — si la tarea
  involucra plantillas Twig, JavaScript, CSS o assets visuales, activa esta skill inmediatamente.
---

# Skill: frontend-developer — Desarrollo frontend de FacturaScripts

Esta skill conecta las peticiones de desarrollo frontend del usuario con el agente
`frontend-developer`, que tiene conocimiento profundo del sistema de plantillas Twig,
gestión de assets y patrones de UI de FacturaScripts.

## Por qué usar el agente

El agente `frontend-developer` conoce la herencia de plantillas Twig específica de
FacturaScripts (MenuTemplate, MicroTemplate), las funciones Twig disponibles (trans, asset,
formToken, number, money, settings), el AssetManager para registrar CSS/JS, y los patrones
de extensión de vistas. Responder sin el agente puede generar plantillas incompatibles con
el sistema de herencia del framework.

## Cómo invocar el agente

```
Agente: frontend-developer
Tarea: [descripción exacta de lo que necesita el usuario]
```

El agente:
1. Consulta la documentación en `./agents/docs/` (vistas HTML, herencia, AssetManager)
2. Analiza las plantillas existentes del plugin
3. Implementa la solución frontend siguiendo las convenciones de FacturaScripts
4. Crea los archivos necesarios (View/*.html.twig, Assets/CSS/, Assets/JS/)

## Qué tareas activan esta skill

- "Crea una vista Twig personalizada para mi controlador"
- "Necesito un dashboard con gráficos usando JavaScript"
- "Añade un archivo CSS personalizado al plugin"
- "Crea una función Twig para formatear fechas de forma especial"
- "Necesito un formulario AJAX que envíe datos sin recargar la página"
- "Quiero extender la plantilla de EditCliente con un panel extra"
- "Añade un script JavaScript que valide el formulario en cliente"
- Cualquier tarea que involucre Twig, HTML, CSS, JavaScript o assets visuales

## Cuándo NO activar esta skill

- Definición de XMLViews (columnas, widgets, filtros) → usa `ui-designer`
- Modelos PHP, workers o lógica de negocio → usa `backend-developer`
- Extensiones PHP de controladores/modelos → usa `extension-developer`
- Endpoints de API REST → usa `api-designer`
- Funcionalidades completas end-to-end → usa `fullstack-developer`
