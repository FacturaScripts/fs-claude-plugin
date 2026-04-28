/**
 * Helpers de paginación para la API REST de FacturaScripts.
 * Permiten recorrer recursos completos sin asumir un límite fijo de resultados.
 */
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
export declare function fetchAllPaginated<T>(resource: string, params?: Record<string, unknown>, connection?: string, options?: {
    pageSize?: number;
    maxRecords?: number;
}): Promise<T[]>;
//# sourceMappingURL=paginate.d.ts.map