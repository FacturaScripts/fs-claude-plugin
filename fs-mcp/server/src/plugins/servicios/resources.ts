/**
 * Modelos del plugin Servicios (SAT) y sus tools CRUD.
 *
 * Los nombres de las tools de servicios y trabajos (get_servicios_at,
 * create_servicio_at, get_trabajos_at...) son los mismos que usaba el antiguo
 * módulo privado, para no romper conversaciones ni skills que ya los usen.
 */

import type { ModelMetadata } from '../../metadata/types.js';
import type { ResourceDef } from '../shared/resource.js';
import { models } from './metadata/index.js';

/** Nombre del plugin en FacturaScripts. */
export const PLUGIN = 'Servicios';

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

/** Acción de facturación de un trabajo (columna estado de serviciosat_trabajos). */
export const WORK_STATUS: Record<number, string> = {
    [-1]: 'descontar stock',
    0: 'sin acción',
    1: 'hacer factura',
    2: 'facturado',
    3: 'hacer albarán',
    4: 'albarán hecho',
    5: 'hacer presupuesto',
    6: 'presupuesto hecho',
};

/** Texto del campo estado de los trabajos para los esquemas. */
const WORK_STATUS_TEXT =
    'Acción de facturación del trabajo: 0 sin acción, 1 hacer factura, 2 facturado, 3 hacer albarán, ' +
    '4 albarán hecho, 5 hacer presupuesto, 6 presupuesto hecho. Las acciones 0, 1 y 3 descuentan stock ' +
    'del almacén del servicio (salvo que el control de stock de Servicios esté desactivado). ' +
    'Por defecto, la acción configurada en el plugin.';

export const servicioAT: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('servicio_at'),
    fields: [
        'codcliente', 'codalmacen', 'codagente', 'asignado', 'nick', 'codigo', 'descripcion', 'observaciones',
        'solucion', 'material', 'fecha', 'hora', 'idestado', 'idprioridad', 'idtipo', 'idmaquina', 'idmaquina2',
        'idmaquina3', 'idmaquina4', 'idempresa', 'telefono1', 'telefono2', 'idproyecto',
    ],
    fieldDescriptions: {
        codigo: 'Código del servicio. Si se omite se genera con el patrón configurado (por defecto SER-{NUM})',
        idestado: 'Estado del servicio. Si se omite, el predeterminado. Al cambiarlo se registra en el historial y ' +
            'se envían las notificaciones configuradas en el estado',
        idprioridad: 'Prioridad del servicio. Si se omite, la predeterminada',
        idtipo: 'Tipo de servicio. Si se omite, el predeterminado',
        fecha: 'Fecha del servicio (YYYY-MM-DD). Por defecto, hoy',
        hora: 'Hora del servicio (HH:MM:SS). Por defecto, la actual',
        idempresa: 'Empresa. Si se omite, la del almacén',
        telefono1: 'Teléfono de contacto. Si se omite, el del cliente',
        telefono2: 'Segundo teléfono de contacto. Si se omite, el del cliente',
        nick: 'Usuario que registra el servicio',
        idproyecto: 'Proyecto al que pertenece el servicio (solo si el plugin Proyectos está activo)',
    },
    list: {
        tool: 'get_servicios_at',
        description:
            'Lista servicios de asistencia técnica (SAT) del plugin Servicios con filtros y paginación. ' +
            'editable=true son los servicios abiertos (su estado permite modificarlos). neto es la suma de ' +
            'precio × cantidad de sus trabajos. Para ver un servicio completo (trabajos, máquinas, checklist, ' +
            'historial y documentos) usa get_servicio_at.',
        filters: [
            'codigo', 'codcliente', 'codagente', 'codalmacen', 'idempresa', 'idestado', 'idprioridad', 'idtipo',
            'asignado', 'nick', 'editable', 'idmaquina', 'idproyecto',
        ],
        like: ['descripcion', 'solucion'],
        defaultOrder: 'fecha:desc,idservicio:desc',
    },
    create: {
        tool: 'create_servicio_at',
        description:
            'Crea un servicio SAT. El código, el estado, la prioridad, el tipo, la fecha, la hora, la empresa y los ' +
            'teléfonos se rellenan solos si se omiten. Notifica por email al asignado, al agente y al cliente según ' +
            'la configuración. Consulta antes los estados, prioridades y tipos con get_estados_at, ' +
            'get_prioridades_at y get_tipos_at.',
        required: ['codcliente', 'codalmacen'],
    },
    update: {
        tool: 'update_servicio_at',
        description:
            'Modifica un servicio SAT; solo cambian los campos enviados. Los cambios de estado, cliente, agente, ' +
            'asignado o usuario quedan en el historial y pueden enviar notificaciones. Para cambiar solo el estado ' +
            '(por nombre o id) usa set_estado_servicio_at.',
    },
    delete: {
        tool: 'delete_servicio_at',
        description:
            'Elimina un servicio SAT junto con sus trabajos (devolviendo el stock que descontaban), checklist y ' +
            'categorías. Irreversible: confirma antes con el usuario.',
    },
};

export const trabajoAT: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('trabajo_at'),
    fields: [
        'idservicio', 'referencia', 'descripcion', 'cantidad', 'precio', 'estado', 'fechainicio', 'horainicio',
        'fechafin', 'horafin', 'codagente', 'nick', 'observaciones',
    ],
    fieldDescriptions: {
        estado: WORK_STATUS_TEXT,
        referencia: 'Referencia del producto o servicio del catálogo. Si se indica, el precio y la descripción ' +
            'vacíos se toman de la tarifa del cliente',
        precio: 'Precio unitario sin impuestos. Si se omite y hay referencia, el de la tarifa del cliente',
        cantidad: 'Cantidad (unidades u horas). Por defecto 1',
        fechainicio: 'Fecha de inicio (YYYY-MM-DD). Por defecto, hoy',
        horainicio: 'Hora de inicio (HH:MM:SS). Por defecto, la actual',
    },
    list: {
        tool: 'get_trabajos_at',
        description:
            'Lista trabajos (líneas de intervención) de los servicios SAT con filtros y paginación. El campo estado ' +
            'es la acción de facturación: 0 sin acción, 1 hacer factura, 2 facturado, 3 hacer albarán, 4 albarán ' +
            'hecho, 5 hacer presupuesto, 6 presupuesto hecho.',
        filters: ['idservicio', 'estado', 'codagente', 'nick', 'referencia'],
        like: ['descripcion'],
        defaultOrder: 'fechainicio:asc,horainicio:asc',
    },
    create: {
        tool: 'create_trabajo_at',
        description:
            'Añade un trabajo a un servicio SAT. Recalcula el neto del servicio, lo anota en su historial y, según ' +
            'la acción (estado), descuenta stock del almacén del servicio. Para facturar los trabajos márcalos con ' +
            'estado 1 (o 3 albarán, 5 presupuesto) y genera el documento con create_documento_servicio_at. Para ' +
            'calcular la cantidad a partir de las horas de inicio y fin usa calcular_horas_trabajo_at.',
        required: ['idservicio'],
    },
    update: {
        tool: 'update_trabajo_at',
        description:
            'Modifica un trabajo de un servicio SAT. Si cambian la cantidad, la referencia o la acción se ajusta el ' +
            'stock, y se recalcula el neto del servicio.',
    },
    delete: {
        tool: 'delete_trabajo_at',
        description:
            'Elimina un trabajo de un servicio SAT, devuelve su stock y recalcula el neto del servicio. Irreversible.',
    },
};

export const estadoAT: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('estado_at'),
    fields: [
        'nombre', 'color', 'editable', 'predeterminado', 'asignado', 'notificaragente', 'notificarasignado',
        'notificarcliente', 'notificarusuario',
    ],
    list: {
        tool: 'get_estados_at',
        description:
            'Lista los estados de los servicios SAT: si son editables (abiertos) o no (cerrados), el predeterminado, ' +
            'el usuario que se asigna al pasar a ese estado y a quién se notifica.',
        filters: ['editable', 'predeterminado'],
        like: ['nombre'],
        defaultOrder: 'id:asc',
    },
    create: {
        tool: 'create_estado_at',
        description: 'Crea un estado de servicios SAT. Marcarlo como predeterminado quita la marca al anterior.',
        required: ['nombre'],
    },
    update: {
        tool: 'update_estado_at',
        description: 'Modifica un estado de servicios SAT. Marcarlo como predeterminado quita la marca al anterior.',
    },
    delete: {
        tool: 'delete_estado_at',
        description: 'Elimina un estado de servicios SAT. No se puede si hay servicios en ese estado. Irreversible.',
    },
};

export const prioridadAT: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('prioridad_at'),
    fields: ['nombre', 'predeterminado'],
    list: {
        tool: 'get_prioridades_at',
        description: 'Lista las prioridades de los servicios SAT y cuál es la predeterminada.',
        filters: ['predeterminado'],
        defaultOrder: 'id:asc',
    },
    create: { tool: 'create_prioridad_at', description: 'Crea una prioridad de servicios SAT.', required: ['nombre'] },
    update: { tool: 'update_prioridad_at', description: 'Modifica una prioridad de servicios SAT.' },
    delete: {
        tool: 'delete_prioridad_at',
        description: 'Elimina una prioridad de servicios SAT; los servicios que la tenían quedan sin prioridad.',
    },
};

export const tipoAT: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('tipo_at'),
    fields: ['name', 'default'],
    fieldDescriptions: { default: 'Tipo predeterminado de los servicios nuevos. Por defecto true: quita la marca al anterior' },
    list: {
        tool: 'get_tipos_at',
        description: 'Lista los tipos de servicio SAT (campo name) y cuál es el predeterminado (campo default).',
        filters: ['default'],
        defaultOrder: 'id:asc',
    },
    create: {
        tool: 'create_tipo_at',
        description: 'Crea un tipo de servicio SAT. Si no se indica default=false, pasa a ser el predeterminado.',
        required: ['name'],
    },
    update: { tool: 'update_tipo_at', description: 'Modifica un tipo de servicio SAT.' },
    delete: {
        tool: 'delete_tipo_at',
        description: 'Elimina un tipo de servicio SAT; los servicios que lo tenían quedan sin tipo.',
    },
};

export const maquinaAT: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('maquina_at'),
    fields: ['nombre', 'descripcion', 'numserie', 'referencia', 'codcliente', 'codfabricante', 'codagente', 'fecha', 'activo'],
    list: {
        tool: 'get_maquinas_at',
        description:
            'Lista las máquinas o equipos de clientes sobre los que se prestan servicios SAT. Para ver los servicios ' +
            'de una máquina usa get_historial_maquina_at.',
        filters: ['codcliente', 'codfabricante', 'codagente', 'activo', 'referencia', 'numserie'],
        like: ['nombre', 'numserie', 'descripcion'],
        defaultOrder: 'idmaquina:desc',
    },
    create: {
        tool: 'create_maquina_at',
        description: 'Da de alta una máquina o equipo de un cliente para usarla en servicios SAT (idmaquina..idmaquina4).',
        required: ['nombre'],
    },
    update: { tool: 'update_maquina_at', description: 'Modifica una máquina de servicios SAT. Para retirarla sin perder su historial, activo=false.' },
    delete: {
        tool: 'delete_maquina_at',
        description: 'Elimina una máquina. No se puede si algún servicio la usa (mejor marcarla activo=false). Irreversible.',
    },
};

export const categoriaAT: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('categoria_at'),
    fields: ['name'],
    list: {
        tool: 'get_categorias_at',
        description: 'Lista las categorías de verificaciones (checklists) de los servicios SAT. Sus comprobaciones se ven con get_checks_at.',
        filters: [],
        like: ['name'],
        defaultOrder: 'name:asc',
    },
    create: { tool: 'create_categoria_at', description: 'Crea una categoría de verificaciones (checklist) de servicios SAT.', required: ['name'] },
    update: { tool: 'update_categoria_at', description: 'Cambia el nombre de una categoría de verificaciones de servicios SAT.' },
    delete: {
        tool: 'delete_categoria_at',
        description: 'Elimina una categoría de verificaciones con sus comprobaciones y las verificaciones de los servicios. Irreversible.',
    },
};

export const checkAT: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('check_at'),
    fields: ['idcategory', 'name', 'priority'],
    list: {
        tool: 'get_checks_at',
        description: 'Lista las comprobaciones de las categorías de verificaciones (checklists) de servicios SAT.',
        filters: ['idcategory'],
        like: ['name'],
        defaultOrder: 'idcategory:asc,priority:asc',
    },
    create: {
        tool: 'create_check_at',
        description:
            'Añade una comprobación a una categoría de verificaciones. Solo aparece en los servicios a los que se ' +
            'asigne la categoría a partir de ahora.',
        required: ['idcategory', 'name'],
        defaults: { priority: 0 },
    },
    update: { tool: 'update_check_at', description: 'Modifica una comprobación de una categoría de verificaciones.' },
    delete: { tool: 'delete_check_at', description: 'Elimina una comprobación y sus verificaciones en los servicios. Irreversible.' },
};

export const servicioCategoriaAT: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('servicio_categoria_at'),
    fields: ['idservice', 'idcategory'],
    list: {
        tool: 'get_servicio_categorias_at',
        description: 'Lista las categorías de verificaciones asignadas a los servicios SAT.',
        filters: ['idservice', 'idcategory'],
        defaultOrder: 'id:asc',
    },
    create: {
        tool: 'create_servicio_categoria_at',
        description:
            'Asigna una categoría de verificaciones a un servicio SAT y crea en él una verificación pendiente por ' +
            'cada comprobación de la categoría (se ven con get_servicio_checks_at).',
        required: ['idservice', 'idcategory'],
    },
    delete: {
        tool: 'delete_servicio_categoria_at',
        description: 'Quita una categoría de verificaciones de un servicio SAT (por el id de la asignación).',
    },
};

export const servicioCheckAT: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('servicio_check_at'),
    fields: ['checked'],
    fieldDescriptions: { checked: 'true para marcar la comprobación como hecha (guarda la fecha), false para desmarcarla' },
    list: {
        tool: 'get_servicio_checks_at',
        description:
            'Lista las verificaciones (checklist) de los servicios SAT: cada comprobación, si está hecha y cuándo. ' +
            'Para verlas con su texto usa get_servicio_at.',
        filters: ['idservice', 'idcheck', 'checked'],
        defaultOrder: 'id:asc',
    },
    update: {
        tool: 'update_servicio_check_at',
        description: 'Marca o desmarca una verificación de la checklist de un servicio SAT (por su id).',
    },
};

export const servicioATLog: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('servicio_at_log'),
    fields: [],
    list: {
        tool: 'get_servicio_at_logs',
        description:
            'Lista el historial de los servicios SAT: altas, cambios de estado, cliente, agente, asignado y trabajos, ' +
            'con usuario y fecha.',
        filters: ['idservicio', 'nick'],
        like: ['message'],
        defaultOrder: 'creationdate:desc,id:desc',
    },
};

/** Todos los modelos con tools CRUD del plugin. */
export const RESOURCES: ResourceDef[] = [
    servicioAT, trabajoAT, estadoAT, prioridadAT, tipoAT, maquinaAT, categoriaAT, checkAT, servicioCategoriaAT,
    servicioCheckAT, servicioATLog,
];
