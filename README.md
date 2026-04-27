# FacturaScripts Claude Plugin

Plugin para [Claude Code](https://claude.ai/code) que integra el ERP [FacturaScripts](https://facturascripts.com) con inteligencia artificial. Incluye tres subplugins independientes orientados a diferentes perfiles de uso: **desarrolladores**, **usuarios finales** y **conexión con la API del ERP**.

## Índice

- [Instalación](#instalación)
- [Plugins incluidos](#plugins-incluidos)
  - [fs-dev — Plugin para desarrolladores](#fs-dev--plugin-para-desarrolladores)
  - [fs-user — Plugin para usuarios del ERP](#fs-user--plugin-para-usuarios-del-erp)
  - [fs-mcp — Servidor MCP de FacturaScripts](#fs-mcp--servidor-mcp-de-facturascripts)
- [Módulos locales privados (fs-mcp)](#módulos-locales-privados-fs-mcp)
- [Metadata de modelos (fs-mcp)](#metadata-de-modelos-fs-mcp)
- [Requisitos](#requisitos)

---

## Instalación

### Desde el Marketplace de Claude Code

La forma más sencilla es instalar el plugin directamente desde el marketplace oficial:

```
https://github.com/FacturaScripts/fs-claude-plugin
```

En Claude Code ejecuta:

```
/install-plugin https://github.com/FacturaScripts/fs-claude-plugin
```

O desde la interfaz de gestión de plugins de Claude Code, añade la URL del repositorio.

### Instalación manual

Si prefieres clonar el repositorio:

```bash
git clone https://github.com/FacturaScripts/fs-claude-plugin
```

Luego en Claude Code:

```
/install-plugin /ruta/local/al/repositorio
```

> **Nota:** El plugin incluye los archivos `dist/` precompilados del servidor MCP. No necesitas tener Node.js instalado para usarlo.

---

## Plugins incluidos

El repositorio contiene tres plugins independientes que puedes instalar por separado según tus necesidades.

---

### fs-dev — Plugin para desarrolladores

**Perfil:** Desarrolladores que crean o mantienen plugins de FacturaScripts.

Proporciona skills especializadas y agentes de IA para todas las tareas del ciclo de desarrollo: desde crear la estructura de un plugin hasta depurar errores, escribir tests o diseñar la interfaz.

#### Opciones de configuración

| Opción | Descripción |
|---|---|
| (Sin opciones configurables) | El plugin detecta automáticamente proyectos de FacturaScripts e inyecta contexto relevante |

#### Skills disponibles

| Skill | Descripción |
|---|---|
| `fs-dev:crear-plugin` | Crea la estructura completa de un nuevo plugin con todos los archivos necesarios |
| `fs-dev:crear-modelo` | Crea un modelo PHP con su clase y archivo XML de tabla |
| `fs-dev:crear-controlador` | Crea controladores (ListController, EditController, PanelController) con su vista |
| `fs-dev:crear-extension` | Crea extensiones para modificar modelos o controladores sin tocar el código fuente |
| `fs-dev:crear-xmlview` | Crea o modifica XMLViews: columnas, widgets, filtros y acciones |
| `fs-dev:crear-html-twig` | Crea y extiende vistas Twig con herencia del Core o de otros plugins |
| `fs-dev:api-rest` | Explica la API REST, autenticación por token y cómo añadir endpoints personalizados |
| `fs-dev:api-designer` | Diseña y crea nuevos endpoints REST delegando al agente especializado |
| `fs-dev:backend-developer` | Desarrollo de modelos, lógica de negocio, BD, Workers y Cron |
| `fs-dev:frontend-developer` | Desarrollo de vistas, Twig y la capa frontend |
| `fs-dev:fullstack-developer` | Desarrollo completo de una funcionalidad end-to-end |
| `fs-dev:ui-designer` | Diseño de interfaces de usuario |
| `fs-dev:extension-developer` | Creación de extensiones para el Core o plugins externos |
| `fs-dev:php-expert` | Código PHP idiomático y de calidad para FacturaScripts |
| `fs-dev:sql-expert` | Consultas SQL, optimización de base de datos y migraciones |
| `fs-dev:testing-expert` | Tests PHPUnit, PHPStan, depuración y control de calidad |
| `fs-dev:depurar-y-testear` | Guía para depurar con modo debug, logs y PHPUnit |
| `fs-dev:analizar-bug` | Analiza y corrige bugs en plugins |
| `fs-dev:docs-expert` | Responde preguntas de programación consultando la documentación oficial |
| `fs-dev:document-expert` | Trabaja con documentos de compra/venta (presupuestos, facturas, albaranes) |
| `fs-dev:fsmaker` | Usa la herramienta CLI `fsmaker` para generar estructuras automáticamente |
| `fs-dev:cron` | Explica las tareas periódicas mediante `Cron.php` y `CronClass` |
| `fs-dev:workers` | Explica la cola de trabajos en segundo plano mediante eventos |
| `fs-dev:migraciones` | Crea y registra migraciones para cambios en datos de la BD |
| `fs-dev:mods` | Crea mods para modificar documentos de compra/venta visualmente |
| `fs-dev:skill-commit` | Buenas prácticas para commits claros y atómicos en español |
| `fs-dev:skill-pull-request` | Crea pull requests bien estructurados |

#### Agentes especializados

Los agentes son instancias de Claude con contexto específico de FacturaScripts que se activan automáticamente o se invocan desde las skills:

- **api-designer** — Diseño de endpoints REST y API personalizada (modelo: Opus)
- **backend-developer** — Desarrollo backend: modelos, BD, Workers, Cron (modelo: Opus)
- **docs-expert** — Documentación oficial y preguntas de programación (modelo: Haiku)
- **document-expert** — Documentos de compra y venta (modelo: Opus)
- **extension-developer** — Creación de extensiones (modelo: Opus)
- **frontend-developer** — Capa frontend y vistas Twig (modelo: Opus)
- **fullstack-developer** — Funcionalidades completas end-to-end (modelo: Opus)
- **php-expert** — PHP idiomático y patrones de calidad (modelo: Opus)
- **sql-expert** — Base de datos y optimización SQL (modelo: Opus)
- **testing-expert** — Tests, PHPUnit, PHPStan y control de calidad (modelo: Sonnet)
- **ui-designer** — Diseño de interfaces (modelo: Opus)

#### Detección automática de contexto

El plugin detecta automáticamente si el directorio de trabajo actual es un proyecto de FacturaScripts (al iniciar sesión y al cambiar de directorio) e inyecta contexto relevante de las skills disponibles.

---

### fs-user — Plugin para usuarios del ERP

**Perfil:** Usuarios contables, administrativos y comerciales que trabajan con FacturaScripts en su día a día.

No requiere conocimientos técnicos. Permite analizar datos del ERP, generar informes y resolver dudas sobre el uso del sistema.

#### Opciones de configuración

| Opción | Descripción |
|---|---|
| (Sin opciones configurables) | El plugin funciona automáticamente sin requerir configuración adicional |

#### Skills disponibles

| Skill | Descripción |
|---|---|
| `fs-user:analizar-ventas` | Analiza ventas del período y genera un informe ejecutivo con cifras clave y tendencias |
| `fs-user:clientes-morosos` | Identifica clientes con deuda pendiente y genera un informe de cobro con prioridades |
| `fs-user:stock-bajo` | Identifica productos con stock por debajo del mínimo y genera alertas de reposición |
| `fs-user:crear-informe` | Crea un informe personalizado con los datos de FacturaScripts que necesites |
| `fs-user:como-usar-erp` | Asistente para aprender y resolver dudas sobre el uso de FacturaScripts |
| `fs-user:docs-expert` | Responde preguntas sobre cómo usar FacturaScripts consultando la documentación oficial |

#### Agentes especializados

- **erp-guide** — Guía de uso para usuarios finales: facturación, clientes, inventario, compras y contabilidad (modelo: Haiku)
- **reporting-analyst** — Análisis de datos, informes ejecutivos, ventas, cobros, inventario y tesorería (modelo: Sonnet)
- **docs-expert** — Documentación oficial orientada al usuario (modelo: Haiku)

---

### fs-mcp — Servidor MCP de FacturaScripts

**Perfil:** Cualquier usuario que quiera que Claude acceda directamente a los datos de su FacturaScripts.

Proporciona un servidor [MCP (Model Context Protocol)](https://modelcontextprotocol.io) que conecta Claude directamente con la API REST de FacturaScripts. Permite a Claude consultar datos en tiempo real: facturas, clientes, productos, contabilidad, etc.

#### Opciones de configuración

| Opción | Descripción |
|---|---|
| **FS_DEFAULT_CONNECTION** | Clave de la conexión por defecto (ej: `empresa-principal`). Opcional. |
| **FS_LOCAL_MODULES_PATH** | Ruta absoluta a la carpeta con módulos MCP privados (ej: `/Users/tu-usuario/fs-mcp-modules`). Opcional. |

#### Configuración inicial

Antes de usar el MCP, añade tu conexión a FacturaScripts con la skill:

```
fs-mcp:add-connection
```

O usa la herramienta `add_connection` directamente con los datos de tu instalación:
- **URL** del servidor FacturaScripts (ej: `https://facturascripts.miempresa.com`)
- **Token API** (se genera en la configuración de FacturaScripts)
- **Clave de conexión** para identificarla (ej: `empresa-principal`)

Para instalaciones con HTTPS y certificado autofirmado (local, VPN), añade `rejectUnauthorized: false`.

#### Herramientas disponibles

El servidor expone las siguientes herramientas agrupadas por módulo. Todas aceptan los parámetros `connection` (clave de conexión), `limit` y `offset` para paginación.

**Gestión de conexiones**

| Herramienta | Descripción |
|---|---|
| `add_connection` | Añade o actualiza una conexión a FacturaScripts |
| `list_connections` | Lista todas las conexiones configuradas |
| `set_default_connection` | Establece la conexión por defecto para las consultas posteriores |

**Clientes y proveedores (Core Business)**

`get_clientes`, `get_proveedores`, `get_contactos`, `get_agentes`, `get_grupoclientes`, `get_productos`, `get_variantes`, `get_familias`, `get_fabricantes`, `get_almacenes`, `get_stocks`, `get_tarifas`, `get_atributos`, `get_atributovalores`, `get_productoproveedores`, `get_productoimagenes`

**Ventas**

`get_presupuestoclientes`, `get_lineapresupuestoclientes`, `get_pedidoclientes`, `get_lineapedidoclientes`, `get_albaranclientes`, `get_lineaalbaranclientes`, `get_facturaclientes`, `get_lineafacturaclientes`, `get_reciboclientes`, `get_pagoclientes`

**Compras**

`get_presupuestoproveedores`, `get_lineapresupuestoproveedores`, `get_pedidoproveedores`, `get_lineapedidoproveedores`, `get_albaranproveedores`, `get_lineaalbaranproveedores`, `get_facturaproveedores`, `get_lineafacturaproveedores`, `get_reciboproveedores`, `get_pagoproveedores`, `get_cuentabancoproveedores`

**Contabilidad**

`get_ejercicios`, `get_asientos`, `get_partidas`, `get_cuentas`, `get_subcuentas`, `get_conceptopartidas`, `get_diarios`, `get_cuentaespeciales`

**Finanzas**

`get_cuentabancos`, `get_cuentabancoclientes`, `get_formapagos`, `get_divisas`, `get_retenciones`, `get_impuestos`, `get_impuestozonas`, `get_regularizacionimpuestos`

**Analítica**

`get_clientes_morosos`, `get_clientes_perdidos`, `get_clientes_sin_compras`, `get_clientes_top_facturacion`, `get_clientes_frecuencia_compras`, `get_productos_mas_vendidos`, `get_productos_bajo_stock`, `get_productos_no_vendidos`, `get_facturas_cliente_por_cifnif`, `get_facturas_con_errores`, `get_tiempo_beneficios_cliente`, `get_tiempo_beneficios_todos_clientes`, `exportar_factura_cliente`

**Configuración**

`get_series`, `get_secuenciadocumentos`, `get_formatodocumentos`, `get_estadodocumentos`, `get_doctransformations`, `get_empresas`, `get_apiaccess`, `get_apikeyes`, `get_agenciatransportes`, `get_identificadorfiscales`, `get_pages`, `get_totalmodeles`

**Geografía**

`get_pais`, `get_provincias`, `get_ciudades`, `get_codigopostales`, `get_puntointeresciudades`

**Comunicación**

`get_emailsentes`, `get_emailnotifications`, `get_attachedfiles`, `get_attachedfilerelations`

**Sistema**

`get_logmessages`, `get_tasks`, `get_cronjobes`, `get_workeventes`

**Metadata de modelos (introspección)**

| Herramienta | Descripción |
|---|---|
| `list_models` | Lista todos los modelos del MCP (core + privados) con su descripción y conteo de columnas/relaciones. Útil cuando no sabes qué modelo consultar. |
| `describe_model` | Devuelve la metadata completa de un modelo: columnas con tipo, requerido, label, descripción, FKs y relaciones `belongsTo`/`hasMany`. Acepta `format: "json"` (por defecto) o `"markdown"`. |
| `verify_model_columns` | Llama a la API real con `?limit=1` y compara las keys devueltas con las del metadata local para detectar drift (columnas eliminadas/renombradas o nuevas en la versión instalada). |

#### MCP Resources

Además de tools, el servidor expone los modelos como **MCP Resources** bajo el esquema `fs-schema://`:

- `fs-schema://models` — índice JSON de todos los modelos disponibles.
- `fs-schema://model/<nombre>` — metadata completa del modelo en JSON.
- `fs-schema://model/<nombre>.md` — la misma metadata en markdown legible.
- `fs-schema://relations/<nombre>` — solo las relaciones del modelo.

Los clientes MCP que soporten resources (Claude Code, Claude Desktop) los muestran en su navegador de recursos sin que aparezcan en el listado de tools.

#### Skills del MCP

| Skill | Descripción |
|---|---|
| `fs-mcp:add-connection` | Guía interactiva para añadir una nueva conexión a FacturaScripts |
| `fs-mcp:list-connections` | Lista y gestiona las conexiones configuradas |
| `fs-mcp:configure-local-modules` | Configura la ruta de módulos MCP locales privados |
| `fs-mcp:sync-models` | Mantiene el catálogo de modelos: añade modelos nuevos, detecta cambios entre versiones de FacturaScripts, regenera metadata, redacta descripciones. Soporta core y privados, ruta local o GitHub. Ver [Metadata de modelos](#metadata-de-modelos-fs-mcp). |

---

## Módulos locales privados (fs-mcp)

El servidor MCP soporta **módulos locales privados**: herramientas adicionales que solo existen en tu máquina y nunca se suben al repositorio. Son útiles para integrar endpoints de plugins privados, integraciones específicas de tu empresa o cualquier funcionalidad que no quieras compartir públicamente.

### Cómo funciona

Al arrancar, el servidor MCP lee la variable de entorno `FS_LOCAL_MODULES_PATH`. Si apunta a un directorio válido, carga automáticamente todos los módulos que encuentra dentro. Cada módulo es una carpeta con un archivo `index.js`.

Si la variable no está configurada o el directorio no existe, el servidor arranca normalmente sin cargar módulos locales.

### Configurar FS_LOCAL_MODULES_PATH

La variable se configura a través de los ajustes del plugin en Claude Code. Usa la skill:

```
fs-mcp:configure-local-modules
```

O ve a la configuración del plugin `fs-mcp` en Claude Code y establece el campo **"Ruta de módulos locales privados"** con la ruta absoluta a tu carpeta (ej: `/Users/tu-usuario/mis-modulos-fs`).

Este valor se almacena **localmente en tu máquina** y nunca se sube a GitHub.

### Crear un módulo local

Cada módulo es una carpeta con un `index.js` dentro de tu directorio de módulos privados:

```
mis-modulos-fs/
  mi-modulo/
    index.js
  otro-modulo/
    index.js
```

El `index.js` debe exportar dos funciones: `registerTools` (para declarar las herramientas MCP) y `handleTool` (para ejecutarlas). El `client` que recibe `handleTool` es la instancia de conexión a FacturaScripts ya configurada.

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
  if (name !== 'get_mi_recurso') return null; // importante: devolver null si no es tu tool

  const result = await client.get('/mi-endpoint', {
    limit:  args.limit  ?? 50,
    offset: args.offset ?? 0,
  }, args.connection);

  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
}
```

### Filtros y ordenación

La API de FacturaScripts acepta filtros con el formato `filter[campo]=valor` y ordenación con `sort[campo]=ASC|DESC`. Puedes construirlos manualmente en tus módulos:

```javascript
export async function handleTool(name, args, client) {
  if (name !== 'get_mi_recurso') return null;

  const params = {
    limit:  args.limit  ?? 50,
    offset: args.offset ?? 0,
  };

  // Filtro simple: "status:ACTIVE,type:cliente"
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

```
[local-loader] ✓ Módulo local cargado: mi-modulo (+1 modelos)
[local-loader] 1 módulo(s) local(es) cargado(s) desde: /ruta/a/mis-modulos-fs
```

El sufijo `(+N modelos)` aparece cuando el módulo aporta también metadata de modelos (ver siguiente sección). Si hay algún problema con un módulo (falta `index.js`, no exporta las funciones correctas), se registra un aviso y el servidor continúa cargando el resto.

### Aportar metadata de modelos desde un módulo privado

Un módulo privado puede exportar opcionalmente la metadata de los modelos del plugin de FacturaScripts al que se conecta, para que aparezcan en `list_models`, `describe_model` y los Resources `fs-schema://model/<nombre>`. Solo hay que:

1. Generar el archivo `metadata.js` con la skill [`fs-mcp:sync-models`](#metadata-de-modelos-fs-mcp).
2. Importarlo desde `index.js` y exportarlo como `modelMetadata`:

```javascript
// mis-modulos-fs/mi-modulo/index.js

import miModeloMetadata from './metadata.js';

export async function registerTools(toolsMap) { /* ... */ }
export async function handleTool(name, args, client) { /* ... */ }

// El local-loader lee este export y lo añade al registry global del MCP.
export const modelMetadata = [miModeloMetadata];
```

El `local-loader` valida la estructura mínima (`name`, `table`, `endpoint`, `primaryKey`, `description`, `source`, `columns`, `relations`, `generatedFrom`) y registra los modelos válidos. Los inválidos se omiten con un aviso.

---

## Metadata de modelos (fs-mcp)

El servidor MCP mantiene una **metadata estructurada** de cada modelo de FacturaScripts (los 83 del core + los que aportes desde plugins privados). Esta metadata describe cada columna con su tipo, longitud, FK, descripción funcional, etc., y la usa Claude para generar consultas e informes complejos sin adivinar.

### Qué se expone al asistente

Tres canales para los mismos datos:

- **Tools** (`list_models`, `describe_model`, `verify_model_columns`) — llamables explícitamente.
- **Resources** (`fs-schema://...`) — navegables sin invocar tools.
- **Enriquecimiento automático** — los `inputSchema` de los tools `create_*`, `update_*` y `get_*` se rellenan con `maxLength` y `enum` desde la metadata al arrancar el servidor (sin pisar las descripciones hardcoded).

### Single source of truth para descripciones

Las descripciones de cada columna se guardan en archivos JSON aparte, lo que las hace fáciles de auditar y mantener:

- **Core** → `fs-mcp/server/src/metadata/descriptions-overrides.json` (committed en el repo del plugin).
- **Privados** → `<outputBase>/descriptions.json` (en la carpeta privada del usuario, no se sube a GitHub).

Estructura: `{ "modelo": { "campo": "descripción contextual" } }`. Estas descripciones ganan sobre cualquier otra fuente (XMLView, traducciones de FS, FK genérica) al regenerar la metadata.

### Regenerar la metadata

El comando `npm run generate:metadata` tiene dos modos:

**Modo CORE** — regenera los modelos del core de FacturaScripts:

```bash
cd fs-mcp/server
npm run generate:metadata -- --fs-path=/ruta/a/facturascripts
```

Lee `Core/Table/*.xml`, `Core/XMLView/*.xml`, `Core/Translation/es_ES.json` y escribe los archivos TS en `server/src/metadata/models/`. Tras regenerar hay que recompilar (`npm run build`) para que el servidor cargue los cambios.

**Modo PLUGIN** — regenera los modelos de un plugin privado:

```bash
cd fs-mcp/server
npm run generate:metadata -- --manifest=/ruta/a/manifest.json
```

El `manifest.json` declara qué modelos generar, dónde están sus tablas XML del plugin de FS, dónde escribir el `metadata.js` resultante y opcionalmente la ruta del archivo de descripciones del usuario.

Estructura del manifest:

```json
{
    "moduleName": "forja",
    "fsPath": "/ruta/a/facturascripts",
    "pluginPath": "/ruta/a/facturascripts/Plugins/Forja",
    "outputBase": "/ruta/a/mis-modulos-fs",
    "descriptionsOverridesPath": "/ruta/a/mis-modulos-fs/descriptions.json",
    "models": [
        {
            "name": "task",
            "outputDir": "tasks",
            "table": "tasks",
            "endpoint": "/tasks",
            "editView": "CardTask",
            "description": "Tarea del plugin Forja..."
        }
    ]
}
```

Por cada modelo, el generador escribe `<outputBase>/<outputDir>/metadata.js`. El `index.js` del módulo importa ese `metadata.js` y lo expone como `modelMetadata` (ver sección anterior).

### Mantener el catálogo con la skill `sync-models`

Para no tener que recordar los pasos manuales, usa la skill:

```
fs-mcp:sync-models
```

La skill detecta cambios entre tu metadata local y una fuente (carpeta local de FacturaScripts o URL de GitHub) y orquesta todo el flujo:

- **Modelo nuevo** → añade entrada al `MODEL_CATALOG` (core) o al `manifest.json` (privado), redacta descripciones contextuales para todas las columnas, regenera y compila.
- **Modelo existente** → detecta columnas añadidas/eliminadas/cambiadas, redacta descripciones para las nuevas, ajusta el override.
- **Lista de modelos** → procesa varios en lote (misma ruta o cada uno en distinta), regenera al final una sola vez.
- **Refresh masivo** → audita los 83 modelos del core contra una versión nueva de FacturaScripts (ej: tras `git pull` del core) y actualiza el commit registrado.

Ejemplos de invocación habituales:

- *"Revisa el modelo cliente del core, fuente /Users/yo/facturascripts"*
- *"Añade el modelo bulletin del plugin privado, está en /Users/yo/facturascripts/Plugins/Forja"*
- *"Refresca todos los modelos del core con la versión nueva en /Users/yo/facturascripts"*
- *"Revisa task del plugin privado en https://github.com/X/Forja"*

La skill usa internamente el script `node dist/scripts/compare-model.js` para detectar cambios estructurales (added/removed/changed) y devolver un JSON con el detalle. Si quieres invocarlo directamente:

```bash
cd fs-mcp/server
node dist/scripts/compare-model.js --model=cliente \
  --source=/Users/yo/facturascripts --type=core
```

### Scripts auxiliares de mantenimiento

En `fs-mcp/server/src/scripts/`:

| Script | Descripción |
|---|---|
| `generate-metadata.ts` | Generador principal (modo CORE o PLUGIN). |
| `compare-model.ts` | Compara un modelo del registry con su XML fuente y reporta diferencias en JSON. |
| `list-undocumented.ts` | Lista las columnas sin descripción agrupadas por modelo (debe dar `0`). |
| `dump-all-descriptions.ts` | Vuelca todas las descripciones a `/tmp/all-descriptions-dump.json` y reporta cuántas son genéricas. |
| `test-metadata.ts` | Suite de tests unitarios sobre el sistema de metadata (registry, resources, tools, enriquecimiento). |

Tras compilar (`npm run build`) se ejecutan con `node dist/scripts/<nombre>.js`.

---

## Requisitos

- [Claude Code](https://claude.ai/code) con soporte de plugins
- FacturaScripts con API REST habilitada (para el plugin `fs-mcp`)
- Node.js ≥ 18 (solo necesario si recompilás el servidor MCP desde el código fuente; el repositorio incluye los archivos `dist/` precompilados)

---

## Estructura del repositorio

```
fs-claude-plugin/
├── fs-dev/                    # Plugin para desarrolladores
│   ├── agents/                # Agentes especializados de IA
│   ├── hooks/                 # Detección automática de contexto FacturaScripts
│   ├── scripts/               # Scripts auxiliares (detect-facturascripts.sh)
│   ├── skills/                # Skills de desarrollo
│   └── .claude-plugin/plugin.json
│
├── fs-user/                   # Plugin para usuarios del ERP
│   ├── agents/                # Agentes para usuarios finales
│   ├── hooks/                 # Detección automática de contexto
│   ├── scripts/
│   ├── skills/                # Skills de análisis e informes
│   └── .claude-plugin/plugin.json
│
└── fs-mcp/                    # Servidor MCP de FacturaScripts
    ├── server/
    │   ├── src/
    │   │   ├── modules/       # Tools por área (accounting, sales, schema, etc.)
    │   │   ├── metadata/      # Sistema de metadata de modelos
    │   │   │   ├── descriptions-overrides.json  # Descripciones del core (committed)
    │   │   │   ├── models/    # Metadata generada por modelo (auto)
    │   │   │   ├── index.ts   # Agregador (auto)
    │   │   │   ├── registry.ts # Registry mutable (core + privados)
    │   │   │   ├── enrich.ts  # Enriquecimiento de inputSchemas
    │   │   │   └── types.ts   # Tipos ModelMetadata, ColumnMetadata, etc.
    │   │   ├── resources/     # Handlers MCP Resources (fs-schema://)
    │   │   ├── scripts/       # generate-metadata, compare-model, etc.
    │   │   ├── local-loader.ts # Cargador de módulos privados + metadata
    │   │   └── index.ts       # Punto de entrada del servidor
    │   └── dist/              # Código compilado (incluido en el repo)
    ├── skills/                # Skills (add-connection, sync-models, etc.)
    └── .claude-plugin/plugin.json
```

---

## Licencia

MIT — [FacturaScripts](https://facturascripts.com)
