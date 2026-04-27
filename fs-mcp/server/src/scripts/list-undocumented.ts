/**
 * Lista las columnas de todos los modelos (core + privados) que no tienen
 * descripción asignada. Útil para detectar huecos de documentación.
 *
 * Uso:
 *   node dist/scripts/list-undocumented.js
 */

import { writeFile } from 'node:fs/promises';
import { bootstrapCoreMetadata, getAllModelMetadata } from '../metadata/registry.js';
import { loadLocalModules } from '../local-loader.js';

async function main(): Promise<void> {
    await bootstrapCoreMetadata();
    // Carga locales (registra sus modelos en el registry).
    const dummyTools = new Map();
    await loadLocalModules(dummyTools);

    const models = getAllModelMetadata();

    // Dump JSON con info de cada columna sin descripción, agrupado por modelo.
    // Útil para tener contexto completo al redactar overrides.
    const dump: Record<string, Array<Record<string, unknown>>> = {};
    for (const meta of models) {
        const undoc = meta.columns.filter((c) => !c.description || c.description.trim() === '');
        if (undoc.length === 0) continue;
        dump[`${meta.name} (${meta.table}, ${meta.source})`] = undoc.map((c) => {
            const out: Record<string, unknown> = {
                name: c.name,
                tsType: c.tsType,
                label: c.label,
            };
            if (c.maxLength !== undefined) out.maxLength = c.maxLength;
            if (c.isPrimaryKey) out.pk = true;
            if (c.isReadonly) out.readonly = true;
            if (c.isRequired) out.required = true;
            if (c.foreignKey) out.fk = `${c.foreignKey.table}.${c.foreignKey.column}`;
            if (c.enumValues) out.enum = c.enumValues;
            return out;
        });
    }
    await writeFile('/tmp/undocumented-dump.json', JSON.stringify(dump, null, 2), 'utf8');

    let totalCols = 0;
    let totalUndoc = 0;
    const reportLines: string[] = [];

    for (const meta of models) {
        const undoc = meta.columns.filter((c) => !c.description || c.description.trim() === '');
        totalCols += meta.columns.length;
        totalUndoc += undoc.length;
        if (undoc.length === 0) continue;
        reportLines.push(
            `\n=== ${meta.name} [${meta.source}] (${undoc.length}/${meta.columns.length} sin descripción) ===`,
        );
        for (const col of undoc) {
            const tags: string[] = [];
            if (col.isPrimaryKey) tags.push('PK');
            if (col.foreignKey) tags.push(`FK→${col.foreignKey.table}`);
            if (col.isReadonly) tags.push('RO');
            if (col.isRequired) tags.push('required');
            const tagStr = tags.length > 0 ? ` [${tags.join(', ')}]` : '';
            const enumStr = col.enumValues && col.enumValues.length > 0 ? ` enum=${col.enumValues.join('|')}` : '';
            reportLines.push(
                `  - ${col.name} (${col.tsType}${col.maxLength ? `(${col.maxLength})` : ''})${tagStr}${enumStr} — label="${col.label}"`,
            );
        }
    }

    console.log(`Modelos analizados: ${models.length}`);
    console.log(`Columnas totales: ${totalCols}`);
    console.log(`Columnas sin descripción: ${totalUndoc} (${((totalUndoc / totalCols) * 100).toFixed(1)}%)`);
    console.log(reportLines.join('\n'));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
