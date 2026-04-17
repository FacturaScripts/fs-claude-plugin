---
name: backend-developer
description: >
  Desarrolla componentes backend de FacturaScripts delegando al agente especializado
  `backend-developer`. ACTIVAR SIEMPRE que el usuario pida crear o modificar: modelos PHP
  (ModelClass, ModelOnChangeClass, BusinessDocument), tablas XML, Workers para eventos asíncronos,
  Cron jobs para tareas periódicas, migraciones de datos, validaciones en validate(), acceso a
  base de datos (DbQuery, Where, DataBaseWhere), relaciones entre modelos, traits de modelos,
  lógica contable (Asiento, Partida, Subcuenta, Ejercicio, CuentaEspecial, getSubcuenta,
  codejercicio, asientos contables, plan contable), o cualquier lógica de negocio en PHP para
  un plugin de FacturaScripts. No esperes a que el usuario mencione "backend" — si la tarea
  involucra crear/modificar un modelo, worker, cron, migración, asiento contable o lógica PHP
  del lado servidor, activa esta skill inmediatamente.
---

# Skill: backend-developer — Desarrollo backend de FacturaScripts

Esta skill conecta las peticiones de desarrollo backend del usuario con el agente
`backend-developer`, que tiene conocimiento profundo de la arquitectura de modelos,
workers, cron, migraciones y acceso a base de datos de FacturaScripts.

## Por qué usar el agente

El agente `backend-developer` conoce los patrones específicos de FacturaScripts para modelos
(herencia de ModelClass, traits, validaciones), workers (eventos automáticos y personalizados),
cron jobs (frecuencias, overlapping), migraciones y acceso a base de datos. Responder sin el
agente introduce riesgo de usar patrones PHP genéricos que no se alinean con el framework.

## Cómo invocar el agente

Usa el agente `backend-developer` pasándole la tarea del usuario:

```
Agente: backend-developer
Tarea: [descripción exacta de lo que necesita el usuario]
```

El agente:
1. Consulta la documentación en `./agents/docs/` para verificar patrones
2. Analiza el código existente del plugin si es necesario
3. Implementa el componente backend siguiendo las convenciones de FacturaScripts
4. Crea los archivos necesarios (Model, Table, Worker, Cron, Migration, Test)

## Qué tareas activan esta skill

- "Crea un modelo para almacenar pedidos personalizados"
- "Añade un worker que se ejecute cuando se guarde una factura"
- "Necesito un cron job que limpie registros antiguos cada noche"
- "Crea una migración para rellenar el campo estado con 'activo' por defecto"
- "¿Cómo hago una consulta con DbQuery para obtener los totales por cliente?"
- "Necesito validar que el CIF no se repita antes de guardar"
- "Crea un modelo con relación a la tabla de clientes"
- "Crea o modifica la lógica de asientos contables de un plugin"
- "Los asientos se están creando con la subcuenta del ejercicio incorrecto"
- "Necesito generar un asiento con partidas en el ejercicio correcto según la fecha del pago"
- "¿Cómo obtengo la subcuenta de una forma de pago para un ejercicio concreto?"
- "¿Cómo cargo o creo un ejercicio contable por fecha?"
- Cualquier tarea que involucre lógica PHP del lado servidor en FacturaScripts

## Cuándo NO activar esta skill

- Preguntas sobre XMLView, widgets o diseño de interfaces → usa `ui-designer`
- Preguntas sobre plantillas Twig, CSS o JavaScript → usa `frontend-developer`
- Preguntas sobre extensiones de otros plugins → usa `extension-developer`
- Preguntas sobre la API REST → usa `api-designer`
- Preguntas conceptuales sobre documentación → usa `docs-expert`
- Funcionalidades completas end-to-end → usa `fullstack-developer`
