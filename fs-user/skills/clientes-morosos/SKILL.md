---
name: clientes-morosos
description: Identifica clientes con deuda pendiente y genera un informe de cobro con prioridades de seguimiento
---

## Descripción

Este skill detecta automáticamente:
- Clientes con facturas impagadas
- Días de retraso en pago
- Importe total pendiente por cliente
- Tendencia de morosidad

Genera un informe accionable para que el área de cobros pueda priorizar seguimiento.

## Cómo usar

1. Activa el skill: `/clientes-morosos`
2. El skill procesará automáticamente
3. Responde (opcional):
   - **¿Incluir solo clientes con retraso?** (Sí/No)
   - **Ordenar por:** Importe o Días de retraso

4. Recibirás tabla con clientes pendientes de pago

## Lo que necesita

- Conexión activa a FacturaScripts vía fs-mcp
- Facturas de clientes registradas

## Información que obtendrás

### Tabla de morosos
Columnas:
- **Cliente:** Nombre y CIF
- **Importe pendiente:** Dinero que debe
- **Días de retraso:** Cuánto tiempo retrasado
- **Última factura:** Número y fecha
- **Próximo vencimiento:** Si hay facturas próximas

### Resumen estadístico
- Total deuda pendiente
- Número de clientes morosos
- Promedio de días de retraso
- Cliente con mayor deuda
- Cliente con mayor retraso

### Categorización por urgencia
- 🔴 **CRÍTICO:** > 90 días sin pagar
- 🟠 **ALTO:** 30-90 días sin pagar
- 🟡 **MEDIO:** < 30 días de retraso
- 🟢 **MONITOR:** Próximo a vencer

## Cómo interpretar

### Urgencia de cobro
- **CRÍTICO:** Contacto inmediato, posible acciones legales
- **ALTO:** Llamada telefónica urgente
- **MEDIO:** Email de recordatorio + llamada
- **MONITOR:** Anticipar cobro antes de vencer

### Importe pendiente
El total que el cliente debe de todas sus facturas impagadas (no solo vencidas).

### Días de retraso
Días desde el vencimiento original hasta hoy.
Negativo = aún no venció, positivo = retrasado

## Estrategia de cobro

Usa este informe para:
1. **Priorizar contactos:** Empieza por CRÍTICO
2. **Documentar:** Guarda el informe para referencia
3. **Seguimiento:** Crea tareas con las fechas de vencimiento
4. **Escalado:** Casos CRÍTICO → abogado o gestoría

## Limitaciones

- Solo muestra clientes con deuda
- No incluye pagos parciales de hace poco
- No predice quién dejará de pagar

## Consejos

💡 Ejecuta este skill semanalmente

💡 Exporta a Excel para compartir con cobranza

💡 Combina con `/crear-informe` para análisis histórico de morosidad

💡 Usa los contactos de clientes para llamadas de recordatorio

## Acciones recomendadas por urgencia

### CRÍTICO (> 90 días)
- Contacto telefónico inmediato
- Email certificado
- Considerar acciones legales
- Escalado a gerencia

### ALTO (30-90 días)
- Llamada telefónica
- Email de recordatorio
- Ofrecimiento de plan de pago
- Retención de nuevos pedidos

### MEDIO (< 30 días)
- Email de recordatorio
- Mención en próxima comunicación
- Monitoreo cercano

### MONITOR (próximo a vencer)
- Sin acción inmediata
- Preparar cobro cercano
