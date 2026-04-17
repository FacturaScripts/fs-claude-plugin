---
name: ui-designer
description: >
  Diseña interfaces de usuario de FacturaScripts delegando al agente especializado
  `ui-designer`. ACTIVAR SIEMPRE que el usuario pida crear o modificar: archivos XMLView
  (columnas, widgets, grupos, filas), definir widgets (text, select, autocomplete, money,
  date, checkbox, textarea, color, password, file, link, datalist), configurar filtros
  (addFilterSelect, addFilterCheckbox, addFilterSelectWhere, addFilterNumber, addFilterPeriod),
  definir filas de estado (row-status), acciones (row-actions), estadísticas (row-statistics),
  cabeceras/pies (row-header/footer), o crear modales en XMLView. Si la tarea es sobre cómo
  se ve o se interactúa con un formulario o listado en FacturaScripts, activa esta skill.
---

# Skill: ui-designer — Diseño de interfaces de FacturaScripts

Esta skill conecta las peticiones de diseño de interfaz del usuario con el agente
`ui-designer`, que tiene conocimiento profundo del sistema de XMLView, widgets, filtros
y filas de FacturaScripts.

## Por qué usar el agente

El agente `ui-designer` conoce todos los widgets disponibles (text, number, money, date,
select, autocomplete, checkbox, etc.), sus atributos, los tipos de filtros, las filas de
estado/acciones/estadísticas, los modales y la distribución responsive con numcolumns.
Diseñar interfaces sin este conocimiento puede resultar en widgets incorrectos o layouts
mal estructurados.

## Cómo invocar el agente

```
Agente: ui-designer
Tarea: [descripción exacta del diseño de interfaz necesario]
```

El agente:
1. Consulta la documentación de widgets, columnas, filas y filtros
2. Analiza los XMLViews existentes para mantener coherencia visual
3. Diseña la estructura del XMLView con widgets apropiados
4. Define filtros útiles para el controlador
5. Añade filas de estado, acciones y estadísticas según corresponda

## Qué tareas activan esta skill

- "Diseña el formulario de edición para mi modelo Proyecto"
- "Quiero un listado con filtros por estado, fecha y cliente"
- "Añade un widget autocomplete para buscar productos"
- "Necesito filas de colores según el estado del registro"
- "Crea un modal para importar datos desde CSV"
- "¿Qué widget debo usar para un campo de importe?"
- "Reorganiza las columnas del formulario en grupos"
- "Añade botones de acción en la barra del listado"
- Cualquier tarea sobre diseño visual de formularios o listados en FacturaScripts

## Cuándo NO activar esta skill

- Plantillas Twig personalizadas, CSS o JavaScript → usa `frontend-developer`
- Lógica del modelo o base de datos → usa `backend-developer`
- Extensiones de XMLView de otros plugins → usa `extension-developer`
- Funcionalidades completas end-to-end → usa `fullstack-developer`
- Endpoints de API → usa `api-designer`
