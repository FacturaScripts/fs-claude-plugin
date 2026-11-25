/**
 * Tools propias del plugin CRM que no son CRUD de un modelo: fichas completas
 * de oportunidad, contacto y campaña, cambio de estado por nombre, convertir
 * una oportunidad en presupuesto o vincularla a uno existente, archivos de las
 * oportunidades y de las campañas, contactos de las listas en bloque, añadir
 * una lista a una campaña, enviar su prueba y cambiar su estado, e informes
 * (embudo, avisos y oportunidades sin actividad).
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
import {
    DELETE_ATTACHMENT_PROPERTIES,
    deleteAttachment,
    listAttachments,
    UPDATE_ATTACHMENT_PROPERTIES,
    updateAttachment,
    UPLOAD_SAFETY_TEXT,
    uploadAttachment,
} from '../shared/attachments.js';
import { CONNECTION_PROPERTY } from '../shared/resource.js';
import { fail, isMissingResource, ok } from '../shared/result.js';
import type { ToolArgs, ToolResult } from '../types.js';
import { CAMPAIGN_STATUS, CAMPAIGN_STATUS_VALUE } from './resources.js';

type Row = Record<string, unknown>;

/** Clase del modelo de las oportunidades, con la que se relacionan sus archivos. */
const OPPORTUNITY_MODEL = 'CrmOportunidad';

/** Clase del modelo de las campañas, con la que se relacionan sus adjuntos. */
const CAMPAIGN_MODEL = 'CrmCampaign';

/** Versión del plugin CRM que añade los endpoints de las campañas. */
const CAMPAIGN_ENDPOINTS_VERSION = '3.6';

/** Notas de la ficha de un contacto o de una oportunidad. */
const NOTES_LIMIT = 50;

const LINE_ITEM = {
    type: 'object',
    properties: {
        referencia: { type: 'string', description: 'Referencia del producto' },
        descripcion: { type: 'string', description: 'Descripción' },
        cantidad: { type: 'number', description: 'Cantidad' },
        pvpunitario: { type: 'number', description: 'Precio unitario sin impuestos' },
        dtopor: { type: 'number', description: 'Descuento en porcentaje' },
        codimpuesto: { type: 'string', description: 'Código de impuesto' },
    },
} as const;

export const CRM_TOOLS: Tool[] = [
    {
        name: 'get_oportunidad_crm',
        description:
            'Ficha completa de una oportunidad del CRM: datos con su estado, contacto (y su cliente), interés y fuente, ' +
            'el presupuesto vinculado, sus notas y sus archivos adjuntos.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Número (id) de la oportunidad' },
            },
            required: ['id'],
        },
    },
    {
        name: 'set_estado_oportunidad_crm',
        description:
            'Cambia el estado de una oportunidad indicando el id o el nombre del estado (ej. "Ganada"). El estado decide ' +
            'si queda abierta o cerrada y si cuenta como perdida; al cerrarla se guarda la fecha de cierre.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Número (id) de la oportunidad' },
                idestado: { type: 'number', description: 'Id del nuevo estado' },
                estado: { type: 'string', description: 'Nombre del nuevo estado, si no se indica idestado' },
            },
            required: ['id'],
        },
    },
    {
        name: 'create_presupuesto_oportunidad_crm',
        description:
            'Convierte una oportunidad en presupuesto: crea un presupuesto de cliente para el cliente del contacto ' +
            '(con el agente de la oportunidad y las líneas indicadas) y lo vincula a la oportunidad, que pasa a tomar ' +
            'su neto. El contacto tiene que tener un cliente asociado; si no, créalo o asígnale uno con update_contacto.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Número (id) de la oportunidad' },
                lineas: { type: 'array', items: LINE_ITEM, description: 'Líneas del presupuesto (opcional: sin líneas se crea vacío)' },
                fecha: { type: 'string', description: 'Fecha del presupuesto (YYYY-MM-DD). Por defecto, hoy' },
                codserie: { type: 'string', description: 'Serie del presupuesto' },
                codalmacen: { type: 'string', description: 'Almacén del presupuesto' },
                finoferta: { type: 'string', description: 'Fecha de fin de validez (YYYY-MM-DD)' },
                observaciones: { type: 'string', description: 'Observaciones del presupuesto' },
            },
            required: ['id'],
        },
    },
    {
        name: 'set_presupuesto_oportunidad_crm',
        description:
            'Vincula una oportunidad a un presupuesto de cliente que ya existe (y toma su neto), o la desvincula. Un ' +
            'presupuesto solo puede estar vinculado a una oportunidad.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Número (id) de la oportunidad' },
                idpresupuesto: { type: 'number', description: 'Presupuesto de cliente a vincular' },
                desvincular: { type: 'boolean', description: 'true para quitar el presupuesto vinculado' },
            },
            required: ['id'],
        },
    },
    {
        name: 'get_archivos_oportunidad_crm',
        description: 'Archivos adjuntos de una oportunidad del CRM, con su nombre, tipo, tamaño y enlaces de descarga.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Número (id) de la oportunidad' },
            },
            required: ['id'],
        },
    },
    {
        name: 'create_archivo_oportunidad_crm',
        description:
            'Sube un archivo del equipo local a FacturaScripts y lo adjunta a una oportunidad del CRM. Avisa por email ' +
            'al creador, al asignado y al agente de la oportunidad (plugin CRM 3.6 o posterior). ' + UPLOAD_SAFETY_TEXT,
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Número (id) de la oportunidad' },
                ruta: { type: 'string', description: 'Ruta absoluta del archivo en este equipo' },
                observaciones: { type: 'string', description: 'Observaciones del adjunto' },
                nick: { type: 'string', description: 'Usuario que adjunta el archivo (nick)' },
            },
            required: ['id', 'ruta'],
        },
    },
    {
        name: 'update_archivo_oportunidad_crm',
        description:
            'Cambia las observaciones de un archivo adjunto a una oportunidad (por el id de la relación que devuelve ' +
            'get_archivos_oportunidad_crm).',
        inputSchema: {
            type: 'object',
            properties: UPDATE_ATTACHMENT_PROPERTIES,
            required: ['idrelacion', 'observaciones'],
        },
    },
    {
        name: 'delete_archivo_oportunidad_crm',
        description:
            'Quita un archivo adjunto de una oportunidad (por el id de la relación que devuelve ' +
            'get_archivos_oportunidad_crm). Con borrar_archivo=true borra también el archivo si nada más lo usa. Irreversible.',
        inputSchema: {
            type: 'object',
            properties: DELETE_ATTACHMENT_PROPERTIES,
            required: ['idrelacion'],
        },
    },
    {
        name: 'get_contacto_crm',
        description:
            'Ficha CRM de un contacto: sus datos (con la fuente y el cliente asociado), intereses, listas, ' +
            'oportunidades con su estado e importe y últimas notas.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                idcontacto: { type: 'number', description: 'Id del contacto' },
            },
            required: ['idcontacto'],
        },
    },
    {
        name: 'get_informe_oportunidades_crm',
        description:
            'Informe de oportunidades del CRM (por fecha de alta): abiertas, ganadas y perdidas, tasa de conversión, ' +
            'importe (neto del presupuesto o, si no hay, el aproximado), días medios hasta el cierre y desglose por ' +
            'estado en el orden del embudo, interés, fuente, usuario asignado, agente y mes.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                fecha_desde: { type: 'string', description: 'Desde esta fecha de alta incluida (YYYY-MM-DD)' },
                fecha_hasta: { type: 'string', description: 'Hasta esta fecha de alta incluida (YYYY-MM-DD)' },
                asignado: { type: 'string', description: 'Solo las asignadas a este usuario (nick)' },
                codagente: { type: 'string', description: 'Solo las de este agente' },
                idinteres: { type: 'number', description: 'Solo las de este interés' },
                idfuente: { type: 'number', description: 'Solo las de esta fuente' },
            },
            required: [],
        },
    },
    {
        name: 'get_avisos_crm',
        description:
            'Recordatorios de las notas del CRM (fecha de aviso) entre dos fechas: por defecto los vencidos sin ' +
            'notificar y los de los próximos 7 días, con su contacto y oportunidad.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                fecha_desde: { type: 'string', description: 'Desde esta fecha de aviso (YYYY-MM-DD). Por defecto, sin límite' },
                fecha_hasta: { type: 'string', description: 'Hasta esta fecha de aviso (YYYY-MM-DD). Por defecto, dentro de 7 días' },
                nick: { type: 'string', description: 'Solo las notas de este usuario' },
                incluir_notificados: { type: 'boolean', description: 'Incluir los avisos ya enviados (por defecto no)' },
            },
            required: [],
        },
    },
    {
        name: 'get_oportunidades_crm_sin_actividad',
        description:
            'Oportunidades abiertas sin actividad (ni cambios ni notas) en los últimos días indicados, de la más ' +
            'olvidada a la más reciente, para hacer seguimiento.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                dias: { type: 'number', description: 'Días sin actividad (por defecto 30)' },
                asignado: { type: 'string', description: 'Solo las asignadas a este usuario (nick)' },
                codagente: { type: 'string', description: 'Solo las de este agente' },
            },
            required: [],
        },
    },
    {
        name: 'set_contactos_lista_crm',
        description:
            'Añade y quita contactos de una lista del CRM por su idcontacto, como los botones de la ficha de la lista. ' +
            'Los que ya están (al añadir) o no están (al quitar) se ignoran. El número de contactos de la lista se ' +
            'recalcula solo.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                idlista: { type: 'number', description: 'Id de la lista' },
                anadir: { type: 'array', items: { type: 'number' }, description: 'idcontacto de los contactos a añadir' },
                quitar: { type: 'array', items: { type: 'number' }, description: 'idcontacto de los contactos a quitar' },
            },
            required: ['idlista'],
        },
    },
    {
        name: 'get_campana_crm',
        description:
            'Ficha completa de una campaña de email del CRM: datos y estado, destinatarios (total, enviados, ' +
            'pendientes y abiertos, por cuenta de salida), adjuntos que se envían con cada email y cuentas de correo ' +
            'de salida disponibles.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Id de la campaña' },
            },
            required: ['id'],
        },
    },
    {
        name: 'set_estado_campana_crm',
        description:
            'Cambia el estado de una campaña: enviando (el cron la envía por lotes dentro de su horario y días), ' +
            'borrador (la pausa) o enviada (la da por terminada). No se puede poner a enviar una campaña sin ' +
            'destinatarios. Confirma antes con el usuario: los emails se envían de verdad.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Id de la campaña' },
                estado: { type: 'string', enum: Object.keys(CAMPAIGN_STATUS_VALUE), description: 'Nuevo estado' },
            },
            required: ['id', 'estado'],
        },
    },
    {
        name: 'anadir_lista_campana_crm',
        description:
            'Añade a una campaña todos los contactos con email de una lista del CRM, sin repetir los que ya tiene, ' +
            'como el botón «Añadir contactos» de la ficha de la campaña. Requiere CRM ' + CAMPAIGN_ENDPOINTS_VERSION +
            ' o posterior.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Id de la campaña' },
                idlista: { type: 'number', description: 'Id de la lista de contactos' },
                outgoing_email: {
                    type: 'string',
                    description: 'Cuenta de correo de salida (de get_campana_crm, buzones). Si se omite, la primera disponible',
                },
            },
            required: ['id', 'idlista'],
        },
    },
    {
        name: 'enviar_prueba_campana_crm',
        description:
            'Envía un email de prueba de la campaña a una dirección, como el botón «Prueba» de la ficha: mismo asunto, ' +
            'contenido, adjuntos y enlace de baja que recibirán los destinatarios. No cambia el estado ni las ' +
            'estadísticas. Requiere CRM ' + CAMPAIGN_ENDPOINTS_VERSION + ' o posterior.',
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Id de la campaña' },
                email: { type: 'string', description: 'Email al que enviar la prueba' },
                outgoing_email: { type: 'string', description: 'Cuenta de correo de salida. Si se omite, la primera disponible' },
                nombre: { type: 'string', description: 'Nombre para {name} en el texto. Por defecto, el email' },
            },
            required: ['id', 'email'],
        },
    },
    {
        name: 'get_archivos_campana_crm',
        description: 'Archivos adjuntos de una campaña de email (se envían con cada email), con su nombre, tamaño y observaciones.',
        inputSchema: {
            type: 'object',
            properties: { connection: CONNECTION_PROPERTY, id: { type: 'number', description: 'Id de la campaña' } },
            required: ['id'],
        },
    },
    {
        name: 'create_archivo_campana_crm',
        description:
            'Sube un archivo del equipo local y lo adjunta a una campaña de email: se enviará con cada email. ' +
            UPLOAD_SAFETY_TEXT,
        inputSchema: {
            type: 'object',
            properties: {
                connection: CONNECTION_PROPERTY,
                id: { type: 'number', description: 'Id de la campaña' },
                ruta: { type: 'string', description: 'Ruta absoluta del archivo en este equipo' },
                observaciones: { type: 'string', description: 'Observaciones del adjunto' },
                nick: { type: 'string', description: 'Usuario que adjunta el archivo (nick)' },
            },
            required: ['id', 'ruta'],
        },
    },
    {
        name: 'update_archivo_campana_crm',
        description: 'Cambia las observaciones de un adjunto de una campaña (por el idrelacion de get_archivos_campana_crm).',
        inputSchema: { type: 'object', properties: UPDATE_ATTACHMENT_PROPERTIES, required: ['idrelacion', 'observaciones'] },
    },
    {
        name: 'delete_archivo_campana_crm',
        description:
            'Quita un adjunto de una campaña (por el idrelacion de get_archivos_campana_crm). Con borrar_archivo=true ' +
            'borra también el archivo si nada más lo usa. Irreversible.',
        inputSchema: { type: 'object', properties: DELETE_ATTACHMENT_PROPERTIES, required: ['idrelacion'] },
    },
];

/**
 * Importe de una oportunidad: el neto en divisa principal del presupuesto
 * vinculado o, si no tiene, el importe aproximado.
 *
 * @param row oportunidad.
 */
function opportunityValue(row: Row): number {
    if (row.idpresupuesto !== null && row.idpresupuesto !== undefined && row.idpresupuesto !== '') {
        return num(row.netoeuros) || num(row.neto);
    }
    return num(row.precio_aprox);
}

/**
 * Situación de una oportunidad según sus marcas: abierta, ganada o perdida.
 *
 * @param row oportunidad.
 */
function opportunityStage(row: Row): 'abierta' | 'ganada' | 'perdida' {
    if (isTrue(row.editable)) return 'abierta';
    return isTrue(row.rechazado) ? 'perdida' : 'ganada';
}

/**
 * Nombre y apellidos de un contacto.
 *
 * @param contact contacto.
 */
function contactName(contact: Row | null): string | null {
    if (!contact) return null;
    const name = [contact.nombre, contact.apellidos].filter((p) => typeof p === 'string' && p !== '').join(' ');
    return name || (typeof contact.empresa === 'string' && contact.empresa !== '' ? contact.empresa : null);
}

/**
 * Datos del presupuesto que la oportunidad copia al vincularse a él.
 *
 * @param estimation presupuesto de cliente.
 */
function estimationAmounts(estimation: Row): Row {
    const rate = num(estimation.tasaconv);
    return {
        idpresupuesto: estimation.idpresupuesto,
        coddivisa: estimation.coddivisa,
        neto: num(estimation.neto),
        netoeuros: rate === 0 ? 0 : Math.round((num(estimation.neto) / rate) * 100000) / 100000,
        tasaconv: rate || 1,
    };
}

async function oportunidadDetalle(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const opportunity = await fsClient.get<Row>(`/crmoportunidades/${pathId(args.id)}`, undefined, connection);

    const [status, contact, interest, source, estimation, notes, files] = await Promise.all([
        getOrNull('/crmoportunidadestados', opportunity.idestado, connection),
        getOrNull('/contactos', opportunity.idcontacto, connection),
        getOrNull('/crminteres', opportunity.idinteres, connection),
        getOrNull('/crmfuentes', opportunity.idfuente, connection),
        getOrNull('/presupuestoclientes', opportunity.idpresupuesto, connection),
        fsClient
            .get<Row[]>('/crmnotas', { idoportunidad: opportunity.id, 'sort[fecha]': 'DESC', 'sort[hora]': 'DESC', limit: NOTES_LIMIT }, connection)
            .catch(() => [] as Row[]),
        listAttachments(OPPORTUNITY_MODEL, opportunity.id, connection).catch(() => [] as Row[]),
    ]);

    return ok({
        oportunidad: {
            ...opportunity,
            situacion: opportunityStage(opportunity),
            importe: round2(opportunityValue(opportunity)),
            estado_nombre: status?.nombre ?? null,
            interes_nombre: interest?.nombre ?? null,
            fuente_nombre: source?.nombre ?? null,
        },
        contacto: contact ? {
            idcontacto: contact.idcontacto,
            nombre: contactName(contact),
            empresa: contact.empresa ?? null,
            cargo: contact.cargo ?? null,
            email: contact.email ?? null,
            telefono1: contact.telefono1 ?? null,
            codcliente: contact.codcliente ?? null,
        } : null,
        presupuesto: estimation ? {
            idpresupuesto: estimation.idpresupuesto,
            codigo: estimation.codigo,
            fecha: estimation.fecha,
            codcliente: estimation.codcliente,
            neto: estimation.neto,
            total: estimation.total,
            coddivisa: estimation.coddivisa,
            editable: estimation.editable,
            idestado: estimation.idestado,
        } : null,
        notas: Array.isArray(notes) ? notes : [],
        archivos: files,
    });
}

async function setEstadoOportunidad(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.id);
    let status: Row | null;

    if (args.idestado === undefined || args.idestado === null || args.idestado === '') {
        if (typeof args.estado !== 'string' || args.estado.trim() === '') {
            return fail('set_estado_oportunidad_crm: indica idestado o el nombre del estado.');
        }
        const { rows } = await fetchAll<Row>('/crmoportunidadestados', {}, connection);
        status = findByName(rows, 'nombre', args.estado);
    } else {
        status = await getOrNull('/crmoportunidadestados', args.idestado, connection);
        if (!status) return fail(`set_estado_oportunidad_crm: no existe el estado ${String(args.idestado)}.`);
    }

    const result = await fsClient.put<Row>(`/crmoportunidades/${id}`, { idestado: status.id }, connection);
    return ok({
        estado: { id: status.id, nombre: status.nombre, editable: status.editable, rechazado: status.rechazado },
        resultado: result,
    });
}

async function crearPresupuesto(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.id);
    const opportunity = await fsClient.get<Row>(`/crmoportunidades/${id}`, undefined, connection);
    if (opportunity.idpresupuesto !== null && opportunity.idpresupuesto !== undefined && opportunity.idpresupuesto !== '') {
        return fail(`La oportunidad ${id} ya tiene el presupuesto ${String(opportunity.idpresupuesto)} vinculado.`);
    }

    const contact = await getOrNull('/contactos', opportunity.idcontacto, connection);
    if (!contact) return fail(`La oportunidad ${id} no tiene un contacto válido.`);
    if (typeof contact.codcliente !== 'string' || contact.codcliente === '') {
        return fail(
            `El contacto ${String(contact.idcontacto)} (${contactName(contact) ?? 'sin nombre'}) no tiene un cliente ` +
                'asociado: crea el cliente o asígnaselo con update_contacto (codcliente) y vuelve a intentarlo.',
        );
    }

    const body: Row = { codcliente: contact.codcliente, lineas: JSON.stringify(Array.isArray(args.lineas) ? args.lineas : []) };
    if (typeof opportunity.codagente === 'string' && opportunity.codagente !== '') body.codagente = opportunity.codagente;
    for (const field of ['fecha', 'codserie', 'codalmacen', 'finoferta', 'observaciones']) {
        if (typeof args[field] === 'string' && args[field] !== '') body[field] = args[field];
    }
    const created = await fsClient.post<{ doc?: Row }>('/crearPresupuestoCliente', body, connection);
    const estimation = created?.doc;
    if (!estimation || estimation.idpresupuesto === undefined) {
        return fail(`No se ha podido crear el presupuesto: ${JSON.stringify(created)}`);
    }

    try {
        await fsClient.put(`/crmoportunidades/${id}`, estimationAmounts(estimation), connection);
    } catch (error) {
        return fail(
            `Se ha creado el presupuesto ${String(estimation.codigo)} (id ${String(estimation.idpresupuesto)}) pero no se ` +
                `ha podido vincular a la oportunidad: ${error instanceof Error ? error.message : String(error)}. ` +
                'Vincúlalo con set_presupuesto_oportunidad_crm.',
        );
    }

    return ok({
        oportunidad: Number(id),
        presupuesto: {
            idpresupuesto: estimation.idpresupuesto,
            codigo: estimation.codigo,
            codcliente: estimation.codcliente,
            neto: estimation.neto,
            total: estimation.total,
        },
    });
}

async function setPresupuesto(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.id);
    const opportunity = await fsClient.get<Row>(`/crmoportunidades/${id}`, undefined, connection);

    if (isTrue(args.desvincular)) {
        const result = await fsClient.put<Row>(
            `/crmoportunidades/${id}`,
            { idpresupuesto: 'null', neto: 0, netoeuros: 0, tasaconv: 1 },
            connection,
        );
        return ok(result);
    }

    if (args.idpresupuesto === undefined || args.idpresupuesto === null || args.idpresupuesto === '') {
        return fail('set_presupuesto_oportunidad_crm: indica idpresupuesto o desvincular=true.');
    }
    if (opportunity.idpresupuesto !== null && opportunity.idpresupuesto !== undefined && opportunity.idpresupuesto !== '') {
        return fail(`La oportunidad ${id} ya tiene el presupuesto ${String(opportunity.idpresupuesto)} vinculado: desvincúlalo antes.`);
    }

    const estimation = await getOrNull('/presupuestoclientes', args.idpresupuesto, connection);
    if (!estimation) return fail(`No existe el presupuesto de cliente ${String(args.idpresupuesto)}.`);

    const others = await fsClient.get<Row[]>('/crmoportunidades', { idpresupuesto: estimation.idpresupuesto, limit: 1 }, connection);
    if (Array.isArray(others) && others.length > 0) {
        return fail(`El presupuesto ${String(estimation.codigo)} ya está vinculado a la oportunidad ${String(others[0]?.id)}.`);
    }

    const result = await fsClient.put<Row>(`/crmoportunidades/${id}`, estimationAmounts(estimation), connection);
    return ok(result);
}

async function crearArchivo(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.id);
    // la ruta se valida antes de llamar a la API; después comprobamos la oportunidad
    return uploadAttachment('create_archivo_oportunidad_crm', OPPORTUNITY_MODEL, id, args, connection, () =>
        fsClient.get(`/crmoportunidades/${id}`, undefined, connection),
    );
}

async function editarArchivo(args: ToolArgs): Promise<ToolResult> {
    return updateAttachment([OPPORTUNITY_MODEL], args, connectionOf(args));
}

async function borrarArchivo(args: ToolArgs): Promise<ToolResult> {
    return deleteAttachment([OPPORTUNITY_MODEL], args, connectionOf(args));
}

async function archivosOportunidad(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.id);
    return ok({ oportunidad: Number(id), archivos: await listAttachments(OPPORTUNITY_MODEL, id, connection) });
}

async function contactoDetalle(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const contact = await fsClient.get<Row>(`/contactos/${pathId(args.idcontacto)}`, undefined, connection);
    const id = contact.idcontacto;

    const [source, customer, interests, lists, opportunities, statuses, notes] = await Promise.all([
        getOrNull('/crmfuentes', contact.idfuente, connection),
        getOrNull('/clientes', contact.codcliente, connection),
        fetchAll<Row>('/crminterescontactos', { idcontacto: id }, connection).then((r) => r.rows).catch(() => [] as Row[]),
        fetchAll<Row>('/crmlistacontactos', { idcontacto: id }, connection).then((r) => r.rows).catch(() => [] as Row[]),
        fetchAll<Row>('/crmoportunidades', { idcontacto: id, 'sort[fecha]': 'DESC' }, connection).then((r) => r.rows),
        fetchCatalog('/crmoportunidadestados', 'id', connection),
        fsClient
            .get<Row[]>('/crmnotas', { idcontacto: id, 'sort[fecha]': 'DESC', 'sort[hora]': 'DESC', limit: NOTES_LIMIT }, connection)
            .catch(() => [] as Row[]),
    ]);
    const [interestNames, listNames] = await Promise.all([
        fetchByIds('/crminteres', 'id', interests.map((row) => row.idinteres), connection),
        fetchByIds('/crmlistas', 'id', lists.map((row) => row.idlista), connection),
    ]);

    const opportunityRows = opportunities.map((row) => ({
        id: row.id,
        fecha: row.fecha,
        descripcion: row.descripcion ?? null,
        estado: statuses.get(String(row.idestado))?.nombre ?? null,
        situacion: opportunityStage(row),
        importe: round2(opportunityValue(row)),
        idpresupuesto: row.idpresupuesto ?? null,
        asignado: row.asignado ?? null,
    }));

    return ok({
        contacto: {
            ...contact,
            nombre_completo: contactName(contact),
            fuente_nombre: source?.nombre ?? null,
            cliente_nombre: customer?.nombre ?? null,
        },
        intereses: interests.map((row) => ({ id: row.id, idinteres: row.idinteres, nombre: interestNames.get(String(row.idinteres))?.nombre ?? null, fecha: row.fecha })),
        listas: lists.map((row) => ({ id: row.id, idlista: row.idlista, nombre: listNames.get(String(row.idlista))?.nombre ?? null, fecha: row.fecha })),
        resumen_oportunidades: {
            total: opportunityRows.length,
            abiertas: opportunityRows.filter((row) => row.situacion === 'abierta').length,
            ganadas: opportunityRows.filter((row) => row.situacion === 'ganada').length,
            perdidas: opportunityRows.filter((row) => row.situacion === 'perdida').length,
            importe_ganado: round2(opportunityRows.filter((row) => row.situacion === 'ganada').reduce((sum, row) => sum + row.importe, 0)),
        },
        oportunidades: opportunityRows,
        notas: Array.isArray(notes) ? notes : [],
    });
}

async function informeOportunidades(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const desde = optionalIsoDate(args.fecha_desde, 'fecha_desde');
    const hasta = optionalIsoDate(args.fecha_hasta, 'fecha_hasta');

    const params: Row = {};
    if (desde) params.fecha_gte = desde;
    if (hasta) params.fecha_lte = hasta;
    for (const field of ['asignado', 'codagente', 'idinteres', 'idfuente']) {
        if (args[field] !== undefined && args[field] !== '') params[field] = args[field];
    }

    const [{ rows, truncated }, statuses, interests, sources] = await Promise.all([
        fetchAll<Row>('/crmoportunidades', params, connection),
        fetchCatalog('/crmoportunidadestados', 'id', connection),
        fetchCatalog('/crminteres', 'id', connection),
        fetchCatalog('/crmfuentes', 'id', connection),
    ]);

    type Group = { oportunidades: number; abiertas: number; ganadas: number; perdidas: number; importe: number; importe_ganado: number };
    const init = (): Group => ({ oportunidades: 0, abiertas: 0, ganadas: 0, perdidas: 0, importe: 0, importe_ganado: 0 });
    const groups = {
        estado: new Map<string, Group>(),
        interes: new Map<string, Group>(),
        fuente: new Map<string, Group>(),
        asignado: new Map<string, Group>(),
        agente: new Map<string, Group>(),
        mes: new Map<string, Group>(),
    };
    const totals = init();
    let closeDays = 0;
    let closedCount = 0;

    for (const row of rows) {
        const stage = opportunityStage(row);
        const value = opportunityValue(row);
        const add = (g: Group): void => {
            g.oportunidades += 1;
            g.importe += value;
            if (stage === 'abierta') g.abiertas += 1;
            else if (stage === 'ganada') {
                g.ganadas += 1;
                g.importe_ganado += value;
            } else g.perdidas += 1;
        };
        add(totals);
        const statusName = statuses.get(String(row.idestado))?.nombre;
        accumulate(groups.estado, statusName ? String(statusName) : groupKey(row.idestado), init, add);
        const interestName = interests.get(String(row.idinteres))?.nombre;
        accumulate(groups.interes, interestName ? String(interestName) : groupKey(row.idinteres), init, add);
        const sourceName = sources.get(String(row.idfuente))?.nombre;
        accumulate(groups.fuente, sourceName ? String(sourceName) : groupKey(row.idfuente), init, add);
        accumulate(groups.asignado, groupKey(row.asignado), init, add);
        accumulate(groups.agente, groupKey(row.codagente), init, add);
        accumulate(groups.mes, (isoDate(row.fecha) ?? '(sin fecha)').slice(0, 7), init, add);

        const start = isoDate(row.fecha);
        const end = isoDate(row.fecha_cierre);
        if (stage !== 'abierta' && start && end) {
            closeDays += daysBetween(start, end);
            closedCount += 1;
        }
    }

    const format = (g: Group): Row => ({
        ...g,
        importe: round2(g.importe),
        importe_ganado: round2(g.importe_ganado),
        conversion_pct: g.ganadas + g.perdidas > 0 ? round2((g.ganadas / (g.ganadas + g.perdidas)) * 100) : null,
    });
    const toList = (map: Map<string, Group>, key: string): Row[] =>
        [...map].map(([name, g]) => ({ [key]: name, ...format(g) })).sort((a, b) => num(b.oportunidades) - num(a.oportunidades));

    // el embudo sigue el orden de los estados
    const order = new Map([...statuses.values()].map((s) => [String(s.nombre), num(s.orden)]));
    const funnel = toList(groups.estado, 'estado').sort((a, b) =>
        (order.get(String(a.estado)) ?? Number.MAX_SAFE_INTEGER) - (order.get(String(b.estado)) ?? Number.MAX_SAFE_INTEGER));

    return ok({
        periodo: { desde: desde ?? null, hasta: hasta ?? null },
        ...(truncated ? { aviso: 'Hay más oportunidades de las que se han leído: acota el periodo o los filtros.' } : {}),
        resumen: {
            ...format(totals),
            dias_medios_hasta_cierre: closedCount > 0 ? round2(closeDays / closedCount) : null,
            nota: 'importe: neto del presupuesto vinculado en divisa principal o, si no hay, el importe aproximado. ' +
                'conversion_pct: ganadas / (ganadas + perdidas).',
        },
        embudo_por_estado: funnel,
        por_interes: toList(groups.interes, 'interes'),
        por_fuente: toList(groups.fuente, 'fuente'),
        por_asignado: toList(groups.asignado, 'asignado'),
        por_agente: toList(groups.agente, 'codagente'),
        por_mes: toList(groups.mes, 'mes').sort((a, b) => String(a.mes).localeCompare(String(b.mes))),
    });
}

async function avisos(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const desde = optionalIsoDate(args.fecha_desde, 'fecha_desde');
    const today = todayIso();
    const defaultUntil = new Date();
    defaultUntil.setDate(defaultUntil.getDate() + 7);
    const hasta = optionalIsoDate(args.fecha_hasta, 'fecha_hasta') ?? isoDate(defaultUntil) ?? today;

    const params: Row = { fechaaviso_notnull: 1, fechaaviso_lte: hasta, 'sort[fechaaviso]': 'ASC', 'sort[notice_hour]': 'ASC' };
    if (desde) params.fechaaviso_gte = desde;
    if (typeof args.nick === 'string' && args.nick !== '') params.nick = args.nick;
    if (!isTrue(args.incluir_notificados)) params.fecha_notificado_null = 1;

    const { rows, truncated } = await fetchAll<Row>('/crmnotas', params, connection);
    const contacts = await fetchByIds('/contactos', 'idcontacto', rows.map((row) => row.idcontacto), connection);

    const items = rows.map((row) => {
        const date = isoDate(row.fechaaviso);
        return {
            id: row.id,
            fechaaviso: date,
            notice_hour: row.notice_hour ?? null,
            vencido: date !== null && date < today,
            notificado: row.fecha_notificado ?? null,
            nick: row.nick ?? null,
            paratodos: isTrue(row.paratodos),
            idcontacto: row.idcontacto ?? null,
            contacto: contactName(contacts.get(String(row.idcontacto)) ?? null),
            idoportunidad: row.idoportunidad ?? null,
            observaciones: typeof row.observaciones === 'string' ? row.observaciones.slice(0, 300) : null,
        };
    });

    return ok({
        hasta,
        ...(truncated ? { aviso: 'Hay más avisos de los que se han leído: acota las fechas.' } : {}),
        resumen: {
            avisos: items.length,
            vencidos: items.filter((item) => item.vencido).length,
            hoy: items.filter((item) => item.fechaaviso === today).length,
        },
        avisos: items,
    });
}

async function sinActividad(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const days = typeof args.dias === 'number' && args.dias > 0 ? Math.floor(args.dias) : 30;
    const today = todayIso();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoff = isoDate(cutoffDate) ?? today;

    const params: Row = { editable: true };
    for (const field of ['asignado', 'codagente']) {
        if (typeof args[field] === 'string' && args[field] !== '') params[field] = args[field];
    }

    const [{ rows, truncated }, recentNotes, statuses] = await Promise.all([
        fetchAll<Row>('/crmoportunidades', params, connection),
        fetchAll<Row>('/crmnotas', { idoportunidad_notnull: 1, fecha_gte: cutoff }, connection),
        fetchCatalog('/crmoportunidadestados', 'id', connection),
    ]);
    const active = new Set(recentNotes.rows.map((note) => String(note.idoportunidad)));

    const idle = rows
        .filter((row) => !active.has(String(row.id)))
        .map((row) => {
            const last = isoDate(row.fechamod) ?? isoDate(row.fecha);
            return { row, last };
        })
        .filter(({ last }) => last === null || last < cutoff)
        .map(({ row, last }) => ({
            id: row.id,
            fecha: isoDate(row.fecha),
            ultima_actividad: last,
            dias_sin_actividad: last ? daysBetween(last, today) : null,
            estado: statuses.get(String(row.idestado))?.nombre ?? null,
            idcontacto: row.idcontacto ?? null,
            asignado: row.asignado ?? null,
            codagente: row.codagente ?? null,
            importe: round2(opportunityValue(row)),
            descripcion: typeof row.descripcion === 'string' ? row.descripcion.slice(0, 200) : null,
        }))
        .sort((a, b) => (b.dias_sin_actividad ?? 0) - (a.dias_sin_actividad ?? 0));

    const contacts = await fetchByIds('/contactos', 'idcontacto', idle.map((item) => item.idcontacto), connection);
    return ok({
        dias: days,
        ...(truncated ? { aviso: 'Hay más oportunidades abiertas de las que se han leído: acota los filtros.' } : {}),
        resumen: {
            oportunidades: idle.length,
            importe: round2(idle.reduce((sum, item) => sum + item.importe, 0)),
        },
        oportunidades: idle.map((item) => ({ ...item, contacto: contactName(contacts.get(String(item.idcontacto)) ?? null) })),
    });
}

/**
 * Llama a un endpoint de campañas del plugin y, si la instalación no lo tiene, explica qué versión hace falta.
 *
 * @param tool       nombre de la tool, para el mensaje de error.
 * @param endpoint   recurso de la API.
 * @param body       datos de la petición.
 * @param connection conexión a usar.
 */
async function postCampaignEndpoint(tool: string, endpoint: string, body: Row, connection: string | undefined): Promise<ToolResult> {
    try {
        return ok(await fsClient.post<Row>(endpoint, body, connection));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (isMissingResource(message)) {
            return fail(
                `${tool}: la instalación no tiene el endpoint ${endpoint}. Requiere el plugin CRM ` +
                    `${CAMPAIGN_ENDPOINTS_VERSION} o posterior: actualízalo y vuelve a intentarlo.`,
            );
        }
        throw error;
    }
}

/**
 * Lista de ids recibida en una tool, sin vacíos ni repetidos.
 *
 * @param value valor del argumento.
 */
function idList(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((id) => id !== null && id !== undefined && id !== '').map((id) => String(id)))];
}

async function setContactosLista(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const idlista = pathId(args.idlista);
    const add = idList(args.anadir);
    const remove = idList(args.quitar);
    if (add.length === 0 && remove.length === 0) {
        return fail('set_contactos_lista_crm: indica los idcontacto a añadir o a quitar.');
    }

    await fsClient.get(`/crmlistas/${idlista}`, undefined, connection);
    const { rows } = await fetchAll<Row>('/crmlistacontactos', { idlista }, connection);
    const members = new Map(rows.map((row) => [String(row.idcontacto), row]));

    const added: string[] = [];
    const skipped: string[] = [];
    for (const idcontacto of add) {
        if (members.has(idcontacto)) {
            skipped.push(idcontacto);
            continue;
        }
        await fsClient.post('/crmlistacontactos', { idlista, idcontacto }, connection);
        added.push(idcontacto);
    }

    const removed: string[] = [];
    const notMember: string[] = [];
    for (const idcontacto of remove) {
        const member = members.get(idcontacto);
        if (!member) {
            notMember.push(idcontacto);
            continue;
        }
        await fsClient.delete(`/crmlistacontactos/${pathId(member.id)}`, connection);
        removed.push(idcontacto);
    }

    const list = await fsClient.get<Row>(`/crmlistas/${idlista}`, undefined, connection);
    return ok({
        idlista: Number(idlista),
        numcontactos: list.numcontactos ?? null,
        anadidos: added.map(Number),
        ya_estaban: skipped.map(Number),
        quitados: removed.map(Number),
        no_estaban: notMember.map(Number),
    });
}

async function campanaDetalle(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.id);
    const campaign = await fsClient.get<Row>(`/crmcampaignes/${id}`, undefined, connection);

    const [emails, files, mailboxes] = await Promise.all([
        fetchAll<Row>('/crmcampaignemailes', { id_campaign: id }, connection),
        listAttachments(CAMPAIGN_MODEL, id, connection).catch(() => [] as Row[]),
        // los buzones son un endpoint del plugin: con versiones anteriores no se muestran
        fsClient.get<{ data?: unknown }>('/buzonesCampanaCRM', undefined, connection).then((r) => r?.data ?? null).catch(() => null),
    ]);

    const byOutgoing = new Map<string, { destinatarios: number; enviados: number; pendientes: number; abiertos: number }>();
    for (const row of emails.rows) {
        const sent = row.sent !== null && row.sent !== undefined && row.sent !== '';
        accumulate(byOutgoing, String(row.outgoing_email ?? '') || '(predeterminada)', () => ({
            destinatarios: 0,
            enviados: 0,
            pendientes: 0,
            abiertos: 0,
        }), (g) => {
            g.destinatarios += 1;
            if (sent) g.enviados += 1;
            else g.pendientes += 1;
            if (isTrue(row.opened)) g.abiertos += 1;
        });
    }
    const total = emails.rows.length;
    const sentCount = emails.rows.filter((row) => row.sent !== null && row.sent !== undefined && row.sent !== '').length;
    const opened = emails.rows.filter((row) => isTrue(row.opened)).length;

    return ok({
        campana: { ...campaign, estado_nombre: CAMPAIGN_STATUS[num(campaign.status)] ?? String(campaign.status) },
        destinatarios: {
            total,
            enviados: sentCount,
            pendientes: total - sentCount,
            abiertos: opened,
            tasa_apertura_pct: sentCount === 0 ? null : round2((opened / sentCount) * 100),
            por_cuenta_salida: Object.fromEntries(byOutgoing),
            ...(emails.truncated ? { aviso: 'La campaña tiene más destinatarios de los que se han leído.' } : {}),
        },
        adjuntos: files,
        ...(mailboxes !== null ? { buzones: mailboxes } : {}),
    });
}

async function setEstadoCampana(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.id);
    if (typeof args.estado !== 'string' || !(args.estado in CAMPAIGN_STATUS_VALUE)) {
        return fail(`set_estado_campana_crm: estado no válido. Usa ${Object.keys(CAMPAIGN_STATUS_VALUE).join(', ')}.`);
    }
    const status = CAMPAIGN_STATUS_VALUE[args.estado] as number;

    const campaign = await fsClient.get<Row>(`/crmcampaignes/${id}`, undefined, connection);
    if (status === CAMPAIGN_STATUS_VALUE.enviando) {
        const emails = await fsClient.get<Row[]>('/crmcampaignemailes', { id_campaign: id, limit: 1 }, connection);
        if (!Array.isArray(emails) || emails.length === 0) {
            return fail(`La campaña ${id} no tiene destinatarios: añádelos con anadir_lista_campana_crm antes de enviarla.`);
        }
    }

    const result = await fsClient.put<Row>(`/crmcampaignes/${id}`, { status }, connection);
    return ok({
        estado_anterior: CAMPAIGN_STATUS[num(campaign.status)] ?? String(campaign.status),
        estado: args.estado,
        ...(status === CAMPAIGN_STATUS_VALUE.enviando
            ? { aviso: 'El cron enviará los emails por lotes dentro del horario y los días de envío de la campaña.' }
            : {}),
        resultado: result,
    });
}

async function anadirListaCampana(args: ToolArgs): Promise<ToolResult> {
    const body: Row = { id: pathId(args.id), idlista: pathId(args.idlista) };
    if (typeof args.outgoing_email === 'string' && args.outgoing_email !== '') body.outgoing_email = args.outgoing_email;
    return postCampaignEndpoint('anadir_lista_campana_crm', '/anadirListaCampanaCRM', body, connectionOf(args));
}

async function enviarPruebaCampana(args: ToolArgs): Promise<ToolResult> {
    if (typeof args.email !== 'string' || args.email.trim() === '') {
        return fail('enviar_prueba_campana_crm: indica el email al que enviar la prueba.');
    }
    const body: Row = { id: pathId(args.id), email: args.email.trim() };
    for (const field of ['outgoing_email', 'nombre']) {
        if (typeof args[field] === 'string' && args[field] !== '') body[field] = args[field];
    }
    return postCampaignEndpoint('enviar_prueba_campana_crm', '/enviarPruebaCampanaCRM', body, connectionOf(args));
}

async function crearArchivoCampana(args: ToolArgs): Promise<ToolResult> {
    const connection = connectionOf(args);
    const id = pathId(args.id);
    return uploadAttachment('create_archivo_campana_crm', CAMPAIGN_MODEL, id, args, connection, () =>
        fsClient.get(`/crmcampaignes/${id}`, undefined, connection),
    );
}

/**
 * Ejecuta una tool propia del plugin CRM. Devuelve null si no es suya.
 *
 * @param name nombre de la tool.
 * @param args argumentos de la llamada.
 */
export async function handleCrmTool(name: string, args: ToolArgs): Promise<ToolResult | null> {
    switch (name) {
        case 'get_oportunidad_crm':
            return oportunidadDetalle(args);
        case 'set_estado_oportunidad_crm':
            return setEstadoOportunidad(args);
        case 'create_presupuesto_oportunidad_crm':
            return crearPresupuesto(args);
        case 'set_presupuesto_oportunidad_crm':
            return setPresupuesto(args);
        case 'get_archivos_oportunidad_crm':
            return archivosOportunidad(args);
        case 'create_archivo_oportunidad_crm':
            return crearArchivo(args);
        case 'update_archivo_oportunidad_crm':
            return editarArchivo(args);
        case 'delete_archivo_oportunidad_crm':
            return borrarArchivo(args);
        case 'get_contacto_crm':
            return contactoDetalle(args);
        case 'set_contactos_lista_crm':
            return setContactosLista(args);
        case 'get_campana_crm':
            return campanaDetalle(args);
        case 'set_estado_campana_crm':
            return setEstadoCampana(args);
        case 'anadir_lista_campana_crm':
            return anadirListaCampana(args);
        case 'enviar_prueba_campana_crm':
            return enviarPruebaCampana(args);
        case 'get_archivos_campana_crm':
            return ok({ campana: Number(pathId(args.id)), archivos: await listAttachments(CAMPAIGN_MODEL, pathId(args.id), connectionOf(args)) });
        case 'create_archivo_campana_crm':
            return crearArchivoCampana(args);
        case 'update_archivo_campana_crm':
            return updateAttachment([CAMPAIGN_MODEL], args, connectionOf(args));
        case 'delete_archivo_campana_crm':
            return deleteAttachment([CAMPAIGN_MODEL], args, connectionOf(args));
        case 'get_informe_oportunidades_crm':
            return informeOportunidades(args);
        case 'get_avisos_crm':
            return avisos(args);
        case 'get_oportunidades_crm_sin_actividad':
            return sinActividad(args);
        default:
            return null;
    }
}
