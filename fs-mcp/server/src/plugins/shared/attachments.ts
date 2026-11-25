/**
 * Archivos adjuntos de los registros de los plugins oficiales.
 *
 * FacturaScripts guarda cada archivo en attachedfiles y su relación con un
 * registro en attachedfilerelations (clase del modelo + id). Estas funciones
 * comparten la lógica de listar, subir, editar y quitar adjuntos entre los
 * plugins (oportunidades del CRM, proyectos y sus tareas, servicios SAT), y
 * siempre comprueban que la relación es del modelo esperado antes de tocarla.
 */

import { readFile } from 'node:fs/promises';
import { fsClient } from '../../fs/client.js';
import { pathId } from '../../utils/pathId.js';
import { fetchAll, fetchByIds, isTrue } from './query.js';
import { CONNECTION_PROPERTY } from './resource.js';
import { fail, ok } from './result.js';
import { checkUploadPath } from './upload.js';
import type { ToolResult } from '../types.js';

type Row = Record<string, unknown>;

/** Descripción común de la protección de las subidas, para las tools de alta. */
export const UPLOAD_SAFETY_TEXT =
    'Máximo 25 MB. Confirma con el usuario la ruta del archivo antes de subirlo. Por seguridad rechaza los archivos y ' +
    'carpetas ocultos, la configuración de fs-mcp, las carpetas del sistema y de datos de aplicaciones, y las claves ' +
    'y certificados.';

/** Propiedades del esquema para editar un adjunto. */
export const UPDATE_ATTACHMENT_PROPERTIES = {
    connection: CONNECTION_PROPERTY,
    idrelacion: { type: 'number', description: 'Id de la relación del archivo (idrelacion del listado de archivos)' },
    observaciones: { type: 'string', description: 'Nuevas observaciones del adjunto (cadena vacía para quitarlas)' },
} as const;

/** Propiedades del esquema para quitar un adjunto. */
export const DELETE_ATTACHMENT_PROPERTIES = {
    connection: CONNECTION_PROPERTY,
    idrelacion: { type: 'number', description: 'Id de la relación del archivo (idrelacion del listado de archivos)' },
    borrar_archivo: {
        type: 'boolean',
        description: 'Borrar también el archivo de FacturaScripts si no está adjunto a nada más',
    },
} as const;

/**
 * Lee los archivos adjuntos de un registro, con los datos de cada archivo.
 *
 * @param model      clase del modelo en FacturaScripts (CrmOportunidad, Proyecto...).
 * @param id         id del registro.
 * @param connection conexión a usar.
 */
export async function listAttachments(model: string, id: unknown, connection: string | undefined): Promise<Row[]> {
    const { rows } = await fetchAll<Row>('/attachedfilerelations', { model, modelid: id }, connection);
    const files = await fetchByIds('/attachedfiles', 'idfile', rows.map((row) => row.idfile), connection);
    return rows.map((relation) => {
        const file = files.get(String(relation.idfile));
        return {
            idrelacion: relation.id,
            idfile: relation.idfile,
            filename: file?.filename ?? null,
            mimetype: file?.mimetype ?? null,
            size: file?.size ?? null,
            date: file?.date ?? null,
            observations: relation.observations ?? null,
            nick: relation.nick ?? null,
            download: file?.download ?? null,
        };
    });
}

/**
 * Sube un archivo del equipo local y lo adjunta a un registro. Valida la ruta
 * antes de leer nada y no llama a la API si se rechaza.
 *
 * @param tool       nombre de la tool, para los mensajes de error.
 * @param model      clase del modelo en FacturaScripts.
 * @param id         id del registro.
 * @param args       ruta, observaciones y nick de la llamada.
 * @param connection conexión a usar.
 * @param verify     comprobación del registro (por ejemplo, que existe), que se ejecuta después de validar la
 *                   ruta y antes de subir nada; si lanza un error, no se sube el archivo.
 */
export async function uploadAttachment(
    tool: string,
    model: string,
    id: unknown,
    args: { ruta?: unknown; observaciones?: unknown; nick?: unknown },
    connection: string | undefined,
    verify?: () => Promise<unknown>,
): Promise<ToolResult> {
    const check = await checkUploadPath(args.ruta);
    if (!check.ok) return fail(`${tool}: ${check.error}`);
    const upload = check.file;

    if (verify) await verify();

    const form = new FormData();
    form.append('files[]', new Blob([await readFile(upload.path)]), upload.name);
    const uploaded = await fsClient.postMultipart<{ files?: Row[] }>('/uploadFiles', form, connection);
    const file = uploaded?.files?.[0];
    if (!file || file.idfile === undefined) {
        return fail(`FacturaScripts no ha aceptado el archivo: ${JSON.stringify(uploaded)}`);
    }

    const relation: Row = { idfile: file.idfile, model, modelid: Number(id), modelcode: String(id) };
    if (typeof args.observaciones === 'string' && args.observaciones !== '') relation.observations = args.observaciones;
    if (typeof args.nick === 'string' && args.nick !== '') relation.nick = args.nick;
    const result = await fsClient.post<Row>('/attachedfilerelations', relation, connection);

    return ok({ archivo: { idfile: file.idfile, filename: file.filename, size: file.size, mimetype: file.mimetype }, relacion: result });
}

/**
 * Carga una relación de archivo y comprueba que es de uno de los modelos indicados.
 *
 * @param idrelacion id de la relación.
 * @param models     clases de modelo admitidas.
 * @param connection conexión a usar.
 * @returns la relación, o un mensaje de error si es de otro modelo.
 */
async function loadRelation(idrelacion: unknown, models: string[], connection: string | undefined): Promise<Row | string> {
    const relation = await fsClient.get<Row>(`/attachedfilerelations/${pathId(idrelacion)}`, undefined, connection);
    if (!models.includes(String(relation.model))) {
        return `La relación ${String(idrelacion)} no es de ${models.join(' ni de ')} (es de ${String(relation.model)}).`;
    }
    return relation;
}

/**
 * Cambia las observaciones de un adjunto.
 *
 * @param models     clases de modelo admitidas para la relación.
 * @param args       idrelacion y observaciones.
 * @param connection conexión a usar.
 */
export async function updateAttachment(
    models: string[],
    args: { idrelacion?: unknown; observaciones?: unknown },
    connection: string | undefined,
): Promise<ToolResult> {
    if (typeof args.observaciones !== 'string') return fail('Indica las nuevas observaciones del adjunto.');
    const relation = await loadRelation(args.idrelacion, models, connection);
    if (typeof relation === 'string') return fail(relation);

    const result = await fsClient.put<Row>(
        `/attachedfilerelations/${pathId(relation.id)}`,
        { observations: args.observaciones === '' ? 'null' : args.observaciones },
        connection,
    );
    return ok(result);
}

/**
 * Quita un adjunto de su registro y, si se pide y nada más lo usa, borra el archivo.
 *
 * @param models     clases de modelo admitidas para la relación.
 * @param args       idrelacion y borrar_archivo.
 * @param connection conexión a usar.
 */
export async function deleteAttachment(
    models: string[],
    args: { idrelacion?: unknown; borrar_archivo?: unknown },
    connection: string | undefined,
): Promise<ToolResult> {
    const relation = await loadRelation(args.idrelacion, models, connection);
    if (typeof relation === 'string') return fail(relation);

    const result = await fsClient.delete<Row>(`/attachedfilerelations/${pathId(relation.id)}`, connection);
    let fileDeleted = false;
    if (isTrue(args.borrar_archivo)) {
        const others = await fsClient.get<Row[]>('/attachedfilerelations', { idfile: relation.idfile, limit: 1 }, connection);
        if (Array.isArray(others) && others.length === 0) {
            await fsClient.delete(`/attachedfiles/${pathId(relation.idfile)}`, connection);
            fileDeleted = true;
        }
    }
    return ok({ relacion: result, archivo_borrado: fileDeleted });
}
