/**
 * Geographic Module for FacturaScripts MCP Server
 * Provides tools for accessing geographic and location data
 */
import { fsClient } from '../../fs/client.js';
/**
 * Register all geographic tools with the MCP server
 */
export async function registerGeographicTools(server, tools) {
    // Tool: get_pais
    const getPaisTool = {
        name: 'get_pais',
        description: 'Get countries from FacturaScripts',
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
                codpais: {
                    type: 'string',
                    description: 'Filter by country code',
                },
                nombre: {
                    type: 'string',
                    description: 'Filter by country name',
                },
            },
            required: [],
        },
    };
    tools.set('get_pais', getPaisTool);
    // Tool: get_provincias
    const getProvinciasTool = {
        name: 'get_provincias',
        description: 'Get provinces/states from FacturaScripts',
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
                codpais: {
                    type: 'string',
                    description: 'Filter by country code',
                },
                provincia: {
                    type: 'string',
                    description: 'Filter by province name',
                },
            },
            required: [],
        },
    };
    tools.set('get_provincias', getProvinciasTool);
    // Tool: get_ciudades
    const getCiudadesTool = {
        name: 'get_ciudades',
        description: 'Get cities from FacturaScripts',
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
                ciudad: {
                    type: 'string',
                    description: 'Filter by city name',
                },
                codpais: {
                    type: 'string',
                    description: 'Filter by country code',
                },
                codpostal: {
                    type: 'string',
                    description: 'Filter by postal code',
                },
            },
            required: [],
        },
    };
    tools.set('get_ciudades', getCiudadesTool);
    // Tool: get_codigopostales
    const getCodigoPostalesTool = {
        name: 'get_codigopostales',
        description: 'Get postal codes from FacturaScripts',
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
                codpostal: {
                    type: 'string',
                    description: 'Filter by postal code',
                },
                ciudad: {
                    type: 'string',
                    description: 'Filter by city name',
                },
            },
            required: [],
        },
    };
    tools.set('get_codigopostales', getCodigoPostalesTool);
    // Tool: get_puntointeresciudades
    const getPuntoInteresCiudadesTool = {
        name: 'get_puntointeresciudades',
        description: 'Get points of interest for cities from FacturaScripts',
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
    tools.set('get_puntointeresciudades', getPuntoInteresCiudadesTool);
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
                case 'get_pais': {
                    const params = { offset, limit };
                    if (args.codpais)
                        params.codpais = args.codpais;
                    if (args.nombre)
                        params.nombre = args.nombre;
                    result = await fsClient.get('/paises', params, connection);
                    break;
                }
                case 'get_provincias': {
                    const params = { offset, limit };
                    if (args.codpais)
                        params.codpais = args.codpais;
                    if (args.provincia)
                        params.provincia = args.provincia;
                    result = await fsClient.get('/provincias', params, connection);
                    break;
                }
                case 'get_ciudades': {
                    const params = { offset, limit };
                    if (args.ciudad)
                        params.ciudad = args.ciudad;
                    if (args.codpais)
                        params.codpais = args.codpais;
                    if (args.codpostal)
                        params.codpostal = args.codpostal;
                    result = await fsClient.get('/ciudades', params, connection);
                    break;
                }
                case 'get_codigopostales': {
                    const params = { offset, limit };
                    if (args.codpostal)
                        params.codpostal = args.codpostal;
                    if (args.ciudad)
                        params.ciudad = args.ciudad;
                    result = await fsClient.get('/codigopostales', params, connection);
                    break;
                }
                case 'get_puntointeresciudades': {
                    result = await fsClient.get('/puntointeresciudades', { offset, limit }, connection);
                    break;
                }
                default:
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({ error: `Unknown geographic tool: ${name}` }, null, 2),
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