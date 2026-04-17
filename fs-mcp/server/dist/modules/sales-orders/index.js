/**
 * Sales Orders Module - Tools para gestión de pedidos, presupuestos, albaranes y facturas
 * Incluye: Presupuestos, Pedidos, Albaranes, Facturas y Recibos de clientes
 */
import { fsClient } from '../../fs/client.js';
export const salesOrdersTools = [
    {
        name: 'get_presupuestoclientes',
        description: 'Obtiene la lista de presupuestos de clientes',
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
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
                estado: {
                    type: 'string',
                    description: 'Filtrar por estado',
                },
                codserie: {
                    type: 'string',
                    description: 'Filtrar por código de serie',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineapresupuestoclientes',
        description: 'Obtiene las líneas de presupuestos de clientes',
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
                idpresupuesto: {
                    type: 'number',
                    description: 'Filtrar por ID de presupuesto',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_pedidoclientes',
        description: 'Obtiene la lista de pedidos de clientes',
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
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
                estado: {
                    type: 'string',
                    description: 'Filtrar por estado',
                },
                codserie: {
                    type: 'string',
                    description: 'Filtrar por código de serie',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineapedidoclientes',
        description: 'Obtiene las líneas de pedidos de clientes',
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
                idpedido: {
                    type: 'number',
                    description: 'Filtrar por ID de pedido',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_albaranclientes',
        description: 'Obtiene la lista de albaranes de clientes',
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
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
                codserie: {
                    type: 'string',
                    description: 'Filtrar por código de serie',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineaalbaranclientes',
        description: 'Obtiene las líneas de albaranes de clientes',
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
                idalbaran: {
                    type: 'number',
                    description: 'Filtrar por ID de albarán',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_facturaclientes',
        description: 'Obtiene la lista de facturas de clientes',
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
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
                pagada: {
                    type: 'boolean',
                    description: 'Filtrar por estado de pago',
                },
                anulada: {
                    type: 'boolean',
                    description: 'Filtrar por estado de anulación',
                },
                codserie: {
                    type: 'string',
                    description: 'Filtrar por código de serie',
                },
                codejercicio: {
                    type: 'string',
                    description: 'Filtrar por código de ejercicio',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_lineafacturaclientes',
        description: 'Obtiene las líneas de facturas de clientes',
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
                idfactura: {
                    type: 'number',
                    description: 'Filtrar por ID de factura',
                },
                referencia: {
                    type: 'string',
                    description: 'Filtrar por referencia de producto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_reciboclientes',
        description: 'Obtiene la lista de recibos de clientes',
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
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
                pagado: {
                    type: 'boolean',
                    description: 'Filtrar por estado de pago',
                },
                vencimiento: {
                    type: 'string',
                    description: 'Filtrar por fecha de vencimiento (formato YYYY-MM-DD)',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_pagoclientes',
        description: 'Obtiene la lista de pagos de clientes',
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
                idrecibo: {
                    type: 'number',
                    description: 'Filtrar por ID de recibo',
                },
            },
            required: ['connection'],
        },
    },
];
export async function registerSalesOrdersTools(server) {
    server.setRequestHandler({ resources: { list: {} } }, async () => {
        return { resources: [] };
    });
    for (const tool of salesOrdersTools) {
        server.setRequestHandler({ tools: { call: { name: tool.name } } }, async (request) => {
            const input = request.params.arguments;
            switch (tool.name) {
                case 'get_presupuestoclientes': {
                    const params = input;
                    const result = await fsClient.get('/presupuestoclientes', {
                        offset: params.offset,
                        limit: params.limit,
                        codcliente: params.codcliente,
                        fecha: params.fecha,
                        estado: params.estado,
                        codserie: params.codserie,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_lineapresupuestoclientes': {
                    const params = input;
                    const result = await fsClient.get('/lineapresupuestoclientes', {
                        offset: params.offset,
                        limit: params.limit,
                        idpresupuesto: params.idpresupuesto,
                        referencia: params.referencia,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_pedidoclientes': {
                    const params = input;
                    const result = await fsClient.get('/pedidoclientes', {
                        offset: params.offset,
                        limit: params.limit,
                        codcliente: params.codcliente,
                        fecha: params.fecha,
                        estado: params.estado,
                        codserie: params.codserie,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_lineapedidoclientes': {
                    const params = input;
                    const result = await fsClient.get('/lineapedidoclientes', {
                        offset: params.offset,
                        limit: params.limit,
                        idpedido: params.idpedido,
                        referencia: params.referencia,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_albaranclientes': {
                    const params = input;
                    const result = await fsClient.get('/albaranclientes', {
                        offset: params.offset,
                        limit: params.limit,
                        codcliente: params.codcliente,
                        fecha: params.fecha,
                        codserie: params.codserie,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_lineaalbaranclientes': {
                    const params = input;
                    const result = await fsClient.get('/lineaalbaranclientes', {
                        offset: params.offset,
                        limit: params.limit,
                        idalbaran: params.idalbaran,
                        referencia: params.referencia,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_facturaclientes': {
                    const params = input;
                    const result = await fsClient.get('/facturaclientes', {
                        offset: params.offset,
                        limit: params.limit,
                        codcliente: params.codcliente,
                        fecha: params.fecha,
                        pagada: params.pagada,
                        anulada: params.anulada,
                        codserie: params.codserie,
                        codejercicio: params.codejercicio,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_lineafacturaclientes': {
                    const params = input;
                    const result = await fsClient.get('/lineafacturaclientes', {
                        offset: params.offset,
                        limit: params.limit,
                        idfactura: params.idfactura,
                        referencia: params.referencia,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_reciboclientes': {
                    const params = input;
                    const result = await fsClient.get('/reciboclientes', {
                        offset: params.offset,
                        limit: params.limit,
                        codcliente: params.codcliente,
                        fecha: params.fecha,
                        pagado: params.pagado,
                        vencimiento: params.vencimiento,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_pagoclientes': {
                    const params = input;
                    const result = await fsClient.get('/pagoclientes', {
                        offset: params.offset,
                        limit: params.limit,
                        idrecibo: params.idrecibo,
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