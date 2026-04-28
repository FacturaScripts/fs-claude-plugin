/**
 * KPIs avanzados de FacturaScripts.
 *
 * Cada KPI es una tool MCP autosuficiente: recibe la conexión + parámetros y
 * devuelve datos ya agregados. Todos usan `fetchAllPaginated` para garantizar
 * que ven el universo completo de datos sin truncamiento.
 *
 * Las definiciones de negocio que aplican van comentadas en cada handler.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fetchAllPaginated } from '../../utils/paginate.js';

// ============================================================================
// Helpers comunes
// ============================================================================

const MS_DIA = 1000 * 60 * 60 * 24;

function diasEntre(desde: Date, hasta: Date): number {
    return Math.floor((hasta.getTime() - desde.getTime()) / MS_DIA);
}

function mesISO(fecha: Date): string {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
}

function porcentaje(parte: number, total: number): number {
    return total > 0 ? (parte / total) * 100 : 0;
}

type ToolResult = { content: [{ type: 'text'; text: string }]; isError?: boolean };

function jsonResponse(payload: unknown): ToolResult {
    return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] };
}

function errorResponse(message: string): ToolResult {
    return { content: [{ type: 'text', text: JSON.stringify({ error: message }, null, 2) }] };
}

interface AgregadoMonetario {
    totalFacturado: number;
    totalCoste: number;
    totalBeneficio: number;
    margenPorcentaje: number;
    numeroFacturas: number;
}

function nuevoAgregadoMonetario(): AgregadoMonetario {
    return {
        totalFacturado: 0,
        totalCoste: 0,
        totalBeneficio: 0,
        margenPorcentaje: 0,
        numeroFacturas: 0,
    };
}

function acumularFactura(agg: AgregadoMonetario, factura: any): void {
    agg.totalFacturado += factura.total || 0;
    agg.totalCoste += factura.totalcoste || 0;
    agg.totalBeneficio += factura.totalbeneficio || 0;
    agg.numeroFacturas += 1;
}

function calcularMargenes(agregados: { margenPorcentaje: number; totalBeneficio: number; totalFacturado: number }[]): void {
    for (const agg of agregados) {
        agg.margenPorcentaje = porcentaje(agg.totalBeneficio, agg.totalFacturado);
    }
}

// ============================================================================
// Definiciones de tools (schemas MCP)
// ============================================================================

export const extendedAnalyticsTools: Tool[] = [
    // ---- VENTAS ----
    {
        name: 'get_ventas_por_agente',
        description: 'Ventas agrupadas por agente comercial: total facturado, coste, beneficio, margen % y nº facturas.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_ventas_por_serie',
        description: 'Ventas agrupadas por serie de documento (codserie): total, beneficio, margen % y nº facturas.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_ventas_por_almacen',
        description: 'Ventas agrupadas por almacén: total facturado, beneficio, margen % y nº facturas.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_ventas_por_forma_pago',
        description: 'Ventas agrupadas por forma de pago: total, beneficio, margen % y nº facturas.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_ventas_por_familia',
        description: 'Ventas agrupadas por familia de producto (codfamilia). Cruza líneas de factura con productos.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_ventas_por_fabricante',
        description: 'Ventas agrupadas por fabricante (codfabricante). Cruza líneas de factura con productos.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_comparativa_ventas_periodos',
        description: 'Compara ventas entre dos rangos de fechas (actual vs anterior) y calcula crecimiento porcentual.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                fecha_inicio_actual: { type: 'string', description: 'Fecha inicio del periodo actual (YYYY-MM-DD)' },
                fecha_fin_actual: { type: 'string', description: 'Fecha fin del periodo actual (YYYY-MM-DD)' },
                fecha_inicio_anterior: { type: 'string', description: 'Fecha inicio del periodo anterior (YYYY-MM-DD)' },
                fecha_fin_anterior: { type: 'string', description: 'Fecha fin del periodo anterior (YYYY-MM-DD)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['fecha_inicio_actual', 'fecha_fin_actual', 'fecha_inicio_anterior', 'fecha_fin_anterior', 'connection'],
        },
    },
    {
        name: 'get_clientes_top_margen',
        description: 'Top N clientes ordenados por beneficio total (totalbeneficio) en lugar de por facturación.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                limit: { type: 'number', description: 'Número de clientes a retornar (default: 10)' },
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_productos_top_margen',
        description: 'Top N productos por margen absoluto y por margen porcentual (calculado desde líneas de factura).',
        inputSchema: {
            type: 'object' as const,
            properties: {
                limit: { type: 'number', description: 'Número de productos a retornar (default: 10)' },
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },

    // ---- PIPELINE / CONVERSIÓN ----
    {
        name: 'get_funnel_ventas',
        description: 'Funnel de ventas: número e importe acumulado de presupuestos, pedidos, albaranes y facturas en un rango de fechas.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                fecha_inicio: { type: 'string', description: 'Fecha inicio del rango (YYYY-MM-DD, opcional)' },
                fecha_fin: { type: 'string', description: 'Fecha fin del rango (YYYY-MM-DD, opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_presupuestos_pendientes',
        description: 'Presupuestos editables (no convertidos), agrupados por agente. Marca los vencidos según finoferta.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_pedidos_pendientes_servir',
        description: 'Pedidos de cliente editables (no convertidos a albarán/factura). Importe pendiente y antigüedad.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_albaranes_pendientes_facturar',
        description: 'Albaranes de cliente editables (entregados pero no facturados). Posible revenue leak.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },

    // ---- COMPRAS ----
    {
        name: 'get_top_proveedores_compras',
        description: 'Top N proveedores por importe acumulado de facturas de compra.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                limit: { type: 'number', description: 'Número de proveedores a retornar (default: 10)' },
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_compras_por_familia',
        description: 'Compras agrupadas por familia de producto. Cruza líneas de factura de proveedor con productos.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_pagos_pendientes_proveedor',
        description: 'Recibos a proveedor vencidos no pagados. Espejo de get_clientes_morosos pero del lado de compras.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_evolucion_compras_mensual',
        description: 'Evolución mensual de compras: neto, IVA, total y nº facturas por mes.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },

    // ---- TESORERÍA ----
    {
        name: 'get_aging_cobros',
        description: 'Aging de cobros: agrupa recibos cliente pendientes en buckets de antigüedad (al día, 1-30, 31-60, 61-90, 90+ días).',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_aging_pagos',
        description: 'Aging de pagos: agrupa recibos proveedor pendientes en buckets de antigüedad (al día, 1-30, 31-60, 61-90, 90+ días).',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_dso',
        description: 'Days Sales Outstanding: días promedio entre fecha de recibo y fechapago (solo recibos cobrados). Por cliente y global.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                meses: { type: 'number', description: 'Periodo a analizar en meses (default: 12)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_cash_flow_proyectado',
        description: 'Proyección de cobros y pagos pendientes en los próximos N días, agrupados por semana.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                dias: { type: 'number', description: 'Horizonte de proyección en días (default: 60)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },

    // ---- STOCK ----
    {
        name: 'get_valoracion_inventario',
        description: 'Valoración del inventario: cantidad × coste por almacén. Coste tomado de la variante por defecto del producto.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codalmacen: { type: 'string', description: 'Filtra por almacén (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_productos_sobrestock',
        description: 'Productos con cantidad > stockmax (exceso de inventario). Útil para ajustar política de reposición.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codalmacen: { type: 'string', description: 'Filtra por almacén (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_rotacion_stock',
        description: 'Rotación de stock por producto: ventas (cantidad) en N días vs stock actual. Días estimados de cobertura.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                dias: { type: 'number', description: 'Días para calcular la velocidad de venta (default: 90)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_stock_muerto',
        description: 'Productos con stock > 0 pero sin ventas en los últimos N días.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                dias: { type: 'number', description: 'Días sin ventas para considerar stock muerto (default: 180)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },

    // ---- CLIENTES Y AUDITORÍA ----
    {
        name: 'get_clientes_lifetime_value',
        description: 'Customer Lifetime Value por cliente: total facturado, beneficio, ticket medio, primera/última compra y días activo.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                limit: { type: 'number', description: 'Número de clientes a retornar (default: 50)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_clientes_riesgo_credito',
        description: 'Clientes ordenados por % de utilización del crédito (riesgoalcanzado / riesgomax). Marca los que superan el límite.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
    {
        name: 'get_clientes_nuevos_vs_recurrentes',
        description: 'Segmenta facturación de un periodo entre clientes nuevos (primera compra dentro del periodo) y recurrentes.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                fecha_inicio: { type: 'string', description: 'Fecha inicio del periodo (YYYY-MM-DD)' },
                fecha_fin: { type: 'string', description: 'Fecha fin del periodo (YYYY-MM-DD)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['fecha_inicio', 'fecha_fin', 'connection'],
        },
    },
    {
        name: 'get_facturas_margen_negativo',
        description: 'Facturas vendidas por debajo de coste (totalbeneficio < 0). Auditoría de pricing.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                codejercicio: { type: 'string', description: 'Filtra por ejercicio (opcional)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },

    // ---- DASHBOARD ----
    {
        name: 'get_dashboard_resumen',
        description: 'Resumen ejecutivo para dashboard: facturación del periodo, beneficio, margen %, cobros pendientes, pagos pendientes, ticket medio, nº clientes activos, nº facturas y comparativa vs periodo anterior.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                dias: { type: 'number', description: 'Periodo a analizar en días, contando hacia atrás desde hoy (default: 30)' },
                connection: { type: 'string', description: 'Clave de conexión' },
            },
            required: ['connection'],
        },
    },
];

// ============================================================================
// Handlers
// ============================================================================

export async function handleExtendedAnalyticsTool(
    name: string,
    args: Record<string, unknown>
): Promise<{ content: [{ type: 'text'; text: string }]; isError?: boolean } | null> {
    const input = args;
    const connection = input.connection as string;

    try {
        switch (name) {
            // ----------------------------------------------------------------
            // VENTAS
            // ----------------------------------------------------------------

            case 'get_ventas_por_agente': {
                // Definición: agregar por codagente las facturas (filtrable por ejercicio).
                const codejercicio = input.codejercicio as string | undefined;
                const params: Record<string, unknown> = {};
                if (codejercicio) params.codejercicio = codejercicio;

                const facturas = await fetchAllPaginated<any>('/facturaclientes', params, connection);
                const map: Record<string, { codagente: string } & AgregadoMonetario> = {};

                for (const f of facturas) {
                    const cod = f.codagente || '(sin agente)';
                    if (!map[cod]) map[cod] = { codagente: cod, ...nuevoAgregadoMonetario() };
                    acumularFactura(map[cod], f);
                }

                const result = Object.values(map);
                calcularMargenes(result);
                result.sort((a, b) => b.totalFacturado - a.totalFacturado);
                return jsonResponse(result);
            }

            case 'get_ventas_por_serie': {
                // Definición: agregar por codserie las facturas.
                const codejercicio = input.codejercicio as string | undefined;
                const params: Record<string, unknown> = {};
                if (codejercicio) params.codejercicio = codejercicio;

                const facturas = await fetchAllPaginated<any>('/facturaclientes', params, connection);
                const map: Record<string, { codserie: string } & AgregadoMonetario> = {};

                for (const f of facturas) {
                    const cod = f.codserie || '(sin serie)';
                    if (!map[cod]) map[cod] = { codserie: cod, ...nuevoAgregadoMonetario() };
                    acumularFactura(map[cod], f);
                }

                const result = Object.values(map);
                calcularMargenes(result);
                result.sort((a, b) => b.totalFacturado - a.totalFacturado);
                return jsonResponse(result);
            }

            case 'get_ventas_por_almacen': {
                const codejercicio = input.codejercicio as string | undefined;
                const params: Record<string, unknown> = {};
                if (codejercicio) params.codejercicio = codejercicio;

                const facturas = await fetchAllPaginated<any>('/facturaclientes', params, connection);
                const map: Record<string, { codalmacen: string } & AgregadoMonetario> = {};

                for (const f of facturas) {
                    const cod = f.codalmacen || '(sin almacén)';
                    if (!map[cod]) map[cod] = { codalmacen: cod, ...nuevoAgregadoMonetario() };
                    acumularFactura(map[cod], f);
                }

                const result = Object.values(map);
                calcularMargenes(result);
                result.sort((a, b) => b.totalFacturado - a.totalFacturado);
                return jsonResponse(result);
            }

            case 'get_ventas_por_forma_pago': {
                const codejercicio = input.codejercicio as string | undefined;
                const params: Record<string, unknown> = {};
                if (codejercicio) params.codejercicio = codejercicio;

                const facturas = await fetchAllPaginated<any>('/facturaclientes', params, connection);
                const map: Record<string, { codpago: string } & AgregadoMonetario> = {};

                for (const f of facturas) {
                    const cod = f.codpago || '(sin forma de pago)';
                    if (!map[cod]) map[cod] = { codpago: cod, ...nuevoAgregadoMonetario() };
                    acumularFactura(map[cod], f);
                }

                const result = Object.values(map);
                calcularMargenes(result);
                result.sort((a, b) => b.totalFacturado - a.totalFacturado);
                return jsonResponse(result);
            }

            case 'get_ventas_por_familia': {
                // Definición: cruza /lineafacturaclientes con /productos para obtener codfamilia y agregar.
                // Usa coste y pvptotal de las propias líneas (snapshot del momento de la venta).
                const codejercicio = input.codejercicio as string | undefined;
                const lineaParams: Record<string, unknown> = {};
                if (codejercicio) lineaParams.codejercicio = codejercicio;

                const [lineas, productos] = await Promise.all([
                    fetchAllPaginated<any>('/lineafacturaclientes', lineaParams, connection),
                    fetchAllPaginated<any>('/productos', {}, connection),
                ]);

                const familiaPorReferencia = new Map<string, string>();
                for (const p of productos) familiaPorReferencia.set(p.referencia, p.codfamilia ?? '(sin familia)');

                const map: Record<string, {
                    codfamilia: string;
                    cantidad: number;
                    importe: number;
                    coste: number;
                    beneficio: number;
                    margenPorcentaje: number;
                }> = {};

                for (const l of lineas) {
                    const codfamilia = familiaPorReferencia.get(l.referencia) ?? '(sin familia)';
                    if (!map[codfamilia]) {
                        map[codfamilia] = {
                            codfamilia,
                            cantidad: 0,
                            importe: 0,
                            coste: 0,
                            beneficio: 0,
                            margenPorcentaje: 0,
                        };
                    }
                    const cantidad = l.cantidad || 0;
                    const importe = l.pvptotal || 0;
                    const coste = (l.coste || 0) * cantidad;
                    map[codfamilia].cantidad += cantidad;
                    map[codfamilia].importe += importe;
                    map[codfamilia].coste += coste;
                    map[codfamilia].beneficio += importe - coste;
                }

                const result = Object.values(map);
                for (const r of result) r.margenPorcentaje = porcentaje(r.beneficio, r.importe);
                result.sort((a, b) => b.importe - a.importe);
                return jsonResponse(result);
            }

            case 'get_ventas_por_fabricante': {
                // Definición: cruza /lineafacturaclientes con /productos para obtener codfabricante y agregar.
                const codejercicio = input.codejercicio as string | undefined;
                const lineaParams: Record<string, unknown> = {};
                if (codejercicio) lineaParams.codejercicio = codejercicio;

                const [lineas, productos] = await Promise.all([
                    fetchAllPaginated<any>('/lineafacturaclientes', lineaParams, connection),
                    fetchAllPaginated<any>('/productos', {}, connection),
                ]);

                const fabricantePorReferencia = new Map<string, string>();
                for (const p of productos) fabricantePorReferencia.set(p.referencia, p.codfabricante ?? '(sin fabricante)');

                const map: Record<string, {
                    codfabricante: string;
                    cantidad: number;
                    importe: number;
                    coste: number;
                    beneficio: number;
                    margenPorcentaje: number;
                }> = {};

                for (const l of lineas) {
                    const codfabricante = fabricantePorReferencia.get(l.referencia) ?? '(sin fabricante)';
                    if (!map[codfabricante]) {
                        map[codfabricante] = {
                            codfabricante,
                            cantidad: 0,
                            importe: 0,
                            coste: 0,
                            beneficio: 0,
                            margenPorcentaje: 0,
                        };
                    }
                    const cantidad = l.cantidad || 0;
                    const importe = l.pvptotal || 0;
                    const coste = (l.coste || 0) * cantidad;
                    map[codfabricante].cantidad += cantidad;
                    map[codfabricante].importe += importe;
                    map[codfabricante].coste += coste;
                    map[codfabricante].beneficio += importe - coste;
                }

                const result = Object.values(map);
                for (const r of result) r.margenPorcentaje = porcentaje(r.beneficio, r.importe);
                result.sort((a, b) => b.importe - a.importe);
                return jsonResponse(result);
            }

            case 'get_comparativa_ventas_periodos': {
                // Definición: suma facturas en cada rango y calcula crecimiento % entre ambos.
                const fia = new Date(input.fecha_inicio_actual as string);
                const ffa = new Date(input.fecha_fin_actual as string);
                const fian = new Date(input.fecha_inicio_anterior as string);
                const ffan = new Date(input.fecha_fin_anterior as string);

                const facturas = await fetchAllPaginated<any>('/facturaclientes', {}, connection);

                const actual = nuevoAgregadoMonetario();
                const anterior = nuevoAgregadoMonetario();

                for (const f of facturas) {
                    const fecha = new Date(f.fecha);
                    if (fecha >= fia && fecha <= ffa) acumularFactura(actual, f);
                    else if (fecha >= fian && fecha <= ffan) acumularFactura(anterior, f);
                }

                calcularMargenes([actual, anterior]);

                const crecimientoFacturado = anterior.totalFacturado > 0
                    ? ((actual.totalFacturado - anterior.totalFacturado) / anterior.totalFacturado) * 100
                    : 0;
                const crecimientoBeneficio = anterior.totalBeneficio > 0
                    ? ((actual.totalBeneficio - anterior.totalBeneficio) / anterior.totalBeneficio) * 100
                    : 0;

                return jsonResponse({
                    actual: { rango: { desde: input.fecha_inicio_actual, hasta: input.fecha_fin_actual }, ...actual },
                    anterior: { rango: { desde: input.fecha_inicio_anterior, hasta: input.fecha_fin_anterior }, ...anterior },
                    crecimiento: {
                        facturadoPorcentaje: crecimientoFacturado,
                        beneficioPorcentaje: crecimientoBeneficio,
                    },
                });
            }

            case 'get_clientes_top_margen': {
                // Definición: top N clientes por totalbeneficio acumulado.
                const limit = (input.limit as number) || 10;
                const codejercicio = input.codejercicio as string | undefined;
                const params: Record<string, unknown> = {};
                if (codejercicio) params.codejercicio = codejercicio;

                const facturas = await fetchAllPaginated<any>('/facturaclientes', params, connection);
                const map: Record<string, {
                    codcliente: string;
                    nombre: string;
                } & AgregadoMonetario> = {};

                for (const f of facturas) {
                    const cod = f.codcliente;
                    if (!map[cod]) {
                        map[cod] = { codcliente: cod, nombre: f.nombrecliente ?? '', ...nuevoAgregadoMonetario() };
                    }
                    acumularFactura(map[cod], f);
                }

                const result = Object.values(map);
                calcularMargenes(result);
                result.sort((a, b) => b.totalBeneficio - a.totalBeneficio);
                return jsonResponse(result.slice(0, limit));
            }

            case 'get_productos_top_margen': {
                // Definición: agrega líneas de factura por referencia y devuelve dos rankings:
                // por beneficio absoluto y por margen porcentual.
                const limit = (input.limit as number) || 10;
                const codejercicio = input.codejercicio as string | undefined;
                const params: Record<string, unknown> = {};
                if (codejercicio) params.codejercicio = codejercicio;

                const lineas = await fetchAllPaginated<any>('/lineafacturaclientes', params, connection);
                const map: Record<string, {
                    referencia: string;
                    descripcion: string;
                    cantidad: number;
                    importe: number;
                    coste: number;
                    beneficio: number;
                    margenPorcentaje: number;
                }> = {};

                for (const l of lineas) {
                    const ref = l.referencia;
                    if (!map[ref]) {
                        map[ref] = {
                            referencia: ref,
                            descripcion: l.descripcion ?? '',
                            cantidad: 0,
                            importe: 0,
                            coste: 0,
                            beneficio: 0,
                            margenPorcentaje: 0,
                        };
                    }
                    const cant = l.cantidad || 0;
                    const importe = l.pvptotal || 0;
                    const coste = (l.coste || 0) * cant;
                    map[ref].cantidad += cant;
                    map[ref].importe += importe;
                    map[ref].coste += coste;
                    map[ref].beneficio += importe - coste;
                }

                const all = Object.values(map);
                for (const p of all) p.margenPorcentaje = porcentaje(p.beneficio, p.importe);

                const topAbsoluto = [...all].sort((a, b) => b.beneficio - a.beneficio).slice(0, limit);
                // Para margen %, exigimos al menos 3 unidades vendidas para evitar ruido
                const topPorcentual = all
                    .filter(p => p.cantidad >= 3)
                    .sort((a, b) => b.margenPorcentaje - a.margenPorcentaje)
                    .slice(0, limit);

                return jsonResponse({ topPorBeneficioAbsoluto: topAbsoluto, topPorMargenPorcentual: topPorcentual });
            }

            // ----------------------------------------------------------------
            // PIPELINE / CONVERSIÓN
            // ----------------------------------------------------------------

            case 'get_funnel_ventas': {
                // Definición: cuenta presupuestos, pedidos, albaranes y facturas en un rango y suma sus totales.
                const fechaInicio = input.fecha_inicio ? new Date(input.fecha_inicio as string) : null;
                const fechaFin = input.fecha_fin ? new Date(input.fecha_fin as string) : null;

                const enRango = (f: any) => {
                    const fecha = new Date(f.fecha);
                    if (fechaInicio && fecha < fechaInicio) return false;
                    if (fechaFin && fecha > fechaFin) return false;
                    return true;
                };

                const [presupuestos, pedidos, albaranes, facturas] = await Promise.all([
                    fetchAllPaginated<any>('/presupuestoclientes', {}, connection),
                    fetchAllPaginated<any>('/pedidoclientes', {}, connection),
                    fetchAllPaginated<any>('/albaranclientes', {}, connection),
                    fetchAllPaginated<any>('/facturaclientes', {}, connection),
                ]);

                const resumen = (docs: any[]) => {
                    const filtrados = docs.filter(enRango);
                    return {
                        cantidad: filtrados.length,
                        importeTotal: filtrados.reduce((acc, d) => acc + (d.total || 0), 0),
                    };
                };

                const presup = resumen(presupuestos);
                const ped = resumen(pedidos);
                const alb = resumen(albaranes);
                const fact = resumen(facturas);

                return jsonResponse({
                    presupuestos: presup,
                    pedidos: ped,
                    albaranes: alb,
                    facturas: fact,
                    conversiones: {
                        presupuestoAPedido: porcentaje(ped.cantidad, presup.cantidad),
                        pedidoAAlbaran: porcentaje(alb.cantidad, ped.cantidad),
                        albaranAFactura: porcentaje(fact.cantidad, alb.cantidad),
                        presupuestoAFactura: porcentaje(fact.cantidad, presup.cantidad),
                    },
                });
            }

            case 'get_presupuestos_pendientes': {
                // Definición: presupuestos con `editable=true` (todavía no convertidos a documento posterior).
                // Marca los vencidos según finoferta.
                const presupuestos = await fetchAllPaginated<any>('/presupuestoclientes', { editable: true }, connection);
                const now = new Date();

                const result = presupuestos.map(p => {
                    const finoferta = p.finoferta ? new Date(p.finoferta) : null;
                    const vencido = finoferta !== null && finoferta < now;
                    return {
                        idpresupuesto: p.idpresupuesto,
                        codigo: p.codigo,
                        codcliente: p.codcliente,
                        nombrecliente: p.nombrecliente,
                        codagente: p.codagente,
                        fecha: p.fecha,
                        finoferta: p.finoferta,
                        total: p.total,
                        totalbeneficio: p.totalbeneficio,
                        vencido,
                        diasParaVencer: finoferta !== null ? diasEntre(now, finoferta) : null,
                    };
                });

                // Agrupar por agente para tener visión por comercial
                const porAgente: Record<string, { codagente: string; cantidad: number; importeTotal: number }> = {};
                for (const r of result) {
                    const cod = r.codagente || '(sin agente)';
                    if (!porAgente[cod]) porAgente[cod] = { codagente: cod, cantidad: 0, importeTotal: 0 };
                    porAgente[cod].cantidad += 1;
                    porAgente[cod].importeTotal += r.total || 0;
                }

                result.sort((a, b) => (b.total || 0) - (a.total || 0));

                return jsonResponse({
                    totalPresupuestos: result.length,
                    importeAcumulado: result.reduce((acc, r) => acc + (r.total || 0), 0),
                    vencidos: result.filter(r => r.vencido).length,
                    porAgente: Object.values(porAgente).sort((a, b) => b.importeTotal - a.importeTotal),
                    detalle: result,
                });
            }

            case 'get_pedidos_pendientes_servir': {
                // Definición: pedidos con `editable=true` (no convertidos a albarán/factura).
                const pedidos = await fetchAllPaginated<any>('/pedidoclientes', { editable: true }, connection);
                const now = new Date();

                const detalle = pedidos.map(p => ({
                    idpedido: p.idpedido,
                    codigo: p.codigo,
                    codcliente: p.codcliente,
                    nombrecliente: p.nombrecliente,
                    codagente: p.codagente,
                    fecha: p.fecha,
                    total: p.total,
                    totalbeneficio: p.totalbeneficio,
                    diasDesdeFecha: diasEntre(new Date(p.fecha), now),
                }));

                detalle.sort((a, b) => b.diasDesdeFecha - a.diasDesdeFecha);

                return jsonResponse({
                    totalPedidos: detalle.length,
                    importeAcumulado: detalle.reduce((acc, r) => acc + (r.total || 0), 0),
                    detalle,
                });
            }

            case 'get_albaranes_pendientes_facturar': {
                // Definición: albaranes con `editable=true` (entregados pero no facturados).
                // Es revenue leak potencial — mercancía entregada que aún no genera factura.
                const albaranes = await fetchAllPaginated<any>('/albaranclientes', { editable: true }, connection);
                const now = new Date();

                const detalle = albaranes.map(a => ({
                    idalbaran: a.idalbaran,
                    codigo: a.codigo,
                    codcliente: a.codcliente,
                    nombrecliente: a.nombrecliente,
                    codagente: a.codagente,
                    fecha: a.fecha,
                    total: a.total,
                    diasDesdeEntrega: diasEntre(new Date(a.fecha), now),
                }));

                detalle.sort((a, b) => b.diasDesdeEntrega - a.diasDesdeEntrega);

                return jsonResponse({
                    totalAlbaranes: detalle.length,
                    importePendienteFacturar: detalle.reduce((acc, r) => acc + (r.total || 0), 0),
                    detalle,
                });
            }

            // ----------------------------------------------------------------
            // COMPRAS
            // ----------------------------------------------------------------

            case 'get_top_proveedores_compras': {
                // Definición: top N proveedores por suma de factura_proveedor.total.
                const limit = (input.limit as number) || 10;
                const codejercicio = input.codejercicio as string | undefined;
                const params: Record<string, unknown> = {};
                if (codejercicio) params.codejercicio = codejercicio;

                const facturas = await fetchAllPaginated<any>('/facturaproveedores', params, connection);
                const map: Record<string, {
                    codproveedor: string;
                    nombre: string;
                    totalGastado: number;
                    numeroFacturas: number;
                }> = {};

                for (const f of facturas) {
                    const cod = f.codproveedor;
                    if (!map[cod]) map[cod] = { codproveedor: cod, nombre: f.nombre ?? '', totalGastado: 0, numeroFacturas: 0 };
                    map[cod].totalGastado += f.total || 0;
                    map[cod].numeroFacturas += 1;
                }

                const result = Object.values(map).sort((a, b) => b.totalGastado - a.totalGastado).slice(0, limit);
                return jsonResponse(result);
            }

            case 'get_compras_por_familia': {
                // Definición: cruza /lineafacturaproveedores con /productos para agregar gasto por familia.
                const codejercicio = input.codejercicio as string | undefined;
                const lineaParams: Record<string, unknown> = {};
                if (codejercicio) lineaParams.codejercicio = codejercicio;

                const [lineas, productos] = await Promise.all([
                    fetchAllPaginated<any>('/lineafacturaproveedores', lineaParams, connection),
                    fetchAllPaginated<any>('/productos', {}, connection),
                ]);

                const familiaPorReferencia = new Map<string, string>();
                for (const p of productos) familiaPorReferencia.set(p.referencia, p.codfamilia ?? '(sin familia)');

                const map: Record<string, { codfamilia: string; cantidad: number; gasto: number }> = {};

                for (const l of lineas) {
                    const codfamilia = familiaPorReferencia.get(l.referencia) ?? '(sin familia)';
                    if (!map[codfamilia]) map[codfamilia] = { codfamilia, cantidad: 0, gasto: 0 };
                    map[codfamilia].cantidad += l.cantidad || 0;
                    map[codfamilia].gasto += l.pvptotal || 0;
                }

                const result = Object.values(map).sort((a, b) => b.gasto - a.gasto);
                return jsonResponse(result);
            }

            case 'get_pagos_pendientes_proveedor': {
                // Definición: recibos a proveedor con pagado=false y vencimiento<now.
                // Espejo de get_clientes_morosos, enriquecido con datos del proveedor.
                const [recibos, proveedores] = await Promise.all([
                    fetchAllPaginated<any>('/reciboproveedores', { pagado: false }, connection),
                    fetchAllPaginated<any>('/proveedores', {}, connection),
                ]);

                const proveedorPorCodigo = new Map<string, any>();
                for (const p of proveedores) proveedorPorCodigo.set(p.codproveedor, p);

                const now = new Date();
                const map: Record<string, {
                    codproveedor: string;
                    nombre: string;
                    email: string;
                    totalDeuda: number;
                    recibos: Array<{ idrecibo: number; fecha: string; vencimiento: string; importe: number }>;
                }> = {};

                for (const recibo of recibos) {
                    const vence = recibo.vencimiento ? new Date(recibo.vencimiento) : null;
                    const estaVencido = recibo.vencido === true || (vence !== null && vence < now);
                    if (!estaVencido) continue;

                    const cod = recibo.codproveedor;
                    if (!map[cod]) {
                        const p = proveedorPorCodigo.get(cod);
                        map[cod] = {
                            codproveedor: cod,
                            nombre: p?.nombre ?? '',
                            email: p?.email ?? '',
                            totalDeuda: 0,
                            recibos: [],
                        };
                    }
                    map[cod].totalDeuda += recibo.importe || 0;
                    map[cod].recibos.push({
                        idrecibo: recibo.idrecibo,
                        fecha: recibo.fecha,
                        vencimiento: recibo.vencimiento,
                        importe: recibo.importe,
                    });
                }

                const result = Object.values(map).sort((a, b) => b.totalDeuda - a.totalDeuda);
                return jsonResponse(result);
            }

            case 'get_evolucion_compras_mensual': {
                // Definición: agrupa facturas de proveedor por mes (YYYY-MM).
                const codejercicio = input.codejercicio as string | undefined;
                const params: Record<string, unknown> = {};
                if (codejercicio) params.codejercicio = codejercicio;

                const facturas = await fetchAllPaginated<any>('/facturaproveedores', params, connection);
                const map: Record<string, {
                    mes: string;
                    neto: number;
                    iva: number;
                    total: number;
                    numeroFacturas: number;
                }> = {};

                for (const f of facturas) {
                    const mes = mesISO(new Date(f.fecha));
                    if (!map[mes]) map[mes] = { mes, neto: 0, iva: 0, total: 0, numeroFacturas: 0 };
                    map[mes].neto += f.neto || 0;
                    map[mes].iva += f.totaliva || 0;
                    map[mes].total += f.total || 0;
                    map[mes].numeroFacturas += 1;
                }

                const result = Object.values(map).sort((a, b) => a.mes.localeCompare(b.mes));
                return jsonResponse(result);
            }

            // ----------------------------------------------------------------
            // TESORERÍA
            // ----------------------------------------------------------------

            case 'get_aging_cobros': {
                // Definición: clasifica recibos cliente pendientes por días de antigüedad de su vencimiento.
                const recibos = await fetchAllPaginated<any>('/reciboclientes', { pagado: false }, connection);
                const now = new Date();

                const buckets = {
                    alDia: { rango: 'No vencido', cantidad: 0, importe: 0 },
                    de1a30: { rango: '1-30 días', cantidad: 0, importe: 0 },
                    de31a60: { rango: '31-60 días', cantidad: 0, importe: 0 },
                    de61a90: { rango: '61-90 días', cantidad: 0, importe: 0 },
                    masDe90: { rango: '90+ días', cantidad: 0, importe: 0 },
                };

                for (const r of recibos) {
                    if (!r.vencimiento) continue;
                    const vence = new Date(r.vencimiento);
                    const dias = diasEntre(vence, now);
                    const importe = r.importe || 0;

                    if (dias <= 0) { buckets.alDia.cantidad++; buckets.alDia.importe += importe; }
                    else if (dias <= 30) { buckets.de1a30.cantidad++; buckets.de1a30.importe += importe; }
                    else if (dias <= 60) { buckets.de31a60.cantidad++; buckets.de31a60.importe += importe; }
                    else if (dias <= 90) { buckets.de61a90.cantidad++; buckets.de61a90.importe += importe; }
                    else { buckets.masDe90.cantidad++; buckets.masDe90.importe += importe; }
                }

                const totalImporte = Object.values(buckets).reduce((acc, b) => acc + b.importe, 0);
                return jsonResponse({ totalImportePendiente: totalImporte, buckets });
            }

            case 'get_aging_pagos': {
                // Definición: clasifica recibos a proveedor pendientes por días de antigüedad de su vencimiento.
                const recibos = await fetchAllPaginated<any>('/reciboproveedores', { pagado: false }, connection);
                const now = new Date();

                const buckets = {
                    alDia: { rango: 'No vencido', cantidad: 0, importe: 0 },
                    de1a30: { rango: '1-30 días', cantidad: 0, importe: 0 },
                    de31a60: { rango: '31-60 días', cantidad: 0, importe: 0 },
                    de61a90: { rango: '61-90 días', cantidad: 0, importe: 0 },
                    masDe90: { rango: '90+ días', cantidad: 0, importe: 0 },
                };

                for (const r of recibos) {
                    if (!r.vencimiento) continue;
                    const vence = new Date(r.vencimiento);
                    const dias = diasEntre(vence, now);
                    const importe = r.importe || 0;

                    if (dias <= 0) { buckets.alDia.cantidad++; buckets.alDia.importe += importe; }
                    else if (dias <= 30) { buckets.de1a30.cantidad++; buckets.de1a30.importe += importe; }
                    else if (dias <= 60) { buckets.de31a60.cantidad++; buckets.de31a60.importe += importe; }
                    else if (dias <= 90) { buckets.de61a90.cantidad++; buckets.de61a90.importe += importe; }
                    else { buckets.masDe90.cantidad++; buckets.masDe90.importe += importe; }
                }

                const totalImporte = Object.values(buckets).reduce((acc, b) => acc + b.importe, 0);
                return jsonResponse({ totalImportePendiente: totalImporte, buckets });
            }

            case 'get_dso': {
                // Definición: Days Sales Outstanding = media de (fechapago - fecha) sobre recibos cobrados
                // en los últimos N meses. Calculado global y por cliente.
                const meses = (input.meses as number) || 12;
                const fechaCorte = new Date();
                fechaCorte.setMonth(fechaCorte.getMonth() - meses);

                const recibos = await fetchAllPaginated<any>('/reciboclientes', { pagado: true }, connection);

                let totalDias = 0;
                let totalRecibos = 0;
                const porCliente: Record<string, { codcliente: string; sumaDias: number; numero: number; dsoPromedio: number }> = {};

                for (const r of recibos) {
                    if (!r.fecha || !r.fechapago) continue;
                    const emit = new Date(r.fecha);
                    if (emit < fechaCorte) continue;
                    const pago = new Date(r.fechapago);
                    const dias = diasEntre(emit, pago);
                    if (dias < 0) continue;

                    totalDias += dias;
                    totalRecibos += 1;

                    const cod = r.codcliente;
                    if (!porCliente[cod]) porCliente[cod] = { codcliente: cod, sumaDias: 0, numero: 0, dsoPromedio: 0 };
                    porCliente[cod].sumaDias += dias;
                    porCliente[cod].numero += 1;
                }

                const dsoGlobal = totalRecibos > 0 ? totalDias / totalRecibos : 0;
                const detalleClientes = Object.values(porCliente);
                for (const c of detalleClientes) c.dsoPromedio = c.numero > 0 ? c.sumaDias / c.numero : 0;
                detalleClientes.sort((a, b) => b.dsoPromedio - a.dsoPromedio);

                return jsonResponse({
                    periodoMeses: meses,
                    dsoGlobalDias: dsoGlobal,
                    recibosAnalizados: totalRecibos,
                    porCliente: detalleClientes,
                });
            }

            case 'get_cash_flow_proyectado': {
                // Definición: para los próximos N días, suma cobros (recibo_cliente pendiente) y pagos
                // (recibo_proveedor pendiente) cuyo vencimiento cae en cada semana.
                const dias = (input.dias as number) || 60;
                const now = new Date();
                const horizonte = new Date(now);
                horizonte.setDate(horizonte.getDate() + dias);

                const [cobrosPendientes, pagosPendientes] = await Promise.all([
                    fetchAllPaginated<any>('/reciboclientes', { pagado: false }, connection),
                    fetchAllPaginated<any>('/reciboproveedores', { pagado: false }, connection),
                ]);

                const semanas: Record<string, { semana: string; cobros: number; pagos: number; neto: number }> = {};
                const claveSemana = (fecha: Date) => {
                    const lunes = new Date(fecha);
                    const offset = (lunes.getDay() + 6) % 7;
                    lunes.setDate(lunes.getDate() - offset);
                    return lunes.toISOString().slice(0, 10);
                };

                for (const r of cobrosPendientes) {
                    if (!r.vencimiento) continue;
                    const vence = new Date(r.vencimiento);
                    if (vence < now || vence > horizonte) continue;
                    const k = claveSemana(vence);
                    if (!semanas[k]) semanas[k] = { semana: k, cobros: 0, pagos: 0, neto: 0 };
                    semanas[k].cobros += r.importe || 0;
                }
                for (const r of pagosPendientes) {
                    if (!r.vencimiento) continue;
                    const vence = new Date(r.vencimiento);
                    if (vence < now || vence > horizonte) continue;
                    const k = claveSemana(vence);
                    if (!semanas[k]) semanas[k] = { semana: k, cobros: 0, pagos: 0, neto: 0 };
                    semanas[k].pagos += r.importe || 0;
                }

                const proyeccion = Object.values(semanas);
                for (const s of proyeccion) s.neto = s.cobros - s.pagos;
                proyeccion.sort((a, b) => a.semana.localeCompare(b.semana));

                const totalCobros = proyeccion.reduce((acc, s) => acc + s.cobros, 0);
                const totalPagos = proyeccion.reduce((acc, s) => acc + s.pagos, 0);

                return jsonResponse({
                    horizonteDias: dias,
                    totalCobrosProyectados: totalCobros,
                    totalPagosProyectados: totalPagos,
                    netoProyectado: totalCobros - totalPagos,
                    proyeccionSemanal: proyeccion,
                });
            }

            // ----------------------------------------------------------------
            // STOCK
            // ----------------------------------------------------------------

            case 'get_valoracion_inventario': {
                // Definición: para cada registro de stock, multiplica cantidad × coste de la variante por defecto del producto.
                // Las variantes son la fuente del coste (los productos no tienen coste directo).
                const codalmacen = input.codalmacen as string | undefined;
                const stockParams: Record<string, unknown> = {};
                if (codalmacen) stockParams.codalmacen = codalmacen;

                const [stocks, variantes, productos] = await Promise.all([
                    fetchAllPaginated<any>('/stocks', stockParams, connection),
                    fetchAllPaginated<any>('/variantes', {}, connection),
                    fetchAllPaginated<any>('/productos', {}, connection),
                ]);

                // Coste por referencia (primera variante encontrada para esa referencia)
                const costePorReferencia = new Map<string, number>();
                for (const v of variantes) {
                    if (v.referencia && !costePorReferencia.has(v.referencia)) {
                        costePorReferencia.set(v.referencia, v.coste || 0);
                    }
                }
                const familiaPorReferencia = new Map<string, string>();
                for (const p of productos) familiaPorReferencia.set(p.referencia, p.codfamilia ?? '(sin familia)');

                const porAlmacen: Record<string, { codalmacen: string; cantidadTotal: number; valorCoste: number }> = {};
                const porFamilia: Record<string, { codfamilia: string; cantidadTotal: number; valorCoste: number }> = {};
                let totalCantidad = 0;
                let totalValor = 0;

                for (const s of stocks) {
                    const coste = costePorReferencia.get(s.referencia) || 0;
                    const cantidad = s.cantidad || 0;
                    const valor = cantidad * coste;
                    totalCantidad += cantidad;
                    totalValor += valor;

                    const alm = s.codalmacen || '(sin almacén)';
                    if (!porAlmacen[alm]) porAlmacen[alm] = { codalmacen: alm, cantidadTotal: 0, valorCoste: 0 };
                    porAlmacen[alm].cantidadTotal += cantidad;
                    porAlmacen[alm].valorCoste += valor;

                    const fam = familiaPorReferencia.get(s.referencia) ?? '(sin familia)';
                    if (!porFamilia[fam]) porFamilia[fam] = { codfamilia: fam, cantidadTotal: 0, valorCoste: 0 };
                    porFamilia[fam].cantidadTotal += cantidad;
                    porFamilia[fam].valorCoste += valor;
                }

                return jsonResponse({
                    totalCantidad,
                    valorTotalCoste: totalValor,
                    porAlmacen: Object.values(porAlmacen).sort((a, b) => b.valorCoste - a.valorCoste),
                    porFamilia: Object.values(porFamilia).sort((a, b) => b.valorCoste - a.valorCoste),
                });
            }

            case 'get_productos_sobrestock': {
                // Definición: registros de /stocks con cantidad > stockmax (y stockmax > 0).
                const codalmacen = input.codalmacen as string | undefined;
                const params: Record<string, unknown> = {};
                if (codalmacen) params.codalmacen = codalmacen;

                const stocks = await fetchAllPaginated<any>('/stocks', params, connection);
                const result = stocks
                    .filter(s => (s.stockmax || 0) > 0 && (s.cantidad || 0) > (s.stockmax || 0))
                    .map(s => ({
                        referencia: s.referencia,
                        codalmacen: s.codalmacen,
                        cantidad: s.cantidad,
                        stockmax: s.stockmax,
                        excedente: (s.cantidad || 0) - (s.stockmax || 0),
                    }))
                    .sort((a, b) => b.excedente - a.excedente);

                return jsonResponse(result);
            }

            case 'get_rotacion_stock': {
                // Definición: para cada producto, ventas (cantidad acumulada en líneas de factura) en N días
                // dividida por stock actual. Devuelve días estimados de cobertura.
                const dias = (input.dias as number) || 90;
                const fechaLimite = new Date();
                fechaLimite.setDate(fechaLimite.getDate() - dias);

                const [stocks, lineas, facturas] = await Promise.all([
                    fetchAllPaginated<any>('/stocks', {}, connection),
                    fetchAllPaginated<any>('/lineafacturaclientes', {}, connection),
                    fetchAllPaginated<any>('/facturaclientes', {}, connection),
                ]);

                const facturasEnRango = new Set<number>();
                for (const f of facturas) {
                    if (new Date(f.fecha) >= fechaLimite) facturasEnRango.add(f.idfactura);
                }

                const ventasPorReferencia = new Map<string, number>();
                for (const l of lineas) {
                    if (!facturasEnRango.has(l.idfactura)) continue;
                    ventasPorReferencia.set(l.referencia, (ventasPorReferencia.get(l.referencia) || 0) + (l.cantidad || 0));
                }

                const stockPorReferencia: Record<string, number> = {};
                for (const s of stocks) {
                    stockPorReferencia[s.referencia] = (stockPorReferencia[s.referencia] || 0) + (s.cantidad || 0);
                }

                const result = Object.entries(stockPorReferencia).map(([referencia, stockActual]) => {
                    const ventasPeriodo = ventasPorReferencia.get(referencia) || 0;
                    const ventasDiarias = ventasPeriodo / dias;
                    const diasCobertura = ventasDiarias > 0 ? stockActual / ventasDiarias : null;
                    return {
                        referencia,
                        stockActual,
                        ventasEnPeriodo: ventasPeriodo,
                        ventasDiariasPromedio: ventasDiarias,
                        diasCoberturaEstimados: diasCobertura,
                    };
                });

                result.sort((a, b) => {
                    // Productos con stock pero sin ventas (cobertura infinita) primero
                    if (a.diasCoberturaEstimados === null && b.diasCoberturaEstimados !== null) return -1;
                    if (b.diasCoberturaEstimados === null && a.diasCoberturaEstimados !== null) return 1;
                    return (b.diasCoberturaEstimados || 0) - (a.diasCoberturaEstimados || 0);
                });

                return jsonResponse({
                    periodoDias: dias,
                    productos: result,
                });
            }

            case 'get_stock_muerto': {
                // Definición: productos con stock > 0 cuya referencia no aparece en ninguna línea de factura
                // dentro de los últimos N días.
                const dias = (input.dias as number) || 180;
                const fechaLimite = new Date();
                fechaLimite.setDate(fechaLimite.getDate() - dias);

                const [stocks, lineas, facturas, productos] = await Promise.all([
                    fetchAllPaginated<any>('/stocks', {}, connection),
                    fetchAllPaginated<any>('/lineafacturaclientes', {}, connection),
                    fetchAllPaginated<any>('/facturaclientes', {}, connection),
                    fetchAllPaginated<any>('/productos', {}, connection),
                ]);

                const facturasEnRango = new Set<number>();
                for (const f of facturas) {
                    if (new Date(f.fecha) >= fechaLimite) facturasEnRango.add(f.idfactura);
                }

                const referenciasVendidas = new Set<string>();
                for (const l of lineas) {
                    if (facturasEnRango.has(l.idfactura)) referenciasVendidas.add(l.referencia);
                }

                const productoPorReferencia = new Map<string, any>();
                for (const p of productos) productoPorReferencia.set(p.referencia, p);

                const stockPorReferencia: Record<string, number> = {};
                for (const s of stocks) {
                    stockPorReferencia[s.referencia] = (stockPorReferencia[s.referencia] || 0) + (s.cantidad || 0);
                }

                const result = Object.entries(stockPorReferencia)
                    .filter(([ref, stock]) => stock > 0 && !referenciasVendidas.has(ref))
                    .map(([referencia, stockActual]) => {
                        const p = productoPorReferencia.get(referencia);
                        return {
                            referencia,
                            descripcion: p?.descripcion ?? '',
                            codfamilia: p?.codfamilia ?? '',
                            codfabricante: p?.codfabricante ?? '',
                            stockActual,
                        };
                    })
                    .sort((a, b) => b.stockActual - a.stockActual);

                return jsonResponse(result);
            }

            // ----------------------------------------------------------------
            // CLIENTES Y AUDITORÍA
            // ----------------------------------------------------------------

            case 'get_clientes_lifetime_value': {
                // Definición: para cada cliente, agrega todas sus facturas y calcula CLV: total facturado,
                // beneficio, ticket medio, primera y última compra, días activo.
                const limit = (input.limit as number) || 50;

                const [clientes, facturas] = await Promise.all([
                    fetchAllPaginated<any>('/clientes', {}, connection),
                    fetchAllPaginated<any>('/facturaclientes', {}, connection),
                ]);

                const clientePorCodigo = new Map<string, any>();
                for (const c of clientes) clientePorCodigo.set(c.codcliente, c);

                const map: Record<string, {
                    codcliente: string;
                    nombre: string;
                    fechaalta: string | null;
                    debaja: boolean;
                    totalFacturado: number;
                    totalBeneficio: number;
                    margenPorcentaje: number;
                    numeroFacturas: number;
                    ticketMedio: number;
                    primeraCompra: string | null;
                    ultimaCompra: string | null;
                    diasActivo: number;
                }> = {};

                for (const f of facturas) {
                    const cod = f.codcliente;
                    let agg = map[cod];
                    if (!agg) {
                        const cli = clientePorCodigo.get(cod);
                        agg = {
                            codcliente: cod,
                            nombre: cli?.nombre ?? f.nombrecliente ?? '',
                            fechaalta: cli?.fechaalta ?? null,
                            debaja: cli?.debaja ?? false,
                            totalFacturado: 0,
                            totalBeneficio: 0,
                            margenPorcentaje: 0,
                            numeroFacturas: 0,
                            ticketMedio: 0,
                            primeraCompra: null,
                            ultimaCompra: null,
                            diasActivo: 0,
                        };
                        map[cod] = agg;
                    }
                    agg.totalFacturado += f.total || 0;
                    agg.totalBeneficio += f.totalbeneficio || 0;
                    agg.numeroFacturas += 1;
                    if (!agg.primeraCompra || f.fecha < agg.primeraCompra) agg.primeraCompra = f.fecha;
                    if (!agg.ultimaCompra || f.fecha > agg.ultimaCompra) agg.ultimaCompra = f.fecha;
                }

                const result = Object.values(map);
                for (const r of result) {
                    r.ticketMedio = r.numeroFacturas > 0 ? r.totalFacturado / r.numeroFacturas : 0;
                    r.margenPorcentaje = porcentaje(r.totalBeneficio, r.totalFacturado);
                    if (r.primeraCompra && r.ultimaCompra) {
                        r.diasActivo = diasEntre(new Date(r.primeraCompra), new Date(r.ultimaCompra));
                    }
                }

                result.sort((a, b) => b.totalFacturado - a.totalFacturado);
                return jsonResponse(result.slice(0, limit));
            }

            case 'get_clientes_riesgo_credito': {
                // Definición: clientes ordenados por % de utilización del límite de crédito.
                // Marca los que superan el 100% (sobre-expuestos).
                const clientes = await fetchAllPaginated<any>('/clientes', {}, connection);

                const result = clientes
                    .filter(c => (c.riesgomax || 0) > 0)
                    .map(c => {
                        const max = c.riesgomax || 0;
                        const alcanzado = c.riesgoalcanzado || 0;
                        const utilizacion = porcentaje(alcanzado, max);
                        return {
                            codcliente: c.codcliente,
                            nombre: c.nombre,
                            riesgoMax: max,
                            riesgoAlcanzado: alcanzado,
                            utilizacionPorcentaje: utilizacion,
                            sobreExpuesto: alcanzado > max,
                            debaja: c.debaja ?? false,
                        };
                    })
                    .sort((a, b) => b.utilizacionPorcentaje - a.utilizacionPorcentaje);

                return jsonResponse(result);
            }

            case 'get_clientes_nuevos_vs_recurrentes': {
                // Definición: dado un periodo, separa facturación entre clientes cuya primera compra
                // CAE en el periodo (nuevos) vs clientes con compras anteriores (recurrentes).
                const fIni = new Date(input.fecha_inicio as string);
                const fFin = new Date(input.fecha_fin as string);

                const facturas = await fetchAllPaginated<any>('/facturaclientes', {}, connection);

                // Calcular primera compra de cada cliente sobre toda la historia
                const primeraCompraPorCliente = new Map<string, Date>();
                for (const f of facturas) {
                    const cod = f.codcliente;
                    const fecha = new Date(f.fecha);
                    const actual = primeraCompraPorCliente.get(cod);
                    if (!actual || fecha < actual) primeraCompraPorCliente.set(cod, fecha);
                }

                let importeNuevos = 0;
                let importeRecurrentes = 0;
                let beneficioNuevos = 0;
                let beneficioRecurrentes = 0;
                const clientesNuevos = new Set<string>();
                const clientesRecurrentes = new Set<string>();

                for (const f of facturas) {
                    const fecha = new Date(f.fecha);
                    if (fecha < fIni || fecha > fFin) continue;
                    const primera = primeraCompraPorCliente.get(f.codcliente);
                    if (!primera) continue;
                    const esNuevo = primera >= fIni && primera <= fFin;
                    const total = f.total || 0;
                    const beneficio = f.totalbeneficio || 0;
                    if (esNuevo) {
                        importeNuevos += total;
                        beneficioNuevos += beneficio;
                        clientesNuevos.add(f.codcliente);
                    } else {
                        importeRecurrentes += total;
                        beneficioRecurrentes += beneficio;
                        clientesRecurrentes.add(f.codcliente);
                    }
                }

                const totalImporte = importeNuevos + importeRecurrentes;

                return jsonResponse({
                    periodo: { desde: input.fecha_inicio, hasta: input.fecha_fin },
                    nuevos: {
                        clientes: clientesNuevos.size,
                        importe: importeNuevos,
                        beneficio: beneficioNuevos,
                        porcentajeFacturacion: porcentaje(importeNuevos, totalImporte),
                    },
                    recurrentes: {
                        clientes: clientesRecurrentes.size,
                        importe: importeRecurrentes,
                        beneficio: beneficioRecurrentes,
                        porcentajeFacturacion: porcentaje(importeRecurrentes, totalImporte),
                    },
                    totalImporte,
                });
            }

            case 'get_facturas_margen_negativo': {
                // Definición: facturas con totalbeneficio negativo (vendidas por debajo de coste).
                const codejercicio = input.codejercicio as string | undefined;
                const params: Record<string, unknown> = {};
                if (codejercicio) params.codejercicio = codejercicio;

                const facturas = await fetchAllPaginated<any>('/facturaclientes', params, connection);

                const result = facturas
                    .filter(f => (f.totalbeneficio || 0) < 0)
                    .map(f => ({
                        idfactura: f.idfactura,
                        codigo: f.codigo,
                        fecha: f.fecha,
                        codcliente: f.codcliente,
                        nombrecliente: f.nombrecliente,
                        codagente: f.codagente,
                        total: f.total,
                        totalcoste: f.totalcoste,
                        totalbeneficio: f.totalbeneficio,
                        margenPorcentaje: porcentaje(f.totalbeneficio, f.total),
                    }))
                    .sort((a, b) => (a.totalbeneficio || 0) - (b.totalbeneficio || 0));

                return jsonResponse(result);
            }

            // ----------------------------------------------------------------
            // DASHBOARD
            // ----------------------------------------------------------------

            case 'get_dashboard_resumen': {
                // Definición: resumen ejecutivo agregando los KPIs más relevantes en un solo response.
                // Periodo actual = últimos N días; periodo anterior = N días previos a ese.
                const dias = (input.dias as number) || 30;
                const now = new Date();
                const inicioActual = new Date(now);
                inicioActual.setDate(inicioActual.getDate() - dias);
                const inicioAnterior = new Date(inicioActual);
                inicioAnterior.setDate(inicioAnterior.getDate() - dias);

                const [facturas, recibosCobrar, recibosPagar] = await Promise.all([
                    fetchAllPaginated<any>('/facturaclientes', {}, connection),
                    fetchAllPaginated<any>('/reciboclientes', { pagado: false }, connection),
                    fetchAllPaginated<any>('/reciboproveedores', { pagado: false }, connection),
                ]);

                const actual = nuevoAgregadoMonetario();
                const anterior = nuevoAgregadoMonetario();
                const clientesActivos = new Set<string>();

                for (const f of facturas) {
                    const fecha = new Date(f.fecha);
                    if (fecha >= inicioActual && fecha <= now) {
                        acumularFactura(actual, f);
                        clientesActivos.add(f.codcliente);
                    } else if (fecha >= inicioAnterior && fecha < inicioActual) {
                        acumularFactura(anterior, f);
                    }
                }
                calcularMargenes([actual, anterior]);

                let cobrosPendientes = 0;
                let cobrosVencidos = 0;
                for (const r of recibosCobrar) {
                    cobrosPendientes += r.importe || 0;
                    const vence = r.vencimiento ? new Date(r.vencimiento) : null;
                    if (r.vencido === true || (vence !== null && vence < now)) {
                        cobrosVencidos += r.importe || 0;
                    }
                }

                let pagosPendientes = 0;
                let pagosVencidos = 0;
                for (const r of recibosPagar) {
                    pagosPendientes += r.importe || 0;
                    const vence = r.vencimiento ? new Date(r.vencimiento) : null;
                    if (r.vencido === true || (vence !== null && vence < now)) {
                        pagosVencidos += r.importe || 0;
                    }
                }

                const ticketMedio = actual.numeroFacturas > 0 ? actual.totalFacturado / actual.numeroFacturas : 0;
                const crecimiento = anterior.totalFacturado > 0
                    ? ((actual.totalFacturado - anterior.totalFacturado) / anterior.totalFacturado) * 100
                    : 0;

                return jsonResponse({
                    periodoDias: dias,
                    ventas: {
                        totalFacturado: actual.totalFacturado,
                        totalBeneficio: actual.totalBeneficio,
                        margenPorcentaje: actual.margenPorcentaje,
                        numeroFacturas: actual.numeroFacturas,
                        ticketMedio,
                        clientesActivos: clientesActivos.size,
                    },
                    comparativaPeriodoAnterior: {
                        totalFacturadoAnterior: anterior.totalFacturado,
                        crecimientoFacturadoPorcentaje: crecimiento,
                    },
                    tesoreria: {
                        cobrosPendientes,
                        cobrosVencidos,
                        pagosPendientes,
                        pagosVencidos,
                        balanceNetoPendiente: cobrosPendientes - pagosPendientes,
                    },
                });
            }

            default:
                return null;
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { ...errorResponse(errorMessage), isError: true };
    }
}
