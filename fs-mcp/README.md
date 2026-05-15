# fs-mcp — Servidor MCP de FacturaScripts

Plugin para [Claude Code](https://claude.ai/code) que proporciona un servidor [MCP (Model Context Protocol)](https://modelcontextprotocol.io) para conectar Claude directamente con la API REST de FacturaScripts. Permite consultar y modificar datos en tiempo real: facturas, clientes, productos, contabilidad, stock, etc.

## Índice

- [Configuración inicial](#configuración-inicial)
- [Variables de entorno](#variables-de-entorno)
- [Skills disponibles](#skills-disponibles)
- [Herramientas disponibles](#herramientas-disponibles)
- [MCP Resources](#mcp-resources)
- [Módulos locales privados](#módulos-locales-privados)
- [Sistema de metadata de modelos](#sistema-de-metadata-de-modelos)

---

## Configuración inicial

Antes de usar el MCP, añade tu conexión a FacturaScripts con la skill:

```
/fs-mcp:add-connection
```

La skill te pedirá:
- **URL** del servidor FacturaScripts (ej: `https://facturascripts.miempresa.com`)
- **Token API** — se genera en FacturaScripts en *Administración → API → Tokens*
- **Clave de conexión** para identificarla (ej: `empresa-principal`)

Para instalaciones con HTTPS y certificado autofirmado (local, VPN), activa la opción `rejectUnauthorized: false` durante la configuración.

Si tienes varias empresas o instalaciones, puedes añadir varias conexiones y cambiar entre ellas con la herramienta `set_default_connection` o pasando el parámetro `connection` en cualquier herramienta.

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `FS_DEFAULT_CONNECTION` | Clave de la conexión por defecto (ej: `empresa-principal`). Opcional: si no se configura, hay que pasar `connection` en cada llamada. |
| `FS_LOCAL_MODULES_PATH` | Ruta absoluta a la carpeta con módulos MCP privados. Opcional. Ver [Módulos locales privados](#módulos-locales-privados). |

Se configuran a través de los ajustes del plugin en Claude Code. Los valores se almacenan localmente y nunca se suben a GitHub.

---

## Skills disponibles

| Skill | Descripción |
|---|---|
| `fs-mcp:add-connection` | Guía interactiva para añadir o actualizar una conexión a FacturaScripts |
| `fs-mcp:list-connections` | Lista y gestiona las conexiones configuradas |
| `fs-mcp:configure-local-modules` | Configura la variable `FS_LOCAL_MODULES_PATH` para cargar módulos MCP privados |
| `fs-mcp:sync-models` | Mantiene el catálogo de modelos: detecta columnas nuevas/modificadas/eliminadas, redacta descripciones, regenera metadata y compila. Soporta core y plugins privados, ruta local o GitHub. |

---

## Herramientas disponibles

Todas las herramientas aceptan `connection` (clave de conexión a usar), `limit` y `offset` para paginación. El valor por defecto de `limit` es 50.

### Gestión de conexiones

| Herramienta | Descripción |
|---|---|
| `add_connection` | Añade o actualiza una conexión a FacturaScripts |
| `list_connections` | Lista todas las conexiones configuradas |
| `set_default_connection` | Establece la conexión por defecto |

### Metadata de modelos

| Herramienta | Descripción |
|---|---|
| `list_models` | Lista todos los modelos disponibles (core + privados) con su descripción y número de columnas/relaciones |
| `describe_model` | Devuelve la metadata completa de un modelo: columnas con tipo, requerido, label, descripción, FKs y relaciones. Acepta `format: "json"` (por defecto) o `"markdown"` |
| `verify_model_columns` | Consulta la API real con `?limit=1` y compara las claves devueltas con la metadata local para detectar diferencias |

### Clientes y proveedores

`get_clientes`, `get_proveedores`, `get_contactos`, `get_agentes`, `get_grupoclientes`, `get_identificadorfiscales`, `get_cuentabancoclientes`, `get_cuentabancoproveedores`

### Productos e inventario

`get_productos`, `get_variantes`, `get_familias`, `get_fabricantes`, `get_almacenes`, `get_stocks`, `get_tarifas`, `get_atributos`, `get_atributovalores`, `get_productoproveedores`, `get_productoimagenes`

### Ventas

`get_presupuestoclientes`, `get_lineapresupuestoclientes`, `get_pedidoclientes`, `get_lineapedidoclientes`, `get_albaranclientes`, `get_lineaalbaranclientes`, `get_facturaclientes`, `get_lineafacturaclientes`, `get_reciboclientes`, `get_pagoclientes`

### Compras

`get_presupuestoproveedores`, `get_lineapresupuestoproveedores`, `get_pedidoproveedores`, `get_lineapedidoproveedores`, `get_albaranproveedores`, `get_lineaalbaranproveedores`, `get_facturaproveedores`, `get_lineafacturaproveedores`, `get_reciboproveedores`, `get_pagoproveedores`

### Contabilidad

`get_ejercicios`, `get_asientos`, `get_partidas`, `get_cuentas`, `get_subcuentas`, `get_conceptopartidas`, `get_diarios`, `get_cuentaespeciales`, `get_regularizacionimpuestos`

### Finanzas

`get_cuentabancos`, `get_formapagos`, `get_divisas`, `get_retenciones`, `get_impuestos`, `get_impuestozonas`

### Analítica y KPIs

| Herramienta | Descripción |
|---|---|
| `get_dashboard_resumen` | Resumen ejecutivo del negocio: ventas, cobros, stock y principales métricas |
| `get_clientes_morosos` | Clientes con facturas vencidas e impagadas, ordenados por importe |
| `get_clientes_perdidos` | Clientes que han dejado de comprar en el período indicado |
| `get_clientes_sin_compras` | Clientes que nunca han comprado o llevan un tiempo sin hacerlo |
| `get_clientes_top_facturacion` | Clientes con mayor volumen de facturación |
| `get_clientes_top_margen` | Clientes que generan mayor margen bruto |
| `get_clientes_frecuencia_compras` | Análisis de frecuencia de compra por cliente |
| `get_clientes_nuevos_vs_recurrentes` | Comparativa de clientes nuevos versus recurrentes por período |
| `get_clientes_lifetime_value` | Valor histórico acumulado por cliente |
| `get_clientes_riesgo_credito` | Clientes con indicadores de riesgo de impago |
| `get_productos_mas_vendidos` | Productos con mayor volumen de unidades o importe vendido |
| `get_productos_bajo_stock` | Productos con stock por debajo del mínimo definido |
| `get_productos_no_vendidos` | Productos sin ventas en el período indicado |
| `get_productos_sobrestock` | Productos con stock muy por encima de la rotación habitual |
| `get_productos_top_margen` | Productos con mayor margen bruto |
| `get_facturas_cliente_por_cifnif` | Busca facturas por CIF/NIF del cliente |
| `get_facturas_con_errores` | Facturas con inconsistencias o errores detectados |
| `get_facturas_margen_negativo` | Facturas cuyo coste supera el precio de venta |
| `get_dso` | DSO (Days Sales Outstanding): media de días hasta cobrar una factura |
| `get_aging_cobros` | Antigüedad de saldos pendientes de cobro agrupados por tramos |
| `get_aging_pagos` | Antigüedad de saldos pendientes de pago a proveedores |
| `get_cash_flow_proyectado` | Proyección de flujo de caja basada en cobros y pagos previstos |
| `get_ventas_por_agente` | Ventas agrupadas por agente comercial |
| `get_ventas_por_familia` | Ventas agrupadas por familia de producto |
| `get_ventas_por_fabricante` | Ventas agrupadas por fabricante |
| `get_ventas_por_almacen` | Ventas agrupadas por almacén |
| `get_ventas_por_serie` | Ventas agrupadas por serie de facturación |
| `get_ventas_por_forma_pago` | Ventas agrupadas por forma de pago |
| `get_compras_por_familia` | Compras agrupadas por familia de producto |
| `get_top_proveedores_compras` | Proveedores con mayor volumen de compras |
| `get_comparativa_ventas_periodos` | Comparativa de ventas entre dos períodos |
| `get_evolucion_compras_mensual` | Evolución mensual de compras a proveedores |
| `get_rotacion_stock` | Índice de rotación de stock por producto o familia |
| `get_stock_muerto` | Productos sin movimiento durante el período indicado |
| `get_valoracion_inventario` | Valoración del inventario al precio de coste |
| `get_funnel_ventas` | Embudo de ventas: presupuestos → pedidos → albaranes → facturas |
| `get_albaranclientes_pendientes_facturar` | Albaranes de cliente pendientes de convertir en factura |
| `get_pedidos_pendientes_servir` | Pedidos de cliente sin albarán asignado |
| `get_presupuestos_pendientes` | Presupuestos sin convertir en pedido o rechazados |
| `get_pagos_pendientes_proveedor` | Facturas de proveedor pendientes de pago |
| `get_tiempo_beneficios_cliente` | Evolución histórica del margen por cliente |
| `get_tiempo_beneficios_todos_clientes` | Evolución histórica del margen agregado de todos los clientes |
| `exportar_factura_cliente` | Exporta una factura de cliente en el formato indicado (PDF, etc.) |

### Operaciones CRUD

El MCP permite crear, actualizar y eliminar registros en las entidades principales:

**Clientes y proveedores:** `create_cliente`, `update_cliente`, `delete_cliente`, `create_proveedor`, `update_proveedor`, `delete_proveedor`, `create_contacto`, `update_contacto`, `delete_contacto`

**Productos:** `create_producto`, `update_producto`, `delete_producto`, `create_variante`, `update_variante`, `delete_variante`, `create_familia`, `update_familia`, `delete_familia`

**Documentos de venta:** `create_presupuesto_cliente`, `update_presupuesto_cliente`, `delete_presupuesto_cliente`, `create_pedido_cliente`, `update_pedido_cliente`, `delete_pedido_cliente`, `create_albaran_cliente`, `update_albaran_cliente`, `delete_albaran_cliente`, `create_factura_cliente`, `update_factura_cliente`, `delete_factura_cliente`

**Documentos de compra:** `create_presupuesto_proveedor`, `update_presupuesto_proveedor`, `delete_presupuesto_proveedor`, `create_pedido_proveedor`, `update_pedido_proveedor`, `delete_pedido_proveedor`, `create_albaran_proveedor`, `update_albaran_proveedor`, `delete_albaran_proveedor`, `create_factura_proveedor`, `update_factura_proveedor`, `delete_factura_proveedor`

**Contabilidad:** `create_asiento`, `update_asiento`, `delete_asiento`, `create_partida`, `update_partida`, `delete_partida`, `create_cuenta`, `update_cuenta`, `delete_cuenta`, `create_subcuenta`, `update_subcuenta`, `delete_subcuenta`

**Configuración y maestros:** `create_serie`, `update_serie`, `delete_serie`, `create_almacen`, `update_almacen`, `delete_almacen`, `create_ejercicio`, `update_ejercicio`, `delete_ejercicio`, `create_impuesto`, `update_impuesto`, `delete_impuesto`, y muchos más.

### Configuración del ERP

`get_series`, `get_secuenciadocumentos`, `get_formatodocumentos`, `get_estadodocumentos`, `get_doctransformations`, `get_empresas`, `get_apiaccess`, `get_apikeyes`, `get_agenciatransportes`, `get_pages`, `get_totalmodeles`, `get_settings`, `get_codemodels`

### Geografía

`get_pais`, `get_provincias`, `get_ciudades`, `get_codigopostales`, `get_puntointeresciudades`

### Comunicación

`get_emailsentes`, `get_emailnotifications`, `get_attachedfiles`, `get_attachedfilerelations`

### Sistema

`get_logmessages`, `get_tasks`, `get_cronjobes`, `get_workeventes`, `get_pagefilteres`, `get_pageoptions`

---

## MCP Resources

Además de herramientas, el servidor expone los modelos como **MCP Resources** bajo el esquema `fs-schema://`. Los clientes MCP que soporten resources (Claude Code, Claude Desktop) los muestran en su navegador de recursos sin que aparezcan en el listado de herramientas.

| URI | Descripción |
|---|---|
| `fs-schema://models` | Índice JSON de todos los modelos disponibles (core + privados) |
| `fs-schema://model/<nombre>` | Metadata completa del modelo en JSON |
| `fs-schema://model/<nombre>.md` | Metadata del modelo en markdown legible |
| `fs-schema://relations/<nombre>` | Solo las relaciones del modelo (belongsTo y hasMany) |

---

## Módulos locales privados

El servidor MCP soporta **módulos locales privados**: herramientas adicionales que solo existen en tu máquina y nunca se suben al repositorio. Son útiles para integrar endpoints de plugins privados, integraciones específicas de tu empresa o cualquier funcionalidad que no quieras compartir públicamente.

### Configurar FS_LOCAL_MODULES_PATH

Usa la skill para configurar la variable:

```
/fs-mcp:configure-local-modules
```

O ve a la configuración del plugin `fs-mcp` en Claude Code y establece el campo **"Ruta de módulos locales privados"** con la ruta absoluta a tu carpeta (ej: `/Users/tu-usuario/mis-modulos-fs`). Este valor se almacena localmente y nunca se sube a GitHub.

### Estructura de un módulo local

El directorio de módulos soporta dos niveles de organización:

**Módulos directamente en la raíz:**

```
mis-modulos-fs/
  mi-modulo/
    index.js
    metadata.js    ← opcional, generado por sync-models
  otro-modulo/
    index.js
```

**Módulos agrupados en subcarpetas** (útil para organizar módulos de un mismo plugin):

```
mis-modulos-fs/
  MiPlugin/
    manifest.json      ← configuración del grupo para sync-models
    descriptions.json  ← descripciones de columnas del grupo
    mi-modulo/
      index.js
      metadata.js
    otro-modulo/
      index.js
      metadata.js
  OtroPlugin/
    manifest.json
    descriptions.json
    tercer-modulo/
      index.js
      metadata.js
```

Puedes mezclar ambas formas en el mismo directorio. Los archivos `manifest.json` y `descriptions.json` de cada grupo siempre se llaman así — nunca con prefijos ni sufijos de nombre.

El `index.js` debe exportar dos funciones: `registerTools` (declara las herramientas MCP) y `handleTool` (las ejecuta). El parámetro `client` ya viene configurado con las conexiones del plugin.

```javascript
// mis-modulos-fs/mi-modulo/index.js

export async function registerTools(toolsMap) {
  toolsMap.set('get_mi_recurso', {
    name: 'get_mi_recurso',
    description: 'Obtiene datos de mi endpoint privado',
    inputSchema: {
      type: 'object',
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        limit:      { type: 'number', description: 'Máximo de resultados', default: 50 },
        offset:     { type: 'number', description: 'Desplazamiento para paginación', default: 0 },
      },
      required: [],
    },
  });
}

export async function handleTool(name, args, client) {
  if (name !== 'get_mi_recurso') return null; // devuelve null si no es tu tool

  const result = await client.get('/mi-endpoint', {
    limit:  args.limit  ?? 50,
    offset: args.offset ?? 0,
  }, args.connection);

  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
}
```

### Filtros y paginación en módulos privados

La API de FacturaScripts acepta filtros con el formato `filter[campo]=valor` y ordenación con `sort[campo]=ASC|DESC`:

```javascript
export async function handleTool(name, args, client) {
  if (name !== 'get_mi_recurso') return null;

  const params = { limit: args.limit ?? 50, offset: args.offset ?? 0 };

  // Filtro: "status:ACTIVE,type:cliente"
  if (args.filter) {
    for (const part of args.filter.split(',')) {
      const [field, value] = part.split(':');
      if (field && value) params[`filter[${field}]`] = value;
    }
  }

  // Ordenación: "fecha:desc"
  if (args.order) {
    const [field, dir] = args.order.split(':');
    if (field && dir) params[`sort[${field}]`] = dir.toUpperCase();
  }

  const result = await client.get('/mi-endpoint', params, args.connection);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
}
```

### Confirmar que los módulos se cargan

Al arrancar el servidor MCP verás en los logs:

**Módulos en raíz:**
```
[local-loader] ✓ Módulo local cargado: mi-modulo (+1 modelos)
[local-loader] 1 módulo(s) local(es) cargado(s) desde: /ruta/a/mis-modulos-fs
```

**Módulos en subcarpeta de grupo:**
```
[local-loader] ✓ Módulo local cargado: MiPlugin/mi-modulo (+1 modelos)
[local-loader] ✓ Módulo local cargado: MiPlugin/otro-modulo (+1 modelos)
[local-loader] ✓ Grupo "MiPlugin": 2 módulo(s) cargado(s)
[local-loader] 2 módulo(s) local(es) cargado(s) desde: /ruta/a/mis-modulos-fs
```

Si hay algún problema con un módulo (falta `index.js`, no exporta las funciones correctas), se registra un aviso y el servidor continúa cargando el resto.

### Aportar metadata de modelos desde un módulo privado

Un módulo privado puede exportar la metadata de los modelos de su plugin para que aparezcan en `list_models`, `describe_model` y los Resources `fs-schema://model/<nombre>`.

1. Genera el archivo `metadata.js` con la skill `fs-mcp:sync-models` (ver [Sistema de metadata](#sistema-de-metadata-de-modelos)).
2. Importa y exporta la metadata desde `index.js`:

```javascript
import miModeloMetadata from './metadata.js';

export async function registerTools(toolsMap) { /* ... */ }
export async function handleTool(name, args, client) { /* ... */ }

export const modelMetadata = [miModeloMetadata];
```

El `local-loader` valida la estructura mínima y registra los modelos válidos en el registry global del MCP. Los inválidos se omiten con un aviso.

---

## Sistema de metadata de modelos

El servidor mantiene metadata estructurada de cada modelo de FacturaScripts (los 83 del core más los que aportes desde plugins privados). Esta metadata describe cada columna con su tipo, longitud, FK y descripción funcional, y la usa Claude para generar consultas e informes complejos sin adivinar el esquema.

### Qué se expone

- **Herramientas** (`list_models`, `describe_model`, `verify_model_columns`) — llamables explícitamente.
- **Resources** (`fs-schema://...`) — navegables sin invocar herramientas.
- **Enriquecimiento automático** — los `inputSchema` de los tools `create_*`, `update_*` y `get_*` se rellenan con `maxLength` y `enum` desde la metadata al arrancar el servidor.

### Single source of truth para descripciones

Las descripciones de cada columna se guardan en archivos JSON separados:

- **Core** → `fs-mcp/server/src/metadata/descriptions-overrides.json` (incluido en el repositorio).
- **Plugins privados** → `<outputBase>/descriptions.json` (en tu carpeta privada, no se sube a GitHub).

Formato: `{ "modelo": { "campo": "descripción contextual en español" } }`. Estas descripciones tienen prioridad sobre cualquier otra fuente al regenerar la metadata.

### Regenerar la metadata

**Modo CORE** — regenera los modelos del core de FacturaScripts:

```bash
cd fs-mcp/server
npm run generate:metadata -- --fs-path=/ruta/a/facturascripts
npm run build
```

Lee `Core/Table/*.xml`, `Core/XMLView/*.xml` y `Core/Translation/es_ES.json`. Tras regenerar hay que recompilar para que el servidor cargue los cambios.

**Modo PLUGIN** — regenera los modelos de un plugin privado:

```bash
cd fs-mcp/server
npm run generate:metadata -- --manifest=/ruta/a/manifest.json
```

No requiere recompilación: los módulos privados son JavaScript plano que se carga dinámicamente al arrancar.

El `manifest.json` declara qué modelos generar y dónde están sus archivos. Si los módulos están agrupados en una subcarpeta, `outputBase` apunta a esa subcarpeta y el `manifest.json` vive dentro de ella:

```json
{
    "moduleName": "mi-plugin",
    "fsPath": "/ruta/a/facturascripts",
    "pluginPath": "/ruta/a/facturascripts/Plugins/MiPlugin",
    "outputBase": "/ruta/a/mis-modulos-fs/MiPlugin",
    "descriptionsOverridesPath": "/ruta/a/mis-modulos-fs/MiPlugin/descriptions.json",
    "models": [
        {
            "name": "mi_modelo",
            "outputDir": "mi-modulo",
            "table": "mi_tabla",
            "endpoint": "/mi-endpoint",
            "editView": "EditMiModelo",
            "description": "Descripción del modelo..."
        }
    ]
}
```

Si el módulo está directamente en la raíz (sin subcarpeta de grupo), `outputBase` apunta al propio directorio de módulos (`/ruta/a/mis-modulos-fs`).

### Mantener el catálogo con la skill sync-models

La skill `fs-mcp:sync-models` automatiza todo el flujo de mantenimiento. Úsala cuando:

- Quieras **añadir un modelo nuevo** del core o de un plugin privado.
- Hayas **actualizado FacturaScripts** y quieras detectar cambios en los modelos ya configurados.
- Quieras hacer un **refresh masivo** de todos los modelos del catálogo.

```
/fs-mcp:sync-models
```

La skill detecta qué ha cambiado y orquesta todo: añade entradas al catálogo, redacta descripciones en español para las columnas nuevas, regenera, compila y verifica.

Ejemplos de uso habituales:

- *"Revisa el modelo cliente del core, fuente /Users/yo/facturascripts"*
- *"Añade el modelo task del plugin privado Forja en /Users/yo/facturascripts/Plugins/Forja"*
- *"Refresca todos los modelos del core con la nueva versión de FacturaScripts"*
- *"Revisa los modelos cliente, producto y factura_cliente del core"*

### Scripts auxiliares de mantenimiento

En `fs-mcp/server/src/scripts/`, tras compilar (`npm run build`) se ejecutan con `node dist/scripts/<nombre>.js`:

| Script | Descripción |
|---|---|
| `generate-metadata.js` | Generador principal (modo CORE y modo PLUGIN) |
| `compare-model.js` | Compara un modelo del registry con su XML fuente y reporta diferencias en JSON |
| `list-undocumented.js` | Lista las columnas sin descripción agrupadas por modelo |
| `dump-all-descriptions.js` | Vuelca todas las descripciones a un JSON y reporta cuántas son genéricas |
| `test-metadata.js` | Tests sobre el sistema de metadata (registry, resources, tools, enriquecimiento) |

Comparar un modelo concreto desde la línea de comandos:

```bash
cd fs-mcp/server
node dist/scripts/compare-model.js --model=cliente \
  --source=/Users/yo/facturascripts --type=core
```
