/**
 * Configuration Module for FacturaScripts MCP Server
 * Provides tools for accessing system configuration and settings
 */
import { fsClient } from '../../fs/client.js';
export const configurationTools = [
    {
        name: 'get_series',
        description: 'Obtiene series de documentos de FacturaScripts',
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
                codserie: {
                    type: 'string',
                    description: 'Filtrar por código de serie',
                },
                tipodoc: {
                    type: 'string',
                    description: 'Filtrar por tipo de documento',
                },
            },
            required: [],
        },
    },
    {
        name: 'get_secuenciadocumentos',
        description: 'Obtiene secuencias de documentos de FacturaScripts',
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
        name: 'get_formatodocumentos',
        description: 'Obtiene formatos de documentos de FacturaScripts',
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
        name: 'get_estadodocumentos',
        description: 'Obtiene estados de documentos de FacturaScripts',
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
                tipodoc: {
                    type: 'string',
                    description: 'Filtrar por tipo de documento',
                },
            },
            required: [],
        },
    },
    {
        name: 'get_doctransformations',
        description: 'Obtiene transformaciones de documentos de FacturaScripts',
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
        name: 'get_pagefilteres',
        description: 'Obtiene filtros de páginas de FacturaScripts',
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
        name: 'get_pages',
        description: 'Obtiene páginas de FacturaScripts',
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
        name: 'get_publications',
        description: 'Obtiene publicaciones de FacturaScripts',
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
        name: 'get_totalmodeles',
        description: 'Obtiene total de modelos de FacturaScripts',
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
        name: 'get_identificadorfiscales',
        description: 'Obtiene identificadores fiscales de FacturaScripts',
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
        name: 'get_empresas',
        description: 'Obtiene empresas de FacturaScripts',
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
        name: 'get_apiaccess',
        description: 'Obtiene registros de acceso de API de FacturaScripts',
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
        name: 'get_apikeyes',
        description: 'Obtiene claves de API de FacturaScripts',
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
        name: 'get_agenciatransportes',
        description: 'Obtiene agencias de transporte de FacturaScripts',
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
        name: 'get_pageoptions',
        description: 'Obtiene la configuración visual de vistas de FacturaScripts (PageOption)',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                offset: { type: 'number', description: 'Offset de paginación (por defecto: 0)' },
                limit: { type: 'number', description: 'Límite de resultados (por defecto: 100)' },
                name: { type: 'string', description: 'Filtrar por nombre de página/controlador' },
                nick: { type: 'string', description: 'Filtrar por usuario (nick)' },
            },
            required: [],
        },
    },
    {
        name: 'get_settings',
        description: 'Obtiene la configuración de sistema de FacturaScripts (Settings)',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                offset: { type: 'number', description: 'Offset de paginación (por defecto: 0)' },
                limit: { type: 'number', description: 'Límite de resultados (por defecto: 100)' },
                name: { type: 'string', description: 'Filtrar por nombre del grupo de configuración' },
            },
            required: [],
        },
    },
];
export const configurationWriteTools = [
    {
        name: 'create_serie',
        description: 'Crea una nueva serie de documentos en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codserie: { type: 'string', description: 'Código de la serie (obligatorio)' },
                descripcion: { type: 'string', description: 'Descripción de la serie (obligatorio)' },
                tipo: { type: 'string', description: 'Tipo de serie' },
                siniva: { type: 'boolean', description: 'Si la serie no incluye IVA' },
                iddiario: { type: 'number', description: 'ID del diario contable' },
                canal: { type: 'string', description: 'Canal de la serie' },
            },
            required: ['codserie', 'descripcion'],
        },
    },
    {
        name: 'update_serie',
        description: 'Actualiza una serie de documentos existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codserie: { type: 'string', description: 'Código de la serie a actualizar (obligatorio)' },
                descripcion: { type: 'string', description: 'Descripción de la serie' },
                tipo: { type: 'string', description: 'Tipo de serie' },
                siniva: { type: 'boolean', description: 'Si la serie no incluye IVA' },
                iddiario: { type: 'number', description: 'ID del diario contable' },
                canal: { type: 'string', description: 'Canal de la serie' },
            },
            required: ['codserie'],
        },
    },
    {
        name: 'delete_serie',
        description: 'Elimina una serie de documentos de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codserie: { type: 'string', description: 'Código de la serie a eliminar' },
            },
            required: ['codserie'],
        },
    },
    {
        name: 'create_empresa',
        description: 'Crea una nueva empresa en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                nombre: { type: 'string', description: 'Nombre de la empresa (obligatorio)' },
                nombrecorto: { type: 'string', description: 'Nombre corto de la empresa' },
                direccion: { type: 'string', description: 'Dirección de la empresa' },
                ciudad: { type: 'string', description: 'Ciudad de la empresa' },
                codpais: { type: 'string', description: 'Código del país' },
                provincia: { type: 'string', description: 'Provincia de la empresa' },
                web: { type: 'string', description: 'Web de la empresa' },
                regimeniva: { type: 'string', description: 'Régimen de IVA' },
            },
            required: ['nombre'],
        },
    },
    {
        name: 'update_empresa',
        description: 'Actualiza una empresa existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idempresa: { type: 'number', description: 'ID de la empresa a actualizar (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre de la empresa' },
                nombrecorto: { type: 'string', description: 'Nombre corto de la empresa' },
                direccion: { type: 'string', description: 'Dirección de la empresa' },
                ciudad: { type: 'string', description: 'Ciudad de la empresa' },
                codpais: { type: 'string', description: 'Código del país' },
                provincia: { type: 'string', description: 'Provincia de la empresa' },
                web: { type: 'string', description: 'Web de la empresa' },
                regimeniva: { type: 'string', description: 'Régimen de IVA' },
            },
            required: ['idempresa'],
        },
    },
    {
        name: 'delete_empresa',
        description: 'Elimina una empresa de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idempresa: { type: 'number', description: 'ID de la empresa a eliminar' },
            },
            required: ['idempresa'],
        },
    },
    {
        name: 'create_estadodocumento',
        description: 'Crea un nuevo estado de documento en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                nombre: { type: 'string', description: 'Nombre del estado (obligatorio)' },
                tipodoc: { type: 'string', description: 'Tipo de documento al que aplica (obligatorio)' },
                activo: { type: 'boolean', description: 'Si el estado está activo' },
                color: { type: 'string', description: 'Color del estado (hex)' },
                icon: { type: 'string', description: 'Icono del estado' },
                editable: { type: 'boolean', description: 'Si el documento en este estado es editable' },
                bloquear: { type: 'boolean', description: 'Si el documento en este estado está bloqueado' },
                predeterminado: { type: 'boolean', description: 'Si es el estado predeterminado' },
                actualizastock: { type: 'number', description: 'Comportamiento sobre el stock (0, 1, -1)' },
                generadoc: { type: 'string', description: 'Tipo de documento que genera' },
            },
            required: ['nombre', 'tipodoc'],
        },
    },
    {
        name: 'update_estadodocumento',
        description: 'Actualiza un estado de documento existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idestado: { type: 'number', description: 'ID del estado a actualizar (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre del estado' },
                tipodoc: { type: 'string', description: 'Tipo de documento' },
                activo: { type: 'boolean', description: 'Si el estado está activo' },
                color: { type: 'string', description: 'Color del estado' },
                icon: { type: 'string', description: 'Icono del estado' },
                editable: { type: 'boolean', description: 'Si el documento es editable' },
                bloquear: { type: 'boolean', description: 'Si el documento está bloqueado' },
                predeterminado: { type: 'boolean', description: 'Si es el estado predeterminado' },
                actualizastock: { type: 'number', description: 'Comportamiento sobre el stock' },
                generadoc: { type: 'string', description: 'Tipo de documento que genera' },
            },
            required: ['idestado'],
        },
    },
    {
        name: 'delete_estadodocumento',
        description: 'Elimina un estado de documento de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idestado: { type: 'number', description: 'ID del estado a eliminar' },
            },
            required: ['idestado'],
        },
    },
    {
        name: 'create_agenciatransporte',
        description: 'Crea una nueva agencia de transporte en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codtrans: { type: 'string', description: 'Código de la agencia (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre de la agencia (obligatorio)' },
                telefono: { type: 'string', description: 'Teléfono de la agencia' },
                web: { type: 'string', description: 'Web de la agencia' },
                activo: { type: 'boolean', description: 'Si la agencia está activa' },
            },
            required: ['codtrans', 'nombre'],
        },
    },
    {
        name: 'update_agenciatransporte',
        description: 'Actualiza una agencia de transporte existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codtrans: { type: 'string', description: 'Código de la agencia a actualizar (obligatorio)' },
                nombre: { type: 'string', description: 'Nombre de la agencia' },
                telefono: { type: 'string', description: 'Teléfono de la agencia' },
                web: { type: 'string', description: 'Web de la agencia' },
                activo: { type: 'boolean', description: 'Si la agencia está activa' },
            },
            required: ['codtrans'],
        },
    },
    {
        name: 'delete_agenciatransporte',
        description: 'Elimina una agencia de transporte de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                codtrans: { type: 'string', description: 'Código de la agencia a eliminar' },
            },
            required: ['codtrans'],
        },
    },
    {
        name: 'create_identificadorfiscal',
        description: 'Crea un nuevo identificador fiscal en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                tipoidfiscal: { type: 'string', description: 'Tipo de identificador fiscal (obligatorio)' },
                codeid: { type: 'string', description: 'Código del identificador' },
                validar: { type: 'boolean', description: 'Si debe validar el formato' },
            },
            required: ['tipoidfiscal'],
        },
    },
    {
        name: 'update_identificadorfiscal',
        description: 'Actualiza un identificador fiscal existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                tipoidfiscal: { type: 'string', description: 'Tipo de identificador fiscal a actualizar (obligatorio)' },
                codeid: { type: 'string', description: 'Código del identificador' },
                validar: { type: 'boolean', description: 'Si debe validar el formato' },
            },
            required: ['tipoidfiscal'],
        },
    },
    {
        name: 'delete_identificadorfiscal',
        description: 'Elimina un identificador fiscal de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                tipoidfiscal: { type: 'string', description: 'Tipo de identificador fiscal a eliminar' },
            },
            required: ['tipoidfiscal'],
        },
    },
    {
        name: 'create_secuenciadocumento',
        description: 'Crea una nueva secuencia de documentos en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                tipodoc: { type: 'string', description: 'Tipo de documento (obligatorio)' },
                codserie: { type: 'string', description: 'Código de la serie (obligatorio)' },
                codejercicio: { type: 'string', description: 'Código del ejercicio (obligatorio)' },
                idempresa: { type: 'number', description: 'ID de la empresa' },
                inicio: { type: 'number', description: 'Número de inicio de la secuencia' },
                longnumero: { type: 'number', description: 'Longitud del número' },
                patron: { type: 'string', description: 'Patrón de formato del número' },
                usarhuecos: { type: 'boolean', description: 'Si reutiliza huecos en la numeración' },
            },
            required: ['tipodoc', 'codserie', 'codejercicio'],
        },
    },
    {
        name: 'update_secuenciadocumento',
        description: 'Actualiza una secuencia de documentos existente en FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idsecuencia: { type: 'number', description: 'ID de la secuencia a actualizar (obligatorio)' },
                tipodoc: { type: 'string', description: 'Tipo de documento' },
                codserie: { type: 'string', description: 'Código de la serie' },
                codejercicio: { type: 'string', description: 'Código del ejercicio' },
                idempresa: { type: 'number', description: 'ID de la empresa' },
                inicio: { type: 'number', description: 'Número de inicio de la secuencia' },
                longnumero: { type: 'number', description: 'Longitud del número' },
                patron: { type: 'string', description: 'Patrón de formato del número' },
                usarhuecos: { type: 'boolean', description: 'Si reutiliza huecos en la numeración' },
            },
            required: ['idsecuencia'],
        },
    },
    {
        name: 'delete_secuenciadocumento',
        description: 'Elimina una secuencia de documentos de FacturaScripts',
        inputSchema: {
            type: 'object',
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
                idsecuencia: { type: 'number', description: 'ID de la secuencia a eliminar' },
            },
            required: ['idsecuencia'],
        },
    },
];
/**
 * Register all configuration tools with the MCP server
 */
export async function registerConfigurationTools(tools) {
    configurationTools.forEach((tool) => tools.set(tool.name, tool));
    configurationWriteTools.forEach((tool) => tools.set(tool.name, tool));
}
/**
 * Handle configuration tool calls
 */
export async function handleConfigurationTool(name, args) {
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
            case 'get_pageoptions': {
                const params = { offset, limit };
                if (args.name)
                    params.name = args.name;
                if (args.nick)
                    params.nick = args.nick;
                result = await fsClient.get('/pageoptions', params, connection);
                break;
            }
            case 'get_settings': {
                const params = { offset, limit };
                if (args.name)
                    params.name = args.name;
                result = await fsClient.get('/settings', params, connection);
                break;
            }
            case 'create_serie': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/series', data, connection);
                break;
            }
            case 'update_serie': {
                const { connection: _conn, codserie, ...data } = args;
                result = await fsClient.put(`/series/${codserie}`, data, connection);
                break;
            }
            case 'delete_serie': {
                result = await fsClient.delete(`/series/${args.codserie}`, connection);
                break;
            }
            case 'create_empresa': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/empresas', data, connection);
                break;
            }
            case 'update_empresa': {
                const { connection: _conn, idempresa, ...data } = args;
                result = await fsClient.put(`/empresas/${idempresa}`, data, connection);
                break;
            }
            case 'delete_empresa': {
                result = await fsClient.delete(`/empresas/${args.idempresa}`, connection);
                break;
            }
            case 'create_estadodocumento': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/estadodocumentos', data, connection);
                break;
            }
            case 'update_estadodocumento': {
                const { connection: _conn, idestado, ...data } = args;
                result = await fsClient.put(`/estadodocumentos/${idestado}`, data, connection);
                break;
            }
            case 'delete_estadodocumento': {
                result = await fsClient.delete(`/estadodocumentos/${args.idestado}`, connection);
                break;
            }
            case 'create_agenciatransporte': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/agenciatransportes', data, connection);
                break;
            }
            case 'update_agenciatransporte': {
                const { connection: _conn, codtrans, ...data } = args;
                result = await fsClient.put(`/agenciatransportes/${codtrans}`, data, connection);
                break;
            }
            case 'delete_agenciatransporte': {
                result = await fsClient.delete(`/agenciatransportes/${args.codtrans}`, connection);
                break;
            }
            case 'create_identificadorfiscal': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/identificadorfiscales', data, connection);
                break;
            }
            case 'update_identificadorfiscal': {
                const { connection: _conn, tipoidfiscal, ...data } = args;
                result = await fsClient.put(`/identificadorfiscales/${tipoidfiscal}`, data, connection);
                break;
            }
            case 'delete_identificadorfiscal': {
                result = await fsClient.delete(`/identificadorfiscales/${args.tipoidfiscal}`, connection);
                break;
            }
            case 'create_secuenciadocumento': {
                const { connection: _conn, ...data } = args;
                result = await fsClient.post('/secuenciadocumentos', data, connection);
                break;
            }
            case 'update_secuenciadocumento': {
                const { connection: _conn, idsecuencia, ...data } = args;
                result = await fsClient.put(`/secuenciadocumentos/${idsecuencia}`, data, connection);
                break;
            }
            case 'delete_secuenciadocumento': {
                result = await fsClient.delete(`/secuenciadocumentos/${args.idsecuencia}`, connection);
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