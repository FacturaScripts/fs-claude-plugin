/**
 * Tools propias del plugin Proyectos que no son CRUD de un modelo: ficha
 * completa de un proyecto, sus documentos de compra y venta, vincular
 * documentos, cambios de estado y de fase por nombre, e informes (resumen de
 * proyectos, rentabilidad, tareas y tareas vencidas).
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';
import { pathId } from '../../utils/pathId.js';
import {
    accumulate,
    connectionOf,
    daysBetween,
    fetchAll,
    fetchByIds,
    fetchCatalog,
    findByName,
    getOrNull,
    groupKey,
    isoDate,
    isTrue,
    num,
    optionalIsoDate,
    round2,
    todayIso,
} from '../shared/query.js';
import { CONNECTION_PROPERTY } from '../shared/resource.js';
import { fail, ok } from '../shared/result.js';
import type { ToolArgs, ToolResult } from '../types.js';
import { PHASE_CANCELED, PHASE_COMPLETED, PHASE_TYPE } from './resources.js';

type Row = Record<string, unknown>;

/** Documentos de compra y venta que el plugin vincula a un proyecto (columna idproyecto). */
const DOCUMENTS: Array<{ tipo: string; endpoint: string; id: string; lado: 'venta' | 'compra' }> = [
    { tipo: 'presupuesto_cliente', endpoint: '/presupuestoclientes', id: 'idpresupuesto', lado: 'venta' },
    { tipo: 'pedido_cliente', endpoint: '/pedidoclientes', id: 'idpedido', lado: 'venta' },
    { tipo: 'albaran_cliente', endpoint: '/albaranclientes', id: 'idalbaran', lado: 'venta' },
    { tipo: 'factura_cliente', endpoint: '/facturaclientes', id: 'idfactura', lado: 'venta' },
    { tipo: 'presupuesto_proveedor', endpoint: '/presupuestoproveedores', id: 'idpresupuesto', lado: 'compra' },
    { tipo: 'pedido_proveedor', endpoint: '/pedidoproveedores', id: 'idpedido', lado: 'compra' },
    { tipo: 'albaran_proveedor', endpoint: '/albaranproveedores', id: 'idalbaran', lado: 'compra' },
    { tipo: 'factura_proveedor', endpoint: '/facturaproveedores', id: 'idfactura', lado: 'compra' },
];

const DOCUMENT_TYPES = DOCUMENTS.map((doc) => doc.tipo);

const dateRangeProps = {
    fecha_desde: { type: 'string', description: 'Desde esta fecha de alta incluida (YYYY-MM-DD)' },
    fecha_hasta: { type: 'string', description: 'Hasta esta fecha de alta incluida (YYYY-MM-DD)' },
} as const;

const projectFilterProps = {
    codcliente: { type: 'string', description: 'Solo los proyectos de este cliente' },
    idestado: { type: 'number', description: 'Solo los proyectos en este estado' },
    nick: { type: 'string', description: 'Solo los proyectos de este responsable' },
    idempresa: { type: 'number', description: 'Solo los proyectos de esta empresa' },
    editable: { type: 'boolean', description: 'true solo abiertos, false solo cerrados' },
} as const;

export const PROYECTOS_TOOLS: Tool[] = [
    {
        name: 'get_proyecto',
        description:
            'Ficha completa de un proyecto: datos con el nombre de su estado y cliente, totales de ventas, compras, ' +
            'margen y pendiente de facturar, sus tareas con la fase y si están vencidas (y el resumen por fase), los ' +
            'usuarios, las últimas notas, el stock, el resumen de documentos de compra y venta por tipo y los ' +
            'servicios SAT vinculados (si el plugin Servicios está activo). ' +
            'Ventas y compras son importes con impuestos de los documentos vinculados (las ventas incluyen presupuestos y ' +
            'pedidos aún no facturados, sin duplicar los ya convertidos); el pendiente de facturar es el neto sin impuestos.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                idproyecto: { type: 'number', description: 'Id del proyecto' },
                notas: { type: 'number', description: 'Notas a incluir (por defecto 20, 0 para ninguna)' },
            },
            required: ['idproyecto'],
        },
    },
    {
        name: 'get_documentos_proyecto',
        description:
            'Documentos de venta (presupuestos, pedidos, albaranes y facturas de cliente) y de compra (de proveedor) ' +
            'vinculados a un proyecto, con su código, fecha, tercero, neto y total.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                idproyecto: { type: 'number', description: 'Id del proyecto' },
                tipo: {
                    type: 'string',
                    enum: [...DOCUMENT_TYPES, 'ventas', 'compras', 'todos'],
                    description: 'Tipo de documento, ventas, compras o todos (por defecto todos)',
                },
            },
            required: ['idproyecto'],
        },
    },
    {
        name: 'set_proyecto_documento',
        description:
            'Vincula un documento de compra o venta a un proyecto, o lo desvincula. FacturaScripts recalcula los ' +
            'totales del proyecto al guardar el documento.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                tipo: { type: 'string', enum: DOCUMENT_TYPES, description: 'Tipo de documento' },
                id: { type: 'number', description: 'Id del documento (idfactura, idalbaran, idpedido o idpresupuesto)' },
                idproyecto: { type: 'number', description: 'Proyecto al que vincularlo' },
                desvincular: { type: 'boolean', description: 'true para quitar el documento de su proyecto' },
            },
            required: ['tipo', 'id'],
        },
    },
    {
        name: 'set_estado_proyecto',
        description:
            'Cambia el estado de un proyecto indicando el id o el nombre del estado. El estado decide si el proyecto ' +
            'queda abierto (editable) o cerrado.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                idproyecto: { type: 'number', description: 'Id del proyecto' },
                idestado: { type: 'number', description: 'Id del nuevo estado' },
                estado: { type: 'string', description: 'Nombre del nuevo estado, si no se indica idestado' },
            },
            required: ['idproyecto'],
        },
    },
    {
        name: 'set_fase_tarea_proyecto',
        description:
            'Cambia la fase de una tarea de proyecto indicando el id o el nombre de la fase (ej. "Completada"). Guarda ' +
            'la fecha de completado, notifica al usuario asignado y puede cambiar el estado del proyecto.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                idtarea: { type: 'number', description: 'Id de la tarea' },
                idfase: { type: 'number', description: 'Id de la nueva fase' },
                fase: { type: 'string', description: 'Nombre de la nueva fase, si no se indica idfase' },
            },
            required: ['idtarea'],
        },
    },
    {
        name: 'get_informe_proyectos',
        description:
            'Informe de proyectos (por fecha de alta): total, abiertos y cerrados, ventas, compras, margen y pendiente ' +
            'de facturar, con desglose por estado, cliente, responsable y mes, y los proyectos con más ventas, más ' +
            'margen y margen negativo. ' +
            'Ventas y compras son importes con impuestos de los documentos vinculados (las ventas incluyen presupuestos y ' +
            'pedidos aún no facturados, sin duplicar los ya convertidos); el pendiente de facturar es el neto sin impuestos.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                ...dateRangeProps,
                ...projectFilterProps,
                top: { type: 'number', description: 'Proyectos de cada ranking (por defecto 10)' },
            },
            required: [],
        },
    },
    {
        name: 'get_rentabilidad_proyectos',
        description:
            'Rentabilidad por proyecto: ventas, compras, margen (ventas − compras), margen sobre ventas en % y ' +
            'pendiente de facturar, ordenados por el criterio indicado, con los totales. ' +
            'Ventas y compras son importes con impuestos de los documentos vinculados (las ventas incluyen presupuestos y ' +
            'pedidos aún no facturados, sin duplicar los ya convertidos); el pendiente de facturar es el neto sin impuestos.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                ...dateRangeProps,
                ...projectFilterProps,
                orden: {
                    type: 'string',
                    enum: ['margen', 'margen_pct', 'ventas', 'compras', 'pendiente'],
                    description: 'Criterio de orden descendente (por defecto margen)',
                },
                solo_con_movimientos: { type: 'boolean', description: 'Omitir los proyectos sin ventas ni compras' },
                limit: { type: 'number', description: 'Proyectos a listar (por defecto 50); los totales cuentan todos' },
            },
            required: [],
        },
    },
    {
        name: 'get_informe_tareas_proyecto',
        description:
            'Informe de tareas de proyecto: total, abiertas, completadas, canceladas y vencidas; desglose por fase, ' +
            'por usuario (carga de trabajo) y por proyecto; días medios hasta completarlas y tareas completadas en el ' +
            'periodo.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                ...dateRangeProps,
                idproyecto: { type: 'number', description: 'Solo las tareas de este proyecto' },
                nick: { type: 'string', description: 'Solo las tareas de este usuario' },
            },
            required: [],
        },
    },
    {
        name: 'get_tareas_proyecto_vencidas',
        description:
            'Tareas de proyecto vencidas: con fecha fin anterior a la fecha de referencia (hoy por defecto) y que no ' +
            'están completadas ni canceladas, de mayor a menor retraso, con su proyecto, fase y usuario.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                idproyecto: { type: 'number', description: 'Solo las tareas de este proyecto' },
                nick: { type: 'string', description: 'Solo las tareas de este usuario' },
                fecha_referencia: { type: 'string', description: 'Fecha con la que comparar (YYYY-MM-DD). Por defecto, hoy' },
                limit: { type: 'number', description: 'Tareas a listar (por defecto 100); los totales cuentan todas' },
            },
            required: [],
        },
    },
];

/**
 * Tipo de la fase de una tarea, o null si la fase no tiene tipo.
 *
 * @param phases catálogo de fases.
 * @param idfase fase de la tarea.
 */
function phaseType(phases: Map<string, Row>, idfase: unknown): number | null {
    const tipo = phases.get(String(idfase))?.tipo;
    return tipo === null || tipo === undefined || tipo === '' ? null : num(tipo);
}

/**
 * Indica si una tarea está cerrada: en una fase de tipo completada o cancelada.
 *
 * @param phases catálogo de fases.
 * @param task   tarea.
 */
function isClosedTask(phases: Map<string, Row>, task: Row): boolean {
    const tipo = phaseType(phases, task.idfase);
    return tipo === PHASE_COMPLETED || tipo === PHASE_CANCELED;
}

/**
 * Días de retraso de una tarea abierta respecto a una fecha, o null si no está vencida.
 *
 * @param phases    catálogo de fases.
 * @param task      tarea.
 * @param reference fecha de referencia YYYY-MM-DD.
 */
function overdueDays(phases: Map<string, Row>, task: Row, reference: string): number | null {
    const end = isoDate(task.fechafin);
    if (!end || end >= reference || isClosedTask(phases, task)) return null;
    return daysBetween(end, reference);
}

/**
 * Filtros de la API para los informes de proyectos a partir de los argumentos.
 *
 * @param args argumentos de la llamada.
 */
function projectParams(args: ToolArgs): { params: Row; desde: string | undefined; hasta: string | undefined } {
    const desde = optionalIsoDate(args.fecha_desde, 'fecha_desde');
    const hasta = optionalIsoDate(args.fecha_hasta, 'fecha_hasta');
    const params: Row = {};
    if (desde) params.fecha_gte = desde;
    if (hasta) params.fecha_lte = hasta;
    for (const field of Object.keys(projectFilterProps)) {
        if (args[field] !== undefined && args[field] !== null && args[field] !== '') params[field] = args[field];
    }
    return { params, desde, hasta };
}

/**
 * Cifras económicas de un proyecto.
 *
 * @param project proyecto.
 */
function economics(project: Row): { ventas: number; compras: number; margen: number; margen_pct: number | null; pendiente: number } {
    const ventas = num(project.totalventas);
    const compras = num(project.totalcompras);
    return {
        ventas: round2(ventas),
        compras: round2(compras),
        margen: round2(ventas - compras),
        margen_pct: ventas !== 0 ? round2(((ventas - compras) / ventas) * 100) : null,
        pendiente: round2(num(project.totalpendientefacturar)),
    };
}

async function proyectoDetalle(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const project = await fsClient.get<Row>(`/proyectos/${pathId(args.idproyecto)}`, undefined, connection);
    const id = project.idproyecto;
    const notesLimit = typeof args.notas === 'number' && args.notas >= 0 ? args.notas : 20;
    const today = todayIso();

    const [status, customer, tasks, phases, users, notes, stock, documents, services] = await Promise.all([
        getOrNull('/estadoproyectos', project.idestado, connection),
        getOrNull('/clientes', project.codcliente, connection),
        fetchAll<Row>('/tareaproyectos', { idproyecto: id, 'sort[idtarea]': 'ASC' }, connection),
        fetchCatalog('/fasetareas', 'idfase', connection),
        fetchAll<Row>('/userproyectos', { idproyecto: id }, connection).catch(() => ({ rows: [], truncated: false })),
        notesLimit === 0
            ? Promise.resolve([] as Row[])
            : fsClient
                  .get<Row[]>('/notaproyectos', { idproyecto: id, 'sort[fecha]': 'DESC', 'sort[idnota]': 'DESC', limit: notesLimit }, connection)
                  .catch(() => [] as Row[]),
        fetchAll<Row>('/stockproyectos', { idproyecto: id }, connection).catch(() => ({ rows: [], truncated: false })),
        Promise.all(
            DOCUMENTS.map(async (doc) => {
                try {
                    const { rows } = await fetchAll<Row>(doc.endpoint, { idproyecto: id }, connection);
                    return {
                        tipo: doc.tipo,
                        lado: doc.lado,
                        documentos: rows.length,
                        neto: round2(rows.reduce((sum, row) => sum + num(row.neto), 0)),
                        total: round2(rows.reduce((sum, row) => sum + num(row.total), 0)),
                    };
                } catch {
                    return { tipo: doc.tipo, lado: doc.lado, documentos: null, neto: null, total: null };
                }
            }),
        ),
        // si el plugin Servicios no está activo el recurso no existe y no se muestran
        fetchAll<Row>('/servicioates', { idproyecto: id }, connection).then((r) => r.rows).catch(() => null),
    ]);

    const byPhase = new Map<string, number>();
    const taskRows = tasks.rows.map((task) => {
        const phase = phases.get(String(task.idfase));
        const tipo = phaseType(phases, task.idfase);
        const late = overdueDays(phases, task, today);
        const phaseName = phase ? String(phase.nombre) : groupKey(task.idfase);
        byPhase.set(phaseName, (byPhase.get(phaseName) ?? 0) + 1);
        return {
            ...task,
            fase_nombre: phase?.nombre ?? null,
            fase_tipo: tipo === null ? null : PHASE_TYPE[tipo] ?? String(tipo),
            vencida: late !== null,
            dias_retraso: late,
        };
    });

    return ok({
        proyecto: {
            ...project,
            estado_nombre: status?.nombre ?? null,
            cliente_nombre: customer?.nombre ?? null,
            abierto: isTrue(project.editable),
        },
        economia: {
            ...economics(project),
            nota: 'Ventas y compras son los totales con impuestos que calcula el plugin sin duplicar documentos ya servidos o facturados; el pendiente de facturar es sin impuestos.',
        },
        resumen_tareas: {
            tareas: taskRows.length,
            abiertas: taskRows.filter((task) => !isClosedTask(phases, task)).length,
            vencidas: taskRows.filter((task) => task.vencida).length,
            por_fase: Object.fromEntries(byPhase),
        },
        tareas: taskRows,
        usuarios: users.rows,
        notas: notes,
        stock: { referencias: stock.rows.length, registros: stock.rows.slice(0, 100) },
        documentos: documents,
        ...(services !== null ? {
            servicios_sat: services.map((row) => ({
                idservicio: row.idservicio,
                codigo: row.codigo,
                fecha: row.fecha,
                abierto: isTrue(row.editable),
                neto: num(row.neto),
            })),
        } : {}),
    });
}

async function documentosProyecto(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.idproyecto);
    const tipo = typeof args.tipo === 'string' && args.tipo !== '' ? args.tipo : 'todos';
    const selected = DOCUMENTS.filter((doc) =>
        tipo === 'todos' || doc.tipo === tipo || (tipo === 'ventas' && doc.lado === 'venta') || (tipo === 'compras' && doc.lado === 'compra'));
    if (selected.length === 0) {
        return fail(`get_documentos_proyecto: tipo no válido. Usa ${[...DOCUMENT_TYPES, 'ventas', 'compras', 'todos'].join(', ')}.`);
    }

    const result: Row = {};
    await Promise.all(selected.map(async (doc) => {
        try {
            const { rows } = await fetchAll<Row>(doc.endpoint, { idproyecto: id, 'sort[fecha]': 'DESC' }, connection);
            result[doc.tipo] = {
                documentos: rows.length,
                neto: round2(rows.reduce((sum, row) => sum + num(row.neto), 0)),
                total: round2(rows.reduce((sum, row) => sum + num(row.total), 0)),
                registros: rows.map((row) => ({
                    [doc.id]: row[doc.id],
                    codigo: row.codigo,
                    fecha: row.fecha,
                    ...(doc.lado === 'venta'
                        ? { codcliente: row.codcliente, nombre: row.nombrecliente }
                        : { codproveedor: row.codproveedor, nombre: row.nombre }),
                    neto: row.neto,
                    total: row.total,
                    editable: row.editable,
                    ...(row.pagada !== undefined ? { pagada: row.pagada } : {}),
                })),
            };
        } catch (error) {
            result[doc.tipo] = { error: error instanceof Error ? error.message : String(error) };
        }
    }));

    return ok({ idproyecto: Number(id), documentos: result });
}

async function setProyectoDocumento(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const doc = DOCUMENTS.find((d) => d.tipo === args.tipo);
    if (!doc) return fail(`set_proyecto_documento: tipo no válido. Usa ${DOCUMENT_TYPES.join(', ')}.`);

    const unlink = isTrue(args.desvincular);
    if (!unlink && (args.idproyecto === undefined || args.idproyecto === null || args.idproyecto === '')) {
        return fail('set_proyecto_documento: indica idproyecto o desvincular=true.');
    }
    if (!unlink) {
        // comprobamos que el proyecto existe para no dejar el documento con un id huérfano
        await fsClient.get(`/proyectos/${pathId(args.idproyecto)}`, undefined, connection);
    }

    const result = await fsClient.put<Row>(
        `${doc.endpoint}/${pathId(args.id)}`,
        { idproyecto: unlink ? 'null' : args.idproyecto },
        connection,
    );
    return ok(result);
}

async function setEstadoProyecto(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.idproyecto);
    let status: Row | null;

    if (args.idestado === undefined || args.idestado === null || args.idestado === '') {
        if (typeof args.estado !== 'string' || args.estado.trim() === '') {
            return fail('set_estado_proyecto: indica idestado o el nombre del estado.');
        }
        const { rows } = await fetchAll<Row>('/estadoproyectos', {}, connection);
        status = findByName(rows, 'nombre', args.estado);
    } else {
        status = await getOrNull('/estadoproyectos', args.idestado, connection);
        if (!status) return fail(`set_estado_proyecto: no existe el estado ${String(args.idestado)}.`);
    }

    const result = await fsClient.put<Row>(`/proyectos/${id}`, { idestado: status.idestado }, connection);
    return ok({ estado: { idestado: status.idestado, nombre: status.nombre, editable: status.editable }, resultado: result });
}

async function setFaseTarea(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.idtarea);
    let phase: Row | null;

    if (args.idfase === undefined || args.idfase === null || args.idfase === '') {
        if (typeof args.fase !== 'string' || args.fase.trim() === '') {
            return fail('set_fase_tarea_proyecto: indica idfase o el nombre de la fase.');
        }
        const { rows } = await fetchAll<Row>('/fasetareas', {}, connection);
        phase = findByName(rows, 'nombre', args.fase);
    } else {
        phase = await getOrNull('/fasetareas', args.idfase, connection);
        if (!phase) return fail(`set_fase_tarea_proyecto: no existe la fase ${String(args.idfase)}.`);
    }

    const result = await fsClient.put<Row>(`/tareaproyectos/${id}`, { idfase: phase.idfase }, connection);
    const tipo = phase.tipo === null || phase.tipo === undefined || phase.tipo === '' ? null : num(phase.tipo);
    return ok({
        fase: { idfase: phase.idfase, nombre: phase.nombre, tipo: tipo === null ? null : PHASE_TYPE[tipo] ?? tipo },
        resultado: result,
    });
}

async function informeProyectos(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const { params, desde, hasta } = projectParams(args);
    const top = typeof args.top === 'number' && args.top > 0 ? Math.floor(args.top) : 10;

    const [{ rows, truncated }, statuses] = await Promise.all([
        fetchAll<Row>('/proyectos', params, connection),
        fetchCatalog('/estadoproyectos', 'idestado', connection),
    ]);

    type Group = { proyectos: number; abiertos: number; ventas: number; compras: number; margen: number; pendiente: number };
    const init = (): Group => ({ proyectos: 0, abiertos: 0, ventas: 0, compras: 0, margen: 0, pendiente: 0 });
    const groups = {
        estado: new Map<string, Group>(),
        cliente: new Map<string, Group>(),
        responsable: new Map<string, Group>(),
        mes: new Map<string, Group>(),
    };
    const totals = init();

    const items = rows.map((row) => {
        const eco = economics(row);
        const isOpen = isTrue(row.editable);
        const add = (g: Group): void => {
            g.proyectos += 1;
            if (isOpen) g.abiertos += 1;
            g.ventas += eco.ventas;
            g.compras += eco.compras;
            g.margen += eco.margen;
            g.pendiente += eco.pendiente;
        };
        add(totals);
        const statusName = statuses.get(String(row.idestado))?.nombre;
        accumulate(groups.estado, statusName ? String(statusName) : groupKey(row.idestado), init, add);
        accumulate(groups.cliente, groupKey(row.codcliente), init, add);
        accumulate(groups.responsable, groupKey(row.nick), init, add);
        accumulate(groups.mes, (isoDate(row.fecha) ?? '(sin fecha)').slice(0, 7), init, add);
        return { idproyecto: row.idproyecto, nombre: row.nombre, codcliente: row.codcliente ?? null, abierto: isOpen, ...eco };
    });

    const round = (g: Group): Group => ({
        ...g,
        ventas: round2(g.ventas),
        compras: round2(g.compras),
        margen: round2(g.margen),
        pendiente: round2(g.pendiente),
    });
    const toList = (map: Map<string, Group>, key: string): Row[] =>
        [...map].map(([name, g]) => ({ [key]: name, ...round(g) })).sort((a, b) => num(b.ventas) - num(a.ventas));

    return ok({
        periodo: { desde: desde ?? null, hasta: hasta ?? null },
        ...(truncated ? { aviso: 'Hay más proyectos de los que se han leído: acota el periodo o los filtros.' } : {}),
        resumen: { ...round(totals), cerrados: totals.proyectos - totals.abiertos },
        por_estado: toList(groups.estado, 'estado'),
        por_cliente: toList(groups.cliente, 'codcliente').slice(0, top),
        por_responsable: toList(groups.responsable, 'nick'),
        por_mes: toList(groups.mes, 'mes').sort((a, b) => String(a.mes).localeCompare(String(b.mes))),
        top_ventas: [...items].sort((a, b) => b.ventas - a.ventas).slice(0, top),
        top_margen: [...items].sort((a, b) => b.margen - a.margen).slice(0, top),
        margen_negativo: items.filter((item) => item.margen < 0).sort((a, b) => a.margen - b.margen),
    });
}

async function rentabilidadProyectos(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const { params, desde, hasta } = projectParams(args);
    const limit = typeof args.limit === 'number' && args.limit > 0 ? Math.floor(args.limit) : 50;
    const order = typeof args.orden === 'string' && args.orden !== '' ? args.orden : 'margen';
    if (!['margen', 'margen_pct', 'ventas', 'compras', 'pendiente'].includes(order)) {
        return fail('get_rentabilidad_proyectos: orden debe ser margen, margen_pct, ventas, compras o pendiente.');
    }

    const [{ rows, truncated }, statuses] = await Promise.all([
        fetchAll<Row>('/proyectos', params, connection),
        fetchCatalog('/estadoproyectos', 'idestado', connection),
    ]);

    const items = rows
        .map((row) => ({
            idproyecto: row.idproyecto,
            nombre: row.nombre,
            codcliente: row.codcliente ?? null,
            fecha: isoDate(row.fecha),
            estado: statuses.get(String(row.idestado))?.nombre ?? null,
            abierto: isTrue(row.editable),
            numdocs: num(row.numdocs),
            ...economics(row),
        }))
        .filter((item) => !isTrue(args.solo_con_movimientos) || item.ventas !== 0 || item.compras !== 0)
        .sort((a, b) => num(b[order as keyof typeof b]) - num(a[order as keyof typeof a]));

    const ventas = items.reduce((sum, item) => sum + item.ventas, 0);
    const compras = items.reduce((sum, item) => sum + item.compras, 0);
    return ok({
        periodo: { desde: desde ?? null, hasta: hasta ?? null },
        ...(truncated ? { aviso: 'Hay más proyectos de los que se han leído: acota el periodo o los filtros.' } : {}),
        totales: {
            proyectos: items.length,
            ventas: round2(ventas),
            compras: round2(compras),
            margen: round2(ventas - compras),
            margen_pct: ventas !== 0 ? round2(((ventas - compras) / ventas) * 100) : null,
            pendiente: round2(items.reduce((sum, item) => sum + item.pendiente, 0)),
            con_margen_negativo: items.filter((item) => item.margen < 0).length,
        },
        proyectos: items.slice(0, limit),
    });
}

async function informeTareas(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const desde = optionalIsoDate(args.fecha_desde, 'fecha_desde');
    const hasta = optionalIsoDate(args.fecha_hasta, 'fecha_hasta');
    const today = todayIso();

    const base: Row = {};
    if (args.idproyecto !== undefined && args.idproyecto !== '') base.idproyecto = args.idproyecto;
    if (typeof args.nick === 'string' && args.nick !== '') base.nick = args.nick;
    const params: Row = { ...base };
    if (desde) params.fecha_gte = desde;
    if (hasta) params.fecha_lte = hasta;
    const completedParams: Row = { ...base };
    if (desde) completedParams.fechacompletado_gte = desde;
    if (hasta) completedParams.fechacompletado_lte = `${hasta} 23:59:59`;

    const [{ rows, truncated }, phases, completed] = await Promise.all([
        fetchAll<Row>('/tareaproyectos', params, connection),
        fetchCatalog('/fasetareas', 'idfase', connection),
        desde || hasta
            ? fetchAll<Row>('/tareaproyectos', { ...completedParams, fechacompletado_notnull: 1 }, connection)
                  .then((r) => r.rows.length)
                  .catch(() => null)
            : Promise.resolve(null),
    ]);

    type Group = { tareas: number; abiertas: number; vencidas: number; completadas: number; canceladas: number; cantidad: number };
    const init = (): Group => ({ tareas: 0, abiertas: 0, vencidas: 0, completadas: 0, canceladas: 0, cantidad: 0 });
    const byPhase = new Map<string, Group>();
    const byUser = new Map<string, Group>();
    const byProject = new Map<string, Group>();
    const totals = init();
    let daysSum = 0;
    let daysCount = 0;

    for (const task of rows) {
        const tipo = phaseType(phases, task.idfase);
        const late = overdueDays(phases, task, today);
        const add = (g: Group): void => {
            g.tareas += 1;
            g.cantidad += num(task.cantidad);
            if (tipo === PHASE_COMPLETED) g.completadas += 1;
            else if (tipo === PHASE_CANCELED) g.canceladas += 1;
            else g.abiertas += 1;
            if (late !== null) g.vencidas += 1;
        };
        add(totals);
        const phaseName = phases.get(String(task.idfase))?.nombre;
        accumulate(byPhase, phaseName ? String(phaseName) : groupKey(task.idfase), init, add);
        accumulate(byUser, groupKey(task.nick), init, add);
        accumulate(byProject, String(task.idproyecto), init, add);

        const start = isoDate(task.fecha);
        const done = isoDate(task.fechacompletado);
        if (tipo === PHASE_COMPLETED && start && done) {
            daysSum += daysBetween(start, done);
            daysCount += 1;
        }
    }

    const toList = (map: Map<string, Group>, key: string): Row[] =>
        [...map].map(([name, g]) => ({ [key]: name, ...g })).sort((a, b) => num(b.abiertas) - num(a.abiertas));
    const topProjects = toList(byProject, 'idproyecto').slice(0, 20);
    const projects = await fetchByIds('/proyectos', 'idproyecto', topProjects.map((row) => row.idproyecto), connection);

    return ok({
        periodo: { desde: desde ?? null, hasta: hasta ?? null },
        ...(truncated ? { aviso: 'Hay más tareas de las que se han leído: acota el periodo o los filtros.' } : {}),
        resumen: {
            ...totals,
            dias_medios_hasta_completar: daysCount > 0 ? round2(daysSum / daysCount) : null,
            ...(completed !== null ? { completadas_en_periodo: completed } : {}),
        },
        por_fase: toList(byPhase, 'fase'),
        por_usuario: toList(byUser, 'nick'),
        por_proyecto: topProjects.map((row) => ({ ...row, nombre: projects.get(String(row.idproyecto))?.nombre ?? null })),
    });
}

async function tareasVencidas(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const reference = optionalIsoDate(args.fecha_referencia, 'fecha_referencia') ?? todayIso();
    const limit = typeof args.limit === 'number' && args.limit > 0 ? Math.floor(args.limit) : 100;

    const params: Row = { fechafin_lt: reference };
    if (args.idproyecto !== undefined && args.idproyecto !== '') params.idproyecto = args.idproyecto;
    if (typeof args.nick === 'string' && args.nick !== '') params.nick = args.nick;

    const [{ rows, truncated }, phases] = await Promise.all([
        fetchAll<Row>('/tareaproyectos', params, connection),
        fetchCatalog('/fasetareas', 'idfase', connection),
    ]);

    const overdue = rows
        .map((task) => ({ task, days: overdueDays(phases, task, reference) }))
        .filter((item): item is { task: Row; days: number } => item.days !== null);
    const projects = await fetchByIds('/proyectos', 'idproyecto', overdue.map(({ task }) => task.idproyecto), connection);

    const late = overdue
        .map(({ task, days }) => ({
            idtarea: task.idtarea,
            nombre: task.nombre,
            idproyecto: task.idproyecto,
            proyecto: projects.get(String(task.idproyecto))?.nombre ?? null,
            fase: phases.get(String(task.idfase))?.nombre ?? null,
            nick: task.nick ?? null,
            fechainicio: isoDate(task.fechainicio),
            fechafin: isoDate(task.fechafin),
            dias_retraso: days,
        }))
        .sort((a, b) => b.dias_retraso - a.dias_retraso);

    const byUser = new Map<string, number>();
    const byProject = new Map<string, number>();
    for (const task of late) {
        byUser.set(groupKey(task.nick), (byUser.get(groupKey(task.nick)) ?? 0) + 1);
        const project = `${task.idproyecto} ${task.proyecto ?? ''}`.trim();
        byProject.set(project, (byProject.get(project) ?? 0) + 1);
    }

    return ok({
        fecha_referencia: reference,
        ...(truncated ? { aviso: 'Hay más tareas de las que se han leído: acota los filtros.' } : {}),
        resumen: {
            vencidas: late.length,
            dias_medios_retraso: late.length > 0 ? round2(late.reduce((sum, t) => sum + t.dias_retraso, 0) / late.length) : 0,
            por_usuario: Object.fromEntries(byUser),
            por_proyecto: Object.fromEntries(byProject),
        },
        tareas: late.slice(0, limit),
    });
}

/**
 * Ejecuta una tool propia del plugin Proyectos. Devuelve null si no es suya.
 *
 * @param name nombre de la tool.
 * @param args argumentos de la llamada.
 */
export async function handleProyectosTool(name: string, args: ToolArgs): Promise<ToolResult | null> {
    switch (name) {
        case 'get_proyecto':
            return proyectoDetalle(args);
        case 'get_documentos_proyecto':
            return documentosProyecto(args);
        case 'set_proyecto_documento':
            return setProyectoDocumento(args);
        case 'set_estado_proyecto':
            return setEstadoProyecto(args);
        case 'set_fase_tarea_proyecto':
            return setFaseTarea(args);
        case 'get_informe_proyectos':
            return informeProyectos(args);
        case 'get_rentabilidad_proyectos':
            return rentabilidadProyectos(args);
        case 'get_informe_tareas_proyecto':
            return informeTareas(args);
        case 'get_tareas_proyecto_vencidas':
            return tareasVencidas(args);
        default:
            return null;
    }
}
