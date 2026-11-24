/**
 * Utilidades de consulta comunes a los plugins oficiales: filtros y orden en el
 * formato de la API REST, lectura paginada completa y normalización de los
 * valores que devuelve la API (fechas d-m-Y, booleanos e importes).
 */

import { fsClient } from '../../fs/client.js';
import { fetchAllPaginated } from '../../utils/paginate.js';
import { parseFsDate, toIsoDate } from '../../utils/fsDate.js';
import { pathId } from '../../utils/pathId.js';

/** Nombre de columna admitido en filtros y orden: identificador simple. */
const FIELD_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

/** Fecha ISO sin hora, como la piden los parámetros de fecha de las tools. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Máximo de registros que lee un informe antes de avisar de que está incompleto. */
export const MAX_REPORT_RECORDS = 20000;

/**
 * Convierte el parámetro genérico `filter` de las tools de listado en filtros de
 * la API. Formato: «campo:valor» separados por comas; el campo admite los sufijos
 * de operador de la API (_gt, _gte, _lt, _lte, _neq, _like, _null, _notnull).
 *
 * @example parseFilterString('codcliente:CLI001,fecha_gte:2026-01-01')
 * // { codcliente: 'CLI001', fecha_gte: '2026-01-01' }
 *
 * @param filter texto del filtro.
 * @throws Error si un segmento no tiene el formato esperado.
 */
export function parseFilterString(filter: unknown): Record<string, string> {
    const result: Record<string, string> = {};
    if (typeof filter !== 'string' || filter.trim() === '') return result;

    for (const part of filter.split(',')) {
        const segment = part.trim();
        if (segment === '') continue;
        const pos = segment.indexOf(':');
        const field = (pos === -1 ? segment : segment.slice(0, pos)).trim();
        const value = pos === -1 ? '' : segment.slice(pos + 1).trim();
        if (!FIELD_NAME.test(field)) {
            throw new Error(`Filtro no válido: «${segment}». Usa «campo:valor» separados por comas.`);
        }
        // _null y _notnull no llevan valor
        if (value === '' && !/_(null|notnull)$/.test(field)) {
            throw new Error(`Filtro sin valor: «${segment}». Usa «campo:valor».`);
        }
        result[field] = value === '' ? '1' : value;
    }
    return result;
}

/**
 * Convierte el parámetro `order` de las tools de listado en el orden de la API.
 * Formato: «campo:asc» o «campo:desc», varios separados por comas.
 *
 * @param order texto del orden.
 * @throws Error si un segmento no tiene el formato esperado.
 */
export function parseOrder(order: unknown): Record<string, string> {
    const result: Record<string, string> = {};
    if (typeof order !== 'string' || order.trim() === '') return result;

    for (const part of order.split(',')) {
        const segment = part.trim();
        if (segment === '') continue;
        const [field = '', direction = 'asc'] = segment.split(':').map((s) => s.trim());
        const dir = direction.toUpperCase();
        if (!FIELD_NAME.test(field) || (dir !== 'ASC' && dir !== 'DESC')) {
            throw new Error(`Orden no válido: «${segment}». Usa «campo:asc» o «campo:desc».`);
        }
        result[`sort[${field}]`] = dir;
    }
    return result;
}

/**
 * Lee todos los registros de un recurso con los filtros indicados, página a
 * página, hasta MAX_REPORT_RECORDS. `truncated` indica que había más.
 *
 * @param endpoint   recurso de la API (ej. '/servicioates').
 * @param params     filtros de la API.
 * @param connection conexión a usar.
 */
export async function fetchAll<T = Record<string, unknown>>(
    endpoint: string,
    params: Record<string, unknown>,
    connection: string | undefined,
): Promise<{ rows: T[]; truncated: boolean }> {
    const rows = await fetchAllPaginated<T>(endpoint, params, connection, { maxRecords: MAX_REPORT_RECORDS + 1 });
    const truncated = rows.length > MAX_REPORT_RECORDS;
    return { rows: truncated ? rows.slice(0, MAX_REPORT_RECORDS) : rows, truncated };
}

/**
 * Interpreta un booleano tal como puede llegar de la API o de la base de datos.
 *
 * @param value valor a interpretar.
 */
export function isTrue(value: unknown): boolean {
    return value === true || value === 1 || value === '1' || value === 't' || value === 'true';
}

/**
 * Convierte un valor numérico de la API en número; lo que no lo es cuenta como 0.
 *
 * @param value valor a convertir.
 */
export function num(value: unknown): number {
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
}

/**
 * Redondea un importe a dos decimales.
 *
 * @param value importe.
 */
export function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

/**
 * Fecha de la API (d-m-Y, d/m/Y o ISO, con hora opcional) en ISO YYYY-MM-DD, o
 * null si está vacía o no es una fecha.
 *
 * @param value fecha tal como la devuelve la API.
 */
export function isoDate(value: unknown): string | null {
    if (value === null || value === undefined || value === '') return null;
    const date = parseFsDate(value);
    return Number.isNaN(date.getTime()) ? null : toIsoDate(date);
}

/**
 * Fecha de hoy en ISO YYYY-MM-DD (hora local).
 */
export function todayIso(): string {
    return toIsoDate(new Date());
}

/**
 * Días naturales entre dos fechas ISO (b - a). Negativo si b es anterior.
 *
 * @param a fecha inicial YYYY-MM-DD.
 * @param b fecha final YYYY-MM-DD.
 */
export function daysBetween(a: string, b: string): number {
    const start = parseFsDate(a);
    const end = parseFsDate(b);
    return Math.round((end.getTime() - start.getTime()) / 86400000);
}

/**
 * Comprueba que un parámetro opcional de fecha tenga el formato YYYY-MM-DD.
 *
 * @param value valor recibido.
 * @param name  nombre del parámetro, para el mensaje de error.
 * @returns la fecha, o undefined si no se indicó.
 * @throws Error si el formato o la fecha no son válidos.
 */
export function optionalIsoDate(value: unknown, name: string): string | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value !== 'string' || !ISO_DATE.test(value) || isoDate(value) !== value) {
        throw new Error(`El parámetro ${name} debe ser una fecha válida en formato YYYY-MM-DD.`);
    }
    return value;
}

/**
 * Añade un importe o un contador a un grupo de un acumulador.
 *
 * @param map   acumulador por clave.
 * @param key   clave del grupo.
 * @param init  crea el grupo la primera vez.
 * @param apply modifica el grupo.
 */
export function accumulate<T>(map: Map<string, T>, key: string, init: () => T, apply: (group: T) => void): void {
    let group = map.get(key);
    if (group === undefined) {
        group = init();
        map.set(key, group);
    }
    apply(group);
}

/**
 * Clave de texto para agrupar: el valor o «(sin asignar)» si está vacío.
 *
 * @param value valor del campo.
 */
export function groupKey(value: unknown): string {
    return value === null || value === undefined || value === '' ? '(sin asignar)' : String(value);
}

/**
 * Lee un catálogo pequeño (estados, fases, prioridades...) y lo indexa por su
 * clave primaria. Devuelve un mapa vacío si falla, para que un informe no se
 * pierda por no poder poner nombre a los estados.
 *
 * @param endpoint   recurso de la API.
 * @param key        clave primaria.
 * @param connection conexión a usar.
 */
export async function fetchCatalog(
    endpoint: string,
    key: string,
    connection: string | undefined,
): Promise<Map<string, Record<string, unknown>>> {
    const map = new Map<string, Record<string, unknown>>();
    try {
        const { rows } = await fetchAll(endpoint, {}, connection);
        for (const row of rows) map.set(String(row[key]), row);
    } catch {
        // sin catálogo, el informe usa los identificadores
    }
    return map;
}

/**
 * Aplica una función asíncrona a cada elemento con un máximo de llamadas
 * simultáneas, conservando el orden. Sirve para leer registros sueltos por id
 * sin lanzar cientos de peticiones a la vez contra la instalación.
 *
 * @param items lista de elementos.
 * @param limit máximo de llamadas simultáneas.
 * @param fn    función a aplicar.
 */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let next = 0;
    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (next < items.length) {
            const index = next++;
            results[index] = await fn(items[index] as T);
        }
    });
    await Promise.all(workers);
    return results;
}

/**
 * Busca en un catálogo el registro cuyo nombre coincide con el texto indicado:
 * primero exacto (sin distinguir mayúsculas ni acentos) y, si no, el único que
 * lo contenga.
 *
 * @param rows  registros del catálogo.
 * @param field campo con el nombre.
 * @param text  nombre buscado.
 * @throws Error si no hay ninguno o hay varios candidatos.
 */
export function findByName<T extends Record<string, unknown>>(rows: T[], field: string, text: string): T {
    const normalize = (value: unknown): string =>
        String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
    const wanted = normalize(text);
    const exact = rows.filter((row) => normalize(row[field]) === wanted);
    if (exact.length === 1) return exact[0] as T;
    const partial = rows.filter((row) => normalize(row[field]).includes(wanted));
    if (exact.length === 0 && partial.length === 1) return partial[0] as T;

    const names = rows.map((row) => String(row[field])).join(', ');
    if (exact.length > 1 || partial.length > 1) {
        throw new Error(`«${text}» coincide con varios registros; indica el id. Disponibles: ${names}`);
    }
    throw new Error(`No hay ninguno llamado «${text}». Disponibles: ${names}`);
}

/** Hasta cuántos ids se leen uno a uno antes de leer el catálogo entero. */
const MAX_IDS_ONE_BY_ONE = 100;

/**
 * Lee los registros de una lista de ids y los indexa por su clave primaria. Con
 * pocos ids los lee uno a uno (con concurrencia limitada); con muchos, lee el
 * recurso completo. Los que fallan se omiten.
 *
 * @param endpoint   recurso de la API.
 * @param key        clave primaria.
 * @param ids        identificadores a leer.
 * @param connection conexión a usar.
 */
export async function fetchByIds(
    endpoint: string,
    key: string,
    ids: unknown[],
    connection: string | undefined,
): Promise<Map<string, Record<string, unknown>>> {
    const unique = [...new Set(ids.filter((id) => id !== null && id !== undefined && id !== '').map(String))];
    if (unique.length > MAX_IDS_ONE_BY_ONE) return fetchCatalog(endpoint, key, connection);

    const rows = await mapLimit(unique, 8, async (id) => {
        try {
            return await fsClient.get<Record<string, unknown>>(`${endpoint}/${pathId(id)}`, undefined, connection);
        } catch {
            return null;
        }
    });
    const map = new Map<string, Record<string, unknown>>();
    rows.forEach((row, i) => {
        if (row && typeof row === 'object' && !Array.isArray(row)) map.set(unique[i] as string, row);
    });
    return map;
}

/**
 * Conexión indicada en los argumentos de una tool, o undefined para la de por defecto.
 *
 * @param args argumentos de la llamada.
 */
export function connectionOf(args: Record<string, unknown>): string | undefined {
    return typeof args.connection === 'string' && args.connection !== '' ? args.connection : undefined;
}

/**
 * Lee un registro por id y devuelve null si el id está vacío, no existe o falla.
 *
 * @param endpoint   recurso de la API.
 * @param id         identificador.
 * @param connection conexión a usar.
 */
export async function getOrNull(
    endpoint: string,
    id: unknown,
    connection: string | undefined,
): Promise<Record<string, unknown> | null> {
    if (id === null || id === undefined || id === '') return null;
    try {
        const row = await fsClient.get<Record<string, unknown>>(`${endpoint}/${pathId(id)}`, undefined, connection);
        return row && typeof row === 'object' && !Array.isArray(row) ? row : null;
    } catch {
        return null;
    }
}
