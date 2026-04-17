import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';

interface PaginationParams {
  connection: string;
  offset?: number;
  limit?: number;
}

interface CuentaBancosParams extends PaginationParams {
  codcuenta?: string;
}

interface CuentaBancoClientesParams extends PaginationParams {
  codcliente?: string;
}

interface FormaPagosParams extends PaginationParams {
  codpago?: string;
}

interface DivisasParams extends PaginationParams {
  coddivisa?: string;
}

interface RetencionesParams extends PaginationParams {
  codretencion?: string;
}

interface ImpuestosParams extends PaginationParams {
  codimpuesto?: string;
}

interface ImpuestoZonasParams extends PaginationParams {
  // No additional filters beyond pagination
}

interface RegularizacionImpuestosParams extends PaginationParams {
  codejercicio?: string;
}

export async function registerFinanceTools(server: Server): Promise<void> {
  const tools: Tool[] = [
    {
      name: 'get_cuentabancos',
      description: 'Obtiene cuentas bancarias con filtros opcionales de código de cuenta',
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
            description: 'Código de la cuenta bancaria',
          },
        },
        required: ['connection'],
      },
    },
    {
      name: 'get_cuentabancoclientes',
      description:
        'Obtiene cuentas bancarias de clientes con filtros opcionales de código de cliente',
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
          codcliente: {
            type: 'string',
            description: 'Código del cliente',
          },
        },
        required: ['connection'],
      },
    },
    {
      name: 'get_formapagos',
      description: 'Obtiene formas de pago con filtros opcionales de código de pago',
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
      name: 'get_regularizacionimpuestos',
      description:
        'Obtiene regularizaciones de impuestos con filtros opcionales de código de ejercicio',
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
          case 'get_cuentabancos': {
            const params = input as CuentaBancosParams;
            const result = await fsClient.get(
              '/cuentabancos',
              {
                offset: params.offset,
                limit: params.limit,
                codcuenta: params.codcuenta,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_cuentabancoclientes': {
            const params = input as CuentaBancoClientesParams;
            const result = await fsClient.get(
              '/cuentabancoclientes',
              {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_formapagos': {
            const params = input as FormaPagosParams;
            const result = await fsClient.get(
              '/formapagos',
              {
                offset: params.offset,
                limit: params.limit,
                codpago: params.codpago,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_divisas': {
            const params = input as DivisasParams;
            const result = await fsClient.get(
              '/divisas',
              {
                offset: params.offset,
                limit: params.limit,
                coddivisa: params.coddivisa,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_retenciones': {
            const params = input as RetencionesParams;
            const result = await fsClient.get(
              '/retenciones',
              {
                offset: params.offset,
                limit: params.limit,
                codretencion: params.codretencion,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_impuestos': {
            const params = input as ImpuestosParams;
            const result = await fsClient.get(
              '/impuestos',
              {
                offset: params.offset,
                limit: params.limit,
                codimpuesto: params.codimpuesto,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_impuestozonas': {
            const params = input as ImpuestoZonasParams;
            const result = await fsClient.get(
              '/impuestozonas',
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

          case 'get_regularizacionimpuestos': {
            const params = input as RegularizacionImpuestosParams;
            const result = await fsClient.get(
              '/regularizacionimpuestos',
              {
                offset: params.offset,
                limit: params.limit,
                codejercicio: params.codejercicio,
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
