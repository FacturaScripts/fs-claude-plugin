import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';

interface PaginationParams {
  connection: string;
  offset?: number;
  limit?: number;
}

interface PresupuestoProveedoresParams extends PaginationParams {
  codproveedor?: string;
  fecha?: string;
  estado?: string;
}

interface LineaPresupuestoProveedoresParams extends PaginationParams {
  idpresupuesto?: string;
}

interface PedidoProveedoresParams extends PaginationParams {
  codproveedor?: string;
  fecha?: string;
  estado?: string;
}

interface LineaPedidoProveedoresParams extends PaginationParams {
  idpedido?: string;
}

interface AlbaranProveedoresParams extends PaginationParams {
  codproveedor?: string;
  fecha?: string;
}

interface LineaAlbaranProveedoresParams extends PaginationParams {
  idalbaran?: string;
}

interface FacturaProveedoresParams extends PaginationParams {
  codproveedor?: string;
  fecha?: string;
  pagada?: boolean;
  codejercicio?: string;
}

interface LineaFacturaProveedoresParams extends PaginationParams {
  idfactura?: string;
}

interface ReciboProveedoresParams extends PaginationParams {
  codproveedor?: string;
  fecha?: string;
  pagado?: boolean;
}

interface PagoProveedoresParams extends PaginationParams {
  idrecibo?: string;
}

interface CuentaBancoProveedoresParams extends PaginationParams {
  codproveedor?: string;
}

export async function registerPurchasingTools(server: Server): Promise<void> {
  const tools: Tool[] = [
    {
      name: 'get_presupuestoproveedores',
      description:
        'Obtiene presupuestos de proveedores con filtros opcionales de código de proveedor, fecha y estado',
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
      description:
        'Obtiene líneas de presupuestos de proveedores filtradas por ID de presupuesto',
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
      description:
        'Obtiene pedidos de proveedores con filtros opcionales de código de proveedor, fecha y estado',
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
      description:
        'Obtiene líneas de pedidos de proveedores filtradas por ID de pedido',
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
      description:
        'Obtiene facturas de proveedores con filtros opcionales de código de proveedor, fecha, estado de pago y ejercicio',
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
      description:
        'Obtiene líneas de facturas de proveedores filtradas por ID de factura',
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
          codproveedor: {
            type: 'string',
            description: 'Código del proveedor a filtrar',
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
          case 'get_presupuestoproveedores': {
            const params = input as PresupuestoProveedoresParams;
            const result = await fsClient.get(
              '/presupuestoproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                fecha: params.fecha,
                estado: params.estado,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_lineapresupuestoproveedores': {
            const params = input as LineaPresupuestoProveedoresParams;
            const result = await fsClient.get(
              '/lineapresupuestoproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                idpresupuesto: params.idpresupuesto,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_pedidoproveedores': {
            const params = input as PedidoProveedoresParams;
            const result = await fsClient.get(
              '/pedidoproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                fecha: params.fecha,
                estado: params.estado,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_lineapedidoproveedores': {
            const params = input as LineaPedidoProveedoresParams;
            const result = await fsClient.get(
              '/lineapedidoproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                idpedido: params.idpedido,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_albaranproveedores': {
            const params = input as AlbaranProveedoresParams;
            const result = await fsClient.get(
              '/albaranproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                fecha: params.fecha,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_lineaalbaranproveedores': {
            const params = input as LineaAlbaranProveedoresParams;
            const result = await fsClient.get(
              '/lineaalbaranproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                idalbaran: params.idalbaran,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_facturaproveedores': {
            const params = input as FacturaProveedoresParams;
            const result = await fsClient.get(
              '/facturaproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                fecha: params.fecha,
                pagada: params.pagada,
                codejercicio: params.codejercicio,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_lineafacturaproveedores': {
            const params = input as LineaFacturaProveedoresParams;
            const result = await fsClient.get(
              '/lineafacturaproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                idfactura: params.idfactura,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_reciboproveedores': {
            const params = input as ReciboProveedoresParams;
            const result = await fsClient.get(
              '/reciboproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
                fecha: params.fecha,
                pagado: params.pagado,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_pagoproveedores': {
            const params = input as PagoProveedoresParams;
            const result = await fsClient.get(
              '/pagoproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                idrecibo: params.idrecibo,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_cuentabancoproveedores': {
            const params = input as CuentaBancoProveedoresParams;
            const result = await fsClient.get(
              '/cuentabancoproveedores',
              {
                offset: params.offset,
                limit: params.limit,
                codproveedor: params.codproveedor,
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
