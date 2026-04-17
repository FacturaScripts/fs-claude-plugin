---
name: extension-developer
description: >
  Crea extensiones de FacturaScripts delegando al agente especializado `extension-developer`.
  ACTIVAR SIEMPRE que el usuario pida modificar el comportamiento de modelos, controladores,
  vistas XMLView, tablas o plantillas Twig del core o de otros plugins SIN modificar su código
  fuente. Esto incluye: extensiones de controladores (hooks createViews, loadData,
  execPreviousAction, execAfterAction), extensiones de modelos (hooks saveInsert, saveUpdate,
  delete, validate), extensiones de XMLView (añadir columnas con overwrite), extensiones de
  tablas (añadir columnas), extensiones de vistas Twig (getIncludeViews), y Mods para documentos
  de compra/venta (SalesModInterface, PurchasesModInterface, CalculatorModInterface). Si el
  usuario dice "modificar", "extender", "añadir campo a" un controlador/modelo/vista del core
  o de otro plugin, activa esta skill inmediatamente.
---

# Skill: extension-developer — Extensiones de FacturaScripts

Esta skill conecta las peticiones de extensiones del usuario con el agente
`extension-developer`, especialista en el sistema de extensiones de FacturaScripts que
permite modificar el core y otros plugins sin tocar su código fuente.

## Por qué usar el agente

El agente `extension-developer` conoce los 5 tipos de extensiones de FacturaScripts
(controladores, modelos, XMLView, tablas y Twig), los hooks disponibles en cada tipo, las
convenciones de nombres, el registro en Init.php, y los Mods para documentos de compra/venta.
Crear extensiones sin este conocimiento puede resultar en hooks mal implementados o extensiones
que no se cargan correctamente.

## Cómo invocar el agente

```
Agente: extension-developer
Tarea: [descripción exacta de qué se quiere extender y cómo]
```

El agente:
1. Consulta la documentación de extensiones en `./agents/docs/`
2. Analiza la clase/vista objetivo para identificar hooks disponibles
3. Determina el tipo de extensión necesario (PHP, XMLView, Table, Twig, Mod)
4. Implementa la extensión siguiendo las convenciones
5. Registra en Init.php las extensiones PHP
6. Verifica la carga correcta de extensiones automáticas (XML, Twig)

## Qué tareas activan esta skill

- "Quiero añadir un campo nuevo al formulario de clientes"
- "Necesito ejecutar lógica adicional cuando se guarde una factura"
- "Añade una pestaña extra al EditCliente con información personalizada"
- "Quiero modificar el cálculo de impuestos en documentos de venta"
- "Necesito validar un campo extra antes de guardar un presupuesto"
- "Añade un botón de acción al listado de facturas"
- "Quiero inyectar un panel HTML en la vista de edición de productos"
- "Extiende la tabla de contactos con 2 campos nuevos"
- Cualquier tarea que implique modificar funcionalidad existente del core o plugins

## Cuándo NO activar esta skill

- Crear modelos/controladores/vistas nuevos desde cero → usa `fullstack-developer`
- Crear lógica backend nueva (no extensión) → usa `backend-developer`
- Crear plantillas Twig nuevas (no extensión) → usa `frontend-developer`
- Diseñar XMLViews nuevos (no extensión) → usa `ui-designer`
- Crear endpoints API nuevos → usa `api-designer`
- Documentación general → usa `docs-expert`

## Regla fundamental

> **Los plugins NUNCA deben modificar `Core/`** — extender siempre desde `Extension/`

Si el usuario pide "cambiar", "modificar" o "editar" algo del core, esta skill se encarga
de hacerlo correctamente mediante extensiones, respetando esta regla fundamental.
