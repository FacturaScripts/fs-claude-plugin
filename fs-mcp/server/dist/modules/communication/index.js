/**
 * Communication Module for FacturaScripts MCP Server
 * Provides tools for accessing communication and notification data
 */
import { fsClient } from '../../fs/client.js';
/**
 * Register all communication tools with the MCP server
 */
export async function registerCommunicationTools(server, tools) {
    // Tool: get_emailsentes
    const getEmailSentesTool = {
        name: 'get_emailsentes',
        description: 'Get sent emails from FacturaScripts',
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
                destinatario: {
                    type: 'string',
                    description: 'Filter by recipient email',
                },
                asunto: {
                    type: 'string',
                    description: 'Filter by subject',
                },
                fecha: {
                    type: 'string',
                    description: 'Filter by date (YYYY-MM-DD format)',
                },
            },
            required: [],
        },
    };
    tools.set('get_emailsentes', getEmailSentesTool);
    // Tool: get_emailnotifications
    const getEmailNotificationsTool = {
        name: 'get_emailnotifications',
        description: 'Get email notifications from FacturaScripts',
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
    tools.set('get_emailnotifications', getEmailNotificationsTool);
    // Tool: get_attachedfiles
    const getAttachedFilesTool = {
        name: 'get_attachedfiles',
        description: 'Get attached files from FacturaScripts',
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
                modelo: {
                    type: 'string',
                    description: 'Filter by model name',
                },
                modelid: {
                    type: 'string',
                    description: 'Filter by model ID',
                },
            },
            required: [],
        },
    };
    tools.set('get_attachedfiles', getAttachedFilesTool);
    // Tool: get_attachedfilerelations
    const getAttachedFileRelationsTool = {
        name: 'get_attachedfilerelations',
        description: 'Get attached file relations from FacturaScripts',
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
    tools.set('get_attachedfilerelations', getAttachedFileRelationsTool);
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
                case 'get_emailsentes': {
                    const params = { offset, limit };
                    if (args.destinatario)
                        params.destinatario = args.destinatario;
                    if (args.asunto)
                        params.asunto = args.asunto;
                    if (args.fecha)
                        params.fecha = args.fecha;
                    result = await fsClient.get('/emailsentes', params, connection);
                    break;
                }
                case 'get_emailnotifications': {
                    result = await fsClient.get('/emailnotifications', { offset, limit }, connection);
                    break;
                }
                case 'get_attachedfiles': {
                    const params = { offset, limit };
                    if (args.modelo)
                        params.modelo = args.modelo;
                    if (args.modelid)
                        params.modelid = args.modelid;
                    result = await fsClient.get('/attachedfiles', params, connection);
                    break;
                }
                case 'get_attachedfilerelations': {
                    result = await fsClient.get('/attachedfilerelations', { offset, limit }, connection);
                    break;
                }
                default:
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({ error: `Unknown communication tool: ${name}` }, null, 2),
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