/**
 * FacturaScripts MCP Server
 * Main entry point for the Model Context Protocol server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { connectionManager } from './connection-manager.js';
import { registerAccountingTools, handleAccountingTool } from './modules/accounting/index.js';
import { registerCoreBusinessTools, handleCoreBusinessTool } from './modules/core-business/index.js';
import { registerSalesOrdersTools, handleSalesOrdersTool } from './modules/sales-orders/index.js';
import { registerPurchasingTools, handlePurchasingTool } from './modules/purchasing/index.js';
import { registerFinanceTools, handleFinanceTool } from './modules/finance/index.js';
import { registerConfigurationTools, handleConfigurationTool } from './modules/configuration/index.js';
import { registerGeographicTools, handleGeographicTool } from './modules/geographic/index.js';
import { registerCommunicationTools, handleCommunicationTool } from './modules/communication/index.js';
import { registerSystemTools, handleSystemTool } from './modules/system/index.js';
import { registerAnalyticsTools, handleAnalyticsTool } from './modules/analytics/index.js';
import { registerSchemaTools, handleSchemaTool } from './modules/schema/index.js';
import { fsClient } from './fs/client.js';
import { listSchemaResources, readSchemaResource } from './resources/schema-resources.js';
import { addDateRangeParams } from './metadata/dateRange.js';
import { enrichAllTools } from './metadata/enrich.js';
import { bootstrapCoreMetadata, getAllModelMetadata } from './metadata/registry.js';
import { loadLocalModules, type LocalModuleHandler } from './local-loader.js';
import { handleOfficialPluginTool, registerOfficialPluginTools } from './plugins/index.js';
import { validateToolInput } from './utils/validateInput.js';

// Track registered tools
const tools = new Map<string, Tool>();

// Handlers de módulos locales privados (cargados desde FS_LOCAL_MODULES_PATH)
let localModuleHandlers: LocalModuleHandler[] = [];

/**
 * Initialize and configure the MCP server
 */
const server = new Server(
  {
    name: 'fs-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

/**
 * Register connection management tools
 */
function registerConnectionTools(): void {
  // Tool: add_connection
  const addConnectionTool: Tool = {
    name: 'add_connection',
    description:
      'Add a new FacturaScripts server connection. Use this to connect to a FacturaScripts instance (REST API /api/3). ' +
      'Author tokens of the facturascripts.com Forja API are not managed here: use the fs-forja plugin (forja_add_connection).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        key: {
          type: 'string',
          description: 'Unique identifier for this connection',
        },
        name: {
          type: 'string',
          description: 'Display name for this connection',
        },
        url: {
          type: 'string',
          description:
            'Base URL of the FacturaScripts instance (e.g., https://facturascripts.example.com). ' +
            'A trailing /api/3 is removed',
        },
        token: {
          type: 'string',
          description: 'API token for authentication',
        },
        rejectUnauthorized: {
          type: 'boolean',
          description:
            'Set to false to accept self-signed or unverifiable HTTPS certificates (local installations only)',
        },
        version: {
          type: 'string',
          description:
            'FacturaScripts version (optional, used for API compatibility)',
        },
        setAsDefault: {
          type: 'boolean',
          description:
            'Set this connection as the default one for subsequent requests',
        },
        overwrite: {
          type: 'boolean',
          description:
            'Replace an existing connection with the same key (default false: adding an existing key fails). ' +
            'Only after the user confirms, because the old token is lost',
        },
      },
      required: ['key', 'name', 'url', 'token'],
    },
  };

  tools.set('add_connection', addConnectionTool);

  // Tool: list_connections
  const listConnectionsTool: Tool = {
    name: 'list_connections',
    description: 'List all configured FacturaScripts server connections',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  };

  tools.set('list_connections', listConnectionsTool);

  // Tool: set_default_connection
  const setDefaultConnectionTool: Tool = {
    name: 'set_default_connection',
    description: 'Set the default FacturaScripts server connection for subsequent requests',
    inputSchema: {
      type: 'object' as const,
      properties: {
        key: {
          type: 'string',
          description: 'Key of the connection to set as default',
        },
      },
      required: ['key'],
    },
  };

  tools.set('set_default_connection', setDefaultConnectionTool);
}

/**
 * Register all tool modules
 */
async function registerAllTools(): Promise<void> {
  // 1. Cargar la metadata del core en el registry mutable.
  const coreCount = await bootstrapCoreMetadata();
  console.error(`[fs-mcp] Modelos del core registrados: ${coreCount}`);

  // 2. Tools de gestión de conexiones.
  registerConnectionTools();

  // 3. Tools de cada módulo del MCP.
  await registerAccountingTools(tools);
  await registerCoreBusinessTools(tools);
  await registerSalesOrdersTools(tools);
  await registerPurchasingTools(tools);
  await registerFinanceTools(tools);
  await registerConfigurationTools(tools);
  await registerGeographicTools(tools);
  await registerCommunicationTools(tools);
  await registerSystemTools(tools);
  await registerAnalyticsTools(tools);

  // 3b. Plugins oficiales de FacturaScripts (src/plugins): registran la metadata
  // de sus modelos y sus tools, separados de los módulos del core.
  registerOfficialPluginTools(tools);

  // Tools del core y de los plugins oficiales, ANTES de cargar las locales: solo
  // a éstas se les inyectan los filtros de rango de fecha (paso 8), porque son las
  // únicas cuyos handlers los reenvían. Los módulos locales ya ofrecen rangos por
  // su propio parámetro `filter`.
  const coreToolNames = new Set(tools.keys());
  const builtInTools = new Map(tools);

  // 4. Cargar módulos locales privados: registran sus tools y, si los exponen,
  // sus modelos en el registry de metadata.
  localModuleHandlers = await loadLocalModules(tools);

  // Un módulo local no puede sustituir una tool del servidor: su handler nunca se
  // llamaría (se despacha antes a los del servidor) y el esquema no casaría.
  for (const [name, tool] of builtInTools) {
    if (tools.get(name) !== tool) {
      console.error(`[fs-mcp] Un módulo local redefine la tool ${name}; se conserva la del servidor.`);
      tools.set(name, tool);
    }
  }

  // 5. Tools del schema (describe_model, list_models, verify_model_columns):
  // se construyen DESPUÉS de cargar locales para que sus enums incluyan tanto
  // los modelos del core como los privados.
  await registerSchemaTools(tools);

  // 6. Resumen final del registry (core + privados ya cargados).
  const totalModels = getAllModelMetadata().length;
  console.error(
    `[fs-mcp] Modelos totales en el registry: ${totalModels} (core + privados).`,
  );

  // 7. Enriquecer los inputSchema de los tools con la metadata: completa
  // descripciones vacías, maxLength y enums sin pisar descripciones hardcoded.
  const stats = enrichAllTools(tools);
  console.error(
    `[fs-mcp] Tools enriquecidas: ${stats.toolsEnriched}/${stats.toolsProcessed} ` +
      `(+${stats.descriptionsAdded} descripciones, +${stats.maxLengthsAdded} maxLength, +${stats.enumsAdded} enums)`,
  );

  // 8. Añadir a las tools get_* los filtros de rango (<columna>_gte / <columna>_lte)
  // de sus columnas de fecha. Los handlers reenvían esos mismos parámetros usando
  // la misma regla (metadata/dateRange.ts), así esquema y reenvío no pueden divergir.
  const dateRangeParams = addDateRangeParams(tools, coreToolNames);
  console.error(`[fs-mcp] Filtros de rango de fecha añadidos: ${dateRangeParams}`);
}

/**
 * List resources handler: expone la metadata de modelos como MCP Resources
 * bajo el esquema fs-schema://...
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources: listSchemaResources() };
});

/**
 * Read resource handler: devuelve el contenido del resource solicitado.
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const result = readSchemaResource(uri);
  if (!result) {
    throw new Error(`Resource no soportado: ${uri}`);
  }
  return { contents: [result] };
});

/**
 * List tools handler
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolList = Array.from(tools.values());
  // Combine with tools from modules that are registered via setRequestHandler
  return { tools: toolList };
});

// Las tools de conexión guardan sus argumentos en el archivo de conexiones tal
// como llegan, así que ahí un número no vale por texto: se guardaría como número
const CONNECTION_TOOLS = new Set(['add_connection', 'set_default_connection']);

function connectionArgsAsText(toolName: string, schema: Tool['inputSchema'], input: Record<string, unknown> | undefined): string | null {
  if (!CONNECTION_TOOLS.has(toolName)) return null;
  for (const [name, value] of Object.entries(input ?? {})) {
    const property = schema.properties?.[name] as { type?: string } | undefined;
    if (property?.type === 'string' && typeof value === 'number') {
      return `el argumento "${name}" va como texto, entre comillas`;
    }
  }
  return null;
}

/**
 * Call tool handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const toolInput = request.params.arguments as Record<string, unknown>;

  // Los handlers no validan sus argumentos: se rechaza lo que no case con el
  // inputSchema antes de llamarlos
  const tool = tools.get(toolName);
  const invalid = tool ? validateToolInput(tool.inputSchema, toolInput) ?? connectionArgsAsText(toolName, tool.inputSchema, toolInput) : null;
  if (invalid) {
    return {
      content: [{ type: 'text' as const, text: `Argumentos no válidos para ${toolName}: ${invalid}` }],
      isError: true,
    };
  }

  try {
    switch (toolName) {
      case 'add_connection': {
        const { key, name, url, token, version, rejectUnauthorized, setAsDefault, overwrite } = toolInput as {
          key: string;
          name: string;
          url: string;
          token: string;
          version?: string;
          rejectUnauthorized?: boolean | '1' | '0';
          setAsDefault?: boolean | '1' | '0';
          overwrite?: boolean | '1' | '0';
        };
        // La validación acepta "1" y "0" como booleanos, y "0" es verdadero en JS:
        // solo true y "1" cuentan como verdadero
        const isTrue = (value: unknown): boolean => value === true || value === '1';
        const makeDefault = isTrue(setAsDefault);
        const replace = isTrue(overwrite);

        connectionManager.addConnection(key, {
          name,
          url,
          token,
          ...(version ? { version } : {}),
          ...(rejectUnauthorized !== undefined ? { rejectUnauthorized: isTrue(rejectUnauthorized) } : {}),
        }, replace);

        // Al sustituir una conexión existente, las instancias de axios cacheadas quedarían obsoletas.
        fsClient.clearCache();

        if (makeDefault) {
          connectionManager.setDefault(key);
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: `Connection "${name}" (${key}, ${connectionManager.getConnection(key).url}) ${
                replace ? 'saved' : 'added'
              } successfully${
                makeDefault ? ' and set as default' : ''
              }`,
            },
          ],
        };
      }

      case 'list_connections': {
        // Las conexiones de tipo forja comparten el archivo, pero son del plugin fs-forja
        const allConnections = connectionManager.listConnections();
        const connections = allConnections.filter((conn) => conn.type === 'api');
        const forjaCount = allConnections.length - connections.length;
        const forjaNote = forjaCount > 0
          ? `\n\n${forjaCount} connection(s) of type forja in the same file are managed by the fs-forja plugin (forja_list_connections).`
          : '';

        if (connections.length === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `No connections configured. Use add_connection to add one.${forjaNote}`,
              },
            ],
          };
        }

        const connectionList = connections
          .map((conn) => {
            const isDefault = conn.isDefault ? ' (default)' : '';
            return `- ${conn.name} (${conn.key}): ${conn.url}${isDefault}`;
          })
          .join('\n');

        return {
          content: [
            {
              type: 'text' as const,
              text: `Configured connections:\n${connectionList}${forjaNote}`,
            },
          ],
        };
      }

      case 'set_default_connection': {
        const { key } = toolInput as { key: string };

        connectionManager.setDefault(key);
        // La instancia cacheada como "default" apuntaba a la conexión anterior.
        fsClient.clearCache();

        const conn = connectionManager.getConnection(key);
        return {
          content: [
            {
              type: 'text' as const,
              text: `Connection "${conn?.name}" (${key}) set as default`,
            },
          ],
        };
      }

      default: {
        // Try to dispatch to module handlers
        let result = await handleAccountingTool(toolName, toolInput)
          ?? await handleCoreBusinessTool(toolName, toolInput)
          ?? await handleSalesOrdersTool(toolName, toolInput)
          ?? await handlePurchasingTool(toolName, toolInput)
          ?? await handleFinanceTool(toolName, toolInput)
          ?? await handleConfigurationTool(toolName, toolInput)
          ?? await handleGeographicTool(toolName, toolInput)
          ?? await handleCommunicationTool(toolName, toolInput)
          ?? await handleSystemTool(toolName, toolInput)
          ?? await handleAnalyticsTool(toolName, toolInput)
          ?? await handleOfficialPluginTool(toolName, toolInput)
          ?? await handleSchemaTool(toolName, toolInput);

        if (result) {
          return result;
        }

        // Intentar con módulos locales privados
        for (const handler of localModuleHandlers) {
          const localResult = await handler.handleTool(toolName, toolInput);
          if (localResult) {
            return localResult;
          }
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: `Unknown tool: ${toolName}`,
            },
          ],
          isError: true,
        };
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error executing tool ${toolName}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Main server initialization and startup
 */
async function main(): Promise<void> {
  const transport = new StdioServerTransport();

  // Register all tools before connecting
  await registerAllTools();

  // Connect server to transport
  await server.connect(transport);

  console.error('[fs-mcp] Server started successfully');
}

/**
 * Error handling
 */
process.on('uncaughtException', (error) => {
  console.error('[fs-mcp] Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[fs-mcp] Unhandled rejection at promise:', promise);
  console.error('[fs-mcp] Reason:', reason);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error('[fs-mcp] Failed to start server:', error);
  process.exit(1);
});
