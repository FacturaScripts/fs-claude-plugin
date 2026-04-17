/**
 * Sales Orders Module - Tools para gestión de pedidos, presupuestos, albaranes y facturas
 * Incluye: Presupuestos, Pedidos, Albaranes, Facturas y Recibos de clientes
 */

import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';

interface PresupuestoclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  codcliente?: string;
  fecha?: string;
  estado?: string;
  codserie?: string;
}

interface LineapresupuestoclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  idpresupuesto?: number;
  referencia?: string;
}

interface PedidoclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  codcliente?: string;
  fecha?: string;
  estado?: string;
  codserie?: string;
}

interface LineapedidoclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  idpedido?: number;
  referencia?: string;
}

interface AlbaranclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  codcliente?: string;
  fecha?: string;
  codserie?: string;
}

interface LineaalbaranclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  idalbaran?: number;
  referencia?: string;
}

interface FacturaclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  codcliente?: string;
  fecha?: string;
  pagada?: boolean;
  anulada?: boolean;
  codserie?: string;
  codejercicio?: string;
}

interface LineafacturaclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  idfactura?: number;
  referencia?: string;
}

interface ReciboclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  codcliente?: string;
  fecha?: string;
  pagado?: boolean;
  vencimiento?: string;
}

interface PagoclientesParams {
  connection: string;
  offset?: number;
  limit?: number;
  idrecibo?: number;
}

export const salesOrdersTools: Tool[] = [
  {
    name: 'get_presupuestoclientes',
    description: 'Obtiene la lista de presupuestos de clientes',
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
        fecha: {
          type: 'string',
          description: 'Filtrar por fecha (formato YYYY-MM-DD)',
        },
        estado: {
          type: 'string',
          description: 'Filtrar por estado',
        },
        codserie: {
          type: 'string',
          description: 'Filtrar por código de serie',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_lineapresupuestoclientes',
    description: 'Obtiene las líneas de presupuestos de clientes',
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
        idpresupuesto: {
          type: 'number',
          description: 'Filtrar por ID de presupuesto',
        },
        referencia: {
          type: 'string',
          description: 'Filtrar por referencia de producto',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_pedidoclientes',
    description: 'Obtiene la lista de pedidos de clientes',
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
        fecha: {
          type: 'string',
          description: 'Filtrar por fecha (formato YYYY-MM-DD)',
        },
        estado: {
          type: 'string',
          description: 'Filtrar por estado',
        },
        codserie: {
          type: 'string',
          description: 'Filtrar por código de serie',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_lineapedidoclientes',
    description: 'Obtiene las líneas de pedidos de clientes',
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
        idpedido: {
          type: 'number',
          description: 'Filtrar por ID de pedido',
        },
        referencia: {
          type: 'string',
          description: 'Filtrar por referencia de producto',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_albaranclientes',
    description: 'Obtiene la lista de albaranes de clientes',
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
        fecha: {
          type: 'string',
          description: 'Filtrar por fecha (formato YYYY-MM-DD)',
        },
        codserie: {
          type: 'string',
          description: 'Filtrar por código de serie',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_lineaalbaranclientes',
    description: 'Obtiene las líneas de albaranes de clientes',
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
        idalbaran: {
          type: 'number',
          description: 'Filtrar por ID de albarán',
        },
        referencia: {
          type: 'string',
          description: 'Filtrar por referencia de producto',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_facturaclientes',
    description: 'Obtiene la lista de facturas de clientes',
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
        fecha: {
          type: 'string',
          description: 'Filtrar por fecha (formato YYYY-MM-DD)',
        },
        pagada: {
          type: 'boolean',
          description: 'Filtrar por estado de pago',
        },
        anulada: {
          type: 'boolean',
          description: 'Filtrar por estado de anulación',
        },
        codserie: {
          type: 'string',
          description: 'Filtrar por código de serie',
        },
        codejercicio: {
          type: 'string',
          description: 'Filtrar por código de ejercicio',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_lineafacturaclientes',
    description: 'Obtiene las líneas de facturas de clientes',
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
        idfactura: {
          type: 'number',
          description: 'Filtrar por ID de factura',
        },
        referencia: {
          type: 'string',
          description: 'Filtrar por referencia de producto',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_reciboclientes',
    description: 'Obtiene la lista de recibos de clientes',
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
        fecha: {
          type: 'string',
          description: 'Filtrar por fecha (formato YYYY-MM-DD)',
        },
        pagado: {
          type: 'boolean',
          description: 'Filtrar por estado de pago',
        },
        vencimiento: {
          type: 'string',
          description: 'Filtrar por fecha de vencimiento (formato YYYY-MM-DD)',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_pagoclientes',
    description: 'Obtiene la lista de pagos de clientes',
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
        idrecibo: {
          type: 'number',
          description: 'Filtrar por ID de recibo',
        },
      },
      required: ['connection'],
    },
  },
];

export async function registerSalesOrdersTools(server: Server): Promise<void> {
  server.setRequestHandler(
    { resources: { list: {} } } as unknown as Parameters<typeof server.setRequestHandler>[0],
    async () => {
      return { resources: [] };
    },
  );

  for (const tool of salesOrdersTools) {
    server.setRequestHandler(
      { tools: { call: { name: tool.name } } } as unknown as Parameters<typeof server.setRequestHandler>[0],
      async (request) => {
        const input = request.params.arguments;

        switch (tool.name) {
          case 'get_presupuestoclientes': {
            const params = input as PresupuestoclientesParams;
            const result = await fsClient.get(
              '/presupuestoclientes',
              {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                fecha: params.fecha,
                estado: params.estado,
                codserie: params.codserie,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_lineapresupuestoclientes': {
            const params = input as LineapresupuestoclientesParams;
            const result = await fsClient.get(
              '/lineapresupuestoclientes',
              {
                offset: params.offset,
                limit: params.limit,
                idpresupuesto: params.idpresupuesto,
                referencia: params.referencia,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_pedidoclientes': {
            const params = input as PedidoclientesParams;
            const result = await fsClient.get(
              '/pedidoclientes',
              {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                fecha: params.fecha,
                estado: params.estado,
                codserie: params.codserie,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_lineapedidoclientes': {
            const params = input as LineapedidoclientesParams;
            const result = await fsClient.get(
              '/lineapedidoclientes',
              {
                offset: params.offset,
                limit: params.limit,
                idpedido: params.idpedido,
                referencia: params.referencia,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_albaranclientes': {
            const params = input as AlbaranclientesParams;
            const result = await fsClient.get(
              '/albaranclientes',
              {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                fecha: params.fecha,
                codserie: params.codserie,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_lineaalbaranclientes': {
            const params = input as LineaalbaranclientesParams;
            const result = await fsClient.get(
              '/lineaalbaranclientes',
              {
                offset: params.offset,
                limit: params.limit,
                idalbaran: params.idalbaran,
                referencia: params.referencia,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_facturaclientes': {
            const params = input as FacturaclientesParams;
            const result = await fsClient.get(
              '/facturaclientes',
              {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                fecha: params.fecha,
                pagada: params.pagada,
                anulada: params.anulada,
                codserie: params.codserie,
                codejercicio: params.codejercicio,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_lineafacturaclientes': {
            const params = input as LineafacturaclientesParams;
            const result = await fsClient.get(
              '/lineafacturaclientes',
              {
                offset: params.offset,
                limit: params.limit,
                idfactura: params.idfactura,
                referencia: params.referencia,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_reciboclientes': {
            const params = input as ReciboclientesParams;
            const result = await fsClient.get(
              '/reciboclientes',
              {
                offset: params.offset,
                limit: params.limit,
                codcliente: params.codcliente,
                fecha: params.fecha,
                pagado: params.pagado,
                vencimiento: params.vencimiento,
              },
              params.connection,
            );
            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_pagoclientes': {
            const params = input as PagoclientesParams;
            const result = await fsClient.get(
              '/pagoclientes',
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
