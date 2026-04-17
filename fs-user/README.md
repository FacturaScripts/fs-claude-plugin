# Plugin fs-user para FacturaScripts

Plugin para usuarios finales del ERP FacturaScripts en Claude Code. Dirigido a contables, administrativos y comerciales que necesitan analizar datos, generar informes y recibir asistencia en el uso del sistema.

## Características

### Agentes especializados

- **fs-reporting-analyst:** Analista de datos especializado en FacturaScripts
  - Accede a datos reales usando herramientas MCP
  - Genera informes ejecutivos con KPIs
  - Interpreta datos desde perspectiva de negocio
  - Domina conceptos contables y análisis de ventas

- **fs-erp-guide:** Asistente de uso del ERP
  - Responde preguntas sobre cómo hacer operaciones
  - Guía paso a paso en procedimientos
  - Explica conceptos y términos contables
  - Proporciona buenos prácticas

### Documentación integrada

5 guías completas en `agents/docs/`:

- **guia-facturacion.md:** Módulo de ventas (presupuestos, pedidos, albaranes, facturas, cobros)
- **guia-clientes.md:** Gestión de clientes, grupos, agentes, contactos
- **guia-inventario.md:** Productos, familias, atributos, variantes, almacenes, stock, tarifas
- **guia-compras.md:** Proveedores, pedidos, albaranes, facturas de proveedor, pagos
- **guia-contabilidad.md:** Plan contable, asientos, cuentas especiales, conciliación, reportes

### Skills para usuarios

- **analizar-ventas:** Informe de ventas con cifras clave, top clientes, productos más vendidos
- **clientes-morosos:** Detecta clientes con deuda pendiente y días de retraso
- **stock-bajo:** Alerta de productos bajo stock mínimo y productos sin venta
- **crear-informe:** Generador flexible de informes personalizados
- **como-usar-erp:** Asistente de ayuda para resolver dudas de uso

## Estructura del proyecto

```
fs-user/
├── .claude-plugin/
│   └── plugin.json              # Metadatos del plugin
├── hooks/
│   └── hooks.json               # Hook de detección automática
├── scripts/
│   └── detect-facturascripts.sh # Script de verificación de conexión
├── agents/
│   ├── fs-reporting-analyst.md  # Agente de análisis
│   ├── fs-erp-guide.md          # Agente de ayuda
│   └── docs/                    # Documentación de usuario
│       ├── guia-facturacion.md
│       ├── guia-clientes.md
│       ├── guia-inventario.md
│       ├── guia-compras.md
│       └── guia-contabilidad.md
└── skills/
    ├── analizar-ventas/
    ├── clientes-morosos/
    ├── stock-bajo/
    ├── crear-informe/
    └── como-usar-erp/
```

## Requisitos

- Claude Code (versión reciente)
- Plugin **fs-mcp** instalado y configurado
- Una instancia de FacturaScripts con conexión activa

## Instalación

1. Copiar el plugin `fs-user` a la carpeta de plugins de Claude Code
2. Instalar el plugin desde la interfaz de Claude Code
3. Asegurar que **fs-mcp** esté instalado y con al menos una conexión configurada

## Uso

### Al iniciar una sesión

El hook `SessionStart` ejecuta automáticamente:
- Detecta si hay una conexión a FacturaScripts configurada
- Muestra el estado de la conexión
- Sugiere configurar conexión si no la hay

### Acceder a un agente

```
/fs-reporting-analyst    # Para análisis de datos
/fs-erp-guide            # Para ayuda de uso
```

### Ejecutar un skill

```
/analizar-ventas         # Informe de ventas
/clientes-morosos        # Clientes con deuda
/stock-bajo              # Productos bajo stock
/crear-informe           # Informe personalizado
/como-usar-erp           # Asistencia general
```

## Ejemplos de uso

### Analista de reportes
Usuario: "Necesito conocer mis mejores clientes del trimestre"
→ Ejecuta `/analizar-ventas` y el skill genera informe con top clientes, cifras, tendencias

### Contador
Usuario: "¿Cómo registro una factura de proveedor?"
→ Accede a `/fs-erp-guide` y obtiene guía paso a paso
→ O consulta `/agents/docs/guia-compras.md` directamente

### Comercial
Usuario: "¿Qué clientes debo llamar hoy para cobrar?"
→ Ejecuta `/clientes-morosos` y obtiene lista priorizada por urgencia

### Administrador
Usuario: "¿Cuál es el estado de inventario?"
→ Ejecuta `/stock-bajo` para ver productos que necesitan reposición

### Gerente
Usuario: "Dame un resumen de ventas, gastos y estado de tesorería"
→ Ejecuta `/crear-informe` y especifica qué tipo de informe necesita

## Integración con fs-mcp

El plugin usa las siguientes herramientas de fs-mcp:

### Para análisis de ventas
- `get_facturaclientes` - Facturas de clientes
- `get_lineafacturaclientes` - Líneas de facturas
- `get_clientes_top_facturacion` - Ranking de clientes
- `get_tiempo_beneficios_todos_clientes` - Rentabilidad

### Para gestión de cobros
- `get_clientes_morosos` - Clientes con deuda
- `get_reciboclientes` - Recibos de clientes

### Para inventario
- `get_productos_bajo_stock` - Alertas de stock
- `get_stocks` - Estado de inventario

### Para reportes generales
- `get_clientes` - Listado de clientes
- `get_proveedores` - Listado de proveedores
- `get_productos` - Catálogo de productos
- `get_productos_mas_vendidos` - Ranking de productos

## Datos y seguridad

- El plugin **no almacena datos** de FacturaScripts localmente
- **Accede a datos en tiempo real** desde la conexión fs-mcp
- **No realiza modificaciones** automáticas en FacturaScripts
- Todos los análisis son **lectura solamente**

## Contribuciones

Para mejorar el plugin:
- Añadir nuevos tipos de informes
- Expandir las guías con más procedimientos
- Mejorar los agentes con nuevas capacidades
- Agregar skills para casos de uso específicos

## Licencia

MIT - Libre para usar, modificar y distribuir

## Soporte

Para problemas o preguntas:
- Consulta las guías en `/agents/docs/`
- Usa `/como-usar-erp` para ayuda interactiva
- Verifica que fs-mcp esté correctamente configurado
