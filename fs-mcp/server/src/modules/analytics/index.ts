/**
 * Analytics Module - Advanced analytics tools for FacturaScripts
 * Provides tools for analyzing customer behavior, product sales, billing trends, and business metrics
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';

interface ClienteMoroso {
  codcliente: string;
  nombre: string;
  email: string;
  totalDeuda: number;
  recibos: Array<{
    idrecibo: number;
    fecha: string;
    fechavencimiento: string;
    importe: number;
    pagado: boolean;
  }>;
}

interface ClientePerdido {
  codcliente: string;
  nombre: string;
  email: string;
  ultimaCompra: string | null;
  diasSinCompras: number;
}

interface ClienteTopFacturacion {
  codcliente: string;
  nombre: string;
  email: string;
  totalFacturado: number;
  numeroFacturas: number;
}

interface ClienteFrecuencia {
  codcliente: string;
  nombre: string;
  numeroFacturas: number;
  totalFacturado: number;
  ticketPromedio: number;
}

interface ProductoVendido {
  referencia: string;
  descripcion: string;
  cantidadVendida: number;
  importeTotal: number;
}

interface ProductoNoVendido {
  referencia: string;
  descripcion: string;
  familia: string;
  codfamilia: string;
}

interface FacturaData {
  idfactura: number;
  numero: string;
  fecha: string;
  codcliente: string;
  nombrecliente: string;
  cifnif: string;
  neto: number;
  iva: number;
  total: number;
  pagado: boolean;
  anulada: boolean;
  lineas?: Array<{
    idlinea: number;
    referencia: string;
    descripcion: string;
    cantidad: number;
    pvpunitario: number;
    pvptotal: number;
  }>;
}

interface FacturaConError {
  idfactura: number;
  numero: string;
  fecha: string;
  codcliente: string;
  error: string;
  detalles: Record<string, unknown>;
}

interface EvolucionMensual {
  mes: string;
  neto: number;
  iva: number;
  total: number;
}

interface EvolucionNegocio {
  periodo: string;
  neto: number;
  iva: number;
  total: number;
  numeroFacturas: number;
}

export const analyticsTools: Tool[] = [
  {
    name: 'get_clientes_morosos',
    description: 'Obtiene clientes con recibos vencidos no pagados',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_clientes_perdidos',
    description: 'Obtiene clientes que no han comprado en N meses',
    inputSchema: {
      type: 'object' as const,
      properties: {
        meses: {
          type: 'number',
          description: 'Número de meses para considerar como cliente perdido (default: 12)',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_clientes_sin_compras',
    description: 'Obtiene clientes que nunca han realizado compras',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_clientes_top_facturacion',
    description: 'Obtiene los clientes con mayor facturación',
    inputSchema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Número de clientes a retornar (default: 10)',
        },
        codejercicio: {
          type: 'string',
          description: 'Código de ejercicio (opcional)',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_clientes_frecuencia_compras',
    description: 'Obtiene la frecuencia de compras por cliente',
    inputSchema: {
      type: 'object' as const,
      properties: {
        codejercicio: {
          type: 'string',
          description: 'Código de ejercicio (opcional)',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_productos_mas_vendidos',
    description: 'Obtiene los productos más vendidos',
    inputSchema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Número de productos a retornar (default: 10)',
        },
        codejercicio: {
          type: 'string',
          description: 'Código de ejercicio (opcional)',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_productos_bajo_stock',
    description: 'Obtiene productos con stock bajo o en cero',
    inputSchema: {
      type: 'object' as const,
      properties: {
        minstock: {
          type: 'number',
          description: 'Stock mínimo para filtrar (default: 0)',
        },
        codalmacen: {
          type: 'string',
          description: 'Código de almacén (opcional)',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_productos_no_vendidos',
    description: 'Obtiene productos sin ventas en un período',
    inputSchema: {
      type: 'object' as const,
      properties: {
        dias: {
          type: 'number',
          description: 'Número de días a considerar (default: 90)',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_facturas_cliente_por_cifnif',
    description: 'Obtiene facturas de un cliente filtrando por CIF/NIF',
    inputSchema: {
      type: 'object' as const,
      properties: {
        cifnif: {
          type: 'string',
          description: 'CIF/NIF del cliente',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['cifnif', 'connection'],
    },
  },
  {
    name: 'get_facturas_con_errores',
    description: 'Obtiene facturas con posibles errores (total 0, anuladas con pagos, etc.)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_tiempo_beneficios_cliente',
    description: 'Obtiene evolución de facturación de un cliente por mes',
    inputSchema: {
      type: 'object' as const,
      properties: {
        codcliente: {
          type: 'string',
          description: 'Código de cliente',
        },
        codejercicio: {
          type: 'string',
          description: 'Código de ejercicio (opcional)',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['codcliente', 'connection'],
    },
  },
  {
    name: 'get_tiempo_beneficios_todos_clientes',
    description: 'Obtiene evolución global de facturación por mes',
    inputSchema: {
      type: 'object' as const,
      properties: {
        codejercicio: {
          type: 'string',
          description: 'Código de ejercicio (opcional)',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['connection'],
    },
  },
  {
    name: 'exportar_factura_cliente',
    description: 'Obtiene los datos completos de una factura con líneas para exportar',
    inputSchema: {
      type: 'object' as const,
      properties: {
        idfactura: {
          type: 'number',
          description: 'ID de la factura',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['idfactura', 'connection'],
    },
  },
  {
    name: 'get_mi_recurso',
    description: 'Endpoint personalizable para acceder a recursos custom de la API',
    inputSchema: {
      type: 'object' as const,
      properties: {
        recurso: {
          type: 'string',
          description: 'Nombre del recurso (ej: facturaclientes, lineafacturaclientes)',
        },
        params: {
          type: 'string',
          description: 'Parámetros como JSON string (ej: {"limit":50,"offset":0})',
        },
        connection: {
          type: 'string',
          description: 'Clave de conexión',
        },
      },
      required: ['recurso', 'connection'],
    },
  },
];

/**
 * Register all analytics tools with the MCP server
 */
export async function registerAnalyticsTools(tools: Map<string, Tool>): Promise<void> {
  analyticsTools.forEach((tool) => tools.set(tool.name, tool));
}

/**
 * Handle analytics tool calls
 */
export async function handleAnalyticsTool(
  name: string,
  args: Record<string, unknown>
): Promise<{ content: [{ type: 'text'; text: string }]; isError?: boolean } | null> {
  const input = args;

  try {
    switch (name) {
            case 'get_clientes_morosos': {
              const connection = input.connection as string;

              // Obtener todos los recibos no pagados
              const recibos = await fsClient.get(
                '/reciboclientes',
                { pagado: false, limit: 1000 },
                connection,
              );

              const now = new Date();

              // Filtrar recibos vencidos
              const recibosPorCliente: Record<string, ClienteMoroso> = {};

              for (const recibo of recibos as any[]) {
                const fechaVencimiento = new Date(recibo.fechavencimiento);
                if (fechaVencimiento < now) {
                  const codcliente = recibo.codcliente;

                  if (!recibosPorCliente[codcliente]) {
                    recibosPorCliente[codcliente] = {
                      codcliente,
                      nombre: recibo.nombre || '',
                      email: recibo.email || '',
                      totalDeuda: 0,
                      recibos: [],
                    };
                  }

                  recibosPorCliente[codcliente].totalDeuda += recibo.importe || 0;
                  recibosPorCliente[codcliente].recibos.push({
                    idrecibo: recibo.idrecibo,
                    fecha: recibo.fecha,
                    fechavencimiento: recibo.fechavencimiento,
                    importe: recibo.importe,
                    pagado: recibo.pagado,
                  });
                }
              }

              const morososList = Object.values(recibosPorCliente).sort(
                (a, b) => b.totalDeuda - a.totalDeuda,
              );

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(morososList, null, 2) }],
              };
            }

            case 'get_clientes_perdidos': {
              const connection = input.connection as string;
              const meses = (input.meses as number) || 12;

              // Calcular fecha límite
              const ahora = new Date();
              const fechaLimite = new Date(ahora);
              fechaLimite.setMonth(fechaLimite.getMonth() - meses);

              // Obtener todos los clientes
              const clientes = await fsClient.get(
                '/clientes',
                { limit: 1000 },
                connection,
              );

              // Obtener todas las facturas desde la fecha límite
              const facturas = await fsClient.get(
                '/facturaclientes',
                { limit: 1000 },
                connection,
              );

              // Agrupar códigos de clientes que compraron en el período
              const clientesConCompras = new Set<string>();
              for (const factura of facturas as any[]) {
                const fechaFactura = new Date(factura.fecha);
                if (fechaFactura >= fechaLimite) {
                  clientesConCompras.add(factura.codcliente);
                }
              }

              // Clientes perdidos: están en clientes pero no compraron en N meses
              const clientesPerdidos: ClientePerdido[] = [];
              for (const cliente of clientes as any[]) {
                if (!clientesConCompras.has(cliente.codcliente)) {
                  // Buscar última compra
                  let ultimaCompra: string | null = null;
                  let diasSinCompras = Infinity;

                  for (const factura of facturas as any[]) {
                    if (factura.codcliente === cliente.codcliente) {
                      const fechaFactura = new Date(factura.fecha);
                      if (!ultimaCompra || new Date(ultimaCompra) < fechaFactura) {
                        ultimaCompra = factura.fecha;
                      }
                    }
                  }

                  if (ultimaCompra) {
                    const días = Math.floor(
                      (ahora.getTime() - new Date(ultimaCompra).getTime()) / (1000 * 60 * 60 * 24),
                    );
                    diasSinCompras = días;
                  }

                  clientesPerdidos.push({
                    codcliente: cliente.codcliente,
                    nombre: cliente.nombre,
                    email: cliente.email,
                    ultimaCompra,
                    diasSinCompras,
                  });
                }
              }

              return {
                content: [
                  {
                    type: 'text' as const,
                    text: JSON.stringify(clientesPerdidos.sort((a, b) => b.diasSinCompras - a.diasSinCompras), null, 2),
                  },
                ],
              };
            }

            case 'get_clientes_sin_compras': {
              const connection = input.connection as string;

              // Obtener todos los clientes
              const clientes = await fsClient.get(
                '/clientes',
                { limit: 1000 },
                connection,
              );

              // Obtener todas las facturas
              const facturas = await fsClient.get(
                '/facturaclientes',
                { limit: 1000 },
                connection,
              );

              // Obtener códigos únicos de clientes que compraron
              const clientesConFacturas = new Set<string>();
              for (const factura of facturas as any[]) {
                clientesConFacturas.add(factura.codcliente);
              }

              // Filtrar clientes sin facturas
              const clientesSinCompras = (clientes as any[]).filter(
                (cliente) => !clientesConFacturas.has(cliente.codcliente),
              );

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(clientesSinCompras, null, 2) }],
              };
            }

            case 'get_clientes_top_facturacion': {
              const connection = input.connection as string;
              const limit = (input.limit as number) || 10;
              const codejercicio = input.codejercicio as string | undefined;

              // Obtener facturas
              const params: Record<string, unknown> = { limit: 1000 };
              if (codejercicio) params.codejercicio = codejercicio;

              const facturas = await fsClient.get(
                '/facturaclientes',
                params,
                connection,
              );

              // Agrupar por cliente y sumar totales
              const clientesMap: Record<string, ClienteTopFacturacion> = {};

              for (const factura of facturas as any[]) {
                const codcliente = factura.codcliente;
                if (!clientesMap[codcliente]) {
                  clientesMap[codcliente] = {
                    codcliente,
                    nombre: factura.nombrecliente,
                    email: factura.email || '',
                    totalFacturado: 0,
                    numeroFacturas: 0,
                  };
                }
                clientesMap[codcliente].totalFacturado += factura.total || 0;
                clientesMap[codcliente].numeroFacturas += 1;
              }

              const topClientes = Object.values(clientesMap)
                .sort((a, b) => b.totalFacturado - a.totalFacturado)
                .slice(0, limit);

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(topClientes, null, 2) }],
              };
            }

            case 'get_clientes_frecuencia_compras': {
              const connection = input.connection as string;
              const codejercicio = input.codejercicio as string | undefined;

              // Obtener facturas
              const params: Record<string, unknown> = { limit: 1000 };
              if (codejercicio) params.codejercicio = codejercicio;

              const facturas = await fsClient.get(
                '/facturaclientes',
                params,
                connection,
              );

              // Agrupar por cliente
              const clientesMap: Record<string, ClienteFrecuencia> = {};

              for (const factura of facturas as any[]) {
                const codcliente = factura.codcliente;
                if (!clientesMap[codcliente]) {
                  clientesMap[codcliente] = {
                    codcliente,
                    nombre: factura.nombrecliente,
                    numeroFacturas: 0,
                    totalFacturado: 0,
                    ticketPromedio: 0,
                  };
                }
                clientesMap[codcliente].numeroFacturas += 1;
                clientesMap[codcliente].totalFacturado += factura.total || 0;
              }

              // Calcular ticket promedio
              for (const cliente of Object.values(clientesMap)) {
                cliente.ticketPromedio = cliente.numeroFacturas > 0
                  ? cliente.totalFacturado / cliente.numeroFacturas
                  : 0;
              }

              return {
                content: [
                  {
                    type: 'text' as const,
                    text: JSON.stringify(
                      Object.values(clientesMap).sort((a, b) => b.totalFacturado - a.totalFacturado),
                      null,
                      2,
                    ),
                  },
                ],
              };
            }

            case 'get_productos_mas_vendidos': {
              const connection = input.connection as string;
              const limit = (input.limit as number) || 10;
              const codejercicio = input.codejercicio as string | undefined;

              // Obtener líneas de facturas
              const params: Record<string, unknown> = { limit: 1000 };
              if (codejercicio) params.codejercicio = codejercicio;

              const lineas = await fsClient.get(
                '/lineafacturaclientes',
                params,
                connection,
              );

              // Agrupar por referencia de producto
              const productosMap: Record<string, ProductoVendido> = {};

              for (const linea of lineas as any[]) {
                const referencia = linea.referencia;
                if (!productosMap[referencia]) {
                  productosMap[referencia] = {
                    referencia,
                    descripcion: linea.descripcion,
                    cantidadVendida: 0,
                    importeTotal: 0,
                  };
                }
                productosMap[referencia].cantidadVendida += linea.cantidad || 0;
                productosMap[referencia].importeTotal += linea.pvptotal || 0;
              }

              const topProductos = Object.values(productosMap)
                .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
                .slice(0, limit);

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(topProductos, null, 2) }],
              };
            }

            case 'get_productos_bajo_stock': {
              const connection = input.connection as string;
              const minstock = (input.minstock as number) || 0;
              const codalmacen = input.codalmacen as string | undefined;

              // Obtener stocks
              const params: Record<string, unknown> = { limit: 1000 };
              if (codalmacen) params.codalmacen = codalmacen;

              const stocks = await fsClient.get(
                '/stocks',
                params,
                connection,
              );

              // Filtrar por stock bajo
              const productosBajoStock = (stocks as any[])
                .filter((stock) => (stock.cantidad || 0) <= minstock)
                .map((stock) => ({
                  referencia: stock.referencia,
                  descripcion: stock.descripcion,
                  codalmacen: stock.codalmacen,
                  cantidad: stock.cantidad,
                  disponible: stock.disponible,
                }))
                .sort((a, b) => a.cantidad - b.cantidad);

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(productosBajoStock, null, 2) }],
              };
            }

            case 'get_productos_no_vendidos': {
              const connection = input.connection as string;
              const dias = (input.dias as number) || 90;

              // Calcular fecha límite
              const ahora = new Date();
              const fechaLimite = new Date(ahora);
              fechaLimite.setDate(fechaLimite.getDate() - dias);

              // Obtener todos los productos
              const productos = await fsClient.get(
                '/productos',
                { limit: 1000 },
                connection,
              );

              // Obtener líneas de facturas desde la fecha límite
              const lineas = await fsClient.get(
                '/lineafacturaclientes',
                { limit: 1000 },
                connection,
              );

              // Obtener referencias vendidas
              const productosVendidos = new Set<string>();
              for (const linea of lineas as any[]) {
                productosVendidos.add(linea.referencia);
              }

              // Productos no vendidos
              const productosNoVendidos: ProductoNoVendido[] = (productos as any[])
                .filter((prod) => !productosVendidos.has(prod.referencia))
                .map((prod) => ({
                  referencia: prod.referencia,
                  descripcion: prod.descripcion,
                  familia: prod.familia,
                  codfamilia: prod.codfamilia,
                }));

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(productosNoVendidos, null, 2) }],
              };
            }

            case 'get_facturas_cliente_por_cifnif': {
              const connection = input.connection as string;
              const cifnif = input.cifnif as string;

              // Buscar cliente por CIF/NIF
              const clientes = await fsClient.get(
                '/clientes',
                { cifnif, limit: 100 },
                connection,
              );

              if ((clientes as any[]).length === 0) {
                return {
                  content: [
                    { type: 'text' as const, text: JSON.stringify({ error: `No se encontró cliente con CIF/NIF: ${cifnif}` }, null, 2) },
                  ],
                };
              }

              const cliente = (clientes as any[])[0];
              const codcliente = cliente.codcliente;

              // Obtener facturas del cliente
              const facturas = await fsClient.get(
                '/facturaclientes',
                { codcliente, limit: 1000 },
                connection,
              );

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(facturas, null, 2) }],
              };
            }

            case 'get_facturas_con_errores': {
              const connection = input.connection as string;

              // Obtener todas las facturas
              const facturas = await fsClient.get(
                '/facturaclientes',
                { limit: 1000 },
                connection,
              );

              const facturasConErrores: FacturaConError[] = [];

              for (const factura of facturas as any[]) {
                const errores: string[] = [];
                const detalles: Record<string, unknown> = {};

                // Total 0
                if ((factura.total || 0) === 0) {
                  errores.push('Total cero');
                  detalles.total = factura.total;
                }

                // Anulada pero con pagos
                if (factura.anulada && factura.pagado) {
                  errores.push('Factura anulada pero marcada como pagada');
                  detalles.anulada = factura.anulada;
                  detalles.pagado = factura.pagado;
                }

                // IVA negativo
                if ((factura.iva || 0) < 0) {
                  errores.push('IVA negativo');
                  detalles.iva = factura.iva;
                }

                // Neto mayor que total (sin IVA)
                if ((factura.neto || 0) > (factura.total || 0)) {
                  errores.push('Neto mayor que total');
                  detalles.neto = factura.neto;
                  detalles.total = factura.total;
                }

                if (errores.length > 0) {
                  facturasConErrores.push({
                    idfactura: factura.idfactura,
                    numero: factura.numero,
                    fecha: factura.fecha,
                    codcliente: factura.codcliente,
                    error: errores.join('; '),
                    detalles,
                  });
                }
              }

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(facturasConErrores, null, 2) }],
              };
            }

            case 'get_tiempo_beneficios_cliente': {
              const connection = input.connection as string;
              const codcliente = input.codcliente as string;
              const codejercicio = input.codejercicio as string | undefined;

              // Obtener facturas del cliente
              const params: Record<string, unknown> = { codcliente, limit: 1000 };
              if (codejercicio) params.codejercicio = codejercicio;

              const facturas = await fsClient.get(
                '/facturaclientes',
                params,
                connection,
              );

              // Agrupar por mes
              const mesesMap: Record<string, EvolucionMensual> = {};

              for (const factura of facturas as any[]) {
                const fecha = new Date(factura.fecha);
                const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

                if (!mesesMap[mes]) {
                  mesesMap[mes] = {
                    mes,
                    neto: 0,
                    iva: 0,
                    total: 0,
                  };
                }

                mesesMap[mes].neto += factura.neto || 0;
                mesesMap[mes].iva += factura.iva || 0;
                mesesMap[mes].total += factura.total || 0;
              }

              const evolucion = Object.values(mesesMap).sort((a, b) => a.mes.localeCompare(b.mes));

              return {
                content: [
                  {
                    type: 'text' as const,
                    text: JSON.stringify({ codcliente, datos: evolucion }, null, 2),
                  },
                ],
              };
            }

            case 'get_tiempo_beneficios_todos_clientes': {
              const connection = input.connection as string;
              const codejercicio = input.codejercicio as string | undefined;

              // Obtener todas las facturas
              const params: Record<string, unknown> = { limit: 1000 };
              if (codejercicio) params.codejercicio = codejercicio;

              const facturas = await fsClient.get(
                '/facturaclientes',
                params,
                connection,
              );

              // Agrupar por mes
              const mesesMap: Record<string, EvolucionNegocio> = {};

              for (const factura of facturas as any[]) {
                const fecha = new Date(factura.fecha);
                const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

                if (!mesesMap[mes]) {
                  mesesMap[mes] = {
                    periodo: mes,
                    neto: 0,
                    iva: 0,
                    total: 0,
                    numeroFacturas: 0,
                  };
                }

                mesesMap[mes].neto += factura.neto || 0;
                mesesMap[mes].iva += factura.iva || 0;
                mesesMap[mes].total += factura.total || 0;
                mesesMap[mes].numeroFacturas += 1;
              }

              const evolucion = Object.values(mesesMap).sort((a, b) => a.periodo.localeCompare(b.periodo));

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(evolucion, null, 2) }],
              };
            }

            case 'exportar_factura_cliente': {
              const connection = input.connection as string;
              const idfactura = input.idfactura as number;

              // Obtener cabecera de factura
              const facturas = await fsClient.get(
                '/facturaclientes',
                { idfactura, limit: 1 },
                connection,
              );

              if ((facturas as any[]).length === 0) {
                return {
                  content: [
                    { type: 'text' as const, text: JSON.stringify({ error: `No se encontró factura con ID: ${idfactura}` }, null, 2) },
                  ],
                };
              }

              const factura = (facturas as any[])[0];

              // Obtener líneas de factura
              const lineas = await fsClient.get(
                '/lineafacturaclientes',
                { idfactura, limit: 1000 },
                connection,
              );

              const facturaCompleta: FacturaData = {
                idfactura: factura.idfactura,
                numero: factura.numero,
                fecha: factura.fecha,
                codcliente: factura.codcliente,
                nombrecliente: factura.nombrecliente,
                cifnif: factura.cifnif,
                neto: factura.neto,
                iva: factura.iva,
                total: factura.total,
                pagado: factura.pagado,
                anulada: factura.anulada,
                lineas: (lineas as any[]).map((linea) => ({
                  idlinea: linea.idlinea,
                  referencia: linea.referencia,
                  descripcion: linea.descripcion,
                  cantidad: linea.cantidad,
                  pvpunitario: linea.pvpunitario,
                  pvptotal: linea.pvptotal,
                })),
              };

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(facturaCompleta, null, 2) }],
              };
            }

            case 'get_mi_recurso': {
              const connection = input.connection as string;
              const recurso = input.recurso as string;
              const paramsStr = (input.params as string) || '{}';

              // Parsear parámetros JSON
              let parsedParams: Record<string, unknown> = {};
              try {
                parsedParams = JSON.parse(paramsStr);
              } catch {
                return {
                  content: [
                    { type: 'text' as const, text: JSON.stringify({ error: 'Parámetros JSON inválidos' }, null, 2) },
                  ],
                };
              }

              const result = await fsClient.get(
                `/${recurso}`,
                parsedParams,
                connection,
              );

              return {
                content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
              };
            }

      default:
        return null;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        { type: 'text' as const, text: JSON.stringify({ error: errorMessage }, null, 2) },
      ],
      isError: true,
    };
  }
}
