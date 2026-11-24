# fs-mcp — Servidor MCP de FacturaScripts

Plugin para Claude Code y Codex que proporciona un servidor [MCP (Model Context Protocol)](https://modelcontextprotocol.io) conectado a la API REST de FacturaScripts. Permite consultar y modificar datos en tiempo real: facturas, clientes, productos, contabilidad, stock, etc.

## Requisitos

- **Node.js ≥ 18** instalado en tu máquina (Linux, macOS o Windows). El servidor MCP es un proceso Node.js; sin él el plugin no arrancará independientemente del sistema operativo.
  - Linux: `sudo apt install nodejs` / `sudo dnf install nodejs` o desde [nodejs.org](https://nodejs.org)
  - macOS: `brew install node` o desde [nodejs.org](https://nodejs.org)
  - Windows: instalador desde [nodejs.org](https://nodejs.org)
- FacturaScripts con la **API REST habilitada** y un token de acceso generado en *Administración → API → Tokens*.

El manifiesto utiliza un lanzador portable: toma `CLAUDE_PLUGIN_ROOT` en Claude Code y el directorio de trabajo del plugin en Codex, por lo que no necesita rutas absolutas específicas de cada instalación.

El servidor se distribuye empaquetado en un único archivo, `server/dist/index.js`, que ya lleva dentro sus dependencias: para usar el plugin no hace falta `npm install` ni `node_modules`. Para desarrollarlo, `node_modules` no se versiona: ejecuta `npm ci` en `fs-mcp/server` antes del primer `npm run build`. La compilación deja en `build/` los módulos sueltos de `tsc`, que usan los tests y los scripts de mantenimiento, y genera con esbuild el bundle `dist/index.js`, el único archivo de `dist/` que se sube al repositorio.

---

## Índice

- [Configuración inicial](#configuración-inicial)
- [Variables de entorno](#variables-de-entorno)
- [Skills disponibles](#skills-disponibles)
- [Herramientas disponibles](#herramientas-disponibles)
- [Plugins oficiales](#plugins-oficiales)
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

## Configuración (`~/.fs-ai.json`)

Toda la configuración del plugin se gestiona desde el archivo `~/.fs-ai.json`, en el directorio home del usuario. Es cross-platform y se encuentra automáticamente en cualquier SO. Si solo existe el antiguo `~/.fs-claude.json`, se sigue usando ese.

```json
{
  "version": "1.0",
  "connections": {
    "default": "empresa-principal",
    "connections": {
      "empresa-principal": {
        "name": "Mi empresa",
        "url": "https://facturascripts.miempresa.com",
        "token": "..."
      }
    }
  },
  "settings": {
    "localModulesPath": "/ruta/a/mis-modulos-privados"
  }
}
```

| Clave | Descripción |
|---|---|
| `connections.default` | Clave de la conexión por defecto |
| `connections.connections` | Mapa de conexiones configuradas. Cada una admite `rejectUnauthorized`. Las que tienen `"type": "forja"` son del plugin [fs-forja](../fs-forja/README.md) y fs-mcp las ignora |
| `settings.localModulesPath` | Ruta a la carpeta de módulos MCP privados (opcional) |

> Las variables de entorno `FS_CONNECTIONS_FILE` y `FS_DEFAULT_CONNECTION` siguen disponibles como overrides opcionales en los ajustes del plugin, pero no son necesarias para el uso normal.

---

## Skills disponibles

| Skill | Descripción |
|---|---|
| `fs-mcp:add-connection` | Guía interactiva para añadir o actualizar una conexión a FacturaScripts |
| `fs-mcp:list-connections` | Lista y gestiona las conexiones configuradas |
| `fs-mcp:configure-local-modules` | Configura `settings.localModulesPath` en `~/.fs-ai.json` para cargar módulos MCP privados |
| `fs-mcp:sync-models` | Mantiene el catálogo de modelos: detecta columnas nuevas/modificadas/eliminadas, redacta descripciones, regenera metadata y compila. Soporta core y plugins privados, ruta local o GitHub. |

---

## Herramientas disponibles

Todas las herramientas aceptan `connection` (clave de conexión a usar), `limit` y `offset` para paginación. El valor por defecto de `limit` es 50.

Las herramientas `get_*` que exponen parámetros de filtro (`codcliente`, `idfactura`, `codejercicio`, `pagada`, etc.) los aplican realmente sobre la consulta a la API. Los filtros de **texto libre** (`nombre`, `descripción`) hacen **búsqueda parcial** (no es necesario escribir el valor completo); el resto hace coincidencia exacta. Cuando se indican varios filtros se combinan con `AND`.

### Gestión de conexiones

| Herramienta | Descripción |
|---|---|
| `add_connection` | Añade una conexión a la API REST de una instalación de FacturaScripts (`rejectUnauthorized` opcional). Una clave existente solo se sustituye con `overwrite: true`, nunca una conexión de tipo forja de fs-forja, y la URL se guarda sin `/api/3` |
| `list_connections` | Lista las conexiones de la API REST configuradas e indica cuántas de tipo forja gestiona fs-forja |
| `set_default_connection` | Establece la conexión por defecto; no admite conexiones de tipo forja |

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
| `exportar_factura_cliente` | Devuelve los datos completos de una factura de cliente (cabecera, email del cliente y todas sus líneas) listos para exportar |

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

### Forja (autores de plugins)

Las herramientas `forja_*` de la API de autor de facturascripts.com ya no forman parte de fs-mcp: están en el plugin **[fs-forja](../fs-forja/README.md)**, que tiene su propio servidor MCP y sus propias conexiones de tipo `forja` en el mismo `~/.fs-ai.json`. fs-mcp no crea, no usa ni modifica esas conexiones.

---

## Plugins oficiales

Además del core, fs-mcp incluye herramientas para algunos plugins oficiales de FacturaScripts. Funcionan con cualquier conexión: si la instalación no tiene el plugin activo, la API responde que el recurso no existe y el error lo indica.

Todas siguen las mismas reglas:

- Los listados (`get_*` en plural) aceptan `limit`/`offset`, filtros por los campos principales, búsquedas «contiene» (`<campo>_like`), rangos de fecha (`<fecha>_gte`/`<fecha>_lte`), un filtro genérico `filter: "campo:valor,neto_gt:100"` y `order: "fecha:desc"`.
- Los `update_*` solo cambian los campos enviados y aceptan `clear_fields` para vaciar campos.
- Los `set_estado_*` y `set_fase_*` aceptan el id o el nombre del estado o la fase.
- Los informes leen todos los registros que cumplen los filtros (hasta 20 000) y avisan si hay más.
- El servidor no lanza más de 4 peticiones simultáneas contra una misma instalación (las demás esperan turno), para no agotar los procesos PHP de hostings pequeños con las fichas e informes que leen varios recursos a la vez.
- La API no tiene usuario de sesión: los campos de usuario (`nick`, `asignado`) hay que indicarlos cuando hacen falta.

### Servicios (SAT)

| Qué | Herramientas |
|---|---|
| Servicios | `get_servicios_at`, `get_servicio_at` (ficha completa: trabajos, máquinas, checklist, documentos e historial), `create_servicio_at`, `update_servicio_at`, `delete_servicio_at`, `set_estado_servicio_at` |
| Trabajos | `get_trabajos_at`, `create_trabajo_at`, `update_trabajo_at`, `delete_trabajo_at` |
| Estados, prioridades y tipos | `get_estados_at`, `get_prioridades_at`, `get_tipos_at` y sus `create_*`, `update_*` y `delete_*` |
| Máquinas | `get_maquinas_at`, `get_historial_maquina_at`, `create_maquina_at`, `update_maquina_at`, `delete_maquina_at` |
| Checklists | `get_categorias_at`, `get_checks_at` y sus `create_*`, `update_*` y `delete_*`; `get_servicio_categorias_at`, `create_servicio_categoria_at`, `delete_servicio_categoria_at`, `get_servicio_checks_at`, `update_servicio_check_at` |
| Historial | `get_servicio_at_logs` |
| Informes | `get_informe_servicios_at` (por estado, prioridad, tipo, asignado, agente, mes y cliente), `get_servicios_at_pendientes` (abiertos por antigüedad), `get_trabajos_at_pendientes` (trabajos por facturar, albaranar o presupuestar), `get_horas_trabajos_at` (horas por usuario y agente) |

Los presupuestos, albaranes y facturas de un servicio no se pueden generar por la API: se marcan los trabajos con la acción (`estado` 1, 3 o 5) y el documento se genera desde la ficha del servicio en FacturaScripts.

### Proyectos

| Qué | Herramientas |
|---|---|
| Proyectos | `get_proyectos`, `get_proyecto` (ficha completa: tareas, usuarios, notas, stock, documentos y servicios SAT), `create_proyecto`, `update_proyecto`, `delete_proyecto`, `set_estado_proyecto` |
| Tareas | `get_tareas_proyecto`, `create_tarea_proyecto`, `update_tarea_proyecto`, `delete_tarea_proyecto`, `set_fase_tarea_proyecto` |
| Estados y fases | `get_estados_proyecto`, `get_fases_tarea` y sus `create_*`, `update_*` y `delete_*` |
| Notas y usuarios | `get_notas_proyecto`, `create_nota_proyecto`, `update_nota_proyecto`, `delete_nota_proyecto`, `get_usuarios_proyecto`, `create_usuario_proyecto`, `delete_usuario_proyecto` |
| Documentos y stock | `get_documentos_proyecto`, `set_proyecto_documento` (vincular o desvincular un documento de compra o venta), `get_stock_proyecto` |
| Informes | `get_informe_proyectos` (por estado, cliente, responsable y mes), `get_rentabilidad_proyectos` (ventas, compras y margen por proyecto), `get_informe_tareas_proyecto` (por fase, usuario y proyecto), `get_tareas_proyecto_vencidas` |

### CRM

Los contactos son del core (`get_contactos`, `create_contacto`, `update_contacto`...); el CRM les añade la fuente (`idfuente`), los intereses y las listas.

| Qué | Herramientas |
|---|---|
| Oportunidades | `get_oportunidades_crm`, `get_oportunidad_crm` (ficha completa: contacto, presupuesto, notas y archivos), `create_oportunidad_crm`, `update_oportunidad_crm`, `delete_oportunidad_crm`, `set_estado_oportunidad_crm` |
| Presupuesto | `create_presupuesto_oportunidad_crm` (crea el presupuesto para el cliente del contacto y lo vincula), `set_presupuesto_oportunidad_crm` (vincular uno existente o desvincular) |
| Archivos | `get_archivos_oportunidad_crm`, `create_archivo_oportunidad_crm` (sube un archivo local), `delete_archivo_oportunidad_crm` |
| Estados | `get_estados_oportunidad_crm` y sus `create_*`, `update_*` y `delete_*` |
| Notas | `get_notas_crm`, `create_nota_crm`, `update_nota_crm`, `delete_nota_crm` (de contacto, oportunidad o documento, con aviso opcional) |
| Contactos | `get_contacto_crm` (ficha CRM: fuente, intereses, listas, oportunidades y notas) |
| Fuentes, intereses, listas y cargos | `get_fuentes_crm`, `get_intereses_crm`, `get_listas_crm`, `get_cargos_crm` y sus `create_*`, `update_*` y `delete_*`; `get_intereses_contacto_crm`, `create_interes_contacto_crm`, `delete_interes_contacto_crm`, `get_contactos_lista_crm`, `create_contacto_lista_crm`, `delete_contacto_lista_crm` |
| Campañas | `get_campanas_crm` (solo lectura, con estadísticas de envío y apertura) |
| Informes | `get_informe_oportunidades_crm` (embudo por estado, conversión e importes por interés, fuente, asignado, agente y mes), `get_avisos_crm` (recordatorios de notas), `get_oportunidades_crm_sin_actividad` |

### Estructura y cómo añadir otro plugin oficial

Cada plugin vive en `server/src/plugins/<plugin>/`, separado de los módulos del core:

| Archivo | Contenido |
|---|---|
| `metadata/manifest.json` | Modelos del plugin (tabla, endpoint, XMLView y descripción), con `"format": "ts"` |
| `metadata/descriptions.json` | Descripciones de las columnas |
| `metadata/models/*.ts`, `metadata/index.ts` | Metadata generada (no editar a mano) |
| `resources.ts` | Un `ResourceDef` por modelo: campos escribibles, filtros y textos de sus tools CRUD |
| `tools.ts` | Fichas, cambios de estado e informes propios del plugin |
| `index.ts` | El `OfficialPlugin` que une todo |

Lo común está en `server/src/plugins/shared/` (fábrica de tools CRUD, filtros, lectura paginada y errores). Para añadir un plugin: crea su carpeta con esos archivos, genera la metadata (ver [Regenerar la metadata](#regenerar-la-metadata)), añádelo a `OFFICIAL_PLUGINS` en `server/src/plugins/index.ts`, añade sus pruebas en `server/tests/` y compila.

Un módulo local privado no puede redefinir una herramienta de un plugin oficial: si lo intenta, el servidor conserva la oficial y lo avisa en el registro de arranque.

---

## MCP Resources

Además de herramientas, el servidor expone los modelos como **MCP Resources** bajo el esquema `fs-schema://`. Los clientes MCP que soporten resources, incluidos Claude Code y Codex, pueden consultarlos sin que aparezcan en el listado de herramientas.

| URI | Descripción |
|---|---|
| `fs-schema://models` | Índice JSON de todos los modelos disponibles (core + privados) |
| `fs-schema://model/<nombre>` | Metadata completa del modelo en JSON |
| `fs-schema://model/<nombre>.md` | Metadata del modelo en markdown legible |
| `fs-schema://relations/<nombre>` | Solo las relaciones del modelo (belongsTo y hasMany) |

---

## Módulos locales privados

El servidor MCP soporta **módulos locales privados**: herramientas adicionales que solo existen en tu máquina y nunca se suben al repositorio. Son útiles para integrar endpoints de plugins privados, integraciones específicas de tu empresa o cualquier funcionalidad que no quieras compartir públicamente.

### Configurar la ruta de módulos

Usa la skill para configurar la ruta en `~/.fs-ai.json`:

```
/fs-mcp:configure-local-modules
```

La skill detecta si ya tienes una ruta configurada. Si no, puedes indicar una carpeta existente o dejar que cree automáticamente `~/fs-ai-mcp-private/`. La ruta se guarda en `settings.localModulesPath` de `~/.fs-ai.json` y el servidor la carga al arrancar sin necesidad de variables de entorno.

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

La API de FacturaScripts acepta filtros con el formato `filter[campo]=valor` y ordenación con `sort[campo]=ASC|DESC`. **Importante:** los parámetros sueltos (`?campo=valor`) se ignoran en silencio; hay que envolverlos siempre en `filter[...]`.

El nombre del campo admite sufijos para usar operadores distintos a la igualdad:

| Sufijo | Operador | Ejemplo |
|---|---|---|
| _(ninguno)_ | `=` | `filter[codcliente]=2` |
| `_like` | `LIKE` (búsqueda parcial; el core envuelve el valor con `%…%` si no trae comodines) | `filter[nombre_like]=daniel` |
| `_gt` / `_gte` | `>` / `>=` | `filter[total_gte]=100` |
| `_lt` / `_lte` | `<` / `<=` | `filter[fecha_lte]=2025-12-31` |
| `_neq` | `!=` | `filter[codserie_neq]=R` |
| `_null` / `_notnull` | `IS NULL` / `IS NOT NULL` | `filter[idfacturarect_null]=1` |

> Si un filtro referencia una columna que no existe en el modelo, la API responde con error `api: fields not allowed: <campo>` (no lo ignora).

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

El servidor mantiene metadata estructurada de cada modelo de FacturaScripts (los 83 del core, los de los [plugins oficiales](#plugins-oficiales) y los que aportes desde plugins privados). Esta metadata describe cada columna con su tipo, longitud, FK y descripción funcional, y la usa Claude para generar consultas e informes complejos sin adivinar el esquema.

### Qué se expone

- **Herramientas** (`list_models`, `describe_model`, `verify_model_columns`) — llamables explícitamente.
- **Resources** (`fs-schema://...`) — navegables sin invocar herramientas.
- **Enriquecimiento automático** — los `inputSchema` de los tools `create_*`, `update_*` y `get_*` se rellenan con `maxLength` y `enum` desde la metadata al arrancar el servidor.

### Single source of truth para descripciones

Las descripciones de cada columna se guardan en archivos JSON separados:

- **Core** → `fs-mcp/server/src/metadata/descriptions-overrides.json` (incluido en el repositorio).
- **Plugins oficiales** → `fs-mcp/server/src/plugins/<plugin>/metadata/descriptions.json` (incluido en el repositorio).
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

**Modo PLUGIN OFICIAL** — regenera los modelos de un plugin oficial incluido en fs-mcp:

```bash
cd fs-mcp/server
npm run generate:metadata -- --manifest=src/plugins/servicios/metadata/manifest.json --fs-path=/ruta/a/facturascripts
npm run build
```

El manifest lleva `"format": "ts"` y no guarda rutas de ninguna máquina: el core se indica con `--fs-path`, el plugin se busca en `<fs-path>/Plugins/<pluginName>` y las demás rutas son relativas al manifest. Escribe `metadata/models/<modelo>.ts` y el agregador `metadata/index.ts`. `extensionPlugins` lista otros plugins cuyas columnas de extensión se incluyen aunque no estén activos en esa instalación (Servicios incluye la columna `idproyecto` que añade Proyectos).

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

En `fs-mcp/server/src/scripts/`, tras compilar (`npm run build`) se ejecutan con `node build/scripts/<nombre>.js`:

| Script | Descripción |
|---|---|
| `generate-metadata.js` | Generador principal (modo CORE, PLUGIN y PLUGIN OFICIAL) |
| `compare-model.js` | Compara un modelo del registry con su XML fuente y reporta diferencias en JSON |
| `list-undocumented.js` | Lista las columnas sin descripción agrupadas por modelo |
| `dump-all-descriptions.js` | Vuelca todas las descripciones a un JSON y reporta cuántas son genéricas |
| `test-metadata.js` | Tests sobre el sistema de metadata (registry, resources, tools, enriquecimiento) |

Comparar un modelo concreto desde la línea de comandos:

```bash
cd fs-mcp/server
node build/scripts/compare-model.js --model=cliente \
  --source=/Users/yo/facturascripts --type=core
```
