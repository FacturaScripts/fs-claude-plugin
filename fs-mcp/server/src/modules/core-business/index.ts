/**
 * Core Business Module - Tools para gestión de datos maestros de FacturaScripts
 * Incluye: Clientes, Proveedores, Productos, Familias, Fabricantes, Almacenes, etc.
 */

import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';

interface ClientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  codcliente?: string;
  nombre?: string;
  cifnif?: string;
  email?: string;
}

interface ProveedoresParams {
  connection: string;
  offset?: number;
  limit?: number;
  codproveedor?: string;
  nombre?: string;
  cifnif?: string;
}

interface ProductosParams {
  connection: string;
  offset?: number;
  limit?: number;
  referencia?: string;
  descripcion?: string;
  codfamilia?: string;
  codalmacen?: string;
}

interface VariantesParams {
  connection: string;
  offset?: number;
  limit?: number;
  referencia?: string;
  codbarras?: string;
}

interface FamiliasParams {
  connection: string;
  offset?: number;
  limit?: number;
  codfamilia?: string;
  descripcion?: string;
}

interface FabricantesParams {
  connection: string;
  offset?: number;
  limit?: number;
}

interface AlmacenesParams {
  connection: string;
  offset?: number;
  limit?: number;
}

interface StocksParams {
  connection: string;
  offset?: number;
  limit?: number;
  referencia?: string;
  codalmacen?: string;
}

interface TarifasParams {
  connection: string;
  offset?: number;
  limit?: number;
}

interface AtributosParams {
  connection: string;
  offset?: number;
  limit?: number;
}

interface AtributovaloresParams {
  connection: string;
  offset?: number;
  limit?: number;
  codatributo?: string;
}

interface AgentesParams {
  connection: string;
  offset?: number;
  limit?: number;
  codagente?: string;
}

interface ContactosParams {
  connection: string;
  offset?: number;
  limit?: number;
  codcontacto?: string;
  nombre?: string;
  email?: string;
}

interface GrupoclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
}

interface ProductoproveeedoresParams {
  connection: string;
  offset?: number;
  limit?: number;
  referencia?: string;
  codproveedor?: string;
}

interface ProductoimagenesParams {
  connection: string;
  offset?: number;
  limit?: number;
  referencia?: string;
}

export const coreBusinessTools: Tool[] = [
  {
    name: 'get_clientes',
    description: 'Obtiene la lista de clientes de FacturaScripts',
    inputSchema: {
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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

export async function registerCoreBusinessTools(server: Server): Promise<void> {
  server.setRequestHandler(
    { resources: { list: {} } } as unknown as Parameters<typeof server.setRequestHandler>[0],
    async () => {
      return { resources: [] };
    },
  );

  for (const tool of coreBusinessTools) {
    server.setRequestHandler(
      { tools: { call: { name: tool.name } } } as unknown as Parameters<typeof server.setRequestHandler>[0],
      async (request) => {
        const input = request.params.arguments;

        switch (tool.name) {
          case 'get_clientes': {
            const params = input as ClientesParams;
            const result = await fsClient.get(
              '/clientes',
              {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                nombre: params.nombre,
                cifnif: params.cifnif,
                email: params.email,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_proveedores': {
            const params = input as ProveedoresParams;
            const result = await fsClient.get(
              '/proveedores',
              {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                nombre: params.nombre,
                cifnif: params.cifnif,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_productos': {
            const params = input as ProductosParams;
            const result = await fsClient.get(
              '/productos',
              {
                offset: params.offset,
                limit: params.limit,
                referencia: params.referencia,
                descripcion: params.descripcion,
                codfamilia: params.codfamilia,
                codalmacen: params.codalmacen,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_variantes': {
            const params = input as VariantesParams;
            const result = await fsClient.get(
              '/variantes',
              {
                offset: params.offset,
                limit: params.limit,
                referencia: params.referencia,
                codbarras: params.codbarras,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_familias': {
            const params = input as FamiliasParams;
            const result = await fsClient.get(
              '/familias',
              {
                offset: params.offset,
                limit: params.limit,
                codfamilia: params.codfamilia,
                descripcion: params.descripcion,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_fabricantes': {
            const params = input as FabricantesParams;
            const result = await fsClient.get(
              '/fabricantes',
              {
                offset: params.offset,
                limit: params.limit,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_almacenes': {
            const params = input as AlmacenesParams;
            const result = await fsClient.get(
              '/almacenes',
              {
                offset: params.offset,
                limit: params.limit,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_stocks': {
            const params = input as StocksParams;
            const result = await fsClient.get(
              '/stocks',
              {
                offset: params.offset,
                limit: params.limit,
                referencia: params.referencia,
                codalmacen: params.codalmacen,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_tarifas': {
            const params = input as TarifasParams;
            const result = await fsClient.get(
              '/tarifas',
              {
                offset: params.offset,
                limit: params.limit,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_atributos': {
            const params = input as AtributosParams;
            const result = await fsClient.get(
              '/atributos',
              {
                offset: params.offset,
                limit: params.limit,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_atributovalores': {
            const params = input as AtributovaloresParams;
            const result = await fsClient.get(
              '/atributovalores',
              {
                offset: params.offset,
                limit: params.limit,
                codatributo: params.codatributo,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_agentes': {
            const params = input as AgentesParams;
            const result = await fsClient.get(
              '/agentes',
              {
                offset: params.offset,
                limit: params.limit,
                codagente: params.codagente,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_contactos': {
            const params = input as ContactosParams;
            const result = await fsClient.get(
              '/contactos',
              {
                offset: params.offset,
                limit: params.limit,
                codcontacto: params.codcontacto,
                nombre: params.nombre,
                email: params.email,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_grupoclientes': {
            const params = input as GrupoclientesParams;
            const result = await fsClient.get(
              '/grupoclientes',
              {
                offset: params.offset,
                limit: params.limit,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_productoproveedores': {
            const params = input as ProductoproveeedoresParams;
            const result = await fsClient.get(
              '/productoproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                referencia: params.referencia,
                codproveedor: params.codproveedor,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_productoimagenes': {
            const params = input as ProductoimagenesParams;
            const result = await fsClient.get(
              '/productoimagenes',
              {
                offset: params.offset,
                limit: params.limit,
                referencia: params.referencia,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          default:
            return {
              content: [
                {
                  type: 'text' as const,
                  text: JSON.stringify({ error: 'Tool not found' }, null, 2),
                },
              ],
            };
        }
      },
    );
  }
}
