/**
 * Enriquecimiento automático de los inputSchema de los tools del MCP a partir
 * de la metadata generada de los modelos.
 *
 * Aplica de forma conservadora:
 *   - Si una propiedad del inputSchema NO tiene `description`, le pone la del metadata.
 *   - Si una propiedad de tipo string NO tiene `maxLength`, le pone la del metadata.
 *   - Si la columna del metadata tiene enumValues, añade `enum` (incluso si ya hay description).
 *
 * Nunca sobrescribe descripciones existentes. La intención es que las
 * descripciones hardcoded en los módulos sigan siendo válidas y la metadata
 * solo cubra los huecos. En una fase posterior se podría migrar a metadata
 * como única fuente, pero ese cambio es disruptivo y queda fuera de alcance.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ModelMetadata } from './types.js';
interface EnrichStats {
    toolsProcessed: number;
    toolsEnriched: number;
    descriptionsAdded: number;
    maxLengthsAdded: number;
    enumsAdded: number;
}
/**
 * Resuelve el modelo asociado a un tool por su nombre.
 *
 * Convenciones del MCP:
 *   - create_X / update_X / delete_X → X es snake_case singular del modelo.
 *   - get_X → X es el endpoint REST sin barra (suele ser plural concatenado).
 */
declare function resolveModelFromToolName(toolName: string): ModelMetadata | undefined;
/**
 * Determina si una description existente es trivial (vacía o solo el nombre del campo).
 * Por ahora solo se considera trivial la cadena vacía o nula.
 */
declare function isTrivialDescription(desc: string | undefined): boolean;
/**
 * Enriquece un tool individual con la metadata del modelo correspondiente,
 * si se puede resolver. Devuelve true si tocó algo.
 */
declare function enrichTool(tool: Tool, stats: EnrichStats): boolean;
/**
 * Recorre todos los tools registrados y los enriquece in-place.
 * Devuelve estadísticas agregadas para logging.
 */
export declare function enrichAllTools(tools: Map<string, Tool>): EnrichStats;
export declare const __test: {
    resolveModelFromToolName: typeof resolveModelFromToolName;
    isTrivialDescription: typeof isTrivialDescription;
    enrichTool: typeof enrichTool;
};
export {};
//# sourceMappingURL=enrich.d.ts.map