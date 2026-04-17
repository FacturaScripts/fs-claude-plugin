import { fsClient } from '../../fs/client.js';
export async function registerPurchasingTools(server) {
    const tools = [
        {
            name: 'get_presupuestoproveedores',
            description: 'Obtiene presupuestos de proveedores con filtros opcionales de código de proveedor, fecha y estado',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    codproveedor: {
                        type: 'string',
                        description: 'Código del proveedor a filtrar',
                    },
                    fecha: {
                        type: 'string',
                        description: 'Fecha para filtrar (formato YYYY-MM-DD)',
                    },
                    estado: {
                        type: 'string',
                        description: 'Estado del presupuesto',
                    },
                },
                required: ['connection'],
            },
        },
        {
            name: 'get_lineapresupuestoproveedores',
            description: 'Obtiene líneas de presupuestos de proveedores filtradas por ID de presupuesto',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    idpresupuesto: {
                        type: 'string',
                        description: 'ID del presupuesto',
                    },
                },
                required: ['connection'],
            },
        },
        {
            name: 'get_pedidoproveedores',
            description: 'Obtiene pedidos de proveedores con filtros opcionales de código de proveedor, fecha y estado',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    codproveedor: {
                        type: 'string',
                        description: 'Código del proveedor a filtrar',
                    },
                    fecha: {
                        type: 'string',
                        description: 'Fecha para filtrar (formato YYYY-MM-DD)',
                    },
                    estado: {
                        type: 'string',
                        description: 'Estado del pedido',
                    },
                },
                required: ['connection'],
            },
        },
        {
            name: 'get_lineapedidoproveedores',
            description: 'Obtiene líneas de pedidos de proveedores filtradas por ID de pedido',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    idpedido: {
                        type: 'string',
                        description: 'ID del pedido',
                    },
                },
                required: ['connection'],
            },
        },
        {
            name: 'get_albaranproveedores',
            description: 'Obtiene albaranes de proveedores con filtros opcionales',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    codproveedor: {
                        type: 'string',
                        description: 'Código del proveedor a filtrar',
                    },
                    fecha: {
                        type: 'string',
                        description: 'Fecha para filtrar (formato YYYY-MM-DD)',
                    },
                },
                required: ['connection'],
            },
        },
        {
            name: 'get_lineaalbaranproveedores',
            description: 'Obtiene líneas de albaranes de proveedores filtradas por ID',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    idalbaran: {
                        type: 'string',
                        description: 'ID del albarán',
                    },
                },
                required: ['connection'],
            },
        },
        {
            name: 'get_facturaproveedores',
            description: 'Obtiene facturas de proveedores con filtros opcionales de código de proveedor, fecha, estado de pago y ejercicio',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    codproveedor: {
                        type: 'string',
                        description: 'Código del proveedor a filtrar',
                    },
                    fecha: {
                        type: 'string',
                        description: 'Fecha para filtrar (formato YYYY-MM-DD)',
                    },
                    pagada: {
                        type: 'boolean',
                        description: 'Si está pagada o no',
                    },
                    codejercicio: {
                        type: 'string',
                        description: 'Código del ejercicio',
                    },
                },
                required: ['connection'],
            },
        },
        {
            name: 'get_lineafacturaproveedores',
            description: 'Obtiene líneas de facturas de proveedores filtradas por ID de factura',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    idfactura: {
                        type: 'string',
                        description: 'ID de la factura',
                    },
                },
                required: ['connection'],
            },
        },
        {
            name: 'get_reciboproveedores',
            description: 'Obtiene recibos de proveedores con filtros opcionales',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    codproveedor: {
                        type: 'string',
                        description: 'Código del proveedor a filtrar',
                    },
                    fecha: {
                        type: 'string',
                        description: 'Fecha para filtrar (formato YYYY-MM-DD)',
                    },
                    pagado: {
                        type: 'boolean',
                        description: 'Si está pagado o no',
                    },
                },
                required: ['connection'],
            },
        },
        {
            name: 'get_pagoproveedores',
            description: 'Obtiene pagos de proveedores filtrados por ID de recibo',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    idrecibo: {
                        type: 'string',
                        description: 'ID del recibo',
                    },
                },
                required: ['connection'],
            },
        },
        {
            name: 'get_cuentabancoproveedores',
            description: 'Obtiene cuentas bancarias de proveedores con filtros opcionales',
            inputSchema: {
                type: 'object',
                properties: {
                    connection: {
                        type: 'string',
                        description: 'Identificador de conexión a la base de datos',
                    },
                    offset: {
                        type: 'number',
                        description: 'Número de registros a saltar',
                    },
                    limit: {
                        type: 'number',
                        description: 'Número máximo de registros a retornar',
                    },
                    codproveedor: {
                        type: 'string',
                        description: 'Código del proveedor a filtrar',
                    },
                },
                required: ['connection'],
            },
        },
    ];
    server.setRequestHandler({ resources: { list: {} } }, async (_request) => {
        return { resources: [] };
    });
    for (const tool of tools) {
        server.setRequestHandler({ tools: { call: { name: tool.name } } }, async (request) => {
            const input = request.params.arguments;
            switch (tool.name) {
                case 'get_presupuestoproveedores': {
                    const params = input;
                    const result = await fsClient.get('/presupuestoproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        codproveedor: params.codproveedor,
                        fecha: params.fecha,
                        estado: params.estado,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_lineapresupuestoproveedores': {
                    const params = input;
                    const result = await fsClient.get('/lineapresupuestoproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        idpresupuesto: params.idpresupuesto,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_pedidoproveedores': {
                    const params = input;
                    const result = await fsClient.get('/pedidoproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        codproveedor: params.codproveedor,
                        fecha: params.fecha,
                        estado: params.estado,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_lineapedidoproveedores': {
                    const params = input;
                    const result = await fsClient.get('/lineapedidoproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        idpedido: params.idpedido,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_albaranproveedores': {
                    const params = input;
                    const result = await fsClient.get('/albaranproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        codproveedor: params.codproveedor,
                        fecha: params.fecha,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_lineaalbaranproveedores': {
                    const params = input;
                    const result = await fsClient.get('/lineaalbaranproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        idalbaran: params.idalbaran,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_facturaproveedores': {
                    const params = input;
                    const result = await fsClient.get('/facturaproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        codproveedor: params.codproveedor,
                        fecha: params.fecha,
                        pagada: params.pagada,
                        codejercicio: params.codejercicio,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_lineafacturaproveedores': {
                    const params = input;
                    const result = await fsClient.get('/lineafacturaproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        idfactura: params.idfactura,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_reciboproveedores': {
                    const params = input;
                    const result = await fsClient.get('/reciboproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        codproveedor: params.codproveedor,
                        fecha: params.fecha,
                        pagado: params.pagado,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_pagoproveedores': {
                    const params = input;
                    const result = await fsClient.get('/pagoproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        idrecibo: params.idrecibo,
                    }, params.connection);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                    };
                }
                case 'get_cuentabancoproveedores': {
                    const params = input;
                    const result = await fsClient.get('/cuentabancoproveedores', {
                        offset: params.offset,
                        limit: params.limit,
                        codproveedor: params.codproveedor,
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