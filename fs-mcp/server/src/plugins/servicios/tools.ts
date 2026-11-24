/**
 * Tools propias del plugin Servicios que no son CRUD de un modelo: ficha
 * completa de un servicio, cambio de estado por nombre, historial de una
 * máquina e informes (resumen, servicios pendientes, trabajos por facturar y
 * horas trabajadas).
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';
import { pathId } from '../../utils/pathId.js';
import {
    accumulate,
    connectionOf,
    daysBetween,
    fetchAll,
    fetchCatalog,
    findByName,
    getOrNull,
    groupKey,
    isoDate,
    isTrue,
    mapLimit,
    num,
    optionalIsoDate,
    round2,
    todayIso,
} from '../shared/query.js';
import { CONNECTION_PROPERTY } from '../shared/resource.js';
import { fail, ok } from '../shared/result.js';
import type { ToolArgs, ToolResult } from '../types.js';
import { servicioATLog, WORK_STATUS } from './resources.js';

type Row = Record<string, unknown>;

/** Llamadas simultáneas al leer registros sueltos por id. */
const CONCURRENCY = 8;

/** Acciones de facturación pendientes de un trabajo y su valor en la columna estado. */
const PENDING_ACTIONS: Record<string, number> = { factura: 1, albaran: 3, presupuesto: 5 };

/** Documentos de venta que el plugin vincula a un servicio (columna idservicio). */
const LINKED_DOCUMENTS: Array<{ key: string; endpoint: string; id: string }> = [
    { key: 'presupuestos', endpoint: '/presupuestoclientes', id: 'idpresupuesto' },
    { key: 'albaranes', endpoint: '/albaranclientes', id: 'idalbaran' },
    { key: 'facturas', endpoint: '/facturaclientes', id: 'idfactura' },
];

const dateRangeProps = {
    fecha_desde: { type: 'string', description: 'Desde esta fecha incluida (YYYY-MM-DD)' },
    fecha_hasta: { type: 'string', description: 'Hasta esta fecha incluida (YYYY-MM-DD)' },
} as const;

export const SERVICIOS_TOOLS: Tool[] = [
    {
        name: 'get_servicio_at',
        description:
            'Ficha completa de un servicio SAT: datos del servicio con los nombres de su estado, prioridad, tipo y ' +
            'cliente, sus trabajos con importes y acción de facturación, las máquinas, la checklist de verificaciones, ' +
            'los presupuestos, albaranes y facturas generados y las últimas entradas del historial.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                idservicio: { type: 'number', description: 'Id del servicio' },
                codigo: { type: 'string', description: 'Código del servicio (ej. SER-000123), si no se conoce el id' },
                historial: { type: 'number', description: 'Entradas del historial a incluir (por defecto 20, 0 para ninguna)' },
            },
            required: [],
        },
    },
    {
        name: 'set_estado_servicio_at',
        description:
            'Cambia el estado de un servicio SAT indicando el id o el nombre del estado. El estado decide si el ' +
            'servicio queda abierto (editable) o cerrado, puede asignarlo a un usuario y enviar notificaciones; el ' +
            'cambio queda en el historial.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                idservicio: { type: 'number', description: 'Id del servicio' },
                idestado: { type: 'number', description: 'Id del nuevo estado' },
                estado: { type: 'string', description: 'Nombre del nuevo estado, si no se indica idestado (ej. "Terminado")' },
            },
            required: ['idservicio'],
        },
    },
    {
        name: 'get_historial_maquina_at',
        description:
            'Historial de una máquina: sus datos y todos los servicios SAT en los que aparece (como máquina 1 a 4), ' +
            'del más reciente al más antiguo, con su estado e importe.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                idmaquina: { type: 'number', description: 'Id de la máquina' },
            },
            required: ['idmaquina'],
        },
    },
    {
        name: 'get_informe_servicios_at',
        description:
            'Informe de servicios SAT de un periodo (por fecha del servicio): total, abiertos y cerrados, importe ' +
            'neto, y desglose por estado, prioridad, tipo, usuario asignado, agente, mes y principales clientes.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                ...dateRangeProps,
                codcliente: { type: 'string', description: 'Solo los servicios de este cliente' },
                codagente: { type: 'string', description: 'Solo los servicios de este agente' },
                asignado: { type: 'string', description: 'Solo los servicios asignados a este usuario (nick)' },
                codalmacen: { type: 'string', description: 'Solo los servicios de este almacén' },
                idempresa: { type: 'number', description: 'Solo los servicios de esta empresa' },
                idtipo: { type: 'number', description: 'Solo los servicios de este tipo' },
                top: { type: 'number', description: 'Clientes a mostrar en el ranking (por defecto 10)' },
            },
            required: [],
        },
    },
    {
        name: 'get_servicios_at_pendientes',
        description:
            'Servicios SAT abiertos (estado editable) ordenados de más antiguo a más reciente, con los días que ' +
            'llevan abiertos, estado, prioridad, asignado e importe, y el recuento por usuario asignado y por estado.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                asignado: { type: 'string', description: 'Solo los asignados a este usuario (nick)' },
                codagente: { type: 'string', description: 'Solo los de este agente' },
                codcliente: { type: 'string', description: 'Solo los de este cliente' },
                idestado: { type: 'number', description: 'Solo los de este estado' },
                idprioridad: { type: 'number', description: 'Solo los de esta prioridad' },
                dias_minimos: { type: 'number', description: 'Solo los que llevan abiertos al menos estos días' },
                limit: { type: 'number', description: 'Servicios a listar (por defecto 50); los totales cuentan todos' },
            },
            required: [],
        },
    },
    {
        name: 'get_trabajos_at_pendientes',
        description:
            'Trabajos de servicios SAT marcados para facturar, hacer albarán o hacer presupuesto que aún no se han ' +
            'generado, agrupados por servicio, con el importe (precio × cantidad, sin impuestos) por acción y por ' +
            'cliente. Los documentos se generan desde la ficha del servicio en FacturaScripts.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                accion: {
                    type: 'string',
                    enum: ['factura', 'albaran', 'presupuesto', 'todas'],
                    description: 'Acción pendiente a consultar (por defecto todas)',
                },
                codcliente: { type: 'string', description: 'Solo los servicios de este cliente' },
                idservicio: { type: 'number', description: 'Solo los trabajos de este servicio' },
            },
            required: [],
        },
    },
    {
        name: 'get_horas_trabajos_at',
        description:
            'Horas trabajadas en los servicios SAT en un periodo (por fecha de inicio del trabajo), calculadas con ' +
            'las fechas y horas de inicio y fin de cada trabajo, por usuario y por agente, con su importe. Los ' +
            'trabajos sin hora de fin se cuentan aparte.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                ...dateRangeProps,
                nick: { type: 'string', description: 'Solo los trabajos de este usuario' },
                codagente: { type: 'string', description: 'Solo los trabajos de este agente' },
                idservicio: { type: 'number', description: 'Solo los trabajos de este servicio' },
            },
            required: [],
        },
    },
];

/**
 * Carga un servicio por id o por código.
 *
 * @param args       argumentos con idservicio o codigo.
 * @param connection conexión a usar.
 * @throws Error si no se indica ninguno o no existe.
 */
async function loadService(args: ToolArgs, connection: string | undefined): Promise<Row> {
    if (args.idservicio !== undefined && args.idservicio !== null && args.idservicio !== '') {
        return fsClient.get<Row>(`/servicioates/${pathId(args.idservicio)}`, undefined, connection);
    }
    if (typeof args.codigo === 'string' && args.codigo !== '') {
        const rows = await fsClient.get<Row[]>('/servicioates', { codigo: args.codigo, limit: 2 }, connection);
        if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error(`No existe ningún servicio con código «${args.codigo}».`);
        }
        return rows[0] as Row;
    }
    throw new Error('Indica idservicio o codigo.');
}

/**
 * Importe de un trabajo: precio × cantidad.
 *
 * @param work trabajo.
 */
function workAmount(work: Row): number {
    return num(work.precio) * num(work.cantidad);
}

/**
 * Nombre de un registro de catálogo, o null si no está.
 *
 * @param catalog catálogo indexado por id.
 * @param id      identificador.
 * @param field   campo con el nombre.
 */
function nameIn(catalog: Map<string, Row>, id: unknown, field = 'nombre'): string | null {
    const row = catalog.get(String(id));
    return row ? String(row[field] ?? '') : null;
}

async function servicioDetalle(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const service = await loadService(args, connection);
    const id = service.idservicio;
    const historyLimit = typeof args.historial === 'number' && args.historial >= 0 ? args.historial : 20;

    const machineIds = [service.idmaquina, service.idmaquina2, service.idmaquina3, service.idmaquina4]
        .filter((value) => value !== null && value !== undefined && value !== '');

    const [works, status, priority, type, customer, machines, checks, checkCatalog, categories, categoryCatalog, history, documents] =
        await Promise.all([
            fetchAll<Row>('/trabajoates', { idservicio: id, 'sort[fechainicio]': 'ASC', 'sort[horainicio]': 'ASC' }, connection),
            getOrNull('/estadoates', service.idestado, connection),
            getOrNull('/prioridadates', service.idprioridad, connection),
            getOrNull('/tipoates', service.idtipo, connection),
            getOrNull('/clientes', service.codcliente, connection),
            mapLimit(machineIds, CONCURRENCY, (machineId) => getOrNull('/maquinaates', machineId, connection)),
            fetchAll<Row>('/serviciocheckates', { idservice: id }, connection).catch(() => ({ rows: [], truncated: false })),
            fetchCatalog('/checkates', 'id', connection),
            fetchAll<Row>('/serviciocategoriaates', { idservice: id }, connection).catch(() => ({ rows: [], truncated: false })),
            fetchCatalog('/categoriaates', 'id', connection),
            historyLimit === 0
                ? Promise.resolve([] as Row[])
                : fsClient
                      .get<Row[]>(servicioATLog.meta.endpoint, { idservicio: id, 'sort[creationdate]': 'DESC', 'sort[id]': 'DESC', limit: historyLimit }, connection)
                      .catch(() => [] as Row[]),
            Promise.all(
                LINKED_DOCUMENTS.map(async (doc) => {
                    try {
                        const rows = await fsClient.get<Row[]>(doc.endpoint, { idservicio: id, limit: 50 }, connection);
                        return [doc.key, (Array.isArray(rows) ? rows : []).map((row) => ({
                            [doc.id]: row[doc.id],
                            codigo: row.codigo,
                            fecha: row.fecha,
                            neto: row.neto,
                            total: row.total,
                            ...(row.pagada !== undefined ? { pagada: row.pagada } : {}),
                            editable: row.editable,
                        }))] as const;
                    } catch {
                        return [doc.key, []] as const;
                    }
                }),
            ),
        ]);

    const byAction = new Map<string, { trabajos: number; importe: number }>();
    const workRows = works.rows.map((work) => {
        const amount = workAmount(work);
        const action = WORK_STATUS[num(work.estado)] ?? String(work.estado);
        accumulate(byAction, action, () => ({ trabajos: 0, importe: 0 }), (g) => {
            g.trabajos += 1;
            g.importe += amount;
        });
        return { ...work, accion: action, importe: round2(amount) };
    });

    const verificaciones = checks.rows.map((check) => {
        const definition = checkCatalog.get(String(check.idcheck));
        return {
            id: check.id,
            idcheck: check.idcheck,
            comprobacion: definition?.name ?? null,
            categoria: definition ? nameIn(categoryCatalog, definition.idcategory, 'name') : null,
            checked: isTrue(check.checked),
            completed: check.completed ?? null,
        };
    });
    const done = verificaciones.filter((v) => v.checked).length;

    return ok({
        servicio: {
            ...service,
            estado_nombre: status?.nombre ?? null,
            prioridad_nombre: priority?.nombre ?? null,
            tipo_nombre: type?.name ?? null,
            cliente_nombre: customer?.nombre ?? null,
        },
        resumen_trabajos: {
            trabajos: workRows.length,
            importe: round2(workRows.reduce((sum, work) => sum + work.importe, 0)),
            por_accion: Object.fromEntries([...byAction].map(([key, g]) => [key, { ...g, importe: round2(g.importe) }])),
        },
        trabajos: workRows,
        maquinas: machines.filter((machine) => machine !== null),
        checklist: {
            categorias: categories.rows.map((row) => ({
                id: row.id,
                idcategory: row.idcategory,
                nombre: nameIn(categoryCatalog, row.idcategory, 'name'),
            })),
            hechas: done,
            pendientes: verificaciones.length - done,
            verificaciones,
        },
        documentos: Object.fromEntries(documents),
        historial: history,
    });
}

async function setEstadoServicio(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.idservicio);
    let statusId = args.idestado;
    let status: Row | null = null;

    if (statusId === undefined || statusId === null || statusId === '') {
        if (typeof args.estado !== 'string' || args.estado.trim() === '') {
            return fail('set_estado_servicio_at: indica idestado o el nombre del estado.');
        }
        const { rows } = await fetchAll<Row>('/estadoates', {}, connection);
        status = findByName(rows, 'nombre', args.estado);
        statusId = status.id;
    } else {
        status = await getOrNull('/estadoates', statusId, connection);
        if (!status) return fail(`set_estado_servicio_at: no existe el estado ${String(statusId)}.`);
    }

    const result = await fsClient.put<Row>(`/servicioates/${id}`, { idestado: statusId }, connection);
    return ok({
        estado: { id: status.id, nombre: status.nombre, editable: status.editable, asignado: status.asignado ?? null },
        resultado: result,
    });
}

async function historialMaquina(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const machine = await fsClient.get<Row>(`/maquinaates/${pathId(args.idmaquina)}`, undefined, connection);
    const id = machine.idmaquina;

    const [lists, statuses] = await Promise.all([
        Promise.all(['idmaquina', 'idmaquina2', 'idmaquina3', 'idmaquina4'].map((field) =>
            fetchAll<Row>('/servicioates', { [field]: id }, connection))),
        fetchCatalog('/estadoates', 'id', connection),
    ]);

    const services = new Map<string, Row>();
    for (const list of lists) {
        for (const row of list.rows) services.set(String(row.idservicio), row);
    }
    const rows = [...services.values()]
        .map((row) => ({
            idservicio: row.idservicio,
            codigo: row.codigo,
            fecha: isoDate(row.fecha),
            codcliente: row.codcliente,
            estado: nameIn(statuses, row.idestado),
            abierto: isTrue(row.editable),
            asignado: row.asignado ?? null,
            neto: num(row.neto),
            descripcion: row.descripcion ?? null,
            solucion: row.solucion ?? null,
        }))
        .sort((a, b) => String(b.fecha ?? '').localeCompare(String(a.fecha ?? '')));

    return ok({
        maquina: machine,
        resumen: {
            servicios: rows.length,
            abiertos: rows.filter((row) => row.abierto).length,
            importe_total: round2(rows.reduce((sum, row) => sum + row.neto, 0)),
            ultimo_servicio: rows[0]?.fecha ?? null,
        },
        servicios: rows,
    });
}

async function informeServicios(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const desde = optionalIsoDate(args.fecha_desde, 'fecha_desde');
    const hasta = optionalIsoDate(args.fecha_hasta, 'fecha_hasta');
    const top = typeof args.top === 'number' && args.top > 0 ? Math.floor(args.top) : 10;

    const params: Row = {};
    if (desde) params.fecha_gte = desde;
    if (hasta) params.fecha_lte = hasta;
    for (const field of ['codcliente', 'codagente', 'asignado', 'codalmacen', 'idempresa', 'idtipo']) {
        if (args[field] !== undefined && args[field] !== '') params[field] = args[field];
    }

    const [{ rows, truncated }, statuses, priorities, types] = await Promise.all([
        fetchAll<Row>('/servicioates', params, connection),
        fetchCatalog('/estadoates', 'id', connection),
        fetchCatalog('/prioridadates', 'id', connection),
        fetchCatalog('/tipoates', 'id', connection),
    ]);

    type Group = { servicios: number; abiertos: number; neto: number };
    const init = (): Group => ({ servicios: 0, abiertos: 0, neto: 0 });
    const groups = {
        estado: new Map<string, Group>(),
        prioridad: new Map<string, Group>(),
        tipo: new Map<string, Group>(),
        asignado: new Map<string, Group>(),
        agente: new Map<string, Group>(),
        cliente: new Map<string, Group>(),
        mes: new Map<string, Group>(),
    };

    let open = 0;
    let total = 0;
    for (const row of rows) {
        const isOpen = isTrue(row.editable);
        const neto = num(row.neto);
        if (isOpen) open += 1;
        total += neto;
        const add = (g: Group): void => {
            g.servicios += 1;
            g.neto += neto;
            if (isOpen) g.abiertos += 1;
        };
        accumulate(groups.estado, nameIn(statuses, row.idestado) ?? groupKey(row.idestado), init, add);
        accumulate(groups.prioridad, nameIn(priorities, row.idprioridad) ?? groupKey(row.idprioridad), init, add);
        accumulate(groups.tipo, nameIn(types, row.idtipo, 'name') ?? groupKey(row.idtipo), init, add);
        accumulate(groups.asignado, groupKey(row.asignado), init, add);
        accumulate(groups.agente, groupKey(row.codagente), init, add);
        accumulate(groups.cliente, groupKey(row.codcliente), init, add);
        accumulate(groups.mes, (isoDate(row.fecha) ?? '(sin fecha)').slice(0, 7), init, add);
    }

    const toList = (map: Map<string, Group>, key: string): Row[] =>
        [...map].map(([name, g]) => ({ [key]: name, ...g, neto: round2(g.neto) }))
            .sort((a, b) => num(b.servicios) - num(a.servicios));

    // nombre de los clientes del ranking
    const topClients = toList(groups.cliente, 'codcliente').slice(0, top);
    const names = await mapLimit(topClients, CONCURRENCY, (row) =>
        row.codcliente === '(sin asignar)' ? Promise.resolve(null) : getOrNull('/clientes', row.codcliente, connection));
    topClients.forEach((row, i) => {
        row.nombre = names[i]?.nombre ?? null;
    });

    return ok({
        periodo: { desde: desde ?? null, hasta: hasta ?? null },
        ...(truncated ? { aviso: 'Hay más servicios de los que se han leído: acota el periodo o los filtros.' } : {}),
        resumen: {
            servicios: rows.length,
            abiertos: open,
            cerrados: rows.length - open,
            neto_total: round2(total),
            neto_medio: rows.length > 0 ? round2(total / rows.length) : 0,
        },
        por_estado: toList(groups.estado, 'estado'),
        por_prioridad: toList(groups.prioridad, 'prioridad'),
        por_tipo: toList(groups.tipo, 'tipo'),
        por_asignado: toList(groups.asignado, 'asignado'),
        por_agente: toList(groups.agente, 'codagente'),
        por_mes: toList(groups.mes, 'mes').sort((a, b) => String(a.mes).localeCompare(String(b.mes))),
        top_clientes: topClients,
    });
}

async function serviciosPendientes(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const limit = typeof args.limit === 'number' && args.limit > 0 ? Math.floor(args.limit) : 50;
    const minDays = typeof args.dias_minimos === 'number' ? args.dias_minimos : 0;

    const params: Row = { editable: true };
    for (const field of ['asignado', 'codagente', 'codcliente', 'idestado', 'idprioridad']) {
        if (args[field] !== undefined && args[field] !== '') params[field] = args[field];
    }

    const [{ rows, truncated }, statuses, priorities] = await Promise.all([
        fetchAll<Row>('/servicioates', params, connection),
        fetchCatalog('/estadoates', 'id', connection),
        fetchCatalog('/prioridadates', 'id', connection),
    ]);

    const today = todayIso();
    const pending = rows
        .map((row) => {
            const fecha = isoDate(row.fecha);
            return {
                idservicio: row.idservicio,
                codigo: row.codigo,
                fecha,
                dias_abierto: fecha ? daysBetween(fecha, today) : null,
                codcliente: row.codcliente ?? null,
                estado: nameIn(statuses, row.idestado),
                prioridad: nameIn(priorities, row.idprioridad),
                asignado: row.asignado ?? null,
                codagente: row.codagente ?? null,
                neto: num(row.neto),
                descripcion: typeof row.descripcion === 'string' ? row.descripcion.slice(0, 200) : null,
            };
        })
        .filter((row) => (row.dias_abierto ?? 0) >= minDays)
        .sort((a, b) => (b.dias_abierto ?? 0) - (a.dias_abierto ?? 0));

    const byAssigned = new Map<string, number>();
    const byStatus = new Map<string, number>();
    for (const row of pending) {
        byAssigned.set(groupKey(row.asignado), (byAssigned.get(groupKey(row.asignado)) ?? 0) + 1);
        byStatus.set(groupKey(row.estado), (byStatus.get(groupKey(row.estado)) ?? 0) + 1);
    }

    return ok({
        ...(truncated ? { aviso: 'Hay más servicios abiertos de los que se han leído: acota los filtros.' } : {}),
        resumen: {
            pendientes: pending.length,
            neto_pendiente: round2(pending.reduce((sum, row) => sum + row.neto, 0)),
            dias_medios_abierto: pending.length > 0
                ? round2(pending.reduce((sum, row) => sum + (row.dias_abierto ?? 0), 0) / pending.length)
                : 0,
            por_asignado: Object.fromEntries(byAssigned),
            por_estado: Object.fromEntries(byStatus),
        },
        servicios: pending.slice(0, limit),
    });
}

async function trabajosPendientes(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const action = typeof args.accion === 'string' && args.accion !== '' ? args.accion : 'todas';
    const actions = action === 'todas' ? Object.keys(PENDING_ACTIONS) : [action];
    if (actions.some((a) => PENDING_ACTIONS[a] === undefined)) {
        return fail('get_trabajos_at_pendientes: accion debe ser factura, albaran, presupuesto o todas.');
    }

    const lists = await Promise.all(actions.map((a) => {
        const params: Row = { estado: PENDING_ACTIONS[a] };
        if (args.idservicio !== undefined && args.idservicio !== '') params.idservicio = args.idservicio;
        return fetchAll<Row>('/trabajoates', params, connection);
    }));
    const works = lists.flatMap((list) => list.rows);
    const truncated = lists.some((list) => list.truncated);

    const serviceIds = [...new Set(works.map((work) => String(work.idservicio)))];
    const services = await mapLimit(serviceIds, CONCURRENCY, (id) => getOrNull('/servicioates', id, connection));
    const serviceById = new Map(serviceIds.map((id, i) => [id, services[i]] as const));

    type ServiceGroup = { servicio: Row; trabajos: Row[]; importe: number };
    const byService = new Map<string, ServiceGroup>();
    const byAction = new Map<string, { trabajos: number; importe: number }>();
    const byClient = new Map<string, { servicios: Set<string>; trabajos: number; importe: number }>();

    for (const work of works) {
        const service = serviceById.get(String(work.idservicio)) ?? null;
        if (typeof args.codcliente === 'string' && args.codcliente !== '' && service?.codcliente !== args.codcliente) {
            continue;
        }
        const amount = workAmount(work);
        const actionName = WORK_STATUS[num(work.estado)] ?? String(work.estado);
        accumulate(byService, String(work.idservicio), () => ({
            servicio: {
                idservicio: work.idservicio,
                codigo: service?.codigo ?? null,
                fecha: service?.fecha ?? null,
                codcliente: service?.codcliente ?? null,
                abierto: service ? isTrue(service.editable) : null,
            },
            trabajos: [],
            importe: 0,
        }), (g) => {
            g.trabajos.push({
                idtrabajo: work.idtrabajo,
                accion: actionName,
                referencia: work.referencia ?? null,
                descripcion: work.descripcion ?? null,
                cantidad: num(work.cantidad),
                precio: num(work.precio),
                importe: round2(amount),
                fechainicio: work.fechainicio ?? null,
            });
            g.importe += amount;
        });
        accumulate(byAction, actionName, () => ({ trabajos: 0, importe: 0 }), (g) => {
            g.trabajos += 1;
            g.importe += amount;
        });
        accumulate(byClient, groupKey(service?.codcliente), () => ({ servicios: new Set<string>(), trabajos: 0, importe: 0 }), (g) => {
            g.servicios.add(String(work.idservicio));
            g.trabajos += 1;
            g.importe += amount;
        });
    }

    const groups = [...byService.values()].sort((a, b) => b.importe - a.importe);
    return ok({
        ...(truncated ? { aviso: 'Hay más trabajos pendientes de los que se han leído: acota los filtros.' } : {}),
        resumen: {
            servicios: groups.length,
            trabajos: groups.reduce((sum, g) => sum + g.trabajos.length, 0),
            importe: round2(groups.reduce((sum, g) => sum + g.importe, 0)),
            por_accion: Object.fromEntries([...byAction].map(([key, g]) => [key, { ...g, importe: round2(g.importe) }])),
            por_cliente: [...byClient]
                .map(([codcliente, g]) => ({ codcliente, servicios: g.servicios.size, trabajos: g.trabajos, importe: round2(g.importe) }))
                .sort((a, b) => b.importe - a.importe),
        },
        servicios: groups.map((g) => ({ ...g.servicio, importe: round2(g.importe), trabajos: g.trabajos })),
    });
}

/**
 * Instante local de una fecha de la API y una hora HH:MM[:SS], o null.
 *
 * @param date fecha tal como la devuelve la API.
 * @param time hora.
 */
function instant(date: unknown, time: unknown): number | null {
    const iso = isoDate(date);
    if (!iso || typeof time !== 'string' || !/^\d{1,2}:\d{2}(:\d{2})?$/.test(time)) return null;
    const [h = '0', m = '0', s = '0'] = time.split(':');
    const [y = '0', mo = '1', d = '1'] = iso.split('-');
    return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(m), Number(s)).getTime();
}

async function horasTrabajos(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const desde = optionalIsoDate(args.fecha_desde, 'fecha_desde');
    const hasta = optionalIsoDate(args.fecha_hasta, 'fecha_hasta');

    const params: Row = {};
    if (desde) params.fechainicio_gte = desde;
    if (hasta) params.fechainicio_lte = hasta;
    for (const field of ['nick', 'codagente', 'idservicio']) {
        if (args[field] !== undefined && args[field] !== '') params[field] = args[field];
    }
    const { rows, truncated } = await fetchAll<Row>('/trabajoates', params, connection);

    type Group = { trabajos: number; horas: number; importe: number; sin_hora_fin: number; servicios: Set<string> };
    const init = (): Group => ({ trabajos: 0, horas: 0, importe: 0, sin_hora_fin: 0, servicios: new Set() });
    const byUser = new Map<string, Group>();
    const byAgent = new Map<string, Group>();
    const totals = init();

    for (const work of rows) {
        const start = instant(work.fechainicio, work.horainicio);
        const end = instant(work.fechafin ?? work.fechainicio, work.horafin);
        const hours = start !== null && end !== null && end > start ? (end - start) / 3600000 : null;
        const amount = workAmount(work);
        const add = (g: Group): void => {
            g.trabajos += 1;
            g.importe += amount;
            g.servicios.add(String(work.idservicio));
            if (hours === null) g.sin_hora_fin += 1;
            else g.horas += hours;
        };
        add(totals);
        accumulate(byUser, groupKey(work.nick), init, add);
        accumulate(byAgent, groupKey(work.codagente), init, add);
    }

    const format = (g: Group): Row => ({
        trabajos: g.trabajos,
        servicios: g.servicios.size,
        horas: round2(g.horas),
        importe: round2(g.importe),
        sin_hora_fin: g.sin_hora_fin,
    });
    const toList = (map: Map<string, Group>, key: string): Row[] =>
        [...map].map(([name, g]) => ({ [key]: name, ...format(g) })).sort((a, b) => num(b.horas) - num(a.horas));

    return ok({
        periodo: { desde: desde ?? null, hasta: hasta ?? null },
        ...(truncated ? { aviso: 'Hay más trabajos de los que se han leído: acota el periodo o los filtros.' } : {}),
        resumen: format(totals),
        por_usuario: toList(byUser, 'nick'),
        por_agente: toList(byAgent, 'codagente'),
    });
}

/**
 * Ejecuta una tool propia del plugin Servicios. Devuelve null si no es suya.
 *
 * @param name nombre de la tool.
 * @param args argumentos de la llamada.
 */
export async function handleServiciosTool(name: string, args: ToolArgs): Promise<ToolResult | null> {
    switch (name) {
        case 'get_servicio_at':
            return servicioDetalle(args);
        case 'set_estado_servicio_at':
            return setEstadoServicio(args);
        case 'get_historial_maquina_at':
            return historialMaquina(args);
        case 'get_informe_servicios_at':
            return informeServicios(args);
        case 'get_servicios_at_pendientes':
            return serviciosPendientes(args);
        case 'get_trabajos_at_pendientes':
            return trabajosPendientes(args);
        case 'get_horas_trabajos_at':
            return horasTrabajos(args);
        default:
            return null;
    }
}
