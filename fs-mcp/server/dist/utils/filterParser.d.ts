/**
 * Filter parser utility for FacturaScripts API
 * Converts string filters to FacturaScripts REST API query parameters
 *
 * Filter format: "field:operator:value" separated by commas
 * Example: "codcliente:=:CLI001,fecha:>:2024-01-01"
 */
/**
 * Parses a filter string into FacturaScripts API query parameters
 *
 * @param filterStr - Filter string in format "field:operator:value,field:operator:value"
 * @returns Query parameters in FacturaScripts format
 *
 * @example
 * parseFilters("codcliente:=:CLI001,fecha:>:2024-01-01")
 * // Returns:
 * // {
 * //   "filter[0][field]": "codcliente",
 * //   "filter[0][op]": "=",
 * //   "filter[0][val]": "CLI001",
 * //   "filter[1][field]": "fecha",
 * //   "filter[1][op]": ">",
 * //   "filter[1][val]": "2024-01-01"
 * // }
 */
export declare function parseFilters(filterStr?: string): Record<string, string>;
/**
 * Builds complete query parameters for FacturaScripts API calls
 *
 * @param params - Parameters object with pagination, exercise code, and filters
 * @returns Flattened query parameters ready for API call
 *
 * @example
 * buildQueryParams({
 *   offset: 0,
 *   limit: 100,
 *   codejercicio: "2024",
 *   filters: "codcliente:=:CLI001"
 * })
 * // Returns:
 * // {
 * //   offset: 0,
 * //   limit: 100,
 * //   codejercicio: "2024",
 * //   "filter[0][field]": "codcliente",
 * //   "filter[0][op]": "=",
 * //   "filter[0][val]": "CLI001"
 * // }
 */
export declare function buildQueryParams(params: {
    offset?: number;
    limit?: number;
    codejercicio?: string;
    filters?: string;
    [key: string]: unknown;
}): Record<string, string | number>;
/**
 * Convierte un objeto de parámetros plano en la sintaxis de query que espera la API REST
 * de FacturaScripts.
 *
 * La API solo lee los filtros bajo la clave `filter[...]` (ver APIModel::listAll). Los
 * parámetros sueltos (ej. `?idfactura=741`) se ignoran en silencio. Esta función envuelve
 * cada campo de filtro como `filter[campo]=valor`, respetando:
 *
 * - Claves reservadas (`offset`, `limit`, `sort`, `operation`): se pasan tal cual.
 * - Claves que ya vienen en notación de corchetes (`filter[`, `operation[`, `sort[`):
 *   se pasan verbatim, permitiendo operadores u operaciones lógicas explícitas.
 * - Resto de claves: se envuelven como `filter[clave]`.
 *
 * Los valores `null`/`undefined` se omiten. Los booleanos se convierten a `'1'`/`'0'`
 * (coherente con el envío de formularios en el cliente).
 *
 * @example
 * toApiQueryParams({ idfactura: 741, codcliente: 'CLI001', limit: 50 })
 * // { 'filter[idfactura]': '741', 'filter[codcliente]': 'CLI001', limit: '50' }
 */
export declare function toApiQueryParams(params?: Record<string, unknown>): Record<string, string>;
//# sourceMappingURL=filterParser.d.ts.map