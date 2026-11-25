/**
 * Configuración general de los plugins oficiales (modelo Settings del core).
 *
 * Cada plugin guarda su configuración en un registro de la tabla settings
 * (proyectos, servicios...) con sus valores en JSON dentro de la columna
 * properties. La API del core la expone en /settings/<nombre> y, al modificar,
 * cada campo enviado se guarda como una propiedad de ese JSON.
 *
 * Las casillas de la pantalla de configuración se guardan como «1» o «0» (o
 * vacío), así que los booleanos se convierten a ese formato al escribir y se
 * devuelven como true o false al leer.
 */

import { fsClient } from '../../fs/client.js';
import { pathId } from '../../utils/pathId.js';
import { CONNECTION_PROPERTY } from './resource.js';
import { fail, ok } from './result.js';
import type { ToolArgs, ToolResult } from '../types.js';

type Row = Record<string, unknown>;

/** Tipo de un valor de configuración. */
export type SettingType = 'string' | 'number' | 'boolean';

/** Definición de un valor de configuración de un plugin. */
export interface SettingDef {
    type: SettingType;
    description: string;
    /** Valores admitidos, si es una lista cerrada. */
    enum?: Array<string | number>;
}

/**
 * Propiedades del esquema de una tool de modificación de la configuración.
 *
 * @param defs valores de configuración del plugin.
 */
export function settingsProperties(defs: Record<string, SettingDef>): Record<string, object> {
    const properties: Record<string, object> = { connection: CONNECTION_PROPERTY };
    for (const [name, def] of Object.entries(defs)) {
        properties[name] = { type: def.type, description: def.description, ...(def.enum ? { enum: def.enum } : {}) };
    }
    return properties;
}

/**
 * Convierte el valor guardado al tipo de su definición.
 *
 * @param value valor leído del JSON de la configuración.
 * @param def   definición del valor.
 */
function readValue(value: unknown, def: SettingDef | undefined): unknown {
    if (value === undefined || value === null) return null;
    if (def?.type === 'boolean') return value === true || value === 1 || value === '1' || value === 'true';
    if (def?.type === 'number') {
        const parsed = Number(value);
        return value === '' || Number.isNaN(parsed) ? null : parsed;
    }
    return value;
}

/**
 * Convierte un valor de la llamada al formato en que lo guarda la pantalla de configuración.
 *
 * @param value valor recibido en la tool.
 * @param def   definición del valor.
 */
function writeValue(value: unknown, def: SettingDef): string {
    if (def.type === 'boolean') return value === true || value === 'true' || value === 1 || value === '1' ? '1' : '0';
    return String(value);
}

/**
 * Lee la configuración de un plugin: los valores definidos con su tipo y, aparte, el resto
 * de propiedades que tenga guardadas.
 *
 * @param name       nombre del registro de configuración (proyectos, servicios...).
 * @param defs       valores de configuración conocidos del plugin.
 * @param connection conexión a usar.
 */
export async function readSettings(
    name: string,
    defs: Record<string, SettingDef>,
    connection: string | undefined,
): Promise<{ existe: boolean; valores: Row; otros: Row }> {
    let raw: Row = {};
    let exists = true;
    try {
        const record = await fsClient.get<Row>(`/settings/${pathId(name)}`, undefined, connection);
        const properties = typeof record.properties === 'string' ? JSON.parse(record.properties) : record.properties;
        raw = properties && typeof properties === 'object' ? (properties as Row) : {};
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!message.includes('HTTP 404')) throw error;
        exists = false;
    }

    const valores: Row = {};
    for (const [key, def] of Object.entries(defs)) valores[key] = readValue(raw[key], def);
    const otros: Row = {};
    for (const [key, value] of Object.entries(raw)) if (!(key in defs)) otros[key] = value;
    return { existe: exists, valores, otros };
}

/**
 * Tool de lectura de la configuración de un plugin.
 *
 * @param name nombre del registro de configuración.
 * @param defs valores de configuración conocidos del plugin.
 * @param args argumentos de la llamada.
 */
export async function getSettingsTool(name: string, defs: Record<string, SettingDef>, args: ToolArgs): Promise<ToolResult> {
    const connection = typeof args.connection === 'string' ? args.connection : undefined;
    const settings = await readSettings(name, defs, connection);
    return ok({
        configuracion: name,
        ...(settings.existe ? {} : { aviso: 'La configuración aún no se ha guardado nunca: se usan los valores por defecto del plugin.' }),
        valores: settings.valores,
        ...(Object.keys(settings.otros).length > 0 ? { otros: settings.otros } : {}),
    });
}

/**
 * Tool de modificación de la configuración de un plugin: solo cambia los valores enviados.
 * Si el registro de configuración aún no existe, lo crea.
 *
 * @param tool nombre de la tool, para los mensajes de error.
 * @param name nombre del registro de configuración.
 * @param defs valores de configuración conocidos del plugin.
 * @param args argumentos de la llamada.
 */
export async function updateSettingsTool(
    tool: string,
    name: string,
    defs: Record<string, SettingDef>,
    args: ToolArgs,
): Promise<ToolResult> {
    const connection = typeof args.connection === 'string' ? args.connection : undefined;
    const body: Row = {};
    for (const [key, def] of Object.entries(defs)) {
        const value = args[key];
        if (value === undefined || value === null) continue;
        if (def.enum && !def.enum.map(String).includes(String(value))) {
            return fail(`${tool}: ${key} debe ser uno de ${def.enum.join(', ')}.`);
        }
        if (def.type === 'number' && Number.isNaN(Number(value))) return fail(`${tool}: ${key} debe ser un número.`);
        body[key] = writeValue(value, def);
    }
    if (Object.keys(body).length === 0) {
        return fail(`${tool}: indica al menos un valor a cambiar (${Object.keys(defs).join(', ')}).`);
    }

    const current = await readSettings(name, defs, connection);
    if (current.existe) {
        await fsClient.put(`/settings/${pathId(name)}`, body, connection);
    } else {
        await fsClient.post('/settings', { name, ...body }, connection);
    }

    const updated = await readSettings(name, defs, connection);
    return ok({ configuracion: name, cambiados: Object.keys(body), valores: updated.valores });
}
