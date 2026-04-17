/**
 * FacturaScripts MCP Server
 * Main entry point for the Model Context Protocol server
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
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
import { loadLocalModules } from './local-loader.js';
// Track registered tools
const tools = new Map();
// Handlers de módulos locales privados (cargados desde FS_LOCAL_MODULES_PATH)
let localModuleHandlers = [];
/**
 * Initialize and configure the MCP server
 */
const server = new Server({
    name: 'fs-mcp',
    version: '0.1.0',
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
/**
 * Register connection management tools
 */
function registerConnectionTools() {
    // Tool: add_connection
    const addConnectionTool = {
        name: 'add_connection',
        description: 'Add a new FacturaScripts server connection. Use this to connect to a FacturaScripts instance.',
        inputSchema: {
            type: 'object',
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
                    description: 'Base URL of the FacturaScripts instance (e.g., https://facturascripts.example.com)',
                },
                token: {
                    type: 'string',
                    description: 'API token for authentication',
                },
                version: {
                    type: 'string',
                    description: 'FacturaScripts version (optional, used for API compatibility)',
                },
                setAsDefault: {
                    type: 'boolean',
                    description: 'Set this connection as the default one for subsequent requests',
                },
            },
            required: ['key', 'name', 'url', 'token'],
        },
    };
    tools.set('add_connection', addConnectionTool);
    // Tool: list_connections
    const listConnectionsTool = {
        name: 'list_connections',
        description: 'List all configured FacturaScripts server connections',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    };
    tools.set('list_connections', listConnectionsTool);
    // Tool: set_default_connection
    const setDefaultConnectionTool = {
        name: 'set_default_connection',
        description: 'Set the default FacturaScripts server connection for subsequent requests',
        inputSchema: {
            type: 'object',
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
async function registerAllTools() {
    // Register connection tools first
    registerConnectionTools();
    // Register module tools
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
    // Cargar módulos locales privados (desde FS_LOCAL_MODULES_PATH o dist/modules-local)
    localModuleHandlers = await loadLocalModules(tools);
}
/**
 * List tools handler
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    const toolList = Array.from(tools.values());
    // Combine with tools from modules that are registered via setRequestHandler
    return { tools: toolList };
});
/**
 * Call tool handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const toolInput = request.params.arguments;
    try {
        switch (toolName) {
            case 'add_connection': {
                const { key, name, url, token, version, setAsDefault } = toolInput;
                connectionManager.addConnection(key, {
                    name,
                    url,
                    token,
                    ...(version ? { version } : {}),
                });
                if (setAsDefault) {
                    connectionManager.setDefault(key);
                }
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Connection "${name}" (${key}) added successfully${setAsDefault ? ' and set as default' : ''}`,
                        },
                    ],
                };
            }
            case 'list_connections': {
                const connections = connectionManager.listConnections();
                if (connections.length === 0) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: 'No connections configured. Use add_connection to add one.',
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
                            type: 'text',
                            text: `Configured connections:\n${connectionList}`,
                        },
                    ],
                };
            }
            case 'set_default_connection': {
                const { key } = toolInput;
                connectionManager.setDefault(key);
                const conn = connectionManager.getConnection(key);
                return {
                    content: [
                        {
                            type: 'text',
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
                    ?? await handleAnalyticsTool(toolName, toolInput);
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
                            type: 'text',
                            text: `Unknown tool: ${toolName}`,
                        },
                    ],
                    isError: true,
                };
            }
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
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
async function main() {
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
//# sourceMappingURL=index.js.map