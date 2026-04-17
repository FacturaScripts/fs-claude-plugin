---
name: sql-expert
description: >
  Usa este agente para cualquier tarea relacionada con base de datos en FacturaScripts: diseñar
  esquemas de tabla XML, optimizar consultas con DbQuery y Where, crear índices y constraints,
  escribir migraciones SQL, analizar rendimiento de queries, usar transacciones, trabajar con
  DataBaseWhere/DataBase/DbQuery, diseñar relaciones entre tablas (belongsTo, hasMany), y resolver
  problemas de rendimiento en MySQL/PostgreSQL. Especialista en la capa de datos del ERP.
---

# Skill: sql-expert — Especialista en base de datos de FacturaScripts

Esta skill conecta las tareas de base de datos del usuario con el agente `sql-expert`,
que domina el sistema de acceso a datos de FacturaScripts: DbQuery, Where, DataBaseWhere,
definición XML de tablas, migraciones y optimización de consultas para MySQL y PostgreSQL.

## Por qué usar el agente

El agente `sql-expert` conoce las particularidades del acceso a datos en FacturaScripts:
el constructor DbQuery (que difiere de Eloquent o Doctrine), la clase Where con sus métodos
estáticos, DataBaseWhere para filtrar en modelos, la definición de tablas en XML (no en
migraciones PHP como Laravel), las transacciones no anidadas, y los patrones de optimización
específicos del ERP. Responder sin el agente introduce riesgo de aplicar patrones de otros
frameworks que no son compatibles.

## Cómo invocar el agente

Usa el agente `sql-expert` pasándole la tarea del usuario:

```
Agente: sql-expert
Tarea: [descripción exacta de lo que necesita el usuario]
```

El agente:
1. Consulta la documentación en `./agents/docs/` (acceso-a-la-base-de-datos, dbquery, definición de tablas, relaciones, migraciones)
2. Analiza el esquema de tablas existente si es necesario
3. Implementa la solución siguiendo las convenciones de FacturaScripts
4. Crea los archivos necesarios (Table XML, migraciones, índices, queries)

## Qué tareas activan esta skill

- "Diseña la tabla XML para almacenar proyectos con relación a clientes"
- "Optimiza esta consulta que tarda mucho en ejecutarse"
- "¿Cómo hago un JOIN con DbQuery?"
- "Crea un índice para mejorar la búsqueda por fecha y cliente"
- "Necesito una migración para cambiar el tipo de una columna"
- "¿Cómo uso transacciones en FacturaScripts?"
- "¿Cuál es la diferencia entre DbQuery y DataBaseWhere?"
- "Diseña las relaciones entre mis tablas de proyectos y tareas"
- "¿Cómo hago una consulta agregada con SUM y GROUP BY?"
- Cualquier tarea que involucre diseño de tablas, consultas SQL o rendimiento de base de datos

## Cuándo NO activar esta skill

- Crear modelos PHP completos (Model + Table + validate) → usa `backend-developer`
- Preguntas sobre XMLView o interfaz → usa `ui-designer`
- Preguntas sobre API REST → usa `api-designer`
- Preguntas conceptuales sobre documentación → usa `docs-expert`
- Funcionalidades completas end-to-end → usa `fullstack-developer`
