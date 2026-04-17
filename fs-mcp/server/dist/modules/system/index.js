/**
 * System Module for FacturaScripts MCP Server
 * Provides tools for accessing system logs, tasks, and events
 */
import { fsClient } from '../../fs/client.js';
/**
 * Register all system tools with the MCP server
 */
export async function registerSystemTools(server, tools) {
    // Tool: get_logmessages
    const getLogMessagesTool = {
        name: 'get_logmessages',
        description: 'Get log messages from FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Connection key to use (optional, uses default if not specified)',
                },
                offset: {
                    type: 'number',
                    description: 'Pagination offset (default: 0)',
                },
                limit: {
                    type: 'number',
                    description: 'Pagination limit (default: 100)',
                },
                channel: {
                    type: 'string',
                    description: 'Filter by log channel',
                },
                level: {
                    type: 'string',
                    description: 'Filter by log level (INFO, WARNING, ERROR, etc.)',
                },
                fecha: {
                    type: 'string',
                    description: 'Filter by date (YYYY-MM-DD format)',
                },
            },
            required: [],
        },
    };
    tools.set('get_logmessages', getLogMessagesTool);
    // Tool: get_tasks
    const getTasksTool = {
        name: 'get_tasks',
        description: 'Get tasks from FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Connection key to use (optional, uses default if not specified)',
                },
                offset: {
                    type: 'number',
                    description: 'Pagination offset (default: 0)',
                },
                limit: {
                    type: 'number',
                    description: 'Pagination limit (default: 100)',
                },
                done: {
                    type: 'boolean',
                    description: 'Filter by task completion status',
                },
                fecha: {
                    type: 'string',
                    description: 'Filter by date (YYYY-MM-DD format)',
                },
            },
            required: [],
        },
    };
    tools.set('get_tasks', getTasksTool);
    // Tool: get_cronjobes
    const getCronJobsTool = {
        name: 'get_cronjobes',
        description: 'Get cron jobs from FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Connection key to use (optional, uses default if not specified)',
                },
                offset: {
                    type: 'number',
                    description: 'Pagination offset (default: 0)',
                },
                limit: {
                    type: 'number',
                    description: 'Pagination limit (default: 100)',
                },
            },
            required: [],
        },
    };
    tools.set('get_cronjobes', getCronJobsTool);
    // Tool: get_workeventes
    const getWorkEventsTool = {
        name: 'get_workeventes',
        description: 'Get work events from FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Connection key to use (optional, uses default if not specified)',
                },
                offset: {
                    type: 'number',
                    description: 'Pagination offset (default: 0)',
                },
                limit: {
                    type: 'number',
                    description: 'Pagination limit (default: 100)',
                },
            },
            required: [],
        },
    };
    tools.set('get_workeventes', getWorkEventsTool);
    // Register tool handlers
    server.setRequestHandler({
        method: 'tools/call',
        params: {
            name: 'string',
            arguments: 'object',
        },
    }, async (request) => {
        const { name, arguments: args } = request.params;
        const connection = args.connection || undefined;
        const offset = args.offset || 0;
        const limit = args.limit || 100;
        try {
            let result;
            switch (name) {
                case 'get_logmessages': {
                    const params = { offset, limit };
                    if (args.channel)
                        params.channel = args.channel;
                    if (args.level)
                        params.level = args.level;
                    if (args.fecha)
                        params.fecha = args.fecha;
                    result = await fsClient.get('/logmessages', params, connection);
                    break;
                }
                case 'get_tasks': {
                    const params = { offset, limit };
                    if (args.done !== undefined)
                        params.done = args.done;
                    if (args.fecha)
                        params.fecha = args.fecha;
                    result = await fsClient.get('/tasks', params, connection);
                    break;
                }
                case 'get_cronjobes': {
                    result = await fsClient.get('/cronjobes', { offset, limit }, connection);
                    break;
                }
                case 'get_workeventes': {
                    result = await fsClient.get('/workeventes', { offset, limit }, connection);
                    break;
                }
                default:
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({ error: `Unknown system tool: ${name}` }, null, 2),
                            },
                        ],
                        isError: true,
                    };
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ error: errorMessage }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    });
}
//# sourceMappingURL=index.js.map