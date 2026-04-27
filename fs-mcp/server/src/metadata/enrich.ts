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
import { getAllModelMetadata, getModelMetadata as registryGetMeta } from './registry.js';
import type { ColumnMetadata, ModelMetadata } from './types.js';

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
function resolveModelFromToolName(toolName: string): ModelMetadata | undefined {
    const match = toolName.match(/^(get|create|update|delete)_(.+)$/);
    if (!match) return undefined;
    const verb = match[1];
    const suffix = match[2];
    if (!suffix) return undefined;

    if (verb === 'create' || verb === 'update' || verb === 'delete') {
        return registryGetMeta(suffix);
    }

    // get_X: buscar por endpoint = "/X"
    const endpoint = `/${suffix}`;
    for (const meta of getAllModelMetadata()) {
        if (meta.endpoint === endpoint) return meta;
    }
    return undefined;
}

/**
 * Determina si una description existente es trivial (vacía o solo el nombre del campo).
 * Por ahora solo se considera trivial la cadena vacía o nula.
 */
function isTrivialDescription(desc: string | undefined): boolean {
    return desc === undefined || desc === null || desc.trim() === '';
}

interface MutableProperty {
    type?: string;
    description?: string;
    maxLength?: number;
    enum?: string[];
    [k: string]: unknown;
}

function enrichProperty(
    propName: string,
    prop: MutableProperty,
    column: ColumnMetadata,
    stats: EnrichStats,
): void {
    if (column.description && isTrivialDescription(prop.description)) {
        prop.description = column.description;
        stats.descriptionsAdded += 1;
    }

    if (
        prop.type === 'string' &&
        prop.maxLength === undefined &&
        column.maxLength !== undefined
    ) {
        prop.maxLength = column.maxLength;
        stats.maxLengthsAdded += 1;
    }

    if (
        column.enumValues &&
        column.enumValues.length > 0 &&
        prop.enum === undefined
    ) {
        prop.enum = [...column.enumValues];
        stats.enumsAdded += 1;
    }
    // Marcamos uso para evitar warnings cuando solo se pasa por logging futuro.
    void propName;
}

/**
 * Enriquece un tool individual con la metadata del modelo correspondiente,
 * si se puede resolver. Devuelve true si tocó algo.
 */
function enrichTool(tool: Tool, stats: EnrichStats): boolean {
    const meta = resolveModelFromToolName(tool.name);
    if (!meta) return false;

    const schema = tool.inputSchema as { properties?: Record<string, MutableProperty> };
    const properties = schema.properties;
    if (!properties) return false;

    const columnByName = new Map<string, ColumnMetadata>();
    for (const col of meta.columns) {
        columnByName.set(col.name, col);
    }

    let touched = false;
    for (const [propName, prop] of Object.entries(properties)) {
        if (propName === 'connection') continue; // parámetro del MCP, no del modelo
        const column = columnByName.get(propName);
        if (!column) continue;
        const before = JSON.stringify(prop);
        enrichProperty(propName, prop, column, stats);
        if (JSON.stringify(prop) !== before) touched = true;
    }
    return touched;
}

/**
 * Recorre todos los tools registrados y los enriquece in-place.
 * Devuelve estadísticas agregadas para logging.
 */
export function enrichAllTools(tools: Map<string, Tool>): EnrichStats {
    const stats: EnrichStats = {
        toolsProcessed: 0,
        toolsEnriched: 0,
        descriptionsAdded: 0,
        maxLengthsAdded: 0,
        enumsAdded: 0,
    };
    for (const tool of tools.values()) {
        stats.toolsProcessed += 1;
        if (enrichTool(tool, stats)) {
            stats.toolsEnriched += 1;
        }
    }
    return stats;
}

// Exports auxiliares para tests.
export const __test = {
    resolveModelFromToolName,
    isTrivialDescription,
    enrichTool,
};
