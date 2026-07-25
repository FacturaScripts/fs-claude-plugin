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
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
/**
 * Columnas de fecha/hora del modelo que hay detrás de una tool `get_*`.
 * Devuelve [] si la tool no resuelve a un modelo o el modelo no tiene fechas.
 */
export declare function dateColumnsForTool(toolName: string): string[];
/**
 * Extrae de los argumentos de una llamada los filtros de rango aplicables, para
 * que el handler los reenvíe a la API. Solo deja pasar los pares
 * `<columna>_gte` / `<columna>_lte` cuya columna sea realmente de fecha en el
 * modelo de esa tool: así un parámetro inventado no viaja a la API para que ésta
 * lo descarte en silencio.
 */
export declare function dateRangeFilters(toolName: string, args: Record<string, unknown> | undefined): Record<string, string>;
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
export declare function addDateRangeParams(tools: Map<string, Tool>, soloEstas?: ReadonlySet<string>): number;
//# sourceMappingURL=dateRange.d.ts.map