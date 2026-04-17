# Analizar Ventas

name: analizar-ventas
description: Analiza las ventas del período y genera un informe ejecutivo con cifras clave, comparativas y tendencias

## Descripción

Este skill genera un informe completo de ventas que incluye:
- Total facturado en el período
- Comparativa con períodos anteriores
- Top 10 clientes por facturación
- Top 10 productos más vendidos
- Tiempo promedio hasta beneficios
- Tendencias y recomendaciones

Perfecto para contables, gerentes y directores comerciales que necesitan entender el desempeño de ventas.

## Cómo usar

1. Activa el skill: `/analizar-ventas`
2. Responde las preguntas:
   - **Período a analizar:** Fecha inicio y fin (ej: "enero 2024" o "1/1/2024 al 31/1/2024")
   - **¿Incluir análisis de rentabilidad?** Sí/No
   - **¿Comparar con períodos anteriores?** Sí/No

3. El skill procesará los datos y generará un informe markdown

## Lo que necesita

- Conexión activa a FacturaScripts vía fs-mcp
- Al menos facturas de clientes en el período

## Información que obtendrás

### Resumen ejecutivo
- Total facturado en el período
- Número de facturas
- Ticket medio (factura promedio)
- Comparativa vs período anterior (% aumento/disminución)

### Top clientes
Tabla con los 10 mejores clientes por volumen facturado:
- Cliente
- Total facturado
- Número de transacciones
- Ticket promedio

### Top productos
Tabla con los 10 productos más vendidos:
- Referencia
- Descripción
- Cantidad vendida
- Total facturado
- % del total de ventas

### Análisis de rentabilidad (opcional)
- Clientes más rentables (tiempo hasta primera ganancia)
- Clientes con mayor volumen de facturación
- Recomendaciones de fidelización

### Tendencias
- Evolución de ventas por mes (si período > 1 mes)
- Estacionalidad (si hay datos de años anteriores)
- Recomendaciones basadas en patrones

## Formato del informe

El informe se genera en **markdown** para que puedas:
- Exportar a Word o PDF
- Compartir con equipo
- Imprimir directamente

## Limitaciones

- Requiere fs-mcp conectado a FacturaScripts
- Máximo 1 año de análisis por informe
- No incluye proyecciones futuras

## Consejos

💡 Ejecuta este skill mensualmente para seguimiento de KPIs de ventas

💡 Combina con `/crear-informe` para informes más personalizados

💡 Los datos se actualizan en tiempo real desde FacturaScripts
