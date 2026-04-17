---
name: testing-expert
description: >
  ACTIVAR SIEMPRE que el usuario mencione tests, PHPUnit, TestCase, archivos *Test.php, o
  pida revisar, crear, comprobar, completar o verificar tests en FacturaScripts. No esperes
  a que el usuario pida "escribir un test" explícitamente — cualquier pregunta sobre si
  existe un test para una funcionalidad, si falta cobertura, o si un comportamiento está
  probado activa esta skill. Úsalo para: revisar tests existentes y detectar casos que
  faltan, escribir tests PHPUnit para modelos y controladores, ejecutar tests (fsmaker test,
  composer test), análisis estático con PHPStan, verificación de estilo con CS-Check/CS-Fix,
  diagnóstico de errores en plugins, modo debug (FS_DEBUG), logging con Tools::log(), y
  verificación de que extensiones, migraciones y workers funcionan correctamente. También
  cubre tests contables: asientos (Asiento, Partida), subcuentas (Subcuenta, codejercicio),
  ejercicios (Ejercicio, loadFromDate, installAccountingPlan), tests multi-ejercicio
  (documento en un año, pago en otro), uso de DefaultSettingsTrait, RandomDataTrait,
  LogErrorsTrait y el patrón ensureExerciseWithAccountingPlan. Agente de control de calidad
  del equipo.
---

# Skill: testing-expert — Especialista en testing y calidad de FacturaScripts

Esta skill conecta las tareas de testing y calidad del usuario con el agente `testing-expert`,
que domina PHPUnit en FacturaScripts, PHPStan, CS-Check, modo debug y diagnóstico de errores.

## Por qué usar el agente

El agente `testing-expert` conoce la estructura de tests específica de FacturaScripts:
la carpeta `Test/` con escenarios (`main/`, `con-otro-plugin/`), los archivos `install-plugins.txt`,
el namespace `FacturaScripts\Test\Plugins`, los patrones de test para modelos (CRUD, validación,
relaciones, sanitización), el nivel de PHPStan habitual (5-6), las reglas PSR-12 del framework,
y las herramientas fsmaker para testing. Estos patrones son propios del ERP y no se encuentran
en documentación genérica de PHPUnit.

## Cómo invocar el agente

Usa el agente `testing-expert` pasándole la tarea del usuario:

```
Agente: testing-expert
Tarea: [descripción exacta de lo que necesita el usuario]
```

El agente:
1. Consulta la documentación en `./agents/docs/` (testeo-de-plugins, gestion-de-errores, la-clase-tools)
2. Analiza los tests existentes del plugin
3. Implementa tests o ejecuta herramientas de calidad
4. Reporta resultados con métricas claras

## Qué tareas activan esta skill

- "Escribe tests PHPUnit para mi modelo Proyecto"
- "Ejecuta PHPStan y corrige los errores"
- "Verifica que mi código cumple PSR-12"
- "¿Cómo activo el modo debug en FacturaScripts?"
- "Mi extensión no se está aplicando, ¿cómo lo diagnostico?"
- "Necesito tests para verificar que el worker se ejecuta correctamente"
- "¿Cómo uso Tools::log() para depurar mi plugin?"
- "La tabla no se crea al instalar el plugin, ¿qué puede ser?"
- "Crea tests de validación para datos inválidos (XSS, campos vacíos, duplicados)"
- "¿Cómo configuro install-plugins.txt para mis tests?"
- "Escribe un test que verifique los asientos contables de los prepagos"
- "Necesito un test con un documento en 2025 y un pago en 2026 (ejercicios distintos)"
- "¿Cómo uso DefaultSettingsTrait e installAccountingPlan en mis tests?"
- "El test necesita que existan ejercicios contables, ¿cómo los creo si no existen?"
- "Verifica que las subcuentas de las partidas pertenecen al ejercicio correcto"
- "Añade el test para este caso en el archivo PrePagoCliTest o PrePagoProvTest existente"
- Cualquier tarea que involucre testing, calidad de código o diagnóstico de errores

## Cuándo NO activar esta skill

- Crear modelos o lógica de negocio → usa `backend-developer`
- Diseñar interfaces XMLView → usa `ui-designer`
- Optimizar consultas SQL → usa `sql-expert`
- Trabajar con documentos de compra/venta → usa `document-expert`
- Preguntas conceptuales sobre documentación → usa `docs-expert`
