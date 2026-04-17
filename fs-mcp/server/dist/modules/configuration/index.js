/**
 * Configuration Module for FacturaScripts MCP Server
 * Provides tools for accessing system configuration and settings
 */
import { fsClient } from '../../fs/client.js';
/**
 * Register all configuration tools with the MCP server
 */
export async function registerConfigurationTools(server, tools) {
    // Tool: get_series
    const getSeriesTool = {
        name: 'get_series',
        description: 'Get document series from FacturaScripts',
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
                codserie: {
                    type: 'string',
                    description: 'Filter by series code',
                },
                tipodoc: {
                    type: 'string',
                    description: 'Filter by document type',
                },
            },
            required: [],
        },
    };
    tools.set('get_series', getSeriesTool);
    // Tool: get_secuenciadocumentos
    const getSecuenciaDocumentosTool = {
        name: 'get_secuenciadocumentos',
        description: 'Get document sequences from FacturaScripts',
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
    tools.set('get_secuenciadocumentos', getSecuenciaDocumentosTool);
    // Tool: get_formatodocumentos
    const getFormatoDocumentosTool = {
        name: 'get_formatodocumentos',
        description: 'Get document formats from FacturaScripts',
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
    tools.set('get_formatodocumentos', getFormatoDocumentosTool);
    // Tool: get_estadodocumentos
    const getEstadoDocumentosTool = {
        name: 'get_estadodocumentos',
        description: 'Get document statuses from FacturaScripts',
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
                tipodoc: {
                    type: 'string',
                    description: 'Filter by document type',
                },
            },
            required: [],
        },
    };
    tools.set('get_estadodocumentos', getEstadoDocumentosTool);
    // Tool: get_doctransformations
    const getDocTransformationsTool = {
        name: 'get_doctransformations',
        description: 'Get document transformations from FacturaScripts',
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
    tools.set('get_doctransformations', getDocTransformationsTool);
    // Tool: get_pagefilteres
    const getPageFiltersTool = {
        name: 'get_pagefilteres',
        description: 'Get page filters from FacturaScripts',
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
    tools.set('get_pagefilteres', getPageFiltersTool);
    // Tool: get_pages
    const getPagesTool = {
        name: 'get_pages',
        description: 'Get pages from FacturaScripts',
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
    tools.set('get_pages', getPagesTool);
    // Tool: get_publications
    const getPublicationsTool = {
        name: 'get_publications',
        description: 'Get publications from FacturaScripts',
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
    tools.set('get_publications', getPublicationsTool);
    // Tool: get_totalmodeles
    const getTotalModelesTool = {
        name: 'get_totalmodeles',
        description: 'Get total models from FacturaScripts',
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
    tools.set('get_totalmodeles', getTotalModelesTool);
    // Tool: get_identificadorfiscales
    const getIdentificadorFiscalesTool = {
        name: 'get_identificadorfiscales',
        description: 'Get fiscal identifiers from FacturaScripts',
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
    tools.set('get_identificadorfiscales', getIdentificadorFiscalesTool);
    // Tool: get_empresas
    const getEmpresasTool = {
        name: 'get_empresas',
        description: 'Get companies from FacturaScripts',
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
    tools.set('get_empresas', getEmpresasTool);
    // Tool: get_apiaccess
    const getApiAccessTool = {
        name: 'get_apiaccess',
        description: 'Get API access records from FacturaScripts',
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
    tools.set('get_apiaccess', getApiAccessTool);
    // Tool: get_apikeyes
    const getApiKeyesTool = {
        name: 'get_apikeyes',
        description: 'Get API keys from FacturaScripts',
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
    tools.set('get_apikeyes', getApiKeyesTool);
    // Tool: get_agenciatransportes
    const getAgenciaTransportesTool = {
        name: 'get_agenciatransportes',
        description: 'Get transport agencies from FacturaScripts',
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
    tools.set('get_agenciatransportes', getAgenciaTransportesTool);
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
                case 'get_series': {
                    const params = { offset, limit };
                    if (args.codserie)
                        params.codserie = args.codserie;
                    if (args.tipodoc)
                        params.tipodoc = args.tipodoc;
                    result = await fsClient.get('/series', params, connection);
                    break;
                }
                case 'get_secuenciadocumentos': {
                    result = await fsClient.get('/secuenciadocumentos', { offset, limit }, connection);
                    break;
                }
                case 'get_formatodocumentos': {
                    result = await fsClient.get('/formatodocumentos', { offset, limit }, connection);
                    break;
                }
                case 'get_estadodocumentos': {
                    const params = { offset, limit };
                    if (args.tipodoc)
                        params.tipodoc = args.tipodoc;
                    result = await fsClient.get('/estadodocumentos', params, connection);
                    break;
                }
                case 'get_doctransformations': {
                    result = await fsClient.get('/doctransformations', { offset, limit }, connection);
                    break;
                }
                case 'get_pagefilteres': {
                    result = await fsClient.get('/pagefilteres', { offset, limit }, connection);
                    break;
                }
                case 'get_pages': {
                    result = await fsClient.get('/pages', { offset, limit }, connection);
                    break;
                }
                case 'get_publications': {
                    result = await fsClient.get('/publications', { offset, limit }, connection);
                    break;
                }
                case 'get_totalmodeles': {
                    result = await fsClient.get('/totalmodeles', { offset, limit }, connection);
                    break;
                }
                case 'get_identificadorfiscales': {
                    result = await fsClient.get('/identificadorfiscales', { offset, limit }, connection);
                    break;
                }
                case 'get_empresas': {
                    result = await fsClient.get('/empresas', { offset, limit }, connection);
                    break;
                }
                case 'get_apiaccess': {
                    result = await fsClient.get('/apiaccess', { offset, limit }, connection);
                    break;
                }
                case 'get_apikeyes': {
                    result = await fsClient.get('/apikeyes', { offset, limit }, connection);
                    break;
                }
                case 'get_agenciatransportes': {
                    result = await fsClient.get('/agenciatransportes', { offset, limit }, connection);
                    break;
                }
                default:
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({ error: `Unknown configuration tool: ${name}` }, null, 2),
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