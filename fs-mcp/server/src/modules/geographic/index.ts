/**
 * Geographic Module for FacturaScripts MCP Server
 * Provides tools for accessing geographic and location data
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';

/**
 * Register all geographic tools with the MCP server
 */
export async function registerGeographicTools(
  server: Server,
  tools: Map<string, Tool>
): Promise<void> {
  // Tool: get_pais
  const getPaisTool: Tool = {
    name: 'get_pais',
    description: 'Get countries from FacturaScripts',
    inputSchema: {
      type: 'object' as const,
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
  const getProvinciasTool: Tool = {
    name: 'get_provincias',
    description: 'Get provinces/states from FacturaScripts',
    inputSchema: {
      type: 'object' as const,
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
  const getCiudadesTool: Tool = {
    name: 'get_ciudades',
    description: 'Get cities from FacturaScripts',
    inputSchema: {
      type: 'object' as const,
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
  const getCodigoPostalesTool: Tool = {
    name: 'get_codigopostales',
    description: 'Get postal codes from FacturaScripts',
    inputSchema: {
      type: 'object' as const,
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
  const getPuntoInteresCiudadesTool: Tool = {
    name: 'get_puntointeresciudades',
    description: 'Get points of interest for cities from FacturaScripts',
    inputSchema: {
      type: 'object' as const,
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
  server.setRequestHandler(
    {
      method: 'tools/call',
      params: {
        name: 'string',
        arguments: 'object',
      },
    } as never,
    async (request: { params: { name: string; arguments: Record<string, unknown> } }) => {
      const { name, arguments: args } = request.params;
      const connection = (args.connection as string | undefined) || undefined;
      const offset = (args.offset as number | undefined) || 0;
      const limit = (args.limit as number | undefined) || 100;

      try {
        let result;

        switch (name) {
          case 'get_pais': {
            const params: Record<string, unknown> = { offset, limit };
            if (args.codpais) params.codpais = args.codpais;
            if (args.nombre) params.nombre = args.nombre;
            result = await fsClient.get('/paises', params, connection);
            break;
          }

          case 'get_provincias': {
            const params: Record<string, unknown> = { offset, limit };
            if (args.codpais) params.codpais = args.codpais;
            if (args.provincia) params.provincia = args.provincia;
            result = await fsClient.get('/provincias', params, connection);
            break;
          }

          case 'get_ciudades': {
            const params: Record<string, unknown> = { offset, limit };
            if (args.ciudad) params.ciudad = args.ciudad;
            if (args.codpais) params.codpais = args.codpais;
            if (args.codpostal) params.codpostal = args.codpostal;
            result = await fsClient.get('/ciudades', params, connection);
            break;
          }

          case 'get_codigopostales': {
            const params: Record<string, unknown> = { offset, limit };
            if (args.codpostal) params.codpostal = args.codpostal;
            if (args.ciudad) params.ciudad = args.ciudad;
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
                  type: 'text' as const,
                  text: JSON.stringify({ error: `Unknown geographic tool: ${name}` }, null, 2),
                },
              ],
              isError: true,
            };
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
  );
}
