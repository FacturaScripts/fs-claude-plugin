/**
 * Handlers de MCP Resources para exponer la metadata de modelos de FacturaScripts.
 *
 * URIs soportadas:
 *   - fs-schema://models             → índice resumido de todos los modelos (JSON)
 *   - fs-schema://model/<name>       → metadata completa de un modelo (JSON)
 *   - fs-schema://model/<name>.md    → metadata completa en markdown (legible)
 *   - fs-schema://relations/<name>   → solo las relaciones del modelo (JSON)
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import {
    getAllModelMetadata,
    getModelMetadata as registryGetMeta,
} from '../metadata/registry.js';
import type { ColumnMetadata, ModelMetadata, Relation } from '../metadata/types.js';

const SCHEMA_SCHEME = 'fs-schema';

/**
 * Lista todos los resources disponibles. Se invoca al responder al
 * ListResourcesRequestSchema.
 */
export function listSchemaResources(): Resource[] {
    const resources: Resource[] = [
        {
            uri: `${SCHEMA_SCHEME}://models`,
            name: 'Índice de modelos de FacturaScripts',
            description: 'Lista resumida de los modelos con metadata disponible en el MCP.',
            mimeType: 'application/json',
        },
    ];

    for (const meta of getAllModelMetadata()) {
        const name = meta.name;
        resources.push({
            uri: `${SCHEMA_SCHEME}://model/${name}`,
            name: `Modelo ${name} (JSON)`,
            description: `Metadata completa del modelo ${name}: ${meta.description}`,
            mimeType: 'application/json',
        });
        resources.push({
            uri: `${SCHEMA_SCHEME}://model/${name}.md`,
            name: `Modelo ${name} (markdown)`,
            description: `Metadata del modelo ${name} en markdown legible.`,
            mimeType: 'text/markdown',
        });
        resources.push({
            uri: `${SCHEMA_SCHEME}://relations/${name}`,
            name: `Relaciones de ${name}`,
            description: `Solo las relaciones belongsTo/hasMany del modelo ${name}.`,
            mimeType: 'application/json',
        });
    }

    return resources;
}

/**
 * Lee un resource dado su URI. Devuelve null si el URI no corresponde a un
 * resource de schema (para que otros handlers lo puedan intentar).
 */
export function readSchemaResource(
    uri: string,
): { uri: string; mimeType: string; text: string } | null {
    if (!uri.startsWith(`${SCHEMA_SCHEME}://`)) return null;

    const path = uri.slice(SCHEMA_SCHEME.length + 3);

    if (path === 'models') {
        const index = getAllModelMetadata().map((m) => ({
            name: m.name,
            table: m.table,
            endpoint: m.endpoint,
            primaryKey: m.primaryKey,
            description: m.description,
            source: m.source,
            columnsCount: m.columns.length,
            relationsCount: m.relations.length,
        }));
        return {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({ models: index }, null, 2),
        };
    }

    const modelMatch = path.match(/^model\/([a-z_][a-z0-9_]*)(\.md)?$/);
    if (modelMatch && modelMatch[1]) {
        const name = modelMatch[1];
        const meta = registryGetMeta(name);
        if (!meta) {
            throw new Error(`Modelo desconocido: ${name}`);
        }
        if (modelMatch[2] === '.md') {
            return { uri, mimeType: 'text/markdown', text: renderMarkdown(meta) };
        }
        return {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(meta, null, 2),
        };
    }

    const relMatch = path.match(/^relations\/([a-z_][a-z0-9_]*)$/);
    if (relMatch && relMatch[1]) {
        const name = relMatch[1];
        const meta = registryGetMeta(name);
        if (!meta) {
            throw new Error(`Modelo desconocido: ${name}`);
        }
        return {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
                { model: name, table: meta.table, relations: meta.relations },
                null,
                2,
            ),
        };
    }

    throw new Error(`URI de schema no reconocida: ${uri}`);
}

// ───────────────────────────────────────────────────────────────────────────
// Renderizador markdown
// ───────────────────────────────────────────────────────────────────────────

export function renderMarkdown(meta: ModelMetadata): string {
    const lines: string[] = [];
    lines.push(`# Modelo \`${meta.name}\``);
    lines.push('');
    lines.push(meta.description);
    lines.push('');
    lines.push(`- **Tabla:** \`${meta.table}\``);
    lines.push(`- **Endpoint:** \`${meta.endpoint}\``);
    lines.push(`- **Clave primaria:** \`${meta.primaryKey}\``);
    lines.push(`- **Origen:** ${meta.source}`);
    if (meta.generatedFrom.facturascriptsCommit) {
        lines.push(`- **Generado desde commit:** \`${meta.generatedFrom.facturascriptsCommit}\``);
    }
    lines.push(`- **Generado el:** ${meta.generatedFrom.generatedAt}`);
    lines.push('');
    lines.push('## Columnas');
    lines.push('');
    lines.push('| Campo | Tipo | Requerido | Label | Descripción |');
    lines.push('|---|---|---|---|---|');
    for (const col of meta.columns) {
        lines.push(`| ${formatColumnName(col)} | ${formatColumnType(col)} | ${col.isRequired ? 'sí' : 'no'} | ${escapeMd(col.label)} | ${escapeMd(col.description ?? '')} |`);
    }

    const belongsTo = meta.relations.filter((r) => r.type === 'belongsTo');
    const hasMany = meta.relations.filter((r) => r.type === 'hasMany');

    if (belongsTo.length > 0) {
        lines.push('');
        lines.push('## Relaciones belongsTo');
        lines.push('');
        for (const r of belongsTo) {
            lines.push(`- \`${r.localColumn}\` → \`${r.targetTable}.${r.remoteColumn}\` (modelo: \`${r.targetModel}\`)`);
        }
    }

    if (hasMany.length > 0) {
        lines.push('');
        lines.push('## Relaciones hasMany');
        lines.push('');
        for (const r of hasMany) {
            lines.push(`- \`${r.targetTable}.${r.remoteColumn}\` → \`${r.localColumn}\` (modelo: \`${r.targetModel}\`)`);
        }
    }

    lines.push('');
    return lines.join('\n');
}

function formatColumnName(col: ColumnMetadata): string {
    const markers: string[] = [];
    if (col.isPrimaryKey) markers.push('PK');
    if (col.foreignKey) markers.push(`FK→${col.foreignKey.table}`);
    if (col.isReadonly) markers.push('RO');
    const suffix = markers.length > 0 ? ` _(${markers.join(', ')})_` : '';
    return `\`${col.name}\`${suffix}`;
}

function formatColumnType(col: ColumnMetadata): string {
    const base = col.tsType;
    const len = col.maxLength !== undefined ? `(${col.maxLength})` : '';
    const enumVals = col.enumValues && col.enumValues.length > 0 ? ` [${col.enumValues.join('|')}]` : '';
    return `${base}${len}${enumVals}`;
}

function escapeMd(text: string): string {
    return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

/**
 * Exporta un helper para que el tool `describe_model` reutilice la misma lógica.
 */
export function getModelMetadata(name: string): ModelMetadata | undefined {
    return registryGetMeta(name);
}

export function getRelations(name: string): Relation[] | undefined {
    return registryGetMeta(name)?.relations;
}
