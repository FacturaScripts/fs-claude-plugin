/**
 * Helpers de paginación para la API REST de FacturaScripts.
 * Permiten recorrer recursos completos sin asumir un límite fijo de resultados.
 */

import { fsClient } from '../fs/client.js';

const DEFAULT_PAGE_SIZE = 200;
const SAFETY_WARNING_THRESHOLD = 50000;

/**
 * Recorre todas las páginas de un recurso de la API REST y devuelve la lista completa.
 *
 * Itera con offset incremental hasta que la API devuelve menos registros que el tamaño
 * de página solicitado (señal de fin del recurso). El parámetro `limit` que se pase en
 * `params` se ignora: el helper toma el control de la paginación.
 *
 * @param resource     ruta del recurso (ej. '/facturaclientes', '/reciboclientes').
 * @param params       filtros adicionales para la API (no incluyas `offset` ni `limit`).
 * @param connection   clave de la conexión a usar (opcional, usa la default si se omite).
 * @param options      opciones de paginación.
 *                     - pageSize: tamaño de cada página (default 200).
 *                     - maxRecords: corte de seguridad opcional. Si se alcanza, se devuelve
 *                       lo acumulado hasta ese punto.
 */
export async function fetchAllPaginated<T>(
    resource: string,
    params: Record<string, unknown> = {},
    connection?: string,
    options: { pageSize?: number; maxRecords?: number } = {}
): Promise<T[]> {
    const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
    const maxRecords = options.maxRecords;

    const baseParams: Record<string, unknown> = { ...params };
    delete baseParams.offset;
    delete baseParams.limit;

    const results: T[] = [];
    let offset = 0;
    let warned = false;

    while (true) {
        const page = await fsClient.get<T[]>(
            resource,
            { ...baseParams, offset, limit: pageSize },
            connection
        );

        if (!Array.isArray(page) || page.length === 0) {
            break;
        }

        results.push(...page);

        if (!warned && results.length >= SAFETY_WARNING_THRESHOLD) {
            warned = true;
            // eslint-disable-next-line no-console
            console.warn(
                `[fetchAllPaginated] ${resource} ha superado ${SAFETY_WARNING_THRESHOLD} registros (` +
                `actual: ${results.length}). Revisa si el filtrado puede ser más estricto.`
            );
        }

        if (maxRecords !== undefined && results.length >= maxRecords) {
            return results.slice(0, maxRecords);
        }

        if (page.length < pageSize) {
            break;
        }

        offset += pageSize;
    }

    return results;
}

/**
 * Devuelve el conjunto de `idfactura` de las facturas de un ejercicio.
 *
 * Los modelos de líneas (`/lineafacturaclientes`, `/lineafacturaproveedores`) NO tienen
 * columna `codejercicio`, por lo que no se pueden filtrar por ejercicio directamente en la
 * API. Este helper obtiene los ids de factura del ejercicio desde la cabecera (que sí tiene
 * la columna) para poder filtrar las líneas en memoria por `idfactura`.
 *
 * @param resourceFacturas recurso de cabeceras (ej. '/facturaclientes', '/facturaproveedores').
 * @param codejercicio     código de ejercicio a filtrar.
 * @param connection       clave de la conexión a usar (opcional).
 */
export async function idsFacturasPorEjercicio(
    resourceFacturas: string,
    codejercicio: string,
    connection?: string
): Promise<Set<number>> {
    const facturas = await fetchAllPaginated<{ idfactura: number }>(
        resourceFacturas,
        { codejercicio },
        connection
    );

    const ids = new Set<number>();
    for (const factura of facturas) {
        if (factura.idfactura !== undefined && factura.idfactura !== null) {
            ids.add(factura.idfactura);
        }
    }
    return ids;
}
