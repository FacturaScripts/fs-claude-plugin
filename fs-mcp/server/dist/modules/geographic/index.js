/**
 * Geographic Module for FacturaScripts MCP Server
 * Provides tools for accessing geographic and location data
 */
import { fsClient } from '../../fs/client.js';
export const geographicTools = [
    {
        name: 'get_pais',
        description: 'Obtiene países de FacturaScripts',
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
                codpais: {
                    type: 'string',
                    description: 'Filtrar por código de país',
                },
                nombre: {
                    type: 'string',
                    description: 'Filtrar por nombre de país',
                },
            },
            required: [],
        },
    },
    {
        name: 'get_provincias',
        description: 'Obtiene provincias/estados de FacturaScripts',
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
                codpais: {
                    type: 'string',
                    description: 'Filtrar por código de país',
                },
                provincia: {
                    type: 'string',
                    description: 'Filtrar por nombre de provincia',
                },
            },
            required: [],
        },
    },
    {
        name: 'get_ciudades',
        description: 'Obtiene ciudades de FacturaScripts',
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
                ciudad: {
                    type: 'string',
                    description: 'Filtrar por nombre de ciudad',
                },
                codpais: {
                    type: 'string',
                    description: 'Filtrar por código de país',
                },
                codpostal: {
                    type: 'string',
                    description: 'Filtrar por código postal',
                },
            },
            required: [],
        },
    },
    {
        name: 'get_codigopostales',
        description: 'Obtiene códigos postales de FacturaScripts',
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
                codpostal: {
                    type: 'string',
                    description: 'Filtrar por código postal',
                },
                ciudad: {
                    type: 'string',
                    description: 'Filtrar por nombre de ciudad',
                },
            },
            required: [],
        },
    },
    {
        name: 'get_puntointeresciudades',
        description: 'Obtiene puntos de interés de ciudades de FacturaScripts',
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
export const geographicWriteTools = [
    {
        name: 'create_pais',
        description: 'Crea un nuevo país en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codpais: { type: 'string', description: 'Código del país (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del país (obligatorio)' },
                codiso: { type: 'string', description: 'Código ISO del país' },
                alias: { type: 'string', description: 'Alias del país' },
                latitude: { type: 'number', description: 'Latitud' },
                longitude: { type: 'number', description: 'Longitud' },
                telephone_prefix: { type: 'string', description: 'Prefijo telefónico del país' },
            },
            required: ['codpais', 'nombre'],
        },
    },
    {
        name: 'update_pais',
        description: 'Actualiza un país existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codpais: { type: 'string', description: 'Código del país a actualizar (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del país' },
                codiso: { type: 'string', description: 'Código ISO del país' },
                alias: { type: 'string', description: 'Alias del país' },
                latitude: { type: 'number', description: 'Latitud' },
                longitude: { type: 'number', description: 'Longitud' },
                telephone_prefix: { type: 'string', description: 'Prefijo telefónico' },
            },
            required: ['codpais'],
        },
    },
    {
        name: 'delete_pais',
        description: 'Elimina un país de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codpais: { type: 'string', description: 'Código del país a eliminar' },
            },
            required: ['codpais'],
        },
    },
    {
        name: 'create_provincia',
        description: 'Crea una nueva provincia en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                provincia: { type: 'string', description: 'Nombre de la provincia (obligatorio)' },
                codpais: { type: 'string', description: 'Código del país (obligatorio)' },
                alias: { type: 'string', description: 'Alias de la provincia' },
                codisoprov: { type: 'string', description: 'Código ISO de la provincia' },
                latitude: { type: 'number', description: 'Latitud' },
                longitude: { type: 'number', description: 'Longitud' },
            },
            required: ['provincia', 'codpais'],
        },
    },
    {
        name: 'update_provincia',
        description: 'Actualiza una provincia existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idprovincia: { type: 'number', description: 'ID de la provincia a actualizar (obligatorio)' },
                provincia: { type: 'string', description: 'Nombre de la provincia' },
                codpais: { type: 'string', description: 'Código del país' },
                alias: { type: 'string', description: 'Alias de la provincia' },
                codisoprov: { type: 'string', description: 'Código ISO de la provincia' },
                latitude: { type: 'number', description: 'Latitud' },
                longitude: { type: 'number', description: 'Longitud' },
            },
            required: ['idprovincia'],
        },
    },
    {
        name: 'delete_provincia',
        description: 'Elimina una provincia de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idprovincia: { type: 'number', description: 'ID de la provincia a eliminar' },
            },
            required: ['idprovincia'],
        },
    },
    {
        name: 'create_ciudad',
        description: 'Crea una nueva ciudad en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                ciudad: { type: 'string', description: 'Nombre de la ciudad (obligatorio)' },
                idprovincia: { type: 'number', description: 'ID de la provincia a la que pertenece' },
                alias: { type: 'string', description: 'Alias de la ciudad' },
                latitude: { type: 'number', description: 'Latitud' },
                longitude: { type: 'number', description: 'Longitud' },
            },
            required: ['ciudad'],
        },
    },
    {
        name: 'update_ciudad',
        description: 'Actualiza una ciudad existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idciudad: { type: 'number', description: 'ID de la ciudad a actualizar (obligatorio)' },
                ciudad: { type: 'string', description: 'Nombre de la ciudad' },
                idprovincia: { type: 'number', description: 'ID de la provincia' },
                alias: { type: 'string', description: 'Alias de la ciudad' },
                latitude: { type: 'number', description: 'Latitud' },
                longitude: { type: 'number', description: 'Longitud' },
            },
            required: ['idciudad'],
        },
    },
    {
        name: 'delete_ciudad',
        description: 'Elimina una ciudad de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idciudad: { type: 'number', description: 'ID de la ciudad a eliminar' },
            },
            required: ['idciudad'],
        },
    },
    {
        name: 'create_codigopostal',
        description: 'Crea un nuevo código postal en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                number: { type: 'string', description: 'Número del código postal (obligatorio)' },
                idciudad: { type: 'number', description: 'ID de la ciudad' },
                idprovincia: { type: 'number', description: 'ID de la provincia' },
                codpais: { type: 'string', description: 'Código del país' },
            },
            required: ['number'],
        },
    },
    {
        name: 'update_codigopostal',
        description: 'Actualiza un código postal existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del código postal a actualizar (obligatorio)' },
                number: { type: 'string', description: 'Número del código postal' },
                idciudad: { type: 'number', description: 'ID de la ciudad' },
                idprovincia: { type: 'number', description: 'ID de la provincia' },
                codpais: { type: 'string', description: 'Código del país' },
            },
            required: ['id'],
        },
    },
    {
        name: 'delete_codigopostal',
        description: 'Elimina un código postal de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                id: { type: 'number', description: 'ID del código postal a eliminar' },
            },
            required: ['id'],
        },
    },
];
/**
 * Register all geographic tools with the MCP server
 */
export async function registerGeographicTools(tools) {
    geographicTools.forEach((tool) => tools.set(tool.name, tool));
    geographicWriteTools.forEach((tool) => tools.set(tool.name, tool));
}
/**
 * Handle geographic tool calls
 */
export async function handleGeographicTool(name, args) {
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
            case 'create_pais': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/paises', data, connection);
                break;
            }
            case 'update_pais': {
                const { connection: _conn, codpais, ...data } = args;
                result = await fsClient.put(`/paises/${codpais}`, data, connection);
                break;
            }
            case 'delete_pais': {
                result = await fsClient.delete(`/paises/${args.codpais}`, connection);
                break;
            }
            case 'create_provincia': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/provincias', data, connection);
                break;
            }
            case 'update_provincia': {
                const { connection: _conn, idprovincia, ...data } = args;
                result = await fsClient.put(`/provincias/${idprovincia}`, data, connection);
                break;
            }
            case 'delete_provincia': {
                result = await fsClient.delete(`/provincias/${args.idprovincia}`, connection);
                break;
            }
            case 'create_ciudad': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/ciudades', data, connection);
                break;
            }
            case 'update_ciudad': {
                const { connection: _conn, idciudad, ...data } = args;
                result = await fsClient.put(`/ciudades/${idciudad}`, data, connection);
                break;
            }
            case 'delete_ciudad': {
                result = await fsClient.delete(`/ciudades/${args.idciudad}`, connection);
                break;
            }
            case 'create_codigopostal': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/codigopostales', data, connection);
                break;
            }
            case 'update_codigopostal': {
                const { connection: _conn, id, ...data } = args;
                result = await fsClient.put(`/codigopostales/${id}`, data, connection);
                break;
            }
            case 'delete_codigopostal': {
                result = await fsClient.delete(`/codigopostales/${args.id}`, connection);
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