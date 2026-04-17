/**
 * System Module for FacturaScripts MCP Server
 * Provides tools for accessing system logs, tasks, and events
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';

export const systemTools: Tool[] = [
  {
    name: 'get_logmessages',
    description: 'Obtiene mensajes de registro de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
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
        channel: {
          type: 'string',
          description: 'Filtrar por canal de registro',
        },
        level: {
          type: 'string',
          description: 'Filtrar por nivel de registro (INFO, WARNING, ERROR, etc.)',
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
    name: 'get_cronjobes',
    description: 'Obtiene trabajos cron de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
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
    name: 'get_workeventes',
    description: 'Obtiene eventos de trabajo de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
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
    name: 'get_roles',
    description: 'Obtiene la lista de roles de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        offset: { type: 'number', description: 'Offset de paginación (por defecto: 0)' },
        limit: { type: 'number', description: 'Límite de resultados (por defecto: 100)' },
        codrole: { type: 'string', description: 'Filtrar por código de rol' },
        descripcion: { type: 'string', description: 'Filtrar por descripción' },
      },
      required: [],
    },
  },
  {
    name: 'get_roleaccesses',
    description: 'Obtiene la lista de permisos de acceso por rol de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        offset: { type: 'number', description: 'Offset de paginación (por defecto: 0)' },
        limit: { type: 'number', description: 'Límite de resultados (por defecto: 100)' },
        codrole: { type: 'string', description: 'Filtrar por código de rol' },
        pagename: { type: 'string', description: 'Filtrar por nombre de página' },
      },
      required: [],
    },
  },
  {
    name: 'get_roleusers',
    description: 'Obtiene la lista de asignaciones de roles a usuarios de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        offset: { type: 'number', description: 'Offset de paginación (por defecto: 0)' },
        limit: { type: 'number', description: 'Límite de resultados (por defecto: 100)' },
        codrole: { type: 'string', description: 'Filtrar por código de rol' },
        nick: { type: 'string', description: 'Filtrar por nombre de usuario' },
      },
      required: [],
    },
  },
  {
    name: 'get_users',
    description: 'Obtiene la lista de usuarios de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        offset: { type: 'number', description: 'Offset de paginación (por defecto: 0)' },
        limit: { type: 'number', description: 'Límite de resultados (por defecto: 100)' },
        nick: { type: 'string', description: 'Filtrar por nombre de usuario' },
        email: { type: 'string', description: 'Filtrar por email' },
        enabled: { type: 'boolean', description: 'Filtrar por estado habilitado' },
        admin: { type: 'boolean', description: 'Filtrar por usuarios administradores' },
      },
      required: [],
    },
  },
  {
    name: 'get_codemodels',
    description: 'Obtiene la lista de code models de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        offset: { type: 'number', description: 'Offset de paginación (por defecto: 0)' },
        limit: { type: 'number', description: 'Límite de resultados (por defecto: 100)' },
      },
      required: [],
    },
  },
];



export const systemWriteTools: Tool[] = [
  {
    name: 'create_user',
    description: 'Crea un nuevo usuario en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        nick: { type: 'string', description: 'Nombre de usuario (obligatorio)' },
        email: { type: 'string', description: 'Email del usuario (obligatorio)' },
        admin: { type: 'boolean', description: 'Si el usuario es administrador' },
        enabled: { type: 'boolean', description: 'Si el usuario está habilitado' },
        codagente: { type: 'string', description: 'Código del agente asociado' },
        codalmacen: { type: 'string', description: 'Código del almacén por defecto' },
        codserie: { type: 'string', description: 'Código de la serie por defecto' },
        langcode: { type: 'string', description: 'Código de idioma' },
        level: { type: 'number', description: 'Nivel de seguridad del usuario' },
        homepage: { type: 'string', description: 'Página de inicio del usuario' },
      },
      required: ['nick', 'email'],
    },
  },
  {
    name: 'update_user',
    description: 'Actualiza un usuario existente en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        nick: { type: 'string', description: 'Nombre de usuario a actualizar (obligatorio)' },
        email: { type: 'string', description: 'Email del usuario' },
        admin: { type: 'boolean', description: 'Si el usuario es administrador' },
        enabled: { type: 'boolean', description: 'Si el usuario está habilitado' },
        codagente: { type: 'string', description: 'Código del agente asociado' },
        codalmacen: { type: 'string', description: 'Código del almacén por defecto' },
        codserie: { type: 'string', description: 'Código de la serie por defecto' },
        langcode: { type: 'string', description: 'Código de idioma' },
        level: { type: 'number', description: 'Nivel de seguridad del usuario' },
        homepage: { type: 'string', description: 'Página de inicio del usuario' },
      },
      required: ['nick'],
    },
  },
  {
    name: 'delete_user',
    description: 'Elimina un usuario de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        nick: { type: 'string', description: 'Nombre de usuario a eliminar' },
      },
      required: ['nick'],
    },
  },
  {
    name: 'create_role',
    description: 'Crea un nuevo rol en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        codrole: { type: 'string', description: 'Código del rol (obligatorio)' },
        descripcion: { type: 'string', description: 'Descripción del rol (obligatorio)' },
      },
      required: ['codrole', 'descripcion'],
    },
  },
  {
    name: 'update_role',
    description: 'Actualiza un rol existente en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        codrole: { type: 'string', description: 'Código del rol a actualizar (obligatorio)' },
        descripcion: { type: 'string', description: 'Nueva descripción del rol' },
      },
      required: ['codrole'],
    },
  },
  {
    name: 'delete_role',
    description: 'Elimina un rol de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        codrole: { type: 'string', description: 'Código del rol a eliminar' },
      },
      required: ['codrole'],
    },
  },
  {
    name: 'create_roleaccess',
    description: 'Asigna permisos de acceso a una página para un rol en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        codrole: { type: 'string', description: 'Código del rol (obligatorio)' },
        pagename: { type: 'string', description: 'Nombre de la página (obligatorio)' },
        allowdelete: { type: 'boolean', description: 'Permite eliminar' },
        allowexport: { type: 'boolean', description: 'Permite exportar' },
        allowimport: { type: 'boolean', description: 'Permite importar' },
        allowupdate: { type: 'boolean', description: 'Permite actualizar' },
        onlyownerdata: { type: 'boolean', description: 'Solo ver datos propios' },
      },
      required: ['codrole', 'pagename'],
    },
  },
  {
    name: 'update_roleaccess',
    description: 'Actualiza los permisos de acceso de un rol en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        id: { type: 'number', description: 'ID del registro de acceso a actualizar (obligatorio)' },
        codrole: { type: 'string', description: 'Código del rol' },
        pagename: { type: 'string', description: 'Nombre de la página' },
        allowdelete: { type: 'boolean', description: 'Permite eliminar' },
        allowexport: { type: 'boolean', description: 'Permite exportar' },
        allowimport: { type: 'boolean', description: 'Permite importar' },
        allowupdate: { type: 'boolean', description: 'Permite actualizar' },
        onlyownerdata: { type: 'boolean', description: 'Solo ver datos propios' },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_roleaccess',
    description: 'Elimina un permiso de acceso de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        id: { type: 'number', description: 'ID del registro de acceso a eliminar' },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_roleuser',
    description: 'Asigna un rol a un usuario en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        codrole: { type: 'string', description: 'Código del rol (obligatorio)' },
        nick: { type: 'string', description: 'Nombre de usuario (obligatorio)' },
      },
      required: ['codrole', 'nick'],
    },
  },
  {
    name: 'delete_roleuser',
    description: 'Elimina la asignación de un rol a un usuario en FacturaScripts',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: { type: 'string', description: 'Clave de conexión' },
        id: { type: 'number', description: 'ID del registro de asignación a eliminar' },
      },
      required: ['id'],
    },
  },
];

/**
 * Register all system tools with the MCP server
 */
export async function registerSystemTools(tools: Map<string, Tool>): Promise<void> {
  systemTools.forEach((tool) => tools.set(tool.name, tool));
  systemWriteTools.forEach((tool) => tools.set(tool.name, tool));
}

/**
 * Handle system tool calls
 */
export async function handleSystemTool(
  name: string,
  args: Record<string, unknown>
): Promise<{ content: [{ type: 'text'; text: string }]; isError?: boolean } | null> {
  const connection = (args.connection as string | undefined) || undefined;
  const offset = (args.offset as number | undefined) || 0;
  const limit = (args.limit as number | undefined) || 100;

  try {
    let result;

    switch (name) {
      case 'get_logmessages': {
        const params: Record<string, unknown> = { offset, limit };
        if (args.channel) params.channel = args.channel;
        if (args.level) params.level = args.level;
        if (args.fecha) params.fecha = args.fecha;
        result = await fsClient.get('/logmessages', params, connection);
        break;
      }

      case 'get_cronjobes': {
        result = await fsClient.get('/cronjobes', { offset, limit }, connection);
        break;
      }

      case 'get_workeventes': {
        result = await fsClient.get('/workeventes', { offset, limit }, connection);
        break;
      }

      case 'get_roles': {
        const params: Record<string, unknown> = { offset, limit };
        if (args.codrole) params.codrole = args.codrole;
        if (args.descripcion) params.descripcion = args.descripcion;
        result = await fsClient.get('/roles', params, connection);
        break;
      }

      case 'get_roleaccesses': {
        const params: Record<string, unknown> = { offset, limit };
        if (args.codrole) params.codrole = args.codrole;
        if (args.pagename) params.pagename = args.pagename;
        result = await fsClient.get('/roleaccesses', params, connection);
        break;
      }

      case 'get_roleusers': {
        const params: Record<string, unknown> = { offset, limit };
        if (args.codrole) params.codrole = args.codrole;
        if (args.nick) params.nick = args.nick;
        result = await fsClient.get('/roleusers', params, connection);
        break;
      }

      case 'get_users': {
        const params: Record<string, unknown> = { offset, limit };
        if (args.nick) params.nick = args.nick;
        if (args.email) params.email = args.email;
        if (args.enabled !== undefined) params.enabled = args.enabled;
        if (args.admin !== undefined) params.admin = args.admin;
        result = await fsClient.get('/users', params, connection);
        break;
      }

      case 'get_codemodels': {
        result = await fsClient.get('/codemodels', { offset, limit }, connection);
        break;
      }


      case 'create_user': {
        const { connection: _conn, ...data } = args;
        result = await fsClient.post('/users', data, connection);
        break;
      }

      case 'update_user': {
        const { connection: _conn, nick, ...data } = args;
        result = await fsClient.put(`/users/${nick}`, data, connection);
        break;
      }

      case 'delete_user': {
        result = await fsClient.delete(`/users/${args.nick}`, connection);
        break;
      }

      case 'create_role': {
        const { connection: _conn, ...data } = args;
        result = await fsClient.post('/roles', data, connection);
        break;
      }

      case 'update_role': {
        const { connection: _conn, codrole, ...data } = args;
        result = await fsClient.put(`/roles/${codrole}`, data, connection);
        break;
      }

      case 'delete_role': {
        result = await fsClient.delete(`/roles/${args.codrole}`, connection);
        break;
      }

      case 'create_roleaccess': {
        const { connection: _conn, ...data } = args;
        result = await fsClient.post('/roleaccesses', data, connection);
        break;
      }

      case 'update_roleaccess': {
        const { connection: _conn, id, ...data } = args;
        result = await fsClient.put(`/roleaccesses/${id}`, data, connection);
        break;
      }

      case 'delete_roleaccess': {
        result = await fsClient.delete(`/roleaccesses/${args.id}`, connection);
        break;
      }

      case 'create_roleuser': {
        const { connection: _conn, ...data } = args;
        result = await fsClient.post('/roleusers', data, connection);
        break;
      }

      case 'delete_roleuser': {
        result = await fsClient.delete(`/roleusers/${args.id}`, connection);
        break;
      }

      default:
        return null;
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
}
