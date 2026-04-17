---
name: analizar-bug
description: >
  Analiza y corrige bugs en plugins de FacturaScripts. ACTIVAR cuando el usuario describa
  un comportamiento incorrecto, algo que "no funciona como debería", un error inesperado,
  datos incorrectos generados por el código, o pida "revisa el plugin", "busca el error",
  "algo falla", "hay un problema con", "verifica el código", "comprueba dónde está el fallo".
  También activa cuando Claude necesite explorar código de un plugin FacturaScripts para
  entender su funcionamiento antes de modificarlo. No esperes a que el usuario use la palabra
  "bug" — cualquier descripción de comportamiento incorrecto o inesperado en un plugin de
  FacturaScripts activa esta skill. Orquesta docs-expert (comportamiento esperado según
  el framework), backend-developer (análisis y corrección del código) y testing-expert
  (test que reproduce y verifica la corrección del bug).
---

# Skill: analizar-bug — Localización y corrección de bugs en FacturaScripts

Esta skill orquesta los agentes especializados para localizar, entender y corregir bugs
en plugins de FacturaScripts de forma sistemática, garantizando que la corrección sea
coherente con los patrones del framework y quede cubierta por un test.

## Por qué usar agentes en lugar de investigar directamente

Cuando hay un bug, la tentación es leer el código directamente y arreglarlo. Pero sin el
contexto del framework es fácil:

- Confundir comportamiento correcto de FacturaScripts con el bug
- Arreglar el síntoma sin entender la causa raíz
- Introducir una corrección que rompe otro comportamiento del framework
- Escribir el test de verificación sin conocer los patrones de test del ERP

Los agentes especializados evitan estos errores porque conocen los patrones del ERP.

## Flujo de análisis de bugs

### Paso 1 — Entender el comportamiento esperado (`docs-expert`)

Antes de mirar el código incorrecto, entender qué debería hacer según el framework:

```
Agente: docs-expert
Tarea: ¿Cómo debería funcionar [módulo/clase afectado] en FacturaScripts?
       Busca documentación sobre [concepto involucrado: Asiento, Ejercicio, Subcuenta,
       getSubcuenta, codejercicio, modelo afectado, etc.].
```

### Paso 2 — Analizar y corregir el código (`backend-developer`)

Con el comportamiento esperado claro, buscar la causa raíz en el código:

```
Agente: backend-developer
Tarea: Analiza el bug en [archivo/método]. El comportamiento esperado es [X],
       pero el comportamiento real es [Y]. Lee el código en [ruta] y localiza
       la causa raíz. Propón y aplica la corrección mínima necesaria sin
       introducir cambios fuera del alcance del bug.
```

### Paso 3 — Escribir un test que verifique la corrección (`testing-expert`)

Una vez corregido, un test que habría fallado antes de la corrección y pasa después:

```
Agente: testing-expert
Tarea: Escribe un test PHPUnit que reproduzca el bug corregido:
       [descripción del caso]. El test debe verificar [comportamiento correcto].
       Añádelo en [archivo de test existente: Test/main/XxxTest.php].
       Sigue los patrones del proyecto: DefaultSettingsTrait, RandomDataTrait,
       LogErrorsTrait y los helpers existentes del test.
```

## Qué activa esta skill

- "Algo no funciona como debería en mi plugin"
- "Busca el error en este código"
- "Revisa el plugin, hay un problema con [módulo]"
- "Los asientos contables aparecen en el ejercicio incorrecto"
- "Los datos generados son incorrectos"
- "Hay un bug al crear/guardar/eliminar [modelo]"
- "El worker no se ejecuta correctamente"
- "La migración no aplica los datos bien"
- "El cálculo del documento da un resultado incorrecto"
- "Las subcuentas no corresponden al ejercicio correcto"
- "Verifica y comprueba dónde puede estar el posible error"
- "Genera un test para probar este caso"
- Cualquier descripción de comportamiento inesperado o incorrecto en un plugin

## Cuándo NO activar esta skill

- El usuario quiere crear funcionalidad nueva → usa `backend-developer` o `fullstack-developer`
- El usuario tiene dudas conceptuales sin código que revisar → usa `docs-expert`
- El error es de sintaxis PHP evidente → corrígelo directamente
- El usuario solo quiere mejorar tests existentes sin bug que reproducir → usa `testing-expert`
