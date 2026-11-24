/**
 * Informes contables y fiscales calculados a partir de la API de FacturaScripts:
 * cuenta de pérdidas y ganancias y balance de situación abreviados de un
 * ejercicio, IVA repercutido y soportado de un periodo y ventas por zona.
 *
 * Los dos informes contables usan el cuadro de cuentas del Plan General
 * Contable español (grupos 1 a 7), que es el que trae FacturaScripts para
 * España. Son aproximaciones de gestión: los informes oficiales los aporta el
 * plugin Informes.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fetchAllPaginated } from '../../utils/paginate.js';

type Row = Record<string, any>;
type ToolResult = { content: [{ type: 'text'; text: string }]; isError?: boolean };

/** Operaciones de asiento que no son actividad del ejercicio: regularización y cierre. */
const OPERATION_REGULARIZATION = 'R';
const OPERATION_CLOSING = 'C';

/** Agrupaciones admitidas por get_ventas_por_zona y el campo de la factura que usan. */
const ZONE_FIELDS: Record<string, string> = { provincia: 'provincia', ciudad: 'ciudad', pais: 'codpais' };

/** Máximo de facturas para las que se calcula el desglose por tipo de IVA. */
const MAX_INVOICES_FOR_BREAKDOWN = 5000;

const connectionProperty = { type: 'string', description: 'Clave de conexión' } as const;

export const fiscalAnalyticsTools: Tool[] = [
    {
        name: 'get_cuenta_resultados',
        description:
            'Cuenta de pérdidas y ganancias abreviada de un ejercicio a partir de los saldos de las subcuentas de los ' +
            'grupos 6 (gastos) y 7 (ingresos) del Plan General Contable español, sin los asientos de regularización ' +
            'ni de cierre: ingresos, gastos y resultado, por grupo (2 dígitos) y por cuenta (3 dígitos), con ' +
            'comparativa opcional con otro ejercicio. Importes sin impuestos.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: connectionProperty,
                codejercicio: { type: 'string', description: 'Código del ejercicio (consulta get_ejercicios)' },
                codejercicio_comparar: { type: 'string', description: 'Ejercicio con el que comparar (opcional)' },
            },
            required: ['connection', 'codejercicio'],
        },
    },
    {
        name: 'get_balance_situacion',
        description:
            'Balance de situación abreviado de un ejercicio a partir de los saldos de las subcuentas de los grupos 1 a ' +
            '5 del Plan General Contable español, sin el asiento de cierre: activo no corriente y corriente, ' +
            'patrimonio neto (con el resultado del ejercicio si aún no se ha regularizado) y pasivo no corriente y ' +
            'corriente, con el cuadre entre activo y patrimonio neto más pasivo.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: connectionProperty,
                codejercicio: { type: 'string', description: 'Código del ejercicio (consulta get_ejercicios)' },
            },
            required: ['connection', 'codejercicio'],
        },
    },
    {
        name: 'get_impuestos_periodo',
        description:
            'IVA repercutido (facturas de cliente) y soportado (facturas de proveedor) de un periodo por fecha de ' +
            'factura: totales de base, IVA, recargo de equivalencia, retenciones de IRPF y suplidos, desglose por tipo ' +
            'de IVA y recargo, y la diferencia entre repercutido y soportado como orientación para la liquidación ' +
            '(modelo 303). Importes en la divisa principal.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: connectionProperty,
                fecha_desde: { type: 'string', description: 'Desde esta fecha de factura incluida (YYYY-MM-DD)' },
                fecha_hasta: { type: 'string', description: 'Hasta esta fecha de factura incluida (YYYY-MM-DD)' },
                desglose: { type: 'boolean', description: 'Calcular el desglose por tipo de IVA leyendo las líneas (por defecto true)' },
                idempresa: { type: 'number', description: 'Solo las facturas de esta empresa (recomendado si hay varias)' },
            },
            required: ['connection', 'fecha_desde', 'fecha_hasta'],
        },
    },
    {
        name: 'get_ventas_por_zona',
        description:
            'Ventas facturadas de un periodo agrupadas por provincia, ciudad o país de la dirección de la factura: ' +
            'número de facturas y de clientes, base imponible (sin impuestos), total (con impuestos) y porcentaje ' +
            'sobre la base imponible. Importes en la divisa principal.',
        inputSchema: {
            type: 'object' as const,
            properties: {
                connection: connectionProperty,
                fecha_desde: { type: 'string', description: 'Desde esta fecha de factura incluida (YYYY-MM-DD)' },
                fecha_hasta: { type: 'string', description: 'Hasta esta fecha de factura incluida (YYYY-MM-DD)' },
                agrupar: { type: 'string', enum: ['provincia', 'ciudad', 'pais'], description: 'Agrupación (por defecto provincia)' },
                codserie: { type: 'string', description: 'Solo las facturas de esta serie (opcional)' },
                idempresa: { type: 'number', description: 'Solo las facturas de esta empresa (recomendado si hay varias)' },
            },
            required: ['connection', 'fecha_desde', 'fecha_hasta'],
        },
    },
];

/**
 * Redondea a dos decimales.
 *
 * @param value importe.
 */
function r2(value: number): number {
    return Math.round(value * 100) / 100;
}

/**
 * Convierte un valor de la API en número; lo que no lo es cuenta como 0.
 *
 * @param value valor.
 */
function n(value: unknown): number {
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Valida una fecha YYYY-MM-DD obligatoria.
 *
 * @param value valor recibido.
 * @param name  nombre del parámetro, para el mensaje de error.
 * @throws Error si falta o no tiene el formato.
 */
function requiredDate(value: unknown, name: string): string {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`${name} es obligatorio y debe tener el formato YYYY-MM-DD.`);
    }
    return value;
}

/**
 * Pasa un importe de la divisa del documento a la principal con su tasa de conversión.
 *
 * @param amount importe en la divisa del documento.
 * @param doc    documento con tasaconv.
 */
function toMainCurrency(amount: number, doc: Row): number {
    const rate = n(doc.tasaconv);
    return rate > 0 ? amount / rate : amount;
}

/**
 * Saldos debe/haber por subcuenta de un ejercicio, descontando las partidas de
 * los asientos con las operaciones indicadas (regularización o cierre).
 *
 * Los saldos de las subcuentas los mantiene FacturaScripts en segundo plano, así
 * que pueden ir ligeramente por detrás de los últimos asientos.
 *
 * @param codejercicio      ejercicio.
 * @param excludeOperations operaciones de asiento cuyas partidas se descuentan.
 * @param connection        conexión a usar.
 */
async function accountBalances(
    codejercicio: string,
    excludeOperations: string[],
    connection: string,
): Promise<{ balances: Map<string, { debe: number; haber: number }>; accounts: Map<string, string>; excluded: Row[]; kept: Row[] }> {
    const [subaccounts, accounts, ...excludedLists] = await Promise.all([
        fetchAllPaginated<Row>('/subcuentas', { codejercicio }, connection),
        fetchAllPaginated<Row>('/cuentas', { codejercicio }, connection),
        ...excludeOperations.map((operacion) => fetchAllPaginated<Row>('/asientos', { codejercicio, operacion }, connection)),
    ]);
    if (subaccounts.length === 0) {
        throw new Error(`El ejercicio ${codejercicio} no tiene subcuentas: comprueba el código con get_ejercicios.`);
    }

    const balances = new Map<string, { debe: number; haber: number }>();
    for (const sub of subaccounts) {
        const code = String(sub.codsubcuenta ?? '');
        const current = balances.get(code) ?? { debe: 0, haber: 0 };
        current.debe += n(sub.debe);
        current.haber += n(sub.haber);
        balances.set(code, current);
    }

    const excluded: Row[] = [];
    const kept: Row[] = [];
    for (const entry of excludedLists.flat()) {
        const lines = await fetchAllPaginated<Row>('/partidas', { idasiento: entry.idasiento }, connection);
        // La operación R también se usa en asientos manuales de ajuste: solo es la
        // regularización de pérdidas y ganancias si lleva el resultado a la 129.
        if (entry.operacion === OPERATION_REGULARIZATION && !lines.some((line) => String(line.codsubcuenta ?? '').startsWith('129'))) {
            kept.push(entry);
            continue;
        }
        excluded.push(entry);
        for (const line of lines) {
            const current = balances.get(String(line.codsubcuenta ?? ''));
            if (!current) continue;
            current.debe -= n(line.debe);
            current.haber -= n(line.haber);
        }
    }

    const names = new Map<string, string>();
    for (const account of accounts) names.set(String(account.codcuenta ?? ''), String(account.descripcion ?? ''));
    const summary = (entry: Row): Row => ({ idasiento: entry.idasiento, numero: entry.numero, fecha: entry.fecha, operacion: entry.operacion, concepto: entry.concepto ?? null });
    return {
        balances,
        accounts: names,
        excluded: excluded.map(summary),
        kept: kept.map(summary),
    };
}

/**
 * Pérdidas y ganancias de un ejercicio, sin regularización ni cierre.
 *
 * @param codejercicio ejercicio.
 * @param connection   conexión a usar.
 */
async function incomeStatement(codejercicio: string, connection: string): Promise<Row> {
    const { balances, accounts, excluded, kept } = await accountBalances(
        codejercicio,
        [OPERATION_REGULARIZATION, OPERATION_CLOSING],
        connection,
    );

    type Group = { importe: number; cuentas: Map<string, number> };
    const groups = { ingresos: new Map<string, Group>(), gastos: new Map<string, Group>() };
    for (const [code, { debe, haber }] of balances) {
        const kind = code.startsWith('7') ? 'ingresos' : code.startsWith('6') ? 'gastos' : null;
        if (!kind) continue;
        const amount = kind === 'ingresos' ? haber - debe : debe - haber;
        if (Math.abs(amount) < 0.005) continue;
        const group = groups[kind].get(code.slice(0, 2)) ?? { importe: 0, cuentas: new Map<string, number>() };
        group.importe += amount;
        group.cuentas.set(code.slice(0, 3), (group.cuentas.get(code.slice(0, 3)) ?? 0) + amount);
        groups[kind].set(code.slice(0, 2), group);
    }

    const toList = (map: Map<string, Group>): Row[] =>
        [...map]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([grupo, g]) => ({
                grupo,
                descripcion: accounts.get(grupo) ?? null,
                importe: r2(g.importe),
                cuentas: [...g.cuentas]
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([cuenta, importe]) => ({ cuenta, descripcion: accounts.get(cuenta) ?? null, importe: r2(importe) })),
            }));

    const income = [...groups.ingresos.values()].reduce((sum, g) => sum + g.importe, 0);
    const expenses = [...groups.gastos.values()].reduce((sum, g) => sum + g.importe, 0);
    return {
        codejercicio,
        resumen: {
            ingresos: r2(income),
            gastos: r2(expenses),
            resultado: r2(income - expenses),
            margen_pct: income !== 0 ? r2(((income - expenses) / income) * 100) : null,
        },
        ingresos: toList(groups.ingresos),
        gastos: toList(groups.gastos),
        asientos_excluidos: excluded,
        ...(kept.length > 0 ? { asientos_r_incluidos: kept } : {}),
    };
}

/**
 * Cuenta de pérdidas y ganancias, con comparativa opcional.
 *
 * @param args argumentos de la tool.
 */
async function cuentaResultados(args: Row): Promise<Row> {
    const connection = args.connection as string;
    if (typeof args.codejercicio !== 'string' || args.codejercicio === '') throw new Error('codejercicio es obligatorio.');
    const current = await incomeStatement(args.codejercicio, connection);
    if (typeof args.codejercicio_comparar !== 'string' || args.codejercicio_comparar === '') {
        return { ...current, nota: NOTE_ACCOUNTING };
    }
    const previous = await incomeStatement(args.codejercicio_comparar, connection);
    const variation = (a: number, b: number): number | null => (b !== 0 ? r2(((a - b) / Math.abs(b)) * 100) : null);
    return {
        ...current,
        comparativa: {
            codejercicio: args.codejercicio_comparar,
            resumen: previous.resumen,
            variacion_pct: {
                ingresos: variation(current.resumen.ingresos, previous.resumen.ingresos),
                gastos: variation(current.resumen.gastos, previous.resumen.gastos),
                resultado: variation(current.resumen.resultado, previous.resumen.resultado),
            },
        },
        nota: NOTE_ACCOUNTING,
    };
}

const NOTE_ACCOUNTING =
    'Aproximación de gestión con el cuadro de cuentas del Plan General Contable español, a partir de los saldos de ' +
    'las subcuentas, que FacturaScripts actualiza en segundo plano. Los informes oficiales los aporta el plugin Informes.';

/**
 * Balance de situación abreviado de un ejercicio.
 *
 * @param args argumentos de la tool.
 */
async function balanceSituacion(args: Row): Promise<Row> {
    const connection = args.connection as string;
    if (typeof args.codejercicio !== 'string' || args.codejercicio === '') throw new Error('codejercicio es obligatorio.');
    const { balances, accounts, excluded } = await accountBalances(args.codejercicio, [OPERATION_CLOSING], connection);

    const lines = {
        activo_no_corriente: new Map<string, number>(),
        existencias: new Map<string, number>(),
        deudores: new Map<string, number>(),
        tesoreria_e_inversiones: new Map<string, number>(),
        patrimonio_neto: new Map<string, number>(),
        pasivo_no_corriente: new Map<string, number>(),
        pasivo_corriente: new Map<string, number>(),
    };
    const add = (map: Map<string, number>, code: string, amount: number): void => {
        const key = code.slice(0, 2);
        map.set(key, (map.get(key) ?? 0) + amount);
    };

    let pendingResult = 0;
    for (const [code, { debe, haber }] of balances) {
        const saldo = debe - haber;
        const group = code.charAt(0);
        // resultado aún no regularizado: ingresos (saldo acreedor del 7) menos gastos (saldo deudor del 6)
        if (group === '6' || group === '7') pendingResult -= saldo;
        if (Math.abs(saldo) < 0.005) continue;

        if (group === '1') {
            // 10-13: fondos propios y subvenciones; 14-19: provisiones y deudas a largo plazo
            add(Number(code.slice(0, 2)) <= 13 ? lines.patrimonio_neto : lines.pasivo_no_corriente, code, -saldo);
        } else if (group === '2') {
            add(lines.activo_no_corriente, code, saldo);
        } else if (group === '3') {
            add(lines.existencias, code, saldo);
        } else if (group === '4' || group === '5') {
            // las cuentas de clientes, proveedores, Hacienda o bancos pueden tener
            // saldo deudor (activo) o acreedor (pasivo) según la subcuenta
            if (saldo > 0) add(group === '4' ? lines.deudores : lines.tesoreria_e_inversiones, code, saldo);
            else add(lines.pasivo_corriente, code, -saldo);
        }
    }

    const toList = (map: Map<string, number>): Row[] =>
        [...map].sort(([a], [b]) => a.localeCompare(b)).map(([grupo, importe]) => ({ grupo, descripcion: accounts.get(grupo) ?? null, importe: r2(importe) }));
    const sum = (map: Map<string, number>): number => [...map.values()].reduce((acc, value) => acc + value, 0);

    const nonCurrentAssets = sum(lines.activo_no_corriente);
    const currentAssets = sum(lines.existencias) + sum(lines.deudores) + sum(lines.tesoreria_e_inversiones);
    const equity = sum(lines.patrimonio_neto) + pendingResult;
    const nonCurrentLiabilities = sum(lines.pasivo_no_corriente);
    const currentLiabilities = sum(lines.pasivo_corriente);
    const assets = nonCurrentAssets + currentAssets;
    const equityAndLiabilities = equity + nonCurrentLiabilities + currentLiabilities;

    return {
        codejercicio: args.codejercicio,
        activo: {
            total: r2(assets),
            no_corriente: { total: r2(nonCurrentAssets), grupos: toList(lines.activo_no_corriente) },
            corriente: {
                total: r2(currentAssets),
                existencias: toList(lines.existencias),
                deudores: toList(lines.deudores),
                tesoreria_e_inversiones: toList(lines.tesoreria_e_inversiones),
            },
        },
        patrimonio_neto_y_pasivo: {
            total: r2(equityAndLiabilities),
            patrimonio_neto: {
                total: r2(equity),
                grupos: toList(lines.patrimonio_neto),
                resultado_sin_regularizar: r2(pendingResult),
            },
            pasivo_no_corriente: { total: r2(nonCurrentLiabilities), grupos: toList(lines.pasivo_no_corriente) },
            pasivo_corriente: { total: r2(currentLiabilities), grupos: toList(lines.pasivo_corriente) },
        },
        ratios: {
            fondo_maniobra: r2(currentAssets - currentLiabilities),
            liquidez: currentLiabilities !== 0 ? r2(currentAssets / currentLiabilities) : null,
            endeudamiento: equityAndLiabilities !== 0 ? r2(((nonCurrentLiabilities + currentLiabilities) / equityAndLiabilities) * 100) : null,
        },
        descuadre: r2(assets - equityAndLiabilities),
        asientos_excluidos: excluded,
        nota:
            NOTE_ACCOUNTING +
            ' Las subcuentas de los grupos 4 y 5 se clasifican como activo o pasivo según el signo de su saldo, y todo el ' +
            'pasivo de esos grupos se presenta como corriente.',
    };
}

/**
 * Lee las líneas de un conjunto de facturas en bloque: pide las del rango de ids
 * (sus ids suelen ser consecutivos en un periodo) y se queda con las suyas.
 *
 * @param endpoint   recurso de las líneas.
 * @param invoices   facturas.
 * @param connection conexión a usar.
 */
async function invoiceLines(endpoint: string, invoices: Row[], connection: string): Promise<Row[]> {
    if (invoices.length === 0) return [];
    const ids = invoices.map((invoice) => n(invoice.idfactura));
    const wanted = new Set(ids.map(String));
    const lines = await fetchAllPaginated<Row>(
        endpoint,
        { idfactura_gte: Math.min(...ids), idfactura_lte: Math.max(...ids) },
        connection,
    );
    return lines.filter((line) => wanted.has(String(line.idfactura)));
}

/**
 * Totales y desglose por tipo de IVA de un lado (ventas o compras).
 *
 * @param invoices facturas del periodo.
 * @param lines    sus líneas, o null si no se calcula el desglose.
 */
function taxSide(invoices: Row[], lines: Row[] | null): Row {
    const totals = { facturas: invoices.length, base: 0, iva: 0, recargo: 0, irpf: 0, suplidos: 0, total: 0 };
    for (const invoice of invoices) {
        totals.base += toMainCurrency(n(invoice.neto), invoice);
        totals.iva += toMainCurrency(n(invoice.totaliva), invoice);
        totals.recargo += toMainCurrency(n(invoice.totalrecargo), invoice);
        totals.irpf += toMainCurrency(n(invoice.totalirpf), invoice);
        totals.suplidos += toMainCurrency(n(invoice.totalsuplidos), invoice);
        totals.total += toMainCurrency(n(invoice.total), invoice);
    }
    const result: Row = {
        totales: Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, key === 'facturas' ? value : r2(value)])),
    };
    if (!lines) return result;

    const byInvoice = new Map(invoices.map((invoice) => [String(invoice.idfactura), invoice] as const));
    const byRate = new Map<string, { iva: number; recargo: number; base: number; cuota_iva: number; cuota_recargo: number }>();
    for (const line of lines) {
        const invoice = byInvoice.get(String(line.idfactura));
        if (!invoice || line.suplido === true || line.suplido === 1 || line.suplido === '1') continue;
        // mismo cálculo que el Calculator del core: descuentos globales del documento sobre el pvptotal
        const factor = ((100 - n(invoice.dtopor1)) / 100) * ((100 - n(invoice.dtopor2)) / 100);
        const base = toMainCurrency(n(line.pvptotal) * factor, invoice);
        const key = `${n(line.iva)}|${n(line.recargo)}`;
        const group = byRate.get(key) ?? { iva: n(line.iva), recargo: n(line.recargo), base: 0, cuota_iva: 0, cuota_recargo: 0 };
        group.base += base;
        group.cuota_iva += (base * n(line.iva)) / 100;
        group.cuota_recargo += (base * n(line.recargo)) / 100;
        byRate.set(key, group);
    }
    const breakdown = [...byRate.values()]
        .sort((a, b) => b.iva - a.iva || b.recargo - a.recargo)
        .map((g) => ({ iva: g.iva, recargo: g.recargo, base: r2(g.base), cuota_iva: r2(g.cuota_iva), cuota_recargo: r2(g.cuota_recargo) }));
    const breakdownIva = breakdown.reduce((sum, g) => sum + g.cuota_iva, 0);
    result.por_tipo = breakdown;
    // el desglose se recalcula desde las líneas: puede diferir por redondeos o
    // por impuestos de importe fijo; el total oficial es el de las facturas
    result.diferencia_iva_desglose = r2(totals.iva - breakdownIva);
    return result;
}

/**
 * Aviso cuando hay facturas de varias empresas y no se ha filtrado por una:
 * sus impuestos se liquidan por separado y no deben sumarse.
 *
 * @param invoices facturas leídas.
 * @param args     argumentos de la tool.
 */
function companiesNotice(invoices: Row[], args: Row): string | null {
    if (args.idempresa !== undefined && args.idempresa !== '') return null;
    const companies = new Set(invoices.map((invoice) => String(invoice.idempresa ?? '')));
    if (companies.size <= 1) return null;
    return `Hay facturas de ${companies.size} empresas (${[...companies].sort().join(', ')}) sumadas: filtra con idempresa para ver cada una por separado.`;
}

/**
 * IVA repercutido y soportado de un periodo.
 *
 * @param args argumentos de la tool.
 */
async function impuestosPeriodo(args: Row): Promise<Row> {
    const connection = args.connection as string;
    const desde = requiredDate(args.fecha_desde, 'fecha_desde');
    const hasta = requiredDate(args.fecha_hasta, 'fecha_hasta');
    const withBreakdown = args.desglose !== false;
    const range: Row = { fecha_gte: desde, fecha_lte: hasta };
    if (args.idempresa !== undefined && args.idempresa !== '') range.idempresa = args.idempresa;

    const sales = await fetchAllPaginated<Row>('/facturaclientes', range, connection);
    const purchases = await fetchAllPaginated<Row>('/facturaproveedores', range, connection);

    const notices: string[] = [];
    let salesLines: Row[] | null = null;
    let purchaseLines: Row[] | null = null;
    if (withBreakdown) {
        if (sales.length + purchases.length > MAX_INVOICES_FOR_BREAKDOWN) {
            notices.push(`Hay más de ${MAX_INVOICES_FOR_BREAKDOWN} facturas: se omite el desglose por tipo de IVA; acota el periodo.`);
        } else {
            salesLines = await invoiceLines('/lineafacturaclientes', sales, connection);
            purchaseLines = await invoiceLines('/lineafacturaproveedores', purchases, connection);
        }
    }
    const companies = companiesNotice([...sales, ...purchases], args);
    if (companies) notices.push(companies);
    const currencies = new Set([...sales, ...purchases].map((invoice) => invoice.coddivisa).filter(Boolean));
    if (currencies.size > 1) notices.push(`Hay facturas en ${currencies.size} divisas: se han convertido a la principal con su tasa de conversión.`);

    const repercutido = taxSide(sales, salesLines);
    const soportado = taxSide(purchases, purchaseLines);
    const output = n(repercutido.totales.iva) + n(repercutido.totales.recargo);
    const input = n(soportado.totales.iva);

    return {
        periodo: { desde, hasta },
        ...(notices.length > 0 ? { aviso: notices.join(' ') } : {}),
        repercutido,
        soportado,
        liquidacion_orientativa: {
            iva_repercutido_con_recargo: r2(output),
            iva_soportado: r2(input),
            diferencia: r2(output - input),
            resultado: output - input >= 0 ? 'a ingresar' : 'a compensar o devolver',
        },
        nota:
            'Orientación calculada desde las facturas por su fecha. La liquidación real depende de la fecha de ' +
            'devengo, de las facturas no deducibles, de la prorrata y de operaciones especiales (intracomunitarias, ' +
            'inversión del sujeto pasivo, criterio de caja), que esta herramienta no distingue. El recargo de ' +
            'equivalencia soportado no es deducible y no se resta.',
    };
}

/**
 * Ventas de un periodo agrupadas por zona.
 *
 * @param args argumentos de la tool.
 */
async function ventasPorZona(args: Row): Promise<Row> {
    const connection = args.connection as string;
    const desde = requiredDate(args.fecha_desde, 'fecha_desde');
    const hasta = requiredDate(args.fecha_hasta, 'fecha_hasta');
    const grouping = typeof args.agrupar === 'string' && args.agrupar !== '' ? args.agrupar : 'provincia';
    const field = ZONE_FIELDS[grouping];
    if (!field) throw new Error('agrupar debe ser provincia, ciudad o pais.');

    const params: Row = { fecha_gte: desde, fecha_lte: hasta };
    if (typeof args.codserie === 'string' && args.codserie !== '') params.codserie = args.codserie;
    if (args.idempresa !== undefined && args.idempresa !== '') params.idempresa = args.idempresa;
    const invoices = await fetchAllPaginated<Row>('/facturaclientes', params, connection);
    const companies = companiesNotice(invoices, args);

    type Group = { nombres: Map<string, number>; facturas: number; clientes: Set<string>; neto: number; total: number };
    const groups = new Map<string, Group>();
    for (const invoice of invoices) {
        const raw = String(invoice[field] ?? '').trim();
        // se agrupa sin distinguir mayúsculas ni acentos para unir «Málaga» y «MALAGA»
        const key = raw === '' ? '' : raw.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
        const group = groups.get(key) ?? { nombres: new Map<string, number>(), facturas: 0, clientes: new Set<string>(), neto: 0, total: 0 };
        group.nombres.set(raw, (group.nombres.get(raw) ?? 0) + 1);
        group.facturas += 1;
        group.clientes.add(String(invoice.codcliente ?? ''));
        group.neto += toMainCurrency(n(invoice.neto), invoice);
        group.total += toMainCurrency(n(invoice.total), invoice);
        groups.set(key, group);
    }

    const totalNet = [...groups.values()].reduce((sum, g) => sum + g.neto, 0);
    const zones = [...groups]
        .map(([key, g]) => {
            const name = key === '' ? '(sin datos)' : [...g.nombres].sort((a, b) => b[1] - a[1])[0]?.[0] ?? key;
            return {
                zona: name,
                facturas: g.facturas,
                clientes: g.clientes.size,
                neto: r2(g.neto),
                total: r2(g.total),
                porcentaje_neto: totalNet !== 0 ? r2((g.neto / totalNet) * 100) : null,
            };
        })
        .sort((a, b) => b.neto - a.neto);

    return {
        periodo: { desde, hasta },
        agrupacion: grouping,
        ...(companies ? { aviso: companies } : {}),
        resumen: { facturas: invoices.length, zonas: zones.length, neto: r2(totalNet) },
        zonas: zones,
    };
}

/**
 * Ejecuta una tool fiscal o contable. Devuelve null si no es suya.
 *
 * @param name nombre de la tool.
 * @param args argumentos de la llamada.
 */
export async function handleFiscalAnalyticsTool(name: string, args: Record<string, unknown>): Promise<ToolResult | null> {
    const handlers: Record<string, (input: Row) => Promise<Row>> = {
        get_cuenta_resultados: cuentaResultados,
        get_balance_situacion: balanceSituacion,
        get_impuestos_periodo: impuestosPeriodo,
        get_ventas_por_zona: ventasPorZona,
    };
    const handler = handlers[name];
    if (!handler) return null;
    try {
        const payload = await handler(args);
        return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text', text: JSON.stringify({ error: `${name}: ${message}` }, null, 2) }], isError: true };
    }
}
