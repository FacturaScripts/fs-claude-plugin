/**
 * Core Business Module - Tools para gestión de datos maestros de FacturaScripts
 * Incluye: Clientes, Proveedores, Productos, Familias, Fabricantes, Almacenes, etc.
 */
import { fsClient } from '../../fs/client.js';
export const coreBusinessTools = [
    {
        name: 'get_clientes',
        description: 'Obtiene la lista de clientes de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codcliente: {
                    type: 'string',
                    description: 'Filtrar por código de cliente',
                },
                nombre: {
                    type: 'string',
                    description: 'Filtrar por nombre (búsqueda parcial)',
                },
                cifnif: {
                    type: 'string',
                    description: 'Filtrar por CIF/NIF',
                },
                email: {
                    type: 'string',
                    description: 'Filtrar por email',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_proveedores',
        description: 'Obtiene la lista de proveedores de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codproveedor: {
                    type: 'string',
                    description: 'Filtrar por código de proveedor',
                },
                nombre: {
                    type: 'string',
                    description: 'Filtrar por nombre',
                },
                cifnif: {
                    type: 'string',
                    description: 'Filtrar por CIF/NIF',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_productos',
        description: 'Obtiene la lista de productos de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
                descripcion: {
                    type: 'string',
                    description: 'Filtrar por descripción',
                },
                codfamilia: {
                    type: 'string',
                    description: 'Filtrar por código de familia',
                },
                codalmacen: {
                    type: 'string',
                    description: 'Filtrar por código de almacén',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_variantes',
        description: 'Obtiene la lista de variantes de productos',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
                codbarras: {
                    type: 'string',
                    description: 'Filtrar por código de barras',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_familias',
        description: 'Obtiene la lista de familias de productos',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codfamilia: {
                    type: 'string',
                    description: 'Filtrar por código de familia',
                },
                descripcion: {
                    type: 'string',
                    description: 'Filtrar por descripción',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_fabricantes',
        description: 'Obtiene la lista de fabricantes',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_almacenes',
        description: 'Obtiene la lista de almacenes configurados',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_stocks',
        description: 'Obtiene información de stocks de productos en almacenes',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
                codalmacen: {
                    type: 'string',
                    description: 'Filtrar por código de almacén',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_tarifas',
        description: 'Obtiene la lista de tarifas de precios',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_atributos',
        description: 'Obtiene la lista de atributos de productos',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_atributovalores',
        description: 'Obtiene los valores de atributos de productos',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codatributo: {
                    type: 'string',
                    description: 'Filtrar por código de atributo',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_agentes',
        description: 'Obtiene la lista de agentes comerciales',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codagente: {
                    type: 'string',
                    description: 'Filtrar por código de agente',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_contactos',
        description: 'Obtiene la lista de contactos (personas de contacto)',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                codcontacto: {
                    type: 'string',
                    description: 'Filtrar por código de contacto',
                },
                nombre: {
                    type: 'string',
                    description: 'Filtrar por nombre',
                },
                email: {
                    type: 'string',
                    description: 'Filtrar por email',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_grupoclientes',
        description: 'Obtiene la lista de grupos de clientes',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_productoproveedores',
        description: 'Obtiene los productos proveedores (productos vinculados a proveedores)',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
                codproveedor: {
                    type: 'string',
                    description: 'Filtrar por código de proveedor',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_productoimagenes',
        description: 'Obtiene las imágenes de productos',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión',
                },
                offset: {
                    type: 'number',
                    description: 'Offset para paginación',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de resultados (máx 50)',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
            },
            required: ['connection'],
        },
    },
];
export async function registerCoreBusinessTools(server) {
    server.setRequestHandler({ resources: { list: {} } }, async () => {
        return { resources: [] };
    });
    for (const tool of coreBusinessTools) {
        server.setRequestHandler({ tools: { call: { name: tool.name } } }, async (request) => {
            const input = request.params.arguments;
            switch (tool.name) {
                case 'get_clientes': {
                    const params = input;
                    const result = await fsClient.get('/clientes', {
                        offset: params.offset,
                        limit: params.limit,
                        codcliente: params.codcliente,
                        nombre: params.nombre,
                        cifnif: params.cifnif,
                        email: params.email,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_proveedores': {
                    const params = input;
                    const result = await fsClient.get('/proveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        codproveedor: params.codproveedor,
                        nombre: params.nombre,
                        cifnif: params.cifnif,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_productos': {
                    const params = input;
                    const result = await fsClient.get('/productos', {
                        offset: params.offset,
                        limit: params.limit,
                        referencia: params.referencia,
                        descripcion: params.descripcion,
                        codfamilia: params.codfamilia,
                        codalmacen: params.codalmacen,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_variantes': {
                    const params = input;
                    const result = await fsClient.get('/variantes', {
                        offset: params.offset,
                        limit: params.limit,
                        referencia: params.referencia,
                        codbarras: params.codbarras,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_familias': {
                    const params = input;
                    const result = await fsClient.get('/familias', {
                        offset: params.offset,
                        limit: params.limit,
                        codfamilia: params.codfamilia,
                        descripcion: params.descripcion,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_fabricantes': {
                    const params = input;
                    const result = await fsClient.get('/fabricantes', {
                        offset: params.offset,
                        limit: params.limit,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_almacenes': {
                    const params = input;
                    const result = await fsClient.get('/almacenes', {
                        offset: params.offset,
                        limit: params.limit,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_stocks': {
                    const params = input;
                    const result = await fsClient.get('/stocks', {
                        offset: params.offset,
                        limit: params.limit,
                        referencia: params.referencia,
                        codalmacen: params.codalmacen,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_tarifas': {
                    const params = input;
                    const result = await fsClient.get('/tarifas', {
                        offset: params.offset,
                        limit: params.limit,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_atributos': {
                    const params = input;
                    const result = await fsClient.get('/atributos', {
                        offset: params.offset,
                        limit: params.limit,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_atributovalores': {
                    const params = input;
                    const result = await fsClient.get('/atributovalores', {
                        offset: params.offset,
                        limit: params.limit,
                        codatributo: params.codatributo,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_agentes': {
                    const params = input;
                    const result = await fsClient.get('/agentes', {
                        offset: params.offset,
                        limit: params.limit,
                        codagente: params.codagente,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_contactos': {
                    const params = input;
                    const result = await fsClient.get('/contactos', {
                        offset: params.offset,
                        limit: params.limit,
                        codcontacto: params.codcontacto,
                        nombre: params.nombre,
                        email: params.email,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_grupoclientes': {
                    const params = input;
                    const result = await fsClient.get('/grupoclientes', {
                        offset: params.offset,
                        limit: params.limit,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_productoproveedores': {
                    const params = input;
                    const result = await fsClient.get('/productoproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        referencia: params.referencia,
                        codproveedor: params.codproveedor,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_productoimagenes': {
                    const params = input;
                    const result = await fsClient.get('/productoimagenes', {
                        offset: params.offset,
                        limit: params.limit,
                        referencia: params.referencia,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                default:
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({ error: 'Tool not found' }, null, 2),
                            },
                        ],
                    };
            }
        });
    }
}
//# sourceMappingURL=index.js.map