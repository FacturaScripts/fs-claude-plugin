/**
 * Communication Module for FacturaScripts MCP Server
 * Provides tools for accessing communication and notification data
 */
import { fsClient } from '../../fs/client.js';
export const communicationTools = [
    {
        name: 'get_emailsentes',
        description: 'Obtiene correos electrónicos enviados de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión a usar (opcional, usa la por defecto si no se especifica)',
                },
                offset: {
                    type: 'number',
                    description: 'Desplazamiento de paginación (por defecto: 0)',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de paginación (por defecto: 100)',
                },
                destinatario: {
                    type: 'string',
                    description: 'Filtrar por correo del destinatario',
                },
                asunto: {
                    type: 'string',
                    description: 'Filtrar por asunto',
                },
                fecha: {
                    type: 'string',
                    description: 'Filtrar por fecha (formato YYYY-MM-DD)',
                },
            },
            required: [],
        },
    },
    {
        name: 'get_emailnotifications',
        description: 'Obtiene notificaciones de correo electrónico de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión a usar (opcional, usa la por defecto si no se especifica)',
                },
                offset: {
                    type: 'number',
                    description: 'Desplazamiento de paginación (por defecto: 0)',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de paginación (por defecto: 100)',
                },
            },
            required: [],
        },
    },
    {
        name: 'get_attachedfiles',
        description: 'Obtiene archivos adjuntos de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión a usar (opcional, usa la por defecto si no se especifica)',
                },
                offset: {
                    type: 'number',
                    description: 'Desplazamiento de paginación (por defecto: 0)',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de paginación (por defecto: 100)',
                },
                modelo: {
                    type: 'string',
                    description: 'Filtrar por nombre de modelo',
                },
                modelid: {
                    type: 'string',
                    description: 'Filtrar por ID de modelo',
                },
            },
            required: [],
        },
    },
    {
        name: 'get_attachedfilerelations',
        description: 'Obtiene relaciones de archivos adjuntos de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: {
                    type: 'string',
                    description: 'Clave de conexión a usar (opcional, usa la por defecto si no se especifica)',
                },
                offset: {
                    type: 'number',
                    description: 'Desplazamiento de paginación (por defecto: 0)',
                },
                limit: {
                    type: 'number',
                    description: 'Límite de paginación (por defecto: 100)',
                },
            },
            required: [],
        },
    },
];
export const communicationWriteTools = [
    {
        name: 'create_emailnotification',
        description: 'Crea una nueva notificación de email en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                name: { type: 'string', description: 'Nombre identificador de la notificación (obligatorio)' },
                subject: { type: 'string', description: 'Asunto del email (obligatorio)' },
                body: { type: 'string', description: 'Cuerpo del email en HTML' },
                enabled: { type: 'boolean', description: 'Si la notificación está habilitada' },
            },
            required: ['name', 'subject'],
        },
    },
    {
        name: 'update_emailnotification',
        description: 'Actualiza una notificación de email existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                name: { type: 'string', description: 'Nombre de la notificación a actualizar (obligatorio)' },
                subject: { type: 'string', description: 'Asunto del email' },
                body: { type: 'string', description: 'Cuerpo del email en HTML' },
                enabled: { type: 'boolean', description: 'Si la notificación está habilitada' },
            },
            required: ['name'],
        },
    },
    {
        name: 'delete_emailnotification',
        description: 'Elimina una notificación de email de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                name: { type: 'string', description: 'Nombre de la notificación a eliminar' },
            },
            required: ['name'],
        },
    },
];
/**
 * Register all communication tools with the MCP server
 */
export async function registerCommunicationTools(tools) {
    communicationTools.forEach((tool) => tools.set(tool.name, tool));
    communicationWriteTools.forEach((tool) => tools.set(tool.name, tool));
}
/**
 * Handle communication tool calls
 */
export async function handleCommunicationTool(name, args) {
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
            case 'create_emailnotification': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/emailnotifications', data, connection);
                break;
            }
            case 'update_emailnotification': {
                const { connection: _conn, name, ...data } = args;
                result = await fsClient.put(`/emailnotifications/${name}`, data, connection);
                break;
            }
            case 'delete_emailnotification': {
                result = await fsClient.delete(`/emailnotifications/${args.name}`, connection);
                break;
            }
            default:
                return null;
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
}
//# sourceMappingURL=index.js.map