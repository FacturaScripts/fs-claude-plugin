import { fsClient } from '../../fs/client.js';
export const financeTools = [
    {
        name: 'get_cuentabancos',
        description: 'Obtiene cuentas bancarias con filtros opcionales de código de cuenta',
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
                codcuenta: {
                    type: 'string',
                    description: 'Código de la cuenta bancaria',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_formapagos',
        description: 'Obtiene formas de pago con filtros opcionales de código de pago',
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
                codpago: {
                    type: 'string',
                    description: 'Código de la forma de pago',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_divisas',
        description: 'Obtiene divisas con filtros opcionales de código de divisa',
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
                coddivisa: {
                    type: 'string',
                    description: 'Código de la divisa',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_retenciones',
        description: 'Obtiene retenciones con filtros opcionales de código de retención',
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
                codretencion: {
                    type: 'string',
                    description: 'Código de la retención',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_impuestos',
        description: 'Obtiene impuestos con filtros opcionales de código de impuesto',
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
                codimpuesto: {
                    type: 'string',
                    description: 'Código del impuesto',
                },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_impuestozonas',
        description: 'Obtiene zonas de impuestos con opciones de paginación',
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
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_regularizacionimpuestos',
        description: 'Obtiene regularizaciones de impuestos con filtros opcionales de código de ejercicio',
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
                codejercicio: {
                    type: 'string',
                    description: 'Código del ejercicio',
                },
            },
            required: ['connection'],
        },
    },
];
export const financeWriteTools = [
    {
        name: 'create_formapago',
        description: 'Crea una nueva forma de pago en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                codpago: { type: 'string', description: 'Código de la forma de pago (obligatorio)' },
                descripcion: { type: 'string', description: 'Descripción de la forma de pago' },
                activa: { type: 'boolean', description: 'Si la forma de pago está activa' },
                pagado: { type: 'boolean', description: 'Si marca el documento como pagado automáticamente' },
                plazovencimiento: { type: 'number', description: 'Plazo de vencimiento en días' },
                tipovencimiento: { type: 'string', description: 'Tipo de vencimiento' },
                domiciliado: { type: 'boolean', description: 'Si es domiciliado' },
                codcuentabanco: { type: 'string', description: 'Código de cuenta bancaria asociada' },
            },
            required: ['codpago', 'descripcion'],
        },
    },
    {
        name: 'update_formapago',
        description: 'Actualiza una forma de pago existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                codpago: { type: 'string', description: 'Código de la forma de pago a actualizar' },
                descripcion: { type: 'string', description: 'Nueva descripción' },
                activa: { type: 'boolean', description: 'Si la forma de pago está activa' },
                pagado: { type: 'boolean', description: 'Si marca el documento como pagado' },
                plazovencimiento: { type: 'number', description: 'Plazo de vencimiento en días' },
                tipovencimiento: { type: 'string', description: 'Tipo de vencimiento' },
                domiciliado: { type: 'boolean', description: 'Si es domiciliado' },
                codcuentabanco: { type: 'string', description: 'Código de cuenta bancaria asociada' },
            },
            required: ['codpago'],
        },
    },
    {
        name: 'delete_formapago',
        description: 'Elimina una forma de pago de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                codpago: { type: 'string', description: 'Código de la forma de pago a eliminar' },
            },
            required: ['codpago'],
        },
    },
    {
        name: 'create_divisa',
        description: 'Crea una nueva divisa en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                coddivisa: { type: 'string', description: 'Código de la divisa (obligatorio)' },
                codiso: { type: 'string', description: 'Código ISO de la divisa' },
                descripcion: { type: 'string', description: 'Descripción de la divisa' },
                tasaconv: { type: 'number', description: 'Tasa de conversión' },
                simbolo: { type: 'string', description: 'Símbolo de la divisa' },
            },
            required: ['coddivisa', 'descripcion'],
        },
    },
    {
        name: 'update_divisa',
        description: 'Actualiza una divisa existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                coddivisa: { type: 'string', description: 'Código de la divisa a actualizar' },
                codiso: { type: 'string', description: 'Código ISO de la divisa' },
                descripcion: { type: 'string', description: 'Descripción de la divisa' },
                tasaconv: { type: 'number', description: 'Tasa de conversión' },
                simbolo: { type: 'string', description: 'Símbolo de la divisa' },
            },
            required: ['coddivisa'],
        },
    },
    {
        name: 'delete_divisa',
        description: 'Elimina una divisa de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                coddivisa: { type: 'string', description: 'Código de la divisa a eliminar' },
            },
            required: ['coddivisa'],
        },
    },
    {
        name: 'create_impuesto',
        description: 'Crea un nuevo impuesto en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                codimpuesto: { type: 'string', description: 'Código del impuesto (obligatorio)' },
                descripcion: { type: 'string', description: 'Descripción del impuesto' },
                activo: { type: 'boolean', description: 'Si el impuesto está activo' },
                iva: { type: 'number', description: 'Porcentaje de IVA' },
                recargo: { type: 'number', description: 'Porcentaje de recargo de equivalencia' },
                tipo: { type: 'string', description: 'Tipo de impuesto' },
                operacion: { type: 'string', description: 'Operación del impuesto' },
            },
            required: ['codimpuesto', 'descripcion'],
        },
    },
    {
        name: 'update_impuesto',
        description: 'Actualiza un impuesto existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                codimpuesto: { type: 'string', description: 'Código del impuesto a actualizar' },
                descripcion: { type: 'string', description: 'Descripción del impuesto' },
                activo: { type: 'boolean', description: 'Si el impuesto está activo' },
                iva: { type: 'number', description: 'Porcentaje de IVA' },
                recargo: { type: 'number', description: 'Porcentaje de recargo de equivalencia' },
                tipo: { type: 'string', description: 'Tipo de impuesto' },
                operacion: { type: 'string', description: 'Operación del impuesto' },
            },
            required: ['codimpuesto'],
        },
    },
    {
        name: 'delete_impuesto',
        description: 'Elimina un impuesto de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                codimpuesto: { type: 'string', description: 'Código del impuesto a eliminar' },
            },
            required: ['codimpuesto'],
        },
    },
    {
        name: 'create_retencion',
        description: 'Crea una nueva retención en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                codretencion: { type: 'string', description: 'Código de la retención (obligatorio)' },
                descripcion: { type: 'string', description: 'Descripción de la retención' },
                activa: { type: 'boolean', description: 'Si la retención está activa' },
                porcentaje: { type: 'number', description: 'Porcentaje de retención' },
            },
            required: ['codretencion', 'descripcion'],
        },
    },
    {
        name: 'update_retencion',
        description: 'Actualiza una retención existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                codretencion: { type: 'string', description: 'Código de la retención a actualizar' },
                descripcion: { type: 'string', description: 'Descripción de la retención' },
                activa: { type: 'boolean', description: 'Si la retención está activa' },
                porcentaje: { type: 'number', description: 'Porcentaje de retención' },
            },
            required: ['codretencion'],
        },
    },
    {
        name: 'delete_retencion',
        description: 'Elimina una retención de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Identificador de conexión' },
                codretencion: { type: 'string', description: 'Código de la retención a eliminar' },
            },
            required: ['codretencion'],
        },
    },
];
/**
 * Register all finance tools with the MCP server
 */
export async function registerFinanceTools(tools) {
    financeTools.forEach((tool) => tools.set(tool.name, tool));
    financeWriteTools.forEach((tool) => tools.set(tool.name, tool));
}
/**
 * Handle finance tool calls
 */
export async function handleFinanceTool(name, args) {
    const input = args;
    switch (name) {
        case 'get_cuentabancos': {
            const params = input;
            const result = await fsClient.get('/cuentabancos', {
                offset: params.offset,
                limit: params.limit,
                codcuenta: params.codcuenta,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_formapagos': {
            const params = input;
            const result = await fsClient.get('/formapagos', {
                offset: params.offset,
                limit: params.limit,
                codpago: params.codpago,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_divisas': {
            const params = input;
            const result = await fsClient.get('/divisas', {
                offset: params.offset,
                limit: params.limit,
                coddivisa: params.coddivisa,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_retenciones': {
            const params = input;
            const result = await fsClient.get('/retenciones', {
                offset: params.offset,
                limit: params.limit,
                codretencion: params.codretencion,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_impuestos': {
            const params = input;
            const result = await fsClient.get('/impuestos', {
                offset: params.offset,
                limit: params.limit,
                codimpuesto: params.codimpuesto,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_impuestozonas': {
            const params = input;
            const result = await fsClient.get('/impuestozonas', {
                offset: params.offset,
                limit: params.limit,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'get_regularizacionimpuestos': {
            const params = input;
            const result = await fsClient.get('/regularizacionimpuestos', {
                offset: params.offset,
                limit: params.limit,
                codejercicio: params.codejercicio,
            }, params.connection);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        case 'create_formapago': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/formapagos', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_formapago': {
            const params = input;
            const { connection, codpago, ...data } = params;
            const result = await fsClient.put(`/formapagos/${codpago}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_formapago': {
            const params = input;
            const result = await fsClient.delete(`/formapagos/${params.codpago}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_divisa': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/divisas', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_divisa': {
            const params = input;
            const { connection, coddivisa, ...data } = params;
            const result = await fsClient.put(`/divisas/${coddivisa}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_divisa': {
            const params = input;
            const result = await fsClient.delete(`/divisas/${params.coddivisa}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_impuesto': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/impuestos', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_impuesto': {
            const params = input;
            const { connection, codimpuesto, ...data } = params;
            const result = await fsClient.put(`/impuestos/${codimpuesto}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_impuesto': {
            const params = input;
            const result = await fsClient.delete(`/impuestos/${params.codimpuesto}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'create_retencion': {
            const params = input;
            const { connection, ...data } = params;
            const result = await fsClient.post('/retenciones', data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'update_retencion': {
            const params = input;
            const { connection, codretencion, ...data } = params;
            const result = await fsClient.put(`/retenciones/${codretencion}`, data, connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        case 'delete_retencion': {
            const params = input;
            const result = await fsClient.delete(`/retenciones/${params.codretencion}`, params.connection);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        default:
            return null;
    }
}
//# sourceMappingURL=index.js.map