# Crear Informe

name: crear-informe
description: Crea un informe personalizado con los datos de FacturaScripts que necesitas para tu análisis

## Descripción

Un skill flexible que te permite generar cualquier tipo de informe:
- Informes de ventas
- Análisis de clientes
- Reportes de inventario
- Estudios de rentabilidad
- Análisis de gastos
- Reportes fiscales

El skill pregunta qué tipo de informe necesitas y genera uno personalizado.

## Cómo usar

1. Activa el skill: `/crear-informe`
2. El skill te mostrará opciones de tipos de informe:
   - **Ventas:** Por período, cliente, producto, familia
   - **Clientes:** Frecuencia, rentabilidad, morosos
   - **Inventario:** Stock, rotación, productos sin venta
   - **Tesorería:** Flujo de caja, pagos, cobros
   - **Contabilidad:** Balance, resultados, por centro de coste
   - **Personalizados:** Define los datos exactos que necesitas

3. Responde a las preguntas:
   - **Tipo de informe:** Qué datos quieres
   - **Período:** Fecha inicio y fin
   - **Filtros:** Cliente, familia, almacén, etc. (opcional)
   - **Ordenar por:** Cómo quieres los datos
   - **Formato:** Markdown, tabla Excel, gráficos ASCII

4. El skill genera el informe

## Lo que necesita

- Conexión activa a FacturaScripts vía fs-mcp
- Datos suficientes en el período analizado

## Ejemplos de informes

### "Ventas por cliente en enero"
Muestra qué cliente compró cuánto:
```
Cliente          | Facturas | Total    | Ticket Promedio
Empresa A        | 5        | 5.000€   | 1.000€
Empresa B        | 3        | 3.500€   | 1.167€
```

### "Top 5 productos vendidos"
Ranking de productos más movidos:
```
Producto        | Cantidad | Total facturado | % del total
Producto A      | 500 un   | 10.000€         | 25%
Producto B      | 300 un   | 9.000€          | 22.5%
```

### "Análisis de rentabilidad de clientes"
Cuándo genera ganancia cada cliente:
```
Cliente    | Primer pago | Días a beneficio | Total facturado
Cliente A  | 20/02/2024  | 45 días          | 15.000€
Cliente B  | 10/03/2024  | 68 días          | 8.000€
```

### "Evolución de ventas mensual"
Cómo han crecido las ventas:
```
Mes       | Total facturado | vs Mes anterior
Enero     | 25.000€         | -
Febrero   | 28.000€         | +12%
Marzo     | 31.000€         | +10.7%
```

### "Análisis de gastos por concepto"
Dónde se va el dinero:
```
Concepto              | Importe | % del total
Compras               | 60.000€ | 60%
Gastos de personal    | 20.000€ | 20%
Servicios             | 12.000€ | 12%
Otros                 | 8.000€  | 8%
```

### "Deudores vs Acreedores"
Resumen de deudas:
```
Clientes que nos deben   | 15.000€
Nosotros debemos         | -22.000€
Neto a favor proveedores | -7.000€
```

## Informes predefinidos

El skill incluye:
- **Mensual:** Resumen de mes (ventas, gastos, cobros)
- **Trimestral:** Análisis de 3 meses
- **Anual:** Año fiscal completo
- **Comparativa:** Este vs. año anterior
- **KPI Dashboard:** Indicadores clave para directivos

## Personalización

Puedes pedir informes muy específicos:
- "Ventas de producto 'X' por mes durante 2024"
- "Clientes que no compraron en 3 meses"
- "Gastos en categoría 'Marketing' por agencia"
- "Tickets promedio por familia de producto"

Explica lo que necesitas y el skill diseña el informe.

## Formatos disponibles

### Markdown (predeterminado)
- Tablas formateadas
- Fácil de leer en pantalla
- Exportable a Word, PDF
- Compatible con plantillas

### Excel
- Descarga directa
- Gráficos automáticos
- Filtros interactivos
- Fácil edición

### ASCII (para terminal)
- Visualización en consola
- Copiar directamente a documentos
- Sin dependencias externas

### Gráficos
- Evoluciones temporales
- Comparativas en barras
- Pie charts para porcentajes

## Limitaciones

- Requiere fs-mcp conectado
- Máximo 2 años de análisis por informe (rendimiento)
- Algunos tipos requieren datos que puedas no tener

## Consejos

💡 Combina con otros skills:
- `/analizar-ventas` para análisis rápido
- `/clientes-morosos` para enfoque específico en cobros
- `/stock-bajo` para inventario

💡 Programa informes recurrentes con `/schedule`

💡 Exporta a Excel para compartir con equipo

💡 Guarda informes importantes en carpeta "Reportes"

💡 Para análisis histórico: pide comparativa con años anteriores

## Casos de uso comunes

### Directivo/Gerente
"Dame dashboard mensual con: ventas totales, top 3 clientes, gastos, cash flow proyectado"

### Comercial
"Top 10 clientes por volumen, con frecuencia de compra y promedio de gasto"

### Contador
"Balance y cuenta de resultados del trimestre, con comparativa vs trimestre anterior"

### Almacén
"Productos bajo stock, con prioridad de reorden y costo estimado"

### Recursos Humanos
"Gastos de personal por departamento y evolución mensual"
