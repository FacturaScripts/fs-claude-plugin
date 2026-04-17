/**
 * Filter parser utility for FacturaScripts API
 * Converts string filters to FacturaScripts REST API query parameters
 *
 * Filter format: "field:operator:value" separated by commas
 * Example: "codcliente:=:CLI001,fecha:>:2024-01-01"
 */
/**
 * Validates if a string is a valid filter operator
 */
function isValidOperator(op) {
    const validOps = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IS NULL', 'IS NOT NULL'];
    return validOps.includes(op);
}
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
export function parseFilters(filterStr) {
    const result = {};
    if (!filterStr || filterStr.trim() === '') {
        return result;
    }
    const filterSegments = filterStr.split(',').map(f => f.trim()).filter(f => f.length > 0);
    let filterIndex = 0;
    for (const segment of filterSegments) {
        // Split by colon, but handle IS NULL and IS NOT NULL
        const parts = segment.split(':');
        if (parts.length < 2) {
            console.warn(`Invalid filter segment: "${segment}" - skipping`);
            continue;
        }
        const field = parts[0]?.trim();
        const op = parts[1]?.trim().toUpperCase() ?? '';
        if (!field || !op) {
            console.warn(`Invalid filter segment: "${segment}" - skipping`);
            continue;
        }
        // Handle operators that don't require a value (IS NULL, IS NOT NULL)
        if (op === 'IS NULL' || op === 'IS NOT NULL') {
            result[`filter[${filterIndex}][field]`] = field;
            result[`filter[${filterIndex}][op]`] = op;
            filterIndex++;
            continue;
        }
        // For other operators, require a value
        if (parts.length < 3) {
            console.warn(`Invalid filter segment: "${segment}" - operator "${op}" requires a value - skipping`);
            continue;
        }
        if (!isValidOperator(op)) {
            console.warn(`Invalid operator: "${op}" - skipping filter segment`);
            continue;
        }
        const val = parts.slice(2).join(':').trim(); // Re-join in case value contains colons
        result[`filter[${filterIndex}][field]`] = field;
        result[`filter[${filterIndex}][op]`] = op;
        result[`filter[${filterIndex}][val]`] = val;
        filterIndex++;
    }
    return result;
}
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
export function buildQueryParams(params) {
    const result = {};
    // Add pagination parameters
    if (params.offset !== undefined) {
        result.offset = params.offset;
    }
    if (params.limit !== undefined) {
        result.limit = params.limit;
    }
    // Add exercise code if provided
    if (params.codejercicio !== undefined) {
        result.codejercicio = params.codejercicio;
    }
    // Parse and add filters
    if (params.filters !== undefined) {
        const parsedFilters = parseFilters(params.filters);
        Object.assign(result, parsedFilters);
    }
    // Add any additional custom parameters (exclude known params)
    const knownParams = new Set(['offset', 'limit', 'codejercicio', 'filters']);
    for (const [key, value] of Object.entries(params)) {
        if (!knownParams.has(key) && value !== undefined && value !== null) {
            result[key] = value;
        }
    }
    return result;
}
//# sourceMappingURL=filterParser.js.map