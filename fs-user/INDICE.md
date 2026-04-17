# Índice del Plugin fs-user

Guía rápida de contenidos y cómo acceder a cada parte.

## Agentes

### fs-reporting-analyst
**Rol:** Analista de datos y reportes
**Acceso:** `/fs-reporting-analyst`

Úsalo cuando necesites:
- Analizar cifras de ventas
- Entender rentabilidad de clientes
- Ver tendencias de negocio
- Interpretar datos desde perspectiva comercial

Accede a:
- Facturas de clientes
- Histórico de cobros
- Análisis de productos más vendidos
- Rentabilidad de clientes

---

### fs-erp-guide
**Rol:** Asistente de uso del ERP
**Acceso:** `/fs-erp-guide`

Úsalo cuando necesites:
- Saber cómo hacer una operación
- Entender un concepto contable
- Encontrar dónde hacer algo en el ERP
- Aprender buenas prácticas

Consulta automáticamente:
- Guías de procedimientos
- Explicaciones de conceptos
- Paso a paso de operaciones

---

## Documentación

### Guía de Facturación
**Archivo:** `/agents/docs/guia-facturacion.md`

Temas:
- Flujo de venta (presupuesto → pedido → albarán → factura)
- Cómo crear facturas
- Formas de pago y vencimientos
- Registro de cobros
- Devoluciones y abonos
- Consulta de histórico

---

### Guía de Clientes
**Archivo:** `/agents/docs/guia-clientes.md`

Temas:
- Crear y gestionar clientes
- Grupos de clientes
- Agentes comerciales
- Contactos dentro de un cliente
- Direcciones de envío
- Historial y deuda

---

### Guía de Inventario
**Archivo:** `/agents/docs/guia-inventario.md`

Temas:
- Crear productos y familias
- Atributos y variantes
- Gestión de almacenes
- Stock y alertas
- Tarifas de precios
- Análisis de rotación

---

### Guía de Compras
**Archivo:** `/agents/docs/guia-compras.md`

Temas:
- Crear proveedores
- Pedidos a proveedores
- Albaranes de entrada
- Facturas de proveedor
- Devoluciones
- Gestión de pagos

---

### Guía de Contabilidad
**Archivo:** `/agents/docs/guia-contabilidad.md`

Temas:
- Plan contable y cuentas
- Subcuentas
- Asientos contables
- Cuentas especiales (IVA, bancos)
- Conciliación bancaria
- Reportes fiscales
- Fin de ejercicio

---

## Skills

### analizar-ventas
**Acceso:** `/analizar-ventas`

Genera informe con:
- Total facturado en período
- Comparativa con períodos anteriores
- Top 10 clientes
- Top 10 productos
- Análisis de rentabilidad
- Tendencias y recomendaciones

**Perfecto para:** Análisis mensuales, reportes de gerencia, evaluación de desempeño

---

### clientes-morosos
**Acceso:** `/clientes-morosos`

Muestra:
- Clientes con deuda pendiente
- Días de retraso
- Categorización de urgencia (CRÍTICO, ALTO, MEDIO, MONITOR)
- Recomendaciones de acción por cada nivel

**Perfecto para:** Gestión de cobros, seguimiento de deudores, priorización de contactos

---

### stock-bajo
**Acceso:** `/stock-bajo`

Detecta:
- Productos bajo stock mínimo
- Cantidad a reordenar
- Productos sin venta
- Análisis de rotación

**Perfecto para:** Gestión de inventario, compras, reposición de almacén

---

### crear-informe
**Acceso:** `/crear-informe`

Crea cualquier tipo de informe:
- Por ventas, clientes, inventario, tesorería, contabilidad
- Períodos personalizables
- Múltiples formatos (Markdown, Excel, gráficos)
- Filtros por cliente, familia, almacén, etc.

**Perfecto para:** Informes ejecutivos, análisis específicos, reportes personalizados

---

### como-usar-erp
**Acceso:** `/como-usar-erp`

Responde preguntas sobre:
- Cómo hacer operaciones en FacturaScripts
- Explicación de conceptos
- Procedimientos paso a paso
- Localización de funciones

**Perfecto para:** Aprendizaje, resolución de dudas, soporte de usuarios

---

## Flujos de trabajo recomendados

### Contador - Cierre Mensual
1. Ejecuta `/analizar-ventas` → Cifras de facturación
2. Ejecuta `/crear-informe` → Tipo "Estado de resultados"
3. Consulta `/agents/docs/guia-contabilidad.md` → Para validar asientos

### Comercial - Seguimiento de Cartera
1. Ejecuta `/analizar-ventas` → Ver clientes top
2. Ejecuta `/clientes-morosos` → Ver deudores
3. Usa `/fs-reporting-analyst` → Análisis de tendencias

### Gerencia - Dashboard
1. Ejecuta `/crear-informe` → Tipo "Dashboard"
2. Accede a `/fs-reporting-analyst` → Para análisis profundo
3. Obtiene insight de negocio

### Almacén - Reposición
1. Ejecuta `/stock-bajo` → Qué productos reponer
2. Consulta `/agents/docs/guia-compras.md` → Cómo crear pedido
3. Ejecuta `/como-usar-erp` → Si necesita más detalles

### Usuario Nuevo - Aprendizaje
1. Inicia con `/como-usar-erp` → Aprende operaciones
2. Lee `/agents/docs/` → Guías por módulo
3. Práctica en FacturaScripts
4. Usa `/fs-reporting-analyst` → Valida que está entendiendo los datos

---

## Búsqueda rápida

### Necesito...

**...saber mis cifras de ventas**
→ `/analizar-ventas` o `/crear-informe`

**...gestionar cobros**
→ `/clientes-morosos`

**...ver estado de inventario**
→ `/stock-bajo`

**...un informe personalizado**
→ `/crear-informe`

**...aprender a hacer algo**
→ `/como-usar-erp` o `/agents/docs/guia-*.md`

**...analizar rentabilidad de clientes**
→ `/fs-reporting-analyst`

**...entender un concepto contable**
→ `/fs-erp-guide` o `/agents/docs/guia-contabilidad.md`

**...crear un cliente**
→ `/como-usar-erp` o `/agents/docs/guia-clientes.md`

**...registrar una factura de proveedor**
→ `/como-usar-erp` o `/agents/docs/guia-compras.md`

**...gestionar stock**
→ `/stock-bajo` o `/agents/docs/guia-inventario.md`

---

## Notas importantes

- Todos los skills requieren que fs-mcp esté conectado a FacturaScripts
- Los datos siempre son en **tiempo real** (acceso directo a la base de datos)
- Los skills **no modifican** datos, solo leen
- Las guías son **independientes** de si tienes conexión o no
- Puedes combinar múltiples skills para análisis complejos

---

## Estructura de archivos

```
fs-user/
├── README.md                     ← Descripción general
├── INDICE.md                     ← Este archivo
├── .claude-plugin/plugin.json    ← Configuración
├── hooks/hooks.json              ← Detección automática
├── scripts/detect-facturascripts.sh  ← Verificación conexión
├── agents/
│   ├── fs-reporting-analyst.md   ← Agente de análisis
│   ├── fs-erp-guide.md           ← Agente de ayuda
│   └── docs/
│       ├── guia-facturacion.md   ← Módulo de ventas
│       ├── guia-clientes.md      ← Gestión de clientes
│       ├── guia-inventario.md    ← Gestión de stock
│       ├── guia-compras.md       ← Módulo de compras
│       └── guia-contabilidad.md  ← Contabilidad
└── skills/
    ├── analizar-ventas/SKILL.md
    ├── clientes-morosos/SKILL.md
    ├── stock-bajo/SKILL.md
    ├── crear-informe/SKILL.md
    └── como-usar-erp/SKILL.md
```

---

## Versión del plugin

**fs-user v0.1.0** - Versión inicial del plugin para usuarios finales de FacturaScripts
