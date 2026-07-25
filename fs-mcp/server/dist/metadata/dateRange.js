/**
 * Filtros de rango de fecha para las tools `get_*`.
 *
 * La API REST de FacturaScripts ya soporta operadores por sufijo en la clave del
 * filtro (`APIModel::getWhereValues`): `filter[fecha_gte]` -> `>=`,
 * `filter[fecha_lte]` -> `<=`, y los combina con AND. Y `toApiQueryParams` envuelve
 * cualquier clave suelta como `filter[clave]`. Por tanto basta con que la tool
 * acepte `<columna>_gte` / `<columna>_lte` y los reenvíe tal cual: el filtrado
 * ocurre en el servidor, sin traerse todo y filtrar en memoria.
 *
 * El sufijo como convención ya se usaba en el código (`descripcion_like`,
 * `nombre_like`) y es el mismo que exponen los módulos privados en su filtro
 * genérico, así que no se introduce un dialecto nuevo.
 *
 * IMPORTANTE — una sola fuente de verdad: `dateColumnsForTool()` decide qué
 * columnas admiten rango, y la usan TANTO la inyección en el inputSchema
 * (`addDateRangeParams`) COMO el reenvío en los handlers (`dateRangeFilters`).
 * Si cada lado aplicara su propio criterio, podrían divergir y la tool anunciaría
 * un parámetro que el handler descarta en silencio, que es justo el fallo que
 * este módulo evita.
 */
import { resolveModelFromToolName } from './enrich.js';
/** Sufijos de operador que se exponen por cada columna de fecha. */
const SUFIJOS = [
    { sufijo: '_gte', texto: 'desde (incluida)' },
    { sufijo: '_lte', texto: 'hasta (incluida)' },
];
/**
 * Columnas de fecha/hora del modelo que hay detrás de una tool `get_*`.
 * Devuelve [] si la tool no resuelve a un modelo o el modelo no tiene fechas.
 */
export function dateColumnsForTool(toolName) {
    if (!toolName.startsWith('get_'))
        return [];
    const meta = resolveModelFromToolName(toolName);
    if (!meta)
        return [];
    return meta.columns
        .filter((c) => c.tsType === 'date' || c.tsType === 'datetime')
        .map((c) => c.name);
}
/**
 * Extrae de los argumentos de una llamada los filtros de rango aplicables, para
 * que el handler los reenvíe a la API. Solo deja pasar los pares
 * `<columna>_gte` / `<columna>_lte` cuya columna sea realmente de fecha en el
 * modelo de esa tool: así un parámetro inventado no viaja a la API para que ésta
 * lo descarte en silencio.
 */
export function dateRangeFilters(toolName, args) {
    const out = {};
    if (!args)
        return out;
    const columnas = dateColumnsForTool(toolName);
    if (columnas.length === 0)
        return out;
    for (const columna of columnas) {
        for (const { sufijo } of SUFIJOS) {
            const clave = `${columna}${sufijo}`;
            const valor = args[clave];
            if (valor === undefined || valor === null || valor === '')
                continue;
            out[clave] = String(valor);
        }
    }
    return out;
}
/**
 * Añade a cada tool `get_*` los parámetros de rango de sus columnas de fecha.
 * Se ejecuta al arrancar, después del enriquecido de metadata. No pisa un
 * parámetro que ya exista (algún módulo podría declararlo a mano).
 *
 * `soloEstas` acota a qué tools se les inyecta, y es IMPRESCINDIBLE pasarlo con
 * las tools del core: los módulos privados (`plugins-mcp-private`) también
 * registran sus modelos en el registry, así que sus `get_*` resolverían columnas
 * de fecha, pero sus handlers son genéricos (`makeCrudModule`) y solo leen el
 * parámetro `filter`, de modo que descartarían `<columna>_gte` sin avisar. Esos
 * ya ofrecen rangos por su propio DSL: `filter: "fecha_gte:2024-01-01,..."`.
 */
export function addDateRangeParams(tools, soloEstas) {
    let añadidos = 0;
    for (const tool of tools.values()) {
        if (soloEstas && !soloEstas.has(tool.name))
            continue;
        const columnas = dateColumnsForTool(tool.name);
        if (columnas.length === 0)
            continue;
        const schema = tool.inputSchema;
        if (!schema.properties)
            continue;
        for (const columna of columnas) {
            for (const { sufijo, texto } of SUFIJOS) {
                const clave = `${columna}${sufijo}`;
                if (schema.properties[clave] !== undefined)
                    continue;
                schema.properties[clave] = {
                    type: 'string',
                    description: `Filtrar por ${columna} ${texto}, en formato YYYY-MM-DD`,
                };
                añadidos += 1;
            }
        }
    }
    return añadidos;
}
//# sourceMappingURL=dateRange.js.map