/**
 * Modelos del plugin Proyectos y sus tools CRUD.
 */

import type { ModelMetadata } from '../../metadata/types.js';
import type { ResourceDef } from '../shared/resource.js';
import { models } from './metadata/index.js';

/** Nombre del plugin en FacturaScripts. */
export const PLUGIN = 'Proyectos';

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

/** Tipo de una fase de tareas (columna tipo de tareas_fases). */
export const PHASE_TYPE: Record<number, string> = { 0: 'completada', 1: 'cancelada', 2: 'en proceso' };

/** Valor de la columna tipo de la fase de las tareas completadas. */
export const PHASE_COMPLETED = 0;

/** Valor de la columna tipo de la fase de las tareas canceladas. */
export const PHASE_CANCELED = 1;

export const proyecto: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('proyecto'),
    fields: ['nombre', 'descripcion', 'codcliente', 'fecha', 'fechainicio', 'fechafin', 'idempresa', 'idestado', 'nick', 'privado'],
    fieldDescriptions: {
        nombre: 'Nombre del proyecto. Si se omite se genera con el patrón de código configurado en Proyectos',
        idestado: 'Estado del proyecto. Si se omite, el predeterminado. Decide si el proyecto es editable',
        idempresa: 'Empresa del proyecto. Por defecto, la empresa predeterminada',
        fecha: 'Fecha de alta (YYYY-MM-DD). Por defecto, hoy',
        nick: 'Usuario responsable del proyecto',
        privado: 'true para que solo lo vean su responsable, los administradores y los usuarios añadidos',
    },
    list: {
        tool: 'get_proyectos',
        description:
            'Lista proyectos del plugin Proyectos con filtros y paginación. editable=true son los proyectos abiertos. ' +
            'Incluye los totales de ventas, compras y pendiente de facturar de sus documentos. Para ver un proyecto ' +
            'completo (tareas, usuarios, notas, documentos) usa get_proyecto.',
        filters: ['codcliente', 'idestado', 'idempresa', 'nick', 'editable', 'privado'],
        like: ['nombre', 'descripcion'],
        defaultOrder: 'fecha:desc,idproyecto:desc',
    },
    create: {
        tool: 'create_proyecto',
        description:
            'Crea un proyecto. El estado, la fecha y la empresa se rellenan solos si se omiten, y el nombre se genera ' +
            'con el patrón configurado. Consulta los estados con get_estados_proyecto.',
    },
    update: {
        tool: 'update_proyecto',
        description:
            'Modifica un proyecto; solo cambian los campos enviados. Para cambiar solo el estado (por nombre o id) usa ' +
            'set_estado_proyecto. Los totales se calculan a partir de los documentos y no se editan.',
    },
    delete: {
        tool: 'delete_proyecto',
        description:
            'Elimina un proyecto con sus tareas, notas, usuarios y stock. Los documentos vinculados se conservan. ' +
            'Irreversible: confirma antes con el usuario.',
    },
};

export const tareaProyecto: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('tarea_proyecto'),
    fields: ['idproyecto', 'nombre', 'descripcion', 'cantidad', 'fecha', 'fechainicio', 'fechafin', 'idfase', 'nick'],
    fieldDescriptions: {
        idfase: 'Fase de la tarea. Si se omite, la predeterminada. Cambiarla puede cambiar el estado del proyecto',
        cantidad: 'Cantidad de la tarea (por ejemplo, horas estimadas). Por defecto 1',
        nick: 'Usuario asignado. Recibe un email al asignársela y cuando la tarea cambia de fase',
        fechafin: 'Fecha límite (YYYY-MM-DD). Con ella se detectan las tareas vencidas',
    },
    list: {
        tool: 'get_tareas_proyecto',
        description:
            'Lista tareas de proyectos con filtros y paginación. Las fases se consultan con get_fases_tarea. Para las ' +
            'tareas vencidas usa get_tareas_proyecto_vencidas.',
        filters: ['idproyecto', 'idfase', 'nick'],
        like: ['nombre', 'descripcion'],
        defaultOrder: 'idproyecto:asc,idtarea:asc',
    },
    create: {
        tool: 'create_tarea_proyecto',
        description:
            'Crea una tarea en un proyecto. Si se asigna a un usuario, se le notifica por email. La fase predeterminada ' +
            'se aplica si se omite idfase.',
        required: ['idproyecto', 'nombre'],
        defaults: { cantidad: 1 },
    },
    update: {
        tool: 'update_tarea_proyecto',
        description:
            'Modifica una tarea de proyecto. Al cambiar de fase se guarda la fecha de completado (si la fase es de ' +
            'tipo completada) y el proyecto puede cambiar de estado. Para cambiar solo la fase por nombre usa ' +
            'set_fase_tarea_proyecto.',
    },
    delete: { tool: 'delete_tarea_proyecto', description: 'Elimina una tarea de proyecto y sus notas. Irreversible.' },
};

export const faseTarea: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('fase_tarea'),
    fields: ['nombre', 'predeterminado', 'tipo', 'idestado'],
    fieldDescriptions: {
        tipo: 'Tipo de fase: 0 completada, 1 cancelada, 2 en proceso. Cada tipo solo puede estar en una fase: ' +
            'asignarlo lo quita de la fase que lo tuviera',
        idestado: 'Estado al que pasa el proyecto cuando una tarea entra en esta fase (con tipo: cuando todas sus ' +
            'tareas están completadas o canceladas)',
        predeterminado: 'Fase de las tareas nuevas. Marcarla quita la marca a la anterior',
    },
    list: {
        tool: 'get_fases_tarea',
        description:
            'Lista las fases de las tareas de proyecto: su tipo (0 completada, 1 cancelada, 2 en proceso), la ' +
            'predeterminada y el estado de proyecto asociado.',
        filters: ['tipo', 'predeterminado', 'idestado'],
        defaultOrder: 'idfase:asc',
    },
    create: { tool: 'create_fase_tarea', description: 'Crea una fase de tareas de proyecto.', required: ['nombre'] },
    update: { tool: 'update_fase_tarea', description: 'Modifica una fase de tareas de proyecto.' },
    delete: {
        tool: 'delete_fase_tarea',
        description: 'Elimina una fase de tareas. No se puede borrar la predeterminada ni una que tenga tareas.',
    },
};

export const estadoProyecto: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('estado_proyecto'),
    fields: ['nombre', 'color', 'editable', 'predeterminado'],
    fieldDescriptions: {
        predeterminado: 'Estado de los proyectos nuevos. Marcarlo quita la marca al anterior',
        editable: 'Si los proyectos en este estado se pueden modificar (false equivale a proyecto cerrado)',
    },
    list: {
        tool: 'get_estados_proyecto',
        description: 'Lista los estados de proyecto: si son editables (abiertos) o no (cerrados) y cuál es el predeterminado.',
        filters: ['editable', 'predeterminado'],
        like: ['nombre'],
        defaultOrder: 'idestado:asc',
    },
    create: { tool: 'create_estado_proyecto', description: 'Crea un estado de proyecto.', required: ['nombre'] },
    update: { tool: 'update_estado_proyecto', description: 'Modifica un estado de proyecto.' },
    delete: {
        tool: 'delete_estado_proyecto',
        description: 'Elimina un estado de proyecto. No se puede borrar el predeterminado ni uno con proyectos.',
    },
};

export const notaProyecto: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('nota_proyecto'),
    fields: ['idproyecto', 'idtarea', 'descripcion', 'nick'],
    fieldDescriptions: {
        nick: 'Autor de la nota (nick de un usuario). Obligatorio: la API no tiene usuario de sesión',
        idtarea: 'Tarea del proyecto a la que se refiere la nota (opcional)',
    },
    list: {
        tool: 'get_notas_proyecto',
        description: 'Lista las notas de los proyectos y de sus tareas, de la más reciente a la más antigua.',
        filters: ['idproyecto', 'idtarea', 'nick'],
        like: ['descripcion'],
        defaultOrder: 'fecha:desc,idnota:desc',
    },
    create: {
        tool: 'create_nota_proyecto',
        description: 'Añade una nota a un proyecto o a una de sus tareas.',
        required: ['idproyecto', 'descripcion', 'nick'],
    },
    update: { tool: 'update_nota_proyecto', description: 'Modifica una nota de proyecto.' },
    delete: { tool: 'delete_nota_proyecto', description: 'Elimina una nota de proyecto. Irreversible.' },
};

export const userProyecto: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('user_proyecto'),
    fields: ['idproyecto', 'nick'],
    list: {
        tool: 'get_usuarios_proyecto',
        description: 'Lista los usuarios añadidos a los proyectos (con acceso aunque el proyecto sea privado).',
        filters: ['idproyecto', 'nick'],
        defaultOrder: 'idproyecto:asc,nick:asc',
    },
    create: {
        tool: 'create_usuario_proyecto',
        description: 'Añade un usuario a un proyecto para darle acceso (también a los proyectos privados).',
        required: ['idproyecto', 'nick'],
    },
    delete: { tool: 'delete_usuario_proyecto', description: 'Quita un usuario de un proyecto (por el id de la asignación).' },
};

export const stockProyecto: ResourceDef = {
    plugin: PLUGIN,
    meta: metaOf('stock_proyecto'),
    fields: [],
    list: {
        tool: 'get_stock_proyecto',
        description:
            'Stock de productos de los proyectos: cantidad, reservada, pendiente de recibir y disponible. Lo calcula ' +
            'el plugin a partir de los documentos del proyecto; no se edita directamente.',
        filters: ['idproyecto', 'referencia', 'idproducto'],
        defaultOrder: 'idproyecto:asc,referencia:asc',
    },
};

/** Todos los modelos con tools CRUD del plugin. */
export const RESOURCES: ResourceDef[] = [
    proyecto, tareaProyecto, faseTarea, estadoProyecto, notaProyecto, userProyecto, stockProyecto,
];
