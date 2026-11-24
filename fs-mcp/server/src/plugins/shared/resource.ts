/**
 * Fábrica de tools CRUD para los modelos de los plugins oficiales.
 *
 * Cada modelo se declara con un `ResourceDef`: qué campos se pueden escribir,
 * por cuáles se filtra el listado y los nombres y descripciones de sus tools.
 * Los tipos y las descripciones de cada campo salen de la metadata del modelo,
 * así que el esquema de las tools no puede divergir de la tabla.
 *
 * Genera hasta cuatro tools por modelo:
 *   - listado (get_*): paginado, con filtros por campo, búsqueda «contiene»,
 *     filtro genérico, orden y los rangos de fecha que añade el servidor.
 *   - alta (create_*), modificación (update_*) y borrado (delete_*).
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fsClient } from '../../fs/client.js';
import { dateRangeFilters } from '../../metadata/dateRange.js';
import type { ColumnMetadata, ModelMetadata } from '../../metadata/types.js';
import { pathId } from '../../utils/pathId.js';
import type { ToolArgs, ToolResult } from '../types.js';
import { parseFilterString, parseOrder } from './query.js';
import { fail, ok } from './result.js';

/** Descripción del parámetro de conexión, común a todas las tools. */
export const CONNECTION_PROPERTY = {
    type: 'string',
    description: 'Clave de la conexión a usar (opcional: usa la conexión por defecto)',
} as const;

/** Tamaño de página por defecto de los listados. */
const DEFAULT_LIMIT = 50;

/**
 * Declaración de un modelo de un plugin oficial y de sus tools CRUD.
 */
export interface ResourceDef {
    /** Nombre del plugin de FacturaScripts, para los mensajes de error. */
    plugin: string;
    /** Metadata del modelo. */
    meta: ModelMetadata;
    /** Campos que se pueden enviar al crear o modificar. */
    fields: string[];
    /** Descripciones que sustituyen a las de la metadata en las tools de escritura. */
    fieldDescriptions?: Record<string, string>;
    /** Listado. */
    list?: {
        tool: string;
        description: string;
        /** Campos por los que se filtra por igualdad. */
        filters: string[];
        /** Campos de texto con búsqueda «contiene» (parámetro <campo>_like). */
        like?: string[];
        /** Orden si no se indica otro, en formato «campo:asc». */
        defaultOrder?: string;
    };
    /** Alta. */
    create?: {
        tool: string;
        description: string;
        required?: string[];
        /** Valores que se envían si no se indican (columnas NOT NULL sin default en la tabla). */
        defaults?: Record<string, string | number | boolean>;
    };
    /** Modificación. */
    update?: { tool: string; description: string };
    /** Borrado. */
    delete?: { tool: string; description: string };
}

type JsonType = 'string' | 'number' | 'boolean';

/**
 * Tipo JSON Schema de una columna según su tipo lógico.
 *
 * @param column metadata de la columna.
 */
function jsonType(column: ColumnMetadata | undefined): JsonType {
    if (column?.tsType === 'number') return 'number';
    if (column?.tsType === 'boolean') return 'boolean';
    return 'string';
}

/**
 * Descripción de una columna para el esquema de una tool.
 *
 * @param column metadata de la columna.
 * @param name   nombre del campo, por si la columna no está en la metadata.
 */
function columnDescription(column: ColumnMetadata | undefined, name: string): string {
    const base = column?.description ?? column?.label ?? name;
    if (column?.tsType === 'date') return `${base} (YYYY-MM-DD)`;
    if (column?.tsType === 'time') return `${base} (HH:MM:SS)`;
    return base;
}

/**
 * Busca la metadata de una columna del modelo.
 *
 * @param meta modelo.
 * @param name columna.
 */
function columnOf(meta: ModelMetadata, name: string): ColumnMetadata | undefined {
    return meta.columns.find((c) => c.name === name);
}

/**
 * Propiedades del esquema para los campos indicados.
 *
 * @param def          modelo.
 * @param names        campos.
 * @param descriptions descripciones propias, que ganan a las de la metadata.
 */
function fieldProperties(def: ResourceDef, names: string[], descriptions: Record<string, string> = {}): Record<string, object> {
    const properties: Record<string, object> = {};
    for (const name of names) {
        const column = columnOf(def.meta, name);
        properties[name] = {
            type: jsonType(column),
            description: descriptions[name] ?? columnDescription(column, name),
        };
    }
    return properties;
}

/**
 * Tipo de la clave primaria del modelo.
 *
 * @param def modelo.
 */
function primaryKeyType(def: ResourceDef): JsonType {
    return jsonType(columnOf(def.meta, def.meta.primaryKey));
}

/**
 * Construye las tools CRUD declaradas para un modelo.
 *
 * @param def modelo.
 */
export function buildResourceTools(def: ResourceDef): Tool[] {
    const tools: Tool[] = [];
    const pk = def.meta.primaryKey;
    const writable = def.fields.filter((f) => f !== pk);

    if (def.list) {
        const likeProps: Record<string, object> = {};
        for (const name of def.list.like ?? []) {
            likeProps[`${name}_like`] = {
                type: 'string',
                description: `Buscar registros cuyo ${name} contenga este texto (sin distinguir mayúsculas)`,
            };
        }
        tools.push({
            name: def.list.tool,
            description: def.list.description,
            inputSchema: {
                type: 'object',
                properties: {
                    connection: CONNECTION_PROPERTY,
                    limit: { type: 'number', description: `Número máximo de registros (por defecto ${DEFAULT_LIMIT})` },
                    offset: { type: 'number', description: 'Registros a saltar, para paginar (por defecto 0)' },
                    ...fieldProperties(def, def.list.filters),
                    ...likeProps,
                    filter: {
                        type: 'string',
                        description:
                            'Filtros adicionales «campo:valor» separados por comas. El campo admite los sufijos ' +
                            '_gt, _gte, _lt, _lte, _neq, _like, _null y _notnull. Ej.: "neto_gt:100,asignado_null:1"',
                    },
                    order: {
                        type: 'string',
                        description: `Orden «campo:asc» o «campo:desc», varios separados por comas` +
                            (def.list.defaultOrder ? ` (por defecto ${def.list.defaultOrder})` : ''),
                    },
                },
                required: [],
            },
        });
    }

    if (def.create) {
        tools.push({
            name: def.create.tool,
            description: def.create.description,
            inputSchema: {
                type: 'object',
                properties: {
                    connection: CONNECTION_PROPERTY,
                    ...fieldProperties(def, writable, def.fieldDescriptions),
                },
                required: def.create.required ?? [],
            },
        });
    }

    if (def.update) {
        tools.push({
            name: def.update.tool,
            description: def.update.description,
            inputSchema: {
                type: 'object',
                properties: {
                    connection: CONNECTION_PROPERTY,
                    [pk]: { type: primaryKeyType(def), description: `Identificador (${pk}) del registro a modificar` },
                    ...fieldProperties(def, writable, def.fieldDescriptions),
                    clear_fields: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Campos a vaciar (dejar sin valor), por ejemplo ["asignado"]',
                    },
                },
                required: [pk],
            },
        });
    }

    if (def.delete) {
        tools.push({
            name: def.delete.tool,
            description: def.delete.description,
            inputSchema: {
                type: 'object',
                properties: {
                    connection: CONNECTION_PROPERTY,
                    [pk]: { type: primaryKeyType(def), description: `Identificador (${pk}) del registro a eliminar` },
                },
                required: [pk],
            },
        });
    }

    return tools;
}

/**
 * Modelo de la metadata detrás de cada tool CRUD del modelo, para el
 * enriquecido de esquemas y los rangos de fecha del listado.
 *
 * @param def modelo.
 */
export function resourceToolModels(def: ResourceDef): Record<string, string> {
    const map: Record<string, string> = {};
    for (const tool of [def.list?.tool, def.create?.tool, def.update?.tool, def.delete?.tool]) {
        if (tool) map[tool] = def.meta.name;
    }
    return map;
}

/**
 * Valores de los campos escribibles presentes en los argumentos.
 *
 * @param def  modelo.
 * @param args argumentos de la llamada.
 */
function pickFields(def: ResourceDef, args: ToolArgs): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    for (const name of def.fields) {
        if (name === def.meta.primaryKey) continue;
        if (args[name] !== undefined && args[name] !== null) data[name] = args[name];
    }
    return data;
}

/**
 * Parámetros de la API para el listado de un modelo a partir de los argumentos.
 * La usan las tools de listado y los informes que filtran igual.
 *
 * @param def  modelo.
 * @param tool nombre de la tool de listado (para los rangos de fecha).
 * @param args argumentos de la llamada.
 */
export function listParams(def: ResourceDef, tool: string, args: ToolArgs): Record<string, unknown> {
    const params: Record<string, unknown> = {};
    for (const name of def.list?.filters ?? []) {
        if (args[name] !== undefined && args[name] !== null && args[name] !== '') params[name] = args[name];
    }
    for (const name of def.list?.like ?? []) {
        const value = args[`${name}_like`];
        if (typeof value === 'string' && value !== '') params[`${name}_like`] = value;
    }
    Object.assign(params, parseFilterString(args.filter), dateRangeFilters(tool, args));
    return params;
}

/**
 * Ejecuta una tool CRUD del modelo. Devuelve null si la tool no es suya.
 *
 * @param def  modelo.
 * @param name nombre de la tool.
 * @param args argumentos de la llamada.
 */
export async function handleResourceTool(def: ResourceDef, name: string, args: ToolArgs): Promise<ToolResult | null> {
    const connection = typeof args.connection === 'string' && args.connection !== '' ? args.connection : undefined;
    const endpoint = def.meta.endpoint;
    const pk = def.meta.primaryKey;

    if (name === def.list?.tool) {
        const limit = typeof args.limit === 'number' && args.limit > 0 ? args.limit : DEFAULT_LIMIT;
        const offset = typeof args.offset === 'number' && args.offset > 0 ? args.offset : 0;
        const order = parseOrder(args.order ?? def.list.defaultOrder);
        const params = { ...listParams(def, name, args), ...order, limit, offset };
        return ok(await fsClient.get(endpoint, params, connection));
    }

    if (name === def.create?.tool) {
        const data = pickFields(def, args);
        if (Object.keys(data).length === 0) {
            return fail(`${name}: indica al menos un campo del registro.`);
        }
        return ok(await fsClient.post(endpoint, { ...def.create.defaults, ...data }, connection));
    }

    if (name === def.update?.tool) {
        const id = pathId(args[pk]);
        const data = pickFields(def, args);
        const clear = Array.isArray(args.clear_fields) ? args.clear_fields : [];
        for (const field of clear) {
            if (typeof field !== 'string' || !def.fields.includes(field) || field === pk) {
                return fail(`${name}: no se puede vaciar el campo «${String(field)}».`);
            }
            // la API asigna null al recibir el texto «null»
            data[field] = 'null';
        }
        if (Object.keys(data).length === 0) {
            return fail(`${name}: indica al menos un campo a modificar.`);
        }
        return ok(await fsClient.put(`${endpoint}/${id}`, data, connection));
    }

    if (name === def.delete?.tool) {
        const id = pathId(args[pk]);
        return ok(await fsClient.delete(`${endpoint}/${id}`, connection));
    }

    return null;
}
