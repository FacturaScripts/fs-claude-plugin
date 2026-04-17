import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';

interface PaginationParams {
  connection: string;
  offset?: number;
  limit?: number;
}

interface EjerciciosParams extends PaginationParams {
  codejercicio?: string;
  estado?: string;
}

interface AsientosParams extends PaginationParams {
  codejercicio?: string;
  descripcion?: string;
  fecha?: string;
}

interface PartidasParams extends PaginationParams {
  idasiento?: string;
  codsubcuenta?: string;
}

interface CuentasParams extends PaginationParams {
  codcuenta?: string;
  codejercicio?: string;
  descripcion?: string;
}

interface SubcuentasParams extends PaginationParams {
  codsubcuenta?: string;
  codejercicio?: string;
  descripcion?: string;
}

interface ConceptoPartidasParams extends PaginationParams {
  // No additional filters beyond pagination
}

interface DiariosParams extends PaginationParams {
  coddiario?: string;
}

interface CuentaEspecialesParams extends PaginationParams {
  // No additional filters beyond pagination
}

export async function registerAccountingTools(server: Server): Promise<void> {
  const tools: Tool[] = [
    {
      name: 'get_ejercicios',
      description: 'Obtiene ejercicios contables con filtros opcionales de código y estado',
      inputSchema: {
        type: 'object' as const,
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
          estado: {
            type: 'string',
            description: 'Estado del ejercicio',
          },
        },
        required: ['connection'],
      },
    },
    {
      name: 'get_asientos',
      description:
        'Obtiene asientos contables con filtros opcionales de ejercicio, descripción y fecha',
      inputSchema: {
        type: 'object' as const,
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
          descripcion: {
            type: 'string',
            description: 'Descripción del asiento',
          },
          fecha: {
            type: 'string',
            description: 'Fecha del asiento (formato YYYY-MM-DD)',
          },
        },
        required: ['connection'],
      },
    },
    {
      name: 'get_partidas',
      description:
        'Obtiene partidas contables con filtros opcionales de ID de asiento y código de subcuenta',
      inputSchema: {
        type: 'object' as const,
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
          idasiento: {
            type: 'string',
            description: 'ID del asiento',
          },
          codsubcuenta: {
            type: 'string',
            description: 'Código de la subcuenta',
          },
        },
        required: ['connection'],
      },
    },
    {
      name: 'get_cuentas',
      description:
        'Obtiene cuentas contables con filtros opcionales de código, ejercicio y descripción',
      inputSchema: {
        type: 'object' as const,
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
            description: 'Código de la cuenta',
          },
          codejercicio: {
            type: 'string',
            description: 'Código del ejercicio',
          },
          descripcion: {
            type: 'string',
            description: 'Descripción de la cuenta',
          },
        },
        required: ['connection'],
      },
    },
    {
      name: 'get_subcuentas',
      description:
        'Obtiene subcuentas contables con filtros opcionales de código, ejercicio y descripción',
      inputSchema: {
        type: 'object' as const,
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
          codsubcuenta: {
            type: 'string',
            description: 'Código de la subcuenta',
          },
          codejercicio: {
            type: 'string',
            description: 'Código del ejercicio',
          },
          descripcion: {
            type: 'string',
            description: 'Descripción de la subcuenta',
          },
        },
        required: ['connection'],
      },
    },
    {
      name: 'get_conceptopartidas',
      description: 'Obtiene conceptos de partidas con opciones de paginación',
      inputSchema: {
        type: 'object' as const,
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
      name: 'get_diarios',
      description: 'Obtiene diarios contables con filtros opcionales de código de diario',
      inputSchema: {
        type: 'object' as const,
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
          coddiario: {
            type: 'string',
            description: 'Código del diario',
          },
        },
        required: ['connection'],
      },
    },
    {
      name: 'get_cuentaespeciales',
      description: 'Obtiene cuentas especiales con opciones de paginación',
      inputSchema: {
        type: 'object' as const,
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
  ];

  server.setRequestHandler(
    { resources: { list: {} } } as unknown as Parameters<typeof server.setRequestHandler>[0],
    async (_request) => {
      return { resources: [] };
    },
  );

  for (const tool of tools) {
    server.setRequestHandler(
      { tools: { call: { name: tool.name } } } as unknown as Parameters<typeof server.setRequestHandler>[0],
      async (request) => {
        const input = request.params.arguments;

        switch (tool.name) {
          case 'get_ejercicios': {
            const params = input as EjerciciosParams;
            const result = await fsClient.get(
              '/ejercicios',
              {
                offset: params.offset,
                limit: params.limit,
                codejercicio: params.codejercicio,
                estado: params.estado,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_asientos': {
            const params = input as AsientosParams;
            const result = await fsClient.get(
              '/asientos',
              {
                offset: params.offset,
                limit: params.limit,
                codejercicio: params.codejercicio,
                descripcion: params.descripcion,
                fecha: params.fecha,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_partidas': {
            const params = input as PartidasParams;
            const result = await fsClient.get(
              '/partidas',
              {
                offset: params.offset,
                limit: params.limit,
                idasiento: params.idasiento,
                codsubcuenta: params.codsubcuenta,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_cuentas': {
            const params = input as CuentasParams;
            const result = await fsClient.get(
              '/cuentas',
              {
                offset: params.offset,
                limit: params.limit,
                codcuenta: params.codcuenta,
                codejercicio: params.codejercicio,
                descripcion: params.descripcion,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_subcuentas': {
            const params = input as SubcuentasParams;
            const result = await fsClient.get(
              '/subcuentas',
              {
                offset: params.offset,
                limit: params.limit,
                codsubcuenta: params.codsubcuenta,
                codejercicio: params.codejercicio,
                descripcion: params.descripcion,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_conceptopartidas': {
            const params = input as ConceptoPartidasParams;
            const result = await fsClient.get(
              '/conceptopartidas',
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

          case 'get_diarios': {
            const params = input as DiariosParams;
            const result = await fsClient.get(
              '/diarios',
              {
                offset: params.offset,
                limit: params.limit,
                coddiario: params.coddiario,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_cuentaespeciales': {
            const params = input as CuentaEspecialesParams;
            const result = await fsClient.get(
              '/cuentaespeciales',
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
