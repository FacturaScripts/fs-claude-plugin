---
name: document-expert
description: >
  Usa este agente para trabajar con documentos de compra y venta en FacturaScripts: presupuestos,
  pedidos, albaranes y facturas (tanto de cliente como de proveedor). Especialista en
  BusinessDocument, BusinessDocumentLine, SalesDocument, PurchaseDocument, Calculator,
  CalculatorMod, Mods de cabecera/líneas (SalesModInterface, PurchasesModInterface,
  SalesLineModInterface), conversión entre documentos, estados de documentos, series, impuestos,
  retenciones y toda la lógica de negocio de documentos del ERP.
---

# Skill: document-expert — Especialista en documentos de compra/venta

Esta skill conecta las tareas relacionadas con documentos de negocio del usuario con el
agente `document-expert`, que domina la arquitectura de documentos de FacturaScripts:
presupuestos, pedidos, albaranes y facturas, tanto de ventas como de compras.

## Por qué usar el agente

El agente `document-expert` conoce en profundidad el sistema de documentos de FacturaScripts:
la herencia BusinessDocument/BusinessDocumentLine, el Calculator como motor central de cálculos,
los CalculatorMod para personalizar cálculos, los Mods de interfaz (SalesModInterface,
SalesLineModInterface, PurchasesModInterface) para añadir campos al formulario, la conversión
entre documentos, y la creación programática de facturas. Estos patrones son exclusivos de
FacturaScripts y no tienen equivalente en otros frameworks PHP.

## Cómo invocar el agente

Usa el agente `document-expert` pasándole la tarea del usuario:

```
Agente: document-expert
Tarea: [descripción exacta de lo que necesita el usuario]
```

El agente:
1. Consulta la documentación en `./agents/docs/` (calculator, facturas-api, diagramas-de-tablas)
2. Analiza el código fuente del core: BusinessDocument, Calculator, SalesModInterface
3. Implementa la personalización de documentos requerida
4. Crea los archivos necesarios (CalculatorMod, Mods de interfaz, registro en Init.php)

## Qué tareas activan esta skill

- "Añade un campo 'proyecto' a la cabecera de las facturas de venta"
- "Necesito un descuento automático por volumen en las líneas"
- "¿Cómo creo una factura programáticamente desde un plugin?"
- "Quiero personalizar el cálculo del IVA para ciertos productos"
- "¿Cómo convierto un presupuesto a pedido?"
- "Necesito añadir un campo 'centro_coste' a las líneas de factura"
- "¿Cómo funciona el Calculator de FacturaScripts?"
- "¿Cuál es la diferencia entre Mods y Extensiones para documentos?"
- "Necesito crear facturas de proveedor desde la API REST"
- "¿Cómo añado un botón en el formulario de facturas?"
- Cualquier tarea que involucre presupuestos, pedidos, albaranes o facturas

## Cuándo NO activar esta skill

- Crear modelos que no son documentos de compra/venta → usa `backend-developer`
- Preguntas sobre XMLView genérico → usa `ui-designer`
- Preguntas sobre extensiones que no son de documentos → usa `extension-developer`
- Preguntas sobre consultas SQL → usa `sql-expert`
- Preguntas conceptuales sobre documentación → usa `docs-expert`
