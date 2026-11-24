/**
 * Modelos del plugin CRM y sus tools CRUD.
 *
 * Los contactos son del core (get_contactos, create_contacto...); el plugin les
 * añade la fuente (idfuente), los intereses y las listas, y aquí se gestionan
 * esas relaciones. La ficha completa de un contacto está en get_contacto_crm.
 */

import type { ModelMetadata } from '../../metadata/types.js';
import type { ResourceDef } from '../shared/resource.js';
import { models } from './metadata/index.js';

/** Nombre del plugin en FacturaScripts. */
export const PLUGIN = 'CRM';

/**
 * Metadata de un modelo del plugin por su nombre.
 *
 * @param name nombre del modelo en la metadata.
 * @throws Error si el modelo no está generado.
 */
export function metaOf(name: string): ModelMetadata {
    const meta = models.find((m) => m.name === name);
    if (!meta) throw new Error(`Falta la metadata del modelo ${name} del plugin ${PLUGIN}.`);
    return meta;
}

/** Estado de una campaña de email (columna status de crm_campaigns). */
export const CAMPAIGN_STATUS: Record<number, string> = { 0: 'borrador', 1: 'enviando', 2: 'enviada' };

export const oportunidad: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('crm_oportunidad'),
    fields: [
        'idcontacto', 'idestado', 'descripcion', 'observaciones', 'precio_aprox', 'idinteres', 'idfuente', 'asignado',
        'codagente', 'nick', 'fecha', 'hora',
    ],
    fieldDescriptions: {
        idestado: 'Estado de la oportunidad. Si se omite, el predeterminado. Para cambiarlo por nombre usa set_estado_oportunidad_crm',
        codagente: 'Agente comercial. Si se omite, el del contacto (si no tiene, queda sin agente: la API no tiene usuario de sesión)',
        asignado: 'Usuario asignado (nick). Recibe un email al asignársela',
        nick: 'Usuario que registra la oportunidad (nick)',
        precio_aprox: 'Importe aproximado estimado de la venta, mientras no tenga presupuesto',
        fecha: 'Fecha de alta (YYYY-MM-DD). Por defecto, hoy',
    },
    list: {
        tool: 'get_oportunidades_crm',
        description:
            'Lista oportunidades de negocio del CRM con filtros y paginación. editable=true son las abiertas; ' +
            'rechazado=true, las perdidas; cerradas y no rechazadas, las ganadas. neto/netoeuros es el del ' +
            'presupuesto vinculado y precio_aprox la estimación previa. Para ver una completa usa get_oportunidad_crm.',
        filters: [
            'idcontacto', 'idestado', 'editable', 'rechazado', 'idinteres', 'idfuente', 'asignado', 'codagente', 'nick',
            'idpresupuesto',
        ],
        like: ['descripcion', 'observaciones'],
        defaultOrder: 'fecha:desc,id:desc',
    },
    create: {
        tool: 'create_oportunidad_crm',
        description:
            'Crea una oportunidad de negocio para un contacto. El estado predeterminado, la fecha y la hora se ponen ' +
            'solos, y el agente se toma del contacto si se omite. El interés se añade también al contacto. Notifica ' +
            'por email al asignado y al agente.',
        required: ['idcontacto'],
    },
    update: {
        tool: 'update_oportunidad_crm',
        description:
            'Modifica una oportunidad; solo cambian los campos enviados. Al cambiar el estado se actualizan abierta, ' +
            'rechazada y la fecha de cierre. Para el presupuesto usa create_presupuesto_oportunidad_crm o ' +
            'set_presupuesto_oportunidad_crm.',
    },
    delete: {
        tool: 'delete_oportunidad_crm',
        description: 'Elimina una oportunidad y sus notas. El presupuesto vinculado se conserva. Irreversible.',
    },
};

export const estadoOportunidad: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('crm_oportunidad_estado'),
    fields: ['nombre', 'orden', 'editable', 'rechazado', 'predeterminado', 'color', 'icon', 'tab'],
    fieldDescriptions: {
        editable: 'Si las oportunidades en este estado siguen abiertas (false: cerrada, ganada o perdida). Por defecto true',
        rechazado: 'Si las oportunidades en este estado cuentan como perdidas. Por defecto false',
        predeterminado: 'Estado de las oportunidades nuevas. Desmarca el anterior con update_estado_oportunidad_crm: el plugin no lo hace solo',
        orden: 'Posición en el embudo de ventas (por defecto 100)',
    },
    list: {
        tool: 'get_estados_oportunidad_crm',
        description:
            'Lista los estados de las oportunidades del CRM en el orden del embudo: si son abiertos (editable), si ' +
            'cuentan como perdidos (rechazado) y cuál es el predeterminado.',
        filters: ['editable', 'rechazado', 'predeterminado'],
        like: ['nombre'],
        defaultOrder: 'orden:asc,id:asc',
    },
    create: { tool: 'create_estado_oportunidad_crm', description: 'Crea un estado de oportunidades del CRM.', required: ['nombre'] },
    update: { tool: 'update_estado_oportunidad_crm', description: 'Modifica un estado de oportunidades del CRM.' },
    delete: {
        tool: 'delete_estado_oportunidad_crm',
        description: 'Elimina un estado de oportunidades; las oportunidades que lo tenían quedan sin estado. Irreversible.',
    },
};

export const nota: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('crm_nota'),
    fields: [
        'idcontacto', 'idoportunidad', 'idinteres', 'observaciones', 'nick', 'fecha', 'hora', 'fechaaviso', 'notice_hour',
        'paratodos', 'tipodocumento', 'iddocumento', 'documento',
    ],
    fieldDescriptions: {
        nick: 'Autor de la nota (nick). Indícalo siempre: la API no tiene usuario de sesión y sin autor el aviso no llega a nadie',
        fechaaviso: 'Fecha del recordatorio (YYYY-MM-DD): ese día se avisa por email al autor, o a todos con paratodos',
        notice_hour: 'Hora del recordatorio (HH:MM:SS)',
        idoportunidad: 'Oportunidad de la nota. Avisa por email al creador, al asignado y al agente de la oportunidad',
        tipodocumento: 'Clase del documento al que se refiere la nota (ej. PresupuestoCliente, FacturaCliente)',
        fecha: 'Fecha de la nota (YYYY-MM-DD). Por defecto, hoy',
    },
    list: {
        tool: 'get_notas_crm',
        description:
            'Lista notas del CRM de contactos, oportunidades o documentos, de la más reciente a la más antigua. Para ' +
            'los recordatorios pendientes usa get_avisos_crm.',
        filters: ['idcontacto', 'idoportunidad', 'idinteres', 'nick', 'tipodocumento', 'iddocumento', 'automatica', 'paratodos'],
        like: ['observaciones'],
        defaultOrder: 'fecha:desc,hora:desc,id:desc',
    },
    create: {
        tool: 'create_nota_crm',
        description:
            'Añade una nota a un contacto, a una oportunidad (indica también su idcontacto) o a un documento, con un ' +
            'recordatorio opcional (fechaaviso y notice_hour).',
        required: ['observaciones'],
    },
    update: { tool: 'update_nota_crm', description: 'Modifica una nota del CRM. Cambiar la fecha de aviso vuelve a programar el recordatorio.' },
    delete: { tool: 'delete_nota_crm', description: 'Elimina una nota del CRM. Irreversible.' },
};

export const fuente: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('crm_fuente'),
    fields: ['nombre', 'descripcion'],
    list: {
        tool: 'get_fuentes_crm',
        description: 'Lista las fuentes de captación de contactos del CRM con su número de contactos.',
        filters: [],
        like: ['nombre'],
        defaultOrder: 'nombre:asc',
    },
    create: { tool: 'create_fuente_crm', description: 'Crea una fuente de captación de contactos.', required: ['nombre'] },
    update: { tool: 'update_fuente_crm', description: 'Modifica una fuente de captación (y recalcula su número de contactos).' },
    delete: { tool: 'delete_fuente_crm', description: 'Elimina una fuente; sus contactos quedan sin fuente. Irreversible.' },
};

export const interes: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('crm_interes'),
    fields: ['nombre', 'descripcion'],
    list: {
        tool: 'get_intereses_crm',
        description: 'Lista los intereses del CRM con su número de contactos interesados.',
        filters: [],
        like: ['nombre'],
        defaultOrder: 'nombre:asc',
    },
    create: { tool: 'create_interes_crm', description: 'Crea un interés del CRM.', required: ['nombre'] },
    update: { tool: 'update_interes_crm', description: 'Modifica un interés (y recalcula su número de contactos).' },
    delete: {
        tool: 'delete_interes_crm',
        description: 'Elimina un interés y su asignación a los contactos; las notas y oportunidades quedan sin interés. Irreversible.',
    },
};

export const interesContacto: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('crm_interes_contacto'),
    fields: ['idcontacto', 'idinteres'],
    list: {
        tool: 'get_intereses_contacto_crm',
        description: 'Lista los intereses asignados a los contactos (filtra por idcontacto o por idinteres).',
        filters: ['idcontacto', 'idinteres'],
        defaultOrder: 'id:asc',
    },
    create: {
        tool: 'create_interes_contacto_crm',
        description: 'Asigna un interés a un contacto y actualiza el número de contactos del interés.',
        required: ['idcontacto', 'idinteres'],
    },
    delete: {
        tool: 'delete_interes_contacto_crm',
        description: 'Quita un interés de un contacto (por el id de la asignación).',
    },
};

export const lista: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('crm_lista'),
    fields: ['nombre'],
    list: {
        tool: 'get_listas_crm',
        description: 'Lista las listas de contactos del CRM con su número de contactos.',
        filters: [],
        like: ['nombre'],
        defaultOrder: 'nombre:asc',
    },
    create: { tool: 'create_lista_crm', description: 'Crea una lista de contactos.', required: ['nombre'] },
    update: { tool: 'update_lista_crm', description: 'Cambia el nombre de una lista de contactos.' },
    delete: { tool: 'delete_lista_crm', description: 'Elimina una lista de contactos (los contactos se conservan). Irreversible.' },
};

export const listaContacto: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('crm_lista_contacto'),
    fields: ['idlista', 'idcontacto'],
    list: {
        tool: 'get_contactos_lista_crm',
        description: 'Lista qué contactos pertenecen a qué listas (filtra por idlista o por idcontacto).',
        filters: ['idlista', 'idcontacto'],
        defaultOrder: 'id:asc',
    },
    create: {
        tool: 'create_contacto_lista_crm',
        description: 'Añade un contacto a una lista. Un contacto solo puede estar una vez en cada lista.',
        required: ['idlista', 'idcontacto'],
    },
    delete: {
        tool: 'delete_contacto_lista_crm',
        description: 'Quita un contacto de una lista (por el id de la pertenencia).',
    },
};

export const cargo: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('crm_position'),
    fields: ['name'],
    list: {
        tool: 'get_cargos_crm',
        description:
            'Lista el catálogo de cargos del CRM (campo name). Son las opciones que se sugieren para el campo cargo de ' +
            'los contactos, que se cambia con update_contacto.',
        filters: [],
        like: ['name'],
        defaultOrder: 'name:asc',
    },
    create: { tool: 'create_cargo_crm', description: 'Añade un cargo al catálogo del CRM.', required: ['name'] },
    update: { tool: 'update_cargo_crm', description: 'Cambia el nombre de un cargo del catálogo (no cambia el cargo de los contactos).' },
    delete: { tool: 'delete_cargo_crm', description: 'Elimina un cargo del catálogo (los contactos conservan su texto).' },
};

export const campana: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('crm_campaign'),
    fields: [],
    list: {
        tool: 'get_campanas_crm',
        description:
            'Lista las campañas de email del CRM con su estado (0 borrador, 1 enviando, 2 enviada) y sus ' +
            'estadísticas: emails a enviar, enviados y abiertos. Solo lectura: se preparan y envían desde FacturaScripts.',
        filters: ['status', 'nick'],
        like: ['name', 'subject'],
        defaultOrder: 'creation_date:desc,id:desc',
    },
};

/** Todos los modelos con tools CRUD del plugin. */
export const RESOURCES: ResourceDef[] = [
    oportunidad, estadoOportunidad, nota, fuente, interes, interesContacto, lista, listaContacto, cargo, campana,
];
